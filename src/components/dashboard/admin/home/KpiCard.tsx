import React from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  caption: string;
  icon: React.ReactNode;
}

export function KpiCard({ title, value, caption, icon }: KpiCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between h-[130px] w-full">
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-semibold tracking-wider text-[#9A9A9A] font-sans uppercase">
          {title}
        </span>
        {icon}
      </div>
      <div>
        <div className="text-[28px] font-bold text-[#2B2B2B] font-sans leading-none">
          {value}
        </div>
        <div className="text-[12px] font-normal text-[#9A9A9A] font-secondary mt-1">
          {caption}
        </div>
      </div>
    </div>
  );
}
