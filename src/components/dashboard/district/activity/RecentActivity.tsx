'use client';

import { ActivityPage, DATE_RANGE_OPTIONS, matchDateRange } from '@/components/common/Activity';
import type { ActivityFilterDef, ActivityStatTile } from '@/components/common/Activity';
import {
  districtActivity,
  districtActorDisplay,
  districtActorFilterOptions,
  districtCategoryConfig,
  districtCategoryFilterOptions,
  districtSchoolFilterOptions,
  type DistrictActivityEvent,
} from '@/lib/districtActivityData';

const STAT_TILES: ActivityStatTile[] = [
  { label: 'Events today', value: '5', icon: 'ri-calendar-line', accent: 'neutral' },
  { label: 'This week', value: '27', icon: 'ri-pulse-line', accent: 'iris' },
  { label: 'Pending reopen requests', value: '1', icon: 'ri-refresh-line', accent: 'gold', href: '/district/reopen-requests' },
  { label: 'Schools active this week', value: '9', icon: 'ri-building-2-line', accent: 'sage', href: '/district/schools' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
];

const FILTERS: ActivityFilterDef[] = [
  {
    key: 'school',
    label: 'School',
    defaultValue: 'all',
    options: districtSchoolFilterOptions,
    match: (event, value) => (event as DistrictActivityEvent).school === value,
  },
  {
    key: 'category',
    label: 'Category',
    defaultValue: 'all',
    options: districtCategoryFilterOptions,
    match: (event, value) => event.category === value,
  },
  {
    key: 'actor',
    label: 'Actor',
    defaultValue: 'all',
    options: districtActorFilterOptions,
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
    options: SORT_OPTIONS,
    match: () => true,
  },
];

export function RecentActivity() {
  return (
    <ActivityPage
      title="Activity"
      events={districtActivity}
      categoryStyles={districtCategoryConfig}
      actorLabels={districtActorDisplay}
      statTiles={STAT_TILES}
      filters={FILTERS}
      exportFilePrefix="district-activity"
      emptyTitle="No activity yet"
      emptyDescription="Activity across your schools will appear here — surveys, reports, reopen requests, and administrator changes are all recorded."
    />
  );
}

export default RecentActivity;
