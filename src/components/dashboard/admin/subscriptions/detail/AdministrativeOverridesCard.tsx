import React from 'react';
import { OverrideItem } from '../types';

interface AdministrativeOverridesCardProps {
  overrides?: OverrideItem[];
  onApplyOverride: () => void;
}

export function AdministrativeOverridesCard({
  overrides = [],
  onApplyOverride,
}: AdministrativeOverridesCardProps) {
  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E6E1] p-4 sm:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] space-y-3 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
        <h3 className="text-[15px] font-bold text-[#1F1F1F] font-sans leading-tight">
          Administrative overrides
        </h3>

        <button
          type="button"
          onClick={onApplyOverride}
          className="w-full sm:w-auto bg-[#F2F5F0] border border-[#D6E0D2] text-[#3A4A32] hover:bg-[#E5EAE2] text-xs font-semibold px-4 py-2 sm:py-1.5 rounded-full transition-colors cursor-pointer shadow-sm shrink-0 flex items-center justify-center text-center"
        >
          Apply override
        </button>
      </div>

      {overrides.length === 0 ? (
        <p className="text-[12px] text-[#6D6D6D] font-secondary leading-relaxed pt-0.5">
          No overrides have been applied to this subscription.
        </p>
      ) : (
        <div className="space-y-2 pt-1">
          {overrides.map((ov) => (
            <div
              key={ov.id}
              className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl p-3 text-xs"
            >
              <div className="font-bold text-[#2B2B2B]">{ov.title}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Applied by {ov.appliedBy} · {ov.appliedDate}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
