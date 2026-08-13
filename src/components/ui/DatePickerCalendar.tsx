'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  MONTHS_LONG,
  WEEKDAYS_SHORT,
  parseIsoDate,
  toIsoDate,
} from '@/components/ui/dateFormat';

interface DatePickerCalendarProps {
  /** Selected day as `YYYY-MM-DD`, or an empty string when nothing is picked yet. */
  value: string;
  onChange: (iso: string) => void;
  /** Earliest selectable day as `YYYY-MM-DD`. Days before it are disabled. */
  min?: string;
  className?: string;
}

/** Sorts ISO dates correctly because `YYYY-MM-DD` compares lexicographically. */
function isBefore(iso: string, min: string): boolean {
  return iso < min;
}

export default function DatePickerCalendar({
  value,
  onChange,
  min,
  className = '',
}: DatePickerCalendarProps) {
  const selected = parseIsoDate(value);

  const [view, setView] = useState(() => {
    if (selected) return { year: selected.year, month: selected.month - 1 };
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  // `getDay()` counts from Sunday; this grid starts on Monday.
  const leadingBlanks = (new Date(view.year, view.month, 1).getDay() + 6) % 7;

  function stepMonth(delta: number) {
    setView((current) => {
      const month = current.month + delta;
      if (month < 0) return { year: current.year - 1, month: 11 };
      if (month > 11) return { year: current.year + 1, month: 0 };
      return { year: current.year, month };
    });
  }

  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04),0px_8px_24px_0px_rgba(0,0,0,0.06)] font-sans ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-[15px] sm:text-[16px] font-bold text-[#2B2B2B] font-sans">
          {MONTHS_LONG[view.month]} {view.year}
        </p>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => stepMonth(-1)}
            aria-label="Previous month"
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#6D6D6D] hover:bg-[#F4F6F2] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => stepMonth(1)}
            aria-label="Next month"
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#6D6D6D] hover:bg-[#F4F6F2] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center">
        {WEEKDAYS_SHORT.map((weekday) => (
          <div
            key={weekday}
            className="h-8 flex items-center justify-center text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans"
          >
            {weekday}
          </div>
        ))}

        {Array.from({ length: leadingBlanks }, (_, index) => (
          <div key={`blank-${index}`} className="h-8 sm:h-9" />
        ))}

        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const iso = toIsoDate({ year: view.year, month: view.month + 1, day });
          const isSelected = iso === value;
          const isDisabled = min ? isBefore(iso, min) : false;

          return (
            <div key={day} className="h-8 sm:h-9 flex items-center justify-center">
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onChange(iso)}
                aria-pressed={isSelected}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[12px] sm:text-[13px] font-medium transition-colors focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                  isSelected
                    ? 'bg-[#4E6547] text-white font-bold shadow-sm'
                    : 'text-[#2B2B2B] hover:bg-[#F4F6F2]'
                }`}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
