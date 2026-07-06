"use client";

import { useEffect, useMemo, useState, type SetStateAction } from "react";
import Header from "@/components/mission-control/Header";
import AiGenerator from "@/components/mission-control/landing-pages/AiGenerator";
import LandingEditor from "@/components/mission-control/landing-pages/LandingEditor";
import LandingLibrary from "@/components/mission-control/landing-pages/LandingLibrary";
import {
  emptyAiLandingPageForm,
  emptyLandingPageForm,
  type AiLandingPageFormState,
  type LandingPageFormState,
  type LandingPageRecord,
} from "@/components/mission-control/landing-pages/types";
import { supabase } from "@/lib/supabase";
import {
  ArrowRight,
  CheckCircle2,
  Clipboard,
  Download,
  Eye,
  FileText,
  Globe2,
  Loader2,
  MousePointerClick,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

type LandingPageRow = LandingPageRecord & Record<string, unknown>;

type ToastKind = "success" | "warning" | "error" | "info";

type ToastState = {
  message: string;
  kind: ToastKind;
};

const ESTIMATED_ANNUAL_REVENUE_PER_ACTIVE_PAGE = 24000;

function getString(page: LandingPageRecord, key: string) {
  const value = (page as LandingPageRow)[key];
  return typeof value === "string" ? value : "";
}

function getBoolean(page: LandingPageRecord, key: string) {
  const value = (page as LandingPageRow)[key];
  return typeof value === "boolean" ? value : false;
}

function getArrayLength(page: LandingPageRecord, key: string) {
  const value = (page as LandingPageRow)[key];
  return Array.isArray(value) ? value.length : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function escapeCsvValue(value: unknown) {
  if (value === null || value === undefined) return "";

  if (Array.isArray(value)) {
    return `"${value.join(" | ").replaceAll('"', '""')}"`;
  }

  if (typeof value === "object") {
    return `"${JSON.stringify(value).replaceAll('"', '""')}"`;
  }

  const stringValue = String(value);
  const shouldQuote = /[",\n]/.test(stringValue);
  const escaped = stringValue.replaceAll('"', '""');

  return shouldQuote ? `"${escaped}"` : escaped;
}

function downloadCsv(filename: string, rows: Array<Record<string, unknown>>) {
  if (!rows.length) return false;

  const headers = Array.from(
    rows.reduce<Set<string>>((keys, row) => {
      Object.keys(row).forEach((key) => keys.add(key));
      return keys;
    }, new Set<string>()),
  );

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvValue(row[header])).join(","),
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}

export default function LandingPagesCMSPage() {
  const [pages, setPages] = useState<LandingPageRecord[]>([]);
  const [form, setForm] =
    useState<LandingPageFormState>(emptyLandingPageForm);
  const [aiForm, setAiForm] =
    useState<AiLandingPageFormState>(emptyAiLandingPageForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);

  const activePages = useMemo(
    () => pages.filter((page) => getBoolean(page, "is_active")),
    [pages],
  );

  const inactivePages = useMemo(
    () => pages.filter((page) => !getBoolean(page, "is_active")),
    [pages],
  );

  const mostRecentActivePage = activePages[0] ?? pages[0] ?? null;

  const projectedAnnualRevenue =
    activePages.length * ESTIMATED_ANNUAL_REVENUE_PER_ACTIVE_PAGE;

  const priorityScore = useMemo(() => {
    if (!pages.length) return 72;

    const activeRate = Math.round((activePages.length / pages.length) * 100);
    const contentDepth = Math.min(
      20,
      Math.round(
        pages.reduce(
          (total, page) =>
            total +
            getArrayLength(page, "pain_points") +
            getArrayLength(page, "opportunities") +
            getArrayLength(page, "proof_points"),
          0,
        ) / Math.max(pages.length, 1),
      ),
    );

    return Math.min(98, Math.max(70, activeRate + contentDepth));
  }, [activePages.length, pages]);

  const aiRecommendation = useMemo(() => {
    if (isLoading) {
      return "Loading landing page inventory and checking launch readiness.";
    }

    if (!pages.length) {
      return "Create the first focused landing page from the AI generator, publish it, and send traffic into the Unity Tax Opportunity Assessment™.";
    }

    if (!activePages.length) {
      return "You have landing page drafts, but no active pages. Publish the strongest page first so ad traffic has a live destination.";
    }

    if (inactivePages.length > activePages.length) {
      return "Several landing pages are still inactive. Review drafts, activate the best pages, and keep weaker pages unpublished until their message is tighter.";
    }

    return "Your landing page system is launch-ready. Keep active pages focused by audience, copy the live URLs into campaigns, and export the inventory weekly for tracking.";
  }, [activePages.length, inactivePages.length, isLoading, pages.length]);

  async function loadPages() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("marketing_landing_pages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPages(data as LandingPageRecord[]);
    }

    if (error) {
      console.error(error);
      notify("Landing pages could not be loaded.", "error");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    loadPages();
  }, []);

  function notify(nextMessage: string, kind: ToastKind = "success") {
    setToast({ message: nextMessage, kind });
    window.setTimeout(() => setToast(null), 3200);
  }

  async function copyText(value: string, successMessage: string) {
    if (!value) {
      notify("Nothing to copy yet.", "warning");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      notify(successMessage, "success");
    } catch (error) {
      console.error(error);
      notify("Copy failed. You can still copy it manually.", "error");
    }
  }

  function getLiveUrl(page: LandingPageRecord) {
    const slug = getString(page, "slug");
    return slug ? `/landing/${slug}` : "";
  }

  function handlePreviewActivePage(page: LandingPageRecord | null) {
    if (!page) {
      notify("Create or select a landing page first.", "warning");
      return;
    }

    const isActive = getBoolean(page, "is_active");
    const liveUrl = getLiveUrl(page);

    if (!liveUrl) {
      notify("This landing page does not have a slug yet.", "warning");
      return;
    }

    if (!isActive) {
      notify("This page is not active yet. Publish or activate it before previewing the public URL.", "warning");
      return;
    }

    window.open(liveUrl, "_blank", "noopener,noreferrer");
  }

  function buildExportRows(selectedPages: LandingPageRecord[]) {
    return selectedPages.map((page) => {
      const slug = getString(page, "slug");

      return {
        status: getBoolean(page, "is_active") ? "active" : "inactive",
        slug,
        live_url: slug ? `/landing/${slug}` : "",
        audience: getString(page, "audience"),
        eyebrow: getString(page, "eyebrow"),
        headline: getString(page, "headline"),
        subheadline: getString(page, "subheadline"),
        primary_cta: getString(page, "primary_cta"),
        pain_points_count: getArrayLength(page, "pain_points"),
        opportunities_count: getArrayLength(page, "opportunities"),
        proof_points_count: getArrayLength(page, "proof_points"),
        created_at: getString(page, "created_at"),
        updated_at: getString(page, "updated_at"),
      };
    });
  }

  function handleExport(selectedPages: LandingPageRecord[], filename: string) {
    const exported = downloadCsv(filename, buildExportRows(selectedPages));

    if (!exported) {
      notify("There is no landing page data to export yet.", "warning");
      return;
    }

    notify("Landing page export downloaded.", "success");
  }

  function handleCopyExecutiveSummary() {
    const summary = [
      "Unity Tax Landing Page CMS",
      `AI Executive Recommendation: ${aiRecommendation}`,
      `Priority Score: ${priorityScore}/100`,
      `Projected Annual Revenue: ${formatCurrency(projectedAnnualRevenue)}`,
      `Total Pages: ${pages.length}`,
      `Active Pages: ${activePages.length}`,
      `Inactive Pages: ${inactivePages.length}`,
      mostRecentActivePage
        ? `Featured Page: ${getString(mostRecentActivePage, "headline") || getString(mostRecentActivePage, "slug")}`
        : "Featured Page: None yet",
    ].join("\n");

    copyText(summary, "Executive summary copied.");
  }

  function setMessageWithToast(value: SetStateAction<string>) {
    if (typeof value === "function") {
      setMessage((previousMessage) => {
        const nextMessage = value(previousMessage);

        if (nextMessage) {
          window.setTimeout(() => notify(nextMessage, "info"), 0);
        }

        return nextMessage;
      });
      return;
    }

    setMessage(value);

    if (value) {
      notify(value, "info");
    }
  }

  const toastClasses = {
    success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
    warning: "border-amber-400/30 bg-amber-500/10 text-amber-100",
    error: "border-red-400/30 bg-red-500/10 text-red-100",
    info: "border-blue-400/30 bg-blue-500/10 text-blue-100",
  } satisfies Record<ToastKind, string>;

  return (
    <div className="min-h-screen">
      <Header
        title="Landing Page CMS"
        subtitle="Create, manage, and test ad-specific landing pages."
      />

      {toast && (
        <div className="fixed right-4 top-4 z-50 max-w-sm animate-pulse rounded-2xl border border-slate-700 bg-slate-950 p-4 shadow-2xl shadow-black/40 lg:right-8">
          <p className={`text-sm font-black ${toastClasses[toast.kind]}`}>
            {toast.message}
          </p>
        </div>
      )}

      <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <section className="mb-6 overflow-hidden rounded-[2rem] border border-blue-500/30 bg-slate-950 shadow-2xl shadow-blue-950/20">
          <div className="grid gap-6 p-5 sm:p-7 xl:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-blue-200">
                <Sparkles className="h-4 w-4" />
                Marketing Engine
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                Build landing pages without touching code.
              </h1>

              <p className="mt-4 max-w-4xl text-base font-medium leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Generate targeted landing pages for Google Ads, Meta Ads, SEO,
                local campaigns, and niche audiences. Review the AI draft,
                publish it, and send traffic directly into the Unity Tax
                Opportunity Assessment™.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={handleCopyExecutiveSummary}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
                >
                  <Clipboard className="h-4 w-4" />
                  Copy Executive Summary
                </button>

                <button
                  type="button"
                  onClick={() => handleExport(pages, "unity-tax-landing-pages.csv")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  <Download className="h-4 w-4" />
                  Export All Pages
                </button>

                <button
                  type="button"
                  onClick={loadPages}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh
                </button>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-300">
                    AI Executive Recommendation
                  </p>
                  <p className="mt-3 text-sm font-bold leading-6 text-slate-300">
                    {aiRecommendation}
                  </p>
                </div>
                <div className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-3 text-blue-200">
                  <Target className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Priority Score
                  </p>
                  <p className="mt-2 text-3xl font-black text-white">
                    {priorityScore}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500">/100</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Active Pages
                  </p>
                  <p className="mt-2 text-3xl font-black text-white">
                    {activePages.length}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {inactivePages.length} inactive
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-5 shadow-xl shadow-black/10">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                Total Pages
              </p>
              <FileText className="h-5 w-5 text-slate-500" />
            </div>
            <p className="mt-3 text-4xl font-black text-white">{pages.length}</p>
            <p className="mt-2 text-sm font-bold text-slate-400">
              CMS records loaded.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-500/10 p-5 shadow-xl shadow-black/10">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">
                Published
              </p>
              <CheckCircle2 className="h-5 w-5 text-emerald-200" />
            </div>
            <p className="mt-3 text-4xl font-black text-white">
              {activePages.length}
            </p>
            <p className="mt-2 text-sm font-bold text-emerald-100/70">
              Live or ready for traffic.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-blue-400/20 bg-blue-500/10 p-5 shadow-xl shadow-black/10">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-200">
                Projected Annual Revenue
              </p>
              <TrendingUp className="h-5 w-5 text-blue-200" />
            </div>
            <p className="mt-3 text-3xl font-black text-white">
              {formatCurrency(projectedAnnualRevenue)}
            </p>
            <p className="mt-2 text-sm font-bold text-blue-100/70">
              Based on active pages.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-5 shadow-xl shadow-black/10">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                One-Click Actions
              </p>
              <MousePointerClick className="h-5 w-5 text-slate-500" />
            </div>
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={() =>
                  copyText(
                    mostRecentActivePage ? getLiveUrl(mostRecentActivePage) : "",
                    "Featured landing page URL copied.",
                  )
                }
                className="inline-flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Copy Featured URL
                <Clipboard className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handlePreviewActivePage(mostRecentActivePage)}
                className="inline-flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Preview Featured
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {mostRecentActivePage && (
          <section className="mb-8 rounded-[1.75rem] border border-slate-800 bg-slate-950 p-5 shadow-xl shadow-black/10 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
                    Featured Landing Page
                  </span>
                  <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    {getBoolean(mostRecentActivePage, "is_active")
                      ? "Active"
                      : "Draft"}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">
                  {getString(mostRecentActivePage, "headline") ||
                    getString(mostRecentActivePage, "slug") ||
                    "Untitled landing page"}
                </h2>

                <p className="mt-3 max-w-4xl text-sm font-bold leading-6 text-slate-400 sm:text-base sm:leading-7">
                  {getString(mostRecentActivePage, "subheadline") ||
                    "Review this page, confirm the message is audience-specific, and connect the live URL to the matching campaign."}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1">
                    {getString(mostRecentActivePage, "audience") ||
                      "Audience not set"}
                  </span>
                  <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1">
                    /landing/{getString(mostRecentActivePage, "slug") || "draft"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      getLiveUrl(mostRecentActivePage),
                      "Landing page URL copied.",
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-500"
                >
                  <Globe2 className="h-4 w-4" />
                  Copy URL
                </button>

                <button
                  type="button"
                  onClick={() => handlePreviewActivePage(mostRecentActivePage)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Preview Page
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        <AiGenerator
          aiForm={aiForm}
          setAiForm={setAiForm}
          setForm={setForm}
          setMessage={setMessageWithToast}
        />

        {message && (
          <p className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold text-slate-300">
            {message}
          </p>
        )}

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <LandingEditor
            form={form}
            setForm={setForm}
            setPages={setPages}
            setMessage={setMessageWithToast}
            isSaving={isSaving}
            setIsSaving={setIsSaving}
            loadPages={loadPages}
          />

          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    Landing Library Controls
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-400">
                    Export active pages or copy the page summary before making
                    campaign changes.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      handleExport(
                        activePages,
                        "unity-tax-active-landing-pages.csv",
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                  >
                    <Download className="h-4 w-4" />
                    Export Active
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleExport(
                        inactivePages,
                        "unity-tax-draft-landing-pages.csv",
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                  >
                    <Download className="h-4 w-4" />
                    Export Drafts
                  </button>
                </div>
              </div>
            </div>

            <LandingLibrary
              pages={pages}
              setPages={setPages}
              setForm={setForm}
              setMessage={setMessageWithToast}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
