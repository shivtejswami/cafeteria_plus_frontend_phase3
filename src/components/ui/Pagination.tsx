'use client';

import React from 'react';
import { cn } from '@/utils/tailwind';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage?: number;
  totalItems: number;
  itemName?: string;
  onPageChange?: (page: number) => void;
  className?: string;
}

/**
 * Page numbers around the current page, with gaps standing in for the pages that are
 * skipped. Keeps the control a fixed width whether there are 5 pages or 5,000.
 */
function pageWindow(currentPage: number, totalPages: number, siblings: number): (number | 'gap')[] {
  // first + last + current + 2 siblings + 2 gaps — below this everything fits without gaps.
  const maxSlots = siblings * 2 + 5;
  if (totalPages <= maxSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(currentPage - siblings, 1);
  const right = Math.min(currentPage + siblings, totalPages);
  const showLeftGap = left > 2;
  const showRightGap = right < totalPages - 1;

  if (!showLeftGap && showRightGap) {
    const count = siblings * 2 + 3;
    return [...Array.from({ length: count }, (_, i) => i + 1), 'gap', totalPages];
  }

  if (showLeftGap && !showRightGap) {
    const count = siblings * 2 + 3;
    return [1, 'gap', ...Array.from({ length: count }, (_, i) => totalPages - count + 1 + i)];
  }

  return [1, 'gap', ...Array.from({ length: right - left + 1 }, (_, i) => left + i), 'gap', totalPages];
}

export function Pagination({
  currentPage,
  totalPages,
  itemsPerPage = 10,
  totalItems,
  itemName = 'items',
  onPageChange,
  className,
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  // Bigger tap targets on phones; identical to before from sm up.
  const arrowClass =
    'p-2 sm:p-1.5 shrink-0 cursor-pointer rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'flex flex-col items-center text-center sm:flex-row sm:flex-wrap sm:items-center sm:text-left justify-between px-2 py-4 gap-2.5 sm:gap-y-4',
        className,
      )}
    >
      <div className="text-xs sm:text-sm text-slate-500">
        Showing {startItem}&ndash;{endItem} of {totalItems} {itemName}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-1">
        <button
          className={arrowClass}
          disabled={isFirst}
          aria-label="Previous page"
          onClick={() => onPageChange?.(currentPage - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Same buttons at every size — only how many neighbours are shown changes. */}
        <span className="flex sm:hidden items-center gap-1">
          {pageWindow(currentPage, totalPages, 0).map((slot, i) =>
            slot === 'gap' ? (
              <Gap key={`gap-${i}`} />
            ) : (
              <PageButton key={slot} page={slot} currentPage={currentPage} onPageChange={onPageChange} />
            ),
          )}
        </span>
        <span className="hidden sm:flex lg:hidden items-center gap-1">
          {pageWindow(currentPage, totalPages, 1).map((slot, i) =>
            slot === 'gap' ? (
              <Gap key={`gap-${i}`} />
            ) : (
              <PageButton key={slot} page={slot} currentPage={currentPage} onPageChange={onPageChange} />
            ),
          )}
        </span>
        <span className="hidden lg:flex items-center gap-1">
          {pageWindow(currentPage, totalPages, 2).map((slot, i) =>
            slot === 'gap' ? (
              <Gap key={`gap-${i}`} />
            ) : (
              <PageButton key={slot} page={slot} currentPage={currentPage} onPageChange={onPageChange} />
            ),
          )}
        </span>

        <button
          className={arrowClass}
          disabled={isLast}
          aria-label="Next page"
          onClick={() => onPageChange?.(currentPage + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}

function PageButton({
  page,
  currentPage,
  onPageChange,
}: {
  page: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
}) {
  const isActive = page === currentPage;
  return (
    <button
      aria-label={`Page ${page}`}
      aria-current={isActive ? 'page' : undefined}
      // min-w rather than a fixed width so four- and five-digit pages don't clip.
      className={cn(
        'min-w-9 h-9 sm:min-w-8 sm:h-8 px-2 rounded-md cursor-pointer text-sm font-medium tabular-nums transition-colors flex items-center justify-center',
        isActive ? 'bg-[#6D28D9] text-white' : 'text-slate-600 hover:bg-slate-100',
      )}
      onClick={() => onPageChange?.(page)}
    >
      {page}
    </button>
  );
}

function Gap() {
  return (
    <span aria-hidden="true" className="w-5 sm:w-6 h-9 sm:h-8 flex items-end justify-center text-sm text-slate-400 select-none">
      &hellip;
    </span>
  );
}
