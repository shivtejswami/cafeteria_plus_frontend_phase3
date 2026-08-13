'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import YoYKpiCards from '@/components/common/Reports/components/YoYKpiCards';
import YoYConceptComparison from '@/components/common/Reports/components/YoYConceptComparison';
import YoYScoringFootnote from '@/components/common/Reports/components/YoYScoringFootnote';
import GracePeriodBanner from '@/components/school-admin/common/GracePeriodBanner';
import ReadOnlyBanner from '@/components/school-admin/common/ReadOnlyBanner';
import YoYTrendCharts from '@/components/common/Reports/components/YoYTrendCharts';
import { yoyCompletedPeriods, yoyPeriodDetails, yoyInProgressInfo } from '@/lib/schoolAdminData';
import type { SchoolAdminData, YoYPeriodDetail } from '@/lib/schoolAdminData';

const GRADE_BANDS = ['K-5', '6-8', '9-12'] as const;

interface YearOverYearPageProps {
  schoolData: SchoolAdminData;
}

/**
 * Pill dropdown matching the benchmarks context controls: a rounded trigger with
 * a chevron, and a menu where the selected option is tinted and ticked.
 */
function PillDropdown({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="flex items-center justify-between gap-2 h-10 w-full pl-4 pr-2.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 bg-white border border-line text-ink shadow-hairline"
      >
        <span className="truncate">{selectedLabel}</span>
        <span className="w-4 h-4 flex items-center justify-center shrink-0 text-subtle">
          <i className={`${open ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-sm`}></i>
        </span>
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 top-full mt-1 w-full sm:w-max sm:min-w-full max-h-60 overflow-y-auto rounded-xl py-1 z-40 bg-white border border-line shadow-card"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-[13px] whitespace-nowrap transition-colors duration-100 focus:outline-none focus-visible:bg-iris-50 ${option.value === value ? 'bg-iris-50 text-iris font-medium' : 'bg-transparent text-ink'}`}
            >
              {option.value === value && (
                <span className="w-4 h-4 inline-flex items-center justify-center mr-1.5 text-iris">
                  <i className="ri-check-line text-sm"></i>
                </span>
              )}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function getDefaultPeriods(band: string): { a: string; b: string } {
  const periods = yoyCompletedPeriods[band];
  if (!periods || periods.length < 2) return { a: '', b: '' };
  return {
    a: periods[periods.length - 2].value,
    b: periods[periods.length - 1].value,
  };
}

export default function YearOverYearPage({ schoolData }: YearOverYearPageProps) {
  const [gradeBand, setGradeBand] = useState<string>('6-8');
  const defaults = getDefaultPeriods('6-8');
  const [periodAVal, setPeriodAVal] = useState(defaults.a);
  const [periodBVal, setPeriodBVal] = useState(defaults.b);

  const handleGradeBandChange = useCallback((band: string) => {
    setGradeBand(band);
    const d = getDefaultPeriods(band);
    setPeriodAVal(d.a);
    setPeriodBVal(d.b);
  }, []);

  const completedPeriods = useMemo(() => yoyCompletedPeriods[gradeBand] || [], [gradeBand]);

  const periodAOptions = useMemo(() => {
    return completedPeriods.filter((p) => p.value !== periodBVal);
  }, [completedPeriods, periodBVal]);

  const periodBOptions = useMemo(() => {
    return completedPeriods.filter((p) => p.value !== periodAVal);
  }, [completedPeriods, periodAVal]);

  const periodAMeta = completedPeriods.find((p) => p.value === periodAVal);
  const periodBMeta = completedPeriods.find((p) => p.value === periodBVal);

  const detailA: YoYPeriodDetail | null = useMemo(() => {
    if (!periodAVal) return null;
    return yoyPeriodDetails[`${gradeBand}-${periodAVal}`] || null;
  }, [gradeBand, periodAVal]);

  const detailB: YoYPeriodDetail | null = useMemo(() => {
    if (!periodBVal) return null;
    return yoyPeriodDetails[`${gradeBand}-${periodBVal}`] || null;
  }, [gradeBand, periodBVal]);

  const comparable = useMemo(() => {
    if (!detailA || !detailB) return false;
    return detailA.instrumentVersion === detailB.instrumentVersion && detailA.methodologyVersion === detailB.methodologyVersion;
  }, [detailA, detailB]);

  const hideConcepts = useMemo(() => {
    if (!detailA || !detailB) return false;
    return detailA.responseCount < 10 || detailB.responseCount < 10;
  }, [detailA, detailB]);

  const hasSmallSample = useMemo(() => {
    if (!detailA || !detailB) return false;
    return detailA.isSmallSample || detailB.isSmallSample;
  }, [detailA, detailB]);

  const isReadOnly = schoolData.subscriptionStatus === 'read-only';
  const isGrace = schoolData.subscriptionStatus === 'grace-period' && schoolData.graceDaysRemaining;

  if (completedPeriods.length < 2) {
    return (
      <div>
        {isGrace && <div className="mb-6"><GracePeriodBanner daysRemaining={schoolData.graceDaysRemaining!} /></div>}
        {isReadOnly && <div className="mb-6"><ReadOnlyBanner /></div>}

        <div className="flex items-center gap-2 mb-4">
          <Link href="/school/reports" className="text-[13px] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-muted">
            Reports
          </Link>
          <span className="text-[13px] text-subtle">/</span>
          <span className="text-[13px] font-medium text-ink">
            Year-over-year
          </span>
        </div>
        <h1 className="sr-only">Year-over-year comparison</h1>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="w-[72px] sm:w-auto shrink-0 text-[12px] font-medium text-subtle">Grade band</span>
            <div className="flex-1 sm:flex-none sm:w-[120px]">
              <PillDropdown
                value={gradeBand}
                options={GRADE_BANDS.map((band) => ({ value: band, label: band }))}
                onChange={handleGradeBandChange}
                ariaLabel="Select grade band"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl py-16 text-center bg-white border border-line shadow-card">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center bg-sage-50">
            <span className="w-7 h-7 flex items-center justify-center text-sage">
              <i className="ri-line-chart-line text-[21px] sm:text-[26px]"></i>
            </span>
          </div>
          {(() => {
            const inProgress = yoyInProgressInfo[gradeBand];
            if (inProgress) {
              return (
                <>
                  <p className="text-[16px] font-semibold text-ink">
                    Only completed surveys can be compared.
                  </p>
                  <p className="text-[14px] mt-1 max-w-md mx-auto text-subtle">
                    {inProgress.period} is still {inProgress.status}. Once it is completed and published, you will be able to compare periods for {gradeBand}.
                  </p>
                  <Link
                    href="/school/surveys"
                    className="inline-flex items-center rounded-full h-10 px-5 text-[14px] font-semibold mt-4 transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage text-white"
                  >
                    View surveys
                  </Link>
                </>
              );
            }
            return (
              <>
                <p className="text-[16px] font-semibold text-ink">
                  You need at least two completed surveys in this grade band to compare.
                </p>
                <p className="text-[14px] mt-1 max-w-md mx-auto text-subtle">
                  Once you have published reports from two or more survey periods for {gradeBand}, you can compare them here.
                </p>
                <Link
                  href="/school/surveys"
                  className="inline-flex items-center rounded-full h-10 px-5 text-[14px] font-semibold mt-4 transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage text-white"
                >
                  View surveys
                </Link>
              </>
            );
          })()}
        </div>
      </div>
    );
  }

  return (
    <div>
      {isGrace && <div className="mb-6"><GracePeriodBanner daysRemaining={schoolData.graceDaysRemaining!} /></div>}
      {isReadOnly && <div className="mb-6"><ReadOnlyBanner /></div>}

      <div className="flex items-center gap-2 mb-4">
        <Link href="/school/reports" className="text-[13px] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-muted">
          Reports
        </Link>
        <span className="text-[13px] text-subtle">/</span>
        <span className="text-[13px] font-medium text-ink">
          Year-over-year
        </span>
      </div>
      <h1 className="sr-only">Year-over-year comparison</h1>

      <div className="rounded-2xl p-4 sm:p-5 mb-6 bg-white border border-line shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 sm:flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-[72px] sm:w-auto shrink-0 text-[12px] font-medium text-subtle">Grade band</span>
            <div className="flex-1 sm:flex-none sm:w-[120px]">
              <PillDropdown
                value={gradeBand}
                options={GRADE_BANDS.map((band) => ({ value: band, label: band }))}
                onChange={handleGradeBandChange}
                ariaLabel="Select grade band"
              />
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px bg-line" />

          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-2">
            <div className="flex items-center gap-2">
              <span className="w-[72px] sm:w-auto shrink-0 text-[12px] font-medium text-subtle">Compare</span>
              <div className="flex-1 sm:flex-none sm:w-[150px]">
                <PillDropdown
                  value={periodAVal}
                  options={periodAOptions.map((opt) => ({ value: opt.value, label: opt.label }))}
                  onChange={setPeriodAVal}
                  ariaLabel="Select first period"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-[72px] sm:w-auto shrink-0 text-[12px] sm:text-[14px] font-medium sm:font-normal text-subtle">with</span>
              <div className="flex-1 sm:flex-none sm:w-[150px]">
                <PillDropdown
                  value={periodBVal}
                  options={periodBOptions.map((opt) => ({ value: opt.value, label: opt.label }))}
                  onChange={setPeriodBVal}
                  ariaLabel="Select second period"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {!comparable && periodAMeta && periodBMeta && (
        <div className="rounded-2xl overflow-hidden mb-6 flex bg-white border border-line shadow-card">
          <div className="w-1 flex-shrink-0 bg-gold" />
          <div className="p-4 pl-4 flex-1 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gold-100">
              <span className="w-5 h-5 flex items-center justify-center text-gold">
                <i className="ri-error-warning-line text-[18px]"></i>
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[14px] font-semibold text-ink">
                  Different survey or methodology versions
                </p>
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold bg-gold-100 text-gold">
                  Context only
                </span>
              </div>
              <p className="text-[13px] mt-1 leading-snug text-muted">
                {periodAMeta.label} used instrument {periodAMeta.instrumentVersion} with methodology {periodAMeta.methodologyVersion}, while {periodBMeta.label} used instrument {periodBMeta.instrumentVersion} with methodology {periodBMeta.methodologyVersion}. Because questions or scoring may have changed, score, sentiment, and concept comparisons are shown for context and aren&apos;t an exact like-for-like. Response rate comparisons are unaffected.
              </p>
            </div>
          </div>
        </div>
      )}

      {comparable && periodAMeta && periodBMeta && (
        <div className="rounded-2xl overflow-hidden mb-6 flex bg-white border border-line shadow-card">
          <div className="w-1 flex-shrink-0 bg-leaf" />
          <div className="p-4 pl-4 flex-1 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-sage-100">
              <span className="w-5 h-5 flex items-center justify-center text-leaf">
                <i className="ri-checkbox-circle-fill text-[18px]"></i>
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[14px] font-semibold text-ink">
                  Directly comparable
                </p>
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold bg-sage-100 text-leaf">
                  Like-for-like
                </span>
              </div>
              <p className="text-[13px] mt-1 leading-snug text-sage">
                Both periods used instrument {periodAMeta.instrumentVersion} with methodology {periodAMeta.methodologyVersion}. Scores, sentiment, and concept changes are directly comparable.
              </p>
            </div>
          </div>
        </div>
      )}

      {hasSmallSample && detailA && detailB && (
        <div className="rounded-2xl overflow-hidden mb-6 flex bg-white border border-line shadow-card">
          <div className="w-1 flex-shrink-0 bg-gold" />
          <div className="p-4 pl-4 flex-1 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gold-100">
              <span className="w-5 h-5 flex items-center justify-center text-gold">
                <i className="ri-error-warning-line text-[18px]"></i>
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[14px] font-semibold text-ink">
                  Small sample — treat deltas as directional
                </p>
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold bg-gold-100 text-gold">
                  Directional only
                </span>
              </div>
              <p className="text-[13px] mt-1 leading-snug text-muted">
                {detailA.isSmallSample && `${detailA.period} had ${detailA.responseCount} responses (${detailA.responseRate}% response rate). `}
                {detailB.isSmallSample && `${detailB.period} had ${detailB.responseCount} responses (${detailB.responseRate}% response rate). `}
                Changes between periods may not reflect the full student population.
              </p>
            </div>
          </div>
        </div>
      )}

      {detailA && detailB && (
        <>
          <YoYKpiCards periodA={detailA} periodB={detailB} comparable={comparable} />
          <YoYConceptComparison periodA={detailA} periodB={detailB} comparable={comparable} hideConcepts={hideConcepts} />
          <YoYTrendCharts band={gradeBand} />
        </>
      )}

      <YoYScoringFootnote
        gradeBand={gradeBand}
        methodologyVersionA={detailA?.methodologyVersion}
        methodologyVersionB={detailB?.methodologyVersion}
      />

      <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row sm:items-center justify-between flex-wrap gap-3 border-line">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
          {detailA && (
            <Link
              href={`/school/reports/${detailA.reportId}`}
              className="inline-flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2 rounded-full h-9 px-4 text-[13px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-sage-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage-50 border border-[#D6E0D2] text-sage-900"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-file-chart-2-line text-[14px]"></i>
              </span>
              Open {detailA.period} report
            </Link>
          )}
          {detailB && (
            <Link
              href={`/school/reports/${detailB.reportId}`}
              className="inline-flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2 rounded-full h-9 px-4 text-[13px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-sage-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage-50 border border-[#D6E0D2] text-sage-900"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-file-chart-2-line text-[14px]"></i>
              </span>
              Open {detailB.period} report
            </Link>
          )}
          <Link
            href="/school/reports/benchmarks"
            className="inline-flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2 rounded-full h-9 px-4 text-[13px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-sage-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage-50 border border-[#D6E0D2] text-sage-900"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-bar-chart-2-line text-[14px]"></i>
            </span>
            View benchmarks
          </Link>
        </div>
        <p className="text-[12px] text-subtle">
          Reports are available as PDF. Figures match the downloadable report.
        </p>
      </div>
    </div>
  );
}