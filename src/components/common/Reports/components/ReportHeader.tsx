'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSchoolLogo, subscribe } from '@/lib/schoolLogoStore';
import type { ReportDetailData } from '@/lib/schoolAdminData';

interface ReportHeaderProps {
  report: ReportDetailData;
  onDownload: () => void;
}

export default function ReportHeader({ report, onDownload }: ReportHeaderProps) {
  const isPublished = report.status === 'published';
  const statusLabel = report.status === 'published' ? 'Published' : 'Superseded';
  // Tailwind classes, not hex — these go straight into `className`.
  const statusBg = report.status === 'published' ? 'bg-[#E3F5E3]' : 'bg-[#F1EFEA]';
  const statusText = report.status === 'published' ? 'text-sage' : 'text-muted-500';

  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    setLogoUrl(getSchoolLogo());
    const unsub = subscribe(() => setLogoUrl(getSchoolLogo()));
    return unsub;
  }, []);

  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between sm:flex-wrap gap-3">
        <div className="sm:flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span className="inline-block rounded-full px-3 py-1 text-[12px] font-semibold bg-iris-50 text-iris">
              {report.gradeBand}
            </span>
            <span className="inline-block rounded-full px-3 py-1 text-[12px] font-semibold bg-surface-100 text-muted">
              {report.period}
            </span>
            <span className={`inline-block rounded-full px-3 py-1 text-[12px] font-semibold ${statusBg} ${statusText}`}>
              {statusLabel}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] sm:text-[13px] text-muted">
            <span>Published {report.publishedDate}</span>
            <span>&middot;</span>
            <span>{report.version}</span>
          </div>
        </div>

        {logoUrl && (
          <div className="flex-shrink-0 flex items-center max-w-[100px] max-h-[56px]">
            <img
              src={logoUrl}
              alt="Hillside Middle"
              className="max-w-full max-h-[56px] object-contain"
            />
          </div>
        )}

        <div className="flex w-full sm:w-auto items-center gap-2.5 shrink-0">
          {isPublished && (
            <button
              onClick={onDownload}
              className="inline-flex flex-1 sm:flex-none justify-center items-center gap-1.5 rounded-full h-10 px-5 text-[13px] font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage text-white"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-download-2-line text-[15px]"></i>
              </span>
              Download PDF
            </button>
          )}
          {report.hasVersionHistory && (
            <Link
              href={`/school/reports/${report.id}/version-history`}
              className="inline-flex flex-1 sm:flex-none justify-center items-center rounded-full h-10 px-5 text-[13px] font-medium whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] transition-colors"
            >
              Version history
            </Link>
          )}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t flex items-center gap-2 border-line">
        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-subtle">
          <i className="ri-information-line text-[14px]"></i>
        </span>
        <p className="text-[12px] text-muted-500">
          This dashboard shows the same results as your PDF report.
        </p>
      </div>
    </div>
  );
}