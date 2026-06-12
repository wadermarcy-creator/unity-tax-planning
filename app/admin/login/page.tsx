"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("wadermarcy@gmail.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      setMessage("Login failed. Check your email and password.");
      setIsSubmitting(false);
      return;
    }

    router.push("/admin/leads");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <section className="mx-auto max-w-md">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-300">
          Unity Tax Planning Admin
        </p>

        <h1 className="mb-6 text-4xl font-bold tracking-tight">Admin Login</h1>

        <form onSubmit={handleLogin} className="rounded-2xl bg-white p-8 text-slate-950">
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Enter your admin password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-blue-500 px-6 py-4 font-semibold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>

          {message && (
            <p className="mt-4 rounded-xl bg-red-100 p-4 text-sm font-semibold text-red-700">
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}