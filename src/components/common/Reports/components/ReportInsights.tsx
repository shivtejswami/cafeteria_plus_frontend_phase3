'use client';

import type { ReportInsightData } from '@/lib/schoolAdminData';

interface ReportInsightsProps {
  insights: ReportInsightData;
}

export default function ReportInsights({ insights }: ReportInsightsProps) {
  return (
    <section aria-labelledby="insights-heading">
      <h2 id="insights-heading" className="text-[18px] font-semibold mb-4 text-ink">Insights</h2>

      <div className="space-y-4">
        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-sage-100 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-[#4A9E3F]">
              <i className="ri-thumb-up-line text-[17px]"></i>
            </span>
            <h3 className="text-[15px] font-semibold text-ink">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {insights.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[14px] leading-relaxed text-ink-800">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#4A9E3F]" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-gold-150 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-[#ECBF6A]">
              <i className="ri-focus-2-line text-[17px]"></i>
            </span>
            <h3 className="text-[15px] font-semibold text-ink">Opportunities</h3>
          </div>
          <ul className="space-y-2">
            {insights.opportunities.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-[14px] leading-relaxed text-ink-800">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#ECBF6A]" />
                {o}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-iris-100 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-iris">
              <i className="ri-lightbulb-line text-[17px]"></i>
            </span>
            <h3 className="text-[15px] font-semibold text-ink">Recommendations</h3>
          </div>
          <ul className="space-y-2">
            {insights.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-[14px] leading-relaxed text-ink-800">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-iris" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}