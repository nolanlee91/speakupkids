import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpeakUp Kids — Học nói tiếng Anh qua Shadowing",
  description:
    "Ứng dụng tự học nghe–nói tiếng Anh qua video & Shadowing cho bé 9–12 tuổi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
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
