import { BenchmarkScopeData } from '@/lib/schoolAdminData';

interface StatBlockProps {
  label: string;
  schoolValue: string | number;
  benchmarkValue: string | number;
  differenceLabel: string;
  schoolBetter: boolean | null;
  schoolN?: number;
  isDirectional?: boolean;
}

function StatBlock({ label, schoolValue, benchmarkValue, differenceLabel, schoolBetter, schoolN, isDirectional }: StatBlockProps) {
  const diffText = schoolBetter === null ? 'text-muted-500' : (schoolBetter ? 'text-leaf' : 'text-brick-600');

  return (
    <div className="flex-1 rounded-2xl p-4 sm:p-6 min-w-0 bg-white border border-line shadow-hairline"
    >
      <p className="text-[12px] font-medium mb-3 text-subtle"
      >
        {label}
      </p>
      <div className="flex items-baseline gap-4 flex-wrap">
        <div>
          <span className="text-[22px] sm:text-[28px] font-bold leading-none text-ink">
            {typeof schoolValue === 'number' ? schoolValue.toFixed(1) : schoolValue}
          </span>
          <span className="block text-[11px] mt-0.5 text-subtle">
            Your school
            {schoolN !== undefined && (
              <span className="ml-1 text-[#b8b8b6]">&middot; {schoolN} responses</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[12px] text-muted-500">
          <span>vs</span>
        </div>
        <div>
          <span className="text-[22px] sm:text-[28px] font-bold leading-none text-muted">
            {typeof benchmarkValue === 'number' ? benchmarkValue.toFixed(1) : benchmarkValue}
          </span>
          <span className="block text-[11px] mt-0.5 text-subtle">Benchmark</span>
        </div>
      </div>
      <div className="mt-3 pt-3 flex items-center gap-2 border-t border-t-surface-200"
      >
        <span className={`inline-flex items-center gap-1 text-[12px] font-medium whitespace-nowrap ${diffText}`}
        >
          {schoolBetter === true && (
            <span className="w-3.5 h-3.5 flex items-center justify-center">
              <i className="ri-arrow-up-line text-sm"></i>
            </span>
          )}
          {schoolBetter === false && (
            <span className="w-3.5 h-3.5 flex items-center justify-center">
              <i className="ri-arrow-down-line text-sm"></i>
            </span>
          )}
          {schoolBetter === null && (
            <span className="w-3.5 h-3.5 flex items-center justify-center">
              <i className="ri-subtract-line text-sm"></i>
            </span>
          )}
          {differenceLabel}
        </span>
        {isDirectional && (
          <span className="text-[10px] italic text-[#b0770a]">Directional</span>
        )}
      </div>
    </div>
  );
}

interface BenchmarkSummaryStatsProps {
  data: BenchmarkScopeData & { isDirectional?: boolean };
  isVersionMismatched?: boolean;
}

export default function BenchmarkSummaryStats({ data, isVersionMismatched }: BenchmarkSummaryStatsProps) {
  if (!data.isAvailable) {
    return (
      <div className="rounded-2xl p-4 sm:p-6 bg-canvas border border-line"
      >
        <p className="text-[13px] text-muted-500">
          Summary stats will appear when a benchmark becomes available.
        </p>
      </div>
    );
  }

  const avgDiff = data.schoolAverageScore - data.benchmarkAverageScore;
  const partDiff = data.schoolParticipation - data.benchmarkParticipation;
  const sentDiff = data.schoolSentimentPositive - data.benchmarkSentimentPositive;

  const avgDiffLabel = `${avgDiff > 0 ? '+' : ''}${avgDiff.toFixed(1)} points vs benchmark`;
  const partDiffLabel = `${partDiff > 0 ? '+' : ''}${partDiff} pp vs benchmark`;
  const sentDiffLabel = `${sentDiff > 0 ? '+' : ''}${sentDiff} pp vs benchmark`;

  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card"
    >
      <h2 className="text-[15px] font-semibold mb-4 text-ink">
        Overall summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatBlock
          label="Average concept score"
          schoolValue={data.schoolAverageScore}
          benchmarkValue={data.benchmarkAverageScore}
          differenceLabel={isVersionMismatched ? `~${avgDiffLabel.replace('vs benchmark', '(context only)')}` : avgDiffLabel}
          schoolBetter={avgDiff > 0 ? true : avgDiff < 0 ? false : null}
          schoolN={data.schoolResponseCount}
          isDirectional={data.schoolResponseCount < 30 && data.schoolResponseCount > 0}
        />
        <StatBlock
          label="Participation rate"
          schoolValue={`${data.schoolParticipation}%`}
          benchmarkValue={`${data.benchmarkParticipation}%`}
          differenceLabel={isVersionMismatched ? `${partDiff > 0 ? '+' : ''}${partDiff} pp vs benchmark` : partDiffLabel}
          schoolBetter={partDiff > 0 ? true : partDiff < 0 ? false : null}
          schoolN={data.schoolResponseCount}
          isDirectional={data.schoolResponseCount < 30 && data.schoolResponseCount > 0}
        />
        <StatBlock
          label="Sentiment (positive)"
          schoolValue={`${data.schoolSentimentPositive}%`}
          benchmarkValue={`${data.benchmarkSentimentPositive}%`}
          differenceLabel={isVersionMismatched ? `${sentDiff > 0 ? '+' : ''}${sentDiff} pp vs benchmark` : sentDiffLabel}
          schoolBetter={sentDiff > 0 ? true : sentDiff < 0 ? false : null}
          schoolN={data.schoolResponseCount}
          isDirectional={data.schoolResponseCount < 30 && data.schoolResponseCount > 0}
        />
      </div>
      <p className="text-[10px] mt-3 leading-relaxed text-[#c8c8c6]">
        Participation rate is based on the enrolment target each school enters.
      </p>
    </div>
  );
}