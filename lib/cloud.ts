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
// Chưa mua / offline / lỗi mạng → "free" (không nổ, không chặn app).
export async function fetchMembership(): Promise<Membership> {
  if (!supabase) return "free";
  try {
    const { data, error } = await supabase.from("entitlements").select("plan").maybeSingle();
    if (error || !data) return "free";
    return data.plan === "family" ? "family" : data.plan === "pro" ? "pro" : "free";
  } catch {
    return "free";
  }
}

/* ═══════════ Hồ sơ con ═══════════ */
export async function listChildren(): Promise<ChildProfile[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("children")
    .select("id, ingame_name, avatar, age")
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

/* ═══════════ Đồng bộ tiến độ (AppState) ═══════════ */
export async function pullState(childId: string): Promise<AppState | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("child_state")
    .select("state")
    .eq("child_id", childId)
    .maybeSingle();
  if (error) throw error;
  return (data?.state as AppState) ?? null;
}
export async function pushState(childId: string, state: AppState) {
  if (!supabase) return;
  const { error } = await supabase
    .from("child_state")
    .upsert({ child_id: childId, state }, { onConflict: "child_id" });
  if (error) throw error;
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
export function syncSave(state: AppState) {
  saveState(state);
  const id = getActiveChildId();
  if (supabase && id) {
    // fire-and-forget; lỗi mạng không làm hỏng trải nghiệm chơi
    pushState(id, state).catch(() => {});
  }
}
