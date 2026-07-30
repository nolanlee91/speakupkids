"use client";

import { useEffect, useRef, useState } from "react";
import { speak, shuffle, celebrate, playFeedbackSound, playSuccessSound } from "@/lib/fx";
import { speechScoringSupported } from "@/lib/speech";
import { MicCheck } from "./speakcheck";
import { ECHO, ROUND_SIZE, type StopKind } from "@/lib/games";
import { DETECTIVE_SCENES, detectiveSceneById, talkSceneById } from "@/lib/scenes";
import { practiceItemLocked } from "@/lib/gating";
import { PUZZLE_SETS, RIDDLE_SETS, LISTEN_SETS, puzzleSetById, riddleSetById, listenSetById } from "@/lib/banks";
import {
  EMPTY_TOPIC, selectRound, countByDifficulty, starsFor, picdetDifficulty, talkDifficulty, puzzleDifficulty,
  type GameTopicProgress, type RoundResult, type Difficulty,
} from "@/lib/gameplay";

/* Chọn độ khó: trẻ TỰ CHỌN mức muốn chơi (không khoá) — như chọn Level ở Learn. */
const DIFF_LIST: Difficulty[] = ["easy", "medium", "hard"];
const DIFF_VI: Record<Difficulty, string> = { easy: "Dễ", medium: "Vừa", hard: "Khó" };
function DifficultyBar({ value, onChange }: { value: Difficulty; onChange: (d: Difficulty) => void }) {
  return (
    <div className="diff-bar" role="tablist" aria-label="Chọn độ khó">
      {DIFF_LIST.map((d) => (
        <button key={d} role="tab" aria-selected={value === d}
          className={`diff-tab ${d} ${value === d ? "on" : ""}`} onClick={() => onChange(d)}>
          {DIFF_VI[d]}
        </button>
      ))}
    </div>
  );
}
function RoundDiff({ difficulty }: { difficulty: Difficulty }) {
  return <span className={`round-diff ${difficulty}`}>Mức {DIFF_VI[difficulty]}</span>;
}

/* Thông tin trả về sau khi hoàn thành một lượt — dùng để hiển thị màn kết quả. */
export type FinishInfo = { newly: number; explored: number; total: number; sticker?: { id: string; name: string; emoji: string } };
/* Cầu nối state ↔ game: tiến độ topic + ghi câu trả lời + hoàn thành lượt + Echo. */
export type GameCallbacks = {
  topics: Record<string, GameTopicProgress>;
  commit: (key: string, results: RoundResult[]) => void;                                  // ghi câu đã trả lời (thoát giữa chừng)
  finish: (key: string, results: RoundResult[], stars: number, topicTotal: number) => FinishInfo; // hoàn thành trọn lượt
  echoDone: () => void;                                                                    // Echo: chỉ đánh dấu đã luyện
  premium: boolean;                                                                        // tài khoản đã Premium chưa
  onPremium: () => void;                                                                    // mở màn nâng cấp khi chạm nội dung khóa
};

/* ============ Khung chung + màn kết quả ============ */
function Scene({ image, emojis, name }: { image?: string; emojis: string[]; name: string }) {
  return (
    <div className="scene">
      {image
        ? <img className="scene-image" src={image} alt={name} />
        : <div className="scene-art" aria-hidden="true">{emojis.map((e, i) => <span key={i}>{e}</span>)}</div>}
    </div>
  );
}

function GameResult({ title, stars, info, doneLabel, onDone, secondary }: {
  title: string; stars?: number; info: FinishInfo | null;
  doneLabel: string; onDone: () => void; secondary?: { label: string; onClick: () => void };
}) {
  useEffect(() => {
    celebrate(!document.body.classList.contains("no-motion"));
    playSuccessSound();
  }, []);
  return (
    <div className="game-result">
      <img className="game-result-maple" src="/assets/images/gen/maple-pose-cheer.webp" alt="Maple đang chúc mừng" />
      <span className="maple-says">High five! Mỗi lượt luyện giúp con nhớ lâu hơn.</span>
      {typeof stars === "number" && <div className="gr-stars">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>}
      <h3>{title}</h3>
      {info && info.total > 0 && (
        <p className="gr-explore">Đã mở <b>{info.explored}/{info.total}</b> thử thách của bộ này{info.newly > 0 ? <> · <b>+{info.newly}</b> câu mới</> : ""}.</p>
      )}
      {info?.sticker && <p className="reward-newsticker">🎁 Sticker mới: <b>{info.sticker.name}</b>!</p>}
      <button className="btn green" onClick={onDone}>{doneLabel}</button>
      {secondary && <button className="btn ghost sm" onClick={secondary.onClick}>{secondary.label}</button>}
    </div>
  );
}

function GameShell({ emoji, title, vi, onExit, children }: { emoji: string; title: string; vi: string; onExit: () => void; children: React.ReactNode }) {
  return (
    <div id="game" className="game-overlay">
      {/* game-sheet: dải kem ôm đúng nội dung → trang ngắn (vd Nghe & chọn) lộ scenery ở đáy, không trống */}
      <div className="game-sheet">
        <div className="game-top">
          <button className="bk" onClick={onExit}>← Thoát</button>
          <h3>{emoji} {title}</h3>
          <span className="game-vi">{vi}</span>
        </div>
        <div className="game-body">{children}</div>
      </div>
    </div>
  );
}

// Hai nút kết quả: gallery → "chơi chủ đề khác / Xong"; trực tiếp → "Tuyệt vời".
// Sau khi tới màn kết quả, lượt đã được finalize; hai nút chỉ là điều hướng.
function resultActions(onNext: (() => void) | undefined, onExit: () => void, nextLabel: string) {
  return onNext
    ? { doneLabel: nextLabel, onDone: onNext, secondary: { label: "Xong →", onClick: onExit } }
    : { doneLabel: "Tuyệt vời! →", onDone: onExit, secondary: undefined };
}

// English-first: bé đọc tiếng Anh trước; bản dịch tiếng Việt ẩn, chạm mới hiện.
// Key theo id câu ở nơi dùng để mỗi câu mới tự thu lại (mặc định ẩn).
function ViReveal({ vi, label = "👀 Xem nghĩa tiếng Việt" }: { vi?: string; label?: string }) {
  const [show, setShow] = useState(false);
  if (!vi) return null;
  return (
    <button className={`vi-reveal ${show ? "shown" : ""}`} onClick={() => setShow((s) => !s)}>
      {show ? vi : label}
    </button>
  );
}

/* ============ Thư viện scene/topic: cho bé THẤY tất cả & tự chọn ============ */
type GalleryItem = { id: string; name: string; sub: string; image?: string; emoji?: string; total: number; counts: Record<Difficulty, number> };
function GameGallery({ emoji, title, vi, intro, items, prefix, topics, difficulty, onDifficulty, onPick, onExit, premium, onPremium }: {
  emoji: string; title: string; vi: string; intro: string;
  items: GalleryItem[]; prefix: string; topics: Record<string, GameTopicProgress>;
  difficulty?: Difficulty; onDifficulty?: (d: Difficulty) => void;   // vắng cả hai ⇒ ẩn tab độ khó (game ảnh gộp: mỗi lượt trộn đủ mức)
  onPick: (id: string) => void; onExit: () => void;
  premium: boolean; onPremium: () => void;
}) {
  const showDiff = !!difficulty && !!onDifficulty;
  // Đưa các card MIỄN PHÍ lên trước, card khóa Pro xuống sau (gallery vốn trộn ngẫu nhiên).
  const ordered = premium ? items : [...items].sort((a, b) =>
    Number(practiceItemLocked(false, prefix, a.id)) - Number(practiceItemLocked(false, prefix, b.id)));
  return (
    <GameShell emoji={emoji} title={title} vi={vi} onExit={onExit}>
      <p className="gallery-intro">{intro}</p>
      {showDiff && <DifficultyBar value={difficulty!} onChange={onDifficulty!} />}
      <div className="scene-gallery">
        {ordered.map((it) => {
          const plocked = practiceItemLocked(premium, prefix, it.id);
          const prog = topics[prefix + ":" + it.id] || EMPTY_TOPIC;
          const discovered = Math.min(prog.seen.length, it.total);
          const complete = it.total > 0 && discovered >= it.total;
          const nAtDiff = showDiff ? it.counts[difficulty!] : it.total;
          const empty = showDiff && nAtDiff === 0;
          return (
            <button key={it.id} disabled={!plocked && empty}
              className={`scene-card ${discovered > 0 ? "explored" : ""} ${empty ? "empty" : ""} ${plocked ? "premium-locked" : ""}`}
              onClick={() => { if (plocked) { onPremium(); return; } onPick(it.id); }}>
              <span className="sc-thumb">
                {it.image ? <img src={it.image} alt="" /> : <span className="sc-emoji" aria-hidden="true">{it.emoji}</span>}
                {complete && !plocked && <span className="sc-check">✓</span>}
                {plocked && <span className="sc-lock-badge">🔒</span>}
              </span>
              <span className="sc-name">{it.name}</span>
              <span className="sc-sub">{it.sub}</span>
              {plocked ? (
                <span className="sc-premium">🔒 Chỉ dành cho Pro</span>
              ) : (
                <>
                  {showDiff && (
                    <span className={`sc-count ${difficulty}`}>
                      {empty ? `Chưa có câu mức ${DIFF_VI[difficulty!]}` : `${DIFF_VI[difficulty!]} · ${nAtDiff} câu`}
                    </span>
                  )}
                  {/* Game ảnh: nói rõ tổng ngân hàng và độ dài mỗi lượt để không bị hiểu là điểm số. */}
                  <span className="sc-sub">
                    {showDiff
                      ? `Đã mở ${discovered}/${it.total} thử thách${prog.playCount > 0 ? ` · ${prog.playCount} lượt` : ""}`
                      : `${discovered > 0 ? `Đã mở ${discovered}/${it.total}` : `${it.total} thử thách`} · Mỗi lượt ${ROUND_SIZE.picdet} câu`}
                  </span>
                  {prog.bestStars > 0 && <span className="sc-stars">{"⭐".repeat(prog.bestStars)}{"☆".repeat(3 - prog.bestStars)}</span>}
                </>
              )}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}

/* Hook chung: finalize lượt đúng MỘT LẦN khi tới màn kết quả.
   Dùng ref để side-effect (ghi state) không bị gọi 2 lần (StrictMode double-invoke). */
function useFinish(fin: boolean, run: () => FinishInfo): FinishInfo | null {
  const [info, setInfo] = useState<FinishInfo | null>(null);
  const done = useRef(false);
  useEffect(() => { if (fin && !done.current) { done.current = true; setInfo(run()); } }, [fin]); // eslint-disable-line react-hooks/exhaustive-deps
  return info;
}

/* ============ 1. Picture Detective (GỘP: quan sát + suy luận + mô tả + nói) ============ */
// Mỗi cảnh trộn câu từ 2 ngân hàng: SceneQ (quan sát/suy luận) + TalkTask (mô tả/xếp câu/nói).
// Không chia Dễ/Vừa/Khó theo ảnh (1 ảnh không đủ câu mỗi mức) — mỗi lượt trộn đủ mức.
type ImgItem = {
  id: string; difficulty: Difficulty; mode: "mcq" | "arrange"; badge: string; vi: string;
  q?: string; options?: string[]; answer?: string; explainVi?: string; say?: string; solution?: string[];
};
const IMG_BADGE: Record<string, string> = {
  observe: "Quan sát", locate: "Vị trí", compare: "So sánh", infer: "Suy luận", sequence: "Diễn tiến",
  choose: "Chọn câu đúng", spot: "Tìm câu sai", fill: "Điền từ", position: "Ở đâu", arrange: "Xếp câu mô tả",
};
function buildImgPool(sceneId: string): ImgItem[] {
  const d = detectiveSceneById(sceneId);
  const t = talkSceneById(sceneId);
  const items: ImgItem[] = [];
  if (d) for (const q of d.questions) items.push({
    id: q.id, difficulty: picdetDifficulty(q.kind, q.difficulty), mode: "mcq", badge: IMG_BADGE[q.kind] || "Quan sát",
    vi: q.vi, q: q.q, options: q.options, answer: q.answer, explainVi: q.explainVi,
  });
  if (t) for (const task of t.tasks) {
    if (task.kind === "arrange") items.push({
      id: task.id, difficulty: talkDifficulty(task.kind, task.difficulty), mode: "arrange", badge: IMG_BADGE.arrange,
      vi: task.vi, solution: task.solution, say: task.say,
    });
    else items.push({
      id: task.id, difficulty: talkDifficulty(task.kind, task.difficulty), mode: "mcq", badge: IMG_BADGE[task.kind] || "Mô tả",
      vi: task.vi, q: task.q, options: task.options, answer: task.answer, say: task.say,
    });
  }
  return items;
}
function PictureRound({ sceneId, cb, accent, onExit, onNext, onReplay }: {
  sceneId: string; cb: GameCallbacks; accent: "US" | "CA"; onExit: () => void; onNext?: () => void; onReplay: () => void;
}) {
  const [session] = useState(() => {
    const scene = detectiveSceneById(sceneId) || talkSceneById(sceneId) || DETECTIVE_SCENES[0];
    const key = "picdet:" + scene.id;
    const prog = cb.topics[key] || EMPTY_TOPIC;
    const pool = buildImgPool(scene.id);
    const picked = selectRound(pool, prog, ROUND_SIZE.picdet, (it) => it.difficulty);
    const items = picked.map((it) => (it.mode === "mcq" && it.options ? { ...it, options: shuffle(it.options) } : it));
    return { scene, key, items, total: pool.length };
  });
  const { scene, items, key, total } = session;
  const title = scene.title;
  const vi = (scene as { vi: string }).vi;
  const image = (scene as { image: string }).image;
  const emojis = (scene as { emojis: string[] }).emojis;

  const [i, setI] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [fin, setFin] = useState(false);
  const it = items[i];
  const isArrange = it.mode === "arrange";

  const [picked, setPicked] = useState<string | null>(null);
  const [bank, setBank] = useState<string[]>(() => (items[0].mode === "arrange" ? shuffle(items[0].solution || []) : []));
  const [placed, setPlaced] = useState<string[]>([]);
  const [checked, setChecked] = useState<null | boolean>(null);

  const answered = isArrange ? checked !== null : picked !== null;
  const correct = isArrange ? checked === true : picked === it.answer;
  const score = results.filter((r) => r.correct).length;
  const stars = starsFor(score, items.length);
  const info = useFinish(fin, () => cb.finish(key, results, stars, total));
  const exit = () => { cb.commit(key, results); onExit(); };

  useEffect(() => {
    setPicked(null); setChecked(null); setPlaced([]);
    setBank(items[i].mode === "arrange" ? shuffle(items[i].solution || []) : []);
  }, [i, items]);

  if (fin) {
    const a = {
      doneLabel: "Khám phá câu mới",
      onDone: onReplay,
      secondary: { label: onNext ? "Chọn bức khác →" : "Xong →", onClick: onNext || onExit },
    };
    return <GameShell emoji="🔎" title={title} vi={vi} onExit={onExit}>
      <GameResult title={`Bạn trả lời đúng ${score}/${items.length} câu!`} stars={stars} info={info} {...a} />
    </GameShell>;
  }
  function answerMcq(o: string) {
    if (answered) return;
    setPicked(o);
    playFeedbackSound(o === it.answer);
    setResults((r) => [...r, { id: it.id, correct: o === it.answer }]);
  }
  function place(w: string, idx: number) {
    if (checked !== null) return;
    setPlaced((p) => [...p, w]); setBank((b) => b.filter((_, k) => k !== idx));
  }
  function unplace(idx: number) {
    if (checked !== null) return;
    const w = placed[idx];
    setPlaced((p) => p.filter((_, k) => k !== idx)); setBank((b) => [...b, w]);
  }
  function check() {
    const ok = placed.join(" ") === (it.solution || []).join(" ");
    setChecked(ok);
    playFeedbackSound(ok);
    setResults((r) => [...r, { id: it.id, correct: ok }]);
  }
  const sol = it.solution || [];
  const arrangeTarget = sol.join(" ") + ".";
  const last = i + 1 >= items.length;
  return (
    <GameShell emoji="🔎" title={title} vi={vi} onExit={exit}>
      <Scene image={image} emojis={emojis} name={vi} />
      <div className="q-progress">Thử thách {i + 1}/{items.length}</div>
      <div className="talk-task">
        <span className="talk-kind">{it.badge}</span>
        <div className="talk-instr">{isArrange ? "Put the words in order to describe the picture." : it.q}</div>
        <ViReveal key={it.id} vi={it.vi} />

        {isArrange ? (
          <>
            <div className={`puzzle-line ${checked === true ? "ok" : checked === false ? "no" : ""}`}>
              {placed.length === 0 && <span className="ph">Chạm từ bên dưới để xếp câu mô tả…</span>}
              {placed.map((w, k) => <button key={k} className="tile placed" onClick={() => unplace(k)}>{w}</button>)}
            </div>
            <div className="puzzle-bank">
              {bank.map((w, k) => <button key={k} className="tile" onClick={() => place(w, k)}>{w}</button>)}
            </div>
            {checked === null && (
              <button className="btn" disabled={placed.length !== sol.length} onClick={check}>Kiểm tra</button>
            )}
          </>
        ) : (
          <>
            <div className={`qopts ${answered ? "answered" : ""}`}>
              {(it.options || []).map((o) => (
                <button key={o} disabled={answered}
                  className={`qopt ${answered && o === it.answer ? "right" : ""} ${answered && o === picked && o !== it.answer ? "wrong" : ""}`}
                  onClick={() => answerMcq(o)}>{o}</button>
              ))}
            </div>
          </>
        )}

        {answered && (
          <>
            <div className="qfb">
              {correct
                ? <span className="ok">✓ Chính xác!</span>
                : <><span className="no">✗ Chưa đúng.</span> Đáp án: <b>{isArrange ? arrangeTarget : it.answer}</b></>}
              {it.explainVi && <div className="q-explain">💡 {it.explainVi}</div>}
            </div>
            {it.say && (
              <div className="talk-say">
                <span className="talk-say-en">🗣️ {it.say}</span>
                <button className="icbtn" onClick={() => speak(it.say!, accent)}>🔊 Nói theo Maple</button>
                <span className="talk-say-note">(nói cho vui, không tính điểm)</span>
              </div>
            )}
            <button className="btn qnext" onClick={() => { if (last) setFin(true); else setI(i + 1); }}>
              {last ? "Xem kết quả →" : "Thử thách tiếp →"}
            </button>
          </>
        )}
      </div>
    </GameShell>
  );
}

function PictureGame({ sceneId, cb, accent, onExit }: { sceneId?: string; cb: GameCallbacks; accent: "US" | "CA"; onExit: () => void }) {
  const initial = sceneId && (detectiveSceneById(sceneId) || talkSceneById(sceneId)) ? sceneId : undefined;
  const galleryMode = !initial;
  const [chosen, setChosen] = useState<string | undefined>(initial);
  const [round, setRound] = useState(0);
  // Xáo trộn thứ tự cảnh MỖI LẦN vào — KHÔNG đi theo thứ tự level 1→2→3 như bên Learn.
  const [items] = useState<GalleryItem[]>(() => shuffle(DETECTIVE_SCENES.map((s) => {
    const t = talkSceneById(s.id);
    return { id: s.id, name: s.title, sub: s.vi, image: s.image,
      total: s.questions.length + (t ? t.tasks.length : 0),
      counts: { easy: 0, medium: 0, hard: 0 } as Record<Difficulty, number> };
  })));
  if (galleryMode && !chosen) {
    return <GameGallery emoji="🔎" title="Thám tử hình ảnh" vi="Chọn bức tranh để khám phá"
      intro="Chọn một bức tranh — quan sát, suy luận, mô tả rồi nói theo Maple."
      items={items} prefix="picdet" topics={cb.topics} onPick={setChosen} onExit={onExit} premium={cb.premium} onPremium={cb.onPremium} />;
  }
  return <PictureRound key={`${chosen}-${round}`} sceneId={chosen!} cb={cb} accent={accent}
    onExit={galleryMode ? () => setChosen(undefined) : onExit}
    onNext={galleryMode ? () => setChosen(undefined) : undefined}
    onReplay={() => setRound((n) => n + 1)} />;
}

/* ============ 2. Sentence Puzzle ============ */
const PUZZLE_META: Record<string, [string, string]> = {
  daily: ["Đời sống", "/assets/images/gen/practice-topics/topic-everyday.webp"],
  school: ["Trường lớp", "/assets/images/gen/practice-topics/topic-school.webp"],
  food: ["Đồ ăn", "/assets/images/gen/practice-topics/topic-food.webp"],
  places: ["Nơi chốn & Du lịch", "/assets/images/gen/practice-topics/topic-places.webp"],
  feelings: ["Cảm xúc", "/assets/images/gen/practice-topics/topic-feelings.webp"],
  past: ["Chuyện đã qua", "/assets/images/gen/practice-topics/topic-past.webp"],
  stories: ["Câu chuyện & Tình huống", "/assets/images/gen/practice-topics/topic-stories.webp"],
  opinions: ["Nêu ý kiến & Lý do", "/assets/images/gen/practice-topics/topic-opinions.webp"],
};
function PuzzleRound({ setId, difficulty, cb, onExit, onNext }: { setId: string; difficulty: Difficulty; cb: GameCallbacks; onExit: () => void; onNext?: () => void }) {
  const [session] = useState(() => {
    const set = puzzleSetById(setId) || PUZZLE_SETS[0];
    const key = "puzzle:" + set.id;
    const prog = cb.topics[key] || EMPTY_TOPIC;
    const diffOf = (p: (typeof set.items)[number]) => puzzleDifficulty(p.solution.length, p.difficulty);
    const chosen = selectRound(set.items, prog, ROUND_SIZE.puzzle, diffOf, [], difficulty);
    const items = chosen.length ? chosen : selectRound(set.items, prog, ROUND_SIZE.puzzle, diffOf);
    return { set, key, items, total: set.items.length };
  });
  const { set, items, key, total } = session;
  const [i, setI] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [fin, setFin] = useState(false);
  const item = items[i];
  const [bank, setBank] = useState<string[]>(() => shuffle(items[0].solution));
  const [placed, setPlaced] = useState<string[]>([]);
  const [result, setResult] = useState<null | boolean>(null);
  const score = results.filter((r) => r.correct).length;
  const stars = starsFor(score, items.length);
  const info = useFinish(fin, () => cb.finish(key, results, stars, total));
  const exit = () => { cb.commit(key, results); onExit(); };

  useEffect(() => { setBank(shuffle(items[i].solution)); setPlaced([]); setResult(null); }, [i, items]);

  if (fin) {
    const a = resultActions(onNext, onExit, "Chủ đề khác →");
    return <GameShell emoji="🧩" title="Sentence Puzzle" vi={`Xếp câu · ${set.title}`} onExit={onExit}>
      <GameResult title={`Xếp đúng ${score}/${items.length} câu!`} stars={stars} info={info} {...a} />
    </GameShell>;
  }
  function place(w: string, idx: number) {
    if (result !== null) return;
    setPlaced((p) => [...p, w]); setBank((b) => b.filter((_, k) => k !== idx));
  }
  function unplace(idx: number) {
    if (result !== null) return;
    const w = placed[idx];
    setPlaced((p) => p.filter((_, k) => k !== idx)); setBank((b) => [...b, w]);
  }
  function check() {
    const ok = placed.join(" ") === item.solution.join(" ");
    setResult(ok);
    playFeedbackSound(ok);
    setResults((r) => [...r, { id: item.id, correct: ok }]);
  }
  const target = item.solution.join(" ") + ".";
  return (
    <GameShell emoji="🧩" title="Sentence Puzzle" vi={`Xếp câu · ${set.title}`} onExit={exit}>
      <div className="q-progress">Câu {i + 1}/{items.length} <RoundDiff difficulty={difficulty} /></div>
      <div className="puzzle-instr">Put the words in order to make a sentence.</div>
      <ViReveal key={item.id} vi={item.vi} label="💡 Gợi ý (tiếng Việt)" />
      <div className="puzzle-instr-sp" />
      <div className={`puzzle-line ${result === true ? "ok" : result === false ? "no" : ""}`}>
        {placed.length === 0 && <span className="ph">Chạm từ bên dưới để xếp câu…</span>}
        {placed.map((w, k) => <button key={k} className="tile placed" onClick={() => unplace(k)}>{w}</button>)}
      </div>
      <div className="puzzle-bank">
        {bank.map((w, k) => <button key={k} className="tile" onClick={() => place(w, k)}>{w}</button>)}
      </div>
      {result === null ? (
        <button className="btn" disabled={placed.length !== item.solution.length} onClick={check}>Kiểm tra</button>
      ) : (
        <>
          <div className="qfb">{result ? <span className="ok">✓ Chuẩn luôn!</span> : <><span className="no">✗ Chưa đúng.</span> Đáp án: <b>{target}</b></>}</div>
          <button className="btn qnext" onClick={() => { if (i + 1 < items.length) setI(i + 1); else setFin(true); }}>
            {i + 1 < items.length ? "Câu tiếp →" : "Xem kết quả →"}
          </button>
        </>
      )}
    </GameShell>
  );
}
function SentencePuzzle({ setId, cb, onExit }: { setId?: string; cb: GameCallbacks; onExit: () => void }) {
  const initial = setId && puzzleSetById(setId) ? setId : undefined;
  const galleryMode = !initial;
  const [chosen, setChosen] = useState<string | undefined>(initial);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  if (galleryMode && !chosen) {
    return <GameGallery emoji="" title="Xếp câu" vi="Chọn một chủ đề"
      intro="Chọn mức Dễ / Vừa / Khó rồi chọn một chủ đề để luyện trật tự từ."
      items={PUZZLE_SETS.map((s) => ({ id: s.id, name: s.title, sub: PUZZLE_META[s.id]?.[0] || s.title, image: PUZZLE_META[s.id]?.[1] || "/assets/images/gen/practice-topics/topic-logic.webp", total: s.items.length,
        counts: countByDifficulty(s.items, (p) => puzzleDifficulty(p.solution.length, p.difficulty)) }))}
      prefix="puzzle" topics={cb.topics} difficulty={difficulty} onDifficulty={setDifficulty} onPick={setChosen} onExit={onExit} premium={cb.premium} onPremium={cb.onPremium} />;
  }
  return <PuzzleRound key={`${chosen}-${difficulty}`} setId={chosen!} difficulty={difficulty} cb={cb}
    onExit={galleryMode ? () => setChosen(undefined) : onExit}
    onNext={galleryMode ? () => setChosen(undefined) : undefined} />;
}

/* ============ 3. English Riddles ============ */
const RIDDLE_META: Record<string, [string, string]> = {
  animals: ["Con vật", "/assets/images/gen/practice-topics/topic-animals.webp"],
  food: ["Đồ ăn", "/assets/images/gen/practice-topics/topic-food.webp"],
  places: ["Nơi chốn", "/assets/images/gen/practice-topics/topic-places.webp"],
  objects: ["Đồ vật", "/assets/images/gen/practice-topics/topic-objects.webp"],
  nature: ["Thiên nhiên", "/assets/images/gen/practice-topics/topic-nature.webp"],
  logic: ["Đố mẹo", "/assets/images/gen/practice-topics/topic-logic.webp"],
  storywords: ["Từ trong truyện", "/assets/images/gen/practice-topics/topic-stories.webp"],
  home: ["Trong nhà", "/assets/images/gen/practice-topics/topic-everyday.webp"],
};
function RiddleRound({ setId, difficulty, cb, accent, onExit, onNext }: {
  setId: string; difficulty: Difficulty; cb: GameCallbacks; accent: "US" | "CA"; onExit: () => void; onNext?: () => void;
}) {
  const [session] = useState(() => {
    const set = riddleSetById(setId) || RIDDLE_SETS[0];
    const key = "riddle:" + set.id;
    const prog = cb.topics[key] || EMPTY_TOPIC;
    const diffOf = (r: (typeof set.items)[number]) => r.difficulty || "medium";
    const chosen = selectRound(set.items, prog, ROUND_SIZE.riddle, diffOf, [], difficulty);
    const items = (chosen.length ? chosen : selectRound(set.items, prog, ROUND_SIZE.riddle, diffOf))
      .map((r) => ({ ...r, options: shuffle(r.options) }));
    return { set, key, items, total: set.items.length };
  });
  const { set, items, key, total } = session;
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [fin, setFin] = useState(false);
  const r = items[i];
  const answered = picked !== null;
  const score = results.filter((x) => x.correct).length;
  const stars = starsFor(score, items.length);
  const info = useFinish(fin, () => cb.finish(key, results, stars, total));
  const exit = () => { cb.commit(key, results); onExit(); };

  if (fin) {
    const a = resultActions(onNext, onExit, "Bộ khác →");
    return <GameShell emoji="🦉" title="English Riddles" vi={`Đố vui · ${set.title}`} onExit={onExit}>
      <GameResult title={`Giải đúng ${score}/${items.length} câu!`} stars={stars} info={info} {...a} />
    </GameShell>;
  }
  function answer(o: string) {
    if (answered) return;
    setPicked(o);
    playFeedbackSound(o === r.answer);
    setResults((x) => [...x, { id: r.id, correct: o === r.answer }]);
  }
  return (
    <GameShell emoji="🦉" title="English Riddles" vi={`Đố vui · ${set.title}`} onExit={exit}>
      <div className="q-progress">Câu đố {i + 1}/{items.length} <RoundDiff difficulty={difficulty} /></div>
      <div className="riddle-card">
        <div className="riddle-emoji">{r.hint}</div>
        <div className="riddle-text">{r.text}</div>
        <button className="btn ghost sm" onClick={() => speak(r.text, accent)}>🔊 Nghe câu đố</button>
        <ViReveal key={r.id} vi={r.vi} />
      </div>
      <div className={`qopts ${answered ? "answered" : ""}`}>
        {r.options.map((o) => (
          <button key={o} disabled={answered}
            className={`qopt ${answered && o === r.answer ? "right" : ""} ${answered && o === picked && o !== r.answer ? "wrong" : ""}`}
            onClick={() => answer(o)}>{o}</button>
        ))}
      </div>
      {answered && (
        <>
          <div className="qfb">{picked === r.answer ? <span className="ok">✓ Đúng rồi!</span> : <><span className="no">✗ Chưa đúng.</span> Đáp án: <b>{r.answer}</b></>}{r.vi && <div className="q-explain">💡 {r.vi}</div>}</div>
          <button className="btn qnext" onClick={() => { if (i + 1 < items.length) { setI(i + 1); setPicked(null); } else setFin(true); }}>
            {i + 1 < items.length ? "Câu tiếp →" : "Xem kết quả →"}
          </button>
        </>
      )}
    </GameShell>
  );
}
function RiddleGame({ setId, cb, accent, onExit }: { setId?: string; cb: GameCallbacks; accent: "US" | "CA"; onExit: () => void }) {
  const initial = setId && riddleSetById(setId) ? setId : undefined;
  const galleryMode = !initial;
  const [chosen, setChosen] = useState<string | undefined>(initial);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  if (galleryMode && !chosen) {
    return <GameGallery emoji="" title="Đố vui tiếng Anh" vi="Chọn một bộ câu đố"
      intro="Chọn mức Dễ / Vừa / Khó rồi chọn một bộ câu đố — đọc/nghe manh mối rồi chọn đáp án."
      items={RIDDLE_SETS.map((s) => ({ id: s.id, name: s.title, sub: RIDDLE_META[s.id]?.[0] || s.title, image: RIDDLE_META[s.id]?.[1] || "/assets/images/gen/practice-topics/topic-logic.webp", total: s.items.length,
        counts: countByDifficulty(s.items, (r) => r.difficulty || "medium") }))}
      prefix="riddle" topics={cb.topics} difficulty={difficulty} onDifficulty={setDifficulty} onPick={setChosen} onExit={onExit} premium={cb.premium} onPremium={cb.onPremium} />;
  }
  return <RiddleRound key={`${chosen}-${difficulty}`} setId={chosen!} difficulty={difficulty} cb={cb} accent={accent}
    onExit={galleryMode ? () => setChosen(undefined) : onExit}
    onNext={galleryMode ? () => setChosen(undefined) : undefined} />;
}

/* ============ 4. Listen & Choose (nghe câu → chọn nghĩa, KHÔNG ảnh) ============ */
const LISTEN_META: Record<string, [string, string]> = {
  everyday: ["Sinh hoạt hằng ngày", "/assets/images/gen/practice-topics/topic-everyday.webp"],
  school: ["Ở trường", "/assets/images/gen/practice-topics/topic-school.webp"],
  outdoors: ["Chuyến đi & Lựa chọn", "/assets/images/gen/practice-topics/topic-places.webp"],
  feelings: ["Cảm xúc", "/assets/images/gen/practice-topics/topic-feelings.webp"],
};
function ListenRound({ setId, difficulty, cb, accent, onExit, onNext }: {
  setId: string; difficulty: Difficulty; cb: GameCallbacks; accent: "US" | "CA"; onExit: () => void; onNext?: () => void;
}) {
  const [session] = useState(() => {
    const set = listenSetById(setId) || LISTEN_SETS[0];
    const key = "listen:" + set.id;
    const prog = cb.topics[key] || EMPTY_TOPIC;
    const diffOf = (r: (typeof set.items)[number]) => r.difficulty || "medium";
    const chosen = selectRound(set.items, prog, ROUND_SIZE.listen, diffOf, [], difficulty);
    const items = (chosen.length ? chosen : selectRound(set.items, prog, ROUND_SIZE.listen, diffOf))
      .map((r) => ({ ...r, options: shuffle(r.options) }));
    return { set, key, items, total: set.items.length };
  });
  const { set, items, key, total } = session;
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [fin, setFin] = useState(false);
  const r = items[i];
  const answered = picked !== null;
  const score = results.filter((x) => x.correct).length;
  const stars = starsFor(score, items.length);
  const info = useFinish(fin, () => cb.finish(key, results, stars, total));
  const exit = () => { cb.commit(key, results); onExit(); };

  // Tự đọc câu khi sang câu mới (chỉ khi chưa kết thúc).
  useEffect(() => { if (!fin && r) speak(r.say, accent); }, [i, fin, r, accent]);

  if (fin) {
    const a = resultActions(onNext, onExit, "Bộ khác →");
    return <GameShell emoji="🎧" title="Listen & Choose" vi={`Nghe · ${set.title}`} onExit={onExit}>
      <GameResult title={`Nghe đúng ${score}/${items.length} câu!`} stars={stars} info={info} {...a} />
    </GameShell>;
  }
  function answer(o: string) {
    if (answered) return;
    setPicked(o);
    playFeedbackSound(o === r.answer);
    setResults((x) => [...x, { id: r.id, correct: o === r.answer }]);
  }
  return (
    <GameShell emoji="🎧" title="Listen & Choose" vi={`Nghe · ${set.title}`} onExit={exit}>
      <div className="q-progress">Câu {i + 1}/{items.length} <RoundDiff difficulty={difficulty} /></div>
      <div className="listen-card">
        <div className="listen-ic" aria-hidden="true">🎧</div>
        <div className="listen-instr">Nghe Maple đọc rồi chọn nghĩa đúng.</div>
        <div className="listen-btns">
          <button className="btn listen-play" onClick={() => speak(r.say, accent)}>🔊 Nghe lại</button>
          <button className="btn ghost sm" onClick={() => speak(r.say, accent, 0.55)}>🐢 Nghe chậm</button>
        </div>
      </div>
      <div className={`qopts ${answered ? "answered" : ""}`}>
        {r.options.map((o) => (
          <button key={o} disabled={answered}
            className={`qopt ${answered && o === r.answer ? "right" : ""} ${answered && o === picked && o !== r.answer ? "wrong" : ""}`}
            onClick={() => answer(o)}>{o}</button>
        ))}
      </div>
      {answered && (
        <>
          <div className="qfb">
            {picked === r.answer ? <span className="ok">✓ Đúng rồi!</span> : <><span className="no">✗ Chưa đúng.</span> Đáp án: <b>{r.answer}</b></>}
            <div className="q-explain">🔤 Bạn vừa nghe: <b>{r.say}</b></div>
          </div>
          <button className="btn qnext" onClick={() => { if (i + 1 < items.length) { setI(i + 1); setPicked(null); } else setFin(true); }}>
            {i + 1 < items.length ? "Câu tiếp →" : "Xem kết quả →"}
          </button>
        </>
      )}
    </GameShell>
  );
}
function ListenChallenge({ setId, cb, accent, onExit }: { setId?: string; cb: GameCallbacks; accent: "US" | "CA"; onExit: () => void }) {
  const initial = setId && listenSetById(setId) ? setId : undefined;
  const galleryMode = !initial;
  const [chosen, setChosen] = useState<string | undefined>(initial);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  if (galleryMode && !chosen) {
    return <GameGallery emoji="" title="Nghe & chọn" vi="Chọn một bộ nghe"
      intro="Chọn mức Dễ / Vừa / Khó rồi chọn một bộ — nghe Maple đọc câu rồi chọn nghĩa đúng."
      items={LISTEN_SETS.map((s) => ({ id: s.id, name: s.title, sub: LISTEN_META[s.id]?.[0] || s.title, image: LISTEN_META[s.id]?.[1] || "/assets/images/gen/practice-topics/topic-listening.webp", total: s.items.length,
        counts: countByDifficulty(s.items, (r) => r.difficulty || "medium") }))}
      prefix="listen" topics={cb.topics} difficulty={difficulty} onDifficulty={setDifficulty} onPick={setChosen} onExit={onExit} premium={cb.premium} onPremium={cb.onPremium} />;
  }
  return <ListenRound key={`${chosen}-${difficulty}`} setId={chosen!} difficulty={difficulty} cb={cb} accent={accent}
    onExit={galleryMode ? () => setChosen(undefined) : onExit}
    onNext={galleryMode ? () => setChosen(undefined) : undefined} />;
}

/* ============ Echo Challenge (luyện nói, chấm sao tuỳ chọn bằng Web Speech API) ============ */
function EchoChallenge({ accent, onExit, cb }: { accent: "US" | "CA"; onExit: () => void; cb: GameCallbacks }) {
  const phrases = ECHO;
  const [i, setI] = useState(0);
  const [fin, setFin] = useState(false);
  // Sao tốt nhất của từng câu (thử lại chỉ nâng, không cộng trùng).
  const [starMap, setStarMap] = useState<Record<number, number>>({});
  const stars = Object.values(starMap).reduce((a, b) => a + b, 0);
  const p = phrases[i];
  const canScore = speechScoringSupported();

  useEffect(() => { if (!fin && p) speak(p.en, accent); }, [i, fin, p, accent]);
  useEffect(() => { if (fin) cb.echoDone(); }, [fin]); // eslint-disable-line react-hooks/exhaustive-deps

  if (fin) {
    return <GameShell emoji="🎤" title="Echo with Maple" vi="Nói theo Maple" onExit={onExit}>
      <GameResult title={stars > 0 ? `Giọng nói tuyệt vời! Bạn gom được ${stars} ⭐ 🎤` : "Giọng nói tuyệt vời! 🎤"}
        info={{ newly: 0, explored: 0, total: 0 }}
        doneLabel="Xong →" onDone={onExit} />
      <p className="echo-note">Sao chỉ để cho vui — nói được là giỏi rồi!</p>
    </GameShell>;
  }
  return (
    <GameShell emoji="🎤" title="Echo with Maple" vi="Nói theo Maple" onExit={onExit}>
      <div className="q-progress">Câu {i + 1}/{phrases.length}{stars > 0 && <span> · ⭐ {stars}</span>}</div>
      <div className="echo-card">
        <div className="echo-step">1️⃣ Nghe Maple đọc</div>
        <div className="echo-en">{p.en}</div>
        <div className="echo-vi">{p.vi}</div>
        <button className="btn" onClick={() => speak(p.en, accent)}>🔊 Nghe lại</button>
        <button className="btn ghost sm" onClick={() => speak(p.en, accent, 0.55)}>🐢 Nghe chậm</button>
        <div className="echo-step">{canScore ? "2️⃣ Bấm micro, nói theo — Maple chấm sao cho bạn" : "2️⃣ Bạn nói theo, rồi bấm nút bên dưới"}</div>
        {canScore && <MicCheck target={p.en} accent={accent} size="lg" onScore={(s) => setStarMap((m) => ({ ...m, [i]: Math.max(m[i] || 0, s.stars) }))} />}
      </div>
      <button className="btn green" onClick={() => { if (i + 1 < phrases.length) setI(i + 1); else setFin(true); }}>
        {i + 1 < phrases.length ? "✓ Mình nói xong — câu tiếp" : "✓ Mình nói xong — hoàn thành"}
      </button>
    </GameShell>
  );
}

/* ============ Dispatcher: mở game theo loại ============ */
export function GamePlay({ kind, refId, accent, cb, onExit }: {
  kind: StopKind; refId?: string; accent: "US" | "CA"; cb: GameCallbacks; onExit: () => void;
}) {
  if (kind === "picdet") return <PictureGame sceneId={refId} cb={cb} accent={accent} onExit={onExit} />;
  if (kind === "puzzle") return <SentencePuzzle setId={refId} cb={cb} onExit={onExit} />;
  if (kind === "riddle") return <RiddleGame setId={refId} cb={cb} accent={accent} onExit={onExit} />;
  if (kind === "listen") return <ListenChallenge setId={refId} cb={cb} accent={accent} onExit={onExit} />;
  if (kind === "echo") return <EchoChallenge accent={accent} onExit={onExit} cb={cb} />;
  return null;
}
