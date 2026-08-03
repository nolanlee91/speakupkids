// Helper dùng chung phía client: đọc từ, pháo giấy, trộn mảng.
// Maple là nhân vật nữ: Web Speech không có thuộc tính gender nên phải ưu tiên
// các voice nữ phổ biến theo tên, sau đó mới fallback sang voice English bất kỳ.
let speakRequest = 0;
const FEMALE_VOICE_HINTS = [
  "jenny", "aria", "zira", "samantha", "ava", "allison", "susan", "victoria",
  "karen", "moira", "tessa", "libby", "sonia", "female", "woman", "tpf",
];
const MALE_VOICE_HINTS = ["david", "mark", "guy", "george", "daniel", "male", "man"];

function mapleVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | undefined {
  const score = (voice: SpeechSynthesisVoice) => {
    const name = voice.name.toLowerCase();
    const locale = voice.lang.toLowerCase();
    let points = locale === lang.toLowerCase() ? 60 : locale.startsWith("en-") ? 20 : -100;
    if (FEMALE_VOICE_HINTS.some((hint) => name.includes(hint))) points += 100;
    if (MALE_VOICE_HINTS.some((hint) => name.includes(hint))) points -= 100;
    if (voice.localService) points += 2;
    return points;
  };
  return voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"))
    .sort((a, b) => score(b) - score(a))[0];
}

export function speak(text: string, accent: "US" | "CA" = "US", rate = 0.9) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  const request = ++speakRequest;
  const lang = accent === "CA" ? "en-CA" : "en-US";
  let played = false;
  const play = () => {
    if (played || request !== speakRequest) return;
    played = true;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.pitch = 1.06;
    const voice = mapleVoice(synth.getVoices(), lang);
    if (voice) { u.voice = voice; u.lang = voice.lang; }
    synth.speak(u);
  };
  if (synth.getVoices().length) play();
  else {
    synth.addEventListener("voiceschanged", play, { once: true });
    window.setTimeout(play, 350);
  }
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

// Âm thanh UI rất ngắn, tạo trực tiếp bằng Web Audio nên không cần tải file hay gọi API.
// Nếu trình duyệt/thiết bị không hỗ trợ thì im lặng, không ảnh hưởng luồng học.
export function playSuccessSound() {
  if (typeof window === "undefined") return;
  const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const now = ctx.currentTime;
  [523.25, 659.25, 783.99].forEach((frequency, index) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, now + index * .09);
    gain.gain.linearRampToValueAtTime(.055, now + index * .09 + .018);
    gain.gain.exponentialRampToValueAtTime(.001, now + index * .09 + .22);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(now + index * .09);
    oscillator.stop(now + index * .09 + .24);
  });
  setTimeout(() => void ctx.close(), 700);
}

export function playFeedbackSound(correct: boolean) {
  if (typeof window === "undefined") return;
  const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  oscillator.type = correct ? "sine" : "triangle";
  oscillator.frequency.setValueAtTime(correct ? 660 : 240, now);
  oscillator.frequency.linearRampToValueAtTime(correct ? 880 : 190, now + .14);
  gain.gain.setValueAtTime(.045, now);
  gain.gain.exponentialRampToValueAtTime(.001, now + .2);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + .21);
  setTimeout(() => void ctx.close(), 450);
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
