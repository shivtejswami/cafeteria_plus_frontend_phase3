'use client';

import { useState, useCallback } from 'react';
import { type NotificationGroup, notificationGroups as initialGroups, accountData } from '@/lib/schoolAdminData';
import { useToast } from '@/components/ToastContext';
import NotificationItemRow from './NotificationItemRow';

export default function NotificationsPage() {
  const { toast } = useToast();
  const [groups, setGroups] = useState<NotificationGroup[]>(initialGroups);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  const controllableGroups = groups.filter(g => g.controllable);
  const lockedGroups = groups.filter(g => !g.controllable);

  const handleToggle = useCallback((
    groupId: string,
    itemId: string,
    channel: 'email' | 'inapp'
  ) => {
    setGroups(prev =>
      prev.map(group => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          items: group.items.map(item => {
            if (item.id !== itemId || item.locked) return item;
            return {
              ...item,
              [channel]: !item[channel],
            };
          }),
        };
      })
    );
    setDirty(true);
    setSaved(false);
  }, []);

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setDirty(false);
      toast('success', 'Notification preferences saved.');
    }, 700);
  }

  return (
    <div className="max-w-[900px]">
      <div className="mb-6 sm:mb-8">
        <p className="text-[13px] mb-1 text-subtle">
          Account / Notifications
        </p>
      </div>

      <div
        className="rounded-2xl p-4 sm:p-6 mb-6 bg-white border border-line shadow-card"
      >
        <h2
          className="text-[17px] font-semibold mb-2 text-ink"
        >
          Choose how you'd like to be notified
        </h2>
        <p className="text-[14px] leading-relaxed text-muted">
          Some important notices — about your account security, access, and subscription — are always on to keep your account safe. Other notifications are fully under your control.
        </p>
      </div>

      <div
        className="rounded-2xl p-4 sm:p-6 mb-6 bg-white border border-line shadow-card"
      >
        <h3
          className="text-[15px] font-semibold mb-3 text-ink"
        >
          Delivery channels
        </h3>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-muted">
              <i className="ri-mail-line text-lg"></i>
            </span>
            <div>
              <p className="text-[14px] font-medium text-ink">
                Email
              </p>
              <p className="text-[12px] text-subtle">
                {accountData.email}
              </p>
            </div>
          </div>
          <div className="hidden sm:block h-8 w-px bg-line" />
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-muted">
              <i className="ri-notification-3-line text-lg"></i>
            </span>
            <div>
              <p className="text-[14px] font-medium text-ink">
                In-app
              </p>
              <p className="text-[12px] text-subtle">
                Shown in the notification bell and kept as a record
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl p-4 sm:p-6 mb-6 bg-white border border-line shadow-card"
      >
        <h3
          className="text-[15px] font-semibold mb-1 text-ink"
        >
          Notifications you can change
        </h3>
        <p className="text-[13px] mb-4 text-muted">
          Turn these on or off for email and in-app separately.
        </p>

        <div className="flex items-center gap-3 sm:gap-6 pb-3 border-b mb-1 border-line"
        >
          <div className="flex-1 min-w-0" />
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <span className="w-11 sm:w-[70px] text-center text-[11px] font-semibold uppercase tracking-wide text-muted">
              Email
            </span>
            <span className="w-11 sm:w-[70px] text-center text-[11px] font-semibold uppercase tracking-wide text-muted">
              In-app
            </span>
          </div>
        </div>

        {controllableGroups.map(group => (
          <div key={group.id}>
            <div className="flex items-center gap-2 py-3 mt-2">
              <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-iris">
                <i className="ri-folder-line text-base"></i>
              </span>
              <span className="text-[14px] font-semibold text-ink">
                {group.title}
              </span>
            </div>
            <div className="pl-0">
              {group.items.map((item, index) => (
                <NotificationItemRow
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  description={item.description}
                  locked={item.locked}
                  lockReason={item.lockReason}
                  email={item.email}
                  inapp={item.inapp}
                  onEmailChange={() => handleToggle(group.id, item.id, 'email')}
                  onInappChange={() => handleToggle(group.id, item.id, 'inapp')}
                  isFirst={index === 0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-4 sm:p-6 mb-6 bg-white border border-line shadow-card"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-subtle">
            <i className="ri-shield-check-line text-base"></i>
          </span>
          <h3
            className="text-[15px] font-semibold text-ink"
          >
            Required notifications
          </h3>
        </div>
        <p className="text-[13px] mb-4 ml-7 text-muted">
          These are always on and cannot be turned off. They keep your account secure and informed.
        </p>

        <div className="flex items-center gap-3 sm:gap-6 pb-3 border-b mb-1 border-line"
        >
          <div className="flex-1 min-w-0" />
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <span className="w-11 sm:w-[70px] text-center text-[11px] font-semibold uppercase tracking-wide text-muted">
              Email
            </span>
            <span className="w-11 sm:w-[70px] text-center text-[11px] font-semibold uppercase tracking-wide text-muted">
              In-app
            </span>
          </div>
        </div>

        {lockedGroups.map(group => (
          <div key={group.id}>
            {group.items.map((item, index) => (
              <NotificationItemRow
                key={item.id}
                id={item.id}
                label={item.label}
                description={item.description}
                locked={item.locked}
                lockReason={item.lockReason}
                email={item.email}
                inapp={item.inapp}
                onEmailChange={() => {}}
                onInappChange={() => {}}
                isFirst={index === 0}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={!dirty || saving}
          className={`inline-flex items-center gap-2 h-[42px] px-6 rounded-full text-[14px] font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${!dirty ? 'bg-sage-50' : 'bg-sage'} ${!dirty ? 'text-subtle' : 'text-white'}`}
        >
          {saving ? (
            <>
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-loader-4-line text-sm animate-spin"></i>
              </span>
              Saving...
            </>
          ) : (
            'Save preferences'
          )}
        </button>

        {saved && (
          <span className="flex items-center gap-1.5 text-[13px] text-[#22a121]">
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-checkbox-circle-fill text-base"></i>
            </span>
            Saved
          </span>
        )}
      </div>
    </div>
  );
}