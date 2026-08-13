'use client';

import { useState } from 'react';
import ActivityFeedItem from './ActivityFeedItem';
import type { ActivityCategoryStyle, ActivityDayGroup } from './types';

interface ActivityFeedProps {
  dayGroups: ActivityDayGroup[];
  categoryStyles: Record<string, ActivityCategoryStyle>;
  actorLabels: Record<string, string>;
  isLoading?: boolean;
  hasActiveFilters?: boolean;
  shownCount: number;
  totalCount: number;
  onExport?: () => void;
  emptyTitle: string;
  emptyDescription: string;
}

function FeedSkeleton() {
  return (
    <div className="px-4 sm:px-6 py-8 space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-3 sm:gap-4 animate-pulse">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0 bg-surface-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 rounded w-24 bg-surface-100" />
            <div className="h-3 rounded w-3/4 bg-surface-100" />
            <div className="h-3 rounded w-1/2 bg-surface-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ActivityFeed({
  dayGroups,
  categoryStyles,
  actorLabels,
  isLoading = false,
  hasActiveFilters = false,
  shownCount,
  totalCount,
  onExport,
  emptyTitle,
  emptyDescription,
}: ActivityFeedProps) {
  // Only the newest group starts open; the rest collapse until asked for.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-line shadow-card">
      {isLoading ? (
        <FeedSkeleton />
      ) : dayGroups.length === 0 ? (
        <div className="px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-surface-100">
            <span className="w-7 h-7 flex items-center justify-center text-subtle">
              <i className="ri-inbox-line text-[24px]"></i>
            </span>
          </div>
          <p className="text-[15px] font-semibold mb-1 text-ink">
            {hasActiveFilters ? 'No activity matches your filters' : emptyTitle}
          </p>
          <p className="text-[13px] max-w-[380px] mx-auto leading-relaxed text-subtle">
            {hasActiveFilters ? 'Try adjusting your filters to see more results.' : emptyDescription}
          </p>
        </div>
      ) : (
        <>
          {dayGroups.map((group, gIdx) => {
            const isOpen = openGroups[group.label] ?? gIdx === 0;
            const panelId = `activity-group-${group.label.replace(/\s+/g, '-').toLowerCase()}`;

            return (
              <div key={group.label}>
                {gIdx > 0 && <div className="h-px bg-line" />}
                <h2>
                  <button
                    type="button"
                    onClick={() => setOpenGroups((prev) => ({ ...prev, [group.label]: !isOpen }))}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 text-left transition-colors duration-100 bg-canvas hover:bg-surface-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-inset"
                  >
                    <span className="text-[13px] font-medium text-subtle">{group.label}</span>
                    <span
                      className={`w-4 h-4 flex items-center justify-center shrink-0 text-subtle transition-transform duration-150 ${isOpen ? '[transform:rotate(180deg)]' : '[transform:rotate(0deg)]'}`}
                    >
                      <i className="ri-arrow-down-s-line text-base"></i>
                    </span>
                  </button>
                </h2>

                {isOpen && (
                  <div id={panelId} role="list">
                    {group.events.map((event, eIdx) => (
                      <div key={event.id}>
                        {eIdx > 0 && <div className="h-px mx-4 sm:mx-6 bg-line" />}
                        <ActivityFeedItem event={event} categoryStyles={categoryStyles} actorLabels={actorLabels} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="h-px mx-4 sm:mx-6 bg-line" />
          <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-[12px] text-subtle">
              Showing {shownCount} of {totalCount} events
            </p>
            {onExport && (
              <button
                onClick={onExport}
                className="inline-flex w-full sm:w-auto justify-center items-center gap-1.5 whitespace-nowrap rounded-full h-9 px-4 text-[13px] font-semibold transition-colors duration-150 hover:bg-sage-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-1 cursor-pointer bg-sage-50 border border-[#D6E0D2] text-sage-900"
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-download-line text-[13px]"></i>
                </span>
                Export
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
