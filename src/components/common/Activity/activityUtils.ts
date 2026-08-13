import { CUSTOM_RANGE_VALUE, parseCustomRange, type ActivityDayGroup, type ActivityEvent } from './types';

/** Shared option list for the date filter, in the order the design shows them. */
export const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: CUSTOM_RANGE_VALUE, label: 'Custom' },
];

/**
 * The mock data is authored around a fixed "now" so relative labels stay stable
 * between renders and across sessions. Swap this for `new Date()` once the feed
 * is wired to a real API.
 */
export const ACTIVITY_NOW = new Date(2026, 6, 23, 12, 0, 0);

export function getRelativeTime(date: Date, now: Date = ACTIVITY_NOW): string {
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

export function getAbsoluteTime(date: Date): string {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getDayGroup(date: Date, now: Date = ACTIVITY_NOW): string {
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return 'This week';
  return 'Earlier';
}

/**
 * Matches an event against the date filter value: a day count ('7', '30') or a
 * `custom:<from>:<to>` range. An incomplete custom range filters nothing out.
 */
export function matchDateRange(timestamp: Date, value: string, now: Date = ACTIVITY_NOW): boolean {
  if (value.startsWith(CUSTOM_RANGE_VALUE)) {
    const { from, to } = parseCustomRange(value);
    if (from && timestamp < new Date(`${from}T00:00:00`)) return false;
    if (to && timestamp > new Date(`${to}T23:59:59`)) return false;
    return true;
  }
  const days = parseInt(value, 10);
  if (Number.isNaN(days)) return true;
  return timestamp >= new Date(now.getTime() - days * 86400000);
}

/** Groups in feed order, keeping whatever sort the caller already applied. */
export function groupActivityByDay(events: ActivityEvent[]): ActivityDayGroup[] {
  const groups: ActivityDayGroup[] = [];
  events.forEach((event) => {
    const label = getDayGroup(event.timestamp);
    const existing = groups.find((g) => g.label === label);
    if (existing) {
      existing.events.push(event);
    } else {
      groups.push({ label, events: [event] });
    }
  });
  return groups;
}

export function activityToCsv(events: ActivityEvent[], categoryLabel: (key: string) => string): string {
  const headers = ['ID', 'Category', 'Action', 'Description', 'Actor', 'Actor role', 'Reason', 'Timestamp'];
  const rows = events.map((e) =>
    [e.id, categoryLabel(e.category), e.action, e.description, e.actor, e.actorRole, e.reason || '', getAbsoluteTime(e.timestamp)]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
