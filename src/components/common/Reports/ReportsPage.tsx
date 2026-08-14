'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ReportsFilterBar from '@/components/common/Reports/components/ReportsFilterBar';
import ReportsTable from '@/components/common/Reports/components/ReportsTable';
import MarkForReviewModal from '@/components/common/Reports/components/MarkForReviewModal';
import CircularProgress from '@/components/school-admin/common/CircularProgress';
import GracePeriodBanner from '@/components/school-admin/common/GracePeriodBanner';
import ReadOnlyBanner from '@/components/school-admin/common/ReadOnlyBanner';
import EmptyStateToggle from '@/components/ui/EmptyStateToggle';
import { useToast } from '@/components/ToastContext';
import { reportsListData } from '@/lib/schoolAdminData';
import type { ReportListItem, ReportStatus } from '@/lib/schoolAdminData';
import type { SchoolAdminData } from '@/lib/schoolAdminData';

interface ReportsPageProps {
  schoolData: SchoolAdminData;
}

export default function ReportsPage({ schoolData }: ReportsPageProps) {
  const isReadOnly = schoolData.subscriptionStatus === 'read-only';
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [gradeBandFilter, setGradeBandFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [reviewReportId, setReviewReportId] = useState<string | null>(null);
  // Reports the user has flagged this session — they move to "under review",
  // which locks viewing until SFWG finalises them again.
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);

  const allReports = useMemo<ReportListItem[]>(() => {
    return reportsListData.map(r =>
      markedForReview.includes(r.id) ? { ...r, status: 'under-review' as ReportStatus } : r
    );
  }, [markedForReview]);

  const latestReport = useMemo(() => {
    const published = allReports.filter(r => r.status === 'published');
    if (published.length === 0) return null;
    return published.sort((a, b) => {
      if (!a.publishedDate || !b.publishedDate) return 0;
      return b.publishedDate.localeCompare(a.publishedDate);
    })[0];
  }, [allReports]);

  const filteredReports = useMemo(() => {
    let result = [...allReports];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.gradeBand.toLowerCase().includes(q) ||
        r.period.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        r.version.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }

    if (gradeBandFilter !== 'all') {
      result = result.filter(r => r.gradeBand === gradeBandFilter);
    }

    if (periodFilter !== 'all') {
      result = result.filter(r => r.period === periodFilter);
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => {
        const keyA = a.publishedDate || a.period || '';
        const keyB = b.publishedDate || b.period || '';
        return keyB.localeCompare(keyA);
      });
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => {
        const keyA = a.publishedDate || a.period || '';
        const keyB = b.publishedDate || b.period || '';
        return keyA.localeCompare(keyB);
      });
    } else if (sortBy === 'grade-band') {
      result.sort((a, b) => a.gradeBand.localeCompare(b.gradeBand));
    }

    return result;
  }, [allReports, searchQuery, statusFilter, gradeBandFilter, periodFilter, sortBy]);

  function handleDownload(reportId: string) {
    const report = reportsListData.find(r => r.id === reportId);
    const name = report ? `${report.gradeBand} ${report.period}` : 'report';
    toast('success', `${name} report PDF downloaded`);
  }

  function handleConfirmMarkForReview() {
    if (!reviewReportId) return;
    const report = reportsListData.find(r => r.id === reviewReportId);
    const name = report ? `${report.gradeBand} ${report.period}` : 'Report';
    setMarkedForReview(ids => (ids.includes(reviewReportId) ? ids : [...ids, reviewReportId]));
    setReviewReportId(null);
    toast('success', `${name} marked for review — SFWG will take it from here`);
  }

  return (
    <div>
      {schoolData.subscriptionStatus === 'grace-period' && schoolData.graceDaysRemaining && (
        <div className="mb-6">
          <GracePeriodBanner daysRemaining={schoolData.graceDaysRemaining} />
        </div>
      )}
      {schoolData.subscriptionStatus === 'read-only' && (
        <div className="mb-6">
          <ReadOnlyBanner />
        </div>
      )}

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <p className="text-[14px] font-semibold text-[#2B2B2B]">
          {reportsListData.length} reports
        </p>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 shrink-0">
          <Link
            href="/school/reports/survey-to-survey"
            className="inline-flex w-full sm:w-auto justify-center sm:justify-start items-center gap-1.5 rounded-full px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-medium whitespace-nowrap bg-[#F2F5F0] border border-[#D6E0D2] text-[#586D4D] focus:outline-none hover:bg-[#e6ebe3] transition-colors"
          >
            <svg width="15" height="18" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-4 flex-shrink-0">
              <path d="M3.7004 5.25V14.5833H13.0304V15.75H2.53415V5.25H3.7004ZM12.6222 7.175L13.4502 7.99167L10.1148 11.3283L8.3654 9.57833L5.86962 12.075L5.04159 11.2583L8.3654 7.92167L10.1148 9.67167L12.6222 7.175Z" fill="#586D4D"/>
            </svg>
            <span>Survey to survey comparison</span>
          </Link>
          <Link
            href="/school/reports/benchmarks"
            className="inline-flex w-full sm:w-auto justify-center sm:justify-start items-center gap-1.5 rounded-full px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-medium whitespace-nowrap bg-[#F2F5F0] border border-[#D6E0D2] text-[#586D4D] focus:outline-none hover:bg-[#e6ebe3] transition-colors"
          >
            <svg width="15" height="18" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-4 flex-shrink-0">
              <path d="M2.16095 11.0833H5.6597V15.75H2.16095V11.0833ZM10.3247 8.16667H13.8235V15.75H10.3247V8.16667ZM6.24282 5.25H9.74157V15.75H6.24282V5.25ZM3.3272 12.25V14.5833H4.49345V12.25H3.3272ZM7.40907 6.41667V14.5833H8.57532V6.41667H7.40907ZM11.4909 9.33333V14.5833H12.6572V9.33333H11.4909Z" fill="#586D4D"/>
            </svg>
            <span>Benchmarks</span>
          </Link>
        </div>
      </div>

      {/* Latest report highlight card */}
      {latestReport && (
        <div className="mb-5 sm:mb-6 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 bg-white border border-sage-200 shadow-[0_1px_2px_rgba(0,0,0,0.04),_0_8px_24px_rgba(88,109,77,0.08)] overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 sm:gap-4">
            <div className="flex items-center gap-3 min-w-0 sm:flex-1">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-leaf-50"
            >
              <span className="w-5 h-5 flex items-center justify-center">
                <i className="ri-file-chart-2-line text-[18px] text-sage"></i>
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[15px] font-semibold whitespace-nowrap text-ink"
                >
                  {latestReport.period}
                </p>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold flex-shrink-0 bg-leaf-50 text-sage"
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-sage"></span>
                  Latest report
                </span>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold flex-shrink-0 bg-iris-50 text-iris"
                >
                  {latestReport.gradeBand}
                </span>
                {latestReport.isSmallSample && (
                  <span className="inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-semibold flex-shrink-0 bg-gold-100 text-gold"
                  >
                    Small sample
                  </span>
                )}
              </div>
              <p className="text-[12px] mt-0.5 text-subtle">
                Published {latestReport.publishedDate}
              </p>
            </div>
            </div>

            <div className="hidden lg:block w-px h-10 shrink-0 bg-line" />

            <div className="flex items-center justify-between sm:justify-start gap-4 shrink-0">
              <div className="flex items-baseline gap-2 sm:px-3">
                <span className="text-[22px] sm:text-[28px] font-bold leading-none text-ink"
                >
                  {latestReport.responseCount}
                </span>
                <span className="text-[15px] font-medium leading-none text-subtle"
                >
                  / {latestReport.targetCount}
                </span>
                <span className="text-[12px] font-medium leading-none ml-1 text-faint"
                >
                  responses
                </span>
              </div>

              <CircularProgress
                percentage={Math.round((latestReport.responseCount! / latestReport.targetCount) * 100)}
                size={84}
                strokeWidth={8}
              />
            </div>

            <div className="flex w-full sm:w-auto items-center gap-2 shrink-0">
              <Link
                href={`/school/reports/${latestReport.id}`}
                className="inline-flex flex-1 sm:flex-none justify-center items-center rounded-full h-9 px-4 text-[13px] font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage text-white shadow-sage"
              >
                Open report
              </Link>
              <button
                onClick={() => handleDownload(latestReport.id)}
                className="inline-flex flex-1 sm:flex-none justify-center items-center gap-1.5 rounded-full h-9 px-4 text-[13px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-[#eaf0e7] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-[#F4F7F1] border border-[#DCE4D6] text-[#586D4D]"
                aria-label={`Download PDF for ${latestReport.gradeBand} ${latestReport.period}`}
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-download-2-line"></i>
                </span>
                PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="mb-5">
        <ReportsFilterBar
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={(s) => setStatusFilter(s)}
          gradeBandFilter={gradeBandFilter}
          onGradeBandChange={setGradeBandFilter}
          periodFilter={periodFilter}
          onPeriodChange={setPeriodFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* Reports list */}
      <EmptyStateToggle
        isEmpty={reportsListData.length === 0}
        emptyIcon="ri-file-chart-2-line"
        emptyTitle="No reports yet"
        emptyDescription="Your first report appears here after a survey closes and is analysed."
      >
        {reportsListData.length === 0 ? (
          <div className="rounded-2xl p-12 text-center bg-white border border-line shadow-card"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center bg-[#F1EFEA]"
            >
              <span className="w-6 h-6 flex items-center justify-center text-[#9A9A9A]">
                <i className="ri-file-chart-2-line text-2xl"></i>
              </span>
            </div>
            <h3 className="text-[16px] font-semibold mb-1 text-ink"
            >
              No reports yet
            </h3>
            <p className="text-[14px] text-muted-500"
            >
              Your first report appears here after a survey closes and is analysed.
            </p>
          </div>
        ) : (
          <ReportsTable
            reports={filteredReports}
            isReadOnly={isReadOnly}
            onDownload={handleDownload}
            onMarkForReview={setReviewReportId}
          />
        )}
      </EmptyStateToggle>

      {/* Constraint notes */}
      <div className="mt-5 mb-2 flex items-start gap-2.5">
        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-subtle"
        >
          <i className="ri-information-line text-[15px]"></i>
        </span>
        <p className="text-[12px] leading-relaxed text-muted-500"
        >
          Reports are available as PDF. Reports can&apos;t be shared with public links. While a report is under review, you&apos;ll see its neutral status until it&apos;s finalised.
        </p>
      </div>

      <MarkForReviewModal
        open={reviewReportId !== null}
        onConfirm={handleConfirmMarkForReview}
        onCancel={() => setReviewReportId(null)}
      />
    </div>
  );
}