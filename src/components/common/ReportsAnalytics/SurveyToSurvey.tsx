'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowDown, BarChart3, ChevronDown, ChevronUp, CheckSquare2, FileText, TrendingUp, Check, X } from 'lucide-react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Tabs } from '@/components/ui/Tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { StatusChip } from '@/components/ui/StatusChip';
import { cn } from '@/utils/tailwind';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

type SurveyPeriod = {
  value: string;
  label: string;
  status: 'Published' | 'Under review';
  date: string;
  responses: string;
  contextOnly?: boolean;
};

const SURVEY_PERIODS: SurveyPeriod[] = [
  { value: 'Spring 2025', label: 'Spring 2025', status: 'Under review', date: '25 May 2025', responses: '10 / 30' },
  { value: 'Fall 2024', label: 'Fall 2024', status: 'Published', date: '30 Sep 2024', responses: '118 / 130' },
  { value: 'Spring 2024', label: 'Spring 2024', status: 'Published', date: '20 Mar 2024', responses: '45 / 120', contextOnly: true },
  { value: 'Fall 2023', label: 'Fall 2023', status: 'Published', date: '27 Sep 2023', responses: '84 / 130', contextOnly: true },
  { value: 'Spring 2023', label: 'Spring 2023', status: 'Published', date: '15 Mar 2023', responses: '90 / 120' },
];

const GRADE_BANDS = ['All grades', 'K-2', '3-5', '6-8', '9-12'] as const;

interface SurveyToSurveyProps {
  onBack?: () => void;
  onOpenRollup?: () => void;
  onOpenBenchmarks?: () => void;
}

const actionPillClass =
  'inline-flex items-center gap-2 rounded-full border border-[#D6E0D2] bg-[#F2F5F0] px-4 py-2 text-[13px] font-medium text-[#586D4D] transition-colors hover:bg-[#e8eee5] cursor-pointer';

function ActionPill({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className={actionPillClass}>
      <span className="text-[#6A7C62]">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function PeriodMultiSelect({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(['Spring 2025', 'Fall 2024', 'Spring 2024', 'Fall 2023', 'Spring 2023']);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const buttonLabel = selected.length > 0 ? `${selected.length} surveys` : 'Select';

  return (
    <div ref={ref} className={cn("relative w-full sm:w-44", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-full border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 cursor-pointer"
      >
        <span className="truncate">{buttonLabel}</span>
        {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-[13px] font-semibold text-slate-900">Select survey periods</p>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {SURVEY_PERIODS.map((period) => {
              const isSelected = selected.includes(period.value);
              return (
                <button
                  key={period.value}
                  type="button"
                  onClick={() => {
                    setSelected((current) =>
                      current.includes(period.value)
                        ? current.filter((item) => item !== period.value)
                        : [...current, period.value],
                    );
                  }}
                  className={cn(
                    'flex w-full cursor-pointer items-start justify-between rounded-xl px-3 py-2.5 text-left transition-colors mb-1',
                    isSelected ? 'bg-slate-50' : 'hover:bg-slate-50',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border mt-0.5 text-[10px] font-bold',
                        isSelected ? 'border-[#5B2DA3] bg-[#5B2DA3] text-white' : 'border-slate-300 text-transparent',
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-slate-900">{period.label}</span>
                        {period.contextOnly && <span className="text-[10px] font-medium text-[#E0912F] bg-[#FDF3E0] px-1.5 py-0.5 rounded">Context only</span>}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex gap-2 items-center">
                        <span>{period.date}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{period.responses}</span>
                      </div>
                    </div>
                  </div>
                  <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', period.status === 'Published' ? 'border-[#B8D8B8] bg-[#E3F5E3] text-sage' : 'border-[#E2C8F3] bg-[#F4EAFB] text-[#5B2DA3]')}>
                    {period.status}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 bg-slate-50 cursor-default">
            <span className="text-[12px] font-medium cursor-default text-slate-500">{selected.length} surveys selected</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-[#5B2DA3] px-5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#4b2486] cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Chart data
const trendData = [
  { name: 'Spring 2025', value: 65 },
  { name: 'Fall 2024', value: 70 },
  { name: 'Spring 2024', value: 61 },
  { name: 'Fall 2023', value: 77 },
  { name: 'Spring 2023', value: 58 },
].reverse(); // oldest to newest for chart

const fullBreakdownData = [
  { period: 'Spring 2025', isContextOnly: false, taste: 69, freshness: 38, variety: 55, staff: 55, cleanliness: 58, timeToEat: 62, netChange: null },
  { period: 'Fall 2024', isContextOnly: false, taste: 70, freshness: 50, variety: 45, staff: 48, cleanliness: 38, timeToEat: 73, netChange: -11 },
  { period: 'Spring 2024', isContextOnly: true, taste: 69, freshness: 38, variety: 55, staff: 55, cleanliness: 59, timeToEat: 62, netChange: 11 },
  { period: 'Fall 2023', isContextOnly: true, taste: 68, freshness: 50, variety: 45, staff: 48, cleanliness: 38, timeToEat: 73, netChange: -12 },
  { period: 'Spring 2023', isContextOnly: false, taste: 66, freshness: 35, variety: 54, staff: 54, cleanliness: 60, timeToEat: 64, netChange: 10 },
];

const schoolData = [
  { school: 'Hillside Middle', level: '6-8', sp25: 63, fa24: null, sp24: null, fa23: null, sp23: null, net: null, status: 'under-review' },
  { school: 'Maple Ridge Middle', level: '6-8', sp25: 70, fa24: 74, sp24: 74, fa23: 74, sp23: 74, net: '+4', status: 'published' },
  { school: 'Oak Valley Middle', level: '6-8', sp25: 55, fa24: 52, sp24: 52, fa23: 52, sp23: 52, net: '-3', status: 'published' },
];

function getBreakdownTone(value: number) {
  if (value >= 65) {
    return {
      text: 'text-[#4A9E3F]',
      pill: 'bg-[#E7F3E7] border border-[#D6E9D4] text-[#4A9E3F]',
    };
  }

  if (value >= 50) {
    return {
      text: 'text-[#B07D28]',
      pill: 'bg-[#F7F2E8] border border-[#ECE2D3] text-[#B07D28]',
    };
  }

  return {
    text: 'text-[#C25858]',
    pill: 'bg-[#FDECEA] border border-[#F4C7C2] text-[#C25858]',
  };
}

export function SurveyToSurvey({ onBack, onOpenRollup, onOpenBenchmarks }: SurveyToSurveyProps) {
  const [gradeBand, setGradeBand] = useState('6-8');
  const [tab, setTab] = useState('comparison');
  const [metric, setMetric] = useState('Overall score');
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [contextOnly, setContextOnly] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header / Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500 mb-4">
          <button onClick={onBack} className="hover:text-slate-900 transition-colors cursor-pointer">Reports & analytics</button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900">Survey-to-survey</span>
        </div>
        <h1 className="text-[22px] font-bold text-slate-900">Survey-to-survey</h1>
        <p className="text-[13px] text-slate-500 mt-1">Compare your district across survey periods · North Hills School District</p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <FilterDropdown
            label="Grade band"
            className=""
            options={GRADE_BANDS.map((band) => ({ value: band, label: band }))}
            value={gradeBand}
            onChange={(val) => setGradeBand(val as string)}
          />
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-slate-500">Compare</span>
            <PeriodMultiSelect  className="cursor-pointer" />
          </div>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: 'comparison', label: 'Comparison' },
          { id: 'allschools', label: 'All schools' },
        ]}
        activeTab={tab}
        onChange={setTab}
      />

      {tab === 'comparison' ? (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="rounded-2xl border border-[#D6E0D2] bg-white p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#4E9A51]"></div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#E7F3E7] flex items-center justify-center shrink-0">
                <ArrowUp className="w-5 h-5 text-[#3F7F42]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-bold text-slate-900">Overall satisfaction improved 9 points from Spring 2023 to Spring 2025</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[12px] font-medium text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Spring 2025</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Fall 2024</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Spring 2024</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Fall 2023</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> Spring 2023</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-[#B07D28] font-medium bg-[#FDF3E0] px-2 py-0.5 rounded-full w-fit">
                  <span>~ Version differences — shown for context, not like-for-like</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E7F3E7] text-[#3F7F42] text-[12px] font-semibold rounded-full border border-[#D6E9D4]"><ArrowUp className="w-3.5 h-3.5" /> Freshness improved</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E7F3E7] text-[#3F7F42] text-[12px] font-semibold rounded-full border border-[#D6E9D4]"><ArrowUp className="w-3.5 h-3.5" /> Variety improved</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E7F3E7] text-[#3F7F42] text-[12px] font-semibold rounded-full border border-[#D6E9D4]"><ArrowUp className="w-3.5 h-3.5" /> Cleanliness improved</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FDECEA] text-[#C25858] text-[12px] font-semibold rounded-full border border-[#F4C7C2]"><ArrowDown className="w-3.5 h-3.5" /> Taste declined</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FDECEA] text-[#C25858] text-[12px] font-semibold rounded-full border border-[#F4C7C2]"><ArrowDown className="w-3.5 h-3.5" /> Staff declined</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FDECEA] text-[#C25858] text-[12px] font-semibold rounded-full border border-[#F4C7C2]"><ArrowDown className="w-3.5 h-3.5" /> Time to eat declined</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trend Line Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap justify-between items-start mb-8 gap-4">
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">Trend</h3>
                <p className="text-[13px] text-slate-500 mt-1">5 periods selected — showing one metric at a time for clarity</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-slate-500">Show:</span>
                <FilterDropdown label="Metric" options={[{ value: 'Overall score', label: 'Overall score' }]} value={metric} onChange={(v) => setMetric(v as string)} labelClassName="hidden" />
              </div>
            </div>

            <div className="flex items-center gap-6 mb-6 overflow-x-auto pb-2">
              <div className="flex items-center gap-2 whitespace-nowrap"><span className="text-[13px] font-medium text-slate-500">Overall score:</span></div>
              <div className="flex items-center gap-2 whitespace-nowrap"><span className="w-2 h-2 rounded-full bg-indigo-500"></span><span className="text-[13px] font-semibold text-slate-700">Spring 2025</span><span className="text-[15px] font-bold text-slate-900 ml-1">65</span></div>
              <div className="flex items-center gap-2 whitespace-nowrap"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-[13px] font-semibold text-slate-700">Fall 2024</span><span className="text-[15px] font-bold text-slate-900 ml-1">70</span></div>
              <div className="flex items-center gap-2 whitespace-nowrap"><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="text-[13px] font-semibold text-slate-700">Spring 2024</span><span className="text-[15px] font-bold text-slate-900 ml-1">61</span></div>
              <div className="flex items-center gap-2 whitespace-nowrap"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span className="text-[13px] font-semibold text-slate-700">Fall 2023</span><span className="text-[15px] font-bold text-slate-900 ml-1">77</span></div>
              <div className="flex items-center gap-2 whitespace-nowrap"><span className="w-2 h-2 rounded-full bg-cyan-500"></span><span className="text-[13px] font-semibold text-slate-700">Spring 2023</span><span className="text-[15px] font-bold text-slate-900 ml-1">58</span><span className="inline-flex items-center text-[#3F7F42] bg-[#E7F3E7] px-1.5 py-0.5 rounded text-[11px] font-bold ml-1">~+2</span></div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trendAreaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0B6FC7" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#0B6FC7" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} ticks={[0, 25, 50, 75, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="value" fill="url(#trendAreaFill)" stroke="none" />
                  <Line type="monotone" dataKey="value" stroke="#0B6FC7" strokeWidth={2.5} dot={{ r: 4, fill: '#ffffff', stroke: '#0B6FC7', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#0B6FC7' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-slate-300"></span> Strong (65+)</span>
                <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-slate-300"></span> Moderate (50-64)</span>
              </div>
            </div>
          </div>

          {/* Full Breakdown Accordion */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <button 
              className="w-full cursor-pointer flex items-center justify-between p-6 bg-white hover:bg-slate-50 transition-colors"
              onClick={() => setBreakdownOpen(!breakdownOpen)}
            >
              <div className="flex items-start gap-4">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', breakdownOpen ? 'bg-[#F6F2EA] text-[#B07D28]' : 'bg-[#F4EAFB] text-[#5B2DA3]')}>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-md sm:text-2xl lg:text-[26px] font-bold text-slate-900 leading-tight wrap-break-word"> 
                      {breakdownOpen ? 'Full breakdown' : 'View full breakdown'}
                    </h3>
                    {breakdownOpen && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#F1C9C6] bg-[#FDECEA] px-2.5 py-0.5 text-[12px] font-semibold text-[#C25858]">
                        <ArrowDown className="h-3.5 w-3.5" />
                        -2 net
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[13px] text-slate-500">6 concepts · 5 periods · chronological order</p>
                </div>
              </div>
              <div className="text-slate-400">
                {breakdownOpen ? <X className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>
            
            {breakdownOpen && (
              <div className="border-t border-slate-200 bg-white p-4 sm:p-6">
                <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#EFE7D7] bg-[#FCF9F2] px-4 py-3 text-[12px] font-medium text-[#C5B7A0]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E7D8BF]"></span>
                  Some periods use different survey or methodology versions — flagged periods are shown for context only.
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
                        <TableHead className="py-3.5 font-semibold text-slate-500">Period</TableHead>
                        <TableHead className="py-3.5 text-center font-semibold text-slate-500">Taste</TableHead>
                        <TableHead className="py-3.5 text-center font-semibold text-slate-500">Freshness</TableHead>
                        <TableHead className="py-3.5 text-center font-semibold text-slate-500">Variety</TableHead>
                        <TableHead className="py-3.5 text-center font-semibold text-slate-500">Staff</TableHead>
                        <TableHead className="py-3.5 text-center font-semibold text-slate-500">Cleanliness</TableHead>
                        <TableHead className="py-3.5 text-center font-semibold text-slate-500">Time to eat</TableHead>
                        <TableHead className="py-3.5 text-right font-semibold text-slate-500">Net change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fullBreakdownData.map((row) => (
                        <TableRow key={row.period} className="border-b border-slate-100 hover:bg-transparent">
                          <TableCell >
                            <span className="font-semibold text-slate-900">{row.period}</span>
                            {row.isContextOnly && <span className="ml-2 rounded-full bg-[#FCF6EA] px-2 py-1 text-[10px] font-medium text-[#E3C59A]">Context only</span>}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.isContextOnly ? (
                              <span className={cn('text-[13px] font-semibold', getBreakdownTone(row.taste).text)}>{row.taste}<span className="align-super text-[12px] text-[#E3A04C]">*</span></span>
                            ) : (
                              <span className={cn('inline-flex min-w-9 items-center justify-center rounded-lg px-2 py-1 text-[13px] font-semibold', getBreakdownTone(row.taste).pill)}>{row.taste}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.isContextOnly ? (
                              <span className={cn('text-[13px] font-semibold', getBreakdownTone(row.freshness).text)}>{row.freshness}<span className="align-super text-[12px] text-[#E3A04C]">*</span></span>
                            ) : (
                              <span className={cn('inline-flex min-w-9 items-center justify-center rounded-lg px-2 py-1 text-[13px] font-semibold', getBreakdownTone(row.freshness).pill)}>{row.freshness}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.isContextOnly ? (
                              <span className={cn('text-[13px] font-semibold', getBreakdownTone(row.variety).text)}>{row.variety}<span className="align-super text-[12px] text-[#E3A04C]">*</span></span>
                            ) : (
                              <span className={cn('inline-flex min-w-9 items-center justify-center rounded-lg px-2 py-1 text-[13px] font-semibold', getBreakdownTone(row.variety).pill)}>{row.variety}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.isContextOnly ? (
                              <span className={cn('text-[13px] font-semibold', getBreakdownTone(row.staff).text)}>{row.staff}<span className="align-super text-[12px] text-[#E3A04C]">*</span></span>
                            ) : (
                              <span className={cn('inline-flex min-w-9 items-center justify-center rounded-lg px-2 py-1 text-[13px] font-semibold', getBreakdownTone(row.staff).pill)}>{row.staff}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.isContextOnly ? (
                              <span className={cn('text-[13px] font-semibold', getBreakdownTone(row.cleanliness).text)}>{row.cleanliness}<span className="align-super text-[12px] text-[#E3A04C]">*</span></span>
                            ) : (
                              <span className={cn('inline-flex min-w-9 items-center justify-center rounded-lg px-2 py-1 text-[13px] font-semibold', getBreakdownTone(row.cleanliness).pill)}>{row.cleanliness}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.isContextOnly ? (
                              <span className={cn('text-[13px] font-semibold', getBreakdownTone(row.timeToEat).text)}>{row.timeToEat}<span className="align-super text-[12px] text-[#E3A04C]">*</span></span>
                            ) : (
                              <span className={cn('inline-flex min-w-9 items-center justify-center rounded-lg px-2 py-1 text-[13px] font-semibold', getBreakdownTone(row.timeToEat).pill)}>{row.timeToEat}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.netChange !== null ? (
                              <span className={cn('text-[13px] font-semibold', row.netChange > 0 ? 'text-leaf' : 'text-[#C25858]')}>
                                {row.netChange > 0 ? '+' : ''}{row.netChange}
                              </span>
                            ) : (
                              <span className="text-[13px] text-slate-300">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 space-y-1 text-[11px] text-slate-400">
                  <p>Net change shows difference from the previous period. Periods marked with ~ use different versions — shown for context only.</p>
                  <p>Colors: <span className="text-emerald-600 font-medium">Green</span> = Positive (65+), <span className="text-amber-500 font-medium">Amber</span> = Moderate (50-64), <span className="text-rose-500 font-medium">Red</span> = Needs attention (&lt;50)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* All Schools Table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex justify-between items-start mb-6 p-4">
              <div>
                <h3 className="text-[18px] font-bold text-slate-900">Per-school trend</h3>
                <p className="text-[13px] text-slate-400 mt-1">Comparing 5 periods: Spring 2025 · Fall 2024 · Spring 2024 · Fall 2023 · Spring 2023</p>
                
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-[12px] font-medium text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-[#7C3AED]" /> Spring 2025</span>
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-[#0284C7]" /> Fall 2024</span>
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-success" /> Spring 2024</span>
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-[#EAB308]" /> Fall 2023</span>
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-danger" /> Spring 2023</span>
                </div>
              </div>
              
              {/* Context Only Checkbox */}
              <label className="flex items-center gap-2 text-[13px] font-medium text-slate-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={contextOnly}
                  onChange={(e) => setContextOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#5B2DA3] focus:ring-[#5B2DA3] cursor-pointer"
                />
                <span>Context only</span>
              </label>
            </div>
 
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-transparent bg-slate-50/50">
                    <TableHead className="font-semibold text-slate-500 py-3 text-[13px]">School</TableHead>
                    <TableHead className="font-semibold text-slate-500 text-center py-3 text-[13px]">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                        Spring 2025
                      </span>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 text-center py-3 text-[13px]">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                        Fall 2024
                      </span>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 text-center py-3 text-[13px]">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-success" />
                        Spring 2024
                      </span>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 text-center py-3 text-[13px]">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                        Fall 2023
                      </span>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 text-center py-3 text-[13px]">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-danger" />
                        Spring 2023
                      </span>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 text-center py-3 text-[13px]">Net change</TableHead>
                    <TableHead className="font-semibold text-slate-500 text-center py-3 text-[13px]">Status</TableHead>
                    <TableHead className="py-3" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schoolData.map((row) => {
                    const sp25Color = row.sp25 ? (row.sp25 >= 65 ? 'text-[#4A9E3F]' : 'text-[#D28A1E]') : '';
                    
                    return (
                      <TableRow key={row.school} className="border-b border-border h-18">
                        <TableCell className="align-middle">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-[14px]">{row.school}</span>
                            <span className="bg-[#EBE2FC] text-[#5B2DA3] text-[11px] font-bold px-2 py-0.5 rounded-full">
                              {row.level}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className={cn("text-center font-bold text-[14px]", sp25Color)}>
                          {row.sp25 || <span className="text-slate-300 font-normal">—</span>}
                        </TableCell>
                        <TableCell className="text-center font-bold text-slate-400">
                          {row.fa24 ? (
                            <span>
                              {row.fa24}
                              {contextOnly && <span className="text-[#E0A93B] ml-0.5 font-semibold text-[13px]">*</span>}
                            </span>
                          ) : (
                            <span className="text-slate-300 font-normal">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-bold text-slate-400">
                          {row.sp24 ? (
                            <span>
                              {row.sp24}
                              {contextOnly && <span className="text-[#E0A93B] ml-0.5 font-semibold text-[13px]">*</span>}
                            </span>
                          ) : (
                            <span className="text-slate-300 font-normal">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-bold text-slate-400">
                          {row.fa23 ? (
                            <span>
                              {row.fa23}
                              {contextOnly && <span className="text-[#E0A93B] ml-0.5 font-semibold text-[13px]">*</span>}
                            </span>
                          ) : (
                            <span className="text-slate-300 font-normal">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-bold text-slate-400">
                          {row.sp23 ? (
                            <span>
                              {row.sp23}
                              {contextOnly && <span className="text-[#E0A93B] ml-0.5 font-semibold text-[13px]">*</span>}
                            </span>
                          ) : (
                            <span className="text-slate-300 font-normal">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.net !== null ? (
                            <span className="inline-flex items-center gap-1 text-[13px] font-medium text-slate-600">
                              ~{row.net} <span className="text-slate-400 text-[11px]">ⓘ</span>
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.status === 'published' ? (
                            <span className="inline-flex rounded-full bg-[#EEF7E8] text-[#4F8F43] px-3 py-1 text-[12px] font-semibold">
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-[#EBE2FC] text-[#5B2DA3] px-3 py-1 text-[12px] font-semibold">
                              Under review
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          {row.status === 'published' ? (
                            <span className="text-[13px] font-semibold text-[#5B2DA3] hover:underline cursor-pointer">
                              View Report
                            </span>
                          ) : (
                            <span className="text-slate-300 font-normal">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="mt-6 text-[12px] text-muted space-y-1 border-t border-border p-4 bg-canvas ">
              <p>Score = Yes% + ½ × Sometimes% (0–100). Positive ≥ 65 · Moderate 50–64 · Needs attention below 50.</p>
              <p className="text-[#9A9A9A]">
                Net change shows difference between Spring 2025 and Spring 2023. Periods marked with * use different versions — shown for context only.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer pills + text */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <ActionPill
            label="Open Fall 2024 roll-up"
            icon={<FileText className="h-3.5 w-3.5" />}
            onClick={onOpenRollup}
          />
          <ActionPill
            label="Open Fall 2025 roll-up"
            icon={<FileText className="h-3.5 w-3.5" />}
            onClick={onOpenRollup}
          />
          <ActionPill
            label="View benchmarks"
            icon={<BarChart3 className="h-3.5 w-3.5" />}
            onClick={onOpenBenchmarks}
          />
        </div>
        <div className="text-[12px] text-slate-400 lg:text-right">
          Reports are available as PDF. Figures match the downloadable report.
        </div>
      </div>
    </div>
  );
}