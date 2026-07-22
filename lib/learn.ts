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
export type MiniCheckTask =
  | ({ type: "vocab" | "sentence" | "listening" } & MCQ)
  | { type: "speaking"; q: string; vi: string };
export type MiniCheck = { tasks: MiniCheckTask[] };

export type LearningSectionKey = "words" | "sentences" | "listening" | "speaking";
export type LearningSection = { key: LearningSectionKey; name: string; vi: string; icon: string; desc: string };
export const SECTIONS: LearningSection[] = [
  { key: "words",     name: "Words",     vi: "Từ vựng",  icon: "📖", desc: "Từ mới · phát âm · ví dụ" },
  { key: "sentences", name: "Sentences", vi: "Mẫu câu",  icon: "✏️", desc: "Mẫu câu & ngữ pháp nhẹ" },
  { key: "listening", name: "Listening", vi: "Nghe hiểu", icon: "🎧", desc: "Nghe Maple & trả lời" },
  { key: "speaking",  name: "Speaking",  vi: "Nói",      icon: "🎤", desc: "Nhại · mô tả · shadowing" },
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
      { type: "speaking", q: "Describe the park in 3–5 sentences. Give two details and explain one using \"because\".",
        vi: "Mô tả công viên 3–5 câu. Nêu hai chi tiết và giải thích một điều bằng \"because\"." },
    ],
  },
};

export const THEMES: CourseTheme[] = [
  { id: "everyday-town", name: "Everyday Town", vi: "Phố Ngày Thường", emoji: "🏙️", lessons: [AT_THE_PARK] },
];

/* ============ Chương trình học: Level 1 · Everyday English (6 Unit) ============ */
// Dùng chung 6 ảnh cảnh. Chỉ Unit 1 (At the Park) đã đủ nội dung; 5 unit sau đang biên soạn.
const SIMG = "/assets/images/gen/";
export type CourseUnit = {
  id: string; n: number; title: string; vi: string; image: string; focus: string;
  lessonId?: string; ready: boolean;
};
export const LEVEL1_UNITS: CourseUnit[] = [
  { id: "park",        n: 1, title: "At the Park",        vi: "Ở công viên",      image: SIMG + "scene-park.webp",         focus: "Hành động · thời tiết · vị trí",   lessonId: "park", ready: true },
  { id: "kitchen",     n: 2, title: "In the Kitchen",     vi: "Trong bếp",         image: SIMG + "scene-kitchen.webp",      focus: "Đồ ăn · hiện tại tiếp diễn",       ready: false },
  { id: "classroom",   n: 3, title: "In the Classroom",   vi: "Trong lớp học",     image: SIMG + "scene-classroom.webp",    focus: "Đồ vật · hỏi–đáp",                 ready: false },
  { id: "supermarket", n: 4, title: "At the Supermarket", vi: "Ở siêu thị",        image: SIMG + "scene-supermarket.webp",  focus: "Số lượng · lựa chọn · mua sắm",    ready: false },
  { id: "busstop",     n: 5, title: "At the Bus Stop",    vi: "Trạm xe buýt",      image: SIMG + "scene-bus-stop-rain.webp", focus: "Thời tiết · thời gian · dự đoán",  ready: false },
  { id: "library",     n: 6, title: "At the Library",     vi: "Ở thư viện",        image: SIMG + "scene-library.webp",      focus: "Sách · vị trí · suy luận",         ready: false },
];

/* ============ helpers ============ */
export const allLearnLessons = (): Lesson[] => THEMES.flatMap((t) => t.lessons);
export const learnLessonById = (id: string): Lesson | undefined => allLearnLessons().find((l) => l.id === id);
export const themeById = (id: string): CourseTheme | undefined => THEMES.find((t) => t.id === id);
export const themeOfLesson = (l: Lesson): CourseTheme | undefined => themeById(l.theme);
