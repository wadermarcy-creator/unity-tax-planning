"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/mission-control/Header";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  CheckCircle2,
  Clipboard,
  Download,
  FileText,
  Mail,
  Phone,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserMinus,
  Users,
  XCircle,
} from "lucide-react";

type Lead = {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  household_income: string | null;
  investable_assets: string | null;
  lead_score: number | null;
  lead_grade: string | null;
  status: string | null;
  biggest_tax_concern: string | null;
};

type Toast = {
  type: "success" | "error";
  message: string;
};

function getFullName(lead: Lead) {
  return `${lead.first_name || ""} ${lead.last_name || ""}`.trim() || "Unnamed Client";
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function estimateAnnualRevenue(lead: Lead) {
  const score = lead.lead_score ?? 0;
  const assets = (lead.investable_assets || "").toLowerCase();
  const income = (lead.household_income || "").toLowerCase();

  let estimate = 1200;

  if (score >= 130) estimate = 12000;
  else if (score >= 100) estimate = 7500;
  else if (score >= 70) estimate = 4500;
  else if (score >= 40) estimate = 2500;

  if (assets.includes("5m") || assets.includes("$5") || assets.includes("million")) {
    estimate += 5000;
  } else if (assets.includes("1m") || assets.includes("$1")) {
    estimate += 2500;
  }

  if (income.includes("500") || income.includes("750") || income.includes("1m")) {
    estimate += 2500;
  }

  return estimate;
}

function getPriorityLabel(score: number | null) {
  const value = score ?? 0;

  if (value >= 130) return "Exceptional";
  if (value >= 100) return "High";
  if (value >= 70) return "Moderate";
  if (value >= 40) return "Developing";
  return "Nurture";
}

function getPriorityTone(score: number | null) {
  const value = score ?? 0;

  if (value >= 130) return "border-violet-500/40 bg-violet-500/10 text-violet-300";
  if (value >= 100) return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
  if (value >= 70) return "border-blue-500/40 bg-blue-500/10 text-blue-300";
  if (value >= 40) return "border-orange-500/40 bg-orange-500/10 text-orange-300";
  return "border-slate-700 bg-slate-900 text-slate-300";
}

function getReturnStatus(lead: Lead) {
  return (lead.lead_score ?? 0) >= 100 ? "qualified" : "new";
}

function getClientBrief(lead: Lead) {
  return [
    `Client: ${getFullName(lead)}`,
    `Email: ${lead.email || "Not provided"}`,
    `Phone: ${lead.phone || "Not provided"}`,
    `Priority Score: ${lead.lead_score ?? 0}`,
    `Priority: ${getPriorityLabel(lead.lead_score)}`,
    `Projected Annual Revenue: ${formatMoney(estimateAnnualRevenue(lead))}`,
    `Household Income: ${lead.household_income || "Not provided"}`,
    `Investable Assets: ${lead.investable_assets || "Not provided"}`,
    `Original Tax Concern: ${lead.biggest_tax_concern || "Not provided"}`,
  ].join("\n");
}

function getExecutiveRecommendation(clients: Lead[], topClient: Lead | null) {
  if (clients.length === 0) {
    return "No prospects have been moved to Clients yet. Convert engaged prospects from the Prospects page once they become active relationships.";
  }

  if (!topClient) {
    return "Use the client list as the launch CRM for active Unity Tax relationships and keep each client tied back to their original assessment.";
  }

  return `${getFullName(topClient)} is the highest-priority client record. Use the original assessment details to guide the first planning deliverable and next advisory touchpoint.`;
}

function csvEscape(value: string | number | null | undefined) {
  const safeValue = String(value ?? "").replace(/"/g, '""');
  return `"${safeValue}"`;
}

function downloadCsv(filename: string, rows: Lead[]) {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Priority Score",
    "Priority Label",
    "Projected Annual Revenue",
    "Household Income",
    "Investable Assets",
    "Original Tax Concern",
    "Created At",
  ];

  const csvRows = rows.map((lead) => [
    getFullName(lead),
    lead.email || "",
    lead.phone || "",
    lead.lead_score ?? 0,
    getPriorityLabel(lead.lead_score),
    estimateAnnualRevenue(lead),
    lead.household_income || "",
    lead.investable_assets || "",
    lead.biggest_tax_concern || "",
    lead.created_at,
  ]);

  const csv = [headers, ...csvRows]
    .map((row) => row.map((value) => csvEscape(value)).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ClientsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  }

  async function loadLeads() {
    const { data, error } = await supabase
      .from("tax_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(250);

    if (error) {
      console.error(error);
      showToast("Clients could not be loaded.", "error");
    } else if (data) {
      setLeads(data as Lead[]);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }

  useEffect(() => {
    loadLeads();
  }, []);

  const clients = useMemo(() => {
    return leads.filter((lead) => lead.status === "client");
  }, [leads]);

  const filteredClients = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return clients;

    return clients.filter((lead) => {
      const haystack = [
        getFullName(lead),
        lead.email,
        lead.phone,
        lead.household_income,
        lead.investable_assets,
        lead.biggest_tax_concern,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [clients, searchTerm]);

  const topClient = useMemo(() => {
    return [...clients].sort((a, b) => (b.lead_score ?? 0) - (a.lead_score ?? 0))[0] || null;
  }, [clients]);

  const totalProjectedRevenue = useMemo(() => {
    return clients.reduce((total, lead) => total + estimateAnnualRevenue(lead), 0);
  }, [clients]);

  const averageScore = useMemo(() => {
    if (clients.length === 0) return 0;
    const totalScore = clients.reduce((total, lead) => total + (lead.lead_score ?? 0), 0);
    return Math.round(totalScore / clients.length);
  }, [clients]);

  const highValueCount = useMemo(() => {
    return clients.filter((lead) => (lead.lead_score ?? 0) >= 100).length;
  }, [clients]);

  async function refreshClients() {
    setIsRefreshing(true);
    await loadLeads();
    showToast("Client list refreshed.");
  }

  async function copyText(text: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMessage);
    } catch (error) {
      console.error(error);
      showToast("Copy failed. Try again from your browser.", "error");
    }
  }

  async function moveBackToProspect(lead: Lead) {
    setMovingId(lead.id);

    const { error } = await supabase
      .from("tax_leads")
      .update({ status: getReturnStatus(lead) })
      .eq("id", lead.id);

    if (error) {
      console.error(error);
      showToast("Client could not be moved back to Prospects.", "error");
      setMovingId(null);
      return;
    }

    setLeads((currentLeads) =>
      currentLeads.map((currentLead) =>
        currentLead.id === lead.id
          ? { ...currentLead, status: getReturnStatus(lead) }
          : currentLead,
      ),
    );

    setMovingId(null);
    showToast(`${getFullName(lead)} moved back to Prospects.`);
  }

  const executiveBrief = [
    "Unity Tax Client CRM Brief",
    `Active Clients: ${clients.length}`,
    `High-Priority Clients: ${highValueCount}`,
    `Average Priority Score: ${averageScore}`,
    `Projected Annual Revenue: ${formatMoney(totalProjectedRevenue)}`,
    `Top Client: ${topClient ? getFullName(topClient) : "None"}`,
    `Recommendation: ${getExecutiveRecommendation(clients, topClient)}`,
  ].join("\n");

  return (
    <div className="min-h-screen">
      <Header
        title="Clients"
        subtitle="Track active Unity Tax relationships promoted from prospect assessments."
      />

      <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        {toast && (
          <div
            className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-2xl border p-4 text-sm font-bold shadow-2xl shadow-black/30 ${
              toast.type === "success"
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-100"
                : "border-rose-500/40 bg-rose-500/15 text-rose-100"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="mb-6 overflow-hidden rounded-[2rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-slate-950 to-slate-950 p-5 shadow-2xl shadow-emerald-950/20 sm:p-7">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-200">
                <Sparkles className="h-4 w-4" />
                AI Executive Recommendation
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Keep active relationships separate from prospects.
              </h1>

              <p className="mt-4 max-w-4xl text-sm font-bold leading-7 text-slate-300 sm:text-base">
                {getExecutiveRecommendation(clients, topClient)}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => copyText(executiveBrief, "Client brief copied.")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-500"
                >
                  <Clipboard className="h-4 w-4" />
                  Copy Brief
                </button>

                <button
                  type="button"
                  onClick={() => downloadCsv("unity-tax-clients.csv", filteredClients)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-black text-slate-200 transition hover:border-emerald-500 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                  Export Clients
                </button>

                <button
                  type="button"
                  onClick={refreshClients}
                  disabled={isRefreshing}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-black text-slate-200 transition hover:border-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-700/70 bg-slate-950/70 p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  Clients
                </p>
                <p className="mt-3 text-3xl font-black text-white">{clients.length}</p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-700/70 bg-slate-950/70 p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  Priority Score
                </p>
                <p className="mt-3 text-3xl font-black text-white">{averageScore}</p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-700/70 bg-slate-950/70 p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  High Priority
                </p>
                <p className="mt-3 text-3xl font-black text-emerald-300">{highValueCount}</p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-700/70 bg-slate-950/70 p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  Projected Annual Revenue
                </p>
                <p className="mt-3 text-3xl font-black text-white">
                  {formatMoney(totalProjectedRevenue)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
              Client CRM
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">Assessment history stays attached</h2>
            <p className="mt-3 text-sm font-bold leading-6 text-slate-400">
              Each client record is still powered by the original tax assessment, so income, assets, tax concern, score, and contact details stay visible.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-500">
                  Current View
                </p>
                <p className="mt-2 text-xl font-black text-white">{filteredClients.length}</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-500">
                  Revenue
                </p>
                <p className="mt-2 text-xl font-black text-white">
                  {formatMoney(
                    filteredClients.reduce((total, lead) => total + estimateAnnualRevenue(lead), 0),
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-500">
                  Source
                </p>
                <p className="mt-2 text-xl font-black text-emerald-300">Assessments</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                  Search
                </p>
                <h2 className="mt-3 text-2xl font-black text-white">Find an active client</h2>
              </div>

              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search name, email, concern..."
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-11 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/mission-control/prospects"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-black text-slate-200 transition hover:border-emerald-500 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Prospects
              </Link>

              <Link
                href="/mission-control/revenue"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-black text-slate-200 transition hover:border-emerald-500 hover:text-white"
              >
                <TrendingUp className="h-4 w-4" />
                Revenue View
              </Link>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 text-sm font-bold text-slate-400">
            Loading clients...
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xl font-black text-white">No clients match this view.</p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-400">
                  Move a qualified prospect to Clients from the Prospects page to populate this CRM list.
                </p>
              </div>

              <Link
                href="/mission-control/prospects"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-500"
              >
                <Users className="h-4 w-4" />
                Open Prospects
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {filteredClients.map((lead) => {
              const name = getFullName(lead);
              const annualRevenue = estimateAnnualRevenue(lead);
              const mailHref = lead.email
                ? `mailto:${lead.email}?subject=${encodeURIComponent("Unity Tax Planning Client Follow-Up")}`
                : undefined;
              const phoneHref = lead.phone ? `tel:${lead.phone}` : undefined;

              return (
                <article
                  key={lead.id}
                  className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 transition hover:border-emerald-500/60 sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-black text-white">{name}</h2>
                        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                          Client
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${getPriorityTone(
                            lead.lead_score,
                          )}`}
                        >
                          {getPriorityLabel(lead.lead_score)}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-bold text-slate-400">
                        {lead.email || "No email"} · {lead.phone || "No phone"}
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-4">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                          <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-500">
                            Score
                          </p>
                          <p className="mt-2 text-lg font-black text-white">{lead.lead_score ?? 0}</p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                          <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-500">
                            Revenue
                          </p>
                          <p className="mt-2 text-lg font-black text-white">{formatMoney(annualRevenue)}</p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:col-span-2">
                          <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-500">
                            Original Assessment
                          </p>
                          <p className="mt-2 text-sm font-black text-white">{formatDate(lead.created_at)}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                          <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-500">
                            Household Income
                          </p>
                          <p className="mt-2 text-sm font-black text-white">{lead.household_income || "—"}</p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                          <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-500">
                            Investable Assets
                          </p>
                          <p className="mt-2 text-sm font-black text-white">{lead.investable_assets || "—"}</p>
                        </div>
                      </div>

                      <p className="mt-5 line-clamp-3 text-sm font-bold leading-6 text-slate-500">
                        {lead.biggest_tax_concern || "No tax concern summary provided."}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-3 lg:w-52">
                      <Link
                        href={`/mission-control/assessments/${lead.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
                      >
                        <FileText className="h-4 w-4" />
                        Assessment
                      </Link>

                      <button
                        type="button"
                        onClick={() => copyText(getClientBrief(lead), "Client summary copied.")}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-black text-slate-200 transition hover:border-emerald-500 hover:text-white"
                      >
                        <Clipboard className="h-4 w-4" />
                        Copy Summary
                      </button>

                      <button
                        type="button"
                        onClick={() => moveBackToProspect(lead)}
                        disabled={movingId === lead.id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-500/40 bg-orange-500/10 px-5 py-3 text-sm font-black text-orange-200 transition hover:bg-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <UserMinus className="h-4 w-4" />
                        {movingId === lead.id ? "Moving..." : "Back to Prospect"}
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <a
                          href={mailHref || undefined}
                          onClick={(event) => {
                            if (!mailHref) {
                              event.preventDefault();
                              showToast("No email on file.", "error");
                            }
                          }}
                          className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 p-3 text-slate-300 transition hover:border-emerald-500 hover:text-white"
                          aria-label={`Email ${name}`}
                        >
                          <Mail className="h-4 w-4" />
                        </a>

                        <a
                          href={phoneHref || undefined}
                          onClick={(event) => {
                            if (!phoneHref) {
                              event.preventDefault();
                              showToast("No phone on file.", "error");
                            }
                          }}
                          className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 p-3 text-slate-300 transition hover:border-emerald-500 hover:text-white"
                          aria-label={`Call ${name}`}
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <section className="mt-6 rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-black/20 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                Launch CRM Note
              </div>
              <p className="mt-4 max-w-4xl text-sm font-bold leading-6 text-slate-400">
                For launch, Clients are powered by the same `tax_leads` assessment records. Moving a prospect to Clients updates the record status to `client`, keeping the original assessment intact.
              </p>
            </div>

            <Link
              href="/mission-control/prospects"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-black text-slate-200 transition hover:border-emerald-500 hover:text-white"
            >
              <Users className="h-4 w-4" />
              View Prospects
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
