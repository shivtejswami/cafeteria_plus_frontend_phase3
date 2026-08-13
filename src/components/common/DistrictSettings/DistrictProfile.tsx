"use client";

import React from "react";
import { Lock, Mail } from "lucide-react";

export default function DistrictProfile() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-8 mt-6">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-[#1F1F1F] mb-1">District profile</h2>
          <p className="text-sm text-[#7A7A7A]">For reference — these fields are managed by SFWG.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F9F9F9] border border-[#E8E6E1] rounded-full text-xs font-medium text-[#7A7A7A]">
          <Lock size={12} />
          SFWG-managed
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-6 mb-8">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#7A7A7A]">District name</span>
          <span className="text-sm font-medium text-[#1F1F1F]">North Hills School District</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#7A7A7A]">Region</span>
          <span className="text-sm font-medium text-[#1F1F1F]">Midwest</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#7A7A7A]">State</span>
          <span className="text-sm font-medium text-[#1F1F1F]">Illinois</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#7A7A7A]">Timezone</span>
          <span className="text-sm font-medium text-[#1F1F1F]">America/Chicago (UTC-6)</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#7A7A7A]">Schools</span>
          <span className="text-sm font-medium text-[#1F1F1F]">18</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#7A7A7A]">Cafeterias</span>
          <span className="text-sm font-medium text-[#1F1F1F]">24</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#7A7A7A]">Enrolled grades</span>
          <span className="text-sm font-medium text-[#1F1F1F]">K–12</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-6 border-t border-[#E8E6E1] text-xs text-[#7A7A7A]">
        <Mail size={14} className="flex-shrink-0" />
        <span>
          To update district profile information, contact <span className="font-medium text-[#545454]">partnerships@schoolfoodwellnessgroup.org</span>
        </span>
      </div>
    </div>
  );
}
