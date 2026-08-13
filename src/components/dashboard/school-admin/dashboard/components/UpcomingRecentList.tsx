'use client';

import Link from 'next/link';
import EmptyStateToggle from '@/components/ui/EmptyStateToggle';

export interface UpcomingRecentItem {
  label: string;
  detail: string;
  statusLabel?: string;
  statusColor?: string;  // tailwind text-* class
  statusBg?: string;     // tailwind bg-* class
  href: string;
  linkLabel: string;
}

export default function UpcomingRecentList({ upcoming, recent }: { upcoming: UpcomingRecentItem | null; recent: UpcomingRecentItem | null }) {
  const bothEmpty = !upcoming && !recent;

  return (
    <EmptyStateToggle
      isEmpty={bothEmpty}
      emptyIcon="ri-history-line"
      emptyTitle="No upcoming or recent surveys"
      emptyDescription="Upcoming scheduled surveys and recently completed surveys will appear here."
    >
      <div
        className="rounded-2xl p-4 sm:p-6 bg-white border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04),0px_8px_24px_0px_rgba(0,0,0,0.06)]"
      >
        <h3
          className="text-[13px] font-semibold mb-4 text-[#9A9A9A]"
        >
          Upcoming &amp; recent surveys
        </h3>

        <div>
          {upcoming ? (
            <div className="flex items-start justify-between gap-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-[15px] sm:text-[16px] font-medium text-[#2B2B2B]">
                  {upcoming.label}
                </p>
                <p className="text-[13px] sm:text-[14px] mt-1 text-[#9A9A9A]">
                  {upcoming.detail}
                </p>
              </div>
              <Link
                href={upcoming.href}
                className="shrink-0 text-[14px] font-medium whitespace-nowrap transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-1 rounded text-[#6D28D9]"
              >
                {upcoming.linkLabel}
              </Link>
            </div>
          ) : (
            <p className="text-[14px] py-3 text-[#9A9A9A]">
              No upcoming surveys scheduled
            </p>
          )}

          <div className="h-px bg-[#E8E6E1]" />

          {recent ? (
            <div className="flex items-start justify-between gap-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[15px] sm:text-[16px] font-medium text-[#2B2B2B]">
                    {recent.label}
                  </p>
                  {recent.statusLabel && (
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[12px] font-semibold whitespace-nowrap shrink-0 ${recent.statusBg ?? 'bg-[#F1EFEA]'} ${recent.statusColor ?? 'text-[#6D6D6D]'}`}
                    >
                      {recent.statusLabel}
                    </span>
                  )}
                </div>
                <p className="text-[13px] sm:text-[14px] mt-1 text-[#9A9A9A]">
                  {recent.detail}
                </p>
              </div>
              <Link
                href={recent.href}
                className="shrink-0 text-[14px] font-medium whitespace-nowrap transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-1 rounded text-[#6D28D9]"
              >
                {recent.linkLabel}
              </Link>
            </div>
          ) : (
            <p className="text-[14px] py-3 text-[#9A9A9A]">
              No recent surveys
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-t-[#E8E6E1]">
          <Link
            href="/school/surveys"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium whitespace-nowrap transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-1 rounded text-[#6D28D9]"
          >
            View all surveys
            <span className="w-3.5 h-3.5 flex items-center justify-center">
              <i className="ri-arrow-right-line text-[13px]"></i>
            </span>
          </Link>
        </div>
      </div>
    </EmptyStateToggle>
  );
}