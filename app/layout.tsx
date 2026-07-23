import type { Metadata } from "next";
import { Nunito, Quicksand } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin", "vietnamese"], weight: ["400", "600", "700", "800"], variable: "--font-body", display: "swap" });
const quicksand = Quicksand({ subsets: ["latin", "vietnamese"], weight: ["500", "600", "700"], variable: "--font-head", display: "swap" });

export const metadata: Metadata = {
  title: "SpeakUp Kids — Học tiếng Anh như một chuyến phiêu lưu",
  description:
    "Học – Luyện tập – Phiêu lưu: tiếng Anh có lộ trình cho trẻ 9–12 tuổi cùng Maple.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${nunito.variable} ${quicksand.variable}`}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦫</text></svg>"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
