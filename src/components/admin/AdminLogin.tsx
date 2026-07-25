"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError((await res.json()).error || "Login failed");
    }
  }

  return (
    <form onSubmit={submit} className="glass" style={{ padding: 28, borderRadius: 0, display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          className="input"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
        />
      </div>
      {error ? <p style={{ color: "var(--crimson)", margin: 0 }}>{error}</p> : null}
      <button className="btn btn-gold" type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
