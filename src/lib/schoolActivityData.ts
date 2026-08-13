import type { ActivityCategoryStyle, ActivityDayGroup, ActivityDetail, ActivityEvent } from '@/components/common/Activity/types';
import { getAbsoluteTime, getDayGroup, getRelativeTime, groupActivityByDay } from '@/components/common/Activity/activityUtils';

export type SchoolActivityDetail = ActivityDetail;

export interface SchoolActivityEvent extends ActivityEvent {
  categoryLabel: string;
  actorRole: 'you' | 'district-admin' | 'SFWG' | 'System';
  linkHref: string;
  linkLabel: string;
}

export type SchoolActivityDayGroup = ActivityDayGroup;

// The date helpers live with the shared activity components so district and
// admin feeds format timestamps identically.
export { getAbsoluteTime, getDayGroup, getRelativeTime, groupActivityByDay };

// Tailwind classes, not hex — these strings go straight into `className`.
export const categoryConfig: Record<string, ActivityCategoryStyle> = {
  surveys: { icon: 'ri-clipboard-line', bg: 'bg-sage-50', color: 'text-sage', label: 'Surveys' },
  distribution: { icon: 'ri-share-forward-line', bg: 'bg-surface-100', color: 'text-muted', label: 'Distribution' },
  participation: { icon: 'ri-user-heart-line', bg: 'bg-[#FFECD1]', color: 'text-[#D97706]', label: 'Participation' },
  reports: { icon: 'ri-file-chart-line', bg: 'bg-iris-50', color: 'text-iris', label: 'Reports' },
  reopen: { icon: 'ri-refresh-line', bg: 'bg-[#FFECD1]', color: 'text-[#D97706]', label: 'Reopen' },
  settings: { icon: 'ri-settings-3-line', bg: 'bg-surface-100', color: 'text-muted', label: 'Settings' },
  account: { icon: 'ri-shield-user-line', bg: 'bg-iris-50', color: 'text-iris', label: 'Account' },
  support: { icon: 'ri-customer-service-line', bg: 'bg-sage-50', color: 'text-sage', label: 'Support' },
};

export const actorDisplay: Record<string, string> = {
  'you': 'You',
  'district-admin': 'District administrator',
  'SFWG': 'SFWG',
  'System': 'System',
};

export const categoryFilterOptions = [
  { value: 'all', label: 'All categories' },
  { value: 'surveys', label: 'Surveys' },
  { value: 'distribution', label: 'Distribution' },
  { value: 'participation', label: 'Participation' },
  { value: 'reports', label: 'Reports' },
  { value: 'reopen', label: 'Reopen' },
  { value: 'settings', label: 'Settings' },
  { value: 'account', label: 'Account' },
  { value: 'support', label: 'Support' },
];

export const actorFilterOptions = [
  { value: 'all', label: 'All actors' },
  { value: 'you', label: 'You' },
  { value: 'district-admin', label: 'District' },
  { value: 'SFWG', label: 'SFWG' },
  { value: 'System', label: 'System' },
];

export const dateRangeOptions = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: 'all', label: 'All time' },
];

export const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
];

export const surveyFilterOptions = [
  { value: 'all', label: 'All surveys' },
  { value: '6-8 Fall 2025', label: '6-8 Fall 2025' },
  { value: '6-8 Spring 2025', label: '6-8 Spring 2025' },
  { value: '6-8 Fall 2026', label: '6-8 Fall 2026' },
  { value: '6-8 Fall 2023', label: '6-8 Fall 2023' },
  { value: '6-8 Spring 2024', label: '6-8 Spring 2024' },
  { value: '6-8 Winter 2025', label: '6-8 Winter 2025' },
];

function dt(daysAgo: number, hour: number = 9): Date {
  return new Date(2026, 6, 23 - daysAgo, hour, 0, 0);
}

function evt(
  id: string,
  category: string,
  action: string,
  description: string,
  actorRole: SchoolActivityEvent['actorRole'],
  actor: string,
  timestamp: Date,
  linkHref: string,
  linkLabel: string,
  opts?: {
    reason?: string;
    survey?: SchoolActivityEvent['survey'];
    detail?: SchoolActivityDetail[];
    needsAttention?: boolean;
  }
): SchoolActivityEvent {
  return {
    id,
    category,
    categoryLabel: categoryConfig[category]?.label || category,
    action,
    description,
    actorRole,
    actor,
    timestamp,
    linkHref,
    linkLabel,
    ...(opts?.reason && { reason: opts.reason }),
    ...(opts?.survey && { survey: opts.survey }),
    ...(opts?.detail && { detail: opts.detail }),
    ...(opts?.needsAttention && { needsAttention: true }),
  };
}

export const seedActivity: SchoolActivityEvent[] = [
  // Category 1 — Survey setup (10 events)
  evt('ev-01', 'surveys', 'Draft created', '6-8 Fall 2025 survey created as a draft', 'you', 'Sarah Nguyen', dt(10, 9), '/school/surveys/s1', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' } }),
  evt('ev-02', 'surveys', 'Draft saved', 'Draft updated for the 6-8 Fall 2025 survey', 'you', 'Sarah Nguyen', dt(9, 10), '/school/surveys/s1', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' } }),
  evt('ev-03', 'surveys', 'Draft deleted', 'Draft deleted for the 6-8 Winter 2025 survey — no responses had been collected', 'you', 'Sarah Nguyen', dt(220, 11), '/school/surveys/s7', 'View survey', { survey: { gradeBand: '6-8', period: 'Winter 2025', href: '/school/surveys/s7' } }),
  evt('ev-04', 'surveys', 'Target set', 'Participation target set to 130 students for the 6-8 Fall 2025 survey', 'you', 'Sarah Nguyen', dt(10, 11), '/school/surveys/s1', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' } }),
  evt('ev-05', 'surveys', 'Target changed', 'Participation target changed from 100 to 130 students', 'you', 'Sarah Nguyen', dt(170, 14), '/school/surveys/s1', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' }, detail: [{ label: 'Target', before: '100', after: '130' }] }),
  evt('ev-06', 'surveys', 'Reminders enabled', 'Participation reminders turned on for the 6-8 Fall 2025 survey — reminders are sent to you, not to students', 'you', 'Sarah Nguyen', dt(1, 9), '/school/surveys/s1', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' } }),
  evt('ev-07', 'surveys', 'Reminders disabled', 'Participation reminders turned off for the 6-8 Fall 2025 survey', 'you', 'Sarah Nguyen', dt(200, 15), '/school/surveys/s1', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' } }),
  evt('ev-08', 'surveys', 'Access code set', 'Access code set for the 6-8 Fall 2025 survey', 'you', 'Sarah Nguyen', dt(4, 10), '/school/surveys/s1', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' } }),
  evt('ev-09', 'surveys', 'Access code changed', 'Access code changed for the 6-8 Fall 2025 survey', 'you', 'Sarah Nguyen', dt(0, 1), '/school/surveys/s1', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' }, detail: [{ label: 'Previous code', before: 'LUNCH7', after: 'CAFE2025' }] }),
  evt('ev-10', 'surveys', 'Access code removed', 'Access code removed — students can respond with the link alone', 'you', 'Sarah Nguyen', dt(190, 16), '/school/surveys/s1', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' } }),

  // Category 2 — Survey lifecycle (9 events)
  evt('ev-11', 'surveys', 'Survey scheduled', '6-8 Fall 2026 survey scheduled to open 15 September 2026 and close 30 September 2026', 'you', 'Sarah Nguyen', dt(30, 9), '/school/surveys/s2', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2026', href: '/school/surveys/s2' } }),
  evt('ev-12', 'surveys', 'Survey opened', '6-8 Fall 2025 survey opened for responses', 'you', 'Sarah Nguyen', dt(0, 7), '/school/surveys/s1', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' } }),
  evt('ev-13', 'surveys', 'Survey opened now', '6-8 Spring 2025 survey opened immediately', 'you', 'Sarah Nguyen', dt(130, 8), '/school/surveys/s3', 'View survey', { survey: { gradeBand: '6-8', period: 'Spring 2025', href: '/school/surveys/s3' } }),
  evt('ev-14', 'surveys', 'Survey paused', '6-8 Fall 2025 survey paused — students see a "not available" message', 'you', 'Sarah Nguyen', dt(120, 10), '/school/surveys/s1', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' } }),
  evt('ev-15', 'surveys', 'Survey resumed', '6-8 Fall 2025 survey resumed, collecting until 25 July 2026', 'you', 'Sarah Nguyen', dt(110, 9), '/school/surveys/s1', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' } }),
  evt('ev-16', 'surveys', 'Survey extended', 'Closing date extended from 25 July 2026 to 1 August 2026', 'you', 'Sarah Nguyen', dt(100, 14), '/school/surveys/s1', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' }, detail: [{ label: 'Closing date', before: '25 July 2026', after: '1 August 2026' }] }),
  evt('ev-17', 'surveys', 'Survey closed early', '6-8 Spring 2025 survey closed early with 21% participation (27 of 130)', 'you', 'Sarah Nguyen', dt(65, 15), '/school/surveys/s3', 'View survey', { survey: { gradeBand: '6-8', period: 'Spring 2025', href: '/school/surveys/s3' } }),
  evt('ev-18', 'surveys', 'Survey closed', '6-8 Spring 2025 survey closed on schedule with 21% participation (27 of 130)', 'System', 'System', dt(60, 0), '/school/surveys/s3', 'View survey', { survey: { gradeBand: '6-8', period: 'Spring 2025', href: '/school/surveys/s3' } }),
  evt('ev-19', 'surveys', 'Survey cancelled', '6-8 Winter 2025 survey cancelled — no report produced. The record is retained in your history.', 'you', 'Sarah Nguyen', dt(70, 11), '/school/surveys/s7', 'View survey', { reason: 'Low expected participation due to exam schedule conflict', survey: { gradeBand: '6-8', period: 'Winter 2025', href: '/school/surveys/s7' } }),

  // Category 3 — Distribution (5 events)
  evt('ev-20', 'distribution', 'Link generated', 'Survey link and QR code generated for the 6-8 Fall 2025 survey', 'System', 'System', dt(7, 0), '/school/surveys/s1/share', 'View share page', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' } }),
  evt('ev-21', 'distribution', 'Link copied', 'Survey link copied', 'you', 'Sarah Nguyen', dt(0, 3), '/school/surveys/s1/share', 'View share page'),
  evt('ev-22', 'distribution', 'QR downloaded', 'QR code downloaded for the 6-8 Fall 2025 survey', 'you', 'Sarah Nguyen', dt(1, 13), '/school/surveys/s1/share', 'View share page', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' } }),
  evt('ev-23', 'distribution', 'Link regenerated', 'Survey link regenerated — the previous link no longer works', 'you', 'Sarah Nguyen', dt(150, 10), '/school/surveys/s1/share', 'View share page', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' } }),
  evt('ev-24', 'distribution', 'Link disabled', 'Survey link disabled — students can\'t respond until it\'s regenerated', 'you', 'Sarah Nguyen', dt(160, 11), '/school/surveys/s1/share', 'View share page', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' } }),

  // Category 4 — Participation milestones (4 events)
  evt('ev-25', 'participation', 'Quarter reached', '25% of your target reached — 33 of 130 responses', 'System', 'System', dt(5, 8), '/school/surveys/s1', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' } }),
  evt('ev-26', 'participation', 'Half reached', 'Halfway to your target — 65 of 130 responses', 'System', 'System', dt(6, 10), '/school/surveys/s1', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' } }),
  evt('ev-27', 'participation', 'Target met', 'Participation target reached — 130 of 130 responses (100%)', 'System', 'System', dt(90, 12), '/school/surveys/s3', 'View survey', { survey: { gradeBand: '6-8', period: 'Spring 2025', href: '/school/surveys/s3' } }),
  evt('ev-28', 'participation', 'Below target', 'Participation is below your target with 2 days remaining — 83 of 130 (64%)', 'System', 'System', dt(0, 5), '/school/surveys/s1', 'View survey', { survey: { gradeBand: '6-8', period: 'Fall 2025', href: '/school/surveys/s1' }, needsAttention: true }),

  // Category 5 — Analysis & reports (12 events)
  evt('ev-29', 'reports', 'Analysis started', 'Analysis started for the 6-8 Spring 2025 survey', 'System', 'System', dt(80, 2), '/school/reports/r2', 'View report', { survey: { gradeBand: '6-8', period: 'Spring 2025', href: '/school/surveys/s3' } }),
  evt('ev-30', 'reports', 'Analysis failed', 'Analysis couldn\'t complete for the 6-8 Spring 2025 survey — SFWG has been alerted', 'System', 'System', dt(85, 4), '/school/reports/r2', 'View report', { survey: { gradeBand: '6-8', period: 'Spring 2025', href: '/school/surveys/s3' } }),
  evt('ev-31', 'reports', 'No report produced', 'No report produced — the 6-8 Winter 2025 survey closed without enough valid responses', 'System', 'System', dt(75, 0), '/school/surveys/s7', 'View survey', { survey: { gradeBand: '6-8', period: 'Winter 2025', href: '/school/surveys/s7' } }),
  evt('ev-32', 'reports', 'Report published', '6-8 Spring 2025 report published', 'System', 'System', dt(55, 0), '/school/reports/r2', 'View report', { survey: { gradeBand: '6-8', period: 'Spring 2025', href: '/school/surveys/s3' } }),
  evt('ev-33', 'reports', 'Under review', '6-8 Fall 2023 report requires additional review', 'System', 'System', dt(45, 9), '/school/reports/r4', 'View report', { survey: { gradeBand: '6-8', period: 'Fall 2023', href: '/school/surveys/s4' } }),
  evt('ev-34', 'reports', 'Published after review', '6-8 Fall 2023 report completed review and is now published', 'SFWG', 'SFWG', dt(50, 11), '/school/reports/r4', 'View report', { survey: { gradeBand: '6-8', period: 'Fall 2023', href: '/school/surveys/s4' } }),
  evt('ev-35', 'reports', 'Report directional', '6-8 Spring 2025 report is directional — based on 27 responses', 'System', 'System', dt(54, 2), '/school/reports/r2', 'View report', { survey: { gradeBand: '6-8', period: 'Spring 2025', href: '/school/surveys/s3' } }),
  evt('ev-36', 'reports', 'Detail suppressed', 'Detailed breakdown suppressed for the 6-8 Spring 2025 report — fewer than 10 responses, to protect student anonymity', 'System', 'System', dt(54, 4), '/school/reports/r2', 'View report', { survey: { gradeBand: '6-8', period: 'Spring 2025', href: '/school/surveys/s3' } }),
  evt('ev-37', 'reports', 'Report superseded', '6-8 Spring 2024 report superseded — the survey has reopened and a new version will be generated when it closes again', 'System', 'System', dt(470, 2), '/school/surveys/s5', 'View survey', { survey: { gradeBand: '6-8', period: 'Spring 2024', href: '/school/surveys/s5' } }),
  evt('ev-38', 'reports', 'Version created', 'Report version 2 created for the 6-8 Spring 2024 survey', 'System', 'System', dt(520, 8), '/school/reports/r5', 'View report', { survey: { gradeBand: '6-8', period: 'Spring 2024', href: '/school/surveys/s5' } }),
  evt('ev-39', 'reports', 'Report downloaded', '6-8 Spring 2025 report downloaded as PDF', 'you', 'Sarah Nguyen', dt(53, 10), '/school/reports/r2', 'View report', { survey: { gradeBand: '6-8', period: 'Spring 2025', href: '/school/surveys/s3' } }),
  evt('ev-40', 'reports', 'Viewed by district', 'Your 6-8 Spring 2025 report was viewed by the district administrator', 'district-admin', 'District administrator', dt(510, 14), '/school/reports/r2', 'View report', { survey: { gradeBand: '6-8', period: 'Spring 2025', href: '/school/surveys/s3' } }),

  // Category 6 — Reopen (5 events)
  evt('ev-41', 'reopen', 'Reopen requested', 'Reopen requested for the 6-8 Spring 2024 survey — sent for approval', 'you', 'Sarah Nguyen', dt(472, 9), '/school/surveys/s5', 'View survey', { reason: 'Only 45 responses collected — well below the 130 target', survey: { gradeBand: '6-8', period: 'Spring 2024', href: '/school/surveys/s5' } }),
  evt('ev-42', 'reopen', 'Reopen approved', 'Reopen approved — the survey is collecting again until 12 April 2024. The current report is superseded and temporarily unavailable; a new version will be generated when the survey closes again.', 'district-admin', 'District administrator', dt(470, 11), '/school/surveys/s5', 'View survey', { reason: 'School reported technical issues during the original survey window', survey: { gradeBand: '6-8', period: 'Spring 2024', href: '/school/surveys/s5' } }),
  evt('ev-43', 'reopen', 'Reopen declined', 'Reopen declined — the survey stays closed and the current report is unchanged', 'district-admin', 'District administrator', dt(474, 10), '/school/surveys/s6', 'View survey', { reason: 'Insufficient justification for reopening', survey: { gradeBand: '6-8', period: 'Fall 2023', href: '/school/surveys/s6' }, needsAttention: true }),
  evt('ev-44', 'reopen', 'Reopen direct', '6-8 Fall 2023 survey reopened directly until 15 November 2023 — the current report is superseded and a new version will be generated when it closes again', 'you', 'Sarah Nguyen', dt(476, 13), '/school/surveys/s6', 'View survey', { reason: 'District policy allows direct reopen for this school', survey: { gradeBand: '6-8', period: 'Fall 2023', href: '/school/surveys/s6' } }),
  evt('ev-45', 'reopen', 'Survey reclosed', 'Reopened 6-8 Spring 2024 survey closed again with 87% participation (113 of 130)', 'System', 'System', dt(480, 0), '/school/surveys/s5', 'View survey', { survey: { gradeBand: '6-8', period: 'Spring 2024', href: '/school/surveys/s5' } }),

  // Category 7 — Benchmarks (3 events)
  evt('ev-46', 'settings', 'Benchmark available', 'Benchmark became available for 6-8 — enough comparable schools have participated', 'System', 'System', dt(490, 6), '/school/reports/benchmarks', 'View benchmarks'),
  evt('ev-47', 'settings', 'Benchmark withheld', 'Benchmark withheld for 6-8 — the comparison group no longer meets the minimum number of comparable schools', 'System', 'System', dt(500, 8), '/school/reports/benchmarks', 'View benchmarks'),
  evt('ev-48', 'settings', 'Benchmark viewed', 'Benchmarks viewed for 6-8 Spring 2025', 'you', 'Sarah Nguyen', dt(25, 15), '/school/reports/benchmarks', 'View benchmarks', { survey: { gradeBand: '6-8', period: 'Spring 2025', href: '/school/surveys/s3' } }),

  // Category 8 — School settings (5 events)
  evt('ev-49', 'settings', 'Logo uploaded', 'School logo uploaded — it now appears on your report header and in downloaded PDFs', 'you', 'Sarah Nguyen', dt(14, 10), '/school/my-account', 'My account'),
  evt('ev-50', 'settings', 'Logo replaced', 'School logo replaced', 'you', 'Sarah Nguyen', dt(240, 11), '/school/my-account', 'My account'),
  evt('ev-51', 'settings', 'Logo removed', 'School logo removed — reports use the standard header', 'you', 'Sarah Nguyen', dt(250, 12), '/school/my-account', 'My account'),
  evt('ev-52', 'settings', 'Details updated', 'School enrollment changed from 560 to 580', 'SFWG', 'SFWG', dt(260, 9), '/school/my-account', 'My account', { detail: [{ label: 'Enrollment', before: '560', after: '580' }] }),
  evt('ev-53', 'settings', 'Reopen permission changed', 'Reopen permission for this school enabled by the district — you can now reopen closed surveys without approval', 'district-admin', 'District administrator', dt(270, 10), '/school/surveys', 'View surveys'),

  // Category 9 — Administrator (3 events)
  evt('ev-54', 'settings', 'Admin set', 'School administrator Sarah Nguyen set and invited automatically when this school was created', 'System', 'System', dt(310, 0), '/school/my-account', 'My account'),
  evt('ev-55', 'settings', 'Admin activated', 'Sarah Nguyen activated their account as school administrator', 'you', 'Sarah Nguyen', dt(300, 10), '/school/my-account', 'My account'),
  evt('ev-56', 'settings', 'Admin changed', 'School administrator changed from Sarah Nguyen to James Morrison', 'SFWG', 'SFWG', dt(320, 11), '/school/my-account', 'My account', { reason: 'Administrator relocation to another district', detail: [{ label: 'Administrator', before: 'Sarah Nguyen', after: 'James Morrison' }] }),

  // Category 10 — Subscription & access (6 events)
  evt('ev-57', 'account', 'Subscription renewed', 'Subscription renewed — access continues to 5 January 2027', 'SFWG', 'SFWG', dt(340, 8), '/school/subscription', 'View subscription'),
  evt('ev-58', 'account', 'Grace started', 'Subscription expired — grace period started, full access retained for 30 days', 'System', 'System', dt(350, 0), '/school/subscription', 'View subscription'),
  evt('ev-59', 'account', 'Read-only started', 'Access changed to read-only — surveys and settings can no longer be changed', 'System', 'System', dt(360, 2), '/school/subscription', 'View subscription'),
  evt('ev-60', 'account', 'Account deactivated', 'Interactive access suspended — data retained under the retention policy', 'System', 'System', dt(370, 4), '/school/subscription', 'View subscription'),
  evt('ev-61', 'account', 'Access restored', 'Full access restored', 'SFWG', 'SFWG', dt(380, 10), '/school/subscription', 'View subscription', { reason: 'Payment processed and subscription reactivated' }),
  evt('ev-62', 'account', 'Coverage changed', 'Subscription coverage changed — added grade band 9-12', 'SFWG', 'SFWG', dt(390, 11), '/school/subscription', 'View subscription', { detail: [{ label: 'Change', after: 'Added grade band 9-12' }] }),

  // Category 11 — Account & security (6 events)
  evt('ev-63', 'account', 'Signed in', 'Signed in from Chrome on Windows', 'you', 'Sarah Nguyen', dt(0, 9), '/school/my-account', 'My account'),
  evt('ev-64', 'account', 'Signed in new device', 'Signed in from a new device — Firefox on macOS', 'you', 'Sarah Nguyen', dt(400, 14), '/school/my-account', 'My account'),
  evt('ev-65', 'account', 'Password changed', 'Account password changed', 'you', 'Sarah Nguyen', dt(410, 10), '/school/my-account', 'My account'),
  evt('ev-66', 'account', 'Email changed', 'Account email changed from snguyen@hillside.edu to s.nguyen@hillside.edu', 'you', 'Sarah Nguyen', dt(420, 11), '/school/my-account', 'My account', { detail: [{ label: 'Email', before: 'snguyen@hillside.edu', after: 's.nguyen@hillside.edu' }] }),
  evt('ev-67', 'account', 'Profile updated', 'Account profile updated — phone number changed', 'you', 'Sarah Nguyen', dt(430, 13), '/school/my-account', 'My account', { detail: [{ label: 'Field', after: 'Phone number' }] }),
  evt('ev-68', 'account', 'Preferences changed', 'Notification preferences updated', 'you', 'Sarah Nguyen', dt(440, 9), '/school/notifications/preferences', 'View preferences'),

  // Category 12 — Support & data (5 events)
  evt('ev-69', 'support', 'Support submitted', 'Support request "Access code not working for some students" submitted to SFWG', 'you', 'Sarah Nguyen', dt(450, 10), '/school/help/requests', 'My requests'),
  evt('ev-70', 'support', 'Support resolved', 'SFWG marked support request "Access code not working for some students" as resolved', 'SFWG', 'SFWG', dt(460, 11), '/school/help/requests', 'My requests'),
  evt('ev-71', 'support', 'Deletion requested', 'Permanent deletion requested for all survey data — awaiting SFWG approval', 'you', 'Sarah Nguyen', dt(530, 9), '/school/help/requests', 'My requests', { reason: 'School restructuring and consolidation' }),
  evt('ev-72', 'support', 'Deletion completed', 'Permanent deletion completed for all survey data — this can\'t be reversed', 'SFWG', 'SFWG', dt(540, 10), '/school/help/requests', 'My requests'),
  evt('ev-73', 'support', 'Activity exported', 'Activity log exported (1–23 Jul 2026, 12 entries)', 'you', 'Sarah Nguyen', dt(2, 16), '/school/activity', 'View activity'),
];

