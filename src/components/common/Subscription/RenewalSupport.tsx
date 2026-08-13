"use client";

import React from "react";
import { CheckCircle2, Headphones, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function RenewalSupport() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-8 mt-6 mb-12">
      <div className="bg-[#E3F5E3] border border-[#B8D8B8] rounded-xl p-4 flex gap-3 mb-8">
        <CheckCircle2 className="text-[#586D4D] mt-0.5 flex-shrink-0" size={18} />
        <div>
          <h3 className="font-semibold text-[#2B2B2B] text-sm">Subscription active</h3>
          <p className="text-sm text-[#6D6D6D] mt-0.5">
            Your district agreement is active through 5 January 2027. Full access continues.
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-[#2B2B2B] mb-4">Renewal & support</h2>

      <p className="text-sm text-[#9A9A9A] leading-relaxed mb-4">
        Your subscription renews on <span className="font-semibold text-[#2B2B2B]">5 January 2027</span>. SFWG will send renewal reminders by email ahead of the renewal date.
      </p>

      <p className="text-sm text-[#9A9A9A] leading-relaxed mb-6">
        For renewals, billing questions, coverage adjustments, or any other subscription enquiries, contact SFWG support directly.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Link href="/district/help/contact" className="text-[#545454]">
          <Button variant="outline" className="px-5 h-10 gap-2 cursor-pointer bg-[#F2F5F0] border-border text-[#545454] hover:bg-gray-50 rounded-full font-medium">
            <Headphones size={16} />
            Contact support
          </Button>
        </Link>
<Link href="mailto:partnerships@schoolfoodwellnessgroup.org">
        <Button variant="outline" className="px-5 h-10 gap-2 cursor-pointer bg-[#F1EFEA] border-border text-[#545454] hover:bg-gray-50 rounded-full font-medium">
          <Mail size={16} />
          partnerships@schoolfoodwellnessgroup.org
        </Button>
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-[#989898]">
          Billing and invoicing are handled externally by SFWG. No payment or checkout is available in this portal.
        </p>
      </div>
    </div>
  );
}
