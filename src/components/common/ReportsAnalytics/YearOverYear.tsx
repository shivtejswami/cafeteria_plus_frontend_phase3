'use client';

import React, { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, BarChart3, Building2, Info, Minus, Smile, Users } from 'lucide-react';
import { AlertBox } from '@/components/ui/AlertBox';
import { Badge } from '@/components/ui/Badge';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { cn } from '@/utils/tailwind';
import {
  GRADE_BANDS,
  YOY_COMPARE_OPTIONS,
  YOY_CONCEPTS,
  YOY_METHODOLOGY_NOTE,
  YOY_METRICS,
  YOY_PERIODS,
} from '@/constants/districtData';

const ICONS = {
  score: BarChart3,
  participation: Users,
  sentiment: Smile,
  schools: Building2,
} as const;

const selectClass =
  'h-10 rounded-full border border-slate-200 bg-white px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500';

/**
 * "…>report and analytics>year over year" (2235:1612).
 *
 * This screen compares two named periods rather than plotting a multi-year
 * trend. When the instrument version differs between them, score and sentiment
 * deltas are muted and marked, and only participation is like-for-like.
 */
export function YearOverYear() {
  const [gradeBand, setGradeBand] = useState('6-8');
  const [previous, setPrevious] = useState<string>(YOY_PERIODS.previous);
  const [current, setCurrent] = useState<string>(YOY_PERIODS.current);
  const [scope, setScope] = useState<'district' | 'school'>('district');

  const samePeriod = previous === current;

  return (
    <div className="space-y-6">
      {/* Scope tabs ---------------------------------------------------- */}
      <div className="flex border-b border-slate-200">
        {(
          [
            { id: 'district', label: 'District overall' },
            { id: 'school', label: 'By school' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setScope(tab.id)}
            className={cn(
              'px-4 py-3 text-sm font-medium transition-colors relative',
              scope === tab.id ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-700',
            )}
          >
            {tab.label}
            {scope === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-700" />
            )}
          </button>
        ))}
      </div>

      {/* Filter card --------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <FilterDropdown
              label="Grade band"
              options={GRADE_BANDS.map((band) => ({ value: band, label: band }))}
              value={gradeBand}
              onChange={(val) => setGradeBand(val)}
            />

          <span className="hidden sm:block h-8 w-px bg-slate-200" aria-hidden />

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Compare</span>
            <FilterDropdown
              label="Period"
              labelClassName="hidden"
              options={YOY_COMPARE_OPTIONS.map((p) => ({ value: p, label: p }))}
              value={previous}
              onChange={(val) => setPrevious(val)}
            />
            <span className="text-sm text-slate-400">with</span>
            <FilterDropdown
              label="Period"
              labelClassName="hidden"
              options={YOY_COMPARE_OPTIONS.map((p) => ({ value: p, label: p }))}
              value={current}
              onChange={(val) => setCurrent(val)}
            />
          </div>
        </div>
      </div>

      {samePeriod ? (
        <AlertBox icon={<Info className="w-4 h-4" />} title="Pick two different periods">
          A comparison needs an earlier period and a later one. Change either
          select above to continue.
        </AlertBox>
      ) : (
        <>
          {/* Methodology note ---------------------------------------- */}
          <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="w-1 shrink-0 bg-[#D97706]" aria-hidden />
            <div className="flex gap-3 p-4">
              <span className="w-9 h-9 shrink-0 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {YOY_METHODOLOGY_NOTE.title}
                  </p>
                  <Badge variant="warning">{YOY_METHODOLOGY_NOTE.chip}</Badge>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                  {YOY_METHODOLOGY_NOTE.body}
                </p>
              </div>
            </div>
          </div>

          {/* Comparison cards ----------------------------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {YOY_METRICS.map((metric) => {
              const Icon = ICONS[metric.icon];
              return (
                <div
                  key={metric.key}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <span className={cn('h-1 w-full', metric.accent)} aria-hidden />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {metric.label}
                      </p>
                      <Icon className="w-5 h-5 shrink-0 text-slate-400" />
                    </div>

                    <div className="mt-5 flex items-center">
                      <div className="flex-1 border-r border-slate-200 pr-3">
                        <p className="text-[11px] font-semibold text-slate-400">{previous}</p>
                        <p
                          className={cn(
                            'mt-1 text-[28px] font-bold leading-7',
                            metric.amberValues ? 'text-[#ECBF6A]' : 'text-slate-900',
                          )}
                        >
                          {metric.previous.value}
                        </p>
                        <p className="mt-1.5 text-[11px] text-slate-400">
                          {metric.previous.caption}
                        </p>
                      </div>
                      <div className="flex-1 pl-3 text-right">
                        <p className="text-[11px] font-semibold text-slate-400">{current}</p>
                        <p
                          className={cn(
                            'mt-1 text-[28px] font-bold leading-7',
                            metric.amberValues ? 'text-[#ECBF6A]' : 'text-slate-900',
                          )}
                        >
                          {metric.current.value}
                        </p>
                        <p className="mt-1.5 text-[11px] text-slate-400">
                          {metric.current.caption}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col items-center border-t border-slate-200 pt-3.5">
                      {metric.delta.tone === 'positive' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#E3EFE0] px-2.5 py-1 text-[13px] font-semibold text-[#4A9E3F]">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          {metric.delta.label}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[13px] font-medium text-slate-400">
                          <ArrowUpRight className="w-4 h-4" />
                          {metric.delta.label}
                        </span>
                      )}

                      {metric.footnote && (
                        <p className="mt-1.5 text-center text-[11px] text-slate-400">
                          {metric.footnote}
                        </p>
                      )}

                      {metric.callout && (
                        <div className="mt-2 flex gap-2 rounded-xl border border-[#F5D89A] bg-orange-50 px-3 py-2.5">
                          <Info className="w-3.5 h-3.5 shrink-0 text-[#B07D28] mt-0.5" />
                          <p className="text-[11px] leading-tight text-slate-500">
                            {metric.callout}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Concept movement ----------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                {scope === 'district' ? 'Concept movement' : 'Movement by school'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {previous} compared with {current} · deltas marked ~ are indicative
                because the instrument version changed
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concept</TableHead>
                  <TableHead className="text-right">{previous}</TableHead>
                  <TableHead className="text-right">{current}</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead className="text-right">Schools</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {YOY_CONCEPTS.map((row) => {
                  const change = row.current - row.previous;
                  const Icon = change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : Minus;
                  return (
                    <TableRow key={row.concept}>
                      <TableCell className="font-medium text-slate-900">{row.concept}</TableCell>
                      <TableCell className="text-right text-slate-400">{row.previous}</TableCell>
                      <TableCell className="text-right font-semibold text-slate-900">
                        {row.current}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-1 font-medium text-slate-400">
                          <Icon className="w-3.5 h-3.5" />~{change > 0 ? '+' : ''}
                          {change}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-slate-400">{row.schools}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="space-y-1.5 border-t border-slate-100 px-6 py-5">
              <p className="text-xs text-slate-400">
                Score = Yes% + ½ × Sometimes% (0–100). Positive ≥ 65 · Moderate 50–64
                · Needs attention below 50.
              </p>
              <p className="text-xs text-slate-400">
                Concept deltas are marked ~ because the two periods used different
                instrument versions.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
