"use client";

import { useState } from "react";

export default function GatePage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("رقم سري غير صحيح، حاول مرة أخرى.");
        setLoading(false);
        return;
      }
      const params = new URLSearchParams(window.location.search);
      const from = params.get("from") || "/";
      window.location.href = from.startsWith("/") ? from : "/";
    } catch {
      setError("حدث خطأ، حاول مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(900px 500px at 100% -10%, rgba(37,99,235,.45), transparent 60%), radial-gradient(700px 420px at -10% 110%, rgba(14,165,216,.35), transparent 55%), linear-gradient(160deg,#0B1E4A,#0F2057)",
      fontFamily: "'Noto Sans Arabic', Tahoma, sans-serif", padding: 20,
    }}>
      <div style={{
        width: "100%", maxWidth: 380, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 24, padding: 32, textAlign: "center", backdropFilter: "blur(8px)",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/wuduh-assets/logo-full.png" alt="وضوح" style={{ height: 56, objectFit: "contain", marginBottom: 18 }} />
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>وضوح</h1>
        <p style={{ color: "#9FB3DE", fontSize: 14, margin: "0 0 22px" }}>
          المنصة قيد التجهيز للإطلاق — الدخول بالرقم السري فقط.
        </p>
        <form onSubmit={submit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="الرقم السري"
            autoFocus
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 14, border: "1px solid rgba(255,255,255,.2)",
              background: "rgba(255,255,255,.1)", color: "#fff", fontSize: 15, textAlign: "center",
              outline: "none", marginBottom: 12, fontFamily: "inherit",
            }}
          />
          {error && <p style={{ color: "#FCA5A5", fontSize: 13, margin: "0 0 12px" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "12px", borderRadius: 14, border: "none", cursor: "pointer",
              background: loading ? "#3B5BA5" : "#2563EB", color: "#fff", fontSize: 15, fontWeight: 800,
              fontFamily: "inherit",
            }}
          >
            {loading ? "جارٍ التحقق…" : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
