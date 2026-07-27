"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiLogIn, FiUser } from "react-icons/fi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/bootstrap", { method: "POST" }).catch(() => {});
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),transparent_30%)]" />
      <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0A0A0A]/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10">
            <FiLock className="text-orange-500" size={26} />
          </div>
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Sign in to access the admin dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">
              Login ID
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#050505] px-4 py-3 focus-within:border-orange-500/50">
              <FiUser className="text-neutral-500" />
              <input
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full bg-transparent outline-none"
                placeholder="admin"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">
              Password
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#050505] px-4 py-3 focus-within:border-orange-500/50">
              <FiLock className="text-neutral-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none"
                placeholder="you password"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-3 font-semibold text-white transition hover:from-orange-500 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiLogIn />
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {message ? (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </main>
  );
}
