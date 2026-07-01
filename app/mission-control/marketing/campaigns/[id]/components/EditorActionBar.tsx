"use client";

import { Check, Clipboard, Sparkles } from "lucide-react";
import { useState } from "react";

type EditorActionBarProps = {
  saveLabel?: string;
  copyLabel?: string;
  rewriteLabel?: string;
  copyText?: string;
  isSaving?: boolean;
  onSave?: () => void;
  onRewrite?: () => void;
};

export default function EditorActionBar({
  saveLabel = "Save",
  copyLabel = "Copy",
  rewriteLabel = "Rewrite",
  copyText = "",
  isSaving = false,
  onSave,
  onRewrite,
}: EditorActionBarProps) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    if (!copyText.trim()) return;

    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Editor Actions
        </p>
        <p className="mt-1 text-sm font-bold text-slate-400">
          Save, copy, or improve this asset.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {isSaving ? "Saving..." : saveLabel}
          </button>
        )}

        <button
          type="button"
          onClick={copyToClipboard}
          disabled={!copyText.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 text-sm font-black text-slate-300 hover:border-blue-500 hover:text-white disabled:cursor-not-allowed disabled:text-slate-600"
        >
          {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
          {copied ? "Copied" : copyLabel}
        </button>

        {onRewrite && (
          <button
            type="button"
            onClick={onRewrite}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-500/30 bg-violet-500/10 px-5 py-3 text-sm font-black text-violet-300 hover:bg-violet-500/20"
          >
            <Sparkles className="h-4 w-4" />
            {rewriteLabel}
          </button>
        )}
      </div>
    </div>
  );
}
