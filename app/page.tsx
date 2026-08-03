"use client";

import { useEffect, useState } from "react";
import {
  type AppState, type RoundResult, defaultState, loadState, totalStars,
  touchStreak, resetDailyIfNeeded, resetDailyTasks, todayStr,
  hasSticker, gamesDone, addSticker, isPremium,
  completeLearnLesson, learnLessonDone, learnLessonsDone,
  recordGameAnswers, finishGameRound, markPracticeDone, topicOf, sectionDone,
  adventuresDone, isChapterCompleted, adventureOf, awardCashOnce, awardCoinsOnce,
} from "@/lib/state";
import {
  GAMES, stickerById, STICKER_FOR_GAME, PRACTICE_MILESTONE_STICKERS,
  type StopKind, type GameKind,
} from "@/lib/games";
import { SECTIONS, learnLessonById, LEVEL1_UNITS, LEVEL2_UNITS, LEVEL3_COLLECTIONS } from "@/lib/learn";
import { LEVEL0_UNITS, phonicsUnitById } from "@/lib/phonics";
import { SEASONS, SEASON_LOST_COMPASS, chapterPlayable, resumeChapter } from "@/lib/adventures";
import { CLUBHOUSE_SHOP } from "@/lib/clubhouse";
import { GamePlay } from "./games";
import { Learn } from "./learn";
import { Adventure } from "./adventure";
import { Clubhouse } from "./clubhouse";
import { celebrate, playSuccessSound } from "@/lib/fx";
import { AppIcon, type AppIconName } from "./icons";
import { AuthGate } from "./authgate";
import { syncSave, currentUser, signOut, clearActiveChild, fetchMembership, redeemCode, claimGifts, getActiveChildId, getWeeklyEmailPref, setWeeklyEmailPref } from "@/lib/cloud";
import { cloudEnabled } from "@/lib/supabase";
import { StickerArt } from "./reward-art";

const GEN = "/assets/images/gen/";

const AVATARS = ["🦊", "🐰", "🐼", "🦉", "🐨", "🦫", "🐬", "🦄", "🐧", "🐝"];
// Tổng số Unit của cả 3 Level (dùng cho thanh tiến độ ở dashboard Home desktop).
const TOTAL_UNITS = LEVEL0_UNITS.length + LEVEL1_UNITS.length + LEVEL2_UNITS.length + LEVEL3_COLLECTIONS.reduce((a, c) => a + c.units.length, 0);

type View = "home" | "learn" | "adventure" | "games";
type NavTarget = View | "clubhouse";
type Launch = { kind: StopKind; refId?: string; title: string };
type Reward = { title: string; html: string; stars?: number; coins?: number; cash?: number; sticker?: { id: string; emoji: string; name: string } | null };

const NAV: [NavTarget, AppIconName, string, string?][] = [
  ["home", "home", "Today"],
  ["learn", "learn", "Learn"],
  ["games", "practice", "Practice"],
  ["adventure", "adventure", "Adventure"],
  ["clubhouse", "clubhouse", "Maple House", "House"],
];

function App() {
  const [state, setState] = useState<AppState>(defaultState);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("home");
  const [learnEntry, setLearnEntry] = useState<"map" | "lesson">("map");
  const [game, setGame] = useState<Launch | null>(null);
  const [account, setAccount] = useState(false);
  const [clubhouse, setClubhouse] = useState(false);
  const [menu, setMenu] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    let s = loadState();
    s = touchStreak(s);
    s = resetDailyIfNeeded(s);
    s = resetDailyTasks(s);
    // TEST MODE: luôn hiện màn chào sau mỗi lần tải app.
    // Khi production, đổi lại điều kiện `s.splashDate !== todayStr()`.
    setShowSplash(true);
    setState(s);
    setReady(true);
    // Gói thành viên: nguồn chuẩn là bảng entitlements phía server (client chỉ đọc).
    // Giá trị trong state/localStorage chỉ là cache — mỗi lần mở app ghi đè lại từ server.
    if (cloudEnabled()) {
      fetchMembership().then((m) => setState((cur) => (cur.membership === m ? cur : { ...cur, membership: m })));
      // Quà Coins/Cash admin tặng (bảng gifts): nhận một lần rồi cộng vào ví của bé.
      const childId = getActiveChildId();
      if (childId) claimGifts(childId).then((g) => {
        if (g.coins > 0 || g.cash > 0) {
          setState((cur) => ({ ...cur, clubhouse: { ...cur.clubhouse, coins: cur.clubhouse.coins + g.coins, cash: cur.clubhouse.cash + g.cash } }));
          setReward({
            title: "Quà từ SpeakUp! 🎁",
            html: "Bạn được tặng" + (g.coins ? ` <b>${g.coins}</b> Maple Coins` : "") + (g.coins && g.cash ? " và" : "") + (g.cash ? ` <b>${g.cash}</b> Maple Cash` : "") + " — vào Clubhouse tiêu ngay nhé!",
            coins: g.coins || undefined,
            cash: g.cash || undefined,
            sticker: null,
          });
        }
      });
    }
  }, []);
  useEffect(() => { if (ready) syncSave(state); }, [state, ready]);
  useEffect(() => { document.body.classList.toggle("no-motion", state.prefs.motion === false); }, [state.prefs.motion]);

  const stars = totalStars(state);

  function goView(v: View) { if (v === "learn") setLearnEntry("map"); setView(v); }
  // Chạm nội dung khóa Premium → mở màn Tài khoản (khu Gói thành viên).
  function openPremium() { setMenu(false); setGame(null); setAccount(true); }
  function launch(l: Launch) { setGame(l); }
  // Mở thẳng bài học hiện tại (từ CTA "Hôm nay")
  function openCurrentLesson(lessonId: string) {
    setState((s) => ({ ...s, learn: { ...s.learn, currentLesson: lessonId } }));
    setLearnEntry("lesson"); setView("learn");
  }

  // Ghi câu đã trả lời (đúng/sai + seen) — dùng khi thoát giữa chừng. KHÔNG tăng playCount.
  function commitGame(key: string, results: RoundResult[]) {
    if (results.length) setState((s) => recordGameAnswers(s, key, results));
  }
  // Hoàn thành TRỌN một lượt: ghi câu + playCount + bestStars + lastPlayedAt + Practice hôm nay.
  // Sticker chỉ tặng khi đã khám phá HẾT câu/task của topic, và chỉ một lần. Trả info để màn kết quả hiển thị.
  function finishGame(key: string, results: RoundResult[], stars: number, topicTotal: number) {
    const prev = topicOf(state, key);
    const explored = new Set(prev.seen);
    results.forEach((r) => explored.add(r.id));
    const newly = results.filter((r) => !prev.seen.includes(r.id)).length;
    const fully = topicTotal > 0 && explored.size >= topicTotal;
    const gameType = key.split(":")[0] as GameKind;
    const stId = STICKER_FOR_GAME[gameType];
    const topicSticker = fully && !!stId && !hasSticker(state, stId) ? stId : undefined;
    const projectedPlays = gamesDone(state) + 1;
    const milestoneSticker = !topicSticker
      ? PRACTICE_MILESTONE_STICKERS.find((m) => projectedPlays >= m.plays && !hasSticker(state, m.id))?.id
      : undefined;
    const awardId = topicSticker || milestoneSticker;
    const roundKey = `practice:${key}`;
    const dailyKey = `daily-core:${todayStr()}`;
    const roundCoins = state.clubhouse.rewardedKeys.includes(roundKey) ? 0 : 10;
    const dailyCoins = state.daily.learn && !state.clubhouse.rewardedKeys.includes(dailyKey) ? 15 : 0;
    const coinsAwarded = roundCoins + dailyCoins;
    setState((s) => {
      let ns = recordGameAnswers(s, key, results);
      ns = finishGameRound(ns, key, stars, todayStr());
      const roundReward = awardCoinsOnce(ns, roundKey, 10);
      ns = roundReward.state;
      ns = awardCashOnce(ns, roundKey, 1).state;
      if (ns.daily.learn && ns.daily.practice) {
        ns = awardCoinsOnce(ns, dailyKey, 15).state;
        ns = awardCashOnce(ns, dailyKey, 2).state;
      }
      if (awardId) ns = addSticker(ns, awardId);
      return ns;
    });
    const sk = awardId ? stickerById(awardId) : undefined;
    return { newly, explored: explored.size, total: topicTotal, coins: coinsAwarded, sticker: sk ? { id: sk.id, name: sk.name, emoji: sk.emoji } : undefined };
  }
  // Echo (luyện nói tùy chọn): chỉ đánh dấu đã luyện Practice hôm nay.
  function echoDone() { setState((s) => markPracticeDone(s)); }

  // Hoàn thành bài Learn (sau Mini Check)
  function completeLearn(lessonId: string, score: number, total: number) {
    let { state: ns, newly } = completeLearnLesson(state, lessonId, score, total);
    const coinReward = newly ? awardCoinsOnce(ns, `learn:${lessonId}`, 20) : { state: ns, awarded: 0 };
    ns = coinReward.state;
    const cashReward = newly ? awardCashOnce(ns, `learn:${lessonId}`, 1) : { state: ns, awarded: 0 };
    ns = cashReward.state;
    const dailyReward = ns.daily.practice ? awardCoinsOnce(ns, `daily-core:${todayStr()}`, 15) : { state: ns, awarded: 0 };
    ns = dailyReward.state;
    const dailyCash = ns.daily.practice ? awardCashOnce(ns, `daily-core:${todayStr()}`, 2) : { state: ns, awarded: 0 };
    ns = dailyCash.state;
    setState(ns);
    celebrate(state.prefs.motion !== false);
    playSuccessSound();
    const les = learnLessonById(lessonId) || phonicsUnitById(lessonId);
    const st = score >= total ? 3 : score >= total - 1 ? 2 : 1;
    setReward({
      title: score >= total ? "Xuất sắc! 🌟" : score >= total - 1 ? "Làm tốt lắm! 👍" : "Cố lên nhé! 💪",
      html: `Bạn hoàn thành Unit <b>${les?.title || ""}</b> — đúng <b>${score}/${total}</b> ở Kiểm tra nhỏ.<br>Học tiếp Unit sau hoặc luyện tập cho nhớ lâu nhé!`,
      stars: st,
      coins: coinReward.awarded + dailyReward.awarded,
      cash: cashReward.awarded + dailyCash.awarded,
      sticker: null,
    });
  }

  if (!ready) return <div style={{ padding: 40, color: "#7a8194" }}>Đang tải…</div>;

  return (
    <div id="app">
      <header className="hud">
        <button className="hud-avatar" onClick={() => setMenu((m) => !m)} aria-label="Tài khoản">{state.avatar}</button>
        <div className="hud-tokens">
          <span className="wtag fire">🔥 {state.streak}</span>
          <span className="wtag star">⭐ {stars}</span>
          <span className="wtag clubhouse coin-hud" aria-label={`${state.clubhouse.coins} Maple Coins`}><i>◆</i> {state.clubhouse.coins}</span><span className="wtag cash-hud" aria-label={`${state.clubhouse.cash} Maple Cash`}><i>✦</i> {state.clubhouse.cash}</span>
        </div>
        {menu && (
          <>
            <div className="menu-back" onClick={() => setMenu(false)} />
            <div className="avatar-menu">
              <button onClick={() => { setMenu(false); setAccount(true); }}>👤 Hồ sơ của bé</button>
              <button onClick={() => { setMenu(false); setAccount(true); }}>⚙️ Cài đặt & Gói</button>
            </div>
          </>
        )}
      </header>

      <div className={`wrap ${view === "home" || view === "adventure" ? "wide" : ""}`}>
        {view === "home" && <Today state={state} go={goView} openLesson={openCurrentLesson} openClubhouse={() => setClubhouse(true)} />}
        {view === "learn" && <Learn state={state} setState={setState} entry={learnEntry}
          onEcho={() => launch({ kind: "echo", title: "Echo" })}
          onTalk={(sceneId) => launch({ kind: "picdet", refId: sceneId, title: "Thám tử hình ảnh" })}
          onComplete={completeLearn} onPremium={openPremium} />}
        {view === "games" && <GamesHub launch={(kind) => launch({ kind, title: "Luyện tập" })} />}
        {view === "adventure" && <Adventure state={state} setState={setState} accent={state.prefs.accent} onPremium={openPremium} />}
      </div>

      <nav className="nav">
        {NAV.map(([v, i, label, mobileLabel]) => (
          <button key={v} className={(v === "clubhouse" ? clubhouse : view === v && !clubhouse) ? "on" : ""}
            onClick={() => { if (v === "clubhouse") { setClubhouse(true); return; } setClubhouse(false); goView(v); }}>
            <span className="i"><AppIcon name={i} /></span><span className={`nav-label ${mobileLabel ? "has-short" : ""}`}><span>{label}</span>{mobileLabel && <i>{mobileLabel}</i>}</span>
          </button>
        ))}
      </nav>

      {showSplash && (
        <div id="splash" role="dialog" aria-modal="true" aria-label="Chào mừng đến Speak Up Kids" onClick={() => setShowSplash(false)}>
          {state.prefs.motion !== false && Array.from({ length: 10 }, (_, i) => (
            <span key={i} className={`leaf leaf-${(i % 3) + 1}`} style={{ left: `${3 + i * 10.5}%`, animationDuration: `${4.8 + (i % 4) * 1.25}s`, animationDelay: `${i * -0.63}s` }}>🍁</span>
          ))}
          <div className="sp-banner">
            <div className="sp-card">
              <div className="sp-kicker">SPEAK UP KIDS</div>
              <div className="sp-title">Ready for today’s adventure?</div>
              <div className="sp-goal">Chào {state.nickname || "bạn nhỏ"}! Một thử thách tiếng Anh mới đang chờ bạn.</div>
              <button className="sp-cta" onClick={() => setShowSplash(false)}>Let’s go <span aria-hidden="true">→</span></button>
            </div>
          </div>
        </div>
      )}

      {game && <GamePlay kind={game.kind} refId={game.refId} accent={state.prefs.accent}
        cb={{ topics: state.games.topics, commit: commitGame, finish: finishGame, echoDone, premium: isPremium(state), onPremium: openPremium }}
        onExit={() => setGame(null)} />}

      {clubhouse && <Clubhouse state={state} setState={setState} onClose={() => setClubhouse(false)} />}
      {account && <AccountPanel state={state} setState={setState} onClose={() => setAccount(false)} />}

      {reward && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setReward(null)}>
          <div className="box journey-result">
            {reward.sticker ? (
              <div className="reward-sticker"><StickerArt id={reward.sticker.id} emoji={reward.sticker.emoji} /></div>
            ) : (
              <img className="reward-maple" src={`${GEN}${(reward.stars ?? 3) >= 2 ? "maple-pose-cheer" : "maple-pose-think"}.webp`} alt="" />
            )}
            <h3>{reward.title}</h3>
            {typeof reward.stars === "number" && <div className="gr-stars sm">{"⭐".repeat(reward.stars)}{"☆".repeat(3 - reward.stars)}</div>}
            {!!reward.coins && <div className="coin-reward"><span>◆</span> +{reward.coins} Maple Coins</div>}
            {!!reward.cash && <div className="cash-reward"><span>✦</span> +{reward.cash} Maple Cash</div>}
            <p style={{ color: "var(--muted)" }} dangerouslySetInnerHTML={{ __html: reward.html }} />
            {reward.sticker && <p className="reward-newsticker">🎁 Sticker mới: <b>{reward.sticker.name}</b>!</p>}
            <div className="result-next">
              <span className="rn-kicker">BƯỚC TIẾP THEO</span>
              <b>Luyện một lượt để nhớ lâu hơn</b>
              <small>Điểm đến tiếp theo trong hành trình hôm nay.</small>
            </div>
            <button className="btn green" onClick={() => { setReward(null); setView("games"); }}>Luyện ngay →</button>
            <button className="btn ghost sm" onClick={() => { setReward(null); setClubhouse(true); }}>Ghé Clubhouse</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== HÔM NAY — bé nên làm gì tiếp theo? ==================== */
function Today({ state, go, openLesson, openClubhouse }: {
  state: AppState; go: (v: View) => void; openLesson: (lessonId: string) => void; openClubhouse: () => void;
}) {
  const name = state.nickname || "bạn nhỏ";
  const lessonId = state.learn.currentLesson;
  const lesson = learnLessonById(lessonId) || learnLessonById("park")!;
  const doneCount = SECTIONS.filter((sc) => sectionDone(state, lesson.id, sc.key)).length;
  const nextSection = SECTIONS.find((sc) => !sectionDone(state, lesson.id, sc.key));
  const lessonDone = learnLessonDone(state, lesson.id);

  // Chiến dịch Phiêu lưu (tiến độ RIÊNG của Adventure, không liên quan Learn):
  // chương nên chơi tiếp = chương đang mở/chơi dở đầu tiên của Season 1.
  const advSeason = SEASON_LOST_COMPASS;
  const advProg = adventureOf(state, advSeason.id);
  const advResume = resumeChapter(advSeason, (id) => isChapterCompleted(state, advSeason.id, id), advProg.currentChapterId);
  const advStarted = advProg.completedChapterIds.length > 0 || !!advProg.currentChapterId;

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
  } else if (advStarted && advResume) {
    cta = { kicker: "Tiếp tục chiến dịch", title: `Phiêu lưu · ${advResume.vi}`, sub: "Chương tiếp theo trên bản đồ", label: "Chơi tiếp", run: () => go("adventure"), bg: advResume.sceneImage };
  } else {
    cta = { kicker: "Luyện cho nhớ lâu", title: "Luyện tập cùng Maple", sub: "Chơi một lượt có chấm điểm", label: "Luyện tập", run: () => go("games") };
  }

  const daily = state.daily;
  const tasks: { ic: AppIconName; label: string; done: boolean; run: () => void }[] = [
    { ic: "learn", label: "Học một chặng", done: daily.learn, run: () => openLesson(lesson.id) },
    { ic: "practice", label: "Luyện tập một lượt", done: daily.practice, run: () => go("games") },
    { ic: "adventure", label: "Khám phá Adventure · tùy chọn", done: daily.adventure, run: () => go("adventure") },
  ];
  const doneToday = tasks.filter((t) => t.done).length;
  const coreDone = [daily.learn, daily.practice].filter(Boolean).length;
  const journeyPct = Math.round((coreDone / 2) * 100);

  // Số liệu thật cho các panel/cổng ở dashboard desktop (không tạo dữ liệu giả).
  const learnedUnits = learnLessonsDone(state);
  const advDone = adventuresDone(state);
  const journeysDone = SEASONS.filter((season) => {
    const playable = season.chapters.filter(chapterPlayable);
    return playable.length > 0 && playable.every((chapter) => isChapterCompleted(state, season.id, chapter.id));
  }).length;
  const roomOwned = CLUBHOUSE_SHOP.filter((item) => state.clubhouse.purchasedItemIds.includes(item.id)).length;

  return (
    <section className="today">
      {/* Streak đã hiển thị ở HUD (🔥) — không lặp cờ streak ở đây để tránh trùng banner. */}
      <div className="today-hi">
        <div>
          <div className="hello-sign">Chào {name}! <span className="hs-wave">👋</span></div>
          <p className="today-lead">Hôm nay bé nên làm gì tiếp theo?</p>
        </div>
      </div>

      <section className={`daily-journey ${coreDone === 2 ? "complete" : ""}`} aria-label="Hành trình học hôm nay">
        <header>
          <div>
            <span className="dj-kicker">HÀNH TRÌNH HÔM NAY</span>
            <b>{coreDone === 2 ? "Xong bài hôm nay — ghé Clubhouse thôi!" : "Học một chặng, luyện một lượt"}</b>
          </div>
          <strong>{coreDone}/2</strong>
        </header>
        <div className="dj-track"><i style={{ width: `${journeyPct}%` }} /></div>
        <div className="dj-steps">
          {tasks.slice(0, 2).map((task, index) => (
            <button key={task.label} className={task.done ? "done" : index === coreDone ? "current" : ""} onClick={task.run}>
              <span>{task.done ? "✓" : index + 1}</span>
              <small>{index === 0 ? "Học" : "Luyện"}</small>
            </button>
          ))}
          <button className={coreDone === 2 ? "gift ready" : "gift"} onClick={openClubhouse}>
            <span>🏡</span><small>Clubhouse</small>
          </button>
        </div>
      </section>

      {/* CTA chính duy nhất */}
      <button className="next-card" onClick={cta.run}>
        {(cta.bg || lesson.sceneImage) && <img className="nc-img" src={cta.bg || lesson.sceneImage} alt="" />}
        <span className="nc-body">
          <span className="nc-kicker">{cta.kicker}</span>
          <span className="nc-title">{cta.title}</span>
          <span className="nc-sub">{cta.sub}</span>
          <span className="nc-cta">▶ {cta.label}</span>
        </span>
      </button>

      {/* Ba nhiệm vụ hôm nay */}
      <h2 className="chapter">Hoạt động hôm nay · {doneToday}/3</h2>
      <div className="daily-tasks">
        {tasks.map((t) => (
          <button key={t.label} className={`dtask ${t.done ? "done" : ""}`} onClick={t.run}>
            <span className="dt-ic">{t.done ? <AppIcon name="check" /> : <AppIcon name={t.ic} />}</span>
            <span className="dt-label">{t.label}</span>
            <span className="dt-go">{t.done ? "Đã xong" : "▸"}</span>
          </button>
        ))}
      </div>

      {/* Tiến độ ngắn gọn */}
      <div className="today-stats">
        <span className="ts"><b><AppIcon name="streak" />{state.streak}</b>chuỗi ngày</span>
        <span className="ts"><b><AppIcon name="star" />{totalStars(state)}</b>tổng sao</span>
        <span className="ts"><b><span className="coin-gem">◆</span>{state.clubhouse.coins}</b>Maple Coins</span>
      </div>

      {/* Thành quả gần nhất */}
      {(learnedUnits > 0 || advDone > 0) && (
        <div className="today-recent">
          🎉 Gần đây: đã học xong <b>{learnedUnits}</b> Unit
          {advDone > 0 && <> · vượt <b>{advDone}</b> chương phiêu lưu</>}.
        </div>
      )}

      <button className={`clubhouse-widget ${coreDone === 2 ? "gift-ready" : ""}`} onClick={openClubhouse}>
        <span className="chw-preview">
          <img src="/assets/images/clubhouse/maple-clubhouse-room-v2.webp" alt="" />
          <i aria-hidden="true">◆</i>
        </span>
        <span className="chw-copy">
          <span className="chw-kicker">MAPLE CLUBHOUSE</span>
          <b>{coreDone === 2 ? "Đã xong Học + Luyện — vào nâng cấp phòng!" : "Xây Clubhouse theo phong cách của con"}</b>
          <small>{state.clubhouse.coins} Coins · {roomOwned}/{CLUBHOUSE_SHOP.length} món nội thất đã sở hữu</small>
        </span>
        <span className="chw-go">Vào phòng ▸</span>
      </button>

      {/* ===== Chỉ hiện ở desktop — ẩn trên mobile qua CSS. Cùng dữ liệu, cùng ngôn ngữ card như mobile. ===== */}
      {/* Ba module: mở rộng điều hướng (không dựng hệ thống cổng phức tạp) */}
      <nav className="today-portals" aria-label="Khu học tập">
        <button className="tp-card tp-learn" onClick={() => go("learn")}>
          <span className="tp-ic" aria-hidden="true"><AppIcon name="learn" /></span>
          <span className="tp-txt"><span className="tp-t">Học</span><span className="tp-s">{learnedUnits}/{TOTAL_UNITS} Unit</span></span>
          <span className="tp-go">▸</span>
        </button>
        <button className="tp-card tp-games" onClick={() => go("games")}>
          <span className="tp-ic" aria-hidden="true"><AppIcon name="practice" /></span>
          <span className="tp-txt"><span className="tp-t">Luyện tập</span><span className="tp-s">{gamesDone(state)} lượt chơi</span></span>
          <span className="tp-go">▸</span>
        </button>
        <button className="tp-card tp-adv" onClick={() => go("adventure")}>
          <span className="tp-ic" aria-hidden="true"><AppIcon name="adventure" /></span>
          <span className="tp-txt"><span className="tp-t">Phiêu lưu</span><span className="tp-s">{advDone} chương · {journeysDone}/{SEASONS.length} bản đồ</span></span>
          <span className="tp-go">▸</span>
        </button>
      </nav>

      {/* Panel tiến độ ngắn cạnh CTA (dữ liệu đã có, không phải widget mới) */}
      <div className="td-panel td-progress">
        <div className="tdp-h">Tiến độ học</div>
        <div className="tdp-bar"><i style={{ width: `${TOTAL_UNITS ? Math.round((learnedUnits / TOTAL_UNITS) * 100) : 0}%` }} /></div>
        <div className="tdp-meta">{learnedUnits}/{TOTAL_UNITS} Unit đã hoàn thành</div>
      </div>
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
            <span className="po-name sm">{g.name}</span>
            <span className="po-en">{g.vi}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ==================== TÀI KHOẢN + GÓI (từ avatar) ==================== */
// Mô tả gói phải khớp lib/gating.ts — sửa gating thì sửa cả đây.
const PLAN_FEATS = {
  free: [
    "Level 0 Phonics đầy đủ",
    "3 bài đầu mỗi cấp L1·L2 · 3 bài đầu mỗi collection L3",
    "3 bộ đầu mỗi trò Luyện tập (Nghe & chọn: 2 bộ)",
    "2 mùa Phiêu lưu đầu",
  ],
  pro: [
    "Mở khóa TẤT CẢ bài học Learn",
    "Toàn bộ trò Luyện tập",
    "Tất cả 8 mùa Phiêu lưu",
    "Mua một lần · dùng trọn đời",
  ],
};

function AccountPanel({ state, setState, onClose }: { state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; onClose: () => void }) {
  const [name, setName] = useState(state.nickname);
  const [parentEmail, setParentEmail] = useState<string | null>(null);
  const [weeklyMail, setWeeklyMail] = useState<boolean | null>(null);
  const p = state.prefs;
  const pro = isPremium(state);
  useEffect(() => {
    if (!cloudEnabled()) return;
    currentUser().then((u) => setParentEmail(u?.email ?? null));
    getWeeklyEmailPref().then(setWeeklyMail);
  }, []);
  function toggleWeeklyMail(on: boolean) {
    setWeeklyMail(on);                        // optimistic — pref phụ, lỗi mạng không nghiêm trọng
    setWeeklyEmailPref(on).catch(() => {});
  }
  return (
    <div id="account-panel" className="game-overlay">
      <div className="game-top"><button className="bk" onClick={onClose}>← Đóng</button><h3>👤 Tài khoản</h3></div>
      <div className="game-body">
        {cloudEnabled() && (
          <>
            <div className="section-title"><h2>Tài khoản ba mẹ</h2></div>
            <div className="card" style={{ padding: 16 }}>
              <div className="field"><label>Email đăng nhập</label><div style={{ fontWeight: 700 }}>{parentEmail || "…"}</div></div>
              <div className="field"><label>Đang xem hồ sơ</label><div style={{ fontWeight: 700 }}>{state.avatar} {state.nickname || "bé"}</div></div>
              {weeklyMail !== null && (
                <div className="row" style={{ marginTop: 2 }}>
                  <label className={`toggle ${weeklyMail ? "on" : ""}`}>
                    <input type="checkbox" checked={weeklyMail} onChange={(e) => toggleWeeklyMail(e.target.checked)} /> Nhận báo cáo tuần qua email
                  </label>
                </div>
              )}
              <div className="row" style={{ gap: 10, marginTop: 4 }}>
                <button className="btn" onClick={() => { clearActiveChild(); location.reload(); }}>Đổi hồ sơ con</button>
                <button className="btn" style={{ background: "#e2593f" }} onClick={async () => { await signOut(); location.reload(); }}>Đăng xuất</button>
              </div>
            </div>
          </>
        )}
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
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <span className="pname">{state.membership === "family" ? "Family" : pro ? "Pro" : "Miễn phí"}</span>
            <span className="price">{pro ? "Trọn đời" : "Đang dùng"}</span>
          </div>
          <ul>{(pro ? PLAN_FEATS.pro : PLAN_FEATS.free).map((f) => <li key={f}>{f}</li>)}</ul>
          <div className="chip" style={{ marginTop: 10 }}>Đang dùng</div>
        </div>
        {!pro && (
          <div className="card plan">
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <span className="pname">Pro</span><span className="chip sun">Sắp mở bán</span>
            </div>
            <ul>{PLAN_FEATS.pro.map((f) => <li key={f}>{f}</li>)}</ul>
            <button className="btn ghost sm" disabled style={{ marginTop: 10, opacity: 0.7 }}>Nâng cấp (sắp có)</button>
          </div>
        )}
        {!pro && cloudEnabled() && <RedeemBox onActivated={(plan) => setState((s) => ({ ...s, membership: plan }))} />}
      </div>
    </div>
  );
}

// Nhập mã kích hoạt mua từ đại lý → RPC redeem_code phía server cấp gói lifetime.
function RedeemBox({ onActivated }: { onActivated: (plan: "pro" | "family") => void }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  async function go() {
    if (!code.trim() || busy) return;
    setBusy(true); setMsg(null);
    const r = await redeemCode(code);
    setBusy(false);
    if (r === "ok:pro" || r === "ok:family") {
      const plan = r === "ok:family" ? "family" as const : "pro" as const;
      onActivated(plan);
      setMsg({ ok: true, text: `🎉 Kích hoạt thành công gói ${plan === "family" ? "Family" : "Pro"} trọn đời!` });
    } else if (r === "invalid") setMsg({ ok: false, text: "Mã không đúng — kiểm tra lại nhé." });
    else if (r === "used") setMsg({ ok: false, text: "Mã này đã được sử dụng." });
    else if (r === "already") setMsg({ ok: false, text: "Tài khoản đã có gói rồi." });
    else setMsg({ ok: false, text: "Có lỗi mạng — thử lại sau nhé." });
  }
  return (
    <div className="card" style={{ padding: 16, marginTop: 10 }}>
      <div className="field"><label>Có mã kích hoạt? (mua từ đại lý)</label>
        <div className="row" style={{ gap: 8 }}>
          <input type="text" placeholder="SPK-XXXX-XXXX" value={code} style={{ flex: 1, textTransform: "uppercase" }}
            onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} />
          <button className="btn" disabled={busy || !code.trim()} onClick={go}>{busy ? "…" : "Kích hoạt"}</button>
        </div>
      </div>
      {msg && <p style={{ margin: "6px 0 0", fontWeight: 700, fontSize: ".85rem", color: msg.ok ? "var(--green)" : "#e03131" }}>{msg.text}</p>}
    </div>
  );
}

// Cổng đăng nhập bọc ngoài: khi bật cloud thì yêu cầu đăng nhập + chọn hồ sơ con;
// khi chưa cấu hình cloud thì AuthGate cho qua thẳng, app chạy offline như cũ.
export default function Page() {
  return (
    <AuthGate>
      <App />
    </AuthGate>
  );
}
