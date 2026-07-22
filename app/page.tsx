"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  allLessons, lessonById, type Lesson,
} from "@/lib/data";
import {
  type AppState, defaultState, loadState, saveState, totalStars, lessonsDone,
  isPremium, canOpen, touchStreak, resetDailyIfNeeded, todayStr, totalLearned,
  awardCompletion, recordGame, hasSticker, gamesDone, addSticker,
  completeLearnLesson, learnLessonDone, lessonPct, learnLessonsDone,
  markGameSeen, recordBest,
} from "@/lib/state";
import {
  WORLDS, GAMES, STICKERS, stickerById,
  type World, type Stop, type StopKind, type GameKind,
} from "@/lib/games";
import { SECTIONS, learnLessonById } from "@/lib/learn";
import { GamePlay } from "./games";
import { Learn } from "./learn";
import { speak, celebrate, shuffle } from "@/lib/fx";

const BDG = "/assets/images/badges/";
const GEN = "/assets/images/gen/";
const STK = "/assets/images/stickers/";

// Ảnh sticker thật; nếu thiếu file thì fallback về emoji
function StickerArt({ id, emoji }: { id: string; emoji: string }) {
  const [err, setErr] = useState(false);
  return err ? <span className="sticker-emoji">{emoji}</span>
    : <img className="sticker-img" src={`${STK}${id}.webp`} alt="" onError={() => setErr(true)} />;
}

const BADGES: { img: string; nm: string; has: (s: AppState, ls: Lesson[]) => boolean }[] = [
  { img: "badge-star.webp", nm: "Bài đầu tiên", has: (s) => lessonsDone(s) >= 1 },
  { img: "badge-streak.webp", nm: "3 ngày liên tiếp", has: (s) => s.streak >= 3 },
  { img: "badge-speaking.webp", nm: "Chơi 3 game", has: (s) => gamesDone(s) >= 3 },
  { img: "badge-pronunciation.webp", nm: "Thuộc 15 câu", has: (s) => totalLearned(s) >= 15 },
  { img: "badge-listening.webp", nm: "Chăm nghe", has: (s) => lessonsDone(s) >= 3 },
  { img: "badge-trophy.webp", nm: "10 sao", has: (s) => totalStars(s) >= 10 },
  { img: "badge-explorer.webp", nm: "Nhà khám phá", has: (s) => gamesDone(s) >= 5 },
  { img: "badge-vancouver.webp", nm: "Đủ 5 sticker", has: (s) => (s.stickers || []).length >= 5 },
];

const AVATARS = ["🦊", "🐰", "🐼", "🦉", "🐨", "🦫", "🐬", "🦄", "🐧", "🐝"];
const PLANS: { id: AppState["membership"]; name: string; price: string; feats: string[] }[] = [
  { id: "free", name: "Miễn phí", price: "0₫", feats: ["Thế giới đầu tiên", "Vài game mỗi ngày", "Bộ sưu tập cơ bản"] },
  { id: "premium", name: "Premium", price: "99k/tháng", feats: ["Tất cả thế giới phiêu lưu", "Toàn bộ game & câu đố", "Không giới hạn luyện nói", "Nội dung mới hằng tuần"] },
  { id: "family", name: "Family", price: "149k/tháng", feats: ["2–4 hồ sơ trẻ em", "Tiến độ riêng từng bé", "Phụ huynh xem báo cáo", "Tất cả quyền lợi Premium"] },
];

type View = "home" | "learn" | "adventure" | "games" | "collection";
type Launch = { kind: StopKind; refId?: string; recId: string; sticker?: string; title: string };
type Reward = { title: string; html: string; stars?: number; sticker?: { id: string; emoji: string; name: string } | null };

const NAV: [View, string, string][] = [
  ["home", "🏠", "Trang chủ"],
  ["learn", "📖", "Học"],
  ["adventure", "🗺️", "Phiêu lưu"],
  ["games", "🎮", "Trò chơi"],
  ["collection", "🎁", "Bộ sưu tập"],
];

export default function App() {
  const [state, setState] = useState<AppState>(defaultState);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("home");
  const [studio, setStudio] = useState<Lesson | null>(null);
  const [game, setGame] = useState<Launch | null>(null);
  const [upsell, setUpsell] = useState(false);
  const [account, setAccount] = useState(false);
  const [menu, setMenu] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const [showSplash, setShowSplash] = useState(false);
  const lessons = useMemo(() => (ready ? allLessons() : []), [ready]);

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
  useEffect(() => { if (ready) saveState(state); }, [state, ready]);
  useEffect(() => { document.body.classList.toggle("no-motion", state.prefs.motion === false); }, [state.prefs.motion]);

  const stars = totalStars(state);
  const stopDone = (id: string) => !!state.progress["g:" + id]?.done;

  function openLesson(id: string) {
    const les = lessonById(id);
    if (!les) return;
    if (!canOpen(state, les)) { setUpsell(true); return; }
    if (!les.lines.length) { alert("Bài này đang được biên soạn, sắp ra mắt! 🛠️"); return; }
    setState((s) => ({ ...s, lastLesson: id }));
    setStudio(les);
  }
  function launch(l: Launch) { setGame(l); }
  function launchStop(st: Stop, world: World) {
    if (!world.ready) return;
    if (!isPremium(state) && world.id !== "everyday-town") { setUpsell(true); return; }
    if (st.kind === "shadow") { if (st.ref) openLesson(st.ref); return; }
    launch({ kind: st.kind, refId: st.ref, recId: st.id, sticker: st.sticker, title: st.label });
  }
  function finishGame(starsWon: number) {
    if (!game) return;
    const firstSticker = game.sticker && !hasSticker(state, game.sticker);
    const { state: ns } = recordGame(state, game.recId, starsWon, game.sticker);
    setState(ns);
    setGame(null);
    const sk = firstSticker && game.sticker ? stickerById(game.sticker) : null;
    setReward({
      title: starsWon >= 3 ? "Xuất sắc! 🌟" : starsWon >= 2 ? "Làm tốt lắm! 👍" : "Cố lên nhé! 💪",
      html: `Bạn nhận <b>+${starsWon} ⭐</b>!`,
      stars: starsWon,
      sticker: sk ? { id: sk.id, emoji: sk.emoji, name: sk.name } : null,
    });
  }

  // Shadowing (Studio) helpers
  function toggleLearned(id: string, i: number) {
    setState((s) => {
      const cur = s.progress[id]?.learned || [];
      const learned = cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i];
      const prev = s.progress[id] || { done: false, stars: 0, learned: [] };
      return { ...s, progress: { ...s.progress, [id]: { ...prev, learned } } };
    });
  }
  function completeLesson(id: string, starsWon: number, title: string, html: string) {
    const { state: ns, newly } = awardCompletion(state, id, starsWon);
    setState(ns);
    celebrate(state.prefs.motion !== false);
    setReward({ title, html: newly ? html : "Bạn đã hoàn thành bài này rồi. Ôn lại luôn tốt nhé!", stars: starsWon });
  }
  // Hoàn thành bài Learn (sau Mini Check)
  function completeLearn(lessonId: string, score: number, total: number) {
    const firstMap = !hasSticker(state, "st-map");
    let { state: ns } = completeLearnLesson(state, lessonId, score, total);
    if (firstMap) ns = addSticker(ns, "st-map");
    setState(ns);
    celebrate(state.prefs.motion !== false);
    const les = learnLessonById(lessonId);
    const sk = firstMap ? stickerById("st-map") : null;
    const stars = score >= total ? 3 : score >= total - 1 ? 2 : 1;
    setReward({
      title: score >= total ? "Xuất sắc! 🌟" : score >= total - 1 ? "Làm tốt lắm! 👍" : "Cố lên nhé! 💪",
      html: `Bạn hoàn thành bài <b>${les?.title || ""}</b> — đúng <b>${score}/${total}</b> ở Kiểm tra nhỏ!<br>Giờ sang Phiêu lưu để dùng thử nhé.`,
      stars,
      sticker: sk ? { id: sk.id, emoji: sk.emoji, name: sk.name } : null,
    });
  }

  if (!ready) return <div style={{ padding: 40, color: "#7a8194" }}>Đang tải…</div>;

  return (
    <div id="app">
      <header className={`hud ${view === "home" ? "on-scene" : ""}`}>
        <button className="hud-avatar" onClick={() => setMenu((m) => !m)} aria-label="Tài khoản">{state.avatar}</button>
        <div className="hud-tokens">
          <span className="wtag fire">🔥 {state.streak}</span>
          <span className="wtag star">⭐ {stars}</span>
        </div>
        {menu && (
          <>
            <div className="menu-back" onClick={() => setMenu(false)} />
            <div className="avatar-menu">
              <button onClick={() => { setMenu(false); setAccount(true); }}>👤 Hồ sơ của bé</button>
              <button onClick={() => { setMenu(false); setAccount(true); }}>💎 Gói thành viên</button>
              <button onClick={() => { setMenu(false); setAccount(true); }}>⚙️ Cài đặt</button>
            </div>
          </>
        )}
      </header>

      <div className={`wrap ${view === "home" || view === "adventure" ? "wide" : ""}`}>
        {view === "home" && <Home state={state} stopDone={stopDone} setView={setView} />}
        {view === "learn" && <Learn state={state} setState={setState}
          onEcho={() => launch({ kind: "echo", recId: "quick-echo", sticker: "st-mic", title: "Echo" })}
          onTalk={() => launch({ kind: "talk", refId: "park", recId: "quick-talk", title: "Picture Talk" })}
          openLesson={openLesson} onComplete={completeLearn} />}
        {view === "adventure" && <Adventure state={state} stopDone={stopDone} launchStop={launchStop} onLearn={() => setView("learn")} />}
        {view === "games" && <GamesHub launch={(kind) => launch({ kind, refId: undefined, recId: "quick-" + kind, title: "Trò chơi" })} />}
        {view === "collection" && <Collection state={state} lessons={lessons} stars={stars} />}
      </div>

      <nav className="nav">
        {NAV.map(([v, i, label]) => (
          <button key={v} className={view === v ? "on" : ""} onClick={() => setView(v)}>
            <span className="i">{i}</span>{label}
          </button>
        ))}
      </nav>

      {/* Splash */}
      {showSplash && (
        <div id="splash">
          {state.prefs.motion !== false && Array.from({ length: 7 }, (_, i) => (
            <span key={i} className="leaf" style={{ left: `${6 + i * 14}%`, animationDuration: `${2 + (i % 3) * 0.7}s`, animationDelay: `${i * 0.22}s` }}>🍁</span>
          ))}
          <div className="sp-banner">
            <div className="sp-card">
              <div className="sp-title">Chào {state.nickname || "bạn nhỏ"}! 👋</div>
              <div className="sp-goal">🎯 Nhiệm vụ hôm nay đang chờ bạn!</div>
              <button className="btn" onClick={() => setShowSplash(false)}>▶ Bắt đầu phiêu lưu</button>
            </div>
          </div>
        </div>
      )}

      {upsell && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setUpsell(false)}>
          <div className="box">
            <img src={`${GEN}mascot-book.webp`} style={{ width: 110, height: 110, objectFit: "contain" }} alt="" />
            <h3>Nội dung Premium 🔒</h3>
            <p style={{ color: "var(--muted)" }}>Mở khoá tất cả thế giới phiêu lưu, game và câu đố với gói Premium.</p>
            <button className="btn accent" onClick={() => { setUpsell(false); setAccount(true); }}>Xem gói thành viên</button>
            <div><button className="btn ghost sm" style={{ marginTop: 8 }} onClick={() => setUpsell(false)}>Để sau</button></div>
          </div>
        </div>
      )}

      {game && <GamePlay kind={game.kind} refId={game.refId} accent={state.prefs.accent}
        seen={state.games.seen}
        onSeen={(key, ids) => setState((s) => markGameSeen(s, key, ids))}
        onBest={(score) => setState((s) => recordBest(s, game.kind, score))}
        onExit={() => setGame(null)} onFinish={finishGame} />}

      {studio && (
        <Studio key={studio.id} lesson={studio} prefs={state.prefs}
          done={!!state.progress[studio.id]?.done} learned={state.progress[studio.id]?.learned || []}
          onToggleLearned={(i) => toggleLearned(studio.id, i)}
          onComplete={(st, t, h) => completeLesson(studio.id, st, t, h)} onClose={() => setStudio(null)} />
      )}

      {account && <AccountPanel state={state} setState={setState} onClose={() => setAccount(false)} />}

      {reward && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setReward(null)}>
          <div className="box">
            {reward.sticker ? (
              <div className="reward-sticker"><StickerArt id={reward.sticker.id} emoji={reward.sticker.emoji} /></div>
            ) : (
              <img className="reward-maple" src={`${GEN}${(reward.stars ?? 3) >= 2 ? "maple-pose-cheer" : "maple-pose-think"}.webp`} alt="" />
            )}
            <h3>{reward.title}</h3>
            {typeof reward.stars === "number" && <div className="gr-stars sm">{"⭐".repeat(reward.stars)}{"☆".repeat(3 - reward.stars)}</div>}
            <p style={{ color: "var(--muted)" }} dangerouslySetInnerHTML={{ __html: reward.html }} />
            {reward.sticker && <p className="reward-newsticker">🎁 Sticker mới: <b>{reward.sticker.name}</b>!</p>}
            <button className="btn green" onClick={() => setReward(null)}>Tuyệt vời!</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== Helpers dùng chung ==================== */
const KIND_EMOJI: Record<StopKind, string> = { picdet: "🔎", puzzle: "🧩", riddle: "🦉", talk: "💬", echo: "🎤", shadow: "🎬" };
// scenery theme cho mỗi thế giới (đổi phong cảnh nhưng nối liền thành 1 hành trình)
const WORLD_THEME: Record<string, string> = {
  "everyday-town": "town", school: "school", forest: "forest",
  vancouver: "coast", story: "library", space: "space",
};

/* ==================== HOME — hai hành trình rõ ràng ==================== */
function Home({ state, stopDone, setView }: {
  state: AppState; stopDone: (id: string) => boolean; setView: (v: View) => void;
}) {
  const world = WORLDS[0]; // Everyday Town
  const doneCount = world.stops.filter((s) => stopDone(s.id)).length;
  const name = state.nickname || "bạn nhỏ";
  const lesson = learnLessonById(state.learn.currentLesson);
  const lpct = lesson ? lessonPct(state, lesson.id, SECTIONS.length) : 0;
  const learnFinished = lesson ? learnLessonDone(state, lesson.id) : false;
  const goal = 3;
  const dpct = Math.min(100, Math.round((state.dailyDone / goal) * 100));

  return (
    <section className="home">
      {/* --- Cảnh chào đón: hai hành động rõ ràng --- */}
      <div className="arrival fullbleed">
        <div className="arrival-copy">
          <div className="hello-sign">Chào {name}! <span className="hs-wave">👋</span></div>
          <p className="arrival-line">Hôm nay học một bài mới, rồi mang kiến thức đi phiêu lưu nhé!</p>
          <div className="home-cta">
            <button className="quest-btn" onClick={() => setView("learn")}>📖 Học bài hôm nay</button>
            <button className="quest-btn ghost2" onClick={() => setView("adventure")}>🗺️ Tiếp tục phiêu lưu</button>
          </div>
        </div>
        <div className="arrival-flag" aria-hidden="true">
          <span className="flag-emoji">🔥</span>
          <span className="flag-txt">{state.streak} ngày</span>
        </div>
      </div>

      {/* --- Hai hành trình --- */}
      <h2 className="chapter">Hai hành trình của bạn</h2>
      <div className="journeys">
        <button className="journey learn-j" onClick={() => setView("learn")}>
          <span className="j-ic">📖</span>
          <span className="j-body">
            <span className="j-k">Học · {lesson ? lesson.title : "Bài học"}</span>
            <span className="j-t">{learnFinished ? "Đã học xong — ôn lại nhé!" : lpct > 0 ? "Học tiếp bài đang dở" : "Bắt đầu bài hôm nay"}</span>
            <span className="j-bar"><i style={{ width: `${learnFinished ? 100 : lpct}%` }} /></span>
          </span>
          <span className="cp-go">▶</span>
        </button>
        <button className="journey adv-j" onClick={() => setView("adventure")}>
          <span className="j-ic">🗺️</span>
          <span className="j-body">
            <span className="j-k">Phiêu lưu · {world.name}</span>
            <span className="j-t">Áp dụng tiếng Anh vào nhiệm vụ</span>
            <span className="j-bar"><i style={{ width: `${(doneCount / world.stops.length) * 100}%` }} /></span>
          </span>
          <span className="j-badge">{doneCount}/{world.stops.length}</span>
        </button>
      </div>

      {/* --- Tiến độ hôm nay (nhỏ gọn) --- */}
      <div className="today-mini">
        <span className="tm-ic">🎯</span>
        <span className="tm-txt">{state.dailyDone >= goal ? "Hoàn thành mục tiêu hôm nay! 🎉" : `Hôm nay: ${state.dailyDone}/${goal} hoạt động`}</span>
        <span className="tm-bar"><i style={{ width: `${dpct}%` }} /></span>
      </div>
    </section>
  );
}

/* ==================== ADVENTURE — một bản đồ cuộn dọc liên tục ==================== */
function Adventure({ state, stopDone, launchStop, onLearn }: {
  state: AppState; stopDone: (id: string) => boolean; launchStop: (st: Stop, w: World) => void; onLearn: () => void;
}) {
  return (
    <section className="worldmap">
      <div className="wm-intro">
        <h2 className="chapter light">Bản đồ phiêu lưu</h2>
        <p className="wm-sub">Đi theo con đường, mở từng vùng đất mới cùng Maple.</p>
      </div>
      {WORLDS.map((w) => (
        <Region key={w.id} world={w} state={state} stopDone={stopDone} launchStop={launchStop} onLearn={onLearn} />
      ))}
      <div className="wm-end"><span>🏁</span>Còn nhiều vùng đất mới đang được vẽ…</div>
    </section>
  );
}

function Region({ world, state, stopDone, launchStop, onLearn }: {
  world: World; state: AppState; stopDone: (id: string) => boolean; launchStop: (st: Stop, w: World) => void; onLearn: () => void;
}) {
  const theme = WORLD_THEME[world.id] || "town";
  const dc = world.stops.filter((s) => stopDone(s.id)).length;
  // Gợi ý học bài liên kết (không khoá cứng): Everyday Town luyện bài "At the Park"
  const linkedLesson = world.id === "everyday-town" ? learnLessonById("park") : undefined;
  const lessonReady = linkedLesson ? learnLessonDone(state, linkedLesson.id) : true;
  return (
    <div className={`region theme-${theme} ${world.ready ? "" : "locked"}`}>
      <div className="region-horizon" aria-hidden="true" />
      <div className="region-head">
        <span className="signpost">{world.emoji}</span>
        <div className="region-name">{world.name}<small>{world.vi} · {world.sub}</small></div>
        {world.ready
          ? <span className="region-flag open">{dc}/{world.stops.length} ⭐</span>
          : <span className="region-flag">🔒 Sắp mở</span>}
      </div>
      {world.ready && linkedLesson && (
        lessonReady
          ? <div className="learn-link ok" aria-hidden="true">📘 Luyện bài <b>{linkedLesson.title}</b> — bạn đã học rồi, chơi thôi!</div>
          : <div className="learn-link">
              <span>📘 Vùng này luyện bài <b>{linkedLesson.title}</b>.</span>
              <button className="btn sm" onClick={onLearn}>Học trước cho chắc</button>
            </div>
      )}
      {world.ready
        ? <WorldTrail world={world} state={state} stopDone={stopDone} launchStop={launchStop} />
        : <div className="road-seg" aria-hidden="true"><span className="road-lock">🔒</span></div>}
    </div>
  );
}

function WorldTrail({ world, state, stopDone, launchStop }: {
  world: World; state: AppState; stopDone: (id: string) => boolean; launchStop: (st: Stop, w: World) => void;
}) {
  const XC = 170, AMP = 92, GAP = 122;
  const pts = world.stops.map((_, i) => [i === 0 ? XC : i % 2 ? XC + AMP : XC - AMP, 56 + i * GAP] as [number, number]);
  const H = world.stops.length ? 56 + (world.stops.length - 1) * GAP + 92 : 0;
  let d = pts.length ? `M ${pts[0][0]} ${pts[0][1]}` : "";
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1], [x2, y2] = pts[i];
    d += ` C ${x1} ${y1 + 60}, ${x2} ${y2 - 60}, ${x2} ${y2}`;
  }
  const nextIdx = world.stops.findIndex((s) => !stopDone(s.id));
  return (
    <div className="trail" style={{ height: H }}>
      <svg width="340" height={H} viewBox={`0 0 340 ${H}`} aria-hidden="true">
        <path d={d} fill="none" stroke="rgba(255,255,255,.85)" strokeWidth={10} strokeLinecap="round" />
        <path d={d} fill="none" stroke="#caa96f" strokeWidth={6} strokeLinecap="round" strokeDasharray="2 16" />
      </svg>
      {world.stops.map((st, i) => {
        const done = stopDone(st.id), cur = i === nextIdx;
        const [x, y] = pts[i];
        return (
          <div key={st.id}>
            <button className={`node ${done ? "done" : ""} ${cur ? "current" : ""}`} style={{ left: x, top: y }}
              onClick={() => launchStop(st, world)} aria-label={st.label}>
              {done ? "✓" : KIND_EMOJI[st.kind]}
            </button>
            <div className="nlabel" style={{ left: x, top: y + 40 }}>{st.label}<small>{st.vi}</small></div>
            {cur && <img className="maple-here" src={`${GEN}mascot-wave.webp`} alt="" style={{ left: x, top: y - 100 }} />}
          </div>
        );
      })}
    </div>
  );
}

/* ==================== GAMES — sân chơi bất đối xứng ==================== */
function GamesHub({ launch }: { launch: (kind: GameKind) => void }) {
  const feat = GAMES[0];
  const rest = GAMES.slice(1);
  return (
    <section className="playground">
      <h2 className="chapter">Sân chơi của Maple</h2>
      <p className="pg-sub">Chọn một trò chơi để luyện tiếng Anh thật vui!</p>

      <button className={`portal featured theme-g-${feat.id}`} onClick={() => launch(feat.id)}>
        <span className="portal-scene" aria-hidden="true">{feat.image ? <img src={feat.image} alt="" /> : <span className="portal-obj">{feat.emoji}</span>}</span>
        <span className="portal-copy">
          <span className="po-name">{feat.name}</span>
          <span className="po-vi">{feat.vi}</span>
          <span className="po-blurb">{feat.blurb}</span>
          <span className="po-go">Vào chơi ▶</span>
        </span>
      </button>

      <div className="portal-row">
        {rest.map((g, i) => (
          <button key={g.id} className={`portal small theme-g-${g.id} pos-${i}`} onClick={() => launch(g.id)}>
            {g.image ? <span className="portal-thumb"><img src={g.image} alt="" /></span> : <span className="portal-obj">{g.emoji}</span>}
            <span className="po-name sm">{g.vi}</span>
            <span className="po-en">{g.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ==================== COLLECTION — sổ tay sticker & kệ huy hiệu ==================== */
function Collection({ state, lessons, stars }: { state: AppState; lessons: Lesson[]; stars: number }) {
  const got = new Set(state.stickers || []);
  const stamps: [string, number, string][] = [
    ["🔥", state.streak, "ngày"],
    ["⭐", stars, "sao"],
    ["📖", learnLessonsDone(state), "bài học"],
    ["🎮", gamesDone(state), "game"],
  ];
  return (
    <section className="journal">
      <div className="journal-head">
        <img className="journal-maple" src={`${GEN}mascot-book.webp`} alt="" />
        <div>
          <h2 className="chapter">Sổ tay phiêu lưu</h2>
          <p className="journal-sub">Sticker & huy hiệu bạn sưu tầm được cùng Maple</p>
        </div>
      </div>

      <div className="sticker-page">
        <div className="sp-title">Sticker · {got.size}/{STICKERS.length}</div>
        <div className="sticker-slots">
          {STICKERS.map((s) => (
            <div key={s.id} className={`slot ${got.has(s.id) ? "filled" : ""}`}>
              <span className="slot-art">{got.has(s.id) ? <StickerArt id={s.id} emoji={s.emoji} /> : "?"}</span>
              <span className="slot-name">{got.has(s.id) ? s.name : "Chưa mở"}</span>
            </div>
          ))}
        </div>
        <div className="stamps">
          {stamps.map(([ic, n, l]) => (
            <span key={l} className="stamp"><b>{ic} {n}</b>{l}</span>
          ))}
        </div>
      </div>

      <div className="shelf">
        <div className="shelf-title">Huy hiệu</div>
        <div className="shelf-row">
          {BADGES.map((b) => (
            <div key={b.img} className={`trophy ${b.has(state, lessons) ? "on" : ""}`}>
              <img src={`${BDG}${b.img}`} alt="" />
              <span>{b.nm}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================== ACCOUNT PANEL (từ avatar) ==================== */
function AccountPanel({ state, setState, onClose }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; onClose: () => void }) {
  const [name, setName] = useState(state.nickname);
  const p = state.prefs;
  return (
    <div id="account-panel" className="game-overlay">
      <div className="game-top"><button className="bk" onClick={onClose}>← Đóng</button><h3>👤 Tài khoản</h3></div>
      <div className="game-body">
        <div className="section-title"><h2>Hồ sơ của bé</h2></div>
        <div className="card" style={{ padding: 16 }}>
          <div className="field"><label>Tên / biệt danh</label><input type="text" value={name} placeholder="VD: Mint" onChange={(e) => setName(e.target.value)} /></div>
          <div className="field">
            <label>Ảnh đại diện</label>
            <div className="avatarpick">{AVATARS.map((a) => <button key={a} className={a === state.avatar ? "sel" : ""} onClick={() => setState((s) => ({ ...s, avatar: a }))}>{a}</button>)}</div>
          </div>
          <div className="row">
            <div className="field" style={{ flex: 1 }}><label>Tuổi</label>
              <select value={state.age} onChange={(e) => setState((s) => ({ ...s, age: +e.target.value }))}>{[8, 9, 10, 11, 12, 13].map((a) => <option key={a}>{a}</option>)}</select>
            </div>
            <div className="field" style={{ flex: 1 }}><label>Giọng đọc</label>
              <select value={p.accent} onChange={(e) => setState((s) => ({ ...s, prefs: { ...s.prefs, accent: e.target.value as "US" | "CA" } }))}>
                <option value="US">Anh-Mỹ</option><option value="CA">Anh-Canada</option>
              </select>
            </div>
          </div>
          <div className="row">
            <label className={`toggle ${p.motion !== false ? "on" : ""}`}>
              <input type="checkbox" checked={p.motion !== false} onChange={(e) => setState((s) => ({ ...s, prefs: { ...s.prefs, motion: e.target.checked } }))} /> Hiệu ứng chuyển động
            </label>
          </div>
          <button className="btn" style={{ marginTop: 12 }} onClick={() => { setState((s) => ({ ...s, nickname: name.trim() })); alert("Đã lưu hồ sơ!"); }}>Lưu hồ sơ</button>
        </div>

        <div className="section-title"><h2>💎 Gói thành viên</h2></div>
        {PLANS.map((pl) => (
          <div key={pl.id} className={`card plan ${pl.id === state.membership ? "current" : ""}`}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}><span className="pname">{pl.name}</span><span className="price">{pl.price}</span></div>
            <ul>{pl.feats.map((f) => <li key={f}>{f}</li>)}</ul>
            {pl.id === state.membership ? <div className="chip" style={{ marginTop: 10 }}>Đang dùng</div> : (
              <button className={`btn ${pl.id === "free" ? "ghost" : "accent"} sm`} style={{ marginTop: 10 }} onClick={() => { setState((s) => ({ ...s, membership: pl.id })); alert(pl.id === "free" ? "Đã chuyển về gói Miễn phí." : "🎉 Đã mở khoá " + pl.id + "! (demo)"); }}>
                {pl.id === "free" ? "Chuyển về Miễn phí" : "Nâng cấp"}
              </button>
            )}
          </div>
        ))}
        <p style={{ fontSize: ".78rem", color: "var(--muted)", textAlign: "center" }}>Đây là bản demo — nút nâng cấp chỉ mô phỏng, chưa thanh toán thật.</p>
      </div>
    </div>
  );
}

/* ==================== YouTube + Studio (Shadowing) ==================== */
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
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(window.YT); };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return ytPromise;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function Studio({ lesson, prefs, done, learned, onToggleLearned, onComplete, onClose }: {
  lesson: Lesson; prefs: { ipa: boolean; vi: boolean; accent: "US" | "CA" }; done: boolean; learned: number[];
  onToggleLearned: (i: number) => void; onComplete: (stars: number, title: string, html: string) => void; onClose: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const stopAtRef = useRef<number | null>(null);
  const speedRef = useRef(1);
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
              if (stopAtRef.current !== null && t >= stopAtRef.current) { p.pauseVideo(); stopAtRef.current = null; p.setPlaybackRate(speedRef.current); }
              let idx = -1;
              for (let i = 0; i < lesson.lines.length; i++) if (t >= lesson.lines[i].start && t < lesson.lines[i].end) { idx = i; break; }
              setActiveIdx((cur) => (idx !== -1 && idx !== cur ? idx : cur));
            }, 200);
          },
        },
      }) as any;
    });
    return () => { if (interval) clearInterval(interval); try { playerRef.current?.destroy(); } catch {} playerRef.current = null; host.innerHTML = ""; };
  }, [lesson.videoId, lesson.lines]);

  function playLine(i: number) {
    const ln = lesson.lines[i]; const p = playerRef.current; if (!p) return;
    p.seekTo(ln.start, true); p.setPlaybackRate(speed); p.playVideo();
    stopAtRef.current = shadowMode ? ln.end : null; setActiveIdx(i);
  }
  function slowPlay(i: number) {
    const ln = lesson.lines[i]; const p = playerRef.current; if (!p) return;
    p.seekTo(ln.start, true); p.setPlaybackRate(0.5); p.playVideo(); stopAtRef.current = ln.end; setActiveIdx(i);
  }
  function changeSpeed(v: number) { setSpeed(v); speedRef.current = v; playerRef.current?.setPlaybackRate(v); }
  function toggleShadow(on: boolean) { setShadowMode(on); if (!on) stopAtRef.current = null; }

  return (
    <div id="studio">
      <div className="st-top"><button className="bk" onClick={onClose}>← Thoát</button><h3>{lesson.title}</h3></div>
      <div className="st-wrap">
        <div className="st-layout">
          <div className="videobox" ref={hostRef} />
          <div>
            <div className="card toolbar">
              <label className={`toggle ${showIpa ? "on" : ""}`}><input type="checkbox" checked={showIpa} onChange={(e) => setShowIpa(e.target.checked)} /> Từ mới + IPA</label>
              <label className={`toggle ${showVi ? "on" : ""}`}><input type="checkbox" checked={showVi} onChange={(e) => setShowVi(e.target.checked)} /> Nghĩa</label>
              <label className={`toggle ${shadowMode ? "on" : ""}`}><input type="checkbox" checked={shadowMode} onChange={(e) => toggleShadow(e.target.checked)} /> Tự dừng cuối câu</label>
              <span className="speed">Tốc độ
                <select value={speed} onChange={(e) => changeSpeed(+e.target.value)}><option value={0.6}>0.6x</option><option value={0.8}>0.8x</option><option value={1}>1x</option><option value={1.25}>1.25x</option></select>
              </span>
            </div>
            <div className="card learn-prog">
              <div className="lp-top"><span>Đã thuộc {learned.length}/{lesson.lines.length} câu</span> 🎯</div>
              <div className="lp-bar"><i style={{ width: `${lesson.lines.length ? (learned.length / lesson.lines.length) * 100 : 0}%` }} /></div>
            </div>
            <div className="transcript">
              {lesson.lines.map((ln, i) => (
                <div key={i} className={`line ${activeIdx === i ? "active" : ""} ${learned.includes(i) ? "learned" : ""}`}>
                  <div className="en" onClick={() => playLine(i)}>{ln.en}</div>
                  {ln.words?.length ? (
                    <div className={`words ${showIpa ? "" : "hide"}`}>
                      {ln.words.map((w) => (
                        <span key={w.w} className="word" onClick={(e) => { e.stopPropagation(); speak(w.w, prefs.accent); }}><b>{w.w}</b> <span className="wipa">{w.ipa}</span> 🔊</span>
                      ))}
                    </div>
                  ) : null}
                  <div className={`vi ${showVi ? "" : "hide"}`}>{ln.vi}</div>
                  <div className="ctrls">
                    <button className="icbtn" onClick={() => playLine(i)}>🔁 Nghe</button>
                    <button className="icbtn" onClick={() => slowPlay(i)}>🐢 Nghe chậm</button>
                    <button className="icbtn learn" onClick={() => onToggleLearned(i)}>{learned.includes(i) ? "✓ Đã thuộc" : "☆ Đánh dấu thuộc"}</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="complete-bar">
              <button className="btn accent complete-btn" onClick={() => setQuizOpen(true)}>🎯 Làm quiz cuối bài</button>
              <button className="btn complete-btn" disabled={done} onClick={() => onComplete(3, "Giỏi quá! 🎉", "Bạn vừa hoàn thành bài học và nhận <b>+3 ⭐</b>!")}>
                {done ? "🎉 Đã hoàn thành!" : "✓ Mình học xong bài này!"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {quizOpen && (
        <Quiz lesson={lesson} accent={prefs.accent} onClose={() => setQuizOpen(false)}
          onFinish={(score, total) => {
            const pct = Math.round((score / total) * 100);
            const st = pct >= 80 ? 3 : pct >= 50 ? 2 : 1;
            setQuizOpen(false);
            onComplete(st, pct >= 80 ? "Xuất sắc! 🌟" : pct >= 50 ? "Làm tốt lắm! 👍" : "Cố lên nhé! 💪", `Bạn trả lời đúng <b>${score}/${total}</b> câu (${pct}%).<br>Nhận <b>+${st} ⭐</b>!`);
          }} />
      )}
    </div>
  );
}

/* ==================== QUIZ ==================== */
type Qz = { type: string; q?: string; prompt?: string; sub?: string; speak?: string; options: string[]; answer: string };
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
  shuffle(wordVis).slice(0, 2).forEach((w) => { if (new Set(wordVis.map((x) => x.vi)).size >= 2) Q.push({ type: "Ghép nghĩa", q: `“${w.w}” nghĩa là gì?`, sub: w.ipa, options: choices(w.vi, wordVis.map((x) => x.vi)), answer: w.vi }); });
  shuffle(wordNames).slice(0, 2).forEach((w) => { if (wordNames.length >= 2) Q.push({ type: "Nghe & chọn", q: "Nghe rồi chọn từ đúng", speak: w, options: choices(w, wordNames), answer: w }); });
  shuffle(ls.filter((l) => l.words && l.words.length)).slice(0, 2).forEach((l) => {
    const key = l.words![Math.floor(Math.random() * l.words!.length)].w;
    const re = new RegExp("\\b" + key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
    if (re.test(l.en)) Q.push({ type: "Điền từ", q: "Điền từ còn thiếu vào chỗ trống", prompt: l.en.replace(re, " _____ "), options: choices(key, wordNames.length >= 2 ? wordNames : [key, "the", "a"]), answer: key });
  });
  shuffle(ls.filter((l) => l.vi)).slice(0, 2).forEach((l) => { if (new Set(sentVis).size >= 2) Q.push({ type: "Chọn nghĩa", q: "Câu này nghĩa là gì?", prompt: l.en, options: choices(l.vi!, sentVis), answer: l.vi! }); });
  return shuffle(Q).slice(0, 6);
}
function Quiz({ lesson, accent, onClose, onFinish }: { lesson: Lesson; accent: "US" | "CA"; onClose: () => void; onFinish: (score: number, total: number) => void }) {
  const [qs] = useState<Qz[]>(() => buildQuiz(lesson));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const q = qs[idx];
  useEffect(() => { if (qs.length < 2) { alert("Bài này chưa đủ nội dung để tạo quiz."); onClose(); } }, [qs.length, onClose]);
  useEffect(() => { if (q?.speak) speak(q.speak, accent); }, [q, accent]);
  if (!q) return null;
  const answered = picked !== null;
  function answer(opt: string) { if (answered) return; setPicked(opt); if (opt === q.answer) setScore((s) => s + 1); }
  function next() { if (idx + 1 < qs.length) { setIdx(idx + 1); setPicked(null); } else onFinish(score, qs.length); }
  return (
    <div id="quiz">
      <div className="quiz-top"><button className="bk" onClick={onClose}>✕</button><div className="qbar"><i style={{ width: `${(idx / qs.length) * 100}%` }} /></div><span>Câu {idx + 1}/{qs.length}</span></div>
      <div className="quiz-body">
        <div className="qcard">
          <div className="qtype">{q.type}</div>
          <div className="qtext">
            {q.speak ? <button className="btn" onClick={() => speak(q.speak!, accent)}>🔊 Nghe lại từ</button> : <>{q.q}{q.prompt && <div className="qprompt">{q.prompt}</div>}{q.sub && <div className="qsub">{q.sub}</div>}</>}
          </div>
          <div className="qhint">{q.speak ? q.q : ""}</div>
          <div className={`qopts ${answered ? "answered" : ""}`}>
            {q.options.map((o) => <button key={o} className={`qopt ${answered && o === q.answer ? "right" : ""} ${answered && o === picked && o !== q.answer ? "wrong" : ""}`} disabled={answered} onClick={() => answer(o)}>{o}</button>)}
          </div>
          {answered && <div className="qfb">{picked === q.answer ? <span className="ok">✓ Chính xác!</span> : <><span className="no">✗ Chưa đúng.</span> Đáp án: <b>{q.answer}</b></>}</div>}
          {answered && <button className="btn qnext" onClick={next}>{idx + 1 < qs.length ? "Câu tiếp →" : "Xem kết quả →"}</button>}
        </div>
      </div>
    </div>
  );
}
