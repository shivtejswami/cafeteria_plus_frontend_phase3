import { ConceptBenchmark } from '@/lib/schoolAdminData';

function getBandBgClass(score: number): string {
  if (score >= 65) return 'bg-leaf';
  if (score >= 50) return 'bg-gold-300';
  return 'bg-brick-600';
}

function getBandLabel(score: number): string {
  if (score >= 65) return 'Positive';
  if (score >= 50) return 'Moderate';
  return 'Needs attention';
}

function DiffCell({ difference, isMuted }: { difference: number; isMuted?: boolean }) {
  const direction = difference > 0 ? '▲' : difference < 0 ? '▼' : '—';
  const label = difference > 0 ? 'points above' : difference < 0 ? 'points below' : 'equal';
  const baseTextClass = difference > 0 ? 'text-leaf' : difference < 0 ? 'text-brick-600' : 'text-muted-500';
  const textClass = isMuted ? 'text-[#b8b8b6]' : baseTextClass;

  return (
    <span className={`inline-flex items-center gap-1 text-[13px] font-medium whitespace-nowrap ${textClass}`}
    >
      {isMuted && '~'}
      {direction}
      <span>{Math.abs(difference)}</span>
      <span className={`text-[11px] font-normal ${isMuted ? 'text-[#c8c8c6]' : 'text-muted-500'}`}>
        {label}
      </span>
    </span>
  );
}

export default function BenchmarkComparisonTable({
  concepts,
  benchmarkLabel,
  schoolN,
  isVersionMismatched,
}: {
  concepts: ConceptBenchmark[];
  benchmarkLabel: string;
  schoolN: number;
  isVersionMismatched?: boolean;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-line bg-white"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[580px]">
          <caption className="sr-only">
            Comparison table: your school&apos;s concept scores ({schoolN} responses) versus {benchmarkLabel} benchmark, with differences
          </caption>
          <thead>
            <tr className="border-b border-b-line bg-canvas">
              <th className="text-left px-5 py-3 text-[12px] font-medium text-muted">
                Concept
              </th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-muted">
                Your school
              </th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-muted">
                {benchmarkLabel}
              </th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-muted">
                Difference
              </th>
            </tr>
          </thead>
          <tbody>
            {concepts.map((c, idx) => (
              <tr
                className={`${idx < concepts.length - 1 ? 'border-b border-b-surface-200' : 'border-borderBottom-0'}`}
                key={c.concept}
              >
                <td className="px-5 py-3.5 text-[14px] font-medium text-ink">
                  {c.concept}
                </td>
                <td className="px-5 py-3.5 text-left">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-[14px] font-semibold text-ink">
                      {c.schoolScore}
                    </span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${getBandBgClass(c.schoolScore)}`}
                      title={getBandLabel(c.schoolScore)}
                      aria-label={getBandLabel(c.schoolScore)}
                    ></span>
                  </span>
                </td>
                <td className="px-5 py-3.5 text-left">
                  <span className="text-[14px] text-muted">
                    {c.benchmarkScore}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-left">
                  <DiffCell difference={c.difference} isMuted={isVersionMismatched} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 bg-canvas border-t border-t-line">
        <p className="text-[11px] leading-relaxed text-muted-500">
          Score = Yes% + &frac12; &times; Sometimes% (0&ndash;100). Green &ge; 65, Amber 50&ndash;64, Red &lt; 50. {schoolN} responses.
        </p>
        <p className="text-[11px] leading-relaxed mt-0.5 text-muted-500">
          {benchmarkLabel.includes('national')
            ? 'National figures are de-identified group averages across participating schools nationwide, weighted so no single school can be identified. Other schools are never named.'
            : 'Benchmarks show group averages only. Other schools are never named, and no individual school\'s results are shown.'}
        </p>
      </div>
    </div>
  );
}