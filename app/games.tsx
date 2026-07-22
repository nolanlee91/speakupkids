"use client";

import { useEffect, useState } from "react";
import { speak, shuffle, celebrate, pickUnseen } from "@/lib/fx";
import { ECHO, type StopKind } from "@/lib/games";
import { detectiveSceneById, randomDetectiveScene, talkSceneById, randomTalkScene } from "@/lib/scenes";
import { puzzleSetById, randomPuzzleSet, riddleSetById, randomRiddleSet } from "@/lib/banks";

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

function GameResult({ title, sub, stars, onDone }: { title: string; sub: string; stars: number; onDone: () => void }) {
  useEffect(() => { celebrate(!document.body.classList.contains("no-motion")); }, []);
  return (
    <div className="game-result">
      <div className="gr-stars">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
      <h3>{title}</h3>
      <p>{sub}</p>
      <button className="btn green" onClick={onDone}>Tuyệt vời! →</button>
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

/* ============ 1. Picture Detective (ngân hàng cảnh + bốc 5 câu, chống lặp) ============ */
function PictureDetective({ sceneId, seen, onSeen, onBest, onExit, onFinish }: {
  sceneId?: string; seen: Record<string, string[]>;
  onSeen?: (key: string, ids: string[]) => void; onBest?: (score: number) => void;
  onExit: () => void; onFinish: (stars: number) => void;
}) {
  // Dựng 1 lượt chơi: cảnh (chỉ định hoặc ngẫu nhiên) + 5 câu chưa gặp
  const [session] = useState(() => {
    const scene = (sceneId && detectiveSceneById(sceneId)) || randomDetectiveScene();
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

  useEffect(() => { onSeen?.(session.key, session.nextSeen); }, []); // lưu "đã gặp" 1 lần

  if (fin) {
    const s = starsFor(score, qs.length);
    return <GameShell emoji="🔎" title={scene.title} vi={scene.vi} onExit={onExit}>
      <GameResult title={`Đúng ${score}/${qs.length} câu!`} sub="Con mắt thám tử thật tinh! Chơi lại sẽ gặp câu khác." stars={s} onDone={() => { onBest?.(score); onFinish(s); }} />
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

/* ============ 2. Sentence Puzzle (ngân hàng 6 chủ đề, bốc 6 câu, chống lặp) ============ */
function SentencePuzzle({ setId, seen, onSeen, onBest, onExit, onFinish }: {
  setId?: string; seen: Record<string, string[]>;
  onSeen?: (key: string, ids: string[]) => void; onBest?: (score: number) => void;
  onExit: () => void; onFinish: (stars: number) => void;
}) {
  const [session] = useState(() => {
    const set = (setId && puzzleSetById(setId)) || randomPuzzleSet();
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

  useEffect(() => { onSeen?.(session.key, session.nextSeen); }, []);
  useEffect(() => { setBank(shuffle(items[i].solution)); setPlaced([]); setResult(null); }, [i, items]);

  if (fin) {
    const s = starsFor(score, items.length);
    return <GameShell emoji="🧩" title="Sentence Puzzle" vi={`Xếp câu · ${set.title}`} onExit={onExit}>
      <GameResult title={`Xếp đúng ${score}/${items.length} câu!`} sub="Ghép câu siêu đỉnh! Chơi lại sẽ gặp câu khác." stars={s} onDone={() => { onBest?.(score); onFinish(s); }} />
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

/* ============ 3. English Riddles (ngân hàng 6 bộ, bốc 5 câu, chống lặp) ============ */
function RiddleGame({ setId, seen, onSeen, onBest, accent, onExit, onFinish }: {
  setId?: string; seen: Record<string, string[]>;
  onSeen?: (key: string, ids: string[]) => void; onBest?: (score: number) => void;
  accent: "US" | "CA"; onExit: () => void; onFinish: (stars: number) => void;
}) {
  const [session] = useState(() => {
    const set = (setId && riddleSetById(setId)) || randomRiddleSet();
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

  useEffect(() => { onSeen?.(session.key, session.nextSeen); }, []);

  if (fin) {
    const s = starsFor(score, items.length);
    return <GameShell emoji="🦉" title="English Riddles" vi={`Đố vui · ${set.title}`} onExit={onExit}>
      <GameResult title={`Giải đúng ${score}/${items.length} câu!`} sub="Cú thông thái gật gù khen bạn! Chơi lại sẽ gặp câu khác." stars={s} onDone={() => { onBest?.(score); onFinish(s); }} />
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

/* ============ 4. Picture Talk (6 cảnh, bốc 6 prompt, chống lặp — nói, không ghi âm) ============ */
function PictureTalk({ sceneId, seen, onSeen, accent, onExit, onFinish }: {
  sceneId?: string; seen: Record<string, string[]>; onSeen?: (key: string, ids: string[]) => void;
  accent: "US" | "CA"; onExit: () => void; onFinish: (stars: number) => void;
}) {
  const [session] = useState(() => {
    const scene = (sceneId && talkSceneById(sceneId)) || randomTalkScene();
    const key = "talk:" + scene.id;
    const withId = scene.prompts.map((p, idx) => ({ ...p, id: scene.id + "p" + idx }));
    const { picked, nextSeen } = pickUnseen(withId, seen[key] || [], 6);
    return { scene, key, prompts: picked, nextSeen };
  });
  const { scene, prompts } = session;
  const [said, setSaid] = useState<boolean[]>(() => prompts.map(() => false));
  const [fin, setFin] = useState(false);
  const count = said.filter(Boolean).length;

  useEffect(() => { onSeen?.(session.key, session.nextSeen); }, []);

  if (fin) {
    return <GameShell emoji="💬" title={scene.title} vi={scene.vi} onExit={onExit}>
      <GameResult title="Nói hay lắm! 🌟" sub={`Bạn đã nói ${count}/${prompts.length} câu về bức tranh.`} stars={3} onDone={() => onFinish(3)} />
    </GameShell>;
  }
  return (
    <GameShell emoji="💬" title={scene.title} vi={scene.vi} onExit={onExit}>
      <Scene image={scene.image} emojis={scene.emojis} note="" />
      <div className="talk-intro">🦫 {scene.intro}</div>
      <div className="talk-list">
        {prompts.map((p, k) => (
          <div key={k} className={`talk-item ${said[k] ? "done" : ""}`}>
            <div className="talk-en">{p.en}</div>
            <div className="talk-vi">{p.vi}</div>
            <div className="talk-ctrls">
              <button className="icbtn" onClick={() => speak(p.en, accent)}>🔊 Maple đọc</button>
              <button className="icbtn learn" onClick={() => setSaid((s) => s.map((v, j) => (j === k ? true : v)))}>
                {said[k] ? "✓ Đã nói" : "🎙️ Mình nói xong"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="btn accent" disabled={count === 0} onClick={() => setFin(true)}>
        {count < prompts.length ? `Xong (${count}/${prompts.length})` : "Hoàn thành 🎉"}
      </button>
    </GameShell>
  );
}

/* ============ 5. Echo Challenge (Shadowing rút gọn) ============ */
function EchoChallenge({ accent, onExit, onFinish }: { accent: "US" | "CA"; onExit: () => void; onFinish: (stars: number) => void }) {
  const phrases = ECHO;
  const [i, setI] = useState(0);
  const [fin, setFin] = useState(false);
  const p = phrases[i];

  useEffect(() => { if (!fin && p) speak(p.en, accent); }, [i, fin, p, accent]);

  if (fin) {
    return <GameShell emoji="🎤" title="Echo with Maple" vi="Nói theo Maple" onExit={onExit}>
      <GameResult title="Giọng nói tuyệt vời! 🎤" sub={`Bạn đã nói theo ${phrases.length} câu cùng Maple.`} stars={3} onDone={() => onFinish(3)} />
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
export function GamePlay({ kind, refId, accent, seen, onSeen, onBest, onExit, onFinish }: {
  kind: StopKind; refId?: string; accent: "US" | "CA";
  seen?: Record<string, string[]>; onSeen?: (key: string, ids: string[]) => void; onBest?: (score: number) => void;
  onExit: () => void; onFinish: (stars: number) => void;
}) {
  if (kind === "picdet") {
    return <PictureDetective sceneId={refId} seen={seen || {}} onSeen={onSeen} onBest={onBest} onExit={onExit} onFinish={onFinish} />;
  }
  if (kind === "puzzle") {
    return <SentencePuzzle setId={refId} seen={seen || {}} onSeen={onSeen} onBest={onBest} onExit={onExit} onFinish={onFinish} />;
  }
  if (kind === "riddle") {
    return <RiddleGame setId={refId} seen={seen || {}} onSeen={onSeen} onBest={onBest} accent={accent} onExit={onExit} onFinish={onFinish} />;
  }
  if (kind === "talk") {
    return <PictureTalk sceneId={refId} seen={seen || {}} onSeen={onSeen} accent={accent} onExit={onExit} onFinish={onFinish} />;
  }
  if (kind === "echo") return <EchoChallenge accent={accent} onExit={onExit} onFinish={onFinish} />;
  return null;
}

// (giữ để tương thích) — Games nay mở ngẫu nhiên nên không dùng nữa
export const FIRST_REF: Record<Exclude<StopKind, "echo" | "shadow">, string> = {
  picdet: "pd-park", puzzle: "puzzle-everyday", riddle: "riddle-animals", talk: "pt-park",
};
