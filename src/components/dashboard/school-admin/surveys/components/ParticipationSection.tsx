'use client';

import ToggleField from '@/components/school-admin/surveys/components/ToggleField';

const REMINDER_EVENTS = [
  'Survey opened notification',
  'Mid-window status update',
  'Before-close reminder',
  'Low-participation alert',
  'Survey closed summary',
];

interface ParticipationSectionProps {
  enrolment: string;
  reminders: boolean;
  enrolmentError: string | null;
  onEnrolmentChange: (v: string) => void;
  onRemindersChange: (v: boolean) => void;
  disabled?: boolean;
}

export default function ParticipationSection({
  enrolment,
  reminders,
  enrolmentError,
  onEnrolmentChange,
  onRemindersChange,
  disabled,
}: ParticipationSectionProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-[13px] font-semibold mb-1.5 text-ink">
          Enrolment target<span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          type="number"
          min="1"
          value={enrolment}
          onChange={(e) => onEnrolmentChange(e.target.value)}
          disabled={disabled}
          placeholder="e.g. 130"
          className="w-full h-10 px-3 rounded-xl text-base sm:text-[14px] placeholder:text-subtle focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors duration-150 disabled:opacity-40 bg-white border border-[#E8E6E1] text-ink"
        />
        <p className="text-[12px] mt-1.5 text-muted-500">
          Used to show your response rate (e.g. 83 of 130). Enter roughly how many students this survey is for.
        </p>
        {enrolmentError && (
          <p className="text-[13px] font-medium flex items-center gap-1.5 mt-1 text-brick">
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-error-warning-line"></i>
            </span>
            {enrolmentError}
          </p>
        )}
      </div>

      <div>
        <ToggleField
          id="reminders"
          label="Participation reminders"
          helper="Reminders go to you (the admin), not students."
          checked={reminders}
          onChange={onRemindersChange}
          disabled={disabled}
        />

        {reminders && (
          <div className="mt-3 ml-0 sm:ml-14 rounded-xl p-4 bg-[#F4F6F2] border border-[#E8E6E1]">
            <p className="text-[12px] font-medium mb-2 text-[#9A9A9A]">You&apos;ll receive</p>
            <ul className="space-y-1.5">
              {REMINDER_EVENTS.map((event) => (
                <li key={event} className="flex items-center gap-2 text-[13px] text-[#4A4A4A]">
                  <i className="ri-check-line text-[14px] text-[#586D4D]"></i>
                  {event}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}