"use client";

// ============================================================================
// LEVEL 0 · PHONICS PLAYER — overview + 4 hoạt động + Mini Check.
// Tiến độ tái dùng state.learn.lessons[unit.id] với 4 section keys chuẩn
// (words↔Âm mới, sentences↔Ghép vần, listening↔Nghe&chọn, speaking↔Đọc theo).
// Không dùng ảnh: chữ + emoji + TTS speak(). Xem lib/phonics.ts.
// ============================================================================

import { useState } from "react";
import type { AppState } from "@/lib/state";
import { markSection, sectionDone, lessonPct } from "@/lib/state";
import type { LearningSectionKey } from "@/lib/learn";
import { phonicsKeywordImage, type PhonicsSound, type PhonicsUnit, type PhonMCQ } from "@/lib/phonics";
import { speak, shuffle } from "@/lib/fx";

type PhView = "overview" | LearningSectionKey | "check";

const PH_SECTIONS: { key: LearningSectionKey; vi: string; name: string; icon: string; desc: string }[] = [
  { key: "words", vi: "Âm mới", name: "Sounds", icon: "🔤", desc: "Nghe âm & từ khoá" },
  { key: "sentences", vi: "Ghép vần", name: "Blend it", icon: "🧩", desc: "Ghép âm thành từ" },
  { key: "listening", vi: "Nghe & chọn", name: "Listen & pick", icon: "👂", desc: "Nghe rồi chọn đúng" },
  { key: "speaking", vi: "Đọc theo", name: "Read & say", icon: "🗣️", desc: "Đọc to các từ" },
];

export function PhonicsLesson({ state, setState, unit, accent, onExit, onComplete }: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  unit: PhonicsUnit;
  accent: "US" | "CA";
  onExit: () => void;
  onComplete: (id: string, score: number, total: number) => void;
}) {
  const [view, setView] = useState<PhView>("overview");
  const done = PH_SECTIONS.filter((sc) => sectionDone(state, unit.id, sc.key)).length;
  const pct = lessonPct(state, unit.id, PH_SECTIONS.length);
  const next = PH_SECTIONS.find((sc) => !sectionDone(state, unit.id, sc.key));
  const checkState = state.learn.lessons[unit.id]?.check;

  const mark = (key: LearningSectionKey) => { setState((s) => markSection(s, unit.id, key)); setView("overview"); };
  const back = () => setView("overview");

  if (view === "words") return <SoundsView unit={unit} onDone={() => mark("words")} back={back} />;
  if (view === "sentences") return <BlendView unit={unit} accent={accent} onDone={() => mark("sentences")} back={back} />;
  if (view === "listening") return <PhonQuizView unit={unit} title="Nghe & chọn" icon="👂" items={unit.listen} accent={accent} onDone={() => mark("listening")} back={back} />;
  if (view === "speaking") return <ReadSayView unit={unit} accent={accent} onDone={() => mark("speaking")} back={back} />;
  if (view === "check") return <PhonQuizView unit={unit} title="Kiểm tra nhỏ" icon="🎯" items={unit.miniCheck} accent={accent} onDone={(sc, t) => { onComplete(unit.id, sc, t); setView("overview"); }} back={back} />;

  return (
    <section className="learn">
      <button className="bk course-back" onClick={onExit}>← Chương trình học</button>

      {/* Hero phonics — không ảnh, hiển thị các chữ của unit */}
      <div className="ph-hero">
        <div className="ph-hero-letters" aria-hidden="true">{unit.letters}</div>
        <div className="ph-hero-body">
          <div className="lh-eyebrow">🔤 Level 0 · Phonics</div>
          <div className="lh-title">{unit.title} <small>· {unit.vi}</small></div>
          <div className="lh-bar"><i style={{ width: `${pct}%` }} /><span>{done}/{PH_SECTIONS.length}</span></div>
          <button className="quest-btn learn-cta" onClick={() => setView(next ? next.key : "check")}>
            {next ? <>▶ Học tiếp: {next.vi}</> : <>🎯 Làm Kiểm tra nhỏ</>}
          </button>
        </div>
      </div>

      <p className="ph-intro">{unit.introVi}</p>

      <h2 className="chapter">Bốn chặng phonics</h2>
      <ol className="tracks">
        {PH_SECTIONS.map((sc, i) => {
          const d = sectionDone(state, unit.id, sc.key);
          return (
            <li key={sc.key} className={`track ${d ? "done" : ""}`} onClick={() => setView(sc.key)}>
              <span className="track-ic">{d ? "✓" : sc.icon}</span>
              <span className="track-txt">
                <span className="track-nm">{sc.name} <small>· {sc.vi}</small></span>
                <span className="track-desc">{sc.desc}</span>
              </span>
              <span className="track-go">{i + 1}/4 ▸</span>
            </li>
          );
        })}
        <li className="track check" onClick={() => setView("check")}>
          <span className="track-ic">🎯</span>
          <span className="track-txt">
            <span className="track-nm">Mini Check <small>· Kiểm tra nhỏ</small></span>
            <span className="track-desc">{checkState ? `Lần trước: ${checkState.score}/${checkState.total}` : "Nhận âm · ghép vần · nghe chọn"}</span>
          </span>
          <span className="track-go">{state.learn.lessons[unit.id]?.done ? "✓" : "▸"}</span>
        </li>
      </ol>
    </section>
  );
}

/* ---------- Trang con: khung sổ tay ---------- */
function Page({ icon, title, back, children }: { icon: string; title: string; back: () => void; children: React.ReactNode }) {
  return (
    <section className="learn">
      <div className="sec-head">
        <button className="bk" onClick={back}>←</button>
        <h2 className="sec-title">{icon} {title}</h2>
      </div>
      {children}
    </section>
  );
}

/* ---------- 1) Âm mới ---------- */
function SoundsView({ unit, onDone, back }: { unit: PhonicsUnit; onDone: () => void; back: () => void }) {
  return (
    <Page icon="🔤" title="Sounds · Âm mới" back={back}>
      <p className="ph-intro">Chạm 🔊 để nghe âm qua từ khoá.</p>
      <div className="ph-sound-grid">
        {unit.sounds.map((s) => (
          <button key={s.letter} className="ph-sound-card" onClick={() => speak(s.keyword, "US")}>
            <span className="ph-letter">{s.letter}</span>
            <KeywordArt sound={s} />
            <span className="ph-kw">{s.sound} · {s.keyword}</span>
            <span className="ph-play">🔊</span>
          </button>
        ))}
      </div>
      <button className="btn accent ph-next-btn" onClick={onDone}>Xong · Học tiếp →</button>
    </Page>
  );
}

function KeywordArt({ sound }: { sound: PhonicsSound }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="ph-emoji" aria-hidden="true">{sound.emoji}</span>;
  return (
    <span className="ph-keyword-art">
      <img src={phonicsKeywordImage(sound.keyword)} alt={sound.keyword} onError={() => setFailed(true)} />
    </span>
  );
}

/* ---------- 2) Ghép vần ---------- */
function BlendView({ unit, accent, onDone, back }: { unit: PhonicsUnit; accent: "US" | "CA"; onDone: () => void; back: () => void }) {
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const b = unit.blends[i];
  const last = i === unit.blends.length - 1;

  function nextWord() {
    if (last) { onDone(); return; }
    setI(i + 1); setRevealed(false);
  }

  return (
    <Page icon="🧩" title="Blend it · Ghép vần" back={back}>
      <p className="ph-intro">Đọc từng âm, rồi ghép lại thành từ. Chạm 🔊 để nghe.</p>
      <div className="ph-blend">
        <div className="ph-blend-sounds">
          {b.sounds.map((s, k) => (
            <span key={k} className="ph-tile">{s}</span>
          ))}
        </div>
        {revealed ? (
          <div className="ph-blend-word">
            {b.emoji && <span className="ph-emoji big" aria-hidden="true">{b.emoji}</span>}
            <span className="ph-word">{b.word}</span>
            <button className="icbtn" onClick={() => speak(b.word, accent)}>🔊 Nghe</button>
          </div>
        ) : (
          <button className="btn ph-blend-go" onClick={() => { setRevealed(true); speak(b.word, accent); }}>
            👉 Ghép lại: nghe từ
          </button>
        )}
      </div>
      <div className="ph-blend-meta">Từ {i + 1}/{unit.blends.length}</div>
      {revealed && <button className="btn accent ph-next-btn" onClick={nextWord}>{last ? "Xong · Học tiếp →" : "Từ tiếp theo →"}</button>}
    </Page>
  );
}

/* ---------- 3 & 5) Nghe & chọn / Kiểm tra (máy chấm) ---------- */
function PhonQuizView({ unit, title, icon, items, accent, onDone, back }: {
  unit: PhonicsUnit; title: string; icon: string; items: PhonMCQ[]; accent: "US" | "CA";
  onDone: (score: number, total: number) => void; back: () => void;
}) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [opts] = useState<string[][]>(() => items.map((t) => shuffle(t.options)));
  const q = items[i];
  const answered = picked !== null;
  const correct = picked === q.answer;

  function pick(o: string) { if (answered) return; setPicked(o); if (o === q.answer) setScore((x) => x + 1); }
  function next() {
    if (i + 1 < items.length) { setI(i + 1); setPicked(null); }
    else onDone(correct ? score : score, items.length);
  }

  return (
    <Page icon={icon} title={`${title} · ${unit.vi}`} back={back}>
      <div className="ph-quiz-top"><span className="ph-quiz-count">{i + 1}/{items.length}</span></div>
      <div className="chap-q">
        {q.say && (
          <button className="btn ph-hear" onClick={() => speak(q.say!, accent)}>🔊 Nghe</button>
        )}
        <div className="chap-prompt">{q.q}{q.vi && <div className="chap-prompt-vi">{q.vi}</div>}</div>
        <div className={`qopts ${answered ? "answered" : ""} ${q.pic ? "pic" : ""}`}>
          {opts[i].map((o) => (
            <button key={o} disabled={answered}
              className={`qopt ${answered && o === q.answer ? "right" : ""} ${answered && o === picked && o !== q.answer ? "wrong" : ""} ${q.pic ? "pic" : ""}`}
              onClick={() => pick(o)}>{o}</button>
          ))}
        </div>
        {answered && (
          <>
            <div className="qfb">
              {correct ? <span className="ok">✓ Chính xác!</span> : <><span className="no">✗ Chưa đúng.</span> Đáp án: <b>{q.answer}</b></>}
              {q.explainVi && <div className="q-explain">💡 {q.explainVi}</div>}
            </div>
            <button className="btn accent qnext" onClick={next}>{i + 1 < items.length ? "Tiếp →" : "Xong →"}</button>
          </>
        )}
      </div>
    </Page>
  );
}

/* ---------- 4) Đọc theo ---------- */
function ReadSayView({ unit, accent, onDone, back }: { unit: PhonicsUnit; accent: "US" | "CA"; onDone: () => void; back: () => void }) {
  return (
    <Page icon="🗣️" title="Read & say · Đọc theo" back={back}>
      <p className="ph-intro">Chạm 🔊 nghe Maple đọc, rồi đọc theo thật to.</p>
      <div className="ph-read-list">
        {unit.readSay.map((w, k) => (
          <button key={k} className="ph-read-item" onClick={() => speak(w.word, accent)}>
            {w.emoji && <span className="ph-emoji" aria-hidden="true">{w.emoji}</span>}
            <span className="ph-word sm">{w.word}</span>
            <span className="ph-play">🔊</span>
          </button>
        ))}
      </div>
      <button className="btn accent ph-next-btn" onClick={onDone}>Xong · Học tiếp →</button>
    </Page>
  );
}
