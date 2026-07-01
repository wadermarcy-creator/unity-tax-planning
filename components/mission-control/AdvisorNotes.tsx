"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Note = {
  id: string;
  lead_id: string;
  note: string;
  created_at: string;
};

type AdvisorNotesProps = {
  leadId: string;
};

function formatNoteDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function AdvisorNotes({ leadId }: AdvisorNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadNotes() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("mission_control_notes")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage(error.message);
    } else {
      setNotes((data || []) as Note[]);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    loadNotes();
  }, [leadId]);

  async function addNote() {
    if (!noteText.trim()) return;

    setMessage("");
    setIsSaving(true);

    try {
      const { error } = await supabase.from("mission_control_notes").insert({
        lead_id: leadId,
        note: noteText.trim(),
      });

      if (error) {
        console.error(error);
        setMessage(error.message);
        setIsSaving(false);
        return;
      }

      setNoteText("");
      await loadNotes();
      setMessage("Note saved.");
    } catch (error) {
      console.error(error);
      setMessage("Unexpected error saving note.");
    }

    setIsSaving(false);
  }

  async function deleteNote(noteId: string) {
    setMessage("");

    const { error } = await supabase
      .from("mission_control_notes")
      .delete()
      .eq("id", noteId);

    if (error) {
      console.error(error);
      setMessage(error.message);
      return;
    }

    setNotes((current) => current.filter((note) => note.id !== noteId));
  }

  return (
    <article className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">
        Advisor Notes
      </p>

      <h2 className="mt-3 text-2xl font-black text-white">
        Prospect history and internal notes
      </h2>

      <div className="mt-6">
        <textarea
          value={noteText}
          onChange={(event) => setNoteText(event.target.value)}
          className="min-h-32 w-full resize-y rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm font-medium leading-7 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          placeholder="Add a note..."
        />

        <button
          type="button"
          onClick={addNote}
          disabled={isSaving || !noteText.trim()}
          className="mt-4 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {isSaving ? "Saving Note..." : "Add Note"}
        </button>

        {message && (
          <p className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300">
            {message}
          </p>
        )}
      </div>

      <div className="mt-7 space-y-4">
        {isLoading ? (
          <p className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm font-medium text-slate-400">
            Loading notes...
          </p>
        ) : notes.length === 0 ? (
          <p className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm font-medium text-slate-400">
            No notes yet. Add the first advisor note above.
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  {formatNoteDate(note.created_at)}
                </p>

                <button
                  type="button"
                  onClick={() => deleteNote(note.id)}
                  className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 transition hover:text-red-300"
                >
                  Delete
                </button>
              </div>

              <p className="whitespace-pre-wrap text-sm font-medium leading-7 text-slate-300">
                {note.note}
              </p>
            </div>
          ))
        )}
      </div>
    </article>
  );
}