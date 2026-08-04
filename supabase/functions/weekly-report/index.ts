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
  write: "Luyện viết", grammar: "Ngữ pháp",
};
// Tên tiếng Việt cho unit/bộ của 2 game mới — không import được lib/ của app vào Deno,
// nên duy trì map nhỏ ở đây (thêm unit mới thì thêm dòng).
const SUB_LABEL: Record<string, string> = {
  "g-present": "Hiện tại đơn", "g-present-cont": "Hiện tại tiếp diễn", "g-past": "Quá khứ đơn", "g-future": "Tương lai",
  "g-yesno": "Câu hỏi Có/Không", "g-wh": "Câu hỏi Wh-", "g-compare": "So sánh hơn", "g-superlative": "So sánh nhất",
  "g-articles": "Mạo từ a/an/the", "g-prep": "Giới từ in/on/at", "g-pronouns": "Đại từ & sở hữu", "g-thereis": "There is/are",
  "w-intro": "Giới thiệu bản thân", "w-school": "Trường học", "w-family": "Gia đình", "w-food": "Món ăn",
  "w-animals": "Động vật", "w-town": "Nơi em sống", "w-para-me": "Đoạn văn về em", "w-para-world": "Đoạn văn quanh em", "w-para-plans": "Đoạn văn dự định",
};
function topicName(key: string): string {
  const [game, topic] = key.split(":");
  const g = TOPIC_LABEL[game] || game;
  return topic ? `${g} · ${SUB_LABEL[topic] || topic}` : g;
}

// Gợi ý hành động cụ thể cho ba mẹ theo game bé đang đuối.
const TIP: Record<string, string> = {
  picdet: "cùng bé mở Thám tử hình ảnh, để bé tả bức tranh thành lời trước khi chọn đáp án",
  puzzle: "sau khi bé xếp xong câu, nhờ bé đọc to cả câu lên một lần",
  riddle: "ba mẹ đọc to câu đố, để bé đoán trước rồi mới xem đáp án",
  listen: "cho bé nghe lại mỗi câu 2 lần rồi mới chọn — không cần vội",
  write: "đề nghị bé viết 1 câu về bữa tối hôm nay, rồi cùng xem máy chấm từng tiêu chí",
  grammar: "mở lại bảng quy tắc của phần đó, đọc ví dụ cùng bé trước khi luyện tiếp",
};

// Câu gợi chuyện dự phòng — xoay vòng theo số tuần khi không bắt được chủ đề bé vừa luyện.
const TALK_IDEAS = [
  "What did you eat today? — đố bé kể bữa ăn hôm nay bằng tiếng Anh",
  "What's your favorite animal? — và hỏi thêm Why do you like it?",
  "How's the weather today? — để bé tả thời tiết rồi ba mẹ nhắc lại theo bé",
  "What will you do this weekend? — nghe bé kể kế hoạch cuối tuần",
  "What's your favorite subject? — hỏi bé môn học bé mê nhất ở trường",
  "Can you count from 1 to 20 in English? — thi đếm nhanh cùng bé",
  "What color is your shirt? — chỉ đồ vật quanh nhà, đố bé nói màu",
  "Who is your best friend? — để bé kể về bạn thân bằng 2 câu tiếng Anh",
];

// Câu gợi chuyện THEO CHỦ ĐỀ bé vừa luyện — trùng kiến thức đang nóng để bé trả lời được ngay.
const TOPIC_TALK: Record<string, string> = {
  "g-present": "What do you do every day? — để bé kể thói quen hằng ngày",
  "g-present-cont": "What are you doing? — hỏi bất chợt lúc bé đang làm gì đó",
  "g-past": "What did you do yesterday? — để bé kể lại ngày hôm qua",
  "g-future": "What will you do this weekend? — nghe kế hoạch của bé",
  "g-yesno": "Do you like ice cream? — hỏi liền 3 câu Yes/No cho vui",
  "g-wh": "Where is your schoolbag? — hỏi Where/What về đồ vật quanh nhà",
  "g-compare": "Who is taller, Mom or Dad? — đố bé so sánh người trong nhà",
  "g-superlative": "What is the biggest animal in the world? — đố bé về những cái 'nhất'",
  "g-articles": "What's this? — chỉ đồ vật quanh nhà, để bé trả lời It's a/an…",
  "g-prep": "Where is the cat? — đố bé dùng in/on/under với đồ vật trong nhà",
  "g-pronouns": "Whose book is this? — chỉ đồ của từng người, để bé nói his/her/mine",
  "g-thereis": "What's in your room? — để bé kể There is/There are…",
  "w-intro": "Can you introduce yourself? — để bé tự giới thiệu 3 câu tiếng Anh",
  "w-school": "What's your favorite subject? — chuyện trường lớp của bé",
  "w-family": "Who is in your family? — để bé kể về cả nhà bằng tiếng Anh",
  "w-food": "What did you eat today? — đố bé kể bữa ăn bằng tiếng Anh",
  "w-animals": "What's your favorite animal? — và hỏi thêm Why do you like it?",
  "w-town": "What's near our house? — để bé kể về khu phố bằng tiếng Anh",
  "w-para-me": "Tell me about your best friend! — thử thách bé nói 3 câu liền",
  "w-para-world": "Tell me about your room! — để bé tả phòng của mình",
  "w-para-plans": "What are you going to do tomorrow? — nghe dự định của bé",
};
// Chủ đề của các game khác (id tự do) — đoán theo từ khóa trong id.
const KEYWORD_TALK: [string, string][] = [
  ["food", "What did you eat today? — đố bé kể bữa ăn bằng tiếng Anh"],
  ["animal", "What's your favorite animal? — và hỏi thêm Why do you like it?"],
  ["family", "Who is in your family? — để bé kể về cả nhà bằng tiếng Anh"],
  ["school", "What's your favorite subject? — chuyện trường lớp của bé"],
  ["weather", "How's the weather today? — để bé tả thời tiết hôm nay"],
  ["color", "What color is your shirt? — chỉ đồ quanh nhà, đố bé nói màu"],
  ["number", "Can you count from 1 to 20 in English? — thi đếm nhanh cùng bé"],
  ["town", "What's near our house? — để bé kể về khu phố bằng tiếng Anh"],
  ["city", "What's near our house? — để bé kể về khu phố bằng tiếng Anh"],
];
function talkFor(key: string): string | null {
  const topic = key.split(":")[1] || "";
  if (TOPIC_TALK[topic]) return TOPIC_TALK[topic];
  const t = topic.toLowerCase();
  for (const [kw, q] of KEYWORD_TALK) if (t.includes(kw)) return q;
  return null;
}
// Chọn câu gợi chuyện: ưu tiên chủ đề bé LUYỆN NHIỀU tuần này và làm TỐT (≥70% đúng —
// câu hỏi là dịp khoe, không phải bài kiểm tra); không bắt được gì thì xoay vòng chung.
function pickTalk(m: Metrics, prevTopics: TopicAcc | null, weekIdx: number): string {
  const cand = Object.entries(m.topicAcc).map(([k, v]) => {
    const p = prevTopics?.[k];
    const weekN = v.c + v.w - ((p?.c || 0) + (p?.w || 0));
    return { k, weekN, pct: Math.round((v.c / (v.c + v.w)) * 100) };
  }).filter((x) => x.weekN >= 3);
  cand.sort((a, b) => ((b.pct >= 70 ? 1 : 0) - (a.pct >= 70 ? 1 : 0)) || b.weekN - a.weekN);
  for (const c of cand) {
    const q = talkFor(c.k);
    if (q) return q;
  }
  return TALK_IDEAS[weekIdx % TALK_IDEAS.length];
}

type Delta = { lessons: number; sentences: number; stars: number; practice: number };

// Cột mốc — chỉ báo đúng TUẦN bé vượt qua (so tổng tuần trước với tổng hiện tại).
function milestones(prev: { lessons: number; sentences: number; stars: number }, m: Metrics): string[] {
  const out: string[] = [];
  const check = (label: (t: number) => string, prevV: number, curV: number, marks: number[]) => {
    for (const t of marks) if (prevV < t && curV >= t) { out.push(label(t)); break; }
  };
  check((t) => `Vượt mốc <b>${t} bài học</b> hoàn thành!`, prev.lessons, m.lessons, [5, 10, 20, 30, 50, 75, 100, 150, 200, 300]);
  check((t) => `Thuộc <b>${t} câu tiếng Anh</b>!`, prev.sentences, m.sentences, [25, 50, 100, 200, 300, 500, 750, 1000]);
  check((t) => `Gom đủ <b>${t} sao</b>!`, prev.stars, m.stars, [25, 50, 100, 200, 300, 500]);
  return out.slice(0, 2);
}

function childBlock(
  name: string, avatar: string, m: Metrics,
  d: Delta, dPrev: Delta | null, marks: string[], weekIdx: number,
  prevTopics: TopicAcc | null,
): string {
  // Mũi tên xu hướng: so mức tăng tuần này với mức tăng tuần trước (có đủ 2 tuần dữ liệu mới hiện).
  const arrow = (cur: number, prev: number | undefined) =>
    prev == null || cur === prev ? "" :
    cur > prev ? ` <span style="color:#1b8a4b;font-size:11px">▲</span>` : ` <span style="color:#a7adb8;font-size:11px">▼</span>`;
  const rows: string[] = [];
  const row = (label: string, week: string, total: string) =>
    rows.push(`<tr><td style="padding:6px 10px;color:#5c6470">${label}</td><td style="padding:6px 10px;font-weight:700;color:#0b6a64;white-space:nowrap">${week}</td><td style="padding:6px 10px;color:#8a8f98">${total}</td></tr>`);
  row("📚 Bài học hoàn thành", `+${d.lessons}${arrow(d.lessons, dPrev?.lessons)}`, `tổng ${m.lessons}`);
  row("💬 Câu đã thuộc", `+${d.sentences}${arrow(d.sentences, dPrev?.sentences)}`, `tổng ${m.sentences}`);
  row("⭐ Sao đạt được", `+${d.stars}${arrow(d.stars, dPrev?.stars)}`, `tổng ${m.stars}`);
  row("🎯 Câu luyện tập đã gặp", `+${d.practice}${arrow(d.practice, dPrev?.practice)}`, `tổng ${m.practiceSeen}`);

  const line = (emoji: string, color: string, html: string) =>
    `<p style="margin:8px 0 0;font-size:13px;color:${color};line-height:1.5">${emoji} ${html}</p>`;
  const extras: string[] = [];

  // 🏅 Cột mốc vừa đạt trong tuần
  for (const mk of marks) extras.push(line("🏅", "#8a5c00", `Cột mốc tuần này: ${mk} Ba mẹ chúc mừng bé nhé.`));

  // 💪 Điểm sáng + 🧩 chỗ cần tiếp sức (kèm việc cụ thể cho ba mẹ)
  const accs = Object.entries(m.topicAcc)
    .map(([k, v]) => ({ k, pct: Math.round((v.c / (v.c + v.w)) * 100), n: v.c + v.w }));
  const best = [...accs].sort((a, b) => b.pct - a.pct).find((a) => a.pct >= 75);
  const weak = [...accs].sort((a, b) => a.pct - b.pct).find((a) => a.pct < 65);
  if (best) extras.push(line("💪", "#1b8a4b", `Điểm sáng: <b>${topicName(best.k)}</b> — đúng <b>${best.pct}%</b> trong ${best.n} câu gần đây. Bé làm chắc phần này!`));
  if (weak) extras.push(line("🧩", "#c9741a", `Cần tiếp sức: <b>${topicName(weak.k)}</b> mới đúng ${weak.pct}% — gợi ý: ${TIP[weak.k.split(":")[0]] || "cùng bé luyện lại phần này 5 phút mỗi tối"}.`));

  const active = d.lessons + d.sentences + d.practice > 0;
  if (active) {
    if (m.streak >= 2) extras.push(line("🔥", "#1b8a4b", `Chuỗi học hiện tại: <b>${m.streak} ngày liên tục</b> — ba mẹ khen bé một câu để giữ lửa nhé!`));
    extras.push(line("🗣️", "#2b2f3f", `Gợi chuyện tuần này: <b>${pickTalk(m, prevTopics, weekIdx)}</b>.`));
  } else {
    extras.push(line("💤", "#c9741a", `Tuần này bé chưa vào học. Bé đã có <b>${m.sentences} câu</b> và <b>${m.stars} sao</b> tích lũy — đừng để nguội! Gợi ý: hẹn cố định 10 phút sau bữa tối, bắt đầu bằng game bé thích nhất.`));
  }

  return `
  <div style="background:#fff;border:1px solid #eee2cc;border-radius:14px;padding:16px 18px;margin:0 0 14px">
    <h3 style="margin:0 0 8px;font-size:16px;color:#2b2f3f">${avatar} ${name}</h3>
    <table style="border-collapse:collapse;font-size:14px;width:100%">${rows.join("")}</table>
    ${extras.join("")}
  </div>`;
}

// CORS: trang /admin (app.speakupkids.net) gọi từ trình duyệt nên cần preflight + header.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const url = new URL(req.url);
  const body = req.method === "POST" ? await req.json().catch(() => ({} as Record<string, unknown>)) : {} as Record<string, unknown>;
  const dry = url.searchParams.get("dry") === "1" || body.dry === true;
  const only = url.searchParams.get("only") || (typeof body.only === "string" && body.only) || null;

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // Hai đường vào hợp lệ: (1) cron với ?key=REPORT_SECRET, (2) admin đăng nhập (JWT
  // thuộc bảng admins) — trang /admin dùng đường này, không cần nhúng secret vào client.
  const secret = Deno.env.get("REPORT_SECRET");
  const keyOk = !secret || url.searchParams.get("key") === secret;
  let authOk = keyOk;
  if (!authOk) {
    const authHdr = req.headers.get("Authorization") || "";
    if (authHdr.startsWith("Bearer ")) {
      const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHdr } } });
      const { data } = await userClient.auth.getUser();
      if (data?.user) {
        const { data: adm } = await db.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
        if (adm) authOk = true;
      }
    }
  }
  if (!authOk) return new Response("forbidden", { status: 403, headers: CORS });

  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!dry && !resendKey) return Response.json({ error: "RESEND_API_KEY chưa được set" }, { status: 500, headers: CORS });

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
    let wkLessons = 0, wkSentences = 0, wkStars = 0, wkPractice = 0, anyActive = false;
    const weekIdx = Math.floor(Date.parse(ws) / (7 * 86400000));
    for (const child of children) {
      const { data: st } = await db.from("child_state").select("state").eq("child_id", child.id).maybeSingle();
      if (!st?.state) continue;
      const m = metrics(st.state);
      // 2 snapshot gần nhất TRƯỚC tuần này: [0] tính "tuần này tăng bao nhiêu",
      // [1] tính mức tăng của tuần trước → mũi tên xu hướng.
      const { data: prevRows } = await db.from("weekly_snapshots")
        .select("lessons_done, sentences_done, stars, practice_seen, topics")
        .eq("child_id", child.id).lt("week_start", ws)
        .order("week_start", { ascending: false }).limit(2);
      const prev = prevRows?.[0] || null;
      const prev2 = prevRows?.[1] || null;
      const d = {
        lessons: Math.max(0, m.lessons - (prev?.lessons_done || 0)),
        sentences: Math.max(0, m.sentences - (prev?.sentences_done || 0)),
        stars: Math.max(0, m.stars - (prev?.stars || 0)),
        practice: Math.max(0, m.practiceSeen - (prev?.practice_seen || 0)),
      };
      const dPrev = prev && prev2 ? {
        lessons: Math.max(0, prev.lessons_done - (prev2.lessons_done || 0)),
        sentences: Math.max(0, prev.sentences_done - (prev2.sentences_done || 0)),
        stars: Math.max(0, prev.stars - (prev2.stars || 0)),
        practice: Math.max(0, prev.practice_seen - (prev2.practice_seen || 0)),
      } : null;
      const marks = milestones(
        { lessons: prev?.lessons_done || 0, sentences: prev?.sentences_done || 0, stars: prev?.stars || 0 }, m);
      wkLessons += d.lessons; wkSentences += d.sentences; wkStars += d.stars; wkPractice += d.practice;
      anyActive = anyActive || d.lessons + d.sentences + d.practice > 0;
      blocks.push(childBlock(child.ingame_name, child.avatar, m, d, dPrev, marks, weekIdx, (prev?.topics as TopicAcc) || null));
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

    // Tiêu đề mang số liệu thật của tuần — chọn chỉ số CÓ số liệu, không hiện "+0".
    const subjParts: string[] = [];
    if (wkLessons > 0) subjParts.push(`+${wkLessons} bài học`);
    if (wkSentences > 0) subjParts.push(`+${wkSentences} câu mới`);
    if (!subjParts.length && wkStars > 0) subjParts.push(`+${wkStars} sao`);
    if (!subjParts.length && wkPractice > 0) subjParts.push(`+${wkPractice} câu luyện tập`);
    const subject = anyActive
      ? `🍁 ${kidNames} tuần này: ${subjParts.join(" · ") || "vẫn chăm chỉ luyện tập"} — SpeakUp Kids`
      : `🍁 SpeakUp Kids nhớ ${kidNames} — cùng bé quay lại học nhé`;

    if (dry) { preview.push({ to: parent.email, kids: kidNames, subject }); sent++; continue; }
    const rs = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "SpeakUp Kids <no-reply@speakupkids.net>",
        to: [parent.email],
        subject,
        html,
      }),
    });
    if (rs.ok) sent++; else skipped++;
  }

  return { sent, skipped, preview };
  }

  // Chế độ cron (gọi bằng key, không dry/only): trả lời ngay trong <5s của pg_net,
  // phần gửi email chạy nền qua EdgeRuntime.waitUntil. Admin gọi từ /admin thì chạy
  // đồng bộ để xem được kết quả sent/skipped.
  const runtime = (globalThis as Record<string, any>).EdgeRuntime;
  const fromCron = keyOk && req.method === "GET";
  if (fromCron && !dry && !only && runtime?.waitUntil) {
    runtime.waitUntil(process().catch((e: unknown) => console.error("weekly-report:", e)));
    return Response.json({ ok: true, started: true, week_start: ws }, { headers: CORS });
  }
  try {
    const r = await process();
    return Response.json({ ok: true, week_start: ws, sent: r.sent, skipped: r.skipped, ...(dry ? { preview: r.preview } : {}) }, { headers: CORS });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500, headers: CORS });
  }
});
