'use client';

import { useMemo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import type { YoYPeriodDetail } from '@/lib/schoolAdminData';

interface Props {
  periodA: YoYPeriodDetail;
  periodB: YoYPeriodDetail;
  comparable: boolean;
  hideConcepts: boolean;
}

const PERIOD_A_COLOR = '#0072B2';
const PERIOD_B_COLOR = '#E69F00';

function getBandTextClass(score: number): string {
  if (score >= 65) return 'text-leaf';
  if (score >= 50) return 'text-[#b07d28]';
  return 'text-brick-600';
}

function getBandTintClass(score: number): string {
  // 0x18 alpha (~9%) tint of the band colour, kept exact
  if (score >= 65) return 'bg-[#4a9e3f18]';
  if (score >= 50) return 'bg-[#b07d2818]';
  return 'bg-[#b23e3a18]';
}

function getBandLabel(score: number): string {
  if (score >= 65) return 'Strong';
  if (score >= 50) return 'Moderate';
  return 'Needs attention';
}

function ConceptDelta({ delta, muted }: { delta: number; muted: boolean }) {
  if (delta === 0) {
    return <span className="text-[13px] font-medium text-subtle">0</span>;
  }
  if (muted) {
    return (
      <span className="inline-flex items-center gap-1">
        <span className="text-[13px] font-medium text-subtle">
          ~{delta > 0 ? '+' : ''}{delta}
        </span>
        <span className="relative group cursor-help">
          <span className="w-3.5 h-3.5 flex items-center justify-center text-subtle">
            <i className="ri-information-line text-[12px]"></i>
          </span>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-56 px-3 py-2 rounded-lg text-[11px] leading-snug opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-20 whitespace-normal bg-ink text-white">
            Different survey versions — context only, not directly comparable.
          </span>
        </span>
      </span>
    );
  }
  const improved = delta > 0;
  return (
    <span className={`inline-flex items-center gap-1 text-[13px] font-semibold ${improved ? 'text-leaf' : 'text-brick-600'}`}>
      <span className="w-3.5 h-3.5 flex items-center justify-center">
        <i className={`${improved ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} text-[13px]`}></i>
      </span>
      {delta > 0 ? '+' : ''}{delta}
    </span>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
  periodA,
  periodB,
  comparable,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  periodA: YoYPeriodDetail;
  periodB: YoYPeriodDetail;
  comparable: boolean;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className="rounded-xl p-3 border bg-white border-line shadow-card"
    >
      <p className="text-[13px] font-semibold mb-2 text-ink">{label}</p>
      {payload.map((entry: any, idx: number) => {
        const isPeriodA = entry.dataKey === periodA.period;
        const period = isPeriodA ? periodA : periodB;
        return (
          <div key={idx} className="flex items-center justify-between gap-4 py-0.5">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isPeriodA ? 'bg-[#0072B2]' : 'bg-[#E69F00]'}`} />
              <span className="text-[12px] text-muted">{entry.dataKey}</span>
            </div>
            <div className="text-right">
              <span className="text-[12px] font-semibold text-ink">{entry.value}</span>
              <span className="text-[11px] ml-1 text-subtle">(n={period.responseCount})</span>
            </div>
          </div>
        );
      })}
      {!comparable && (
        <div className="mt-2 pt-2 border-t border-line">
          <p className="text-[11px] text-gold">
            <span className="inline-flex items-center gap-1">
              <i className="ri-error-warning-line text-[11px]"></i>
              Context only — not directly comparable
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default function YoYConceptComparison({ periodA, periodB, comparable, hideConcepts }: Props) {
  const chartData = useMemo(() => {
    return periodA.concepts.map((ca, i) => ({
      concept: ca.concept,
      [periodA.period]: ca.score,
      [periodB.period]: periodB.concepts[i]?.score ?? 0,
    }));
  }, [periodA, periodB]);

  if (hideConcepts) {
    return (
      <div className="rounded-2xl p-4 sm:p-6 mb-6 bg-white border border-line shadow-card">
        <h3 className="text-[17px] font-semibold mb-1 text-ink">Concept-by-concept comparison</h3>
        <div className="rounded-xl p-4 sm:p-5 mt-4 flex items-start gap-3 bg-canvas border border-line">
          <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-gold">
            <i className="ri-error-warning-line text-[16px]"></i>
          </span>
          <div>
            <p className="text-[14px] font-semibold text-ink">
              Concept breakdown hidden
            </p>
            <p className="text-[13px] mt-0.5 leading-relaxed text-muted">
              One period has under 10 responses — detailed concept comparison is hidden to protect anonymity and avoid unreliable conclusions. Only the overall score and participation rate are shown above with a strong caveat.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 sm:p-6 mb-6 bg-white border border-line shadow-card">
      <h3 className="text-[17px] font-semibold mb-4 text-ink">
        Concept-by-concept comparison
      </h3>

      {!comparable && (
        <div className="mb-4 rounded-xl px-4 py-2.5 flex items-start gap-2 bg-gold-100 border border-[#f5d89a]">
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-gold">
            <i className="ri-information-line text-[14px]"></i>
          </span>
          <p className="text-[12px] text-muted">
            These periods used different survey or methodology versions — concept comparisons are shown for context, not like-for-like. Deltas are muted and marked with an asterisk.
          </p>
        </div>
      )}

      <div
        className="mb-8 h-[260px] sm:h-[320px] rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2"
        tabIndex={0}
        role="img"
        aria-label={`Spider chart comparing ${periodA.period} and ${periodB.period} across six concepts: Taste, Freshness, Variety, Staff, Cleanliness, and Time to eat. See comparison table below for exact values.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={chartData}
            outerRadius="68%"
            margin={{ top: 16, right: 12, left: 12, bottom: 8 }}
          >
            <PolarGrid stroke="#e8e6e1" />
            <PolarAngleAxis
              dataKey="concept"
              tick={{ fill: '#2b2b2b', fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: '#e8e6e1' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#8a8a8a', fontFamily: "'Inter', sans-serif", fontSize: 10 }}
              axisLine={{ stroke: '#e8e6e1' }}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip periodA={periodA} periodB={periodB} comparable={comparable} />} />
            <Radar
              name={periodA.period}
              dataKey={periodA.period}
              stroke={PERIOD_A_COLOR}
              strokeWidth={2}
              fill={PERIOD_A_COLOR}
              fillOpacity={0.15}
              dot={{ r: 5, fill: PERIOD_A_COLOR, stroke: '#ffffff', strokeWidth: 2 }}
            />
            <Radar
              name={periodB.period}
              dataKey={periodB.period}
              stroke={PERIOD_B_COLOR}
              strokeWidth={2}
              strokeDasharray="4 3"
              fill={PERIOD_B_COLOR}
              fillOpacity={0.08}
              dot={{ r: 5, fill: PERIOD_B_COLOR, stroke: '#ffffff', strokeWidth: 2 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-6 mb-5 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0072B2]"></span>
          <span className="text-[13px] font-medium text-muted">{periodA.period}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E69F00]"></span>
          <span className="text-[13px] font-medium text-muted">{periodB.period}</span>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 sm:-mx-6 sm:px-6">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr className="border-b border-b-line">
              <th className="text-left py-3 pr-6 text-[12px] font-medium w-[40%] text-subtle">Concept</th>
              <th className="text-left py-3 px-4 text-[12px] font-medium w-[18%] text-subtle">{periodA.period}</th>
              <th className="text-left py-3 px-4 text-[12px] font-medium w-[18%] text-subtle">{periodB.period}</th>
              <th className="text-left py-3 pl-4 text-[12px] font-medium w-[24%] text-subtle">Change</th>
            </tr>
          </thead>
          <tbody>
            {periodA.concepts.map((ca, i) => {
              const cb = periodB.concepts[i];
              const delta = cb.score - ca.score;
              const bandLabel = getBandLabel(cb.score);
              return (
                <tr key={ca.concept} className="transition-colors duration-100 hover:bg-canvas border-b border-b-line">
                  <th scope="row" className="py-3.5 pr-6 text-left text-ink font-medium">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[14px] font-medium">{ca.concept}</span>
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${getBandTintClass(cb.score)} ${getBandTextClass(cb.score)}`}>
                        {bandLabel}
                      </span>
                    </div>
                  </th>
                  <td className="py-3.5 px-4 text-left">
                    <span className="text-[15px] font-semibold tabular-nums text-ink">{ca.score}</span>
                  </td>
                  <td className="py-3.5 px-4 text-left">
                    <span className="text-[15px] font-semibold tabular-nums text-ink">{cb.score}</span>
                  </td>
                  <td className="py-3.5 pl-4 text-left">
                    <ConceptDelta delta={delta} muted={!comparable} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}