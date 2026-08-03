// Edge Function: báo cáo tuần cho ba mẹ — chạy cron sáng thứ Bảy.
// Luồng: đọc parents (weekly_email=true) → từng bé lấy child_state → tính chỉ số
// → so với snapshot tuần trước → gửi email qua Resend → upsert snapshot tuần này.
//
// Deploy:   npx supabase functions deploy weekly-report --no-verify-jwt
// Secrets:  npx supabase secrets set RESEND_API_KEY=re_xxx REPORT_SECRET=chuoi-bi-mat
// Cron:     Dashboard → Integrations → Cron → gọi function này '0 1 * * 6' (08:00 VN thứ Bảy)
// Test tay: GET .../weekly-report?key=REPORT_SECRET&dry=1        → xem JSON, không gửi
//           GET .../weekly-report?key=REPORT_SECRET&only=a@b.com → chỉ gửi 1 người
import { createClient } from "npm:@supabase/supabase-js@2";

type TopicAcc = Record<string, { c: number; w: number }>;
type Metrics = { lessons: number; sentences: number; stars: number; practiceSeen: number; streak: number; topicAcc: TopicAcc };

// Đọc chỉ số từ AppState jsonb (phòng thủ: state có thể thiếu trường do bản cũ).
function metrics(state: unknown): Metrics {
  const s = (state || {}) as Record<string, any>;
  const lessons = Object.values(s.learn?.lessons || {}).filter((l: any) => l?.done).length;
  const progress: Record<string, any> = s.progress || {};
  const sentences = Object.values(progress).reduce((a: number, p: any) => a + (p?.learned?.length || 0), 0);
  const legacyStars = Object.entries(progress)
    .filter(([k]) => !k.startsWith("g:"))
    .reduce((a, [, p]: [string, any]) => a + (p?.stars || 0), 0);
  const topics: Record<string, any> = s.games?.topics || {};
  const gameStars = Object.values(topics).reduce((a: number, t: any) => a + (t?.bestStars || 0), 0);
  const practiceSeen = Object.values(topics).reduce((a: number, t: any) => a + (t?.seen?.length || 0), 0);
  const topicAcc: TopicAcc = {};
  for (const [key, t] of Object.entries(topics)) {
    const c = Object.values((t as any)?.correct || {}).reduce((a: number, n: any) => a + (Number(n) || 0), 0);
    const w = Object.values((t as any)?.wrong || {}).reduce((a: number, n: any) => a + (Number(n) || 0), 0);
    if (c + w >= 5) topicAcc[key] = { c, w };   // đủ mẫu mới đáng đưa vào báo cáo
  }
  return { lessons, sentences, stars: legacyStars + gameStars, practiceSeen, streak: s.streak || 0, topicAcc };
}

// Thứ Hai đầu tuần hiện tại (UTC) — khớp cột week_start unique(child_id, week_start).
function weekStart(now = new Date()): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

const TOPIC_LABEL: Record<string, string> = {
  picdet: "Thám tử hình ảnh", puzzle: "Xếp câu", riddle: "Đố vui", listen: "Nghe & chọn", talk: "Talk",
};
function topicName(key: string): string {
  const [game, topic] = key.split(":");
  return `${TOPIC_LABEL[game] || game}${topic ? ` · ${topic}` : ""}`;
}

function childBlock(name: string, avatar: string, m: Metrics, d: { lessons: number; sentences: number; stars: number; practice: number }): string {
  const rows: string[] = [];
  const row = (label: string, week: string, total: string) =>
    rows.push(`<tr><td style="padding:6px 10px;color:#5c6470">${label}</td><td style="padding:6px 10px;font-weight:700;color:#0b6a64">${week}</td><td style="padding:6px 10px;color:#8a8f98">${total}</td></tr>`);
  row("Bài học hoàn thành", `+${d.lessons}`, `tổng ${m.lessons}`);
  row("Câu đã thuộc", `+${d.sentences}`, `tổng ${m.sentences}`);
  row("Sao đạt được", `+${d.stars}`, `tổng ${m.stars}`);
  row("Câu luyện tập đã gặp", `+${d.practice}`, `tổng ${m.practiceSeen}`);

  // Top 3 chủ đề có dữ liệu: khen chỗ tốt, nhắc chỗ cần luyện.
  const accs = Object.entries(m.topicAcc)
    .map(([k, v]) => ({ k, pct: Math.round((v.c / (v.c + v.w)) * 100), n: v.c + v.w }))
    .sort((a, b) => b.n - a.n).slice(0, 3);
  const accHtml = accs.length
    ? `<p style="margin:10px 0 4px;font-size:13px;color:#5c6470">Độ chính xác gần đây: ${accs.map((a) => `<b style="color:${a.pct >= 70 ? "#1b8a4b" : "#c9741a"}">${topicName(a.k)} ${a.pct}%</b>`).join(" · ")}</p>`
    : "";
  const active = d.lessons + d.sentences + d.practice > 0;
  const note = active
    ? `<p style="margin:8px 0 0;font-size:13px;color:#1b8a4b">🔥 Chuỗi học hiện tại: <b>${m.streak} ngày</b> — bé đang học đều, ba mẹ khen bé một câu nhé!</p>`
    : `<p style="margin:8px 0 0;font-size:13px;color:#c9741a">Tuần này bé chưa vào học — ba mẹ nhắc bé mở SpeakUp 10 phút mỗi ngày nhé.</p>`;
  return `
  <div style="background:#fff;border:1px solid #eee2cc;border-radius:14px;padding:16px 18px;margin:0 0 14px">
    <h3 style="margin:0 0 8px;font-size:16px;color:#2b2f3f">${avatar} ${name}</h3>
    <table style="border-collapse:collapse;font-size:14px;width:100%">${rows.join("")}</table>
    ${accHtml}${note}
  </div>`;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const secret = Deno.env.get("REPORT_SECRET");
  if (secret && url.searchParams.get("key") !== secret) {
    return new Response("forbidden", { status: 403 });
  }
  const dry = url.searchParams.get("dry") === "1";
  const only = url.searchParams.get("only");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!dry && !resendKey) return Response.json({ error: "RESEND_API_KEY chưa được set" }, { status: 500 });

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ws = weekStart();

  // Toàn bộ việc nặng nằm trong process() để chế độ cron có thể chạy NỀN:
  // pg_net chỉ chờ tối đa 5s, nên với cron ta trả 202 ngay rồi gửi tiếp phía sau.
  async function process(): Promise<{ sent: number; skipped: number; preview: Record<string, unknown>[] }> {
  const { data: parents, error: pErr } = await db.from("parents").select("id, email, name, weekly_email").eq("weekly_email", true);
  if (pErr) throw new Error(pErr.message);

  let sent = 0, skipped = 0;
  const preview: Record<string, unknown>[] = [];

  for (const parent of parents || []) {
    if (only && parent.email !== only) continue;
    const { data: children } = await db.from("children").select("id, ingame_name, avatar").eq("parent_id", parent.id);
    if (!children?.length) { skipped++; continue; }

    const blocks: string[] = [];
    for (const child of children) {
      const { data: st } = await db.from("child_state").select("state").eq("child_id", child.id).maybeSingle();
      if (!st?.state) continue;
      const m = metrics(st.state);
      // Snapshot gần nhất TRƯỚC tuần này để tính "tuần này tăng bao nhiêu".
      const { data: prev } = await db.from("weekly_snapshots")
        .select("lessons_done, sentences_done, stars, practice_seen")
        .eq("child_id", child.id).lt("week_start", ws)
        .order("week_start", { ascending: false }).limit(1).maybeSingle();
      const d = {
        lessons: Math.max(0, m.lessons - (prev?.lessons_done || 0)),
        sentences: Math.max(0, m.sentences - (prev?.sentences_done || 0)),
        stars: Math.max(0, m.stars - (prev?.stars || 0)),
        practice: Math.max(0, m.practiceSeen - (prev?.practice_seen || 0)),
      };
      blocks.push(childBlock(child.ingame_name, child.avatar, m, d));
      if (!dry) {
        await db.from("weekly_snapshots").upsert({
          child_id: child.id, week_start: ws,
          lessons_done: m.lessons, sentences_done: m.sentences,
          stars: m.stars, practice_seen: m.practiceSeen, topics: m.topicAcc,
        }, { onConflict: "child_id,week_start" });
      }
    }
    if (!blocks.length) { skipped++; continue; }

    const kidNames = children.map((c) => c.ingame_name).join(", ");
    const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:#f7efe0;padding:24px 14px">
      <div style="max-width:560px;margin:0 auto">
        <p style="font-size:22px;margin:0 0 2px">🍁 <b style="color:#e2593f">SpeakUp Kids</b></p>
        <h2 style="margin:0 0 4px;color:#2b2f3f">Báo cáo tuần của ${kidNames}</h2>
        <p style="margin:0 0 16px;color:#8b7c66;font-size:13px">Chào ${parent.name || "ba mẹ"}, đây là tiến bộ của bé trong tuần qua.</p>
        ${blocks.join("")}
        <p style="font-size:12px;color:#8b7c66;margin:16px 0 0">
          Bạn nhận email này vì bật "Báo cáo tuần" trong SpeakUp Kids.
          Tắt tại: mở app → Tài khoản → bỏ chọn "Nhận báo cáo tuần qua email".
        </p>
      </div>
    </div>`;

    if (dry) { preview.push({ to: parent.email, kids: kidNames }); sent++; continue; }
    const rs = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "SpeakUp Kids <no-reply@speakupkids.net>",
        to: [parent.email],
        subject: `🍁 Báo cáo tuần của ${kidNames} — SpeakUp Kids`,
        html,
      }),
    });
    if (rs.ok) sent++; else skipped++;
  }

  return { sent, skipped, preview };
  }

  // Chế độ cron (không dry, không only): trả lời ngay trong <5s của pg_net,
  // phần gửi email chạy nền qua EdgeRuntime.waitUntil.
  const runtime = (globalThis as Record<string, any>).EdgeRuntime;
  if (!dry && !only && runtime?.waitUntil) {
    runtime.waitUntil(process().catch((e: unknown) => console.error("weekly-report:", e)));
    return Response.json({ ok: true, started: true, week_start: ws });
  }
  // Chế độ test tay (dry/only): chờ xong để xem kết quả thật.
  try {
    const r = await process();
    return Response.json({ ok: true, week_start: ws, sent: r.sent, skipped: r.skipped, ...(dry ? { preview: r.preview } : {}) });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
});
