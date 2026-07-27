// Client Supabase (chạy phía trình duyệt). Đọc key từ biến môi trường NEXT_PUBLIC_*.
// Nếu CHƯA cấu hình key → client = null → app vẫn chạy offline bằng localStorage như cũ.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anon
    ? createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } })
    : null;

// Đã cấu hình cloud chưa? (dùng để bật/tắt màn đăng nhập)
export const cloudEnabled = (): boolean => supabase !== null;
