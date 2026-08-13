import React from "react";
import { SidebarWidget } from "./SidebarWidget";

interface SupportItem {
  name: string;
  issue: string;
  time: string;
}

const SUPPORT_ITEMS: SupportItem[] = [
  { name: "Riverside Unified", issue: "Unable to download batch report", time: "3h" },
  { name: "DeKalb Brilliance Academy", issue: "Survey link not received by parents", time: "1d" },
  { name: "Oakwood Middle", issue: "Incorrect grade band assigned to run", time: "2d" },
];

export function SupportCard() {
  return (
    <SidebarWidget
      title="Support requests"
      badgeCount={3}
      footer={
        <button className="text-[13px] font-semibold text-[#6D28D9] font-secondary hover:underline cursor-pointer">
          Support inbox
        </button>
      }
    >
      <div className="divide-y divide-[#EFEDE8]">
        {SUPPORT_ITEMS.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-3.5 first:pt-3 last:pb-0">
            <div className="flex flex-col pr-2 flex-1">
              <span className="text-[14px] font-semibold text-[#2B2B2B] font-secondary leading-tight">
                {item.name}
              </span>
              <span className="text-[12px] font-normal text-[#6D6D6D] font-secondary mt-1">
                {item.issue}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-normal text-[#9A9A9A] font-secondary select-none">
                {item.time}
              </span>
              <button className="text-[13px] font-medium text-[#6D28D9] font-secondary hover:underline cursor-pointer">
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </SidebarWidget>
  );
}
