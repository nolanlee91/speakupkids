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

export const THEMES: CourseTheme[] = [
  { id: "everyday-town", name: "Everyday Town", vi: "Phố Ngày Thường", emoji: "🏙️",
    lessons: [AT_THE_PARK, IN_THE_KITCHEN, IN_THE_CLASSROOM, AT_THE_SUPERMARKET, AT_THE_BUS_STOP, AT_THE_LIBRARY] },
  { id: "discovery-days", name: "Discovery Days", vi: "Ngày Khám Phá", emoji: "🔬",
    lessons: [AT_THE_SCIENCE_FAIR, AT_THE_SCIENCE_MUSEUM, AT_THE_VANCOUVER_WATERFRONT] },
  { id: "story-time", name: "Story Time", vi: "Giờ Kể Chuyện", emoji: "📖",
    lessons: [THE_MISSING_BACKPACK, THE_STORMY_CAMPING_TRIP, THE_SCHOOL_TALENT_SHOW] },
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
];

/* ============ Level 2 · Stories & Situations (3 Unit) ============ */
// Bài kể chuyện nhiều bước: mở đầu → vấn đề → manh mối/sự việc → kết quả.
export const LEVEL2_UNITS: CourseUnit[] = [
  { id: "backpack",   n: 1, title: "The Missing Backpack",   vi: "Chiếc ba lô thất lạc",   image: L2IMG + "level-2-unit-01-missing-backpack.webp",    focus: "Manh mối · vị trí · suy luận",       lessonId: "backpack",   ready: true },
  { id: "camping",    n: 2, title: "The Stormy Camping Trip", vi: "Chuyến cắm trại giông bão", image: L2IMG + "level-2-unit-02-stormy-camping-trip.webp", focus: "Thời tiết · đồng đội · dự đoán",     lessonId: "camping",    ready: true },
  { id: "talentshow", n: 3, title: "The School Talent Show",  vi: "Hội diễn tài năng",       image: L2IMG + "level-2-unit-03-school-talent-show.webp",  focus: "Cảm xúc · động viên · trình tự",     lessonId: "talentshow", ready: true },
];

/* ============ helpers ============ */
export const allLearnLessons = (): Lesson[] => THEMES.flatMap((t) => t.lessons);
export const learnLessonById = (id: string): Lesson | undefined => allLearnLessons().find((l) => l.id === id);
export const themeById = (id: string): CourseTheme | undefined => THEMES.find((t) => t.id === id);
export const themeOfLesson = (l: Lesson): CourseTheme | undefined => themeById(l.theme);
