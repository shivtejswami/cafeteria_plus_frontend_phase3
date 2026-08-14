'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import FilterDropdown from '@/components/dashboard/ui/FilterDropdown';
import {
  seedNotifications,
  typeFilterGroups as schoolTypeFilterGroups,
  getRelativeTime,
  getDayGroup,
} from '@/lib/schoolNotificationData';
import type { SchoolNotification } from '@/lib/schoolNotificationData';

/**
 * The feed itself is role-agnostic — school, district and admin each pass their own
 * notifications, type filters and links. School data is the default so the school
 * screens keep working untouched.
 */
interface NotificationCentreProps {
  notifications?: SchoolNotification[];
  typeFilterGroups?: { value: string; label: string }[];
  title?: string;
  description?: string;
  /** Where the "Notification settings" button goes for this role. */
  settingsHref?: string;
}

function formatAbsTime(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' at ' +
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

const priorityConfig: Record<string, { icon: string; bg: string; color: string; label: string }> = {
  'action-required': { icon: 'ri-alert-fill', bg: 'bg-gold-100', color: 'text-gold', label: 'Action required' },
  'attention': { icon: 'ri-error-warning-line', bg: 'bg-[#fffbeb]', color: 'text-gold-700', label: 'Attention' },
  'informational': { icon: 'ri-information-line', bg: 'bg-[#F4F3F1]', color: 'text-[#9A9A9A]', label: 'Informational' },
};

function groupNotificationsByDay(notifs: SchoolNotification[]) {
  const today: SchoolNotification[] = [];
  const yesterday: SchoolNotification[] = [];
  const earlierThisWeek: SchoolNotification[] = [];
  const earlier: SchoolNotification[] = [];

  for (const n of notifs) {
    const day = getDayGroup(n.timestamp);
    if (day === 'Today') today.push(n);
    else if (day === 'Yesterday') yesterday.push(n);
    else if (day === 'Earlier this week') earlierThisWeek.push(n);
    else earlier.push(n);
  }
  return { today, yesterday, earlierThisWeek, earlier };
}

export default function NotificationCentre({
  notifications: sourceNotifications = seedNotifications,
  typeFilterGroups = schoolTypeFilterGroups,
  title = 'Notifications',
  description = 'Alerts about your surveys, reports, and account.',
  settingsHref = '/school/notifications/preferences',
}: NotificationCentreProps = {}) {
  const [notifications, setNotifications] = useState<SchoolNotification[]>(() =>
    sourceNotifications.map(n => ({ ...n }))
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const filtered = useMemo(() => {
    let result = [...notifications];
    if (statusFilter === 'unread') result = result.filter(n => !n.read);
    if (statusFilter === 'read') result = result.filter(n => n.read);
    if (typeFilter !== 'all') result = result.filter(n => n.groupId === typeFilter);
    return result;
  }, [notifications, statusFilter, typeFilter]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const grouped = useMemo(() => groupNotificationsByDay(filtered), [filtered]);

  const handleMarkRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const handleMarkUnread = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n));
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
  ];

  // Some callers already include the "all" entry in their groups — don't add a second one.
  const typeOptions = typeFilterGroups.some(g => g.value === 'all')
    ? typeFilterGroups.map(g => ({ value: g.value, label: g.label }))
    : [{ value: 'all', label: 'All types' }, ...typeFilterGroups.map(g => ({ value: g.value, label: g.label }))];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] sm:text-[28px] font-semibold text-ink">{title}</h1>
        <p className="text-[14px] mt-1 text-muted">{description}</p>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <FilterDropdown label="Status" defaultValue="all" value={statusFilter} options={statusOptions} onChange={(v: string) => setStatusFilter(v as 'all' | 'unread' | 'read')} activeBorder="border-iris" activeText="text-iris" />
        <FilterDropdown label="Type" defaultValue="all" value={typeFilter} options={typeOptions} onChange={(v: string) => setTypeFilter(v)} activeBorder="border-iris" activeText="text-iris" />

        <div className="flex-1" />
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="h-9 px-4 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-150 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 text-muted border border-line"
          >
            Mark all read
          </button>
        )}
        <Link
          href={settingsHref}
          className="h-9 px-4 inline-flex items-center rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-150 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 text-sage bg-sage-50 border border-[#D6E0D2]"
        >
          Notification settings
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-2 animate-spin border-line border-t-iris" />
          <p className="text-[14px] mt-4 text-subtle">Loading notifications...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div
            className="rounded-full flex items-center justify-center mb-4 w-[72px] h-[72px] bg-brick-50"
          >
            <span className="w-8 h-8 flex items-center justify-center text-brick">
              <i className="ri-error-warning-line text-3xl"></i>
            </span>
          </div>
          <p className="text-[18px] font-medium mb-1 text-ink">Something went wrong</p>
          <p className="text-[14px] mb-5 text-subtle">We couldn&apos;t load your notifications. Please try again.</p>
          <button
            onClick={() => { setError(false); setLoading(true); setTimeout(() => { setLoading(false); }, 800); }}
            className="h-9 px-5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 bg-sage-50 text-sage border border-sage-200"
          >
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div
            className="rounded-full flex items-center justify-center mb-4 w-[72px] h-[72px] bg-iris-50"
          >
            <span className="w-8 h-8 flex items-center justify-center text-iris">
              <i className="ri-check-double-line text-3xl"></i>
            </span>
          </div>
          <p className="text-[18px] font-medium mb-1 text-ink">You&apos;re all caught up.</p>
          <p className="text-[14px] text-subtle">No notifications match your current filters.</p>
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl overflow-hidden border border-line shadow-card"
        >
          {(['today', 'yesterday', 'earlierThisWeek', 'earlier'] as const).map((key, gi) => {
            const items = grouped[key];
            if (items.length === 0) return null;
            const label = key === 'today' ? 'Today' : key === 'yesterday' ? 'Yesterday' : key === 'earlierThisWeek' ? 'Earlier this week' : 'Earlier';
            return (
              <div key={key}>
                {gi > 0 && grouped[(['today', 'yesterday', 'earlierThisWeek', 'earlier'] as const)[gi - 1]].length > 0 && (
                  <div className="border-t border-t-surface-100" />
                )}
                <div className="px-4 sm:px-6 py-3 bg-[#FAF9F6] border-b border-line">
                  <span className="text-[12px] font-medium text-subtle">
                    {label}
                  </span>
                </div>
                {items.map((n, ni) => {
                  const config = priorityConfig[n.priority] || priorityConfig['informational'];
                  const isUnreadRow = !n.read;
                  const isTopOfGroup = ni === 0;

                  return (
                    <div className={`${isTopOfGroup ? 'border-borderTop-0' : 'border-t border-t-surface-100'}`} key={n.id}>
                      <div
                        className={`group flex items-start px-4 sm:px-6 py-4 transition-colors duration-100 cursor-pointer hover:bg-[#fcfbf9] ${isUnreadRow ? 'bg-[#f6f3fc]' : 'bg-white'}`}
                        role="listitem"
                      >
                        <div className="flex-shrink-0 pt-0.5 w-[16px]">
                          {isUnreadRow && (
                            <span className="w-2.5 h-2.5 rounded-full block bg-iris" aria-label="Unread" />
                          )}
                        </div>

                        <div
                          className={`flex-shrink-0 ml-3 rounded-full flex items-center justify-center w-[40px] h-[40px] ${config.bg}`}
                        >
                          <span className={`w-5 h-5 flex items-center justify-center ${config.color}`}>
                            <i className={`${config.icon} text-[19px]`}></i>
                          </span>
                        </div>

                        {/* On mobile the CTA sits under the text instead of stealing width from it. */}
                        <div className="ml-3 flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {n.priority === 'action-required' && (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap bg-gold-100 text-gold"
                              >
                                {config.label}
                              </span>
                            )}
                            {n.priority === 'attention' && (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap bg-[#fffbeb] text-[#b45309]"
                              >
                                {config.label}
                              </span>
                            )}
                          </div>

                          <p
                            className={`text-[15px] leading-snug mt-1.5 text-ink ${isUnreadRow ? 'font-medium' : 'font-normal'}`}
                          >
                            {n.title}
                          </p>
                          <p className="text-[13px] leading-relaxed mt-0.5 text-muted">
                            {n.body}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {n.schoolName && (
                              <span className="text-[12px] text-subtle">
                                {n.schoolName}
                              </span>
                            )}
                            <span className="text-[12px] text-subtle">
                              {getRelativeTime(n.timestamp)}
                            </span>
                            <span
                              className="text-[11px] text-[#b5b5b5]"
                              aria-label={formatAbsTime(n.timestamp)}
                            >
                              {n.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex-shrink-0 flex items-center gap-2">
                          {n.ctaLabel && n.ctaHref && (
                            <Link
                              href={n.ctaHref}
                              className="text-[13px] font-medium whitespace-nowrap transition-opacity duration-150 hover:opacity-70 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded text-iris"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {n.ctaLabel}
                            </Link>
                          )}
                          {isUnreadRow ? (
                            <button
                              onClick={() => handleMarkRead(n.id)}
                              className="sm:opacity-0 sm:group-hover:opacity-100 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 hover:bg-iris-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2"
                              aria-label={`Mark "${n.title}" as read`}
                            >
                              <span className="w-4 h-4 flex items-center justify-center text-iris">
                                <i className="ri-check-line"></i>
                              </span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMarkUnread(n.id)}
                              className="sm:opacity-0 sm:group-hover:opacity-100 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 hover:bg-surface-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2"
                              aria-label={`Mark "${n.title}" as unread`}
                            >
                              <span className="w-4 h-4 flex items-center justify-center text-subtle">
                                <i className="ri-mail-unread-line text-sm"></i>
                              </span>
                            </button>
                          )}
                        </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function BellDropdown({
  notifications: sourceNotifications = seedNotifications,
  viewAllHref = '/school/notifications',
}: { notifications?: SchoolNotification[]; viewAllHref?: string } = {}) {
  const [notifications] = useState<SchoolNotification[]>(sourceNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;
  const recent = [...notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 7);

  return (
    <div className="w-80 max-h-[420px] overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-line">
        <span className="text-[13px] font-semibold text-ink">
          Notifications
        </span>
        {unreadCount > 0 && (
          <span
            className="min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1.5 text-[11px] font-semibold bg-iris text-white"
          >
            {unreadCount}
          </span>
        )}
      </div>

      {recent.map(n => {
        const isActionRequired = n.priority === 'action-required';
        const isAttention = n.priority === 'attention';
        return (
          <Link
            key={n.id}
            href={n.ctaHref}
            className={`block px-4 py-3 transition-colors duration-100 hover:bg-canvas ${!n.read ? 'bg-[#fdfbff]' : 'bg-transparent'}`}
          >
            <div className="flex items-start gap-2.5">
              <div className="flex-shrink-0 mt-0.5">
                {isActionRequired ? (
                  <span className="w-2 h-2 rounded-full block bg-gold" />
                ) : isAttention ? (
                  <span className="w-2 h-2 rounded-full block bg-[#e8a830]" />
                ) : (
                  <span className="w-2 h-2 rounded-full block bg-faint-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] leading-snug line-clamp-2 text-ink">
                  {n.title}
                </p>
                <p className="text-[11px] mt-1 text-subtle">{getRelativeTime(n.timestamp)}</p>
              </div>
              {!n.read && (
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 bg-iris" />
              )}
            </div>
          </Link>
        );
      })}

      <div className="border-t px-4 py-2.5 flex items-center justify-between border-line">
        <Link
          href={viewAllHref}
          className="text-[13px] font-medium transition-colors duration-150 hover:opacity-70 whitespace-nowrap text-iris"
        >
          View all
        </Link>
      </div>
    </div>
  );
}