// API cho trang quản trị /admin. Toàn bộ quyền thật nằm ở RLS phía Supabase
// (policy is_admin()) — người thường có đăng nhập vào /admin cũng không đọc/ghi được gì.
import { supabase } from "./supabase";

export type AdminParent = { id: string; email: string; name: string | null; created_at: string };
export type AdminChild = { id: string; parent_id: string; ingame_name: string; avatar: string; age: number };
export type AdminEntitlement = { parent_id: string; plan: "pro" | "family"; purchased_at: string; order_ref: string | null };
export type AdminAgent = { id: string; name: string; phone: string | null; note: string | null; created_at: string };
export type AdminCode = {
  code: string; plan: "pro" | "family"; agent_id: string | null; note: string | null;
  created_at: string; redeemed_by: string | null; redeemed_at: string | null;
};
export type AdminGift = { id: string; child_id: string; coins: number; cash: number; note: string | null; created_at: string; claimed_at: string | null };

function need() {
  if (!supabase) throw new Error("Cloud chưa được cấu hình.");
  return supabase;
}

// Tài khoản đang đăng nhập có phải admin không (đọc dòng của chính mình trong admins).
export async function isAdminUser(): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase.from("admins").select("user_id").maybeSingle();
  return !error && !!data;
}

/* ═══════════ Tài khoản & gói ═══════════ */
export async function listParents(): Promise<AdminParent[]> {
  const { data, error } = await need().from("parents").select("id, email, name, created_at").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AdminParent[];
}
export async function listAllChildren(): Promise<AdminChild[]> {
  const { data, error } = await need().from("children").select("id, parent_id, ingame_name, avatar, age");
  if (error) throw error;
  return (data ?? []) as AdminChild[];
}
export async function listEntitlements(): Promise<AdminEntitlement[]> {
  const { data, error } = await need().from("entitlements").select("parent_id, plan, purchased_at, order_ref");
  if (error) throw error;
  return (data ?? []) as AdminEntitlement[];
}
// Cấp gói tay từ admin (ghi đè nếu đã có) — order_ref đánh dấu nguồn "admin".
export async function grantPlan(parentId: string, plan: "pro" | "family") {
  const { error } = await need().from("entitlements")
    .upsert({ parent_id: parentId, plan, order_ref: "admin" }, { onConflict: "parent_id" });
  if (error) throw error;
}
export async function revokePlan(parentId: string) {
  const { error } = await need().from("entitlements").delete().eq("parent_id", parentId);
  if (error) throw error;
}

/* ═══════════ Đại lý & mã kích hoạt ═══════════ */
export async function listAgents(): Promise<AdminAgent[]> {
  const { data, error } = await need().from("agents").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AdminAgent[];
}
export async function createAgent(name: string, phone?: string, note?: string): Promise<AdminAgent> {
  const { data, error } = await need().from("agents")
    .insert({ name, phone: phone || null, note: note || null }).select("*").single();
  if (error) throw error;
  return data as AdminAgent;
}
export async function listCodes(): Promise<AdminCode[]> {
  const { data, error } = await need().from("codes").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AdminCode[];
}

// Sinh mã dạng SPK-XXXX-XXXX (bỏ ký tự dễ nhầm 0/O/1/I) rồi insert.
// Trùng mã (xác suất cực thấp) → Postgres báo lỗi PK, thử lại là xong.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function randomCode(): string {
  const buf = new Uint8Array(8);
  crypto.getRandomValues(buf);
  const s = Array.from(buf, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `SPK-${s.slice(0, 4)}-${s.slice(4)}`;
}
export async function generateCodes(agentId: string | null, plan: "pro" | "family", count: number): Promise<string[]> {
  const rows = Array.from({ length: Math.max(1, Math.min(100, count)) }, () => ({
    code: randomCode(), plan, agent_id: agentId, note: null,
  }));
  const { error } = await need().from("codes").insert(rows);
  if (error) throw error;
  return rows.map((r) => r.code);
}

/* ═══════════ Email báo cáo tuần (gọi Edge Function bằng JWT admin) ═══════════ */
export type ReportResult = {
  ok?: boolean; week_start?: string; sent?: number; skipped?: number;
  preview?: { to: string; kids: string }[]; error?: string;
};
// dry=true: chỉ xem danh sách sẽ gửi, không gửi thật. only: gửi thật cho 1 email.
export async function runWeeklyReport(opts: { dry?: boolean; only?: string }): Promise<ReportResult> {
  const { data, error } = await need().functions.invoke("weekly-report", {
    body: { dry: !!opts.dry, only: opts.only || null },
  });
  if (error) throw error;
  return data as ReportResult;
}

/* ═══════════ Quà tặng Coins/Cash ═══════════ */
export async function sendGift(childId: string, coins: number, cash: number, note?: string) {
  const { error } = await need().from("gifts")
    .insert({ child_id: childId, coins: Math.max(0, coins), cash: Math.max(0, cash), note: note || null });
  if (error) throw error;
}
export async function listGifts(): Promise<AdminGift[]> {
  const { data, error } = await need().from("gifts").select("*").order("created_at", { ascending: false }).limit(50);
  if (error) throw error;
  return (data ?? []) as AdminGift[];
}
