import React from 'react';
import { Info } from 'lucide-react';

export function BillingNoticeCard() {
  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E6E1] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex items-start gap-2.5 font-sans">
      <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
      <p className="text-[12px] text-[#6D6D6D] font-secondary leading-snug">
        Billing is tracked here; invoicing is handled externally. No payments are processed in the platform.
      </p>
    </div>
  );
}
