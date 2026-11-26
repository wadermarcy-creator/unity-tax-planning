"use client";

import { useState } from "react";
import Header from "@/components/mission-control/Header";

const fields = [
  ["title", "Article title"], ["slug", "URL slug"], ["description", "SEO meta description"],
  ["taxYear", "Tax year"], ["author", "Author / reviewer"], ["scenario", "Fictional scenario and assumptions"],
  ["analysis", "Hazel-derived analysis and strategies"], ["impact", "Estimated impact and limitations"],
  ["sources", "Official sources and links"], ["cta", "Next steps for readers"]
] as const;
type Field = typeof fields[number][0];
const initial = Object.fromEntries(fields.map(([key]) => [key, ""])) as Record<Field,string>;

export default function InsightsPublisher() {
  const [draft, setDraft] = useState(initial);
  const [reviewed, setReviewed] = useState(false);
  const [preview, setPreview] = useState(false);
  const [importError, setImportError] = useState("");
  async function importDraft(file: File) {
    try {
      if (file.size > 2_000_000) throw new Error("Draft exceeds 2 MB.");
      const data = JSON.parse(await file.text());
      if (!data || typeof data !== "object" || !fields.every(([key]) => typeof data[key] === "string")) throw new Error("Invalid Unity draft format.");
      setDraft(Object.fromEntries(fields.map(([key]) => [key, data[key]])) as Record<Field,string>);
      setReviewed(false);
      setPreview(false);
      setImportError("");
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Unable to import draft.");
    }
  }
  function saveWorkingDraft() {
    const blob = new Blob([JSON.stringify({...draft, status: "draft"}, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "unity-working-draft.json"; a.click(); URL.revokeObjectURL(url);
  }
  const ready = fields.every(([key]) => draft[key].trim()) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug) && reviewed;
  function exportDraft() {
    const blob = new Blob([JSON.stringify({...draft, status: "review-ready", exportedAt: new Date().toISOString()}, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = draft.slug + ".json"; a.click(); URL.revokeObjectURL(url);
  }
  return <>
    <Header title="Insights Publisher" subtitle="Prepare hypothetical tax strategy articles for editorial review." />
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
      <div className="rounded-2xl border border-[#d6bc87]/30 bg-[#162d46] p-5">
        <h2 className="font-serif text-2xl text-[#d6bc87]">Hazel to Unity Journal</h2>
        <p className="mt-2 text-sm text-slate-200">Use fictional scenarios only. Do not paste client names, identifiers or confidential tax records. Drafts stay in this tab until exported; this workspace does not publish or save to a server.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={saveWorkingDraft} className="rounded-lg border border-[#d6bc87] px-4 py-2 text-[#d6bc87]">Save working draft</button>
        <label className="cursor-pointer rounded-lg border border-[#d6bc87] px-4 py-2 text-[#d6bc87]">Import draft<input type="file" accept=".json,application/json" className="block max-w-full text-xs" onChange={e=>{const file=e.target.files?.[0]; if(file) void importDraft(file); e.target.value="";}} /></label>
        {importError && <p role="alert" className="w-full text-sm text-red-300">{importError}</p>}
        <button type="button" onClick={()=>setPreview(false)} className="rounded-lg border border-[#d6bc87] px-4 py-2 text-[#d6bc87]">Edit draft</button>
        <button type="button" onClick={()=>setPreview(true)} className="rounded-lg bg-[#d6bc87] px-4 py-2 font-semibold text-[#10243b]">Preview article</button>
      </div>
      {preview ? <article className="rounded-2xl bg-[#f8f5ef] p-8 text-[#10243b]">
        <p className="text-sm uppercase tracking-widest">Unity Journal · Hypothetical · {draft.taxYear}</p>
        <h2 className="mt-4 font-serif text-4xl">{draft.title || "Untitled article"}</h2>
        <p className="mt-3">{draft.description}</p><p className="mt-2 text-sm">{draft.author}</p>
        {fields.slice(5).map(([key,label])=><section key={key} className="mt-6"><h3 className="font-serif text-2xl">{label}</h3><p className="mt-2 whitespace-pre-wrap">{draft[key]}</p></section>)}
        <p className="mt-8 border-t border-[#10243b]/20 pt-4 text-sm">Illustrative only. Actual tax outcomes depend on individual circumstances and applicable law. Not individualized tax, legal or investment advice.</p>
      </article> : <div className="grid gap-5 rounded-2xl border border-white/10 bg-[#162d46] p-6 md:grid-cols-2">
        {fields.map(([key,label],i)=><label key={key} className={i>=5?"md:col-span-2":"block"}>
          <span className="mb-2 block text-sm font-semibold text-[#d6bc87]">{label}</span>
          <textarea rows={i>=5?5:2} value={draft[key]} onChange={e=>{setDraft(prev=>({...prev,[key]:e.target.value}));setReviewed(false);}} className="w-full rounded-lg border border-white/20 bg-[#10243b] p-3 text-white" />
          {key==="description"&&<span className="text-xs text-slate-300">{draft.description.length} characters · aim for 150–160</span>}
        </label>)}
      </div>}
      <label className="flex items-start gap-3 rounded-xl border border-white/10 p-4"><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)} /><span className="text-sm">I have checked the assumptions, calculations, tax-year rules, sources, disclosures and absence of client information. This draft is ready for final publication approval.</span></label>
      <button type="button" disabled={!ready} onClick={exportDraft} className="rounded-lg bg-[#d6bc87] px-5 py-3 font-semibold text-[#10243b] disabled:opacity-40">Export review-ready draft</button>
      <p className="text-sm text-slate-300">Complete all fields, use a lowercase hyphenated slug and confirm review to enable export. Live publishing is not connected.</p>
    </div>
  </>;
}
