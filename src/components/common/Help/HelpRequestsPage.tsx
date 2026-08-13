'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import HelpBreadcrumb from './HelpBreadcrumb';
import type { HelpRoutes, HelpSupportRequestItem } from './types';

type FilterValue = 'all' | 'open' | 'resolved';

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All requests' },
  { value: 'open', label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
];

const STATUS_STYLE: Record<HelpSupportRequestItem['status'], { chip: string; dot: string; label: string }> = {
  open: { chip: 'bg-gold-100 text-gold', dot: 'bg-gold', label: 'Open' },
  viewed: { chip: 'bg-iris-50 text-iris', dot: 'bg-iris', label: 'Viewed' },
  'in-progress': { chip: 'bg-iris-50 text-iris', dot: 'bg-iris', label: 'In progress' },
  resolved: { chip: 'bg-leaf-50 text-sage', dot: 'bg-sage', label: 'Resolved' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** "4 days ago" style stamp; blank when the date can't be parsed. */
function formatAge(dateStr: string, now: Date): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const days = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

interface HelpRequestsPageProps {
  routes: HelpRoutes;
  requests: HelpSupportRequestItem[];
}

export default function HelpRequestsPage({ routes, requests }: HelpRequestsPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<FilterValue>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  // Ages are relative to render time; fine for a list that is read, not stored.
  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    if (!filterOpen) return;
    function handlePointerDown(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [filterOpen]);

  const sorted = useMemo(
    () => [...requests].sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()),
    [requests]
  );
  const filtered = useMemo(() => {
    if (filterValue === 'all') return sorted;
    if (filterValue === 'resolved') return sorted.filter((r) => r.status === 'resolved');
    return sorted.filter((r) => r.status !== 'resolved');
  }, [sorted, filterValue]);

  const openCount = requests.filter((r) => r.status !== 'resolved').length;
  const resolvedCount = requests.filter((r) => r.status === 'resolved').length;
  const activeFilterLabel = FILTER_OPTIONS.find((f) => f.value === filterValue)?.label ?? 'All requests';

  return (
    <div className="space-y-5">
      <header>
        <HelpBreadcrumb crumbs={[{ label: 'Help', href: routes.home }, { label: 'My requests' }]} />
        <h1 className="text-[19px] sm:text-[24px] font-bold mt-3 mb-1 text-ink">My requests</h1>
        <p className="text-[14px] sm:text-[15px] text-muted">Requests you&apos;ve sent to SFWG</p>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold bg-white border border-line text-ink">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            {openCount} open
          </span>
          <span className="text-[13px] text-subtle" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold bg-white border border-line text-ink">
            <span className="w-1.5 h-1.5 rounded-full bg-sage"></span>
            {resolvedCount} resolved
          </span>
        </div>

        <Link
          href={routes.contact}
          className="inline-flex w-full sm:w-auto justify-center items-center gap-1.5 h-11 px-5 rounded-full text-[14px] font-medium whitespace-nowrap transition-opacity duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 text-white bg-sage"
        >
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-mail-send-line text-base"></i>
          </span>
          Contact SFWG support
        </Link>
      </div>

      <div className="p-4 rounded-xl bg-sage-50 border border-sage-200">
        <p className="text-[13px] leading-relaxed text-sage">
          <span className="w-3.5 h-3.5 inline-flex items-center justify-center mr-1.5 align-text-bottom">
            <i className="ri-information-line text-sm"></i>
          </span>
          SFWG handles requests directly and will contact you. This page shows what you sent and whether it has been
          resolved.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl p-6 sm:p-10 text-center bg-white border border-line shadow-card">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-sage-50">
            <span className="w-7 h-7 flex items-center justify-center text-sage">
              <i className="ri-mail-check-line text-[22px] sm:text-[28px]"></i>
            </span>
          </div>
          <p className="text-[16px] font-semibold mb-1 text-ink">You haven&apos;t submitted any requests yet.</p>
          <p className="text-[14px] mb-5 text-muted">Use Contact SFWG support and your request will appear here.</p>
          <Link
            href={routes.contact}
            className="inline-flex justify-center items-center gap-1.5 h-11 px-5 rounded-full text-[14px] font-medium whitespace-nowrap transition-opacity duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 text-white bg-sage"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-mail-send-line text-base"></i>
            </span>
            Contact SFWG support
          </Link>
        </div>
      ) : (
        <>
          {requests.length > 2 && (
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-medium shrink-0 text-muted">Show:</span>
              <div ref={filterRef} className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="inline-flex items-center gap-2 h-9 pl-4 pr-2.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 text-ink bg-white border border-line"
                  aria-haspopup="listbox"
                  aria-expanded={filterOpen}
                  aria-label={`Show: ${activeFilterLabel}`}
                >
                  {activeFilterLabel}
                  <span
                    className={`w-4 h-4 flex items-center justify-center shrink-0 text-subtle transition-transform duration-150 ${filterOpen ? '[transform:rotate(180deg)]' : '[transform:rotate(0deg)]'}`}
                  >
                    <i className="ri-arrow-down-s-line text-sm"></i>
                  </span>
                </button>
                {filterOpen && (
                  <div
                    className="absolute left-0 top-full mt-1 z-20 rounded-xl py-1 min-w-[170px] bg-white border border-line shadow-card"
                    role="listbox"
                  >
                    {FILTER_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        role="option"
                        aria-selected={filterValue === option.value}
                        onClick={() => {
                          setFilterValue(option.value);
                          setFilterOpen(false);
                          setExpandedId(null);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors duration-100 focus:outline-none focus-visible:bg-iris-50 ${filterValue === option.value ? 'bg-iris-50 text-iris font-medium' : 'bg-transparent text-ink'}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="rounded-2xl p-5 sm:p-8 text-center bg-white border border-line shadow-card">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-iris-50">
                <span className="w-6 h-6 flex items-center justify-center text-iris">
                  <i className="ri-filter-line text-2xl"></i>
                </span>
              </div>
              <p className="text-[15px] font-medium mb-1 text-ink">No requests match this filter.</p>
              <p className="text-[13px] mb-4 text-muted">
                {filterValue === 'open' ? 'All your requests have been resolved.' : 'No resolved requests yet.'}
              </p>
              <button
                onClick={() => setFilterValue('all')}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-[#e6daf7] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 text-iris bg-iris-50 border border-[#e0d4f7]"
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-close-line text-sm"></i>
                </span>
                Clear filter
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((request) => {
                const isExpanded = expandedId === request.id;
                const status = STATUS_STYLE[request.status];

                return (
                  <div key={request.id} className="rounded-2xl bg-white border border-line shadow-hairline">
                    <button
                      onClick={() => setExpandedId((prev) => (prev === request.id ? null : request.id))}
                      className="w-full text-left px-4 sm:px-5 py-4 flex items-start sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1"
                      aria-expanded={isExpanded}
                      aria-controls={`request-detail-${request.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <span className="block text-[14px] font-semibold truncate sm:whitespace-normal text-ink">
                          {request.subject}
                        </span>
                        <span className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[12px] mt-0.5 text-muted">
                          <span>{request.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatDate(request.submittedDate)}</span>
                          {formatAge(request.submittedDate, now) && (
                            <>
                              <span className="hidden sm:inline" aria-hidden="true">·</span>
                              <span className="hidden sm:inline">{formatAge(request.submittedDate, now)}</span>
                            </>
                          )}
                        </span>
                      </div>
                      <span className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {request.updatedLabel && (
                          <span className="hidden sm:inline text-[12px] text-subtle">
                            Updated {request.updatedLabel}
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold ${status.chip}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status.dot}`}></span>
                          {status.label}
                        </span>
                        <span
                          className={`w-5 h-5 flex items-center justify-center text-subtle transition-transform duration-200 ${isExpanded ? '[transform:rotate(180deg)]' : '[transform:rotate(0deg)]'}`}
                          aria-hidden="true"
                        >
                          <i className="ri-arrow-down-s-line text-lg"></i>
                        </span>
                      </span>
                    </button>

                    {isExpanded && (
                      <div id={`request-detail-${request.id}`} className="px-4 sm:px-5 pb-5 pt-1 border-t border-line">
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-3">
                          <div>
                            <dt className="text-[11px] font-semibold mb-0.5 text-subtle">Category</dt>
                            <dd className="text-[14px] text-ink">{request.category}</dd>
                          </div>
                          <div>
                            <dt className="text-[11px] font-semibold mb-0.5 text-subtle">Submitted</dt>
                            <dd className="text-[14px] text-ink">{formatDate(request.submittedDate)}</dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-[11px] font-semibold mb-0.5 text-subtle">Subject</dt>
                            <dd className="text-[14px] text-ink">{request.subject}</dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-[11px] font-semibold mb-0.5 text-subtle">Message</dt>
                            <dd className="text-[14px] leading-relaxed wrap-break-word text-ink-700">{request.message}</dd>
                          </div>
                          {request.attachmentName && (
                            <div className="sm:col-span-2">
                              <dt className="text-[11px] font-semibold mb-0.5 text-subtle">Attachment</dt>
                              <dd>
                                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-canvas border border-line">
                                  <span className="w-4 h-4 flex items-center justify-center text-muted">
                                    <i className="ri-file-line text-base"></i>
                                  </span>
                                  <span className="text-[13px] text-ink">{request.attachmentName}</span>
                                  <span className="w-4 h-4 flex items-center justify-center text-subtle">
                                    <i className="ri-download-line text-sm"></i>
                                  </span>
                                </span>
                              </dd>
                            </div>
                          )}
                          {request.resolutionNote && (
                            <div className="sm:col-span-2">
                              <dt className="text-[11px] font-semibold mb-1 uppercase tracking-wide text-subtle">
                                Resolution
                              </dt>
                              <dd className="text-[13px] leading-relaxed p-3 rounded-xl bg-canvas border border-line text-ink-700">
                                {request.resolutionNote}
                              </dd>
                            </div>
                          )}
                          <div className="sm:col-span-2">
                            <dt className="text-[11px] font-semibold mb-0.5 text-subtle">Status</dt>
                            <dd>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold ${status.chip}`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status.dot}`}></span>
                                {request.status === 'resolved'
                                  ? `Resolved${request.resolvedDate ? ` on ${formatDate(request.resolvedDate)}` : ''}`
                                  : `${status.label} — SFWG is handling it`}
                              </span>
                            </dd>
                          </div>
                        </dl>

                        <div className="mt-4 p-3 rounded-xl bg-sage-50 border border-sage-200">
                          <p className="text-[12px] text-sage">
                            <span className="w-3.5 h-3.5 inline-flex items-center justify-center mr-1 align-text-bottom">
                              <i className="ri-information-line text-sm"></i>
                            </span>
                            SFWG handles requests directly and will contact you.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
