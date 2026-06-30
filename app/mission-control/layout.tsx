"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/mission-control/Sidebar";
import { supabase } from "@/lib/supabase";

export default function MissionControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const isLoginPage = pathname === "/mission-control/login";

  useEffect(() => {
    async function checkAuth() {
      if (isLoginPage) {
        setIsCheckingAuth(false);
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/mission-control/login");
        return;
      }

      setIsCheckingAuth(false);
    }

    checkAuth();
  }, [isLoginPage, router]);

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-slate-500">
          Checking Access...
        </p>
      </main>
    );
  }

  if (isLoginPage) {
    return children;
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="min-h-screen flex-1 overflow-x-hidden">
          {children}
        </section>
      </div>
    </main>
  );
}