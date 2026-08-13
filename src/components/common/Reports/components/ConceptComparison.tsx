'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';

interface ConceptComparisonProps {
  periodALabel: string;
  periodBLabel: string;
  conceptsA: { concept: string; score: number }[];
  conceptsB: { concept: string; score: number }[];
  sameVersion: boolean;
  isLoading?: boolean;
}

function getBandTextClass(score: number): string {
  if (score >= 65) return 'text-leaf';
  if (score >= 50) return 'text-gold-300';
  return 'text-brick-600';
}

function getBandTintClass(score: number): string {
  // 0x18 alpha (~9%) tint of the band colour, kept exact
  if (score >= 65) return 'bg-[#4a9e3f18]';
  if (score >= 50) return 'bg-[#ecbf6a18]';
  return 'bg-[#b23e3a18]';
}

function getBandBgClass(score: number): string {
  if (score >= 65) return 'bg-leaf';
  if (score >= 50) return 'bg-gold-300';
  return 'bg-brick-600';
}

function getBandLabel(score: number): string {
  if (score >= 65) return 'Positive';
  if (score >= 50) return 'Mid';
  return 'Negative';
}

function SkeletonConceptComparison() {
  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card">
      <div className="h-5 rounded-full w-56 mb-6 bg-sage-50" />
      <div className="h-64 rounded-xl mb-6 bg-sage-50" />
      <div className="space-y-3">
        <div className="h-9 rounded-full bg-sage-50" />
        <div className="h-9 rounded-full bg-sage-50" />
        <div className="h-9 rounded-full bg-sage-50" />
        <div className="h-9 rounded-full bg-sage-50" />
        <div className="h-9 rounded-full bg-sage-50" />
        <div className="h-9 rounded-full bg-sage-50" />
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className="rounded-xl p-3 border bg-white border-line shadow-card"
    >
      <p className="text-[13px] font-semibold mb-2 text-ink">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-2">
            {/* Matches the two radar series: the first is sage, the second iris. */}
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${idx === 0 ? 'bg-[#586d4d]' : 'bg-[#6d28d9]'}`} />
            <span className="text-[12px] text-muted">{entry.name}</span>
          </div>
          <span className="text-[12px] font-semibold text-ink">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function ConceptComparison({ periodALabel, periodBLabel, conceptsA, conceptsB, sameVersion, isLoading = false }: ConceptComparisonProps) {
  if (isLoading) {
    return <SkeletonConceptComparison />;
  }

  const chartData = conceptsA.map((ca, i) => ({
    concept: ca.concept,
    [periodALabel]: ca.score,
    [periodBLabel]: conceptsB[i].score,
  }));

  const rows = conceptsA.map((ca, i) => {
    const cb = conceptsB[i];
    const delta = cb.score - ca.score;
    return { concept: ca.concept, scoreA: ca.score, scoreB: cb.score, delta };
  });

  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card">
      <h3 className="text-[17px] font-semibold mb-4 text-ink">
        Concept-by-concept comparison
      </h3>

      {!sameVersion && (
        <div className="mb-4 rounded-xl px-4 py-2.5 flex items-start gap-2 bg-gold-100 border border-[#f5d89a]">
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-gold">
            <i className="ri-information-line text-[14px]"></i>
          </span>
          <p className="text-[12px] text-muted">
            These periods used different survey versions — comparisons are for context, not like-for-like.
          </p>
        </div>
      )}

      <div className="mb-8 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={chartData}
            margin={{ top: 20, right: 24, left: 24, bottom: 12 }}
          >
            <PolarGrid stroke="#e8e6e1" />
            <PolarAngleAxis
              dataKey="concept"
              tick={{ fill: '#2b2b2b', fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: '#e8e6e1' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#8a8a8a', fontFamily: "'Inter', sans-serif", fontSize: 10 }}
              axisLine={{ stroke: '#e8e6e1' }}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name={periodALabel}
              dataKey={periodALabel}
              stroke="#586d4d"
              strokeWidth={2}
              fill="#586d4d"
              fillOpacity={0.15}
              dot={{ r: 5, fill: '#586d4d', stroke: '#ffffff', strokeWidth: 2 }}
            />
            <Radar
              name={periodBLabel}
              dataKey={periodBLabel}
              stroke="#6d28d9"
              strokeWidth={2}
              strokeDasharray="4 3"
              fill="#6d28d9"
              fillOpacity={0.08}
              dot={{ r: 5, fill: '#6d28d9', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-6 mb-5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-sage"></span>
          <span className="text-[13px] text-muted">{periodALabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-iris"></span>
          <span className="text-[13px] text-muted">{periodBLabel}</span>
        </div>
      </div>

      <div>
        <div className="text-[12px] font-medium uppercase tracking-wide mb-2 text-subtle">
          Comparison table
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-b-line">
                <th className="text-left py-2.5 pr-4 text-[12px] font-medium text-subtle">Concept</th>
                <th className="text-right py-2.5 px-4 text-[12px] font-medium text-subtle">{periodALabel}</th>
                <th className="text-right py-2.5 px-4 text-[12px] font-medium text-subtle">{periodBLabel}</th>
                <th className="text-right py-2.5 pl-4 text-[12px] font-medium text-subtle">Change</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const bandLabel = getBandLabel(row.scoreB);
                
                return (
                  <tr key={row.concept} className="transition-colors duration-100 hover:bg-canvas border-b border-b-line">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-medium text-ink">{row.concept}</span>
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${getBandTintClass(row.scoreB)} ${getBandTextClass(row.scoreB)}`}>{bandLabel}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[14px] font-semibold text-ink">{row.scoreA}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[14px] font-semibold text-ink">{row.scoreB}</span>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      {row.delta === 0 ? (
                        <span className="text-[13px] text-subtle">0</span>
                      ) : (
                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium ${row.delta > 0 ? 'bg-[#D8F3DC] text-[#2D6A4F]' : 'bg-[#FFCCD5] text-[#9B2226]'}`}>
                          {row.delta > 0 ? '+' : ''}{row.delta}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t flex items-center gap-2 border-line">
        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-subtle">
          <i className="ri-information-line text-[14px]"></i>
        </span>
        <p className="text-[12px] text-muted-500">
          Score = Yes% + &frac12; &times; Sometimes% (0&ndash;100 scale). Green &ge; 65, Amber 50&ndash;64, Red &lt; 50.
        </p>
      </div>
    </div>
  );
}