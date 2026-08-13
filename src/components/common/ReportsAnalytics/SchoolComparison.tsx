'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/tailwind';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { AnimatedBar } from '@/components/ui/AnimatedBar';

const GRADE_BANDS = ['All grades', 'K-2', '3-5', '6-8', '9-12'] as const;
const PERIODS = ['Fall 2025', 'Spring 2025', 'Fall 2024', 'Spring 2024'] as const;

type BandTone = 'positive' | 'moderate' | 'attention';

type SchoolRow = {
  id: string;
  school: string;
  level: 'Elementary' | 'Middle' | 'High';
  overall: number;
  participation: number;
  sentiment: number;
  taste: number;
  freshness: number;
  variety: number;
  staff: number;
  cleanliness: number;
  timeToEat: number;
  responses: string;
  status: 'Published' | 'Under review' | 'Analysing';
  sample?: string;
  note?: string;
};

const SCHOOL_ROWS: SchoolRow[] = [
  { id: 'north-hills-elementary', school: 'North Hills Elementary', level: 'Elementary', overall: 72, participation: 84, sentiment: 79, taste: 76, freshness: 74, variety: 71, staff: 69, cleanliness: 78, timeToEat: 68, responses: '92 of 110', status: 'Published' },
  { id: 'hillside-middle', school: 'Hillside Middle', level: 'Middle', overall: 68, participation: 77, sentiment: 75, taste: 70, freshness: 68, variety: 66, staff: 65, cleanliness: 72, timeToEat: 60, responses: '115 of 150', status: 'Published' },
  { id: 'north-hills-high', school: 'North Hills High', level: 'High', overall: 58, participation: 75, sentiment: 62, taste: 60, freshness: 58, variety: 54, staff: 56, cleanliness: 60, timeToEat: 55, responses: '210 of 280', status: 'Published' },
  { id: 'pine-grove-elementary', school: 'Pine Grove Elementary', level: 'Elementary', overall: 45, participation: 23, sentiment: 48, taste: 46, freshness: 40, variety: 42, staff: 50, cleanliness: 50, timeToEat: 38, responses: '25 of 108', status: 'Published', sample: 'directional', note: 'small sample directional' },
  { id: 'maple-ridge-middle', school: 'Maple Ridge Middle', level: 'Middle', overall: 74, participation: 91, sentiment: 80, taste: 78, freshness: 76, variety: 70, staff: 72, cleanliness: 78, timeToEat: 65, responses: '128 of 140', status: 'Published' },
  { id: 'west-valley-high', school: 'West Valley High', level: 'High', overall: 61, participation: 68, sentiment: 65, taste: 64, freshness: 60, variety: 58, staff: 60, cleanliness: 64, timeToEat: 60, responses: '98 of 145', status: 'Published' },
  { id: 'sunset-elementary', school: 'Sunset Elementary', level: 'Elementary', overall: 70, participation: 86, sentiment: 75, taste: 74, freshness: 72, variety: 68, staff: 72, cleanliness: 74, timeToEat: 65, responses: '112 of 130', status: 'Under review' },
  { id: 'oak-valley-middle', school: 'Oak Valley Middle', level: 'Middle', overall: 52, participation: 23, sentiment: 50, taste: 54, freshness: 48, variety: 46, staff: 50, cleanliness: 52, timeToEat: 42, responses: '27 of 120', status: 'Published', sample: 'directional', note: 'small sample directional' },
  { id: 'riverside-high', school: 'Riverside High', level: 'High', overall: 55, participation: 46, sentiment: 52, taste: 58, freshness: 56, variety: 50, staff: 54, cleanliness: 60, timeToEat: 52, responses: '71 of 155', status: 'Published' },
  { id: 'cedar-grove-elementary', school: 'Cedar Grove Elementary', level: 'Elementary', overall: 78, participation: 90, sentiment: 82, taste: 80, freshness: 80, variety: 76, staff: 76, cleanliness: 82, timeToEat: 70, responses: '95 of 105', status: 'Analysing' },
  { id: 'willow-creek-high', school: 'Willow Creek High', level: 'High', overall: 63, participation: 78, sentiment: 70, taste: 66, freshness: 64, variety: 60, staff: 58, cleanliness: 62, timeToEat: 56, responses: '132 of 170', status: 'Published' },
  { id: 'fairview-elementary', school: 'Fairview Elementary', level: 'Elementary', overall: 69, participation: 82, sentiment: 76, taste: 72, freshness: 70, variety: 68, staff: 66, cleanliness: 74, timeToEat: 62, responses: '78 of 95', status: 'Published' },
  { id: 'brookside-elementary', school: 'Brookside Elementary', level: 'Elementary', overall: 60, participation: 6, sentiment: 48, taste: 44, freshness: 42, variety: 40, staff: 42, cleanliness: 50, timeToEat: 38, responses: '7 of 115', status: 'Published', sample: '< 10', note: 'small sample directional' },
];

const pillLink =
  'rounded-full border border-[#D6E0D2] bg-[#F2F5F0] px-4 py-2 text-[13px] font-medium text-[#586D4D] hover:bg-[#e8eee5] transition-colors';

interface SchoolComparisonProps {
  onOpenRollup?: () => void;
  onOpenSurveyToSurvey?: () => void;
  onOpenBenchmarks?: () => void;
}

function ActionPill({
  label,
  href,
  className,
  onClick,
}: {
  label: string;
  href: string;
  className?: string;
  onClick?: () => void;
}) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(pillLink, className)}>
        {label}
      </button>
    );
  }

  return (
    <Link href={href} className={cn(pillLink, className)}>
      {label}
    </Link>
  );
}

const STATUS_CLASS: Record<SchoolRow['status'], string> = {
  Published: 'bg-[#EEF7E8] text-[#4F8F43] border-[#D7E8D0]',
  'Under review': 'bg-[#F4F2EE] text-[#8A8A8A] border-[#E8E6E1]',
  Analysing: 'bg-[#FFF3DD] text-[#D28A1E] border-[#F3D8A6]',
};

const TONE_CLASS: Record<BandTone, string> = {
  positive: 'bg-[#5FA85F]',
  moderate: 'bg-[#E0A93B]',
  attention: 'bg-[#C25858]',
};

function getTone(score: number): BandTone {
  if (score >= 65) return 'positive';
  if (score >= 50) return 'moderate';
  return 'attention';
}

function getColorClass(score: number): string {
  if (score >= 65) return 'text-[#4A9E3F]';
  if (score >= 50) return 'text-[#D28A1E]';
  return 'text-[#C25858]';
}

function BarChartRow({ label, score, tone }: { label: string; score: number; tone: BandTone }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-44 truncate text-right text-[13px] font-medium text-slate-600 sm:w-52">
        {label}
      </div>
      <div className="h-4 flex-1 rounded-sm bg-slate-100">
        <AnimatedBar value={score} className={cn('h-4 rounded-sm', TONE_CLASS[tone])} />
      </div>
      <div className="w-11 text-right text-[13px] font-medium text-slate-500">{score}</div>
    </div>
  );
}

export function SchoolComparison({ onOpenRollup, onOpenSurveyToSurvey, onOpenBenchmarks }: SchoolComparisonProps) {
  const [gradeBand, setGradeBand] = useState<(typeof GRADE_BANDS)[number]>('6-8');
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('Fall 2025');

  const rows = useMemo(() => [...SCHOOL_ROWS].sort((a, b) => b.overall - a.overall), []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
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
            <ActionPill
              label="Survey-to-survey"
              href="/district/reports-analytics/survey-to-survey"
              onClick={onOpenSurveyToSurvey}
              className="cursor-pointer"
            />
            <ActionPill
              label="District benchmarks"
              href="/district/reports-analytics/district-benchmarks"
              onClick={onOpenBenchmarks}
              className="cursor-pointer"
            />
          </div>
        </div>

        <p className="mt-3 text-[12px] leading-5 text-slate-400">
          Based on your schools&apos; latest reports for the selected period. 2 reports are under review and not yet included.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-semibold text-slate-900">School comparison</h2>
            <p className="mt-0.5 text-[13px] text-slate-400">Overall scores, participation, and concept breakdown by school</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[12px] font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#5FA85F]" /> Positive</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#E0A93B]" /> Moderate</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#C25858]" /> Needs attention</span>
          </div>
        </div>

        <div className="mt-6 space-y-2.5">
          {rows.map((row) => (
            <BarChartRow key={row.id} label={row.school} score={row.overall} tone={getTone(row.overall)} />
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School</TableHead>
              <TableHead className="text-right">Overall</TableHead>
              <TableHead className="text-right">Participation</TableHead>
              <TableHead className="text-right">Sentiment</TableHead>
              <TableHead className="text-right">Taste</TableHead>
              <TableHead className="text-right">Freshness</TableHead>
              <TableHead className="text-right">Variety</TableHead>
              <TableHead className="text-right">Staff</TableHead>
              <TableHead className="text-right">Cleanliness</TableHead>
              <TableHead className="text-right">Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const tone = getTone(row.overall);

              return (
                <TableRow key={row.id} className={row.sample === 'directional' ? 'bg-[#FFFBF4] border-[#FDF3E0]' : ''}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-900">{row.school}</span>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#F0EAFB] px-2.5 py-0.5 text-[11px] font-semibold text-iris">
                          {row.level === 'Elementary' ? 'K-5' : row.level === 'Middle' ? '6-8' : '9-12'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={cn('text-right font-bold', getColorClass(row.overall))}>
                    {row.overall}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-[12px] font-medium text-slate-700">{row.participation}% · {row.responses}</span>
                      {row.participation < 60 ? (
                        <span className="text-[11px] font-semibold text-[#D28A1E]">below target</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">n={row.responses.split(' ')[0]}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-600">{row.sentiment}%</TableCell>
                  <TableCell className={cn('text-right font-bold', getColorClass(row.taste))}>{row.taste}</TableCell>
                  <TableCell className={cn('text-right font-bold', getColorClass(row.freshness))}>{row.freshness}</TableCell>
                  <TableCell className={cn('text-right font-bold', getColorClass(row.variety))}>{row.variety}</TableCell>
                  <TableCell className={cn('text-right font-bold', getColorClass(row.staff))}>{row.staff}</TableCell>
                  <TableCell className={cn('text-right font-bold', getColorClass(row.cleanliness))}>{row.cleanliness}</TableCell>
                  <TableCell className={cn('text-right font-bold', getColorClass(row.timeToEat))}>{row.timeToEat}</TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      <span className={cn('inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold', STATUS_CLASS[row.status])}>
                        {row.status}
                      </span>
                      {row.sample === 'directional' && (
                        <span className="text-[10px] font-medium text-[#D28A1E] leading-tight mt-1 max-w-20">Small sample directional</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/district/schools/${row.id}/reports`} className="text-[13px] font-semibold text-[#5B2DA3] hover:underline">
                      View report
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-[12px] leading-5 text-muted">
Score = Yes% + ½ × Sometimes% (0–100). Positive ≥ 65 · Moderate 50–64 · Needs attention below 50.
      </p>

      <p className="text-[12px] text-[#9A9A9A] -mt-4">Participation shows response rate with counts. Sentiment is the share of positive responses. The band chip shows the current period's level.</p>
      <p className="text-[12px] text-[#9A9A9A] -mt-4">Schools marked “Small sample  directional” have fewer than 30 responses  treat their figures as indicative only.</p>
      <p className="text-[12px] text-[#9A9A9A] -mt-4">Too few responses to show a concept breakdown  this protects anonymity and avoids unreliable conclusions.</p>
    </div>
  );
}
