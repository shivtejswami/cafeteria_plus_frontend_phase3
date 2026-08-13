'use client';

import Link from 'next/link';

export default function GracePeriodBanner({ daysRemaining }: { daysRemaining: number }) {
  return (
    <div className="rounded-2xl p-4 mb-5 sm:mb-6 flex items-start sm:items-center justify-between flex-wrap gap-3 bg-[#fff9f0] border border-[#f5d89a]">
      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
        <span className="w-6 h-6 flex items-center justify-center shrink-0">
          <i className="ri-error-warning-line text-[18px] text-gold"></i>
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-ink">
            Your subscription renewal is pending
          </p>
          <p className="text-[12px] sm:text-[13px] text-muted">
            Full access continues during the grace period — {daysRemaining} days remaining. Renew to keep everything running.
          </p>
        </div>
      </div>
      <Link
        href="/school/subscription"
        className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-full h-10 px-5 text-[14px] font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 bg-gold text-white"
      >
        Renew now
      </Link>
    </div>
  );
}