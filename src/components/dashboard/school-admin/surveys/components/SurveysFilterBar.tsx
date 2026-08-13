'use client';

import { useState } from 'react';
import FilterDropdown from '@/components/dashboard/ui/FilterDropdown';

type StatusFilter = 'all' | 'draft' | 'scheduled' | 'open' | 'paused' | 'under-review' | 'published' | 'cancelled';

interface SurveysFilterBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearch?: (query: string) => void;
  statusFilter?: string;
  onStatusChange?: (status: StatusFilter) => void;
  gradeBandFilter?: string;
  onGradeBandChange?: (band: string) => void;
  periodFilter?: string;
  onPeriodChange?: (period: string) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  gradeBands?: string[];
  periods?: string[];
}

export default function SurveysFilterBar({
  searchQuery = '',
  onSearchChange,
  onSearch,
  statusFilter = 'all',
  onStatusChange,
  gradeBandFilter = 'all',
  onGradeBandChange,
  periodFilter = 'all',
  onPeriodChange,
  sortBy = 'newest',
  onSortChange,
  gradeBands = ['K-5', '6-8', '9-12'],
  periods = ['Fall 2026', 'Spring 2025', 'Fall 2025', 'Spring 2024'],
}: SurveysFilterBarProps) {
  const [internalSearch, setInternalSearch] = useState(searchQuery);
  const currentSearch = searchQuery !== undefined ? searchQuery : internalSearch;

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'open', label: 'Open' },
    { value: 'paused', label: 'Paused' },
    { value: 'under-review', label: 'Under review' },
    { value: 'published', label: 'Published' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const safeGradeBands = Array.isArray(gradeBands) ? gradeBands : ['K-5', '6-8', '9-12'];
  const safePeriods = Array.isArray(periods) ? periods : ['Fall 2026', 'Spring 2025', 'Fall 2025', 'Spring 2024'];

  const gradeBandOptions = [
    { value: 'all', label: 'All' },
    ...safeGradeBands.map((b) => ({ value: b, label: b })),
  ];

  const periodOptions = [
    { value: 'all', label: 'All' },
    ...safePeriods.map((p) => ({ value: p, label: p })),
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'status', label: 'Status' },
  ];

  const handleSearch = (val: string) => {
    setInternalSearch(val);
    if (onSearchChange) onSearchChange(val);
    if (onSearch) onSearch(val);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
      <div className="relative flex-1 w-full sm:min-w-[240px]">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-[#9A9A9A]">
          <i className="ri-search-line text-base"></i>
        </span>
        <input
          type="text"
          placeholder="Search surveys…"
          value={currentSearch}
          className="w-full h-10 pl-10 pr-4 rounded-full text-base sm:text-[14px] border outline-none transition-all duration-150 focus:outline-none focus:ring-0 bg-white border-line text-ink placeholder:text-[#9A9A9A]"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3">
        <FilterDropdown
          label="Status"
          defaultValue="all"
          value={statusFilter}
          options={statusOptions}
          onChange={(v: string) => onStatusChange?.(v as StatusFilter)}
        />
        <FilterDropdown
          label="Grade band"
          defaultValue="all"
          value={gradeBandFilter}
          options={gradeBandOptions}
          onChange={(v: string) => onGradeBandChange?.(v)}
        />
        <FilterDropdown
          label="Period"
          defaultValue="all"
          value={periodFilter}
          options={periodOptions}
          onChange={(v: string) => onPeriodChange?.(v)}
        />
        <FilterDropdown
          label="Sort"
          defaultValue="newest"
          value={sortBy}
          options={sortOptions}
          onChange={(v: string) => onSortChange?.(v)}
        />
      </div>
    </div>
  );
}