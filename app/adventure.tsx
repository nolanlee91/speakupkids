"use client";

// ============================================================================
// KHU PHIÊU LƯU — module kể chuyện độc lập (Season → Chapter).
// Bản đồ chỉ là ẢNH NỀN; đường đi, node, khoá/hoàn thành, Maple đều là overlay React.
// Không lấy tiến độ/câu hỏi từ Learn hay Games. Xem lib/adventures.ts + lib/state.ts.
// ============================================================================

import { useEffect, useRef, useState } from "react";
import type { AppState } from "@/lib/state";
import {
  adventureOf, isChapterCompleted, hasAdventureItem,
  completeChapter, setCurrentChapter, resetAdventure,
} from "@/lib/state";
import {
  SEASON_LOST_COMPASS, chapterById, itemById, chapterStatesFor, chapterPlayable, resumeChapter,
  type AdventureSeason, type AdventureChapter, type StoryStep, type ChapterUiState,
} from "@/lib/adventures";
import { speak, shuffle, celebrate } from "@/lib/fx";

const CHAR = "/assets/images/adventure/season-01-lost-maple-compass/characters/";
const MAPLE_IDLE = CHAR + "maple-map-idle.webp";
const MAPLE_WALK = CHAR + "maple-map-walk.webp";

/* Tôn trọng prefers-reduced-motion (kết hợp với công tắc motion trong Cài đặt). */
function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduce;
}

/* ==================== Component gốc: Home → Map → Chapter player ==================== */
export function Adventure({ state, setState, accent }: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  accent: "US" | "CA";
}) {
  const season = SEASON_LOST_COMPASS;
  const [screen, setScreen] = useState<"home" | "map">("home");
  const [playing, setPlaying] = useState<string | null>(null);
  const [travelFrom, setTravelFrom] = useState<string | null>(null); // chương vừa xong → Maple đi tiếp

  const reduce = usePrefersReducedMotion();
  const animate = state.prefs.motion !== false && !reduce;

  const isDone = (chId: string) => isChapterCompleted(state, season.id, chId);

  function openChapter(ch: AdventureChapter) {
    setState((s) => setCurrentChapter(s, season.id, ch.id));
    setTravelFrom(null);
    setPlaying(ch.id);
  }

  function finishChapter(ch: AdventureChapter, stars: number) {
    const wasNew = !isChapterCompleted(state, season.id, ch.id);
    setState((s) => completeChapter(s, season.id, ch.id, { itemId: ch.reward?.itemId, extraItemIds: ch.reward?.extraItemIds, nextChapterId: ch.nextChapterId }).state);
    if (wasNew) celebrate(animate);
    setPlaying(null);
    // Chỉ diễn hoạt cảnh Maple đi sang node mới khi vừa hoàn thành lần đầu và còn chương kế.
    setTravelFrom(wasNew && ch.nextChapterId ? ch.id : null);
  }

  if (playing) {
    const ch = chapterById(season.id, playing);
    if (ch && chapterPlayable(ch)) {
      return (
        <ChapterPlayer
          season={season} chapter={ch} accent={accent}
          alreadyCompleted={isChapterCompleted(state, season.id, ch.id)}
          alreadyHasItem={!!ch.reward?.itemId && hasAdventureItem(state, season.id, ch.reward.itemId)}
          onExit={() => setPlaying(null)}
          onFinish={(stars) => finishChapter(ch, stars)}
        />
      );
    }
  }

  if (screen === "home") {
    return <AdventureHome season={season} state={state} onStart={() => setScreen("map")} />;
  }
  return (
    <SeasonMap
      season={season} state={state} animate={animate}
      travelFrom={travelFrom} onTravelDone={() => setTravelFrom(null)}
      onBack={() => setScreen("home")}
      onOpen={openChapter}
      onReset={() => setState((s) => resetAdventure(s))}
    />
  );
}

/* ==================== 1) ADVENTURE HOME ==================== */
function AdventureHome({ season, state, onStart }: {
  season: AdventureSeason; state: AppState; onStart: () => void;
}) {
  const prog = adventureOf(state, season.id);
  const doneCount = prog.completedChapterIds.length;
  const total = season.chapters.length;
  const started = doneCount > 0 || !!prog.currentChapterId;
  const cover = season.chapters[0].sceneImage;

  return (
    <section className="adv-home">
      <header className="adv-hero">
        <h2 className="adv-hero-title">Maple’s Adventures 🧭</h2>
        <p className="adv-hero-sub">Dùng vốn tiếng Anh để giải bí ẩn và khám phá những vùng đất mới.</p>
      </header>

      <button className="season-card" onClick={onStart}>
        {cover && <img className="sc-img" src={cover} alt="" />}
        <span className="sc-body">
          <span className="sc-kicker">Season 1 · Chiến dịch</span>
          <span className="sc-title">{season.title}</span>
          <span className="sc-vi">{season.vi}</span>
          <span className="sc-meta">
            <span className="sc-progress"><b>{doneCount}</b> / {total} chương</span>
            <span className="sc-cta">{started ? "Tiếp tục phiêu lưu ▸" : "Bắt đầu phiêu lưu ▸"}</span>
          </span>
        </span>
      </button>

      <ItemShelf season={season} state={state} />
    </section>
  );
}

/* Kệ vật phẩm câu chuyện — dùng emoji/silhouette trung tính (chưa có ảnh item). */
function ItemShelf({ season, state }: { season: AdventureSeason; state: AppState }) {
  const owned = adventureOf(state, season.id).collectedItemIds;
  return (
    <div className="item-shelf">
      <h3 className="ish-head">Vật phẩm câu chuyện</h3>
      <p className="ish-sub">Thu thập manh mối để ghép lại chiếc la bàn của Maple.</p>
      <div className="ish-grid">
        {season.items.map((it) => {
          const has = owned.includes(it.id);
          return (
            <div key={it.id} className={`ish-item ${has ? "got" : "locked"}`} title={has ? `${it.vi}` : "Chưa mở khoá"}>
              <span className="ish-emoji" aria-hidden="true">{has ? it.emoji : "❔"}</span>
              <span className="ish-name">{has ? it.vi : "???"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==================== 2) SEASON MAP (overlay trên ảnh nền 16:9) ==================== */
function SeasonMap({ season, state, animate, travelFrom, onTravelDone, onBack, onOpen, onReset }: {
  season: AdventureSeason; state: AppState; animate: boolean;
  travelFrom: string | null; onTravelDone: () => void;
  onBack: () => void; onOpen: (ch: AdventureChapter) => void; onReset: () => void;
}) {
  const isDone = (chId: string) => isChapterCompleted(state, season.id, chId);
  const prog = adventureOf(state, season.id);
  const states = chapterStatesFor(season, isDone, prog.currentChapterId);
  const doneCount = prog.completedChapterIds.length;
  const [hint, setHint] = useState<string>("");

  // Node Maple đứng nghỉ (chương nên chơi tiếp), hoặc chương cuối nếu đã xong hết.
  const resume = resumeChapter(season, isDone, prog.currentChapterId);
  const restChapter = resume || [...season.chapters].reverse().find((c) => isDone(c.id)) || season.chapters[0];

  // ----- Vị trí & animation của Maple -----
  const fromCh = travelFrom ? chapterById(season.id, travelFrom) : undefined;
  const toCh = fromCh?.nextChapterId ? chapterById(season.id, fromCh.nextChapterId) : undefined;
  const [pos, setPos] = useState(() => (restChapter ? restChapter.node : { x: 15, y: 70 }));
  const [walking, setWalking] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (travelFrom && fromCh && toCh) {
      if (!animate) { setPos(toCh.node); onTravelDone(); return; }
      doneRef.current = false;
      setPos(fromCh.node); setWalking(true);
      const t = window.setTimeout(() => setPos(toCh.node), 60); // để transition kịp bắt đầu
      // Dự phòng nếu transitionend không bắn (đề phòng): kết thúc sau 1.6s.
      const guard = window.setTimeout(() => {
        if (!doneRef.current) { doneRef.current = true; setWalking(false); onTravelDone(); }
      }, 1600);
      return () => { window.clearTimeout(t); window.clearTimeout(guard); };
    }
    // Không di chuyển: đứng nghỉ ở node hiện tại.
    setWalking(false);
    setPos(restChapter ? restChapter.node : { x: 15, y: 70 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelFrom, animate]);

  function onMapleTransitionEnd(e: React.TransitionEvent) {
    if ((e.propertyName === "left" || e.propertyName === "top") && walking && !doneRef.current) {
      doneRef.current = true;
      setWalking(false);
      onTravelDone();
    }
  }

  function clickNode(ch: AdventureChapter, st: ChapterUiState) {
    if (st === "completed" || st === "available" || st === "inProgress") { onOpen(ch); return; }
    // locked
    if (!chapterPlayable(ch)) setHint(`“${ch.title}” · Chương này sắp ra mắt 🔒`);
    else setHint("Hoàn thành chương trước để mở khoá node này.");
  }

  const dev = process.env.NODE_ENV !== "production";

  return (
    <section className="adv-map-wrap">
      <div className="adv-map-bar">
        <button className="bk" onClick={onBack}>← Phiêu lưu</button>
        <div className="amb-info">
          <span className="amb-title">{season.title}</span>
          <span className="amb-prog">Đã phá <b>{doneCount}</b>/{season.chapters.length} chương</span>
        </div>
      </div>

      {/* Khung 16:9 — KHÔNG crop bằng cover để toạ độ node không lệch. */}
      <div className="adv-map-frame">
        <img className="adv-map-img" src={season.mapImage} alt="" aria-hidden="true" />

        {/* Đường đi giữa các node (SVG overlay, toạ độ theo %). */}
        <svg className="adv-map-routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {season.chapters.slice(0, -1).map((ch, i) => {
            const next = season.chapters[i + 1];
            const revealed = isDone(ch.id); // đoạn đường "sáng" khi chương trước đã xong
            return (
              <line key={ch.id} x1={ch.node.x} y1={ch.node.y} x2={next.node.x} y2={next.node.y}
                className={`route ${revealed ? "on" : ""}`} vectorEffect="non-scaling-stroke" />
            );
          })}
        </svg>

        {/* Các node chương. */}
        {season.chapters.map((ch, i) => {
          const st = states[i];
          const label = `Chương ${ch.chapterNumber}: ${ch.vi} — ${
            st === "completed" ? "đã hoàn thành" : st === "locked" ? "đã khoá" : "đang mở"}`;
          return (
            <button key={ch.id} className={`map-node ${st}`} style={{ left: `${ch.node.x}%`, top: `${ch.node.y}%` }}
              aria-label={label} title={`${ch.chapterNumber}. ${ch.title}`}
              onClick={() => clickNode(ch, st)}>
              <span className="mn-badge">
                {st === "completed" ? "✓" : st === "locked" ? "🔒" : ch.chapterNumber}
              </span>
              <span className="mn-tip">{ch.chapterNumber}. {ch.vi}</span>
            </button>
          );
        })}

        {/* Maple trên bản đồ (asset trong suốt). */}
        <img
          className={`map-maple ${walking ? "walking" : "idle"}`}
          style={{ left: `${pos.x}%`, top: `${pos.y}%`, transitionDuration: animate ? "1.2s" : "0s" }}
          src={walking ? MAPLE_WALK : MAPLE_IDLE} alt="" aria-hidden="true"
          onTransitionEnd={onMapleTransitionEnd}
        />
      </div>

      {/* Thẻ xem trước / CTA chơi tiếp. */}
      <MapPreview season={season} restChapter={restChapter} isDone={isDone} onOpen={onOpen} hint={hint} />

      {dev && (
        <button className="adv-dev-reset" onClick={() => { onReset(); setHint(""); }}>
          ⟲ Reset Adventure Progress (dev)
        </button>
      )}
    </section>
  );
}

function MapPreview({ season, restChapter, isDone, onOpen, hint }: {
  season: AdventureSeason; restChapter: AdventureChapter; isDone: (id: string) => boolean;
  onOpen: (ch: AdventureChapter) => void; hint: string;
}) {
  const allDone = season.chapters.filter(chapterPlayable).every((c) => isDone(c.id));
  const done = isDone(restChapter.id);
  return (
    <div className="map-preview">
      {hint && <div className="mp-hint">{hint}</div>}
      <div className="mp-row">
        <span className="mp-num">{restChapter.chapterNumber}</span>
        <div className="mp-txt">
          <div className="mp-title">{restChapter.vi} <small>· {restChapter.title}</small></div>
          <div className="mp-desc">{restChapter.shortDescription}</div>
        </div>
        <button className="btn accent mp-play" onClick={() => onOpen(restChapter)}>
          {done ? "Chơi lại ▸" : "Bắt đầu ▸"}
        </button>
      </div>
      {allDone && <div className="mp-alldone">🎉 Bạn đã phá hết các chương hiện có. Chương mới sắp ra mắt!</div>}
    </div>
  );
}

/* ==================== 4) CHAPTER PLAYER (dùng chung cho mọi chương) ==================== */
function ChapterPlayer({ season, chapter, accent, alreadyCompleted, alreadyHasItem, onExit, onFinish }: {
  season: AdventureSeason; chapter: AdventureChapter; accent: "US" | "CA";
  alreadyCompleted: boolean; alreadyHasItem: boolean;
  onExit: () => void; onFinish: (stars: number) => void;
}) {
  const steps = chapter.storySteps!;
  const [phase, setPhase] = useState<"cover" | "steps" | "result">("cover");
  const [si, setSi] = useState(0);
  const [wrong, setWrong] = useState(0);

  const maxStars = chapter.reward?.stars ?? 3;
  const stars = Math.max(1, Math.min(maxStars, 3 - Math.min(2, wrong)));
  const scored = steps.filter((s) => s.kind === "observation" || s.kind === "multipleChoice" || s.kind === "arrangeSentence").length;

  function stepDone(nWrong: number) {
    if (nWrong) setWrong((w) => w + nWrong);
    if (si + 1 < steps.length) setSi(si + 1);
    else setPhase("result");
  }

  return (
    <div id="adv-game" className="game-overlay">
      <div className="game-top">
        <button className="bk" onClick={onExit}>← Bản đồ</button>
        <h3>🧭 {chapter.vi}</h3>
        <span className="game-vi">
          {phase === "steps" ? `Bước ${si + 1}/${steps.length}` : phase === "result" ? "Hoàn thành" : "Câu chuyện"}
        </span>
      </div>

      <div className="game-body">
        {phase === "cover" && (
          <ChapterCover chapter={chapter} onStart={() => { setPhase("steps"); setSi(0); }} />
        )}

        {phase === "steps" && (
          <>
            {chapter.sceneImage && (
              <div className="chap-scene">
                <img src={chapter.sceneImage} alt={`Minh hoạ: ${chapter.vi}`} loading="lazy" />
              </div>
            )}
            <StoryStepRenderer key={si} step={steps[si]} season={season} accent={accent} onDone={stepDone} />
          </>
        )}

        {phase === "result" && (
          <ChapterResult
            season={season} chapter={chapter} stars={stars}
            firstTime={!alreadyCompleted} showItem={!!chapter.reward?.itemId && !alreadyHasItem}
            scoredCount={scored} wrong={wrong}
            onExit={() => onFinish(stars)}
          />
        )}
      </div>
    </div>
  );
}

function ChapterCover({ chapter, onStart }: { chapter: AdventureChapter; onStart: () => void }) {
  return (
    <div className="chap-cover">
      {chapter.sceneImage && <div className="cc-scene"><img src={chapter.sceneImage} alt={`Cảnh: ${chapter.vi}`} /></div>}
      <div className="cc-kick">Chương {chapter.chapterNumber} · ~{chapter.estimatedMinutes} phút</div>
      <h2 className="cc-title">{chapter.title}</h2>
      <div className="cc-vi">{chapter.vi}</div>
      <p className="cc-desc">{chapter.shortDescription}</p>
      <button className="btn accent cc-go" onClick={onStart}>Bắt đầu chương →</button>
    </div>
  );
}

/* ==================== StoryStepRenderer + các dạng bước ==================== */
function StoryStepRenderer({ step, season, accent, onDone }: {
  step: StoryStep; season: AdventureSeason; accent: "US" | "CA"; onDone: (wrong: number) => void;
}) {
  switch (step.kind) {
    case "dialogue": return <DialogueStep step={step} accent={accent} onDone={onDone} />;
    case "observation": return <ObservationStep step={step} onDone={onDone} />;
    case "multipleChoice": return <McqStep step={step} accent={accent} onDone={onDone} />;
    case "arrangeSentence": return <ArrangeStep step={step} accent={accent} onDone={onDone} />;
    case "clueReveal": return <ClueStep step={step} season={season} onDone={onDone} />;
  }
}

const WHO_META: Record<string, { emoji: string; cls: string }> = {
  maple: { emoji: "🍁", cls: "who-maple" },
  narrator: { emoji: "📖", cls: "who-narrator" },
  stranger: { emoji: "🧑", cls: "who-stranger" },
};

function DialogueStep({ step, accent, onDone }: {
  step: Extract<StoryStep, { kind: "dialogue" }>; accent: "US" | "CA"; onDone: (wrong: number) => void;
}) {
  const meta = WHO_META[step.who];
  const who = step.name || (step.who === "maple" ? "Maple" : step.who === "narrator" ? "Người kể" : "Người lạ");
  return (
    <div className={`chap-dialogue ${meta.cls}`}>
      <div className="cd-fig">
        {step.who === "maple"
          ? <img src={MAPLE_IDLE} alt="" />
          : <span className="cd-emoji" aria-hidden="true">{meta.emoji}</span>}
      </div>
      <div className="cd-bubble">
        <div className="cd-who">{who}</div>
        <div className="cd-en">{step.en}</div>
        <div className="cd-vi">{step.vi}</div>
        <button className="icbtn sm" onClick={() => speak(step.en, accent)}>🔊 Nghe</button>
      </div>
      <button className="btn accent chap-next" onClick={() => onDone(0)}>Tiếp →</button>
    </div>
  );
}

function ObservationStep({ step, onDone }: {
  step: Extract<StoryStep, { kind: "observation" }>; onDone: (wrong: number) => void;
}) {
  const [opts] = useState(() => shuffle(step.options));
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState(0);
  const chosen = picked !== null ? opts[picked] : null;
  return (
    <div className="chap-q">
      <span className="chap-kind">🔍 Quan sát</span>
      <div className="chap-prompt">{step.prompt}<div className="chap-prompt-vi">{step.vi}</div></div>
      <div className="choice-list">
        {opts.map((o, k) => (
          <button key={k} disabled={chosen?.correct}
            className={`choice-card ${picked === k ? (o.correct ? "right" : "wrong") : ""}`}
            onClick={() => { if (chosen?.correct) return; setPicked(k); if (!o.correct) setWrong((w) => w + 1); }}>
            {o.label}
          </button>
        ))}
      </div>
      {chosen && (
        <>
          <div className="qfb">{chosen.correct ? <span className="ok">✓ {chosen.feedback}</span> : <span className="no">✗ {chosen.feedback}</span>}</div>
          {chosen.correct && <button className="btn qnext" onClick={() => onDone(wrong ? 1 : 0)}>Tiếp →</button>}
        </>
      )}
    </div>
  );
}

function McqStep({ step, accent, onDone }: {
  step: Extract<StoryStep, { kind: "multipleChoice" }>; accent: "US" | "CA"; onDone: (wrong: number) => void;
}) {
  const [opts] = useState(() => shuffle(step.options));
  const [picked, setPicked] = useState<string | null>(null);
  const answered = picked !== null;
  const correct = picked === step.answer;
  return (
    <div className="chap-q">
      <span className="chap-kind">💡 Đọc hiểu</span>
      <div className="chap-prompt">{step.prompt}<div className="chap-prompt-vi">{step.vi}</div></div>
      <div className={`qopts ${answered ? "answered" : ""}`}>
        {opts.map((o) => (
          <button key={o} disabled={answered}
            className={`qopt ${answered && o === step.answer ? "right" : ""} ${answered && o === picked && o !== step.answer ? "wrong" : ""}`}
            onClick={() => setPicked(o)}>{o}</button>
        ))}
      </div>
      {answered && (
        <>
          <div className="qfb">
            {correct ? <span className="ok">✓ Chính xác!</span> : <><span className="no">✗ Chưa đúng.</span> Đáp án: <b>{step.answer}</b></>}
            <div className="q-explain">💡 {step.explainVi}</div>
          </div>
          <button className="btn qnext" onClick={() => onDone(correct ? 0 : 1)}>Tiếp →</button>
        </>
      )}
    </div>
  );
}

function ArrangeStep({ step, accent, onDone }: {
  step: Extract<StoryStep, { kind: "arrangeSentence" }>; accent: "US" | "CA"; onDone: (wrong: number) => void;
}) {
  const [bank, setBank] = useState<string[]>(() => shuffle(step.solution));
  const [placed, setPlaced] = useState<string[]>([]);
  const [result, setResult] = useState<null | boolean>(null);
  const target = step.solution.join(" ");
  return (
    <div className="chap-q">
      <span className="chap-kind">🧩 Xếp câu</span>
      <div className="chap-prompt">{step.prompt}<div className="chap-prompt-vi">{step.vi}</div></div>
      <div className={`puzzle-line ${result === true ? "ok" : result === false ? "no" : ""}`}>
        {placed.length === 0 && <span className="ph">Chạm từ bên dưới để xếp câu…</span>}
        {placed.map((w, k) => (
          <button key={k} className="tile placed" onClick={() => { if (result !== null) return; setPlaced((p) => p.filter((_, i) => i !== k)); setBank((b) => [...b, w]); }}>{w}</button>
        ))}
      </div>
      <div className="puzzle-bank">
        {bank.map((w, k) => (
          <button key={k} className="tile" onClick={() => { if (result !== null) return; setBank((b) => b.filter((_, i) => i !== k)); setPlaced((p) => [...p, w]); }}>{w}</button>
        ))}
      </div>
      {result === null ? (
        <button className="btn" disabled={placed.length !== step.solution.length} onClick={() => setResult(placed.join(" ") === target)}>Kiểm tra</button>
      ) : (
        <>
          <div className="qfb">
            {result ? <span className="ok">✓ Chuẩn luôn!</span> : <><span className="no">✗ Chưa đúng.</span> Đáp án: <b>{target}.</b></>}
            {step.explainVi && <div className="q-explain">💡 {step.explainVi}</div>}
          </div>
          <div className="talk-say"><span className="talk-say-en">🗣️ {step.say || target + "."}</span><button className="icbtn" onClick={() => speak(step.say || target, accent)}>🔊 Nghe</button></div>
          <button className="btn qnext" onClick={() => onDone(result ? 0 : 1)}>Tiếp →</button>
        </>
      )}
    </div>
  );
}

function ClueStep({ step, season, onDone }: {
  step: Extract<StoryStep, { kind: "clueReveal" }>; season: AdventureSeason; onDone: (wrong: number) => void;
}) {
  const item = step.itemId ? itemById(season, step.itemId) : undefined;
  return (
    <div className="chap-clue">
      <div className="clue-badge" aria-hidden="true">{item ? item.emoji : "🔦"}</div>
      <div className="clue-title">Manh mối: {step.title}</div>
      <div className="clue-en">{step.en}</div>
      <div className="clue-vi">{step.vi}</div>
      <button className="btn accent chap-next" onClick={() => onDone(0)}>Nhận manh mối →</button>
    </div>
  );
}

/* ==================== 6) CHAPTER RESULT ==================== */
function ChapterResult({ season, chapter, stars, firstTime, showItem, scoredCount, wrong, onExit }: {
  season: AdventureSeason; chapter: AdventureChapter; stars: number;
  firstTime: boolean; showItem: boolean; scoredCount: number; wrong: number; onExit: () => void;
}) {
  const item = chapter.reward?.itemId ? itemById(season, chapter.reward.itemId) : undefined;
  const correct = Math.max(0, scoredCount - wrong);
  return (
    <div className="chap-result">
      <div className="cr-stars">{"★★★".slice(0, stars)}<span className="cr-dim">{"★★★".slice(stars)}</span></div>
      <h2 className="cr-title">{firstTime ? "Hoàn thành chương! 🎉" : "Chơi lại xong! 👍"}</h2>
      <p className="cr-line">Bạn trả lời đúng <b>{correct}/{scoredCount}</b> thử thách ngôn ngữ.</p>

      {chapter.reward && (
        <div className={`cr-reward ${showItem ? "new" : "have"}`}>
          <span className="cr-item" aria-hidden="true">{item ? item.emoji : "🔦"}</span>
          <div>
            <div className="cr-reward-t">{showItem ? "Vật phẩm mới!" : "Manh mối"} · {chapter.reward.clueTitle}</div>
            <div className="cr-reward-d">{chapter.reward.clueVi}</div>
          </div>
        </div>
      )}

      {firstTime && chapter.nextChapterId
        ? <p className="cr-next">🗺️ Maple sẽ đi tới chương tiếp theo trên bản đồ…</p>
        : !chapter.nextChapterId && <p className="cr-next">🏁 Đây là chương cuối hiện có.</p>}

      <button className="btn accent cr-go" onClick={onExit}>Về bản đồ →</button>
    </div>
  );
}
