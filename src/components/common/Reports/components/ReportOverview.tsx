'use client';

import type { ReportDetailData } from '@/lib/schoolAdminData';

const bandColors: Record<string, { bg: string; text: string; bar: string }> = {
  positive: { bg: 'bg-[#E6F2E2]', text: 'text-leaf', bar: '#4a9e3f' },
  mid: { bg: 'bg-[#FDF3DC]', text: 'text-gold-300', bar: '#ecbf6a' },
  negative: { bg: 'bg-brick-50', text: 'text-brick-600', bar: '#b23e3a' },
};

interface ReportOverviewProps {
  report: ReportDetailData;
}

export default function ReportOverview({ report }: ReportOverviewProps) {
  const overallBand = report.overallSatisfaction >= 65 ? 'positive' : report.overallSatisfaction >= 45 ? 'mid' : 'negative';
  const overallColor = bandColors[overallBand];

  return (
    <section aria-labelledby="overview-heading">
      <h2 id="overview-heading" className="text-[18px] font-semibold mb-4 text-ink">Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-line shadow-card">
          <p className="text-[13px] font-medium mb-1 text-[#8A8A8A]">Completed responses</p>
          <p className="text-[24px] sm:text-[32px] font-semibold leading-tight text-ink">{report.responseCount}</p>
        </div>
        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-line shadow-card">
          <p className="text-[13px] font-medium mb-1 text-[#8A8A8A]">Response rate</p>
          <p className="text-[24px] sm:text-[32px] font-semibold leading-tight text-ink">{report.responseRate}%</p>
          <p className="text-[12px] text-subtle">{report.responseCount} of {report.targetCount} enrolled</p>
        </div>
        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-line shadow-card">
          <p className="text-[13px] font-medium mb-1 text-[#8A8A8A]">Overall satisfaction</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[24px] sm:text-[32px] font-semibold leading-tight text-ink">{report.overallSatisfaction}</p>
            <span className={`text-[14px] font-medium whitespace-nowrap ${overallColor.text}`}>out of 100</span>
          </div>
        </div>
      </div>

      {report.concepts.length > 0 && (
        <div className="rounded-2xl p-4 sm:p-5 mb-6 bg-white border border-line shadow-card">
          <h3 className="text-[14px] font-semibold mb-3 text-ink">Scorecard preview</h3>
          <div className="flex items-center gap-3 flex-wrap">
            {report.concepts.map((c) => {
              const bc = bandColors[c.band];
              return (
                <div key={c.concept} className={`flex items-center gap-2 rounded-full px-4 py-2 ${bc.bg}`}>
                  <span className="text-[13px] font-medium text-ink">{c.concept}</span>
                  <span className={`text-[15px] font-bold ${bc.text}`}>{c.score}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Purple card with an inset white body — the thin purple edge around the body is the card showing through. */}
      {report.status === 'superseded' ? (
        <div className="rounded-2xl p-5 sm:p-6 bg-[#FAF9F6] border border-[#F0EDE6]">
          <p className="text-[14px] sm:text-[15px] text-[#4A4A4A] leading-relaxed">
            The {report.period} survey showed moderate satisfaction across most areas, with staff friendliness standing out as a strength. Variety was the lowest-scoring concept. A newer version of this report ({report.supersededByVersion || 'v2'}) is available &mdash; this {report.version || 'v1'} has been superseded.
          </p>
        </div>
      ) : (
        report.insights && (
          <div className="rounded-3xl overflow-hidden bg-[#FAF8FC] border border-[#EDE3F5] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.02)]">
            <div className="flex flex-wrap items-center gap-2.5 px-5 sm:px-6 py-4">
              <h3 className="text-[17px] sm:text-[18px] font-bold text-[#2B2B2B]">
                Executive summary
              </h3>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-[#6D28D9] text-white">
                AI-generated
              </span>
            </div>
            <div className="px-1.5 pb-1.5">
              <div className="rounded-2xl bg-white border-l-[4px] border-[#6D28D9] p-5 sm:p-6 shadow-xs">
                <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#4A4A4A]">
                  {report.insights.executiveSummary}
                </p>
              </div>
            </div>
          </div>
        )
      )}
    </section>
  );
}