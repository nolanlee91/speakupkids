// Layout riêng cho /admin: chặn máy tìm kiếm index trang quản trị.
// Dữ liệu vẫn được bảo vệ bằng RLS is_admin() — noindex chỉ để URL không lộ trên Google.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpeakUp Kids · Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
