import DisclosureFooter from "@/components/DisclosureFooter";
export default function ThankYouPage() {
    
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-20">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-300">
          Submission Received
        </p>

        <h1 className="mb-6 text-5xl font-bold tracking-tight">
          Your Tax Opportunity Scan has been submitted.
        </h1>

        <p className="mb-8 text-xl leading-8 text-slate-300">
          Thank you for sharing your information. The next step is to schedule a short
          tax opportunity call so I can learn more about your situation and determine
          whether there are meaningful planning opportunities worth reviewing.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="https://calendly.com/"
            className="rounded-xl bg-blue-500 px-6 py-4 text-center text-base font-semibold text-white hover:bg-blue-400"
          >
            Schedule My Call
          </a>

          <a
            href="/"
            className="rounded-xl border border-slate-600 px-6 py-4 text-center text-base font-semibold text-white hover:bg-slate-800"
          >
            Back to Home
          </a>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          Tax planning does not include tax preparation, legal services, or accounting
          services unless separately agreed.
        </p>
      </section>
            <DisclosureFooter />
    </main>
  );
}