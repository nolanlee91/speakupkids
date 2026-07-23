"use client";

import { useState } from "react";
import type { AppState } from "@/lib/state";
import { missionOf, setMissionStep } from "@/lib/state";
import {
  SEASONS, missionById, chapterStatuses,
  type AdventureMission, type MissionStep, type StoryBeat, type AdventureChapter, type AdventureSeason,
} from "@/lib/adventures";
import { speak, shuffle } from "@/lib/fx";

const GEN = "/assets/images/gen/";

/* ==================== Adventure tab: chiến dịch theo mùa + trình chơi nhiệm vụ ==================== */
export function Adventure({ state, setState, accent, onComplete }: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  accent: "US" | "CA";
  onComplete: (missionId: string, stars: number, sticker?: string, badge?: string) => void;
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
  return <SeasonMap state={state}
    onPlay={(ch) => { setState((s) => setMissionStep(s, ch.missionId!, missionOf(s, ch.missionId!).step)); setPlaying(ch.missionId!); }} />;
}

/* ---------- Bản đồ chiến dịch: các chương nối tiếp, mở khoá theo tiến độ Adventure ---------- */
function SeasonMap({ state, onPlay }: {
  state: AppState; onPlay: (ch: AdventureChapter) => void;
}) {
  const done = adventuresProgress(state);
  return (
    <section className="adventure">
      <div className="adv-intro">
        <img className="adv-maple" src={`${GEN}maple-pose-cheer.webp`} alt="" />
        <div>
          <h2 className="chapter">Phiêu lưu cùng Maple</h2>
          <p className="adv-sub">Chiến dịch riêng theo câu chuyện — hoàn thành chương trước để mở chương sau. Không cần học Unit nào trước.</p>
        </div>
      </div>

      {SEASONS.map((season) => (
        <SeasonBlock key={season.id} state={state} season={season} onPlay={onPlay} progress={done} />
      ))}
    </section>
  );
}

function adventuresProgress(state: AppState) {
  return {
    isDone: (id: string) => !!missionOf(state, id).done,
    isStarted: (id: string) => { const m = missionOf(state, id); return m.step > 0 && !m.done; },
  };
}

function SeasonBlock({ state, season, onPlay, progress }: {
  state: AppState; season: AdventureSeason; onPlay: (ch: AdventureChapter) => void;
  progress: { isDone: (id: string) => boolean; isStarted: (id: string) => boolean };
}) {
  const statuses = chapterStatuses(season, progress.isDone, progress.isStarted);
  const doneCount = statuses.filter((s) => s === "done").length;
  return (
    <>
      <div className="season-head">
        <div className="season-kicker">🗺️ Chiến dịch · {season.vi}</div>
        <h3 className="season-title">{season.title}</h3>
        <p className="season-blurb">{season.blurb}</p>
        <div className="season-meta">Đã phá {doneCount}/{season.chapters.length} chương</div>
      </div>
      <ol className="chapter-list">
        {season.chapters.map((ch, i) => {
          const st = statuses[i];
          const playable = st === "play" || st === "started" || st === "done";
          return (
            <li key={ch.id} className={`chapter-card ${playable ? "" : "locked"} ${st === "done" ? "done" : ""}`}>
              <div className="cc-media" style={{ backgroundImage: `url('${ch.sceneImage}')` }} aria-hidden="true">
                <span className="cc-n">{ch.n}</span>
                {st === "done" && <span className="cc-badge ok">✓</span>}
                {(st === "locked" || st === "soon") && <span className="cc-badge lock">🔒</span>}
              </div>
              <div className="cc-body">
                <div className="cc-kicker">Chương {ch.n}</div>
                <h3>{ch.vi} <small>· {ch.title}</small></h3>
                <p className="cc-blurb">{st === "soon" ? "Đang biên soạn · sắp mở" : ch.blurb}</p>
                {playable ? (
                  <div className="cc-actions">
                    <button className="btn accent sm" onClick={() => onPlay(ch)}>
                      {st === "done" ? "Chơi lại ▸" : st === "started" ? "Tiếp tục ▸" : "Bắt đầu nhiệm vụ ▸"}
                    </button>
                  </div>
                ) : st === "locked" ? (
                  <div className="cc-soon">🔒 Hoàn thành chương trước để mở</div>
                ) : <div className="cc-soon">🔒 Sắp mở</div>}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="adv-end"><span>🏁</span>Các chương mới sẽ ra theo season…</div>
    </>
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
