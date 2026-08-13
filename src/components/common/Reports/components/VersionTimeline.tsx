'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { VersionEvent, eventTypeConfig, getVersionComparison } from '@/lib/versionHistoryData';
import type { VersionComparisonData } from '@/lib/versionHistoryData';
import CompareVersions from '@/components/common/Reports/components/CompareVersions';

function VersionDropdown({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: number;
  options: number[];
  onChange: (val: number) => void;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-9 px-3.5 rounded-2xl border border-[#E8E6E1] bg-white flex items-center justify-between gap-2 text-[13.5px] font-semibold text-[#2B2B2B] hover:bg-[#FAF9F6] transition-colors focus:outline-none shadow-xs min-w-[76px]"
        aria-label={ariaLabel}
      >
        <span>v{value}</span>
        <i className={`ri-arrow-down-s-line text-base text-[#6D6D6D] transition-transform duration-150 ${open ? 'rotate-180' : ''}`}></i>
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 z-30 min-w-[130px] bg-white rounded-2xl p-1.5 border border-[#E8E6E1] shadow-xl">
          <div className="text-[10px] font-semibold tracking-wider uppercase px-3 py-1 text-[#9A9A9A]">
            version
          </div>
          {options.map((v) => {
            const isSelected = v === value;
            return (
              <button
                key={v}
                type="button"
                onClick={() => {
                  onChange(v);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-left text-[13.5px] flex items-center gap-2 transition-colors ${
                  isSelected
                    ? 'bg-[#F0EAFB] text-[#6D28D9] font-bold'
                    : 'text-[#2B2B2B] hover:bg-[#FAF9F6] font-medium'
                }`}
              >
                <span className="w-4 h-4 flex items-center justify-center shrink-0">
                  {isSelected && <i className="ri-check-line text-sm text-[#6D28D9]"></i>}
                </span>
                <span>v{v}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface VersionTimelineProps {
  reportId: string;
  events: VersionEvent[];
  totalVersions: number;
  currentVersion: number;
}

export default function VersionTimeline({ reportId, events, totalVersions, currentVersion }: VersionTimelineProps) {
  const [compareMode, setCompareMode] = useState(false);
  const [selectedA, setSelectedA] = useState<number>(currentVersion);
  const [selectedB, setSelectedB] = useState<number>(currentVersion > 1 ? currentVersion - 1 : currentVersion);

  const versions = Array.from({ length: totalVersions }, (_, i) => i + 1);

  const comparison = useMemo<VersionComparisonData | null>(() => {
    if (!compareMode || selectedA === selectedB) return null;
    return getVersionComparison(reportId, selectedA, selectedB);
  }, [compareMode, selectedA, selectedB, reportId]);

  return (
    <div className="space-y-5">
      {/* Compare versions control */}
      {totalVersions > 1 ? (
        <div className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 text-[13px] font-medium text-[#6D6D6D]">
            <span className="w-4 h-4 flex items-center justify-center text-[#586D4D]">
              <i className="ri-arrow-left-right-line text-sm"></i>
            </span>
            Compare versions
          </div>
          {compareMode ? (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-[#6D6D6D]">Compare</span>
                <VersionDropdown
                  value={selectedA}
                  options={versions}
                  onChange={setSelectedA}
                  ariaLabel="Select first version to compare"
                />
                <span className="text-[13px] text-[#9A9A9A] px-0.5">vs</span>
                <VersionDropdown
                  value={selectedB}
                  options={versions}
                  onChange={setSelectedB}
                  ariaLabel="Select second version to compare"
                />
              </div>
              <button
                onClick={() => setCompareMode(false)}
                className="h-8 px-4 rounded-full text-[12px] font-semibold whitespace-nowrap bg-[#586D4D] text-white hover:bg-[#4a5c41] transition-colors ml-1"
              >
                Done
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCompareMode(true)}
              className="h-9 px-4 rounded-full text-[13px] font-medium whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] transition-colors inline-flex items-center justify-center gap-1.5 w-full sm:w-auto"
            >
              <span className="w-3.5 h-3.5 flex items-center justify-center">
                <i className="ri-arrow-left-right-line text-xs"></i>
              </span>
              Compare versions
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-4 flex items-center gap-2 border border-[#E8E6E1]">
          <span className="w-4 h-4 flex items-center justify-center text-[#9A9A9A]">
            <i className="ri-arrow-left-right-line text-sm"></i>
          </span>
          <span className="text-[13px] text-[#9A9A9A]">
            Only one version exists &mdash; nothing to compare yet.
          </span>
        </div>
      )}

      {/* Comparison panel */}
      {comparison && (
        <CompareVersions
          comparison={comparison}
          reportId={reportId}
          onClose={() => setCompareMode(false)}
        />
      )}

      {/* Timeline Card */}
      <div className="bg-white rounded-3xl overflow-hidden border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.02)]">
        <div className="px-5 sm:px-6 py-4 flex items-center justify-between border-b border-[#E8E6E1]">
          <h3 className="text-[15px] font-bold text-[#2B2B2B]">
            Version &amp; approval timeline
          </h3>
          <span className="text-[12px] text-[#9A9A9A]">Newest first</span>
        </div>

        <div className="divide-y divide-[#E8E6E1]">
          {events.map((event) => {
            const config = eventTypeConfig[event.eventType] || eventTypeConfig.created;
            const isCurrent = event.isCurrent;

            return (
              <div key={event.id} className="p-4 sm:p-6 hover:bg-[#FAF9F6] transition-colors">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Event icon badge */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${config.bg}`}>
                    <span className={`w-4.5 h-4.5 flex items-center justify-center ${config.color}`}>
                      <i className={`${config.icon} text-base`}></i>
                    </span>
                  </div>

                  {/* Event info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[15px] font-bold text-[#2B2B2B]">
                          {event.title}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F1EFEA] text-[#6D6D6D]">
                          v{event.version} &middot; {isCurrent ? 'Current' : 'Superseded'}
                        </span>
                        {event.holdReason && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FFF3E0] text-[#E65100]">
                            {event.holdReason}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/school/reports/${reportId}`}
                        className="text-[#6D28D9] font-medium text-[13px] hover:underline whitespace-nowrap self-start sm:self-auto"
                        aria-label={`View version ${event.version}`}
                      >
                        View this version
                      </Link>
                    </div>

                    <p className="text-[13px] text-[#6D6D6D] leading-relaxed">
                      {event.detail}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap pt-0.5 text-[12px]">
                      <span className="text-[#9A9A9A]">
                        {event.relative} &middot; {event.actor}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF9F6] border border-[#E8E6E1] text-[#6D6D6D]">
                        Template {event.templateVersion}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF9F6] border border-[#E8E6E1] text-[#6D6D6D]">
                        Methodology {event.methodologyVersion}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Info Context Box */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.02)]">
        <div className="flex items-start gap-3.5">
          <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#6D28D9]">
            <i className="ri-information-line text-xl"></i>
          </span>
          <div className="space-y-1.5 text-[13px] text-[#6D6D6D] leading-relaxed">
            <p>
              <strong className="font-bold text-[#2B2B2B]">Only the latest approved version is the current report.</strong> Superseded versions are preserved for audit and are never shown to the school or district.
            </p>
            <p>
              During any hold, the school sees a neutral &ldquo;Report under review&rdquo; status &mdash; never these internal version details. Reopens create new versions; methodology and template versions are tagged so historical reports stay interpretable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}