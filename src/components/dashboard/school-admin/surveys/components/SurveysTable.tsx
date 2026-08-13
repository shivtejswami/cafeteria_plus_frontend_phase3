'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { SurveyListItem, SurveyListStatus } from '@/lib/schoolAdminData';
import { schoolReopenPolicy } from '@/lib/schoolAdminData';
import { Pagination } from '@/components/ui/Pagination';
import RowMenu from '@/components/ui/RowMenu';

export interface SurveyActionPayload {
  survey: SurveyListItem;
  action: 'edit' | 'schedule' | 'open-now' | 'close-early' | 'pause' | 'resume' | 'extend' | 'share' | 'cancel' | 'delete-draft' | 'view-status' | 'view-report' | 'request-reopen' | 'view-record' | 'request-deletion';
}

interface SurveysTableProps {
  surveys: SurveyListItem[];
  isReadOnly: boolean;
  onAction: (payload: SurveyActionPayload) => void;
}

const statusConfig: Record<SurveyListStatus, { label: string; bg: string; color: string; dot?: boolean; dotBg?: string }> = {
  'draft': { label: 'Draft', bg: 'bg-[#F1EFEA]', color: 'text-[#6D6D6D]' },
  'scheduled': { label: 'Scheduled', bg: 'bg-[#F0EAFB]', color: 'text-[#6D28D9]' },
  'open': { label: 'Open', bg: 'bg-[#006EB21A]', color: 'text-[#006EB2]', dot: true , dotBg: 'bg-[#006EB2]'},
  'paused': { label: 'Paused', bg: 'bg-[#FFECD1]', color: 'text-[#D97706]' },
  'closed': { label: 'Closed', bg: 'bg-surface-100', color: 'text-muted' },
  'analysing': { label: 'Analysing', bg: 'bg-surface-100', color: 'text-muted' },
  'under-review': { label: 'Under review', bg: 'bg-[#FFF7E0]', color: 'text-[#9A7D0A]' },
  'published': { label: 'Published', bg: 'bg-[#E3F5E3]', color: 'text-[#586D4D]' },
  'cancelled': { label: 'Cancelled', bg: 'bg-surface-100', color: 'text-faint' },
};

function KebabMenu({ survey, isReadOnly, onAction }: { survey: SurveyListItem; isReadOnly: boolean; onAction: (payload: SurveyActionPayload) => void }) {
  const { status } = survey;
  const canReopenDirectly = schoolReopenPolicy === 'direct';

  return (
    <RowMenu ariaLabel={`More actions for ${survey.gradeBand} ${survey.period}`}>
      {(close) => {
        const act = (a: SurveyActionPayload['action']) => {
          close();
          onAction({ survey, action: a });
        };

        return (
          <>
          {status === 'draft' && (
            <>
              <MenuItem label="Edit" icon="ri-edit-line" onClick={() => act('edit')} disabled={isReadOnly} />
              <MenuItem label="Schedule" icon="ri-calendar-check-line" onClick={() => act('schedule')} disabled={isReadOnly} />
              <MenuItem label="Open now" icon="ri-play-fill" onClick={() => act('open-now')} disabled={isReadOnly} />
              <Divider />
              <MenuItem label="Delete draft" icon="ri-delete-bin-line" onClick={() => act('delete-draft')} disabled={isReadOnly} danger />
            </>
          )}

          {status === 'scheduled' && (
            <>
              <MenuItem label="Edit" icon="ri-edit-line" onClick={() => act('edit')} disabled={isReadOnly} />
              <MenuItem label="Open now" icon="ri-play-fill" onClick={() => act('open-now')} disabled={isReadOnly} />
              <MenuItem label="Share link / QR" icon="ri-share-line" onClick={() => act('share')} />
              <Divider />
              <MenuItem label="Cancel survey" icon="ri-close-circle-line" onClick={() => act('cancel')} disabled={isReadOnly} danger />
            </>
          )}

          {status === 'open' && (
            <>
              <MenuItem label="Close early" icon="ri-stop-circle-line" onClick={() => act('close-early')} disabled={isReadOnly} />
              <MenuItem label="Pause" icon="ri-pause-circle-line" onClick={() => act('pause')} disabled={isReadOnly} />
              <MenuItem label="Extend closing date" icon="ri-calendar-2-line" onClick={() => act('extend')} disabled={isReadOnly} />
              <MenuItem label="Share link / QR" icon="ri-share-line" onClick={() => act('share')} />
              <Divider />
              <MenuItem label="Cancel survey" icon="ri-close-circle-line" onClick={() => act('cancel')} disabled={isReadOnly} danger />
            </>
          )}

          {status === 'paused' && (
            <>
              <MenuItem label="Resume" icon="ri-play-circle-line" onClick={() => act('resume')} disabled={isReadOnly} />
              <MenuItem label="Extend closing date" icon="ri-calendar-2-line" onClick={() => act('extend')} disabled={isReadOnly} />
              <Divider />
              <MenuItem label="Cancel survey" icon="ri-close-circle-line" onClick={() => act('cancel')} disabled={isReadOnly} danger />
            </>
          )}

          {status === 'under-review' && (
            <MenuItem label="View status" icon="ri-eye-line" onClick={() => act('view-status')} />
          )}

          {status === 'published' && (
            <>
              <MenuItem label="View report" icon="ri-file-chart-line" onClick={() => act('view-report')} />
              <MenuItem label={canReopenDirectly ? 'Reopen survey' : 'Request reopen'} icon="ri-refresh-line" onClick={() => act('request-reopen')} disabled={isReadOnly} />
            </>
          )}

          {status === 'cancelled' && (
            <>
              <MenuItem label="View record" icon="ri-eye-line" onClick={() => act('view-record')} />
              <MenuItem label="Request deletion" icon="ri-delete-bin-line" onClick={() => act('request-deletion')} disabled={isReadOnly} danger />
            </>
          )}
          </>
        );
      }}
    </RowMenu>
  );
}

function MenuItem({ label, icon, onClick, disabled, danger }: { label: string; icon: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center gap-2 transition-colors duration-100 focus:outline-none focus-visible:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap ${danger ? 'text-brick' : 'text-ink'}`}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.background = danger ? '#fdeaea' : '#f1efea';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}
    >
      <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
        <i className={icon}></i>
      </span>
      {label}
    </button>
  );
}

function Divider() {
  return <div className="h-px mx-3 my-1 bg-line" />;
}

function formatDateTime(date: string | null, time: string | null): string {
  if (!date) return '\u2014';
  if (!time) return date;
  const tFormatted = time.slice(0, 5);
  return `${date}, ${tFormatted}`;
}

const PAGE_SIZE = 8;

export default function SurveysTable({ surveys, isReadOnly, onAction }: SurveysTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(surveys.length / PAGE_SIZE));
  // Clamp rather than reset: filtering down to fewer pages shouldn't strand the user on an empty one.
  const currentPage = Math.min(page, totalPages);
  const visibleSurveys = surveys.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (surveys.length === 0) {
    return (
      <div className="rounded-2xl p-12 text-center bg-white border border-line shadow-card">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-surface-100">
          <span className="w-6 h-6 flex items-center justify-center text-sage">
            <i className="ri-clipboard-line text-2xl"></i>
          </span>
        </div>
        <h3 className="text-[16px] font-semibold mb-1 text-ink">
          No surveys match
        </h3>
        <p className="text-[14px] text-muted-500">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  const hasParticipations = (s: SurveyListItem) => s.responseCount !== null && (s.status === 'open' || s.status === 'paused' || s.status === 'under-review' || s.status === 'published');

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-line shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px]">
          <thead>
            <tr className="border-b border-b-line">
              <th className="text-left px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider whitespace-nowrap text-subtle">
                Survey
              </th>
              <th className="text-left px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider whitespace-nowrap text-subtle">
                Status
              </th>
              <th className="text-left px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider whitespace-nowrap text-subtle">
                Participation
              </th>
              <th className="text-left px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider whitespace-nowrap text-subtle">
                Dates
              </th>
              <th className="text-left px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider whitespace-nowrap text-subtle">
                Report
              </th>
              <th className="text-right px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider whitespace-nowrap text-subtle">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleSurveys.map((s, i) => {
              const cfg = statusConfig[s.status];
              const responseRate = hasParticipations(s) ? Math.round((s.responseCount! / s.targetCount) * 100) : null;

              return (
                <tr
                  key={s.id}
                  className={`transition-colors duration-100 hover:bg-canvas ${i < visibleSurveys.length - 1 ? 'border-b border-b-line' : 'border-borderBottom-0'}`}
                >
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="inline-block rounded-full px-2.5 py-0.5 text-[12px] font-semibold whitespace-nowrap bg-iris-50 text-iris">
                          {s.gradeBand}
                        </span>
                        <span className="text-[14px] font-medium whitespace-nowrap text-ink">
                          {s.period}
                        </span>
                      </div>
                      {s.instrumentVersion && (
                        <p className="text-[12px] pl-1 whitespace-nowrap text-subtle">
                          {s.instrumentVersion}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold whitespace-nowrap ${cfg.bg} ${cfg.color}`}>
                      {cfg.dot && (
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dotBg}`}></span>
                      )}
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {hasParticipations(s) ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold text-ink">
                          {s.responseCount}
                        </span>
                        <span className="text-[13px] whitespace-nowrap text-muted-500">
                          &middot; {responseRate}%
                        </span>
                        {s.isSmallSample && (
                          <span className="inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap bg-gold-100 text-gold">
                            Small sample
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[14px] text-faint-400">&mdash;</span>
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {s.openedDate ? (
                      <div>
                        <p className="text-[13px] whitespace-nowrap text-ink">
                          {formatDateTime(s.openedDate, s.openedTime)} &ndash; {formatDateTime(s.closesDate, s.closesTime)}
                        </p>
                        {s.daysRemaining !== null && s.daysRemaining > 0 && (
                          <p className={`text-[12px] font-medium mt-0.5 ${s.daysRemaining <= 3 ? 'text-gold' : 'text-muted'}`}>
                            {s.daysRemaining} {s.daysRemaining === 1 ? 'day' : 'days'} left
                          </p>
                        )}
                        {s.daysUntilStart !== null && s.daysUntilStart > 0 && (
                          <p className="text-[12px] font-medium mt-0.5 text-iris">
                            Starts in {s.daysUntilStart}d
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-[14px] text-faint-400">&mdash;</span>
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {s.status === 'published' && s.reportId ? (
                      <Link
                        href={`/school/reports/${s.reportId}`}
                        className="text-[13px] font-medium whitespace-nowrap transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-iris"
                      >
                        {s.reportPeriod} report
                      </Link>
                    ) : (
                      <span className="text-[14px] text-faint-400">&mdash;</span>
                    )}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/school/surveys/${s.id}`}
                        className="text-[13px] font-medium text-[#6D28D9] hover:underline whitespace-nowrap"
                        aria-label={`View ${s.gradeBand} ${s.period}`}
                      >
                        View
                      </Link>
                      <KebabMenu survey={s} isReadOnly={isReadOnly} onAction={onAction} />
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
        totalItems={surveys.length}
        itemName=""
        onPageChange={setPage}
      />
    </div>
  );
}