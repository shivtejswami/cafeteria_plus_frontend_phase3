'use client';

import { useCallback, useMemo, useState } from 'react';
import ActivityStatCards from './ActivityStatCards';
import ActivityFilterBar from './ActivityFilterBar';
import ActivityFeed from './ActivityFeed';
import { activityToCsv, downloadCsv, groupActivityByDay } from './activityUtils';
import type { ActivityCategoryStyle, ActivityEvent, ActivityFilterDef, ActivityStatTile } from './types';

interface ActivityPageProps {
  events: ActivityEvent[];
  categoryStyles: Record<string, ActivityCategoryStyle>;
  actorLabels: Record<string, string>;
  statTiles?: ActivityStatTile[];
  filters?: ActivityFilterDef[];
  /** Accessible page title; the dashboard header already shows it visually. */
  title: string;
  emptyTitle: string;
  emptyDescription: string;
  searchPlaceholder?: string;
  exportFilePrefix?: string;
  /** Rendered between the stat cards and the filter bar (banners, notices). */
  banner?: React.ReactNode;
  onExported?: (count: number) => void;
}

export default function ActivityPage({
  events,
  categoryStyles,
  actorLabels,
  statTiles = [],
  filters = [],
  title,
  emptyTitle,
  emptyDescription,
  searchPlaceholder,
  exportFilePrefix = 'activity',
  banner,
  onExported,
}: ActivityPageProps) {
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(filters.map((f) => [f.key, f.defaultValue]))
  );

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e.action.toLowerCase().includes(q) ||
          e.actor.toLowerCase().includes(q) ||
          (e.reason ? e.reason.toLowerCase().includes(q) : false)
      );
    }

    filters.forEach((filter) => {
      const value = filterValues[filter.key] ?? filter.defaultValue;
      if (value === filter.defaultValue) return;
      result = result.filter((e) => filter.match(e, value));
    });

    // Sort is expressed as a filter too, so honour it after the narrowing pass.
    const sortValue = filterValues.sort;
    result.sort((a, b) =>
      sortValue === 'oldest'
        ? a.timestamp.getTime() - b.timestamp.getTime()
        : b.timestamp.getTime() - a.timestamp.getTime()
    );

    return result;
  }, [events, search, filters, filterValues]);

  const hasActiveFilters = useMemo(
    () =>
      search.trim() !== '' ||
      filters.some((f) => f.key !== 'sort' && (filterValues[f.key] ?? f.defaultValue) !== f.defaultValue),
    [search, filters, filterValues]
  );

  // Everything matching the filters is rendered — the day groups collapse, so a
  // long history stays scannable without a "load more" step.
  const dayGroups = useMemo(() => groupActivityByDay(filteredEvents), [filteredEvents]);

  const handleExport = useCallback(() => {
    const csv = activityToCsv(filteredEvents, (key) => categoryStyles[key]?.label ?? key);
    downloadCsv(csv, `${exportFilePrefix}-export-${new Date().toISOString().slice(0, 10)}.csv`);
    onExported?.(filteredEvents.length);
  }, [filteredEvents, categoryStyles, exportFilePrefix, onExported]);

  return (
    <div>
      <h1 className="sr-only">{title}</h1>

      {statTiles.length > 0 && (
        <div className="mb-5 sm:mb-6">
          <ActivityStatCards tiles={statTiles} />
        </div>
      )}

      {banner}

      {filters.length > 0 && (
        <div className="mb-5 sm:mb-6">
          <ActivityFilterBar
            search={search}
            onSearchChange={handleSearchChange}
            searchPlaceholder={searchPlaceholder}
            filters={filters}
            values={filterValues}
            onFilterChange={handleFilterChange}
          />
        </div>
      )}

      <ActivityFeed
        dayGroups={dayGroups}
        categoryStyles={categoryStyles}
        actorLabels={actorLabels}
        hasActiveFilters={hasActiveFilters}
        shownCount={filteredEvents.length}
        totalCount={events.length}
        onExport={handleExport}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      />
    </div>
  );
}
