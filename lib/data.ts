// Dữ liệu bài học (port từ data/lessons.js sang TypeScript).
export type Word = { w: string; ipa: string; vi?: string };
export type Line = { start: number; end: number; en: string; vi?: string; words?: Word[] };
export type Lesson = {
  id: string; title: string; level: number; topic: string; accent: "US" | "CA";
  skill: string; dur: number; free: boolean; videoId: string; thumb?: string;
  lines: Line[]; published?: boolean;
};
export type Level = { n: number; name: string; emoji: string; sub: string };

export const LEVELS: Level[] = [
  { n: 1, name: "Everyday English", emoji: "🌤️", sub: "Tiếng Anh hằng ngày" },
  { n: 2, name: "School & Friends", emoji: "🏫", sub: "Trường lớp & bạn bè" },
  { n: 3, name: "Life in Canada", emoji: "🍁", sub: "Cuộc sống ở Canada" },
  { n: 4, name: "Stories & Adventures", emoji: "📖", sub: "Truyện & phiêu lưu" },
  { n: 5, name: "Speak with Confidence", emoji: "🎤", sub: "Nói tự tin" },
];

// Little Fox — "Dinosaurs" (oDSlU0QRUcQ). Mốc thời gian lấy thật từ audio (GROQ Whisper).
export const DINO_LINES: Line[] = [
  { start: 7.6, end: 14.4, en: "This one has a small head.",
    words: [{ w: "small", ipa: "/smɔːl/", vi: "nhỏ" }, { w: "head", ipa: "/hed/", vi: "cái đầu" }],
    vi: "Con này có cái đầu nhỏ." },
  { start: 18.8, end: 21.9, en: "This one has a big mouth.",
    words: [{ w: "big", ipa: "/bɪɡ/", vi: "to, lớn" }, { w: "mouth", ipa: "/maʊθ/", vi: "cái miệng" }],
    vi: "Con này có cái miệng to." },
  { start: 21.9, end: 30.3, en: "This one has a long tail.",
    words: [{ w: "long", ipa: "/lɔːŋ/", vi: "dài" }, { w: "tail", ipa: "/teɪl/", vi: "cái đuôi" }],
    vi: "Con này có cái đuôi dài." },
  { start: 30.3, end: 36.9, en: "This one has large wings.",
    words: [{ w: "large", ipa: "/lɑːrdʒ/", vi: "lớn, to" }, { w: "wings", ipa: "/wɪŋz/", vi: "đôi cánh" }],
    vi: "Con này có đôi cánh lớn." },
  { start: 36.9, end: 43.7, en: "This one has sharp horns.",
    words: [{ w: "sharp", ipa: "/ʃɑːrp/", vi: "nhọn, sắc" }, { w: "horns", ipa: "/hɔːrnz/", vi: "cặp sừng" }],
    vi: "Con này có cặp sừng nhọn." },
  { start: 43.7, end: 50.5, en: "This one has a long neck.",
    words: [{ w: "neck", ipa: "/nek/", vi: "cái cổ" }],
    vi: "Con này có cái cổ dài." },
  { start: 51.9, end: 59.1, en: "This one has tiny arms.",
    words: [{ w: "tiny", ipa: "/ˈtaɪni/", vi: "bé xíu" }, { w: "arms", ipa: "/ɑːrmz/", vi: "cánh tay" }],
    vi: "Con này có đôi tay bé xíu." },
  { start: 62.7, end: 65.5, en: "But it has huge teeth.",
    words: [{ w: "huge", ipa: "/hjuːdʒ/", vi: "khổng lồ" }, { w: "teeth", ipa: "/tiːθ/", vi: "(hàm) răng" }],
    vi: "Nhưng nó có hàm răng khổng lồ." },
];

// Little Fox — "What I Like" (ewV4gJlP5hM)
export const LIKE_LINES: Line[] = [
  { start: 10, end: 18, en: "I like clowns because they are funny.",
    words: [{ w: "clowns", ipa: "/klaʊnz/", vi: "chú hề" }, { w: "funny", ipa: "/ˈfʌni/", vi: "vui, buồn cười" }],
    vi: "Mình thích chú hề vì họ rất vui." },
  { start: 18, end: 28, en: "I like roses because they are beautiful.",
    words: [{ w: "roses", ipa: "/ˈroʊzɪz/", vi: "hoa hồng" }, { w: "beautiful", ipa: "/ˈbjuːtɪfəl/", vi: "đẹp" }],
    vi: "Mình thích hoa hồng vì chúng rất đẹp." },
  { start: 28, end: 41, en: "I like beaches because they are fun.",
    words: [{ w: "beaches", ipa: "/ˈbiːtʃɪz/", vi: "bãi biển" }, { w: "fun", ipa: "/fʌn/", vi: "vui" }],
    vi: "Mình thích bãi biển vì rất vui." },
  { start: 48, end: 51.4, en: "I like puppies because they are cute.",
    words: [{ w: "puppies", ipa: "/ˈpʌpiz/", vi: "cún con" }, { w: "cute", ipa: "/kjuːt/", vi: "dễ thương" }],
    vi: "Mình thích cún con vì chúng dễ thương." },
  { start: 58, end: 63, en: "I like Grandpa because he is interesting.",
    words: [{ w: "Grandpa", ipa: "/ˈɡrænpɑː/", vi: "ông" }, { w: "interesting", ipa: "/ˈɪntrəstɪŋ/", vi: "thú vị" }],
    vi: "Mình thích ông vì ông rất thú vị." },
  { start: 67, end: 71, en: "I like bananas because they are yummy.",
    words: [{ w: "bananas", ipa: "/bəˈnænəz/", vi: "chuối" }, { w: "yummy", ipa: "/ˈjʌmi/", vi: "ngon" }],
    vi: "Mình thích chuối vì rất ngon." },
  { start: 78, end: 83, en: "I like blankets because they are warm.",
    words: [{ w: "blankets", ipa: "/ˈblæŋkɪts/", vi: "cái chăn" }, { w: "warm", ipa: "/wɔːrm/", vi: "ấm" }],
    vi: "Mình thích cái chăn vì chúng ấm áp." },
  { start: 83, end: 89.7, en: "I like my friend because she is nice.",
    words: [{ w: "friend", ipa: "/frend/", vi: "bạn" }, { w: "nice", ipa: "/naɪs/", vi: "tốt bụng, dễ thương" }],
    vi: "Mình thích bạn mình vì bạn ấy dễ thương." },
];

// Little Fox — "Things That Fly" (DLwzvrbcAqw)
export const FLY_LINES: Line[] = [
  { start: 12, end: 26, en: "The balloon flies into the clouds.",
    words: [{ w: "balloon", ipa: "/bəˈluːn/", vi: "quả bóng bay" }, { w: "clouds", ipa: "/klaʊdz/", vi: "mây" }],
    vi: "Quả bóng bay bay vào những đám mây." },
  { start: 26, end: 36, en: "The kite flies over the river.",
    words: [{ w: "kite", ipa: "/kaɪt/", vi: "cái diều" }, { w: "river", ipa: "/ˈrɪvər/", vi: "dòng sông" }],
    vi: "Cái diều bay qua dòng sông." },
  { start: 36, end: 47, en: "The bird flies to the nest.",
    words: [{ w: "bird", ipa: "/bɜːrd/", vi: "con chim" }, { w: "nest", ipa: "/nest/", vi: "cái tổ" }],
    vi: "Con chim bay về tổ." },
  { start: 47, end: 55, en: "The eagle flies to the mountains.",
    words: [{ w: "eagle", ipa: "/ˈiːɡəl/", vi: "đại bàng" }, { w: "mountains", ipa: "/ˈmaʊntɪnz/", vi: "những ngọn núi" }],
    vi: "Con đại bàng bay tới những ngọn núi." },
  { start: 65.7, end: 74, en: "The helicopter flies to the hospital.",
    words: [{ w: "helicopter", ipa: "/ˈhelɪkɑːptər/", vi: "trực thăng" }, { w: "hospital", ipa: "/ˈhɑːspɪtəl/", vi: "bệnh viện" }],
    vi: "Trực thăng bay tới bệnh viện." },
  { start: 80.2, end: 92, en: "The airplane flies to the airport.",
    words: [{ w: "airplane", ipa: "/ˈerpleɪn/", vi: "máy bay" }, { w: "airport", ipa: "/ˈerpɔːrt/", vi: "sân bay" }],
    vi: "Máy bay bay tới sân bay." },
  { start: 92.4, end: 104, en: "The spaceship flies into space.",
    words: [{ w: "spaceship", ipa: "/ˈspeɪsʃɪp/", vi: "tàu vũ trụ" }, { w: "space", ipa: "/speɪs/", vi: "vũ trụ" }],
    vi: "Tàu vũ trụ bay vào vũ trụ." },
  { start: 104.6, end: 107.3, en: "I fly over the hills.",
    words: [{ w: "fly", ipa: "/flaɪ/", vi: "bay" }, { w: "hills", ipa: "/hɪlz/", vi: "những ngọn đồi" }],
    vi: "Mình bay qua những ngọn đồi." },
];

// Bluey (chính thức) — "Robo Bingo" (n4rh2jD8OkY). Giọng đời thực, cấp độ cao hơn.
export const BLUEY_LINES: Line[] = [
  { start: 0, end: 6.5, en: "Okay, Robo Bingo, walk forward.",
    words: [{ w: "walk", ipa: "/wɔːk/", vi: "đi bộ" }, { w: "forward", ipa: "/ˈfɔːrwərd/", vi: "về phía trước" }],
    vi: "Được rồi, Robo Bingo, đi tới trước." },
  { start: 15, end: 19, en: "Now clean your teeth, Robo Bingo.",
    words: [{ w: "clean", ipa: "/kliːn/", vi: "làm sạch, chải" }, { w: "teeth", ipa: "/tiːθ/", vi: "răng" }],
    vi: "Giờ chải răng đi, Robo Bingo." },
  { start: 22, end: 24, en: "Pick up the toothbrush.",
    words: [{ w: "pick up", ipa: "/ˌpɪk ˈʌp/", vi: "nhặt/cầm lên" }, { w: "toothbrush", ipa: "/ˈtuːθbrʌʃ/", vi: "bàn chải đánh răng" }],
    vi: "Cầm bàn chải lên." },
  { start: 24, end: 27, en: "Pick up the toothpaste.",
    words: [{ w: "toothpaste", ipa: "/ˈtuːθpeɪst/", vi: "kem đánh răng" }],
    vi: "Cầm kem đánh răng lên." },
  { start: 27, end: 30.2, en: "Put the toothpaste on the toothbrush.",
    words: [{ w: "put", ipa: "/pʊt/", vi: "đặt, bỏ" }],
    vi: "Bôi kem đánh răng lên bàn chải." },
  { start: 36.3, end: 37.8, en: "Turn around.",
    words: [{ w: "turn around", ipa: "/ˌtɜːrn əˈraʊnd/", vi: "quay lại" }],
    vi: "Quay lại nào." },
  { start: 88.3, end: 89.9, en: "Now for the big finish.",
    words: [{ w: "finish", ipa: "/ˈfɪnɪʃ/", vi: "phần kết, hoàn thành" }],
    vi: "Giờ tới màn kết hoành tráng." },
  { start: 90.3, end: 91.8, en: "Lean over the sink.",
    words: [{ w: "lean over", ipa: "/liːn ˈoʊvər/", vi: "cúi người" }, { w: "sink", ipa: "/sɪŋk/", vi: "bồn rửa" }],
    vi: "Cúi người xuống bồn rửa." },
  { start: 92.1, end: 95, en: "Now spit out the toothpaste into the sink.",
    words: [{ w: "spit out", ipa: "/ˌspɪt ˈaʊt/", vi: "nhổ ra" }],
    vi: "Giờ nhổ kem đánh răng vào bồn." },
  { start: 104.5, end: 106, en: "Well done, Robo Bingo.",
    words: [{ w: "well done", ipa: "/ˌwel ˈdʌn/", vi: "làm tốt lắm" }],
    vi: "Làm tốt lắm, Robo Bingo." },
];

export const ZOO_LINES: Line[] = [
  { start: 0.0, end: 5.5, en: "Alright, so here we are, in front of the elephants.",
    words: [{ w: "elephants", ipa: "/ˈɛlɪfənts/", vi: "những con voi" }, { w: "in front of", ipa: "/ɪn frʌnt əv/", vi: "phía trước" }],
    vi: "Được rồi, chúng ta đang đứng trước mấy chú voi đây." },
  { start: 5.5, end: 11.0, en: "The cool thing about these guys is that they have really, really, really long trunks.",
    words: [{ w: "trunks", ipa: "/trʌŋks/", vi: "những cái vòi" }, { w: "guys", ipa: "/ɡaɪz/", vi: "mấy bạn ấy" }],
    vi: "Điều thú vị về mấy bạn này là chúng có cái vòi rất, rất, rất dài." },
  { start: 11.0, end: 13.5, en: "And that's cool.", words: [{ w: "cool", ipa: "/kuːl/", vi: "tuyệt/ngầu" }],
    vi: "Và điều đó thật tuyệt." },
  { start: 13.5, end: 19.0, en: "And that's pretty much all there is to say.",
    words: [{ w: "pretty much", ipa: "/ˈprɪti mʌtʃ/", vi: "gần như" }], vi: "Và gần như đó là tất cả những gì để nói." },
];

// free: true -> ai cũng học được. Bài chưa có transcript (lines rỗng) = "sắp ra mắt".
const GEN = "/assets/images/gen/";
export const BASE_LESSONS: Lesson[] = [
  { id: "zoo", title: "At the Zoo — Elephants", level: 1, topic: "Animals", accent: "US", skill: "Nói",
    dur: 19, free: true, videoId: "jNQXAC9IVRw", thumb: GEN + "thumb-aquarium.webp", lines: ZOO_LINES },
  { id: "dino", title: "Dinosaurs — Big & Small", level: 1, topic: "Animals", accent: "US", skill: "Từ vựng",
    dur: 78, free: true, videoId: "oDSlU0QRUcQ", lines: DINO_LINES },
  { id: "like", title: "What I Like", level: 1, topic: "Sở thích", accent: "US", skill: "Nói",
    dur: 108, free: true, videoId: "ewV4gJlP5hM", lines: LIKE_LINES },
  { id: "fly", title: "Things That Fly", level: 1, topic: "Phương tiện", accent: "US", skill: "Từ vựng",
    dur: 125, free: false, videoId: "DLwzvrbcAqw", lines: FLY_LINES },
  { id: "bluey_teeth", title: "Bluey — Brush Your Teeth!", level: 2, topic: "Thói quen hằng ngày", accent: "US", skill: "Nghe",
    dur: 116, free: false, videoId: "n4rh2jD8OkY", lines: BLUEY_LINES },
  { id: "food", title: "Food I Like", level: 1, topic: "Food", accent: "US", skill: "Từ vựng",
    dur: 130, free: false, videoId: "J20eXhZTHEo", thumb: GEN + "thumb-supermarket.webp", lines: [] },
  { id: "friends", title: "My Best Friend", level: 2, topic: "School & Friends", accent: "US", skill: "Nghe",
    dur: 150, free: false, videoId: "J20eXhZTHEo", thumb: GEN + "thumb-classroom.webp", lines: [] },
  { id: "vancouver", title: "A Day in Vancouver", level: 3, topic: "Life in Canada", accent: "CA", skill: "Nói",
    dur: 180, free: false, videoId: "J20eXhZTHEo", thumb: GEN + "thumb-picnic.webp", lines: [] },
  { id: "fox", title: "The Brave Little Fox", level: 4, topic: "Stories", accent: "US", skill: "Nghe",
    dur: 200, free: false, videoId: "J20eXhZTHEo", thumb: GEN + "thumb-bus.webp", lines: [] },
  { id: "intro", title: "Introduce Yourself", level: 5, topic: "Speak with Confidence", accent: "US", skill: "Nói",
    dur: 90, free: false, videoId: "J20eXhZTHEo", thumb: GEN + "thumb-cafe.webp", lines: [] },
];

export function userLessons(): Lesson[] {
  if (typeof window === "undefined") return [];
  try {
    const u = JSON.parse(localStorage.getItem("speakup_userlessons") || "[]");
    return (u as Lesson[]).filter((l) => l.published && l.lines && l.lines.length);
  } catch { return []; }
}
export function allLessons(): Lesson[] { return [...BASE_LESSONS, ...userLessons()]; }
export function lessonById(id: string): Lesson | undefined { return allLessons().find((l) => l.id === id); }
export function thumbFor(les: Lesson): string { return les.thumb || `https://i.ytimg.com/vi/${les.videoId}/mqdefault.jpg`; }
