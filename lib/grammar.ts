// Grammar Path — trục ngữ pháp có hệ thống để ôn thi cấp 2:
// Trục 1 · Các thì (4 unit) → Trục 2 · Câu hỏi (2 unit) → Trục 3 · So sánh (2 unit).
// Mỗi unit: quy tắc ngắn (VN) + bảng dạng + ví dụ → luyện tập (MCQ + tự gõ dạng đúng).
// Tiến độ lưu qua games.topics key "grammar:<unitId>" — không cần thêm field state mới.

export type GrammarDrill = {
  id: string;
  type: "mcq" | "fill";
  q: string;             // câu có ___ ; với fill kèm (động từ gốc) trong ngoặc
  options?: string[];    // mcq
  answer: string;
  accept?: string[];     // fill: các đáp án khác cũng đúng
  explainVi: string;     // giải thích ngắn sau khi trả lời
};

export type GrammarUnit = {
  id: string;
  title: string;         // tên tiếng Anh
  vi: string;
  rule: string;          // quy tắc cốt lõi (VN)
  forms: string[];       // bảng dạng — mỗi dòng một khuôn
  examples: { en: string; vi: string }[];
  drills: GrammarDrill[];
};

export type GrammarTrack = { id: string; name: string; units: GrammarUnit[] };

export const GRAMMAR_TRACKS: GrammarTrack[] = [
  {
    id: "tense", name: "Trục 1 · Các thì",
    units: [
      {
        id: "g-present", title: "Present Simple", vi: "Hiện tại đơn",
        rule: "Dùng cho thói quen hằng ngày và sự thật. Với he/she/it, động từ thêm -s/-es.",
        forms: [
          "✅ I / You / We / They + play",
          "✅ He / She / It + plays",
          "❌ Phủ định: don't / doesn't + động từ gốc",
          "❓ Câu hỏi: Do / Does + chủ ngữ + động từ gốc?",
        ],
        examples: [
          { en: "I go to school every day.", vi: "Tôi đi học mỗi ngày." },
          { en: "She likes ice cream.", vi: "Cô ấy thích kem." },
          { en: "He doesn't eat fish.", vi: "Cậu ấy không ăn cá." },
        ],
        drills: [
          { id: "gp1", type: "mcq", q: "She ___ to school every day.", options: ["go", "goes", "going"], answer: "goes", explainVi: "he/she/it → động từ thêm -es: goes." },
          { id: "gp2", type: "mcq", q: "I ___ milk every morning.", options: ["drink", "drinks", "drinking"], answer: "drink", explainVi: "Chủ ngữ I → giữ động từ gốc." },
          { id: "gp3", type: "mcq", q: "My brothers ___ football on Sundays.", options: ["plays", "play", "playing"], answer: "play", explainVi: "\"My brothers\" = they → không thêm -s." },
          { id: "gp4", type: "mcq", q: "He ___ like spicy food.", options: ["don't", "doesn't", "isn't"], answer: "doesn't", explainVi: "Phủ định với he/she/it → doesn't + động từ gốc." },
          { id: "gp5", type: "mcq", q: "___ your mother work in a hospital?", options: ["Do", "Does", "Is"], answer: "Does", explainVi: "\"Your mother\" = she → câu hỏi dùng Does." },
          { id: "gp6", type: "fill", q: "The sun ___ (rise) in the east.", answer: "rises", explainVi: "Sự thật hiển nhiên, chủ ngữ số ít → rises." },
          { id: "gp7", type: "fill", q: "My cat ___ (sleep) all day.", answer: "sleeps", explainVi: "My cat = it → sleeps." },
          { id: "gp8", type: "fill", q: "We ___ (not / watch) TV in the morning.", answer: "don't watch", accept: ["do not watch"], explainVi: "Phủ định với we → don't + watch." },
        ],
      },
      {
        id: "g-present-cont", title: "Present Continuous", vi: "Hiện tại tiếp diễn",
        rule: "Dùng cho việc ĐANG xảy ra ngay lúc nói. Công thức: be (am/is/are) + động từ-ing.",
        forms: [
          "✅ I am + V-ing",
          "✅ He / She / It is + V-ing",
          "✅ You / We / They are + V-ing",
          "🔔 Dấu hiệu: now, right now, at the moment, Look!, Listen!",
        ],
        examples: [
          { en: "I am doing my homework now.", vi: "Tôi đang làm bài tập." },
          { en: "Look! It is raining.", vi: "Nhìn kìa! Trời đang mưa." },
        ],
        drills: [
          { id: "gc1", type: "mcq", q: "Look! The baby ___ .", options: ["cries", "is crying", "cry"], answer: "is crying", explainVi: "\"Look!\" → việc đang xảy ra → is crying." },
          { id: "gc2", type: "mcq", q: "They ___ lunch right now.", options: ["are having", "have", "has"], answer: "are having", explainVi: "right now → hiện tại tiếp diễn: are having." },
          { id: "gc3", type: "mcq", q: "I ___ my homework at the moment.", options: ["do", "am doing", "does"], answer: "am doing", explainVi: "at the moment → am + doing." },
          { id: "gc4", type: "mcq", q: "___ she reading a comic now?", options: ["Is", "Does", "Are"], answer: "Is", explainVi: "Câu hỏi tiếp diễn: đảo be lên đầu → Is she reading…?" },
          { id: "gc5", type: "mcq", q: "We aren't ___ TV now.", options: ["watch", "watching", "watches"], answer: "watching", explainVi: "Sau be luôn là V-ing → watching." },
          { id: "gc6", type: "fill", q: "Listen! The birds ___ (sing).", answer: "are singing", explainVi: "\"Listen!\" → đang hót → are singing." },
          { id: "gc7", type: "fill", q: "He ___ (run) in the park now.", answer: "is running", explainVi: "run → gấp đôi n: running." },
          { id: "gc8", type: "fill", q: "My parents ___ (cook) dinner at the moment.", answer: "are cooking", explainVi: "My parents = they → are cooking." },
        ],
      },
      {
        id: "g-past", title: "Past Simple", vi: "Quá khứ đơn",
        rule: "Dùng cho việc ĐÃ xảy ra và kết thúc. Động từ thêm -ed hoặc ở dạng bất quy tắc (go→went, buy→bought…).",
        forms: [
          "✅ Khẳng định: S + V-ed / V bất quy tắc",
          "❌ Phủ định: didn't + động từ gốc",
          "❓ Câu hỏi: Did + S + động từ gốc?",
          "🔔 Dấu hiệu: yesterday, last week, two days ago…",
        ],
        examples: [
          { en: "I went to the zoo yesterday.", vi: "Hôm qua tôi đi sở thú." },
          { en: "She didn't watch TV last night.", vi: "Tối qua cô ấy không xem TV." },
        ],
        drills: [
          { id: "gs1", type: "mcq", q: "Yesterday, I ___ to the zoo.", options: ["go", "went", "gone"], answer: "went", explainVi: "go là động từ bất quy tắc → went." },
          { id: "gs2", type: "mcq", q: "She ___ her room last Sunday.", options: ["cleans", "cleaned", "cleaning"], answer: "cleaned", explainVi: "last Sunday → quá khứ: cleaned." },
          { id: "gs3", type: "mcq", q: "We ___ see the film last night.", options: ["don't", "didn't", "doesn't"], answer: "didn't", explainVi: "Phủ định quá khứ → didn't + động từ gốc." },
          { id: "gs4", type: "mcq", q: "___ you visit your grandma last week?", options: ["Did", "Do", "Were"], answer: "Did", explainVi: "Câu hỏi quá khứ → Did + you + visit." },
          { id: "gs5", type: "mcq", q: "He ___ very happy yesterday.", options: ["is", "was", "were"], answer: "was", explainVi: "be ở quá khứ: he → was." },
          { id: "gs6", type: "fill", q: "Last summer, we ___ (swim) in the sea.", answer: "swam", explainVi: "swim → swam (bất quy tắc)." },
          { id: "gs7", type: "fill", q: "She ___ (buy) a new bike two days ago.", answer: "bought", explainVi: "buy → bought (bất quy tắc)." },
          { id: "gs8", type: "fill", q: "They ___ (play) chess after school yesterday.", answer: "played", explainVi: "play → played (thêm -ed)." },
        ],
      },
      {
        id: "g-future", title: "Future — will / be going to", vi: "Tương lai",
        rule: "will + động từ gốc: quyết định ngay hoặc dự đoán. be going to + động từ gốc: dự định có sẵn hoặc dấu hiệu nhìn thấy trước mắt.",
        forms: [
          "✅ S + will + động từ gốc (won't = will not)",
          "✅ S + am/is/are going to + động từ gốc",
          "🔔 Dấu hiệu: tomorrow, next week, soon…",
        ],
        examples: [
          { en: "I will help you.", vi: "Tớ sẽ giúp cậu (quyết định ngay)." },
          { en: "We are going to visit Hue next month.", vi: "Tháng sau nhà tôi sẽ đi Huế (dự định)." },
        ],
        drills: [
          { id: "gf1", type: "mcq", q: "Tomorrow, I ___ my grandparents.", options: ["visit", "will visit", "visited"], answer: "will visit", explainVi: "tomorrow → tương lai: will visit." },
          { id: "gf2", type: "mcq", q: "Look at the clouds! It ___ rain.", options: ["will", "is going to", "was"], answer: "is going to", explainVi: "Thấy mây đen = dấu hiệu trước mắt → is going to." },
          { id: "gf3", type: "mcq", q: "She ___ ten years old next month.", options: ["will be", "is", "will"], answer: "will be", explainVi: "Cần động từ be → will be." },
          { id: "gf4", type: "mcq", q: "We ___ to the beach next summer.", options: ["go", "are going to go", "went"], answer: "are going to go", explainVi: "Dự định sẵn cho kỳ nghỉ → are going to go." },
          { id: "gf5", type: "mcq", q: "___ you help me with this box?", options: ["Will", "Do", "Did"], answer: "Will", explainVi: "Nhờ giúp → Will you…?" },
          { id: "gf6", type: "fill", q: "I think our team ___ (win) the game.", answer: "will win", explainVi: "\"I think\" = dự đoán → will win." },
          { id: "gf7", type: "fill", q: "He ___ (not / come) to the party tomorrow.", answer: "won't come", accept: ["will not come"], explainVi: "Phủ định của will = won't." },
          { id: "gf8", type: "fill", q: "Next week, my class ___ (visit) the museum.", answer: "will visit", accept: ["is going to visit"], explainVi: "Cả will visit lẫn is going to visit đều đúng." },
        ],
      },
    ],
  },
  {
    id: "question", name: "Trục 2 · Câu hỏi",
    units: [
      {
        id: "g-yesno", title: "Yes/No Questions", vi: "Câu hỏi Có/Không",
        rule: "Đưa trợ động từ (Do/Does/Did/Is/Are/Was/Were/Can/Will) lên ĐẦU câu. Trả lời ngắn bằng đúng trợ động từ đó.",
        forms: [
          "❓ Do/Does + S + động từ gốc? — Yes, I do. / No, she doesn't.",
          "❓ Did + S + động từ gốc? — Yes, we did.",
          "❓ Is/Are + S + …? — Yes, it is. / No, they aren't.",
          "❓ Can/Will + S + động từ gốc? — Yes, she can.",
        ],
        examples: [
          { en: "Do you like mangoes? — Yes, I do.", vi: "Bạn thích xoài không? — Có." },
          { en: "Is it raining? — No, it isn't.", vi: "Trời đang mưa à? — Không." },
        ],
        drills: [
          { id: "gy1", type: "mcq", q: "___ you like mangoes? — Yes, I do.", options: ["Do", "Are", "Does"], answer: "Do", explainVi: "Trả lời \"I do\" → câu hỏi mở đầu bằng Do." },
          { id: "gy2", type: "mcq", q: "___ he play the piano? — Yes, he does.", options: ["Do", "Does", "Is"], answer: "Does", explainVi: "he → Does." },
          { id: "gy3", type: "mcq", q: "___ they at school yesterday? — No, they weren't.", options: ["Was", "Were", "Did"], answer: "Were", explainVi: "they + quá khứ của be → Were." },
          { id: "gy4", type: "mcq", q: "___ your sister swim? — Yes, she can.", options: ["Can", "Does", "Is"], answer: "Can", explainVi: "Trả lời \"she can\" → hỏi bằng Can." },
          { id: "gy5", type: "mcq", q: "___ it raining now? — Yes, it is.", options: ["Is", "Does", "Was"], answer: "Is", explainVi: "Đang mưa (V-ing) → hỏi bằng Is." },
          { id: "gy6", type: "fill", q: "___ you finish your homework last night? — Yes, I did.", answer: "did", explainVi: "last night + trả lời \"did\" → Did." },
          { id: "gy7", type: "fill", q: "Do you like fish? — Yes, I ___.", answer: "do", explainVi: "Trả lời ngắn lặp lại trợ động từ: do." },
          { id: "gy8", type: "fill", q: "Does she like tea? — No, she ___.", answer: "doesn't", accept: ["does not"], explainVi: "Phủ định ngắn: doesn't." },
        ],
      },
      {
        id: "g-wh", title: "Wh-Questions", vi: "Câu hỏi Wh-",
        rule: "Từ để hỏi đứng đầu: What (gì) · Where (đâu) · When (khi nào) · Who (ai) · Why (vì sao) · How (thế nào/bằng gì). Sau đó vẫn đảo trợ động từ như câu hỏi thường.",
        forms: [
          "❓ Wh- + do/does/did + S + động từ gốc?",
          "❓ Wh- + is/are/was/were + S?",
          "🔔 How many + danh từ số nhiều…? · What time…? · How old…?",
        ],
        examples: [
          { en: "Where do you live? — In Ha Noi.", vi: "Bạn sống ở đâu? — Ở Hà Nội." },
          { en: "Why are you sad? — Because I lost my pen.", vi: "Sao bạn buồn? — Vì tớ mất bút." },
        ],
        drills: [
          { id: "gw1", type: "mcq", q: "___ is your birthday? — In May.", options: ["When", "Where", "Who"], answer: "When", explainVi: "Trả lời thời gian → When." },
          { id: "gw2", type: "mcq", q: "___ do you live? — In Ha Noi.", options: ["What", "Where", "When"], answer: "Where", explainVi: "Trả lời nơi chốn → Where." },
          { id: "gw3", type: "mcq", q: "___ is your favorite teacher? — Mr. Nam.", options: ["Who", "What", "Why"], answer: "Who", explainVi: "Trả lời là NGƯỜI → Who." },
          { id: "gw4", type: "mcq", q: "___ are you sad? — Because I lost my pen.", options: ["Why", "How", "When"], answer: "Why", explainVi: "Trả lời \"Because…\" → Why." },
          { id: "gw5", type: "mcq", q: "___ do you go to school? — By bus.", options: ["How", "What", "Where"], answer: "How", explainVi: "Trả lời \"By bus\" (cách thức) → How." },
          { id: "gw6", type: "fill", q: "___ time do you get up? — At six.", answer: "what", explainVi: "Hỏi giờ → What time…?" },
          { id: "gw7", type: "fill", q: "___ many students are there in your class? — Thirty.", answer: "how", explainVi: "Hỏi số lượng → How many + danh từ số nhiều." },
          { id: "gw8", type: "fill", q: "___ does the film start? — At 8 p.m.", answer: "when", accept: ["what time"], explainVi: "Hỏi thời điểm → When (hoặc What time)." },
        ],
      },
    ],
  },
  {
    id: "compare", name: "Trục 3 · So sánh",
    units: [
      {
        id: "g-compare", title: "Comparatives", vi: "So sánh hơn",
        rule: "Tính từ NGẮN: thêm -er + than (big → bigger). Tính từ DÀI: more + tính từ + than. Tận cùng -y → -ier (easy → easier).",
        forms: [
          "✅ ngắn: taller / bigger / hotter + than",
          "✅ -y → -ier: easier, noisier, happier",
          "✅ dài: more interesting / more important + than",
          "🔔 Bất quy tắc: good → better · bad → worse",
        ],
        examples: [
          { en: "An elephant is bigger than a dog.", vi: "Voi to hơn chó." },
          { en: "This book is more interesting than that one.", vi: "Cuốn này hay hơn cuốn kia." },
        ],
        drills: [
          { id: "gm1", type: "mcq", q: "An elephant is ___ than a dog.", options: ["big", "bigger", "biggest"], answer: "bigger", explainVi: "So sánh hơn + tính từ ngắn → bigger than." },
          { id: "gm2", type: "mcq", q: "This book is ___ than that one.", options: ["interesting", "more interesting", "most interesting"], answer: "more interesting", explainVi: "Tính từ dài → more interesting than." },
          { id: "gm3", type: "mcq", q: "My sister is ___ than me.", options: ["tall", "taller", "tallest"], answer: "taller", explainVi: "tall → taller than." },
          { id: "gm4", type: "mcq", q: "Today is ___ than yesterday.", options: ["hot", "hotter", "hottest"], answer: "hotter", explainVi: "hot → gấp đôi t: hotter." },
          { id: "gm5", type: "mcq", q: "My English is ___ this year. (good)", options: ["gooder", "better", "best"], answer: "better", explainVi: "good là bất quy tắc → better." },
          { id: "gm6", type: "fill", q: "A plane is ___ (fast) than a train.", answer: "faster", explainVi: "fast → faster." },
          { id: "gm7", type: "fill", q: "This street is ___ (noisy) than my street.", answer: "noisier", explainVi: "noisy tận cùng -y → noisier." },
          { id: "gm8", type: "fill", q: "Health is ___ (important) than money.", answer: "more important", explainVi: "Tính từ dài → more important." },
        ],
      },
      {
        id: "g-superlative", title: "Superlatives", vi: "So sánh nhất",
        rule: "Tính từ NGẮN: the + tính từ-est (tall → the tallest). Tính từ DÀI: the most + tính từ. Luôn có \"the\" phía trước.",
        forms: [
          "✅ ngắn: the tallest / the biggest / the coldest",
          "✅ -y → -iest: the laziest, the happiest",
          "✅ dài: the most beautiful / the most intelligent",
          "🔔 Bất quy tắc: good → the best · bad → the worst",
        ],
        examples: [
          { en: "Mount Everest is the highest mountain in the world.", vi: "Everest là ngọn núi cao nhất thế giới." },
          { en: "This is the best day of my life!", vi: "Đây là ngày tuyệt nhất đời tớ!" },
        ],
        drills: [
          { id: "gu1", type: "mcq", q: "Mount Everest is ___ mountain in the world.", options: ["the highest", "higher", "high"], answer: "the highest", explainVi: "So sánh nhất → the + highest." },
          { id: "gu2", type: "mcq", q: "She is ___ student in my class.", options: ["the most intelligent", "more intelligent", "intelligent"], answer: "the most intelligent", explainVi: "Tính từ dài → the most intelligent." },
          { id: "gu3", type: "mcq", q: "This is ___ day of my life!", options: ["the best", "better", "good"], answer: "the best", explainVi: "good → the best (bất quy tắc)." },
          { id: "gu4", type: "mcq", q: "Winter is ___ season in my country.", options: ["the coldest", "colder", "cold"], answer: "the coldest", explainVi: "cold → the coldest." },
          { id: "gu5", type: "mcq", q: "My cat is ___ animal in our house.", options: ["the laziest", "lazier", "lazy"], answer: "the laziest", explainVi: "lazy → the laziest (-y → -iest)." },
          { id: "gu6", type: "fill", q: "The blue whale is ___ (big) animal on Earth.", answer: "the biggest", explainVi: "big → the biggest (gấp đôi g, nhớ \"the\")." },
          { id: "gu7", type: "fill", q: "Sunday is ___ (good) day of the week.", answer: "the best", explainVi: "good → the best." },
          { id: "gu8", type: "fill", q: "This is ___ (beautiful) place in my town.", answer: "the most beautiful", explainVi: "Tính từ dài → the most beautiful." },
        ],
      },
    ],
  },
];

export const GRAMMAR_UNITS: GrammarUnit[] = GRAMMAR_TRACKS.flatMap((t) => t.units);
export const grammarUnitById = (id: string) => GRAMMAR_UNITS.find((u) => u.id === id);

// Chấm câu tự gõ (fill): thường hóa rồi so với answer/accept — đòi hỏi đúng chính tả
// (đây là bài ngữ pháp, viết sai dạng từ là sai kiến thức, không fuzzy như Writing).
export function checkFill(drill: GrammarDrill, input: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").replace(/[.!?]$/, "").trim();
  const v = norm(input);
  if (!v) return false;
  return [drill.answer, ...(drill.accept || [])].some((a) => norm(a) === v);
}
