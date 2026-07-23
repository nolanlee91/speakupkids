"use client";

import { useMemo, useState } from "react";
import type { AppState } from "@/lib/state";
import { markSection, sectionDone, setDifficulty, setCurrentLesson, learnLessonDone, lessonPct } from "@/lib/state";
import {
  SECTIONS, DIFFICULTY, LEVEL1_UNITS, LEVEL2_UNITS, showVi, showPrompts, learnLessonById, allLearnLessons, themeOfLesson,
  type Lesson, type LearningSectionKey, type DifficultyLevel, type MCQ, type CourseUnit,
} from "@/lib/learn";
import { speak, shuffle } from "@/lib/fx";

const GEN = "/assets/images/gen/";
type SecView = "overview" | LearningSectionKey | "check";

export function Learn({ state, setState, entry, onEcho, onTalk, onComplete }: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  entry: "map" | "lesson";
  onEcho: () => void;
  onTalk: (sceneId?: string) => void;
  onComplete: (lessonId: string, score: number, total: number) => void;
}) {
  const lesson = learnLessonById(state.learn.currentLesson) || allLearnLessons()[0];
  const diff = state.learn.difficulty;
  const accent = state.prefs.accent;
  const [screen, setScreen] = useState<"map" | "lesson">(entry);
  const [view, setView] = useState<SecView>("overview");

  // Màn chương trình học: chọn Unit trước khi vào bài
  if (screen === "map") {
    return <CourseMap state={state} onPick={(u) => {
      if (!u.ready || !u.lessonId) return;
      const id = u.lessonId;
      setState((s) => setCurrentLesson(s, id));
      setView("overview");
      setScreen("lesson");
    }} />;
  }

  const doneCount = SECTIONS.filter((sc) => sectionDone(state, lesson.id, sc.key)).length;
  const pct = Math.round((doneCount / SECTIONS.length) * 100);
  const nextSection = SECTIONS.find((sc) => !sectionDone(state, lesson.id, sc.key));
  const theme = themeOfLesson(lesson);
  const mark = (key: LearningSectionKey) => { setState((s) => markSection(s, lesson.id, key)); setView("overview"); };

  if (view !== "overview") {
    const back = () => setView("overview");
    if (view === "words") return <WordsView lesson={lesson} diff={diff} accent={accent} onDone={() => mark("words")} back={back} />;
    if (view === "sentences") return <SentencesView lesson={lesson} diff={diff} onDone={() => mark("sentences")} back={back} />;
    if (view === "listening") return <ListeningView lesson={lesson} diff={diff} accent={accent} onDone={() => mark("listening")} back={back} />;
    if (view === "speaking") return <SpeakingView lesson={lesson} diff={diff} accent={accent} onEcho={onEcho} onTalk={onTalk} onDone={() => mark("speaking")} back={back} />;
    if (view === "check") return <MiniCheckView lesson={lesson} diff={diff} accent={accent} onFinish={(sc, t) => { onComplete(lesson.id, sc, t); setView("overview"); }} back={back} />;
  }

  const learnState = state.learn.lessons[lesson.id];
  return (
    <section className="learn">
      <button className="bk course-back" onClick={() => setScreen("map")}>← Chương trình học</button>
      {/* Hero + Continue learning */}
      <div className="learn-hero fullbleed" style={{ backgroundImage: lesson.sceneImage ? `url('${lesson.sceneImage}')` : undefined }}>
        <div className="lh-overlay" />
        <div className="lh-panel">
          <div className="lh-eyebrow">📚 Đang học · {theme?.name}</div>
          <div className="lh-title">{lesson.title} <small>· {lesson.vi}</small></div>
          <div className="lh-bar"><i style={{ width: `${pct}%` }} /><span>{doneCount}/{SECTIONS.length}</span></div>
          <button className="quest-btn learn-cta" onClick={() => setView(nextSection ? nextSection.key : "check")}>
            {nextSection ? <>▶ Học tiếp: {nextSection.vi}</> : <>🎯 Làm Kiểm tra nhỏ</>}
          </button>
        </div>
      </div>

      {/* Difficulty */}
      <div className="diff-row">
        <span className="diff-label">Cấp độ:</span>
        <div className="diff-picker">
          {(Object.keys(DIFFICULTY) as DifficultyLevel[]).map((d) => (
            <button key={d} className={`diff-chip ${d === diff ? "on" : ""}`} onClick={() => setState((s) => setDifficulty(s, d))} title={DIFFICULTY[d].note}>
              <span className="dc-emoji">{DIFFICULTY[d].emoji}</span>{DIFFICULTY[d].vi}
            </button>
          ))}
        </div>
      </div>
      <p className="diff-note">{DIFFICULTY[diff].emoji} {DIFFICULTY[diff].note}</p>

      {/* 4 tracks — hành trình học kiểu sổ tay */}
      <h2 className="chapter">Bốn chặng học</h2>
      <ol className="tracks">
        {SECTIONS.map((sc, i) => {
          const done = sectionDone(state, lesson.id, sc.key);
          return (
            <li key={sc.key} className={`track ${done ? "done" : ""}`} onClick={() => setView(sc.key)}>
              <span className="track-ic">{done ? "✓" : sc.icon}</span>
              <span className="track-txt">
                <span className="track-nm">{sc.vi} <small>· {sc.name}</small></span>
                <span className="track-desc">{sc.desc}</span>
              </span>
              <span className="track-go">{i + 1}/4 ▸</span>
            </li>
          );
        })}
        <li className="track check" onClick={() => setView("check")}>
          <span className="track-ic">🎯</span>
          <span className="track-txt">
            <span className="track-nm">Kiểm tra nhỏ <small>· Mini Check</small></span>
            <span className="track-desc">{learnState?.check ? `Lần trước: ${learnState.check.score}/${learnState.check.total}` : "Từ vựng · câu · nghe · nói"}</span>
          </span>
          <span className="track-go">{learnState?.done ? "✓" : "▸"}</span>
        </li>
      </ol>
    </section>
  );
}

/* ---------- Chương trình học: 6 Unit (thư viện chặng học) ---------- */
function CourseMap({ state, onPick }: { state: AppState; onPick: (u: CourseUnit) => void }) {
  const renderUnit = (u: CourseUnit) => {
    const done = u.lessonId ? learnLessonDone(state, u.lessonId) : false;
    const pct = u.lessonId ? lessonPct(state, u.lessonId, SECTIONS.length) : 0;
    const check = u.lessonId ? state.learn.lessons[u.lessonId]?.check : undefined;
    return (
      <li key={u.id} className={`unit ${u.ready ? "" : "locked"} ${done ? "done" : ""}`}>
        <button className="unit-btn" onClick={() => onPick(u)} disabled={!u.ready}>
          <span className="unit-thumb" style={{ backgroundImage: `url('${u.image}')` }}>
            <span className="unit-n">{u.n}</span>
            {!u.ready && <span className="unit-badge lock">🔒</span>}
            {done && <span className="unit-badge ok">✓</span>}
          </span>
          <span className="unit-body">
            <span className="unit-title">{u.vi} <small>· {u.title}</small></span>
            <span className="unit-focus">{u.focus}</span>
            {u.ready
              ? <span className="unit-bar"><i style={{ width: `${done ? 100 : pct}%` }} />
                  <span>{check ? `Kiểm tra: ${check.score}/${check.total}` : done ? "Hoàn thành" : pct > 0 ? `${pct}%` : "Bài mới"}</span>
                </span>
              : <span className="unit-soon">✏️ Đang biên soạn · sắp mở</span>}
          </span>
          <span className="unit-go">{u.ready ? (done ? "Ôn lại ▸" : pct > 0 ? "Tiếp tục ▸" : "Bắt đầu ▸") : "🔒"}</span>
        </button>
      </li>
    );
  };

  return (
    <section className="learn course">
      <div className="course-head">
        <img className="course-maple" src={`${GEN}mascot-book.webp`} alt="" />
        <div>
          <h2 className="chapter">Chương trình học</h2>
          <p className="course-sub">3 cấp độ · học từng chặng cùng Maple</p>
        </div>
      </div>

      <div className="course-lvl-head">📘 Level 1 · Everyday English <small>Phố ngày thường & ngày khám phá</small></div>
      <ol className="unit-list">{LEVEL1_UNITS.map(renderUnit)}</ol>

      <div className="course-lvl-head">📗 Level 2 · Stories &amp; Situations <small>Bài kể chuyện nhiều bước</small></div>
      <ol className="unit-list">{LEVEL2_UNITS.map(renderUnit)}</ol>

      <div className="course-more">
        <div className="course-lvl">📕 Level 3 · Opinions &amp; Conversations <small>Sắp mở</small></div>
      </div>
    </section>
  );
}

/* ---------- Khung một trang sổ tay ---------- */
function Page({ icon, title, vi, back, children }: { icon: string; title: string; vi: string; back: () => void; children: React.ReactNode }) {
  return (
    <section className="learn">
      <div className="wb-top">
        <button className="bk" onClick={back}>← Bốn chặng</button>
        <div className="wb-tab"><span>{icon}</span>{title} <small>· {vi}</small></div>
      </div>
      <div className="wbpage">{children}</div>
    </section>
  );
}
function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="wb-intro">
      <img src={`${GEN}mascot-book.webp`} alt="" className="wb-guide" />
      <div className="wb-say">{children}</div>
    </div>
  );
}
function MarkDone({ label, onDone, enabled = true }: { label: string; onDone: () => void; enabled?: boolean }) {
  return <button className="btn green mark-done" disabled={!enabled} onClick={onDone}>✓ {label}</button>;
}

/* ---------- WORDS ---------- */
function WordsView({ lesson, diff, accent, onDone, back }: { lesson: Lesson; diff: DifficultyLevel; accent: "US" | "CA"; onDone: () => void; back: () => void }) {
  const vis = showVi(diff);
  return (
    <Page icon="📖" title="Từ vựng" vi="Words" back={back}>
      <Bubble>Nghe và đọc {lesson.vocab.length} từ mới ({lesson.vi}). Chạm 🔊 để nghe nhé!</Bubble>
      <div className="voca-list">
        {lesson.vocab.map((v) => (
          <div key={v.word} className="voca">
            <span className="voca-emoji" aria-hidden="true">{v.emoji}</span>
            <div className="voca-main">
              <div className="voca-word">
                <b>{v.word}</b> <span className="voca-ipa">{v.ipa}</span>
                <button className="spk" onClick={() => speak(v.word, accent)} aria-label={`Nghe ${v.word}`}>🔊</button>
              </div>
              {vis && <div className="voca-vi">{v.vi}</div>}
              <div className="voca-ex" onClick={() => speak(v.example, accent)}>
                “{v.example}”{vis && <em> — {v.exampleVi}</em>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <MarkDone label="Mình thuộc các từ này" onDone={onDone} />
    </Page>
  );
}

/* ---------- SENTENCES ---------- */
function SentencesView({ lesson, diff, onDone, back }: { lesson: Lesson; diff: DifficultyLevel; onDone: () => void; back: () => void }) {
  const vis = showVi(diff);
  return (
    <Page icon="✏️" title="Mẫu câu" vi="Sentences" back={back}>
      <Bubble>Bốn mẫu câu giúp bạn nói về bức tranh. Thử thay từ mới vào chỗ trống nhé!</Bubble>
      <div className="pat-list">
        {lesson.patterns.map((p) => (
          <div key={p.pattern} className="pat">
            <div className="pat-head"><b>{p.pattern}</b>{vis && <span className="pat-vi">{p.vi}</span>}</div>
            <ul className="pat-ex">
              {p.examples.map((e) => (
                <li key={e.en}>{e.en}{vis && <em> — {e.vi}</em>}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <MarkDone label="Mình hiểu các mẫu câu" onDone={onDone} />
    </Page>
  );
}

/* ---------- Câu hỏi trắc nghiệm dùng chung ---------- */
function Quiz({ items, accent, onScore }: { items: MCQ[]; accent: "US" | "CA"; onScore: (correct: number) => void }) {
  const qs = useMemo(() => items.map((q) => ({ ...q, options: shuffle(q.options) })), [items]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const q = qs[i];
  const answered = picked !== null;
  function pick(o: string) { if (answered) return; setPicked(o); if (o === q.answer) setScore((x) => x + 1); }
  function next() {
    if (i + 1 < qs.length) { setI(i + 1); setPicked(null); }
    else onScore(score);
  }
  return (
    <div className="qcard learn-quiz">
      <div className="q-progress">Câu {i + 1}/{qs.length}</div>
      <div className="qtext">{q.q}{q.vi && <div className="qsub">{q.vi}</div>}</div>
      <div className={`qopts ${answered ? "answered" : ""}`}>
        {q.options.map((o) => (
          <button key={o} disabled={answered}
            className={`qopt ${answered && o === q.answer ? "right" : ""} ${answered && o === picked && o !== q.answer ? "wrong" : ""}`}
            onClick={() => pick(o)}>{o}</button>
        ))}
      </div>
      {answered && (
        <>
          <div className="qfb">{picked === q.answer ? <span className="ok">✓ Chính xác!</span> : <><span className="no">✗ Chưa đúng.</span> Đáp án: <b>{q.answer}</b></>}{q.explainVi && <div className="q-explain">💡 {q.explainVi}</div>}</div>
          <button className="btn qnext" onClick={next}>{i + 1 < qs.length ? "Câu tiếp →" : "Xong →"}</button>
        </>
      )}
    </div>
  );
}

/* ---------- LISTENING ---------- */
function ListeningView({ lesson, diff, accent, onDone, back }: { lesson: Lesson; diff: DifficultyLevel; accent: "US" | "CA"; onDone: () => void; back: () => void }) {
  const L = lesson.listening;
  const vis = showVi(diff);
  const [showScript, setShowScript] = useState(false);
  const [scored, setScored] = useState<number | null>(null);
  return (
    <Page icon="🎧" title="Nghe hiểu" vi="Listening" back={back}>
      <Bubble>{L.intro}{vis && <span className="say-vi"> — {L.introVi}</span>}</Bubble>
      <div className="listen-box">
        <button className="btn listen-play" onClick={() => speak(L.script, accent, 0.85)}>🔊 Nghe Maple kể</button>
        <button className="btn ghost sm" onClick={() => speak(L.script, accent, 0.6)}>🐢 Chậm</button>
        <button className="btn ghost sm" onClick={() => setShowScript((v) => !v)}>{showScript ? "Ẩn lời" : "Xem lời"}</button>
      </div>
      {showScript && <p className="listen-script">{L.script}</p>}
      {scored === null
        ? <Quiz items={L.questions} accent={accent} onScore={(c) => setScored(c)} />
        : (
          <div className="listen-result">
            <div className="lr-score">Bạn trả lời đúng <b>{scored}/{L.questions.length}</b> câu nghe 🎧</div>
            <MarkDone label="Xong phần Nghe" onDone={onDone} />
          </div>
        )}
    </Page>
  );
}

/* ---------- LISTEN & REPEAT (hoạt động phụ, KHÔNG chấm điểm) ---------- */
function SpeakingView({ lesson, diff, accent, onEcho, onTalk, onDone, back }: {
  lesson: Lesson; diff: DifficultyLevel; accent: "US" | "CA"; onEcho: () => void; onTalk: (sceneId?: string) => void; onDone: () => void; back: () => void;
}) {
  const S = lesson.speaking;
  const vis = showVi(diff);
  const prompts = showPrompts(diff);
  return (
    <Page icon="🎤" title="Nghe & nói theo" vi="Listen & Repeat" back={back}>
      <Bubble>Nghe Maple đọc rồi nói theo cho quen miệng. <b>Không chấm điểm</b> đâu — cứ thoải mái nhé! 🎶</Bubble>

      <div className="speak-block">
        <div className="sb-h">Nghe & nói theo</div>
        {S.repeat.map((r, i) => (
          <div key={i} className="sb-line">
            <div className="sb-en">{r.en}{vis && <em> — {r.vi}</em>}</div>
            <div className="sb-ctrls">
              <button className="icbtn" onClick={() => speak(r.en, accent)}>🔊 Maple đọc</button>
              <button className="icbtn" onClick={() => speak(r.en, accent, 0.6)}>🐢 Chậm</button>
            </div>
          </div>
        ))}
        <div className="sb-line">
          <div className="sb-en">{S.guided.q}{vis && <em> — {S.guided.vi}</em>}</div>
          {prompts && <div className="sb-hint">Gợi ý: {S.guided.hint}</div>}
          <div className="sb-ctrls">
            <button className="icbtn" onClick={() => speak(S.guided.q, accent)}>🔊 Maple đọc</button>
          </div>
        </div>
      </div>

      <div className="speak-block">
        <div className="sb-h">Luyện thêm cùng Maple</div>
        <div className="extra-acts">
          <button className="extra-btn" onClick={onEcho}><span>🎤</span>Echo với Maple</button>
        </div>
        <p className="practice-link">Muốn luyện xây câu cho chủ đề này? <button className="linklike" onClick={() => onTalk(lesson.id)}>Sang Luyện tập →</button></p>
      </div>

      <MarkDone label="Xong phần nghe & nói" onDone={onDone} />
    </Page>
  );
}

/* ---------- MINI CHECK ---------- */
const MC_BADGE: Record<string, string> = { vocab: "Từ vựng", sentence: "Ghép câu", listening: "Nghe hiểu", reading: "Đọc hiểu" };
function MiniCheckView({ lesson, onFinish, back }: { lesson: Lesson; diff: DifficultyLevel; accent: "US" | "CA"; onFinish: (score: number, total: number) => void; back: () => void }) {
  const tasks = lesson.miniCheck.tasks;
  const total = tasks.length;
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const t = tasks[i];
  const opts = useMemo(() => shuffle(t.options), [t]);
  const answered = picked !== null;

  function pick(o: string) { if (picked !== null) return; setPicked(o); if (o === t.answer) setScore((x) => x + 1); }
  function next() {
    if (i + 1 >= total) { onFinish(score, total); return; }
    setI(i + 1); setPicked(null);
  }

  return (
    <Page icon="🎯" title="Kiểm tra nhỏ" vi="Mini Check" back={back}>
      <Bubble>Bốn thử thách có đáp án để xem bạn đã sẵn sàng phiêu lưu chưa!</Bubble>
      <div className="qcard learn-quiz">
        <div className="q-progress"><span className="q-badge">{MC_BADGE[t.type] || "Thử thách"}</span> {i + 1}/{total}</div>
        <div className="qtext">{t.q}{t.vi && <div className="qsub">{t.vi}</div>}</div>
        <div className={`qopts ${answered ? "answered" : ""}`}>
          {opts.map((o) => (
            <button key={o} disabled={answered}
              className={`qopt ${answered && o === t.answer ? "right" : ""} ${answered && o === picked && o !== t.answer ? "wrong" : ""}`}
              onClick={() => pick(o)}>{o}</button>
          ))}
        </div>
        {answered && <div className="qfb">{picked === t.answer ? <span className="ok">✓ Chính xác!</span> : <><span className="no">✗ Chưa đúng.</span> Đáp án: <b>{t.answer}</b></>}{t.explainVi && <div className="q-explain">💡 {t.explainVi}</div>}</div>}
        {answered && <button className="btn qnext" onClick={next}>{i + 1 < total ? "Thử thách tiếp →" : "Xem kết quả →"}</button>}
      </div>
    </Page>
  );
}
