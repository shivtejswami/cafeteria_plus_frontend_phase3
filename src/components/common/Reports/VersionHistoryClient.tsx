'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastContext';
import VersionTimeline from '@/components/common/Reports/components/VersionTimeline';
import { versionHistoryData } from '@/lib/versionHistoryData';
import { reportsListData, surveysListData } from '@/lib/schoolAdminData';

interface VersionHistoryClientProps {
  reportId: string;
  context?: 'review' | 'school-admin';
}

export default function VersionHistoryClient({ reportId, context = 'review' }: VersionHistoryClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  // Static lookup — read it during render. Deferring this to an effect made the
  // "no version history" box flash on every visit before the real data landed.
  const report = versionHistoryData[reportId] ?? null;
  const [kebabOpen, setKebabOpen] = useState(false);
  const kebabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (kebabRef.current && !kebabRef.current.contains(e.target as Node)) setKebabOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!report) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          {/* <button
            onClick={() => router.push(context === 'school-admin' ? '/school/reports' : '/reports')}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9] focus-visible:ring-offset-1 rounded px-1 py-0.5 text-iris"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-left-line text-sm"></i>
            </span>
            {context === 'school-admin' ? 'Back to reports' : 'Back to review queue'}
          </button> */}
        </div>
        <div
          className="bg-white rounded-xl p-10 flex flex-col items-center text-center border border-line shadow-card"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-surface-100"
          >
            <span className="w-8 h-8 flex items-center justify-center text-muted">
              <i className="ri-history-line text-2xl"></i>
            </span>
          </div>
          <h3 className="text-[18px] font-semibold mb-2 text-ink">No version history yet</h3>
          <p className="text-[14px] max-w-md leading-relaxed text-muted">
            This report hasn&apos;t been generated, held, or revised yet. History appears once a report is created.
          </p>
          <button
            onClick={() => router.push(context === 'school-admin' ? '/school/reports' : '/reports')}
            className="mt-6 h-10 px-5 rounded-full text-white text-[14px] font-medium whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d28d9] focus-visible:ring-offset-2 bg-sage"
          >
            {context === 'school-admin' ? 'Back to reports' : 'Back to review queue'}
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    published: { label: 'Published', bg: '#e3f5e3', text: '#586d4d' },
    'under-review': { label: 'Under review', bg: '#f0eafb', text: '#6d28d9' },
    superseded: { label: 'Superseded', bg: '#f1efea', text: '#6d6d6d' },
  };

  const status = statusConfig[report.status];

  return (
    <div className="space-y-5 pb-12">
      {/* Breadcrumb Header */}
      <div>
        <div className="flex items-center gap-1.5 text-[13px] text-[#9A9A9A] mb-2" aria-label="Breadcrumb">
          <button
            onClick={() => router.push(context === 'school-admin' ? '/school/reports' : '/reports')}
            className="hover:underline transition-colors hover:text-[#2B2B2B]"
          >
            Reports
          </button>
          <span>/</span>
          <button
            onClick={() => router.push(`/school/reports/${reportId}`)}
            className="hover:underline transition-colors hover:text-[#2B2B2B]"
          >
            {report.gradeBand} &middot; {report.period}
          </button>
          <span>/</span>
          <span className="text-[#2B2B2B] font-medium">Version history</span>
        </div>
      </div>

      {/* Main Report Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl sm:text-[22px] font-bold text-[#2B2B2B]">
              {report.schoolName} &mdash; {report.gradeBand} &middot; {report.period}
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF3E0] text-[#E65100]">
              {report.gradeBand}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>
          <p className="text-[13px] text-[#6D6D6D]">
            {report.totalVersions} report versions &middot; current: v{report.currentVersion} ({report.status}) &middot; survey template {report.currentTemplateVersion} &middot; methodology {report.currentMethodologyVersion}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap w-full sm:w-auto">
          <button
            onClick={() => {
              const publishedReport = reportsListData.find(r => r.status === 'published');
              const targetId = publishedReport ? publishedReport.id : 'r1';
              const currentReportRoute = context === 'school-admin' ? `/school/reports/${targetId}` : `/reports/${targetId}`;
              router.push(currentReportRoute);
            }}
            className="h-10 px-5 rounded-full text-white text-[13.5px] font-semibold whitespace-nowrap bg-[#586D4D] hover:bg-[#4a5c41] transition-colors shadow-sm flex-1 sm:flex-none justify-center"
          >
            Open current report
          </button>
          <button
            onClick={() => toast('neutral', 'Downloading current PDF')}
            className="h-10 px-5 rounded-full text-[13.5px] font-medium whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] transition-colors flex-1 sm:flex-none justify-center"
          >
            Download current PDF
          </button>
          <div className="relative shrink-0" ref={kebabRef}>
            <button
              onClick={() => setKebabOpen(!kebabOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#6D6D6D] hover:bg-slate-100 transition-colors"
              aria-label="More actions"
            >
              <i className="ri-more-2-fill text-lg"></i>
            </button>
            {kebabOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-2xl py-1.5 z-30 border border-[#E8E6E1] shadow-lg">
                <button
                  onClick={() => {
                    setKebabOpen(false);
                    const matchingSurvey = surveysListData.surveys.find(
                      s => s.status === 'published' && ((s.reportId && s.reportId === reportId) || (s.gradeBand === report.gradeBand && s.period === report.period))
                    ) || surveysListData.surveys.find(
                      s => (s.reportId && s.reportId === reportId) || (s.gradeBand === report.gradeBand && s.period === report.period)
                    ) || surveysListData.surveys.find(s => s.status === 'published');
                    const targetSurveyId = matchingSurvey ? matchingSurvey.id : 's8';
                    router.push(`/school/surveys/${targetSurveyId}`);
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13px] font-medium hover:bg-slate-50 transition-colors text-[#2B2B2B]"
                >
                  View survey
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Version Timeline */}
      <VersionTimeline
        reportId={reportId}
        events={report.events}
        totalVersions={report.totalVersions}
        currentVersion={report.currentVersion}
      />
    </div>
  );
}