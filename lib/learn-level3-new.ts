import type { Lesson, VocabularyItem } from "./learn";

type Input = {
  id: string;
  theme: "making-choices" | "giving-reasons" | "solving-problems";
  title: string;
  vi: string;
  image: string;
  words: string[];
  wordVi: string[];
  situation: string;
  evidence: string;
  recommendation: string;
};

const makeLesson = (x: Input): Lesson => {
  const vocab: VocabularyItem[] = x.words.map((word, i) => ({
    word,
    ipa: "",
    vi: x.wordVi[i],
    emoji: ["🔎", "⚖️", "💡", "📋", "✅", "🤝"][i] ?? "💬",
    example: `The team discusses the ${word}.`,
    exampleVi: `Cả nhóm thảo luận về “${x.wordVi[i]}”.`,
  }));
  return {
    id: x.id,
    theme: x.theme,
    title: x.title,
    vi: x.vi,
    ageRange: "9–12",
    sceneImage: x.image,
    vocab,
    patterns: [
      {
        pattern: "One reason is that …",
        vi: "Một lý do là …",
        examples: [
          { en: `One reason is that ${x.evidence}.`, vi: "Một lý do đến từ bằng chứng nhóm thu thập được." },
          { en: "One reason is that the idea helps more people.", vi: "Một lý do là ý tưởng này giúp được nhiều người hơn." },
        ],
      },
      {
        pattern: "Although …, …",
        vi: "Mặc dù …, …",
        examples: [
          { en: "Although the first idea is simpler, the second one is more inclusive.", vi: "Mặc dù ý đầu đơn giản hơn, ý thứ hai phù hợp với nhiều người hơn." },
          { en: "Although it costs more, it may work better in the long term.", vi: "Mặc dù tốn hơn, cách đó có thể hiệu quả hơn về lâu dài." },
        ],
      },
      {
        pattern: "Based on the evidence, we recommend …",
        vi: "Dựa trên bằng chứng, chúng mình đề xuất …",
        examples: [
          { en: `Based on the evidence, we recommend ${x.recommendation}.`, vi: "Dựa trên bằng chứng, nhóm đưa ra một đề xuất cân bằng." },
          { en: "We should test the plan and revise it if necessary.", vi: "Chúng mình nên thử kế hoạch và điều chỉnh nếu cần." },
        ],
      },
    ],
    listening: {
      intro: "Listen to the discussion, then choose the best evidence and recommendation.",
      introVi: "Nghe cuộc thảo luận rồi chọn bằng chứng và đề xuất phù hợp nhất.",
      script: `${x.situation} The group compared two reasonable ideas before deciding. Their evidence showed that ${x.evidence}. Some students preferred the simpler option, while others pointed out access, cost or long-term effects. After discussing the trade-offs, the group recommended ${x.recommendation}. They agreed to test the plan and revise it if the results were different from their prediction.`,
      questions: [
        { q: "What did the group do before deciding?", vi: "Nhóm làm gì trước khi quyết định?", options: ["Compared two reasonable ideas", "Voted without discussion", "Ignored the evidence"], answer: "Compared two reasonable ideas" },
        { q: "What supported the decision?", vi: "Điều gì củng cố quyết định?", options: ["Evidence and trade-offs", "A random guess", "One preference only"], answer: "Evidence and trade-offs" },
        { q: "What happens after choosing the plan?", vi: "Sau khi chọn kế hoạch, nhóm làm gì?", options: ["Test and revise it if needed", "Never check it", "Remove every option"], answer: "Test and revise it if needed" },
      ],
    },
    speaking: {
      repeat: [
        { en: `One reason is that ${x.evidence}.`, vi: "Một lý do đến từ bằng chứng nhóm thu thập được." },
        { en: `Based on the evidence, we recommend ${x.recommendation}.`, vi: "Dựa trên bằng chứng, nhóm đưa ra đề xuất." },
      ],
      guided: { q: `What would you recommend in “${x.title}”?`, vi: `Bạn sẽ đề xuất gì trong bài “${x.vi}”?`, hint: "I recommend ___ because ___. Although ___, ___." },
      describe: { prompt: "Explain the situation in 3–5 sentences. Include two viewpoints, one piece of evidence and a balanced recommendation.", vi: "Giải thích tình huống trong 3–5 câu, gồm hai quan điểm, một bằng chứng và một đề xuất cân bằng.", min: 3, max: 5 },
    },
    miniCheck: {
      tasks: [
        { type: "vocab", q: "Which word belongs to this topic?", vi: "Từ nào thuộc chủ đề bài?", options: [x.words[0], "spaceship", "volcano"], answer: x.words[0] },
        { type: "sentence", q: "Which sentence gives a supported recommendation?", vi: "Câu nào đưa ra đề xuất có căn cứ?", options: [`Based on the evidence, we recommend ${x.recommendation}.`, "I choose it for no reason.", "Everyone else is wrong."], answer: `Based on the evidence, we recommend ${x.recommendation}.` },
        { type: "listening", q: "Why did the group compare trade-offs?", vi: "Vì sao nhóm so sánh lợi và hạn chế?", options: ["To make a balanced decision", "To avoid a plan", "To find a perfect idea"], answer: "To make a balanced decision" },
        { type: "reading", q: "“Although it costs more, it may work better long-term.” What does this do?", vi: "Câu này có tác dụng gì?", options: ["Balances a drawback and a benefit", "Lists unrelated facts", "Gives an order"], answer: "Balances a drawback and a benefit" },
      ],
    },
  };
};

const C1 = "/assets/images/learn/level-3/collection-01-making-choices/";
const C2 = "/assets/images/learn/level-3/collection-02-giving-reasons/";
const C3 = "/assets/images/learn/level-3/collection-03-solving-problems/";

export const LEVEL3_NEW_LESSONS = {
  readingproject: makeLesson({
    id: "readingproject", theme: "making-choices", title: "Choosing a Class Reading Project", vi: "Chọn dự án đọc sách của lớp",
    image: C1 + "level-3-c01-unit-06-choosing-class-reading-project.webp",
    words: ["format", "podcast", "display", "role", "deadline", "compromise"],
    wordVi: ["hình thức", "podcast", "khu trưng bày", "vai trò", "hạn chót", "thỏa hiệp"],
    situation: "The class had to choose between a book podcast and an illustrated display.",
    evidence: "the podcast needs quiet recording time, while the display needs more art materials",
    recommendation: "a short podcast with a small illustrated display",
  }),
  tripphones: makeLesson({
    id: "tripphones", theme: "giving-reasons", title: "Should Phones Be Allowed on School Trips?", vi: "Có nên mang điện thoại trong chuyến đi?",
    image: C2 + "level-3-c02-unit-06-phones-on-school-trips.webp",
    words: ["navigation", "emergency", "privacy", "distraction", "permission", "policy"],
    wordVi: ["định vị", "tình huống khẩn cấp", "quyền riêng tư", "sự xao nhãng", "sự cho phép", "quy định"],
    situation: "Students discussed phone use during a school trip.",
    evidence: "phones help with navigation and emergencies but may distract students and affect privacy",
    recommendation: "phones staying in bags except for teacher-approved tasks or emergencies",
  }),
  groupwork: makeLesson({
    id: "groupwork", theme: "giving-reasons", title: "Is Group Work Better Than Working Alone?", vi: "Làm nhóm có tốt hơn làm một mình?",
    image: C2 + "level-3-c02-unit-07-group-or-independent-work.webp",
    words: ["collaboration", "focus", "responsibility", "role", "efficient", "independent"],
    wordVi: ["sự hợp tác", "sự tập trung", "trách nhiệm", "vai trò", "hiệu quả", "độc lập"],
    situation: "The class compared group and independent work for different tasks.",
    evidence: "groups share ideas well, while detailed tasks may need quiet individual focus",
    recommendation: "group planning followed by individual work with clear roles",
  }),
  classpet: makeLesson({
    id: "classpet", theme: "giving-reasons", title: "Should a Classroom Have a Visiting Pet?", vi: "Lớp học có nên đón thú cưng?",
    image: C2 + "level-3-c02-unit-08-visiting-classroom-pet.webp",
    words: ["wellbeing", "allergy", "hygiene", "habitat", "supervision", "routine"],
    wordVi: ["sức khỏe tinh thần", "dị ứng", "vệ sinh", "môi trường sống", "sự giám sát", "thói quen"],
    situation: "Students considered a supervised visit from a calm classroom pet.",
    evidence: "a pet may support learning, but allergies, hygiene and animal comfort must come first",
    recommendation: "a short supervised visit with an allergy check and a quiet animal-only area",
  }),
  plantmeals: makeLesson({
    id: "plantmeals", theme: "giving-reasons", title: "Should the Cafeteria Offer More Plant-Based Meals?", vi: "Nhà ăn có nên thêm món từ thực vật?",
    image: C2 + "level-3-c02-unit-09-plant-based-cafeteria-meals.webp",
    words: ["nutrition", "preference", "ingredient", "survey", "portion", "food waste"],
    wordVi: ["dinh dưỡng", "sở thích", "nguyên liệu", "khảo sát", "khẩu phần", "lãng phí thức ăn"],
    situation: "The cafeteria tested plant-based meals and surveyed students.",
    evidence: "students liked two dishes, but large portions created extra food waste",
    recommendation: "the popular dishes in two portion sizes alongside other choices",
  }),
  rainycourtyard: makeLesson({
    id: "rainycourtyard", theme: "solving-problems", title: "Improving a Rainy School Courtyard", vi: "Cải thiện sân trường ngày mưa",
    image: C3 + "level-3-c03-unit-11-rainy-school-courtyard.webp",
    words: ["drainage", "canopy", "permeable", "puddle", "surface", "runoff"],
    wordVi: ["thoát nước", "mái che", "thấm nước", "vũng nước", "bề mặt", "nước chảy tràn"],
    situation: "Students measured puddles and watched rain move across the courtyard.",
    evidence: "a canopy protects one area, while permeable paving reduces puddles on the main path",
    recommendation: "a small canopy plus permeable paving and a rain garden",
  }),
  beachaccess: makeLesson({
    id: "beachaccess", theme: "solving-problems", title: "Making a Beach Path Easier to Use", vi: "Làm lối đi biển dễ sử dụng hơn",
    image: C3 + "level-3-c03-unit-12-accessible-beach-path.webp",
    words: ["accessible", "slope", "turning space", "boardwalk", "temporary mat", "erosion"],
    wordVi: ["dễ tiếp cận", "độ dốc", "khoảng quay xe", "lối ván", "thảm tạm thời", "xói mòn"],
    situation: "A mixed team tested surfaces, slopes and turning spaces at the beach.",
    evidence: "the temporary mat is flexible, while a boardwalk is steadier but affects more shoreline",
    recommendation: "a stable main boardwalk linked to removable mats in sensitive areas",
  }),
  quiethall: makeLesson({
    id: "quiethall", theme: "solving-problems", title: "Reducing Noise in the Community Sports Hall", vi: "Giảm tiếng ồn trong nhà thi đấu",
    image: C3 + "level-3-c03-unit-13-quieter-sports-hall.webp",
    words: ["acoustic", "echo", "sound meter", "curtain", "zone", "flexible"],
    wordVi: ["thuộc âm học", "tiếng vang", "máy đo âm thanh", "rèm", "khu vực", "linh hoạt"],
    situation: "Students measured sound during different activities in the sports hall.",
    evidence: "a curtain reduces echo between zones, while floor mats lower impact noise",
    recommendation: "movable acoustic curtains, selected wall panels and mats in noisy zones",
  }),
  pollinator: makeLesson({
    id: "pollinator", theme: "solving-problems", title: "Helping Pollinators in the School Garden", vi: "Giúp côn trùng thụ phấn trong vườn trường",
    image: C3 + "level-3-c03-unit-14-pollinator-school-garden.webp",
    words: ["pollinator", "native plant", "habitat", "shelter", "seasonal", "maintenance"],
    wordVi: ["loài thụ phấn", "cây bản địa", "môi trường sống", "nơi trú ẩn", "theo mùa", "việc chăm sóc"],
    situation: "Students safely observed pollinators and compared habitat improvements.",
    evidence: "native flowers provide food across seasons, while water and nesting materials need care",
    recommendation: "a native-flower strip with shallow water and supervised habitat features",
  }),
  libraryenergy: makeLesson({
    id: "libraryenergy", theme: "solving-problems", title: "Reducing Energy Use at the Community Library", vi: "Giảm điện năng ở thư viện cộng đồng",
    image: C3 + "level-3-c03-unit-15-library-energy-use.webp",
    words: ["energy audit", "daylight", "temperature", "draft", "automatic door", "efficient"],
    wordVi: ["khảo sát năng lượng", "ánh sáng tự nhiên", "nhiệt độ", "gió lùa", "cửa tự động", "hiệu quả"],
    situation: "Students measured light and temperature around the library.",
    evidence: "daylight reduces lighting needs, while the entrance loses heat when the door opens",
    recommendation: "LED task lights, daylight zones and a draft-reducing entrance curtain",
  }),
} as const;
