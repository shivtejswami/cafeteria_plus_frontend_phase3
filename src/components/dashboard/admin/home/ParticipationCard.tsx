import React from "react";
import { SidebarWidget } from "./SidebarWidget";
import { GradeBadge, GradeBandType } from "./ReportsTable";

interface ParticipationItem {
  name: string;
  gradeBand: GradeBandType;
  percent: number;
  numerator: number;
  denominator: number;
  timeLeft: string;
}

const PARTICIPATION_ITEMS: ParticipationItem[] = [
  { name: "Lincoln High School", gradeBand: "9-12", percent: 18, numerator: 24, denominator: 130, timeLeft: "2d left" },
  { name: "Sample Middle School", gradeBand: "6-8", percent: 22, numerator: 45, denominator: 205, timeLeft: "3d left" },
  { name: "Riverside Elementary", gradeBand: "K-5", percent: 15, numerator: 18, denominator: 120, timeLeft: "1d left" },
];

export function ParticipationCard() {
  return (
    <SidebarWidget title="Low participation" badgeCount={3}>
      <div className="divide-y divide-[#EFEDE8]">
        {PARTICIPATION_ITEMS.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-3.5 first:pt-3 last:pb-0">
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-[#2B2B2B] font-secondary leading-tight">
                {item.name}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center justify-center text-[11px] font-semibold font-sans px-2 py-0.5 rounded-full select-none bg-[#F0EAFB] text-[#4D1C9A]">
                  {item.gradeBand}
                </span>
                <span className="text-[11px] font-normal text-[#9A9A9A] font-secondary">
                  {item.percent}% · {item.numerator} of {item.denominator}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-normal text-[#9A9A9A] font-secondary select-none">
                {item.timeLeft}
              </span>
              <button className="text-[13px] font-medium text-[#6D28D9] font-secondary hover:underline cursor-pointer">
                View survey
              </button>
            </div>
          </div>
        ))}
      </div>
    </SidebarWidget>
  );
}
