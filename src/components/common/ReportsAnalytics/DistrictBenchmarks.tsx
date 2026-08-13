'use client';

import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ChevronRight, Info, Lock, Check } from 'lucide-react';
import { cn } from '@/utils/tailwind';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AnimatedBar } from '@/components/ui/AnimatedBar';

/** District benchmarks page — based on the Figma "District dashboard > report and analytics > district benchmarks" frame. */

const GRADE_BANDS = ['All grades', 'K-2', '3-5', '6-8', '9-12'] as const;
const PERIODS = ['Fall 2025', 'Spring 2025', 'Fall 2024', 'Spring 2024'] as const;

const navLinkClass =
  'rounded-full border border-[#D6E0D2] bg-[#F2F5F0] px-4 py-2 text-[13px] font-medium text-[#586D4D] hover:bg-[#e8eee5] transition-colors cursor-pointer';

interface DistrictBenchmarksProps {
  onBack?: () => void;
  onOpenRollup?: () => void;
  onOpenSchoolComparison?: () => void;
  onOpenSurveyToSurvey?: () => void;
}

type BenchmarkType = 'participating' | 'national';

// Mock benchmark data
const PARTICIPATING_STATS = {
  avgScore: 58,
  benchmark: 60,
  participation: 66,
  participationBenchmark: 63,
  schools: '2 of 4 schools',
  benchmarkSchools: '23 schools',
  delta: { score: -2, participation: '+3' },
};

const NATIONAL_STATS = {
  avgScore: 58,
  benchmark: 59,
  participation: 66,
  participationBenchmark: 72,
  sentimentBenchmark: 67,
  delta: { score: -1, participation: '-6', sentiment: '+4' },
};

const CONCEPT_DATA_PARTICIPATING = [
  { concept: 'Taste', district: 62, benchmark: 47, delta: -8 },
  { concept: 'Freshness', district: 40, benchmark: 44, delta: -4 },
  { concept: 'Variety', district: 54, benchmark: 58, delta: +4 },
  { concept: 'Staff', district: 57, benchmark: 44, delta: +2 },
  { concept: 'Cleanliness', district: 68, benchmark: 81, delta: +4 },
  { concept: 'Time to eat', district: 62, benchmark: 47, delta: -4 },
];

const CONCEPT_DATA_NATIONAL = [
  { concept: 'Taste', district: 62, benchmark: 42, delta: -8 },
  { concept: 'Freshness', district: 40, benchmark: 46, delta: -6 },
  { concept: 'Variety', district: 54, benchmark: 57, delta: +4 },
  { concept: 'Staff', district: 57, benchmark: 48, delta: +3 },
  { concept: 'Cleanliness', district: 68, benchmark: 58, delta: +4 },
  { concept: 'Time to eat', district: 62, benchmark: 57, delta: +4 },
];

const SCHOOLS_IN_BAND = [
  { name: 'Hillside Middle', band: '600-999', score: 68, responses: 115, participation: 77, vsBenchmark: '+8', status: 'Positive', isDirectional: false },
  { name: 'Oak Valley Middle', band: '600-999', score: 55, responses: 48, participation: 40, vsBenchmark: '-5', status: 'Moderate', isDirectional: true },
  { name: 'Lakeside Middle', band: '600-999', score: null, responses: null, participation: null, vsBenchmark: null, status: null, isDirectional: false, noData: true },
  { name: 'Redwood Middle', band: '600-999', score: null, responses: null, participation: null, vsBenchmark: null, status: null, isDirectional: false, noData: true },
];

const SCHOOLS_IN_BAND_NATIONAL = [
  { name: 'Hillside Middle', band: '600-999', score: 68, responses: 115, participation: 77, vsBenchmark: '+9', status: 'Positive' },
  { name: 'Oak Valley Middle', band: '600-999', score: 55, responses: 48, participation: 40, vsBenchmark: '-4', status: 'Moderate', isDirectional: true },
  { name: 'Lakeside Middle', band: '600-999', score: null, responses: null, participation: null, vsBenchmark: null, status: null, noData: true },
  { name: 'Redwood Middle', band: '600-999', score: 63, responses: 89, participation: 62, vsBenchmark: '+4', status: 'Moderate' },
];

function ActionPill({ label, href, onClick }: { label: string; href: string; onClick?: () => void }) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={navLinkClass}>
        {label}
      </button>
    );
  }
  return (
    <a href={href} className={navLinkClass}>
      {label}
    </a>
  );
}

function getDeltaText(delta: number | string) {
  const n = typeof delta === 'string' ? parseFloat(delta) : delta;
  if (n > 0) return { label: `+${n} vs national`, color: 'text-[#4A9E3F]', arrow: <ArrowUp className="w-3 h-3" /> };
  if (n < 0) return { label: `${n} vs participating`, color: 'text-[#C25858]', arrow: <ArrowDown className="w-3 h-3" /> };
  return { label: 'On par', color: 'text-slate-400', arrow: null };
}

function StatBlock({ label, value, benchmark, delta, subtitle }: { label: string; value: string | number; benchmark?: number | string; delta?: number | string; subtitle?: string }) {
  const isPositive = delta !== undefined && (typeof delta === 'string' ? parseFloat(delta) : delta) >= 0;
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <div className="flex items-baseline gap-2 mt-5">
        <div>
          <h1 className="text-[13px] font-medium text-slate-400">Your district</h1>
          <h1 className="text-[26px] font-bold text-slate-900">{value}</h1>
        </div>

        {benchmark !== undefined && (
          <div className='ml-auto'> <h1 className="text-[13px] font-medium text-[#9A9A9A]">Benchmark
          </h1>
            <h1 className="text-[26px] font-bold text-muted">
              {benchmark}
            </h1>
          </div>

        )}
      </div>
      {delta !== undefined && (
        <div className={cn('flex items-center gap-0.5 text-[11px] font-semibold', isPositive ? 'text-leaf' : 'text-[#C25858]')}>
          {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          <span>{isPositive ? '+' : ''}{delta} {subtitle}</span>
        </div>
      )}
    </div>
  );
}

function ConceptCard({ concept, district, benchmark, delta, isNational }: { concept: string; district: number; benchmark: number; delta: number; isNational: boolean }) {
  const isPositive = delta >= 0;
  return (
    <div className="rounded-2xl bg-canvas border-border border p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-bold text-slate-900">{concept}</p>
        <span className={cn('inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full', isPositive ? 'bg-[#E7F3E7] text-leaf' : 'bg-[#FDECEA] text-[#C25858]')}>
          {isPositive ? '+' : ''}{delta}
        </span>
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-iris shrink-0"></span>
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-medium text-slate-600 flex-1">District</span>
            <span className="text-[13px] font-bold text-slate-900">{district}</span>
          </div>

        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-medium text-slate-600 flex-1">{isNational ? 'National' : 'Benchmark'}</span>
            <span className="text-[13px] font-bold text-slate-900">{benchmark}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-[12px]">
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }}></span>
            <span className="text-slate-600">{entry.name}:</span>
            <span className="font-bold text-slate-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function DistrictBenchmarks({ onBack, onOpenRollup, onOpenSchoolComparison, onOpenSurveyToSurvey }: DistrictBenchmarksProps) {
  const [gradeBand, setGradeBand] = useState<(typeof GRADE_BANDS)[number]>('6-8');
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('Fall 2024');
  const [benchmarkType, setBenchmarkType] = useState<BenchmarkType>('participating');

  const isNational = benchmarkType === 'national';
  const conceptData = isNational ? CONCEPT_DATA_NATIONAL : CONCEPT_DATA_PARTICIPATING;
  const schoolsData = isNational ? SCHOOLS_IN_BAND_NATIONAL : SCHOOLS_IN_BAND;
  const stats = (isNational ? NATIONAL_STATS : PARTICIPATING_STATS) as any;

  const radarData = conceptData.map((c) => ({
    concept: c.concept,
    'Your district': c.district,
    Benchmark: c.benchmark,
  }));

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div>
        <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500 mb-4">
          <button onClick={onBack} className="hover:text-slate-900 transition-colors cursor-pointer">Reports & analytics</button>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-slate-900">District benchmarks</span>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <FilterDropdown
              label="Grade band"
              options={GRADE_BANDS.map((band) => ({ value: band, label: band }))}
              value={gradeBand}
              onChange={(val) => setGradeBand(val as typeof gradeBand)}
            />
            <FilterDropdown
              label="Period"
              options={PERIODS.map((p) => ({ value: p, label: p }))}
              value={period}
              onChange={(val) => setPeriod(val as typeof period)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ActionPill label="District roll-up" href="/district/reports-analytics" onClick={onOpenRollup} />
            <ActionPill label="School comparison" href="/district/reports-analytics/school-comparison" onClick={onOpenSchoolComparison} />
            <ActionPill label="Survey-to-survey" href="/district/reports-analytics/survey-to-survey" onClick={onOpenSurveyToSurvey} />
          </div>
        </div>
      </div>

      {/* Benchmark type selector */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Participating-school benchmark */}
        <button
          type="button"
          onClick={() => setBenchmarkType('participating')}
          className={cn(
            'rounded-2xl border-2 p-5 text-left transition-all shadow-sm cursor-pointer',
            benchmarkType === 'participating' ? 'border-iris bg-[#F8F4FE]' : 'border-slate-200 bg-white hover:border-slate-300',
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5', benchmarkType === 'participating' ? 'bg-iris' : 'bg-slate-100')}>
                <svg className={cn('w-5 h-5', benchmarkType === 'participating' ? 'text-white' : 'text-slate-500')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900">Cafeteria Pulse participating-school benchmark</p>
                <p className="text-[12px] text-slate-500 mt-0.5">Compared with 23 participating schools using the same survey version</p>
              </div>
            </div>
            {benchmarkType === 'participating' && (
              <div className="w-5 h-5 rounded-full bg-iris flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            )}
          </div>
        </button>

        {/* National benchmark */}
        <button
          type="button"
          onClick={() => setBenchmarkType('national')}
          className={cn(
            'rounded-2xl border-2 p-5 text-left transition-all shadow-sm cursor-pointer',
            benchmarkType === 'national' ? 'border-iris bg-[#F8F4FE]' : 'border-slate-200 bg-white hover:border-slate-300',
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5', benchmarkType === 'national' ? 'bg-iris' : 'bg-slate-100')}>
                <svg className={cn('w-5 h-5', benchmarkType === 'national' ? 'text-white' : 'text-slate-500')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-bold text-slate-900">National benchmark</p>
                  <span className="text-[10px] font-semibold bg-[#F0EAFB] text-iris px-2 py-0.5 rounded-full border border-[#E9D5FF]">Activated</span>
                </div>
                <p className="text-[12px] text-slate-500 mt-0.5">National benchmark · 20 schools</p>
              </div>
            </div>
            {benchmarkType === 'national' && (
              <div className="w-5 h-5 rounded-full bg-iris flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Benchmark note banner */}
      <div className="rounded-2xl border border-[#D6CCF0] bg-[#F0EAFB] p-4 flex gap-3">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 7.5H1.5V14.25H0V7.5ZM2.25 9H3.75V14.25H2.25V9ZM10.5 4.5H12V14.25H10.5V4.5ZM12.75 6H14.25V14.25H12.75V6ZM5.25 0H6.75V14.25H5.25V0ZM7.5 1.5H9V14.25H7.5V1.5Z" fill="#6D28D9" />
        </svg>

        <div>
          <p className="text-[13px] font-semibold text-ink">
            {isNational ? 'National benchmark' : 'Cafeteria Pulse participating-school benchmark'}
          </p>
          <p className="text-[12px] text-muted mt-0.5">
            {isNational
              ? 'Your district compared with participating schools nationwide that use the same survey version (6-8 · v3).'
              : 'Compared with 23 participating schools using the same survey version (6-8 · v3).'}
          </p>
        </div>
      </div>

      {/* Stats comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-center">
          <StatBlock
            label="Your average score"
            value={stats.avgScore}
            benchmark={stats.benchmark}
            delta={stats.delta.score}
            subtitle={isNational ? "vs national" : "vs participating schools"}
          />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-center">
          <StatBlock
            label="Participation rate"
            value={`${stats.participation}%`}
            benchmark={`${stats.participationBenchmark}%`}
            delta={typeof stats.delta.participation === 'string' ? parseFloat(stats.delta.participation) : stats.delta.participation}
            subtitle={isNational ? "vs national" : "vs participating schools"}
          />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-center">
          {isNational ? (
            <StatBlock
              label="Sentiment (positive)"
              value="71%"
              benchmark="67%"
              delta={4}
              subtitle="vs national"
            />
          ) : (
            <div>
              <div>
                <StatBlock label="Cohort size" value={stats.schools} benchmark={stats.benchmarkSchools} />
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-[#9A9A9A]">
                <div className="w-5 h-5 rounded-full bg-[#E7F3E7] flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                Meets minimum threshold
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Radar chart & Concept delta cards */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
          <div>
            <h2 className="text-[17px] font-bold text-slate-900">
              {isNational ? 'Your district vs National benchmark' : 'Your district vs participating-school benchmark'}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-[12px] font-medium">
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-iris inline-block"></span> Your district</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-slate-300 inline-block"></span> {isNational ? 'National' : 'Benchmark'}</span>
          </div>
        </div>

        <div className="h-64 w-full mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%">
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="concept" tick={{ fontSize: 12, fill: '#64748b' }} />
              <Radar name="Benchmark" dataKey="Benchmark" stroke="#CBD5E1" fill="#CBD5E1" fillOpacity={0.2} />
              <Radar name="Your district" dataKey="Your district" stroke="#6D28D9" fill="#6D28D9" fillOpacity={0.3} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {conceptData.map((c) => (
            <ConceptCard key={c.concept} {...c} isNational={isNational} />
          ))}
        </div>

        <div className="mt-6 space-y-1 text-[12px] text-slate-400">
          <p>
            {isNational
              ? 'National figures are de-identified group averages across participating schools nationwide. Other schools are never named, and no individual schools results are shown. Results are weighted so no individual school can be identified or reverse-engineered.'
              : 'Benchmark figures are de-identified group averages across participating schools. Other schools are never named, and no individual schools results are shown. Results are weighted so no individual school can be identified or reverse-engineered.'}
          </p>
        </div>
      </div>

      {/* Schools in this band */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[17px] font-bold text-slate-900">
              {isNational ? 'Your schools vs the National benchmark (6-8)' : 'Your schools in this band (6-8)'}
            </h2>
            {isNational && (
              <p className="text-[13px] text-slate-500 mt-1">National average: 59</p>
            )}
          </div>
          {isNational && (
            <span className="text-[12px] font-semibold text-[#B07D28] bg-[#FDF3E0] px-3 py-1 rounded-full border border-[#F1D9A5]">
              2 of 3 schools above national
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-200">
                <TableHead className="font-semibold text-slate-900">School</TableHead>
                <TableHead className="font-semibold text-slate-900">Enrollment band</TableHead>
                <TableHead className="font-semibold text-slate-900">Score</TableHead>
                <TableHead className="font-semibold text-slate-900 text-right">Responses</TableHead>
                <TableHead className="font-semibold text-slate-900 text-right">Participation</TableHead>
                <TableHead className="font-semibold text-slate-900 text-right">vs {isNational ? 'National' : 'Benchmark'} (59)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schoolsData.map((row) => (
                <TableRow key={row.name} className="border-b border-slate-100">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-[13px]">{row.name}</span>
                      {row.isDirectional && (
                        <span className="text-[10px] font-semibold text-[#D28A1E] bg-[#FDF3E0] px-1.5 py-0.5 rounded">Small sample — directional</span>
                      )}
                      {row.noData && (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">No published report</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">{row.band}</TableCell>
                  <TableCell>
                    {row.noData ? (
                      <span className="text-slate-300">—</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        {/* Score */}
                        <span className="text-[12px] font-bold text-slate-900">
                          {row.score}
                        </span>

                        {/* Status */}
                        {row.status === 'Positive' ? (
                          <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-leaf bg-[#4A9E3F1A] px-2 py-0.5 rounded-full">
                            Positive
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#ECBF6A] bg-[#ECBF6A1A] px-2 py-0.5 rounded-full ">
                            Moderate
                          </span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium text-slate-700">{row.responses !== null ? row.responses : '—'}</TableCell>
                  <TableCell className="text-right font-medium text-slate-700">{row.participation !== null ? `${row.participation}%` : '—'}</TableCell>
                  <TableCell className="text-right">
                    {row.vsBenchmark !== null ? (
                      <span className={cn('font-bold', parseFloat(row.vsBenchmark!) >= 0 ? 'text-leaf' : 'text-[#C25858]')}>
                        {parseFloat(row.vsBenchmark!) > 0 ? '↑' : (parseFloat(row.vsBenchmark!) < 0 ? '↓' : '')} {row.vsBenchmark}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="mt-4 text-[12px] text-slate-400">
          Only schools with published reports are shown. Schools marked "Small sample — directional" have fewer than 30 responses · treat their figures as indicative only.
        </p>
      </div>

      {/* How this benchmark works */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#6D28D9] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[14px] font-bold text-slate-900 mb-2">How this benchmark works</h3>
            <p className="text-[12px] text-slate-600 leading-5">
              {isNational
                ? 'The national benchmark aggregates de-identified results from participating schools nationwide that use the same survey version, approved and maintained by SFWG. Schools are grouped by enrolment band and survey cycle. A minimum of 10 schools is required for reliability (all schools in this cohort).'
                : 'Comparability is based on school level, enrolment band, and survey version. Benchmarks appear only when a minimum of 10 comparable schools have participated (23 in this cohort). Results are de-identified group averages, weighted so no individual school can be identified or reverse-engineered.'}
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              {isNational
                ? `National benchmark · 47 schools · Last refreshed: 2 August 2025`
                : `Last refreshed 31 July 2025`}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom nav pills */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <ActionPill label="District roll-up" href="/district/reports-analytics" onClick={onOpenRollup} />
        <ActionPill label="School comparison" href="/district/reports-analytics/school-comparison" onClick={onOpenSchoolComparison} />
        <ActionPill label="Survey-to-survey" href="/district/reports-analytics/survey-to-survey" onClick={onOpenSurveyToSurvey} />
      </div>
    </div>
  );
}
