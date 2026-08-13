'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ReportListItem, ReportStatus } from '@/lib/schoolAdminData';
import { Pagination } from '@/components/ui/Pagination';
import RowMenu from '@/components/ui/RowMenu';

const PAGE_SIZE = 8;

const statusConfig: Record<ReportStatus, { label: string; bg: string; textColor: string; dot?: boolean; dotBg?: string }> = {
  'published': { label: 'Published', bg: 'bg-leaf-50', textColor: 'text-sage', dot: true , dotBg: 'bg-sage'},
  'under-review': { label: 'Under review', bg: 'bg-gold-100', textColor: 'text-gold' },
  'analysing': { label: 'Analysing', bg: 'bg-surface-100', textColor: 'text-muted' },
  'superseded': { label: 'Superseded', bg: 'bg-surface-100', textColor: 'text-muted-500' },
};

interface ReportsTableProps {
  reports: ReportListItem[];
  isReadOnly: boolean;
  onDownload: (reportId: string) => void;
  onMarkForReview: (reportId: string) => void;
}

interface MenuActionPayload {
  report: ReportListItem;
  action: 'open' | 'download' | 'version-history' | 'mark-for-review';
}

function KebabMenu({ report, onAction }: { report: ReportListItem; onAction: (payload: MenuActionPayload) => void }) {
  const isViewable = report.status === 'published' || report.status === 'superseded';

  return (
    <RowMenu ariaLabel={`More actions for ${report.gradeBand} ${report.period}`}>
      {(close) => {
        const act = (a: MenuActionPayload['action']) => {
          close();
          onAction({ report, action: a });
        };

        // The row already carries a View link, so the menu is only the extras.
        // Superseded reports additionally expose the version trail.
        if (!isViewable) {
          return (
            <div className="px-4 py-2 text-[12px] text-subtle">
              Available once finalised
            </div>
          );
        }

        return (
          <>
            <MenuItem label="Download PDF" icon="ri-download-2-line" onClick={() => act('download')} />
            {report.status === 'superseded' && (
              <MenuItem label="Version history" icon="ri-history-line" onClick={() => act('version-history')} />
            )}
            <MenuItem label="Mark for review" icon="ri-flag-line" onClick={() => act('mark-for-review')} />
          </>
        );
      }}
    </RowMenu>
  );
}

function MenuItem({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2.5 text-[13px] flex items-center gap-2 transition-colors duration-100 focus:outline-none focus-visible:bg-surface-100 whitespace-nowrap text-ink"
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f1efea'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
        <i className={icon}></i>
      </span>
      {label}
    </button>
  );
}

export default function ReportsTable({ reports, onDownload, onMarkForReview }: ReportsTableProps) {

  function getRate(r: ReportListItem): string {
    if (r.responseCount === null || r.targetCount === 0) return '\u2014';
    return Math.round((r.responseCount / r.targetCount) * 100) + '%';
  }

  function getCompactParticipation(r: ReportListItem): string {
    if (r.responseCount === null || r.targetCount === 0) return '\u2014';
    return `${r.responseCount} \u00b7 ${getRate(r)}`;
  }

  // Tailwind classes, not hex — these strings go straight into `className`.
  function getReliabilityFlag(r: ReportListItem): { label: string; bg: string; textColor: string } | null {
    if (r.status === 'analysing' || r.status === 'under-review') return null;
    if (r.isLimitedDetail) return { label: 'Limited detail', bg: 'bg-[#FFECD1]', textColor: 'text-[#D97706]' };
    if (r.isSmallSample) return { label: 'Small sample', bg: 'bg-[#FFECD1]', textColor: 'text-[#D97706]' };
    return null;
  }

  const hasResults = reports.length > 0;

  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(reports.length / PAGE_SIZE));
  // Clamp rather than reset: filtering down to fewer pages shouldn't strand the user on an empty one.
  const currentPage = Math.min(page, totalPages);

  const sortedReports = useMemo(() => {
    return [...reports].slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [reports, currentPage]);

  if (!hasResults) {
    return (
      <div className="rounded-2xl p-12 text-center bg-white border border-line shadow-card">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center bg-[#F1EFEA]">
          <span className="w-6 h-6 flex items-center justify-center text-[#9A9A9A]">
            <i className="ri-file-chart-2-line text-2xl"></i>
          </span>
        </div>
        <h3 className="text-[16px] font-semibold mb-1 text-ink">
          No reports match your filters
        </h3>
        <p className="text-[14px] text-muted-500">
          Try adjusting the search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-line shadow-card">
      {/* Narrow screens scroll the table sideways rather than collapsing it into cards. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px]">
          <thead>
            <tr className="border-b border-b-line">
              <th className="text-left px-5 py-4 text-[13px] font-medium whitespace-nowrap text-[#9A9A9A]"
              >Report</th>
              <th className="text-left px-5 py-4 text-[13px] font-medium whitespace-nowrap text-[#9A9A9A]"
              >Status</th>
              <th className="text-left px-5 py-4 text-[13px] font-medium whitespace-nowrap text-[#9A9A9A]"
              >Participation</th>
              <th className="text-left px-5 py-4 text-[13px] font-medium whitespace-nowrap text-[#9A9A9A]"
              >Reliability</th>
              <th className="text-left px-5 py-4 text-[13px] font-medium whitespace-nowrap text-[#9A9A9A]"
              >Published</th>
              <th className="text-left px-5 py-4 text-[13px] font-medium whitespace-nowrap text-[#9A9A9A]"
              >Version</th>
              <th className="text-left px-5 py-4 text-[13px] font-medium whitespace-nowrap text-[#9A9A9A]"
              >Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedReports.map((report, i) => {
              const status = statusConfig[report.status];
              const flag = getReliabilityFlag(report);
              const compactPart = getCompactParticipation(report);
              const isViewable = report.status === 'published' || report.status === 'superseded';

              return (
                <tr
                  key={report.id}
                  className={`transition-colors duration-100 hover:bg-canvas ${i < sortedReports.length - 1 ? 'border-b border-b-line' : 'border-borderBottom-0'}`}
                >
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold flex-shrink-0 bg-iris-50 text-iris"
                      >
                        {report.gradeBand}
                      </span>
                      <span className="text-[14px] font-medium text-ink"
                      >
                        {report.period}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold whitespace-nowrap ${status.bg} ${status.textColor}`}
                    >
                      {status.dot && (
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dotBg}`}></span>
                      )}
                      {status.label}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-[14px] font-semibold text-ink"
                    >
                      {compactPart}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    {flag ? (
                      <span className={`inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-semibold whitespace-nowrap ${flag.bg} ${flag.textColor}`}
                      >
                        {flag.label}
                      </span>
                    ) : null}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`text-[13px] ${report.publishedDate ? 'text-ink' : 'text-subtle'}`}
                    >
                      {report.publishedDate || '\u2014'}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-medium text-ink"
                      >
                        {report.version}
                      </span>
                      {report.supersededByVersion && (
                        <span className="text-[12px] text-subtle"
                        >
                          Superseded by {report.supersededByVersion}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {isViewable ? (
                        <Link
                          href={`/school/reports/${report.id}`}
                          className="text-[13px] font-medium whitespace-nowrap transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-[#6D28D9]"
                          aria-label={`View ${report.gradeBand} ${report.period}`}
                        >
                          View
                        </Link>
                      ) : (
                        <span
                          className="text-[13px] font-medium whitespace-nowrap text-[#6D28D9]/35 cursor-not-allowed"
                          title="Available once the report is finalised"
                        >
                          View
                        </span>
                      )}
                      {isViewable && (
                        <KebabMenu
                          report={report}
                          onAction={({ report: r, action }) => {
                            if (action === 'open') {
                              window.location.href = `/school/reports/${r.id}`;
                            } else if (action === 'download') {
                              onDownload(r.id);
                            } else if (action === 'version-history') {
                              window.location.href = `/school/reports/${r.id}/version-history`;
                            } else if (action === 'mark-for-review') {
                              onMarkForReview(r.id);
                            }
                          }}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        className="px-5 py-3 border-t border-line"
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={PAGE_SIZE}
        totalItems={reports.length}
        itemName=""
        onPageChange={setPage}
      />
    </div>
  );
}