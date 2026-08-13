'use client';

import { BenchmarkScopeData, MINIMUM_COHORT_SIZE } from '@/lib/schoolAdminData';

export default function BenchmarkScopeCard({
  data,
  isSelected,
  onSelect,
}: {
  data: BenchmarkScopeData;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const colorMap: Record<string, string> = {
    district: 'text-sage',
    comparable: 'text-sage',
    national: 'text-iris',
  };

  const iconMap: Record<string, string> = {
    district: 'ri-building-2-line',
    comparable: 'ri-group-line',
    national: 'ri-global-line',
  };

  const textClass = colorMap[data.scope] || 'text-sage';
  const icon = iconMap[data.scope] || 'ri-bar-chart-grouped-line';

  const isBelowMinimum = data.cohortSize > 0 && data.cohortSize < MINIMUM_COHORT_SIZE;

  if (isBelowMinimum) {
    return (
      <div
        className={`rounded-2xl p-4 sm:p-5 opacity-70 h-full bg-canvas border-2 ${isSelected ? 'border-sage shadow-card' : 'border-line shadow-none'}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${textClass}`}>
              <i className={`${icon} text-lg`}></i>
            </span>
            <div>
              <p className="text-[14px] font-semibold leading-snug text-ink">
                {data.label}
              </p>
              <p className="text-[12px] leading-snug text-[#b0770a]">
                A benchmark will become available when enough comparable schools have participated.
              </p>
              <p className="text-[11px] mt-0.5 text-muted-500">
                Only {data.cohortSize} qualifying schools &mdash; need at least {MINIMUM_COHORT_SIZE} for a reliable benchmark.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cohortInfo = data.cohortSize >= MINIMUM_COHORT_SIZE
    ? `${data.description} · ${data.cohortSize} schools (min. ${MINIMUM_COHORT_SIZE})`
    : data.description;

  return (
    <div
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 h-full bg-white border-2 ${isSelected ? 'border-sage shadow-card' : 'border-line shadow-none hover:border-sage-200'}`}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${textClass}`}>
            <i className={`${icon} text-lg`}></i>
          </span>
          <div>
            <p className="text-[14px] font-semibold leading-snug text-ink">
              {data.label}
            </p>
            <p className="text-[12px] leading-snug text-muted-500">
              {cohortInfo}
            </p>
          </div>
        </div>
        {isSelected && (
          <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 rounded-full bg-sage text-white">
            <i className="ri-check-line text-xs"></i>
          </span>
        )}
      </div>
    </div>
  );
}