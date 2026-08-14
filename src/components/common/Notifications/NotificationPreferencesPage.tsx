'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ToastContext';
import {
  schoolNotificationGroups,
  accountEmail as schoolAccountEmail,
} from '@/lib/schoolNotificationData';
import type { SchoolNotificationGroup } from '@/lib/schoolNotificationData';

/**
 * Role-agnostic preferences screen: each dashboard passes its own trigger groups and
 * account details. School data is the default so the school screens keep working untouched.
 */
interface NotificationPreferencesPageProps {
  groups?: SchoolNotificationGroup[];
  accountEmail?: string;
  /** Where "Change in My account" points for this role. */
  accountHref?: string;
}

interface PreferenceState {
  email: boolean;
  inapp: boolean;
}

type DigestFrequency = 'immediate' | 'daily' | 'weekly';

/**
 * Field-width listbox for the digest frequency. A native `select` can't carry the
 * tinted selected row the design calls for, so the menu is rendered in markup.
 */
function FrequencySelect({
  value,
  options,
  onChange,
}: {
  value: DigestFrequency;
  options: { value: DigestFrequency; label: string }[];
  onChange: (value: DigestFrequency) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="email-frequency-label"
        className="w-full h-11 pl-4 pr-3 rounded-xl text-[14px] flex items-center justify-between gap-2 text-left cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 bg-white border border-line text-ink"
      >
        <span className="truncate">{selectedLabel}</span>
        <span
          className={`w-5 h-5 flex items-center justify-center shrink-0 transition-transform duration-150 text-subtle ${open ? 'rotate-180' : ''}`}
        >
          <i className="ri-arrow-down-s-line text-lg"></i>
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-labelledby="email-frequency-label"
          className="absolute left-0 right-0 top-full mt-1.5 rounded-xl overflow-hidden z-30 bg-white border border-line shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-[14px] cursor-pointer transition-colors duration-100 focus:outline-none focus-visible:bg-iris-50 ${isSelected ? 'bg-iris-50 text-iris font-medium' : 'bg-white text-ink hover:bg-surface-100'}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function NotificationPreferencesPage({
  groups = schoolNotificationGroups,
  accountEmail = schoolAccountEmail,
  accountHref = '/school/my-account',
}: NotificationPreferencesPageProps = {}) {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<Record<string, PreferenceState>>(() => {
    const init: Record<string, PreferenceState> = {};
    groups.forEach(group => {
      group.triggers.forEach(trigger => {
        init[trigger.key] = {
          email: trigger.channels.email,
          inapp: trigger.channels.inapp,
        };
      });
    });
    return init;
  });
  const [digest, setDigest] = useState<DigestFrequency>('immediate');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const allOptionalTriggers = useMemo(() => {
    const result: { key: string; groupId: string }[] = [];
    groups.forEach(g => {
      g.triggers.forEach(t => {
        if (!t.locked) result.push({ key: t.key, groupId: g.id });
      });
    });
    return result;
  }, []);

  const allMuted = useMemo(() => {
    return allOptionalTriggers.every(t => !preferences[t.key]?.email && !preferences[t.key]?.inapp);
  }, [preferences, allOptionalTriggers]);

  function handleCheckboxChange(triggerKey: string, channel: 'email' | 'inapp') {
    setPreferences(prev => ({
      ...prev,
      [triggerKey]: {
        ...prev[triggerKey],
        [channel]: !prev[triggerKey][channel],
      },
    }));
    setDirty(true);
    setSaved(false);
  }

  /** Header shortcut: silence the whole group, or switch every channel back on. */
  function handleGroupDisableAll(groupId: string) {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    const toggleableTriggers = group.triggers.filter(t => !t.locked);
    if (toggleableTriggers.length === 0) return;

    const turnOn = groupAllOff(groupId);

    setPreferences(prev => {
      const next = { ...prev };
      for (const t of toggleableTriggers) {
        next[t.key] = { email: turnOn, inapp: turnOn };
      }
      return next;
    });
    setDirty(true);
    setSaved(false);
  }

  function groupAllOff(groupId: string): boolean {
    const group = groups.find(g => g.id === groupId);
    if (!group) return false;
    const toggleable = group.triggers.filter(t => !t.locked);
    if (toggleable.length === 0) return false;
    return toggleable.every(t => !preferences[t.key]?.email && !preferences[t.key]?.inapp);
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setDirty(false);
      toast('success', 'Notification preferences saved.');
    }, 700);
  }

  function handleCancel() {
    const init: Record<string, PreferenceState> = {};
    groups.forEach(group => {
      group.triggers.forEach(trigger => {
        init[trigger.key] = {
          email: trigger.channels.email,
          inapp: trigger.channels.inapp,
        };
      });
    });
    setPreferences(init);
    setDigest('immediate');
    setDirty(false);
    setSaved(false);
  }

  const frequencyOptions: { value: DigestFrequency; label: string }[] = [
    { value: 'immediate', label: 'Immediately' },
    { value: 'daily', label: 'Daily digest' },
    { value: 'weekly', label: 'Weekly digest' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-[22px] sm:text-[28px] font-semibold text-ink">Notification preferences</h1>
        <p className="text-[14px] mt-1 text-muted">Choose how you want to be notified about your school.</p>
      </div>

      <div className="rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 bg-white border border-line shadow-card">
        <h2 className="text-[15px] font-semibold mb-2 text-ink">
          Your notification controls
        </h2>
        <p className="text-[13px] leading-relaxed text-muted">
          These are your personal alerts. Muting one doesn&apos;t hide the work &mdash; the Operations
          dashboard and each queue always show the full picture.
        </p>
      </div>

      <div
        className="rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 bg-white border border-line shadow-card"
      >
        <h2 className="text-[15px] font-semibold mb-4 text-ink">
          Email delivery
        </h2>

        <span id="email-frequency-label" className="block text-[13px] font-medium mb-1.5 text-ink">
          Email frequency
        </span>
        <FrequencySelect
          value={digest}
          options={frequencyOptions}
          onChange={(next) => { setDigest(next); setDirty(true); setSaved(false); }}
        />

        <p className="text-[12px] mt-2 text-subtle">
          Digests bundle non-urgent emails. Action-required and always-on alerts send immediately regardless.
        </p>

        <div className="h-px my-4 bg-line" />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[13px] text-ink min-w-0 break-all">
            Sent to <span className="font-medium">{accountEmail}</span>
          </p>
          <Link
            href={accountHref}
            className="inline-flex items-center gap-1 text-[13px] font-medium whitespace-nowrap transition-opacity duration-150 hover:opacity-70 focus:outline-none focus-visible:underline rounded text-iris"
          >
            Change
            <i className="ri-arrow-right-up-line text-[13px]"></i>
          </Link>
        </div>
      </div>

      <div className="rounded-xl p-4 mb-4 bg-sage-50 border border-sage-100">
        <div className="flex items-start gap-2">
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-sage">
            <i className="ri-information-line text-base"></i>
          </span>
          <p className="text-[13px] leading-relaxed text-sage-700">
            Survey reminders are sent only for surveys where you turned reminders on when creating them. Reminders always go to you — never to students.
          </p>
        </div>
      </div>

      {allMuted && (
        <div
          className="rounded-2xl p-4 mb-6 flex items-start gap-3 bg-gold-100 border border-[#fcd49a]"
        >
          <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-gold">
            <i className="ri-alert-line text-lg"></i>
          </span>
          <p className="text-[13px] leading-relaxed text-gold-800">
            You&apos;ve turned off all optional alerts. Always-on alerts still send, and your dashboard still shows everything.
          </p>
        </div>
      )}

      {groups.map(group => {
        const isLocked = group.triggers.every(t => t.locked);
        const hasToggleable = group.triggers.some(t => !t.locked);

        return (
          <div
            key={group.id}
            className="rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 bg-white border border-line shadow-card"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                <span className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${isLocked ? 'text-subtle' : 'text-iris'}`}>
                  <i className={`${isLocked ? 'ri-shield-check-line' : 'ri-folder-line'} text-base`}></i>
                </span>
                <h3 className="text-[15px] font-semibold text-ink">
                  {group.title}
                </h3>
                {isLocked && (
                  <span
                    className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold whitespace-nowrap bg-canvas text-subtle border border-line"
                  >
                    Always on
                  </span>
                )}
              </div>

              {hasToggleable && (
                <button
                  type="button"
                  onClick={() => handleGroupDisableAll(group.id)}
                  className="text-[13px] font-medium whitespace-nowrap transition-opacity duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded cursor-pointer text-[#EF4444]"
                >
                  {groupAllOff(group.id) ? 'Enable all' : 'Disable all'}
                </button>
              )}
            </div>

            {group.triggers.map((trigger, idx) => {
              const p = preferences[trigger.key] || { email: false, inapp: false };
              return (
                <div
                  key={trigger.key}
                  className={`flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-4 ${idx === 0 ? 'border-borderTop-0' : 'border-t border-t-surface-100'}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[14px] font-medium ${trigger.locked ? 'text-subtle' : 'text-ink'}`}
                      >
                        {trigger.title}
                      </span>
                      {trigger.locked && (
                        <span
                          className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold whitespace-nowrap bg-canvas text-subtle border border-line"
                        >
                          Always on
                        </span>
                      )}
                    </div>
                    <p className={`text-[13px] mt-1 leading-relaxed ${trigger.locked ? 'text-[#b5b5b5]' : 'text-muted'}`}>
                      {trigger.description}
                    </p>
                    {trigger.locked && trigger.lockReason && (
                      <p className="flex items-center gap-1.5 mt-1.5 text-[12px] text-subtle">
                        <span className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
                          <i className="ri-lock-line text-sm"></i>
                        </span>
                        {trigger.lockReason}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-5 flex-shrink-0 sm:pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={p.email}
                        aria-label={`Email notifications for ${trigger.title}`}
                        disabled={trigger.locked}
                        onClick={() => handleCheckboxChange(trigger.key, 'email')}
                        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 ${p.email ? 'border-0' : 'border-[1.5px] border-faint-400'} ${trigger.locked ? 'opacity-60' : 'opacity-100'} ${trigger.locked ? 'cursor-not-allowed' : 'cursor-pointer'} ${p.email ? trigger.locked ? 'bg-[#a3b59e]' : 'bg-sage' : 'bg-surface'}`}
                      >
                        {p.email && (
                          <span className="w-3 h-3 flex items-center justify-center text-white">
                            <i className="ri-check-line text-xs font-bold"></i>
                          </span>
                        )}
                      </button>
                      <span className={`text-[12px] font-medium ${trigger.locked ? 'text-[#b5b5b5]' : 'text-muted'}`}>
                        Email
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={p.inapp}
                        aria-label={`In-app notifications for ${trigger.title}`}
                        disabled={trigger.locked}
                        onClick={() => handleCheckboxChange(trigger.key, 'inapp')}
                        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 ${p.inapp ? 'border-0' : 'border-[1.5px] border-faint-400'} ${trigger.locked ? 'opacity-60' : 'opacity-100'} ${trigger.locked ? 'cursor-not-allowed' : 'cursor-pointer'} ${p.inapp ? trigger.locked ? 'bg-[#a3b59e]' : 'bg-sage' : 'bg-surface'}`}
                      >
                        {p.inapp && (
                          <span className="w-3 h-3 flex items-center justify-center text-white">
                            <i className="ri-check-line text-xs font-bold"></i>
                          </span>
                        )}
                      </button>
                      <span className={`text-[12px] font-medium ${trigger.locked ? 'text-[#b5b5b5]' : 'text-muted'}`}>
                        In-app
                      </span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 mt-6">
        {saved && (
          <span className="flex items-center justify-center sm:justify-start gap-1.5 text-[13px] sm:mr-auto text-[#22a121]">
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-checkbox-circle-fill text-base"></i>
            </span>
            Saved
          </span>
        )}

        <button
          onClick={handleCancel}
          disabled={!dirty}
          className="inline-flex w-full sm:w-auto items-center justify-center h-[42px] px-6 rounded-full text-[14px] font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white border border-line text-muted hover:bg-canvas"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={!dirty || saving}
          className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 h-[42px] px-6 rounded-full text-[14px] font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${!dirty ? 'bg-sage-50' : 'bg-sage'} ${!dirty ? 'text-subtle' : 'text-white'}`}
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
      </div>
    </div>
  );
}