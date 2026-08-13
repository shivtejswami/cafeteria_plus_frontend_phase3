'use client';

import FilterDropdown from '@/components/dashboard/ui/FilterDropdown';
import ActivityDateFilter from './ActivityDateFilter';
import type { ActivityFilterDef } from './types';

interface ActivityFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: ActivityFilterDef[];
  values: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
}

export default function ActivityFilterBar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search activity...',
  filters,
  values,
  onFilterChange,
}: ActivityFilterBarProps) {
  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 sm:gap-3">
      <div className="relative col-span-2 sm:flex-1 sm:min-w-[200px] sm:max-w-[320px]">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none text-subtle">
          <i className="ri-search-line text-[15px]"></i>
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full h-9 pl-9 pr-9 rounded-[10px] text-base sm:text-[13px] border outline-none transition-all duration-150 focus:outline-none focus:ring-0 bg-white border-line text-ink"
          aria-label="Search activity"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-surface-100 transition-colors duration-100 text-subtle"
            aria-label="Clear search"
          >
            <i className="ri-close-line text-sm"></i>
          </button>
        )}
      </div>

      {filters.map((filter) =>
        filter.kind === 'date-range' ? (
          <ActivityDateFilter
            key={filter.key}
            label={filter.label}
            defaultValue={filter.defaultValue}
            value={values[filter.key] ?? filter.defaultValue}
            options={filter.options}
            onChange={(value) => onFilterChange(filter.key, value)}
          />
        ) : (
          <FilterDropdown
            key={filter.key}
            label={filter.label}
            defaultValue={filter.defaultValue}
            value={values[filter.key] ?? filter.defaultValue}
            options={filter.options}
            onChange={(value) => onFilterChange(filter.key, value)}
          />
        )
      )}
    </div>
  );
}
