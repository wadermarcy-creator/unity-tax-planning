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

type AiBrief = {
  executive_summary: string;
  planning_themes: string[];
  missing_information: string[];
  discovery_questions: string[];
  recommended_service: string;
  unity_opportunity: "yes" | "maybe" | "no" | "unknown";
  risk_flags: string[];
  recommended_next_action: string;
  professional_review_notes: string;
};

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
  ai_brief: AiBrief | null;
  ai_brief_generated_at: string | null;
  ai_brief_reviewed: boolean;
  ai_brief_reviewed_at: string | null;
  ai_brief_reviewed_by: string | null;
  follow_up_due_at: string | null;
};

type FollowUpFilter =
  | "all"
  | "overdue"
  | "today"
  | "upcoming"
  | "no_date";

const APPROVED_ADMIN_EMAIL = "wadermarcy@gmail.com";

const statusOptions = [
  "new",
  "contacted",
  "scheduled",
  "qualified",
  "not_fit",
  "converted",
];

const unityOpportunityOptions = ["unknown", "yes", "maybe", "no"];

const closedStatuses = ["converted", "not_fit"];

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

function formatDate(date: string | null) {
  if (!date) {
    return "Not available";
  }

  return new Date(date).toLocaleString();
}

function formatFollowUpDate(date: string | null) {
  if (!date) {
    return "No follow-up scheduled";
  }

  return new Date(date).toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function toDateTimeLocalValue(date: string | null) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const timezoneOffset = parsedDate.getTimezoneOffset() * 60_000;
  const localDate = new Date(parsedDate.getTime() - timezoneOffset);

  return localDate.toISOString().slice(0, 16);
}

function dateTimeLocalToIso(value: string) {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString();
}

function getStartOfToday() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
}

function getEndOfToday() {
  const today = new Date();

  today.setHours(23, 59, 59, 999);

  return today;
}

function isActiveFollowUpLead(lead: TaxLead) {
  return !closedStatuses.includes(lead.status);
}

function isFollowUpOverdue(lead: TaxLead) {
  if (!lead.follow_up_due_at || !isActiveFollowUpLead(lead)) {
    return false;
  }

  return new Date(lead.follow_up_due_at).getTime() < Date.now();
}

function isFollowUpDueToday(lead: TaxLead) {
  if (!lead.follow_up_due_at || !isActiveFollowUpLead(lead)) {
    return false;
  }

  const dueDate = new Date(lead.follow_up_due_at);
  const startOfToday = getStartOfToday();
  const endOfToday = getEndOfToday();

  return dueDate >= startOfToday && dueDate <= endOfToday;
}

function isFollowUpUpcoming(lead: TaxLead) {
  if (!lead.follow_up_due_at || !isActiveFollowUpLead(lead)) {
    return false;
  }

  return new Date(lead.follow_up_due_at) > getEndOfToday();
}

function getFollowUpBadge(lead: TaxLead) {
  if (!isActiveFollowUpLead(lead)) {
    return {
      label: "Follow-Up Closed",
      classes: "border-slate-300 bg-slate-100 text-slate-600",
    };
  }

  if (!lead.follow_up_due_at) {
    return {
      label: "No Follow-Up Date",
      classes: "border-slate-300 bg-slate-100 text-slate-700",
    };
  }

  if (isFollowUpOverdue(lead)) {
    return {
      label: "Follow-Up Overdue",
      classes: "border-red-300 bg-red-100 text-red-800",
    };
  }

  if (isFollowUpDueToday(lead)) {
    return {
      label: "Follow Up Today",
      classes: "border-amber-300 bg-amber-100 text-amber-800",
    };
  }

  return {
    label: "Follow-Up Scheduled",
    classes: "border-cyan-300 bg-cyan-100 text-cyan-800",
  };
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

function AiList({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: string[];
  emptyMessage: string;
}) {
  return (
    <section className="rounded-2xl border-2 border-slate-200 bg-white p-5">
      <h4 className="text-sm font-black uppercase tracking-[0.14em] text-blue-600">
        {title}
      </h4>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />

              <span className="font-medium leading-7 text-slate-700">
                {item}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 font-medium text-slate-500">{emptyMessage}</p>
      )}
    </section>
  );
}

export default function AdminLeadsPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<TaxLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null);
  const [generatingLeadId, setGeneratingLeadId] = useState<string | null>(
    null,
  );
  const [reviewingLeadId, setReviewingLeadId] = useState<string | null>(
    null,
  );
  const [updatingFollowUpLeadId, setUpdatingFollowUpLeadId] = useState<
    string | null
  >(null);
  const [expandedLeadIds, setExpandedLeadIds] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [opportunityFilter, setOpportunityFilter] = useState("all");
  const [followUpFilter, setFollowUpFilter] =
    useState<FollowUpFilter>("all");
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

    setLeads((data as TaxLead[]) || []);
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

  async function updateFollowUpDueAt(
    leadId: string,
    followUpDueAt: string | null,
    successText: string,
  ) {
    setUpdatingFollowUpLeadId(leadId);
    setMessage("");
    setSuccessMessage("");

    const { error } = await supabase
      .from("tax_leads")
      .update({
        follow_up_due_at: followUpDueAt,
      })
      .eq("id", leadId);

    if (error) {
      console.error(error);
      setMessage("Could not update the follow-up date.");
      setUpdatingFollowUpLeadId(null);
      return;
    }

    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              follow_up_due_at: followUpDueAt,
            }
          : lead,
      ),
    );

    setUpdatingFollowUpLeadId(null);
    setSuccessMessage(successText);
  }

  async function handleFollowUpDateChange(
    leadId: string,
    localDateValue: string,
  ) {
    const isoDate = dateTimeLocalToIso(localDateValue);

    if (!isoDate) {
      setMessage("Please select a valid follow-up date and time.");
      return;
    }

    await updateFollowUpDueAt(
      leadId,
      isoDate,
      "Follow-up date updated.",
    );
  }

  async function scheduleFollowUpTomorrow(leadId: string) {
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    await updateFollowUpDueAt(
      leadId,
      tomorrow.toISOString(),
      "Follow-up scheduled for tomorrow at 9:00 AM.",
    );
  }

  async function scheduleFollowUpNextWeek(leadId: string) {
    const nextWeek = new Date();

    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(9, 0, 0, 0);

    await updateFollowUpDueAt(
      leadId,
      nextWeek.toISOString(),
      "Follow-up scheduled for one week from today.",
    );
  }

  async function markFollowUpComplete(leadId: string) {
    await updateFollowUpDueAt(
      leadId,
      null,
      "Follow-up marked complete.",
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

  async function generateAiBrief(leadId: string) {
    setGeneratingLeadId(leadId);
    setMessage("");
    setSuccessMessage("");

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      console.error(sessionError);
      setMessage("Your admin session has expired. Please log in again.");
      setGeneratingLeadId(null);
      return;
    }

    try {
      const response = await fetch("/api/generate-lead-brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          leadId,
        }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
        aiBrief?: AiBrief;
        generatedAt?: string;
        reviewed?: boolean;
      };

      if (!response.ok || !result.aiBrief) {
        throw new Error(
          result.error || "Could not generate the AI opportunity brief.",
        );
      }

      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead.id === leadId
            ? {
                ...lead,
                ai_brief: result.aiBrief || null,
                ai_brief_generated_at:
                  result.generatedAt || new Date().toISOString(),
                ai_brief_reviewed: Boolean(result.reviewed),
                ai_brief_reviewed_at: null,
                ai_brief_reviewed_by: null,
              }
            : lead,
        ),
      );

      setSuccessMessage("AI opportunity brief generated successfully.");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not generate the AI opportunity brief.",
      );
    } finally {
      setGeneratingLeadId(null);
    }
  }

  async function markAiBriefReviewed(leadId: string) {
    setReviewingLeadId(leadId);
    setMessage("");
    setSuccessMessage("");

    const reviewedAt = new Date().toISOString();

    const { error } = await supabase
      .from("tax_leads")
      .update({
        ai_brief_reviewed: true,
        ai_brief_reviewed_at: reviewedAt,
        ai_brief_reviewed_by: APPROVED_ADMIN_EMAIL,
      })
      .eq("id", leadId);

    if (error) {
      console.error(error);
      setMessage("Could not mark the AI brief as reviewed.");
      setReviewingLeadId(null);
      return;
    }

    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              ai_brief_reviewed: true,
              ai_brief_reviewed_at: reviewedAt,
              ai_brief_reviewed_by: APPROVED_ADMIN_EMAIL,
            }
          : lead,
      ),
    );

    setReviewingLeadId(null);
    setSuccessMessage("AI opportunity brief marked as reviewed.");
  }

  async function markAiBriefUnreviewed(leadId: string) {
    setReviewingLeadId(leadId);
    setMessage("");
    setSuccessMessage("");

    const { error } = await supabase
      .from("tax_leads")
      .update({
        ai_brief_reviewed: false,
        ai_brief_reviewed_at: null,
        ai_brief_reviewed_by: null,
      })
      .eq("id", leadId);

    if (error) {
      console.error(error);
      setMessage("Could not reset the AI brief review status.");
      setReviewingLeadId(null);
      return;
    }

    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              ai_brief_reviewed: false,
              ai_brief_reviewed_at: null,
              ai_brief_reviewed_by: null,
            }
          : lead,
      ),
    );

    setReviewingLeadId(null);
    setSuccessMessage("AI brief review status reset.");
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
    setFollowUpFilter("all");
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

      if (
        session.user.email?.toLowerCase() !==
        APPROVED_ADMIN_EMAIL.toLowerCase()
      ) {
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
      const aiSearchText = lead.ai_brief
        ? [
            lead.ai_brief.executive_summary,
            lead.ai_brief.recommended_service,
            lead.ai_brief.recommended_next_action,
            ...lead.ai_brief.planning_themes,
            ...lead.ai_brief.missing_information,
            ...lead.ai_brief.discovery_questions,
            ...lead.ai_brief.risk_flags,
          ].join(" ")
        : "";

      const searchableText = [
        lead.first_name,
        lead.last_name,
        lead.email,
        lead.phone,
        lead.household_income,
        lead.investable_assets,
        lead.biggest_tax_concern,
        lead.admin_notes,
        aiSearchText,
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

      let matchesFollowUp = true;

      if (followUpFilter === "overdue") {
        matchesFollowUp = isFollowUpOverdue(lead);
      }

      if (followUpFilter === "today") {
        matchesFollowUp = isFollowUpDueToday(lead);
      }

      if (followUpFilter === "upcoming") {
        matchesFollowUp = isFollowUpUpcoming(lead);
      }

      if (followUpFilter === "no_date") {
        matchesFollowUp =
          isActiveFollowUpLead(lead) && !lead.follow_up_due_at;
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesGrade &&
        matchesOpportunity &&
        matchesFollowUp
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

      if (sortOption === "follow_up") {
        if (!a.follow_up_due_at && !b.follow_up_due_at) {
          return 0;
        }

        if (!a.follow_up_due_at) {
          return 1;
        }

        if (!b.follow_up_due_at) {
          return -1;
        }

        return (
          new Date(a.follow_up_due_at).getTime() -
          new Date(b.follow_up_due_at).getTime()
        );
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
    followUpFilter,
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

      aiBriefs: leads.filter((lead) => Boolean(lead.ai_brief)).length,

      aiBriefsNeedingReview: leads.filter(
        (lead) => Boolean(lead.ai_brief) && !lead.ai_brief_reviewed,
      ).length,

      overdueFollowUps: leads.filter(isFollowUpOverdue).length,

      dueToday: leads.filter(isFollowUpDueToday).length,
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
                Review submissions, manage follow-ups, generate internal AI
                opportunity briefs, and track every planning workflow.
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

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-8">
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

          <button
            type="button"
            onClick={() => {
              setFollowUpFilter("overdue");
              setSortOption("follow_up");
            }}
            className="rounded-2xl border border-red-200 bg-red-50 p-5 text-left text-slate-950 shadow-xl transition hover:-translate-y-1 hover:border-red-400"
          >
            <p className="text-sm font-bold text-red-700">
              Overdue Follow-Ups
            </p>
            <p className="mt-2 text-3xl font-black text-red-700">
              {metrics.overdueFollowUps}
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setFollowUpFilter("today");
              setSortOption("follow_up");
            }}
            className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left text-slate-950 shadow-xl transition hover:-translate-y-1 hover:border-amber-400"
          >
            <p className="text-sm font-bold text-amber-700">
              Follow Up Today
            </p>
            <p className="mt-2 text-3xl font-black text-amber-700">
              {metrics.dueToday}
            </p>
          </button>

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

          <article className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 text-slate-950 shadow-xl">
            <p className="text-sm font-bold text-cyan-700">AI Briefs</p>
            <p className="mt-2 text-3xl font-black text-cyan-700">
              {metrics.aiBriefs}
            </p>
          </article>

          <article className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-slate-950 shadow-xl">
            <p className="text-sm font-bold text-rose-700">
              AI Review Needed
            </p>
            <p className="mt-2 text-3xl font-black text-rose-700">
              {metrics.aiBriefsNeedingReview}
            </p>
          </article>
        </section>

        <section className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
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
                placeholder="Name, email, notes, concern, AI brief..."
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
                htmlFor="follow-up-filter"
                className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400"
              >
                Follow-Up
              </label>

              <select
                id="follow-up-filter"
                value={followUpFilter}
                onChange={(event) =>
                  setFollowUpFilter(event.target.value as FollowUpFilter)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none focus:border-blue-500"
              >
                <option value="all">All Follow-Ups</option>
                <option value="overdue">Overdue</option>
                <option value="today">Due Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="no_date">No Date</option>
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
                <option value="follow_up">Next Follow-Up</option>
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
              const isGenerating = generatingLeadId === lead.id;
              const isReviewing = reviewingLeadId === lead.id;
              const isUpdatingFollowUp =
                updatingFollowUpLeadId === lead.id;
              const followUpBadge = getFollowUpBadge(lead);

              return (
                <article
                  key={lead.id}
                  className={`overflow-hidden rounded-[2rem] border-2 bg-white text-slate-950 shadow-2xl shadow-black/10 ${
                    isFollowUpOverdue(lead)
                      ? "border-red-400"
                      : "border-slate-200"
                  }`}
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

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-black ${followUpBadge.classes}`}
                          >
                            {followUpBadge.label}
                          </span>

                          {lead.ai_brief && (
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-black ${
                                lead.ai_brief_reviewed
                                  ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                                  : "border-amber-300 bg-amber-100 text-amber-800"
                              }`}
                            >
                              {lead.ai_brief_reviewed
                                ? "AI Brief Reviewed"
                                : "AI Review Needed"}
                            </span>
                          )}
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

                        <div
                          className={`mt-5 inline-flex rounded-xl border-2 px-4 py-3 text-sm font-black ${followUpBadge.classes}`}
                        >
                          {formatFollowUpDate(lead.follow_up_due_at)}
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
                      <div className="space-y-6">
                        <section
                          className={`rounded-[1.5rem] border-2 p-5 sm:p-6 ${
                            isFollowUpOverdue(lead)
                              ? "border-red-300 bg-red-50"
                              : "border-cyan-200 bg-cyan-50"
                          }`}
                        >
                          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-2xl font-black">
                                  Follow-Up Management
                                </h3>

                                <span
                                  className={`rounded-full border px-3 py-1 text-xs font-black ${followUpBadge.classes}`}
                                >
                                  {followUpBadge.label}
                                </span>
                              </div>

                              <p className="mt-2 font-medium leading-7 text-slate-600">
                                Schedule, reschedule, or complete the next
                                follow-up for this lead.
                              </p>
                            </div>

                            <div className="rounded-2xl border-2 border-white bg-white px-5 py-4 shadow-sm">
                              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                                Current Follow-Up
                              </p>

                              <p className="mt-2 font-black text-slate-950">
                                {formatFollowUpDate(
                                  lead.follow_up_due_at,
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto_auto_auto] lg:items-end">
                            <div>
                              <label
                                htmlFor={`follow-up-${lead.id}`}
                                className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-600"
                              >
                                Follow-Up Date and Time
                              </label>

                              <input
                                id={`follow-up-${lead.id}`}
                                type="datetime-local"
                                value={toDateTimeLocalValue(
                                  lead.follow_up_due_at,
                                )}
                                onChange={(event) =>
                                  handleFollowUpDateChange(
                                    lead.id,
                                    event.target.value,
                                  )
                                }
                                disabled={isUpdatingFollowUp}
                                className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 font-black text-slate-950 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                scheduleFollowUpTomorrow(lead.id)
                              }
                              disabled={isUpdatingFollowUp}
                              className="rounded-xl border-2 border-blue-300 bg-white px-5 py-3 text-sm font-black text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-400"
                            >
                              Tomorrow 9 AM
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                scheduleFollowUpNextWeek(lead.id)
                              }
                              disabled={isUpdatingFollowUp}
                              className="rounded-xl border-2 border-violet-300 bg-white px-5 py-3 text-sm font-black text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:text-slate-400"
                            >
                              Next Week
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                markFollowUpComplete(lead.id)
                              }
                              disabled={
                                isUpdatingFollowUp ||
                                !lead.follow_up_due_at
                              }
                              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                              {isUpdatingFollowUp
                                ? "Saving..."
                                : "Mark Complete"}
                            </button>
                          </div>

                          <p className="mt-4 text-sm font-medium leading-6 text-slate-500">
                            Converted and not-fit leads are automatically
                            excluded from active follow-up totals.
                          </p>
                        </section>

                        <section className="overflow-hidden rounded-[1.5rem] border-2 border-blue-200 bg-blue-50">
                          <div className="border-b-2 border-blue-200 bg-slate-950 p-5 text-white sm:p-6">
                            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                              <div>
                                <div className="flex flex-wrap items-center gap-3">
                                  <h3 className="text-2xl font-black">
                                    AI Tax Opportunity Brief
                                  </h3>

                                  {lead.ai_brief && (
                                    <span
                                      className={`rounded-full border px-3 py-1 text-xs font-black ${
                                        lead.ai_brief_reviewed
                                          ? "border-emerald-400 bg-emerald-400/15 text-emerald-200"
                                          : "border-amber-400 bg-amber-400/15 text-amber-200"
                                      }`}
                                    >
                                      {lead.ai_brief_reviewed
                                        ? "Reviewed"
                                        : "Professional Review Required"}
                                    </span>
                                  )}
                                </div>

                                <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-300">
                                  Internal preliminary analysis only. Verify
                                  all facts, assumptions, and planning topics
                                  before presenting anything to a prospect or
                                  client.
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => generateAiBrief(lead.id)}
                                disabled={isGenerating}
                                className="rounded-2xl bg-blue-500 px-6 py-4 text-sm font-black text-white shadow-lg transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-600"
                              >
                                {isGenerating
                                  ? "Generating AI Brief..."
                                  : lead.ai_brief
                                    ? "Regenerate AI Brief"
                                    : "Generate AI Brief"}
                              </button>
                            </div>
                          </div>

                          {!lead.ai_brief ? (
                            <div className="p-6 sm:p-8">
                              <div className="rounded-2xl border-2 border-dashed border-blue-300 bg-white p-7 text-center">
                                <p className="text-xl font-black text-slate-950">
                                  No AI brief has been generated yet.
                                </p>

                                <p className="mx-auto mt-3 max-w-2xl font-medium leading-7 text-slate-600">
                                  Generate a structured internal brief
                                  containing potential planning themes,
                                  missing information, discovery questions,
                                  service fit, risk flags, and the recommended
                                  next action.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-6 p-6 sm:p-8">
                              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                                <section className="rounded-2xl border-2 border-blue-200 bg-white p-5">
                                  <p className="text-sm font-black uppercase tracking-[0.14em] text-blue-600">
                                    Executive Summary
                                  </p>

                                  <p className="mt-4 font-medium leading-8 text-slate-700">
                                    {lead.ai_brief.executive_summary}
                                  </p>
                                </section>

                                <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 lg:min-w-72">
                                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                                    Generated
                                  </p>

                                  <p className="mt-2 text-sm font-black text-slate-950">
                                    {formatDate(
                                      lead.ai_brief_generated_at,
                                    )}
                                  </p>

                                  <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                                    Review Status
                                  </p>

                                  <p
                                    className={`mt-2 text-sm font-black ${
                                      lead.ai_brief_reviewed
                                        ? "text-emerald-700"
                                        : "text-amber-700"
                                    }`}
                                  >
                                    {lead.ai_brief_reviewed
                                      ? "Reviewed by Wade"
                                      : "Not yet reviewed"}
                                  </p>

                                  {lead.ai_brief_reviewed_at && (
                                    <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
                                      {formatDate(
                                        lead.ai_brief_reviewed_at,
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="grid gap-5 lg:grid-cols-2">
                                <AiList
                                  title="Potential Planning Themes"
                                  items={lead.ai_brief.planning_themes}
                                  emptyMessage="No planning themes were identified."
                                />

                                <AiList
                                  title="Missing Information"
                                  items={lead.ai_brief.missing_information}
                                  emptyMessage="No missing information was identified."
                                />

                                <AiList
                                  title="Discovery Questions"
                                  items={lead.ai_brief.discovery_questions}
                                  emptyMessage="No discovery questions were generated."
                                />

                                <AiList
                                  title="Risk and Complexity Flags"
                                  items={lead.ai_brief.risk_flags}
                                  emptyMessage="No specific risk flags were identified."
                                />
                              </div>

                              <div className="grid gap-5 lg:grid-cols-3">
                                <section className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-5">
                                  <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-700">
                                    Recommended Service
                                  </p>

                                  <p className="mt-3 text-lg font-black leading-7 text-slate-950">
                                    {lead.ai_brief.recommended_service}
                                  </p>
                                </section>

                                <section className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
                                  <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                                    Unity Opportunity
                                  </p>

                                  <p className="mt-3 text-lg font-black capitalize text-slate-950">
                                    {lead.ai_brief.unity_opportunity}
                                  </p>
                                </section>

                                <section className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                                  <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
                                    Recommended Next Action
                                  </p>

                                  <p className="mt-3 font-black leading-7 text-slate-950">
                                    {
                                      lead.ai_brief
                                        .recommended_next_action
                                    }
                                  </p>
                                </section>
                              </div>

                              <section className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
                                <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-800">
                                  Professional Review Notes
                                </p>

                                <p className="mt-3 font-medium leading-8 text-amber-950">
                                  {
                                    lead.ai_brief
                                      .professional_review_notes
                                  }
                                </p>
                              </section>

                              <div className="flex flex-col gap-3 sm:flex-row">
                                {!lead.ai_brief_reviewed ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      markAiBriefReviewed(lead.id)
                                    }
                                    disabled={isReviewing}
                                    className="rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-black text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-400"
                                  >
                                    {isReviewing
                                      ? "Saving Review..."
                                      : "Mark Brief as Reviewed"}
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      markAiBriefUnreviewed(lead.id)
                                    }
                                    disabled={isReviewing}
                                    className="rounded-2xl border-2 border-amber-300 bg-white px-6 py-4 text-sm font-black text-amber-800 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:text-slate-400"
                                  >
                                    {isReviewing
                                      ? "Updating..."
                                      : "Reset to Review Required"}
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    generateAiBrief(lead.id)
                                  }
                                  disabled={isGenerating}
                                  className="rounded-2xl border-2 border-blue-300 bg-white px-6 py-4 text-sm font-black text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-400"
                                >
                                  {isGenerating
                                    ? "Regenerating..."
                                    : "Regenerate Brief"}
                                </button>
                              </div>
                            </div>
                          )}
                        </section>

                        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                          <div className="space-y-6">
                            <section className="rounded-[1.5rem] border-2 border-slate-200 bg-white p-5 sm:p-6">
                              <div className="mb-5">
                                <h3 className="text-xl font-black">
                                  Tax Plan Workflow
                                </h3>

                                <p className="mt-1 text-sm font-medium text-slate-500">
                                  Track the lead from intake through plan
                                  review.
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
                              observations, potential AUM, CPA details, and
                              next actions.
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
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>

        <p className="mt-8 text-sm font-medium leading-6 text-slate-500">
          Protected administrative view. Database access is restricted through
          Supabase Row Level Security and authenticated admin access. AI output
          is preliminary internal analysis and requires professional review.
        </p>
      </section>
    </main>
  );
}