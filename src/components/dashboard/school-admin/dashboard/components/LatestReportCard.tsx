'use client';

import Link from 'next/link';
import type { SchoolAdminReport } from '@/lib/schoolAdminData';
import { useToast } from '@/components/dashboard/ToastContext';
import { barWidthClass } from '@/utils/barWidth';

export default function LatestReportCard({ report }: { report: SchoolAdminReport }) {
  const { toast } = useToast();
  if (!report) return null;

  const responseRate = Math.round((report.responseCount / report.targetCount) * 100);

  if (report.status === 'under-review') {
    return (
      <div className="rounded-2xl p-4 sm:p-6 h-full flex flex-col bg-white border border-line shadow-card">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gold-100">
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-time-line text-[18px] text-gold"></i>
            </span>
          </div>
          <div>
            <p className="text-[15px] font-semibold text-ink">
              Report under review
            </p>
            <p className="text-[12px] text-subtle">
              {report.gradeBand} &middot; {report.period}
            </p>
          </div>
        </div>

        <div className="rounded-xl p-4 mb-5 flex items-start gap-3 bg-[#F4F6F2] border border-[#E8E6E1]">
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-sage">
            <i className="ri-information-line"></i>
          </span>
          <p className="text-[13px] text-ink">
            Results are being processed by SFWG. Check back soon for the final report.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-auto pt-1">
          <button
            onClick={() => toast('neutral', 'Report is currently under review')}
            className="inline-flex items-center gap-1.5 rounded-full h-10 px-5 text-[14px] font-semibold whitespace-nowrap opacity-50 cursor-not-allowed bg-sage text-white"
          >
            Open report
          </button>
          <button
            onClick={() => toast('success', `${report.gradeBand} ${report.period} report PDF downloaded`)}
            className="inline-flex items-center gap-1.5 rounded-full h-10 px-5 text-[14px] font-medium whitespace-nowrap transition-all duration-150 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage-50 text-ink"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-download-2-line"></i>
            </span>
            PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 sm:p-6 h-full flex flex-col bg-white border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04),0px_8px_24px_0px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-leaf-50">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-file-chart-line text-[18px] text-sage"></i>
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold truncate text-[#2B2B2B]">
            {report.period}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-surface-100 text-muted">
              {report.gradeBand}
            </span>
            {report.isSmallSample && (
              <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-gold-100 text-gold">
                Small sample
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-[12px] font-medium uppercase tracking-wider mb-2 text-subtle">
          Responses
        </p>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-[26px] sm:text-[32px] font-semibold leading-none text-ink">
            {report.responseCount}
          </span>
          <span className="text-[16px] text-subtle">
            / {report.targetCount}
          </span>
          <span className="text-[14px] font-semibold ml-1 text-gold">
            {responseRate}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden bg-sage-100">
          <div
            className={`h-full rounded-full transition-all duration-500 bg-sage ${barWidthClass(responseRate)}`}
          />
        </div>
      </div>

      {report.publishedDate && (
        <p className="text-[13px] mb-4 text-subtle">
          Published {report.publishedDate}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-auto pt-1">
        <Link
          href={`/school/reports/${report.id}`}
          className="inline-flex items-center gap-1.5 rounded-full h-10 px-5 text-[14px] font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage text-white"
        >
          Open report
        </Link>
        <button
          type="button"
          onClick={() => toast('success', `${report.gradeBand} ${report.period} report PDF downloaded`)}
          className="inline-flex items-center gap-1.5 rounded-full h-10 px-5 text-[14px] font-medium whitespace-nowrap transition-all duration-150 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage-50 text-ink cursor-pointer"
        >
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-download-2-line"></i>
          </span>
          PDF
        </button>
      </div>
    </div>
  );
}