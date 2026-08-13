'use client';

import DateField from '@/components/ui/DateField';

interface ScheduleSectionProps {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  error: string | null;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

export default function ScheduleSection({ startDate, startTime, endDate, endTime, error, onChange, disabled }: ScheduleSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-[13px] font-semibold mb-1.5 text-ink">
            Start date<span className="text-red-500 ml-0.5">*</span>
          </label>
          <DateField
            value={startDate}
            onChange={(iso) => onChange('startDate', iso)}
            disabled={disabled}
            aria-label="Start date"
            className="w-full h-10 px-3 rounded-xl flex items-center justify-between gap-2 text-base sm:text-[14px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#586D4D] focus-visible:ring-offset-1 transition-colors duration-150 disabled:opacity-40 bg-white border border-[#E8E6E1]"
          />
          <p className="text-[12px] mt-1 text-muted-500">
            The survey opens automatically at this time.
          </p>
        </div>
        <div>
          <label className="block text-[13px] font-semibold mb-1.5 text-ink">
            Start time<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => onChange('startTime', e.target.value)}
            disabled={disabled}
            className="w-full h-10 px-3 rounded-xl text-base sm:text-[14px] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors duration-150 disabled:opacity-40 bg-white border border-[#E8E6E1] text-ink"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-[13px] font-semibold mb-1.5 text-ink">
            End date<span className="text-red-500 ml-0.5">*</span>
          </label>
          <DateField
            value={endDate}
            onChange={(iso) => onChange('endDate', iso)}
            disabled={disabled}
            min={startDate || undefined}
            aria-label="End date"
            className="w-full h-10 px-3 rounded-xl flex items-center justify-between gap-2 text-base sm:text-[14px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#586D4D] focus-visible:ring-offset-1 transition-colors duration-150 disabled:opacity-40 bg-white border border-[#E8E6E1]"
          />
          <p className="text-[12px] mt-1 text-muted-500">
            The survey closes automatically at this time. You can also close early or extend later.
          </p>
        </div>
        <div>
          <label className="block text-[13px] font-semibold mb-1.5 text-ink">
            End time<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => onChange('endTime', e.target.value)}
            disabled={disabled}
            className="w-full h-10 px-3 rounded-xl text-base sm:text-[14px] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors duration-150 disabled:opacity-40 bg-white border border-[#E8E6E1] text-ink"
          />
        </div>
      </div>

      <div className="rounded-xl px-3.5 py-2.5 flex items-start gap-2.5 bg-[#F4F6F2] border border-[#E8E6E1]">
        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#586D4D]">
          <i className="ri-information-line"></i>
        </span>
        <p className="text-[12px] text-muted">
          After launch you can open now, close early, pause, or extend — the schedule isn't rigid.
        </p>
      </div>

      {error && (
        <p className="text-[13px] font-medium flex items-center gap-1.5 text-brick">
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-error-warning-line"></i>
          </span>
          {error}
        </p>
      )}
    </div>
  );
}