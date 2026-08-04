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
  minSentences?: number; // bài ĐOẠN VĂN (L3): số câu tối thiểu — thêm tiêu chí đếm câu
};
export type WriteSet = { id: string; title: string; vi: string; image: string; items: WriteTask[] };

export const WRITE_SETS: WriteSet[] = [
  {
    id: "w-intro", title: "About Me", vi: "Giới thiệu bản thân", image: "/assets/images/gen/writing/about-me.webp",
    items: [
      { id: "wi1", vi: "Giới thiệu tên của em", frame: "My name is ___.", keywords: [["my"], ["name"], ["is"]], minWords: 4, maxWords: 8, model: "My name is Mai.", difficulty: "easy" },
      { id: "wi2", vi: "Nói tuổi của em", frame: "I am ___ years old.", keywords: [["i"], ["am"], ["years"], ["old"]], minWords: 5, maxWords: 8, model: "I am ten years old.", difficulty: "easy" },
      { id: "wi3", vi: "Kể một điều em thích làm", frame: "I like ___.", keywords: [["i"], ["like"]], minWords: 3, maxWords: 9, model: "I like reading books.", difficulty: "medium" },
      { id: "wi4", vi: "Kể một việc em làm giỏi", frame: "I can ___ very well.", keywords: [["i"], ["can"], ["well"]], minWords: 5, maxWords: 9, model: "I can swim very well.", difficulty: "medium" },
      { id: "wi5", vi: "Viết 2 câu: tên em + điều em thích", frame: "My name is ___. I like ___.", keywords: [["name"], ["is"], ["i"], ["like"]], minWords: 7, maxWords: 16, model: "My name is Nam. I like playing football.", difficulty: "hard" },
      { id: "wi6", vi: "Em học lớp mấy?", frame: "I am in grade ___.", keywords: [["i"], ["am"], ["grade"]], minWords: 4, maxWords: 8, model: "I am in grade five.", difficulty: "easy" },
      { id: "wi7", vi: "Môn thể thao em chơi cùng bạn", frame: "I play ___ with my friends.", keywords: [["play"], ["with"], ["friends"]], minWords: 5, maxWords: 10, model: "I play badminton with my friends.", difficulty: "medium" },
      { id: "wi8", vi: "Viết 2 câu: em đến từ đâu + em giỏi gì", frame: "I am from ___. I am good at ___.", keywords: [["from"], ["good"], ["at"]], minWords: 7, maxWords: 16, model: "I am from Da Nang. I am good at drawing.", difficulty: "hard" },
    ],
  },
  {
    id: "w-school", title: "My School Day", vi: "Một ngày ở trường", image: "/assets/images/gen/writing/school-day.webp",
    items: [
      { id: "ws1", vi: "Em đến trường bằng gì?", frame: "I go to school by ___.", keywords: [["go"], ["to"], ["school"], ["by"]], minWords: 6, maxWords: 9, model: "I go to school by bike.", difficulty: "easy" },
      { id: "ws2", vi: "Môn học em thích nhất", frame: "My favorite subject is ___.", keywords: [["favorite", "favourite"], ["subject"], ["is"]], minWords: 5, maxWords: 8, model: "My favorite subject is English.", difficulty: "easy" },
      { id: "ws3", vi: "Thứ Hai em có mấy tiết học?", frame: "I have ___ lessons on Monday.", keywords: [["have"], ["lessons"], ["monday"]], minWords: 6, maxWords: 9, model: "I have four lessons on Monday.", difficulty: "medium" },
      { id: "ws4", vi: "Tả cô/thầy giáo của em (1 câu)", frame: "My teacher is ___.", keywords: [["my"], ["teacher"], ["is"]], minWords: 4, maxWords: 10, model: "My teacher is kind and funny.", difficulty: "medium" },
      { id: "ws5", vi: "Viết 2 câu: trường em + vì sao em thích", frame: "My school is ___. I like it because ___.", keywords: [["school"], ["is"], ["like"], ["because"]], minWords: 8, maxWords: 18, model: "My school is big. I like it because my friends are there.", difficulty: "hard" },
      { id: "ws6", vi: "Trường em tên gì?", frame: "My school's name is ___.", keywords: [["school's", "school"], ["name"], ["is"]], minWords: 5, maxWords: 10, model: "My school's name is Le Loi Primary School.", difficulty: "easy" },
      { id: "ws7", vi: "Giờ ra chơi em làm gì?", frame: "At break time, I ___ with my friends.", keywords: [["at"], ["break"], ["i"]], minWords: 6, maxWords: 12, model: "At break time, I play games with my friends.", difficulty: "medium" },
      { id: "ws8", vi: "Viết 2 câu: bạn cùng bàn + vì sao em quý bạn", frame: "My deskmate is ___. I like her/him because ___.", keywords: [["is"], ["like"], ["because"]], minWords: 8, maxWords: 18, model: "My deskmate is Thu. I like her because she always helps me.", difficulty: "hard" },
    ],
  },
  {
    id: "w-family", title: "Family & Home", vi: "Gia đình và ngôi nhà", image: "/assets/images/gen/writing/family-home.webp",
    items: [
      { id: "wf1", vi: "Gia đình em có mấy người?", frame: "There are ___ people in my family.", keywords: [["there"], ["are"], ["people"], ["family"]], minWords: 7, maxWords: 10, model: "There are four people in my family.", difficulty: "easy" },
      { id: "wf2", vi: "Nghề của mẹ em", frame: "My mother is a ___.", keywords: [["my"], ["mother", "mom", "mum"], ["is"]], minWords: 5, maxWords: 8, model: "My mother is a nurse.", difficulty: "easy" },
      { id: "wf3", vi: "Bố em thích làm gì?", frame: "My father likes ___.", keywords: [["father", "dad"], ["likes"]], minWords: 4, maxWords: 9, model: "My father likes watching football.", difficulty: "medium" },
      { id: "wf4", vi: "Nhà em có mấy phòng?", frame: "My house has ___ rooms.", keywords: [["house"], ["has"], ["rooms"]], minWords: 5, maxWords: 8, model: "My house has five rooms.", difficulty: "medium" },
      { id: "wf5", vi: "Chủ nhật gia đình em thường làm gì?", frame: "On Sundays, my family ___.", keywords: [["on"], ["sundays", "sunday"], ["family"]], minWords: 6, maxWords: 14, model: "On Sundays, my family cooks lunch together.", difficulty: "hard" },
      { id: "wf6", vi: "Kể về anh/chị/em của em", frame: "I have a ___ .", keywords: [["have"], ["sister", "brother"]], minWords: 4, maxWords: 10, model: "I have a little sister.", difficulty: "easy" },
      { id: "wf7", vi: "Bữa tối nhà em ăn gì?", frame: "For dinner, my family has ___.", keywords: [["for"], ["dinner"], ["family"]], minWords: 6, maxWords: 12, model: "For dinner, my family has fish and rice.", difficulty: "medium" },
      { id: "wf8", vi: "Viết 2 câu: người em yêu quý nhất nhà + vì sao", frame: "I love my ___ the most. She/He always ___.", keywords: [["love"], ["most"], ["always"]], minWords: 8, maxWords: 16, model: "I love my grandmother the most. She always tells me funny stories.", difficulty: "hard" },
    ],
  },
  {
    id: "w-food", title: "Food I Like", vi: "Món ăn em thích", image: "/assets/images/gen/writing/food-i-like.webp",
    items: [
      { id: "wd1", vi: "Món ăn em thích nhất", frame: "My favorite food is ___.", keywords: [["favorite", "favourite"], ["food"], ["is"]], minWords: 5, maxWords: 8, model: "My favorite food is pho.", difficulty: "easy" },
      { id: "wd2", vi: "Em uống gì mỗi ngày?", frame: "I drink ___ every day.", keywords: [["drink"], ["every"], ["day"]], minWords: 5, maxWords: 8, model: "I drink milk every day.", difficulty: "easy" },
      { id: "wd3", vi: "Bữa sáng em ăn gì?", frame: "For breakfast, I eat ___.", keywords: [["for"], ["breakfast"], ["eat"]], minWords: 5, maxWords: 9, model: "For breakfast, I eat noodles.", difficulty: "medium" },
      { id: "wd4", vi: "Món em KHÔNG thích và lý do", frame: "I don't like ___ because ___.", keywords: [["don't", "dont"], ["like"], ["because"]], minWords: 6, maxWords: 12, model: "I don't like carrots because they are hard.", difficulty: "medium" },
      { id: "wd5", vi: "Viết 2 câu: món em thích + ai nấu món đó", frame: "My favorite dish is ___. ___ cooks it ___.", keywords: [["favorite", "favourite"], ["is"], ["cooks"]], minWords: 8, maxWords: 16, model: "My favorite dish is pho. My mother cooks it every weekend.", difficulty: "hard" },
      { id: "wd6", vi: "Trái cây em thích nhất", frame: "I like ___ best.", keywords: [["i"], ["like"], ["best"]], minWords: 4, maxWords: 9, model: "I like mangoes best.", difficulty: "easy" },
      { id: "wd7", vi: "Em có thể nấu món gì?", frame: "I can cook ___.", keywords: [["can"], ["cook"]], minWords: 4, maxWords: 10, model: "I can cook fried eggs.", difficulty: "medium" },
      { id: "wd8", vi: "Viết 2 câu: món ăn ngày Tết + vị của nó", frame: "At Tet, my family eats ___. It tastes ___.", keywords: [["tet"], ["eats", "eat"], ["tastes"]], minWords: 8, maxWords: 16, model: "At Tet, my family eats banh chung. It tastes really good.", difficulty: "hard" },
    ],
  },
  {
    id: "w-animals", title: "Animals & Nature", vi: "Động vật và thiên nhiên", image: "/assets/images/gen/writing/animals-nature.webp",
    items: [
      { id: "wa1", vi: "Em nuôi con vật gì?", frame: "I have a pet ___.", keywords: [["i"], ["have"], ["pet"]], minWords: 5, maxWords: 8, model: "I have a pet dog.", difficulty: "easy" },
      { id: "wa2", vi: "Tả con voi (1 câu)", frame: "Elephants are ___.", keywords: [["elephants", "elephant"], ["are"]], minWords: 3, maxWords: 8, model: "Elephants are big and strong.", difficulty: "easy" },
      { id: "wa3", vi: "Một con vật làm được gì?", frame: "A ___ can ___.", keywords: [["a"], ["can"]], minWords: 4, maxWords: 9, model: "A bird can fly high.", difficulty: "medium" },
      { id: "wa4", vi: "Con vật em thích nhất và lý do", frame: "My favorite animal is ___ because ___.", keywords: [["favorite", "favourite"], ["animal"], ["because"]], minWords: 7, maxWords: 14, model: "My favorite animal is the cat because it is cute.", difficulty: "medium" },
      { id: "wa5", vi: "Viết 1 câu về khu rừng", frame: "In the forest, ___.", keywords: [["in"], ["the"], ["forest"]], minWords: 5, maxWords: 14, model: "In the forest, monkeys jump from tree to tree.", difficulty: "hard" },
      { id: "wa6", vi: "Những con vật sống ở trang trại", frame: "___ live on a farm.", keywords: [["live"], ["on"], ["farm"]], minWords: 4, maxWords: 10, model: "Cows and chickens live on a farm.", difficulty: "easy" },
      { id: "wa7", vi: "Tả một con vật bằng 2 tính từ", frame: "The ___ is ___ and ___.", keywords: [["the"], ["is"], ["and"]], minWords: 5, maxWords: 10, model: "The rabbit is small and soft.", difficulty: "medium" },
      { id: "wa8", vi: "Viết 2 câu: vì sao cần bảo vệ động vật hoang dã", frame: "We must protect ___. They are ___.", keywords: [["must"], ["protect"], ["are"]], minWords: 7, maxWords: 16, model: "We must protect wild animals. They are part of our world.", difficulty: "hard" },
    ],
  },
  {
    id: "w-town", title: "My Town & Weekend", vi: "Nơi em sống và cuối tuần", image: "/assets/images/gen/writing/town-weekend.webp",
    items: [
      { id: "wt1", vi: "Em sống ở đâu?", frame: "I live in ___.", keywords: [["i"], ["live"], ["in"]], minWords: 4, maxWords: 8, model: "I live in Ha Noi.", difficulty: "easy" },
      { id: "wt2", vi: "Gần nhà em có gì?", frame: "There is a ___ near my house.", keywords: [["there"], ["is"], ["near"], ["house"]], minWords: 7, maxWords: 10, model: "There is a park near my house.", difficulty: "easy" },
      { id: "wt3", vi: "Cuối tuần em làm gì với bạn?", frame: "On weekends, I ___ with my friends.", keywords: [["on"], ["weekends", "weekend"], ["friends"]], minWords: 6, maxWords: 12, model: "On weekends, I play soccer with my friends.", difficulty: "medium" },
      { id: "wt4", vi: "Thời tiết hôm nay thế nào?", frame: "Today the weather is ___.", keywords: [["today"], ["weather"], ["is"]], minWords: 5, maxWords: 9, model: "Today the weather is sunny and hot.", difficulty: "medium" },
      { id: "wt5", vi: "Viết 2 câu: nơi em sống + nơi em thích nhất ở đó", frame: "I live in ___. My favorite place is ___.", keywords: [["live"], ["favorite", "favourite"], ["place"]], minWords: 8, maxWords: 16, model: "I live in a small town. My favorite place is the old market.", difficulty: "hard" },
      { id: "wt6", vi: "Em đi chợ/siêu thị với ai?", frame: "I go to the market with ___.", keywords: [["go"], ["market", "supermarket"], ["with"]], minWords: 6, maxWords: 10, model: "I go to the market with my mom.", difficulty: "easy" },
      { id: "wt7", vi: "Mùa hè này em muốn đi đâu?", frame: "This summer, I want to visit ___.", keywords: [["summer"], ["want"], ["visit"]], minWords: 6, maxWords: 12, model: "This summer, I want to visit the beach.", difficulty: "medium" },
      { id: "wt8", vi: "Viết 2 câu: thành phố em nổi tiếng về gì", frame: "My city is famous for ___. Many people ___.", keywords: [["famous"], ["for"], ["people"]], minWords: 8, maxWords: 16, model: "My city is famous for its old bridge. Many people visit it every year.", difficulty: "hard" },
    ],
  },
  // ── Hai bộ ĐOẠN VĂN cho nhóm L3 (lớp 6–7): 3–4 câu theo dàn ý, toàn bộ mức hard ──
  {
    id: "w-para-me", title: "Paragraph · My World", vi: "Đoạn văn: thế giới của em (L3)", image: "/assets/images/gen/writing/paragraph-my-world.webp",
    items: [
      { id: "wp1", vi: "Giới thiệu bản thân bằng 3 câu: tên · tuổi · sở thích", frame: "My name is ___. I am ___ years old. I like ___.",
        keywords: [["name"], ["is"], ["am"], ["years"], ["old"], ["like"]], minWords: 12, maxWords: 30, minSentences: 3,
        model: "My name is Linh. I am eleven years old. I like drawing comics.", difficulty: "hard" },
      { id: "wp2", vi: "Viết 3 câu về bạn thân: tên · tính cách · hoạt động cùng nhau", frame: "My best friend is ___. He/She is ___. We often ___ together.",
        keywords: [["best"], ["friend"], ["is"], ["we"], ["together"]], minWords: 12, maxWords: 35, minSentences: 3,
        model: "My best friend is Minh. He is tall and funny. We often play chess together.", difficulty: "hard" },
      { id: "wp3", vi: "Viết 3 câu về ước mơ: nghề gì · vì sao · em sẽ làm gì", frame: "I want to be a ___. I like ___. I will ___.",
        keywords: [["i"], ["want"], ["be"], ["will"]], minWords: 12, maxWords: 35, minSentences: 3,
        model: "I want to be a doctor. I like helping people. I will study hard every day.", difficulty: "hard" },
      { id: "wp4", vi: "Viết 3 câu về ngày em thích nhất trong tuần: ngày nào · làm gì · cảm xúc", frame: "My favorite day is ___. On that day, I ___. I feel ___.",
        keywords: [["favorite", "favourite"], ["day"], ["is"], ["i"], ["feel"]], minWords: 12, maxWords: 35, minSentences: 3,
        model: "My favorite day is Sunday. On that day, I go swimming with my dad. I feel very happy.", difficulty: "hard" },
      { id: "wp5", vi: "Viết 3 câu về người em ngưỡng mộ: ai · vì sao · em muốn giống điều gì", frame: "I admire my ___. She/He is ___. I want to ___ like her/him.",
        keywords: [["admire"], ["is"], ["want"], ["like"]], minWords: 12, maxWords: 35, minSentences: 3,
        model: "I admire my mother. She is kind and works very hard. I want to be patient like her.", difficulty: "hard" },
    ],
  },
  {
    id: "w-para-world", title: "Paragraph · Around Me", vi: "Đoạn văn: quanh em (L3)", image: "/assets/images/gen/writing/paragraph-around-me.webp",
    items: [
      { id: "wq1", vi: "Tả căn phòng của em bằng 3 câu: có gì · màu sắc · em thích nhất thứ gì", frame: "My room has ___. The walls are ___. I love my ___ best.",
        keywords: [["room"], ["has"], ["are"], ["love"]], minWords: 12, maxWords: 35, minSentences: 3,
        model: "My room has a bed and a desk. The walls are light blue. I love my bookshelf best.", difficulty: "hard" },
      { id: "wq2", vi: "Viết 3 câu về món quà đáng nhớ: quà gì · ai tặng · vì sao em quý", frame: "My best gift is ___. ___ gave it to me. I love it because ___.",
        keywords: [["gift"], ["gave"], ["because"]], minWords: 12, maxWords: 38, minSentences: 3,
        model: "My best gift is a red bicycle. My father gave it to me. I love it because we ride together on weekends.", difficulty: "hard" },
      { id: "wq3", vi: "Kể 3 câu về một chuyến đi: đi đâu · với ai · điều tuyệt nhất", frame: "Last summer, I went to ___. I went with ___. The best part was ___.",
        keywords: [["went"], ["to"], ["with"], ["best"], ["was"]], minWords: 13, maxWords: 38, minSentences: 3,
        model: "Last summer, I went to Da Nang. I went with my family. The best part was swimming in the sea.", difficulty: "hard" },
      { id: "wq4", vi: "Viết 3 câu về mùa em thích: mùa nào · thời tiết · em thường làm gì", frame: "My favorite season is ___. The weather is ___. I often ___.",
        keywords: [["favorite", "favourite"], ["season"], ["weather"], ["often"]], minWords: 12, maxWords: 35, minSentences: 3,
        model: "My favorite season is autumn. The weather is cool and windy. I often fly kites with my brother.", difficulty: "hard" },
      { id: "wq5", vi: "Viết 3 câu về bảo vệ Trái Đất: vấn đề · em làm gì mỗi ngày · lời kêu gọi", frame: "Our planet needs help. I ___ every day. Let's ___ together.",
        keywords: [["planet", "earth"], ["i"], ["every"], ["let's", "lets"]], minWords: 12, maxWords: 35, minSentences: 3,
        model: "Our planet needs help. I recycle bottles and save water every day. Let's protect the Earth together.", difficulty: "hard" },
    ],
  },
  {
    id: "w-para-plans", title: "Paragraph · My Plans", vi: "Đoạn văn: dự định của em (L3)", image: "/assets/images/gen/writing/paragraph-my-world.webp",
    items: [
      { id: "wr1", vi: "Viết 3 câu về kế hoạch cuối tuần: làm gì · rồi làm gì · cảm nghĩ", frame: "This weekend, I am going to ___. Then I will ___. I think it will be ___.", keywords: [["weekend"], ["going"], ["will"]], minWords: 12, maxWords: 35, minSentences: 3, model: "This weekend, I am going to visit my grandparents. Then I will play with my cousins. I think it will be fun.", difficulty: "hard" },
      { id: "wr2", vi: "Viết 3 câu về nghề mơ ước: nghề gì · sẽ làm gì mỗi ngày · bố mẹ sẽ thế nào", frame: "In the future, I want to be ___. I will ___ every day. My parents will be ___.", keywords: [["future"], ["want"], ["will"]], minWords: 12, maxWords: 35, minSentences: 3, model: "In the future, I want to be a pilot. I will study English every day. My parents will be proud of me.", difficulty: "hard" },
      { id: "wr3", vi: "Viết 3 câu về kỳ nghỉ hè mơ ước: mong làm gì · đi với ai · sẽ cùng làm gì", frame: "Next summer, I hope to ___. I will go with ___. We will ___.", keywords: [["summer"], ["hope"], ["will"]], minWords: 12, maxWords: 35, minSentences: 3, model: "Next summer, I hope to see the sea. I will go with my family. We will build sandcastles together.", difficulty: "hard" },
      { id: "wr4", vi: "Viết 3 câu về mục tiêu năm nay: mục tiêu · sẽ luyện gì · sẽ KHÔNG làm gì", frame: "This year, my goal is ___. I will practice ___. I won't ___.", keywords: [["goal"], ["practice"], ["won't", "wont"]], minWords: 12, maxWords: 35, minSentences: 3, model: "This year, my goal is to speak English well. I will practice with Maple every day. I won't give up.", difficulty: "hard" },
      { id: "wr5", vi: "Viết 3 câu lời hứa với bản thân: hứa gì · thêm việc gì · sẽ cảm thấy sao", frame: "I promise to ___. I will also ___. Then I will feel ___.", keywords: [["promise"], ["also"], ["feel"]], minWords: 12, maxWords: 35, minSentences: 3, model: "I promise to read one book every month. I will also help my mom at home. Then I will feel proud of myself.", difficulty: "hard" },
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
  // Đoạn văn (L3): đếm số câu theo dấu kết câu.
  const sentCount = raw.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean).length;
  const sentOk = !task.minSentences || sentCount >= task.minSentences;

  const checks: WriteCheck[] = [
    { label: "Đủ ý chính của khung câu", ok: kwOk, note: missing.length ? `còn thiếu: ${missing.join(", ")}` : undefined },
    { label: "Các từ đúng thứ tự khung", ok: kwOk && orderOk },
    { label: "Viết hoa chữ cái đầu câu", ok: capOk },
    { label: "Kết thúc bằng dấu . ! hoặc ?", ok: punctOk },
    { label: `Độ dài phù hợp (${task.minWords}–${task.maxWords} từ)`, ok: lenOk, note: words.length ? `bài của con: ${words.length} từ` : undefined },
  ];
  if (task.minSentences) {
    checks.push({ label: `Viết thành đoạn ≥ ${task.minSentences} câu`, ok: sentOk, note: `bài của con: ${sentCount} câu` });
  }

  const mech = [capOk, punctOk, lenOk].filter(Boolean).length;
  // Nội dung nặng hơn trình bày: đủ TẤT CẢ ý chính là tối thiểu 2 sao,
  // 3 sao khi đủ ý + đúng thứ tự + sạch trình bày (+ đủ số câu nếu là bài đoạn văn).
  const stars: 0 | 1 | 2 | 3 =
    kwOk && orderOk && mech === 3 && sentOk ? 3
    : kwOk ? 2
    : hit >= Math.ceil(task.keywords.length * 0.6) && mech >= 2 ? 2
    : hit > 0 ? 1 : 0;
  return { stars, checks, missing };
}
