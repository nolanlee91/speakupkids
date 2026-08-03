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

-- parents: chỉ chính chủ
drop policy if exists parents_self on public.parents;
create policy parents_self on public.parents
  for all using (id = auth.uid()) with check (id = auth.uid());

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
-- 7. Tiện ích: tự cập nhật updated_at khi ghi child_state
-- ────────────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists child_state_touch on public.child_state;
create trigger child_state_touch
  before update on public.child_state
  for each row execute function public.touch_updated_at();
