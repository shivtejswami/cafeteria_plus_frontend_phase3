import { HelpNav } from "@/components/dashboard/district/help/HelpNav";

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <HelpNav />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
