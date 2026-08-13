"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { AttentionDot } from "@/components/dashboard/district/shared/AttentionDot";

export default function SubscriptionStatus() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-[#2B2B2B] mb-1">Subscription status</h2>
          <p className="text-sm text-[#9A9A9A]">Your district agreement with SFWG</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E3F5E3] rounded-full text-xs font-medium text-[#586D4D]">
          <AttentionDot className="bg-[#586D4D]" />
          Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-6 mb-8">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#9A9A9A]">Plan</span>
          <span className="text-sm font-semibold text-[#2B2B2B]">Annual district agreement</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#9A9A9A]">Status</span>
          <span className="text-sm font-semibold text-[#2B2B2B]">Active</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#9A9A9A]">Renewal date</span>
          <span className="text-sm font-semibold text-[#2B2B2B]">5 January 2027</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#9A9A9A]">Current term</span>
          <span className="text-sm font-semibold text-[#2B2B2B]">5 January 2026 – 5 January 2027</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#9A9A9A]">Schools covered</span>
          <span className="text-sm font-semibold text-[#2B2B2B]">18 schools</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#9A9A9A]">Billing</span>
          <span className="text-sm font-semibold text-[#2B2B2B]">District agreement (all schools)</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-[#E8E6E1]">
        <p className="text-xs text-[#6D6D6D] mb-2 sm:mb-0">This subscription covers all schools in your district.</p>
        <p className="text-xs text-[#9A9A9A]">Billing is handled by SFWG. To make changes or ask about your subscription, contact support.</p>
      </div>
    </div>
  );
}
