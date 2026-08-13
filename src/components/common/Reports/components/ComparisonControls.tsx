'use client';

import { useState, useRef, useEffect } from 'react';

interface ComparisonControlsProps {
  gradeBand: string;
  gradeBands: string[];
  onGradeBandChange: (band: string) => void;
  periodAValue: string;
  periodBValue: string;
  periodOptions: { value: string; label: string }[];
  onPeriodAChange: (value: string) => void;
  onPeriodBChange: (value: string) => void;
}

export default function ComparisonControls({
  gradeBand,
  gradeBands,
  onGradeBandChange,
  periodAValue,
  periodBValue,
  periodOptions,
  onPeriodAChange,
  onPeriodBChange,
}: ComparisonControlsProps) {
  const [gradeOpen, setGradeOpen] = useState(false);
  const gradeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (gradeRef.current && !gradeRef.current.contains(e.target as Node)) {
        setGradeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-white border border-line shadow-card">
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-medium text-subtle">Grade band</span>
          <div className="relative min-w-[120px]" ref={gradeRef}>
            <button
              onClick={() => setGradeOpen(!gradeOpen)}
              className="flex items-center justify-between gap-2 h-10 w-full pl-3.5 pr-2.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 bg-white border border-line text-ink shadow-hairline"
              aria-haspopup="listbox"
              aria-expanded={gradeOpen}
            >
              <span className="truncate">{gradeBand}</span>
              <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-subtle">
                <i className={`${gradeOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-sm`}></i>
              </span>
            </button>
            {gradeOpen && (
              <div
                className="absolute left-0 top-full mt-1 bg-white rounded-xl py-1 z-40 border border-line shadow-card min-w-[160px]"
                role="listbox"
              >
                {gradeBands.map((band) => (
                  <button
                    key={band}
                    role="option"
                    aria-selected={gradeBand === band}
                    onClick={() => {
                      onGradeBandChange(band);
                      setGradeOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors duration-100 focus:outline-none focus-visible:bg-iris-50 ${gradeBand === band ? 'bg-iris-50' : 'bg-transparent'} ${gradeBand === band ? 'text-iris' : 'text-ink'}`}
                  >
                    {gradeBand === band && (
                      <span className="w-4 h-4 inline-flex items-center justify-center mr-1.5 text-iris">
                        <i className="ri-check-line text-sm"></i>
                      </span>
                    )}
                    <span className={gradeBand === band ? 'font-medium' : ''}>{band}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-8 w-px bg-line" />

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-subtle">Compare</span>
          <div className="relative">
            <select
              value={periodAValue}
              onChange={(e) => onPeriodAChange(e.target.value)}
              className="appearance-none rounded-full h-10 pl-4 pr-8 text-[14px] font-medium border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 cursor-pointer bg-white border-line text-ink shadow-hairline"
              aria-label="Select first period"
            >
              {periodOptions.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.value === periodBValue}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 flex items-center justify-center text-subtle">
              <i className="ri-arrow-down-s-line text-sm"></i>
            </span>
          </div>
          <span className="text-[14px] text-subtle">with</span>
          <div className="relative">
            <select
              value={periodBValue}
              onChange={(e) => onPeriodBChange(e.target.value)}
              className="appearance-none rounded-full h-10 pl-4 pr-8 text-[14px] font-medium border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 cursor-pointer bg-white border-line text-ink shadow-hairline"
              aria-label="Select second period"
            >
              {periodOptions.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.value === periodAValue}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 flex items-center justify-center text-subtle">
              <i className="ri-arrow-down-s-line text-sm"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}