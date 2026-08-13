import type { NationalBenchmarkState } from '@/lib/schoolAdminData';

export default function BenchmarkLabelBanner({
  selectedScope,
  instrumentVersion,
  gradeBand,
  benchmarkPeriod,
  nationalState,
  nationalCohortSize,
  nationalLastRefreshed,
}: {
  selectedScope: string;
  instrumentVersion: string;
  gradeBand: string;
  benchmarkPeriod: string;
  nationalState?: NationalBenchmarkState;
  nationalCohortSize?: number;
  nationalLastRefreshed?: string;
}) {
  const scopeDescriptions: Record<string, string> = {
    comparable: `Compared with participating middle schools using the same survey version (${gradeBand} · ${instrumentVersion})`,
    district: `Compared with schools in your district using the same survey version (${gradeBand} · ${instrumentVersion})`,
    national: `Compared with participating schools nationwide using the same survey version (${gradeBand} · ${instrumentVersion})`,
  };

  const description = scopeDescriptions[selectedScope] || scopeDescriptions.comparable;

  const isNational = selectedScope === 'national';
  const labelText = isNational ? 'National benchmark' : 'Cafeteria Pulse participating-school benchmark';

  return (
    <div className={`rounded-2xl p-4 sm:p-5 ${isNational ? 'bg-iris-50' : 'bg-[#f4f6f2]'} ${isNational ? 'border border-[#d6ccf0]' : 'border border-sage-200'}`}
    >
      <div className="flex items-start gap-3">
        <span className={`w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 ${isNational ? 'text-iris' : 'text-sage'}`}>
          <i className={`${isNational ? 'ri-global-line' : 'ri-bar-chart-grouped-line'} text-lg`}></i>
        </span>
        <div>
          <p className="text-[13px] leading-relaxed text-[#3a3a3a]">
            {description}
          </p>
          {benchmarkPeriod && (
            <p className="text-[12px] mt-1 text-muted">
              Benchmark period: {benchmarkPeriod}
            </p>
          )}
          <p className={`text-[12px] font-semibold mt-1 ${isNational ? 'text-iris' : 'text-sage'}`}>
            {labelText}
          </p>
          {isNational && nationalCohortSize && (
            <p className="text-[11px] mt-0.5 text-muted-500">
              National benchmark &middot; {nationalCohortSize} schools &middot; last refreshed {nationalLastRefreshed || ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}