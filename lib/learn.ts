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
  adventureWorldId?: string;   // vùng Adventure luyện tập bài này
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
  adventureWorldId: "everyday-town",
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
  adventureWorldId: "everyday-town",
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
  adventureWorldId: "everyday-town",
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
  adventureWorldId: "everyday-town",
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
  adventureWorldId: "everyday-town",
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
  adventureWorldId: "everyday-town",
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

export const THEMES: CourseTheme[] = [
  { id: "everyday-town", name: "Everyday Town", vi: "Phố Ngày Thường", emoji: "🏙️",
    lessons: [AT_THE_PARK, IN_THE_KITCHEN, IN_THE_CLASSROOM, AT_THE_SUPERMARKET, AT_THE_BUS_STOP, AT_THE_LIBRARY] },
];

/* ============ Chương trình học: Level 1 · Everyday English (6 Unit) ============ */
// Dùng chung 6 ảnh cảnh; cả 6 Unit đã có nội dung đầy đủ.
const SIMG = "/assets/images/gen/";
export type CourseUnit = {
  id: string; n: number; title: string; vi: string; image: string; focus: string;
  lessonId?: string; ready: boolean;
};
export const LEVEL1_UNITS: CourseUnit[] = [
  { id: "park",        n: 1, title: "At the Park",        vi: "Ở công viên",      image: SIMG + "scene-park.webp",          focus: "Hành động · thời tiết · vị trí",   lessonId: "park",        ready: true },
  { id: "kitchen",     n: 2, title: "In the Kitchen",     vi: "Trong bếp",         image: SIMG + "scene-kitchen.webp",       focus: "Đồ ăn · hiện tại tiếp diễn",       lessonId: "kitchen",     ready: true },
  { id: "classroom",   n: 3, title: "In the Classroom",   vi: "Trong lớp học",     image: SIMG + "scene-classroom.webp",     focus: "Đồ vật · hỏi–đáp",                 lessonId: "classroom",   ready: true },
  { id: "supermarket", n: 4, title: "At the Supermarket", vi: "Ở siêu thị",        image: SIMG + "scene-supermarket.webp",   focus: "Số lượng · lựa chọn · mua sắm",    lessonId: "supermarket", ready: true },
  { id: "busstop",     n: 5, title: "At the Bus Stop",    vi: "Trạm xe buýt",      image: SIMG + "scene-bus-stop-rain.webp", focus: "Thời tiết · thời gian · dự đoán",  lessonId: "busstop",     ready: true },
  { id: "library",     n: 6, title: "At the Library",     vi: "Ở thư viện",        image: SIMG + "scene-library.webp",       focus: "Sách · vị trí · suy luận",         lessonId: "library",     ready: true },
];

/* ============ helpers ============ */
export const allLearnLessons = (): Lesson[] => THEMES.flatMap((t) => t.lessons);
export const learnLessonById = (id: string): Lesson | undefined => allLearnLessons().find((l) => l.id === id);
export const themeById = (id: string): CourseTheme | undefined => THEMES.find((t) => t.id === id);
export const themeOfLesson = (l: Lesson): CourseTheme | undefined => themeById(l.theme);
