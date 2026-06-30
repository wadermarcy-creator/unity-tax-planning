"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function MissionControlLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function signIn() {
    setMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/mission-control/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-950 p-8 shadow-2xl shadow-black/30">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-300">
          Unity
        </p>

        <h1 className="mt-4 text-4xl font-black">Mission Control</h1>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          Sign in to access the Unity Tax marketing and assessment dashboard.
        </p>

        <div className="mt-8 space-y-4">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            type="email"
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />

          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            type="password"
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 font-bold text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />

          {message && (
            <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-300">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={signIn}
            disabled={isLoading}
            className="w-full rounded-2xl bg-blue-600 px-6 py-5 text-base font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </section>
    </main>
  );
}