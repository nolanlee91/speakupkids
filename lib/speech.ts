// Chấm nói MVP bằng Web Speech API (không tốn API trả phí):
// trình duyệt nhận dạng giọng → so khớp từ với câu mẫu (fuzzy) → % từ đúng + số sao.
// Chỉ chấm "nói đúng từ", không chấm âm vị — đủ để khuyến khích lứa 9–12.

/* ---------- Khai báo tối thiểu cho SpeechRecognition (TS không có sẵn) ---------- */
type SRAlternative = { transcript: string; confidence: number };
type SRResult = { [index: number]: SRAlternative; length: number; isFinal: boolean };
type SREvent = { results: { [index: number]: SRResult; length: number } };
type SR = {
  lang: string; interimResults: boolean; maxAlternatives: number; continuous: boolean;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void; stop: () => void; abort: () => void;
};

function getSRCtor(): (new () => SR) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

// Trình duyệt có hỗ trợ chấm nói không (Chrome/Edge/Safari ≥14.5 có; Firefox không).
export function speechScoringSupported(): boolean { return getSRCtor() !== null; }

/* ---------- Nghe một lượt ---------- */
// Trả về danh sách phương án transcript (đã sắp theo độ tự tin) hoặc lỗi.
// Tự dừng khi im lặng; có hẹn giờ an toàn 9s. stop() để người dùng chủ động kết thúc.
export type ListenResult = { ok: true; alts: string[] } | { ok: false; error: "no-speech" | "denied" | "other" };

export function listenOnce(lang: string): { result: Promise<ListenResult>; stop: () => void } {
  const Ctor = getSRCtor();
  if (!Ctor) return { result: Promise.resolve({ ok: false, error: "other" }), stop: () => {} };
  const rec = new Ctor();
  rec.lang = lang;
  rec.interimResults = false;
  rec.maxAlternatives = 4;
  rec.continuous = false;

  let settled = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const result = new Promise<ListenResult>((resolve) => {
    const done = (r: ListenResult) => { if (!settled) { settled = true; if (timer) clearTimeout(timer); resolve(r); } };
    rec.onresult = (e) => {
      const alts: string[] = [];
      const res = e.results[0];
      if (res) for (let i = 0; i < res.length; i++) { const t = res[i]?.transcript?.trim(); if (t) alts.push(t); }
      done(alts.length ? { ok: true, alts } : { ok: false, error: "no-speech" });
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") done({ ok: false, error: "denied" });
      else if (e.error === "no-speech") done({ ok: false, error: "no-speech" });
      else done({ ok: false, error: "other" });
    };
    rec.onend = () => done({ ok: false, error: "no-speech" });
    timer = setTimeout(() => { try { rec.stop(); } catch { /* đã dừng */ } }, 9000);
    // Tắt TTS đang đọc để không thu tiếng của chính app.
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    rec.start();
  });
  return { result, stop: () => { try { rec.stop(); } catch { /* đã dừng */ } } };
}

/* ---------- So khớp & chấm ---------- */
// Recognizer hay trả số dạng chữ số ("7") trong khi câu mẫu viết chữ — quy cả hai về một dạng.
const NUM: Record<string, string> = {
  "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven",
  "8": "eight", "9": "nine", "10": "ten", "11": "eleven", "12": "twelve", "13": "thirteen", "14": "fourteen",
  "15": "fifteen", "16": "sixteen", "17": "seventeen", "18": "eighteen", "19": "nineteen", "20": "twenty",
};

function normWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9' ]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => NUM[w] || w);
}

function editDist(a: string, b: string): number {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)] as number[]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}

// Hai từ coi là khớp nếu giống hệt, hoặc lệch nhỏ (tha lỗi "cat"/"cats", "color"/"colour").
function wordMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const len = Math.max(a.length, b.length);
  if (len <= 3) return false;
  return editDist(a, b) <= (len <= 6 ? 1 : 2);
}

export type SpeechScore = {
  pct: number;                 // % từ trong câu mẫu bé nói được
  stars: 0 | 1 | 2 | 3;
  words: { w: string; hit: boolean }[]; // từng từ câu mẫu, có nói được không (để tô màu)
  heard: string;               // transcript hay nhất (hiện lại cho bé xem)
};

// Chấm 1 transcript: khớp từ theo thứ tự (greedy, cho phép recognizer chèn từ thừa).
function scoreOne(target: string[], heardWords: string[]): { pct: number; hits: boolean[] } {
  const hits = target.map(() => false);
  let j = 0;
  for (let i = 0; i < target.length; i++) {
    for (let k = j; k < heardWords.length; k++) {
      if (wordMatch(target[i], heardWords[k])) { hits[i] = true; j = k + 1; break; }
    }
  }
  const n = hits.filter(Boolean).length;
  return { pct: target.length ? Math.round((n / target.length) * 100) : 0, hits };
}

// Chấm mọi phương án transcript, lấy phương án điểm cao nhất (recognizer hay nghe nhầm).
export function scoreSpeech(targetText: string, alts: string[]): SpeechScore {
  const target = normWords(targetText);
  let best = { pct: 0, hits: target.map(() => false) };
  let heard = alts[0] || "";
  for (const alt of alts) {
    const s = scoreOne(target, normWords(alt));
    if (s.pct > best.pct) { best = s; heard = alt; }
  }
  const stars: 0 | 1 | 2 | 3 = best.pct >= 80 ? 3 : best.pct >= 50 ? 2 : best.pct > 0 ? 1 : 0;
  return { pct: best.pct, stars, words: target.map((w, i) => ({ w, hit: best.hits[i] })), heard };
}
