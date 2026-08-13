'use client';

import type { ReactNode } from 'react';

import { PHASE_CHIP, type Phase } from './types';

/** Compact status strip shown above the detail cards once a survey is no longer collecting. */
export default function StatusSummaryCard({
  phase,
  gradeBand,
  period,
  openedAt,
  closesAt,
  daysRemaining,
  action,
}: {
  phase: Phase;
  gradeBand: string;
  period: string;
  /** Omitted on a draft, which has no collection window yet. */
  openedAt?: string;
  closesAt?: string;
  /** Shown only while the survey is still collecting. */
  daysRemaining?: number;
  /** Optional trailing control, e.g. the share button on a live survey. */
  action?: ReactNode;
}) {
  const chip = PHASE_CHIP[phase];

  return (
    <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-[#FBFAFE] border border-[#EDE7F6] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold bg-white border border-[#E2D5F5] text-[#6D28D9]">
            <i className="ri-group-line text-[13px]"></i>
            {gradeBand}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium bg-white border border-[#E8E6E1] text-[#2B2B2B]">
            <i className="ri-calendar-line text-[13px] text-[#9A9A9A]"></i>
            {period}
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${chip.className}`}>
            {chip.dot && <span className={`w-1.5 h-1.5 rounded-full ${chip.dot}`}></span>}
            {chip.label}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3 text-[12px] sm:text-[13px] text-[#6D28D9]">
          {openedAt && closesAt ? (
            <>
              <span className="inline-flex items-center gap-1.5">
                <i className="ri-calendar-check-line text-[13px]"></i>
                Opened {openedAt}
              </span>
              <span className="text-[#C4B5DB]">&middot;</span>
              <span className="inline-flex items-center gap-1.5">
                <i className="ri-calendar-close-line text-[13px]"></i>
                Closes {closesAt}
              </span>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <i className="ri-calendar-line text-[13px]"></i>
              No schedule set yet
            </span>
          )}
          {daysRemaining !== undefined && (
            <>
              <span className="text-[#C4B5DB]">&middot;</span>
              <span className="font-semibold text-[#D97706]">
                {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
              </span>
            </>
          )}
        </div>
      </div>

      {action}
    </div>
  );
}
