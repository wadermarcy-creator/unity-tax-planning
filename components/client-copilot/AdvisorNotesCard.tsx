"use client";

import { FileEdit, Save, Sparkles } from "lucide-react";
import { useState } from "react";

type AdvisorNotesCardProps = {
  initialNotes?: string;
};

export default function AdvisorNotesCard({
  initialNotes = "",
}: AdvisorNotesCardProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    // Hook into Supabase later.
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex items-center gap-3">
        <FileEdit className="h-6 w-6 text-blue-300" />
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
            Advisor Notes
          </p>
          <h2 className="mt-1 text-2xl font-black text-white">
            Working Notes
          </h2>
        </div>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Capture meeting notes, observations, follow-up items, client goals, objections, family details, planning ideas..."
        rows={12}
        className="mt-6 w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 text-white outline-none focus:border-blue-500"
      />

      <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">
        <div className="flex gap-3">
          <Sparkles className="mt-1 h-5 w-5 text-violet-300" />
          <div>
            <p className="font-black text-white">Future AI Feature</p>
            <p className="mt-2 text-sm leading-6 text-violet-100/80">
              Copilot will organize your notes into CRM summaries, follow-up
              tasks, planning opportunities, and client action items
              automatically.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white hover:bg-blue-500"
      >
        <Save className="h-4 w-4" />
        {saved ? "Saved!" : "Save Notes"}
      </button>
    </section>
  );
}
