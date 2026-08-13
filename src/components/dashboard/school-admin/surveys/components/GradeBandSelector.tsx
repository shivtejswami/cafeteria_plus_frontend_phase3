'use client';

import { useState } from 'react';
import Link from 'next/link';

interface GradeBand {
  value: string;
  label: string;
  instrumentVersion: string;
}

interface ActiveBand {
  band: string;
  surveyId: string;
}

interface GradeBandSelectorProps {
  bands: GradeBand[];
  selected: string | null;
  onSelect: (v: string) => void;
  activeBands: ActiveBand[];
}

export default function GradeBandSelector({ bands, selected, onSelect, activeBands }: GradeBandSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedBand = bands.find(b => b.value === selected);
  // Survey data stores display casing ('K-5') while option values are lower-cased — compare loosely
  // so the warning always matches the disabled launch button.
  const guard = activeBands.find(a => a.band.toLowerCase() === (selected ?? '').toLowerCase());

  return (
    <div className="space-y-3">
      {/* Dropdown trigger & options card */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-10 flex items-center justify-between px-4 rounded-full bg-white border border-[#E8E6E1] text-[14px] font-medium text-[#2B2B2B] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-colors focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <span className={selectedBand ? 'text-[#2B2B2B] font-medium' : 'text-[#9A9A9A]'}>
            {selectedBand ? selectedBand.label : 'Select grade band'}
          </span>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}>
            <path d="M1 1.5L6 6.5L11 1.5" stroke="#9A9A9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white rounded-2xl border border-[#E8E6E1] shadow-xl overflow-hidden py-1">
            {bands.map((b) => {
              const isActive = selected === b.value;
              return (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => {
                    onSelect(b.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-[#F0EAFB] text-[#6D28D9]'
                      : 'bg-white text-[#2B2B2B] hover:bg-slate-50'
                  }`}
                >
                  {isActive && (
                    <span className="text-[#6D28D9] font-bold">✓</span>
                  )}
                  <span>{b.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected && !guard && (
        <div className="rounded-xl px-3.5 py-2.5 flex items-start gap-2.5 bg-sage-50 border border-sage-200">
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-sage">
            <i className="ri-information-line"></i>
          </span>
          <div>
            <p className="text-[13px] font-medium text-ink">
              {selectedBand?.label} &middot; {selectedBand?.instrumentVersion}
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-1 mt-0.5 text-[13px] font-medium text-[#6D28D9] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded cursor-pointer"
            >
              Preview questions
              <i className="ri-arrow-right-up-line text-[13px]"></i>
            </button>
            <p className="text-[12px] mt-0.5 text-muted-500">
              Questions are set by SFWG and can&apos;t be edited.
            </p>
          </div>
        </div>
      )}

      {guard && (
        <div className="rounded-xl px-3.5 py-3 flex items-start gap-2.5 bg-gold-100 border border-[#f5c68a]">
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-gold">
            <i className="ri-error-warning-line"></i>
          </span>
          <div className="flex-1">
            <p className="text-[13px] font-medium text-gold-800">
              {guard.band} already has a survey in progress. You can run one survey per grade band at a time.
            </p>
            <Link
              href={`/school/surveys/${guard.surveyId}`}
              className="inline-block mt-1.5 text-[13px] font-medium transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-iris"
            >
              View the in-progress survey
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}