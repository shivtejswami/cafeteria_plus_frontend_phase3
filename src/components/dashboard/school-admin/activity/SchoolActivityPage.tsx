
'use client';

import { useMemo } from 'react';
import { ActivityPage } from '@/components/common/Activity';
import type { ActivityEvent, ActivityFilterDef, ActivityStatTile } from '@/components/common/Activity';
import { DATE_RANGE_OPTIONS, matchDateRange } from '@/components/common/Activity';
import {
  seedActivity,
  categoryConfig,
  actorDisplay,
  categoryFilterOptions,
  actorFilterOptions,
  dateRangeOptions,
  sortOptions,
  surveyFilterOptions,
} from '@/lib/schoolActivityData';
import { useReadOnlyMode } from '@/components/school-admin/common/ReadOnlyModeContext';
import ReadOnlyBanner from '@/components/school-admin/common/ReadOnlyBanner';

const STAT_TILES: ActivityStatTile[] = [
  { label: 'Events this week', value: '12', icon: 'ri-pulse-line', accent: 'neutral' },
  { label: 'Active survey', value: 'Open', icon: 'ri-play-circle-line', accent: 'sage', href: '/school/surveys' },
  { label: 'Latest report', value: 'Fall 2025', icon: 'ri-file-chart-line', accent: 'iris', href: '/school/reports' },
];

const FILTERS: ActivityFilterDef[] = [
  {
    key: 'category',
    label: 'Category',
    defaultValue: 'all',
    options: categoryFilterOptions,
    match: (event, value) => event.category === value,
  },
  {
    key: 'survey',
    label: 'Survey',
    defaultValue: 'all',
    options: surveyFilterOptions,
    match: (event, value) =>
      Boolean(event.survey) && `${event.survey!.gradeBand} ${event.survey!.period}` === value,
  },
  {
    key: 'actor',
    label: 'Actor',
    defaultValue: 'all',
    options: actorFilterOptions,
    match: (event, value) => event.actorRole === value,
  },
  {
    key: 'date',
    label: 'Date',
    defaultValue: 'all',
    kind: 'date-range',
    options: DATE_RANGE_OPTIONS,
    match: (event, value) => matchDateRange(event.timestamp, value),
  },
  {
    key: 'sort',
    label: 'Sort',
    defaultValue: 'newest',
    options: sortOptions,
    match: () => true,
  },
];

export default function SchoolActivityPage() {
  const { isReadOnly } = useReadOnlyMode();
  const events = useMemo<ActivityEvent[]>(() => [...seedActivity], []);

  return (
    <ActivityPage
      title="Activity"
      events={events}
      categoryStyles={categoryConfig}
      actorLabels={actorDisplay}
      statTiles={STAT_TILES}
      filters={FILTERS}
      exportFilePrefix="school-activity"
      emptyTitle="No activity yet"
      emptyDescription="Your school's activity will appear here once you create your first survey. Every action you take, from creating surveys to viewing reports, will be recorded here."
      banner={isReadOnly ? <div className="mb-5 sm:mb-6"><ReadOnlyBanner /></div> : null}
    />
  );
}
