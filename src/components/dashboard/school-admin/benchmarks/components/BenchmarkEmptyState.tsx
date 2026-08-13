import { MINIMUM_COHORT_SIZE } from '@/lib/schoolAdminData';

export default function BenchmarkEmptyState({
  reason,
  isWithheldCohort,
  cohortSize = 0,
}: {
  reason: string;
  isWithheldCohort?: boolean;
  cohortSize?: number;
}) {
  return (
    <div className="rounded-2xl p-6 sm:p-10 text-center bg-white border border-line shadow-card">
      <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-iris-50">
        <span className="w-6 h-6 flex items-center justify-center text-iris">
          <i className={`${isWithheldCohort ? 'ri-building-line' : 'ri-bar-chart-grouped-line'} text-2xl`}></i>
        </span>
      </div>

      <h3 className="text-[15px] font-semibold mb-1.5 text-ink">
        {isWithheldCohort ? 'Benchmarks are being set up' : 'No benchmark for this period'}
      </h3>

      <p className="text-[13px] leading-relaxed max-w-md mx-auto text-muted">
        {isWithheldCohort
          ? 'SFWG is finalising how schools are grouped for fair comparison. Once defined and enough comparable schools have participated, your benchmark will appear here.'
          : reason || 'Try selecting a different period to see available benchmarks.'}
      </p>

      {isWithheldCohort && cohortSize > 0 && (
        <div className="mt-5 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] bg-canvas border border-line text-muted-500">
            <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
              <i className="ri-time-line text-[13px]"></i>
            </span>
            {cohortSize} comparable schools in this cohort · peer group criteria pending
            <span className="sr-only"> — minimum {MINIMUM_COHORT_SIZE} required</span>
          </span>
        </div>
      )}
    </div>
  );
}
