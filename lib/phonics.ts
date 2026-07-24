// ============================================================================
// LEVEL 0 — PHONICS & FIRST WORDS (Bảng chữ & Ghép vần)
// Dạy ÂM của chữ (không phải tên chữ) rồi ghép thành từ (synthetic phonics).
// Không dùng ảnh cảnh: chữ (typography) + emoji từ khoá + TTS `speak()` sẵn có.
// Tiến độ tái dùng state.learn.lessons[unit.id] với 4 section keys chuẩn.
// ============================================================================

import type { CourseUnit } from "./learn";

// Một âm: chữ hiển thị + nhãn âm + từ khoá + emoji (đọc to = nói từ khoá để tránh TTS đọc TÊN chữ).
export type PhonicsSound = { letter: string; sound: string; keyword: string; emoji: string };
// Một từ ghép vần: từ + các âm thành phần (xếp theo thứ tự) + emoji minh hoạ (nếu có).
export type BlendWord = { word: string; sounds: string[]; emoji?: string };
// Câu hỏi máy chấm cho phonics: `say` = nội dung TTS phát; options là chữ/từ; pic=true → options là emoji.
export type PhonMCQ = { q: string; vi?: string; say?: string; options: string[]; answer: string; pic?: boolean; explainVi?: string };

export type PhonicsUnit = {
  id: string; n: number; title: string; vi: string; letters: string;
  intro: string; introVi: string;
  sounds: PhonicsSound[];
  blends: BlendWord[];
  listen: PhonMCQ[];            // Nghe & chọn (máy chấm)
  readSay: { word: string; emoji?: string }[]; // Đọc theo (không chấm)
  miniCheck: PhonMCQ[];         // Kiểm tra nhỏ (máy chấm)
};

export const PHONICS_UNITS: PhonicsUnit[] = [
  /* ---------------- Unit 1 — s a t p ---------------- */
  {
    id: "ph-satp", n: 1, title: "Sounds: s a t p", vi: "Âm s a t p", letters: "s a t p",
    intro: "Meet four sounds and blend your first words.", introVi: "Làm quen 4 âm và ghép từ đầu tiên.",
    sounds: [
      { letter: "s", sound: "/s/", keyword: "snake", emoji: "🐍" },
      { letter: "a", sound: "/æ/", keyword: "apple", emoji: "🍎" },
      { letter: "t", sound: "/t/", keyword: "tiger", emoji: "🐯" },
      { letter: "p", sound: "/p/", keyword: "pig", emoji: "🐷" },
    ],
    blends: [
      { word: "at", sounds: ["a", "t"] },
      { word: "sat", sounds: ["s", "a", "t"] },
      { word: "tap", sounds: ["t", "a", "p"], emoji: "👆" },
      { word: "pat", sounds: ["p", "a", "t"], emoji: "✋" },
    ],
    listen: [
      { say: "snake", q: "Which sound does 🐍 \"snake\" start with?", vi: "🐍 \"snake\" bắt đầu bằng âm nào?", options: ["s", "t", "p"], answer: "s" },
      { say: "sat", q: "Listen. Which word is it?", vi: "Nghe. Đây là từ nào?", options: ["sat", "tap", "pat"], answer: "sat" },
      { say: "apple", q: "Which sound does 🍎 \"apple\" start with?", vi: "🍎 \"apple\" bắt đầu bằng âm nào?", options: ["a", "p", "t"], answer: "a" },
    ],
    readSay: [{ word: "at" }, { word: "sat" }, { word: "tap", emoji: "👆" }, { word: "pat", emoji: "✋" }],
    miniCheck: [
      { say: "pig", q: "What is the first sound of 🐷 \"pig\"?", vi: "Âm đầu của 🐷 \"pig\" là gì?", options: ["p", "s", "a"], answer: "p" },
      { q: "Blend the sounds: t - a - p", vi: "Ghép các âm: t - a - p", options: ["tap", "pat", "sat"], answer: "tap" },
      { say: "pat", q: "Listen and choose the word.", vi: "Nghe và chọn từ.", options: ["pat", "tap", "at"], answer: "pat" },
    ],
  },

  /* ---------------- Unit 2 — i n m d ---------------- */
  {
    id: "ph-inmd", n: 2, title: "Sounds: i n m d", vi: "Âm i n m d", letters: "i n m d",
    intro: "Four more sounds — now you can make more words.", introVi: "Thêm 4 âm — giờ ghép được nhiều từ hơn.",
    sounds: [
      { letter: "i", sound: "/ɪ/", keyword: "insect", emoji: "🐛" },
      { letter: "n", sound: "/n/", keyword: "nose", emoji: "👃" },
      { letter: "m", sound: "/m/", keyword: "moon", emoji: "🌙" },
      { letter: "d", sound: "/d/", keyword: "dog", emoji: "🐶" },
    ],
    blends: [
      { word: "in", sounds: ["i", "n"] },
      { word: "pin", sounds: ["p", "i", "n"], emoji: "📌" },
      { word: "man", sounds: ["m", "a", "n"], emoji: "👨" },
      { word: "dad", sounds: ["d", "a", "d"], emoji: "👨" },
    ],
    listen: [
      { say: "moon", q: "Which sound does 🌙 \"moon\" start with?", vi: "🌙 \"moon\" bắt đầu bằng âm nào?", options: ["m", "n", "d"], answer: "m" },
      { say: "pin", q: "Listen. Which word is it?", vi: "Nghe. Đây là từ nào?", options: ["pin", "man", "dad"], answer: "pin" },
      { say: "dog", q: "Which sound does 🐶 \"dog\" start with?", vi: "🐶 \"dog\" bắt đầu bằng âm nào?", options: ["d", "m", "n"], answer: "d" },
    ],
    readSay: [{ word: "in" }, { word: "pin", emoji: "📌" }, { word: "man", emoji: "👨" }, { word: "sit" }],
    miniCheck: [
      { say: "nose", q: "What is the first sound of 👃 \"nose\"?", vi: "Âm đầu của 👃 \"nose\" là gì?", options: ["n", "m", "d"], answer: "n" },
      { q: "Blend the sounds: p - i - n", vi: "Ghép các âm: p - i - n", options: ["pin", "man", "dad"], answer: "pin" },
      { say: "man", q: "Listen and choose the word.", vi: "Nghe và chọn từ.", options: ["man", "pin", "in"], answer: "man" },
    ],
  },

  /* ---------------- Unit 3 — g o c k ---------------- */
  {
    id: "ph-gock", n: 3, title: "Sounds: g o c k", vi: "Âm g o c k", letters: "g o c k",
    intro: "Now you can read words like dog and cat!", introVi: "Giờ đọc được các từ như dog và cat!",
    sounds: [
      { letter: "g", sound: "/g/", keyword: "goat", emoji: "🐐" },
      { letter: "o", sound: "/ɒ/", keyword: "octopus", emoji: "🐙" },
      { letter: "c", sound: "/k/", keyword: "cat", emoji: "🐱" },
      { letter: "k", sound: "/k/", keyword: "key", emoji: "🔑" },
    ],
    blends: [
      { word: "dog", sounds: ["d", "o", "g"], emoji: "🐶" },
      { word: "cat", sounds: ["c", "a", "t"], emoji: "🐱" },
      { word: "cap", sounds: ["c", "a", "p"], emoji: "🧢" },
      { word: "kid", sounds: ["k", "i", "d"], emoji: "🧒" },
    ],
    listen: [
      { say: "cat", q: "Listen. Which word is it?", vi: "Nghe. Đây là từ nào?", options: ["cat", "dog", "cap"], answer: "cat" },
      { say: "goat", q: "Which sound does 🐐 \"goat\" start with?", vi: "🐐 \"goat\" bắt đầu bằng âm nào?", options: ["g", "c", "k"], answer: "g" },
      { say: "dog", q: "Listen. Which word is it?", vi: "Nghe. Đây là từ nào?", options: ["dog", "cat", "kid"], answer: "dog" },
    ],
    readSay: [{ word: "dog", emoji: "🐶" }, { word: "cat", emoji: "🐱" }, { word: "cap", emoji: "🧢" }, { word: "got" }],
    miniCheck: [
      { q: "Blend the sounds: c - a - t", vi: "Ghép các âm: c - a - t", options: ["cat", "cap", "dog"], answer: "cat" },
      { say: "key", q: "What is the first sound of 🔑 \"key\"?", vi: "Âm đầu của 🔑 \"key\" là gì?", options: ["k", "g", "o"], answer: "k" },
      { say: "cap", q: "Listen and choose the word.", vi: "Nghe và chọn từ.", options: ["cap", "cat", "kid"], answer: "cap" },
    ],
  },

  /* ---------------- Unit 4 — e u r h b ---------------- */
  {
    id: "ph-eurhb", n: 4, title: "Sounds: e u r h b", vi: "Âm e u r h b", letters: "e u r h b",
    intro: "Five sounds to read words like bed and bus.", introVi: "5 âm để đọc các từ như bed và bus.",
    sounds: [
      { letter: "e", sound: "/e/", keyword: "egg", emoji: "🥚" },
      { letter: "u", sound: "/ʌ/", keyword: "umbrella", emoji: "☂️" },
      { letter: "r", sound: "/r/", keyword: "rabbit", emoji: "🐰" },
      { letter: "h", sound: "/h/", keyword: "hat", emoji: "🎩" },
      { letter: "b", sound: "/b/", keyword: "ball", emoji: "⚽" },
    ],
    blends: [
      { word: "bed", sounds: ["b", "e", "d"], emoji: "🛏️" },
      { word: "bus", sounds: ["b", "u", "s"], emoji: "🚌" },
      { word: "hat", sounds: ["h", "a", "t"], emoji: "🎩" },
      { word: "cup", sounds: ["c", "u", "p"], emoji: "☕" },
    ],
    listen: [
      { say: "ball", q: "Which sound does ⚽ \"ball\" start with?", vi: "⚽ \"ball\" bắt đầu bằng âm nào?", options: ["b", "r", "h"], answer: "b" },
      { say: "bed", q: "Listen. Which word is it?", vi: "Nghe. Đây là từ nào?", options: ["bed", "bus", "hat"], answer: "bed" },
      { say: "rabbit", q: "Which sound does 🐰 \"rabbit\" start with?", vi: "🐰 \"rabbit\" bắt đầu bằng âm nào?", options: ["r", "b", "h"], answer: "r" },
    ],
    readSay: [{ word: "bed", emoji: "🛏️" }, { word: "bus", emoji: "🚌" }, { word: "hat", emoji: "🎩" }, { word: "run", emoji: "🏃" }],
    miniCheck: [
      { say: "hat", q: "What is the first sound of 🎩 \"hat\"?", vi: "Âm đầu của 🎩 \"hat\" là gì?", options: ["h", "b", "e"], answer: "h" },
      { q: "Blend the sounds: b - u - s", vi: "Ghép các âm: b - u - s", options: ["bus", "bed", "cup"], answer: "bus" },
      { say: "cup", q: "Listen and choose the word.", vi: "Nghe và chọn từ.", options: ["cup", "cap", "hat"], answer: "cup" },
    ],
  },

  /* ---------------- Unit 5 — f l j v w ---------------- */
  {
    id: "ph-fljvw", n: 5, title: "Sounds: f l j v w", vi: "Âm f l j v w", letters: "f l j v w",
    intro: "Five new sounds for even more words.", introVi: "5 âm mới cho thêm nhiều từ nữa.",
    sounds: [
      { letter: "f", sound: "/f/", keyword: "fish", emoji: "🐟" },
      { letter: "l", sound: "/l/", keyword: "leaf", emoji: "🍃" },
      { letter: "j", sound: "/dʒ/", keyword: "jam", emoji: "🍓" },
      { letter: "v", sound: "/v/", keyword: "van", emoji: "🚐" },
      { letter: "w", sound: "/w/", keyword: "web", emoji: "🕸️" },
    ],
    blends: [
      { word: "van", sounds: ["v", "a", "n"], emoji: "🚐" },
      { word: "jam", sounds: ["j", "a", "m"], emoji: "🍓" },
      { word: "log", sounds: ["l", "o", "g"], emoji: "🪵" },
      { word: "web", sounds: ["w", "e", "b"], emoji: "🕸️" },
    ],
    listen: [
      { say: "fish", q: "Which sound does 🐟 \"fish\" start with?", vi: "🐟 \"fish\" bắt đầu bằng âm nào?", options: ["f", "v", "l"], answer: "f" },
      { say: "van", q: "Listen. Which word is it?", vi: "Nghe. Đây là từ nào?", options: ["van", "jam", "web"], answer: "van" },
      { say: "leaf", q: "Which sound does 🍃 \"leaf\" start with?", vi: "🍃 \"leaf\" bắt đầu bằng âm nào?", options: ["l", "w", "f"], answer: "l" },
    ],
    readSay: [{ word: "van", emoji: "🚐" }, { word: "jam", emoji: "🍓" }, { word: "log", emoji: "🪵" }, { word: "web", emoji: "🕸️" }],
    miniCheck: [
      { say: "web", q: "What is the first sound of 🕸️ \"web\"?", vi: "Âm đầu của 🕸️ \"web\" là gì?", options: ["w", "v", "f"], answer: "w" },
      { q: "Blend the sounds: j - a - m", vi: "Ghép các âm: j - a - m", options: ["jam", "van", "log"], answer: "jam" },
      { say: "log", q: "Listen and choose the word.", vi: "Nghe và chọn từ.", options: ["log", "leg", "web"], answer: "log" },
    ],
  },

  /* ---------------- Unit 6 — x y z qu ---------------- */
  {
    id: "ph-xyzqu", n: 6, title: "Sounds: x y z qu", vi: "Âm x y z qu", letters: "x y z qu",
    intro: "The last single sounds — box, yes, zip, quiz.", introVi: "Những âm đơn cuối — box, yes, zip, quiz.",
    sounds: [
      { letter: "x", sound: "/ks/", keyword: "box", emoji: "📦" },
      { letter: "y", sound: "/j/", keyword: "yo-yo", emoji: "🪀" },
      { letter: "z", sound: "/z/", keyword: "zebra", emoji: "🦓" },
      { letter: "qu", sound: "/kw/", keyword: "queen", emoji: "👑" },
    ],
    blends: [
      { word: "box", sounds: ["b", "o", "x"], emoji: "📦" },
      { word: "fox", sounds: ["f", "o", "x"], emoji: "🦊" },
      { word: "six", sounds: ["s", "i", "x"], emoji: "6️⃣" },
      { word: "zip", sounds: ["z", "i", "p"] },
    ],
    listen: [
      { say: "queen", q: "Which sound does 👑 \"queen\" start with?", vi: "👑 \"queen\" bắt đầu bằng âm nào?", options: ["qu", "z", "y"], answer: "qu" },
      { say: "box", q: "Listen. Which word is it?", vi: "Nghe. Đây là từ nào?", options: ["box", "fox", "six"], answer: "box" },
      { say: "zebra", q: "Which sound does 🦓 \"zebra\" start with?", vi: "🦓 \"zebra\" bắt đầu bằng âm nào?", options: ["z", "x", "y"], answer: "z" },
    ],
    readSay: [{ word: "box", emoji: "📦" }, { word: "fox", emoji: "🦊" }, { word: "six", emoji: "6️⃣" }, { word: "yes" }],
    miniCheck: [
      { q: "Blend the sounds: f - o - x", vi: "Ghép các âm: f - o - x", options: ["fox", "box", "six"], answer: "fox" },
      { say: "yo-yo", q: "What is the first sound of 🪀 \"yo-yo\"?", vi: "Âm đầu của 🪀 \"yo-yo\" là gì?", options: ["y", "z", "qu"], answer: "y" },
      { say: "six", q: "Listen and choose the word.", vi: "Nghe và chọn từ.", options: ["six", "box", "zip"], answer: "six" },
    ],
  },

  /* ---------------- Unit 7 — Digraphs: sh ch th ---------------- */
  {
    id: "ph-shchth", n: 7, title: "Digraphs: sh ch th", vi: "Âm ghép sh ch th", letters: "sh ch th",
    intro: "Two letters, one sound: sh, ch, th.", introVi: "Hai chữ, một âm: sh, ch, th.",
    sounds: [
      { letter: "sh", sound: "/ʃ/", keyword: "ship", emoji: "🚢" },
      { letter: "ch", sound: "/tʃ/", keyword: "cheese", emoji: "🧀" },
      { letter: "th", sound: "/θ/", keyword: "thumb", emoji: "👍" },
    ],
    blends: [
      { word: "ship", sounds: ["sh", "i", "p"], emoji: "🚢" },
      { word: "fish", sounds: ["f", "i", "sh"], emoji: "🐟" },
      { word: "chip", sounds: ["ch", "i", "p"], emoji: "🍟" },
      { word: "bath", sounds: ["b", "a", "th"], emoji: "🛁" },
    ],
    listen: [
      { say: "ship", q: "Listen. Which word is it?", vi: "Nghe. Đây là từ nào?", options: ["ship", "chip", "fish"], answer: "ship" },
      { say: "cheese", q: "Which sound does 🧀 \"cheese\" start with?", vi: "🧀 \"cheese\" bắt đầu bằng âm ghép nào?", options: ["ch", "sh", "th"], answer: "ch" },
      { say: "thumb", q: "Which sound does 👍 \"thumb\" start with?", vi: "👍 \"thumb\" bắt đầu bằng âm ghép nào?", options: ["th", "sh", "ch"], answer: "th" },
    ],
    readSay: [{ word: "ship", emoji: "🚢" }, { word: "fish", emoji: "🐟" }, { word: "chip", emoji: "🍟" }, { word: "bath", emoji: "🛁" }],
    miniCheck: [
      { say: "fish", q: "What sound does 🐟 \"fish\" END with?", vi: "🐟 \"fish\" KẾT THÚC bằng âm ghép nào?", options: ["sh", "ch", "th"], answer: "sh" },
      { q: "Blend the sounds: ch - i - p", vi: "Ghép các âm: ch - i - p", options: ["chip", "ship", "bath"], answer: "chip" },
      { say: "bath", q: "Listen and choose the word.", vi: "Nghe và chọn từ.", options: ["bath", "ship", "fish"], answer: "bath" },
    ],
  },

  /* ---------------- Unit 8 — Digraphs: ck ng ll ss ---------------- */
  {
    id: "ph-ckngllss", n: 8, title: "Endings: ck ng ll ss", vi: "Âm cuối ck ng ll ss", letters: "ck ng ll ss",
    intro: "Sounds you often hear at the end of words.", introVi: "Những âm thường nghe ở cuối từ.",
    sounds: [
      { letter: "ck", sound: "/k/", keyword: "duck", emoji: "🦆" },
      { letter: "ng", sound: "/ŋ/", keyword: "ring", emoji: "💍" },
      { letter: "ll", sound: "/l/", keyword: "bell", emoji: "🔔" },
      { letter: "ss", sound: "/s/", keyword: "grass", emoji: "🌱" },
    ],
    blends: [
      { word: "duck", sounds: ["d", "u", "ck"], emoji: "🦆" },
      { word: "ring", sounds: ["r", "i", "ng"], emoji: "💍" },
      { word: "bell", sounds: ["b", "e", "ll"], emoji: "🔔" },
      { word: "sock", sounds: ["s", "o", "ck"], emoji: "🧦" },
    ],
    listen: [
      { say: "duck", q: "Listen. Which word is it?", vi: "Nghe. Đây là từ nào?", options: ["duck", "sock", "ring"], answer: "duck" },
      { say: "ring", q: "What sound does 💍 \"ring\" END with?", vi: "💍 \"ring\" KẾT THÚC bằng âm nào?", options: ["ng", "ck", "ll"], answer: "ng" },
      { say: "bell", q: "Listen. Which word is it?", vi: "Nghe. Đây là từ nào?", options: ["bell", "duck", "sock"], answer: "bell" },
    ],
    readSay: [{ word: "duck", emoji: "🦆" }, { word: "ring", emoji: "💍" }, { word: "bell", emoji: "🔔" }, { word: "sock", emoji: "🧦" }],
    miniCheck: [
      { q: "Blend the sounds: d - u - ck", vi: "Ghép các âm: d - u - ck", options: ["duck", "sock", "ring"], answer: "duck" },
      { say: "grass", q: "What sound does 🌱 \"grass\" END with?", vi: "🌱 \"grass\" KẾT THÚC bằng âm nào?", options: ["ss", "ll", "ck"], answer: "ss" },
      { say: "sock", q: "Listen and choose the word.", vi: "Nghe và chọn từ.", options: ["sock", "duck", "bell"], answer: "sock" },
    ],
  },

  /* ---------------- Unit 9 — Magic-e (a_e i_e o_e u_e) ---------------- */
  {
    id: "ph-magice", n: 9, title: "Magic-e: a_e i_e o_e u_e", vi: "Chữ e thần kì", letters: "a_e i_e o_e u_e",
    intro: "A quiet \"e\" at the end makes the vowel say its name.", introVi: "Chữ \"e\" lặng ở cuối làm nguyên âm đọc thành tên chữ.",
    sounds: [
      { letter: "a_e", sound: "/eɪ/", keyword: "cake", emoji: "🍰" },
      { letter: "i_e", sound: "/aɪ/", keyword: "bike", emoji: "🚲" },
      { letter: "o_e", sound: "/oʊ/", keyword: "bone", emoji: "🦴" },
      { letter: "u_e", sound: "/juː/", keyword: "cube", emoji: "🧊" },
    ],
    blends: [
      { word: "cake", sounds: ["c", "a_e", "k"], emoji: "🍰" },
      { word: "bike", sounds: ["b", "i_e", "k"], emoji: "🚲" },
      { word: "kite", sounds: ["k", "i_e", "t"], emoji: "🪁" },
      { word: "nose", sounds: ["n", "o_e", "s"], emoji: "👃" },
    ],
    listen: [
      { say: "cake", q: "Listen. Which word is it?", vi: "Nghe. Đây là từ nào?", options: ["cake", "bike", "kite"], answer: "cake" },
      { say: "bike", q: "Listen. Which word is it?", vi: "Nghe. Đây là từ nào?", options: ["bike", "kite", "cake"], answer: "bike" },
      { say: "kite", q: "Does 🪁 \"kite\" say a short i or a long i?", vi: "🪁 \"kite\" đọc i ngắn hay i dài?", options: ["long i (like eye)", "short i (like in)", "no i"], answer: "long i (like eye)" },
    ],
    readSay: [{ word: "cake", emoji: "🍰" }, { word: "bike", emoji: "🚲" }, { word: "kite", emoji: "🪁" }, { word: "nose", emoji: "👃" }],
    miniCheck: [
      { q: "Add magic-e: cap → ?", vi: "Thêm chữ e thần kì: cap → ?", options: ["cape", "caps", "cup"], answer: "cape" },
      { say: "nose", q: "Listen and choose the word.", vi: "Nghe và chọn từ.", options: ["nose", "nod", "note"], answer: "nose" },
      { q: "Which word has the LONG a sound?", vi: "Từ nào có âm a DÀI?", options: ["cake", "cat", "cap"], answer: "cake" },
    ],
  },

  /* ---------------- Unit 10 — First sight words ---------------- */
  {
    id: "ph-sight", n: 10, title: "First Sight Words", vi: "Từ nhìn đầu tiên", letters: "the a I is",
    intro: "Some words we just learn by sight — read them fast!", introVi: "Vài từ ta học bằng cách nhìn quen — đọc thật nhanh nhé!",
    sounds: [
      { letter: "the", sound: "\"the\"", keyword: "the cat", emoji: "🐱" },
      { letter: "a", sound: "\"a\"", keyword: "a dog", emoji: "🐶" },
      { letter: "I", sound: "\"I\"", keyword: "I run", emoji: "🏃" },
      { letter: "is", sound: "\"is\"", keyword: "it is", emoji: "👌" },
      { letter: "my", sound: "\"my\"", keyword: "my bag", emoji: "🎒" },
    ],
    blends: [
      { word: "the cat", sounds: ["the", "cat"], emoji: "🐱" },
      { word: "my dog", sounds: ["my", "dog"], emoji: "🐶" },
      { word: "I am", sounds: ["I", "am"] },
      { word: "he is", sounds: ["he", "is"] },
    ],
    listen: [
      { say: "the", q: "Listen. Which word is it?", vi: "Nghe. Đây là từ nào?", options: ["the", "he", "she"], answer: "the" },
      { say: "my", q: "Listen. Which word is it?", vi: "Nghe. Đây là từ nào?", options: ["my", "me", "we"], answer: "my" },
      { say: "she", q: "Listen. Which word is it?", vi: "Nghe. Đây là từ nào?", options: ["she", "he", "the"], answer: "she" },
    ],
    readSay: [{ word: "the cat", emoji: "🐱" }, { word: "my dog", emoji: "🐶" }, { word: "I am" }, { word: "you are" }],
    miniCheck: [
      { q: "Choose the sight word: \"___ cat is big.\"", vi: "Chọn từ nhìn: \"___ cat is big.\"", options: ["The", "Cat", "Run"], answer: "The" },
      { say: "he", q: "Listen and choose the word.", vi: "Nghe và chọn từ.", options: ["he", "she", "the"], answer: "he" },
      { q: "Choose the sight word: \"___ am happy.\"", vi: "Chọn từ nhìn: \"___ am happy.\"", options: ["I", "My", "Is"], answer: "I" },
    ],
  },
];

/* ---------- helpers ---------- */
export const phonicsUnitById = (id: string): PhonicsUnit | undefined => PHONICS_UNITS.find((u) => u.id === id);

// Danh sách unit cho Course Map (Level 0). Không có ảnh cảnh → dùng `thumb` (chữ) + emoji.
export const LEVEL0_UNITS: CourseUnit[] = PHONICS_UNITS.map((u) => ({
  id: u.id, n: u.n, title: u.title, vi: u.vi, focus: u.introVi, thumb: u.letters, phonicsId: u.id, ready: true,
}));
