import type { SVGProps } from "react";

export type AppIconName =
  | "home" | "learn" | "practice" | "adventure"
  | "phonics" | "everyday" | "story" | "opinion"
  | "words" | "sentence" | "listen" | "speak" | "check"
  | "lock" | "play" | "volume";

type IconProps = SVGProps<SVGSVGElement> & { name: AppIconName };

export function AppIcon({ name, className, ...props }: IconProps) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: ["app-icon", className].filter(Boolean).join(" "),
    ...props,
  };

  switch (name) {
    case "home":
      return <svg {...common}><path d="M3.5 10.7 12 3.8l8.5 6.9" /><path d="M5.7 9.6v10h12.6v-10M9.4 19.6v-5.8h5.2v5.8" /><path d="M18.2 4.2v3.2" /></svg>;
    case "learn":
      return <svg {...common}><path d="M4 5.2c2.8-.8 5.5-.2 8 1.7v13c-2.5-1.9-5.2-2.5-8-1.7z" /><path d="M20 5.2c-2.8-.8-5.5-.2-8 1.7v13c2.5-1.9 5.2-2.5 8-1.7z" /><path d="M7 9h2.4M14.6 9H17" /></svg>;
    case "practice":
      return <svg {...common}><path d="M7.2 8.1h9.6a4.5 4.5 0 0 1 4.3 5.9l-1 3.1a2.6 2.6 0 0 1-4.4 1l-1.6-1.8H9.9l-1.6 1.8a2.6 2.6 0 0 1-4.4-1l-1-3.1a4.5 4.5 0 0 1 4.3-5.9Z" /><path d="M7.5 11v4M5.5 13h4M16.6 11.7h.1M18.5 14h.1" /><path d="M9.5 8.1V5.8h5v2.3" /></svg>;
    case "adventure":
      return <svg {...common}><path d="m3.5 6 5-2 7 2 5-2v14l-5 2-7-2-5 2z" /><path d="M8.5 4v14M15.5 6v14" /><path d="M11.2 10.3c.7-1 2.4-1 3.1-.1.8 1-.1 2-1 2.5-.8.5-1.2 1-1.2 1.7M12.1 16.8h.1" /></svg>;
    case "phonics":
      return <svg {...common}><path d="M4.5 19 9 5h2l4.5 14M6.2 14h7.5" /><path d="M16.8 9.2c1.2-.9 3.1-.5 3.1 1.2 0 2.1-3.4 1.8-3.4 4.2 0 1.5 1.6 2 3.2 1.2" /></svg>;
    case "everyday":
      return <svg {...common}><path d="M4 20V8.5L12 4l8 4.5V20" /><path d="M8 20v-6h8v6M7.5 10h.1M12 10h.1M16.5 10h.1" /><path d="M3 20h18" /></svg>;
    case "story":
      return <svg {...common}><path d="M5 4.5h10.5A3.5 3.5 0 0 1 19 8v11.5H7.5A2.5 2.5 0 0 1 5 17z" /><path d="M7.5 15.5H19M9 8h6M9 11h4" /><path d="M5 17a2.5 2.5 0 0 1 2.5-2.5" /></svg>;
    case "opinion":
      return <svg {...common}><path d="M4 5.5h16v11H9l-5 4z" /><path d="M8 9h8M8 12.5h5" /><path d="M17.5 3v3M16 4.5h3" /></svg>;
    case "words":
      return <svg {...common}><path d="M5 19 9.5 5h2L16 19M6.8 14h7.4" /><path d="M17.5 8.5h2M18.5 7.5v2" /></svg>;
    case "sentence":
      return <svg {...common}><path d="M5 6h14M5 10h10M5 14h14M5 18h7" /><path d="M18 17.5h.1" /></svg>;
    case "listen":
      return <svg {...common}><path d="M4 13v-2a8 8 0 0 1 16 0v2" /><path d="M4 13h3v6H5.5A1.5 1.5 0 0 1 4 17.5zM20 13h-3v6h1.5a1.5 1.5 0 0 0 1.5-1.5z" /><path d="M17 19c-.7 1.2-1.8 1.7-3.5 1.7" /></svg>;
    case "speak":
      return <svg {...common}><rect x="8" y="3.5" width="8" height="12" rx="4" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6" /></svg>;
    case "check":
      return <svg {...common}><circle cx="12" cy="12" r="8.5" /><path d="m8.2 12.2 2.5 2.5 5.4-5.5" /></svg>;
    case "lock":
      return <svg {...common}><rect x="5.5" y="10" width="13" height="10" rx="2.2" /><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10M12 14v2" /></svg>;
    case "play":
      return <svg {...common}><path d="m9 6 9 6-9 6z" /></svg>;
    case "volume":
      return <svg {...common}><path d="M4 10h4l5-4v12l-5-4H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" /></svg>;
  }
}
