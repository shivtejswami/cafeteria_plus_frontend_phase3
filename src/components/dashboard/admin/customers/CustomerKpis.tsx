"use client";

import React from "react";
import { Building2, ShieldAlert, Home as HomeIcon } from "lucide-react";

export function CustomerKpis() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Total Customers */}
      <div className="bg-white rounded-xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-6 flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[12px] font-bold text-slate-400 font-sans tracking-wide">Total customers</span>
          <div className="text-[32px] font-extrabold text-slate-800 font-sans leading-none pt-2">12</div>
          <span className="text-[12px] text-slate-400 font-medium font-sans block pt-1.5">5 districts • 7 schools</span>
        </div>
        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
          <Building2 className="w-5 h-5" />
        </div>
      </div>

      {/* Active Subscriptions */}
      <div className="bg-white rounded-xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-6 flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[12px] font-bold text-slate-400 font-sans tracking-wide">Active subscriptions</span>
          <div className="text-[32px] font-extrabold text-slate-800 font-sans leading-none pt-2">6</div>
          <span className="text-[12px] text-slate-400 font-medium font-sans block pt-1.5">6 inactive or paused</span>
        </div>
        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
          <ShieldAlert className="w-5 h-5" />
        </div>
      </div>

      {/* Schools Covered */}
      <div className="bg-white rounded-xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-6 flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[12px] font-bold text-slate-400 font-sans tracking-wide">Schools covered</span>
          <div className="text-[32px] font-extrabold text-slate-800 font-sans leading-none pt-2">7</div>
          <span className="text-[12px] text-slate-400 font-medium font-sans block pt-1.5">Across 5 districts</span>
        </div>
        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
          <HomeIcon className="w-5 h-5" />
        </div>
      </div>

    </div>
  );
}
