-- SpeakUp Kids · Schema Supabase (Phase 1: tài khoản + đồng bộ tiến độ)
-- Chạy 1 lần trong Supabase → SQL Editor. An toàn chạy lại (idempotent ở mức hợp lý).
--
-- Mô hình: 1 tài khoản ba mẹ (auth.users) → nhiều hồ sơ con (children) → tiến độ (child_state).
-- Bảo mật: RLS bật ở tất cả bảng, mỗi ba mẹ CHỈ đọc/ghi dữ liệu con mình.

-- ────────────────────────────────────────────────────────────
-- 1. parents: hồ sơ ba mẹ (nối 1-1 với auth.users) + tuỳ chọn nhận mail
-- ────────────────────────────────────────────────────────────
create table if not exists public.parents (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  name         text,
  weekly_email boolean not null default true,   -- có nhận báo cáo tuần không
  created_at   timestamptz not null default now()
);

-- Tự tạo dòng parents khi có user mới đăng ký
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.parents (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 2. children: hồ sơ từng con
-- ────────────────────────────────────────────────────────────
create table if not exists public.children (
  id           uuid primary key default gen_random_uuid(),
  parent_id    uuid not null references auth.users(id) on delete cascade,
  ingame_name  text not null,                   -- "tên in-game" của con
  avatar       text not null default '🦊',
  age          int  not null default 10,
  created_at   timestamptz not null default now()
);
create index if not exists children_parent_idx on public.children(parent_id);

-- ────────────────────────────────────────────────────────────
-- 3. child_state: tiến độ = nguyên object AppState (jsonb), đồng bộ mỗi lần save
-- ────────────────────────────────────────────────────────────
create table if not exists public.child_state (
  child_id     uuid primary key references public.children(id) on delete cascade,
  state        jsonb not null default '{}'::jsonb,
  updated_at   timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- 4. weekly_snapshots: chụp cuối mỗi tuần để so "tuần này vs tuần trước"
--    (Edge Function ghi vào; báo cáo diff từ đây)
-- ────────────────────────────────────────────────────────────
create table if not exists public.weekly_snapshots (
  id             uuid primary key default gen_random_uuid(),
  child_id       uuid not null references public.children(id) on delete cascade,
  week_start     date not null,                 -- thứ Hai đầu tuần
  lessons_done   int  not null default 0,
  sentences_done int  not null default 0,
  stars          int  not null default 0,
  practice_seen  int  not null default 0,
  topics         jsonb not null default '{}'::jsonb,  -- accuracy theo chủ đề
  created_at     timestamptz not null default now(),
  unique (child_id, week_start)
);
create index if not exists snapshots_child_idx on public.weekly_snapshots(child_id);

-- ────────────────────────────────────────────────────────────
-- 5. RLS: mỗi ba mẹ chỉ thấy dữ liệu của mình
-- ────────────────────────────────────────────────────────────
alter table public.parents         enable row level security;
alter table public.children        enable row level security;
alter table public.child_state     enable row level security;
alter table public.weekly_snapshots enable row level security;

-- parents: chính chủ chỉ ĐỌC + SỬA (name, weekly_email). KHÔNG cho client insert/delete
-- (dòng do trigger handle_new_user tạo) và KHÔNG cho sửa cột email: email là địa chỉ
-- nhận báo cáo tuần — để user tự đổi được thì kẻ xấu trỏ sang hộp thư người khác và
-- biến hệ thống email của mình thành máy gửi phishing ký tên domain thật.
drop policy if exists parents_self on public.parents;
drop policy if exists parents_self_read on public.parents;
drop policy if exists parents_self_update on public.parents;
create policy parents_self_read on public.parents
  for select using (id = auth.uid());
create policy parents_self_update on public.parents
  for update using (id = auth.uid()) with check (id = auth.uid());
-- RLS không giới hạn được THEO CỘT → dùng column-level grant: thu hồi mọi quyền ghi,
-- chỉ cấp lại UPDATE đúng 2 cột an toàn.
revoke insert, update, delete on public.parents from anon, authenticated;
grant update (name, weekly_email) on public.parents to authenticated;

-- children: parent_id = mình
drop policy if exists children_own on public.children;
create policy children_own on public.children
  for all using (parent_id = auth.uid()) with check (parent_id = auth.uid());

-- child_state: qua children.parent_id
drop policy if exists child_state_own on public.child_state;
create policy child_state_own on public.child_state
  for all using (
    exists (select 1 from public.children c where c.id = child_state.child_id and c.parent_id = auth.uid())
  ) with check (
    exists (select 1 from public.children c where c.id = child_state.child_id and c.parent_id = auth.uid())
  );

-- weekly_snapshots: ba mẹ CHỈ đọc (Edge Function dùng service role để ghi, bỏ qua RLS)
drop policy if exists snapshots_read on public.weekly_snapshots;
create policy snapshots_read on public.weekly_snapshots
  for select using (
    exists (select 1 from public.children c where c.id = weekly_snapshots.child_id and c.parent_id = auth.uid())
  );

-- ────────────────────────────────────────────────────────────
-- 6. entitlements: gói đã mua (LIFETIME — mua một lần, không hết hạn)
--    Nguồn chuẩn duy nhất về quyền Pro/Family. Client CHỈ ĐỌC;
--    ghi bằng service role (webhook thanh toán / dashboard), không có policy ghi cho client.
-- ────────────────────────────────────────────────────────────
create table if not exists public.entitlements (
  parent_id    uuid primary key references auth.users(id) on delete cascade,
  plan         text not null check (plan in ('pro', 'family')),
  purchased_at timestamptz not null default now(),
  order_ref    text,   -- mã đơn/nội dung chuyển khoản (đối soát PayOS/VietQR)
  note         text
);

alter table public.entitlements enable row level security;

-- Ba mẹ chỉ ĐỌC entitlement của chính mình. KHÔNG có policy insert/update/delete
-- → anon key không thể tự cấp Pro; chỉ service role (bỏ qua RLS) ghi được.
drop policy if exists entitlements_read on public.entitlements;
create policy entitlements_read on public.entitlements
  for select using (parent_id = auth.uid());

-- Giới hạn hồ sơ con kiểm tra Ở SERVER: Free/Pro tối đa 1 bé · Family tối đa 4 bé.
create or replace function public.enforce_child_limit()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  cur_plan text;
  max_children int;
  cnt int;
begin
  select plan into cur_plan from public.entitlements where parent_id = new.parent_id;
  max_children := case when cur_plan = 'family' then 4 else 1 end;
  select count(*) into cnt from public.children where parent_id = new.parent_id;
  if cnt >= max_children then
    raise exception 'CHILD_LIMIT: gói hiện tại chỉ cho phép % hồ sơ bé', max_children;
  end if;
  return new;
end; $$;

drop trigger if exists children_limit on public.children;
create trigger children_limit
  before insert on public.children
  for each row execute function public.enforce_child_limit();

-- ────────────────────────────────────────────────────────────
-- 7. QUẢN TRỊ: admins + đại lý + mã kích hoạt + quà tặng (trang /admin)
--    Bootstrap admin đầu tiên (chạy tay 1 lần, thay email của bạn):
--      insert into public.admins (user_id, note)
--      select id, 'chủ dự án' from auth.users where email = 'you@example.com';
-- ────────────────────────────────────────────────────────────
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  note       text,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- Người dùng chỉ đọc được DÒNG CỦA MÌNH (để app biết "tôi có phải admin không").
-- Không có policy ghi → thêm/bớt admin chỉ qua SQL Editor/service role.
drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins
  for select using (user_id = auth.uid());

-- Helper dùng trong policy: security definer nên bỏ qua RLS của admins.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

-- Đại lý bán hàng
create table if not exists public.agents (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text,
  note       text,
  created_at timestamptz not null default now()
);
alter table public.agents enable row level security;
drop policy if exists agents_admin on public.agents;
create policy agents_admin on public.agents
  for all using (public.is_admin()) with check (public.is_admin());

-- Mã kích hoạt (đại lý bán mã → phụ huynh nhập mã trong app → tự thành Pro/Family).
-- Doanh số đại lý = số mã đã redeemed theo agent_id.
create table if not exists public.codes (
  code        text primary key,               -- vd SPK-AB3D-9F2K (lưu UPPERCASE)
  plan        text not null check (plan in ('pro', 'family')),
  agent_id    uuid references public.agents(id) on delete set null,
  note        text,
  created_at  timestamptz not null default now(),
  redeemed_by uuid references auth.users(id) on delete set null,
  redeemed_at timestamptz
);
create index if not exists codes_agent_idx on public.codes(agent_id);
alter table public.codes enable row level security;
drop policy if exists codes_admin on public.codes;
create policy codes_admin on public.codes
  for all using (public.is_admin()) with check (public.is_admin());
-- Người dùng thường KHÔNG đọc được bảng codes — đổi mã chỉ qua RPC bên dưới.

-- RPC đổi mã kích hoạt: chạy với quyền owner (bỏ qua RLS) nhưng tự kiểm soát chặt.
-- Cho phép NÂNG CẤP pro → family bằng mã family (bán chênh 120k); chặn trùng/hạ gói.
-- Trả: 'ok:pro' | 'ok:family' | 'invalid' | 'used' | 'already' | 'unauthenticated'
create or replace function public.redeem_code(p_code text)
returns text language plpgsql security definer set search_path = public as $$
declare
  c record;
  cur_plan text;
begin
  if auth.uid() is null then return 'unauthenticated'; end if;
  -- FOR UPDATE: khóa dòng mã trong transaction — hai người đổi CÙNG một mã song song
  -- thì người sau phải chờ và thấy mã đã dùng, không còn cấp gói được 2 lần.
  select * into c from public.codes where code = upper(trim(p_code)) for update;
  if not found then return 'invalid'; end if;
  -- Kiểm cả redeemed_at: redeemed_by là FK on delete set null — tài khoản đã đổi mã
  -- bị xóa sẽ làm redeemed_by về NULL, không kiểm redeemed_at thì mã "hồi sinh" dùng lại được.
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

-- Quà tặng Maple Coins/Cash (admin tặng để test/chăm sóc; app tự nhận lần mở sau).
-- KHÔNG sửa trực tiếp child_state.jsonb để tránh ghi đè tiến độ đang chơi.
create table if not exists public.gifts (
  id         uuid primary key default gen_random_uuid(),
  child_id   uuid not null references public.children(id) on delete cascade,
  coins      int not null default 0 check (coins >= 0),
  cash       int not null default 0 check (cash >= 0),
  note       text,
  created_at timestamptz not null default now(),
  claimed_at timestamptz
);
create index if not exists gifts_child_idx on public.gifts(child_id);
alter table public.gifts enable row level security;
drop policy if exists gifts_admin on public.gifts;
create policy gifts_admin on public.gifts
  for all using (public.is_admin()) with check (public.is_admin());
-- Ba mẹ đọc + đánh dấu đã nhận quà của con mình (không tự tạo quà được).
drop policy if exists gifts_parent_read on public.gifts;
create policy gifts_parent_read on public.gifts
  for select using (
    exists (select 1 from public.children c where c.id = gifts.child_id and c.parent_id = auth.uid())
  );
drop policy if exists gifts_parent_claim on public.gifts;
create policy gifts_parent_claim on public.gifts
  for update using (
    exists (select 1 from public.children c where c.id = gifts.child_id and c.parent_id = auth.uid())
  ) with check (
    exists (select 1 from public.children c where c.id = gifts.child_id and c.parent_id = auth.uid())
  );

-- Admin xem được danh sách tài khoản/hồ sơ/gói (chỉ ĐỌC; cấp gói ghi qua entitlements).
drop policy if exists parents_admin_read on public.parents;
create policy parents_admin_read on public.parents
  for select using (public.is_admin());
drop policy if exists children_admin_read on public.children;
create policy children_admin_read on public.children
  for select using (public.is_admin());
drop policy if exists entitlements_admin on public.entitlements;
create policy entitlements_admin on public.entitlements
  for all using (public.is_admin()) with check (public.is_admin());

-- ────────────────────────────────────────────────────────────
-- 8. Chống ghi đè tiến độ (optimistic concurrency)
--    Mỗi bản ghi child_state mang `version`; client ghi qua RPC kèm version gốc.
--    Version lệch (máy khác đã ghi) → trả -1, KHÔNG ghi đè; client tự phân xử.
-- ────────────────────────────────────────────────────────────
alter table public.child_state add column if not exists version bigint not null default 0;

-- SECURITY INVOKER (mặc định): chạy dưới quyền người gọi → RLS child_state_own vẫn áp dụng,
-- ba mẹ chỉ ghi được state của con mình.
create or replace function public.push_child_state(p_child uuid, p_state jsonb, p_base bigint)
returns bigint language plpgsql as $$
declare
  newv bigint;
begin
  insert into public.child_state (child_id, state, version)
  values (p_child, p_state, 1)
  on conflict (child_id) do nothing;
  if found then return 1; end if;

  update public.child_state
     set state = p_state, version = version + 1
   where child_id = p_child and version = p_base
   returning version into newv;
  if newv is null then return -1; end if;   -- xung đột: bản khác đã ghi trước
  return newv;
end; $$;

-- ────────────────────────────────────────────────────────────
-- 9. Tiện ích: tự cập nhật updated_at khi ghi child_state
-- ────────────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists child_state_touch on public.child_state;
create trigger child_state_touch
  before update on public.child_state
  for each row execute function public.touch_updated_at();

-- ────────────────────────────────────────────────────────────
-- 10. Đại lý cấp bậc + hoa hồng (2026-08-03)
--     parent_id: đại lý cấp 2 trực thuộc một đại lý cấp 1 (null = cấp 1).
--     commission_pct: % hoa hồng ĐÃ DEAL cho đại lý này trên giá bán.
--     Hoa hồng cấp trên = phần CHÊNH LỆCH: cấp 1 deal 20%, cấp 2 deal 15%
--     → đơn của cấp 2: cấp 2 hưởng 15%, cấp 1 hưởng 5%. (Tính ở trang admin,
--     không lưu DB — đổi % là báo cáo tự tính lại.)
-- ────────────────────────────────────────────────────────────
alter table public.agents add column if not exists parent_id uuid references public.agents(id) on delete set null;
alter table public.agents add column if not exists commission_pct int not null default 20
  check (commission_pct between 0 and 100);
create index if not exists agents_parent_idx on public.agents(parent_id);
