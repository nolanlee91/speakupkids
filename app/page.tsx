"use client";

import { useEffect, useState } from "react";
import {
  type AppState, defaultState, loadState, saveState, totalStars,
  touchStreak, resetDailyIfNeeded, resetDailyTasks, todayStr, totalLearned,
  recordGame, hasSticker, gamesDone, addSticker,
  completeLearnLesson, learnLessonDone, learnLessonsDone,
  markGameSeen, recordBest, gameBest, sectionDone,
  completeMission, missionOf, adventuresDone,
} from "@/lib/state";
import {
  GAMES, STICKERS, stickerById,
  type StopKind, type GameKind,
} from "@/lib/games";
import { SECTIONS, learnLessonById } from "@/lib/learn";
import { missionById } from "@/lib/adventures";
import { GamePlay } from "./games";
import { Learn } from "./learn";
import { Adventure } from "./adventure";
import { celebrate } from "@/lib/fx";

const BDG = "/assets/images/badges/";
const GEN = "/assets/images/gen/";
const STK = "/assets/images/stickers/";

// Ảnh sticker thật; nếu thiếu file thì fallback về emoji
function StickerArt({ id, emoji }: { id: string; emoji: string }) {
  const [err, setErr] = useState(false);
  return err ? <span className="sticker-emoji">{emoji}</span>
    : <img className="sticker-img" src={`${STK}${id}.webp`} alt="" onError={() => setErr(true)} />;
}

const BADGES: { img: string; nm: string; has: (s: AppState) => boolean }[] = [
  { img: "badge-star.webp", nm: "Bài đầu tiên", has: (s) => learnLessonsDone(s) >= 1 },
  { img: "badge-streak.webp", nm: "3 ngày liên tiếp", has: (s) => s.streak >= 3 },
  { img: "badge-speaking.webp", nm: "Luyện 3 lượt", has: (s) => gamesDone(s) >= 3 },
  { img: "badge-pronunciation.webp", nm: "Thuộc 15 câu", has: (s) => totalLearned(s) >= 15 },
  { img: "badge-listening.webp", nm: "Học 3 Unit", has: (s) => learnLessonsDone(s) >= 3 },
  { img: "badge-trophy.webp", nm: "10 sao", has: (s) => totalStars(s) >= 10 },
  { img: "badge-explorer.webp", nm: "Nhà phiêu lưu", has: (s) => adventuresDone(s) >= 1 },
  { img: "badge-vancouver.webp", nm: "Đủ 5 sticker", has: (s) => (s.stickers || []).length >= 5 },
];

const AVATARS = ["🦊", "🐰", "🐼", "🦉", "🐨", "🦫", "🐬", "🦄", "🐧", "🐝"];

type View = "home" | "learn" | "adventure" | "games";
type Launch = { kind: StopKind; refId?: string; recId: string; sticker?: string; title: string };
type Reward = { title: string; html: string; stars?: number; sticker?: { id: string; emoji: string; name: string } | null };

const NAV: [View, string, string][] = [
  ["home", "☀️", "Today"],
  ["learn", "📖", "Learn"],
  ["games", "🎮", "Practice"],
  ["adventure", "🗺️", "Adventure"],
];

export default function App() {
  const [state, setState] = useState<AppState>(defaultState);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("home");
  const [learnEntry, setLearnEntry] = useState<"map" | "lesson">("map");
  const [game, setGame] = useState<Launch | null>(null);
  const [account, setAccount] = useState(false);
  const [collection, setCollection] = useState(false);
  const [menu, setMenu] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    let s = loadState();
    s = touchStreak(s);
    s = resetDailyIfNeeded(s);
    s = resetDailyTasks(s);
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

  function goView(v: View) { if (v === "learn") setLearnEntry("map"); setView(v); }
  function launch(l: Launch) { setGame(l); }
  // Mở thẳng bài học hiện tại (từ CTA "Hôm nay")
  function openCurrentLesson(lessonId: string) {
    setState((s) => ({ ...s, learn: { ...s.learn, currentLesson: lessonId } }));
    setLearnEntry("lesson"); setView("learn");
  }

  // Ghi nhận 1 lượt Luyện tập. finish=false: ghi thầm rồi ở lại (chọn "bức khác").
  function handleRound(sceneKey: string, starsWon: number, finish: boolean) {
    if (!game) return;
    const improved = sceneKey ? starsWon > gameBest(state, sceneKey) : false;
    const firstSticker = finish && !!game.sticker && !hasSticker(state, game.sticker);
    let ns = recordGame(state, game.recId, starsWon, finish ? game.sticker : undefined).state;
    if (sceneKey) ns = recordBest(ns, sceneKey, starsWon);
    setState(ns);
    if (!finish) return;
    setGame(null);
    const sk = firstSticker && game.sticker ? stickerById(game.sticker) : null;
    setReward({
      title: starsWon >= 3 ? "Xuất sắc! 🌟" : starsWon >= 2 ? "Làm tốt lắm! 👍" : "Cố lên nhé! 💪",
      html: `Bạn đạt <b>${starsWon} ⭐</b>.${improved ? " Điểm tốt nhất mới! 🏆" : ""}`,
      stars: starsWon,
      sticker: sk ? { id: sk.id, emoji: sk.emoji, name: sk.name } : null,
    });
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
    const st = score >= total ? 3 : score >= total - 1 ? 2 : 1;
    setReward({
      title: score >= total ? "Xuất sắc! 🌟" : score >= total - 1 ? "Làm tốt lắm! 👍" : "Cố lên nhé! 💪",
      html: `Bạn hoàn thành Unit <b>${les?.title || ""}</b> — đúng <b>${score}/${total}</b> ở Kiểm tra nhỏ.<br>Học tiếp Unit sau hoặc luyện tập cho nhớ lâu nhé!`,
      stars: st,
      sticker: sk ? { id: sk.id, emoji: sk.emoji, name: sk.name } : null,
    });
  }

  // Hoàn thành 1 nhiệm vụ Phiêu lưu
  function completeAdventure(missionId: string, starsWon: number, sticker?: string, badge?: string) {
    const firstSticker = !!sticker && !hasSticker(state, sticker);
    const { state: ns } = completeMission(state, missionId, starsWon, sticker);
    setState(ns);
    celebrate(state.prefs.motion !== false);
    const sk = firstSticker && sticker ? stickerById(sticker) : null;
    setReward({
      title: "Hoàn thành nhiệm vụ! 🏅",
      html: `Bạn đạt <b>${starsWon} ⭐</b>${badge ? ` và huy hiệu <b>${badge}</b>` : ""}!`,
      stars: starsWon,
      sticker: sk ? { id: sk.id, emoji: sk.emoji, name: sk.name } : null,
    });
  }

  if (!ready) return <div style={{ padding: 40, color: "#7a8194" }}>Đang tải…</div>;

  const got = state.stickers || [];

  return (
    <div id="app">
      <header className="hud">
        <button className="hud-avatar" onClick={() => setMenu((m) => !m)} aria-label="Tài khoản">{state.avatar}</button>
        <div className="hud-tokens">
          <span className="wtag fire">🔥 {state.streak}</span>
          <span className="wtag star">⭐ {stars}</span>
          <button className="wtag collect" onClick={() => setCollection(true)} aria-label="Bộ sưu tập">🎁 {got.length}</button>
        </div>
        {menu && (
          <>
            <div className="menu-back" onClick={() => setMenu(false)} />
            <div className="avatar-menu">
              <button onClick={() => { setMenu(false); setAccount(true); }}>👤 Hồ sơ của bé</button>
              <button onClick={() => { setMenu(false); setCollection(true); }}>🎁 Bộ sưu tập</button>
              <button onClick={() => { setMenu(false); setAccount(true); }}>⚙️ Cài đặt & Gói</button>
            </div>
          </>
        )}
      </header>

      <div className={`wrap ${view === "home" || view === "adventure" ? "wide" : ""}`}>
        {view === "home" && <Today state={state} go={goView} openLesson={openCurrentLesson} />}
        {view === "learn" && <Learn state={state} setState={setState} entry={learnEntry}
          onEcho={() => launch({ kind: "echo", recId: "quick-echo", sticker: "st-mic", title: "Echo" })}
          onTalk={(sceneId) => launch({ kind: "talk", refId: sceneId ?? "park", recId: "quick-talk", title: "Describe the Picture" })}
          onComplete={completeLearn} />}
        {view === "games" && <GamesHub launch={(kind) => launch({ kind, refId: undefined, recId: "quick-" + kind, title: "Luyện tập" })} />}
        {view === "adventure" && <Adventure state={state} setState={setState} accent={state.prefs.accent}
          onComplete={completeAdventure} />}
      </div>

      <nav className="nav">
        {NAV.map(([v, i, label]) => (
          <button key={v} className={view === v ? "on" : ""} onClick={() => goView(v)}>
            <span className="i">{i}</span>{label}
          </button>
        ))}
      </nav>

      {showSplash && (
        <div id="splash">
          {state.prefs.motion !== false && Array.from({ length: 7 }, (_, i) => (
            <span key={i} className="leaf" style={{ left: `${6 + i * 14}%`, animationDuration: `${2 + (i % 3) * 0.7}s`, animationDelay: `${i * 0.22}s` }}>🍁</span>
          ))}
          <div className="sp-banner">
            <div className="sp-card">
              <div className="sp-title">Chào {state.nickname || "bạn nhỏ"}! 👋</div>
              <div className="sp-goal">🎯 Nhiệm vụ hôm nay đang chờ bạn!</div>
              <button className="btn" onClick={() => setShowSplash(false)}>▶ Bắt đầu</button>
            </div>
          </div>
        </div>
      )}

      {game && <GamePlay kind={game.kind} refId={game.refId} accent={state.prefs.accent}
        seen={state.games.seen} best={state.games.best}
        onSeen={(key, ids) => setState((s) => markGameSeen(s, key, ids))}
        onRound={handleRound}
        onExit={() => setGame(null)} />}

      {collection && <CollectionPanel state={state} stars={stars} onClose={() => setCollection(false)} />}
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

/* ==================== HÔM NAY — bé nên làm gì tiếp theo? ==================== */
function Today({ state, go, openLesson }: {
  state: AppState; go: (v: View) => void; openLesson: (lessonId: string) => void;
}) {
  const name = state.nickname || "bạn nhỏ";
  const lessonId = state.learn.currentLesson;
  const lesson = learnLessonById(lessonId) || learnLessonById("park")!;
  const doneCount = SECTIONS.filter((sc) => sectionDone(state, lesson.id, sc.key)).length;
  const nextSection = SECTIONS.find((sc) => !sectionDone(state, lesson.id, sc.key));
  const lessonDone = learnLessonDone(state, lesson.id);

  // Chiến dịch Phiêu lưu đang chơi dở (tiến độ RIÊNG của Adventure, không liên quan Learn)
  const advCur = state.adventure.currentMission;
  const advState = advCur ? missionOf(state, advCur) : null;
  const advStarted = !!advCur && !!advState && advState.step > 0 && !advState.done;
  const advMission = advCur ? missionById(advCur) : undefined;

  // CTA lớn: tiếp tục hoạt động gần nhất — KHÔNG ép ba module thành một chuỗi bắt buộc.
  let cta: { kicker: string; title: string; sub: string; label: string; run: () => void; bg?: string };
  if (!lessonDone && nextSection) {
    cta = {
      kicker: doneCount > 0 ? "Tiếp tục học" : "Bắt đầu Unit",
      title: `${lesson.title} · ${nextSection.vi}`,
      sub: `${doneCount}/${SECTIONS.length} chặng đã xong`,
      label: doneCount > 0 ? "Học tiếp" : "Bắt đầu học",
      run: () => openLesson(lesson.id),
    };
  } else if (!lessonDone) {
    cta = { kicker: "Sắp xong Unit", title: `${lesson.title} · Kiểm tra nhỏ`, sub: "Làm bài kiểm tra để hoàn thành", label: "Làm Kiểm tra nhỏ", run: () => openLesson(lesson.id) };
  } else if (advStarted && advMission) {
    cta = { kicker: "Tiếp tục chiến dịch", title: `Phiêu lưu · ${advMission.vi}`, sub: "Chương bạn đang chơi dở", label: "Chơi tiếp", run: () => go("adventure"), bg: advMission.sceneImage };
  } else {
    cta = { kicker: "Luyện cho nhớ lâu", title: "Luyện tập cùng Maple", sub: "Chơi một lượt có chấm điểm", label: "Luyện tập", run: () => go("games") };
  }

  const daily = state.daily;
  const tasks: { ic: string; label: string; done: boolean; run: () => void }[] = [
    { ic: "📖", label: "Học một chặng", done: daily.learn, run: () => openLesson(lesson.id) },
    { ic: "🎮", label: "Luyện tập một lượt", done: daily.practice, run: () => go("games") },
    { ic: "🗺️", label: "Vượt một bước phiêu lưu", done: daily.adventure, run: () => go("adventure") },
  ];
  const doneToday = tasks.filter((t) => t.done).length;

  return (
    <section className="today">
      <div className="today-hi">
        <div>
          <div className="hello-sign">Chào {name}! <span className="hs-wave">👋</span></div>
          <p className="today-lead">Hôm nay bé nên làm gì tiếp theo?</p>
        </div>
        <div className="today-flag" aria-hidden="true"><span>🔥</span>{state.streak} ngày</div>
      </div>

      {/* CTA chính duy nhất */}
      <button className="next-card" style={{ backgroundImage: (cta.bg || lesson.sceneImage) ? `url('${cta.bg || lesson.sceneImage}')` : undefined }} onClick={cta.run}>
        <span className="nc-scrim" />
        <span className="nc-body">
          <span className="nc-kicker">{cta.kicker}</span>
          <span className="nc-title">{cta.title}</span>
          <span className="nc-sub">{cta.sub}</span>
          <span className="nc-cta">▶ {cta.label}</span>
        </span>
      </button>

      {/* Ba nhiệm vụ hôm nay */}
      <h2 className="chapter">Nhiệm vụ hôm nay · {doneToday}/3</h2>
      <div className="daily-tasks">
        {tasks.map((t) => (
          <button key={t.label} className={`dtask ${t.done ? "done" : ""}`} onClick={t.run}>
            <span className="dt-ic">{t.done ? "✓" : t.ic}</span>
            <span className="dt-label">{t.label}</span>
            <span className="dt-go">{t.done ? "Đã xong" : "▸"}</span>
          </button>
        ))}
      </div>

      {/* Tiến độ ngắn gọn */}
      <div className="today-stats">
        <span className="ts"><b>🔥 {state.streak}</b>chuỗi ngày</span>
        <span className="ts"><b>⭐ {totalStars(state)}</b>tổng sao</span>
        <span className="ts"><b>🎁 {(state.stickers || []).length}</b>sticker</span>
      </div>

      {/* Thành quả gần nhất */}
      {(learnLessonsDone(state) > 0 || adventuresDone(state) > 0) && (
        <div className="today-recent">
          🎉 Gần đây: đã học xong <b>{learnLessonsDone(state)}</b> Unit
          {adventuresDone(state) > 0 && <> · vượt <b>{adventuresDone(state)}</b> nhiệm vụ</>}.
        </div>
      )}
    </section>
  );
}

/* ==================== LUYỆN TẬP — bốn game, vai trò rõ ==================== */
function GamesHub({ launch }: { launch: (kind: GameKind) => void }) {
  const feat = GAMES[0];
  const rest = GAMES.slice(1);
  return (
    <section className="playground">
      <h2 className="chapter">Luyện tập cùng Maple</h2>
      <p className="pg-sub">Mỗi trò chơi luyện một kỹ năng — chơi có chủ đích, được máy chấm.</p>

      <button className={`portal featured theme-g-${feat.id}`} onClick={() => launch(feat.id)}>
        <span className="portal-scene" aria-hidden="true">{feat.image ? <img src={feat.image} alt="" /> : <span className="portal-obj">{feat.emoji}</span>}</span>
        <span className="portal-copy">
          <span className="po-name">{feat.name}</span>
          <span className="po-vi">{feat.vi}</span>
          <span className="po-blurb">{feat.blurb}</span>
          <span className="po-go">Vào luyện ▶</span>
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

/* ==================== BỘ SƯU TẬP (mở từ header) ==================== */
function CollectionPanel({ state, stars, onClose }: { state: AppState; stars: number; onClose: () => void }) {
  const got = new Set(state.stickers || []);
  const stamps: [string, number, string][] = [
    ["🔥", state.streak, "ngày"],
    ["⭐", stars, "sao"],
    ["📖", learnLessonsDone(state), "bài học"],
    ["🗺️", adventuresDone(state), "nhiệm vụ"],
  ];
  return (
    <div className="game-overlay">
      <div className="game-top"><button className="bk" onClick={onClose}>← Đóng</button><h3>🎁 Bộ sưu tập</h3></div>
      <div className="game-body">
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
                <div key={b.img} className={`trophy ${b.has(state) ? "on" : ""}`}>
                  <img src={`${BDG}${b.img}`} alt="" />
                  <span>{b.nm}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ==================== TÀI KHOẢN + GÓI (từ avatar) ==================== */
const PLAN_FEATS = {
  free: ["Cả 6 Unit của Level 1", "Luyện tập & phiêu lưu cơ bản", "Bộ sưu tập sticker"],
  premium: ["Toàn bộ Level tiếp theo", "Thêm hoạt động luyện tập", "Báo cáo cho phụ huynh"],
  family: ["Mọi quyền lợi Premium", "Nhiều hồ sơ cho các bé", "Theo dõi từng bé"],
};

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
        <div className="card plan current">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}><span className="pname">Miễn phí</span><span className="price">Đang dùng</span></div>
          <ul>{PLAN_FEATS.free.map((f) => <li key={f}>{f}</li>)}</ul>
          <div className="chip" style={{ marginTop: 10 }}>Đang dùng</div>
        </div>
        {(["premium", "family"] as const).map((pl) => (
          <div key={pl} className="card plan">
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <span className="pname">{pl === "premium" ? "Premium" : "Family"}</span>
              <span className="chip sun">Sắp ra mắt</span>
            </div>
            <ul>{PLAN_FEATS[pl].map((f) => <li key={f}>{f}</li>)}</ul>
            <button className="btn ghost sm" disabled style={{ marginTop: 10, opacity: 0.7 }}>Nhận thông báo khi ra mắt</button>
          </div>
        ))}
        <p style={{ fontSize: ".78rem", color: "var(--muted)", textAlign: "center" }}>Premium & Family đang được hoàn thiện — giá và tính năng sẽ công bố khi ra mắt.</p>
      </div>
    </div>
  );
}
