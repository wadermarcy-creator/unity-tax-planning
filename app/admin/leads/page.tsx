"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type WorkflowField =
  | "docs_requested"
  | "docs_received"
  | "hazel_review_started"
  | "plan_pdf_completed"
  | "review_call_scheduled";

type TaxLead = {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  household_income: string | null;
  investable_assets: string | null;
  business_owner: boolean;
  retiring_soon: boolean;
  charitable_giving: boolean;
  current_advisor: boolean;
  current_cpa: boolean;
  upcoming_sale: boolean;
  biggest_tax_concern: string | null;
  lead_score: number;
  lead_grade: string;
  status: string;
  admin_notes: string | null;
  unity_opportunity: string | null;
  docs_requested: boolean;
  docs_received: boolean;
  hazel_review_started: boolean;
  plan_pdf_completed: boolean;
  review_call_scheduled: boolean;
};

const statusOptions = [
  "new",
  "contacted",
  "scheduled",
  "qualified",
  "not_fit",
  "converted",
];

const unityOpportunityOptions = ["unknown", "yes", "maybe", "no"];

const workflowLabels: Array<{
  field: WorkflowField;
  label: string;
}> = [
  {
    field: "docs_requested",
    label: "Docs Requested",
  },
  {
    field: "docs_received",
    label: "Docs Received",
  },
  {
    field: "hazel_review_started",
    label: "Hazel Review",
  },
  {
    field: "plan_pdf_completed",
    label: "Plan PDF Done",
  },
  {
    field: "review_call_scheduled",
    label: "Review Scheduled",
  },
];

function formatStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getGradeClasses(grade: string) {
  if (grade === "A+ Lead") {
    return "border-emerald-300 bg-emerald-100 text-emerald-800";
  }

  if (grade === "A Lead") {
    return "border-blue-300 bg-blue-100 text-blue-800";
  }

  if (grade === "B Lead") {
    return "border-amber-300 bg-amber-100 text-amber-800";
  }

  if (grade === "C Lead") {
    return "border-orange-300 bg-orange-100 text-orange-800";
  }

  return "border-slate-300 bg-slate-100 text-slate-700";
}

function getStatusClasses(status: string) {
  if (status === "converted") {
    return "border-emerald-300 bg-emerald-100 text-emerald-800";
  }

  if (status === "qualified") {
    return "border-blue-300 bg-blue-100 text-blue-800";
  }

  if (status === "scheduled") {
    return "border-violet-300 bg-violet-100 text-violet-800";
  }

  if (status === "contacted") {
    return "border-amber-300 bg-amber-100 text-amber-800";
  }

  if (status === "not_fit") {
    return "border-rose-300 bg-rose-100 text-rose-800";
  }

  return "border-slate-300 bg-slate-100 text-slate-700";
}

function getWorkflowProgress(lead: TaxLead) {
  const completed = workflowLabels.filter(({ field }) => lead[field]).length;

  return Math.round((completed / workflowLabels.length) * 100);
}

function parseConcernSummary(summary: string | null) {
  if (!summary) {
    return [];
  }

  return summary
    .split("\n\n")
    .map((section) => {
      const separatorIndex = section.indexOf(":");

      if (separatorIndex === -1) {
        return {
          label: "Details",
          value: section.trim(),
        };
      }

      return {
        label: section.slice(0, separatorIndex).trim(),
        value: section.slice(separatorIndex + 1).trim(),
      };
    })
    .filter((section) => section.value);
}

export default function AdminLeadsPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<TaxLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null);
  const [expandedLeadIds, setExpandedLeadIds] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [opportunityFilter, setOpportunityFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  async function loadLeads() {
    setIsLoading(true);
    setMessage("");
    setSuccessMessage("");

    const { data, error } = await supabase
      .from("tax_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("Could not load leads.");
      setIsLoading(false);
      return;
    }

    setLeads(data || []);
    setIsLoading(false);
  }

  async function updateLeadStatus(leadId: string, newStatus: string) {
    setMessage("");
    setSuccessMessage("");

    const { error } = await supabase
      .from("tax_leads")
      .update({
        status: newStatus,
      })
      .eq("id", leadId);

    if (error) {
      console.error(error);
      setMessage("Could not update lead status.");
      return;
    }

    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status: newStatus,
            }
          : lead,
      ),
    );

    setSuccessMessage("Lead status updated.");
  }

  async function updateUnityOpportunity(
    leadId: string,
    newOpportunity: string,
  ) {
    setMessage("");
    setSuccessMessage("");

    const { error } = await supabase
      .from("tax_leads")
      .update({
        unity_opportunity: newOpportunity,
      })
      .eq("id", leadId);

    if (error) {
      console.error(error);
      setMessage("Could not update Unity opportunity.");
      return;
    }

    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              unity_opportunity: newOpportunity,
            }
          : lead,
      ),
    );

    setSuccessMessage("Unity opportunity updated.");
  }

  async function updateWorkflowField(
    leadId: string,
    field: WorkflowField,
    value: boolean,
  ) {
    setMessage("");
    setSuccessMessage("");

    const { error } = await supabase
      .from("tax_leads")
      .update({
        [field]: value,
      })
      .eq("id", leadId);

    if (error) {
      console.error(error);
      setMessage("Could not update workflow item.");
      return;
    }

    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              [field]: value,
            }
          : lead,
      ),
    );
  }

  function updateLocalNotes(leadId: string, notes: string) {
    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              admin_notes: notes,
            }
          : lead,
      ),
    );
  }

  async function saveLeadNotes(leadId: string) {
    const lead = leads.find((item) => item.id === leadId);

    if (!lead) {
      setMessage("Could not find lead to save notes.");
      return;
    }

    setSavingLeadId(leadId);
    setMessage("");
    setSuccessMessage("");

    const { error } = await supabase
      .from("tax_leads")
      .update({
        admin_notes: lead.admin_notes || "",
      })
      .eq("id", leadId);

    if (error) {
      console.error(error);
      setMessage("Could not save notes.");
      setSavingLeadId(null);
      return;
    }

    setSavingLeadId(null);
    setSuccessMessage("Admin notes saved.");
  }

  function toggleLeadExpanded(leadId: string) {
    setExpandedLeadIds((currentIds) =>
      currentIds.includes(leadId)
        ? currentIds.filter((id) => id !== leadId)
        : [...currentIds, leadId],
    );
  }

  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setGradeFilter("all");
    setOpportunityFilter("all");
    setSortOption("newest");
  }

  useEffect(() => {
    async function checkAdminSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/admin/login");
        return;
      }

      if (session.user.email?.toLowerCase() !== "wadermarcy@gmail.com") {
        await supabase.auth.signOut();
        router.push("/admin/login");
        return;
      }

      await loadLeads();
    }

    checkAdminSession();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const filteredLeads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const results = leads.filter((lead) => {
      const searchableText = [
        lead.first_name,
        lead.last_name,
        lead.email,
        lead.phone,
        lead.household_income,
        lead.investable_assets,
        lead.biggest_tax_concern,
        lead.admin_notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;

      const matchesGrade =
        gradeFilter === "all" || lead.lead_grade === gradeFilter;

      const matchesOpportunity =
        opportunityFilter === "all" ||
        (lead.unity_opportunity || "unknown") === opportunityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesGrade &&
        matchesOpportunity
      );
    });

    return [...results].sort((a, b) => {
      if (sortOption === "oldest") {
        return (
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
        );
      }

      if (sortOption === "highest_score") {
        return (b.lead_score || 0) - (a.lead_score || 0);
      }

      if (sortOption === "lowest_score") {
        return (a.lead_score || 0) - (b.lead_score || 0);
      }

      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );
    });
  }, [
    leads,
    searchQuery,
    statusFilter,
    gradeFilter,
    opportunityFilter,
    sortOption,
  ]);

  const metrics = useMemo(() => {
    return {
      total: leads.length,

      newLeads: leads.filter((lead) => lead.status === "new").length,

      highPriority: leads.filter(
        (lead) =>
          lead.lead_grade === "A+ Lead" || lead.lead_grade === "A Lead",
      ).length,

      unityOpportunities: leads.filter(
        (lead) =>
          lead.unity_opportunity === "yes" ||
          lead.unity_opportunity === "maybe",
      ).length,

      plansCompleted: leads.filter((lead) => lead.plan_pdf_completed).length,

      converted: leads.filter((lead) => lead.status === "converted").length,
    };
  }, [leads]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-[1500px]">
        <header className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-blue-300">
                Unity Tax Planning
              </p>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Lead Operations Dashboard
              </h1>

              <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-slate-300 sm:text-lg">
                Review new Tax Blind Spot submissions, track planning workflow,
                update opportunity status, and manage follow-up notes.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={loadLeads}
                className="rounded-2xl bg-blue-500 px-6 py-4 text-sm font-black text-white shadow-lg transition hover:bg-blue-400"
              >
                Refresh Leads
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl border-2 border-slate-700 px-6 py-4 text-sm font-black text-white transition hover:border-blue-400 hover:bg-slate-800"
              >
                Log Out
              </button>
            </div>
          </div>
        </header>

        {message && (
          <div className="mb-6 rounded-2xl border border-red-300 bg-red-100 p-5 text-sm font-black text-red-800">
            {message}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-300 bg-emerald-100 p-5 text-sm font-black text-emerald-800">
            {successMessage}
          </div>
        )}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-950 shadow-xl">
            <p className="text-sm font-bold text-slate-500">Total Leads</p>
            <p className="mt-2 text-3xl font-black">{metrics.total}</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-950 shadow-xl">
            <p className="text-sm font-bold text-slate-500">New</p>
            <p className="mt-2 text-3xl font-black text-blue-600">
              {metrics.newLeads}
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-slate-950 shadow-xl">
            <p className="text-sm font-bold text-emerald-700">
              A / A+ Leads
            </p>
            <p className="mt-2 text-3xl font-black text-emerald-700">
              {metrics.highPriority}
            </p>
          </article>

          <article className="rounded-2xl border border-violet-200 bg-violet-50 p-5 text-slate-950 shadow-xl">
            <p className="text-sm font-bold text-violet-700">
              Unity Opportunities
            </p>
            <p className="mt-2 text-3xl font-black text-violet-700">
              {metrics.unityOpportunities}
            </p>
          </article>

          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-slate-950 shadow-xl">
            <p className="text-sm font-bold text-amber-700">
              Plans Completed
            </p>
            <p className="mt-2 text-3xl font-black text-amber-700">
              {metrics.plansCompleted}
            </p>
          </article>

          <article className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-slate-950 shadow-xl">
            <p className="text-sm font-bold text-blue-700">Converted</p>
            <p className="mt-2 text-3xl font-black text-blue-700">
              {metrics.converted}
            </p>
          </article>
        </section>

        <section className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <div className="xl:col-span-2">
              <label
                htmlFor="lead-search"
                className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400"
              >
                Search
              </label>

              <input
                id="lead-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Name, email, phone, notes, concern..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="status-filter"
                className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400"
              >
                Status
              </label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none focus:border-blue-500"
              >
                <option value="all">All Statuses</option>

                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="grade-filter"
                className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400"
              >
                Lead Grade
              </label>

              <select
                id="grade-filter"
                value={gradeFilter}
                onChange={(event) => setGradeFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none focus:border-blue-500"
              >
                <option value="all">All Grades</option>
                <option value="A+ Lead">A+ Lead</option>
                <option value="A Lead">A Lead</option>
                <option value="B Lead">B Lead</option>
                <option value="C Lead">C Lead</option>
                <option value="Nurture">Nurture</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="opportunity-filter"
                className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400"
              >
                Unity Opportunity
              </label>

              <select
                id="opportunity-filter"
                value={opportunityFilter}
                onChange={(event) =>
                  setOpportunityFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none focus:border-blue-500"
              >
                <option value="all">All Opportunities</option>

                {unityOpportunityOptions.map((option) => (
                  <option key={option} value={option}>
                    {formatStatus(option)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="sort-filter"
                className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400"
              >
                Sort
              </label>

              <select
                id="sort-filter"
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest_score">Highest Score</option>
                <option value="lowest_score">Lowest Score</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-col justify-between gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center">
            <p className="text-sm font-bold text-slate-400">
              Showing {filteredLeads.length} of {leads.length} leads
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-black text-slate-200 transition hover:border-blue-400 hover:text-white"
            >
              Clear Filters
            </button>
          </div>
        </section>

        <section className="space-y-6">
          {isLoading ? (
            <div className="rounded-[2rem] bg-white p-8 text-lg font-bold text-slate-600">
              Loading leads...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-8 text-slate-700">
              <h2 className="text-2xl font-black">No matching leads</h2>

              <p className="mt-3 font-medium text-slate-500">
                Try clearing the filters or using a different search term.
              </p>
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const isExpanded = expandedLeadIds.includes(lead.id);
              const workflowProgress = getWorkflowProgress(lead);
              const concernSections = parseConcernSummary(
                lead.biggest_tax_concern,
              );

              return (
                <article
                  key={lead.id}
                  className="overflow-hidden rounded-[2rem] border-2 border-slate-200 bg-white text-slate-950 shadow-2xl shadow-black/10"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-start">
                      <div className="min-w-0">
                        <div className="mb-3 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-black ${getGradeClasses(
                              lead.lead_grade,
                            )}`}
                          >
                            {lead.lead_grade || "Ungraded"}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-black ${getStatusClasses(
                              lead.status || "new",
                            )}`}
                          >
                            {formatStatus(lead.status || "new")}
                          </span>

                          <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                            Score {lead.lead_score || 0}
                          </span>
                        </div>

                        <p className="text-sm font-bold text-slate-500">
                          Submitted{" "}
                          {new Date(lead.created_at).toLocaleString()}
                        </p>

                        <h2 className="mt-2 break-words text-3xl font-black tracking-tight">
                          {[lead.first_name, lead.last_name]
                            .filter(Boolean)
                            .join(" ") || "Unnamed Lead"}
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="break-all font-black text-blue-600 hover:underline"
                            >
                              {lead.email}
                            </a>
                          )}

                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className="font-black text-blue-600 hover:underline"
                            >
                              {lead.phone}
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[620px]">
                        <div>
                          <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                            Status
                          </label>

                          <select
                            value={lead.status || "new"}
                            onChange={(event) =>
                              updateLeadStatus(
                                lead.id,
                                event.target.value,
                              )
                            }
                            className="w-full rounded-xl border-2 border-slate-300 px-3 py-3 text-sm font-black outline-none focus:border-blue-500"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {formatStatus(status)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                            Unity Opportunity
                          </label>

                          <select
                            value={lead.unity_opportunity || "unknown"}
                            onChange={(event) =>
                              updateUnityOpportunity(
                                lead.id,
                                event.target.value,
                              )
                            }
                            className="w-full rounded-xl border-2 border-slate-300 px-3 py-3 text-sm font-black outline-none focus:border-blue-500"
                          >
                            {unityOpportunityOptions.map((option) => (
                              <option key={option} value={option}>
                                {formatStatus(option)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => toggleLeadExpanded(lead.id)}
                            className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-600"
                          >
                            {isExpanded ? "Hide Details" : "View Details"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                      <div className="rounded-2xl bg-slate-100 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                          Income
                        </p>

                        <p className="mt-2 font-black">
                          {lead.household_income || "—"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-100 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                          Investable Assets
                        </p>

                        <p className="mt-2 font-black">
                          {lead.investable_assets || "—"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-100 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                          CPA
                        </p>

                        <p className="mt-2 font-black">
                          {lead.current_cpa ? "Yes" : "No"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-100 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                          Advisor
                        </p>

                        <p className="mt-2 font-black">
                          {lead.current_advisor ? "Yes" : "No"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-100 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                          Workflow
                        </p>

                        <p className="mt-2 font-black">
                          {workflowProgress}% Complete
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{
                          width: `${workflowProgress}%`,
                        }}
                      />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {lead.business_owner && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800">
                          Business Owner
                        </span>
                      )}

                      {lead.retiring_soon && (
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-800">
                          Retiring Soon
                        </span>
                      )}

                      {lead.charitable_giving && (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                          Charitable Giving
                        </span>
                      )}

                      {lead.upcoming_sale && (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                          Upcoming Sale
                        </span>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t-2 border-slate-200 bg-slate-50 p-6 sm:p-8">
                      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                        <div className="space-y-6">
                          <section className="rounded-[1.5rem] border-2 border-slate-200 bg-white p-5 sm:p-6">
                            <div className="mb-5">
                              <h3 className="text-xl font-black">
                                Tax Plan Workflow
                              </h3>

                              <p className="mt-1 text-sm font-medium text-slate-500">
                                Track the lead from intake through plan review.
                              </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {workflowLabels.map(({ field, label }) => (
                                <label
                                  key={field}
                                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 text-sm font-black transition ${
                                    lead[field]
                                      ? "border-blue-500 bg-blue-50 text-blue-800"
                                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={lead[field]}
                                    onChange={(event) =>
                                      updateWorkflowField(
                                        lead.id,
                                        field,
                                        event.target.checked,
                                      )
                                    }
                                    className="h-5 w-5 accent-blue-600"
                                  />

                                  <span>{label}</span>
                                </label>
                              ))}
                            </div>
                          </section>

                          <section className="rounded-[1.5rem] border-2 border-slate-200 bg-white p-5 sm:p-6">
                            <h3 className="text-xl font-black">
                              Intake Details
                            </h3>

                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                              {concernSections.length > 0 ? (
                                concernSections.map((section) => (
                                  <div
                                    key={`${section.label}-${section.value}`}
                                    className="rounded-2xl bg-slate-100 p-4"
                                  >
                                    <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-600">
                                      {section.label}
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap font-medium leading-7 text-slate-700">
                                      {section.value}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-slate-500">
                                  No concern details were provided.
                                </p>
                              )}
                            </div>
                          </section>
                        </div>

                        <section className="rounded-[1.5rem] border-2 border-slate-200 bg-white p-5 sm:p-6">
                          <label className="block text-xl font-black">
                            Admin Notes
                          </label>

                          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                            Record follow-up items, call notes, planning
                            observations, potential AUM, CPA details, and next
                            actions.
                          </p>

                          <textarea
                            value={lead.admin_notes || ""}
                            onChange={(event) =>
                              updateLocalNotes(
                                lead.id,
                                event.target.value,
                              )
                            }
                            className="mt-5 min-h-72 w-full rounded-2xl border-2 border-slate-300 px-4 py-4 text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            placeholder="Add internal notes here..."
                          />

                          <button
                            type="button"
                            onClick={() => saveLeadNotes(lead.id)}
                            disabled={savingLeadId === lead.id}
                            className="mt-4 w-full rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
                          >
                            {savingLeadId === lead.id
                              ? "Saving Notes..."
                              : "Save Notes"}
                          </button>

                          <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {lead.email && (
                              <a
                                href={`mailto:${lead.email}`}
                                className="rounded-xl border-2 border-slate-300 px-4 py-3 text-center text-sm font-black text-slate-800 transition hover:border-blue-500 hover:text-blue-600"
                              >
                                Send Email
                              </a>
                            )}

                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                className="rounded-xl border-2 border-slate-300 px-4 py-3 text-center text-sm font-black text-slate-800 transition hover:border-blue-500 hover:text-blue-600"
                              >
                                Call Lead
                              </a>
                            )}
                          </div>
                        </section>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>

        <p className="mt-8 text-sm font-medium leading-6 text-slate-500">
          Protected administrative view. Database access is restricted through
          Supabase Row Level Security and authenticated admin access.
        </p>
      </section>
    </main>
  );
}