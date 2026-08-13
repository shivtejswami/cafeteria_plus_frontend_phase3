'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BarChart3, Building2, FileText, Info, Smile, Users } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { AlertBox } from '@/components/ui/AlertBox';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { AnimatedBar } from '@/components/ui/AnimatedBar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { cn } from '@/utils/tailwind';
import {
  CONCEPT_SCORES,
  GRADE_BANDS,
  PARTICIPATION_ROWS,
  REPORT_PERIODS,
  ROLLUP,
  ROLLUP_FOOTNOTES,
  ROLLUP_METHODOLOGY,
  SCORE_DISTRIBUTION,
  type ScoreBand,
} from '@/constants/districtData';
import { ScoreDonut } from './ScoreDonut';

const BAND_PILL: Record<ScoreBand, string> = {
  positive: 'bg-[#E7F3E7] text-[#4A9E3F]',
  moderate: 'bg-[#FDF3E0] text-[#ECBF6A]',
  attention: 'bg-red-50 text-red-700',
};

const BAND_LABEL: Record<ScoreBand, string> = {
  positive: 'Positive',
  moderate: 'Moderate',
  attention: 'Needs attention',
};

const BAND_SWATCH: Record<ScoreBand, string> = {
  positive: 'bg-[#4E9A51]',
  moderate: 'bg-[#E0A93B]',
  attention: 'bg-[#C0392B]',
};

const BAND_BAR: Record<ScoreBand, string> = {
  positive: 'bg-[#5FA85F]',
  moderate: 'bg-[#E2C088]',
  attention: 'bg-[#C25858]',
};

const selectClass =
  'h-10 rounded-full border border-slate-200 bg-white px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500';

const pillLink =
  'rounded-full border border-[#D6E0D2] bg-[#F2F5F0] px-4 py-2 text-[13px] font-medium text-[#586D4D] hover:bg-[#e8eee5] transition-colors';

interface DistrictRollupProps {
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

/** "District dashboard>report and analytics" (2233:718) — the roll-up tab. */
export function DistrictRollup({ onOpenSurveyToSurvey, onOpenBenchmarks }: DistrictRollupProps) {
  const [gradeBand, setGradeBand] = useState(ROLLUP.gradeBand);
  const [period, setPeriod] = useState(ROLLUP.period);

  const maxSchools = Math.max(...SCORE_DISTRIBUTION.map((d) => d.schools), 1);
  const totalDirectional = SCORE_DISTRIBUTION.reduce((n, d) => n + d.directional, 0);
  const totalSchools = SCORE_DISTRIBUTION.reduce((n, d) => n + d.schools, 0);

  return (
    <div className="space-y-6">
      {/* Filter card -------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <FilterDropdown
              label="Grade band"
              options={GRADE_BANDS.map((band) => ({ value: band, label: band }))}
              value={gradeBand}
              onChange={(val) => setGradeBand(val)}
            />

            <FilterDropdown
              label="Period"
              options={REPORT_PERIODS.map((p) => ({ value: p, label: p }))}
              value={period}
              onChange={(val) => setPeriod(val)}
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

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
          <span>Based on your schools&apos; latest reports for the selected period.</span>
          <span>{ROLLUP.reportsUnderReview} reports are under review and not yet included.</span>
        </div>
      </div>

      {/* Metric tiles -------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Schools reporting"
          value={`${ROLLUP.schoolsReporting} of ${ROLLUP.schoolsTotal}`}
          subtext={`${ROLLUP.responses.toLocaleString('en-US')} responses`}
          icon={<svg width="16" height="16" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 10H13.75V11.25H0V10H1.25V0.625C1.25 0.45 1.31042 0.302083 1.43125 0.18125C1.55208 0.0604162 1.7 0 1.875 0H8.125C8.3 0 8.44792 0.0604162 8.56875 0.18125C8.68958 0.302083 8.75 0.45 8.75 0.625V10H11.25V5H10V3.75H11.875C12.05 3.75 12.1979 3.81042 12.3188 3.93125C12.4396 4.05208 12.5 4.2 12.5 4.375V10ZM2.5 1.25V10H7.5V1.25H2.5ZM3.75 5H6.25V6.25H3.75V5ZM3.75 2.5H6.25V3.75H3.75V2.5Z" fill="#6D6D6D" />
          </svg>
          }
          className="border-t-3"
        />
        <StatCard
          title="District average score"
          value={ROLLUP.averageScore}
          subtext={
            <span className="font-semibold text-[#B07D28]">
              from {ROLLUP.averageScoreFromSchools} schools
            </span>
          }
          icon={<svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 6.25H1.25V11.875H0V6.25ZM10 3.75H11.25V11.875H10V3.75ZM5 0H6.25V11.875H5V0Z" fill="#B07D28" />
          </svg>
          }
          iconBgColor="bg-[#FFF6E5]"
          iconTextColor="text-[#B07D28]"
          className="border-t-3"
        />
        <StatCard
          title="District participation"
          value={`${ROLLUP.participation}%`}
          subtext={`${ROLLUP.responses.toLocaleString('en-US')} responses`}
          icon={<svg width="16" height="16" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 8.12539V9.37539C4.325 9.37539 3.69583 9.54622 3.1125 9.88789C2.54583 10.2212 2.09583 10.6671 1.7625 11.2254C1.42083 11.8087 1.25 12.4421 1.25 13.1254H0C0 12.2171 0.229167 11.3754 0.6875 10.6004C1.12917 9.84206 1.725 9.24206 2.475 8.80039C3.25 8.35039 4.09167 8.12539 5 8.12539ZM5 7.50039C4.325 7.50039 3.69583 7.32956 3.1125 6.98789C2.54583 6.65456 2.09583 6.20456 1.7625 5.63789C1.42083 5.05456 1.25 4.42331 1.25 3.74414C1.25 3.06497 1.42083 2.43372 1.7625 1.85039C2.09583 1.29206 2.54583 0.846225 3.1125 0.512892C3.69583 0.171225 4.32708 0.000391006 5.00625 0.000391006C5.68542 0.000391006 6.31667 0.171225 6.9 0.512892C7.45833 0.846225 7.90417 1.29206 8.2375 1.85039C8.57917 2.43372 8.75 3.06497 8.75 3.74414C8.75 4.42331 8.57917 5.05456 8.2375 5.63789C7.90417 6.20456 7.45833 6.65456 6.9 6.98789C6.31667 7.32956 5.68333 7.50039 5 7.50039ZM5 6.25039C5.45 6.25039 5.86667 6.13789 6.25 5.91289C6.63333 5.68789 6.9375 5.38372 7.1625 5.00039C7.3875 4.61706 7.5 4.20039 7.5 3.75039C7.5 3.30039 7.3875 2.88372 7.1625 2.50039C6.9375 2.11706 6.63333 1.81289 6.25 1.58789C5.86667 1.36289 5.45 1.25039 5 1.25039C4.55 1.25039 4.13333 1.36289 3.75 1.58789C3.36667 1.81289 3.0625 2.11706 2.8375 2.50039C2.6125 2.88372 2.5 3.30039 2.5 3.75039C2.5 4.20039 2.6125 4.61706 2.8375 5.00039C3.0625 5.38372 3.36667 5.68789 3.75 5.91289C4.13333 6.13789 4.55 6.25039 5 6.25039ZM8.75 12.8129L6.9125 13.7754L7.2625 11.7254L5.775 10.2879L7.8375 9.98789L8.75 8.12539L9.675 9.98789L11.725 10.2879L10.2375 11.7254L10.5875 13.7754L8.75 12.8129Z" fill="#586D4D" />
          </svg>
          }
          iconBgColor="bg-[#E3F5E3]"
          iconTextColor="text-[#586D4D]"
          className="border-t-3"
        />
        <StatCard
          title="District sentiment"
          value={`${ROLLUP.sentiment}%`}
          subtext="positive responses"
          icon={<svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.25 12.5C5.4 12.5 4.5875 12.3375 3.8125 12.0125C3.07083 11.6958 2.41042 11.2479 1.83125 10.6687C1.25208 10.0896 0.804167 9.42917 0.4875 8.6875C0.1625 7.9125 0 7.1 0 6.25C0 5.4 0.1625 4.5875 0.4875 3.8125C0.804167 3.07083 1.25208 2.41042 1.83125 1.83125C2.41042 1.25208 3.07083 0.804167 3.8125 0.4875C4.5875 0.162499 5.4 0 6.25 0C7.1 0 7.9125 0.162499 8.6875 0.4875C9.42917 0.804167 10.0896 1.25208 10.6687 1.83125C11.2479 2.41042 11.6958 3.07083 12.0125 3.8125C12.3375 4.5875 12.5 5.4 12.5 6.25C12.5 7.1 12.3375 7.9125 12.0125 8.6875C11.6958 9.42917 11.2479 10.0896 10.6687 10.6687C10.0896 11.2479 9.42917 11.6958 8.6875 12.0125C7.9125 12.3375 7.1 12.5 6.25 12.5ZM6.25 11.25C7.15833 11.25 8 11.0208 8.775 10.5625C9.525 10.1208 10.1208 9.525 10.5625 8.775C11.0208 8 11.25 7.15833 11.25 6.25C11.25 5.34167 11.0208 4.5 10.5625 3.725C10.1208 2.975 9.525 2.37917 8.775 1.9375C8 1.47917 7.15833 1.25 6.25 1.25C5.34167 1.25 4.5 1.47917 3.725 1.9375C2.975 2.37917 2.37917 2.975 1.9375 3.725C1.47917 4.5 1.25 5.34167 1.25 6.25C1.25 7.15833 1.47917 8 1.9375 8.775C2.37917 9.525 2.975 10.1208 3.725 10.5625C4.5 11.0208 5.34167 11.25 6.25 11.25ZM3.125 6.875H4.375C4.375 7.21667 4.45833 7.53125 4.625 7.81875C4.79167 8.10625 5.01875 8.33333 5.30625 8.5C5.59375 8.66667 5.90833 8.75 6.25 8.75C6.59167 8.75 6.90625 8.66667 7.19375 8.5C7.48125 8.33333 7.70833 8.10625 7.875 7.81875C8.04167 7.53125 8.125 7.21667 8.125 6.875H9.375C9.375 7.44167 9.23542 7.96458 8.95625 8.44375C8.67708 8.92292 8.29792 9.30208 7.81875 9.58125C7.33958 9.86042 6.81667 10 6.25 10C5.68333 10 5.16042 9.86042 4.68125 9.58125C4.20208 9.30208 3.82292 8.92292 3.54375 8.44375C3.26458 7.96458 3.125 7.44167 3.125 6.875ZM3.75 5.625C3.49167 5.625 3.27083 5.53333 3.0875 5.35C2.90417 5.16667 2.8125 4.94583 2.8125 4.6875C2.8125 4.42917 2.90417 4.20833 3.0875 4.025C3.27083 3.84167 3.49167 3.75 3.75 3.75C4.00833 3.75 4.22917 3.84167 4.4125 4.025C4.59583 4.20833 4.6875 4.42917 4.6875 4.6875C4.6875 4.94583 4.59583 5.16667 4.4125 5.35C4.22917 5.53333 4.00833 5.625 3.75 5.625ZM8.75 5.625C8.49167 5.625 8.27083 5.53333 8.0875 5.35C7.90417 5.16667 7.8125 4.94583 7.8125 4.6875C7.8125 4.42917 7.90417 4.20833 8.0875 4.025C8.27083 3.84167 8.49167 3.75 8.75 3.75C9.00833 3.75 9.22917 3.84167 9.4125 4.025C9.59583 4.20833 9.6875 4.42917 9.6875 4.6875C9.6875 4.94583 9.59583 5.16667 9.4125 5.35C9.22917 5.53333 9.00833 5.625 8.75 5.625Z" fill="#6D28D9" />
          </svg>
          }
          iconBgColor="bg-[#F0EAFB]"
          iconTextColor="text-[#6D28D9]"
          className="border-t-3"
        />
        <StatCard
          title="Reports this period"
          value={ROLLUP.reportsThisPeriod}
          subtext={`${ROLLUP.reportsUnderReview} under review`}
          icon={<svg width="16" height="16" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 3.125H6.25V9.375H5V3.125ZM7.5 5.625H8.75V9.375H7.5V5.625ZM2.5 6.875H3.75V9.375H2.5V6.875ZM7.5 1.25H1.25V11.25H10V3.75H7.5V1.25ZM0 0.625C0 0.45 0.0604167 0.302083 0.18125 0.18125C0.302083 0.0604162 0.45 0 0.625 0H8.125L11.25 3.125V11.875C11.25 12.0417 11.1896 12.1875 11.0688 12.3125C10.9479 12.4375 10.8 12.5 10.625 12.5H0.625C0.45 12.5 0.302083 12.4396 0.18125 12.3187C0.0604167 12.1979 0 12.05 0 11.875V0.625Z" fill="#586D4D" />
          </svg>
          }
          iconBgColor="bg-[#E3F5E3]"
          iconTextColor="text-[#586D4D]"
          className="border-t-3"
        />
      </div>

      <AlertBox icon={<Info className="w-4 h-4" />} title="Reliability note" className="bg-[#FFF8E8] border-[#F0DCA0] text-muted">
        This roll-up includes {ROLLUP.smallSampleSchools + 1} schools with a small
        sample and {ROLLUP.excludedSchools} school too small for concept breakdown
        — treat their contribution as directional. Schools marked “Small sample ·
        directional” have fewer than 30 responses. Schools with fewer than 10
        responses are excluded from concept-level averages.
      </AlertBox>

      {/* District concept scores --------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">District concept scores</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Computed from {ROLLUP.responses.toLocaleString('en-US')} responses across{' '}
              {ROLLUP.conceptSchools} schools with published reports
            </p>
          </div>
          <ul className="flex flex-wrap items-center gap-4">
            {(['positive', 'moderate', 'attention'] as ScoreBand[]).map((band) => (
              <li key={band} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className={cn('w-2.5 h-2.5 rounded-sm', BAND_SWATCH[band])} aria-hidden />
                {BAND_LABEL[band]}
              </li>
            ))}
          </ul>
        </div>

        <AlertBox icon={<Info className="w-4 h-4" />} title="Reliability note" className="mt-4 bg-[#FFF8E8] border-[#F0DCA0] text-muted">
          {ROLLUP.smallSampleSchools} schools with a small sample (&lt; 30 responses)
          contribute to these averages — treat their input as directional.{' '}
          {ROLLUP.excludedSchools} school (&lt; 10 responses) is excluded from
          concept-level averages to protect anonymity and avoid unreliable
          conclusions.
        </AlertBox>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONCEPT_SCORES.map((concept) => (
            <div
              key={concept.concept}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-[#FAFAFA] px-4 py-6"
            >
              <ScoreDonut value={concept.score} band={concept.band} label={concept.concept} />
              <p className="text-sm font-semibold text-slate-900">{concept.concept}</p>
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-medium',
                  BAND_PILL[concept.band],
                )}
              >
                {BAND_LABEL[concept.band]}
              </span>
              <p className="text-xs text-slate-400">
                {concept.low}–{concept.high}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concept</TableHead>
                <TableHead>District avg</TableHead>
                <TableHead>Band</TableHead>
                <TableHead>Range</TableHead>
                <TableHead className="text-right">Top school</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CONCEPT_SCORES.map((concept) => (
                <TableRow key={concept.concept}>
                  <TableCell className="text-slate-900">{concept.concept}</TableCell>
                  <TableCell
                    className={cn(
                      'font-semibold',
                      concept.band === 'positive' ? 'text-[#4E9A51]' : 'text-[#B07D28]',
                    )}
                  >
                    {concept.score}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs font-medium',
                        BAND_PILL[concept.band],
                      )}
                    >
                      {BAND_LABEL[concept.band]}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    {concept.low}–{concept.high}
                  </TableCell>
                  <TableCell className="text-right text-slate-600">
                    {concept.topSchool}{' '}
                    <span className="text-slate-400">({concept.topScore})</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-5 space-y-1.5 border-t border-slate-100 pt-5">
          {ROLLUP_FOOTNOTES.map((note) => (
            <p key={note} className="text-xs text-slate-400">
              {note}
            </p>
          ))}
        </div>
      </div>

      {/* Distribution + participation ---------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 pb-2">
        <h2 className="text-[17px] font-semibold text-slate-900">Participation across schools</h2>
        <p className="text-[13px] text-slate-400 mt-1">
          Response rates by school, with target reference line at 60%
        </p>
        <p className="text-[13px] font-medium text-[#E0912F] mt-1.5 mb-6">
          3 of 11 schools have a small sample — their scores are directional.
        </p>

        <div className="relative mt-5 pb-6">
          <div className="absolute inset-0 flex justify-between pl-44 pr-11 pointer-events-none pb-6">
            <div className="w-px h-full bg-transparent"></div> {/* 0% */}
            <div className="w-px h-full border-l border-dashed border-slate-100"></div> {/* 25% */}
            <div className="w-px h-full border-l border-dashed border-slate-100"></div> {/* 50% */}
            <div className="w-px h-full border-l border-dashed border-slate-100"></div> {/* 75% */}
            <div className="w-px h-full border-l border-dashed border-slate-100"></div> {/* 100% */}
          </div>

          <ul className="space-y-3 relative z-10">
            {PARTICIPATION_ROWS.map((row) => (
              <li key={row.school} className="flex items-center gap-4">
                <span className="w-40 shrink-0 text-right text-[12px] font-medium text-slate-700 leading-tight">
                  {row.school}
                </span>
                <span className="relative h-4 flex-1">
                  <AnimatedBar
                    value={row.rate}
                    className={cn(
                      'block h-full rounded-sm',
                      row.belowTarget ? 'bg-[#E39E46]' : 'bg-[#7C8F6A]',
                    )}
                  />
                </span>
                <span className="w-9 shrink-0 text-[12px] font-medium text-slate-500">
                  {row.rate}%
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between pl-44 pr-11 text-[11px] font-medium text-slate-400 relative z-10">
            <span className="-ml-2">0%</span>
            <span className="-ml-3">25%</span>
            <span className="-ml-3">50%</span>
            <span className="-ml-3">75%</span>
            <span className="-ml-4">100%</span>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School</TableHead>
              <TableHead>Responses</TableHead>
              <TableHead className="text-right">Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PARTICIPATION_ROWS.map((row) => (
              <TableRow key={row.school}>
                <TableCell className="text-slate-600">
                  {row.school}
                  {row.flag && (
                    <span className="ml-2 rounded-full bg-[#FDF3E0] px-2 py-0.5 text-[11px] font-medium text-[#B07D28]">
                      {row.flag}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-slate-600">
                  {row.responses} / {row.target}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right font-semibold',
                    row.belowTarget ? 'text-[#B07D28]' : 'text-slate-900',
                  )}
                >
                  {row.rate}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>


      {/* Methodology ---------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-900">
          How these figures are calculated
        </h2>
        <div className="mt-2 space-y-1.5">
          {ROLLUP_METHODOLOGY.map((note) => (
            <p key={note} className="text-xs text-slate-400">
              {note}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
