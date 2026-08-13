'use client';

interface SurveyScheduledModalProps {
  gradeBand: string;
  period: string;
  opens: string;
  closes: string;
  enrolment: string;
  accessCode: string | null;
  onClose: () => void;
}

export default function SurveyScheduledModal({
  gradeBand,
  period,
  opens,
  closes,
  enrolment,
  accessCode,
  onClose,
}: SurveyScheduledModalProps) {
  const opensLabel = formatDateTime(opens);
  const closesLabel = formatDateTime(closes);

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
        aria-label="Survey scheduled"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <i className="ri-close-line text-xl"></i>
        </button>

        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-5">
          <div className="flex items-start gap-4 pr-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 bg-[#E3F5E3] text-[#586D4D]">
              <i className="ri-check-line text-2xl"></i>
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-semibold text-[#2B2B2B]">Survey scheduled</h2>
              <p className="text-[13px] sm:text-sm text-[#9A9A9A] mt-0.5">
                Your {gradeBand} {period} survey is scheduled and ready.
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 bg-[#FAF9F6] border border-[#F0EDE6]">
            <h3 className="text-[13px] font-semibold mb-4 text-[#9A9A9A]">Key details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
              <DetailItem icon="ri-user-line" label="Grade band" value={gradeBand || '—'} />
              <DetailItem icon="ri-file-list-2-line" label="Survey" value={period || '—'} />
              <div>
                <p className="text-[12px] mb-1 text-[#9A9A9A] flex items-center gap-1.5">
                  <i className="ri-flag-line text-[13px]"></i>
                  Status
                </p>
                <span className="inline-block rounded-full px-2.5 py-0.5 text-[12px] font-medium bg-[#F0EAFB] text-[#6D28D9]">
                  Scheduled
                </span>
              </div>
              <DetailItem icon="ri-calendar-line" label="Opens" value={opensLabel} />
              <DetailItem icon="ri-calendar-check-line" label="Closes" value={closesLabel} />
              <DetailItem icon="ri-user-line" label="Enrolment target" value={enrolment ? `${enrolment} students` : '—'} />
              <DetailItem icon="ri-key-2-line" label="Access code" value={accessCode || 'Not required'} />
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 bg-[#F4F6F2] border border-[#E8E6E1]">
            <h3 className="text-[13px] font-semibold mb-3 text-[#586D4D]">What happens next</h3>
            <div className="space-y-3">
              <NextStep icon="ri-calendar-line">
                The survey opens automatically on {opensLabel}. No manual action needed.
              </NextStep>
              <NextStep icon="ri-link">
                Your survey link and QR code are available now — share them ahead of time or when the survey opens.
              </NextStep>
              <NextStep icon="ri-notification-3-line">
                You&apos;ll be notified as participation comes in and when the report is ready.
              </NextStep>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full h-10 px-5 text-[14px] font-semibold whitespace-nowrap transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#586D4D] focus-visible:ring-offset-2 bg-white border border-[#DCE4D6] text-[#586D4D] hover:bg-[#F4F7F1] cursor-pointer"
          >
            <i className="ri-arrow-left-line text-base"></i>
            Back to surveys
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] mb-1 text-[#9A9A9A] flex items-center gap-1.5">
        <i className={`${icon} text-[13px]`}></i>
        {label}
      </p>
      <p className="text-[14px] font-semibold text-[#2B2B2B] break-words">{value}</p>
    </div>
  );
}

function NextStep({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-[#586D4D]">
        <i className={icon}></i>
      </span>
      <p className="text-[14px] leading-relaxed text-[#2B2B2B]">{children}</p>
    </div>
  );
}

function formatDateTime(iso: string): string {
  if (!iso) return '—';
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
