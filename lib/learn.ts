// Nội dung học tập (data-driven). Tách khỏi page.tsx.
// Vertical slice: Everyday Town → "At the Park" (đầy đủ cho cấp độ Detective).

/* ============ Cấp độ khó ============ */
export type DifficultyLevel = "explorer" | "detective" | "storyteller";
export type DiffConfig = {
  label: string; vi: string; emoji: string;
  viSupport: "full" | "default" | "min"; // mức hỗ trợ tiếng Việt
  prompts: boolean;                       // có gợi ý mẫu câu khi nói không
  note: string;
};
export const DIFFICULTY: Record<DifficultyLevel, DiffConfig> = {
  explorer:    { label: "Explorer", vi: "Thám hiểm", emoji: "🐣", viSupport: "full", prompts: true,  note: "Nhiều tiếng Việt & gợi ý mẫu câu" },
  detective:   { label: "Detective", vi: "Thám tử", emoji: "🔎", viSupport: "default", prompts: true, note: "Mặc định cho 9–12 tuổi" },
  storyteller: { label: "Storyteller", vi: "Kể chuyện", emoji: "📖", viSupport: "min", prompts: false, note: "Ít dịch, nói mở nhiều hơn" },
};
export const showVi = (d: DifficultyLevel) => DIFFICULTY[d].viSupport !== "min";
export const showPrompts = (d: DifficultyLevel) => DIFFICULTY[d].prompts;

/* ============ Kiểu dữ liệu nội dung ============ */
export type VocabularyItem = { word: string; ipa: string; vi: string; example: string; exampleVi: string; emoji: string };
export type SentencePattern = { pattern: string; vi: string; examples: { en: string; vi: string }[] };
export type MCQ = { q: string; vi?: string; options: string[]; answer: string; explainVi?: string };
export type ListeningActivity = { intro: string; introVi: string; script: string; questions: MCQ[] };
export type SpeakingActivity = {
  repeat: { en: string; vi: string }[];
  guided: { q: string; vi: string; hint: string };
  describe: { prompt: string; vi: string; min: number; max: number };
};
// Mini Check chỉ gồm bài MÁY CHẤM được (không có điểm tự khai).
export type MiniCheckTask = { type: "vocab" | "sentence" | "listening" | "reading" } & MCQ;
export type MiniCheck = { tasks: MiniCheckTask[] };

export type LearningSectionKey = "words" | "sentences" | "listening" | "speaking";
export type LearningSection = { key: LearningSectionKey; name: string; vi: string; icon: string; desc: string };
export const SECTIONS: LearningSection[] = [
  { key: "words",     name: "Words",     vi: "Từ vựng",  icon: "📖", desc: "Từ mới · phát âm · ví dụ" },
  { key: "sentences", name: "Sentences", vi: "Mẫu câu",  icon: "✏️", desc: "Mẫu câu & ngữ pháp nhẹ" },
  { key: "listening", name: "Listening", vi: "Nghe hiểu", icon: "🎧", desc: "Nghe Maple & trả lời" },
  { key: "speaking",  name: "Listen & Repeat", vi: "Nghe & nói theo", icon: "🎤", desc: "Nghe Maple rồi nói theo · không chấm điểm" },
];

export type Lesson = {
  id: string; theme: string; title: string; vi: string; ageRange: string;
  sceneImage?: string;
  shadowIds?: string[];        // id bài video (data.ts) dùng cho Shadowing
  vocab: VocabularyItem[];
  patterns: SentencePattern[];
  listening: ListeningActivity;
  speaking: SpeakingActivity;
  miniCheck: MiniCheck;
};
export type CourseTheme = { id: string; name: string; vi: string; emoji: string; lessons: Lesson[] };

/* ============ Bài mẫu: At the Park ============ */
const AT_THE_PARK: Lesson = {
  id: "park", theme: "everyday-town", title: "At the Park", vi: "Ở công viên", ageRange: "9–12",
  sceneImage: "/assets/images/gen/scene-park.webp",
  shadowIds: ["zoo", "like"],
  vocab: [
    { word: "bench", ipa: "/bentʃ/", vi: "ghế dài", emoji: "🪑", example: "Let's sit on the bench.", exampleVi: "Mình ngồi ghế dài nhé." },
    { word: "playground", ipa: "/ˈpleɪɡraʊnd/", vi: "sân chơi", emoji: "🛝", example: "The kids are at the playground.", exampleVi: "Các bạn đang ở sân chơi." },
    { word: "fountain", ipa: "/ˈfaʊntən/", vi: "đài phun nước", emoji: "⛲", example: "Water flows from the fountain.", exampleVi: "Nước chảy ra từ đài phun." },
    { word: "path", ipa: "/pæθ/", vi: "lối đi", emoji: "🛤️", example: "We walk along the path.", exampleVi: "Chúng mình đi dọc lối đi." },
    { word: "chase", ipa: "/tʃeɪs/", vi: "đuổi theo", emoji: "🏃", example: "The dog likes to chase the ball.", exampleVi: "Chú chó thích đuổi theo quả bóng." },
    { word: "throw", ipa: "/θroʊ/", vi: "ném", emoji: "🤾", example: "Please throw the ball to me.", exampleVi: "Ném bóng cho mình nhé." },
    { word: "crowded", ipa: "/ˈkraʊdɪd/", vi: "đông đúc", emoji: "👨‍👩‍👧‍👦", example: "The park is crowded on weekends.", exampleVi: "Công viên đông vào cuối tuần." },
    { word: "excited", ipa: "/ɪkˈsaɪtɪd/", vi: "hào hứng", emoji: "😃", example: "I'm excited to play outside.", exampleVi: "Mình rất hào hứng được chơi ngoài trời." },
  ],
  patterns: [
    { pattern: "I can see …", vi: "Mình thấy …", examples: [
      { en: "I can see a big fountain.", vi: "Mình thấy một đài phun lớn." },
      { en: "I can see two children on the bench.", vi: "Mình thấy hai bạn nhỏ trên ghế." }] },
    { pattern: "There is / There are …", vi: "Có … (số ít / số nhiều)", examples: [
      { en: "There is a bench near the path.", vi: "Có một cái ghế gần lối đi." },
      { en: "There are many people at the park.", vi: "Có rất nhiều người ở công viên." }] },
    { pattern: "The boy is running beside …", vi: "Cậu bé đang chạy cạnh …", examples: [
      { en: "The boy is running beside the fountain.", vi: "Cậu bé đang chạy cạnh đài phun." },
      { en: "The dog is running beside the path.", vi: "Chú chó đang chạy cạnh lối đi." }] },
    { pattern: "I think … because …", vi: "Mình nghĩ … vì …", examples: [
      { en: "I think they are happy because they are smiling.", vi: "Mình nghĩ họ vui vì họ đang cười." },
      { en: "I think it is summer because the trees are green.", vi: "Mình nghĩ đang là mùa hè vì cây rất xanh." }] },
  ],
  listening: {
    intro: "Listen to Maple's story, then answer.",
    introVi: "Nghe câu chuyện của Maple rồi trả lời.",
    script: "It was a sunny afternoon. Maple went to the park to find her friend Theo. The park was crowded and noisy. First, she looked near the fountain, but Theo was not there. Then she saw him beside the playground, throwing a ball. Maple was so excited that she ran down the path to say hello.",
    questions: [
      { q: "Where did Maple finally find Theo?", vi: "Cuối cùng Maple tìm thấy Theo ở đâu?",
        options: ["Beside the playground", "Near the fountain", "On a bench"], answer: "Beside the playground",
        explainVi: "Maple thấy Theo đang ném bóng cạnh sân chơi." },
      { q: "Why was the park hard to search?", vi: "Vì sao khó tìm trong công viên?",
        options: ["It was crowded and noisy", "It was dark", "It was raining"], answer: "It was crowded and noisy",
        explainVi: "Công viên đông và ồn nên khó tìm." },
      { q: "What probably happened right before Maple ran to Theo?", vi: "Điều gì có lẽ xảy ra ngay trước khi Maple chạy tới Theo?",
        options: ["She saw Theo throwing a ball", "She went home", "She sat on a bench"], answer: "She saw Theo throwing a ball",
        explainVi: "Vì thấy Theo nên Maple mới hào hứng chạy tới." },
    ],
  },
  speaking: {
    repeat: [
      { en: "I can see a big fountain in the park.", vi: "Mình thấy một đài phun lớn trong công viên." },
      { en: "There are many excited children on the playground.", vi: "Có nhiều bạn nhỏ hào hứng trên sân chơi." },
    ],
    guided: { q: "What do you like to do at the park?", vi: "Bạn thích làm gì ở công viên?", hint: "I like to ___ at the park." },
    describe: {
      prompt: "Look at the park picture. Describe it in 3–5 sentences. Use \"I can see\", \"There is/are\", and one \"because\".",
      vi: "Nhìn bức tranh công viên. Mô tả 3–5 câu, dùng \"I can see\", \"There is/are\" và một câu \"because\".",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"to run after someone to catch them\"?", vi: "Từ nào nghĩa là \"đuổi theo để bắt\"?",
        options: ["chase", "throw", "crowded"], answer: "chase" },
      { type: "sentence", q: "Which sentence does NOT match a busy park?", vi: "Câu nào KHÔNG khớp với công viên đông người?",
        options: ["There are many people.", "The park is crowded.", "The park is empty and quiet."], answer: "The park is empty and quiet.",
        explainVi: "Công viên đông thì không thể vắng và yên tĩnh." },
      { type: "listening", q: "In the story, why was Maple excited?", vi: "Trong truyện, vì sao Maple hào hứng?",
        options: ["She found her friend Theo", "She bought ice cream", "She won a game"], answer: "She found her friend Theo" },
      { type: "reading", q: "Read: “The children are running and smiling in the park.” How do they feel?", vi: "Đọc câu trên. Các bạn cảm thấy thế nào?",
        options: ["Happy", "Scared", "Bored"], answer: "Happy", explainVi: "Chạy nhảy và mỉm cười nghĩa là đang vui (happy)." },
    ],
  },
};

/* ============ Unit 2: In the Kitchen ============ */
const IN_THE_KITCHEN: Lesson = {
  id: "kitchen", theme: "everyday-town", title: "In the Kitchen", vi: "Trong bếp", ageRange: "9–12",
  sceneImage: "/assets/images/gen/scene-kitchen.webp",
  vocab: [
    { word: "stove", ipa: "/stoʊv/", vi: "bếp lò", emoji: "🔥", example: "The pan is on the stove.", exampleVi: "Cái chảo ở trên bếp lò." },
    { word: "pan", ipa: "/pæn/", vi: "cái chảo", emoji: "🍳", example: "She cooks an egg in a pan.", exampleVi: "Cô ấy nấu trứng trong chảo." },
    { word: "fry", ipa: "/fraɪ/", vi: "chiên, rán", emoji: "🍳", example: "I like to fry an egg.", exampleVi: "Mình thích chiên trứng." },
    { word: "slice", ipa: "/slaɪs/", vi: "cắt lát", emoji: "🔪", example: "Please slice the bread.", exampleVi: "Cắt bánh mì giúp mình nhé." },
    { word: "fresh", ipa: "/freʃ/", vi: "tươi, mới", emoji: "🥬", example: "The bread is fresh and warm.", exampleVi: "Bánh mì tươi và ấm." },
    { word: "breakfast", ipa: "/ˈbrekfəst/", vi: "bữa sáng", emoji: "🍞", example: "We eat breakfast together.", exampleVi: "Chúng mình ăn sáng cùng nhau." },
    { word: "delicious", ipa: "/dɪˈlɪʃəs/", vi: "ngon", emoji: "😋", example: "This breakfast is delicious.", exampleVi: "Bữa sáng này rất ngon." },
    { word: "teapot", ipa: "/ˈtiːpɒt/", vi: "ấm trà", emoji: "🫖", example: "The teapot is on the stove.", exampleVi: "Ấm trà ở trên bếp." },
  ],
  patterns: [
    { pattern: "The cook is + V-ing …", vi: "Người nấu đang …", examples: [
      { en: "The cook is frying an egg.", vi: "Người nấu đang chiên trứng." },
      { en: "The cook is making breakfast.", vi: "Người nấu đang chuẩn bị bữa sáng." }] },
    { pattern: "There is / There are …", vi: "Có … (số ít / số nhiều)", examples: [
      { en: "There is a teapot on the stove.", vi: "Có một ấm trà trên bếp." },
      { en: "There are apples and bananas on the table.", vi: "Có táo và chuối trên bàn." }] },
    { pattern: "I would like …", vi: "Mình muốn (dùng) …", examples: [
      { en: "I would like some bread.", vi: "Mình muốn một ít bánh mì." },
      { en: "I would like a slice of cheese.", vi: "Mình muốn một lát phô mai." }] },
    { pattern: "It smells / tastes …", vi: "Nó có mùi / vị …", examples: [
      { en: "It smells delicious.", vi: "Nó thơm ngon quá." },
      { en: "The apple tastes sweet.", vi: "Quả táo có vị ngọt." }] },
  ],
  listening: {
    intro: "Listen to Maple's kitchen story, then answer.",
    introVi: "Nghe chuyện trong bếp của Maple rồi trả lời.",
    script: "Maple was hungry after school. She went to the kitchen, where Grandma was cooking. Grandma was frying an egg in a big pan on the stove. On the table, Maple saw a red apple, a banana and some fresh bread. \"Breakfast for dinner!\" Grandma said with a smile. Maple poured tea from the teal teapot. The whole kitchen smelled delicious.",
    questions: [
      { q: "What was Grandma doing?", vi: "Bà đang làm gì?",
        options: ["Frying an egg", "Washing the car", "Reading a book"], answer: "Frying an egg",
        explainVi: "Bà đang chiên trứng trong chảo." },
      { q: "What did Maple pour from the teapot?", vi: "Maple rót gì từ ấm trà?",
        options: ["Tea", "Milk", "Juice"], answer: "Tea" },
      { q: "Why was the dinner special?", vi: "Vì sao bữa tối này đặc biệt?",
        options: ["They had breakfast food for dinner", "They ate at a restaurant", "They had a big cake"], answer: "They had breakfast food for dinner",
        explainVi: "Bà nấu món ăn sáng để ăn tối nên rất vui và lạ." },
    ],
  },
  speaking: {
    repeat: [
      { en: "The cook is frying an egg in a pan.", vi: "Người nấu đang chiên trứng trong chảo." },
      { en: "There are apples and bananas on the table.", vi: "Có táo và chuối trên bàn." },
    ],
    guided: { q: "What is your favourite breakfast food?", vi: "Món ăn sáng bạn thích nhất là gì?", hint: "My favourite breakfast is ___." },
    describe: {
      prompt: "Look at the kitchen picture. Describe it in 3–5 sentences. Use \"There is/are\" and one \"is + V-ing\".",
      vi: "Nhìn bức tranh nhà bếp. Mô tả 3–5 câu, dùng \"There is/are\" và một câu \"is + V-ing\".",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"to cook in hot oil in a pan\"?", vi: "Từ nào nghĩa là \"nấu trong dầu nóng ở chảo\"?",
        options: ["fry", "slice", "taste"], answer: "fry" },
      { type: "sentence", q: "Which sentence does NOT match the kitchen?", vi: "Câu nào KHÔNG khớp với nhà bếp?",
        options: ["The cook is frying an egg.", "There is fresh bread.", "The cook is swimming in the pan."], answer: "The cook is swimming in the pan.",
        explainVi: "Không ai bơi trong chảo được — câu này vô lý." },
      { type: "listening", q: "In the story, what food did Maple see on the table?", vi: "Trong truyện, Maple thấy món gì trên bàn?",
        options: ["An apple, a banana and bread", "Pizza and soda", "Rice and fish"], answer: "An apple, a banana and bread" },
      { type: "sentence", q: "Which sentence is correct?", vi: "Câu nào đúng ngữ pháp?",
        options: ["The cook is frying an egg.", "The cook frying an egg.", "The cook is fry an egg."], answer: "The cook is frying an egg.",
        explainVi: "Hiện tại tiếp diễn: is + V-ing (frying)." },
    ],
  },
};

/* ============ Unit 3: In the Classroom ============ */
const IN_THE_CLASSROOM: Lesson = {
  id: "classroom", theme: "everyday-town", title: "In the Classroom", vi: "Trong lớp học", ageRange: "9–12",
  sceneImage: "/assets/images/gen/scene-classroom.webp",
  vocab: [
    { word: "map", ipa: "/mæp/", vi: "bản đồ", emoji: "🗺️", example: "The teacher points at the map.", exampleVi: "Cô giáo chỉ vào bản đồ." },
    { word: "experiment", ipa: "/ɪkˈsperɪmənt/", vi: "thí nghiệm", emoji: "🧪", example: "We do a science experiment.", exampleVi: "Chúng mình làm thí nghiệm khoa học." },
    { word: "raise", ipa: "/reɪz/", vi: "giơ (tay) lên", emoji: "✋", example: "Raise your hand to answer.", exampleVi: "Giơ tay lên để trả lời." },
    { word: "answer", ipa: "/ˈænsər/", vi: "trả lời", emoji: "🙋", example: "She wants to answer the question.", exampleVi: "Bạn ấy muốn trả lời câu hỏi." },
    { word: "backpack", ipa: "/ˈbækpæk/", vi: "ba lô", emoji: "🎒", example: "My backpack is on the floor.", exampleVi: "Ba lô của mình ở dưới sàn." },
    { word: "curious", ipa: "/ˈkjʊəriəs/", vi: "tò mò", emoji: "🤔", example: "The curious boy asks many questions.", exampleVi: "Cậu bé tò mò hỏi nhiều câu." },
    { word: "explain", ipa: "/ɪkˈspleɪn/", vi: "giải thích", emoji: "👩‍🏫", example: "The teacher explains the lesson.", exampleVi: "Cô giáo giải thích bài học." },
    { word: "quiet", ipa: "/ˈkwaɪət/", vi: "yên lặng", emoji: "🤫", example: "Please be quiet and listen.", exampleVi: "Hãy yên lặng và lắng nghe." },
  ],
  patterns: [
    { pattern: "What is … doing?", vi: "… đang làm gì?", examples: [
      { en: "What is the teacher doing?", vi: "Cô giáo đang làm gì?" },
      { en: "What is the boy doing?", vi: "Cậu bé đang làm gì?" }] },
    { pattern: "He / She is + V-ing …", vi: "Cậu ấy / cô ấy đang …", examples: [
      { en: "She is raising her hand.", vi: "Bạn ấy đang giơ tay." },
      { en: "He is reading a book.", vi: "Cậu ấy đang đọc sách." }] },
    { pattern: "Can you … , please?", vi: "Bạn có thể … không?", examples: [
      { en: "Can you help me, please?", vi: "Bạn giúp mình được không?" },
      { en: "Can you answer the question?", vi: "Bạn trả lời câu hỏi nhé?" }] },
    { pattern: "I want to …", vi: "Mình muốn …", examples: [
      { en: "I want to ask a question.", vi: "Mình muốn hỏi một câu." },
      { en: "I want to try the experiment.", vi: "Mình muốn thử làm thí nghiệm." }] },
  ],
  listening: {
    intro: "Listen to Maple's classroom story, then answer.",
    introVi: "Nghe chuyện trong lớp của Maple rồi trả lời.",
    script: "It was science class. The teacher was pointing at the world map and explaining about volcanoes. Theo was very curious, so he raised his hand to ask a question. Near the window, two students were doing a volcano experiment. Suddenly, a paper airplane flew across the room and landed on the floor. Everyone laughed, and the teacher smiled and said, \"Okay, let's be quiet again.\"",
    questions: [
      { q: "What was the teacher explaining about?", vi: "Cô giáo đang giải thích về điều gì?",
        options: ["Volcanoes", "Animals", "Sports"], answer: "Volcanoes" },
      { q: "Why did Theo raise his hand?", vi: "Vì sao Theo giơ tay?",
        options: ["He was curious and wanted to ask", "He wanted to sleep", "He wanted to go home"], answer: "He was curious and wanted to ask",
        explainVi: "Theo tò mò nên giơ tay để hỏi." },
      { q: "What flew across the room?", vi: "Vật gì bay ngang qua lớp?",
        options: ["A paper airplane", "A bird", "A ball"], answer: "A paper airplane" },
    ],
  },
  speaking: {
    repeat: [
      { en: "The teacher is pointing at the world map.", vi: "Cô giáo đang chỉ vào bản đồ thế giới." },
      { en: "The curious boy is raising his hand.", vi: "Cậu bé tò mò đang giơ tay." },
    ],
    guided: { q: "What do you like to do in class?", vi: "Bạn thích làm gì trong lớp?", hint: "In class, I like to ___." },
    describe: {
      prompt: "Look at the classroom picture. Describe it in 3–5 sentences. Use \"is + V-ing\" and one question.",
      vi: "Nhìn bức tranh lớp học. Mô tả 3–5 câu, dùng \"is + V-ing\" và một câu hỏi.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"to lift your hand up\"?", vi: "Từ nào nghĩa là \"đưa tay lên\"?",
        options: ["raise", "explain", "answer"], answer: "raise" },
      { type: "sentence", q: "Which sentence does NOT match the classroom?", vi: "Câu nào KHÔNG khớp với lớp học?",
        options: ["The teacher is explaining the lesson.", "A boy is reading a book.", "The classroom is empty and dark."], answer: "The classroom is empty and dark.",
        explainVi: "Lớp đang học đông vui, không thể trống và tối." },
      { type: "listening", q: "In the story, what landed on the floor?", vi: "Trong truyện, vật gì rơi xuống sàn?",
        options: ["A paper airplane", "A book", "A backpack"], answer: "A paper airplane" },
      { type: "reading", q: "Read: “The girl raises her hand to answer.” What does she want to do?", vi: "Đọc câu trên. Bạn nữ muốn làm gì?",
        options: ["Answer a question", "Leave the room", "Go to sleep"], answer: "Answer a question", explainVi: "Giơ tay để phát biểu/trả lời." },
    ],
  },
};

/* ============ Unit 4: At the Supermarket ============ */
const AT_THE_SUPERMARKET: Lesson = {
  id: "supermarket", theme: "everyday-town", title: "At the Supermarket", vi: "Ở siêu thị", ageRange: "9–12",
  sceneImage: "/assets/images/gen/scene-supermarket.webp",
  vocab: [
    { word: "cart", ipa: "/kɑːrt/", vi: "xe đẩy", emoji: "🛒", example: "The boy pushes a shopping cart.", exampleVi: "Cậu bé đẩy xe hàng." },
    { word: "list", ipa: "/lɪst/", vi: "danh sách", emoji: "📝", example: "Check the shopping list.", exampleVi: "Xem lại danh sách mua sắm." },
    { word: "choose", ipa: "/tʃuːz/", vi: "chọn", emoji: "🤷", example: "Please choose one box.", exampleVi: "Hãy chọn một hộp." },
    { word: "compare", ipa: "/kəmˈper/", vi: "so sánh", emoji: "⚖️", example: "She compares two boxes.", exampleVi: "Cô ấy so sánh hai hộp." },
    { word: "cashier", ipa: "/kæˈʃɪr/", vi: "thu ngân", emoji: "🧑‍💼", example: "The cashier is at the checkout.", exampleVi: "Thu ngân ở quầy tính tiền." },
    { word: "pay", ipa: "/peɪ/", vi: "trả tiền", emoji: "💵", example: "We pay for the food.", exampleVi: "Chúng mình trả tiền đồ ăn." },
    { word: "expensive", ipa: "/ɪkˈspensɪv/", vi: "đắt", emoji: "💰", example: "This cheese is expensive.", exampleVi: "Phô mai này đắt." },
    { word: "spill", ipa: "/spɪl/", vi: "làm đổ", emoji: "💦", example: "Be careful, don't spill the bag.", exampleVi: "Cẩn thận, đừng làm đổ túi." },
  ],
  patterns: [
    { pattern: "How many … ?", vi: "Có bao nhiêu … ?", examples: [
      { en: "How many apples do you want?", vi: "Bạn muốn mấy quả táo?" },
      { en: "How many boxes are there?", vi: "Có bao nhiêu hộp?" }] },
    { pattern: "I need / I want …", vi: "Mình cần / mình muốn …", examples: [
      { en: "I need some milk.", vi: "Mình cần một ít sữa." },
      { en: "I want three oranges.", vi: "Mình muốn ba quả cam." }] },
    { pattern: "Which one …?", vi: "Cái nào …?", examples: [
      { en: "Which one do you like?", vi: "Bạn thích cái nào?" },
      { en: "Which box is cheaper?", vi: "Hộp nào rẻ hơn?" }] },
    { pattern: "Let's …", vi: "Cùng … nào", examples: [
      { en: "Let's pay at the checkout.", vi: "Cùng ra quầy trả tiền nào." },
      { en: "Let's put it in the cart.", vi: "Bỏ nó vào xe đẩy nào." }] },
  ],
  listening: {
    intro: "Listen to Maple's supermarket story, then answer.",
    introVi: "Nghe chuyện ở siêu thị của Maple rồi trả lời.",
    script: "Maple and her dad went to the supermarket with a long shopping list. Dad pushed the cart while Maple chose the fruit. She picked some green apples and three oranges. Near the cereal, a woman was comparing two boxes to find the cheaper one. Suddenly, an old lady's bag tipped over, and an orange rolled across the floor. Maple ran to help and picked it up. Then they paid at the checkout.",
    questions: [
      { q: "What fruit did Maple choose?", vi: "Maple chọn trái cây nào?",
        options: ["Green apples and oranges", "Only bananas", "Grapes and lemons"], answer: "Green apples and oranges" },
      { q: "Why was the woman comparing two boxes?", vi: "Vì sao người phụ nữ so sánh hai hộp?",
        options: ["To find the cheaper one", "To juggle them", "To hide them"], answer: "To find the cheaper one",
        explainVi: "Cô ấy so sánh để chọn hộp rẻ hơn." },
      { q: "What did Maple do when the bag tipped over?", vi: "Khi túi đổ, Maple làm gì?",
        options: ["She helped and picked up the orange", "She ran away", "She laughed"], answer: "She helped and picked up the orange" },
    ],
  },
  speaking: {
    repeat: [
      { en: "The boy is pushing a cart full of food.", vi: "Cậu bé đang đẩy xe đầy đồ ăn." },
      { en: "I need some apples and milk, please.", vi: "Mình cần một ít táo và sữa nhé." },
    ],
    guided: { q: "What do you buy at the supermarket?", vi: "Bạn mua gì ở siêu thị?", hint: "At the supermarket, I buy ___." },
    describe: {
      prompt: "Look at the supermarket picture. Describe it in 3–5 sentences. Use \"There is/are\" and one \"How many\" idea.",
      vi: "Nhìn bức tranh siêu thị. Mô tả 3–5 câu, dùng \"There is/are\" và một ý về số lượng.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"the person who takes your money\"?", vi: "Từ nào chỉ \"người nhận tiền của bạn\"?",
        options: ["cashier", "cart", "list"], answer: "cashier" },
      { type: "sentence", q: "Which sentence does NOT match a supermarket?", vi: "Câu nào KHÔNG khớp với siêu thị?",
        options: ["We pay at the checkout.", "The boy pushes a cart.", "We swim in the supermarket."], answer: "We swim in the supermarket.",
        explainVi: "Siêu thị không phải bể bơi — câu này vô lý." },
      { type: "listening", q: "In the story, what rolled across the floor?", vi: "Trong truyện, vật gì lăn trên sàn?",
        options: ["An orange", "A ball", "A bottle"], answer: "An orange" },
      { type: "sentence", q: "Choose the correct question:", vi: "Chọn câu hỏi đúng:",
        options: ["How many apples do you want?", "How many apple do you want?", "How much apples do you want?"], answer: "How many apples do you want?",
        explainVi: "Danh từ đếm được số nhiều: How many + apples." },
    ],
  },
};

/* ============ Unit 5: At the Bus Stop ============ */
const AT_THE_BUS_STOP: Lesson = {
  id: "busstop", theme: "everyday-town", title: "At the Bus Stop", vi: "Ở trạm xe buýt", ageRange: "9–12",
  sceneImage: "/assets/images/gen/scene-bus-stop-rain.webp",
  vocab: [
    { word: "rain", ipa: "/reɪn/", vi: "mưa", emoji: "🌧️", example: "It is raining at the bus stop.", exampleVi: "Trời đang mưa ở trạm xe buýt." },
    { word: "umbrella", ipa: "/ʌmˈbrelə/", vi: "cái ô, dù", emoji: "☂️", example: "She opens a yellow umbrella.", exampleVi: "Bà ấy mở chiếc ô vàng." },
    { word: "watch", ipa: "/wɒtʃ/", vi: "đồng hồ đeo tay", emoji: "⌚", example: "The man looks at his watch.", exampleVi: "Chú ấy nhìn đồng hồ." },
    { word: "late", ipa: "/leɪt/", vi: "trễ, muộn", emoji: "⏰", example: "I don't want to be late.", exampleVi: "Mình không muốn bị trễ." },
    { word: "wait", ipa: "/weɪt/", vi: "đợi, chờ", emoji: "🚏", example: "We wait for the bus.", exampleVi: "Chúng mình đợi xe buýt." },
    { word: "ticket", ipa: "/ˈtɪkɪt/", vi: "vé", emoji: "🎫", example: "He dropped his bus ticket.", exampleVi: "Cậu ấy làm rơi vé xe buýt." },
    { word: "wet", ipa: "/wet/", vi: "ướt", emoji: "💧", example: "The ground is wet.", exampleVi: "Mặt đất ướt." },
    { word: "hurry", ipa: "/ˈhɜːri/", vi: "vội, nhanh lên", emoji: "🏃", example: "Hurry, the bus is coming!", exampleVi: "Nhanh lên, xe buýt tới rồi!" },
  ],
  patterns: [
    { pattern: "It is + weather …", vi: "Trời đang …", examples: [
      { en: "It is raining today.", vi: "Hôm nay trời mưa." },
      { en: "It is cold and wet.", vi: "Trời lạnh và ẩm ướt." }] },
    { pattern: "… might / could …", vi: "… có thể …", examples: [
      { en: "He might miss the bus.", vi: "Chú ấy có thể lỡ xe buýt." },
      { en: "The boy could trip and fall.", vi: "Cậu bé có thể vấp ngã." }] },
    { pattern: "What time …?", vi: "Mấy giờ …?", examples: [
      { en: "What time is the bus?", vi: "Mấy giờ có xe buýt?" },
      { en: "What time is it now?", vi: "Bây giờ là mấy giờ?" }] },
    { pattern: "I think … will …", vi: "Mình nghĩ … sẽ …", examples: [
      { en: "I think the bus will come soon.", vi: "Mình nghĩ xe buýt sắp tới." },
      { en: "I think it will stop raining.", vi: "Mình nghĩ trời sẽ tạnh mưa." }] },
  ],
  listening: {
    intro: "Listen to Maple's rainy-day story, then answer.",
    introVi: "Nghe chuyện ngày mưa của Maple rồi trả lời.",
    script: "It was a rainy autumn afternoon. Maple was waiting at the bus stop under a yellow umbrella. A man kept looking at his watch because he did not want to be late. A boy was running to catch the bus, but his shoelace was untied. \"Be careful!\" Maple shouted. Just then, the blue bus came around the corner, and everyone hurried to get on.",
    questions: [
      { q: "Why did the man keep looking at his watch?", vi: "Vì sao chú ấy cứ nhìn đồng hồ?",
        options: ["He did not want to be late", "He was sleepy", "He lost his umbrella"], answer: "He did not want to be late",
        explainVi: "Chú xem giờ vì sợ bị trễ." },
      { q: "What was wrong with the running boy?", vi: "Cậu bé đang chạy gặp vấn đề gì?",
        options: ["His shoelace was untied", "He had no bag", "He was too tall"], answer: "His shoelace was untied" },
      { q: "What came around the corner at the end?", vi: "Cuối truyện, vật gì xuất hiện ở khúc quanh?",
        options: ["The blue bus", "A big dog", "A red car"], answer: "The blue bus" },
    ],
  },
  speaking: {
    repeat: [
      { en: "It is raining, so I need my umbrella.", vi: "Trời mưa nên mình cần cái ô." },
      { en: "The blue bus is coming to the stop.", vi: "Xe buýt xanh đang tới trạm." },
    ],
    guided: { q: "What do you do on a rainy day?", vi: "Ngày mưa bạn thường làm gì?", hint: "On a rainy day, I ___." },
    describe: {
      prompt: "Look at the bus stop picture. Describe it in 3–5 sentences. Talk about the weather and use one \"might\" or \"could\".",
      vi: "Nhìn bức tranh trạm xe buýt. Mô tả 3–5 câu, nói về thời tiết và dùng một câu \"might/could\".",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"not on time\"?", vi: "Từ nào nghĩa là \"không đúng giờ\"?",
        options: ["late", "wet", "wait"], answer: "late" },
      { type: "sentence", q: "Which sentence is a prediction about the future?", vi: "Câu nào là dự đoán về tương lai?",
        options: ["The bus might come soon.", "The ground is wet.", "A man is waiting."], answer: "The bus might come soon.",
        explainVi: "\"might\" nói về điều có thể xảy ra sắp tới." },
      { type: "listening", q: "In the story, why was the man looking at his watch?", vi: "Trong truyện, vì sao chú ấy nhìn đồng hồ?",
        options: ["He did not want to be late", "He was hungry", "He lost his ticket"], answer: "He did not want to be late" },
      { type: "reading", q: "Read: “The man keeps checking his watch because the bus is late.” Why is he worried?", vi: "Đọc câu trên. Vì sao chú ấy lo lắng?",
        options: ["He might be late", "He is hungry", "He lost a shoe"], answer: "He might be late", explainVi: "Xe trễ nên chú lo bị muộn giờ." },
    ],
  },
};

/* ============ Unit 6: At the Library ============ */
const AT_THE_LIBRARY: Lesson = {
  id: "library", theme: "everyday-town", title: "At the Library", vi: "Ở thư viện", ageRange: "9–12",
  sceneImage: "/assets/images/gen/scene-library.webp",
  vocab: [
    { word: "library", ipa: "/ˈlaɪbrəri/", vi: "thư viện", emoji: "📚", example: "We read books in the library.", exampleVi: "Chúng mình đọc sách ở thư viện." },
    { word: "shelf", ipa: "/ʃelf/", vi: "kệ sách", emoji: "🗄️", example: "The books are on the shelf.", exampleVi: "Sách ở trên kệ." },
    { word: "borrow", ipa: "/ˈbɒroʊ/", vi: "mượn", emoji: "🙏", example: "Can I borrow this book?", exampleVi: "Mình mượn quyển sách này nhé?" },
    { word: "return", ipa: "/rɪˈtɜːrn/", vi: "trả lại", emoji: "🔁", example: "Remember to return the books.", exampleVi: "Nhớ trả lại sách nhé." },
    { word: "quiet", ipa: "/ˈkwaɪət/", vi: "yên lặng", emoji: "🤫", example: "Please be quiet in the library.", exampleVi: "Hãy giữ yên lặng trong thư viện." },
    { word: "bookmark", ipa: "/ˈbʊkmɑːrk/", vi: "dấu trang", emoji: "🔖", example: "She left a bookmark in the book.", exampleVi: "Bạn ấy để dấu trang trong sách." },
    { word: "stool", ipa: "/stuːl/", vi: "ghế đẩu", emoji: "🪑", example: "The girl stands on a stool.", exampleVi: "Bạn nữ đứng trên ghế đẩu." },
    { word: "librarian", ipa: "/laɪˈbreriən/", vi: "thủ thư", emoji: "🧑‍🏫", example: "The librarian pushes a book cart.", exampleVi: "Cô thủ thư đẩy xe sách." },
  ],
  patterns: [
    { pattern: "… is on / under / next to …", vi: "… ở trên / dưới / cạnh …", examples: [
      { en: "The backpack is under the table.", vi: "Ba lô ở dưới gầm bàn." },
      { en: "The mug is next to the glasses.", vi: "Cái cốc ở cạnh cặp kính." }] },
    { pattern: "There is a … on the …", vi: "Có một … ở trên …", examples: [
      { en: "There is an open book on the armchair.", vi: "Có một cuốn sách mở trên ghế bành." },
      { en: "There is a stool near the shelf.", vi: "Có một cái ghế đẩu gần kệ sách." }] },
    { pattern: "You must / must not …", vi: "Bạn phải / không được …", examples: [
      { en: "You must be quiet.", vi: "Bạn phải giữ yên lặng." },
      { en: "You must not run in the library.", vi: "Bạn không được chạy trong thư viện." }] },
    { pattern: "Can I …?", vi: "Mình có thể … không?", examples: [
      { en: "Can I borrow this book?", vi: "Mình mượn quyển sách này được không?" },
      { en: "Can I sit at this table?", vi: "Mình ngồi bàn này được chứ?" }] },
  ],
  listening: {
    intro: "Listen to Maple's library story, then answer.",
    introVi: "Nghe chuyện ở thư viện của Maple rồi trả lời.",
    script: "After school, Maple went to the library to borrow a book about space. Inside, it was very quiet. Two children were reading at a table, and a girl in a yellow sweater was reading a pink book. To reach a high shelf, another girl stood on a wooden stool. The librarian was pushing a cart full of books. Maple found her book, put a bookmark inside, and remembered to be quiet.",
    questions: [
      { q: "What book did Maple want to borrow?", vi: "Maple muốn mượn sách về gì?",
        options: ["A book about space", "A cookbook", "A comic about cars"], answer: "A book about space" },
      { q: "How did the girl reach the high shelf?", vi: "Bạn nữ với tới kệ cao bằng cách nào?",
        options: ["She stood on a wooden stool", "She jumped", "She climbed the shelf"], answer: "She stood on a wooden stool",
        explainVi: "Bạn ấy đứng lên ghế đẩu để với." },
      { q: "What was the librarian doing?", vi: "Cô thủ thư đang làm gì?",
        options: ["Pushing a book cart", "Cooking soup", "Sleeping"], answer: "Pushing a book cart" },
    ],
  },
  speaking: {
    repeat: [
      { en: "The library is calm and quiet.", vi: "Thư viện yên tĩnh và êm đềm." },
      { en: "There is a backpack under the table.", vi: "Có một chiếc ba lô dưới gầm bàn." },
    ],
    guided: { q: "What kind of books do you like?", vi: "Bạn thích loại sách nào?", hint: "I like books about ___." },
    describe: {
      prompt: "Look at the library picture. Describe it in 3–5 sentences. Use position words like \"under\", \"on\" and \"next to\".",
      vi: "Nhìn bức tranh thư viện. Mô tả 3–5 câu, dùng từ chỉ vị trí như \"under\", \"on\", \"next to\".",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"to take a book and give it back later\"?", vi: "Từ nào nghĩa là \"lấy sách và trả lại sau\"?",
        options: ["borrow", "explain", "hurry"], answer: "borrow" },
      { type: "sentence", q: "Which sentence tells a library rule?", vi: "Câu nào nói về nội quy thư viện?",
        options: ["You must be quiet.", "The books are colourful.", "The window is big."], answer: "You must be quiet.",
        explainVi: "\"You must be quiet\" là một nội quy của thư viện." },
      { type: "listening", q: "In the story, where did the girl stand to reach the shelf?", vi: "Trong truyện, bạn nữ đứng lên đâu để với kệ?",
        options: ["On a wooden stool", "On a chair", "On the table"], answer: "On a wooden stool" },
      { type: "reading", q: "Read: “Please be quiet in the library.” What should you NOT do?", vi: "Đọc câu trên. Bạn KHÔNG nên làm gì?",
        options: ["Shout and run", "Read a book", "Sit at a table"], answer: "Shout and run", explainVi: "Thư viện cần yên lặng nên không hò hét, chạy nhảy." },
    ],
  },
};

/* ============ Unit 7: At the Science Fair ============ */
const AT_THE_SCIENCE_FAIR: Lesson = {
  id: "sciencefair", theme: "discovery-days", title: "At the Science Fair", vi: "Ở hội chợ khoa học", ageRange: "9–12",
  sceneImage: "/assets/images/learn/level-1/level-1-unit-07-at-the-science-fair.webp",
  vocab: [
    { word: "project", ipa: "/ˈprɒdʒekt/", vi: "dự án", emoji: "📋", example: "This is my science project.", exampleVi: "Đây là dự án khoa học của mình." },
    { word: "model", ipa: "/ˈmɒdl/", vi: "mô hình", emoji: "🗼", example: "She built a model of a wind turbine.", exampleVi: "Bạn ấy làm một mô hình tua-bin gió." },
    { word: "volcano", ipa: "/vɒlˈkeɪnoʊ/", vi: "núi lửa", emoji: "🌋", example: "The clay volcano is red.", exampleVi: "Mô hình núi lửa màu đỏ." },
    { word: "erupt", ipa: "/ɪˈrʌpt/", vi: "phun trào", emoji: "💥", example: "The volcano is about to erupt.", exampleVi: "Núi lửa sắp phun trào." },
    { word: "turbine", ipa: "/ˈtɜːrbaɪn/", vi: "tua-bin (gió)", emoji: "🌬️", example: "The wind turbine spins in the wind.", exampleVi: "Tua-bin gió quay khi có gió." },
    { word: "judge", ipa: "/dʒʌdʒ/", vi: "giám khảo", emoji: "🧑‍⚖️", example: "The judge looks at every project.", exampleVi: "Giám khảo xem từng dự án." },
    { word: "ribbon", ipa: "/ˈrɪbən/", vi: "huy hiệu ruy-băng", emoji: "🎗️", example: "The best project wins a blue ribbon.", exampleVi: "Dự án tốt nhất được huy hiệu xanh." },
    { word: "present", ipa: "/prɪˈzent/", vi: "trình bày", emoji: "🙋", example: "She presents her project to the judge.", exampleVi: "Bạn ấy trình bày dự án cho giám khảo." },
  ],
  patterns: [
    { pattern: "This is my project about …", vi: "Đây là dự án của mình về …", examples: [
      { en: "This is my project about wind energy.", vi: "Đây là dự án của mình về năng lượng gió." },
      { en: "This is my project about volcanoes.", vi: "Đây là dự án của mình về núi lửa." }] },
    { pattern: "It works by + V-ing …", vi: "Nó hoạt động bằng cách …", examples: [
      { en: "It works by spinning in the wind.", vi: "Nó hoạt động bằng cách quay trong gió." },
      { en: "The car works by using the sun.", vi: "Chiếc xe chạy bằng cách dùng năng lượng mặt trời." }] },
    { pattern: "First … , then …", vi: "Đầu tiên … , sau đó …", examples: [
      { en: "First we pour the liquid, then it erupts.", vi: "Đầu tiên đổ dung dịch, sau đó nó phun trào." },
      { en: "First I build it, then I test it.", vi: "Đầu tiên mình dựng lên, sau đó thử nghiệm." }] },
    { pattern: "I think … will win because …", vi: "Mình nghĩ … sẽ thắng vì …", examples: [
      { en: "I think the turbine will win because it really spins.", vi: "Mình nghĩ tua-bin sẽ thắng vì nó quay thật." },
      { en: "I think the volcano will win because it looks amazing.", vi: "Mình nghĩ núi lửa sẽ thắng vì trông rất ấn tượng." }] },
  ],
  listening: {
    intro: "Listen to Maple's science fair story, then answer.",
    introVi: "Nghe chuyện ở hội chợ khoa học của Maple rồi trả lời.",
    script: "The school gym was full of science projects. A girl in a teal cardigan was presenting a white wind turbine that really spun. Next to her, a boy poured liquid into a clay volcano, and it erupted with red foam. A teacher with a clipboard was the judge. She walked around slowly and looked at every project. On another table, a boy tested a small bridge by adding heavy weights. At the end, the judge gave a blue ribbon to the best project. Maple could not wait to build her own model next year.",
    questions: [
      { q: "What was the girl in the teal cardigan presenting?", vi: "Bạn nữ áo teal đang trình bày gì?",
        options: ["A wind turbine", "A volcano", "A toy car"], answer: "A wind turbine" },
      { q: "Why did the clay volcano erupt?", vi: "Vì sao mô hình núi lửa phun trào?",
        options: ["A boy poured liquid into it", "It was very hot", "Someone kicked it"], answer: "A boy poured liquid into it",
        explainVi: "Cậu bé đổ dung dịch vào nên núi lửa phun trào." },
      { q: "What did the judge give to the best project?", vi: "Giám khảo trao gì cho dự án tốt nhất?",
        options: ["A blue ribbon", "A gold coin", "A new book"], answer: "A blue ribbon" },
    ],
  },
  speaking: {
    repeat: [
      { en: "This is my project about wind energy.", vi: "Đây là dự án của mình về năng lượng gió." },
      { en: "The judge is looking at every project.", vi: "Giám khảo đang xem từng dự án." },
    ],
    guided: { q: "What project would you like to make?", vi: "Bạn muốn làm dự án gì?", hint: "I would like to make a ___." },
    describe: {
      prompt: "Look at the science fair picture. Describe it in 3–5 sentences. Use \"is + V-ing\" and one \"because\".",
      vi: "Nhìn bức tranh hội chợ khoa học. Mô tả 3–5 câu, dùng \"is + V-ing\" và một câu \"because\".",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Who is the person that decides the best project?", vi: "Ai là người quyết định dự án tốt nhất?",
        options: ["The judge", "The cook", "The driver"], answer: "The judge" },
      { type: "sentence", q: "Which sentence does NOT match a science fair?", vi: "Câu nào KHÔNG khớp với hội chợ khoa học?",
        options: ["A girl is presenting a model.", "The judge is looking at projects.", "A shark is swimming in the gym."], answer: "A shark is swimming in the gym.",
        explainVi: "Không có cá mập bơi trong nhà thi đấu — câu này vô lý." },
      { type: "listening", q: "In the story, how did the boy test the small bridge?", vi: "Trong truyện, cậu bé thử cây cầu nhỏ bằng cách nào?",
        options: ["By adding heavy weights", "By pouring water on it", "By painting it"], answer: "By adding heavy weights" },
      { type: "reading", q: "Read: “The wind turbine spins fast when the fan blows.” What makes it move?", vi: "Đọc câu trên. Điều gì làm tua-bin quay?",
        options: ["The wind (air)", "The rain", "The sun"], answer: "The wind (air)", explainVi: "Quạt thổi ra gió (không khí) làm tua-bin quay." },
    ],
  },
};

/* ============ Unit 8: At the Science Museum ============ */
const AT_THE_SCIENCE_MUSEUM: Lesson = {
  id: "sciencemuseum", theme: "discovery-days", title: "At the Science Museum", vi: "Ở bảo tàng khoa học", ageRange: "9–12",
  sceneImage: "/assets/images/learn/level-1/level-1-unit-08-at-the-science-museum.webp",
  vocab: [
    { word: "museum", ipa: "/mjuˈziːəm/", vi: "bảo tàng", emoji: "🏛️", example: "We are visiting the science museum.", exampleVi: "Chúng mình đang tham quan bảo tàng khoa học." },
    { word: "skeleton", ipa: "/ˈskelɪtn/", vi: "bộ xương", emoji: "🦴", example: "The dinosaur skeleton is huge.", exampleVi: "Bộ xương khủng long rất to." },
    { word: "dinosaur", ipa: "/ˈdaɪnəsɔːr/", vi: "khủng long", emoji: "🦖", example: "The dinosaur lived long ago.", exampleVi: "Khủng long sống từ rất lâu." },
    { word: "fossil", ipa: "/ˈfɒsl/", vi: "hoá thạch", emoji: "🐚", example: "This fossil is millions of years old.", exampleVi: "Hoá thạch này hàng triệu năm tuổi." },
    { word: "planet", ipa: "/ˈplænɪt/", vi: "hành tinh", emoji: "🪐", example: "The planets hang from the ceiling.", exampleVi: "Các hành tinh treo trên trần." },
    { word: "telescope", ipa: "/ˈtelɪskoʊp/", vi: "kính thiên văn", emoji: "🔭", example: "He looks at the sky through a telescope.", exampleVi: "Cậu ấy nhìn bầu trời qua kính thiên văn." },
    { word: "magnet", ipa: "/ˈmæɡnɪt/", vi: "nam châm", emoji: "🧲", example: "The magnet can pull metal.", exampleVi: "Nam châm hút được kim loại." },
    { word: "rover", ipa: "/ˈroʊvər/", vi: "xe tự hành", emoji: "🤖", example: "The Mars rover has six wheels.", exampleVi: "Xe tự hành sao Hoả có sáu bánh." },
  ],
  patterns: [
    { pattern: "Look at the …!", vi: "Nhìn kìa, …!", examples: [
      { en: "Look at the huge dinosaur!", vi: "Nhìn con khủng long khổng lồ kìa!" },
      { en: "Look at the floating planets!", vi: "Nhìn các hành tinh lơ lửng kìa!" }] },
    { pattern: "How old is …?", vi: "… bao nhiêu tuổi?", examples: [
      { en: "How old is the fossil?", vi: "Hoá thạch này bao nhiêu tuổi?" },
      { en: "How old is the dinosaur skeleton?", vi: "Bộ xương khủng long bao nhiêu tuổi?" }] },
    { pattern: "The … is bigger than the …", vi: "… to hơn …", examples: [
      { en: "The dinosaur is bigger than the door.", vi: "Con khủng long to hơn cái cửa." },
      { en: "The telescope is bigger than the magnet.", vi: "Kính thiên văn to hơn cục nam châm." }] },
    { pattern: "You can … but you cannot …", vi: "Bạn được … nhưng không được …", examples: [
      { en: "You can look, but you cannot touch the fossil.", vi: "Bạn được nhìn, nhưng không được chạm vào hoá thạch." },
      { en: "You can ask, but you cannot run inside.", vi: "Bạn được hỏi, nhưng không được chạy trong bảo tàng." }] },
  ],
  listening: {
    intro: "Listen to Maple's museum story, then answer.",
    introVi: "Nghe chuyện ở bảo tàng của Maple rồi trả lời.",
    script: "At the science museum, the first thing Maple saw was a giant dinosaur skeleton, taller than the door. She touched a plasma ball, and purple light followed her fingers. A boy showed her an ammonite fossil that was millions of years old. In the middle of the room, two children were moving a model Mars rover with six wheels. Above their heads, planets floated on thin strings like a small solar system. Near the window, another boy looked at the mountains through a big telescope.",
    questions: [
      { q: "What was the first thing Maple saw?", vi: "Điều đầu tiên Maple thấy là gì?",
        options: ["A dinosaur skeleton", "A telescope", "A magnet"], answer: "A dinosaur skeleton" },
      { q: "How old was the fossil?", vi: "Hoá thạch bao nhiêu tuổi?",
        options: ["Millions of years old", "One week old", "Ten years old"], answer: "Millions of years old" },
      { q: "What was floating above the children's heads?", vi: "Vật gì lơ lửng trên đầu các bạn?",
        options: ["Planets (a solar system)", "Balloons", "Birds"], answer: "Planets (a solar system)",
        explainVi: "Các hành tinh treo dây như một hệ mặt trời nhỏ." },
    ],
  },
  speaking: {
    repeat: [
      { en: "Look at the huge dinosaur skeleton!", vi: "Nhìn bộ xương khủng long khổng lồ kìa!" },
      { en: "You can look, but you cannot touch the fossil.", vi: "Bạn được nhìn, nhưng không được chạm vào hoá thạch." },
    ],
    guided: { q: "What would you like to see in a science museum?", vi: "Bạn muốn xem gì ở bảo tàng khoa học?", hint: "I would like to see the ___." },
    describe: {
      prompt: "Look at the museum picture. Describe it in 3–5 sentences. Use \"There is/are\" and one comparison with \"bigger than\".",
      vi: "Nhìn bức tranh bảo tàng. Mô tả 3–5 câu, dùng \"There is/are\" và một câu so sánh \"bigger than\".",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"old bones or shells turned to stone\"?", vi: "Từ nào nghĩa là \"xương/vỏ cổ đã hoá đá\"?",
        options: ["fossil", "planet", "magnet"], answer: "fossil" },
      { type: "sentence", q: "Which sentence does NOT match the museum?", vi: "Câu nào KHÔNG khớp với bảo tàng?",
        options: ["A dinosaur skeleton stands in the hall.", "Planets hang from the ceiling.", "A cook is frying eggs on the stove."], answer: "A cook is frying eggs on the stove.",
        explainVi: "Nấu ăn là ở nhà bếp, không phải bảo tàng khoa học." },
      { type: "listening", q: "In the story, how many wheels did the Mars rover have?", vi: "Trong truyện, xe tự hành sao Hoả có mấy bánh?",
        options: ["Six", "Two", "Ten"], answer: "Six" },
      { type: "reading", q: "Read: “Please look but do not touch the exhibits.” What must you NOT do?", vi: "Đọc câu trên. Bạn KHÔNG được làm gì?",
        options: ["Touch the exhibits", "Look at them", "Ask questions"], answer: "Touch the exhibits", explainVi: "Nội quy: chỉ được nhìn, không được chạm vào hiện vật." },
    ],
  },
};

/* ============ Unit 9: At the Vancouver Waterfront ============ */
const AT_THE_VANCOUVER_WATERFRONT: Lesson = {
  id: "waterfront", theme: "discovery-days", title: "At the Vancouver Waterfront", vi: "Bờ nước Vancouver", ageRange: "9–12",
  sceneImage: "/assets/images/learn/level-1/level-1-unit-09-at-the-vancouver-waterfront.webp",
  vocab: [
    { word: "waterfront", ipa: "/ˈwɔːtərfrʌnt/", vi: "khu bờ nước", emoji: "🌊", example: "We walk along the waterfront.", exampleVi: "Chúng mình đi dọc khu bờ nước." },
    { word: "seawall", ipa: "/ˈsiːwɔːl/", vi: "đường kè biển", emoji: "🚶", example: "The seawall path is long and flat.", exampleVi: "Đường kè biển dài và bằng phẳng." },
    { word: "ferry", ipa: "/ˈferi/", vi: "phà", emoji: "⛴️", example: "A blue ferry sails to the pier.", exampleVi: "Một chiếc phà xanh chạy về phía cầu tàu." },
    { word: "skyline", ipa: "/ˈskaɪlaɪn/", vi: "đường chân trời thành phố", emoji: "🏙️", example: "The city skyline is across the water.", exampleVi: "Đường chân trời thành phố ở bên kia mặt nước." },
    { word: "heron", ipa: "/ˈherən/", vi: "con diệc", emoji: "🐦", example: "A grey heron stands near the rocks.", exampleVi: "Một con diệc xám đứng gần mấy tảng đá." },
    { word: "binoculars", ipa: "/bɪˈnɒkjələrz/", vi: "ống nhòm", emoji: "🔭", example: "She looks through her binoculars.", exampleVi: "Bạn ấy nhìn qua ống nhòm." },
    { word: "pier", ipa: "/pɪr/", vi: "cầu tàu", emoji: "🛳️", example: "The boat stops at the pier.", exampleVi: "Con thuyền dừng ở cầu tàu." },
    { word: "map", ipa: "/mæp/", vi: "bản đồ", emoji: "🗺️", example: "The girl reads a map of the park.", exampleVi: "Bạn nữ xem bản đồ công viên." },
  ],
  patterns: [
    { pattern: "Across the water, I can see …", vi: "Bên kia mặt nước, mình thấy …", examples: [
      { en: "Across the water, I can see tall buildings.", vi: "Bên kia mặt nước, mình thấy những toà nhà cao." },
      { en: "Across the water, I can see snowy mountains.", vi: "Bên kia mặt nước, mình thấy những ngọn núi tuyết." }] },
    { pattern: "Let's go to …", vi: "Cùng đi tới … nào", examples: [
      { en: "Let's go to the pier.", vi: "Cùng ra cầu tàu nào." },
      { en: "Let's go along the seawall.", vi: "Cùng đi dọc kè biển nào." }] },
    { pattern: "Be careful, it might …", vi: "Cẩn thận, trời có thể …", examples: [
      { en: "Be careful, it might rain.", vi: "Cẩn thận, trời có thể mưa." },
      { en: "Be careful, the path might be wet.", vi: "Cẩn thận, lối đi có thể trơn ướt." }] },
    { pattern: "Which way is …?", vi: "Đường nào tới …?", examples: [
      { en: "Which way is the ferry?", vi: "Đường nào ra bến phà?" },
      { en: "Which way is the park?", vi: "Đường nào tới công viên?" }] },
  ],
  listening: {
    intro: "Listen to Maple's waterfront story, then answer.",
    introVi: "Nghe chuyện ở bờ nước của Maple rồi trả lời.",
    script: "Maple and her friends walked along the seawall in Vancouver. Across the water, they could see tall buildings and snowy mountains. A blue and white ferry sailed slowly toward the pier. A girl used her binoculars and spotted a grey heron standing near the rocks. One boy stopped to fix the chain on his bicycle. Maple's friend held a map and pointed the way. The sky was full of grey clouds, so Maple said, \"Let's hurry, it might rain.\"",
    questions: [
      { q: "Where were Maple and her friends walking?", vi: "Maple và các bạn đang đi ở đâu?",
        options: ["Along the seawall", "In a kitchen", "Inside a library"], answer: "Along the seawall" },
      { q: "What did the girl see with her binoculars?", vi: "Bạn nữ nhìn thấy gì qua ống nhòm?",
        options: ["A grey heron", "A blue whale", "A red car"], answer: "A grey heron" },
      { q: "Why did Maple want to hurry?", vi: "Vì sao Maple muốn đi nhanh?",
        options: ["It might rain", "She was hungry", "The ferry was gone"], answer: "It might rain",
        explainVi: "Trời nhiều mây xám nên Maple lo sắp mưa." },
    ],
  },
  speaking: {
    repeat: [
      { en: "Across the water, I can see the city skyline.", vi: "Bên kia mặt nước, mình thấy đường chân trời thành phố." },
      { en: "A blue ferry is sailing to the pier.", vi: "Một chiếc phà xanh đang chạy về cầu tàu." },
    ],
    guided: { q: "What would you like to do at the waterfront?", vi: "Bạn muốn làm gì ở khu bờ nước?", hint: "At the waterfront, I would like to ___." },
    describe: {
      prompt: "Look at the waterfront picture. Describe it in 3–5 sentences. Use \"I can see\" and one \"might\".",
      vi: "Nhìn bức tranh bờ nước. Mô tả 3–5 câu, dùng \"I can see\" và một câu \"might\".",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"a boat that carries people across water\"?", vi: "Từ nào nghĩa là \"thuyền chở người qua nước\"?",
        options: ["ferry", "heron", "map"], answer: "ferry" },
      { type: "sentence", q: "Which sentence does NOT match the waterfront?", vi: "Câu nào KHÔNG khớp với khu bờ nước?",
        options: ["A ferry is sailing on the water.", "A heron stands near the rocks.", "A dinosaur is flying over the sea."], answer: "A dinosaur is flying over the sea.",
        explainVi: "Không có khủng long bay trên biển — câu này vô lý." },
      { type: "listening", q: "In the story, what did the boy stop to fix?", vi: "Trong truyện, cậu bé dừng lại để sửa gì?",
        options: ["His bicycle chain", "His shoe", "His umbrella"], answer: "His bicycle chain" },
      { type: "reading", q: "Read: “The sky is full of grey clouds.” What will probably happen?", vi: "Đọc câu trên. Điều gì có lẽ sẽ xảy ra?",
        options: ["It might rain", "It will snow ice cream", "The sun will get hotter"], answer: "It might rain", explainVi: "Trời nhiều mây xám thường báo hiệu sắp mưa." },
    ],
  },
};

/* ============ Level 1 · Unit 10: At the Community Sports Centre ============ */
const AT_THE_COMMUNITY_SPORTS_CENTRE: Lesson = {
  id: "sportscentre", theme: "everyday-town", title: "At the Community Sports Centre", vi: "Ở trung tâm thể thao", ageRange: "9–12",
  sceneImage: "/assets/images/learn/level-1/level-1-unit-10-at-the-community-sports-centre.webp",
  vocab: [
    { word: "court", ipa: "/kɔːrt/", vi: "sân (bóng rổ)", emoji: "🏀", example: "The boys are playing on the court.", exampleVi: "Các bạn đang chơi trên sân." },
    { word: "coach", ipa: "/koʊtʃ/", vi: "huấn luyện viên", emoji: "🧑‍🏫", example: "The coach has a whistle.", exampleVi: "Huấn luyện viên có một chiếc còi." },
    { word: "locker", ipa: "/ˈlɒkər/", vi: "tủ để đồ", emoji: "🔒", example: "Put your bag in the locker.", exampleVi: "Để túi vào tủ nhé." },
    { word: "water fountain", ipa: "/ˈwɔːtər ˈfaʊntən/", vi: "vòi nước uống", emoji: "🚰", example: "Fill your bottle at the water fountain.", exampleVi: "Bơm nước vào bình ở vòi nước." },
    { word: "sneakers", ipa: "/ˈsniːkərz/", vi: "giày thể thao", emoji: "👟", example: "She is tying her sneakers.", exampleVi: "Bạn ấy đang buộc giày thể thao." },
    { word: "stretch", ipa: "/stretʃ/", vi: "giãn cơ", emoji: "🤸", example: "We stretch before we run.", exampleVi: "Mình giãn cơ trước khi chạy." },
    { word: "bounce", ipa: "/baʊns/", vi: "nảy/rê bóng", emoji: "⛹️", example: "You bounce the ball with one hand.", exampleVi: "Bạn nảy bóng bằng một tay." },
    { word: "sign", ipa: "/saɪn/", vi: "biển chỉ dẫn", emoji: "🪧", example: "The sign shows where to go.", exampleVi: "Biển chỉ dẫn cho biết đi lối nào." },
  ],
  patterns: [
    { pattern: "… is / are + -ing", vi: "… đang làm gì (hiện tại tiếp diễn)", examples: [
      { en: "The boys are playing basketball.", vi: "Các bạn nam đang chơi bóng rổ." },
      { en: "She is tying her sneakers.", vi: "Bạn ấy đang buộc giày." }] },
    { pattern: "I can / I can't …", vi: "Mình có thể / không thể …", examples: [
      { en: "I can dribble the ball.", vi: "Mình có thể rê bóng." },
      { en: "I can't swim very well yet.", vi: "Mình chưa bơi giỏi lắm." }] },
    { pattern: "Where is / are the …?", vi: "… ở đâu?", examples: [
      { en: "Where is the pool?", vi: "Bể bơi ở đâu?" },
      { en: "Where are the lockers?", vi: "Các tủ để đồ ở đâu?" }] },
    { pattern: "For … , go / turn …", vi: "Muốn tới … thì đi / rẽ …", examples: [
      { en: "For basketball, go this way.", vi: "Muốn chơi bóng rổ thì đi lối này." },
      { en: "For swimming, turn left.", vi: "Muốn bơi thì rẽ trái." }] },
  ],
  listening: {
    intro: "Listen to Maple at the sports centre, then answer.",
    introVi: "Nghe Maple ở trung tâm thể thao rồi trả lời.",
    script: "Maple and her friends arrived at the community sports centre after school. Some children were already playing basketball on the court, and a girl was tying her sneakers on the bench. \"Where is the pool?\" Maple asked. The coach smiled and pointed at a big sign on the wall. The sign had pictures and arrows: a basketball with an arrow to the right, and a swimmer with an arrow to the left. \"For swimming, turn left,\" said the coach. \"For basketball, go right.\" First, the friends filled their bottles at the water fountain. Then they stretched their arms and legs. \"I can't swim very well yet,\" said Maple, \"but I can learn today!\"",
    questions: [
      { q: "What were some children doing on the court?", vi: "Vài bạn nhỏ đang làm gì trên sân?",
        options: ["Playing basketball", "Sleeping", "Reading books"], answer: "Playing basketball" },
      { q: "On the sign, which way is the pool?", vi: "Trên biển chỉ dẫn, bể bơi ở hướng nào?",
        options: ["Left", "Right", "Up"], answer: "Left",
        explainVi: "Biển có mũi tên chỉ sang trái cho bơi lội (swimming)." },
      { q: "What did the friends do before they started?", vi: "Các bạn làm gì trước khi bắt đầu?",
        options: ["Filled bottles and stretched", "Went home", "Turned off the lights"], answer: "Filled bottles and stretched" },
    ],
  },
  speaking: {
    repeat: [
      { en: "The boys are playing basketball on the court.", vi: "Các bạn nam đang chơi bóng rổ trên sân." },
      { en: "I can dribble, but I can't swim very well yet.", vi: "Mình rê bóng được, nhưng chưa bơi giỏi lắm." },
    ],
    guided: { q: "What can you do at a sports centre?", vi: "Bạn có thể làm gì ở trung tâm thể thao?", hint: "I can ___ at the sports centre." },
    describe: {
      prompt: "Look at the sports centre picture. Describe it in 3–5 sentences. Use one \"…is/are …-ing\", one \"I can/can't\", and one \"Where is…?\".",
      vi: "Nhìn tranh trung tâm thể thao. Mô tả 3–5 câu, dùng một câu \"…đang…\", một câu \"I can/can't\", và một câu \"Where is…?\".",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"the place where you play basketball\"?", vi: "Từ nào nghĩa là \"nơi bạn chơi bóng rổ\"?",
        options: ["court", "locker", "sign"], answer: "court" },
      { type: "sentence", q: "Which sentence is present continuous (happening now)?", vi: "Câu nào ở hiện tại tiếp diễn (đang xảy ra)?",
        options: ["She is tying her sneakers.", "She ties her sneakers every day.", "She tied her sneakers yesterday."], answer: "She is tying her sneakers.",
        explainVi: "\"is + V-ing\" diễn tả việc đang xảy ra ngay lúc này." },
      { type: "reading", q: "The sign shows a swimmer with an arrow pointing left. Which way do you go for the pool?", vi: "Biển có hình người bơi và mũi tên chỉ sang trái. Đi lối nào tới bể bơi?",
        options: ["Turn left", "Turn right", "Go straight up"], answer: "Turn left" },
      { type: "listening", q: "What did Maple say she could NOT do well yet?", vi: "Maple nói mình CHƯA làm giỏi việc gì?",
        options: ["Swim", "Walk", "Talk"], answer: "Swim" },
    ],
  },
};

/* ============ Level 2 · Stories & Situations — bài kể chuyện (nhiều bước) ============ */
/* Unit 1: The Missing Backpack */
const THE_MISSING_BACKPACK: Lesson = {
  id: "backpack", theme: "story-time", title: "The Missing Backpack", vi: "Chiếc ba lô thất lạc", ageRange: "9–12",
  sceneImage: "/assets/images/learn/level-2/level-2-unit-01-missing-backpack.webp",
  vocab: [
    { word: "clue", ipa: "/kluː/", vi: "manh mối", emoji: "🔍", example: "The notebook is our first clue.", exampleVi: "Quyển vở là manh mối đầu tiên." },
    { word: "missing", ipa: "/ˈmɪsɪŋ/", vi: "mất, thất lạc", emoji: "❓", example: "Theo's backpack is missing.", exampleVi: "Ba lô của Theo bị thất lạc." },
    { word: "hallway", ipa: "/ˈhɔːlweɪ/", vi: "hành lang", emoji: "🚪", example: "They searched the hallway.", exampleVi: "Các bạn tìm khắp hành lang." },
    { word: "locker", ipa: "/ˈlɒkər/", vi: "tủ khoá", emoji: "🔒", example: "The lockers are teal and tall.", exampleVi: "Những cái tủ khoá màu teal và cao." },
    { word: "search", ipa: "/sɜːrtʃ/", vi: "tìm kiếm", emoji: "🕵️", example: "Let's search near the bench.", exampleVi: "Mình tìm gần cái ghế nhé." },
    { word: "notice", ipa: "/ˈnoʊtɪs/", vi: "để ý, nhận ra", emoji: "👀", example: "Maple noticed a green notebook.", exampleVi: "Maple để ý thấy một quyển vở xanh." },
    { word: "follow", ipa: "/ˈfɒloʊ/", vi: "đi theo, lần theo", emoji: "➡️", example: "They followed the clues.", exampleVi: "Các bạn lần theo các manh mối." },
    { word: "trail", ipa: "/treɪl/", vi: "dấu vết", emoji: "🐾", example: "The dropped items made a trail.", exampleVi: "Những món rơi ra tạo thành một dấu vết." },
  ],
  patterns: [
    { pattern: "Have you seen …?", vi: "Bạn có thấy … không?", examples: [
      { en: "Have you seen my backpack?", vi: "Bạn có thấy ba lô của mình không?" },
      { en: "Have you seen a green notebook?", vi: "Bạn có thấy quyển vở xanh không?" }] },
    { pattern: "It must be …", vi: "Chắc hẳn nó ở/là …", examples: [
      { en: "It must be near the library.", vi: "Chắc hẳn nó ở gần thư viện." },
      { en: "This must be Theo's card.", vi: "Đây chắc chắn là thẻ của Theo." }] },
    { pattern: "Let's look under / behind / near …", vi: "Cùng nhìn dưới / sau / gần …", examples: [
      { en: "Let's look under the bench.", vi: "Cùng nhìn dưới ghế nào." },
      { en: "Let's look near the lockers.", vi: "Cùng tìm gần dãy tủ khoá nào." }] },
    { pattern: "Maybe … dropped it.", vi: "Có lẽ … đã đánh rơi nó.", examples: [
      { en: "Maybe Theo dropped it here.", vi: "Có lẽ Theo đánh rơi nó ở đây." },
      { en: "Maybe someone dropped the card.", vi: "Có lẽ ai đó đã đánh rơi cái thẻ." }] },
  ],
  listening: {
    intro: "Listen to the story, then answer. Look for the clues!",
    introVi: "Nghe câu chuyện rồi trả lời. Hãy chú ý các manh mối!",
    script: "\"Oh no! My backpack is missing!\" said Theo. Maple and her friends looked around the school hallway. Near the wooden bench, they noticed a green notebook on the floor. A little farther, they found a blue student ID card, and then a teal water bottle. \"These are clues!\" said Maple. \"Someone dropped them in a line.\" One boy opened a map of the school to see where the line was going. They followed the trail down the hallway. It led all the way to the library. There, on a chair, sat Theo's blue backpack. A kind student had found it and kept it safe.",
    questions: [
      { q: "What did the friends notice first on the floor?", vi: "Đầu tiên các bạn để ý thấy gì trên sàn?",
        options: ["A green notebook", "A blue backpack", "A pair of shoes"], answer: "A green notebook" },
      { q: "Why did Maple call the items \"clues\"?", vi: "Vì sao Maple gọi những món đó là \"manh mối\"?",
        options: ["They were dropped in a line leading somewhere", "They were all red", "They were toys"], answer: "They were dropped in a line leading somewhere",
        explainVi: "Đồ rơi thành một hàng chỉ về một hướng nên là manh mối để lần theo." },
      { q: "Where was the backpack at the end?", vi: "Cuối truyện, chiếc ba lô ở đâu?",
        options: ["In the library", "In the kitchen", "On the bus"], answer: "In the library" },
    ],
  },
  speaking: {
    repeat: [
      { en: "Have you seen my missing backpack?", vi: "Bạn có thấy chiếc ba lô thất lạc của mình không?" },
      { en: "Let's follow the clues down the hallway.", vi: "Cùng lần theo manh mối dọc hành lang nào." },
    ],
    guided: { q: "What would you do to find a lost bag?", vi: "Bạn sẽ làm gì để tìm một chiếc túi bị mất?", hint: "First, I would ___." },
    describe: {
      prompt: "Tell the story in 3–5 sentences. Use \"First\", \"Then\", and \"Finally\" to put the events in order.",
      vi: "Kể lại câu chuyện 3–5 câu, dùng \"First\", \"Then\", \"Finally\" để sắp xếp sự việc theo thứ tự.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"a hint that helps you solve a mystery\"?", vi: "Từ nào nghĩa là \"gợi ý giúp giải bí ẩn\"?",
        options: ["clue", "locker", "hallway"], answer: "clue" },
      { type: "reading", q: "Which item did they find FIRST?", vi: "Món nào các bạn tìm thấy ĐẦU TIÊN?",
        options: ["The notebook", "The water bottle", "The ID card"], answer: "The notebook",
        explainVi: "Thứ tự trong truyện: vở → thẻ → bình nước." },
      { type: "listening", q: "Why did a boy open a map of the school?", vi: "Vì sao một cậu bé mở bản đồ trường?",
        options: ["To see where the trail was going", "To draw a picture", "To fold a plane"], answer: "To see where the trail was going" },
      { type: "reading", q: "Read: “The backpack was safe on a chair.” How does Theo feel now?", vi: "Đọc câu trên. Bây giờ Theo cảm thấy thế nào?",
        options: ["Relieved and happy", "Angry", "Sleepy"], answer: "Relieved and happy", explainVi: "Tìm lại được ba lô nên Theo nhẹ nhõm và vui." },
    ],
  },
};

/* Unit 2: The Stormy Camping Trip */
const THE_STORMY_CAMPING_TRIP: Lesson = {
  id: "camping", theme: "story-time", title: "The Stormy Camping Trip", vi: "Chuyến cắm trại giông bão", ageRange: "9–12",
  sceneImage: "/assets/images/learn/level-2/level-2-unit-02-stormy-camping-trip.webp",
  vocab: [
    { word: "storm", ipa: "/stɔːrm/", vi: "cơn bão", emoji: "⛈️", example: "A storm started at night.", exampleVi: "Một cơn bão nổi lên vào ban đêm." },
    { word: "tent", ipa: "/tent/", vi: "lều", emoji: "⛺", example: "The tent started to shake.", exampleVi: "Cái lều bắt đầu rung lắc." },
    { word: "peg", ipa: "/peɡ/", vi: "cọc lều", emoji: "📌", example: "She hammered the tent pegs.", exampleVi: "Bạn ấy đóng cọc lều xuống đất." },
    { word: "flashlight", ipa: "/ˈflæʃlaɪt/", vi: "đèn pin", emoji: "🔦", example: "He grabbed the flashlight from the bag.", exampleVi: "Cậu ấy lấy đèn pin từ trong túi." },
    { word: "shelter", ipa: "/ˈʃeltər/", vi: "chỗ trú", emoji: "🏕️", example: "The wooden shelter has a warm light.", exampleVi: "Chỗ trú bằng gỗ có ánh đèn ấm áp." },
    { word: "soaked", ipa: "/soʊkt/", vi: "ướt sũng", emoji: "💧", example: "Their jackets were soaked.", exampleVi: "Áo khoác của các bạn ướt sũng." },
    { word: "thunder", ipa: "/ˈθʌndər/", vi: "sấm", emoji: "🌩️", example: "The thunder was very loud.", exampleVi: "Tiếng sấm rất to." },
    { word: "team", ipa: "/tiːm/", vi: "đội, nhóm", emoji: "🤝", example: "They worked as a team.", exampleVi: "Các bạn phối hợp như một đội." },
  ],
  patterns: [
    { pattern: "We need to … quickly.", vi: "Chúng ta cần … nhanh lên.", examples: [
      { en: "We need to move quickly.", vi: "Chúng ta cần di chuyển nhanh." },
      { en: "We need to find shelter quickly.", vi: "Chúng ta cần tìm chỗ trú nhanh." }] },
    { pattern: "It is …ing hard.", vi: "Trời đang … rất to.", examples: [
      { en: "It is raining hard.", vi: "Trời đang mưa rất to." },
      { en: "The wind is blowing hard.", vi: "Gió đang thổi rất mạnh." }] },
    { pattern: "Let's move to …", vi: "Cùng chuyển tới … nào", examples: [
      { en: "Let's move to the shelter.", vi: "Cùng chuyển tới chỗ trú nào." },
      { en: "Let's move under the trees.", vi: "Cùng nấp dưới hàng cây nào." }] },
    { pattern: "Don't worry, we can …", vi: "Đừng lo, chúng ta có thể …", examples: [
      { en: "Don't worry, we can do this together.", vi: "Đừng lo, chúng ta cùng nhau làm được." },
      { en: "Don't worry, we can stay dry inside.", vi: "Đừng lo, mình có thể trú khô bên trong." }] },
  ],
  listening: {
    intro: "Listen to the story, then answer. What will the team do?",
    introVi: "Nghe câu chuyện rồi trả lời. Cả nhóm sẽ làm gì?",
    script: "On the first night of the camping trip, dark clouds covered the sky. Suddenly, a storm began. Rain poured down and thunder rumbled loudly. The tent started to shake in the wind. But Maple's friends did not panic. Theo held the map and found a wooden shelter nearby. One girl hammered the tent pegs deeper into the ground, while a boy grabbed the flashlight from the bag. \"Let's move to the shelter until the storm stops,\" said Maple. Together, the soaked but brave friends ran to the dry shelter and waited for the rain to end.",
    questions: [
      { q: "What happened on the first night?", vi: "Đêm đầu tiên đã xảy ra chuyện gì?",
        options: ["A storm began", "It snowed", "The sun came out"], answer: "A storm began" },
      { q: "How did Maple's friends act during the storm?", vi: "Các bạn của Maple hành động thế nào trong bão?",
        options: ["They stayed calm and worked as a team", "They cried and gave up", "They went to sleep"], answer: "They stayed calm and worked as a team",
        explainVi: "Mỗi bạn làm một việc, không hoảng loạn — đó là tinh thần đồng đội." },
      { q: "What did the friends decide to do?", vi: "Cuối cùng các bạn quyết định làm gì?",
        options: ["Move to the shelter until the storm stopped", "Swim in the lake", "Climb a tree"], answer: "Move to the shelter until the storm stopped" },
    ],
  },
  speaking: {
    repeat: [
      { en: "It is raining hard, so we need to hurry.", vi: "Trời mưa rất to nên chúng mình cần nhanh lên." },
      { en: "Don't worry, we can do this together.", vi: "Đừng lo, chúng ta cùng nhau làm được." },
    ],
    guided: { q: "What would you take on a camping trip?", vi: "Bạn sẽ mang gì khi đi cắm trại?", hint: "On a camping trip, I would take a ___." },
    describe: {
      prompt: "Tell the story in 3–5 sentences. Describe the weather, then say what each friend did.",
      vi: "Kể lại câu chuyện 3–5 câu. Tả thời tiết, rồi nói mỗi bạn đã làm gì.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"a place that keeps you dry and safe\"?", vi: "Từ nào nghĩa là \"nơi giúp bạn khô ráo và an toàn\"?",
        options: ["shelter", "thunder", "peg"], answer: "shelter" },
      { type: "reading", q: "The friends did not panic and each did a job. What does this show?", vi: "Các bạn không hoảng loạn và mỗi người làm một việc. Điều đó cho thấy gì?",
        options: ["They worked as a brave team", "They were bored", "They were asleep"], answer: "They worked as a brave team",
        explainVi: "Bình tĩnh + chia việc = tinh thần đồng đội, dũng cảm." },
      { type: "reading", q: "They ran to the shelter. What will they probably do NEXT?", vi: "Các bạn chạy tới chỗ trú. Tiếp theo có lẽ sẽ làm gì?",
        options: ["Wait for the storm to stop", "Take off their shoes and swim", "Set up a new tent in the rain"], answer: "Wait for the storm to stop",
        explainVi: "Vào chỗ trú khô ráo thì hợp lý nhất là chờ bão tạnh." },
      { type: "listening", q: "In the story, what did Theo use to find the shelter?", vi: "Trong truyện, Theo dùng gì để tìm chỗ trú?",
        options: ["A map", "A phone", "A dog"], answer: "A map" },
    ],
  },
};

/* Unit 3: The School Talent Show */
const THE_SCHOOL_TALENT_SHOW: Lesson = {
  id: "talentshow", theme: "story-time", title: "The School Talent Show", vi: "Hội diễn tài năng", ageRange: "9–12",
  sceneImage: "/assets/images/learn/level-2/level-2-unit-03-school-talent-show.webp",
  vocab: [
    { word: "stage", ipa: "/steɪdʒ/", vi: "sân khấu", emoji: "🎭", example: "He walked onto the stage.", exampleVi: "Cậu ấy bước lên sân khấu." },
    { word: "talent", ipa: "/ˈtælənt/", vi: "tài năng", emoji: "🌟", example: "Everyone shows a talent tonight.", exampleVi: "Tối nay ai cũng khoe một tài năng." },
    { word: "nervous", ipa: "/ˈnɜːrvəs/", vi: "hồi hộp, lo lắng", emoji: "😰", example: "Theo felt very nervous.", exampleVi: "Theo cảm thấy rất hồi hộp." },
    { word: "audience", ipa: "/ˈɔːdiəns/", vi: "khán giả", emoji: "👏", example: "The audience is waiting.", exampleVi: "Khán giả đang chờ đợi." },
    { word: "perform", ipa: "/pərˈfɔːrm/", vi: "biểu diễn", emoji: "🎤", example: "She will perform a guitar song.", exampleVi: "Bạn ấy sẽ biểu diễn một bài ghi-ta." },
    { word: "encourage", ipa: "/ɪnˈkʌrɪdʒ/", vi: "động viên", emoji: "💪", example: "Maple encouraged her friend.", exampleVi: "Maple động viên bạn của mình." },
    { word: "magic", ipa: "/ˈmædʒɪk/", vi: "ảo thuật", emoji: "🎩", example: "The boy does a magic card trick.", exampleVi: "Cậu bé làm trò ảo thuật với bài." },
    { word: "clap", ipa: "/klæp/", vi: "vỗ tay", emoji: "👏", example: "The audience began to clap.", exampleVi: "Khán giả bắt đầu vỗ tay." },
  ],
  patterns: [
    { pattern: "It's your turn.", vi: "Đến lượt bạn rồi.", examples: [
      { en: "It's your turn to perform.", vi: "Đến lượt bạn biểu diễn." },
      { en: "It's your turn now, Theo.", vi: "Đến lượt cậu rồi, Theo." }] },
    { pattern: "Don't be nervous, you can do it!", vi: "Đừng lo, bạn làm được mà!", examples: [
      { en: "Don't be nervous, you can do it!", vi: "Đừng hồi hộp, bạn làm được mà!" },
      { en: "Don't be scared, we believe in you.", vi: "Đừng sợ, tụi mình tin bạn." }] },
    { pattern: "I am going to …", vi: "Mình sắp …", examples: [
      { en: "I am going to sing a song.", vi: "Mình sắp hát một bài." },
      { en: "I am going to do a magic trick.", vi: "Mình sắp làm một trò ảo thuật." }] },
    { pattern: "Take a deep breath and …", vi: "Hít một hơi thật sâu rồi …", examples: [
      { en: "Take a deep breath and smile.", vi: "Hít một hơi thật sâu rồi mỉm cười." },
      { en: "Take a deep breath and begin.", vi: "Hít một hơi thật sâu rồi bắt đầu." }] },
  ],
  listening: {
    intro: "Listen to the story, then answer. How does Theo feel?",
    introVi: "Nghe câu chuyện rồi trả lời. Theo cảm thấy thế nào?",
    script: "It was the night of the school talent show. Backstage, everyone was getting ready. A girl was tuning her guitar, and a boy was practicing a magic trick with playing cards. But Theo was very nervous. His hands were shaking. \"I can't do it,\" he whispered. Maple smiled and said, \"Don't be nervous. Take a deep breath. You can do it!\" When the host called Theo's name, he walked onto the stage and stood by the microphone. He sang his song, and the audience clapped loudly. Theo was so happy that he had not given up.",
    questions: [
      { q: "Why were Theo's hands shaking?", vi: "Vì sao tay Theo run?",
        options: ["He was nervous", "He was cold", "He was hungry"], answer: "He was nervous" },
      { q: "What did Maple tell Theo?", vi: "Maple đã nói gì với Theo?",
        options: ["Take a deep breath, you can do it", "Go home now", "Be quiet"], answer: "Take a deep breath, you can do it",
        explainVi: "Maple động viên Theo hít thở sâu và tin vào bản thân." },
      { q: "How did the audience react after Theo sang?", vi: "Sau khi Theo hát, khán giả phản ứng thế nào?",
        options: ["They clapped loudly", "They left the room", "They fell asleep"], answer: "They clapped loudly" },
    ],
  },
  speaking: {
    repeat: [
      { en: "Don't be nervous, you can do it!", vi: "Đừng hồi hộp, bạn làm được mà!" },
      { en: "Take a deep breath and walk onto the stage.", vi: "Hít một hơi thật sâu rồi bước lên sân khấu." },
    ],
    guided: { q: "What talent would you show on stage?", vi: "Bạn sẽ trổ tài gì trên sân khấu?", hint: "On stage, I would ___." },
    describe: {
      prompt: "Tell the story in 3–5 sentences. Say how Theo felt at first, what Maple did, and what happened at the end.",
      vi: "Kể lại câu chuyện 3–5 câu. Nói lúc đầu Theo thấy thế nào, Maple đã làm gì, và kết thúc ra sao.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"feeling worried before doing something\"?", vi: "Từ nào nghĩa là \"lo lắng trước khi làm gì đó\"?",
        options: ["nervous", "magic", "audience"], answer: "nervous" },
      { type: "reading", q: "Theo whispered \"I can't do it\" and his hands were shaking. How did he feel?", vi: "Theo thì thầm \"Mình không làm được\" và tay run. Cậu cảm thấy thế nào?",
        options: ["Nervous and scared", "Proud and calm", "Angry"], answer: "Nervous and scared",
        explainVi: "Tay run + nói không làm được = đang hồi hộp, sợ hãi." },
      { type: "reading", q: "Read: “Don't be nervous. You can do it!” What is Maple doing?", vi: "Đọc câu trên. Maple đang làm gì?",
        options: ["Encouraging her friend", "Making fun of him", "Saying goodbye"], answer: "Encouraging her friend",
        explainVi: "Những lời đó là để động viên, tiếp thêm can đảm." },
      { type: "listening", q: "In the story, what did Theo do after the host called his name?", vi: "Trong truyện, sau khi được gọi tên, Theo đã làm gì?",
        options: ["He walked onto the stage and sang", "He ran away", "He hid backstage"], answer: "He walked onto the stage and sang" },
    ],
  },
};

/* Unit 4: The Ferry Trip Mix-Up */
const THE_FERRY_TRIP_MIX_UP: Lesson = {
  id: "ferry", theme: "story-time", title: "The Ferry Trip Mix-Up", vi: "Chuyến phà nhầm lẫn", ageRange: "9–12",
  sceneImage: "/assets/images/learn/level-2/level-2-unit-04-ferry-trip-mix-up.webp",
  vocab: [
    { word: "ferry", ipa: "/ˈferi/", vi: "phà", emoji: "⛴️", example: "The blue ferry is at the dock.", exampleVi: "Chiếc phà xanh đang ở bến." },
    { word: "terminal", ipa: "/ˈtɜːrmɪnl/", vi: "bến, nhà ga", emoji: "🏢", example: "We waited at the ferry terminal.", exampleVi: "Chúng mình chờ ở bến phà." },
    { word: "ticket", ipa: "/ˈtɪkɪt/", vi: "vé", emoji: "🎫", example: "Theo held two ferry tickets.", exampleVi: "Theo cầm hai vé phà." },
    { word: "schedule", ipa: "/ˈskedʒuːl/", vi: "lịch trình", emoji: "🗓️", example: "The schedule shows the ferry times.", exampleVi: "Lịch trình ghi giờ các chuyến phà." },
    { word: "departure", ipa: "/dɪˈpɑːrtʃər/", vi: "giờ khởi hành", emoji: "🕔", example: "Our departure is at five o'clock.", exampleVi: "Chuyến của mình khởi hành lúc năm giờ." },
    { word: "gate", ipa: "/ɡeɪt/", vi: "cổng lên tàu", emoji: "🚪", example: "Go to Gate 2 for the blue ferry.", exampleVi: "Ra Cổng 2 để lên phà xanh." },
    { word: "compare", ipa: "/kəmˈper/", vi: "so sánh", emoji: "⚖️", example: "Compare the ticket and the board.", exampleVi: "So sánh cái vé với bảng giờ." },
    { word: "board", ipa: "/bɔːrd/", vi: "lên (tàu, phà)", emoji: "🛳️", example: "Hurry, it's time to board!", exampleVi: "Nhanh lên, đến giờ lên phà rồi!" },
  ],
  patterns: [
    { pattern: "What time does the … leave?", vi: "Mấy giờ … khởi hành?", examples: [
      { en: "What time does the blue ferry leave?", vi: "Mấy giờ phà xanh khởi hành?" },
      { en: "What time does the next boat leave?", vi: "Mấy giờ chuyến sau khởi hành?" }] },
    { pattern: "We must … or we will …", vi: "Chúng ta phải … nếu không sẽ …", examples: [
      { en: "We must hurry or we will miss it.", vi: "Chúng ta phải nhanh không thì lỡ chuyến." },
      { en: "We must read the board or we will get lost.", vi: "Phải xem bảng giờ, không thì bị lạc." }] },
    { pattern: "The blue one, not the red one.", vi: "Cái xanh, không phải cái đỏ.", examples: [
      { en: "Our ticket is the blue one, not the red one.", vi: "Vé của mình là cái xanh, không phải cái đỏ." },
      { en: "Take the blue ferry, not the red ferry.", vi: "Đi phà xanh, đừng đi phà đỏ." }] },
    { pattern: "Which gate is for …?", vi: "Cổng nào dành cho …?", examples: [
      { en: "Which gate is for the blue ferry?", vi: "Cổng nào dành cho phà xanh?" },
      { en: "Which gate is for our boat?", vi: "Cổng nào dành cho chuyến của mình?" }] },
  ],
  listening: {
    intro: "Listen to the story, then answer. Read the times carefully!",
    introVi: "Nghe câu chuyện rồi trả lời. Hãy đọc kỹ giờ giấc!",
    script: "Maple and her friends were at the ferry terminal. Theo was holding two tickets: a blue one and a red one. Each ticket showed a different time. \"Quick, the red ferry is leaving!\" said one boy, and he started to run. But Maple looked up at the big board. \"Wait — our tickets are blue. The blue ferry leaves at five o'clock from Gate 2.\" They compared the times on the board with the times on the tickets. If they had run onto the red ferry, they would have gone to the wrong island! So they hurried to Gate 2 and boarded the right ferry just in time.",
    questions: [
      { q: "How many tickets was Theo holding?", vi: "Theo cầm mấy tấm vé?",
        options: ["Two — a blue one and a red one", "One red one", "Three blue ones"], answer: "Two — a blue one and a red one" },
      { q: "How did Maple know which ferry was theirs?", vi: "Làm sao Maple biết phà nào là của mình?",
        options: ["She compared the board with their tickets", "She asked the seagulls", "She guessed"], answer: "She compared the board with their tickets",
        explainVi: "Maple đối chiếu bảng giờ với màu và giờ trên vé." },
      { q: "What would have happened on the red ferry?", vi: "Nếu lên phà đỏ thì chuyện gì xảy ra?",
        options: ["They would have gone to the wrong island", "They would have arrived faster", "Nothing would change"], answer: "They would have gone to the wrong island",
        explainVi: "Vé xanh không hợp phà đỏ nên sẽ tới sai đảo." },
    ],
  },
  speaking: {
    repeat: [
      { en: "Our ticket is the blue one, not the red one.", vi: "Vé của mình là cái xanh, không phải cái đỏ." },
      { en: "The blue ferry leaves at five o'clock from Gate 2.", vi: "Phà xanh khởi hành lúc năm giờ ở Cổng 2." },
    ],
    guided: { q: "What do you check before a trip?", vi: "Trước chuyến đi bạn kiểm tra gì?", hint: "Before a trip, I check the ___." },
    describe: {
      prompt: "Tell the story in 3–5 sentences. Use \"First\", \"Then\", and one \"or we will …\".",
      vi: "Kể lại câu chuyện 3–5 câu, dùng \"First\", \"Then\" và một câu \"or we will …\".",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"a list of times when ferries leave\"?", vi: "Từ nào nghĩa là \"bảng giờ các chuyến phà\"?",
        options: ["schedule", "ticket", "gate"], answer: "schedule" },
      { type: "reading", q: "If you get on the wrong ferry, what happens?", vi: "Nếu lên nhầm phà thì sao?",
        options: ["You go to the wrong place", "You get there faster", "The ferry turns around for you"], answer: "You go to the wrong place",
        explainVi: "Sai phà thì sẽ đến sai nơi." },
      { type: "listening", q: "In the story, what time did the blue ferry leave?", vi: "Trong truyện, phà xanh khởi hành lúc mấy giờ?",
        options: ["Five o'clock", "Two o'clock", "Ten o'clock"], answer: "Five o'clock" },
      { type: "reading", q: "The tickets were blue, but a boy ran to the red ferry. Why was that a mistake?", vi: "Vé màu xanh nhưng một bạn chạy tới phà đỏ. Vì sao đó là lỗi?",
        options: ["Blue tickets are for the blue ferry, not the red one", "Red is faster", "Blue ferries are always late"], answer: "Blue tickets are for the blue ferry, not the red one" },
    ],
  },
};

/* Unit 5: The Robot That Wouldn't Start */
const THE_ROBOT_THAT_WOULDNT_START: Lesson = {
  id: "robot", theme: "story-time", title: "The Robot That Wouldn't Start", vi: "Con robot không chịu khởi động", ageRange: "9–12",
  sceneImage: "/assets/images/learn/level-2/level-2-unit-05-robot-wouldnt-start.webp",
  vocab: [
    { word: "robot", ipa: "/ˈroʊbɒt/", vi: "người máy, robot", emoji: "🤖", example: "The team built a small robot.", exampleVi: "Cả nhóm chế tạo một con robot nhỏ." },
    { word: "battery", ipa: "/ˈbætəri/", vi: "pin", emoji: "🔋", example: "First they checked the battery.", exampleVi: "Đầu tiên các bạn kiểm tra pin." },
    { word: "wire", ipa: "/ˈwaɪər/", vi: "dây điện", emoji: "🔌", example: "One yellow wire was loose.", exampleVi: "Một sợi dây vàng bị lỏng." },
    { word: "loose", ipa: "/luːs/", vi: "lỏng, không chặt", emoji: "🔧", example: "The loose wire fell off.", exampleVi: "Sợi dây lỏng bị tuột ra." },
    { word: "connect", ipa: "/kəˈnekt/", vi: "nối, kết nối", emoji: "➰", example: "They connected the wire again.", exampleVi: "Các bạn nối lại sợi dây." },
    { word: "power", ipa: "/ˈpaʊər/", vi: "điện, nguồn", emoji: "⚡", example: "The battery still had power.", exampleVi: "Pin vẫn còn điện." },
    { word: "guess", ipa: "/ɡes/", vi: "đoán, phỏng đoán", emoji: "💭", example: "\"Maybe the wire,\" guessed Theo.", exampleVi: "\"Có lẽ là sợi dây,\" Theo đoán." },
    { word: "fix", ipa: "/fɪks/", vi: "sửa", emoji: "🛠️", example: "They fixed the wheel too.", exampleVi: "Các bạn cũng sửa lại cái bánh xe." },
  ],
  patterns: [
    { pattern: "Maybe the problem is …", vi: "Có lẽ vấn đề là …", examples: [
      { en: "Maybe the problem is a loose wire.", vi: "Có lẽ vấn đề là một sợi dây lỏng." },
      { en: "Maybe the problem is the battery.", vi: "Có lẽ vấn đề là ở cục pin." }] },
    { pattern: "First check … , then check …", vi: "Đầu tiên kiểm tra … , sau đó kiểm tra …", examples: [
      { en: "First check the battery, then check the wires.", vi: "Đầu tiên kiểm tra pin, sau đó kiểm tra dây." },
      { en: "First check the wheels, then check the switch.", vi: "Đầu tiên kiểm tra bánh xe, sau đó kiểm tra công tắc." }] },
    { pattern: "Because … , the robot …", vi: "Vì … nên robot …", examples: [
      { en: "Because the wire was loose, the robot did not start.", vi: "Vì sợi dây bị lỏng nên robot không khởi động." },
      { en: "Because the wheel fell off, the robot could not move.", vi: "Vì bánh xe rơi ra nên robot không chạy được." }] },
    { pattern: "Let's try …", vi: "Thử … xem nào.", examples: [
      { en: "Let's try the button again.", vi: "Thử bấm nút lại xem nào." },
      { en: "Let's try connecting the wire.", vi: "Thử nối lại sợi dây xem nào." }] },
  ],
  listening: {
    intro: "Listen to the story, then answer. Check the clues in order!",
    introVi: "Nghe câu chuyện rồi trả lời. Kiểm tra manh mối theo thứ tự!",
    script: "The team built a small robot for the race, but when they pressed the button, nothing happened. The robot would not start. \"Let's not panic. Let's check it step by step,\" said Maple. First, they checked the battery — it still had power. Then they looked at the wires, and they found that one yellow wire was loose and not connected. They also saw that a wheel had fallen off. \"Maybe the loose wire is the problem,\" guessed Theo. So they connected the wire again and fixed the wheel. When they pressed the button once more, the robot's eyes lit up and it rolled forward. The whole team cheered.",
    questions: [
      { q: "What was the problem at the start?", vi: "Lúc đầu vấn đề là gì?",
        options: ["The robot would not start", "The robot was too fast", "The robot was lost"], answer: "The robot would not start" },
      { q: "What did the team check first?", vi: "Nhóm kiểm tra thứ gì đầu tiên?",
        options: ["The battery", "The wheels", "The paint"], answer: "The battery" },
      { q: "Why did the robot not work?", vi: "Vì sao robot không hoạt động?",
        options: ["A wire was loose and a wheel had fallen off", "It was too heavy", "It was asleep"], answer: "A wire was loose and a wheel had fallen off",
        explainVi: "Dây bị lỏng và bánh xe rơi ra khiến robot không chạy." },
    ],
  },
  speaking: {
    repeat: [
      { en: "Let's check it step by step.", vi: "Cùng kiểm tra từng bước một nào." },
      { en: "Because the wire was loose, the robot did not start.", vi: "Vì sợi dây bị lỏng nên robot không khởi động." },
    ],
    guided: { q: "What would you build with a robot kit?", vi: "Bạn sẽ chế tạo gì với bộ lắp robot?", hint: "I would build a robot that ___." },
    describe: {
      prompt: "Tell the story in 3–5 sentences. Use \"First\", \"Then\", and one \"Because …\".",
      vi: "Kể lại câu chuyện 3–5 câu, dùng \"First\", \"Then\" và một câu \"Because …\".",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"not tight, able to fall off\"?", vi: "Từ nào nghĩa là \"lỏng, dễ tuột ra\"?",
        options: ["loose", "power", "fix"], answer: "loose" },
      { type: "reading", q: "What did the team check FIRST?", vi: "Nhóm kiểm tra gì ĐẦU TIÊN?",
        options: ["The battery", "The wire", "The button"], answer: "The battery",
        explainVi: "Thứ tự trong truyện: pin → dây → bánh xe." },
      { type: "reading", q: "Because the wire was loose, what happened?", vi: "Vì sợi dây bị lỏng nên điều gì xảy ra?",
        options: ["The robot would not start", "The robot went faster", "The lights got brighter"], answer: "The robot would not start",
        explainVi: "Dây lỏng làm mất kết nối nên robot không khởi động." },
      { type: "listening", q: "How did they fix the robot?", vi: "Các bạn sửa robot bằng cách nào?",
        options: ["They connected the wire and fixed the wheel", "They bought a new one", "They painted it"], answer: "They connected the wire and fixed the wheel" },
    ],
  },
};

/* Unit 6: The Community Garden Mystery */
const THE_COMMUNITY_GARDEN_MYSTERY: Lesson = {
  id: "garden", theme: "story-time", title: "The Community Garden Mystery", vi: "Bí ẩn vườn cộng đồng", ageRange: "9–12",
  sceneImage: "/assets/images/learn/level-2/level-2-unit-06-community-garden-mystery.webp",
  vocab: [
    { word: "garden", ipa: "/ˈɡɑːrdn/", vi: "khu vườn", emoji: "🌱", example: "The community garden was a mess.", exampleVi: "Khu vườn cộng đồng bừa bộn." },
    { word: "mess", ipa: "/mes/", vi: "sự bừa bộn", emoji: "🌀", example: "Who made this mess?", exampleVi: "Ai đã làm bừa thế này?" },
    { word: "footprint", ipa: "/ˈfʊtprɪnt/", vi: "dấu chân", emoji: "🐾", example: "There were muddy footprints.", exampleVi: "Có những dấu chân lấm bùn." },
    { word: "track", ipa: "/træk/", vi: "dấu vết (của thú)", emoji: "🔎", example: "The tracks led to the bin.", exampleVi: "Dấu vết dẫn tới cái thùng." },
    { word: "evidence", ipa: "/ˈevɪdəns/", vi: "bằng chứng", emoji: "🧾", example: "They looked for evidence.", exampleVi: "Các bạn tìm bằng chứng." },
    { word: "tomato", ipa: "/təˈmɑːtoʊ/", vi: "quả cà chua", emoji: "🍅", example: "Tomatoes were on the ground.", exampleVi: "Cà chua rơi trên mặt đất." },
    { word: "raccoon", ipa: "/ræˈkuːn/", vi: "gấu mèo", emoji: "🦝", example: "A raccoon was hiding in the bin.", exampleVi: "Một con gấu mèo trốn trong thùng." },
    { word: "hide", ipa: "/haɪd/", vi: "trốn, ẩn nấp", emoji: "🙈", example: "The animal tried to hide.", exampleVi: "Con vật cố trốn đi." },
  ],
  patterns: [
    { pattern: "Something knocked over the …", vi: "Có thứ gì đó làm đổ …", examples: [
      { en: "Something knocked over the watering can.", vi: "Có thứ gì đó làm đổ bình tưới." },
      { en: "Something knocked over the plant pot.", vi: "Có thứ gì đó làm đổ chậu cây." }] },
    { pattern: "There are … on the ground.", vi: "Có … trên mặt đất.", examples: [
      { en: "There are footprints on the ground.", vi: "Có dấu chân trên mặt đất." },
      { en: "There are tomatoes on the ground.", vi: "Có cà chua rơi trên mặt đất." }] },
    { pattern: "The tracks lead to …", vi: "Dấu vết dẫn tới …", examples: [
      { en: "The tracks lead to the compost bin.", vi: "Dấu vết dẫn tới thùng ủ phân." },
      { en: "The tracks lead to the fence.", vi: "Dấu vết dẫn tới hàng rào." }] },
    { pattern: "It must have been a …", vi: "Chắc hẳn đó là một con …", examples: [
      { en: "It must have been a raccoon.", vi: "Chắc hẳn đó là một con gấu mèo." },
      { en: "It must have been an animal, not a person.", vi: "Chắc hẳn là con vật, không phải người." }] },
  ],
  listening: {
    intro: "Listen to the story, then answer. Follow the evidence!",
    introVi: "Nghe câu chuyện rồi trả lời. Hãy lần theo bằng chứng!",
    script: "When the friends arrived at the community garden, something was wrong. A green watering can was tipped over, and red tomatoes were scattered on the ground. \"This is a real mystery,\" said Maple. So they looked for evidence. The girl with the magnifying glass found small muddy footprints in the soft mud. The prints were not from shoes — they were animal tracks! The tracks led all the way to the compost bin. Very slowly, the friends looked inside… and two shiny eyes looked back. It was a raccoon! The clever animal had visited the garden during the night to look for food.",
    questions: [
      { q: "What was tipped over in the garden?", vi: "Thứ gì bị đổ trong vườn?",
        options: ["A green watering can", "A bicycle", "A bookshelf"], answer: "A green watering can" },
      { q: "What kind of footprints did they find?", vi: "Các bạn tìm thấy loại dấu chân nào?",
        options: ["Animal tracks, not shoe prints", "Big boot prints", "No prints at all"], answer: "Animal tracks, not shoe prints",
        explainVi: "Dấu chân nhỏ, lấm bùn, không phải của giày → của con vật." },
      { q: "Who made the mess?", vi: "Ai đã bày bừa?",
        options: ["A raccoon", "The teacher", "A robot"], answer: "A raccoon" },
    ],
  },
  speaking: {
    repeat: [
      { en: "There are muddy footprints on the ground.", vi: "Có những dấu chân lấm bùn trên mặt đất." },
      { en: "It must have been a raccoon.", vi: "Chắc hẳn đó là một con gấu mèo." },
    ],
    guided: { q: "How would you solve a garden mystery?", vi: "Bạn sẽ giải bí ẩn khu vườn thế nào?", hint: "First, I would look for ___." },
    describe: {
      prompt: "Retell the story in 3–5 sentences using the past tense. Say what they found and who did it.",
      vi: "Kể lại câu chuyện 3–5 câu ở thì quá khứ. Nói các bạn tìm thấy gì và ai gây ra.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"clues that show what happened\"?", vi: "Từ nào nghĩa là \"manh mối cho thấy điều đã xảy ra\"?",
        options: ["evidence", "garden", "tomato"], answer: "evidence" },
      { type: "reading", q: "The prints were not from shoes. What does this tell us?", vi: "Dấu chân không phải của giày. Điều đó cho thấy gì?",
        options: ["An animal, not a person, made them", "A giant made them", "Nobody made them"], answer: "An animal, not a person, made them",
        explainVi: "Không phải dấu giày nghĩa là do con vật gây ra." },
      { type: "listening", q: "In the story, where did the tracks lead?", vi: "Trong truyện, dấu vết dẫn tới đâu?",
        options: ["To the compost bin", "To the school", "To the sea"], answer: "To the compost bin" },
      { type: "reading", q: "The raccoon came at night to find food. Why were the tomatoes on the ground?", vi: "Con gấu mèo tới ban đêm tìm thức ăn. Vì sao cà chua rơi xuống đất?",
        options: ["The raccoon knocked them down while looking for food", "They grew on the ground", "The wind planted them"], answer: "The raccoon knocked them down while looking for food" },
    ],
  },
};

/* Unit 7: The Time Capsule Discovery */
const THE_TIME_CAPSULE_DISCOVERY: Lesson = {
  id: "capsule", theme: "story-time", title: "The Time Capsule Discovery", vi: "Khám phá hộp thời gian", ageRange: "9–12",
  sceneImage: "/assets/images/learn/level-2/level-2-unit-07-time-capsule-discovery.webp",
  vocab: [
    { word: "capsule", ipa: "/ˈkæpsjuːl/", vi: "hộp thời gian", emoji: "📦", example: "They found a time capsule.", exampleVi: "Các bạn tìm thấy một hộp thời gian." },
    { word: "bury", ipa: "/ˈberi/", vi: "chôn", emoji: "⛏️", example: "Someone buried the box long ago.", exampleVi: "Ai đó đã chôn cái hộp từ lâu." },
    { word: "discover", ipa: "/dɪˈskʌvər/", vi: "khám phá, tìm ra", emoji: "🔦", example: "They discovered old treasures.", exampleVi: "Các bạn tìm ra những báu vật cũ." },
    { word: "past", ipa: "/pæst/", vi: "quá khứ, ngày xưa", emoji: "⏳", example: "In the past, the trees were tiny.", exampleVi: "Ngày xưa, cây còn bé xíu." },
    { word: "photograph", ipa: "/ˈfoʊtəɡræf/", vi: "bức ảnh", emoji: "🖼️", example: "The photograph was black and white.", exampleVi: "Bức ảnh có màu đen trắng." },
    { word: "coin", ipa: "/kɔɪn/", vi: "đồng xu", emoji: "🪙", example: "The old coin had a date on it.", exampleVi: "Đồng xu cũ có ghi năm." },
    { word: "ribbon", ipa: "/ˈrɪbən/", vi: "dải ruy-băng", emoji: "🎀", example: "A faded red ribbon was inside.", exampleVi: "Bên trong có một dải ruy-băng đỏ đã bạc màu." },
    { word: "ago", ipa: "/əˈɡoʊ/", vi: "cách đây, trước đây", emoji: "📅", example: "It was buried fifty years ago.", exampleVi: "Nó được chôn cách đây năm mươi năm." },
  ],
  patterns: [
    { pattern: "Long ago, people …", vi: "Ngày xưa, người ta …", examples: [
      { en: "Long ago, people played with wooden toys.", vi: "Ngày xưa, người ta chơi đồ chơi bằng gỗ." },
      { en: "Long ago, students planted these trees.", vi: "Ngày xưa, học sinh đã trồng những cây này." }] },
    { pattern: "In the past it was … , but now it is …", vi: "Trước kia … , còn bây giờ …", examples: [
      { en: "In the past the trees were small, but now they are tall.", vi: "Trước kia cây nhỏ, còn bây giờ chúng cao lớn." },
      { en: "In the past photos were black and white, but now they are in colour.", vi: "Trước kia ảnh đen trắng, còn bây giờ có màu." }] },
    { pattern: "This must be about … years old.", vi: "Cái này chắc khoảng … năm tuổi.", examples: [
      { en: "This must be about fifty years old.", vi: "Cái này chắc khoảng năm mươi năm tuổi." },
      { en: "This coin must be very old.", vi: "Đồng xu này chắc rất cũ." }] },
    { pattern: "We found a …", vi: "Chúng mình đã tìm thấy một …", examples: [
      { en: "We found a photograph and a coin.", vi: "Chúng mình tìm thấy một bức ảnh và một đồng xu." },
      { en: "We found a wooden toy car.", vi: "Chúng mình tìm thấy một chiếc xe đồ chơi bằng gỗ." }] },
  ],
  listening: {
    intro: "Listen to the story, then answer. Compare the past and now!",
    introVi: "Nghe câu chuyện rồi trả lời. Hãy so sánh xưa và nay!",
    script: "While digging in the school garden, Theo's shovel hit something hard. It was an old, rusty metal box buried deep in the ground — a time capsule! Very carefully, they opened it. Inside they discovered a black-and-white photograph of students standing in front of the school, an old coin, a small wooden toy car, and a faded red ribbon. Maple held up the photo and compared it with the school today. \"The brick building looks the same,\" she said, \"but long ago the trees were tiny. Now they are tall.\" The coin had a date printed on it. Counting the years, they guessed the capsule had been buried about fifty years ago, by students just like them.",
    questions: [
      { q: "What did they dig up in the garden?", vi: "Các bạn đào được gì trong vườn?",
        options: ["An old metal box (a time capsule)", "A treasure chest of gold", "A sleeping cat"], answer: "An old metal box (a time capsule)" },
      { q: "When they compared the old photo with today, what was different?", vi: "Khi so bức ảnh cũ với hiện tại, điều gì khác?",
        options: ["Long ago the trees were tiny; now they are tall", "The school was bigger before", "The sky was green"], answer: "Long ago the trees were tiny; now they are tall",
        explainVi: "Toà nhà vẫn thế, nhưng cây ngày xưa bé, nay đã cao." },
      { q: "How did they guess how old the capsule was?", vi: "Làm sao các bạn đoán được tuổi của hộp?",
        options: ["From the date on the coin", "From the colour of the box", "By asking a bird"], answer: "From the date on the coin" },
    ],
  },
  speaking: {
    repeat: [
      { en: "In the past the trees were small, but now they are tall.", vi: "Trước kia cây nhỏ, còn bây giờ chúng cao lớn." },
      { en: "This time capsule must be about fifty years old.", vi: "Hộp thời gian này chắc khoảng năm mươi năm tuổi." },
    ],
    guided: { q: "What would you put in a time capsule?", vi: "Bạn sẽ bỏ gì vào hộp thời gian?", hint: "In my time capsule, I would put a ___." },
    describe: {
      prompt: "Retell the story in 3–5 sentences using the past tense. Compare one thing then and now.",
      vi: "Kể lại câu chuyện 3–5 câu ở thì quá khứ. So sánh một điều xưa và nay.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"to put something under the ground\"?", vi: "Từ nào nghĩa là \"đặt vật xuống dưới đất\"?",
        options: ["bury", "discover", "compare"], answer: "bury" },
      { type: "reading", q: "In the photo the trees are tiny, but today they are tall. What does this show?", vi: "Trong ảnh cây bé xíu, nay lại cao lớn. Điều đó cho thấy gì?",
        options: ["A lot of time has passed", "The photo is fake", "The trees shrank"], answer: "A lot of time has passed",
        explainVi: "Cây lớn lên chứng tỏ đã qua rất nhiều năm." },
      { type: "reading", q: "The coin has an old date and the photo is black-and-white. What can we guess?", vi: "Đồng xu ghi năm cũ, ảnh đen trắng. Ta đoán được gì?",
        options: ["The capsule is from long ago", "It was made yesterday", "It is from the future"], answer: "The capsule is from long ago" },
      { type: "listening", q: "Who probably buried the time capsule?", vi: "Ai có lẽ đã chôn hộp thời gian?",
        options: ["Students long ago", "A pilot last week", "The friends themselves"], answer: "Students long ago" },
    ],
  },
};

/* Unit 8: The Beach Cleanup Change of Plan */
const THE_BEACH_CLEANUP_CHANGE_OF_PLAN: Lesson = {
  id: "beach", theme: "story-time", title: "The Beach Cleanup Change of Plan", vi: "Đổi kế hoạch dọn bãi biển", ageRange: "9–12",
  sceneImage: "/assets/images/learn/level-2/level-2-unit-08-beach-cleanup-change-of-plan.webp",
  vocab: [
    { word: "beach", ipa: "/biːtʃ/", vi: "bãi biển", emoji: "🏖️", example: "They came to clean the beach.", exampleVi: "Các bạn tới dọn bãi biển." },
    { word: "cleanup", ipa: "/ˈkliːnʌp/", vi: "buổi dọn dẹp", emoji: "🧤", example: "The beach cleanup started at nine.", exampleVi: "Buổi dọn bãi biển bắt đầu lúc chín giờ." },
    { word: "weather", ipa: "/ˈweðər/", vi: "thời tiết", emoji: "🌥️", example: "The weather was getting worse.", exampleVi: "Thời tiết đang xấu đi." },
    { word: "wave", ipa: "/weɪv/", vi: "sóng", emoji: "🌊", example: "The waves were very big today.", exampleVi: "Hôm nay sóng rất to." },
    { word: "warning", ipa: "/ˈwɔːrnɪŋ/", vi: "cảnh báo", emoji: "⚠️", example: "The warning sign showed big waves.", exampleVi: "Biển cảnh báo hiện sóng lớn." },
    { word: "flag", ipa: "/flæɡ/", vi: "lá cờ", emoji: "🚩", example: "A red flag means danger.", exampleVi: "Cờ đỏ nghĩa là nguy hiểm." },
    { word: "plan", ipa: "/plæn/", vi: "kế hoạch", emoji: "📋", example: "They had to change the plan.", exampleVi: "Các bạn phải đổi kế hoạch." },
    { word: "safe", ipa: "/seɪf/", vi: "an toàn", emoji: "✅", example: "The picnic area was safer.", exampleVi: "Khu dã ngoại an toàn hơn." },
  ],
  patterns: [
    { pattern: "We are going to …", vi: "Chúng mình sẽ …", examples: [
      { en: "We are going to clean the beach.", vi: "Chúng mình sẽ dọn bãi biển." },
      { en: "We are going to fill three bags.", vi: "Chúng mình sẽ nhặt đầy ba túi." }] },
    { pattern: "It's not safe to … , so let's … instead.", vi: "Không an toàn khi … , nên thay vào đó …", examples: [
      { en: "It's not safe to go near the waves, so let's clean the path instead.", vi: "Không an toàn khi lại gần sóng, nên dọn lối đi thay vào đó." },
      { en: "It's not safe here, so let's move to the shelter instead.", vi: "Ở đây không an toàn, nên chuyển tới chỗ trú thay vào đó." }] },
    { pattern: "If the weather is bad, we can …", vi: "Nếu thời tiết xấu, mình có thể …", examples: [
      { en: "If the weather is bad, we can work in the picnic area.", vi: "Nếu thời tiết xấu, mình có thể dọn ở khu dã ngoại." },
      { en: "If the weather is bad, we can try tomorrow.", vi: "Nếu thời tiết xấu, mình có thể thử lại ngày mai." }] },
    { pattern: "Let's … because …", vi: "Cùng … vì …", examples: [
      { en: "Let's clean the picnic area because it is safer.", vi: "Cùng dọn khu dã ngoại vì nó an toàn hơn." },
      { en: "Let's wait because the flag is red.", vi: "Cùng chờ đã vì cờ đang đỏ." }] },
  ],
  listening: {
    intro: "Listen to the story, then answer. What is the new plan?",
    introVi: "Nghe câu chuyện rồi trả lời. Kế hoạch mới là gì?",
    script: "The friends arrived at the beach ready for a cleanup, with buckets, gloves and trash grabbers. But the sky was grey and the wind was strong. On the warning sign, they saw pictures of big waves and rising wind, and a red flag was flying. \"The waves are too big today. The beach is not safe,\" said their teacher. So they had to change their plan. \"We could go home,\" said one boy, \"or we could clean the picnic area up the path instead.\" They talked it over and made a choice: they would clean the safer picnic area and the shelter, because it was away from the big waves and still helped the park. Everyone agreed it was a smart plan.",
    questions: [
      { q: "Why was the beach not safe that day?", vi: "Vì sao hôm đó bãi biển không an toàn?",
        options: ["The waves were too big and the wind was strong", "It was too sunny", "There were too many shells"], answer: "The waves were too big and the wind was strong" },
      { q: "What were the two choices the friends talked about?", vi: "Các bạn bàn về hai lựa chọn nào?",
        options: ["Go home, or clean the picnic area instead", "Swim, or sleep", "Sail a boat, or fish"], answer: "Go home, or clean the picnic area instead" },
      { q: "What did they finally decide, and why?", vi: "Cuối cùng các bạn quyết định gì, và vì sao?",
        options: ["Clean the picnic area, because it was safer", "Swim in the big waves, because it was fun", "Go home, because they were tired"], answer: "Clean the picnic area, because it was safer",
        explainVi: "Khu dã ngoại xa sóng lớn nên an toàn mà vẫn giúp ích." },
    ],
  },
  speaking: {
    repeat: [
      { en: "The waves are too big, so the beach is not safe.", vi: "Sóng quá to nên bãi biển không an toàn." },
      { en: "Let's clean the picnic area because it is safer.", vi: "Cùng dọn khu dã ngoại vì nó an toàn hơn." },
    ],
    guided: { q: "What would you do if the weather changed your plan?", vi: "Nếu thời tiết làm hỏng kế hoạch, bạn sẽ làm gì?", hint: "If the weather is bad, I will ___." },
    describe: {
      prompt: "Tell the story in 3–5 sentences. Describe the weather, then say what new plan they chose and why.",
      vi: "Kể lại câu chuyện 3–5 câu. Tả thời tiết, rồi nói kế hoạch mới và lý do.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"a sign that tells you about danger\"?", vi: "Từ nào nghĩa là \"biển báo cho biết nguy hiểm\"?",
        options: ["warning", "plan", "beach"], answer: "warning" },
      { type: "reading", q: "The beach is not safe today. What is the best plan?", vi: "Hôm nay bãi biển không an toàn. Kế hoạch tốt nhất là gì?",
        options: ["Move the cleanup to a safer place", "Swim into the big waves", "Ignore the warning"], answer: "Move the cleanup to a safer place",
        explainVi: "Khi nguy hiểm, đổi sang nơi an toàn là hợp lý." },
      { type: "reading", q: "Why did they choose the picnic area?", vi: "Vì sao các bạn chọn khu dã ngoại?",
        options: ["It was safer, away from the big waves", "It had ice cream", "It was closer to the water"], answer: "It was safer, away from the big waves" },
      { type: "listening", q: "What did the red flag and the sign mean?", vi: "Cờ đỏ và biển báo nghĩa là gì?",
        options: ["Danger — big waves and strong wind", "Free food", "The cleanup is over"], answer: "Danger — big waves and strong wind" },
    ],
  },
};

/* Unit 9: The Aquarium Night Mystery */
const THE_AQUARIUM_NIGHT_MYSTERY: Lesson = {
  id: "aquarium", theme: "story-time", title: "The Aquarium Night Mystery", vi: "Bí ẩn đêm ở thuỷ cung", ageRange: "9–12",
  sceneImage: "/assets/images/learn/level-2/level-2-unit-09-aquarium-night-mystery.webp",
  vocab: [
    { word: "aquarium", ipa: "/əˈkweriəm/", vi: "thuỷ cung", emoji: "🐠", example: "The aquarium was quiet at night.", exampleVi: "Thuỷ cung yên tĩnh vào ban đêm." },
    { word: "tank", ipa: "/tæŋk/", vi: "bể (cá)", emoji: "🌊", example: "The big tank held an octopus.", exampleVi: "Bể lớn nuôi một con bạch tuộc." },
    { word: "leak", ipa: "/liːk/", vi: "rò rỉ", emoji: "💧", example: "Was the tank leaking?", exampleVi: "Liệu bể có bị rò rỉ không?" },
    { word: "puddle", ipa: "/ˈpʌdl/", vi: "vũng nước", emoji: "🫗", example: "There was a puddle on the floor.", exampleVi: "Có một vũng nước trên sàn." },
    { word: "octopus", ipa: "/ˈɒktəpəs/", vi: "con bạch tuộc", emoji: "🐙", example: "The clever octopus watched them.", exampleVi: "Con bạch tuộc tinh ranh nhìn các bạn." },
    { word: "splash", ipa: "/splæʃ/", vi: "làm bắn nước", emoji: "💦", example: "It splashed water over the edge.", exampleVi: "Nó làm nước bắn qua mép bể." },
    { word: "explanation", ipa: "/ˌekspləˈneɪʃn/", vi: "lời giải thích", emoji: "🗨️", example: "They found the real explanation.", exampleVi: "Các bạn tìm ra lời giải thích thật sự." },
    { word: "solve", ipa: "/sɒlv/", vi: "giải (bí ẩn)", emoji: "🧩", example: "They helped solve the mystery.", exampleVi: "Các bạn giúp giải bí ẩn." },
  ],
  patterns: [
    { pattern: "We noticed that …", vi: "Tụi mình để ý rằng …", examples: [
      { en: "We noticed that the glass had no crack.", vi: "Tụi mình để ý rằng kính không hề nứt." },
      { en: "We noticed a wet trail from the tank.", vi: "Tụi mình để ý một vệt nước từ bể chảy ra." }] },
    { pattern: "Some people think … , but …", vi: "Vài người nghĩ … , nhưng …", examples: [
      { en: "Some people think the tank is leaking, but there is no crack.", vi: "Vài người nghĩ bể bị rò, nhưng không có vết nứt." },
      { en: "Some people think a pipe broke, but it is dry.", vi: "Vài người nghĩ ống vỡ, nhưng nó khô ráo." }] },
    { pattern: "There is no … , so it cannot be …", vi: "Không có … nên không thể là …", examples: [
      { en: "There is no crack, so it cannot be a leak.", vi: "Không có vết nứt nên không thể là rò rỉ." },
      { en: "There is no rain, so it cannot be the weather.", vi: "Không có mưa nên không thể do thời tiết." }] },
    { pattern: "The answer must be …", vi: "Câu trả lời chắc chắn là …", examples: [
      { en: "The answer must be the octopus.", vi: "Câu trả lời chắc chắn là con bạch tuộc." },
      { en: "The answer must be simple.", vi: "Câu trả lời chắc chắn rất đơn giản." }] },
  ],
  listening: {
    intro: "Listen to the story, then answer. Which explanation is right?",
    introVi: "Nghe câu chuyện rồi trả lời. Lời giải thích nào đúng?",
    script: "One night, after the aquarium closed, a worker found a big puddle of water on the floor near the octopus tank. \"Is the tank leaking?\" she asked. Maple and her friends came to help solve the mystery. First, they looked closely at the glass. There was no crack, so the tank was not broken. Next, they saw a wet trail leading from the top of the tank down to the puddle. Then they noticed the octopus sitting right next to the edge, watching them with clever eyes. \"Some people think the tank is leaking,\" said Maple, \"but there is no crack, and the water came from the top.\" At last everyone understood: the playful octopus had reached over the edge and splashed water onto the floor during the night. There was no leak — the mystery was solved.",
    questions: [
      { q: "What did the worker find on the floor?", vi: "Người nhân viên tìm thấy gì trên sàn?",
        options: ["A puddle of water", "A lost fish", "A broken window"], answer: "A puddle of water" },
      { q: "Why did the friends decide the tank was NOT leaking?", vi: "Vì sao các bạn kết luận bể KHÔNG bị rò?",
        options: ["There was no crack in the glass", "The water was warm", "The octopus told them"], answer: "There was no crack in the glass",
        explainVi: "Kính không nứt nên nước không thể rò từ bể ra." },
      { q: "What really happened?", vi: "Chuyện thật sự là gì?",
        options: ["The octopus splashed water over the edge", "The roof was leaking", "A visitor spilled a drink"], answer: "The octopus splashed water over the edge" },
    ],
  },
  speaking: {
    repeat: [
      { en: "Some people think the tank is leaking, but there is no crack.", vi: "Vài người nghĩ bể bị rò, nhưng không có vết nứt." },
      { en: "The answer must be the clever octopus.", vi: "Câu trả lời chắc chắn là con bạch tuộc tinh ranh." },
    ],
    guided: { q: "How would you solve a mystery like a detective?", vi: "Bạn sẽ giải bí ẩn như một thám tử thế nào?", hint: "First, I would check the ___." },
    describe: {
      prompt: "Retell the story in 3–5 sentences. Give the clues in order, then say the real explanation.",
      vi: "Kể lại câu chuyện 3–5 câu. Nêu các manh mối theo thứ tự, rồi nói lời giải thích thật.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"when water escapes through a hole or crack\"?", vi: "Từ nào nghĩa là \"nước thoát ra qua lỗ hoặc vết nứt\"?",
        options: ["leak", "puddle", "tank"], answer: "leak" },
      { type: "reading", q: "Some thought the tank was leaking. Why was that wrong?", vi: "Vài người nghĩ bể bị rò. Vì sao điều đó sai?",
        options: ["There was no crack in the glass", "The tank was empty", "It never rains inside"], answer: "There was no crack in the glass",
        explainVi: "Không có vết nứt thì nước không thể rò từ bể." },
      { type: "reading", q: "What did the friends check FIRST?", vi: "Các bạn kiểm tra gì ĐẦU TIÊN?",
        options: ["The glass, for a crack", "The ceiling", "The front door"], answer: "The glass, for a crack",
        explainVi: "Thứ tự: kiểm tra kính → thấy vệt nước → thấy bạch tuộc." },
      { type: "reading", q: "The wet trail came from the top and the octopus was at the edge. What is the best conclusion?", vi: "Vệt nước chảy từ trên xuống và bạch tuộc ở sát mép. Kết luận hợp lý nhất?",
        options: ["The octopus splashed the water out", "The floor made its own water", "The lights melted"], answer: "The octopus splashed the water out" },
    ],
  },
};

/* ============ Level 2 · Unit 10: The Power Outage at the Community Centre ============ */
// Rào an toàn: NGƯỜI LỚN xử lý bảng điện; trẻ chỉ quan sát & bàn luận, KHÔNG chạm thiết bị điện.
const THE_POWER_OUTAGE: Lesson = {
  id: "outage", theme: "story-time", title: "The Power Outage at the Community Centre", vi: "Mất điện ở trung tâm cộng đồng", ageRange: "9–12",
  sceneImage: "/assets/images/learn/level-2/level-2-unit-10-community-centre-power-outage.webp",
  vocab: [
    { word: "outage", ipa: "/ˈaʊtɪdʒ/", vi: "sự mất điện", emoji: "🔌", example: "There was a power outage during the storm.", exampleVi: "Có một đợt mất điện khi trời bão." },
    { word: "flashlight", ipa: "/ˈflæʃlaɪt/", vi: "đèn pin", emoji: "🔦", example: "Maple turned on her flashlight.", exampleVi: "Maple bật đèn pin." },
    { word: "lantern", ipa: "/ˈlæntərn/", vi: "đèn lồng/đèn bão", emoji: "🏮", example: "The coordinator brought two lanterns.", exampleVi: "Người phụ trách mang ra hai chiếc đèn lồng." },
    { word: "breaker", ipa: "/ˈbreɪkər/", vi: "cầu dao điện", emoji: "⚡", example: "Only an adult should touch the breaker.", exampleVi: "Chỉ người lớn mới nên chạm vào cầu dao." },
    { word: "overloaded", ipa: "/ˌoʊvərˈloʊdɪd/", vi: "quá tải", emoji: "⚠️", example: "The power strip was overloaded.", exampleVi: "Ổ cắm điện bị quá tải." },
    { word: "floor plan", ipa: "/flɔːr plæn/", vi: "sơ đồ mặt bằng", emoji: "🗺️", example: "They read the floor plan to find the exit.", exampleVi: "Các bạn xem sơ đồ để tìm lối ra." },
    { word: "exit", ipa: "/ˈeksɪt/", vi: "lối thoát", emoji: "🚪", example: "The green sign shows the exit.", exampleVi: "Biển xanh chỉ lối thoát." },
    { word: "calm", ipa: "/kɑːm/", vi: "bình tĩnh", emoji: "😌", example: "Stay calm during a power outage.", exampleVi: "Hãy bình tĩnh khi mất điện." },
  ],
  patterns: [
    { pattern: "Maybe it's … , or maybe …", vi: "Có thể do … , hoặc do …", examples: [
      { en: "Maybe it's the storm, or maybe a breaker tripped.", vi: "Có thể do bão, hoặc do một cầu dao bị ngắt." },
      { en: "Maybe it's the wires, or maybe too many plugs.", vi: "Có thể do dây điện, hoặc do cắm quá nhiều phích." }] },
    { pattern: "It can't be … because …", vi: "Không thể do … vì …", examples: [
      { en: "It can't be the whole street, because the streetlights still work.", vi: "Không thể do cả khu phố, vì đèn đường vẫn sáng." },
      { en: "It can't be a storm outside, because the sky is clear.", vi: "Không thể do bão, vì trời quang." }] },
    { pattern: "We should / shouldn't …", vi: "Mình nên / không nên …", examples: [
      { en: "We should stay calm and use a flashlight.", vi: "Mình nên bình tĩnh và dùng đèn pin." },
      { en: "We shouldn't touch the breaker box ourselves.", vi: "Mình không nên tự chạm vào hộp cầu dao." }] },
    { pattern: "… was overloaded, so …", vi: "… bị quá tải, nên …", examples: [
      { en: "The power strip was overloaded, so the breaker tripped.", vi: "Ổ cắm bị quá tải nên cầu dao ngắt." },
      { en: "The plug was too hot, so we unplugged it.", vi: "Phích cắm quá nóng nên rút ra." }] },
  ],
  listening: {
    intro: "Listen to the story, then answer. What caused the outage?",
    introVi: "Nghe câu chuyện rồi trả lời. Điều gì gây ra mất điện?",
    script: "One rainy evening at the community centre, the lights suddenly went out. It was dark, so Maple turned on her flashlight and the coordinator, Ms. Lee, brought lanterns. \"Maybe it's the storm,\" said Theo, \"or maybe a breaker tripped.\" The friends looked out the window. The streetlights across the road were still on. \"It can't be the whole street,\" said Maple, \"because the streetlights still work.\" Then they looked at the craft table. The power strip there had too many plugs — a glue gun, two tablets and a lamp — and it felt warm. \"The strip is overloaded,\" said Ms. Lee. She told the children to stand back, because only an adult should touch the breaker box. Ms. Lee unplugged the extra devices and reset one breaker, and the lights came back on. To keep everyone safe, she said an electrician would check the wiring the next day.",
    questions: [
      { q: "Why couldn't the outage be the whole street?", vi: "Vì sao không phải cả khu phố mất điện?",
        options: ["The streetlights still worked", "It was sunny", "The doors were open"], answer: "The streetlights still worked",
        explainVi: "Đèn đường vẫn sáng nên không phải cả khu phố mất điện." },
      { q: "What was overloaded?", vi: "Thứ gì bị quá tải?",
        options: ["The power strip with too many plugs", "The water fountain", "The front door"], answer: "The power strip with too many plugs" },
      { q: "Who was allowed to touch the breaker box?", vi: "Ai được phép chạm vào hộp cầu dao?",
        options: ["Only an adult (Ms. Lee)", "Any child", "Nobody at all"], answer: "Only an adult (Ms. Lee)",
        explainVi: "Trẻ em chỉ quan sát; chỉ người lớn mới xử lý thiết bị điện cho an toàn." },
    ],
  },
  speaking: {
    repeat: [
      { en: "We should stay calm and use a flashlight.", vi: "Mình nên bình tĩnh và dùng đèn pin." },
      { en: "The power strip was overloaded, so the breaker tripped.", vi: "Ổ cắm bị quá tải nên cầu dao ngắt." },
    ],
    guided: { q: "What should you do in a power outage?", vi: "Bạn nên làm gì khi mất điện?", hint: "We should ___." },
    describe: {
      prompt: "Retell the story in 3–5 sentences. Give the clues in order, name the cause, and say the safe solution.",
      vi: "Kể lại 3–5 câu: nêu các manh mối theo thứ tự, chỉ ra nguyên nhân, và nói cách xử lý an toàn.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"having too many things plugged in at once\"?", vi: "Từ nào nghĩa là \"cắm quá nhiều thứ cùng lúc\"?",
        options: ["overloaded", "calm", "exit"], answer: "overloaded" },
      { type: "reading", q: "Some thought a storm cut the whole street's power. Why was that wrong?", vi: "Vài người nghĩ bão làm cả phố mất điện. Vì sao sai?",
        options: ["The streetlights across the road still worked", "It never rains", "The clock stopped"], answer: "The streetlights across the road still worked",
        explainVi: "Đèn đường còn sáng → không phải cả khu phố mất điện." },
      { type: "reading", q: "The power strip felt warm and had many plugs. What is the best conclusion?", vi: "Ổ cắm ấm và cắm nhiều phích. Kết luận hợp lý nhất?",
        options: ["It was overloaded and tripped the breaker", "It needed more plugs", "It was too cold"], answer: "It was overloaded and tripped the breaker" },
      { type: "listening", q: "What is the SAFE thing for children to do here?", vi: "Điều AN TOÀN mà trẻ nên làm ở đây là gì?",
        options: ["Stand back and let an adult handle the breaker", "Open the breaker box themselves", "Pull all the wires out"], answer: "Stand back and let an adult handle the breaker",
        explainVi: "Trẻ không chạm thiết bị điện; để người lớn xử lý cầu dao." },
    ],
  },
};

/* ============ Level 3 · Opinions & Conversations — Bộ 1: Making Choices ============ */
/* Mỗi bài nêu ≥2 quan điểm hợp lý; máy chấm mà KHÔNG phán bên nào "đúng". */
const L3C1 = "/assets/images/learn/level-3/collection-01-making-choices/";

/* Unit 1: Planning a Class Trip */
const PLANNING_A_CLASS_TRIP: Lesson = {
  id: "classtrip", theme: "making-choices", title: "Planning a Class Trip", vi: "Lên kế hoạch đi dã ngoại", ageRange: "9–12",
  sceneImage: L3C1 + "level-3-c01-unit-01-planning-class-trip.webp",
  vocab: [
    { word: "opinion", ipa: "/əˈpɪnjən/", vi: "ý kiến", emoji: "💬", example: "Everyone shared an opinion.", exampleVi: "Ai cũng nêu một ý kiến." },
    { word: "prefer", ipa: "/prɪˈfɜːr/", vi: "thích hơn", emoji: "👍", example: "I prefer the forest hike.", exampleVi: "Mình thích đi bộ trong rừng hơn." },
    { word: "option", ipa: "/ˈɒpʃn/", vi: "lựa chọn", emoji: "🔀", example: "There were three options.", exampleVi: "Có ba lựa chọn." },
    { word: "reason", ipa: "/ˈriːzn/", vi: "lý do", emoji: "❓", example: "Give a reason for your choice.", exampleVi: "Hãy nêu lý do cho lựa chọn của bạn." },
    { word: "agree", ipa: "/əˈɡriː/", vi: "đồng ý", emoji: "🤝", example: "We all agreed in the end.", exampleVi: "Cuối cùng tất cả đều đồng ý." },
    { word: "vote", ipa: "/voʊt/", vi: "bỏ phiếu", emoji: "🗳️", example: "Let's vote for a trip.", exampleVi: "Cùng bỏ phiếu chọn chuyến đi nào." },
    { word: "suggest", ipa: "/səˈdʒest/", vi: "đề xuất, gợi ý", emoji: "🙋", example: "She suggested the science centre.", exampleVi: "Bạn ấy gợi ý đi trung tâm khoa học." },
    { word: "decide", ipa: "/dɪˈsaɪd/", vi: "quyết định", emoji: "✅", example: "The class decided together.", exampleVi: "Cả lớp cùng nhau quyết định." },
  ],
  patterns: [
    { pattern: "I think we should …", vi: "Mình nghĩ chúng ta nên …", examples: [
      { en: "I think we should choose the forest hike.", vi: "Mình nghĩ chúng ta nên chọn đi bộ trong rừng." },
      { en: "I think we should ask the teacher.", vi: "Mình nghĩ chúng ta nên hỏi cô giáo." }] },
    { pattern: "I prefer … because …", vi: "Mình thích … hơn vì …", examples: [
      { en: "I prefer the boat tour because it is exciting.", vi: "Mình thích đi thuyền hơn vì rất thú vị." },
      { en: "I prefer the hike because it is cheap.", vi: "Mình thích đi bộ hơn vì rẻ." }] },
    { pattern: "That's a good idea, but …", vi: "Ý hay đấy, nhưng …", examples: [
      { en: "That's a good idea, but it costs a lot.", vi: "Ý hay đấy, nhưng tốn khá nhiều tiền." },
      { en: "That's a good idea, but I prefer the hike.", vi: "Ý hay đấy, nhưng mình thích đi bộ hơn." }] },
    { pattern: "Let's agree on …", vi: "Cùng thống nhất chọn …", examples: [
      { en: "Let's agree on one trip.", vi: "Cùng thống nhất một chuyến đi nào." },
      { en: "Let's agree on the forest hike.", vi: "Cùng thống nhất chọn đi bộ trong rừng nhé." }] },
  ],
  listening: {
    intro: "Listen to the class discussion, then answer.",
    introVi: "Nghe cả lớp thảo luận rồi trả lời.",
    script: "Maple's class was planning a trip, and they had three choices: a science centre, a forest hike, or a harbour boat tour. \"I think we should choose the forest hike,\" said Maple. \"It doesn't cost much, and we might see deer.\" Theo shook his head politely. \"That's a good idea, but I prefer the boat tour, because I have never been on a boat.\" Another student suggested the science centre, because they could look through a real telescope. Everyone had a good reason, so the teacher said, \"Let's vote.\" Most of the class voted for the forest hike, so they all agreed to go there together.",
    questions: [
      { q: "How many choices did the class have?", vi: "Cả lớp có mấy lựa chọn?",
        options: ["Three", "One", "Five"], answer: "Three" },
      { q: "What was Maple's reason for the forest hike?", vi: "Lý do Maple chọn đi bộ trong rừng là gì?",
        options: ["It was cheap and they might see deer", "It was the most expensive", "It was on a boat"], answer: "It was cheap and they might see deer",
        explainVi: "Maple nói chuyến đó rẻ và có thể thấy hươu." },
      { q: "How did the class make the final decision?", vi: "Cả lớp đưa ra quyết định cuối cùng bằng cách nào?",
        options: ["They voted and agreed", "The teacher chose alone", "They flipped a coin"], answer: "They voted and agreed" },
    ],
  },
  speaking: {
    repeat: [
      { en: "I prefer the forest hike because we might see deer.", vi: "Mình thích đi bộ trong rừng hơn vì có thể thấy hươu." },
      { en: "That's a good idea, but I prefer the boat tour.", vi: "Ý hay đấy, nhưng mình thích đi thuyền hơn." },
    ],
    guided: { q: "Which class trip would you choose, and why?", vi: "Bạn sẽ chọn chuyến đi nào, và vì sao?", hint: "I would choose the ___ because ___." },
    describe: {
      prompt: "Share your opinion in 3–5 sentences. Say which trip you prefer, give one reason, and respond politely to another idea.",
      vi: "Nêu ý kiến 3–5 câu: bạn thích chuyến nào, một lý do, và phản hồi lịch sự với một ý khác.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"to like one thing more than another\"?", vi: "Từ nào nghĩa là \"thích cái này hơn cái kia\"?",
        options: ["prefer", "vote", "reason"], answer: "prefer" },
      { type: "reading", q: "Theo preferred the boat tour. What was his reason?", vi: "Theo thích đi thuyền hơn. Lý do của cậu là gì?",
        options: ["He had never been on a boat", "Boats are cheap", "He wanted to see deer"], answer: "He had never been on a boat",
        explainVi: "Theo nói cậu chưa từng đi thuyền." },
      { type: "sentence", q: "A friend suggests an idea you don't fully like. Which is a POLITE reply?", vi: "Bạn gợi ý một ý bạn chưa hẳn thích. Câu nào là phản hồi LỊCH SỰ?",
        options: ["That's a good idea, but I prefer another one.", "No, that's a silly idea.", "Stop talking, please."], answer: "That's a good idea, but I prefer another one.",
        explainVi: "Khen trước rồi nêu ý mình là cách nói lịch sự." },
      { type: "listening", q: "How did the class choose which trip to take?", vi: "Cả lớp chọn chuyến đi bằng cách nào?",
        options: ["They voted and agreed", "They asked a robot", "Nobody decided"], answer: "They voted and agreed" },
    ],
  },
};

/* Unit 2: Screen Time or Outdoor Time? */
const SCREEN_OR_OUTDOOR_TIME: Lesson = {
  id: "screentime", theme: "making-choices", title: "Screen Time or Outdoor Time?", vi: "Chơi màn hình hay ra ngoài trời?", ageRange: "9–12",
  sceneImage: L3C1 + "level-3-c01-unit-02-screen-or-outdoor-time.webp",
  vocab: [
    { word: "screen", ipa: "/skriːn/", vi: "màn hình", emoji: "📱", example: "He plays games on a screen.", exampleVi: "Cậu ấy chơi game trên màn hình." },
    { word: "outdoor", ipa: "/ˈaʊtdɔːr/", vi: "ngoài trời", emoji: "🌳", example: "Outdoor time is fun with friends.", exampleVi: "Chơi ngoài trời vui khi có bạn bè." },
    { word: "benefit", ipa: "/ˈbenɪfɪt/", vi: "lợi ích", emoji: "➕", example: "One benefit is fresh air.", exampleVi: "Một lợi ích là không khí trong lành." },
    { word: "drawback", ipa: "/ˈdrɔːbæk/", vi: "điểm dở, hạn chế", emoji: "➖", example: "A drawback is tired eyes.", exampleVi: "Một điểm dở là mỏi mắt." },
    { word: "balance", ipa: "/ˈbæləns/", vi: "sự cân bằng", emoji: "⚖️", example: "A good balance is best.", exampleVi: "Cân bằng tốt là hay nhất." },
    { word: "compromise", ipa: "/ˈkɒmprəmaɪz/", vi: "sự thoả hiệp", emoji: "🤝", example: "They made a fair compromise.", exampleVi: "Các bạn thoả hiệp công bằng." },
    { word: "healthy", ipa: "/ˈhelθi/", vi: "khoẻ mạnh, lành mạnh", emoji: "💪", example: "Exercise keeps us healthy.", exampleVi: "Vận động giúp mình khoẻ mạnh." },
    { word: "both", ipa: "/boʊθ/", vi: "cả hai", emoji: "🔁", example: "Why not enjoy both?", exampleVi: "Sao không tận hưởng cả hai nhỉ?" },
  ],
  patterns: [
    { pattern: "One benefit of … is …", vi: "Một lợi ích của … là …", examples: [
      { en: "One benefit of outdoor time is fresh air.", vi: "Một lợi ích của việc ra ngoài là không khí trong lành." },
      { en: "One benefit of screen time is learning from videos.", vi: "Một lợi ích của màn hình là học từ video." }] },
    { pattern: "One drawback of … is …", vi: "Một điểm dở của … là …", examples: [
      { en: "One drawback of too much screen time is tired eyes.", vi: "Một điểm dở của việc dùng màn hình quá nhiều là mỏi mắt." },
      { en: "One drawback of outdoor time is bad weather.", vi: "Một điểm dở của việc ra ngoài là thời tiết xấu." }] },
    { pattern: "On the other hand, …", vi: "Mặt khác, …", examples: [
      { en: "On the other hand, we can't play outside in the rain.", vi: "Mặt khác, mình không thể chơi ngoài trời khi mưa." },
      { en: "On the other hand, screens can tire your eyes.", vi: "Mặt khác, màn hình có thể làm mỏi mắt." }] },
    { pattern: "Why don't we do both?", vi: "Sao mình không làm cả hai nhỉ?", examples: [
      { en: "Why don't we do both, a little each day?", vi: "Sao mình không làm cả hai, mỗi ngày một chút?" },
      { en: "Why don't we play outside, then read?", vi: "Sao mình không chơi ngoài rồi đọc sách nhỉ?" }] },
  ],
  listening: {
    intro: "Listen to the discussion about free time, then answer.",
    introVi: "Nghe cuộc trò chuyện về thời gian rảnh rồi trả lời.",
    script: "Theo and Maple were talking about free time. \"I love screen time,\" said Theo. \"One benefit is that I can learn from videos and play games even when it rains.\" \"That's true,\" said Maple, \"but one drawback is that too much screen time can tire your eyes. I prefer outdoor time. One benefit is fresh air and exercise.\" \"On the other hand,\" said Theo, \"we can't always play outside when the weather is bad.\" They thought carefully about the benefits and drawbacks of both. In the end, they made a compromise: play outside when the weather is nice, and use screens for a short time when it rains. That way, they had a good, healthy balance.",
    questions: [
      { q: "What benefit of screen time did Theo give?", vi: "Theo nêu lợi ích nào của việc dùng màn hình?",
        options: ["He can learn from videos and play when it rains", "It gives fresh air", "It is free exercise"], answer: "He can learn from videos and play when it rains" },
      { q: "What drawback of too much screen time did Maple mention?", vi: "Maple nhắc tới điểm dở nào của việc dùng màn hình quá nhiều?",
        options: ["It can tire your eyes", "It makes you too strong", "It is too cheap"], answer: "It can tire your eyes" },
      { q: "What compromise did they make?", vi: "Hai bạn thoả hiệp thế nào?",
        options: ["Play outside in nice weather, use screens a short time when it rains", "Only use screens all day", "Never go outside again"], answer: "Play outside in nice weather, use screens a short time when it rains",
        explainVi: "Cả hai chọn cách cân bằng: ra ngoài khi trời đẹp, dùng màn hình ngắn khi mưa." },
    ],
  },
  speaking: {
    repeat: [
      { en: "One benefit of outdoor time is fresh air and exercise.", vi: "Một lợi ích của việc ra ngoài là không khí trong lành và vận động." },
      { en: "Why don't we do both, a little each day?", vi: "Sao mình không làm cả hai, mỗi ngày một chút nhỉ?" },
    ],
    guided: { q: "Do you prefer screen time or outdoor time? Give one reason.", vi: "Bạn thích chơi màn hình hay ra ngoài trời hơn? Nêu một lý do.", hint: "I prefer ___ because ___." },
    describe: {
      prompt: "Give a balanced opinion in 3–5 sentences. Say one benefit and one drawback, then suggest a compromise.",
      vi: "Nêu ý kiến cân bằng 3–5 câu: một lợi ích, một điểm dở, rồi đề xuất một cách thoả hiệp.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"a good thing about something\"?", vi: "Từ nào nghĩa là \"điểm tốt của một thứ\"?",
        options: ["benefit", "drawback", "screen"], answer: "benefit" },
      { type: "reading", q: "Which of these is a DRAWBACK of too much screen time?", vi: "Điều nào là ĐIỂM DỞ của việc dùng màn hình quá nhiều?",
        options: ["It can tire your eyes", "You get fresh air", "You meet friends outside"], answer: "It can tire your eyes" },
      { type: "reading", q: "What does \"compromise\" mean?", vi: "\"Compromise\" (thoả hiệp) nghĩa là gì?",
        options: ["A choice where both sides give a little and agree", "When one person always wins", "Doing nothing at all"], answer: "A choice where both sides give a little and agree" },
      { type: "listening", q: "What did Theo and Maple finally agree to do?", vi: "Cuối cùng Theo và Maple đồng ý làm gì?",
        options: ["Do both — outside when nice, screens a short time when it rains", "Only stay inside", "Argue and stop being friends"], answer: "Do both — outside when nice, screens a short time when it rains" },
    ],
  },
};

/* Unit 3: Choosing a Team Project */
const CHOOSING_A_TEAM_PROJECT: Lesson = {
  id: "teamproject", theme: "making-choices", title: "Choosing a Team Project", vi: "Chọn dự án nhóm", ageRange: "9–12",
  sceneImage: L3C1 + "level-3-c01-unit-03-choosing-team-project.webp",
  vocab: [
    { word: "propose", ipa: "/prəˈpoʊz/", vi: "đề xuất", emoji: "🙋", example: "I'd like to propose a bee garden.", exampleVi: "Mình muốn đề xuất một khu vườn cho ong." },
    { word: "role", ipa: "/roʊl/", vi: "vai trò", emoji: "🎭", example: "Everyone has a role in the team.", exampleVi: "Mỗi người có một vai trò trong nhóm." },
    { word: "strength", ipa: "/streŋθ/", vi: "điểm mạnh", emoji: "⭐", example: "Drawing is her strength.", exampleVi: "Vẽ là điểm mạnh của bạn ấy." },
    { word: "volunteer", ipa: "/ˌvɒlənˈtɪr/", vi: "xung phong", emoji: "✋", example: "He volunteered to take photos.", exampleVi: "Cậu ấy xung phong chụp ảnh." },
    { word: "responsible", ipa: "/rɪˈspɒnsəbl/", vi: "có trách nhiệm", emoji: "🫡", example: "She is responsible for the map.", exampleVi: "Bạn ấy phụ trách phần bản đồ." },
    { word: "fair", ipa: "/fer/", vi: "công bằng", emoji: "⚖️", example: "The jobs felt fair to everyone.", exampleVi: "Việc phân công thấy công bằng với mọi người." },
    { word: "teamwork", ipa: "/ˈtiːmwɜːrk/", vi: "làm việc nhóm", emoji: "🤝", example: "Good teamwork wins.", exampleVi: "Làm việc nhóm tốt sẽ thắng." },
    { word: "support", ipa: "/səˈpɔːrt/", vi: "ủng hộ", emoji: "👏", example: "We support each other's ideas.", exampleVi: "Chúng mình ủng hộ ý tưởng của nhau." },
  ],
  patterns: [
    { pattern: "I'd like to propose …", vi: "Mình muốn đề xuất …", examples: [
      { en: "I'd like to propose a community map.", vi: "Mình muốn đề xuất một bản đồ khu phố." },
      { en: "I'd like to propose a solar station.", vi: "Mình muốn đề xuất một trạm sạc mặt trời." }] },
    { pattern: "That sounds great! I can …", vi: "Nghe hay đấy! Mình có thể …", examples: [
      { en: "That sounds great! I can help draw it.", vi: "Nghe hay đấy! Mình có thể giúp vẽ." },
      { en: "That sounds great! I can present it.", vi: "Nghe hay đấy! Mình có thể thuyết trình." }] },
    { pattern: "You are good at … , so you could …", vi: "Bạn giỏi … nên bạn có thể …", examples: [
      { en: "You are good at drawing, so you could draw the map.", vi: "Bạn giỏi vẽ nên bạn có thể vẽ bản đồ." },
      { en: "You are good at speaking, so you could present.", vi: "Bạn giỏi nói nên bạn có thể thuyết trình." }] },
    { pattern: "Is everyone happy with …?", vi: "Mọi người ổn với … chứ?", examples: [
      { en: "Is everyone happy with their job?", vi: "Mọi người ổn với phần việc của mình chứ?" },
      { en: "Is everyone happy with this plan?", vi: "Mọi người ổn với kế hoạch này chứ?" }] },
  ],
  listening: {
    intro: "Listen to the team discussion, then answer.",
    introVi: "Nghe cả nhóm thảo luận rồi trả lời.",
    script: "Maple's team had to choose one project. \"I'd like to propose a bee garden,\" said one girl, \"because bees help our plants grow.\" \"That sounds great,\" said Theo, \"but I'd like to propose a solar charging station, because it saves energy.\" After sharing ideas, they decided together on the community map, because everyone could help with it. Next, they shared the roles. \"You are good at drawing, so you could draw the map,\" said Maple. \"I'm good at speaking, so I can present it.\" A quiet boy volunteered to take the photos. \"Is everyone happy with their job?\" asked Maple. Everyone nodded — it felt fair, and that is good teamwork.",
    questions: [
      { q: "Why did the girl propose a bee garden?", vi: "Vì sao bạn nữ đề xuất khu vườn cho ong?",
        options: ["Because bees help plants grow", "Because bees are scary", "Because gardens are cheap"], answer: "Because bees help plants grow" },
      { q: "Which project did the team finally choose together?", vi: "Cuối cùng nhóm cùng chọn dự án nào?",
        options: ["The community map", "The bee garden", "The solar station"], answer: "The community map",
        explainVi: "Cả nhóm chọn bản đồ khu phố vì ai cũng góp sức được." },
      { q: "How did they share the roles?", vi: "Các bạn phân chia vai trò thế nào?",
        options: ["By each person's strength", "By who is tallest", "By age only"], answer: "By each person's strength" },
    ],
  },
  speaking: {
    repeat: [
      { en: "That sounds great! I can help with the map.", vi: "Nghe hay đấy! Mình có thể giúp làm bản đồ." },
      { en: "You are good at drawing, so you could draw the map.", vi: "Bạn giỏi vẽ nên bạn có thể vẽ bản đồ." },
    ],
    guided: { q: "What are you good at in a team?", vi: "Trong nhóm bạn giỏi việc gì?", hint: "I am good at ___, so I could ___." },
    describe: {
      prompt: "Discuss a team project in 3–5 sentences. Propose one idea politely and give one person a role that fits their strength.",
      vi: "Bàn về một dự án nhóm 3–5 câu: đề xuất lịch sự một ý và giao cho một bạn vai trò hợp điểm mạnh.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"something you do well\"?", vi: "Từ nào nghĩa là \"việc bạn làm giỏi\"?",
        options: ["strength", "role", "support"], answer: "strength" },
      { type: "sentence", q: "A friend proposes an idea. Which is a kind, helpful reply?", vi: "Một bạn đề xuất ý tưởng. Câu nào là phản hồi tử tế, hợp tác?",
        options: ["That sounds great! I can help.", "That's a boring idea.", "I really don't care."], answer: "That sounds great! I can help.",
        explainVi: "Ủng hộ và đề nghị giúp là cách phản hồi tích cực." },
      { type: "reading", q: "Someone is good at drawing. Which job fits best?", vi: "Một bạn giỏi vẽ. Việc nào hợp nhất?",
        options: ["Draw the map", "Cook the lunch", "Drive the bus"], answer: "Draw the map",
        explainVi: "Giao việc theo điểm mạnh: giỏi vẽ thì vẽ bản đồ." },
      { type: "listening", q: "Why did the team feel the roles were fair?", vi: "Vì sao nhóm thấy việc phân vai công bằng?",
        options: ["Everyone got a job that matched their strength", "Only one person did all the work", "They gave the hardest job to the youngest"], answer: "Everyone got a job that matched their strength" },
    ],
  },
};

/* ============ Level 3 · Bộ 2: Giving Reasons — củng cố ý kiến bằng ví dụ & hệ quả ============ */
const L3C2 = "/assets/images/learn/level-3/collection-02-giving-reasons/";

/* Unit 1: Should Homework Be Shorter? */
const SHOULD_HOMEWORK_BE_SHORTER: Lesson = {
  id: "homework", theme: "giving-reasons", title: "Should Homework Be Shorter?", vi: "Bài tập về nhà có nên ngắn hơn?", ageRange: "9–12",
  sceneImage: L3C2 + "level-3-c02-unit-01-shorter-homework.webp",
  vocab: [
    { word: "homework", ipa: "/ˈhoʊmwɜːrk/", vi: "bài tập về nhà", emoji: "📓", example: "We have homework every day.", exampleVi: "Ngày nào tụi mình cũng có bài tập về nhà." },
    { word: "shorter", ipa: "/ˈʃɔːrtər/", vi: "ngắn hơn", emoji: "✂️", example: "Should homework be shorter?", exampleVi: "Bài tập về nhà có nên ngắn hơn không?" },
    { word: "opinion", ipa: "/əˈpɪnjən/", vi: "ý kiến", emoji: "💬", example: "In my opinion, yes.", exampleVi: "Theo mình thì có." },
    { word: "example", ipa: "/ɪɡˈzæmpl/", vi: "ví dụ", emoji: "📌", example: "Give an example to support your idea.", exampleVi: "Nêu một ví dụ để củng cố ý của bạn." },
    { word: "disagree", ipa: "/ˌdɪsəˈɡriː/", vi: "không đồng ý", emoji: "🙅", example: "I politely disagree.", exampleVi: "Mình lịch sự không đồng ý." },
    { word: "practise", ipa: "/ˈpræktɪs/", vi: "luyện tập", emoji: "✏️", example: "Homework helps us practise.", exampleVi: "Bài tập giúp mình luyện tập." },
    { word: "tired", ipa: "/ˈtaɪərd/", vi: "mệt", emoji: "😴", example: "Long homework makes us tired.", exampleVi: "Bài tập dài khiến mình mệt." },
    { word: "enough", ipa: "/ɪˈnʌf/", vi: "đủ", emoji: "👌", example: "We need enough sleep.", exampleVi: "Mình cần ngủ đủ giấc." },
  ],
  patterns: [
    { pattern: "In my opinion, …", vi: "Theo mình, …", examples: [
      { en: "In my opinion, homework should be shorter.", vi: "Theo mình, bài tập nên ngắn hơn." },
      { en: "In my opinion, both ideas are fair.", vi: "Theo mình, cả hai ý đều hợp lý." }] },
    { pattern: "For example, …", vi: "Ví dụ, …", examples: [
      { en: "For example, we need time for sports.", vi: "Ví dụ, mình cần thời gian chơi thể thao." },
      { en: "For example, maths gets easier with practice.", vi: "Ví dụ, toán dễ hơn khi luyện tập." }] },
    { pattern: "Maybe a little … , not too …", vi: "Có lẽ … một chút thôi, đừng quá …", examples: [
      { en: "Maybe a little shorter, not too short.", vi: "Có lẽ ngắn hơn một chút, đừng quá ngắn." },
      { en: "Maybe a little homework, not too much.", vi: "Có lẽ một chút bài tập, đừng quá nhiều." }] },
    { pattern: "I see your point, but …", vi: "Mình hiểu ý bạn, nhưng …", examples: [
      { en: "I see your point, but I don't fully agree.", vi: "Mình hiểu ý bạn, nhưng chưa hẳn đồng ý." },
      { en: "I see your point, but homework helps us practise.", vi: "Mình hiểu ý bạn, nhưng bài tập giúp luyện tập." }] },
  ],
  listening: {
    intro: "Listen to the discussion, then answer. Notice the reasons!",
    introVi: "Nghe cuộc thảo luận rồi trả lời. Chú ý các lý do!",
    script: "The class was talking about a big question: \"Should homework be shorter?\" \"In my opinion, yes,\" said Maple. \"For example, we need time for sports, reading and enough sleep. When homework is too long, we feel tired.\" \"I see your point,\" said Theo, \"but I don't fully agree. Homework helps us practise. For example, maths gets easier when you do a few problems at home.\" The teacher smiled. \"So maybe homework could be a little shorter, but not gone completely?\" Everyone thought that was a fair idea, because both reasons made sense.",
    questions: [
      { q: "What was the class's big question?", vi: "Câu hỏi lớn của lớp là gì?",
        options: ["Should homework be shorter?", "What is for lunch?", "Where is the park?"], answer: "Should homework be shorter?" },
      { q: "What example did Maple give to support her opinion?", vi: "Maple nêu ví dụ nào để củng cố ý kiến?",
        options: ["We need time for sports, reading and sleep", "Homework is fun", "Maths is boring"], answer: "We need time for sports, reading and sleep" },
      { q: "What was Theo's reason for keeping homework?", vi: "Lý do Theo muốn giữ bài tập là gì?",
        options: ["It helps us practise, like maths", "It looks nice", "It is short"], answer: "It helps us practise, like maths",
        explainVi: "Theo cho rằng làm bài giúp luyện tập, ví dụ môn toán." },
    ],
  },
  speaking: {
    repeat: [
      { en: "In my opinion, homework should be a little shorter.", vi: "Theo mình, bài tập nên ngắn hơn một chút." },
      { en: "I see your point, but I don't fully agree.", vi: "Mình hiểu ý bạn, nhưng chưa hẳn đồng ý." },
    ],
    guided: { q: "Do you think homework should be shorter? Give one example.", vi: "Bạn nghĩ bài tập nên ngắn hơn không? Nêu một ví dụ.", hint: "In my opinion, ___. For example, ___." },
    describe: {
      prompt: "Give your opinion in 3–5 sentences. State it, add one example, and disagree politely with another idea.",
      vi: "Nêu ý kiến 3–5 câu: nói ý mình, thêm một ví dụ, và phản đối lịch sự một ý khác.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"a fact or case that supports your idea\"?", vi: "Từ nào nghĩa là \"dẫn chứng củng cố ý của bạn\"?",
        options: ["example", "opinion", "homework"], answer: "example" },
      { type: "reading", q: "Maple thinks homework should be shorter. Which example SUPPORTS her opinion?", vi: "Maple nghĩ bài tập nên ngắn hơn. Ví dụ nào CỦNG CỐ ý đó?",
        options: ["We need time for sports and sleep.", "Homework helps us practise maths.", "The sky is blue."], answer: "We need time for sports and sleep.",
        explainVi: "Cần thời gian chơi và ngủ là lý do ủng hộ việc rút ngắn bài tập." },
      { type: "sentence", q: "You don't agree with a friend. Which is a POLITE way to disagree?", vi: "Bạn không đồng ý với bạn. Câu nào là cách phản đối LỊCH SỰ?",
        options: ["I see your point, but I don't fully agree.", "You are wrong and silly.", "That's the worst idea ever."], answer: "I see your point, but I don't fully agree.",
        explainVi: "Ghi nhận ý người kia rồi nêu điểm khác là cách nói lịch sự." },
      { type: "reading", q: "Which reason is NOT related to the homework question?", vi: "Lý do nào KHÔNG liên quan tới câu hỏi về bài tập?",
        options: ["My cat is orange.", "Homework helps us practise.", "Long homework makes us tired."], answer: "My cat is orange.",
        explainVi: "Màu con mèo chẳng liên quan gì tới chuyện bài tập dài hay ngắn." },
    ],
  },
};

/* Unit 2: Save It or Spend It? */
const SAVE_IT_OR_SPEND_IT: Lesson = {
  id: "savespend", theme: "giving-reasons", title: "Save It or Spend It?", vi: "Tiết kiệm hay tiêu?", ageRange: "9–12",
  sceneImage: L3C2 + "level-3-c02-unit-02-save-or-spend.webp",
  vocab: [
    { word: "save", ipa: "/seɪv/", vi: "tiết kiệm", emoji: "🐷", example: "Let's save some money.", exampleVi: "Cùng để dành một ít tiền nào." },
    { word: "spend", ipa: "/spend/", vi: "tiêu, chi", emoji: "🛍️", example: "Should we spend it now?", exampleVi: "Mình có nên tiêu ngay không?" },
    { word: "money", ipa: "/ˈmʌni/", vi: "tiền", emoji: "💰", example: "We earned some money.", exampleVi: "Tụi mình kiếm được một ít tiền." },
    { word: "goal", ipa: "/ɡoʊl/", vi: "mục tiêu", emoji: "🎯", example: "Our goal is a new soccer ball.", exampleVi: "Mục tiêu của tụi mình là quả bóng mới." },
    { word: "afford", ipa: "/əˈfɔːrd/", vi: "đủ tiền mua", emoji: "🧮", example: "We can't afford it yet.", exampleVi: "Tụi mình chưa đủ tiền mua nó." },
    { word: "wait", ipa: "/weɪt/", vi: "chờ, đợi", emoji: "⏳", example: "If we wait, we can buy more.", exampleVi: "Nếu chờ, mình mua được nhiều hơn." },
    { word: "important", ipa: "/ɪmˈpɔːrtənt/", vi: "quan trọng", emoji: "❗", example: "What is most important to you?", exampleVi: "Điều gì quan trọng nhất với bạn?" },
    { word: "later", ipa: "/ˈleɪtər/", vi: "sau này", emoji: "🔜", example: "We can spend it later.", exampleVi: "Mình có thể tiêu nó sau này." },
  ],
  patterns: [
    { pattern: "If we save, we can …", vi: "Nếu tiết kiệm, mình có thể …", examples: [
      { en: "If we save, we can buy a soccer ball for the team.", vi: "Nếu tiết kiệm, mình có thể mua bóng cho cả đội." },
      { en: "If we save, we can afford it later.", vi: "Nếu tiết kiệm, sau này mình đủ tiền mua." }] },
    { pattern: "If we spend it now, we will …", vi: "Nếu tiêu ngay, mình sẽ …", examples: [
      { en: "If we spend it now, we will have nothing left.", vi: "Nếu tiêu ngay, mình sẽ chẳng còn gì." },
      { en: "If we spend it now, we will enjoy it today.", vi: "Nếu tiêu ngay, mình sẽ vui hôm nay." }] },
    { pattern: "What matters most is …", vi: "Điều quan trọng nhất là …", examples: [
      { en: "What matters most is our team goal.", vi: "Điều quan trọng nhất là mục tiêu của đội." },
      { en: "What matters most to me is helping others.", vi: "Điều quan trọng nhất với mình là giúp đỡ người khác." }] },
    { pattern: "Let's save some and spend some.", vi: "Cùng tiết kiệm một phần, tiêu một phần.", examples: [
      { en: "Let's save some and spend some — that's fair.", vi: "Cùng để dành một phần, tiêu một phần — vậy là công bằng." },
      { en: "Let's save most and give a little.", vi: "Cùng để dành phần lớn và cho đi một chút." }] },
  ],
  listening: {
    intro: "Listen to the money discussion, then answer.",
    introVi: "Nghe cuộc bàn về tiền rồi trả lời.",
    script: "The friends earned some money at a craft sale. \"Let's spend it all now and buy snacks!\" said one boy. \"Wait,\" said Maple. \"If we spend it all now, we will have nothing left. If we save, we can buy a new soccer ball for the whole team later.\" Theo added, \"What matters most to me is helping. We could give a little to the animal shelter, too.\" They talked about what was important and about what would happen soon and later. In the end, they made a plan: save some, spend a little today, and give a little. Everyone felt good about the balanced plan.",
    questions: [
      { q: "Where did the friends get the money?", vi: "Các bạn kiếm được tiền ở đâu?",
        options: ["From a craft sale", "From a race", "They found it on the bus"], answer: "From a craft sale" },
      { q: "What did Maple say would happen if they spent it all now?", vi: "Maple nói nếu tiêu hết ngay thì sao?",
        options: ["They would have nothing left", "They would get richer", "The money would grow"], answer: "They would have nothing left",
        explainVi: "Tiêu hết ngay thì chẳng còn gì cho sau này." },
      { q: "What plan did they finally make?", vi: "Cuối cùng các bạn lập kế hoạch gì?",
        options: ["Save some, spend a little, and give a little", "Spend it all on snacks", "Throw the money away"], answer: "Save some, spend a little, and give a little" },
    ],
  },
  speaking: {
    repeat: [
      { en: "If we save, we can buy a soccer ball later.", vi: "Nếu tiết kiệm, sau này mình mua được quả bóng." },
      { en: "Let's save some and spend some.", vi: "Cùng để dành một phần, tiêu một phần nào." },
    ],
    guided: { q: "Would you save or spend your money? Give a reason.", vi: "Bạn sẽ tiết kiệm hay tiêu tiền? Nêu một lý do.", hint: "I would ___ because ___." },
    describe: {
      prompt: "Share your plan in 3–5 sentences. Say what you would do now, what would happen later, and one compromise.",
      vi: "Chia sẻ kế hoạch 3–5 câu: bạn làm gì bây giờ, điều gì xảy ra sau này, và một cách thoả hiệp.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"to keep money for later instead of spending it\"?", vi: "Từ nào nghĩa là \"giữ tiền để sau, không tiêu\"?",
        options: ["save", "spend", "afford"], answer: "save" },
      { type: "reading", q: "If you SAVE your money, what can you do later?", vi: "Nếu bạn TIẾT KIỆM tiền, sau này bạn có thể làm gì?",
        options: ["Buy something bigger later", "Have nothing left", "Lose it right away"], answer: "Buy something bigger later" },
      { type: "reading", q: "What happens if you SPEND all your money right away?", vi: "Nếu bạn TIÊU hết tiền ngay thì điều gì xảy ra?",
        options: ["You have nothing left for later", "It grows by itself", "You save more"], answer: "You have nothing left for later",
        explainVi: "Tiêu hết ngay là hệ quả trước mắt: không còn tiền cho sau này." },
      { type: "listening", q: "What balanced plan did the friends choose?", vi: "Các bạn chọn kế hoạch cân bằng nào?",
        options: ["Save some, spend a little, give a little", "Spend everything on snacks", "Never spend anything"], answer: "Save some, spend a little, give a little" },
    ],
  },
};

/* Unit 3: What Makes a Good Friend? */
const WHAT_MAKES_A_GOOD_FRIEND: Lesson = {
  id: "goodfriend", theme: "giving-reasons", title: "What Makes a Good Friend?", vi: "Điều gì tạo nên người bạn tốt?", ageRange: "9–12",
  sceneImage: L3C2 + "level-3-c02-unit-03-good-friend.webp",
  vocab: [
    { word: "friendship", ipa: "/ˈfrendʃɪp/", vi: "tình bạn", emoji: "🫂", example: "Friendship is important.", exampleVi: "Tình bạn rất quan trọng." },
    { word: "quality", ipa: "/ˈkwɒləti/", vi: "phẩm chất", emoji: "🌟", example: "Kindness is a good quality.", exampleVi: "Tử tế là một phẩm chất tốt." },
    { word: "kind", ipa: "/kaɪnd/", vi: "tử tế", emoji: "💗", example: "A good friend is kind.", exampleVi: "Một người bạn tốt thì tử tế." },
    { word: "honest", ipa: "/ˈɒnɪst/", vi: "trung thực", emoji: "🤝", example: "An honest friend tells the truth.", exampleVi: "Một người bạn trung thực nói sự thật." },
    { word: "helpful", ipa: "/ˈhelpfl/", vi: "hay giúp đỡ", emoji: "🙌", example: "She is always helpful.", exampleVi: "Bạn ấy luôn sẵn lòng giúp đỡ." },
    { word: "listen", ipa: "/ˈlɪsn/", vi: "lắng nghe", emoji: "👂", example: "A good friend listens to you.", exampleVi: "Người bạn tốt lắng nghe bạn." },
    { word: "share", ipa: "/ʃer/", vi: "chia sẻ", emoji: "🤲", example: "Good friends share things.", exampleVi: "Bạn tốt biết chia sẻ." },
    { word: "trust", ipa: "/trʌst/", vi: "tin tưởng", emoji: "🔒", example: "We trust our best friends.", exampleVi: "Mình tin tưởng những người bạn thân." },
  ],
  patterns: [
    { pattern: "A good friend is …", vi: "Một người bạn tốt thì …", examples: [
      { en: "A good friend is kind and honest.", vi: "Một người bạn tốt thì tử tế và trung thực." },
      { en: "A good friend is a good listener.", vi: "Một người bạn tốt biết lắng nghe." }] },
    { pattern: "I know because …", vi: "Mình biết điều đó vì …", examples: [
      { en: "I know because she helped me when I fell.", vi: "Mình biết vì bạn ấy đã đỡ mình dậy khi mình ngã." },
      { en: "I know because he listens when I am sad.", vi: "Mình biết vì cậu ấy lắng nghe khi mình buồn." }] },
    { pattern: "I'd like to add that …", vi: "Mình muốn nói thêm rằng …", examples: [
      { en: "I'd like to add that a good friend is honest.", vi: "Mình muốn nói thêm rằng bạn tốt thì trung thực." },
      { en: "I'd like to add that sharing matters too.", vi: "Mình muốn nói thêm rằng biết chia sẻ cũng quan trọng." }] },
    { pattern: "There isn't just one …", vi: "Không chỉ có một …", examples: [
      { en: "There isn't just one quality that matters.", vi: "Không chỉ có một phẩm chất là quan trọng." },
      { en: "There isn't just one right answer.", vi: "Không chỉ có một đáp án đúng duy nhất." }] },
  ],
  listening: {
    intro: "Listen to the friendship talk, then answer.",
    introVi: "Nghe cuộc trò chuyện về tình bạn rồi trả lời.",
    script: "The friends were talking about what makes a good friend. \"A good friend is kind,\" said Maple. \"I know because when I fell, my friend helped me up.\" \"I'd like to add that a good friend is a good listener,\" said Theo. \"For example, they listen when you are sad.\" Another friend said honesty matters too — a good friend tells the truth in a gentle way. The teacher nodded. \"So there isn't just one quality. A good friend can be kind, honest, and a good listener all at once.\" Everyone agreed that many qualities matter together.",
    questions: [
      { q: "What quality did Maple name first?", vi: "Maple nêu phẩm chất nào đầu tiên?",
        options: ["Kind", "Fast", "Tall"], answer: "Kind" },
      { q: "What evidence did Maple give for that quality?", vi: "Maple đưa dẫn chứng nào cho phẩm chất đó?",
        options: ["Her friend helped her up when she fell", "Her friend runs fast", "Her friend has a big house"], answer: "Her friend helped her up when she fell",
        explainVi: "Việc đỡ bạn dậy là bằng chứng cho sự tử tế." },
      { q: "What was the group's final conclusion?", vi: "Kết luận cuối cùng của cả nhóm là gì?",
        options: ["Many qualities matter together, not just one", "Only being funny matters", "A friend must be perfect"], answer: "Many qualities matter together, not just one" },
    ],
  },
  speaking: {
    repeat: [
      { en: "A good friend is kind and a good listener.", vi: "Một người bạn tốt thì tử tế và biết lắng nghe." },
      { en: "I'd like to add that a good friend is honest.", vi: "Mình muốn nói thêm rằng bạn tốt thì trung thực." },
    ],
    guided: { q: "What makes a good friend to you? Give one example.", vi: "Với bạn, điều gì tạo nên người bạn tốt? Nêu một ví dụ.", hint: "A good friend is ___. I know because ___." },
    describe: {
      prompt: "Share your view in 3–5 sentences. Name one quality, give evidence, and add one more idea.",
      vi: "Chia sẻ 3–5 câu: nêu một phẩm chất, đưa dẫn chứng, và bổ sung thêm một ý.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"always telling the truth\"?", vi: "Từ nào nghĩa là \"luôn nói sự thật\"?",
        options: ["honest", "helpful", "quality"], answer: "honest" },
      { type: "reading", q: "Your friend listens when you are sad. Which quality does this show?", vi: "Bạn của bạn lắng nghe khi bạn buồn. Điều đó thể hiện phẩm chất nào?",
        options: ["A good listener", "A fast runner", "A messy eater"], answer: "A good listener",
        explainVi: "Lắng nghe lúc bạn buồn là dẫn chứng của việc biết lắng nghe." },
      { type: "sentence", q: "You want to add another idea to the talk. Which is a kind way to do it?", vi: "Bạn muốn bổ sung một ý. Câu nào là cách nói tử tế?",
        options: ["I'd like to add that a good friend is honest.", "You forgot the obvious one.", "Nobody asked for your idea."], answer: "I'd like to add that a good friend is honest.",
        explainVi: "\"I'd like to add…\" là cách thêm ý một cách lịch sự." },
      { type: "reading", q: "What is the best conclusion about a good friend?", vi: "Kết luận hợp lý nhất về một người bạn tốt là gì?",
        options: ["Many qualities matter together, not just one", "Only being funny matters", "A good friend must be perfect"], answer: "Many qualities matter together, not just one" },
    ],
  },
};

/* ============ Level 3 · Bộ 3: Solving Problems — khảo sát, thử nghiệm & cải tiến giải pháp ============ */
const L3C3 = "/assets/images/learn/level-3/collection-03-solving-problems/";

/* Unit 1: A Quieter Lunchroom */
const A_QUIETER_LUNCHROOM: Lesson = {
  id: "lunchroom", theme: "solving-problems", title: "A Quieter Lunchroom", vi: "Nhà ăn bớt ồn hơn", ageRange: "9–12",
  sceneImage: L3C3 + "level-3-c03-unit-01-quieter-lunchroom.webp",
  vocab: [
    { word: "noisy", ipa: "/ˈnɔɪzi/", vi: "ồn ào", emoji: "🔊", example: "The lunchroom is too noisy.", exampleVi: "Nhà ăn quá ồn ào." },
    { word: "problem", ipa: "/ˈprɒbləm/", vi: "vấn đề", emoji: "❗", example: "Let's solve the noise problem.", exampleVi: "Cùng giải quyết vấn đề tiếng ồn nào." },
    { word: "solution", ipa: "/səˈluːʃn/", vi: "giải pháp", emoji: "💡", example: "We need a good solution.", exampleVi: "Mình cần một giải pháp tốt." },
    { word: "measure", ipa: "/ˈmeʒər/", vi: "đo", emoji: "📏", example: "They measure the sound.", exampleVi: "Các bạn đo mức âm thanh." },
    { word: "panel", ipa: "/ˈpænl/", vi: "tấm ốp (tiêu âm)", emoji: "🟦", example: "Soft panels soak up noise.", exampleVi: "Tấm ốp mềm hút bớt tiếng ồn." },
    { word: "reduce", ipa: "/rɪˈdjuːs/", vi: "giảm bớt", emoji: "📉", example: "We want to reduce the noise.", exampleVi: "Mình muốn giảm tiếng ồn." },
    { word: "test", ipa: "/test/", vi: "thử nghiệm", emoji: "🧪", example: "Let's test the idea.", exampleVi: "Cùng thử nghiệm ý tưởng nào." },
    { word: "improve", ipa: "/ɪmˈpruːv/", vi: "cải thiện", emoji: "📈", example: "How can we improve it?", exampleVi: "Làm sao để cải thiện nó?" },
  ],
  patterns: [
    { pattern: "The problem is that …", vi: "Vấn đề là …", examples: [
      { en: "The problem is that it's too loud to talk.", vi: "Vấn đề là ồn quá không nói chuyện được." },
      { en: "The problem is that the chairs scrape.", vi: "Vấn đề là ghế kéo lê kêu rất to." }] },
    { pattern: "What if we …?", vi: "Hay là mình … thì sao?", examples: [
      { en: "What if we put soft panels on the walls?", vi: "Hay là mình ốp tấm mềm lên tường thì sao?" },
      { en: "What if we add felt pads under the chairs?", vi: "Hay là mình dán nỉ dưới chân ghế thì sao?" }] },
    { pattern: "Before, it was … ; now it is …", vi: "Trước đây … ; giờ thì …", examples: [
      { en: "Before, the meter was red; now it is yellow.", vi: "Trước đây đồng hồ đỏ; giờ chuyển vàng." },
      { en: "Before, it was very loud; now it is calmer.", vi: "Trước đây rất ồn; giờ dịu hơn." }] },
    { pattern: "Let's try … instead.", vi: "Thử … thay vào đó xem.", examples: [
      { en: "Let's try adding plants instead.", vi: "Thử thêm cây xanh thay vào đó xem." },
      { en: "Let's try softer trays instead.", vi: "Thử dùng khay mềm hơn thay vào đó xem." }] },
  ],
  listening: {
    intro: "Listen to the team test a solution, then answer.",
    introVi: "Nghe cả nhóm thử nghiệm giải pháp rồi trả lời.",
    script: "The lunchroom was very noisy. \"The problem is that it's too loud to talk,\" said Maple. The team wanted a solution. First, they used a noise meter to measure the sound — it was in the red zone. \"What if we put soft panels on the walls?\" said Theo. They also stuck felt pads under the chair legs so they would not scrape on the floor. After lunch, they measured the sound again. Before, the meter was red; now it was yellow — a bit quieter. \"It's better, but not quiet enough,\" said Maple. \"Let's try adding some plants instead.\" They tested it once more, and the noise went down even more.",
    questions: [
      { q: "What was the problem in the lunchroom?", vi: "Vấn đề ở nhà ăn là gì?",
        options: ["It was too loud to talk", "It was too cold", "There was no food"], answer: "It was too loud to talk" },
      { q: "What did the team use to measure the sound?", vi: "Nhóm dùng gì để đo âm thanh?",
        options: ["A noise meter", "A ruler", "A clock"], answer: "A noise meter" },
      { q: "After the panels and pads, how did the noise change?", vi: "Sau khi ốp tấm và dán nỉ, tiếng ồn thay đổi thế nào?",
        options: ["It went from red to yellow (a bit quieter)", "It got much louder", "It stayed exactly the same"], answer: "It went from red to yellow (a bit quieter)",
        explainVi: "Đồng hồ đo từ vùng đỏ chuyển sang vàng nghĩa là bớt ồn hơn." },
    ],
  },
  speaking: {
    repeat: [
      { en: "The problem is that it's too loud to talk.", vi: "Vấn đề là ồn quá không nói chuyện được." },
      { en: "Before, the meter was red; now it is yellow.", vi: "Trước đây đồng hồ đỏ; giờ chuyển vàng." },
    ],
    guided: { q: "How would you make a noisy room quieter?", vi: "Bạn sẽ làm một căn phòng ồn bớt ồn thế nào?", hint: "What if we ___?" },
    describe: {
      prompt: "Describe a solution in 3–5 sentences. State the problem, propose a change, and compare the result before and after.",
      vi: "Mô tả một giải pháp 3–5 câu: nêu vấn đề, đề xuất thay đổi, và so kết quả trước–sau.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"a way to fix a problem\"?", vi: "Từ nào nghĩa là \"cách giải quyết một vấn đề\"?",
        options: ["solution", "problem", "panel"], answer: "solution" },
      { type: "reading", q: "The noise meter went from red to yellow. What does that mean?", vi: "Đồng hồ đo tiếng ồn từ đỏ chuyển vàng. Điều đó nghĩa là gì?",
        options: ["The room got a bit quieter", "The room got louder", "Nothing changed"], answer: "The room got a bit quieter",
        explainVi: "Đỏ → vàng là mức ồn đã giảm bớt." },
      { type: "reading", q: "Which idea would help make a room QUIETER?", vi: "Ý nào giúp căn phòng YÊN HƠN?",
        options: ["Put soft panels on the walls", "Add more metal chairs", "Play loud music"], answer: "Put soft panels on the walls" },
      { type: "listening", q: "After the panels and pads, what did they add to make it quieter?", vi: "Sau tấm ốp và miếng nỉ, các bạn thêm gì cho yên hơn?",
        options: ["Plants", "More tables", "A big speaker"], answer: "Plants" },
    ],
  },
};

/* Unit 2: A Safer Bike Route */
const A_SAFER_BIKE_ROUTE: Lesson = {
  id: "bikeroute", theme: "solving-problems", title: "A Safer Bike Route", vi: "Tuyến xe đạp an toàn hơn", ageRange: "9–12",
  sceneImage: L3C3 + "level-3-c03-unit-02-safer-bike-route.webp",
  vocab: [
    { word: "route", ipa: "/ruːt/", vi: "tuyến đường", emoji: "🛣️", example: "We need a safer route.", exampleVi: "Mình cần một tuyến đường an toàn hơn." },
    { word: "traffic", ipa: "/ˈtræfɪk/", vi: "giao thông, xe cộ", emoji: "🚗", example: "That street has busy traffic.", exampleVi: "Con phố đó xe cộ đông đúc." },
    { word: "lane", ipa: "/leɪn/", vi: "làn đường", emoji: "🚴", example: "The bike lane is wide.", exampleVi: "Làn xe đạp khá rộng." },
    { word: "helmet", ipa: "/ˈhelmɪt/", vi: "mũ bảo hiểm", emoji: "⛑️", example: "Always wear a helmet.", exampleVi: "Luôn đội mũ bảo hiểm nhé." },
    { word: "crossing", ipa: "/ˈkrɒsɪŋ/", vi: "vạch qua đường", emoji: "🚸", example: "Use the safe crossing.", exampleVi: "Hãy đi ở vạch qua đường an toàn." },
    { word: "distance", ipa: "/ˈdɪstəns/", vi: "khoảng cách", emoji: "📐", example: "They measured the distance.", exampleVi: "Các bạn đo khoảng cách." },
    { word: "ramp", ipa: "/ræmp/", vi: "đường dốc (lối tiếp cận)", emoji: "♿", example: "The ramp helps everyone.", exampleVi: "Đường dốc giúp mọi người đều đi được." },
    { word: "safe", ipa: "/seɪf/", vi: "an toàn", emoji: "✅", example: "This route is safe.", exampleVi: "Tuyến này an toàn." },
  ],
  patterns: [
    { pattern: "We have to think about …", vi: "Mình phải tính đến …", examples: [
      { en: "We have to think about traffic and safety.", vi: "Mình phải tính đến xe cộ và sự an toàn." },
      { en: "We have to think about the distance.", vi: "Mình phải tính đến khoảng cách." }] },
    { pattern: "This route is … , but that route is …", vi: "Tuyến này … , còn tuyến kia …", examples: [
      { en: "This route is shorter, but that route is safer.", vi: "Tuyến này ngắn hơn, còn tuyến kia an toàn hơn." },
      { en: "This route is busy, but that route has a bike lane.", vi: "Tuyến này đông xe, còn tuyến kia có làn xe đạp." }] },
    { pattern: "We could combine both by …", vi: "Mình có thể kết hợp cả hai bằng cách …", examples: [
      { en: "We could combine both by using the quiet start, then the bike lane.", vi: "Mình có thể kết hợp: đi đoạn đầu vắng rồi vào làn xe đạp." },
      { en: "We could combine both by adding a crossing.", vi: "Mình có thể kết hợp bằng cách thêm một vạch qua đường." }] },
    { pattern: "I recommend … because …", vi: "Mình đề xuất … vì …", examples: [
      { en: "I recommend the red route because it has a bike lane.", vi: "Mình đề xuất tuyến đỏ vì có làn xe đạp." },
      { en: "I recommend the combined route because it is safer.", vi: "Mình đề xuất tuyến kết hợp vì an toàn hơn." }] },
  ],
  listening: {
    intro: "Listen to the team survey the streets, then answer.",
    introVi: "Nghe cả nhóm khảo sát đường phố rồi trả lời.",
    script: "The class wanted to find a safer bike route to school. First, they put on their helmets and surveyed the streets. They measured the bike lanes with a tape measure and looked at the crossings. \"We have to think about traffic and safety,\" said Maple. There were two routes. \"The blue route is shorter, but it has busy traffic and no bike lane,\" said Theo. \"The red route is longer, but it has a wide bike lane and a safe crossing.\" They also noticed the red route had a ramp, so everyone could use it, even someone on wheels. \"We could combine both,\" said Maple. \"Use the quiet start of the blue route, then join the red bike lane.\" In the end, they recommended the combined route, because it was safer for everyone.",
    questions: [
      { q: "What did they put on before surveying the streets?", vi: "Trước khi khảo sát, các bạn đội gì?",
        options: ["Their helmets", "Their raincoats", "Their sunglasses"], answer: "Their helmets" },
      { q: "What was the drawback of the blue route?", vi: "Điểm dở của tuyến xanh là gì?",
        options: ["Busy traffic and no bike lane", "Too many bike lanes", "It was too green"], answer: "Busy traffic and no bike lane",
        explainVi: "Tuyến xanh ngắn nhưng đông xe và không có làn xe đạp." },
      { q: "Why did they recommend the combined route?", vi: "Vì sao các bạn đề xuất tuyến kết hợp?",
        options: ["It was safer for everyone", "It was the longest", "It had the most cars"], answer: "It was safer for everyone" },
    ],
  },
  speaking: {
    repeat: [
      { en: "This route is shorter, but that route is safer.", vi: "Tuyến này ngắn hơn, còn tuyến kia an toàn hơn." },
      { en: "I recommend the red route because it has a bike lane.", vi: "Mình đề xuất tuyến đỏ vì có làn xe đạp." },
    ],
    guided: { q: "What makes a bike route safe?", vi: "Điều gì khiến một tuyến xe đạp an toàn?", hint: "A safe route has ___." },
    describe: {
      prompt: "Compare two routes in 3–5 sentences. Give a trade-off, then recommend one and justify it.",
      vi: "So sánh hai tuyến trong 3–5 câu: nêu một điểm đánh đổi, rồi đề xuất một tuyến và giải thích.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"the path you take to go somewhere\"?", vi: "Từ nào nghĩa là \"con đường bạn đi để tới nơi\"?",
        options: ["route", "helmet", "traffic"], answer: "route" },
      { type: "reading", q: "The blue route is short but has busy traffic. What is its drawback?", vi: "Tuyến xanh ngắn nhưng đông xe. Điểm dở của nó là gì?",
        options: ["It is less safe because of traffic", "It is too green", "It has too many bike lanes"], answer: "It is less safe because of traffic" },
      { type: "reading", q: "The red route has a ramp. Why is that helpful?", vi: "Tuyến đỏ có đường dốc. Vì sao điều đó hữu ích?",
        options: ["So everyone, even someone on wheels, can use it", "So cars go faster", "So it rains less"], answer: "So everyone, even someone on wheels, can use it",
        explainVi: "Đường dốc giúp tất cả mọi người tiếp cận, kể cả người dùng xe lăn." },
      { type: "listening", q: "What did the team recommend in the end?", vi: "Cuối cùng nhóm đề xuất gì?",
        options: ["The combined route, because it was safer", "The busiest street", "No route at all"], answer: "The combined route, because it was safer" },
    ],
  },
};

/* Unit 3: A Greener School Festival */
const A_GREENER_SCHOOL_FESTIVAL: Lesson = {
  id: "festival", theme: "solving-problems", title: "A Greener School Festival", vi: "Lễ hội trường xanh hơn", ageRange: "9–12",
  sceneImage: L3C3 + "level-3-c03-unit-03-greener-school-festival.webp",
  vocab: [
    { word: "festival", ipa: "/ˈfestɪvl/", vi: "lễ hội", emoji: "🎪", example: "The school festival is on Friday.", exampleVi: "Lễ hội trường vào thứ Sáu." },
    { word: "green", ipa: "/ɡriːn/", vi: "thân thiện môi trường", emoji: "🌿", example: "We want a green festival.", exampleVi: "Mình muốn một lễ hội xanh." },
    { word: "plastic", ipa: "/ˈplæstɪk/", vi: "nhựa", emoji: "🧴", example: "Let's use less plastic.", exampleVi: "Cùng dùng ít nhựa hơn nào." },
    { word: "recycle", ipa: "/ˌriːˈsaɪkl/", vi: "tái chế", emoji: "♻️", example: "We recycle cans and bottles.", exampleVi: "Mình tái chế lon và chai." },
    { word: "reuse", ipa: "/ˌriːˈjuːz/", vi: "tái sử dụng", emoji: "🔄", example: "Reuse the cups, don't throw them away.", exampleVi: "Tái sử dụng cốc, đừng vứt đi." },
    { word: "waste", ipa: "/weɪst/", vi: "rác thải", emoji: "🗑️", example: "Sort the waste into bins.", exampleVi: "Phân loại rác vào các thùng." },
    { word: "energy", ipa: "/ˈenərdʒi/", vi: "năng lượng", emoji: "⚡", example: "Solar panels give clean energy.", exampleVi: "Tấm pin mặt trời cho năng lượng sạch." },
    { word: "priority", ipa: "/praɪˈɒrəti/", vi: "ưu tiên", emoji: "🥇", example: "Our top priority is less plastic.", exampleVi: "Ưu tiên hàng đầu là bớt nhựa." },
  ],
  patterns: [
    { pattern: "Our top priority is …", vi: "Ưu tiên hàng đầu của mình là …", examples: [
      { en: "Our top priority is to use less plastic.", vi: "Ưu tiên hàng đầu là dùng ít nhựa hơn." },
      { en: "Our top priority is to reduce waste.", vi: "Ưu tiên hàng đầu là giảm rác thải." }] },
    { pattern: "We only have … , so …", vi: "Mình chỉ có … nên …", examples: [
      { en: "We only have a little money, so we can't buy everything.", vi: "Mình chỉ có ít tiền nên không mua được hết." },
      { en: "We only have two hours, so let's plan well.", vi: "Mình chỉ có hai tiếng nên phải tính kỹ." }] },
    { pattern: "Instead of … , we could …", vi: "Thay vì … , mình có thể …", examples: [
      { en: "Instead of plastic cups, we could use reusable ones.", vi: "Thay vì cốc nhựa, mình có thể dùng cốc tái sử dụng." },
      { en: "Instead of buying lights, we could use solar power.", vi: "Thay vì mua đèn, mình có thể dùng năng lượng mặt trời." }] },
    { pattern: "Can we agree to …?", vi: "Mình thống nhất … được chứ?", examples: [
      { en: "Can we agree to start with the refill station?", vi: "Mình thống nhất bắt đầu với trạm tiếp nước được chứ?" },
      { en: "Can we agree to sort the waste?", vi: "Mình thống nhất phân loại rác được chứ?" }] },
  ],
  listening: {
    intro: "Listen to the team plan a greener festival, then answer.",
    introVi: "Nghe cả nhóm lên kế hoạch lễ hội xanh rồi trả lời.",
    script: "The team wanted to make the school festival greener, but they only had a small budget. \"Our top priority is to use less plastic,\" said Maple. \"Instead of plastic cups, we could set up a water refill station with reusable cups.\" Theo pointed at three bins. \"We can also sort our waste — one for compost, one for recycling, and one for trash.\" Another student suggested solar panels to power the lights. \"We only have a little money,\" said the teacher, \"so we can't buy everything.\" They talked it over and made a shared decision: the refill station and the sorting bins first, because they helped the most and cost the least. Everyone agreed it was a good, green plan.",
    questions: [
      { q: "What was the team's top priority?", vi: "Ưu tiên hàng đầu của nhóm là gì?",
        options: ["To use less plastic", "To buy more balloons", "To make more noise"], answer: "To use less plastic" },
      { q: "What did they suggest instead of plastic cups?", vi: "Thay vì cốc nhựa, các bạn đề xuất gì?",
        options: ["A refill station with reusable cups", "Bigger plastic cups", "Paper on the ground"], answer: "A refill station with reusable cups" },
      { q: "Why did they choose the refill station and bins first?", vi: "Vì sao các bạn chọn trạm tiếp nước và thùng phân loại trước?",
        options: ["They helped the most and cost the least", "They were the most expensive", "They looked the coolest"], answer: "They helped the most and cost the least",
        explainVi: "Với ngân sách ít, các bạn ưu tiên việc hiệu quả nhất mà rẻ nhất." },
    ],
  },
  speaking: {
    repeat: [
      { en: "Instead of plastic cups, we could use reusable ones.", vi: "Thay vì cốc nhựa, mình có thể dùng cốc tái sử dụng." },
      { en: "Our top priority is to use less plastic.", vi: "Ưu tiên hàng đầu là dùng ít nhựa hơn." },
    ],
    guided: { q: "How would you make an event greener?", vi: "Bạn sẽ làm một sự kiện xanh hơn thế nào?", hint: "Instead of ___, we could ___." },
    describe: {
      prompt: "Plan a greener event in 3–5 sentences. Name a priority, one alternative, and one shared decision.",
      vi: "Lên kế hoạch một sự kiện xanh 3–5 câu: nêu ưu tiên, một phương án thay thế, và một quyết định chung.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"to use something again instead of throwing it away\"?", vi: "Từ nào nghĩa là \"dùng lại thay vì vứt đi\"?",
        options: ["reuse", "waste", "plastic"], answer: "reuse" },
      { type: "reading", q: "Instead of plastic cups, which is a GREENER choice?", vi: "Thay vì cốc nhựa, lựa chọn nào XANH hơn?",
        options: ["Reusable cups at a refill station", "More plastic bottles", "Paper thrown on the ground"], answer: "Reusable cups at a refill station" },
      { type: "reading", q: "The team had little money. Why did they choose the refill station and bins first?", vi: "Nhóm có ít tiền. Vì sao chọn trạm tiếp nước và thùng phân loại trước?",
        options: ["They helped the most and cost the least", "They were the most expensive", "They looked the coolest"], answer: "They helped the most and cost the least",
        explainVi: "Nguồn lực có hạn nên ưu tiên việc hiệu quả nhất, rẻ nhất." },
      { type: "listening", q: "How did the team make the final decision?", vi: "Nhóm đưa ra quyết định cuối cùng thế nào?",
        options: ["They talked it over and agreed together", "One person decided alone", "They gave up"], answer: "They talked it over and agreed together" },
    ],
  },
};

/* ============ Level 3 · Bộ 3 · Unit 4: Making the School More Accessible ============ */
// Rào: bạn ngồi xe lăn là người giải quyết BÌNH ĐẲNG, có tiếng nói. So sánh nhiều giải pháp;
// không coi accessibility là "làm từ thiện", không cho rằng một giải pháp hợp với TẤT CẢ.
const MAKING_SCHOOL_ACCESSIBLE: Lesson = {
  id: "accessible", theme: "solving-problems", title: "Making the School More Accessible", vi: "Làm trường dễ tiếp cận hơn", ageRange: "9–12",
  sceneImage: "/assets/images/learn/level-3/collection-03-solving-problems/level-3-c03-unit-04-making-school-more-accessible.webp",
  vocab: [
    { word: "accessible", ipa: "/əkˈsesəbl/", vi: "dễ tiếp cận", emoji: "♿", example: "We want the school to be accessible to everyone.", exampleVi: "Mình muốn trường ai cũng vào được dễ dàng." },
    { word: "ramp", ipa: "/ræmp/", vi: "đường dốc", emoji: "🛗", example: "A wheelchair can roll up the ramp.", exampleVi: "Xe lăn có thể lên bằng đường dốc." },
    { word: "slope", ipa: "/sloʊp/", vi: "độ dốc", emoji: "📐", example: "They checked the slope with a level.", exampleVi: "Các bạn dùng thước nivô kiểm độ dốc." },
    { word: "doorway", ipa: "/ˈdɔːrweɪ/", vi: "khung cửa", emoji: "🚪", example: "The doorway was too narrow to turn through.", exampleVi: "Khung cửa quá hẹp để quay xe qua." },
    { word: "tactile paving", ipa: "/ˈtæktaɪl ˈpeɪvɪŋ/", vi: "gạch lát xúc giác", emoji: "🟨", example: "Tactile paving helps people who are blind.", exampleVi: "Gạch lát xúc giác giúp người khiếm thị." },
    { word: "alert", ipa: "/əˈlɜːrt/", vi: "tín hiệu báo", emoji: "🔔", example: "A flashing alert helps people who can't hear well.", exampleVi: "Đèn báo nhấp nháy giúp người nghe kém." },
    { word: "barrier", ipa: "/ˈbæriər/", vi: "vật cản", emoji: "🚧", example: "A cart was a barrier on the path.", exampleVi: "Chiếc xe đẩy là vật cản trên lối đi." },
    { word: "inclusive", ipa: "/ɪnˈkluːsɪv/", vi: "bao trùm mọi người", emoji: "🤝", example: "An inclusive design works for many people.", exampleVi: "Thiết kế bao trùm phù hợp với nhiều người." },
  ],
  patterns: [
    { pattern: "For someone who … , … is important", vi: "Với người mà … , … là quan trọng", examples: [
      { en: "For someone in a wheelchair, a gentle slope is important.", vi: "Với người ngồi xe lăn, độ dốc thoải là quan trọng." },
      { en: "For someone who can't hear well, a flashing alert is important.", vi: "Với người nghe kém, đèn báo nhấp nháy là quan trọng." }] },
    { pattern: "One benefit of … is … , but one drawback is …", vi: "Một lợi ích của … là … , nhưng một điểm dở là …", examples: [
      { en: "One benefit of a temporary ramp is that it's quick, but one drawback is that it can be slippery.", vi: "Lợi ích của dốc tạm là nhanh, nhưng điểm dở là dễ trơn." },
      { en: "One benefit of a wide door is easy turning, but one drawback is the cost.", vi: "Cửa rộng thì dễ quay xe, nhưng điểm dở là tốn kém." }] },
    { pattern: "Instead of one fix, we could combine …", vi: "Thay vì một cách sửa, mình có thể kết hợp …", examples: [
      { en: "Instead of one fix, we could combine a gentler ramp and a wider doorway.", vi: "Thay vì một cách, mình có thể kết hợp dốc thoải hơn và cửa rộng hơn." },
      { en: "Instead of one fix, we could add tactile paving and a clear path.", vi: "Thay vì một cách, mình có thể thêm gạch xúc giác và lối đi thông thoáng." }] },
    { pattern: "The most inclusive choice is … because …", vi: "Lựa chọn bao trùm nhất là … vì …", examples: [
      { en: "The most inclusive choice is to combine changes, because different people need different things.", vi: "Lựa chọn bao trùm nhất là kết hợp nhiều thay đổi, vì mỗi người có nhu cầu khác nhau." },
      { en: "The most inclusive choice helps more people, not just one.", vi: "Lựa chọn bao trùm nhất giúp được nhiều người, không chỉ một người." }] },
  ],
  listening: {
    intro: "Listen to the team test the school entrance, then answer.",
    introVi: "Nghe cả nhóm kiểm tra lối vào trường rồi trả lời.",
    script: "The class tested how easy it was to enter the school. Minh, who uses a wheelchair, rolled up the new temporary ramp first. \"It works, but it feels a little too steep,\" he said. Lan checked it with a level, and the slope really was steep. At the door, the automatic button helped a lot, but the doorway was narrow and hard to turn through. Near the wall, a cart full of bins blocked part of the path. \"One benefit of the temporary ramp is that it's quick,\" said Maple, \"but one drawback is that it's steep and slippery in the rain.\" Another student pointed at the tactile paving and the water fountain with two heights, which helped people who were blind or shorter. \"Instead of one fix,\" said Minh, \"we could combine a gentler ramp, a wider doorway, and a clear path.\" The team agreed the most inclusive choice was to combine several changes, because different people need different things.",
    questions: [
      { q: "Who tested the ramp first?", vi: "Ai thử đường dốc đầu tiên?",
        options: ["Minh, who uses a wheelchair", "The school principal", "Nobody"], answer: "Minh, who uses a wheelchair",
        explainVi: "Minh — bạn ngồi xe lăn — chủ động thử dốc đầu tiên." },
      { q: "What was one drawback of the temporary ramp?", vi: "Một điểm dở của dốc tạm là gì?",
        options: ["It was too steep and slippery", "It was invisible", "It was too flat"], answer: "It was too steep and slippery" },
      { q: "Why is combining several changes the most inclusive choice?", vi: "Vì sao kết hợp nhiều thay đổi là lựa chọn bao trùm nhất?",
        options: ["Different people need different things", "It is the cheapest", "It looks the nicest"], answer: "Different people need different things" },
    ],
  },
  speaking: {
    repeat: [
      { en: "For someone in a wheelchair, a gentle slope is important.", vi: "Với người ngồi xe lăn, độ dốc thoải là quan trọng." },
      { en: "Instead of one fix, we could combine several changes.", vi: "Thay vì một cách, mình có thể kết hợp nhiều thay đổi." },
    ],
    guided: { q: "How would you make a place more accessible for everyone?", vi: "Bạn sẽ làm một nơi dễ tiếp cận hơn cho mọi người thế nào?", hint: "For someone who ___, ___ is important." },
    describe: {
      prompt: "Suggest how to make a place more accessible in 3–5 sentences. Name a need, compare one benefit and one drawback, and give an inclusive recommendation.",
      vi: "Đề xuất cách làm một nơi dễ tiếp cận hơn 3–5 câu: nêu một nhu cầu, so một lợi ích và một điểm dở, rồi đưa khuyến nghị bao trùm.",
      min: 3, max: 5,
    },
  },
  miniCheck: {
    tasks: [
      { type: "vocab", q: "Which word means \"working well for many different people\"?", vi: "Từ nào nghĩa là \"phù hợp với nhiều người khác nhau\"?",
        options: ["inclusive", "barrier", "slope"], answer: "inclusive" },
      { type: "reading", q: "The temporary ramp is quick to add. What is one drawback the team found?", vi: "Dốc tạm thì lắp nhanh. Nhóm thấy một điểm dở nào?",
        options: ["It was too steep and slippery", "It was too colourful", "It was too quiet"], answer: "It was too steep and slippery",
        explainVi: "Nhanh là lợi ích, nhưng dốc và trơn khi mưa là điểm dở." },
      { type: "reading", q: "Tactile paving and a two-height water fountain help which people?", vi: "Gạch xúc giác và vòi nước hai tầng giúp ai?",
        options: ["People who are blind or shorter", "Only tall adults", "Only the coach"], answer: "People who are blind or shorter",
        explainVi: "Mỗi thay đổi phục vụ một nhu cầu khác nhau." },
      { type: "reading", q: "Why did the team choose to combine several changes?", vi: "Vì sao nhóm chọn kết hợp nhiều thay đổi?",
        options: ["Different people need different things", "One change is always enough", "To spend more money"], answer: "Different people need different things" },
    ],
  },
};

export const THEMES: CourseTheme[] = [
  { id: "everyday-town", name: "Everyday Town", vi: "Phố Ngày Thường", emoji: "🏙️",
    lessons: [AT_THE_PARK, IN_THE_KITCHEN, IN_THE_CLASSROOM, AT_THE_SUPERMARKET, AT_THE_BUS_STOP, AT_THE_LIBRARY, AT_THE_COMMUNITY_SPORTS_CENTRE] },
  { id: "discovery-days", name: "Discovery Days", vi: "Ngày Khám Phá", emoji: "🔬",
    lessons: [AT_THE_SCIENCE_FAIR, AT_THE_SCIENCE_MUSEUM, AT_THE_VANCOUVER_WATERFRONT] },
  { id: "story-time", name: "Story Time", vi: "Giờ Kể Chuyện", emoji: "📖",
    lessons: [THE_MISSING_BACKPACK, THE_STORMY_CAMPING_TRIP, THE_SCHOOL_TALENT_SHOW,
      THE_FERRY_TRIP_MIX_UP, THE_ROBOT_THAT_WOULDNT_START, THE_COMMUNITY_GARDEN_MYSTERY,
      THE_TIME_CAPSULE_DISCOVERY, THE_BEACH_CLEANUP_CHANGE_OF_PLAN, THE_AQUARIUM_NIGHT_MYSTERY, THE_POWER_OUTAGE] },
  { id: "making-choices", name: "Making Choices", vi: "Đưa Ra Lựa Chọn", emoji: "💬",
    lessons: [PLANNING_A_CLASS_TRIP, SCREEN_OR_OUTDOOR_TIME, CHOOSING_A_TEAM_PROJECT] },
  { id: "giving-reasons", name: "Giving Reasons", vi: "Đưa Ra Lý Do", emoji: "🧠",
    lessons: [SHOULD_HOMEWORK_BE_SHORTER, SAVE_IT_OR_SPEND_IT, WHAT_MAKES_A_GOOD_FRIEND] },
  { id: "solving-problems", name: "Solving Problems", vi: "Giải Quyết Vấn Đề", emoji: "🛠️",
    lessons: [A_QUIETER_LUNCHROOM, A_SAFER_BIKE_ROUTE, A_GREENER_SCHOOL_FESTIVAL, MAKING_SCHOOL_ACCESSIBLE] },
];

/* ============ Chương trình học: Level 1 · Everyday English (9 Unit) ============ */
// 6 chặng "Phố Ngày Thường" + 3 chặng "Ngày Khám Phá" (hội chợ, bảo tàng, bờ nước Vancouver).
const SIMG = "/assets/images/gen/";
const L1IMG = "/assets/images/learn/level-1/";
const L2IMG = "/assets/images/learn/level-2/";
export type CourseUnit = {
  id: string; n: number; title: string; vi: string; image: string; focus: string;
  lessonId?: string; ready: boolean;
};
export const LEVEL1_UNITS: CourseUnit[] = [
  { id: "park",         n: 1, title: "At the Park",             vi: "Ở công viên",          image: SIMG + "scene-park.webp",          focus: "Hành động · thời tiết · vị trí",   lessonId: "park",         ready: true },
  { id: "kitchen",      n: 2, title: "In the Kitchen",          vi: "Trong bếp",             image: SIMG + "scene-kitchen.webp",       focus: "Đồ ăn · hiện tại tiếp diễn",       lessonId: "kitchen",      ready: true },
  { id: "classroom",    n: 3, title: "In the Classroom",        vi: "Trong lớp học",         image: SIMG + "scene-classroom.webp",     focus: "Đồ vật · hỏi–đáp",                 lessonId: "classroom",    ready: true },
  { id: "supermarket",  n: 4, title: "At the Supermarket",      vi: "Ở siêu thị",            image: SIMG + "scene-supermarket.webp",   focus: "Số lượng · lựa chọn · mua sắm",    lessonId: "supermarket",  ready: true },
  { id: "busstop",      n: 5, title: "At the Bus Stop",         vi: "Trạm xe buýt",          image: SIMG + "scene-bus-stop-rain.webp", focus: "Thời tiết · thời gian · dự đoán",  lessonId: "busstop",      ready: true },
  { id: "library",      n: 6, title: "At the Library",          vi: "Ở thư viện",            image: SIMG + "scene-library.webp",       focus: "Sách · vị trí · suy luận",         lessonId: "library",      ready: true },
  { id: "sciencefair",  n: 7, title: "At the Science Fair",     vi: "Ở hội chợ khoa học",    image: L1IMG + "level-1-unit-07-at-the-science-fair.webp",         focus: "Dự án · trình bày · trình tự",     lessonId: "sciencefair",  ready: true },
  { id: "sciencemuseum",n: 8, title: "At the Science Museum",   vi: "Ở bảo tàng khoa học",   image: L1IMG + "level-1-unit-08-at-the-science-museum.webp",       focus: "Khám phá · so sánh · nội quy",     lessonId: "sciencemuseum",ready: true },
  { id: "waterfront",   n: 9, title: "At the Vancouver Waterfront", vi: "Bờ nước Vancouver", image: L1IMG + "level-1-unit-09-at-the-vancouver-waterfront.webp", focus: "Cảnh vật · phương hướng · dự đoán", lessonId: "waterfront",   ready: true },
  { id: "sportscentre", n: 10, title: "At the Community Sports Centre", vi: "Ở trung tâm thể thao", image: L1IMG + "level-1-unit-10-at-the-community-sports-centre.webp", focus: "Hành động · can/can't · phương hướng", lessonId: "sportscentre", ready: true },
];

/* ============ Level 2 · Stories & Situations (3 Unit) ============ */
// Bài kể chuyện nhiều bước: mở đầu → vấn đề → manh mối/sự việc → kết quả.
export const LEVEL2_UNITS: CourseUnit[] = [
  { id: "backpack",   n: 1, title: "The Missing Backpack",    vi: "Chiếc ba lô thất lạc",      image: L2IMG + "level-2-unit-01-missing-backpack.webp",         focus: "Manh mối · vị trí · suy luận",       lessonId: "backpack",   ready: true },
  { id: "camping",    n: 2, title: "The Stormy Camping Trip", vi: "Chuyến cắm trại giông bão", image: L2IMG + "level-2-unit-02-stormy-camping-trip.webp",      focus: "Thời tiết · đồng đội · dự đoán",     lessonId: "camping",    ready: true },
  { id: "talentshow", n: 3, title: "The School Talent Show",  vi: "Hội diễn tài năng",         image: L2IMG + "level-2-unit-03-school-talent-show.webp",       focus: "Cảm xúc · động viên · trình tự",     lessonId: "talentshow", ready: true },
  { id: "ferry",      n: 4, title: "The Ferry Trip Mix-Up",   vi: "Chuyến phà nhầm lẫn",       image: L2IMG + "level-2-unit-04-ferry-trip-mix-up.webp",        focus: "Giờ giấc · phương hướng · nhân–quả", lessonId: "ferry",      ready: true },
  { id: "robot",      n: 5, title: "The Robot That Wouldn't Start", vi: "Robot không chịu khởi động", image: L2IMG + "level-2-unit-05-robot-wouldnt-start.webp", focus: "Manh mối kỹ thuật · giả thuyết · nhân–quả", lessonId: "robot", ready: true },
  { id: "garden",     n: 6, title: "The Community Garden Mystery", vi: "Bí ẩn vườn cộng đồng", image: L2IMG + "level-2-unit-06-community-garden-mystery.webp", focus: "Quan sát · kể lại quá khứ · bằng chứng", lessonId: "garden",  ready: true },
  { id: "capsule",    n: 7, title: "The Time Capsule Discovery", vi: "Khám phá hộp thời gian",  image: L2IMG + "level-2-unit-07-time-capsule-discovery.webp",   focus: "Quá khứ · so xưa–nay · bằng chứng",  lessonId: "capsule",    ready: true },
  { id: "beach",      n: 8, title: "The Beach Cleanup Change of Plan", vi: "Đổi kế hoạch dọn biển", image: L2IMG + "level-2-unit-08-beach-cleanup-change-of-plan.webp", focus: "Thời tiết · kế hoạch · lựa chọn", lessonId: "beach",  ready: true },
  { id: "aquarium",   n: 9, title: "The Aquarium Night Mystery", vi: "Bí ẩn đêm ở thuỷ cung",   image: L2IMG + "level-2-unit-09-aquarium-night-mystery.webp",   focus: "Trình tự · loại trừ · kết luận",     lessonId: "aquarium",   ready: true },
  { id: "outage",     n: 10, title: "The Power Outage at the Community Centre", vi: "Mất điện ở trung tâm cộng đồng", image: L2IMG + "level-2-unit-10-community-centre-power-outage.webp", focus: "An toàn · nguyên nhân · nhân–quả · chọn giải pháp", lessonId: "outage", ready: true },
];

/* ============ Level 3 · Opinions & Conversations — chia theo Bộ (Collection) ============ */
// Bài hội thoại/ý kiến: nêu ≥2 quan điểm, ghép lý do, so lợi–hại, chọn phương án có lý.
export type CourseCollection = { id: string; name: string; vi: string; units: CourseUnit[] };
const L3C1IMG = "/assets/images/learn/level-3/collection-01-making-choices/";
const L3C2IMG = "/assets/images/learn/level-3/collection-02-giving-reasons/";
const L3C3IMG = "/assets/images/learn/level-3/collection-03-solving-problems/";
export const LEVEL3_COLLECTIONS: CourseCollection[] = [
  { id: "c1", name: "Making Choices", vi: "Bộ 1 · Đưa ra lựa chọn", units: [
    { id: "classtrip",   n: 1, title: "Planning a Class Trip",       vi: "Lên kế hoạch đi dã ngoại",  image: L3C1IMG + "level-3-c01-unit-01-planning-class-trip.webp",   focus: "So lựa chọn · lý do · thống nhất",   lessonId: "classtrip",   ready: true },
    { id: "screentime",  n: 2, title: "Screen Time or Outdoor Time?", vi: "Màn hình hay ngoài trời?", image: L3C1IMG + "level-3-c01-unit-02-screen-or-outdoor-time.webp", focus: "Lợi ích · điểm dở · thoả hiệp",     lessonId: "screentime",  ready: true },
    { id: "teamproject", n: 3, title: "Choosing a Team Project",     vi: "Chọn dự án nhóm",           image: L3C1IMG + "level-3-c01-unit-03-choosing-team-project.webp", focus: "Đề xuất · vai trò · quyết định nhóm", lessonId: "teamproject", ready: true },
  ] },
  { id: "c2", name: "Giving Reasons", vi: "Bộ 2 · Đưa ra lý do", units: [
    { id: "homework",   n: 1, title: "Should Homework Be Shorter?", vi: "Bài tập có nên ngắn hơn?",   image: L3C2IMG + "level-3-c02-unit-01-shorter-homework.webp", focus: "Nêu ý kiến · ví dụ · phản đối lịch sự", lessonId: "homework",   ready: true },
    { id: "savespend",  n: 2, title: "Save It or Spend It?",       vi: "Tiết kiệm hay tiêu?",        image: L3C2IMG + "level-3-c02-unit-02-save-or-spend.webp",    focus: "Ưu tiên · hệ quả · thoả hiệp",         lessonId: "savespend",  ready: true },
    { id: "goodfriend", n: 3, title: "What Makes a Good Friend?",  vi: "Điều gì tạo nên bạn tốt?",   image: L3C2IMG + "level-3-c02-unit-03-good-friend.webp",      focus: "Phẩm chất · dẫn chứng · kết luận",     lessonId: "goodfriend", ready: true },
  ] },
  { id: "c3", name: "Solving Problems", vi: "Bộ 3 · Giải quyết vấn đề", units: [
    { id: "lunchroom", n: 1, title: "A Quieter Lunchroom",      vi: "Nhà ăn bớt ồn hơn",       image: L3C3IMG + "level-3-c03-unit-01-quieter-lunchroom.webp",       focus: "Nêu nhu cầu · thử nghiệm · chỉnh sửa",  lessonId: "lunchroom", ready: true },
    { id: "bikeroute", n: 2, title: "A Safer Bike Route",       vi: "Tuyến xe đạp an toàn hơn", image: L3C3IMG + "level-3-c03-unit-02-safer-bike-route.webp",        focus: "Ràng buộc · đánh đổi · khuyến nghị",    lessonId: "bikeroute", ready: true },
    { id: "festival",  n: 3, title: "A Greener School Festival", vi: "Lễ hội trường xanh hơn",  image: L3C3IMG + "level-3-c03-unit-03-greener-school-festival.webp", focus: "Ưu tiên · nguồn lực · thương lượng",    lessonId: "festival",  ready: true },
    { id: "accessible", n: 4, title: "Making the School More Accessible", vi: "Làm trường dễ tiếp cận hơn", image: L3C3IMG + "level-3-c03-unit-04-making-school-more-accessible.webp", focus: "Nhu cầu tiếp cận · lợi–hại · kết hợp giải pháp", lessonId: "accessible", ready: true },
  ] },
];

/* ============ helpers ============ */
export const allLearnLessons = (): Lesson[] => THEMES.flatMap((t) => t.lessons);
export const learnLessonById = (id: string): Lesson | undefined => allLearnLessons().find((l) => l.id === id);
export const themeById = (id: string): CourseTheme | undefined => THEMES.find((t) => t.id === id);
export const themeOfLesson = (l: Lesson): CourseTheme | undefined => themeById(l.theme);
