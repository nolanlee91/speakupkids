"use client";
// Cổng vào app khi đã bật cloud: đăng nhập ba mẹ → chọn hồ sơ con → mới vào app.
// Nếu CHƯA cấu hình cloud (thiếu key) → bỏ qua cổng, app chạy offline như cũ.
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { supabase, cloudEnabled } from "@/lib/supabase";
import {
  signIn, signUp, signOut, sendPasswordReset, updatePassword,
  listChildren, createChild, activateChild, migrateLocalToChild,
  getActiveChildId, type ChildProfile,
} from "@/lib/cloud";
import { loadState } from "@/lib/state";

const AVATARS = ["🦊", "🐰", "🐼", "🦉", "🐨", "🦫", "🐬", "🦄", "🐧", "🐝"];

function hasLocalProgress(): boolean {
  const s = loadState();
  return (s.stickers?.length ?? 0) > 0
    || Object.keys(s.learn?.lessons ?? {}).length > 0
    || Object.keys(s.games?.topics ?? {}).length > 0
    || (s.streak ?? 0) > 0;
}

function viError(e: unknown): string {
  const m = (e instanceof Error ? e.message : String(e)) || "";
  if (/invalid login credentials/i.test(m)) return "Sai email hoặc mật khẩu.";
  if (/already registered|already exists/i.test(m)) return "Email này đã có tài khoản — hãy đăng nhập.";
  if (/password should be at least/i.test(m)) return "Mật khẩu cần tối thiểu 6 ký tự.";
  if (/email not confirmed/i.test(m)) return "Email chưa xác nhận — mở mail bấm liên kết trước đã.";
  if (/rate limit|too many/i.test(m)) return "Thử lại sau ít phút nhé.";
  if (/for security purposes/i.test(m)) return "Thao tác hơi nhanh — đợi vài giây rồi thử lại.";
  return m || "Có lỗi xảy ra, thử lại nhé.";
}

type Phase = "loading" | "auth" | "recovery" | "picker" | "ready";

// Nền scenery (giống desktop app) → 2 bên không còn trống; veil kem để chữ/card dễ đọc.
// Không đặt font-family: kế thừa Nunito từ body cho đồng bộ toàn app.
const shell: React.CSSProperties = {
  minHeight: "100vh", display: "grid", placeItems: "center", padding: 20,
  color: "var(--ink, #2b2f3f)",
  background:
    "linear-gradient(rgba(250,243,231,.62), rgba(250,243,231,.62)), " +
    "#cdd8db url('/assets/images/desktop-scenery/desktop-world-backdrop.webp') center top / cover no-repeat fixed",
};
const headStyle: React.CSSProperties = { fontFamily: "var(--font-head-stack)", letterSpacing: "-.3px" };
const MAPLE = "/assets/images/gen/maple-pose-cheer.webp";
const card: React.CSSProperties = {
  width: "min(100%, 420px)", background: "var(--card, #fff)", border: "1px solid var(--line, #e8dcc6)",
  borderRadius: 20, padding: 24, boxShadow: "0 14px 34px rgba(80,60,30,.13)",
};
const input: React.CSSProperties = {
  width: "100%", padding: "11px 13px", borderRadius: 12, border: "1px solid var(--line, #e8dcc6)",
  fontSize: 16, marginTop: 6, background: "var(--panel, #fdf8ee)", color: "inherit",
};
const label: React.CSSProperties = { fontSize: 13, fontWeight: 700, color: "var(--muted, #8b7c66)", marginTop: 12, display: "block" };
const eyeBtn: React.CSSProperties = {
  position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
  background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 4, lineHeight: 1,
};

// Ô mật khẩu có nút con mắt: ấn để hiện/ẩn, phòng khi gõ nhầm.
function PasswordInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", marginTop: 6 }}>
      <input style={{ ...input, marginTop: 0, paddingRight: 44 }} type={show ? "text" : "password"}
        value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} minLength={6} required />
      <button type="button" onClick={() => setShow((s) => !s)} style={eyeBtn}
        aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"} title={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
        {show ? "🙈" : "👁️"}
      </button>
    </div>
  );
}

export function AuthGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>(cloudEnabled() ? "loading" : "ready");
  const [email, setEmail] = useState<string | null>(null);
  const [kids, setKids] = useState<ChildProfile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return; // offline: phase đã là "ready"
    let alive = true;

    // Vào từ liên kết đặt lại mật khẩu (token ở hash) → hiện màn đặt mật khẩu mới, KHÔNG tự vào app.
    const isRecovery = typeof window !== "undefined" && /type=recovery/.test(window.location.hash);

    const { data: sub } = supabase.auth.onAuthStateChange((ev, session) => {
      if (ev === "PASSWORD_RECOVERY") { setPhase("recovery"); return; }
      if (!session?.user) { setEmail(null); setActiveId(null); setKids([]); setPhase("auth"); }
    });

    (async () => {
      if (isRecovery) { setPhase("recovery"); return; }
      const { data } = await supabase!.auth.getUser();
      if (!alive) return;
      if (!data.user) { setPhase("auth"); return; }
      setEmail(data.user.email ?? null);
      await enterAfterLogin();
    })();

    return () => { alive = false; sub.subscription.unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function enterAfterLogin() {
    const list = await listChildren();
    setKids(list);
    const saved = getActiveChildId();
    const prof = saved ? list.find((k) => k.id === saved) : undefined;
    if (prof) {
      await activateChild(prof);
      setActiveId(prof.id);
      setPhase("ready");
    } else {
      setPhase("picker");
    }
  }

  async function pick(child: ChildProfile) {
    await activateChild(child);
    setActiveId(child.id);
    setPhase("ready");
  }

  if (phase === "loading") return <div style={shell}><p style={{ color: "var(--muted,#8b7c66)" }}>Đang kết nối…</p></div>;
  if (phase === "recovery")
    return <RecoveryForm onDone={async () => {
      const { data } = await supabase!.auth.getUser();
      setEmail(data.user?.email ?? null);
      setPhase("loading");
      await enterAfterLogin();
    }} />;
  if (phase === "auth") return <AuthForm onLoggedIn={async (e) => { setEmail(e); setPhase("loading"); await enterAfterLogin(); }} />;
  if (phase === "picker")
    return <ChildPicker kids={kids} email={email} onPick={pick} onAdded={(k) => setKids((cs) => [...cs, k])}
      onSignOut={async () => { await signOut(); }} />;
  // ready — remount App khi đổi hồ sơ con để nạp lại tiến độ
  return <div key={activeId ?? "offline"} style={{ display: "contents" }}>{children}</div>;
}

/* ───────────── Đăng nhập / Đăng ký ───────────── */
function AuthForm({ onLoggedIn }: { onLoggedIn: (email: string) => void | Promise<void> }) {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    setErr(""); setInfo(""); setBusy(true);
    try {
      if (mode === "up") {
        await signUp(email.trim(), pw, name.trim());
        const { data } = await supabase!.auth.getSession();
        if (!data.session) { // bật xác minh email
          setInfo("Đã gửi email xác nhận. Mở mail → bấm liên kết → quay lại đăng nhập.");
          setMode("in"); setBusy(false); return;
        }
        await onLoggedIn(email.trim());
      } else {
        await signIn(email.trim(), pw);
        await onLoggedIn(email.trim());
      }
    } catch (e) { setErr(viError(e)); setBusy(false); }
  }
  async function forgot() {
    if (!email.trim()) { setErr("Nhập email trước đã."); return; }
    setErr(""); setInfo("");
    try { await sendPasswordReset(email.trim()); setInfo("Đã gửi email đặt lại mật khẩu."); }
    catch (e) { setErr(viError(e)); }
  }

  return (
    <div style={shell}>
      <form style={card} onSubmit={submit}>
        <img src={MAPLE} alt="Maple" style={{ height: 96, width: "auto", display: "block", margin: "0 auto 6px" }} />
        <h1 style={{ ...headStyle, fontSize: 22, fontWeight: 800, textAlign: "center", margin: "4px 0 2px" }}>
          {mode === "in" ? "Đăng nhập ba mẹ" : "Tạo tài khoản ba mẹ"}
        </h1>
        <p style={{ textAlign: "center", color: "var(--muted,#8b7c66)", fontSize: 14, margin: 0 }}>
          Theo dõi tiến độ học của con &amp; nhận báo cáo tuần qua email.
        </p>

        {mode === "up" && (
          <label style={label}>Tên ba mẹ (hoặc gọi là gì)
            <input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Vd: Mẹ Bống" required />
          </label>
        )}
        <label style={label}>Email
          <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ba.me@email.com" required />
        </label>
        <label style={label}>Mật khẩu
          <PasswordInput value={pw} onChange={setPw} placeholder="tối thiểu 6 ký tự" />
        </label>

        {err && <p style={{ color: "var(--coral,#e2593f)", fontSize: 14, marginTop: 12 }}>{err}</p>}
        {info && <p style={{ color: "var(--teal-ink,#0b6a64)", fontSize: 14, marginTop: 12 }}>{info}</p>}

        <button className="btn" type="submit" disabled={busy} style={{ width: "100%", marginTop: 16 }}>
          {busy ? "Đang xử lý…" : mode === "in" ? "Đăng nhập" : "Tạo tài khoản"}
        </button>

        <div style={{ textAlign: "center", marginTop: 14, fontSize: 14 }}>
          {mode === "in" ? (
            <>
              <button type="button" onClick={forgot} style={linkBtn}>Quên mật khẩu?</button>
              <div style={{ marginTop: 8, color: "var(--muted,#8b7c66)" }}>
                Chưa có tài khoản?{" "}
                <button type="button" onClick={() => { setMode("up"); setErr(""); setInfo(""); }} style={linkBtn}>Đăng ký</button>
              </div>
            </>
          ) : (
            <div style={{ color: "var(--muted,#8b7c66)" }}>
              Đã có tài khoản?{" "}
              <button type="button" onClick={() => { setMode("in"); setErr(""); setInfo(""); }} style={linkBtn}>Đăng nhập</button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

/* ───────────── Đặt lại mật khẩu (vào từ liên kết trong email) ───────────── */
function RecoveryForm({ onDone }: { onDone: () => void | Promise<void> }) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    if (pw.length < 6) { setErr("Mật khẩu cần tối thiểu 6 ký tự."); return; }
    if (pw !== pw2) { setErr("Hai ô mật khẩu chưa khớp."); return; }
    setErr(""); setBusy(true);
    try {
      await updatePassword(pw);
      // Xoá token recovery khỏi URL cho sạch trước khi vào app.
      if (typeof window !== "undefined") history.replaceState(null, "", window.location.pathname + window.location.search);
      await onDone();
    } catch (e) { setErr(viError(e)); setBusy(false); }
  }

  return (
    <div style={shell}>
      <form style={card} onSubmit={submit}>
        <img src={MAPLE} alt="Maple" style={{ height: 96, width: "auto", display: "block", margin: "0 auto 6px" }} />
        <h1 style={{ ...headStyle, fontSize: 22, fontWeight: 800, textAlign: "center", margin: "4px 0 2px" }}>Đặt mật khẩu mới</h1>
        <p style={{ textAlign: "center", color: "var(--muted,#8b7c66)", fontSize: 14, margin: 0 }}>
          Nhập mật khẩu mới cho tài khoản ba mẹ.
        </p>
        <label style={label}>Mật khẩu mới
          <PasswordInput value={pw} onChange={setPw} placeholder="tối thiểu 6 ký tự" />
        </label>
        <label style={label}>Nhập lại mật khẩu
          <PasswordInput value={pw2} onChange={setPw2} placeholder="gõ lại cho chắc" />
        </label>
        {err && <p style={{ color: "var(--coral,#e2593f)", fontSize: 14, marginTop: 12 }}>{err}</p>}
        <button className="btn" type="submit" disabled={busy} style={{ width: "100%", marginTop: 16 }}>
          {busy ? "Đang lưu…" : "Lưu mật khẩu & vào app"}
        </button>
      </form>
    </div>
  );
}

/* ───────────── Chọn / thêm hồ sơ con ───────────── */
function ChildPicker({ kids, email, onPick, onAdded, onSignOut }: {
  kids: ChildProfile[]; email: string | null;
  onPick: (child: ChildProfile) => Promise<void>;
  onAdded: (k: ChildProfile) => void;
  onSignOut: () => Promise<void>;
}) {
  const [adding, setAdding] = useState(kids.length === 0);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [age, setAge] = useState(10);
  const [migrate, setMigrate] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const firstEver = kids.length === 0;
  const offerMigrate = firstEver && hasLocalProgress();

  async function add(ev: FormEvent) {
    ev.preventDefault();
    if (!name.trim()) { setErr("Nhập tên in-game của con."); return; }
    setErr(""); setBusy(true);
    try {
      const k = await createChild({ ingame_name: name.trim(), avatar, age });
      if (offerMigrate && migrate) await migrateLocalToChild(k.id);
      onAdded(k);
      await onPick(k); // vào chơi luôn với hồ sơ vừa tạo
    } catch (e) { setErr(viError(e)); setBusy(false); }
  }

  return (
    <div style={shell}>
      <div style={card}>
        <img src={MAPLE} alt="Maple" style={{ height: 64, width: "auto", display: "block", margin: "0 auto 4px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ ...headStyle, fontSize: 20, fontWeight: 800, margin: 0 }}>Chọn hồ sơ con</h1>
          <button type="button" onClick={onSignOut} style={linkBtn}>Đăng xuất</button>
        </div>
        {email && <p style={{ color: "var(--muted,#8b7c66)", fontSize: 13, margin: "2px 0 14px" }}>{email}</p>}

        {kids.length > 0 && (
          <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
            {kids.map((k) => (
              <button key={k.id} type="button" onClick={() => onPick(k)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14,
                  border: "1px solid var(--line,#e8dcc6)", background: "var(--panel,#fdf8ee)", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 30 }}>{k.avatar}</span>
                <span>
                  <b style={{ display: "block", fontSize: 16 }}>{k.ingame_name}</b>
                  <span style={{ color: "var(--muted,#8b7c66)", fontSize: 13 }}>{k.age} tuổi</span>
                </span>
                <span style={{ marginLeft: "auto", fontWeight: 700, color: "var(--teal-ink,#0b6a64)" }}>Chơi →</span>
              </button>
            ))}
          </div>
        )}

        {adding ? (
          <form onSubmit={add} style={{ borderTop: kids.length ? "1px solid var(--line,#e8dcc6)" : "none", paddingTop: kids.length ? 14 : 0 }}>
            <label style={label}>Tên in-game của con
              <input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Vd: Bống, SuperTom…" required />
            </label>
            <label style={label}>Chọn avatar</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
              {AVATARS.map((a) => (
                <button key={a} type="button" onClick={() => setAvatar(a)}
                  style={{ fontSize: 24, width: 44, height: 44, borderRadius: 12, cursor: "pointer",
                    border: a === avatar ? "2px solid var(--teal,#0f8f88)" : "1px solid var(--line,#e8dcc6)",
                    background: a === avatar ? "color-mix(in srgb, var(--teal,#0f8f88) 12%, transparent)" : "var(--panel,#fdf8ee)" }}>
                  {a}
                </button>
              ))}
            </div>
            <label style={label}>Tuổi
              <input style={input} type="number" min={4} max={15} value={age} onChange={(e) => setAge(Number(e.target.value) || 10)} />
            </label>
            {offerMigrate && (
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 14 }}>
                <input type="checkbox" checked={migrate} onChange={(e) => setMigrate(e.target.checked)} />
                Chuyển tiến độ đang có trên máy này sang hồ sơ bé
              </label>
            )}
            {err && <p style={{ color: "var(--coral,#e2593f)", fontSize: 14, marginTop: 12 }}>{err}</p>}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button className="btn" type="submit" disabled={busy} style={{ flex: 1 }}>
                {busy ? "Đang tạo…" : "Tạo & chơi"}
              </button>
              {kids.length > 0 && <button type="button" onClick={() => setAdding(false)} style={linkBtn}>Huỷ</button>}
            </div>
          </form>
        ) : (
          <button type="button" className="btn" onClick={() => setAdding(true)} style={{ width: "100%" }}>+ Thêm hồ sơ con</button>
        )}
      </div>
    </div>
  );
}

const linkBtn: React.CSSProperties = {
  background: "none", border: "none", color: "var(--teal-ink,#0b6a64)", fontWeight: 700,
  cursor: "pointer", fontSize: 14, padding: 4,
};
