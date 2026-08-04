-- SpeakUp Kids · Migration siết chặt (đợt 2) — 2026-08-03
-- Chạy trong Supabase → SQL Editor → Run. An toàn chạy lại nhiều lần.
-- Chạy SAU 2026-08-03-security.sql.
--
--   A. gifts: bỏ quyền UPDATE trực tiếp, đổi sang RPC claim_gifts
--   B. agents: chặn tự-làm-cấp-trên và cây sâu quá 2 cấp
--   C. enforce_child_limit: khóa theo tài khoản, hết lách bằng 2 request song song
--   D. parents.email: tự đồng bộ khi ba mẹ đổi email ở Auth
--   E. codes.is_upgrade: đánh dấu mã Family dùng để NÂNG CẤP (thực thu 120k, không phải 480k)

-- ══════════════════════════════════════════════════════════════
-- A. Nhận quà qua RPC thay vì UPDATE trực tiếp
--    Policy cũ cho UPDATE cả dòng, không giới hạn cột → ba mẹ tự đặt lại
--    claimed_at = null để nhận quà lặp vô hạn, hoặc sửa coins trước khi nhận.
-- ══════════════════════════════════════════════════════════════
drop policy if exists gifts_parent_claim on public.gifts;

create or replace function public.claim_gifts(p_child uuid)
returns table (coins int, cash int)
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return; end if;
  -- Chỉ nhận quà của con MÌNH (hàm security definer nên phải tự kiểm, RLS không đỡ hộ).
  if not exists (select 1 from public.children c where c.id = p_child and c.parent_id = auth.uid()) then
    return;
  end if;
  return query
    with claimed as (
      update public.gifts g set claimed_at = now()
       where g.child_id = p_child and g.claimed_at is null
      returning g.coins as c, g.cash as k
    )
    select coalesce(sum(claimed.c), 0)::int, coalesce(sum(claimed.k), 0)::int from claimed;
end; $$;

-- ══════════════════════════════════════════════════════════════
-- B. Cây đại lý đúng 2 cấp (báo cáo hoa hồng ở /admin chỉ hiểu 2 cấp —
--    đại lý cấp 3 hoặc dòng tự-làm-cha sẽ tàng hình, không ai được trả hoa hồng)
-- ══════════════════════════════════════════════════════════════
alter table public.agents drop constraint if exists agents_no_self_parent;
alter table public.agents add constraint agents_no_self_parent
  check (parent_id is null or parent_id <> id);

create or replace function public.enforce_agent_depth()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.parent_id is not null then
    if exists (select 1 from public.agents a where a.id = new.parent_id and a.parent_id is not null) then
      raise exception 'AGENT_DEPTH: cấp trên phải là đại lý cấp 1 (mô hình chỉ có 2 cấp)';
    end if;
    if exists (select 1 from public.agents a where a.parent_id = new.id) then
      raise exception 'AGENT_DEPTH: đại lý này đang có cấp dưới nên không thể thành cấp 2';
    end if;
  end if;
  return new;
end; $$;

drop trigger if exists agents_depth on public.agents;
create trigger agents_depth
  before insert or update of parent_id on public.agents
  for each row execute function public.enforce_agent_depth();

-- ══════════════════════════════════════════════════════════════
-- C. Giới hạn hồ sơ bé: khóa theo tài khoản trong transaction.
--    count(*) rồi insert mà không khóa → hai request song song cùng thấy cnt=0
--    và cùng chèn, thành 2 bé trên gói chỉ cho 1.
-- ══════════════════════════════════════════════════════════════
create or replace function public.enforce_child_limit()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  cur_plan text;
  max_children int;
  cnt int;
begin
  perform pg_advisory_xact_lock(hashtext(new.parent_id::text));
  select plan into cur_plan from public.entitlements where parent_id = new.parent_id;
  max_children := case when cur_plan = 'family' then 4 else 1 end;
  select count(*) into cnt from public.children where parent_id = new.parent_id;
  if cnt >= max_children then
    raise exception 'CHILD_LIMIT: gói hiện tại chỉ cho phép % hồ sơ bé', max_children;
  end if;
  return new;
end; $$;

-- ══════════════════════════════════════════════════════════════
-- D. Đổi email ở Auth → cập nhật luôn parents.email
--    Trigger cũ chỉ chạy lúc INSERT nên báo cáo tuần cứ gửi mãi về địa chỉ cũ.
-- ══════════════════════════════════════════════════════════════
create or replace function public.sync_parent_email()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.parents set email = new.email
   where id = new.id and email is distinct from new.email;
  return new;
end; $$;

drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row execute function public.sync_parent_email();

-- Đồng bộ một lần cho các tài khoản đã lỡ đổi email trước khi có trigger.
update public.parents p set email = u.email
  from auth.users u where u.id = p.id and p.email is distinct from u.email;

-- ══════════════════════════════════════════════════════════════
-- E. Đánh dấu mã Family dùng để NÂNG CẤP từ Pro
--    Mã nâng cấp chỉ thu thêm 120k nhưng báo cáo đang tính đủ mệnh giá 480k
--    → doanh thu phồng gấp 4 và trả dư hoa hồng cho mỗi đơn nâng cấp.
--    DB chỉ ghi nhận SỰ KIỆN; quy ra tiền vẫn nằm ở PLAN_VALUE trong app/admin.
-- ══════════════════════════════════════════════════════════════
alter table public.codes add column if not exists is_upgrade boolean not null default false;

create or replace function public.redeem_code(p_code text)
returns text language plpgsql security definer set search_path = public as $$
declare
  c record;
  cur_plan text;
  upgraded boolean := false;
begin
  if auth.uid() is null then return 'unauthenticated'; end if;
  select * into c from public.codes where code = upper(trim(p_code)) for update;
  if not found then return 'invalid'; end if;
  if c.redeemed_by is not null or c.redeemed_at is not null then return 'used'; end if;
  select plan into cur_plan from public.entitlements where parent_id = auth.uid();
  if cur_plan is not null then
    if cur_plan = 'family' or c.plan = cur_plan then return 'already'; end if;
    -- còn lại đúng một trường hợp: đang pro, mã family → nâng cấp (thu chênh lệch)
    update public.entitlements
      set plan = c.plan, order_ref = 'code:' || c.code, purchased_at = now()
      where parent_id = auth.uid();
    upgraded := true;
  else
    insert into public.entitlements (parent_id, plan, order_ref)
    values (auth.uid(), c.plan, 'code:' || c.code);
  end if;
  update public.codes
     set redeemed_by = auth.uid(), redeemed_at = now(), is_upgrade = upgraded
   where code = c.code;
  return 'ok:' || c.plan;
end; $$;

-- ══════════════════════════════════════════════════════════════
-- KIỂM TRA SAU KHI CHẠY
-- ══════════════════════════════════════════════════════════════
select 'A. RPC claim_gifts' as buoc,
       case when exists (select 1 from pg_proc where proname = 'claim_gifts') then 'CO (dung)' else 'THIEU' end as ket_qua
union all
select 'A. policy update gifts da go',
       case when exists (select 1 from pg_policies where tablename = 'gifts' and policyname = 'gifts_parent_claim')
            then 'VAN CON - chay lai phan A' else 'DA GO (dung)' end
union all
select 'B. rang buoc + trigger dai ly',
       coalesce((select string_agg(conname, ', ') from pg_constraint where conname = 'agents_no_self_parent'), 'THIEU')
       || ' / ' || coalesce((select string_agg(tgname, ', ') from pg_trigger where tgname = 'agents_depth'), 'THIEU trigger')
union all
select 'C. child_limit co khoa',
       case when (select prosrc from pg_proc where proname = 'enforce_child_limit') like '%advisory%' then 'CO (dung)' else 'CHUA' end
union all
select 'D. trigger dong bo email',
       coalesce((select string_agg(tgname, ', ') from pg_trigger where tgname = 'on_auth_user_email_changed'), 'THIEU')
union all
select 'E. cot codes.is_upgrade',
       coalesce((select string_agg(column_name, ', ') from information_schema.columns
                  where table_schema = 'public' and table_name = 'codes' and column_name = 'is_upgrade'), 'THIEU');
