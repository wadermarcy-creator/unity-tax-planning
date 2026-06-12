"use client";

import { useEffect, useState } from "react";
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

export default function AdminLeadsPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<TaxLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null);

  async function loadLeads() {
    setIsLoading(true);
    setMessage("");

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

    const { error } = await supabase
      .from("tax_leads")
      .update({ status: newStatus })
      .eq("id", leadId);

    if (error) {
      console.error(error);
      setMessage("Could not update lead status.");
      return;
    }

    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
  }

  async function updateUnityOpportunity(
    leadId: string,
    newOpportunity: string
  ) {
    setMessage("");

    const { error } = await supabase
      .from("tax_leads")
      .update({ unity_opportunity: newOpportunity })
      .eq("id", leadId);

    if (error) {
      console.error(error);
      setMessage("Could not update Unity opportunity.");
      return;
    }

    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId
          ? { ...lead, unity_opportunity: newOpportunity }
          : lead
      )
    );
  }

  async function updateWorkflowField(
    leadId: string,
    field: WorkflowField,
    value: boolean
  ) {
    setMessage("");

    const { error } = await supabase
      .from("tax_leads")
      .update({ [field]: value })
      .eq("id", leadId);

    if (error) {
      console.error(error);
      setMessage("Could not update workflow item.");
      return;
    }

    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId ? { ...lead, [field]: value } : lead
      )
    );
  }

  function updateLocalNotes(leadId: string, notes: string) {
    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId ? { ...lead, admin_notes: notes } : lead
      )
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

    const { error } = await supabase
      .from("tax_leads")
      .update({ admin_notes: lead.admin_notes || "" })
      .eq("id", leadId);

    if (error) {
      console.error(error);
      setMessage("Could not save notes.");
      setSavingLeadId(null);
      return;
    }

    setSavingLeadId(null);
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

      if (session.user.email !== "wadermarcy@gmail.com") {
        await supabase.auth.signOut();
        router.push("/admin/login");
        return;
      }

      loadLeads();
    }

    checkAdminSession();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-300">
              Unity Tax Planning
            </p>

            <h1 className="text-4xl font-bold tracking-tight">
              Lead Dashboard
            </h1>

            <p className="mt-2 text-slate-300">
              View, manage, and track Tax Blind Spot Review submissions.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadLeads}
              className="rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white hover:bg-blue-400"
            >
              Refresh Leads
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-600 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Log Out
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-xl bg-red-100 p-4 text-sm font-semibold text-red-700">
            {message}
          </div>
        )}

        <div className="mb-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-2xl bg-white p-5 text-slate-950">
            <p className="text-sm font-semibold text-slate-500">Total Leads</p>
            <p className="mt-2 text-3xl font-bold">{leads.length}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 text-slate-950">
            <p className="text-sm font-semibold text-slate-500">A Leads</p>
            <p className="mt-2 text-3xl font-bold">
              {leads.filter((lead) => lead.lead_grade === "A Lead").length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 text-slate-950">
            <p className="text-sm font-semibold text-slate-500">
              Business Owners
            </p>
            <p className="mt-2 text-3xl font-bold">
              {leads.filter((lead) => lead.business_owner).length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 text-slate-950">
            <p className="text-sm font-semibold text-slate-500">
              Unity Opportunities
            </p>
            <p className="mt-2 text-3xl font-bold">
              {
                leads.filter(
                  (lead) =>
                    lead.unity_opportunity === "yes" ||
                    lead.unity_opportunity === "maybe"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 text-slate-950">
            <p className="text-sm font-semibold text-slate-500">
              Plans Completed
            </p>
            <p className="mt-2 text-3xl font-bold">
              {leads.filter((lead) => lead.plan_pdf_completed).length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 text-slate-950">
            <p className="text-sm font-semibold text-slate-500">Converted</p>
            <p className="mt-2 text-3xl font-bold">
              {leads.filter((lead) => lead.status === "converted").length}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="rounded-2xl bg-white p-6 text-slate-600">
              Loading leads...
            </div>
          ) : leads.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-slate-600">
              No leads yet.
            </div>
          ) : (
            leads.map((lead) => (
              <article
                key={lead.id}
                className="rounded-2xl bg-white p-6 text-slate-950"
              >
                <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      {new Date(lead.created_at).toLocaleString()}
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      {lead.first_name} {lead.last_name}
                    </h2>

                    <div className="mt-2 flex flex-wrap gap-3 text-sm">
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          {lead.email}
                        </a>
                      )}

                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          {lead.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </label>
                      <select
                        value={lead.status || "new"}
                        onChange={(event) =>
                          updateLeadStatus(lead.id, event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Unity Opportunity
                      </label>
                      <select
                        value={lead.unity_opportunity || "unknown"}
                        onChange={(event) =>
                          updateUnityOpportunity(lead.id, event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold"
                      >
                        {unityOpportunityOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Score
                      </label>
                      <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold">
                        {lead.lead_score} / {lead.lead_grade}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-5 grid gap-4 md:grid-cols-4">
                  <div className="rounded-xl bg-slate-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Income
                    </p>
                    <p className="mt-1 font-semibold">
                      {lead.household_income || "—"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Assets
                    </p>
                    <p className="mt-1 font-semibold">
                      {lead.investable_assets || "—"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      CPA
                    </p>
                    <p className="mt-1 font-semibold">
                      {lead.current_cpa ? "Yes" : "No"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Advisor
                    </p>
                    <p className="mt-1 font-semibold">
                      {lead.current_advisor ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <div className="mb-5 flex flex-wrap gap-2">
                  {lead.business_owner && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                      Business Owner
                    </span>
                  )}

                  {lead.retiring_soon && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                      Retiring Soon
                    </span>
                  )}

                  {lead.charitable_giving && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                      Charitable Giving
                    </span>
                  )}

                  {lead.upcoming_sale && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                      Upcoming Sale
                    </span>
                  )}
                </div>

                <div className="mb-5 rounded-2xl border border-slate-200 p-5">
                  <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        Tax Plan Workflow
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Track the lead from intake to written plan delivery.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-5">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
                      <input
                        type="checkbox"
                        checked={lead.docs_requested}
                        onChange={(event) =>
                          updateWorkflowField(
                            lead.id,
                            "docs_requested",
                            event.target.checked
                          )
                        }
                      />
                      <span>Docs Requested</span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
                      <input
                        type="checkbox"
                        checked={lead.docs_received}
                        onChange={(event) =>
                          updateWorkflowField(
                            lead.id,
                            "docs_received",
                            event.target.checked
                          )
                        }
                      />
                      <span>Docs Received</span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
                      <input
                        type="checkbox"
                        checked={lead.hazel_review_started}
                        onChange={(event) =>
                          updateWorkflowField(
                            lead.id,
                            "hazel_review_started",
                            event.target.checked
                          )
                        }
                      />
                      <span>Hazel Review</span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
                      <input
                        type="checkbox"
                        checked={lead.plan_pdf_completed}
                        onChange={(event) =>
                          updateWorkflowField(
                            lead.id,
                            "plan_pdf_completed",
                            event.target.checked
                          )
                        }
                      />
                      <span>Plan PDF Done</span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
                      <input
                        type="checkbox"
                        checked={lead.review_call_scheduled}
                        onChange={(event) =>
                          updateWorkflowField(
                            lead.id,
                            "review_call_scheduled",
                            event.target.checked
                          )
                        }
                      />
                      <span>Review Scheduled</span>
                    </label>
                  </div>
                </div>

                <div className="mb-5">
                  <p className="mb-2 text-sm font-bold text-slate-700">
                    Biggest Tax Concern
                  </p>
                  <div className="rounded-xl border border-slate-200 p-4 text-slate-700">
                    {lead.biggest_tax_concern || "—"}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Admin Notes
                  </label>

                  <textarea
                    value={lead.admin_notes || ""}
                    onChange={(event) =>
                      updateLocalNotes(lead.id, event.target.value)
                    }
                    className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950"
                    placeholder="Add call notes, follow-up items, CPA details, estimated AUM opportunity, next steps, tax planning observations, etc."
                  />

                  <button
                    onClick={() => saveLeadNotes(lead.id)}
                    disabled={savingLeadId === lead.id}
                    className="mt-3 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {savingLeadId === lead.id ? "Saving..." : "Save Notes"}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Protected admin view. Only approved Unity Tax Planning admin users
          should be able to access this page.
        </p>
      </section>
    </main>
  );
}