"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Database,
  Download,
  FileText,
  Megaphone,
  RefreshCw,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import Header from "@/components/mission-control/Header";
import { supabase } from "@/lib/supabase";

type ReportRow = Record<string, unknown>;

type DatasetKey = "campaigns" | "landingPages" | "leads" | "assessments";

type DatasetConfig = {
  key: DatasetKey;
  label: string;
  shortLabel: string;
  description: string;
  tableName: string;
  exportName: string;
  icon: typeof BarChart3;
};

type DatasetState = {
  rows: ReportRow[];
  isLoading: boolean;
  error: string;
};

type ToastState = {
  title: string;
  description: string;
} | null;


type ReportSegment = {
  label: string;
  value: number;
  stroke: string;
};

const REPORT_STROKES = ["#60a5fa", "#34d399", "#a78bfa", "#fbbf24", "#fb7185", "#94a3b8"];

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getPercent(value: number, total: number) {
  if (total <= 0) return 0;
  return clampPercent((value / total) * 100);
}

function compactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

const datasetConfigs: DatasetConfig[] = [
  {
    key: "campaigns",
    label: "Campaign Reports",
    shortLabel: "Campaigns",
    description: "Saved drafts, published campaigns, audiences, statuses, and landing-page slugs.",
    tableName: "marketing_campaigns",
    exportName: "unity-tax-campaigns.csv",
    icon: Megaphone,
  },
  {
    key: "landingPages",
    label: "Landing Page Reports",
    shortLabel: "Landing Pages",
    description: "Published landing pages, activation status, page copy, and audience positioning.",
    tableName: "marketing_landing_pages",
    exportName: "unity-tax-landing-pages.csv",
    icon: FileText,
  },
  {
    key: "leads",
    label: "Lead Reports",
    shortLabel: "Leads",
    description: "General website leads, if a separate leads table is active.",
    tableName: "leads",
    exportName: "unity-tax-leads.csv",
    icon: Users,
  },
  {
    key: "assessments",
    label: "Assessment Reports",
    shortLabel: "Assessments",
    description: "Tax Opportunity Assessment submissions from the live tax_leads table.",
    tableName: "tax_leads",
    exportName: "unity-tax-assessments.csv",
    icon: BarChart3,
  },
];

const emptyDatasetState: DatasetState = {
  rows: [],
  isLoading: true,
  error: "",
};

function createInitialDatasetState(): Record<DatasetKey, DatasetState> {
  return datasetConfigs.reduce(
    (acc, config) => {
      acc[config.key] = { ...emptyDatasetState };
      return acc;
    },
    {} as Record<DatasetKey, DatasetState>,
  );
}

function getStringValue(row: ReportRow, key: string) {
  const value = row[key];

  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function getRowDate(row: ReportRow) {
  const rawDate = getStringValue(row, "created_at") || getStringValue(row, "updated_at");
  if (!rawDate) return "—";

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return rawDate;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDisplayTitle(row: ReportRow, fallback: string) {
  return (
    getStringValue(row, "name") ||
    getStringValue(row, "headline") ||
    getStringValue(row, "title") ||
    getStringValue(row, "full_name") ||
    getStringValue(row, "first_name") ||
    getStringValue(row, "email") ||
    fallback
  );
}

function getDisplaySubtitle(row: ReportRow) {
  return (
    getStringValue(row, "audience") ||
    getStringValue(row, "location") ||
    getStringValue(row, "status") ||
    getStringValue(row, "slug") ||
    getStringValue(row, "phone") ||
    getStringValue(row, "created_at") ||
    "No additional detail"
  );
}

function normalizeCsvValue(value: unknown) {
  if (value === null || value === undefined) return "";

  let stringValue = "";

  if (typeof value === "object") {
    try {
      stringValue = JSON.stringify(value);
    } catch {
      stringValue = String(value);
    }
  } else {
    stringValue = String(value);
  }

  return `"${stringValue.replace(/"/g, '""')}"`;
}

function rowsToCsv(rows: ReportRow[]) {
  if (!rows.length) return "";

  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set<string>()),
  );

  const headerRow = headers.map(normalizeCsvValue).join(",");
  const bodyRows = rows.map((row) =>
    headers.map((header) => normalizeCsvValue(row[header])).join(","),
  );

  return [headerRow, ...bodyRows].join("\n");
}

function downloadCsv(filename: string, rows: ReportRow[]) {
  const csv = rowsToCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getExportTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

export default function ReportsPage() {
  const [datasets, setDatasets] =
    useState<Record<DatasetKey, DatasetState>>(createInitialDatasetState);
  const [activeDatasetKey, setActiveDatasetKey] = useState<DatasetKey>("campaigns");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<ToastState>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeConfig = datasetConfigs.find((config) => config.key === activeDatasetKey) ?? datasetConfigs[0];
  const activeDataset = datasets[activeConfig.key];

  const allRows = useMemo(
    () => datasetConfigs.flatMap((config) => datasets[config.key].rows),
    [datasets],
  );

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return activeDataset.rows;

    return activeDataset.rows.filter((row) =>
      Object.values(row).some((value) =>
        getStringValue({ value }, "value").toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [activeDataset.rows, searchTerm]);

  const totalCampaigns = datasets.campaigns.rows.length;
  const publishedCampaigns = datasets.campaigns.rows.filter(
    (row) => getStringValue(row, "status").toLowerCase() === "published",
  ).length;
  const draftCampaigns = Math.max(0, totalCampaigns - publishedCampaigns);
  const totalLandingPages = datasets.landingPages.rows.length;
  const activeLandingPages = datasets.landingPages.rows.filter((row) => {
    const value = row.is_active;
    return value === true || String(value).toLowerCase() === "true";
  }).length;
  const inactiveLandingPages = Math.max(0, totalLandingPages - activeLandingPages);
  const leadRecords = datasets.leads.rows.length;
  const assessmentRecords = datasets.assessments.rows.length;
  const totalExportableRecords = allRows.length;
  const availableDatasetCount = datasetConfigs.filter(
    (config) => !datasets[config.key].isLoading && !datasets[config.key].error,
  ).length;
  const datasetReadinessPercent = getPercent(availableDatasetCount, datasetConfigs.length);
  const publishedCampaignPercent = getPercent(publishedCampaigns, totalCampaigns);
  const activeLandingPagePercent = getPercent(activeLandingPages, totalLandingPages);
  const launchAssetTotal = totalCampaigns + totalLandingPages;
  const launchReadyAssets = publishedCampaigns + activeLandingPages;
  const launchReadinessPercent = getPercent(launchReadyAssets, launchAssetTotal);
  const exportReadinessPercent = totalExportableRecords > 0 ? 100 : datasetReadinessPercent;
  const assessmentCapturePercent = assessmentRecords > 0 ? 100 : 0;
  const datasetSegments = datasetConfigs.map((config, index) => ({
    label: config.shortLabel,
    value: datasets[config.key].rows.length,
    stroke: REPORT_STROKES[index % REPORT_STROKES.length],
  }));
  const launchStatusSegments = [
    { label: "Published Campaigns", value: publishedCampaigns, stroke: REPORT_STROKES[1] },
    { label: "Draft Campaigns", value: draftCampaigns, stroke: REPORT_STROKES[0] },
    { label: "Active Landing Pages", value: activeLandingPages, stroke: REPORT_STROKES[2] },
    { label: "Inactive Landing Pages", value: inactiveLandingPages, stroke: REPORT_STROKES[3] },
  ];

  function showToast(title: string, description: string) {
    setToast({ title, description });

    window.setTimeout(() => {
      setToast(null);
    }, 3200);
  }

  async function loadDataset(config: DatasetConfig) {
    setDatasets((current) => ({
      ...current,
      [config.key]: {
        ...current[config.key],
        isLoading: true,
        error: "",
      },
    }));

    const { data, error } = await supabase
      .from(config.tableName)
      .select("*")
      .limit(500);

    if (error) {
      setDatasets((current) => ({
        ...current,
        [config.key]: {
          rows: [],
          isLoading: false,
          error:
            error.message ||
            `Could not load ${config.shortLabel.toLowerCase()}. Confirm the ${config.tableName} table exists.`,
        },
      }));
      return;
    }

    const rows = ((data ?? []) as ReportRow[]).sort((a, b) => {
      const firstDate = new Date(getStringValue(a, "created_at") || 0).getTime();
      const secondDate = new Date(getStringValue(b, "created_at") || 0).getTime();
      return secondDate - firstDate;
    });

    setDatasets((current) => ({
      ...current,
      [config.key]: {
        rows,
        isLoading: false,
        error: "",
      },
    }));
  }

  async function loadReports() {
    setIsRefreshing(true);
    await Promise.all(datasetConfigs.map((config) => loadDataset(config)));
    setIsRefreshing(false);
  }

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exportActiveDataset() {
    if (!filteredRows.length) {
      showToast("Nothing to export", "This report does not currently have exportable rows.");
      return;
    }

    const timestamp = getExportTimestamp();
    const filename = activeConfig.exportName.replace(".csv", `-${timestamp}.csv`);

    downloadCsv(filename, filteredRows);
    showToast("CSV export started", `${filteredRows.length} ${activeConfig.shortLabel.toLowerCase()} rows exported.`);
  }

  function exportAllDatasets() {
    const exportableRows = datasetConfigs.flatMap((config) =>
      datasets[config.key].rows.map((row) => ({
        report_source: config.shortLabel,
        ...row,
      })),
    );

    if (!exportableRows.length) {
      showToast("Nothing to export", "No report data is available yet.");
      return;
    }

    downloadCsv(`unity-tax-all-reports-${getExportTimestamp()}.csv`, exportableRows);
    showToast("Full export started", `${exportableRows.length} total rows exported across all reports.`);
  }

  async function copyExecutiveSummary() {
    const summary = [
      "Unity Tax Mission Control Report Summary",
      `Total exportable records: ${totalExportableRecords}`,
      `Campaign records: ${totalCampaigns}`,
      `Published campaigns: ${publishedCampaigns} of ${totalCampaigns}`,
      `Landing page records: ${totalLandingPages}`,
      `Active landing pages: ${activeLandingPages} of ${totalLandingPages}`,
      `Assessment records: ${assessmentRecords}`,
      `Lead records from separate leads table: ${leadRecords}`,
      `Launch asset readiness: ${launchReadinessPercent}%`,
    ].join("\n");

    await navigator.clipboard.writeText(summary);
    showToast("Summary copied", "The executive report summary is ready to paste.");
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Reports"
        subtitle="Export Mission Control data, review campaign output, and track launch readiness."
      />

      <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mb-6 overflow-hidden rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/40 p-5 shadow-2xl shadow-slate-950/40 sm:p-7">
          <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-200">
                <Sparkles className="h-4 w-4" />
                AI Executive Recommendation
              </div>

              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                Use Reports as the launch export center.
              </h2>

              <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-300 sm:text-base">
                Keep this page focused on clean exports first: campaign data, landing pages, leads,
                and assessments. Once paid traffic starts, this becomes the operating dashboard for
                pipeline, revenue attribution, and performance reporting.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Records</p>
                <p className="mt-2 text-2xl font-black text-white">{totalExportableRecords}</p>
              </div>
              <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Campaigns Live</p>
                <p className="mt-2 text-2xl font-black text-white">{publishedCampaigns}/{totalCampaigns}</p>
              </div>
              <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Pages Live</p>
                <p className="mt-2 text-2xl font-black text-white">{activeLandingPages}/{totalLandingPages}</p>
              </div>
              <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Priority</p>
                <p className="mt-2 text-2xl font-black text-emerald-300">High</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Campaigns"
            value={String(totalCampaigns)}
            description="Draft and published campaign records"
            icon={Megaphone}
          />
          <MetricCard
            label="Published Campaigns"
            value={`${publishedCampaigns}/${totalCampaigns}`}
            description={`${publishedCampaignPercent}% of campaign records are live`}
            icon={Megaphone}
          />
          <MetricCard
            label="Active Landing Pages"
            value={`${activeLandingPages}/${totalLandingPages}`}
            description={`${activeLandingPagePercent}% of landing pages are public`}
            icon={FileText}
          />
          <MetricCard
            label="Assessments"
            value={String(assessmentRecords)}
            description="Tax Opportunity Assessment submissions"
            icon={Users}
          />
        </div>

        <div className="mb-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-slate-800 bg-slate-950 p-5 shadow-2xl shadow-slate-950/30 sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-300">
                Visual Report Health
              </p>
              <h3 className="mt-2 text-2xl font-black text-white">
                Export readiness at a glance
              </h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">
                These rings show whether Mission Control has enough data to support clean launch reporting.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
              <ReportProgressRing
                label="Export Records"
                value={totalExportableRecords > 0 ? "Ready" : "Waiting"}
                percent={exportReadinessPercent}
                description={`${totalExportableRecords} total rows across report sources`}
              />
              <ReportProgressRing
                label="Launch Assets"
                value={`${launchReadyAssets}/${launchAssetTotal}`}
                percent={launchReadinessPercent}
                description="Published campaigns plus active landing pages"
              />
              <ReportProgressRing
                label="Assessments"
                value={assessmentRecords > 0 ? "Capturing" : "Waiting"}
                percent={assessmentCapturePercent}
                description={`${assessmentRecords} Tax Opportunity Assessment records`}
              />
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <ReportDonutCard
              title="Data source mix"
              description="Where exportable Mission Control records currently live."
              centerLabel="Rows"
              centerValue={compactNumber(totalExportableRecords)}
              segments={datasetSegments}
            />

            <ReportDonutCard
              title="Launch asset mix"
              description="Published campaigns, draft campaigns, active pages, and inactive pages shown as separate launch assets."
              centerLabel="Ready"
              centerValue={`${launchReadinessPercent}%`}
              segments={launchStatusSegments}
            />
          </div>
        </div>

        <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="grid gap-3 sm:grid-cols-2 lg:flex">
            <button
              type="button"
              onClick={exportActiveDataset}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
            >
              <Download className="h-4 w-4" />
              Export Current View
            </button>

            <button
              type="button"
              onClick={exportAllDatasets}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-black text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
            >
              <Database className="h-4 w-4" />
              Export All Data
            </button>

            <button
              type="button"
              onClick={copyExecutiveSummary}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-black text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
            >
              <CheckCircle2 className="h-4 w-4" />
              Copy Summary
            </button>
          </div>

          <button
            type="button"
            onClick={loadReports}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-black text-blue-200 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Reports
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[22rem_1fr]">
          <div className="space-y-3">
            {datasetConfigs.map((config) => {
              const Icon = config.icon;
              const dataset = datasets[config.key];
              const isActive = activeDatasetKey === config.key;

              return (
                <button
                  key={config.key}
                  type="button"
                  onClick={() => {
                    setActiveDatasetKey(config.key);
                    setSearchTerm("");
                  }}
                  className={`w-full rounded-[1.5rem] border p-4 text-left transition ${
                    isActive
                      ? "border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-950/20"
                      : "border-slate-800 bg-slate-950 hover:border-slate-600 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`rounded-2xl p-3 ${
                          isActive ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-black text-white">{config.shortLabel}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-slate-400">
                          {config.description}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-black text-slate-300">
                      {dataset.isLoading ? "…" : dataset.rows.length}
                    </span>
                  </div>

                  {dataset.error && (
                    <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs font-bold leading-5 text-amber-200">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>Table not active yet.</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 shadow-2xl shadow-slate-950/30">
            <div className="border-b border-slate-800 p-5 sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[1fr_18rem] lg:items-start">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-300">
                    {activeConfig.label}
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-white">Exportable Data</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">
                    {activeDataset.error
                      ? `Mission Control could not load the ${activeConfig.tableName} table. This is safe for launch if that module is not active yet.`
                      : `${filteredRows.length} of ${activeDataset.rows.length} records shown.`}
                  </p>
                </div>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search report..."
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900 py-3 pl-11 pr-4 text-sm font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {activeDataset.isLoading ? (
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-8 text-center">
                  <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-300" />
                  <p className="mt-4 text-sm font-black text-white">Loading report data...</p>
                  <p className="mt-2 text-sm font-semibold text-slate-400">
                    Mission Control is checking Supabase for exportable records.
                  </p>
                </div>
              ) : activeDataset.error ? (
                <div className="rounded-[1.5rem] border border-amber-500/20 bg-amber-500/10 p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
                    <div>
                      <p className="text-sm font-black text-amber-100">Report source unavailable</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-amber-100/80">
                        {activeDataset.error}
                      </p>
                      <p className="mt-3 text-xs font-bold leading-5 text-amber-100/70">
                        This page still works. Once the matching table exists, the export button will activate automatically.
                      </p>
                    </div>
                  </div>
                </div>
              ) : filteredRows.length === 0 ? (
                <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-8 text-center">
                  <Database className="mx-auto h-8 w-8 text-slate-500" />
                  <p className="mt-4 text-sm font-black text-white">No records found</p>
                  <p className="mt-2 text-sm font-semibold text-slate-400">
                    Generate campaigns, publish landing pages, or clear the search filter to see exportable rows.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRows.slice(0, 25).map((row, index) => (
                    <div
                      key={`${activeConfig.key}-${index}`}
                      className="rounded-[1.35rem] border border-slate-800 bg-slate-900/70 p-4 transition hover:border-slate-600"
                    >
                      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
                        <div>
                          <p className="text-sm font-black text-white">
                            {getDisplayTitle(row, `${activeConfig.shortLabel} Record ${index + 1}`)}
                          </p>
                          <p className="mt-1 text-xs font-bold leading-5 text-slate-400">
                            {getDisplaySubtitle(row)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                          {getStringValue(row, "status") && (
                            <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-black capitalize text-slate-300">
                              {getStringValue(row, "status")}
                            </span>
                          )}
                          <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-black text-slate-300">
                            {getRowDate(row)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        <MiniField label="Slug" value={getStringValue(row, "slug") || "—"} />
                        <MiniField label="Audience" value={getStringValue(row, "audience") || "—"} />
                        <MiniField label="Location" value={getStringValue(row, "location") || "—"} />
                      </div>
                    </div>
                  ))}

                  {filteredRows.length > 25 && (
                    <p className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center text-xs font-bold text-slate-400">
                      Showing first 25 rows in Mission Control. CSV export includes all {filteredRows.length} filtered rows.
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-5 left-4 right-4 z-50 mx-auto max-w-md rounded-3xl border border-blue-500/30 bg-slate-950 p-4 shadow-2xl shadow-slate-950/60 sm:left-auto sm:right-5">
          <div className="flex gap-3">
            <div className="rounded-2xl bg-blue-600 p-2 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white">{toast.title}</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-400">{toast.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function ReportProgressRing({
  label,
  value,
  percent,
  description,
}: {
  label: string;
  value: string;
  percent: number;
  description: string;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const safePercent = clampPercent(percent);
  const offset = circumference - (safePercent / 100) * circumference;

  return (
    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 p-5 text-center">
      <div className="relative mx-auto h-28 w-28">
        <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(30, 41, 59, 0.95)"
            strokeWidth="13"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="url(#reportRingGradient)"
            strokeLinecap="round"
            strokeWidth="13"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
          <defs>
            <linearGradient id="reportRingGradient" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="55%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-white">{safePercent}%</span>
          <span className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-slate-500">
            Status
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-blue-300">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
      <p className="mt-2 text-xs font-bold leading-5 text-slate-400">{description}</p>
    </div>
  );
}

function ReportDonutCard({
  title,
  description,
  centerLabel,
  centerValue,
  segments,
}: {
  title: string;
  description: string;
  centerLabel: string;
  centerValue: string;
  segments: ReportSegment[];
}) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let runningOffset = 0;

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950 p-5 shadow-2xl shadow-slate-950/30 sm:p-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-300">
          Donut Chart
        </p>
        <h3 className="mt-2 text-2xl font-black text-white">{title}</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">
          {description}
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-[12rem_1fr] sm:items-center xl:grid-cols-1 2xl:grid-cols-[12rem_1fr]">
        <div className="relative mx-auto h-48 w-48">
          <svg viewBox="0 0 140 140" className="h-48 w-48 -rotate-90">
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="rgba(30, 41, 59, 0.95)"
              strokeWidth="18"
            />
            {total > 0 &&
              segments
                .filter((segment) => segment.value > 0)
                .map((segment) => {
                  const dash = (segment.value / total) * circumference;
                  const dashOffset = -runningOffset;
                  runningOffset += dash;

                  return (
                    <circle
                      key={segment.label}
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="none"
                      stroke={segment.stroke}
                      strokeLinecap="round"
                      strokeWidth="18"
                      strokeDasharray={`${dash} ${circumference - dash}`}
                      strokeDashoffset={dashOffset}
                    />
                  );
                })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[0.64rem] font-black uppercase tracking-[0.2em] text-slate-500">
              {centerLabel}
            </p>
            <p className="mt-2 text-3xl font-black text-white">{centerValue}</p>
          </div>
        </div>

        <div className="space-y-3">
          {total === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm font-bold leading-6 text-slate-400">
              No chart data yet. Generate campaigns, publish pages, or submit test assessments to activate this visual.
            </div>
          ) : (
            segments
              .filter((segment) => segment.value > 0)
              .map((segment) => (
                <div key={segment.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: segment.stroke }}
                      />
                      <p className="truncate text-sm font-black text-white">{segment.label}</p>
                    </div>
                    <p className="shrink-0 text-sm font-black text-slate-300">
                      {segment.value}
                    </p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${getPercent(segment.value, total)}%`,
                        backgroundColor: segment.stroke,
                      }}
                    />
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof BarChart3;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-5 shadow-lg shadow-slate-950/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-black text-white">{value}</p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-3 text-blue-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-xs font-bold leading-5 text-slate-400">{description}</p>
    </div>
  );
}

function MiniField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
      <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-600">{label}</p>
      <p className="mt-1 truncate text-xs font-bold text-slate-300">{value}</p>
    </div>
  );
}
