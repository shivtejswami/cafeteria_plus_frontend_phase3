'use client';

import { useState, useRef, useEffect } from 'react';

interface BenchmarkContextControlsProps {
  selectedGradeBand: string;
  onGradeBandChange: (band: string) => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  gradeBands: string[];
  periods: { value: string; label: string }[];
  instrumentVersion: string;
}

export default function BenchmarkContextControls({
  selectedGradeBand,
  onGradeBandChange,
  selectedPeriod,
  onPeriodChange,
  gradeBands,
  periods,
  instrumentVersion,
}: BenchmarkContextControlsProps) {
  const [periodOpen, setPeriodOpen] = useState(false);
  const [gradeOpen, setGradeOpen] = useState(false);
  const periodRef = useRef<HTMLDivElement>(null);
  const gradeRef = useRef<HTMLDivElement>(null);
  const selectedPeriodLabel = periods.find(p => p.value === selectedPeriod)?.label || '';

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) {
        setPeriodOpen(false);
      }
      if (gradeRef.current && !gradeRef.current.contains(e.target as Node)) {
        setGradeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#9A9A9A]"
            >
              Grade band
            </label>
            <div className="relative min-w-[120px]" ref={gradeRef}>
              <button
                onClick={() => setGradeOpen(!gradeOpen)}
                className="flex items-center justify-between gap-2 h-10 w-full pl-3.5 pr-2.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-1 bg-white border border-line text-ink shadow-hairline"
                aria-haspopup="listbox"
                aria-expanded={gradeOpen}
              >
                <span className="truncate">{selectedGradeBand}</span>
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
                      aria-selected={selectedGradeBand === band}
                      onClick={() => {
                        onGradeBandChange(band);
                        setGradeOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors duration-100 focus:outline-none focus-visible:bg-iris-50 ${selectedGradeBand === band ? 'bg-iris-50' : 'bg-transparent'} ${selectedGradeBand === band ? 'text-iris' : 'text-ink'}`}
                    >
                      {selectedGradeBand === band && (
                        <span className="w-4 h-4 inline-flex items-center justify-center mr-1.5 text-iris">
                          <i className="ri-check-line text-sm"></i>
                        </span>
                      )}
                      <span className={selectedGradeBand === band ? 'font-medium' : ''}>{band}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#9A9A9A]"
            >
              Period
            </label>
            <div className="relative min-w-[180px]" ref={periodRef}>
              <button
                onClick={() => setPeriodOpen(!periodOpen)}
                className="flex items-center justify-between gap-2 h-10 w-full pl-3.5 pr-2.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 bg-white border border-line text-ink shadow-hairline"
                aria-haspopup="listbox"
                aria-expanded={periodOpen}
              >
                <span className="truncate">
                  {selectedPeriodLabel}
                </span>
                <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-subtle">
                  <i className={`${periodOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-sm`}></i>
                </span>
              </button>
              {periodOpen && (
                <div
                  className="absolute left-0 top-full mt-1 bg-white rounded-xl py-1 z-40 border border-line shadow-card min-w-[200px]"
                  role="listbox"
                >
                  {periods.map((p) => (
                    <button
                      key={p.value}
                      role="option"
                      aria-selected={p.value === selectedPeriod}
                      onClick={() => {
                        onPeriodChange(p.value);
                        setPeriodOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors duration-100 focus:outline-none focus-visible:bg-iris-50 ${p.value === selectedPeriod ? 'bg-iris-50' : 'bg-transparent'} ${p.value === selectedPeriod ? 'text-iris' : 'text-ink'}`}
                    >
                      {p.value === selectedPeriod && (
                        <span className="w-4 h-4 inline-flex items-center justify-center mr-1.5 text-iris">
                          <i className="ri-check-line text-sm"></i>
                        </span>
                      )}
                      <span className={p.value === selectedPeriod ? 'font-medium' : ''}>{p.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[12px] ml-auto flex-shrink-0 text-subtle"
          >
            <span className="w-3.5 h-3.5 flex items-center justify-center">
              <i className="ri-information-line text-sm"></i>
            </span>
            <span>Instrument version: {instrumentVersion}</span>
          </div>
        </div>

        <p className="text-[13px] leading-relaxed text-muted"
        >
          See how your school compares — without ever seeing other schools&apos; identities or individual results.
        </p>
      </div>
    </div>
  );
}