'use client';

import { useReadOnlyMode } from '@/components/dashboard/school-admin/common/ReadOnlyModeContext';

export default function ReadOnlyModeBar() {
  const { isReadOnly } = useReadOnlyMode();

  if (!isReadOnly) {
    return null;
  }

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 shrink-0 text-center bg-[#fef2f2] border-b border-[#fecaca]"
    >
      <span className="w-4 h-4 flex items-center justify-center shrink-0 text-[#dc2626]">
        <i className="ri-lock-line text-[14px]"></i>
      </span>
      <span className="text-[13px] font-semibold text-[#991b1b]">
        Subscription Ended — Read-Only Mode
      </span>
      <span className="text-[11px] sm:text-[12px] text-[#b91c1c]">
        Creating and editing are disabled. Your surveys, reports, and data remain fully accessible.
      </span>
    </div>
  );
}