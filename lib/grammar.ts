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
          { id: "gp9", type: "mcq", q: "My father ___ coffee every morning.", options: ["drink", "drinks", "is drinking"], answer: "drinks", explainVi: "every morning + my father (he) → drinks." },
          { id: "gp10", type: "mcq", q: "The shops ___ at 9 a.m.", options: ["opens", "open", "opening"], answer: "open", explainVi: "\"The shops\" số nhiều → không thêm -s." },
          { id: "gp11", type: "mcq", q: "Lan and Mai ___ in the same class.", options: ["is", "are", "be"], answer: "are", explainVi: "Hai người = they → are." },
          { id: "gp12", type: "fill", q: "Water ___ (boil) at 100 degrees.", answer: "boils", explainVi: "Sự thật khoa học, chủ ngữ số ít → boils." },
          { id: "gp13", type: "fill", q: "My grandparents ___ (live) in the countryside.", answer: "live", explainVi: "grandparents = they → live (không -s)." },
          { id: "gp14", type: "fill", q: "She ___ (not / like) horror films.", answer: "doesn't like", accept: ["does not like"], explainVi: "she → doesn't + like." },
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
          { id: "gc9", type: "mcq", q: "Be quiet! The teacher ___ .", options: ["speaks", "is speaking", "speak"], answer: "is speaking", explainVi: "Đang nói ngay lúc này → is speaking." },
          { id: "gc10", type: "mcq", q: "Why ___ you wearing a coat? It's hot!", options: ["are", "do", "is"], answer: "are", explainVi: "wearing (V-ing) → cần be: are you wearing." },
          { id: "gc11", type: "mcq", q: "The children ___ in the yard at the moment.", options: ["play", "are playing", "plays"], answer: "are playing", explainVi: "at the moment → are playing." },
          { id: "gc12", type: "fill", q: "I can't talk now. I ___ (have) dinner.", answer: "am having", explainVi: "Đang ăn ngay lúc này → am having." },
          { id: "gc13", type: "fill", q: "Look! The bus ___ (come).", answer: "is coming", explainVi: "\"Look!\" → is coming (bỏ e, thêm -ing giữ nguyên come→coming)." },
          { id: "gc14", type: "fill", q: "They ___ (not / study) right now.", answer: "aren't studying", accept: ["are not studying"], explainVi: "Phủ định tiếp diễn: aren't + studying." },
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
          { id: "gs9", type: "mcq", q: "Last night, we ___ a great film.", options: ["watch", "watched", "watches"], answer: "watched", explainVi: "last night → watched." },
          { id: "gs10", type: "mcq", q: "She ___ me a letter last month.", options: ["writes", "wrote", "written"], answer: "wrote", explainVi: "write → wrote (bất quy tắc)." },
          { id: "gs11", type: "mcq", q: "There ___ many people at the party yesterday.", options: ["was", "were", "are"], answer: "were", explainVi: "many people (số nhiều) + quá khứ → were." },
          { id: "gs12", type: "fill", q: "I ___ (eat) pho for breakfast this morning.", answer: "ate", explainVi: "eat → ate (bất quy tắc)." },
          { id: "gs13", type: "fill", q: "He ___ (not / go) to school yesterday because he was sick.", answer: "didn't go", accept: ["did not go"], explainVi: "Phủ định quá khứ: didn't + go." },
          { id: "gs14", type: "fill", q: "My team ___ (win) the match last Sunday.", answer: "won", explainVi: "win → won (bất quy tắc)." },
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
          { id: "gf9", type: "mcq", q: "I'm sure you ___ the test.", options: ["pass", "will pass", "passed"], answer: "will pass", explainVi: "\"I'm sure\" = dự đoán → will pass." },
          { id: "gf10", type: "mcq", q: "We ___ our cousins next weekend. Everything is planned.", options: ["visit", "are going to visit", "visited"], answer: "are going to visit", explainVi: "Đã lên kế hoạch → are going to visit." },
          { id: "gf11", type: "mcq", q: "Don't worry. I ___ you with your homework.", options: ["will help", "help", "helped"], answer: "will help", explainVi: "Quyết định ngay lúc nói → will help." },
          { id: "gf12", type: "fill", q: "She ___ (be) twelve next birthday.", answer: "will be", explainVi: "Tương lai của be → will be." },
          { id: "gf13", type: "fill", q: "It's cloudy. It ___ (rain) soon.", answer: "is going to rain", accept: ["will rain"], explainVi: "Mây đen = dấu hiệu → is going to rain (will rain cũng nhận)." },
          { id: "gf14", type: "fill", q: "They ___ (not / travel) this summer.", answer: "won't travel", accept: ["will not travel", "aren't going to travel", "are not going to travel"], explainVi: "Phủ định: won't + travel." },
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
          { id: "gy9", type: "mcq", q: "___ your friends like video games? — Yes, they do.", options: ["Do", "Does", "Are"], answer: "Do", explainVi: "your friends = they → Do." },
          { id: "gy10", type: "mcq", q: "___ she at home now? — Yes, she is.", options: ["Is", "Does", "Was"], answer: "Is", explainVi: "\"at home\" không có động từ thường → dùng be: Is." },
          { id: "gy11", type: "mcq", q: "___ you go to the cinema last week? — No, I didn't.", options: ["Did", "Do", "Were"], answer: "Did", explainVi: "last week → Did." },
          { id: "gy12", type: "fill", q: "___ your brother play chess? — Yes, he does.", answer: "does", explainVi: "your brother = he → Does." },
          { id: "gy13", type: "fill", q: "Can your dog swim? — Yes, it ___.", answer: "can", explainVi: "Trả lời ngắn lặp lại can." },
          { id: "gy14", type: "fill", q: "Are they twins? — No, they ___.", answer: "aren't", accept: ["are not"], explainVi: "Phủ định ngắn của are: aren't." },
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
          { id: "gw9", type: "mcq", q: "___ bag is this? — It's Nam's.", options: ["Whose", "Who", "Which"], answer: "Whose", explainVi: "Hỏi \"của ai\" → Whose + danh từ." },
          { id: "gw10", type: "mcq", q: "___ do you visit your grandparents? — Once a month.", options: ["How often", "When", "Where"], answer: "How often", explainVi: "Trả lời tần suất (once a month) → How often." },
          { id: "gw11", type: "mcq", q: "___ is your school from home? — About two kilometers.", options: ["How far", "How long", "Where"], answer: "How far", explainVi: "Hỏi khoảng cách → How far." },
          { id: "gw12", type: "fill", q: "___ old is your sister? — She is nine.", answer: "how", explainVi: "Hỏi tuổi → How old…?" },
          { id: "gw13", type: "fill", q: "___ did you go last summer? — To Da Lat.", answer: "where", explainVi: "Trả lời nơi chốn → Where." },
          { id: "gw14", type: "fill", q: "___ are you late? — Because I missed the bus.", answer: "why", explainVi: "Trả lời Because → Why." },
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
          { id: "gm9", type: "mcq", q: "This exercise is ___ than that one.", options: ["difficult", "more difficult", "most difficult"], answer: "more difficult", explainVi: "difficult là tính từ dài → more difficult than." },
          { id: "gm10", type: "mcq", q: "My hair is ___ than my sister's.", options: ["long", "longer", "longest"], answer: "longer", explainVi: "long → longer than." },
          { id: "gm11", type: "mcq", q: "The weather today is ___ than yesterday.", options: ["bad", "worse", "worst"], answer: "worse", explainVi: "bad là bất quy tắc → worse." },
          { id: "gm12", type: "fill", q: "A city is ___ (busy) than a village.", answer: "busier", explainVi: "busy tận cùng -y → busier." },
          { id: "gm13", type: "fill", q: "My new phone is ___ (good) than my old one.", answer: "better", explainVi: "good → better (bất quy tắc)." },
          { id: "gm14", type: "fill", q: "This film is ___ (boring) than the book.", answer: "more boring", explainVi: "Tính từ dài → more boring." },
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
          { id: "gu9", type: "mcq", q: "February is ___ month of the year.", options: ["the shortest", "shorter", "short"], answer: "the shortest", explainVi: "So sánh nhất → the shortest." },
          { id: "gu10", type: "mcq", q: "He is ___ runner on our team.", options: ["the fastest", "faster", "fast"], answer: "the fastest", explainVi: "fast → the fastest." },
          { id: "gu11", type: "mcq", q: "That was ___ film I have ever seen.", options: ["the worst", "worse", "bad"], answer: "the worst", explainVi: "bad → the worst (bất quy tắc)." },
          { id: "gu12", type: "fill", q: "The Nile is one of ___ (long) rivers in the world.", answer: "the longest", explainVi: "one of the + so sánh nhất → the longest." },
          { id: "gu13", type: "fill", q: "She is ___ (funny) person in our family.", answer: "the funniest", explainVi: "funny → the funniest (-y → -iest)." },
          { id: "gu14", type: "fill", q: "This is ___ (expensive) restaurant in town.", answer: "the most expensive", explainVi: "Tính từ dài → the most expensive." },
        ],
      },
    ],
  },
  {
    id: "foundation", name: "Trục 4 · Nền tảng câu",
    units: [
      {
        id: "g-articles", title: "Articles — a / an / the", vi: "Mạo từ",
        rule: "a + từ bắt đầu bằng PHỤ ÂM (a dog) · an + NGUYÊN ÂM a-e-i-o-u (an apple) · the khi vật đã xác định hoặc duy nhất (the sun, the dog vừa nhắc).",
        forms: [
          "✅ a + phụ âm: a book, a cat",
          "✅ an + nguyên âm: an egg, an umbrella",
          "✅ the: vật duy nhất (the moon) hoặc đã nhắc đến",
          "🔔 Nhạc cụ dùng the: play the piano",
        ],
        examples: [
          { en: "I have a cat and an umbrella.", vi: "Tôi có một con mèo và một cái ô." },
          { en: "The sun is very bright today.", vi: "Hôm nay mặt trời rất chói." },
        ],
        drills: [
          { id: "ga1", type: "mcq", q: "I saw ___ elephant at the zoo.", options: ["a", "an", "the"], answer: "an", explainVi: "elephant bắt đầu bằng nguyên âm e → an." },
          { id: "ga2", type: "mcq", q: "She has ___ new bike.", options: ["a", "an", "the"], answer: "a", explainVi: "new bắt đầu bằng phụ âm n → a." },
          { id: "ga3", type: "mcq", q: "___ sun rises in the east.", options: ["A", "An", "The"], answer: "The", explainVi: "Mặt trời là duy nhất → The." },
          { id: "ga4", type: "mcq", q: "He is eating ___ orange.", options: ["a", "an", "the"], answer: "an", explainVi: "orange bắt đầu bằng nguyên âm o → an." },
          { id: "ga5", type: "mcq", q: "We have a dog. ___ dog is very friendly.", options: ["A", "An", "The"], answer: "The", explainVi: "Con chó đã được nhắc đến → The." },
          { id: "ga6", type: "mcq", q: "My mother is ___ teacher.", options: ["a", "an", "the"], answer: "a", explainVi: "Nghề nghiệp: a/an + nghề; teacher → a." },
          { id: "ga7", type: "fill", q: "I need ___ umbrella. (a/an/the)", answer: "an", explainVi: "umbrella bắt đầu bằng u (nguyên âm) → an." },
          { id: "ga8", type: "fill", q: "There is ___ book on the table. (a/an/the)", answer: "a", explainVi: "book → a." },
          { id: "ga9", type: "fill", q: "___ Earth goes around the Sun. (a/an/the)", answer: "the", explainVi: "Trái Đất duy nhất → the." },
          { id: "ga10", type: "fill", q: "She wants to be ___ engineer. (a/an/the)", answer: "an", explainVi: "engineer bắt đầu bằng e → an." },
          { id: "ga11", type: "mcq", q: "Can you play ___ piano?", options: ["a", "an", "the"], answer: "the", explainVi: "Nhạc cụ → play the piano." },
          { id: "ga12", type: "fill", q: "We watched ___ interesting film. (a/an/the)", answer: "an", explainVi: "interesting bắt đầu bằng i → an." },
        ],
      },
      {
        id: "g-prep", title: "Prepositions — in / on / at", vi: "Giới từ thời gian & nơi chốn",
        rule: "IN + tháng/năm/mùa/buổi (in May, in the morning) và trong không gian kín (in the fridge). ON + thứ/ngày (on Monday) và trên bề mặt (on the wall). AT + giờ và địa điểm cụ thể (at 7 o'clock, at school).",
        forms: [
          "⏰ in May · in 2026 · in the morning",
          "⏰ on Monday · on Sunday evening",
          "⏰ at 7 o'clock · at night",
          "📍 in the box · on the table · at the bus stop",
        ],
        examples: [
          { en: "We have English on Monday.", vi: "Thứ Hai bọn tớ có tiết tiếng Anh." },
          { en: "The milk is in the fridge.", vi: "Sữa ở trong tủ lạnh." },
        ],
        drills: [
          { id: "gr1", type: "mcq", q: "My birthday is ___ June.", options: ["in", "on", "at"], answer: "in", explainVi: "Tháng → in June." },
          { id: "gr2", type: "mcq", q: "We have English ___ Monday.", options: ["in", "on", "at"], answer: "on", explainVi: "Thứ trong tuần → on Monday." },
          { id: "gr3", type: "mcq", q: "School starts ___ 7 o'clock.", options: ["in", "on", "at"], answer: "at", explainVi: "Giờ → at 7 o'clock." },
          { id: "gr4", type: "mcq", q: "The cat is sleeping ___ the sofa.", options: ["in", "on", "at"], answer: "on", explainVi: "Trên bề mặt → on the sofa." },
          { id: "gr5", type: "mcq", q: "There is milk ___ the fridge.", options: ["in", "on", "at"], answer: "in", explainVi: "Trong không gian kín → in the fridge." },
          { id: "gr6", type: "mcq", q: "Dad is ___ work now.", options: ["in", "on", "at"], answer: "at", explainVi: "Địa điểm cụ thể → at work." },
          { id: "gr7", type: "fill", q: "We go swimming ___ the summer. (in/on/at)", answer: "in", explainVi: "Mùa → in the summer." },
          { id: "gr8", type: "fill", q: "The party is ___ Sunday evening. (in/on/at)", answer: "on", explainVi: "Thứ + buổi → on Sunday evening." },
          { id: "gr9", type: "fill", q: "I get up ___ six o'clock. (in/on/at)", answer: "at", explainVi: "Giờ → at six o'clock." },
          { id: "gr10", type: "fill", q: "The picture is ___ the wall. (in/on/at)", answer: "on", explainVi: "Trên bề mặt tường → on the wall." },
          { id: "gr11", type: "mcq", q: "I was born ___ 2015.", options: ["in", "on", "at"], answer: "in", explainVi: "Năm → in 2015." },
          { id: "gr12", type: "fill", q: "She is waiting ___ the bus stop. (in/on/at)", answer: "at", explainVi: "Điểm cụ thể → at the bus stop." },
        ],
      },
      {
        id: "g-pronouns", title: "Pronouns & Possessives", vi: "Đại từ & sở hữu",
        rule: "Đại từ thay tên người/vật: he (anh ấy) · she (cô ấy) · it (nó) · they (họ). Tính từ sở hữu đứng TRƯỚC danh từ: my · your · his · her · its · our · their.",
        forms: [
          "👤 I → my · you → your · he → his · she → her",
          "👥 we → our · they → their · it → its",
          "🔔 his/her theo NGƯỜI SỞ HỮU: bố của Lan → her father",
        ],
        examples: [
          { en: "Nam has a bike. His bike is red.", vi: "Nam có xe đạp. Xe của cậu ấy màu đỏ." },
          { en: "The cats are playing with their toys.", vi: "Lũ mèo đang chơi đồ chơi của chúng." },
        ],
        drills: [
          { id: "gn1", type: "mcq", q: "This is my brother. ___ is ten.", options: ["He", "She", "It"], answer: "He", explainVi: "brother = con trai → He." },
          { id: "gn2", type: "mcq", q: "Lan is my friend. ___ house is near mine.", options: ["Her", "His", "She"], answer: "Her", explainVi: "Nhà CỦA Lan (con gái) → Her + house." },
          { id: "gn3", type: "mcq", q: "The dog is hungry. Give ___ some food.", options: ["it", "he", "its"], answer: "it", explainVi: "Con vật → it (sau động từ give)." },
          { id: "gn4", type: "mcq", q: "My parents are teachers. ___ work at my school.", options: ["They", "Them", "Their"], answer: "They", explainVi: "parents làm chủ ngữ → They." },
          { id: "gn5", type: "mcq", q: "We love ___ grandmother very much.", options: ["our", "us", "we"], answer: "our", explainVi: "Trước danh từ grandmother → our." },
          { id: "gn6", type: "mcq", q: "Is this ___ pencil? — Yes, it's mine.", options: ["your", "you", "yours"], answer: "your", explainVi: "Trước danh từ pencil → your." },
          { id: "gn7", type: "fill", q: "Nam has a bike. ___ bike is red.", answer: "his", explainVi: "Của Nam (con trai) → his." },
          { id: "gn8", type: "fill", q: "My sister and I clean ___ room every day.", answer: "our", explainVi: "My sister and I = we → our." },
          { id: "gn9", type: "fill", q: "The cats are playing with ___ toys.", answer: "their", explainVi: "The cats = they → their." },
          { id: "gn10", type: "fill", q: "I like this song. Can you play ___ again?", answer: "it", explainVi: "this song = vật → it." },
          { id: "gn11", type: "mcq", q: "___ am eleven years old.", options: ["I", "Me", "My"], answer: "I", explainVi: "Chủ ngữ → I." },
          { id: "gn12", type: "fill", q: "That is Mrs. Hoa. ___ is our English teacher.", answer: "she", explainVi: "Mrs. Hoa = cô ấy → She." },
        ],
      },
      {
        id: "g-thereis", title: "There is / There are + some / any", vi: "Câu tồn tại & some/any",
        rule: "There is + danh từ SỐ ÍT hoặc không đếm được · There are + SỐ NHIỀU. some dùng trong câu KHẲNG ĐỊNH, any trong PHỦ ĐỊNH và CÂU HỎI.",
        forms: [
          "✅ There is a book. · There is some milk.",
          "✅ There are two cats. · There are some eggs.",
          "❌ There isn't any milk. · There aren't any chairs.",
          "❓ Is there…? / Are there any…?",
        ],
        examples: [
          { en: "There is a park near my house.", vi: "Có một công viên gần nhà tôi." },
          { en: "There aren't any eggs in the fridge.", vi: "Trong tủ lạnh không còn quả trứng nào." },
        ],
        drills: [
          { id: "gt1", type: "mcq", q: "___ a park near my house.", options: ["There is", "There are", "It is"], answer: "There is", explainVi: "a park (số ít) → There is." },
          { id: "gt2", type: "mcq", q: "___ many students in the yard.", options: ["There is", "There are", "Is there"], answer: "There are", explainVi: "many students (số nhiều) → There are." },
          { id: "gt3", type: "mcq", q: "There is ___ milk in the bottle.", options: ["some", "any", "many"], answer: "some", explainVi: "Khẳng định + không đếm được → some." },
          { id: "gt4", type: "mcq", q: "There aren't ___ eggs in the fridge.", options: ["some", "any", "a"], answer: "any", explainVi: "Phủ định → any." },
          { id: "gt5", type: "mcq", q: "___ there a library at your school? — Yes, there is.", options: ["Is", "Are", "Does"], answer: "Is", explainVi: "a library (số ít) → Is there…?" },
          { id: "gt6", type: "mcq", q: "How many chairs ___ in the room?", options: ["is there", "are there", "there are"], answer: "are there", explainVi: "How many + số nhiều → are there (đảo)." },
          { id: "gt7", type: "fill", q: "There ___ two windows in my room. (is/are)", answer: "are", explainVi: "two windows → are." },
          { id: "gt8", type: "fill", q: "There ___ a big tree in the garden. (is/are)", answer: "is", explainVi: "a big tree (số ít) → is." },
          { id: "gt9", type: "fill", q: "Are there ___ books on the shelf? (some/any)", answer: "any", explainVi: "Câu hỏi → any." },
          { id: "gt10", type: "fill", q: "There is ___ water in the glass. (some/any)", answer: "some", explainVi: "Khẳng định → some." },
          { id: "gt11", type: "mcq", q: "There ___ any buses after 10 p.m.", options: ["isn't", "aren't", "don't"], answer: "aren't", explainVi: "buses số nhiều, phủ định → aren't any." },
          { id: "gt12", type: "fill", q: "There ___ many stars in the sky tonight. (is/are)", answer: "are", explainVi: "many stars → are." },
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
