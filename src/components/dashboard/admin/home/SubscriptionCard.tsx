import React from "react";
import { SidebarWidget } from "./SidebarWidget";

interface SubscriptionItem {
  name: string;
  type: string;
  date: string;
  daysLeft: number;
}

const SUBSCRIPTIONS: SubscriptionItem[] = [
  { name: "Riverside Unified", type: "District", date: "14 Aug 2026", daysLeft: 30 },
  { name: "DeKalb Brilliance Academy", type: "Standalone", date: "28 Jul 2026", daysLeft: 13 },
  { name: "Oakwood School District", type: "District", date: "5 Aug 2026", daysLeft: 21 },
];

export function SubscriptionCard() {
  return (
    <SidebarWidget title="Expiring subscriptions" badgeCount={3}>
      <div className="divide-y divide-[#EFEDE8]">
        {SUBSCRIPTIONS.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-3.5 first:pt-3 last:pb-0">
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-[#2B2B2B] font-secondary leading-tight">
                {item.name}
              </span>
              <span className="text-[11px] font-normal text-[#9A9A9A] font-secondary mt-1">
                {item.type} • {item.date}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center text-[11px] font-bold font-sans bg-[#FFF1DD] text-[#8A4B04] px-2 py-0.5 rounded-full select-none">
                {item.daysLeft}d
              </span>
              <button className="text-[13px] font-medium text-[#6D28D9] font-secondary hover:underline cursor-pointer">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </SidebarWidget>
  );
}
