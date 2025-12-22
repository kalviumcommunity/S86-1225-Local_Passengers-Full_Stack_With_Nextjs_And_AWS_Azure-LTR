"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data?.token) {
        // Set cookie (simple approach)
        document.cookie = `token=${data.token}; path=/; max-age=${60 * 60}`;
        router.push("/routing-demo/dashboard");
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Login error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12, width: 320 }}>
        <h2>Login (demo)</h2>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <button type="submit" disabled={loading} style={{ padding: 8, background: "#0b5fff", color: "white" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
