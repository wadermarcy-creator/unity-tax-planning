"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("wadermarcy@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    async function checkExistingSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (
        session?.user.email?.toLowerCase() === "wadermarcy@gmail.com"
      ) {
        router.replace("/admin/leads");
        return;
      }

      if (session) {
        await supabase.auth.signOut();
      }

      setIsCheckingSession(false);
    }

    checkExistingSession();
  }, [router]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== "wadermarcy@gmail.com") {
      setMessage("This email address is not authorized for admin access.");
      setIsSubmitting(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      console.error(error);
      setMessage("Login failed. Check your email and password.");
      setIsSubmitting(false);
      return;
    }

    if (
      data.user?.email?.toLowerCase() !== "wadermarcy@gmail.com"
    ) {
      await supabase.auth.signOut();
      setMessage("This account is not authorized for admin access.");
      setIsSubmitting(false);
      return;
    }

    router.replace("/admin/leads");
    router.refresh();
  }

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-400" />

          <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
            Checking Admin Session
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <section className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
        <div className="hidden lg:block">
          <Link href="/" className="mb-12 inline-flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 shadow-xl shadow-blue-950/40">
              <span className="text-2xl font-black">U</span>
            </div>

            <div className="leading-tight">
              <p className="text-2xl font-black tracking-tight">UNITY</p>

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-300">
                Tax Planning
              </p>
            </div>
          </Link>

          <p className="mb-5 text-sm font-black uppercase tracking-[0.26em] text-blue-300">
            Protected Administration
          </p>

          <h1 className="max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">
            Manage your tax planning pipeline securely.
          </h1>

          <p className="mt-7 max-w-2xl text-xl font-medium leading-9 text-slate-300">
            Review Tax Blind Spot submissions, manage lead qualification,
            monitor planning workflows, and keep internal follow-up notes
            organized.
          </p>

          <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-300">
                Protected Access
              </p>

              <p className="mt-3 font-medium leading-7 text-slate-300">
                Authentication and database policies restrict access to
                approved administrative users.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-300">
                Internal Use
              </p>

              <p className="mt-3 font-medium leading-7 text-slate-300">
                Lead details, workflow information, and administrative notes
                should remain confidential.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-lg">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 shadow-lg shadow-blue-950/40">
                <span className="text-xl font-black">U</span>
              </div>

              <div className="leading-tight">
                <p className="text-xl font-black tracking-tight">UNITY</p>

                <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-blue-300">
                  Tax Planning
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-black text-slate-200 transition hover:border-blue-400 hover:text-white"
            >
              Home
            </Link>
          </div>

          <form
            onSubmit={handleLogin}
            className="rounded-[2rem] border-2 border-slate-200 bg-white p-6 text-slate-950 shadow-2xl shadow-black/30 sm:p-9"
          >
            <div className="mb-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                🔒
              </div>

              <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-blue-600">
                Unity Tax Planning Admin
              </p>

              <h2 className="text-4xl font-black tracking-tight">
                Sign in to continue.
              </h2>

              <p className="mt-4 font-medium leading-7 text-slate-600">
                Enter your authorized administrative credentials to access the
                lead operations dashboard.
              </p>
            </div>

            <div className="mb-5">
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-black text-slate-800"
              >
                Email address
              </label>

              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Enter your admin email"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-black text-slate-800"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-4 pr-28 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Enter your admin password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-2 text-sm font-black text-blue-600 transition hover:bg-blue-50"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {message && (
              <div className="mb-6 rounded-2xl border border-red-300 bg-red-100 p-4 text-sm font-black leading-6 text-red-800">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-blue-600 px-6 py-5 text-base font-black text-white shadow-xl shadow-blue-200 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
            >
              {isSubmitting ? "Signing In..." : "Sign In to Admin Dashboard"}
            </button>

            <div className="mt-7 border-t border-slate-200 pt-6">
              <p className="text-center text-sm font-medium leading-6 text-slate-500">
                This administrative area is restricted to authorized Unity Tax
                Planning personnel.
              </p>
            </div>
          </form>

          <p className="mt-6 text-center text-sm font-medium text-slate-500">
            Do not share your password or leave this dashboard open on a public
            device.
          </p>
        </div>
      </section>
    </main>
  );
}