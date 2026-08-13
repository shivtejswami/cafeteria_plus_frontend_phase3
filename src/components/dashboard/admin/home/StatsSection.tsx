import React from "react";
import { KpiCard } from "./KpiCard";
import { ClipboardList, Headset, Building2 } from "lucide-react";

export function StatsSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <KpiCard
        title="Open surveys"
        value={34}
        caption="Collecting responses now."
        icon={
          <div className="w-8 h-8 rounded-lg bg-[#F0EAFB] flex items-center justify-center text-[#6D28D9]">
            <ClipboardList className="w-4 h-4" />
          </div>
        }
      />
      <KpiCard
        title="Unresolved support requests"
        value={4}
        caption="Awaiting SFWG response."
        icon={
          <div className="w-8 h-8 rounded-lg bg-[#F0EAFB] flex items-center justify-center text-[#6D28D9]">
            <Headset className="w-4 h-4" />
          </div>
        }
      />
      <KpiCard
        title="Active customers"
        value={128}
        caption="112 schools • 16 districts"
        icon={
          <div className="w-8 h-8 rounded-lg bg-[#E3F5E3] flex items-center justify-center text-[#1D6B1D]">
            <Building2 className="w-4 h-4" />
          </div>
        }
      />
    </div>
  );
}
