'use client';

import type { ConceptScore } from '@/lib/schoolAdminData';
import { barWidthClass } from '@/utils/barWidth';

const bandColors: Record<string, { bg: string; text: string; bar: string; label: string }> = {
  positive: { bg: 'bg-[#E6F2E2]', text: 'text-[#4A9E3F]', bar: 'bg-[#4A9E3F]', label: 'text-[#4A9E3F]' },
  mid: { bg: 'bg-[#FDF3DC]', text: 'text-[#ECBF6A]', bar: 'bg-[#D4A032]', label: 'text-[#D4A032]' },
  negative: { bg: 'bg-[#FDEAEA]', text: 'text-[#B23E3A]', bar: 'bg-[#B23E3A]', label: 'text-[#B23E3A]' },
};

interface ReportScoresProps {
  concepts: ConceptScore[];
}

export default function ReportScores({ concepts }: ReportScoresProps) {
  const sorted = [...concepts].sort((a, b) => b.score - a.score);

  return (
    <section aria-labelledby="scores-heading">
      <h2 id="scores-heading" className="text-[18px] font-semibold mb-4 text-ink">Scores & categories</h2>

      <div className="space-y-4">
        {sorted.map((c) => {
          const bc = bandColors[c.band];
          return (
            <div key={c.concept} className="rounded-2xl p-4 sm:p-5 bg-white border border-line shadow-card">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-semibold text-ink">{c.concept}</span>
                  <span className={`inline-block rounded-full px-3 py-0.5 text-[12px] font-semibold ${bc.bg} ${bc.text}`}>{c.score}</span>
                </div>
                <span className={`text-xs font-medium ${bc.label}`}>
                  {c.band === 'positive' ? 'Positive' : c.band === 'mid' ? 'Neutral' : 'Needs attention'}
                </span>
              </div>

              <div className="h-2 rounded-full mb-4 overflow-hidden bg-surface-100">
                <div className={`h-full rounded-full transition-all duration-500 ${bc.bar} ${barWidthClass(c.score)}`} />
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl p-3 text-center bg-[#E6F2E2]">
                  <p className="text-[19px] sm:text-[24px] font-bold text-[#4A9E3F]">{c.yesPct}%</p>
                  <p className="text-[11px] font-medium mt-0.5 text-[#4A9E3F]">Yes</p>
                </div>
                <div className="rounded-xl p-3 text-center bg-[#FDF3DC]">
                  <p className="text-[19px] sm:text-[24px] font-bold text-[#ECBF6A]">{c.sometimesPct}%</p>
                  <p className="text-[11px] font-medium mt-0.5 text-[#D4A032]">Sometimes</p>
                </div>
                <div className="rounded-xl p-3 text-center bg-[#FDEAEA]">
                  <p className="text-[19px] sm:text-[24px] font-bold text-[#B23E3A]">{c.noPct}%</p>
                  <p className="text-[11px] font-medium mt-0.5 text-[#B23E3A]">No</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-subtle">
          <i className="ri-information-line text-[14px]"></i>
        </span>
        <p className="text-[12px] text-muted-500">
          Score = Yes% + half of Sometimes%
        </p>
      </div>
    </section>
  );
}