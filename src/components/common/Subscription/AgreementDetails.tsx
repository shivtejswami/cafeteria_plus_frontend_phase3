"use client";

import React from "react";
import Link from "next/link";
import { Building2, CreditCard, Users, ArrowRight } from "lucide-react";

export default function AgreementDetails() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-8 mt-6">
      <h2 className="text-xl font-bold text-[#2B2B2B] mb-6">How your agreement works</h2>

      <div className="flex flex-col gap-6 mb-8">
        <div className="flex gap-4">
          <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-[#F3EEFA] flex items-center justify-center text-[#5B2DA3]">
            <Building2 size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#2B2B2B] mb-1">District-wide agreement</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              This agreement covers the schools included in it; those schools do not pay separately. Each school uses the Cafeteria Pulse survey platform under the district's agreement.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-[#F3EEFA] flex items-center justify-center text-[#5B2DA3]">
            <CreditCard size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#2B2B2B] mb-1">Billing is handled externally by SFWG</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              The platform tracks subscription status; no payments or checkout are processed here. Your agreement and renewal are managed directly with SFWG.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-[#F3EEFA] flex items-center justify-center text-[#5B2DA3]">
            <Users size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#2B2B2B] mb-1">Coverage changes</h3>
            <p className="text-sm text-[#9A9A9A] leading-relaxed">
              Adding or removing schools from the agreement is arranged with SFWG and handled case-by-case, off-platform. Contact SFWG to adjust your coverage.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-[#E8E6E1]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#2B2B2B]">Schools covered</span>
          <span className="text-sm text-[#9A9A9A]">18 of 18</span>
        </div>
        <Link href="/district/schools" className="flex items-center gap-1.5 text-sm text-[#5B2DA3] font-medium hover:underline">
          View schools
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
