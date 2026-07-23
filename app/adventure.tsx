"use client";

import { useState } from "react";
import type { AppState } from "@/lib/state";
import { missionOf, setMissionStep, learnLessonDone } from "@/lib/state";
import {
  CHAPTERS, missionById,
  type AdventureMission, type MissionStep, type StoryBeat, type AdventureChapter,
} from "@/lib/adventures";
import { speak, shuffle } from "@/lib/fx";

const GEN = "/assets/images/gen/";

/* ==================== Adventure tab: bản đồ chương + trình chơi nhiệm vụ ==================== */
export function Adventure({ state, setState, accent, onComplete, onLearn }: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  accent: "US" | "CA";
  onComplete: (missionId: string, stars: number, sticker?: string, badge?: string) => void;
  onLearn: () => void;
}) {
  const [playing, setPlaying] = useState<string | null>(null);

  if (playing) {
    const m = missionById(playing);
    if (!m) return null;
    return (
      <MissionPlayer mission={m} accent={accent}
        onStep={(step) => setState((s) => setMissionStep(s, m.id, step))}
        onExit={() => setPlaying(null)}
        onFinish={(stars) => { onComplete(m.id, stars, m.reward.sticker, m.reward.badge); setPlaying(null); }} />
    );
  }
  return <ChapterMap state={state} onLearn={onLearn}
    onPlay={(ch) => { setState((s) => setMissionStep(s, ch.missionId!, missionOf(s, ch.missionId!).step)); setPlaying(ch.missionId!); }} />;
}

/* ---------- Bản đồ 6 chương ---------- */
function ChapterMap({ state, onPlay, onLearn }: {
  state: AppState; onPlay: (ch: AdventureChapter) => void; onLearn: () => void;
}) {
  return (
    <section className="adventure">
      <div className="adv-intro">
        <img className="adv-maple" src={`${GEN}maple-pose-cheer.webp`} alt="" />
        <div>
          <h2 className="chapter">Phiêu lưu cùng Maple</h2>
          <p className="adv-sub">Dùng tiếng Anh đã học để hoàn thành nhiệm vụ theo câu chuyện — mỗi chương một Unit.</p>
        </div>
      </div>

      <ol className="chapter-list">
        {CHAPTERS.map((ch) => {
          const m = ch.missionId ? missionOf(state, ch.missionId) : null;
          const done = !!m?.done;
          const started = !!m && m.step > 0 && !done;
          const learnReady = learnLessonDone(state, ch.unitId);
          return (
            <li key={ch.id} className={`chapter-card ${ch.ready ? "" : "locked"} ${done ? "done" : ""}`}>
              <div className="cc-media" style={{ backgroundImage: `url('${ch.sceneImage}')` }} aria-hidden="true">
                <span className="cc-n">{ch.n}</span>
                {done && <span className="cc-badge ok">✓</span>}
                {!ch.ready && <span className="cc-badge lock">🔒</span>}
              </div>
              <div className="cc-body">
                <div className="cc-kicker">Chương {ch.n}</div>
                <h3>{ch.vi} <small>· {ch.title}</small></h3>
                <p className="cc-blurb">{ch.ready ? ch.blurb : "Đang biên soạn · sắp mở"}</p>
                {ch.ready ? (
                  <div className="cc-actions">
                    {!learnReady && <button className="btn ghost sm" onClick={onLearn}>Học Unit này trước</button>}
                    <button className="btn accent sm" onClick={() => onPlay(ch)}>
                      {done ? "Chơi lại ▸" : started ? "Tiếp tục ▸" : "Bắt đầu nhiệm vụ ▸"}
                    </button>
                  </div>
                ) : <div className="cc-soon">🔒 Sắp mở</div>}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="adv-end"><span>🏁</span>Còn nhiều chương mới đang được viết…</div>
    </section>
  );
}

/* ---------- Trình chơi nhiệm vụ: câu chuyện → các bước → kết thúc ---------- */
const WHO_FIG: Record<string, string> = { maple: `${GEN}mascot-wave.webp`, theo: "", narrator: `${GEN}mascot-book.webp` };

function MissionPlayer({ mission, accent, onStep, onExit, onFinish }: {
  mission: AdventureMission; accent: "US" | "CA";
  onStep: (step: number) => void; onExit: () => void; onFinish: (stars: number) => void;
}) {
  const [phase, setPhase] = useState<"intro" | "steps" | "outro">("intro");
  const [bi, setBi] = useState(0);   // chỉ số beat (intro/outro)
  const [si, setSi] = useState(0);   // chỉ số bước
  const [wrong, setWrong] = useState(0);

  const beats = phase === "intro" ? mission.intro : mission.outro;
  const stars = Math.max(1, Math.min(mission.reward.stars, 3 - Math.min(2, wrong)));

  function nextBeat() {
    if (bi + 1 < beats.length) { setBi(bi + 1); return; }
    if (phase === "intro") { setPhase("steps"); setSi(0); onStep(0); }
    else onFinish(stars); // hết outro → nhận thưởng
  }
  function stepDone(nWrong: number) {
    if (nWrong) setWrong((w) => w + nWrong);
    if (si + 1 < mission.steps.length) { const n = si + 1; setSi(n); onStep(n); }
    else { setPhase("outro"); setBi(0); onStep(mission.steps.length); }
  }

  return (
    <div id="game" className="game-overlay">
      <div className="game-top">
        <button className="bk" onClick={onExit}>← Thoát</button>
        <h3>🗺️ {mission.vi}</h3>
        <span className="game-vi">{phase === "steps" ? `Bước ${si + 1}/${mission.steps.length}` : "Câu chuyện"}</span>
      </div>
      <div className="game-body">
        {phase !== "steps"
          ? <StoryCard beat={beats[bi]} scene={mission.sceneImage} accent={accent}
              last={bi + 1 >= beats.length} isOutro={phase === "outro"} onNext={nextBeat} />
          : <StepView key={si} step={mission.steps[si]} accent={accent} onDone={stepDone} />}
      </div>
    </div>
  );
}

function StoryCard({ beat, scene, accent, last, isOutro, onNext }: {
  beat: StoryBeat; scene: string; accent: "US" | "CA"; last: boolean; isOutro: boolean; onNext: () => void;
}) {
  const who = beat.who || "narrator";
  const fig = WHO_FIG[who];
  return (
    <div className="mission-story">
      <div className="ms-scene"><img src={scene} alt="" /></div>
      <div className={`ms-beat who-${who}`}>
        {fig ? <img className="ms-fig" src={fig} alt="" /> : <span className="ms-fig emoji" aria-hidden="true">🧒</span>}
        <div className="ms-bubble">
          <div className="ms-en">{beat.text}</div>
          {beat.vi && <div className="ms-vi">{beat.vi}</div>}
          <button className="icbtn sm" onClick={() => speak(beat.text, accent)}>🔊 Nghe</button>
        </div>
      </div>
      <button className="btn accent ms-next" onClick={onNext}>
        {last ? (isOutro ? "Nhận huy hiệu 🏅" : "Bắt đầu nhiệm vụ →") : "Tiếp →"}
      </button>
    </div>
  );
}

/* ---------- Một bước nhiệm vụ (MCQ / xếp câu / chọn hành động) ---------- */
function StepView({ step, accent, onDone }: { step: MissionStep; accent: "US" | "CA"; onDone: (wrong: number) => void }) {
  return (
    <div className="mission-step">
      <span className="ms-kind">{step.label}</span>
      <div className="ms-prompt">{step.prompt}<div className="ms-prompt-vi">{step.vi}</div></div>
      {step.kind === "mcq" && <McqStep step={step} accent={accent} onDone={onDone} />}
      {step.kind === "arrange" && <ArrangeStep step={step} accent={accent} onDone={onDone} />}
      {step.kind === "choice" && <ChoiceStep step={step} onDone={onDone} />}
    </div>
  );
}

function McqStep({ step, accent, onDone }: { step: Extract<MissionStep, { kind: "mcq" }>; accent: "US" | "CA"; onDone: (wrong: number) => void }) {
  const [opts] = useState(() => shuffle(step.options));
  const [picked, setPicked] = useState<string | null>(null);
  const answered = picked !== null;
  const correct = picked === step.answer;
  return (
    <>
      <div className={`qopts ${answered ? "answered" : ""}`}>
        {opts.map((o) => (
          <button key={o} disabled={answered}
            className={`qopt ${answered && o === step.answer ? "right" : ""} ${answered && o === picked && o !== step.answer ? "wrong" : ""}`}
            onClick={() => setPicked(o)}>{o}</button>
        ))}
      </div>
      {answered && (
        <>
          <div className="qfb">{correct ? <span className="ok">✓ Chính xác!</span> : <><span className="no">✗ Chưa đúng.</span> Đáp án: <b>{step.answer}</b></>}{step.explainVi && <div className="q-explain">💡 {step.explainVi}</div>}</div>
          <button className="btn qnext" onClick={() => onDone(correct ? 0 : 1)}>Tiếp →</button>
        </>
      )}
    </>
  );
}

function ArrangeStep({ step, accent, onDone }: { step: Extract<MissionStep, { kind: "arrange" }>; accent: "US" | "CA"; onDone: (wrong: number) => void }) {
  const [bank, setBank] = useState<string[]>(() => shuffle(step.solution));
  const [placed, setPlaced] = useState<string[]>([]);
  const [result, setResult] = useState<null | boolean>(null);
  const target = step.solution.join(" ");
  return (
    <>
      <div className={`puzzle-line ${result === true ? "ok" : result === false ? "no" : ""}`}>
        {placed.length === 0 && <span className="ph">Chạm từ bên dưới để xếp câu…</span>}
        {placed.map((w, k) => <button key={k} className="tile placed" onClick={() => { if (result !== null) return; setPlaced((p) => p.filter((_, i) => i !== k)); setBank((b) => [...b, w]); }}>{w}</button>)}
      </div>
      <div className="puzzle-bank">
        {bank.map((w, k) => <button key={k} className="tile" onClick={() => { if (result !== null) return; setBank((b) => b.filter((_, i) => i !== k)); setPlaced((p) => [...p, w]); }}>{w}</button>)}
      </div>
      {result === null ? (
        <button className="btn" disabled={placed.length !== step.solution.length} onClick={() => setResult(placed.join(" ") === target)}>Kiểm tra</button>
      ) : (
        <>
          <div className="qfb">{result ? <span className="ok">✓ Chuẩn luôn!</span> : <><span className="no">✗ Chưa đúng.</span> Đáp án: <b>{target}.</b></>}</div>
          <div className="talk-say"><span className="talk-say-en">🗣️ {step.say || target + "."}</span><button className="icbtn" onClick={() => speak(step.say || target, accent)}>🔊 Nghe</button></div>
          <button className="btn qnext" onClick={() => onDone(result ? 0 : 1)}>Tiếp →</button>
        </>
      )}
    </>
  );
}

function ChoiceStep({ step, onDone }: { step: Extract<MissionStep, { kind: "choice" }>; onDone: (wrong: number) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState(0);
  const chosen = picked !== null ? step.options[picked] : null;
  return (
    <>
      <div className="choice-list">
        {step.options.map((o, k) => (
          <button key={k} disabled={chosen?.correct}
            className={`choice-card ${picked === k ? (o.correct ? "right" : "wrong") : ""}`}
            onClick={() => { if (chosen?.correct) return; setPicked(k); if (!o.correct) setWrong((w) => w + 1); }}>
            {o.label}
          </button>
        ))}
      </div>
      {chosen && (
        <>
          <div className="qfb">{chosen.correct ? <span className="ok">✓ {chosen.feedback}</span> : <span className="no">{chosen.feedback}</span>}</div>
          {chosen.correct && <button className="btn qnext" onClick={() => onDone(wrong ? 1 : 0)}>Tiếp →</button>}
        </>
      )}
    </>
  );
}
