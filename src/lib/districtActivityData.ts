import { ACTIVITY_NOW } from '@/components/common/Activity/activityUtils';
import type { ActivityCategoryStyle, ActivityEvent } from '@/components/common/Activity/types';

/** Hours back from the fixed mock "now", so relative labels stay stable. */
function hoursAgo(hours: number): Date {
  return new Date(ACTIVITY_NOW.getTime() - hours * 3600000);
}

// Tailwind classes, not hex — these strings go straight into `className`.
export const districtCategoryConfig: Record<string, ActivityCategoryStyle> = {
  surveys: { icon: 'ri-clipboard-line', bg: 'bg-sage-50', color: 'text-sage', label: 'Surveys' },
  reports: { icon: 'ri-file-chart-line', bg: 'bg-iris-50', color: 'text-iris', label: 'Reports' },
  reopen: { icon: 'ri-refresh-line', bg: 'bg-[#FFECD1]', color: 'text-[#D97706]', label: 'Reopen requests' },
  schools: { icon: 'ri-building-2-line', bg: 'bg-sage-50', color: 'text-sage', label: 'Schools' },
  administrators: { icon: 'ri-user-follow-line', bg: 'bg-surface-100', color: 'text-muted', label: 'Administrators' },
  support: { icon: 'ri-customer-service-line', bg: 'bg-sage-50', color: 'text-sage', label: 'Support' },
  account: { icon: 'ri-shield-user-line', bg: 'bg-iris-50', color: 'text-iris', label: 'Account' },
  exports: { icon: 'ri-download-line', bg: 'bg-surface-100', color: 'text-muted', label: 'Data & exports' },
};

export const districtActorDisplay: Record<string, string> = {
  'district-admin': 'District administrator',
  'school-admin': 'School administrator',
  'SFWG': 'SFWG',
  'System': 'System',
};

export const districtCategoryFilterOptions = [
  { value: 'all', label: 'All categories' },
  { value: 'surveys', label: 'Surveys' },
  { value: 'reports', label: 'Reports' },
  { value: 'reopen', label: 'Reopen requests' },
  { value: 'schools', label: 'Schools' },
  { value: 'administrators', label: 'Administrators' },
  { value: 'support', label: 'Support' },
  { value: 'account', label: 'Account' },
  { value: 'exports', label: 'Data & exports' },
];

export const districtActorFilterOptions = [
  { value: 'all', label: 'All actors' },
  { value: 'district-admin', label: 'District admin' },
  { value: 'school-admin', label: 'School admin' },
  { value: 'SFWG', label: 'SFWG' },
  { value: 'System', label: 'System' },
];

export const districtSchoolFilterOptions = [
  { value: 'all', label: 'All schools' },
  { value: 'Hillside Middle', label: 'Hillside Middle' },
  { value: 'Sunset Elementary', label: 'Sunset Elementary' },
  { value: 'West Valley High', label: 'West Valley High' },
  { value: 'North Hills Elementary', label: 'North Hills Elementary' },
  { value: 'Summit High', label: 'Summit High' },
  { value: 'Oak Valley Middle', label: 'Oak Valley Middle' },
];

export interface DistrictActivityEvent extends ActivityEvent {
  /** Which school the event belongs to; drives the school filter. */
  school?: string;
}

export const districtActivity: DistrictActivityEvent[] = [
  {
    id: 'da-1',
    category: 'surveys',
    action: 'Survey closed',
    description: 'Fall 2025 survey closed with 77% participation (115 of 150 responses)',
    school: 'Hillside Middle',
    actorRole: 'school-admin',
    actor: 'Patricia Hayes',
    timestamp: hoursAgo(2),
    linkHref: '/district/schools',
    linkLabel: 'View school',
  },
  {
    id: 'da-2',
    category: 'reports',
    action: 'Additional review',
    description: 'Fall 2025 report for Sunset Elementary requires additional review',
    school: 'Sunset Elementary',
    actorRole: 'System',
    actor: 'System',
    timestamp: hoursAgo(3),
    needsAttention: true,
    linkHref: '/district/reports-analytics',
    linkLabel: 'View report',
  },
  {
    id: 'da-3',
    category: 'support',
    action: 'Request resolved',
    description: 'SFWG marked support request "Benchmark configuration question" as resolved',
    actorRole: 'SFWG',
    actor: 'SFWG',
    timestamp: hoursAgo(5),
    linkHref: '/district/help/my-requests',
    linkLabel: 'My requests',
  },
  {
    id: 'da-4',
    category: 'account',
    action: 'Signed in',
    description: 'Signed in from Chrome on Windows',
    actorRole: 'district-admin',
    actor: 'Karen Liu',
    timestamp: hoursAgo(9),
    linkHref: '/district/my-account',
    linkLabel: 'My account',
  },
  {
    id: 'da-5',
    category: 'exports',
    action: 'Activity exported',
    description: 'Activity log exported (Last 7 days, 5 entries)',
    actorRole: 'district-admin',
    actor: 'Karen Liu',
    timestamp: hoursAgo(9),
    linkHref: '/district/activity',
    linkLabel: 'View activity',
  },
  {
    id: 'da-6',
    category: 'reopen',
    action: 'Reopen approved',
    description:
      'Reopen approved for West Valley High — survey reopened with a new closing date of 20 Jul 2026. The current report is superseded and temporarily unavailable; a new version is generated when the survey closes again.',
    reason: 'School requested additional response window to reach participation target',
    school: 'West Valley High',
    actorRole: 'district-admin',
    actor: 'Karen Liu',
    timestamp: hoursAgo(26),
    needsAttention: true,
    linkHref: '/district/reopen-requests',
    linkLabel: 'View reopen requests',
  },
  {
    id: 'da-7',
    category: 'surveys',
    action: 'Closing date extended',
    description: 'Closing date extended from 3 Oct 2025 to 17 Oct 2025',
    school: 'North Hills Elementary',
    actorRole: 'school-admin',
    actor: 'James Morrison',
    timestamp: hoursAgo(28),
    linkHref: '/district/schools',
    linkLabel: 'View school',
  },
  {
    id: 'da-8',
    category: 'reports',
    action: 'Report published',
    description: 'Fall 2025 report published for Summit High',
    school: 'Summit High',
    actorRole: 'System',
    actor: 'System',
    timestamp: hoursAgo(30),
    linkHref: '/district/reports-analytics',
    linkLabel: 'View report',
  },
  {
    id: 'da-9',
    category: 'administrators',
    action: 'Admin activated',
    description: 'Daniel Greene activated their account as school administrator at Oak Valley Middle',
    school: 'Oak Valley Middle',
    actorRole: 'school-admin',
    actor: 'Daniel Greene',
    timestamp: hoursAgo(32),
    linkHref: '/district/people',
    linkLabel: 'View school',
  },
];
