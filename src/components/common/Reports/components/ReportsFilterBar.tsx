'use client';

import { useState } from 'react';
import type { ReportStatus } from '@/lib/schoolAdminData';
import { reportsGradeBands, reportsPeriods } from '@/lib/schoolAdminData';
import FilterDropdown from '@/components/dashboard/ui/FilterDropdown';

type StatusFilter = 'all' | ReportStatus;

interface ReportsFilterBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  gradeBandFilter: string;
  onGradeBandChange: (band: string) => void;
  periodFilter: string;
  onPeriodChange: (period: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function ReportsFilterBar({
  searchQuery,
  onSearch,
  statusFilter,
  onStatusChange,
  gradeBandFilter,
  onGradeBandChange,
  periodFilter,
  onPeriodChange,
  sortBy,
  onSortChange,
}: ReportsFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'published', label: 'Published' },
    { value: 'under-review', label: 'Under review' },
    { value: 'analysing', label: 'Analysing' },
    { value: 'superseded', label: 'Superseded' },
  ];

  const gradeBandOptions = [
    { value: 'all', label: 'All' },
    ...reportsGradeBands.map((b) => ({ value: b, label: b })),
  ];

  const periodOptions = [
    { value: 'all', label: 'All' },
    ...reportsPeriods.map((p) => ({ value: p, label: p })),
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'grade-band', label: 'Grade band' },
  ];

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setLocalSearch(val);
    onSearch(val);
  }

  return (
    <div className="flex flex-col gap-3"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:flex-wrap"
      >
        <div className="relative w-full sm:w-[300px] sm:shrink-0"
        >
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none text-[#9A9A9A]"
          >
            <i className="ri-search-line text-base"></i>
          </span>
          <input
            type="text"
            placeholder="Search reports…"
            value={localSearch}
            className="w-full h-10 pl-10 pr-4 rounded-full text-base sm:text-[14px] border outline-none transition-all duration-150 focus:outline-none focus:ring-0 bg-white border-line text-ink"
            onChange={handleSearchChange}
            aria-label="Search reports"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:flex-wrap"
        >
          <FilterDropdown
            label="Grade band"
          defaultValue="all"
            value={gradeBandFilter}
            options={gradeBandOptions}
            onChange={(v: string) => onGradeBandChange(v)}
          />
          <FilterDropdown
            label="Period"
          defaultValue="all"
            value={periodFilter}
            options={periodOptions}
            onChange={(v: string) => onPeriodChange(v)}
          />
          <FilterDropdown
            label="Status"
            defaultValue="all"
            value={statusFilter}
            options={statusOptions}
            onChange={(v: string) => onStatusChange(v as StatusFilter)}
          />
          <FilterDropdown
            label="Sort"
            defaultValue="newest"
            value={sortBy}
            options={sortOptions}
            onChange={(v: string) => onSortChange(v)}
          />
        </div>
      </div>
    </div>
  );
}