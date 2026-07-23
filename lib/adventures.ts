// Module PHIÊU LƯU — chiến dịch theo mùa (Season → Chapter), ĐỘC LẬP với Learn.
// Nguyên tắc: CÓ THỂ dùng chung ẢNH / từ vựng / dạng câu hỏi với Learn & Practice,
// nhưng KHÔNG dùng chung tiến độ và KHÔNG đọc câu hỏi từ ngân hàng Learn/Practice.
// Adventure tự mở khoá Chapter theo tiến độ của CHÍNH NÓ (xong chương trước → mở chương sau).
// KHÔNG ánh xạ 1 Unit Learn = 1 Adventure; không phụ thuộc lessonId/unitId.

export type StoryBeat = { who?: "maple" | "theo" | "narrator"; text: string; vi?: string };

export type MissionStep =
  | { kind: "mcq"; label: string; prompt: string; vi: string; options: string[]; answer: string; explainVi?: string }
  | { kind: "arrange"; label: string; prompt: string; vi: string; solution: string[]; say?: string }
  | { kind: "choice"; label: string; prompt: string; vi: string; options: { label: string; correct: boolean; feedback: string }[] };

export type MissionReward = { sticker?: string; badge?: string; stars: number };

export type AdventureMission = {
  id: string;
  title: string;
  vi: string;
  sceneImage: string;
  goal: string;
  intro: StoryBeat[];
  steps: MissionStep[];
  outro: StoryBeat[];
  reward: MissionReward;
};

// Một "chương" của chiến dịch. Chỉ chương có missionId mới chơi được;
// mở khoá tuần tự theo tiến độ Adventure (không liên quan Learn).
export type AdventureChapter = {
  id: string; n: number; title: string; vi: string;
  sceneImage: string; blurb: string; missionId?: string;
};
export type AdventureSeason = {
  id: string; title: string; vi: string; blurb: string; chapters: AdventureChapter[];
};

const IMG = "/assets/images/gen/";

/* ============ Nhiệm vụ mẫu hoàn chỉnh: Chapter 1 ============ */
export const PARK_FIND_THEO: AdventureMission = {
  id: "park-find-theo",
  title: "The Sunset Search",
  vi: "Cuộc tìm kiếm lúc hoàng hôn",
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

/* ============ Chiến dịch theo mùa — Season 1 ============ */
// Một chiến dịch gồm nhiều chương nối tiếp thành câu chuyện. Dùng chung ảnh phố nhỏ,
// nhưng nội dung/nhiệm vụ là của riêng Adventure. Mở khoá tuần tự (xong chương trước → mở sau).
export const SEASON_TOWN: AdventureSeason = {
  id: "town-mystery",
  title: "Everyday Town Mystery",
  vi: "Bí ẩn Phố Ngày Thường",
  blurb: "Cùng Maple và Theo phá từng chương bí ẩn quanh phố nhỏ — mỗi chương một câu chuyện.",
  chapters: [
    { id: "ch-park", n: 1, title: "The Sunset Search", vi: "Cuộc tìm kiếm lúc hoàng hôn", sceneImage: IMG + "scene-park.webp",
      blurb: "Giúp Maple tìm bạn Theo trước khi trời tối.", missionId: "park-find-theo" },
    { id: "ch-kitchen", n: 2, title: "The Kitchen Clue", vi: "Manh mối trong bếp", sceneImage: IMG + "scene-kitchen.webp",
      blurb: "Lần theo mùi thơm để tìm công thức bí mật của bà." },
    { id: "ch-classroom", n: 3, title: "The Classroom Mystery", vi: "Bí ẩn lớp học", sceneImage: IMG + "scene-classroom.webp",
      blurb: "Ai làm bay chiếc máy bay giấy? Cùng điều tra." },
    { id: "ch-market", n: 4, title: "The Missing List", vi: "Danh sách thất lạc", sceneImage: IMG + "scene-supermarket.webp",
      blurb: "Giúp bà cụ mua đủ đồ khi tờ giấy nhớ bị gió cuốn." },
    { id: "ch-busstop", n: 5, title: "The Last Bus", vi: "Chuyến xe cuối", sceneImage: IMG + "scene-bus-stop-rain.webp",
      blurb: "Bắt đúng chuyến xe buýt trong cơn mưa chiều." },
    { id: "ch-library", n: 6, title: "The Library Secret", vi: "Bí mật thư viện", sceneImage: IMG + "scene-library.webp",
      blurb: "Lần theo dấu bookmark để mở cuốn sách bí ẩn." },
  ],
};
export const SEASONS: AdventureSeason[] = [SEASON_TOWN];

// Trạng thái mở khoá của từng chương theo tiến độ Adventure (không liên quan Learn).
export type ChapterStatus = "play" | "started" | "done" | "locked" | "soon";
export function chapterStatuses(
  season: AdventureSeason,
  isDone: (missionId: string) => boolean,
  isStarted: (missionId: string) => boolean,
): ChapterStatus[] {
  let prevMissionDone = true; // chương có mission đầu tiên luôn mở
  return season.chapters.map((ch) => {
    if (!ch.missionId) return "soon";
    const done = isDone(ch.missionId);
    const unlocked = prevMissionDone;
    const status: ChapterStatus = done ? "done" : unlocked ? (isStarted(ch.missionId) ? "started" : "play") : "locked";
    prevMissionDone = done; // chương có mission kế tiếp chỉ mở khi chương này xong
    return status;
  });
}
