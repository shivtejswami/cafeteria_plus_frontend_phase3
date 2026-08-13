'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import { ConceptBenchmark } from '@/lib/schoolAdminData';

function getBandColor(score: number): string {
  if (score >= 65) return '#4a9e3f';
  if (score >= 50) return '#ecbf6a';
  return '#b23e3a';
}

function getBandLabel(score: number): string {
  if (score >= 65) return 'Positive';
  if (score >= 50) return 'Moderate';
  return 'Needs attention';
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey?: string;
  }>;
  label?: string;
  radarLabel?: string;
}

function CustomTooltip({ active, payload, label, radarLabel }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const schoolVal = payload.find(p => p.dataKey === 'Your school')?.value ?? 0;
  const benchVal = payload.find(p => p.dataKey === 'Benchmark')?.value ?? 0;
  const diff = schoolVal - benchVal;
  const diffLabel = diff > 0 ? 'points above' : diff < 0 ? 'points below' : 'equal';
  const benchDisplay = radarLabel || 'Benchmark';

  return (
    <div className="rounded-xl px-3.5 py-2.5 text-[13px] bg-white border border-line shadow-card text-ink"
    >
      <p className="font-semibold mb-1">{label}</p>
      <p className="text-sage">Your school: {schoolVal}</p>
      <p className="text-subtle">{benchDisplay}: {benchVal}</p>
      <p className={`mt-0.5 font-medium ${diff >= 0 ? 'text-leaf' : 'text-brick-600'}`}>
        {diff > 0 ? '▲' : diff < 0 ? '▼' : '—'} {Math.abs(diff)} {diffLabel}
      </p>
      <p className="text-[11px] mt-0.5 text-subtle">{getBandLabel(schoolVal)}</p>
    </div>
  );
}

function renderSchoolDot(props: any) {
  const { cx, cy, payload, index } = props;
  if (cx == null || cy == null || !payload) return null;
  const color = getBandColor(payload['Your school'] ?? 0);
  return (
    <circle key={`school-dot-${index ?? 0}`} cx={cx} cy={cy} r={5} fill={color} stroke="#ffffff" strokeWidth={2} />
  );
}

function renderBenchmarkDot(props: any) {
  const { cx, cy, index } = props;
  if (cx == null || cy == null) return null;
  return (
    <circle key={`bench-dot-${index ?? 0}`} cx={cx} cy={cy} r={4} fill="#9a9a9a" stroke="#ffffff" strokeWidth={1.5} />
  );
}

export default function BenchmarkComparisonChart({
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
  const chartData = concepts.map(c => ({
    concept: c.concept,
    'Your school': c.schoolScore,
    'Benchmark': c.benchmarkScore,
  }));

  const isNational = benchmarkLabel.includes('national');
  const radarLabel = isNational ? 'National benchmark' : 'Comparable schools';
  const tooltipLabel = isNational ? 'National benchmark' : 'Benchmark';

  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card"
    >
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold text-ink">
          Concept scores: Your school vs {benchmarkLabel}
        </h2>
        <p className="text-[12px] mt-0.5 text-subtle">
          {schoolN} responses · Higher scores are better · Coloured dots show score bands
        </p>
      </div>

      <div
        className="w-full h-[280px] sm:h-[400px] overflow-visible rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2"
        tabIndex={0}
        role="img"
        aria-label={`Spider chart comparing your school against ${benchmarkLabel} across six concepts: Taste, Freshness, Variety, Staff, Cleanliness, and Time to eat. See comparison table below for exact values.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={chartData}
            outerRadius="68%"
            margin={{ top: 16, right: 12, left: 12, bottom: 8 }}
          >
            <PolarGrid stroke="#f0ede6" />
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
            <Tooltip content={<CustomTooltip radarLabel={radarLabel} />} />
            <Radar
              name="Your school"
              dataKey="Your school"
              stroke="#586d4d"
              strokeWidth={2}
              fill="#586d4d"
              fillOpacity={0.15}
              dot={renderSchoolDot}
            />
            <Radar
              name={radarLabel}
              dataKey="Benchmark"
              stroke="#b8b8b6"
              strokeWidth={2}
              strokeDasharray="4 3"
              fill="#d6d6d4"
              fillOpacity={0.08}
              dot={renderBenchmarkDot}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3 pt-3 border-t border-t-line">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-[11px] text-muted-500">
            <span className="inline-block w-3 h-3 rounded-full flex-shrink-0 bg-leaf"></span>
            Positive (&ge;65)
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-500">
            <span className="inline-block w-3 h-3 rounded-full flex-shrink-0 bg-[#ecbf6a]"></span>
            Moderate (50&ndash;64)
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-500">
            <span className="inline-block w-3 h-3 rounded-full flex-shrink-0 bg-brick-600"></span>
            Needs attention (&lt;50)
          </div>
        </div>
        <div className="flex items-center gap-3 sm:ml-auto text-[11px] text-muted-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full flex-shrink-0 bg-sage opacity-60"></span>
            Your school
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block flex-shrink-0 w-[14px] h-[2px] border-t-[2px] border-dashed border-t-[#b8b8b6]"></span>
            {radarLabel}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-t-surface-200">
        <p className="text-[11px] leading-relaxed text-muted-500">
          Score = Yes% + &frac12; &times; Sometimes% (0&ndash;100). Green &ge; 65, Amber 50&ndash;64, Red &lt; 50.
        </p>
        {isNational && (
          <p className="text-[11px] mt-1 text-muted-500">
            National figures are de-identified group averages across participating schools nationwide, weighted so no single school can be identified. Other schools are never named.
          </p>
        )}
        {isVersionMismatched && (
          <p className="text-[11px] mt-1 text-[#b0770a]">
            Score differences shown with &ldquo;~&rdquo; prefix — context only, not a like-for-like comparison.
          </p>
        )}
      </div>
    </div>
  );
}