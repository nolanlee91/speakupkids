// Helper dùng chung phía client: đọc từ, pháo giấy, trộn mảng.
export function speak(text: string, accent: "US" | "CA" = "US", rate = 0.9) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = accent === "CA" ? "en-CA" : "en-US";
  u.rate = rate;
  window.speechSynthesis.speak(u);
}

export function celebrate(motion: boolean) {
  if (!motion || typeof document === "undefined") return;
  const colors = ["#ff7a59", "#ffcc33", "#17a2a2", "#3bb273", "#a05be0", "#ff5d8f"];
  for (let i = 0; i < 36; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[i % colors.length];
    c.style.animationDelay = Math.random() * 0.3 + "s";
    c.style.transform = "scale(" + (0.6 + Math.random()) + ")";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 2200);
  }
}

export function shuffle<T>(a: T[]): T[] {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick<T>(correct: T, pool: T[], n = 2): T[] {
  const d = shuffle([...new Set(pool)].filter((x) => x !== correct)).slice(0, n);
  return shuffle([correct, ...d]);
}

// Bốc n mục CHƯA gặp (theo danh sách id đã thấy). Ưu tiên hết mục mới trước;
// nếu không đủ thì mới bổ sung từ mục cũ (đảo lại) — KHÔNG lặp trong cùng một lượt.
// Trả {picked, nextSeen} — nextSeen dùng lưu vào state để lần sau khác đi.
export function pickUnseen<T extends { id: string }>(items: T[], seen: string[], n: number): { picked: T[]; nextSeen: string[] } {
  const unseen = shuffle(items.filter((i) => !seen.includes(i.id)));
  if (unseen.length >= n) {
    const picked = unseen.slice(0, n);
    return { picked, nextSeen: [...seen, ...picked.map((p) => p.id)] };
  }
  // Không đủ mục mới: lấy hết mục mới, rồi bổ sung từ mục cũ để đủ n (bắt đầu vòng mới).
  const rest = shuffle(items.filter((i) => seen.includes(i.id)));
  const picked = [...unseen, ...rest].slice(0, Math.min(n, items.length));
  return { picked, nextSeen: picked.map((p) => p.id) };
}
