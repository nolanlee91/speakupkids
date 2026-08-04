-- SpeakUp Kids · Migration bảo mật 2026-08-03
-- Chạy 1 lần trong Supabase → SQL Editor → Run. An toàn chạy lại nhiều lần (idempotent).
--
-- Gồm 3 phần (đã đối chiếu với server: 9 bảng + child_state.version + codes.redeemed_at ĐÃ có sẵn):
--   A. Mục 10 schema.sql chưa từng chạy — cột phân cấp đại lý + % hoa hồng
--   B. Siết policy bảng parents — chặn user tự đổi email nhận báo cáo tuần
--   C. redeem_code chống race — 1 mã không đổi được 2 lần

-- ══════════════════════════════════════════════════════════════
-- A. Đại lý 2 cấp + hoa hồng (mục 10 schema.sql — server đang THIẾU 2 cột này,
--    nên tab "Đại lý & mã" ở /admin chưa tạo được đại lý cấp 2)
-- ══════════════════════════════════════════════════════════════
alter table public.agents add column if not exists parent_id uuid references public.agents(id) on delete set null;
alter table public.agents add column if not exists commission_pct int not null default 20
  check (commission_pct between 0 and 100);
create index if not exists agents_parent_idx on public.agents(parent_id);

-- ══════════════════════════════════════════════════════════════
-- B. parents: chính chủ chỉ ĐỌC + sửa (name, weekly_email)
--    Trước đây policy `for all` cho user tự UPDATE cột email của mình → đổi thành
--    địa chỉ người khác + đặt tên bé là thẻ HTML là biến báo cáo tuần thành thư
--    phishing gửi từ no-reply@speakupkids.net (ký DKIM bằng domain thật).
--    RLS không giới hạn được theo CỘT → dùng thêm column-level grant.
-- ══════════════════════════════════════════════════════════════
drop policy if exists parents_self on public.parents;
drop policy if exists parents_self_read on public.parents;
drop policy if exists parents_self_update on public.parents;

create policy parents_self_read on public.parents
  for select using (id = auth.uid());
create policy parents_self_update on public.parents
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Thu hồi mọi quyền ghi, chỉ cấp lại UPDATE đúng 2 cột an toàn.
-- (service_role KHÔNG bị ảnh hưởng → Edge Function báo cáo tuần vẫn chạy bình thường.)
revoke insert, update, delete on public.parents from anon, authenticated;
grant update (name, weekly_email) on public.parents to authenticated;

-- ══════════════════════════════════════════════════════════════
-- C. redeem_code: khóa dòng mã trong transaction + không cho mã "hồi sinh"
--    - FOR UPDATE: 2 người đổi cùng 1 mã song song → người sau thấy 'used'
--      (trước đây cả hai cùng đọc redeemed_by IS NULL → cấp gói cho cả 2 tài khoản).
--    - Kiểm thêm redeemed_at: redeemed_by là FK on delete set null, xóa tài khoản
--      đã đổi mã sẽ làm nó về NULL và mã dùng lại được vô hạn.
-- ══════════════════════════════════════════════════════════════
create or replace function public.redeem_code(p_code text)
returns text language plpgsql security definer set search_path = public as $$
declare
  c record;
  cur_plan text;
begin
  if auth.uid() is null then return 'unauthenticated'; end if;
  select * into c from public.codes where code = upper(trim(p_code)) for update;
  if not found then return 'invalid'; end if;
  if c.redeemed_by is not null or c.redeemed_at is not null then return 'used'; end if;
  select plan into cur_plan from public.entitlements where parent_id = auth.uid();
  if cur_plan is not null then
    if cur_plan = 'family' or c.plan = cur_plan then return 'already'; end if;
    -- còn lại đúng một trường hợp: đang pro, mã family → nâng cấp
    update public.entitlements
      set plan = c.plan, order_ref = 'code:' || c.code, purchased_at = now()
      where parent_id = auth.uid();
  else
    insert into public.entitlements (parent_id, plan, order_ref)
    values (auth.uid(), c.plan, 'code:' || c.code);
  end if;
  update public.codes set redeemed_by = auth.uid(), redeemed_at = now() where code = c.code;
  return 'ok:' || c.plan;
end; $$;

-- ══════════════════════════════════════════════════════════════
-- KIỂM TRA SAU KHI CHẠY (mong đợi: 2 cột agents, 2 policy parents, 0 quyền ghi thừa)
-- ══════════════════════════════════════════════════════════════
select 'A. cot agents' as buoc, string_agg(column_name, ', ') as ket_qua
  from information_schema.columns
 where table_schema = 'public' and table_name = 'agents' and column_name in ('parent_id', 'commission_pct')
union all
select 'B. policy parents', string_agg(policyname, ', ')
  from pg_policies where schemaname = 'public' and tablename = 'parents'
union all
select 'B. quyen ghi parents cua authenticated', coalesce(string_agg(distinct privilege_type || coalesce('(' || column_name || ')', ''), ', '), 'KHONG CO (dung)')
  from information_schema.column_privileges
 where table_schema = 'public' and table_name = 'parents' and grantee = 'authenticated'
   and privilege_type in ('INSERT', 'UPDATE', 'DELETE')
union all
select 'C. redeem_code co FOR UPDATE', case when prosrc like '%for update%' then 'CO (dung)' else 'CHUA - chay lai phan C' end
  from pg_proc where proname = 'redeem_code';
