"use client";

// Trang quản trị nội bộ (/admin): đại lý & mã kích hoạt, tài khoản & gói, tặng Coins/Cash.
// Bảo mật thật nằm ở RLS (is_admin) phía Supabase — trang này chỉ là giao diện.
import { useEffect, useMemo, useState } from "react";
import { cloudEnabled } from "@/lib/supabase";
import { signIn, signOut, currentUser } from "@/lib/cloud";
import {
  isAdminUser, listParents, listAllChildren, listEntitlements, grantPlan, revokePlan,
  listAgents, createAgent, listCodes, generateCodes, sendGift, listGifts, runWeeklyReport,
  type AdminParent, type AdminChild, type AdminEntitlement, type AdminAgent, type AdminCode, type AdminGift, type ReportResult,
} from "@/lib/admin";

type Tab = "overview" | "agents" | "accounts" | "gifts" | "email";
const TABS: [Tab, string][] = [
  ["overview", "📊 Tổng quan"], ["agents", "🏷️ Đại lý & mã"], ["accounts", "👨‍👩‍👧 Tài khoản"], ["gifts", "🎁 Tặng quà"], ["email", "📧 Email tuần"],
];

export default function AdminPage() {
  const [phase, setPhase] = useState<"loading" | "login" | "denied" | "ready">("loading");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<Tab>("overview");

  // Dữ liệu dùng chung giữa các tab
  const [parents, setParents] = useState<AdminParent[]>([]);
  const [children, setChildren] = useState<AdminChild[]>([]);
  const [ents, setEnts] = useState<AdminEntitlement[]>([]);
  const [agents, setAgents] = useState<AdminAgent[]>([]);
  const [codes, setCodes] = useState<AdminCode[]>([]);
  const [gifts, setGifts] = useState<AdminGift[]>([]);

  async function refresh() {
    const [p, c, e, a, co, g] = await Promise.all([
      listParents(), listAllChildren(), listEntitlements(), listAgents(), listCodes(), listGifts(),
    ]);
    setParents(p); setChildren(c); setEnts(e); setAgents(a); setCodes(co); setGifts(g);
  }

  useEffect(() => {
    if (!cloudEnabled()) { setPhase("login"); return; }
    (async () => {
      const u = await currentUser();
      if (!u) { setPhase("login"); return; }
      if (!(await isAdminUser())) { setPhase("denied"); return; }
      await refresh();
      setPhase("ready");
    })();
  }, []);

  async function doLogin() {
    setErr("");
    try {
      await signIn(email.trim(), pass);
      if (!(await isAdminUser())) { setPhase("denied"); return; }
      await refresh();
      setPhase("ready");
    } catch {
      setErr("Đăng nhập thất bại — kiểm tra email/mật khẩu.");
    }
  }

  if (!cloudEnabled()) return <div className="adm-center">Chưa cấu hình Supabase (NEXT_PUBLIC_*) — trang admin cần cloud.</div>;
  if (phase === "loading") return <div className="adm-center">Đang tải…</div>;
  if (phase === "login") return (
    <div className="adm-center">
      <div className="adm-login">
        <h1>🍁 SpeakUp Admin</h1>
        <input type="email" placeholder="Email admin" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Mật khẩu" value={pass} onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doLogin()} />
        {err && <p className="adm-err">{err}</p>}
        <button className="adm-btn" onClick={doLogin}>Đăng nhập</button>
      </div>
    </div>
  );
  if (phase === "denied") return (
    <div className="adm-center">
      <div className="adm-login">
        <h1>⛔ Không có quyền</h1>
        <p>Tài khoản này không phải admin. Thêm admin bằng SQL Editor (xem chú thích trong supabase/schema.sql).</p>
        <button className="adm-btn" onClick={async () => { await signOut(); location.reload(); }}>Đăng xuất</button>
      </div>
    </div>
  );

  return (
    <div className="admin">
      <header className="adm-head">
        <b>🍁 SpeakUp Admin</b>
        <nav>{TABS.map(([t, label]) => (
          <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{label}</button>
        ))}</nav>
        <button className="adm-out" onClick={async () => { await signOut(); location.reload(); }}>Đăng xuất</button>
      </header>
      {tab === "overview" && <Overview parents={parents} children={children} ents={ents} agents={agents} codes={codes} />}
      {tab === "agents" && <Agents agents={agents} codes={codes} onChange={refresh} />}
      {tab === "accounts" && <Accounts parents={parents} children={children} ents={ents} onChange={refresh} />}
      {tab === "gifts" && <Gifts parents={parents} children={children} gifts={gifts} onChange={refresh} />}
      {tab === "email" && <EmailReport parents={parents} children={children} />}
    </div>
  );
}

/* ═══════════ Email báo cáo tuần ═══════════ */
function EmailReport({ parents, children }: { parents: AdminParent[]; children: AdminChild[] }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const kidsOf = (pid: string) => children.filter((c) => c.parent_id === pid).map((c) => `${c.avatar} ${c.ingame_name}`).join(", ") || "—";

  async function run(opts: { dry?: boolean; only?: string }, label: string) {
    setBusy(true);
    try {
      const r = await runWeeklyReport(opts);
      setResult(r);
      setLog((l) => [`${new Date().toLocaleTimeString("vi-VN")} · ${label} → gửi ${r.sent ?? 0}, bỏ qua ${r.skipped ?? 0}`, ...l].slice(0, 10));
    } catch {
      setLog((l) => [`${new Date().toLocaleTimeString("vi-VN")} · ${label} → LỖI gọi function`, ...l].slice(0, 10));
    }
    setBusy(false);
  }

  return (
    <section className="adm-body">
      <h2>Email báo cáo tuần — chạy tay để test</h2>
      <div className="adm-form">
        <button className="adm-btn" disabled={busy} onClick={() => run({ dry: true }, "Chạy thử (dry)")}>🔍 Chạy thử — xem ai sẽ nhận (không gửi)</button>
        <button className="adm-btn" style={{ background: "#e2593f" }} disabled={busy}
          onClick={() => confirm(`Gửi email THẬT cho tất cả phụ huynh đang bật nhận báo cáo?`) && run({}, "Gửi tất cả")}>
          🚀 Gửi thật cho TẤT CẢ
        </button>
      </div>

      {result?.preview && (
        <>
          <h2>Kết quả chạy thử (tuần bắt đầu {result.week_start}) — {result.sent ?? 0} người sẽ nhận</h2>
          <table className="adm-table">
            <thead><tr><th>Email nhận</th><th>Các bé trong báo cáo</th></tr></thead>
            <tbody>{result.preview.map((p) => <tr key={p.to}><td>{p.to}</td><td>{p.kids}</td></tr>)}</tbody>
          </table>
        </>
      )}

      <h2>Gửi thật cho từng người (kiểm tra hộp thư)</h2>
      <table className="adm-table">
        <thead><tr><th>Email</th><th>Bé</th><th></th></tr></thead>
        <tbody>{parents.map((p) => (
          <tr key={p.id}>
            <td>{p.email}</td><td>{kidsOf(p.id)}</td>
            <td className="adm-acts"><button disabled={busy} onClick={() => run({ only: p.email }, `Gửi ${p.email}`)}>📨 Gửi thật</button></td>
          </tr>
        ))}</tbody>
      </table>

      {log.length > 0 && (
        <>
          <h2>Nhật ký phiên này</h2>
          <div className="adm-fresh"><pre>{log.join("\n")}</pre></div>
        </>
      )}
      <p className="adm-empty" style={{ marginTop: 14 }}>Lịch tự động: 8h sáng thứ Bảy (cron trên Supabase). Phụ huynh tắt nhận trong app → không có trong danh sách.</p>
    </section>
  );
}

/* ═══════════ Tổng quan ═══════════ */
function Overview({ parents, children, ents, agents, codes }: {
  parents: AdminParent[]; children: AdminChild[]; ents: AdminEntitlement[]; agents: AdminAgent[]; codes: AdminCode[];
}) {
  const pro = ents.filter((e) => e.plan === "pro").length;
  const family = ents.filter((e) => e.plan === "family").length;
  const redeemed = codes.filter((c) => c.redeemed_by).length;
  const perAgent = agents.map((a) => {
    const mine = codes.filter((c) => c.agent_id === a.id);
    return { name: a.name, issued: mine.length, sold: mine.filter((c) => c.redeemed_by).length };
  });
  return (
    <section className="adm-body">
      <div className="adm-stats">
        <div className="adm-stat"><b>{parents.length}</b><span>tài khoản ba mẹ</span></div>
        <div className="adm-stat"><b>{children.length}</b><span>hồ sơ bé</span></div>
        <div className="adm-stat hi"><b>{pro}</b><span>gói Pro</span></div>
        <div className="adm-stat hi"><b>{family}</b><span>gói Family</span></div>
        <div className="adm-stat"><b>{redeemed}/{codes.length}</b><span>mã đã bán / đã phát hành</span></div>
      </div>
      <h2>Doanh số theo đại lý</h2>
      {perAgent.length === 0 ? <p className="adm-empty">Chưa có đại lý — tạo ở tab "Đại lý & mã".</p> : (
        <table className="adm-table">
          <thead><tr><th>Đại lý</th><th>Mã đã phát</th><th>Đã bán (redeemed)</th></tr></thead>
          <tbody>{perAgent.map((r) => (
            <tr key={r.name}><td>{r.name}</td><td>{r.issued}</td><td><b>{r.sold}</b></td></tr>
          ))}</tbody>
        </table>
      )}
    </section>
  );
}

/* ═══════════ Đại lý & mã kích hoạt ═══════════ */
function Agents({ agents, codes, onChange }: { agents: AdminAgent[]; codes: AdminCode[]; onChange: () => Promise<void> }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [genAgent, setGenAgent] = useState<string>("");     // "" = mã không gắn đại lý (bán trực tiếp)
  const [genPlan, setGenPlan] = useState<"pro" | "family">("pro");
  const [genCount, setGenCount] = useState(5);
  const [fresh, setFresh] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function addAgent() {
    if (!name.trim()) return;
    setBusy(true);
    try { await createAgent(name.trim(), phone.trim() || undefined); setName(""); setPhone(""); await onChange(); }
    catch { alert("Không tạo được đại lý."); }
    setBusy(false);
  }
  async function gen() {
    setBusy(true);
    try { setFresh(await generateCodes(genAgent || null, genPlan, genCount)); await onChange(); }
    catch { alert("Không sinh được mã (thử lại)."); }
    setBusy(false);
  }
  const agentName = (id: string | null) => agents.find((a) => a.id === id)?.name || "— trực tiếp —";
  return (
    <section className="adm-body">
      <h2>Tạo đại lý</h2>
      <div className="adm-form">
        <input placeholder="Tên đại lý (VD: Cô Lan - Q7)" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="SĐT/Zalo (tuỳ chọn)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button className="adm-btn" disabled={busy} onClick={addAgent}>+ Thêm đại lý</button>
      </div>

      <h2>Sinh mã kích hoạt</h2>
      <div className="adm-form">
        <select value={genAgent} onChange={(e) => setGenAgent(e.target.value)}>
          <option value="">— Không gắn đại lý (bán trực tiếp) —</option>
          {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select value={genPlan} onChange={(e) => setGenPlan(e.target.value as "pro" | "family")}>
          <option value="pro">Pro (1 bé)</option><option value="family">Family (4 bé)</option>
        </select>
        <input type="number" min={1} max={100} value={genCount} onChange={(e) => setGenCount(+e.target.value || 1)} style={{ width: 80 }} />
        <button className="adm-btn" disabled={busy} onClick={gen}>⚙ Sinh mã</button>
      </div>
      {fresh.length > 0 && (
        <div className="adm-fresh">
          <b>Mã vừa sinh (gửi cho đại lý):</b>
          <pre>{fresh.join("\n")}</pre>
          <button className="adm-btn sm" onClick={() => navigator.clipboard?.writeText(fresh.join("\n"))}>📋 Copy tất cả</button>
        </div>
      )}

      <h2>Mã đã phát hành ({codes.length})</h2>
      <table className="adm-table">
        <thead><tr><th>Mã</th><th>Gói</th><th>Đại lý</th><th>Trạng thái</th><th>Ngày bán</th></tr></thead>
        <tbody>{codes.map((c) => (
          <tr key={c.code}>
            <td className="mono">{c.code}</td>
            <td>{c.plan === "family" ? "Family" : "Pro"}</td>
            <td>{agentName(c.agent_id)}</td>
            <td>{c.redeemed_by ? <b className="sold">Đã bán</b> : "Chưa dùng"}</td>
            <td>{c.redeemed_at ? c.redeemed_at.slice(0, 10) : "—"}</td>
          </tr>
        ))}</tbody>
      </table>
    </section>
  );
}

/* ═══════════ Tài khoản & gói ═══════════ */
function Accounts({ parents, children, ents, onChange }: {
  parents: AdminParent[]; children: AdminChild[]; ents: AdminEntitlement[]; onChange: () => Promise<void>;
}) {
  const [busy, setBusy] = useState("");
  const entOf = useMemo(() => new Map(ents.map((e) => [e.parent_id, e])), [ents]);
  const kidsOf = useMemo(() => {
    const m = new Map<string, AdminChild[]>();
    for (const c of children) { const arr = m.get(c.parent_id) || []; arr.push(c); m.set(c.parent_id, arr); }
    return m;
  }, [children]);
  async function act(parentId: string, fn: () => Promise<void>) {
    setBusy(parentId);
    try { await fn(); await onChange(); } catch { alert("Thao tác thất bại."); }
    setBusy("");
  }
  return (
    <section className="adm-body">
      <h2>Tài khoản ({parents.length})</h2>
      <table className="adm-table">
        <thead><tr><th>Email</th><th>Bé</th><th>Gói</th><th>Nguồn</th><th>Thao tác</th></tr></thead>
        <tbody>{parents.map((p) => {
          const e = entOf.get(p.id);
          const kids = kidsOf.get(p.id) || [];
          return (
            <tr key={p.id}>
              <td>{p.email}{p.name ? <small> · {p.name}</small> : null}</td>
              <td>{kids.map((k) => `${k.avatar} ${k.ingame_name}`).join(", ") || "—"}</td>
              <td>{e ? <b className={e.plan}>{e.plan === "family" ? "Family" : "Pro"}</b> : "Free"}</td>
              <td className="mono">{e?.order_ref || "—"}</td>
              <td className="adm-acts">
                {e?.plan !== "pro" && <button disabled={busy === p.id} onClick={() => act(p.id, () => grantPlan(p.id, "pro"))}>Cấp Pro</button>}
                {e?.plan !== "family" && <button disabled={busy === p.id} onClick={() => act(p.id, () => grantPlan(p.id, "family"))}>Cấp Family</button>}
                {e && <button className="danger" disabled={busy === p.id}
                  onClick={() => confirm(`Gỡ gói của ${p.email}?`) && act(p.id, () => revokePlan(p.id))}>Gỡ gói</button>}
              </td>
            </tr>
          );
        })}</tbody>
      </table>
    </section>
  );
}

/* ═══════════ Tặng Coins/Cash ═══════════ */
function Gifts({ parents, children, gifts, onChange }: {
  parents: AdminParent[]; children: AdminChild[]; gifts: AdminGift[]; onChange: () => Promise<void>;
}) {
  const [childId, setChildId] = useState("");
  const [coins, setCoins] = useState(50);
  const [cash, setCash] = useState(0);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const emailOf = useMemo(() => new Map(parents.map((p) => [p.id, p.email])), [parents]);
  const nameOfChild = (id: string) => {
    const c = children.find((x) => x.id === id);
    return c ? `${c.avatar} ${c.ingame_name} (${emailOf.get(c.parent_id) || "?"})` : id.slice(0, 8);
  };
  async function send() {
    if (!childId || (coins <= 0 && cash <= 0)) return;
    setBusy(true);
    try { await sendGift(childId, coins, cash, note.trim() || undefined); setNote(""); await onChange(); alert("Đã gửi quà — bé nhận ở lần mở app sau."); }
    catch { alert("Gửi quà thất bại."); }
    setBusy(false);
  }
  return (
    <section className="adm-body">
      <h2>Tặng Maple Coins / Cash (test hoặc chăm sóc khách)</h2>
      <div className="adm-form">
        <select value={childId} onChange={(e) => setChildId(e.target.value)}>
          <option value="">— Chọn bé —</option>
          {children.map((c) => <option key={c.id} value={c.id}>{c.avatar} {c.ingame_name} · {emailOf.get(c.parent_id) || "?"}</option>)}
        </select>
        <label>◆ Coins <input type="number" min={0} value={coins} onChange={(e) => setCoins(+e.target.value || 0)} style={{ width: 90 }} /></label>
        <label>💵 Cash <input type="number" min={0} value={cash} onChange={(e) => setCash(+e.target.value || 0)} style={{ width: 90 }} /></label>
        <input placeholder="Ghi chú (tuỳ chọn)" value={note} onChange={(e) => setNote(e.target.value)} />
        <button className="adm-btn" disabled={busy || !childId} onClick={send}>🎁 Gửi quà</button>
      </div>
      <h2>Quà gần đây</h2>
      <table className="adm-table">
        <thead><tr><th>Bé</th><th>Coins</th><th>Cash</th><th>Ghi chú</th><th>Trạng thái</th></tr></thead>
        <tbody>{gifts.map((g) => (
          <tr key={g.id}>
            <td>{nameOfChild(g.child_id)}</td><td>{g.coins}</td><td>{g.cash}</td><td>{g.note || "—"}</td>
            <td>{g.claimed_at ? "✅ Đã nhận" : "⏳ Chờ bé mở app"}</td>
          </tr>
        ))}</tbody>
      </table>
    </section>
  );
}
