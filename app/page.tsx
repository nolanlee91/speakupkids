"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  allLessons, lessonById, thumbFor, type Lesson,
} from "@/lib/data";
import {
  type AppState, defaultState, loadState, saveState, totalStars, lessonsDone,
  isPremium, canOpen, touchStreak, resetDailyIfNeeded, todayStr, totalLearned,
  awardCompletion, recordGame, hasSticker, gamesDone,
} from "@/lib/state";
import {
  WORLDS, GAMES, STICKERS, stickerById,
  type World, type Stop, type StopKind, type GameKind,
} from "@/lib/games";
import { GamePlay, FIRST_REF } from "./games";
import { speak, celebrate, shuffle } from "@/lib/fx";

const BDG = "/assets/images/badges/";
const GEN = "/assets/images/gen/";

const BADGES: { img: string; nm: string; has: (s: AppState, ls: Lesson[]) => boolean }[] = [
  { img: "badge-star.png", nm: "Bài đầu tiên", has: (s) => lessonsDone(s) >= 1 },
  { img: "badge-streak.png", nm: "3 ngày liên tiếp", has: (s) => s.streak >= 3 },
  { img: "badge-speaking.png", nm: "Chơi 3 game", has: (s) => gamesDone(s) >= 3 },
  { img: "badge-pronunciation.png", nm: "Thuộc 15 câu", has: (s) => totalLearned(s) >= 15 },
  { img: "badge-listening.png", nm: "Chăm nghe", has: (s) => lessonsDone(s) >= 3 },
  { img: "badge-trophy.png", nm: "10 sao", has: (s) => totalStars(s) >= 10 },
  { img: "badge-explorer.png", nm: "Nhà khám phá", has: (s) => gamesDone(s) >= 5 },
  { img: "badge-vancouver.png", nm: "Đủ 5 sticker", has: (s) => (s.stickers || []).length >= 5 },
];

const AVATARS = ["🦊", "🐰", "🐼", "🦉", "🐨", "🦫", "🐬", "🦄", "🐧", "🐝"];
const PLANS: { id: AppState["membership"]; name: string; price: string; feats: string[] }[] = [
  { id: "free", name: "Miễn phí", price: "0₫", feats: ["Thế giới đầu tiên", "Vài game mỗi ngày", "Bộ sưu tập cơ bản"] },
  { id: "premium", name: "Premium", price: "99k/tháng", feats: ["Tất cả thế giới phiêu lưu", "Toàn bộ game & câu đố", "Không giới hạn luyện nói", "Nội dung mới hằng tuần"] },
  { id: "family", name: "Family", price: "149k/tháng", feats: ["2–4 hồ sơ trẻ em", "Tiến độ riêng từng bé", "Phụ huynh xem báo cáo", "Tất cả quyền lợi Premium"] },
];

type View = "home" | "adventure" | "games" | "speak" | "collection";
type Launch = { kind: StopKind; refId?: string; recId: string; sticker?: string; title: string };
type Reward = { title: string; html: string; stars?: number; sticker?: { emoji: string; name: string } | null };

const NAV: [View, string, string][] = [
  ["home", "🏠", "Trang chủ"],
  ["adventure", "🗺️", "Phiêu lưu"],
  ["games", "🎮", "Trò chơi"],
  ["speak", "🎤", "Luyện nói"],
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
  const [selWorld, setSelWorld] = useState<World | null>(null);
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
      sticker: sk ? { emoji: sk.emoji, name: sk.name } : null,
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

  if (!ready) return <div style={{ padding: 40, color: "#7a8194" }}>Đang tải…</div>;

  return (
    <div id="app">
      <div className="topbar">
        <button className="avatar" onClick={() => setMenu((m) => !m)} aria-label="Tài khoản">{state.avatar}</button>
        <div className="who">
          <div className="hi">Xin chào,</div>
          <div className="nm">{state.nickname || "bạn nhỏ"}</div>
        </div>
        <span className="chip fire">🔥 {state.streak}</span>
        <span className="chip sun">⭐ {stars}</span>
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
      </div>

      <div className="wrap">
        {view === "home" && <Home state={state} stopDone={stopDone} setView={setView} launchStop={launchStop} openWorld={(w) => { setSelWorld(w); setView("adventure"); }} />}
        {view === "adventure" && <Adventure state={state} stopDone={stopDone} launchStop={launchStop} sel={selWorld} setSel={setSelWorld} />}
        {view === "games" && <GamesHub launch={(kind) => launch({ kind, refId: FIRST_REF[kind], recId: "quick-" + kind, title: "Trò chơi" })} />}
        {view === "speak" && <SpeakLab lessons={lessons} onEcho={() => launch({ kind: "echo", recId: "quick-echo", sticker: "st-mic", title: "Echo" })} onTalk={() => launch({ kind: "talk", refId: "pt-park", recId: "quick-talk", title: "Picture Talk" })} openLesson={openLesson} />}
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
            <img src={`${GEN}mascot-book.png`} style={{ width: 110, height: 110, objectFit: "contain" }} alt="" />
            <h3>Nội dung Premium 🔒</h3>
            <p style={{ color: "var(--muted)" }}>Mở khoá tất cả thế giới phiêu lưu, game và câu đố với gói Premium.</p>
            <button className="btn accent" onClick={() => { setUpsell(false); setAccount(true); }}>Xem gói thành viên</button>
            <div><button className="btn ghost sm" style={{ marginTop: 8 }} onClick={() => setUpsell(false)}>Để sau</button></div>
          </div>
        </div>
      )}

      {game && <GamePlay kind={game.kind} refId={game.refId} accent={state.prefs.accent} onExit={() => setGame(null)} onFinish={finishGame} />}

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
              <div className="reward-sticker">{reward.sticker.emoji}</div>
            ) : (
              <img src={`${GEN}mascot-star.png`} style={{ width: 120, height: 120, objectFit: "contain" }} alt="" />
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

/* ==================== HOME ==================== */
function Home({ state, stopDone, setView, launchStop, openWorld }: {
  state: AppState; stopDone: (id: string) => boolean; setView: (v: View) => void;
  launchStop: (st: Stop, w: World) => void; openWorld: (w: World) => void;
}) {
  const world = WORLDS[0]; // Everyday Town
  const doneCount = world.stops.filter((s) => stopDone(s.id)).length;
  const nextStop = world.stops.find((s) => !stopDone(s.id)) || world.stops[0];
  const goal = 3;
  const pct = Math.min(100, Math.round((state.dailyDone / goal) * 100));
  const kindEmoji: Record<StopKind, string> = { picdet: "🔎", puzzle: "🧩", riddle: "🦉", talk: "💬", echo: "🎤", shadow: "🎬" };

  return (
    <section className="view">
      <div className="homehero">
        <div className="hh-glass">
          <div className="hh-hi">Chào {state.nickname || "bạn nhỏ"}! 👋</div>
          <div className="hh-sub">Cùng Maple chơi, giải đố và nói tiếng Anh nhé!</div>
          <button className="btn" onClick={() => launchStop(nextStop, world)}>▶ Nhiệm vụ hôm nay</button>
        </div>
      </div>

      {/* Nhiệm vụ hôm nay */}
      <div className="section-title"><h2>🎯 Nhiệm vụ hôm nay</h2></div>
      <div className="card mission" onClick={() => launchStop(nextStop, world)}>
        <div className="mission-ic">{kindEmoji[nextStop.kind]}</div>
        <div className="mission-info">
          <div className="k">{world.emoji} {world.name}</div>
          <div className="t">{nextStop.label} — {nextStop.vi}</div>
        </div>
        <span className="btn sm">Chơi ▶</span>
      </div>

      {/* Tiếp tục hành trình */}
      <div className="section-title"><h2>🗺️ Tiếp tục hành trình</h2><span className="more" onClick={() => setView("adventure")}>Xem bản đồ →</span></div>
      <div className="card world-continue" style={{ "--zt": world.tint } as React.CSSProperties} onClick={() => openWorld(world)}>
        <div className="wc-emoji">{world.emoji}</div>
        <div style={{ flex: 1 }}>
          <div className="wc-name">{world.name}</div>
          <div className="wc-sub">{world.sub}</div>
          <div className="goalbar"><i style={{ width: `${(doneCount / world.stops.length) * 100}%` }} /></div>
        </div>
        <span className="chip">{doneCount}/{world.stops.length}</span>
      </div>

      {/* Thử thách hằng ngày */}
      <div className="section-title"><h2>🔥 Thử thách hằng ngày</h2></div>
      <div className="card" style={{ padding: 14 }}>
        <div style={{ fontWeight: 700 }}>{state.dailyDone >= goal ? "🎉 Hoàn thành thử thách hôm nay! Giỏi quá!" : `Chơi ${goal} hoạt động hôm nay (${state.dailyDone}/${goal})`}</div>
        <div className="goalbar"><i style={{ width: `${pct}%` }} /></div>
      </div>

      {/* Game đề xuất */}
      <div className="section-title"><h2>🎮 Chơi ngay</h2><span className="more" onClick={() => setView("games")}>Tất cả game →</span></div>
      <div className="game-row">
        {GAMES.map((g) => (
          <div key={g.id} className="minigame" style={{ "--zt": g.tint } as React.CSSProperties} onClick={() => setView("games")}>
            <div className="mg-emoji">{g.emoji}</div>
            <div className="mg-name">{g.vi}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ==================== ADVENTURE ==================== */
function Adventure({ state, stopDone, launchStop, sel, setSel }: {
  state: AppState; stopDone: (id: string) => boolean;
  launchStop: (st: Stop, w: World) => void; sel: World | null; setSel: (w: World | null) => void;
}) {
  if (sel) return <WorldView world={sel} state={state} stopDone={stopDone} launchStop={launchStop} back={() => setSel(null)} />;
  return (
    <section className="view">
      <div className="section-title"><h2>🗺️ Bản đồ phiêu lưu</h2></div>
      <p style={{ color: "var(--muted)", marginTop: -6 }}>Chọn một thế giới để bắt đầu chuyến phiêu lưu tiếng Anh!</p>
      <div className="worlds">
        {WORLDS.map((w) => {
          const dc = w.stops.filter((s) => stopDone(s.id)).length;
          const locked = !w.ready;
          return (
            <div key={w.id} className={`card world ${locked ? "locked" : ""}`} style={{ "--zt": w.tint } as React.CSSProperties} onClick={() => w.ready && setSel(w)}>
              <div className="w-emoji">{w.emoji}</div>
              <div className="w-name">{w.name}</div>
              <div className="w-vi">{w.vi}</div>
              <div className="w-sub">{w.sub}</div>
              {locked ? <span className="w-badge soon">🛠️ Sắp ra mắt</span> : <span className="w-badge">{dc}/{w.stops.length} ⭐</span>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WorldView({ world, state, stopDone, launchStop, back }: {
  world: World; state: AppState; stopDone: (id: string) => boolean; launchStop: (st: Stop, w: World) => void; back: () => void;
}) {
  const kindEmoji: Record<StopKind, string> = { picdet: "🔎", puzzle: "🧩", riddle: "🦉", talk: "💬", echo: "🎤", shadow: "🎬" };
  const XC = 170, AMP = 90, GAP = 120;
  const pts = world.stops.map((_, i) => [i === 0 ? XC : i % 2 ? XC + AMP : XC - AMP, 56 + i * GAP] as [number, number]);
  const H = world.stops.length ? 56 + (world.stops.length - 1) * GAP + 90 : 0;
  let d = pts.length ? `M ${pts[0][0]} ${pts[0][1]}` : "";
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1], [x2, y2] = pts[i];
    d += ` C ${x1} ${y1 + 60}, ${x2} ${y2 - 60}, ${x2} ${y2}`;
  }
  const nextIdx = world.stops.findIndex((s) => !stopDone(s.id));
  return (
    <section className="view">
      <div className="st-top"><button className="bk" onClick={back}>← Bản đồ</button><h3>{world.emoji} {world.name}</h3></div>
      <div className="card zone" style={{ "--zt": world.tint } as React.CSSProperties}>
        <div className="trail" style={{ height: H }}>
          <svg width="340" height={H} viewBox={`0 0 340 ${H}`} aria-hidden="true">
            <path d={d} fill="none" stroke="#dcc9a4" strokeWidth={7} strokeLinecap="round" strokeDasharray="1 15" />
          </svg>
          {world.stops.map((st, i) => {
            const done = stopDone(st.id), cur = i === nextIdx;
            const [x, y] = pts[i];
            return (
              <div key={st.id}>
                <div className={`node ${done ? "done" : ""} ${cur ? "current" : ""}`} style={{ left: x, top: y }} onClick={() => launchStop(st, world)}>
                  {done ? "✓" : kindEmoji[st.kind]}
                </div>
                <div className="nlabel" style={{ left: x, top: y + 40 }}>{st.label}<small>{st.vi}</small></div>
                {cur && <img className="maple-here" src={`${GEN}mascot-wave.png`} alt="" style={{ left: x, top: y - 98 }} />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==================== GAMES HUB ==================== */
function GamesHub({ launch }: { launch: (kind: GameKind) => void }) {
  return (
    <section className="view">
      <div className="section-title"><h2>🎮 Khu trò chơi</h2></div>
      <p style={{ color: "var(--muted)", marginTop: -6 }}>Chọn một trò chơi để luyện tiếng Anh thật vui!</p>
      <div className="grid">
        {GAMES.map((g) => (
          <div key={g.id} className="card gamecard" style={{ "--zt": g.tint } as React.CSSProperties} onClick={() => launch(g.id)}>
            <div className="gc-thumb"><span className="gc-emoji">{g.emoji}</span><span className="gc-note">{g.assetNote}</span></div>
            <div className="gc-body">
              <div className="gc-name">{g.name}</div>
              <div className="gc-vi">{g.vi}</div>
              <div className="gc-blurb">{g.blurb}</div>
              <span className="btn sm accent">Chơi ▶</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ==================== SPEAK LAB ==================== */
function SpeakLab({ lessons, onEcho, onTalk, openLesson }: {
  lessons: Lesson[]; onEcho: () => void; onTalk: () => void; openLesson: (id: string) => void;
}) {
  const shadowable = lessons.filter((l) => l.lines.length > 0);
  return (
    <section className="view">
      <div className="section-title"><h2>🎤 Phòng luyện nói</h2></div>
      <p style={{ color: "var(--muted)", marginTop: -6 }}>Nghe Maple đọc rồi nói theo — không chấm điểm, cứ nói thật vui!</p>
      <div className="speak-modes">
        <div className="card speakcard" onClick={onEcho}>
          <div className="sc-emoji">🎤</div>
          <div><div className="sc-name">Echo với Maple</div><div className="sc-sub">Nghe & nói theo từng câu ngắn</div></div>
          <span className="btn sm">Bắt đầu ▶</span>
        </div>
        <div className="card speakcard" onClick={onTalk}>
          <div className="sc-emoji">💬</div>
          <div><div className="sc-name">Mô tả hình ảnh</div><div className="sc-sub">Nhìn tranh rồi tự nói thành câu</div></div>
          <span className="btn sm">Bắt đầu ▶</span>
        </div>
      </div>

      <div className="section-title"><h2>🎬 Shadowing theo video</h2></div>
      <p style={{ color: "var(--muted)", marginTop: -6, fontSize: ".85rem" }}>Xem video, chạm vào câu để nghe và tập nói theo.</p>
      <div className="grid">
        {shadowable.map((l) => (
          <div key={l.id} className="card lcard" onClick={() => openLesson(l.id)}>
            <div className="thumb" style={{ backgroundImage: `url('${thumbFor(l)}')` }} />
            <div className="body">
              <div className="ttl">{l.title}</div>
              <div className="meta">
                <span className="badge lv">Level {l.level}</span>
                <span className="badge">{l.skill}</span>
                <span className={`badge ${l.free ? "free" : "pro"}`}>{l.free ? "Miễn phí" : "Premium"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ==================== COLLECTION ==================== */
function Collection({ state, lessons, stars }: { state: AppState; lessons: Lesson[]; stars: number }) {
  const got = new Set(state.stickers || []);
  const statTiles: [string, number, string][] = [
    ["🔥", state.streak, "ngày streak"],
    ["⭐", stars, "sao"],
    ["🎮", gamesDone(state), "game xong"],
    ["📖", totalLearned(state), "câu đã thuộc"],
  ];
  return (
    <section className="view">
      <div className="section-title"><h2>🎁 Kho báu của mình</h2></div>
      <div className="card" style={{ padding: 14 }}>
        <div className="col-head">🏅 Sticker sưu tầm ({got.size}/{STICKERS.length})</div>
        <div className="stickers">
          {STICKERS.map((s) => (
            <div key={s.id} className={`sticker ${got.has(s.id) ? "on" : ""}`}>
              <div className="sk-emoji">{got.has(s.id) ? s.emoji : "❓"}</div>
              <div className="sk-name">{got.has(s.id) ? s.name : "Chưa mở"}</div>
            </div>
          ))}
        </div>
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

      <div className="section-title"><h2>📊 Thống kê</h2></div>
      <div className="statgrid">
        {statTiles.map(([i, n, l]) => (
          <div key={l} className="card stat"><div className="n">{i} {n}</div><div className="l">{l}</div></div>
        ))}
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
