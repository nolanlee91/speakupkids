"use client";

import { useEffect, useRef, useState } from "react";
import { speak, shuffle, celebrate } from "@/lib/fx";
import { ECHO, ROUND_SIZE, type StopKind } from "@/lib/games";
import { DETECTIVE_SCENES, TALK_SCENES, detectiveSceneById, talkSceneById } from "@/lib/scenes";
import { PUZZLE_SETS, RIDDLE_SETS, puzzleSetById, riddleSetById } from "@/lib/banks";
import {
  EMPTY_TOPIC, selectRound, starsFor, picdetDifficulty, talkDifficulty, puzzleDifficulty,
  type GameTopicProgress, type RoundResult,
} from "@/lib/gameplay";

/* Thông tin trả về sau khi hoàn thành một lượt — dùng để hiển thị màn kết quả. */
export type FinishInfo = { newly: number; explored: number; total: number; sticker?: { id: string; name: string; emoji: string } };
/* Cầu nối state ↔ game: tiến độ topic + ghi câu trả lời + hoàn thành lượt + Echo. */
export type GameCallbacks = {
  topics: Record<string, GameTopicProgress>;
  commit: (key: string, results: RoundResult[]) => void;                                  // ghi câu đã trả lời (thoát giữa chừng)
  finish: (key: string, results: RoundResult[], stars: number, topicTotal: number) => FinishInfo; // hoàn thành trọn lượt
  echoDone: () => void;                                                                    // Echo: chỉ đánh dấu đã luyện
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
  useEffect(() => { celebrate(!document.body.classList.contains("no-motion")); }, []);
  return (
    <div className="game-result">
      {typeof stars === "number" && <div className="gr-stars">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>}
      <h3>{title}</h3>
      {info && info.total > 0 && (
        <p className="gr-explore">Đã khám phá <b>{info.explored}/{info.total}</b> thử thách{info.newly > 0 ? <> · <b>+{info.newly}</b> câu mới</> : ""}.</p>
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
      <div className="game-top">
        <button className="bk" onClick={onExit}>← Thoát</button>
        <h3>{emoji} {title}</h3>
        <span className="game-vi">{vi}</span>
      </div>
      <div className="game-body">{children}</div>
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

/* ============ Thư viện scene/topic: cho bé THẤY tất cả & tự chọn ============ */
type GalleryItem = { id: string; name: string; sub: string; image?: string; emoji?: string; total: number };
function GameGallery({ emoji, title, vi, intro, items, prefix, topics, onPick, onExit }: {
  emoji: string; title: string; vi: string; intro: string;
  items: GalleryItem[]; prefix: string; topics: Record<string, GameTopicProgress>;
  onPick: (id: string) => void; onExit: () => void;
}) {
  return (
    <GameShell emoji={emoji} title={title} vi={vi} onExit={onExit}>
      <p className="gallery-intro">{intro}</p>
      <div className="scene-gallery">
        {items.map((it) => {
          const prog = topics[prefix + ":" + it.id] || EMPTY_TOPIC;
          const discovered = Math.min(prog.seen.length, it.total);
          const complete = it.total > 0 && discovered >= it.total;
          return (
            <button key={it.id} className={`scene-card ${discovered > 0 ? "explored" : ""}`} onClick={() => onPick(it.id)}>
              <span className="sc-thumb">
                {it.image ? <img src={it.image} alt={it.name} /> : <span className="sc-emoji">{it.emoji}</span>}
                {complete && <span className="sc-check">✓</span>}
              </span>
              <span className="sc-name">{it.name}</span>
              <span className="sc-sub">{discovered}/{it.total} thử thách{prog.playCount > 0 ? ` · ${prog.playCount} lượt` : ""}</span>
              {prog.bestStars > 0 && <span className="sc-stars">{"⭐".repeat(prog.bestStars)}{"☆".repeat(3 - prog.bestStars)}</span>}
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

/* ============ 1. Picture Detective ============ */
function DetectiveRound({ sceneId, cb, onExit, onNext }: {
  sceneId: string; cb: GameCallbacks; onExit: () => void; onNext?: () => void;
}) {
  const [session] = useState(() => {
    const scene = detectiveSceneById(sceneId) || DETECTIVE_SCENES[0];
    const key = "picdet:" + scene.id;
    const prog = cb.topics[key] || EMPTY_TOPIC;
    const qs = selectRound(scene.questions, prog, ROUND_SIZE.picdet, (q) => picdetDifficulty(q.kind, q.difficulty))
      .map((q) => ({ ...q, options: shuffle(q.options) }));
    return { scene, key, qs, total: scene.questions.length };
  });
  const { scene, qs, key, total } = session;
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [fin, setFin] = useState(false);
  const q = qs[i];
  const answered = picked !== null;
  const score = results.filter((r) => r.correct).length;
  const stars = starsFor(score, qs.length);
  const info = useFinish(fin, () => cb.finish(key, results, stars, total));
  const exit = () => { cb.commit(key, results); onExit(); };

  if (fin) {
    const a = resultActions(onNext, onExit, "Chơi bức khác →");
    return <GameShell emoji="🔎" title={scene.title} vi={scene.vi} onExit={onExit}>
      <GameResult title={`Đúng ${score}/${qs.length} câu!`} stars={stars} info={info} {...a} />
    </GameShell>;
  }
  function answer(o: string) {
    if (answered) return;
    setPicked(o);
    setResults((r) => [...r, { id: q.id, correct: o === q.answer }]);
  }
  return (
    <GameShell emoji="🔎" title={scene.title} vi={scene.vi} onExit={exit}>
      <Scene image={scene.image} emojis={scene.emojis} name={scene.vi} />
      <div className="q-progress">Câu {i + 1}/{qs.length}</div>
      <div className="qcard">
        <div className="qtext">{q.q}<div className="qsub">{q.vi}</div></div>
        <div className={`qopts ${answered ? "answered" : ""}`}>
          {q.options.map((o) => (
            <button key={o} disabled={answered}
              className={`qopt ${answered && o === q.answer ? "right" : ""} ${answered && o === picked && o !== q.answer ? "wrong" : ""}`}
              onClick={() => answer(o)}>{o}</button>
          ))}
        </div>
        {answered && (
          <>
            <div className="qfb">{picked === q.answer ? <span className="ok">✓ Chính xác!</span> : <><span className="no">✗ Chưa đúng.</span> Đáp án: <b>{q.answer}</b></>}{q.explainVi && <div className="q-explain">💡 {q.explainVi}</div>}</div>
            <button className="btn qnext" onClick={() => { if (i + 1 < qs.length) { setI(i + 1); setPicked(null); } else setFin(true); }}>
              {i + 1 < qs.length ? "Câu tiếp →" : "Xem kết quả →"}
            </button>
          </>
        )}
      </div>
    </GameShell>
  );
}
function PictureDetective({ sceneId, cb, onExit }: { sceneId?: string; cb: GameCallbacks; onExit: () => void }) {
  const initial = sceneId && detectiveSceneById(sceneId) ? sceneId : undefined;
  const galleryMode = !initial;
  const [chosen, setChosen] = useState<string | undefined>(initial);
  if (galleryMode && !chosen) {
    return <GameGallery emoji="🔎" title="Thám tử hình ảnh" vi="Chọn bức tranh để điều tra"
      intro="Chọn một bức tranh để điều tra — mỗi bức có nhiều thử thách quan sát, tìm vị trí, so sánh và suy luận."
      items={DETECTIVE_SCENES.map((s) => ({ id: s.id, name: s.vi, sub: s.title, image: s.image, total: s.questions.length }))}
      prefix="picdet" topics={cb.topics} onPick={setChosen} onExit={onExit} />;
  }
  return <DetectiveRound key={chosen} sceneId={chosen!} cb={cb}
    onExit={galleryMode ? () => setChosen(undefined) : onExit}
    onNext={galleryMode ? () => setChosen(undefined) : undefined} />;
}

/* ============ 2. Sentence Puzzle ============ */
const PUZZLE_META: Record<string, [string, string]> = {
  daily: ["Đời sống", "🏠"], school: ["Trường lớp", "🏫"], food: ["Đồ ăn", "🍎"],
  places: ["Nơi chốn & Du lịch", "🗺️"], feelings: ["Cảm xúc", "😊"], past: ["Chuyện đã qua", "⏰"],
};
function PuzzleRound({ setId, cb, onExit, onNext }: { setId: string; cb: GameCallbacks; onExit: () => void; onNext?: () => void }) {
  const [session] = useState(() => {
    const set = puzzleSetById(setId) || PUZZLE_SETS[0];
    const key = "puzzle:" + set.id;
    const prog = cb.topics[key] || EMPTY_TOPIC;
    const items = selectRound(set.items, prog, ROUND_SIZE.puzzle, (p) => puzzleDifficulty(p.solution.length, p.difficulty));
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
    setResults((r) => [...r, { id: item.id, correct: ok }]);
  }
  const target = item.solution.join(" ") + ".";
  return (
    <GameShell emoji="🧩" title="Sentence Puzzle" vi={`Xếp câu · ${set.title}`} onExit={exit}>
      <div className="q-progress">Câu {i + 1}/{items.length}</div>
      <div className="puzzle-hint">💡 {item.vi}</div>
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
  if (galleryMode && !chosen) {
    return <GameGallery emoji="🧩" title="Xếp câu" vi="Chọn một chủ đề"
      intro="Chọn một chủ đề để luyện trật tự từ — mỗi chủ đề có nhiều câu khác nhau!"
      items={PUZZLE_SETS.map((s) => ({ id: s.id, name: PUZZLE_META[s.id]?.[0] || s.title, sub: s.title, emoji: PUZZLE_META[s.id]?.[1] || "🧩", total: s.items.length }))}
      prefix="puzzle" topics={cb.topics} onPick={setChosen} onExit={onExit} />;
  }
  return <PuzzleRound key={chosen} setId={chosen!} cb={cb}
    onExit={galleryMode ? () => setChosen(undefined) : onExit}
    onNext={galleryMode ? () => setChosen(undefined) : undefined} />;
}

/* ============ 3. English Riddles ============ */
const RIDDLE_META: Record<string, [string, string]> = {
  animals: ["Con vật", "🐘"], food: ["Đồ ăn", "🍎"], places: ["Nơi chốn", "🏖️"],
  objects: ["Đồ vật", "🎒"], nature: ["Thiên nhiên", "🌈"], logic: ["Đố mẹo", "🧠"],
};
function RiddleRound({ setId, cb, accent, onExit, onNext }: {
  setId: string; cb: GameCallbacks; accent: "US" | "CA"; onExit: () => void; onNext?: () => void;
}) {
  const [session] = useState(() => {
    const set = riddleSetById(setId) || RIDDLE_SETS[0];
    const key = "riddle:" + set.id;
    const prog = cb.topics[key] || EMPTY_TOPIC;
    const hard = set.id === "logic";
    const items = selectRound(set.items, prog, ROUND_SIZE.riddle, (r) => r.difficulty || (hard ? "hard" : "medium"))
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
    setResults((x) => [...x, { id: r.id, correct: o === r.answer }]);
  }
  return (
    <GameShell emoji="🦉" title="English Riddles" vi={`Đố vui · ${set.title}`} onExit={exit}>
      <div className="q-progress">Câu đố {i + 1}/{items.length}</div>
      <div className="riddle-card">
        <div className="riddle-emoji">{r.hint}</div>
        <div className="riddle-text">{r.text}</div>
        <button className="btn ghost sm" onClick={() => speak(r.text, accent)}>🔊 Nghe câu đố</button>
        <div className="riddle-vi">{r.vi}</div>
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
  if (galleryMode && !chosen) {
    return <GameGallery emoji="🦉" title="Đố vui tiếng Anh" vi="Chọn một bộ câu đố"
      intro="Chọn một bộ câu đố — đọc/nghe manh mối rồi chọn đáp án. Mỗi bộ có nhiều câu khác nhau!"
      items={RIDDLE_SETS.map((s) => ({ id: s.id, name: RIDDLE_META[s.id]?.[0] || s.title, sub: s.title, emoji: RIDDLE_META[s.id]?.[1] || "🦉", total: s.items.length }))}
      prefix="riddle" topics={cb.topics} onPick={setChosen} onExit={onExit} />;
  }
  return <RiddleRound key={chosen} setId={chosen!} cb={cb} accent={accent}
    onExit={galleryMode ? () => setChosen(undefined) : onExit}
    onNext={galleryMode ? () => setChosen(undefined) : undefined} />;
}

/* ============ 4. Build the Description — mô tả tranh CÓ ĐÁP ÁN ============ */
const TALK_KIND_LABEL: Record<string, string> = {
  choose: "Chọn câu đúng", spot: "Tìm câu sai", fill: "Điền từ", position: "Vị trí", arrange: "Xếp câu mô tả",
};
function TalkRound({ sceneId, cb, accent, onExit, onNext }: {
  sceneId: string; cb: GameCallbacks; accent: "US" | "CA"; onExit: () => void; onNext?: () => void;
}) {
  const [session] = useState(() => {
    const scene = talkSceneById(sceneId) || TALK_SCENES[0];
    const key = "talk:" + scene.id;
    const prog = cb.topics[key] || EMPTY_TOPIC;
    const tasks = selectRound(scene.tasks, prog, ROUND_SIZE.talk, (t) => talkDifficulty(t.kind, t.difficulty))
      .map((t) => (t.options ? { ...t, options: shuffle(t.options) } : t));
    return { scene, key, tasks, total: scene.tasks.length };
  });
  const { scene, tasks, key, total } = session;
  const [i, setI] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [fin, setFin] = useState(false);
  const t = tasks[i];
  const isArrange = t.kind === "arrange";

  const [picked, setPicked] = useState<string | null>(null);
  const [bank, setBank] = useState<string[]>(() => (tasks[0].kind === "arrange" ? shuffle(tasks[0].solution || []) : []));
  const [placed, setPlaced] = useState<string[]>([]);
  const [checked, setChecked] = useState<null | boolean>(null);

  const answered = isArrange ? checked !== null : picked !== null;
  const correct = isArrange ? checked === true : picked === t.answer;
  const score = results.filter((r) => r.correct).length;
  const stars = starsFor(score, tasks.length);
  const info = useFinish(fin, () => cb.finish(key, results, stars, total));
  const exit = () => { cb.commit(key, results); onExit(); };

  useEffect(() => {
    setPicked(null); setChecked(null); setPlaced([]);
    setBank(tasks[i].kind === "arrange" ? shuffle(tasks[i].solution || []) : []);
  }, [i, tasks]);

  if (fin) {
    const a = resultActions(onNext, onExit, "Bức khác →");
    return <GameShell emoji="💬" title={scene.title} vi={scene.vi} onExit={onExit}>
      <GameResult title={`Đúng ${score}/${tasks.length} thử thách!`} stars={stars} info={info} {...a} />
    </GameShell>;
  }
  function answerMcq(o: string) {
    if (answered) return;
    setPicked(o);
    setResults((r) => [...r, { id: t.id, correct: o === t.answer }]);
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
    const ok = placed.join(" ") === (t.solution || []).join(" ");
    setChecked(ok);
    setResults((r) => [...r, { id: t.id, correct: ok }]);
  }
  const sol = t.solution || [];
  const arrangeTarget = sol.join(" ") + ".";
  const last = i + 1 >= tasks.length;
  return (
    <GameShell emoji="💬" title={scene.title} vi={scene.vi} onExit={exit}>
      <Scene image={scene.image} emojis={scene.emojis} name={scene.vi} />
      <div className="q-progress">Thử thách {i + 1}/{tasks.length}</div>
      <div className="talk-task">
        <span className="talk-kind">{TALK_KIND_LABEL[t.kind]}</span>
        <div className="talk-instr">{t.vi}</div>

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
            {t.q && <div className="talk-q">{t.q}</div>}
            <div className={`qopts ${answered ? "answered" : ""}`}>
              {(t.options || []).map((o) => (
                <button key={o} disabled={answered}
                  className={`qopt ${answered && o === t.answer ? "right" : ""} ${answered && o === picked && o !== t.answer ? "wrong" : ""}`}
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
                : <><span className="no">✗ Chưa đúng.</span> Đáp án: <b>{isArrange ? arrangeTarget : t.answer}</b></>}
            </div>
            <div className="talk-say">
              <span className="talk-say-en">🗣️ {t.say}</span>
              <button className="icbtn" onClick={() => speak(t.say, accent)}>🔊 Nói theo Maple</button>
              <span className="talk-say-note">(nói cho vui, không tính điểm)</span>
            </div>
            <button className="btn qnext" onClick={() => { if (last) setFin(true); else setI(i + 1); }}>
              {last ? "Xem kết quả →" : "Thử thách tiếp →"}
            </button>
          </>
        )}
      </div>
    </GameShell>
  );
}
function PictureTalk({ sceneId, cb, accent, onExit }: { sceneId?: string; cb: GameCallbacks; accent: "US" | "CA"; onExit: () => void }) {
  const initial = sceneId && talkSceneById(sceneId) ? sceneId : undefined;
  const galleryMode = !initial;
  const [chosen, setChosen] = useState<string | undefined>(initial);
  if (galleryMode && !chosen) {
    return <GameGallery emoji="💬" title="Xây câu từ hình ảnh" vi="Chọn bức tranh để mô tả"
      intro="Chọn một bức tranh — nhìn kỹ rồi chọn từ, điền từ, dùng giới từ và xếp câu mô tả."
      items={TALK_SCENES.map((s) => ({ id: s.id, name: s.vi, sub: s.title, image: s.image, total: s.tasks.length }))}
      prefix="talk" topics={cb.topics} onPick={setChosen} onExit={onExit} />;
  }
  return <TalkRound key={chosen} sceneId={chosen!} cb={cb} accent={accent}
    onExit={galleryMode ? () => setChosen(undefined) : onExit}
    onNext={galleryMode ? () => setChosen(undefined) : undefined} />;
}

/* ============ Echo Challenge (luyện nói tùy chọn, KHÔNG chấm điểm) ============ */
function EchoChallenge({ accent, onExit, cb }: { accent: "US" | "CA"; onExit: () => void; cb: GameCallbacks }) {
  const phrases = ECHO;
  const [i, setI] = useState(0);
  const [fin, setFin] = useState(false);
  const p = phrases[i];

  useEffect(() => { if (!fin && p) speak(p.en, accent); }, [i, fin, p, accent]);
  useEffect(() => { if (fin) cb.echoDone(); }, [fin]); // eslint-disable-line react-hooks/exhaustive-deps

  if (fin) {
    return <GameShell emoji="🎤" title="Echo with Maple" vi="Nói theo Maple" onExit={onExit}>
      <GameResult title="Giọng nói tuyệt vời! 🎤" info={{ newly: 0, explored: 0, total: 0 }}
        doneLabel="Xong →" onDone={onExit} />
      <p className="echo-note">Đây là luyện nói cho vui — không tính điểm.</p>
    </GameShell>;
  }
  return (
    <GameShell emoji="🎤" title="Echo with Maple" vi="Nói theo Maple" onExit={onExit}>
      <div className="q-progress">Câu {i + 1}/{phrases.length}</div>
      <div className="echo-card">
        <div className="echo-step">1️⃣ Nghe Maple đọc</div>
        <div className="echo-en">{p.en}</div>
        <div className="echo-vi">{p.vi}</div>
        <button className="btn" onClick={() => speak(p.en, accent)}>🔊 Nghe lại</button>
        <button className="btn ghost sm" onClick={() => speak(p.en, accent, 0.55)}>🐢 Nghe chậm</button>
        <div className="echo-step">2️⃣ Bạn nói theo, rồi bấm nút bên dưới</div>
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
  if (kind === "picdet") return <PictureDetective sceneId={refId} cb={cb} onExit={onExit} />;
  if (kind === "puzzle") return <SentencePuzzle setId={refId} cb={cb} onExit={onExit} />;
  if (kind === "riddle") return <RiddleGame setId={refId} cb={cb} accent={accent} onExit={onExit} />;
  if (kind === "talk") return <PictureTalk sceneId={refId} cb={cb} accent={accent} onExit={onExit} />;
  if (kind === "echo") return <EchoChallenge accent={accent} onExit={onExit} cb={cb} />;
  return null;
}
