'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ActivityCategoryStyle, ActivityEvent } from './types';
import { getAbsoluteTime, getRelativeTime } from './activityUtils';

interface ActivityFeedItemProps {
  event: ActivityEvent;
  categoryStyles: Record<string, ActivityCategoryStyle>;
  actorLabels: Record<string, string>;
}

export default function ActivityFeedItem({ event, categoryStyles, actorLabels }: ActivityFeedItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const style = categoryStyles[event.category];
  const hasDetail = Boolean(event.detail && event.detail.length > 0);
  const actorLabel = actorLabels[event.actorRole] ?? event.actorRole;
  // Only worth showing the name when it adds something beyond the role.
  const showActorName = Boolean(event.actor) && event.actor !== actorLabel;

  return (
    <div className="px-4 sm:px-6 py-4 transition-colors duration-100 hover:bg-canvas" role="listitem">
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${style?.bg ?? 'bg-surface-100'}`}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <i className={`${style?.icon ?? 'ri-history-line'} text-[17px] ${style?.color ?? 'text-muted'}`}></i>
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${style?.bg ?? 'bg-surface-100'} ${style?.color ?? 'text-muted'}`}
            >
              {style?.label ?? event.category}
            </span>
            <span className="text-[11px] font-medium text-subtle">{event.action}</span>
            {event.needsAttention && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap bg-gold-100 text-gold">
                <span className="w-3 h-3 flex items-center justify-center">
                  <i className="ri-error-warning-line text-[11px]"></i>
                </span>
                Needs attention
              </span>
            )}
          </div>

          <p className="text-[14px] leading-snug text-ink">{event.description}</p>

          {event.reason && (
            <p className="text-[12px] mt-1.5 leading-snug text-muted">Reason: {event.reason}</p>
          )}

          {hasDetail && (
            <div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-1 mt-1.5 text-[12px] font-medium transition-colors duration-100 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded whitespace-nowrap cursor-pointer text-muted"
                aria-expanded={expanded}
              >
                {expanded ? 'Hide detail' : 'Show detail'}
                <span className="w-3.5 h-3.5 flex items-center justify-center">
                  <i className={`${expanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-sm`}></i>
                </span>
              </button>
              {expanded && (
                <div className="mt-2 rounded-xl p-3 bg-canvas border border-surface-100">
                  {event.detail!.map((d, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-2 text-[12px] py-0.5">
                      <span className="text-subtle">{d.label}:</span>
                      {d.before && (
                        <span className="px-1.5 py-0.5 rounded bg-brick-50 text-brick line-through">{d.before}</span>
                      )}
                      {d.before && d.after && (
                        <span className="w-3 h-3 flex items-center justify-center text-subtle">
                          <i className="ri-arrow-right-line text-xs"></i>
                        </span>
                      )}
                      {d.after && (
                        <span className="px-1.5 py-0.5 rounded bg-sage-50 text-sage">{d.after}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
            <span className="text-[12px] text-subtle">
              <span className="text-muted">{actorLabel}</span>
              {showActorName && <span className="text-subtle"> ({event.actor})</span>}
            </span>

            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span className="text-[12px] cursor-default underline decoration-dotted underline-offset-2 text-subtle">
                {getRelativeTime(event.timestamp)}
              </span>
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 rounded-lg whitespace-nowrap z-20 pointer-events-none bg-ink text-white text-[11px]">
                  {getAbsoluteTime(event.timestamp)}
                </div>
              )}
            </div>

            {event.linkHref && event.linkLabel && (
              <Link
                href={event.linkHref}
                className="inline-flex items-center gap-1 text-[12px] font-medium transition-colors duration-100 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded whitespace-nowrap text-iris"
                aria-label={`${event.linkLabel} — ${event.description}`}
              >
                {event.linkLabel}
                <span className="w-3 h-3 flex items-center justify-center">
                  <i className="ri-arrow-right-up-line text-[11px]"></i>
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
