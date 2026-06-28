import Sidebar from "@/components/mission-control/Sidebar";

export default function MissionControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="min-h-screen flex-1 overflow-x-hidden">
          {children}
        </section>
      </div>
    </main>
  );
}