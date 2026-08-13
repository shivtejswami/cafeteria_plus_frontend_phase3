'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import GradeBandSelector from '@/components/school-admin/surveys/components/GradeBandSelector';
import ScheduleSection from '@/components/school-admin/surveys/components/ScheduleSection';
import ParticipationSection from '@/components/school-admin/surveys/components/ParticipationSection';
import AccessCodeSection from '@/components/school-admin/surveys/components/AccessCodeSection';
import ReviewLaunchSection from '@/components/school-admin/surveys/components/ReviewLaunchSection';
import ReadOnlyNotice from '@/components/school-admin/surveys/components/ReadOnlyNotice';
import SurveyScheduledModal from '@/components/school-admin/surveys/components/SurveyScheduledModal';

interface GradeBand {
  value: string;
  label: string;
  instrumentVersion: string;
}

interface ActiveBand {
  band: string;
  surveyId: string;
}

/** Declared at module scope: a component defined inside the form would be recreated every render. */
function SectionHeader({ number, title, required }: { number: number; title: string; required?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[13px] font-semibold bg-[#F0EAFB] text-[#6D28D9]">
        {number}
      </span>
      <h3 className="text-[15px] sm:text-[16px] font-semibold text-ink">
        {title}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </h3>
    </div>
  );
}

interface CreateSurveyFormProps {
  open?: boolean;
  onClose?: () => void;
  gradeBands: GradeBand[];
  activeBands: ActiveBand[];
  isReadOnly: boolean;
  parentTab?: string;
}

export default function CreateSurveyForm({ open = true, onClose, gradeBands, activeBands, isReadOnly, parentTab }: CreateSurveyFormProps) {
  const pathname = usePathname();

  const currentTabName = useMemo(() => {
    if (parentTab) return parentTab;
    if (pathname?.startsWith('/school/surveys')) return 'Surveys';
    if (pathname?.startsWith('/school/reports')) return 'Reports';
    if (pathname?.startsWith('/school/activity')) return 'Activity';
    return 'Home';
  }, [pathname, parentTab]);

  const [gradeBand, setGradeBand] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('15:00');
  const [enrolment, setEnrolment] = useState('130');
  const [reminders, setReminders] = useState(true);
  const [useAccessCode, setUseAccessCode] = useState(false);
  const [accessCode, setAccessCode] = useState('LUNCH7');
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [enrolmentError, setEnrolmentError] = useState<string | null>(null);
  const [launching, setLaunching] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  const selectedBand = gradeBands.find(b => b.value === gradeBand);
  // Option values are lower-cased ('k-5') while the survey data stores display casing ('K-5').
  const guardActive = activeBands.some(
    (a) => a.band.toLowerCase() === (gradeBand ?? '').toLowerCase(),
  );

  const periodLabel = useMemo(() => {
    if (!startDate) return '';
    const d = new Date(startDate);
    const month = d.getMonth();
    const year = d.getFullYear();
    const season = month >= 6 ? 'Fall' : 'Spring';
    return `${season} ${year}`;
  }, [startDate]);

  const startIso = startDate && startTime ? `${startDate}T${startTime}` : '';
  const endIso = endDate && endTime ? `${endDate}T${endTime}` : '';

  function handleScheduleChange(field: string, value: string) {
    if (field === 'startDate') setStartDate(value);
    if (field === 'startTime') setStartTime(value);
    if (field === 'endDate') setEndDate(value);
    if (field === 'endTime') setEndTime(value);

    // Validate against the value just entered — reading state here would be one edit behind.
    const next = { startDate, startTime, endDate, endTime, [field]: value };
    const start = next.startDate && next.startTime ? `${next.startDate}T${next.startTime}` : '';
    const end = next.endDate && next.endTime ? `${next.endDate}T${next.endTime}` : '';

    setScheduleError(
      start && end && new Date(end).getTime() <= new Date(start).getTime()
        ? 'End date and time must be after the start date and time.'
        : null,
    );
  }

  function handleEnrolmentChange(v: string) {
    setEnrolment(v);
    const n = parseInt(v, 10);
    if (!v) {
      setEnrolmentError('Enrolment target is required.');
    } else if (isNaN(n) || n <= 0) {
      setEnrolmentError('Enter a positive number.');
    } else {
      setEnrolmentError(null);
    }
  }

  const isValid = useMemo(() => {
    if (!gradeBand || guardActive) return false;
    if (!startDate || !startTime || !endDate || !endTime) return false;
    if (!enrolment || enrolmentError) return false;
    if (scheduleError) return false;
    return true;
  }, [gradeBand, guardActive, startDate, startTime, endDate, endTime, enrolment, enrolmentError, scheduleError]);

  // Bail out only after every hook has run — an early return above them breaks the hook order.
  if (!open) return null;

  if (scheduled) {
    return (
      <SurveyScheduledModal
        gradeBand={selectedBand?.label || ''}
        period={periodLabel}
        opens={startIso}
        closes={endIso}
        enrolment={enrolment}
        accessCode={useAccessCode ? accessCode : null}
        onClose={() => {
          setScheduled(false);
          if (onClose) onClose();
        }}
      />
    );
  }

  function handleLaunch() {
    if (!isValid || isReadOnly) return;
    setScheduled(true);
  }

  function handleSaveDraft() {
    if (isReadOnly) return;
    setLaunching(true);
    setTimeout(() => {
      setLaunching(false);
      if (onClose) onClose();
    }, 600);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl w-full max-w-[660px] max-h-[calc(100dvh-2rem)] flex flex-col shadow-2xl border border-[#E8E6E1] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Create survey"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-5 shrink-0">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-semibold text-[#2B2B2B]">Create survey</h2>
            <p className="text-[13px] sm:text-sm text-[#9A9A9A] mt-0.5">
              Set up a new survey for your school&apos;s students.
            </p>
          </div>
          <button
            onClick={onClose || (() => window.history.back())}
            className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-5 sm:space-y-6">
          {isReadOnly && <ReadOnlyNotice />}

          {/* Form steps container card with border on all 4 sides */}
          <div className="rounded-2xl p-4 sm:p-6 space-y-5 sm:space-y-6 bg-white border border-[#E8E6E1]">
            <div>
              <SectionHeader number={1} title="Which survey" required />
              <GradeBandSelector
                bands={gradeBands}
                selected={gradeBand}
                onSelect={setGradeBand}
                activeBands={activeBands}
              />
              {periodLabel && (
                <div className="mt-3 rounded-xl px-3 py-2 flex items-center gap-2 bg-[#F4F6F2] border border-[#E8E6E1]">
                  <span className="w-4 h-4 flex items-center justify-center text-[#586D4D]">
                    <i className="ri-calendar-line"></i>
                  </span>
                  <span className="text-[13px] font-medium text-ink">
                    Period: {periodLabel}
                  </span>
                </div>
              )}
            </div>

            <div className="h-px bg-[#E8E6E1]" />

            <div>
              <SectionHeader number={2} title="Schedule" />
              <ScheduleSection
                startDate={startDate}
                startTime={startTime}
                endDate={endDate}
                endTime={endTime}
                error={scheduleError}
                onChange={handleScheduleChange}
                disabled={isReadOnly}
              />
            </div>

            <div className="h-px bg-[#E8E6E1]" />

            <div>
              <SectionHeader number={3} title="Participation" />
              <ParticipationSection
                enrolment={enrolment}
                reminders={reminders}
                enrolmentError={enrolmentError}
                onEnrolmentChange={handleEnrolmentChange}
                onRemindersChange={setReminders}
                disabled={isReadOnly}
              />
            </div>

            <div className="h-px bg-[#E8E6E1]" />

            <div>
              <SectionHeader number={4} title="Access (optional)" />
              <AccessCodeSection
                useAccessCode={useAccessCode}
                accessCode={accessCode}
                onToggle={setUseAccessCode}
                onCodeChange={setAccessCode}
                disabled={isReadOnly}
              />
            </div>

            <div className="h-px bg-[#E8E6E1]" />

            <div>
              <SectionHeader number={5} title="Review & launch" />
              <ReviewLaunchSection
                gradeBand={selectedBand?.label || null}
                instrumentVersion={selectedBand?.instrumentVersion || ''}
                period={periodLabel}
                start={startIso}
                end={endIso}
                enrolment={enrolment}
                reminders={reminders}
                accessCode={useAccessCode ? accessCode : null}
                isValid={isValid}
                isReadOnly={isReadOnly}
                onLaunch={handleLaunch}
                onSaveDraft={handleSaveDraft}
              />
            </div>
          </div>

          {launching && (
            <div className="mt-4 rounded-xl px-4 py-3 flex items-center gap-2 bg-leaf-50 border border-sage-200">
              <span className="w-5 h-5 flex items-center justify-center text-sage">
                <i className="ri-check-line"></i>
              </span>
              <p className="text-[14px] font-medium text-sage">
                Survey created. Taking you to the distribution view…
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}