"use client";

// Nút micro chấm nói dùng chung (Learn · Speaking và Practice · Echo).
// Chấm kiểu khuyến khích: sao + lời khen, không bao giờ "trượt".
// Trình duyệt không hỗ trợ (Firefox…) → component tự ẩn, luồng "nghe & nói theo" cũ vẫn nguyên.

import { useEffect, useRef, useState } from "react";
import { speechScoringSupported, listenOnce, scoreSpeech, type SpeechScore } from "@/lib/speech";

const PRAISE: Record<number, string> = {
  3: "Tuyệt vời! Bạn nói rõ lắm! 🌟",
  2: "Giỏi lắm! Thử lại một lần để lấy 3 sao nhé!",
  1: "Khởi đầu tốt! Nghe Maple đọc lại rồi thử thêm lần nữa nhé!",
  0: "Maple chưa nghe rõ — bấm 🎤 rồi nói to, chậm thôi nhé!",
};

export function MicCheck({ target, accent, size = "sm", onScore }: {
  target: string;
  accent: "US" | "CA";
  size?: "sm" | "lg";
  onScore?: (s: SpeechScore) => void;
}) {
  const [phase, setPhase] = useState<"idle" | "listening">("idle");
  const [score, setScore] = useState<SpeechScore | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  // Đổi câu (Echo chuyển bài) → xoá kết quả cũ, dừng phiên nghe dở.
  useEffect(() => { setScore(null); setErr(null); setPhase("idle"); stopRef.current?.(); }, [target]);
  useEffect(() => () => stopRef.current?.(), []);

  if (!speechScoringSupported()) return null;

  async function listen() {
    if (phase === "listening") { stopRef.current?.(); return; }
    setPhase("listening"); setScore(null); setErr(null);
    const { result, stop } = listenOnce(accent === "CA" ? "en-CA" : "en-US");
    stopRef.current = stop;
    const r = await result;
    setPhase("idle");
    if (r.ok) {
      const s = scoreSpeech(target, r.alts);
      setScore(s); onScore?.(s);
    } else if (r.error === "denied") {
      setErr("Cần cho phép dùng micro trong trình duyệt thì Maple mới nghe được nhé.");
    } else {
      setErr(PRAISE[0]);
    }
  }

  const btnCls = size === "lg" ? "btn mic-lg" : "icbtn rec";
  return (
    <div className="mic-check">
      <button className={`${btnCls} ${phase === "listening" ? "on" : ""}`} onClick={listen}>
        {phase === "listening" ? "👂 Maple đang nghe… (bấm để dừng)" : "🎤 Nói & lấy sao"}
      </button>
      {err && <div className="mic-box"><div className="mic-praise">{err}</div></div>}
      {score && (
        <div className="mic-box">
          <div className="mic-stars">{score.stars > 0 ? "⭐".repeat(score.stars) : "💪"}</div>
          <div className="mic-praise">{PRAISE[score.stars]}</div>
          <div className="mic-words">
            {score.words.map((w, i) => <span key={i} className={`w ${w.hit ? "hit" : "miss"}`}>{w.w}</span>)}
          </div>
          {score.stars < 3 && <div className="mic-heard">Maple nghe thấy: “{score.heard}”</div>}
        </div>
      )}
    </div>
  );
}
