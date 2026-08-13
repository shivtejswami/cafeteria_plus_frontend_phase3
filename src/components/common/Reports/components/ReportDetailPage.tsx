'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReportHeader from '@/components/common/Reports/components/ReportHeader';
import ReportSectionNav from '@/components/common/Reports/components/ReportSectionNav';
import ReportOverview from '@/components/common/Reports/components/ReportOverview';
import ReportScores from '@/components/common/Reports/components/ReportScores';
import ReportInsights from '@/components/common/Reports/components/ReportInsights';
import ReportTopItems from '@/components/common/Reports/components/ReportTopItems';
import ReportComments from '@/components/common/Reports/components/ReportComments';
import ReportParticipation from '@/components/common/Reports/components/ReportParticipation';
import GracePeriodBanner from '@/components/school-admin/common/GracePeriodBanner';
import ReadOnlyBanner from '@/components/school-admin/common/ReadOnlyBanner';
import { useToast } from '@/components/ToastContext';
import { reportDetailData } from '@/lib/schoolAdminData';
import type { SchoolAdminData } from '@/lib/schoolAdminData';

interface ReportDetailPageProps {
  reportId: string;
  schoolData: SchoolAdminData;
}

export default function ReportDetailPage({ reportId, schoolData }: ReportDetailPageProps) {
  const report = reportDetailData[reportId];
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('overview');

  if (!report || report.status === 'analysing' || report.status === 'under-review') {
    return (
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/school/reports" className="text-[13px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-iris">
            Reports
          </Link>
          <span className="text-[13px] text-subtle">/</span>
          <span className="text-[13px] font-medium text-muted">
            {report ? `${report.gradeBand} · ${report.period}` : 'Not found'}
          </span>
        </div>
        <h1 className="text-[19px] sm:text-[24px] font-semibold leading-tight mb-1 text-ink">
          Report
        </h1>

        {!report ? (
          <div className="rounded-2xl mt-6 py-16 text-center bg-white border border-line shadow-card">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center bg-sage-50">
              <span className="w-7 h-7 flex items-center justify-center text-sage">
                <i className="ri-file-chart-2-line text-[21px] sm:text-[26px]"></i>
              </span>
            </div>
            <p className="text-[16px] font-semibold text-ink">Report not found</p>
            <p className="text-[14px] mt-1 text-subtle">This report may have been removed or is not available yet.</p>
            <Link
              href="/school/reports"
              className="inline-flex items-center rounded-full h-10 px-5 text-[14px] font-semibold mt-4 transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage text-white"
            >
              Back to reports
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl mt-6 py-16 text-center bg-white border border-line shadow-card">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center bg-surface-100">
              <span className="w-7 h-7 flex items-center justify-center text-subtle">
                <i className="ri-time-line text-[21px] sm:text-[26px]"></i>
              </span>
            </div>
            <p className="text-[16px] font-semibold text-ink">Report being prepared</p>
            <p className="text-[14px] mt-1 max-w-md mx-auto text-subtle">
              This report is currently being finalised. Check back once the analysis is complete.
            </p>
            <Link
              href="/school/reports"
              className="inline-flex items-center rounded-full h-10 px-5 text-[14px] font-semibold mt-4 transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage text-white"
            >
              Back to reports
            </Link>
          </div>
        )}
      </div>
    );
  }

  const isReadOnly = schoolData.subscriptionStatus === 'read-only';
  const isGrace = schoolData.subscriptionStatus === 'grace-period' && schoolData.graceDaysRemaining;
  const isSuperseded = report.status === 'superseded';

  function handleDownload() {
    toast('success', `${report!.gradeBand} ${report!.period} report PDF downloaded`);
  }

  return (
    <div>
      {isGrace && (
        <div className="mb-6">
          <GracePeriodBanner daysRemaining={schoolData.graceDaysRemaining!} />
        </div>
      )}
      {isReadOnly && (
        <div className="mb-6">
          <ReadOnlyBanner />
        </div>
      )}

      {report.isLimitedDetail && (
        <div className="rounded-2xl p-4 mb-6 flex items-start gap-3 bg-gold-100 border border-[#f5d89a]">
          <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-gold">
            <i className="ri-error-warning-line text-[18px]"></i>
          </span>
          <div>
            <p className="text-[14px] font-medium text-ink">
              Very small sample — detailed results suppressed
            </p>
            <p className="text-[13px] mt-0.5 text-muted">
              With only {report.responseCount} responses, detailed breakdowns, comparisons, and AI conclusions that could be unreliable or identifying have been hidden. Only high-level participation data is shown.
            </p>
          </div>
        </div>
      )}

      {report.isSmallSample && !report.isLimitedDetail && (
        <div className="rounded-2xl p-4 mb-6 flex items-start gap-3 bg-gold-100 border border-[#f5d89a]">
          <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-gold">
            <i className="ri-error-warning-line text-[18px]"></i>
          </span>
          <div>
            <p className="text-[14px] font-medium text-ink">
              Small sample — results should be treated as directional
            </p>
            <p className="text-[13px] mt-0.5 text-muted">
              With {report.responseCount} responses out of {report.targetCount} enrolled, this sample may not represent all students. Use these findings as indicators, not definitive conclusions.
            </p>
          </div>
        </div>
      )}



      {isSuperseded && (
        <div className="rounded-2xl p-4 sm:p-5 mb-6 flex items-start gap-3.5 bg-[#FAF9F6] border border-[#F0EDE6]">
          <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#6D6D6D]">
            <i className="ri-arrow-go-back-line text-lg"></i>
          </span>
          <div>
            <h4 className="text-[15px] font-bold text-[#2B2B2B]">
              This version has been superseded
            </h4>
            <p className="text-[13px] text-[#6D6D6D] mt-0.5">
              A newer version ({report.supersededByVersion || 'v2'}) is available.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <Link href="/school/reports" className="text-[13px] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-muted">
          Report
        </Link>
        <span className="text-[13px] text-subtle">/</span>
        <span className="text-[13px] font-medium text-ink">
          {report.gradeBand} &middot; {report.period}
        </span>
      </div>

      <div className="mb-6">
        <ReportHeader report={report} onDownload={handleDownload} />
      </div>

      {!report.isLimitedDetail && (
        <>
          <div className="mb-6">
            <ReportSectionNav active={activeSection} onChange={setActiveSection} />
          </div>

          <div className="space-y-8">
            {activeSection === 'overview' && <ReportOverview report={report} />}
            {activeSection === 'scores' && report.concepts.length > 0 && <ReportScores concepts={report.concepts} />}
            {activeSection === 'insights' && report.insights && <ReportInsights insights={report.insights} />}
            {activeSection === 'insights' && !report.insights && (
              <div className="rounded-2xl py-12 text-center bg-white border border-line shadow-card">
                <p className="text-[14px] text-subtle">Insights not available for this report.</p>
              </div>
            )}
            {activeSection === 'top-items' && report.topFavourites.length > 0 && (
              <ReportTopItems favourites={report.topFavourites} leastFavourites={report.topLeastFavourites} />
            )}
            {activeSection === 'top-items' && report.topFavourites.length === 0 && (
              <div className="rounded-2xl py-12 text-center bg-white border border-line shadow-card">
                <p className="text-[14px] text-subtle">Top items data not available for this report.</p>
              </div>
            )}
            {activeSection === 'comments' && report.sentiment && <ReportComments sentiment={report.sentiment} />}
            {activeSection === 'comments' && !report.sentiment && (
              <div className="rounded-2xl py-12 text-center bg-white border border-line shadow-card">
                <p className="text-[14px] text-subtle">Comments and sentiment data not available for this report.</p>
              </div>
            )}
            {activeSection === 'participation' && (
              <ReportParticipation
                responseCount={report.responseCount}
                targetCount={report.targetCount}
                responseRate={report.responseRate}
                gradeBreakdown={report.gradeBreakdown}
              />
            )}
          </div>
        </>
      )}

      {report.isLimitedDetail && (
        <div className="space-y-6">
          <div className="rounded-2xl py-16 text-center bg-white border border-line shadow-card">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center bg-surface-100">
              <span className="w-7 h-7 flex items-center justify-center text-subtle">
                <i className="ri-file-reduce-line text-[21px] sm:text-[26px]"></i>
              </span>
            </div>
            <p className="text-[15px] font-semibold text-ink">Detailed results unavailable</p>
            <p className="text-[14px] mt-1 max-w-md mx-auto text-subtle">
              Detailed breakdowns, comparisons, and AI conclusions are suppressed when fewer than 10 students respond, to protect reliability and anonymity.
            </p>
          </div>

          <ReportParticipation
            responseCount={report.responseCount}
            targetCount={report.targetCount}
            responseRate={report.responseRate}
            gradeBreakdown={report.gradeBreakdown}
          />
        </div>
      )}

      {!report.isLimitedDetail && (
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row sm:items-center justify-between flex-wrap gap-3 border-line">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Link
              href="/school/reports/year-over-year"
              className="inline-flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2 rounded-full h-9 px-4 text-[13px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-sage-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage-50 border border-[#D6E0D2] text-sage-900"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-line-chart-line text-[14px]"></i>
              </span>
              Year-over-year comparison
            </Link>
            <Link
              href="/school/reports/benchmarks"
              className="inline-flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2 rounded-full h-9 px-4 text-[13px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-sage-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage-50 border border-[#D6E0D2] text-sage-900"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-bar-chart-2-line text-[14px]"></i>
              </span>
              Benchmarks
            </Link>
          </div>
          <p className="text-[12px] text-subtle">
            Reports are available as PDF. Figures match the downloadable report.
          </p>
        </div>
      )}
    </div>
  );
}