"use client";

import Link from "next/link";
import type {
  LandingPageFormState,
  LandingPageRecord,
} from "@/components/mission-control/landing-pages/types";
import { recordToForm } from "@/components/mission-control/landing-pages/helpers";
import { supabase } from "@/lib/supabase";

type LandingLibraryProps = {
  pages: LandingPageRecord[];
  setPages: React.Dispatch<React.SetStateAction<LandingPageRecord[]>>;
  setForm: React.Dispatch<React.SetStateAction<LandingPageFormState>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
};

export default function LandingLibrary({
  pages,
  setPages,
  setForm,
  setMessage,
  isLoading,
}: LandingLibraryProps) {
  async function toggleActive(page: LandingPageRecord) {
    const { error } = await supabase
      .from("marketing_landing_pages")
      .update({ is_active: !page.is_active })
      .eq("id", page.id);

    if (!error) {
      setPages((current) =>
        current.map((item) =>
          item.id === page.id ? { ...item, is_active: !page.is_active } : item,
        ),
      );
    }
  }

  async function deletePage(id: string) {
    const confirmed = window.confirm(
      "Delete this landing page from the CMS? This cannot be undone.",
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("marketing_landing_pages")
      .delete()
      .eq("id", id);

    if (!error) {
      setPages((current) => current.filter((item) => item.id !== id));
    }
  }

  function duplicatePage(page: LandingPageRecord) {
    setForm({
      ...recordToForm(page),
      slug: `${page.slug}-copy`,
    });

    setMessage("Page copied into the editor. Update the slug before saving.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            Landing Pages
          </p>

          <h2 className="mt-3 text-2xl font-black text-white">
            Campaign Library
          </h2>
        </div>

        <p className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-black text-slate-300">
          {pages.length} pages
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-400">
          Loading landing pages...
        </div>
      ) : pages.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-400">
          No CMS landing pages yet. Create your first one on the left.
        </div>
      ) : (
        <div className="space-y-4">
          {pages.map((page) => (
            <article
              key={page.id}
              className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-black text-white">
                      {page.headline}
                    </h3>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${
                        page.is_active
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : "border-slate-700 bg-slate-950 text-slate-400"
                      }`}
                    >
                      {page.is_active ? "Active" : "Paused"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-bold text-blue-300">
                    /landing/{page.slug}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-slate-400">
                    {page.subheadline}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-3">
                  <Link
                    href={`/landing/${page.slug}`}
                    className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500"
                  >
                    View
                  </Link>

                  <button
                    type="button"
                    onClick={() => duplicatePage(page)}
                    className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-black text-slate-300 hover:border-blue-500 hover:text-white"
                  >
                    Duplicate
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleActive(page)}
                    className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-black text-slate-300 hover:border-blue-500 hover:text-white"
                  >
                    {page.is_active ? "Pause" : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => deletePage(page.id)}
                    className="rounded-2xl border border-red-500/30 px-5 py-3 text-sm font-black text-red-300 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}