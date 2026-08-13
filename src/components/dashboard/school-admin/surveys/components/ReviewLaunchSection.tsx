'use client';

import Link from 'next/link';

interface ReviewLaunchSectionProps {
  gradeBand: string | null;
  instrumentVersion: string;
  period: string;
  start: string;
  end: string;
  enrolment: string;
  reminders: boolean;
  accessCode: string | null;
  isValid: boolean;
  isReadOnly: boolean;
  onLaunch: () => void;
  onSaveDraft: () => void;
}

export default function ReviewLaunchSection({
  gradeBand,
  instrumentVersion,
  period,
  start,
  end,
  enrolment,
  reminders,
  accessCode,
  isValid,
  isReadOnly,
  onLaunch,
  onSaveDraft,
}: ReviewLaunchSectionProps) {
  const launchLabel = 'Schedule Survey';

  // Spell out why the button is off — a disabled control with no reason reads as broken.
  const missing = [
    !gradeBand && 'grade band',
    !start && 'start date and time',
    !end && 'end date and time',
    !enrolment && 'enrolment target',
  ].filter(Boolean) as string[];

  const blockedReason = isReadOnly
    ? 'Creating surveys is not available in read-only mode.'
    : missing.length
      ? `Still needed: ${missing.join(', ')}.`
      : !isValid
        ? 'Fix the highlighted fields above — this grade band may already have a survey in progress, or the end date is not after the start date.'
        : null;

  const rows = [
    { label: 'Grade band', value: gradeBand || '—' },
    { label: 'Instrument', value: instrumentVersion || '—' },
    { label: 'Period', value: period || '—' },
    { label: 'Opens', value: start ? formatDateTime(start) : '—' },
    { label: 'Closes', value: end ? formatDateTime(end) : '—' },
    { label: 'Enrolment target', value: enrolment || '—' },
    { label: 'Reminders', value: reminders ? 'On' : 'Off' },
    { label: 'Access code', value: accessCode || 'Not required' },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-4 sm:p-5 bg-[#F4F6F2] border border-[#E8E6E1]">
        <h4 className="text-[13px] font-semibold mb-4 text-[#586D4D]">
          Summary
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {rows.map((r) => (
            <div key={r.label}>
              <p className="text-[12px] mb-0.5 text-[#9A9A9A]">
                {r.label}
              </p>
              <p className="text-[14px] sm:text-[15px] font-semibold text-ink break-words">
                {r.value}
              </p>
            </div>
          ))}
        </div>

        <div className="h-px my-4 bg-[#E1E4DD]" />

        <p className="flex items-center gap-2 text-[13px] text-[#6D28D9]">
          <i className="ri-shield-check-line text-[15px]"></i>
          Anonymous &mdash; no logins, no names collected.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 sm:flex-wrap">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isReadOnly}
          className={`inline-flex items-center justify-center gap-2 rounded-full h-10 px-6 text-[14px] font-semibold whitespace-nowrap transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#586D4D] focus-visible:ring-offset-2 ${isReadOnly ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#eaf0e7]'} bg-[#F4F7F1] border border-[#DCE4D6] text-[#586D4D]`}
          title={isReadOnly ? 'Saving drafts is not available in read-only mode' : undefined}
        >
          Save draft
        </button>

        <button
          type="button"
          onClick={onLaunch}
          disabled={!isValid || isReadOnly}
          className={`inline-flex items-center justify-center gap-2 rounded-full h-10 px-6 text-[14px] font-semibold whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 ${!isValid || isReadOnly ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'} bg-sage text-white ${!isValid || isReadOnly ? 'shadow-none' : 'shadow-[0_4px_14px_rgba(88,109,77,0.25)]'}`}
          title={isReadOnly ? 'Creating surveys is not available in read-only mode' : !isValid ? 'Complete all required fields and resolve any errors' : undefined}
        >
          {launchLabel}
        </button>
      </div>

      {blockedReason && (
        <p className="text-[12px] text-[#9A9A9A]">{blockedReason}</p>
      )}
    </div>
  );
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}