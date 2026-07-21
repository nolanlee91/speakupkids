"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LEVELS,
  allLessons,
  lessonById,
  thumbFor,
  type Lesson,
  type Level,
} from "@/lib/data";
import {
  type AppState,
  defaultState,
  loadState,
  saveState,
  totalStars,
  lessonsDone,
  isPremium,
  canOpen,
  touchStreak,
  resetDailyIfNeeded,
  todayStr,
  totalLearned,
  awardCompletion,
} from "@/lib/state";
import { useRef } from "react";

const BDG = "/assets/images/badges/";
const GEN = "/assets/images/gen/";

const BADGES: { img: string; nm: string; has: (s: AppState, ls: Lesson[]) => boolean }[] = [
  { img: "badge-star.png", nm: "Bài đầu tiên", has: (s) => lessonsDone(s) >= 1 },
  { img: "badge-streak.png", nm: "3 ngày liên tiếp", has: (s) => s.streak >= 3 },
  { img: "badge-speaking.png", nm: "Thuộc 5 câu", has: (s) => totalLearned(s) >= 5 },
  { img: "badge-pronunciation.png", nm: "Thuộc 15 câu", has: (s) => totalLearned(s) >= 15 },
  { img: "badge-listening.png", nm: "Chăm nghe", has: (s) => lessonsDone(s) >= 3 },
  { img: "badge-trophy.png", nm: "10 sao", has: (s) => totalStars(s) >= 10 },
  { img: "badge-maple-leaf.png", nm: "Xong Level 1", has: (s, ls) => ls.filter((l) => l.level === 1).every((l) => s.progress[l.id]?.done) },
  { img: "badge-explorer.png", nm: "Nhà khám phá", has: (s) => lessonsDone(s) >= 5 },
  { img: "badge-vancouver.png", nm: "Đến Vancouver", has: (s, ls) => ls.filter((l) => l.level === 3).some((l) => s.progress[l.id]?.done) },
  { img: "badge-book.png", nm: "Mọt truyện", has: (s, ls) => ls.filter((l) => l.level === 4).some((l) => s.progress[l.id]?.done) },
];

const AVATARS = ["🦊", "🐰", "🐼", "🦉", "🐨", "🦫", "🐬", "🦄", "🐧", "🐝"];
const PLANS: { id: AppState["membership"]; name: string; price: string; feats: string[] }[] = [
  { id: "free", name: "Miễn phí", price: "0₫", feats: ["Vài bài mẫu", "Giới hạn Shadowing mỗi ngày", "Một phần lộ trình", "Ghi âm & nghe lại cơ bản"] },
  { id: "premium", name: "Premium", price: "99k/tháng", feats: ["Toàn bộ bài học", "Shadowing không giới hạn", "Phản hồi phát âm", "Toàn bộ game & huy hiệu", "Nội dung mới hằng tuần"] },
  { id: "family", name: "Family", price: "149k/tháng", feats: ["2–4 hồ sơ trẻ em", "Tiến độ riêng từng bé", "Phụ huynh xem báo cáo", "Tất cả quyền lợi Premium"] },
];
const ZONE_TINTS: Record<number, string> = { 1: "#fff6df", 2: "#e9f6ff", 3: "#ffece3", 4: "#f1e9ff", 5: "#e5f9ee" };

type View = "home" | "path" | "library" | "achv" | "account";

export default function App() {
  const [state, setState] = useState<AppState>(defaultState);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("home");
  const [studio, setStudio] = useState<Lesson | null>(null);
  const [upsell, setUpsell] = useState(false);
  const [reward, setReward] = useState<{ title: string; html: string } | null>(null);
  const [showSplash, setShowSplash] = useState(false);
  const lessons = useMemo(() => (ready ? allLessons() : []), [ready]);

  // Nạp state từ localStorage sau khi mount (tránh lệch hydrate)
  useEffect(() => {
    let s = loadState();
    s = touchStreak(s);
    s = resetDailyIfNeeded(s);
    if (s.splashDate !== todayStr()) {
      s = { ...s, splashDate: todayStr() };
      setShowSplash(true);
    }
    setState(s);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);
  useEffect(() => {
    document.body.classList.toggle("no-motion", state.prefs.motion === false);
  }, [state.prefs.motion]);

  const stars = totalStars(state);
  const done = lessonsDone(state);
  const curId = lessons.find((l) => !state.progress[l.id]?.done)?.id;

  function openLesson(id: string) {
    const les = lessonById(id);
    if (!les) return;
    if (!canOpen(state, les)) {
      setUpsell(true);
      return;
    }
    if (!les.lines.length) {
      alert("Bài này đang được biên soạn, sắp ra mắt! 🛠️");
      return;
    }
    setState((s) => ({ ...s, lastLesson: id }));
    setStudio(les);
  }

  function toggleLearned(id: string, i: number) {
    setState((s) => {
      const cur = s.progress[id]?.learned || [];
      const learned = cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i];
      const prev = s.progress[id] || { done: false, stars: 0, learned: [] };
      return { ...s, progress: { ...s.progress, [id]: { ...prev, learned } } };
    });
  }
  function handleComplete(id: string, starsWon: number, title: string, html: string) {
    const { state: ns, newly } = awardCompletion(state, id, starsWon);
    setState(ns);
    celebrate(state.prefs.motion !== false);
    setReward({ title, html: newly ? html : "Bạn đã hoàn thành bài này rồi. Ôn lại luôn tốt nhé!" });
  }

  if (!ready) return <div style={{ padding: 40, color: "#7a8194" }}>Đang tải…</div>;

  return (
    <div id="app">
      {/* Top greeting */}
      <div className="topbar">
        <div className="avatar">{state.avatar}</div>
        <div className="who">
          <div className="hi">Xin chào,</div>
          <div className="nm">{state.nickname || "bạn nhỏ"}</div>
        </div>
        <span className="chip fire">🔥 {state.streak}</span>
        <span className="chip sun">⭐ {stars}</span>
      </div>

      <div className="wrap">
        {view === "home" && (
          <Home state={state} lessons={lessons} stars={stars} done={done} openLesson={openLesson} goLibrary={() => setView("library")} />
        )}
        {view === "path" && <Path state={state} lessons={lessons} curId={curId} openLesson={openLesson} />}
        {view === "library" && <Library state={state} lessons={lessons} openLesson={openLesson} />}
        {view === "achv" && <Achievements state={state} lessons={lessons} stars={stars} done={done} />}
        {view === "account" && <Account state={state} setState={setState} />}
      </div>

      {/* Bottom nav */}
      <nav className="nav">
        {([
          ["home", "🏠", "Trang chủ"],
          ["path", "🗺️", "Lộ trình"],
          ["library", "📚", "Thư viện"],
          ["achv", "🏆", "Thành tích"],
          ["account", "👤", "Tài khoản"],
        ] as [View, string, string][]).map(([v, i, label]) => (
          <button key={v} className={view === v ? "on" : ""} onClick={() => setView(v)}>
            <span className="i">{i}</span>
            {label}
          </button>
        ))}
      </nav>

      {/* Splash 1 lần/ngày */}
      {showSplash && (
        <div id="splash">
          {state.prefs.motion !== false &&
            Array.from({ length: 7 }, (_, i) => (
              <span key={i} className="leaf" style={{ left: `${6 + i * 14}%`, animationDuration: `${2 + (i % 3) * 0.7}s`, animationDelay: `${i * 0.22}s` }}>
                🍁
              </span>
            ))}
          <div className="sp-banner">
            <div className="sp-card">
              <div className="sp-title">Chào {state.nickname || "bạn nhỏ"}! 👋</div>
              <div className="sp-goal">🎯 Mục tiêu hôm nay: học 1 bài</div>
              <button className="btn" onClick={() => setShowSplash(false)}>▶ Học tiếp</button>
            </div>
          </div>
        </div>
      )}

      {/* Upsell */}
      {upsell && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setUpsell(false)}>
          <div className="box">
            <img src={`${GEN}mascot-book.png`} style={{ width: 110, height: 110, objectFit: "contain" }} alt="" />
            <h3>Bài học Premium 🔒</h3>
            <p style={{ color: "var(--muted)" }}>Mở khoá toàn bộ lộ trình, Shadowing không giới hạn và phản hồi phát âm với gói Premium.</p>
            <button className="btn accent" onClick={() => { setUpsell(false); setView("account"); }}>Xem gói thành viên</button>
            <div>
              <button className="btn ghost sm" style={{ marginTop: 8 }} onClick={() => setUpsell(false)}>Để sau</button>
            </div>
          </div>
        </div>
      )}

      {/* Shadowing Studio */}
      {studio && (
        <Studio
          key={studio.id}
          lesson={studio}
          prefs={state.prefs}
          done={!!state.progress[studio.id]?.done}
          learned={state.progress[studio.id]?.learned || []}
          onToggleLearned={(i) => toggleLearned(studio.id, i)}
          onComplete={(stars, title, html) => handleComplete(studio.id, stars, title, html)}
          onClose={() => setStudio(null)}
        />
      )}

      {/* Reward */}
      {reward && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setReward(null)}>
          <div className="box">
            <img src={`${GEN}mascot-star.png`} style={{ width: 120, height: 120, objectFit: "contain" }} alt="" />
            <h3>{reward.title}</h3>
            <p style={{ color: "var(--muted)" }} dangerouslySetInnerHTML={{ __html: reward.html }} />
            <button className="btn green" onClick={() => setReward(null)}>Tuyệt vời!</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== YouTube helper + Studio ==================== */
declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: unknown) => unknown };
    onYouTubeIframeAPIReady?: () => void;
  }
}
let ytPromise: Promise<Window["YT"]> | null = null;
function loadYT(): Promise<Window["YT"]> {
  if (typeof window === "undefined") return Promise.reject();
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (ytPromise) return ytPromise;
  ytPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return ytPromise;
}
function speak(word: string, accent: "US" | "CA") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(word);
  u.lang = accent === "CA" ? "en-CA" : "en-US";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}
function celebrate(motion: boolean) {
  if (!motion || typeof document === "undefined") return;
  const colors = ["#ff7a59", "#ffcc33", "#17a2a2", "#3bb273", "#a05be0", "#ff5d8f"];
  for (let i = 0; i < 36; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[i % colors.length];
    c.style.animationDelay = Math.random() * 0.3 + "s";
    c.style.transform = "scale(" + (0.6 + Math.random()) + ")";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 2200);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function Studio({
  lesson,
  prefs,
  done,
  learned,
  onToggleLearned,
  onComplete,
  onClose,
}: {
  lesson: Lesson;
  prefs: { ipa: boolean; vi: boolean; accent: "US" | "CA" };
  done: boolean;
  learned: number[];
  onToggleLearned: (i: number) => void;
  onComplete: (stars: number, title: string, html: string) => void;
  onClose: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const stopAtRef = useRef<number | null>(null);
  const speedRef = useRef(1);
  const shadowRef = useRef(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [shadowMode, setShadowMode] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showIpa, setShowIpa] = useState(prefs.ipa);
  const [showVi, setShowVi] = useState(prefs.vi);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const inner = document.createElement("div");
    host.appendChild(inner);
    loadYT().then((YT) => {
      if (!YT) return;
      playerRef.current = new YT.Player(inner, {
        videoId: lesson.videoId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: () => {
            interval = setInterval(() => {
              const p = playerRef.current;
              if (!p || !p.getCurrentTime) return;
              const t = p.getCurrentTime();
              if (stopAtRef.current !== null && t >= stopAtRef.current) {
                p.pauseVideo();
                stopAtRef.current = null;
                p.setPlaybackRate(speedRef.current);
              }
              let idx = -1;
              for (let i = 0; i < lesson.lines.length; i++)
                if (t >= lesson.lines[i].start && t < lesson.lines[i].end) {
                  idx = i;
                  break;
                }
              setActiveIdx((cur) => (idx !== -1 && idx !== cur ? idx : cur));
            }, 200);
          },
        },
      }) as any;
    });
    return () => {
      if (interval) clearInterval(interval);
      try {
        playerRef.current?.destroy();
      } catch {}
      playerRef.current = null;
      host.innerHTML = "";
    };
  }, [lesson.videoId, lesson.lines]);

  function playLine(i: number) {
    const ln = lesson.lines[i];
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(ln.start, true);
    p.setPlaybackRate(speed);
    p.playVideo();
    stopAtRef.current = shadowMode ? ln.end : null;
    setActiveIdx(i);
  }
  function slowPlay(i: number) {
    const ln = lesson.lines[i];
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(ln.start, true);
    p.setPlaybackRate(0.5);
    p.playVideo();
    stopAtRef.current = ln.end;
    setActiveIdx(i);
  }
  function changeSpeed(v: number) {
    setSpeed(v);
    speedRef.current = v;
    playerRef.current?.setPlaybackRate(v);
  }
  function toggleShadow(on: boolean) {
    setShadowMode(on);
    shadowRef.current = on;
    if (!on) stopAtRef.current = null;
  }

  return (
    <div id="studio">
      <div className="st-top">
        <button className="bk" onClick={onClose}>← Thoát</button>
        <h3>{lesson.title}</h3>
      </div>
      <div className="st-wrap">
        <div className="st-layout">
          <div className="videobox" ref={hostRef} />
          <div>
            <div className="card toolbar">
              <label className={`toggle ${showIpa ? "on" : ""}`}>
                <input type="checkbox" checked={showIpa} onChange={(e) => setShowIpa(e.target.checked)} /> Từ mới + IPA
              </label>
              <label className={`toggle ${showVi ? "on" : ""}`}>
                <input type="checkbox" checked={showVi} onChange={(e) => setShowVi(e.target.checked)} /> Nghĩa
              </label>
              <label className={`toggle ${shadowMode ? "on" : ""}`}>
                <input type="checkbox" checked={shadowMode} onChange={(e) => toggleShadow(e.target.checked)} /> Tự dừng cuối câu
              </label>
              <span className="speed">
                Tốc độ
                <select value={speed} onChange={(e) => changeSpeed(+e.target.value)}>
                  <option value={0.6}>0.6x</option>
                  <option value={0.8}>0.8x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                </select>
              </span>
            </div>

            <div className="card learn-prog">
              <div className="lp-top">
                <span>Đã thuộc {learned.length}/{lesson.lines.length} câu</span> 🎯
              </div>
              <div className="lp-bar">
                <i style={{ width: `${lesson.lines.length ? (learned.length / lesson.lines.length) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="transcript">
              {lesson.lines.map((ln, i) => (
                <div key={i} className={`line ${activeIdx === i ? "active" : ""} ${learned.includes(i) ? "learned" : ""}`}>
                  <div className="en" onClick={() => playLine(i)}>{ln.en}</div>
                  {ln.words?.length ? (
                    <div className={`words ${showIpa ? "" : "hide"}`}>
                      {ln.words.map((w) => (
                        <span key={w.w} className="word" onClick={(e) => { e.stopPropagation(); speak(w.w, prefs.accent); }}>
                          <b>{w.w}</b> <span className="wipa">{w.ipa}</span> 🔊
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className={`vi ${showVi ? "" : "hide"}`}>{ln.vi}</div>
                  <div className="ctrls">
                    <button className="icbtn" onClick={() => playLine(i)}>🔁 Nghe</button>
                    <button className="icbtn" onClick={() => slowPlay(i)}>🐢 Nghe chậm</button>
                    <button className="icbtn learn" onClick={() => onToggleLearned(i)}>
                      {learned.includes(i) ? "✓ Đã thuộc" : "☆ Đánh dấu thuộc"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="complete-bar">
              <button className="btn accent complete-btn" onClick={() => setQuizOpen(true)}>🎯 Làm quiz cuối bài</button>
              <button
                className="btn complete-btn"
                disabled={done}
                onClick={() => onComplete(3, "Giỏi quá! 🎉", "Bạn vừa hoàn thành bài học và nhận <b>+3 ⭐</b>!")}
              >
                {done ? "🎉 Đã hoàn thành!" : "✓ Mình học xong bài này!"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {quizOpen && (
        <Quiz
          lesson={lesson}
          accent={prefs.accent}
          onClose={() => setQuizOpen(false)}
          onFinish={(score, total) => {
            const pct = Math.round((score / total) * 100);
            const stars = pct >= 80 ? 3 : pct >= 50 ? 2 : 1;
            setQuizOpen(false);
            onComplete(
              stars,
              pct >= 80 ? "Xuất sắc! 🌟" : pct >= 50 ? "Làm tốt lắm! 👍" : "Cố lên nhé! 💪",
              `Bạn trả lời đúng <b>${score}/${total}</b> câu (${pct}%).<br>Nhận <b>+${stars} ⭐</b>!`
            );
          }}
        />
      )}
    </div>
  );
}

/* ==================== QUIZ ==================== */
type Qz = { type: string; q?: string; prompt?: string; sub?: string; speak?: string; options: string[]; answer: string };
function shuffle<T>(a: T[]): T[] {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function choices(correct: string, pool: string[], n = 2): string[] {
  const d = shuffle([...new Set(pool)].filter((x) => x && x !== correct)).slice(0, n);
  return shuffle([correct, ...d]);
}
function buildQuiz(lesson: Lesson): Qz[] {
  const ls = lesson.lines || [];
  const words = ls.flatMap((l) => l.words || []);
  const wordNames = [...new Set(words.map((w) => w.w))];
  const wordVis = words.filter((w) => w.vi) as { w: string; ipa: string; vi: string }[];
  const sentVis = ls.map((l) => l.vi).filter(Boolean) as string[];
  const Q: Qz[] = [];
  shuffle(wordVis).slice(0, 2).forEach((w) => {
    if (new Set(wordVis.map((x) => x.vi)).size >= 2)
      Q.push({ type: "Ghép nghĩa", q: `“${w.w}” nghĩa là gì?`, sub: w.ipa, options: choices(w.vi, wordVis.map((x) => x.vi)), answer: w.vi });
  });
  shuffle(wordNames).slice(0, 2).forEach((w) => {
    if (wordNames.length >= 2) Q.push({ type: "Nghe & chọn", q: "Nghe rồi chọn từ đúng", speak: w, options: choices(w, wordNames), answer: w });
  });
  shuffle(ls.filter((l) => l.words && l.words.length)).slice(0, 2).forEach((l) => {
    const key = l.words![Math.floor(Math.random() * l.words!.length)].w;
    const re = new RegExp("\\b" + key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
    if (re.test(l.en)) Q.push({ type: "Điền từ", q: "Điền từ còn thiếu vào chỗ trống", prompt: l.en.replace(re, " _____ "), options: choices(key, wordNames.length >= 2 ? wordNames : [key, "the", "a"]), answer: key });
  });
  shuffle(ls.filter((l) => l.vi)).slice(0, 2).forEach((l) => {
    if (new Set(sentVis).size >= 2) Q.push({ type: "Chọn nghĩa", q: "Câu này nghĩa là gì?", prompt: l.en, options: choices(l.vi!, sentVis), answer: l.vi! });
  });
  return shuffle(Q).slice(0, 6);
}
function Quiz({ lesson, accent, onClose, onFinish }: { lesson: Lesson; accent: "US" | "CA"; onClose: () => void; onFinish: (score: number, total: number) => void }) {
  const [qs] = useState<Qz[]>(() => buildQuiz(lesson));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const q = qs[idx];

  useEffect(() => {
    if (qs.length < 2) {
      alert("Bài này chưa đủ nội dung để tạo quiz.");
      onClose();
    }
  }, [qs.length, onClose]);
  useEffect(() => {
    if (q?.speak) speak(q.speak, accent);
  }, [q, accent]);

  if (!q) return null;
  const answered = picked !== null;
  function answer(opt: string) {
    if (answered) return;
    setPicked(opt);
    if (opt === q.answer) setScore((s) => s + 1);
  }
  function next() {
    if (idx + 1 < qs.length) {
      setIdx(idx + 1);
      setPicked(null);
    } else onFinish(picked === q.answer ? score : score, qs.length);
  }

  return (
    <div id="quiz">
      <div className="quiz-top">
        <button className="bk" onClick={onClose}>✕</button>
        <div className="qbar"><i style={{ width: `${(idx / qs.length) * 100}%` }} /></div>
        <span>Câu {idx + 1}/{qs.length}</span>
      </div>
      <div className="quiz-body">
        <div className="qcard">
          <div className="qtype">{q.type}</div>
          <div className="qtext">
            {q.speak ? (
              <button className="btn" onClick={() => speak(q.speak!, accent)}>🔊 Nghe lại từ</button>
            ) : (
              <>
                {q.q}
                {q.prompt && <div className="qprompt">{q.prompt}</div>}
                {q.sub && <div className="qsub">{q.sub}</div>}
              </>
            )}
          </div>
          <div className="qhint">{q.speak ? q.q : ""}</div>
          <div className={`qopts ${answered ? "answered" : ""}`}>
            {q.options.map((o) => (
              <button
                key={o}
                className={`qopt ${answered && o === q.answer ? "right" : ""} ${answered && o === picked && o !== q.answer ? "wrong" : ""}`}
                disabled={answered}
                onClick={() => answer(o)}
              >
                {o}
              </button>
            ))}
          </div>
          {answered && (
            <div className="qfb">
              {picked === q.answer ? <span className="ok">✓ Chính xác!</span> : <><span className="no">✗ Chưa đúng.</span> Đáp án: <b>{q.answer}</b></>}
            </div>
          )}
          {answered && (
            <button className="btn qnext" onClick={next}>{idx + 1 < qs.length ? "Câu tiếp →" : "Xem kết quả →"}</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==================== CARD ==================== */
function LessonCard({ les, state, onOpen }: { les: Lesson; state: AppState; onOpen: (id: string) => void }) {
  const p = state.progress[les.id];
  const locked = !canOpen(state, les);
  const soon = les.lines.length === 0;
  return (
    <div className="card lcard" onClick={() => onOpen(les.id)}>
      {p?.done && <span className="done-badge">✓ {"⭐".repeat(p.stars || 0)}</span>}
      <div className="thumb" style={{ backgroundImage: `url('${thumbFor(les)}')` }}>
        {locked ? (
          <div className="lockov">🔒<span>Premium</span></div>
        ) : soon ? (
          <div className="lockov">🛠️<span>Sắp ra mắt</span></div>
        ) : null}
      </div>
      <div className="body">
        <div className="ttl">{les.title}</div>
        <div className="meta">
          <span className="badge lv">Level {les.level}</span>
          <span className="badge">{les.skill}</span>
          <span className={`badge ${les.free ? "free" : "pro"}`}>{les.free ? "Miễn phí" : "Premium"}</span>
        </div>
      </div>
    </div>
  );
}

/* ==================== HOME ==================== */
function Home({ state, lessons, stars, done, openLesson, goLibrary }: { state: AppState; lessons: Lesson[]; stars: number; done: number; openLesson: (id: string) => void; goLibrary: () => void }) {
  const cont = state.lastLesson ? lessonById(state.lastLesson) : null;
  const target = cont || lessons[0];
  const goal = 1;
  const pct = Math.min(100, Math.round((state.dailyDone / goal) * 100));
  const sug = [...lessons].sort((a, b) => (state.progress[a.id]?.done ? 1 : 0) - (state.progress[b.id]?.done ? 1 : 0)).slice(0, 3);
  const statTiles: [string, number, string][] = [
    ["🔥", state.streak, "ngày liên tiếp"],
    ["⭐", stars, "sao"],
    ["✅", done, "bài xong"],
    ["📖", totalLearned(state), "câu đã thuộc"],
  ];
  return (
    <section className="view">
      <div className="homehero">
        <div className="hh-glass">
          <div className="hh-hi">Xin chào, {state.nickname || "bạn nhỏ"}! 👋</div>
          <div className="hh-sub">Hôm nay mình cùng luyện nói tiếng Anh nhé!</div>
          {target && (
            <button className="btn" onClick={() => openLesson(target.id)}>
              ▶ {cont ? "Tiếp tục học" : "Học ngay"}
            </button>
          )}
        </div>
      </div>

      {target && (
        <div className="card continue" style={{ cursor: "pointer" }} onClick={() => openLesson(target.id)}>
          <div className="thumb" style={{ backgroundImage: `url('${thumbFor(target)}')` }} />
          <div className="info">
            <div className="k">{cont ? "Tiếp tục bài học" : "Bắt đầu bài đầu tiên"}</div>
            <div className="t">{target.title}</div>
            <div className="row" style={{ marginTop: 8 }}>
              <span className="btn sm">▶ Vào học</span>
            </div>
          </div>
        </div>
      )}

      <div className="section-title"><h2>🎯 Mục tiêu hôm nay</h2></div>
      <div className="card" style={{ padding: 14 }}>
        <div style={{ fontWeight: 700 }}>
          {state.dailyDone >= goal ? "🎉 Hoàn thành mục tiêu hôm nay! Giỏi quá!" : `Học ${goal} bài hôm nay (${state.dailyDone}/${goal})`}
        </div>
        <div className="goalbar"><i style={{ width: `${pct}%` }} /></div>
      </div>

      <div className="section-title">
        <h2>✨ Gợi ý cho hôm nay</h2>
        <span className="more" onClick={goLibrary}>Xem thư viện →</span>
      </div>
      <div className="grid">
        {sug.map((l) => <LessonCard key={l.id} les={l} state={state} onOpen={openLesson} />)}
      </div>

      <div className="section-title"><h2>📊 Thành tích nhanh</h2></div>
      <div className="statgrid">
        {statTiles.map(([i, n, l]) => (
          <div key={l} className="card stat"><div className="n">{i} {n}</div><div className="l">{l}</div></div>
        ))}
      </div>
    </section>
  );
}

/* ==================== PATH ==================== */
function Path({ state, lessons, curId, openLesson }: { state: AppState; lessons: Lesson[]; curId?: string; openLesson: (id: string) => void }) {
  return (
    <section className="view">
      <div className="section-title"><h2>🗺️ Lộ trình học</h2></div>
      <p style={{ color: "var(--muted)", marginTop: -6 }}>Đi từ dễ đến khó. Hoàn thành bài để mở bài tiếp theo.</p>
      {LEVELS.map((lv) => (
        <Zone key={lv.n} lv={lv} state={state} lessons={lessons} curId={curId} openLesson={openLesson} />
      ))}
    </section>
  );
}
function Zone({ lv, state, lessons, curId, openLesson }: { lv: Level; state: AppState; lessons: Lesson[]; curId?: string; openLesson: (id: string) => void }) {
  const list = lessons.filter((l) => l.level === lv.n);
  const doneCount = list.filter((l) => state.progress[l.id]?.done).length;
  const XC = 170, AMP = 88, GAP = 116;
  const pts = list.map((_, i) => [i === 0 ? XC : i % 2 ? XC + AMP : XC - AMP, 56 + i * GAP] as [number, number]);
  const H = list.length ? 56 + (list.length - 1) * GAP + 84 : 0;
  let d = pts.length ? `M ${pts[0][0]} ${pts[0][1]}` : "";
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1], [x2, y2] = pts[i];
    d += ` C ${x1} ${y1 + 58}, ${x2} ${y2 - 58}, ${x2} ${y2}`;
  }
  return (
    <div className="card zone" style={{ "--zt": ZONE_TINTS[lv.n] || "#fff" } as React.CSSProperties}>
      <div className="zone-head">
        <span className="lv-emoji">{lv.emoji}</span>
        <div>
          <div className="lv-name">Level {lv.n}: {lv.name}</div>
          <div className="lv-sub">{lv.sub}</div>
        </div>
        <span className="chip">{doneCount}/{list.length}</span>
      </div>
      {list.length ? (
        <div className="trail" style={{ height: H }}>
          <svg width="340" height={H} viewBox={`0 0 340 ${H}`} aria-hidden="true">
            <path d={d} fill="none" stroke="#dcc9a4" strokeWidth={7} strokeLinecap="round" strokeDasharray="1 15" />
          </svg>
          {list.map((les, i) => {
            const p = state.progress[les.id];
            const isDone = p?.done, locked = !canOpen(state, les), cur = les.id === curId;
            const [x, y] = pts[i];
            return (
              <div key={les.id}>
                <div className={`node ${isDone ? "done" : ""} ${locked ? "locked" : ""} ${cur ? "current" : ""}`} style={{ left: x, top: y }} onClick={() => openLesson(les.id)}>
                  {isDone ? "✓" : locked ? "🔒" : i + 1}
                </div>
                <div className="nlabel" style={{ left: x, top: y + 38 }}>
                  {les.title}
                  <small>{les.free ? "Miễn phí" : "Premium"}</small>
                </div>
                {cur && <img className="maple-here" src={`${GEN}mascot-wave.png`} alt="" style={{ left: x, top: y - 98 }} />}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ color: "var(--muted)", fontSize: ".85rem", marginTop: 8 }}>Đang cập nhật bài học…</div>
      )}
    </div>
  );
}

/* ==================== LIBRARY ==================== */
function Library({ state, lessons, openLesson }: { state: AppState; lessons: Lesson[]; openLesson: (id: string) => void }) {
  const [lv, setLv] = useState("");
  const [sk, setSk] = useState("");
  const [ac, setAc] = useState("");
  const [du, setDu] = useState("");
  const list = lessons.filter(
    (l) =>
      (!lv || String(l.level) === lv) &&
      (!sk || l.skill === sk) &&
      (!ac || l.accent === ac) &&
      (!du || (du === "short" && l.dur < 60) || (du === "mid" && l.dur >= 60 && l.dur <= 180) || (du === "long" && l.dur > 180))
  );
  return (
    <section className="view">
      <div className="section-title"><h2>📚 Thư viện khám phá</h2></div>
      <div className="filters">
        <select value={lv} onChange={(e) => setLv(e.target.value)}>
          <option value="">Mọi cấp độ</option>
          {LEVELS.map((l) => <option key={l.n} value={l.n}>Level {l.n}: {l.name}</option>)}
        </select>
        <select value={sk} onChange={(e) => setSk(e.target.value)}>
          <option value="">Mọi kỹ năng</option>
          <option>Nghe</option><option>Nói</option><option>Từ vựng</option>
        </select>
        <select value={ac} onChange={(e) => setAc(e.target.value)}>
          <option value="">Mọi giọng</option>
          <option value="US">Anh-Mỹ</option><option value="CA">Anh-Canada</option>
        </select>
        <select value={du} onChange={(e) => setDu(e.target.value)}>
          <option value="">Mọi thời lượng</option>
          <option value="short">Dưới 1 phút</option><option value="mid">1–3 phút</option><option value="long">Trên 3 phút</option>
        </select>
      </div>
      <div className="grid">
        {list.length ? list.map((l) => <LessonCard key={l.id} les={l} state={state} onOpen={openLesson} />) : <p style={{ color: "var(--muted)" }}>Không có bài nào khớp bộ lọc.</p>}
      </div>
    </section>
  );
}

/* ==================== ACHIEVEMENTS ==================== */
function Achievements({ state, lessons, stars, done }: { state: AppState; lessons: Lesson[]; stars: number; done: number }) {
  const statTiles: [string, number, string][] = [
    ["🔥", state.streak, "ngày streak"],
    ["⏱️", state.minutes, "phút luyện"],
    ["✅", done, "bài xong"],
    ["📖", totalLearned(state), "câu đã thuộc"],
  ];
  return (
    <section className="view">
      <div className="section-title"><h2>🏆 Thành tích của mình</h2></div>
      <div className="statgrid">
        {statTiles.map(([i, n, l]) => (
          <div key={l} className="card stat"><div className="n">{i} {n}</div><div className="l">{l}</div></div>
        ))}
      </div>
      <div className="section-title"><h2>🎖️ Huy hiệu</h2></div>
      <div className="badges">
        {BADGES.map((b) => (
          <div key={b.img} className={`medal ${b.has(state, lessons) ? "on" : ""}`}>
            <img className="bic" src={`${BDG}${b.img}`} alt="" />
            <div className="nm">{b.nm}</div>
          </div>
        ))}
      </div>
      <div className="section-title"><h2>🗺️ Bản đồ cấp độ</h2></div>
      <div className="card" style={{ padding: 14 }}>
        {LEVELS.map((lv) => {
          const list = lessons.filter((l) => l.level === lv.n);
          const dc = list.filter((l) => state.progress[l.id]?.done).length;
          return (
            <div key={lv.n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
              <span style={{ fontSize: 22 }}>{lv.emoji}</span>
              <div style={{ flex: 1 }}>
                <b>Level {lv.n}: {lv.name}</b>
                <div className="goalbar"><i style={{ width: `${list.length ? (dc / list.length) * 100 : 0}%` }} /></div>
              </div>
              <span className="chip">{dc}/{list.length}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ==================== ACCOUNT ==================== */
function Account({ state, setState }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const [name, setName] = useState(state.nickname);
  const p = state.prefs;
  return (
    <section className="view">
      <div className="section-title"><h2>👤 Hồ sơ của bé</h2></div>
      <div className="card" style={{ padding: 16 }}>
        <div className="field">
          <label>Tên / biệt danh</label>
          <input type="text" value={name} placeholder="VD: Mint" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label>Ảnh đại diện</label>
          <div className="avatarpick">
            {AVATARS.map((a) => (
              <button key={a} className={a === state.avatar ? "sel" : ""} onClick={() => setState((s) => ({ ...s, avatar: a }))}>{a}</button>
            ))}
          </div>
        </div>
        <div className="row">
          <div className="field" style={{ flex: 1 }}>
            <label>Tuổi</label>
            <select value={state.age} onChange={(e) => setState((s) => ({ ...s, age: +e.target.value }))}>
              {[8, 9, 10, 11, 12, 13].map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Trình độ</label>
            <select value={state.level} onChange={(e) => setState((s) => ({ ...s, level: +e.target.value }))}>
              <option value={1}>Mới bắt đầu</option>
              <option value={2}>Khá</option>
              <option value={3}>Tốt</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label>Giọng đọc mong muốn</label>
          <select value={p.accent} onChange={(e) => setState((s) => ({ ...s, prefs: { ...s.prefs, accent: e.target.value as "US" | "CA" } }))}>
            <option value="US">Anh-Mỹ</option>
            <option value="CA">Anh-Canada</option>
          </select>
        </div>
        <div className="row">
          <label className={`toggle ${p.ipa ? "on" : ""}`}>
            <input type="checkbox" checked={p.ipa} onChange={(e) => setState((s) => ({ ...s, prefs: { ...s.prefs, ipa: e.target.checked } }))} /> Hiện IPA
          </label>
          <label className={`toggle ${p.vi ? "on" : ""}`}>
            <input type="checkbox" checked={p.vi} onChange={(e) => setState((s) => ({ ...s, prefs: { ...s.prefs, vi: e.target.checked } }))} /> Hiện nghĩa tiếng Việt
          </label>
          <label className={`toggle ${p.motion !== false ? "on" : ""}`}>
            <input type="checkbox" checked={p.motion !== false} onChange={(e) => setState((s) => ({ ...s, prefs: { ...s.prefs, motion: e.target.checked } }))} /> Hiệu ứng chuyển động
          </label>
        </div>
        <button className="btn" style={{ marginTop: 12 }} onClick={() => { setState((s) => ({ ...s, nickname: name.trim() })); alert("Đã lưu hồ sơ!"); }}>Lưu hồ sơ</button>
      </div>

      <div className="section-title"><h2>💎 Gói thành viên</h2></div>
      <div>
        {PLANS.map((pl) => (
          <div key={pl.id} className={`card plan ${pl.id === state.membership ? "current" : ""}`}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <span className="pname">{pl.name}</span>
              <span className="price">{pl.price}</span>
            </div>
            <ul>{pl.feats.map((f) => <li key={f}>{f}</li>)}</ul>
            {pl.id === state.membership ? (
              <div className="chip" style={{ marginTop: 10 }}>Đang dùng</div>
            ) : (
              <button className={`btn ${pl.id === "free" ? "ghost" : "accent"} sm`} style={{ marginTop: 10 }} onClick={() => { setState((s) => ({ ...s, membership: pl.id })); alert(pl.id === "free" ? "Đã chuyển về gói Miễn phí." : "🎉 Đã mở khoá " + pl.id + "! (demo)"); }}>
                {pl.id === "free" ? "Chuyển về Miễn phí" : "Nâng cấp"}
              </button>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontSize: ".78rem", color: "var(--muted)", textAlign: "center" }}>Đây là bản demo — nút nâng cấp chỉ mô phỏng, chưa thanh toán thật.</p>
    </section>
  );
}
