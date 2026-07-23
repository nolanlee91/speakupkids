// Module PHIÊU LƯU — nhiệm vụ theo câu chuyện.
// Nguyên tắc: dùng chung BỐI CẢNH/ảnh với Learn & Practice, nhưng KHÔNG đọc câu hỏi từ
// DETECTIVE_SCENES / TALK_SCENES / PUZZLE_SETS / RIDDLE_SETS. Data & progress riêng.

export type StoryBeat = { who?: "maple" | "theo" | "narrator"; text: string; vi?: string };

export type MissionStep =
  | { kind: "mcq"; label: string; prompt: string; vi: string; options: string[]; answer: string; explainVi?: string }
  | { kind: "arrange"; label: string; prompt: string; vi: string; solution: string[]; say?: string }
  | { kind: "choice"; label: string; prompt: string; vi: string; options: { label: string; correct: boolean; feedback: string }[] };

export type MissionReward = { sticker?: string; badge?: string; stars: number };

export type AdventureMission = {
  id: string;
  unitId: string;
  title: string;
  vi: string;
  sceneImage: string;
  goal: string;
  intro: StoryBeat[];
  steps: MissionStep[];
  outro: StoryBeat[];
  reward: MissionReward;
};

// Một "chương" phiêu lưu gắn với một Unit; chỉ chương có mission mới chơi được.
export type AdventureChapter = {
  id: string; n: number; unitId: string; title: string; vi: string;
  sceneImage: string; blurb: string; ready: boolean; missionId?: string;
};

const IMG = "/assets/images/gen/";

/* ============ Nhiệm vụ mẫu hoàn chỉnh: At the Park ============ */
export const PARK_FIND_THEO: AdventureMission = {
  id: "park-find-theo",
  unitId: "park",
  title: "Find Theo before dark",
  vi: "Tìm Theo trước khi trời tối",
  sceneImage: IMG + "scene-park.webp",
  goal: "Giúp Maple tìm bạn Theo trong công viên trước khi mặt trời lặn.",
  intro: [
    { who: "narrator", text: "It is late afternoon at the park. The sky is turning orange.", vi: "Chiều muộn ở công viên. Bầu trời chuyển sang màu cam." },
    { who: "maple", text: "I need to find my friend Theo before it gets dark!", vi: "Mình phải tìm bạn Theo trước khi trời tối!" },
    { who: "theo", text: "Theo left a note: “Meet me where the water splashes. — Theo”", vi: "Theo để lại lời nhắn: “Gặp mình ở chỗ nước bắn tung tóe nhé. — Theo”" },
  ],
  steps: [
    {
      kind: "mcq", label: "Tìm manh mối",
      prompt: "Theo's note says “where the water splashes.” What in the park has water?",
      vi: "Lời nhắn nói “chỗ nước bắn tung tóe.” Trong công viên, thứ gì có nước?",
      options: ["The fountain", "The bench", "The tree"], answer: "The fountain",
      explainVi: "Đài phun nước (fountain) là nơi nước bắn tung tóe.",
    },
    {
      kind: "mcq", label: "Hiểu vị trí",
      prompt: "Maple reaches the fountain but Theo isn't there. A jogger says: “He ran toward the swings.” Where are the swings?",
      vi: "Maple tới đài phun nước nhưng không thấy Theo. Một người chạy bộ nói: “Cậu ấy chạy về phía xích đu.” Xích đu ở đâu?",
      options: ["At the playground", "In the pond", "Up in the sky"], answer: "At the playground",
      explainVi: "Xích đu (swings) nằm ở khu vui chơi — the playground.",
    },
    {
      kind: "arrange", label: "Xếp câu cần dùng",
      prompt: "To ask people for help, arrange Maple's question:",
      vi: "Để nhờ mọi người giúp, hãy xếp câu hỏi của Maple:",
      solution: ["Have", "you", "seen", "my", "friend", "Theo"],
      say: "Have you seen my friend Theo?",
    },
    {
      kind: "choice", label: "Chọn hành động",
      prompt: "Near the playground, Maple sees a boy throwing a ball. The sun is almost down. What should Maple do?",
      vi: "Gần khu vui chơi, Maple thấy một cậu bé đang ném bóng. Mặt trời sắp lặn. Maple nên làm gì?",
      options: [
        { label: "Call out: “Theo, is that you?”", correct: true, feedback: "The boy turns around — it's Theo! 🎉" },
        { label: "Go home without checking", correct: false, feedback: "Nhưng vậy thì sẽ không tìm được Theo. Thử lại nhé!" },
        { label: "Sit and wait quietly", correct: false, feedback: "Trời sắp tối rồi, nên chủ động hơn. Thử lại nhé!" },
      ],
    },
  ],
  outro: [
    { who: "theo", text: "Maple! I was waiting by the swings!", vi: "Maple! Mình đợi cậu ở chỗ xích đu đó!" },
    { who: "narrator", text: "Maple found Theo just before dark. They walked home together, happy.", vi: "Maple tìm được Theo ngay trước khi trời tối. Hai bạn vui vẻ về nhà cùng nhau." },
    { who: "maple", text: "Good questions and teamwork saved the day!", vi: "Nhờ hỏi khéo và phối hợp mà mình đã làm được!" },
  ],
  reward: { sticker: "st-maple", badge: "Nhà thám hiểm công viên", stars: 3 },
};

export const MISSIONS: AdventureMission[] = [PARK_FIND_THEO];
export const missionById = (id: string) => MISSIONS.find((m) => m.id === id);

/* ============ Bản đồ 6 chương (mỗi Unit một chương) ============ */
export const CHAPTERS: AdventureChapter[] = [
  { id: "ch-park", n: 1, unitId: "park", title: "At the Park", vi: "Ở công viên", sceneImage: IMG + "scene-park.webp",
    blurb: "Giúp Maple tìm bạn Theo trước khi trời tối.", ready: true, missionId: "park-find-theo" },
  { id: "ch-kitchen", n: 2, unitId: "kitchen", title: "In the Kitchen", vi: "Trong bếp", sceneImage: IMG + "scene-kitchen.webp",
    blurb: "Cùng bà chuẩn bị bữa sáng bất ngờ.", ready: false },
  { id: "ch-classroom", n: 3, unitId: "classroom", title: "In the Classroom", vi: "Trong lớp học", sceneImage: IMG + "scene-classroom.webp",
    blurb: "Tìm đồ vật thất lạc trong lớp.", ready: false },
  { id: "ch-supermarket", n: 4, unitId: "supermarket", title: "At the Supermarket", vi: "Ở siêu thị", sceneImage: IMG + "scene-supermarket.webp",
    blurb: "Hoàn thành danh sách mua sắm giúp bà cụ.", ready: false },
  { id: "ch-busstop", n: 5, unitId: "busstop", title: "At the Bus Stop", vi: "Ở trạm xe buýt", sceneImage: IMG + "scene-bus-stop-rain.webp",
    blurb: "Bắt đúng chuyến xe trong ngày mưa.", ready: false },
  { id: "ch-library", n: 6, unitId: "library", title: "At the Library", vi: "Ở thư viện", sceneImage: IMG + "scene-library.webp",
    blurb: "Lần theo dấu bookmark để tìm cuốn sách bí ẩn.", ready: false },
];
export const chapterByMission = (missionId: string) => CHAPTERS.find((c) => c.missionId === missionId);
