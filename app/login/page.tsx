"use client";

import Image from "next/image";
import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Wrong password. Try again.");
        setBusy(false);
        return;
      }
      router.replace(next.startsWith("/") ? next : "/");
      router.refresh();
    } catch {
      setError("Could not reach the studio. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/logo.jpg"
            alt="Grafi Creative Design"
            width={64}
            height={64}
            className="rounded-full border border-ink/10 object-cover"
          />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Grafi Creative Ops
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
            Studio login
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            Enter the studio password to open orders, quotes, and customers.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>
          {error ? (
            <p className="text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={busy}
          >
            {busy ? "Checking…" : "Enter studio"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-ink/50">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
