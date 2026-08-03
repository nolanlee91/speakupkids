// Writing Coach — luyện viết câu có cấu trúc, máy chấm KHÔNG tốn API:
// chấm bằng (1) từ khóa bắt buộc khớp fuzzy, (2) đúng thứ tự khung câu,
// (3) quy tắc trình bày: viết hoa đầu câu · dấu câu cuối · độ dài hợp lý.
// Cùng triết lý với chấm nói (lib/speech.ts): khuyến khích, minh bạch từng tiêu chí.
import type { Difficulty } from "./gameplay";

export type WriteTask = {
  id: string;
  vi: string;            // yêu cầu (tiếng Việt) — bé phải viết gì
  frame: string;         // khung câu gợi ý, ___ là chỗ bé tự điền
  keywords: string[][];  // từ khóa BẮT BUỘC theo thứ tự; mảng con = các biến thể chấp nhận
  minWords: number;
  maxWords: number;
  model: string;         // câu mẫu (xem sau khi chấm)
  difficulty?: Difficulty;
};
export type WriteSet = { id: string; title: string; vi: string; items: WriteTask[] };

export const WRITE_SETS: WriteSet[] = [
  {
    id: "w-intro", title: "About Me", vi: "Giới thiệu bản thân",
    items: [
      { id: "wi1", vi: "Giới thiệu tên của em", frame: "My name is ___.", keywords: [["my"], ["name"], ["is"]], minWords: 4, maxWords: 8, model: "My name is Mai.", difficulty: "easy" },
      { id: "wi2", vi: "Nói tuổi của em", frame: "I am ___ years old.", keywords: [["i"], ["am"], ["years"], ["old"]], minWords: 5, maxWords: 8, model: "I am ten years old.", difficulty: "easy" },
      { id: "wi3", vi: "Kể một điều em thích làm", frame: "I like ___.", keywords: [["i"], ["like"]], minWords: 3, maxWords: 9, model: "I like reading books.", difficulty: "medium" },
      { id: "wi4", vi: "Kể một việc em làm giỏi", frame: "I can ___ very well.", keywords: [["i"], ["can"], ["well"]], minWords: 5, maxWords: 9, model: "I can swim very well.", difficulty: "medium" },
      { id: "wi5", vi: "Viết 2 câu: tên em + điều em thích", frame: "My name is ___. I like ___.", keywords: [["name"], ["is"], ["i"], ["like"]], minWords: 7, maxWords: 16, model: "My name is Nam. I like playing football.", difficulty: "hard" },
    ],
  },
  {
    id: "w-school", title: "My School Day", vi: "Một ngày ở trường",
    items: [
      { id: "ws1", vi: "Em đến trường bằng gì?", frame: "I go to school by ___.", keywords: [["go"], ["to"], ["school"], ["by"]], minWords: 6, maxWords: 9, model: "I go to school by bike.", difficulty: "easy" },
      { id: "ws2", vi: "Môn học em thích nhất", frame: "My favorite subject is ___.", keywords: [["favorite", "favourite"], ["subject"], ["is"]], minWords: 5, maxWords: 8, model: "My favorite subject is English.", difficulty: "easy" },
      { id: "ws3", vi: "Thứ Hai em có mấy tiết học?", frame: "I have ___ lessons on Monday.", keywords: [["have"], ["lessons"], ["monday"]], minWords: 6, maxWords: 9, model: "I have four lessons on Monday.", difficulty: "medium" },
      { id: "ws4", vi: "Tả cô/thầy giáo của em (1 câu)", frame: "My teacher is ___.", keywords: [["my"], ["teacher"], ["is"]], minWords: 4, maxWords: 10, model: "My teacher is kind and funny.", difficulty: "medium" },
      { id: "ws5", vi: "Viết 2 câu: trường em + vì sao em thích", frame: "My school is ___. I like it because ___.", keywords: [["school"], ["is"], ["like"], ["because"]], minWords: 8, maxWords: 18, model: "My school is big. I like it because my friends are there.", difficulty: "hard" },
    ],
  },
  {
    id: "w-family", title: "Family & Home", vi: "Gia đình và ngôi nhà",
    items: [
      { id: "wf1", vi: "Gia đình em có mấy người?", frame: "There are ___ people in my family.", keywords: [["there"], ["are"], ["people"], ["family"]], minWords: 7, maxWords: 10, model: "There are four people in my family.", difficulty: "easy" },
      { id: "wf2", vi: "Nghề của mẹ em", frame: "My mother is a ___.", keywords: [["my"], ["mother", "mom", "mum"], ["is"]], minWords: 5, maxWords: 8, model: "My mother is a nurse.", difficulty: "easy" },
      { id: "wf3", vi: "Bố em thích làm gì?", frame: "My father likes ___.", keywords: [["father", "dad"], ["likes"]], minWords: 4, maxWords: 9, model: "My father likes watching football.", difficulty: "medium" },
      { id: "wf4", vi: "Nhà em có mấy phòng?", frame: "My house has ___ rooms.", keywords: [["house"], ["has"], ["rooms"]], minWords: 5, maxWords: 8, model: "My house has five rooms.", difficulty: "medium" },
      { id: "wf5", vi: "Chủ nhật gia đình em thường làm gì?", frame: "On Sundays, my family ___.", keywords: [["on"], ["sundays", "sunday"], ["family"]], minWords: 6, maxWords: 14, model: "On Sundays, my family cooks lunch together.", difficulty: "hard" },
    ],
  },
  {
    id: "w-food", title: "Food I Like", vi: "Món ăn em thích",
    items: [
      { id: "wd1", vi: "Món ăn em thích nhất", frame: "My favorite food is ___.", keywords: [["favorite", "favourite"], ["food"], ["is"]], minWords: 5, maxWords: 8, model: "My favorite food is pho.", difficulty: "easy" },
      { id: "wd2", vi: "Em uống gì mỗi ngày?", frame: "I drink ___ every day.", keywords: [["drink"], ["every"], ["day"]], minWords: 5, maxWords: 8, model: "I drink milk every day.", difficulty: "easy" },
      { id: "wd3", vi: "Bữa sáng em ăn gì?", frame: "For breakfast, I eat ___.", keywords: [["for"], ["breakfast"], ["eat"]], minWords: 5, maxWords: 9, model: "For breakfast, I eat noodles.", difficulty: "medium" },
      { id: "wd4", vi: "Món em KHÔNG thích và lý do", frame: "I don't like ___ because ___.", keywords: [["don't", "dont"], ["like"], ["because"]], minWords: 6, maxWords: 12, model: "I don't like carrots because they are hard.", difficulty: "medium" },
      { id: "wd5", vi: "Viết 2 câu: món em thích + ai nấu món đó", frame: "My favorite dish is ___. ___ cooks it ___.", keywords: [["favorite", "favourite"], ["is"], ["cooks"]], minWords: 8, maxWords: 16, model: "My favorite dish is pho. My mother cooks it every weekend.", difficulty: "hard" },
    ],
  },
  {
    id: "w-animals", title: "Animals & Nature", vi: "Động vật và thiên nhiên",
    items: [
      { id: "wa1", vi: "Em nuôi con vật gì?", frame: "I have a pet ___.", keywords: [["i"], ["have"], ["pet"]], minWords: 5, maxWords: 8, model: "I have a pet dog.", difficulty: "easy" },
      { id: "wa2", vi: "Tả con voi (1 câu)", frame: "Elephants are ___.", keywords: [["elephants", "elephant"], ["are"]], minWords: 3, maxWords: 8, model: "Elephants are big and strong.", difficulty: "easy" },
      { id: "wa3", vi: "Một con vật làm được gì?", frame: "A ___ can ___.", keywords: [["a"], ["can"]], minWords: 4, maxWords: 9, model: "A bird can fly high.", difficulty: "medium" },
      { id: "wa4", vi: "Con vật em thích nhất và lý do", frame: "My favorite animal is ___ because ___.", keywords: [["favorite", "favourite"], ["animal"], ["because"]], minWords: 7, maxWords: 14, model: "My favorite animal is the cat because it is cute.", difficulty: "medium" },
      { id: "wa5", vi: "Viết 1 câu về khu rừng", frame: "In the forest, ___.", keywords: [["in"], ["the"], ["forest"]], minWords: 5, maxWords: 14, model: "In the forest, monkeys jump from tree to tree.", difficulty: "hard" },
    ],
  },
  {
    id: "w-town", title: "My Town & Weekend", vi: "Nơi em sống và cuối tuần",
    items: [
      { id: "wt1", vi: "Em sống ở đâu?", frame: "I live in ___.", keywords: [["i"], ["live"], ["in"]], minWords: 4, maxWords: 8, model: "I live in Ha Noi.", difficulty: "easy" },
      { id: "wt2", vi: "Gần nhà em có gì?", frame: "There is a ___ near my house.", keywords: [["there"], ["is"], ["near"], ["house"]], minWords: 7, maxWords: 10, model: "There is a park near my house.", difficulty: "easy" },
      { id: "wt3", vi: "Cuối tuần em làm gì với bạn?", frame: "On weekends, I ___ with my friends.", keywords: [["on"], ["weekends", "weekend"], ["friends"]], minWords: 6, maxWords: 12, model: "On weekends, I play soccer with my friends.", difficulty: "medium" },
      { id: "wt4", vi: "Thời tiết hôm nay thế nào?", frame: "Today the weather is ___.", keywords: [["today"], ["weather"], ["is"]], minWords: 5, maxWords: 9, model: "Today the weather is sunny and hot.", difficulty: "medium" },
      { id: "wt5", vi: "Viết 2 câu: nơi em sống + nơi em thích nhất ở đó", frame: "I live in ___. My favorite place is ___.", keywords: [["live"], ["favorite", "favourite"], ["place"]], minWords: 8, maxWords: 16, model: "I live in a small town. My favorite place is the old market.", difficulty: "hard" },
    ],
  },
];

export const writeSetById = (id: string) => WRITE_SETS.find((s) => s.id === id);

/* ---------- Máy chấm ---------- */
export type WriteCheck = { label: string; ok: boolean; note?: string };
export type WriteScore = { stars: 0 | 1 | 2 | 3; checks: WriteCheck[]; missing: string[] };

function normWords(text: string): string[] {
  return text.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9' ]+/g, " ").split(/\s+/).filter(Boolean);
}
function editDist(a: string, b: string): number {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)] as number[]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
// Tha lỗi chính tả nhỏ ở từ dài; từ ngắn (≤3 ký tự) phải khớp tuyệt đối.
function wordMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const len = Math.max(a.length, b.length);
  if (len <= 3) return false;
  return editDist(a, b) <= (len <= 6 ? 1 : 2);
}

export function scoreWriting(task: WriteTask, text: string): WriteScore {
  const raw = text.trim();
  const words = normWords(raw);

  // Từ khóa: tìm theo thứ tự khai báo; ghi lại từ thiếu + có đúng trật tự khung không.
  const missing: string[] = [];
  let hit = 0, lastIdx = -1, orderOk = true;
  for (const group of task.keywords) {
    let idx = -1;
    for (let i = 0; i < words.length; i++) {
      if (group.some((v) => wordMatch(v.toLowerCase(), words[i]))) { idx = i; break; }
    }
    if (idx === -1) { missing.push(group[0]); continue; }
    hit++;
    if (idx < lastIdx) orderOk = false;
    lastIdx = Math.max(lastIdx, idx);
  }
  const kwOk = missing.length === 0;

  const capOk = /^[A-Z]/.test(raw);
  const punctOk = /[.!?]$/.test(raw);
  const lenOk = words.length >= task.minWords && words.length <= task.maxWords;

  const checks: WriteCheck[] = [
    { label: "Đủ ý chính của khung câu", ok: kwOk, note: missing.length ? `còn thiếu: ${missing.join(", ")}` : undefined },
    { label: "Các từ đúng thứ tự khung", ok: kwOk && orderOk },
    { label: "Viết hoa chữ cái đầu câu", ok: capOk },
    { label: "Kết thúc bằng dấu . ! hoặc ?", ok: punctOk },
    { label: `Độ dài phù hợp (${task.minWords}–${task.maxWords} từ)`, ok: lenOk, note: words.length ? `bài của con: ${words.length} từ` : undefined },
  ];

  const mech = [capOk, punctOk, lenOk].filter(Boolean).length;
  // Nội dung nặng hơn trình bày: đủ TẤT CẢ ý chính là tối thiểu 2 sao,
  // 3 sao khi vừa đủ ý, đúng thứ tự, vừa sạch cả 3 quy tắc trình bày.
  const stars: 0 | 1 | 2 | 3 =
    kwOk && orderOk && mech === 3 ? 3
    : kwOk ? 2
    : hit >= Math.ceil(task.keywords.length * 0.6) && mech >= 2 ? 2
    : hit > 0 ? 1 : 0;
  return { stars, checks, missing };
}
