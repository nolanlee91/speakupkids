"use client";

import { useEffect, useState } from "react";
import { speak, shuffle, celebrate, pickUnseen } from "@/lib/fx";
import { ECHO, type StopKind } from "@/lib/games";
import { DETECTIVE_SCENES, TALK_SCENES, detectiveSceneById, talkSceneById } from "@/lib/scenes";
import { PUZZLE_SETS, RIDDLE_SETS, puzzleSetById, riddleSetById } from "@/lib/banks";

/* ============ Khung chung + màn kết quả ============ */
function Scene({ image, emojis, note }: { image?: string; emojis: string[]; note: string }) {
  return (
    <div className="scene">
      {image
        ? <img className="scene-image" src={image} alt="" />
        : <><div className="scene-art" aria-hidden="true">{emojis.map((e, i) => <span key={i}>{e}</span>)}</div><div className="scene-note">🖼️ {note}</div></>}
    </div>
  );
}

function starsFor(score: number, total: number): number {
  const pct = total ? score / total : 1;
  return pct >= 0.8 ? 3 : pct >= 0.5 ? 2 : 1;
}

function GameResult({ title, sub, stars, onDone, doneLabel = "Tuyệt vời! →", secondary }: {
  title: string; sub: string; stars: number; onDone: () => void;
  doneLabel?: string; secondary?: { label: string; onClick: () => void };
}) {
  useEffect(() => { celebrate(!document.body.classList.contains("no-motion")); }, []);
  return (
    <div className="game-result">
      <div className="gr-stars">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
      <h3>{title}</h3>
      <p>{sub}</p>
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

/* onRound: ghi nhận 1 lượt đã hoàn thành.
   - sceneKey: khoá riêng từng cảnh/chủ đề (vd "talk:park") để lưu sao tốt nhất.
   - finish=true: bật màn thưởng & đóng game · finish=false: ghi thầm rồi ở lại (chơi tiếp). */
type OnRound = (sceneKey: string, stars: number, finish: boolean) => void;

/* ============ Thư viện cảnh/chủ đề: cho bé THẤY tất cả các bức & tự chọn ============ */
type GalleryItem = { id: string; name: string; sub: string; image?: string; emoji?: string };
function GameGallery({ emoji, title, vi, intro, items, seenPrefix, seen, best, onPick, onExit }: {
  emoji: string; title: string; vi: string; intro: string;
  items: GalleryItem[]; seenPrefix: string; seen: Record<string, string[]>; best: Record<string, number>;
  onPick: (id: string) => void; onExit: () => void;
}) {
  return (
    <GameShell emoji={emoji} title={title} vi={vi} onExit={onExit}>
      <p className="gallery-intro">{intro}</p>
      <div className="scene-gallery">
        {items.map((it) => {
          const key = seenPrefix + ":" + it.id;
          const explored = (seen[key]?.length || 0) > 0;
          const st = best[key] || 0;
          return (
            <button key={it.id} className={`scene-card ${explored ? "explored" : ""}`} onClick={() => onPick(it.id)}>
              <span className="sc-thumb">
                {it.image ? <img src={it.image} alt="" /> : <span className="sc-emoji">{it.emoji}</span>}
                {explored && <span className="sc-check">✓</span>}
              </span>
              <span className="sc-name">{it.name}</span>
              {explored
                ? <span className="sc-stars">{"⭐".repeat(st)}{"☆".repeat(3 - st)}</span>
                : <span className="sc-sub">{it.sub}</span>}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}

// Hai nút kết quả dùng chung cho mọi game (gallery: "khác/xong" · cố định: "tuyệt vời")
function resultActions(sceneKey: string, stars: number, onRound: OnRound, onNext: (() => void) | undefined, nextLabel: string) {
  return {
    doneLabel: onNext ? nextLabel : "Tuyệt vời! →",
    onDone: () => { if (onNext) { onRound(sceneKey, stars, false); onNext(); } else onRound(sceneKey, stars, true); },
    secondary: onNext ? { label: "Xong →", onClick: () => onRound(sceneKey, stars, true) } : undefined,
  };
}

/* ============ 1. Picture Detective ============ */
function DetectiveRound({ sceneId, seen, onSeen, onRound, onExit, onNext }: {
  sceneId: string; seen: Record<string, string[]>;
  onSeen?: (key: string, ids: string[]) => void; onRound: OnRound;
  onExit: () => void; onNext?: () => void;
}) {
  const [session] = useState(() => {
    const scene = detectiveSceneById(sceneId) || DETECTIVE_SCENES[0];
    const key = "picdet:" + scene.id;
    const { picked, nextSeen } = pickUnseen(scene.questions, seen[key] || [], 5);
    const qs = picked.map((q) => ({ ...q, options: shuffle(q.options) }));
    return { scene, key, qs, nextSeen };
  });
  const { scene, qs } = session;
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [fin, setFin] = useState(false);
  const q = qs[i];
  const answered = picked !== null;

  useEffect(() => { if (fin) onSeen?.(session.key, session.nextSeen); }, [fin]);

  if (fin) {
    const s = starsFor(score, qs.length);
    const a = resultActions(session.key, s, onRound, onNext, "Chơi bức khác →");
    return <GameShell emoji="🔎" title={scene.title} vi={scene.vi} onExit={onExit}>
      <GameResult title={`Đúng ${score}/${qs.length} câu!`} sub="Con mắt thám tử thật tinh! Chơi lại sẽ gặp câu khác."
        stars={s} {...a} />
    </GameShell>;
  }
  function answer(o: string) {
    if (answered) return;
    setPicked(o);
    if (o === q.answer) setScore((x) => x + 1);
  }
  return (
    <GameShell emoji="🔎" title={scene.title} vi={scene.vi} onExit={onExit}>
      <Scene image={scene.image} emojis={scene.emojis} note="" />
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
function PictureDetective({ sceneId, seen, best, onSeen, onRound, onExit }: {
  sceneId?: string; seen: Record<string, string[]>; best: Record<string, number>;
  onSeen?: (key: string, ids: string[]) => void; onRound: OnRound; onExit: () => void;
}) {
  const gallery = !sceneId;
  const [chosen, setChosen] = useState<string | undefined>(sceneId);
  if (gallery && !chosen) {
    return <GameGallery emoji="🔎" title="Thám tử hình ảnh" vi="Chọn bức tranh để điều tra"
      intro="Chọn một bức tranh để bắt đầu điều tra — mỗi bức có nhiều câu hỏi khác nhau!"
      items={DETECTIVE_SCENES.map((s) => ({ id: s.id, name: s.vi, sub: s.title, image: s.image }))}
      seenPrefix="picdet" seen={seen} best={best} onPick={setChosen} onExit={onExit} />;
  }
  return <DetectiveRound key={chosen} sceneId={chosen!} seen={seen} onSeen={onSeen} onRound={onRound}
    onExit={gallery ? () => setChosen(undefined) : onExit}
    onNext={gallery ? () => setChosen(undefined) : undefined} />;
}

/* ============ 2. Sentence Puzzle ============ */
const PUZZLE_META: Record<string, [string, string]> = {
  daily: ["Đời sống", "🏠"], school: ["Trường lớp", "🏫"], food: ["Đồ ăn", "🍎"],
  places: ["Nơi chốn & Du lịch", "🗺️"], feelings: ["Cảm xúc", "😊"], past: ["Chuyện đã qua", "⏰"],
};
function PuzzleRound({ setId, seen, onSeen, onRound, onExit, onNext }: {
  setId: string; seen: Record<string, string[]>;
  onSeen?: (key: string, ids: string[]) => void; onRound: OnRound;
  onExit: () => void; onNext?: () => void;
}) {
  const [session] = useState(() => {
    const set = puzzleSetById(setId) || PUZZLE_SETS[0];
    const key = "puzzle:" + set.id;
    const { picked, nextSeen } = pickUnseen(set.items, seen[key] || [], 6);
    return { set, key, items: picked, nextSeen };
  });
  const { set, items } = session;
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [fin, setFin] = useState(false);
  const item = items[i];
  const [bank, setBank] = useState<string[]>(() => shuffle(items[0].solution));
  const [placed, setPlaced] = useState<string[]>([]);
  const [result, setResult] = useState<null | boolean>(null);

  useEffect(() => { if (fin) onSeen?.(session.key, session.nextSeen); }, [fin]);
  useEffect(() => { setBank(shuffle(items[i].solution)); setPlaced([]); setResult(null); }, [i, items]);

  if (fin) {
    const s = starsFor(score, items.length);
    const a = resultActions(session.key, s, onRound, onNext, "Chủ đề khác →");
    return <GameShell emoji="🧩" title="Sentence Puzzle" vi={`Xếp câu · ${set.title}`} onExit={onExit}>
      <GameResult title={`Xếp đúng ${score}/${items.length} câu!`} sub="Ghép câu siêu đỉnh! Chơi lại sẽ gặp câu khác."
        stars={s} {...a} />
    </GameShell>;
  }
  function place(w: string, idx: number) {
    if (result !== null) return;
    setPlaced((p) => [...p, w]);
    setBank((b) => b.filter((_, k) => k !== idx));
  }
  function unplace(idx: number) {
    if (result !== null) return;
    const w = placed[idx];
    setPlaced((p) => p.filter((_, k) => k !== idx));
    setBank((b) => [...b, w]);
  }
  function check() {
    const ok = placed.join(" ") === item.solution.join(" ");
    setResult(ok);
    if (ok) setScore((x) => x + 1);
  }
  const target = item.solution.join(" ") + ".";
  return (
    <GameShell emoji="🧩" title="Sentence Puzzle" vi={`Xếp câu · ${set.title}`} onExit={onExit}>
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
function SentencePuzzle({ setId, seen, best, onSeen, onRound, onExit }: {
  setId?: string; seen: Record<string, string[]>; best: Record<string, number>;
  onSeen?: (key: string, ids: string[]) => void; onRound: OnRound; onExit: () => void;
}) {
  const gallery = !setId;
  const [chosen, setChosen] = useState<string | undefined>(setId);
  if (gallery && !chosen) {
    return <GameGallery emoji="🧩" title="Xếp câu" vi="Chọn một chủ đề"
      intro="Chọn một chủ đề để luyện xếp câu — mỗi chủ đề có 8 câu khác nhau!"
      items={PUZZLE_SETS.map((s) => ({ id: s.id, name: PUZZLE_META[s.id]?.[0] || s.title, sub: s.title, emoji: PUZZLE_META[s.id]?.[1] || "🧩" }))}
      seenPrefix="puzzle" seen={seen} best={best} onPick={setChosen} onExit={onExit} />;
  }
  return <PuzzleRound key={chosen} setId={chosen!} seen={seen} onSeen={onSeen} onRound={onRound}
    onExit={gallery ? () => setChosen(undefined) : onExit}
    onNext={gallery ? () => setChosen(undefined) : undefined} />;
}

/* ============ 3. English Riddles ============ */
const RIDDLE_META: Record<string, [string, string]> = {
  animals: ["Con vật", "🐘"], food: ["Đồ ăn", "🍎"], places: ["Nơi chốn", "🏖️"],
  objects: ["Đồ vật", "🎒"], nature: ["Thiên nhiên", "🌈"], logic: ["Đố mẹo", "🧠"],
};
function RiddleRound({ setId, seen, onSeen, onRound, accent, onExit, onNext }: {
  setId: string; seen: Record<string, string[]>;
  onSeen?: (key: string, ids: string[]) => void; onRound: OnRound;
  accent: "US" | "CA"; onExit: () => void; onNext?: () => void;
}) {
  const [session] = useState(() => {
    const set = riddleSetById(setId) || RIDDLE_SETS[0];
    const key = "riddle:" + set.id;
    const { picked, nextSeen } = pickUnseen(set.items, seen[key] || [], 5);
    const items = picked.map((r) => ({ ...r, options: shuffle(r.options) }));
    return { set, key, items, nextSeen };
  });
  const { set, items } = session;
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [fin, setFin] = useState(false);
  const r = items[i];
  const answered = picked !== null;

  useEffect(() => { if (fin) onSeen?.(session.key, session.nextSeen); }, [fin]);

  if (fin) {
    const s = starsFor(score, items.length);
    const a = resultActions(session.key, s, onRound, onNext, "Bộ khác →");
    return <GameShell emoji="🦉" title="English Riddles" vi={`Đố vui · ${set.title}`} onExit={onExit}>
      <GameResult title={`Giải đúng ${score}/${items.length} câu!`} sub="Cú thông thái gật gù khen bạn! Chơi lại sẽ gặp câu khác."
        stars={s} {...a} />
    </GameShell>;
  }
  function answer(o: string) {
    if (answered) return;
    setPicked(o);
    if (o === r.answer) setScore((x) => x + 1);
  }
  return (
    <GameShell emoji="🦉" title="English Riddles" vi={`Đố vui · ${set.title}`} onExit={onExit}>
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
          <div className="qfb">{picked === r.answer ? <span className="ok">✓ Đúng rồi!</span> : <><span className="no">✗ Chưa đúng.</span> Đáp án: <b>{r.answer}</b></>}</div>
          <button className="btn qnext" onClick={() => { if (i + 1 < items.length) { setI(i + 1); setPicked(null); } else setFin(true); }}>
            {i + 1 < items.length ? "Câu tiếp →" : "Xem kết quả →"}
          </button>
        </>
      )}
    </GameShell>
  );
}
function RiddleGame({ setId, seen, best, onSeen, onRound, accent, onExit }: {
  setId?: string; seen: Record<string, string[]>; best: Record<string, number>;
  onSeen?: (key: string, ids: string[]) => void; onRound: OnRound;
  accent: "US" | "CA"; onExit: () => void;
}) {
  const gallery = !setId;
  const [chosen, setChosen] = useState<string | undefined>(setId);
  if (gallery && !chosen) {
    return <GameGallery emoji="🦉" title="Đố vui tiếng Anh" vi="Chọn một bộ câu đố"
      intro="Chọn một bộ câu đố — mỗi bộ có 8 câu đố khác nhau!"
      items={RIDDLE_SETS.map((s) => ({ id: s.id, name: RIDDLE_META[s.id]?.[0] || s.title, sub: s.title, emoji: RIDDLE_META[s.id]?.[1] || "🦉" }))}
      seenPrefix="riddle" seen={seen} best={best} onPick={setChosen} onExit={onExit} />;
  }
  return <RiddleRound key={chosen} setId={chosen!} seen={seen} onSeen={onSeen} onRound={onRound} accent={accent}
    onExit={gallery ? () => setChosen(undefined) : onExit}
    onNext={gallery ? () => setChosen(undefined) : undefined} />;
}

/* ============ 4. Picture Talk — thử thách mô tả tranh CÓ ĐÁP ÁN ============ */
const TALK_KIND_LABEL: Record<string, string> = {
  choose: "Chọn câu đúng", spot: "Tìm câu sai", fill: "Điền từ", position: "Vị trí", arrange: "Xếp câu mô tả",
};
function TalkRound({ sceneId, seen, onSeen, onRound, accent, onExit, onNext }: {
  sceneId: string; seen: Record<string, string[]>; onSeen?: (key: string, ids: string[]) => void;
  onRound: OnRound; accent: "US" | "CA"; onExit: () => void; onNext?: () => void;
}) {
  const [session] = useState(() => {
    const scene = talkSceneById(sceneId) || TALK_SCENES[0];
    const key = "talk:" + scene.id;
    const { picked, nextSeen } = pickUnseen(scene.tasks, seen[key] || [], 5);
    const tasks = picked.map((t) => (t.options ? { ...t, options: shuffle(t.options) } : t));
    return { scene, key, tasks, nextSeen };
  });
  const { scene, tasks } = session;
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [fin, setFin] = useState(false);
  const t = tasks[i];
  const isArrange = t.kind === "arrange";

  // MCQ state
  const [picked, setPicked] = useState<string | null>(null);
  // Arrange state
  const [bank, setBank] = useState<string[]>(() => (tasks[0].kind === "arrange" ? shuffle(tasks[0].solution || []) : []));
  const [placed, setPlaced] = useState<string[]>([]);
  const [checked, setChecked] = useState<null | boolean>(null);

  const answered = isArrange ? checked !== null : picked !== null;
  const correct = isArrange ? checked === true : picked === t.answer;

  useEffect(() => { if (fin) onSeen?.(session.key, session.nextSeen); }, [fin]);
  useEffect(() => {
    setPicked(null); setChecked(null); setPlaced([]);
    setBank(tasks[i].kind === "arrange" ? shuffle(tasks[i].solution || []) : []);
  }, [i, tasks]);

  if (fin) {
    const s = starsFor(score, tasks.length);
    const a = resultActions(session.key, s, onRound, onNext, "Bức khác →");
    return <GameShell emoji="💬" title={scene.title} vi={scene.vi} onExit={onExit}>
      <GameResult title={`Đúng ${score}/${tasks.length} thử thách!`} sub="Mô tả tranh giỏi lắm! Chơi lại sẽ gặp thử thách khác."
        stars={s} {...a} />
    </GameShell>;
  }
  function answerMcq(o: string) {
    if (answered) return;
    setPicked(o);
    if (o === t.answer) setScore((x) => x + 1);
  }
  function place(w: string, idx: number) {
    if (checked !== null) return;
    setPlaced((p) => [...p, w]);
    setBank((b) => b.filter((_, k) => k !== idx));
  }
  function unplace(idx: number) {
    if (checked !== null) return;
    const w = placed[idx];
    setPlaced((p) => p.filter((_, k) => k !== idx));
    setBank((b) => [...b, w]);
  }
  function check() {
    const ok = placed.join(" ") === (t.solution || []).join(" ");
    setChecked(ok);
    if (ok) setScore((x) => x + 1);
  }
  const sol = t.solution || [];
  const arrangeTarget = sol.join(" ") + ".";
  const last = i + 1 >= tasks.length;
  return (
    <GameShell emoji="💬" title={scene.title} vi={scene.vi} onExit={onExit}>
      <Scene image={scene.image} emojis={scene.emojis} note="" />
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
function PictureTalk({ sceneId, seen, best, onSeen, onRound, accent, onExit }: {
  sceneId?: string; seen: Record<string, string[]>; best: Record<string, number>;
  onSeen?: (key: string, ids: string[]) => void; onRound: OnRound; accent: "US" | "CA"; onExit: () => void;
}) {
  const gallery = !sceneId;
  const [chosen, setChosen] = useState<string | undefined>(sceneId);
  if (gallery && !chosen) {
    return <GameGallery emoji="💬" title="Mô tả hình ảnh" vi="Chọn bức tranh để mô tả"
      intro="Chọn một bức tranh — nhìn kỹ rồi chọn/xếp câu mô tả đúng. Có 6 bức khác nhau!"
      items={TALK_SCENES.map((s) => ({ id: s.id, name: s.vi, sub: s.title, image: s.image }))}
      seenPrefix="talk" seen={seen} best={best} onPick={setChosen} onExit={onExit} />;
  }
  return <TalkRound key={chosen} sceneId={chosen!} seen={seen} onSeen={onSeen} onRound={onRound} accent={accent}
    onExit={gallery ? () => setChosen(undefined) : onExit}
    onNext={gallery ? () => setChosen(undefined) : undefined} />;
}

/* ============ 5. Echo Challenge (Shadowing rút gọn) ============ */
function EchoChallenge({ accent, onExit, onRound }: { accent: "US" | "CA"; onExit: () => void; onRound: OnRound }) {
  const phrases = ECHO;
  const [i, setI] = useState(0);
  const [fin, setFin] = useState(false);
  const p = phrases[i];

  useEffect(() => { if (!fin && p) speak(p.en, accent); }, [i, fin, p, accent]);

  if (fin) {
    return <GameShell emoji="🎤" title="Echo with Maple" vi="Nói theo Maple" onExit={onExit}>
      <GameResult title="Giọng nói tuyệt vời! 🎤" sub={`Bạn đã nói theo ${phrases.length} câu cùng Maple.`} stars={3}
        onDone={() => onRound("echo", 3, true)} />
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
export function GamePlay({ kind, refId, accent, seen, best, onSeen, onRound, onExit }: {
  kind: StopKind; refId?: string; accent: "US" | "CA";
  seen?: Record<string, string[]>; best?: Record<string, number>;
  onSeen?: (key: string, ids: string[]) => void; onRound: OnRound; onExit: () => void;
}) {
  const sn = seen || {};
  const bt = best || {};
  if (kind === "picdet") {
    return <PictureDetective sceneId={refId} seen={sn} best={bt} onSeen={onSeen} onRound={onRound} onExit={onExit} />;
  }
  if (kind === "puzzle") {
    return <SentencePuzzle setId={refId} seen={sn} best={bt} onSeen={onSeen} onRound={onRound} onExit={onExit} />;
  }
  if (kind === "riddle") {
    return <RiddleGame setId={refId} seen={sn} best={bt} onSeen={onSeen} onRound={onRound} accent={accent} onExit={onExit} />;
  }
  if (kind === "talk") {
    return <PictureTalk sceneId={refId} seen={sn} best={bt} onSeen={onSeen} onRound={onRound} accent={accent} onExit={onExit} />;
  }
  if (kind === "echo") return <EchoChallenge accent={accent} onExit={onExit} onRound={onRound} />;
  return null;
}

// (giữ để tương thích) — Games nay mở thư viện cảnh; Adventure mở đúng ref
export const FIRST_REF: Record<Exclude<StopKind, "echo" | "shadow">, string> = {
  picdet: "park", puzzle: "daily", riddle: "animals", talk: "park",
};
