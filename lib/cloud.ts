// Lớp đồng bộ cloud cho SpeakUp Kids (Phase 1).
// Tài khoản ba mẹ (Supabase Auth) → nhiều hồ sơ con → tiến độ (AppState) lưu ở child_state.
// Thiết kế "an toàn khi chưa cấu hình": mọi hàm không nổ nếu supabase=null; app chạy offline như cũ.
import { supabase } from "./supabase";
import { loadState, saveState, defaultState, normalizeState, type AppState, type Membership } from "./state";

export type ChildProfile = { id: string; ingame_name: string; avatar: string; age: number };

// Ghi nhớ con đang chọn (client-side) để biết đồng bộ vào hồ sơ nào.
const ACTIVE_KEY = "speakup_active_child";
export function getActiveChildId(): string | null {
  return typeof window === "undefined" ? null : localStorage.getItem(ACTIVE_KEY);
}
export function setActiveChildId(id: string) {
  if (typeof window !== "undefined") localStorage.setItem(ACTIVE_KEY, id);
}
export function clearActiveChild() {
  if (typeof window !== "undefined") localStorage.removeItem(ACTIVE_KEY);
}

/* ═══════════ Auth ═══════════ */
export async function signUp(email: string, password: string, name: string) {
  if (!supabase) throw new Error("Cloud chưa được cấu hình.");
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
  if (error) throw error;
  return data.user;
}
export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error("Cloud chưa được cấu hình.");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}
export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
  clearActiveChild();
}
export async function currentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}
export async function sendPasswordReset(email: string) {
  if (!supabase) throw new Error("Cloud chưa được cấu hình.");
  // redirectTo: đưa liên kết đặt lại về đúng app (kèm token recovery ở hash) → mở màn đặt mật khẩu mới.
  const redirectTo = typeof window !== "undefined" ? window.location.origin + window.location.pathname : undefined;
  const { error } = await supabase.auth.resetPasswordForEmail(email, redirectTo ? { redirectTo } : undefined);
  if (error) throw error;
}
// Đặt mật khẩu mới sau khi vào từ liên kết recovery (session tạm đã sẵn nhờ token ở URL).
export async function updatePassword(newPassword: string) {
  if (!supabase) throw new Error("Cloud chưa được cấu hình.");
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

/* ═══════════ Gói thành viên (entitlements — lifetime) ═══════════ */
// Đọc gói từ bảng entitlements (nguồn chuẩn phía server, client không ghi được).
// Phân biệt 2 trường hợp: server XÁC NHẬN chưa mua → "free"; KHÔNG HỎI ĐƯỢC server
// (offline/lỗi mạng) → null để giữ nguyên cache — khách đã trả tiền mở app lúc mạng
// chập chờn không bị hạ về Free giữa buổi học.
export async function fetchMembership(): Promise<Membership | null> {
  if (!supabase) return null;
  try {
    // Lọc tường minh theo user hiện tại: tài khoản ADMIN có quyền đọc mọi dòng
    // (policy entitlements_admin) nên nếu chỉ dựa vào RLS sẽ dính gói của người khác.
    const user = await currentUser();
    if (!user) return null;                    // getUser là network call — fail thì đừng kết luận gì
    const { data, error } = await supabase.from("entitlements").select("plan").eq("parent_id", user.id).maybeSingle();
    if (error) return null;
    if (!data) return "free";                  // server trả rõ: không có entitlement
    return data.plan === "family" ? "family" : data.plan === "pro" ? "pro" : "free";
  } catch {
    return null;
  }
}

// Đổi mã kích hoạt (đại lý bán). Trả kết quả từ RPC redeem_code:
// 'ok:pro' | 'ok:family' | 'invalid' | 'used' | 'already' | 'unauthenticated' | 'error'
export async function redeemCode(code: string): Promise<string> {
  if (!supabase) return "error";
  try {
    const { data, error } = await supabase.rpc("redeem_code", { p_code: code });
    if (error) return "error";
    return typeof data === "string" ? data : "error";
  } catch {
    return "error";
  }
}

// Nhận quà Maple Coins/Cash admin tặng cho bé (nếu có). Ghi qua RPC claim_gifts:
// server đánh dấu đã nhận và trả về đúng tổng CLAIM ĐƯỢC trong lần gọi này, nên mở 2 tab
// cũng không cộng đúp. Lỗi/offline/chưa chạy migration → {0,0}: quà nằm chờ, không mất.
export async function claimGifts(childId: string): Promise<{ coins: number; cash: number }> {
  if (!supabase || !childId) return { coins: 0, cash: 0 };
  try {
    const { data, error } = await supabase.rpc("claim_gifts", { p_child: childId });
    if (error) return { coins: 0, cash: 0 };
    const row = (Array.isArray(data) ? data[0] : data) as { coins?: number; cash?: number } | null;
    return { coins: row?.coins || 0, cash: row?.cash || 0 };
  } catch {
    return { coins: 0, cash: 0 };
  }
}

/* ═══════════ Báo cáo tuần (parents.weekly_email) ═══════════ */
export async function getWeeklyEmailPref(): Promise<boolean> {
  if (!supabase) return true;
  try {
    const user = await currentUser();
    if (!user) return true;
    const { data } = await supabase.from("parents").select("weekly_email").eq("id", user.id).maybeSingle();
    return data?.weekly_email ?? true;
  } catch {
    return true;
  }
}
export async function setWeeklyEmailPref(on: boolean) {
  if (!supabase) return;
  const user = await currentUser();
  if (!user) return;
  await supabase.from("parents").update({ weekly_email: on }).eq("id", user.id);
}

/* ═══════════ Hồ sơ con ═══════════ */
export async function listChildren(): Promise<ChildProfile[]> {
  if (!supabase) return [];
  // Lọc tường minh "con CỦA TÔI": tài khoản admin đọc được children của mọi nhà
  // (policy children_admin_read cho trang /admin) — không lọc thì app hiện cả bé người khác.
  const user = await currentUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("children")
    .select("id, ingame_name, avatar, age")
    .eq("parent_id", user.id)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ChildProfile[];
}
export async function createChild(p: { ingame_name: string; avatar?: string; age?: number }): Promise<ChildProfile> {
  if (!supabase) throw new Error("Cloud chưa được cấu hình.");
  const user = await currentUser();
  if (!user) throw new Error("Chưa đăng nhập.");
  const { data, error } = await supabase
    .from("children")
    .insert({ parent_id: user.id, ingame_name: p.ingame_name, avatar: p.avatar ?? "🦊", age: p.age ?? 10 })
    .select("id, ingame_name, avatar, age")
    .single();
  if (error) throw error;
  return data as ChildProfile;
}

/* ═══════════ Đồng bộ tiến độ (AppState) — có chống ghi đè ═══════════ */
// Mỗi bản ghi child_state có cột `version`; ghi qua RPC push_child_state chỉ thành công
// khi version phía client khớp server (optimistic concurrency). Thiết bị cầm bản CŨ
// push sẽ bị từ chối thay vì đè mất tiến độ mới của thiết bị khác.
const verKey = (childId: string) => `speakup_ver_${childId}`;
function getVer(childId: string): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(verKey(childId)) || "0", 10) || 0;
}
function setVer(childId: string, v: number) {
  if (typeof window !== "undefined") localStorage.setItem(verKey(childId), String(v));
}

// App (page.tsx) đăng ký để nhận state mới khi thua xung đột — React cần setState theo.
let remoteAdoptedCb: ((s: AppState) => void) | null = null;
export function onRemoteStateAdopted(cb: (s: AppState) => void) { remoteAdoptedCb = cb; }

// Điểm "tiến độ" thô để phân xử xung đột: bản nào bé làm được nhiều hơn thì thắng.
// Phải đếm CẢ hoạt động Clubhouse (mua đồ, đổi trang phục, nhận thú cưng): những việc này
// không tạo ra bài học/câu mới nào, nên nếu chỉ đếm học tập thì máy vừa mua đồ sẽ hòa điểm
// với máy cầm bản cũ → nhánh "hòa thì local thắng" đè mất toàn bộ giao dịch của bé.
function progressScore(s: AppState): number {
  const lessons = Object.values(s.learn?.lessons || {}).filter((l) => l?.done).length;
  const seen = Object.values(s.games?.topics || {}).reduce((a, t) => a + (t?.seen?.length || 0), 0);
  const adv = Object.values(s.adventure?.seasons || {}).reduce((a, p) => a + (p?.completedChapterIds?.length || 0), 0);
  const c = s.clubhouse;
  const club = (c?.rewardedKeys?.length || 0)
    + (c?.purchasedItemIds?.length || 0)
    + (c?.ownedOutfitIds?.length || 0)
    + (c?.unlockedItemIds?.length || 0)
    + (c?.pet?.kind ? 1 : 0);
  return lessons * 10 + adv * 5 + seen + club;
}

export async function pullState(childId: string): Promise<AppState | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("child_state")
    .select("state, version")
    .eq("child_id", childId)
    .maybeSingle();
  if (error) throw error;
  if (data) setVer(childId, (data as { version?: number }).version || 0);
  return (data?.state as AppState) ?? null;
}

// Ghi có kiểm tra version. Trả version mới (>=0) hoặc -1 nếu thua xung đột.
// Fallback: schema chưa có RPC (chưa chạy SQL mới) → upsert kiểu cũ để không gãy sync.
async function pushVersioned(childId: string, state: AppState, base: number): Promise<number> {
  const { data, error } = await supabase!.rpc("push_child_state", {
    p_child: childId, p_state: state, p_base: base,
  });
  if (error) {
    if (/push_child_state/.test(error.message || "")) {   // function chưa tồn tại
      await supabase!.from("child_state").upsert({ child_id: childId, state }, { onConflict: "child_id" });
      return base;
    }
    throw error;
  }
  return typeof data === "number" ? data : -1;
}

export async function pushState(childId: string, state: AppState) {
  if (!supabase) return;
  const v = await pushVersioned(childId, state, getVer(childId));
  if (v >= 0) { setVer(childId, v); return; }

  // Thua xung đột: máy khác đã ghi bản mới hơn. Kéo bản server về để phân xử.
  const remote = await pullState(childId);              // đồng thời cập nhật version mới
  if (remote && progressScore(remote) > progressScore(state)) {
    // Server nhiều tiến độ hơn → nhận bản server, báo app cập nhật màn hình.
    const normalized = normalizeState(remote);
    saveState(normalized);
    remoteAdoptedCb?.(normalized);
    return;
  }
  // Bản local nhiều tiến độ hơn (hoặc ngang) → đẩy lại với version vừa kéo.
  const v2 = await pushVersioned(childId, state, getVer(childId));
  if (v2 >= 0) setVer(childId, v2);
}

// Chọn 1 con để chơi: kéo state cloud về máy; nếu con này CHƯA có state → khởi tạo MỚI (mặc định) rồi đẩy lên.
// Luôn nạp tên/avatar/tuổi từ hồ sơ đã đăng ký để màn Tài khoản hiển thị đúng (children là nguồn chuẩn).
export async function activateChild(child: ChildProfile): Promise<AppState> {
  setActiveChildId(child.id);
  const cloud = await pullState(child.id);
  if (cloud) {
    const normalized = normalizeState(cloud);
    const merged: AppState = {
      ...normalized,
      nickname: normalized.nickname || child.ingame_name,
      avatar: normalized.avatar || child.avatar,
      age: normalized.age || child.age,
    };
    saveState(merged);
    return merged;
  }
  const fresh: AppState = { ...defaultState(), nickname: child.ingame_name, avatar: child.avatar, age: child.age };
  saveState(fresh);
  await pushState(child.id, fresh);
  return fresh;
}

// Chuyển tiến độ ĐANG CÓ trên máy (localStorage) sang 1 hồ sơ con.
// Dùng 1 lần cho hồ sơ con ĐẦU TIÊN của người đã lỡ chơi offline trước khi có tài khoản.
export async function migrateLocalToChild(childId: string): Promise<AppState> {
  setActiveChildId(childId);
  const local = loadState();
  await pushState(childId, local);
  return local;
}

// Lưu tiến độ: ghi localStorage NGAY (nhanh, offline-first) + đẩy lên cloud cho con đang chọn (không chặn UI).
let cloudSaveTimer: ReturnType<typeof setTimeout> | null = null;
let queuedCloudState: AppState | null = null;
let queuedChildId: string | null = null;

export function syncSave(state: AppState) {
  saveState(state);
  const id = getActiveChildId();
  if (supabase && id) {
    queuedCloudState = state;
    queuedChildId = id;
    if (cloudSaveTimer) clearTimeout(cloudSaveTimer);
    cloudSaveTimer = setTimeout(flushCloudSave, 900);
  }
}

// Đẩy ngay phần đang chờ debounce (dùng khi đóng tab/ẩn app để không rơi lần ghi cuối).
function flushCloudSave() {
  const nextState = queuedCloudState;
  const nextChildId = queuedChildId;
  if (cloudSaveTimer) clearTimeout(cloudSaveTimer);
  cloudSaveTimer = null;
  queuedCloudState = null;
  queuedChildId = null;
  if (nextState && nextChildId) pushState(nextChildId, nextState).catch(() => {});
}

// Bé đóng tab / chuyển app trong vòng 900ms sau thao tác cuối → flush kẻo mất lần ghi đó.
// localStorage vẫn luôn có bản mới nhất nên cùng lắm chỉ chậm sync, không mất dữ liệu máy này.
if (typeof window !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushCloudSave();
  });
  window.addEventListener("pagehide", flushCloudSave);
}
