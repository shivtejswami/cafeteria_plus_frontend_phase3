'use client';
import React, { useState } from 'react';
import { FileText, Award, Users, Smile, AlertCircle, Info } from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs';
import { StatCard } from '@/components/ui/StatCard';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { AnimatedBar } from '@/components/ui/AnimatedBar';
import { AlertBox } from '@/components/ui/AlertBox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { StatusChip } from '@/components/ui/StatusChip';
import Link from 'next/link';

// Simple donut chart component
function DonutChart({ score, label, statusLabel, statusColor }: { score: number; label: string; statusLabel: string; statusColor: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // The SVG stroke needs a colour value; the label beside it uses the matching class.
  let strokeColor = '#22C55E'; // green
  let scoreTextClass = 'text-[#22C55E]';
  if (score < 50) {
    strokeColor = '#EF4444'; // red
    scoreTextClass = 'text-[#EF4444]';
  } else if (score < 65) {
    strokeColor = '#F59E0B'; // amber
    scoreTextClass = 'text-[#F59E0B]';
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="relative flex items-center justify-center w-24 h-24 mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-bold ${scoreTextClass}`}>{score}</span>
        </div>
      </div>
      <div className="text-base font-bold text-slate-900">{label}</div>
      <div className={`mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
        {statusLabel}
      </div>
      <div className="mt-1 text-xs text-slate-500">62-82</div>
    </div>
  );
}

function DistrictRollup() {
  return (
    <div className="space-y-8 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard 
          title="Schools reporting" 
          value="14 of 18" 
          subtext="1,283 responses"
          icon={<FileText className="w-5 h-5" />}
        />
        <StatCard 
          title="District average score" 
          value="62" 
          subtext="from 14 schools"
          icon={<Award className="w-5 h-5" />}
          iconBgColor="bg-amber-50"
          iconTextColor="text-amber-600"
        />
        <StatCard 
          title="District participation" 
          value="71%" 
          subtext="1,343 responses"
          icon={<Users className="w-5 h-5" />}
          iconBgColor="bg-emerald-50"
          iconTextColor="text-emerald-600"
        />
        <StatCard 
          title="District sentiment" 
          value="58%" 
          subtext="positive responses"
          icon={<Smile className="w-5 h-5" />}
          iconBgColor="bg-purple-50"
          iconTextColor="text-purple-600"
        />
        <StatCard 
          title="Reports this period" 
          value="14" 
          subtext="3 under review"
          icon={<FileText className="w-5 h-5" />}
          iconBgColor="bg-emerald-50"
          iconTextColor="text-emerald-600"
        />
      </div>

      <AlertBox icon={<AlertCircle className="w-5 h-5" />} title="Reliability note">
        This roll-up includes 3 schools with a small sample and 1 school too small for concept breakdown. Treat their input figures as directional. Schools marked "Small sample: directional" have fewer than 20 responses. Schools with fewer than 10 responses are excluded from concept-level averages.
      </AlertBox>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">District concept scores</h3>
            <p className="text-sm text-slate-500">Computed from 1,283 responses across 14 schools with published reports</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Positive</div>
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> Moderate</div>
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> Needs attention</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DonutChart score={68} label="Taste" statusLabel="Positive" statusColor="bg-emerald-50 text-emerald-700" />
          <DonutChart score={64} label="Freshness" statusLabel="Moderate" statusColor="bg-amber-50 text-amber-700" />
          <DonutChart score={59} label="Variety" statusLabel="Moderate" statusColor="bg-amber-50 text-amber-700" />
          <DonutChart score={61} label="Staff" statusLabel="Moderate" statusColor="bg-amber-50 text-amber-700" />
          <DonutChart score={68} label="Cleanliness" statusLabel="Positive" statusColor="bg-emerald-50 text-emerald-700" />
          <DonutChart score={53} label="Time to eat" statusLabel="Moderate" statusColor="bg-amber-50 text-amber-700" />
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concept</TableHead>
              <TableHead>District avg.</TableHead>
              <TableHead>Band</TableHead>
              <TableHead>Range</TableHead>
              <TableHead className="text-right">Top school</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium text-slate-900">Taste</TableCell>
              <TableCell className="font-bold text-emerald-600">68</TableCell>
              <TableCell><span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700">Positive</span></TableCell>
              <TableCell className="text-slate-500">62-82</TableCell>
              <TableCell className="text-right text-slate-600">Cedar Grove Elementary (82)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-slate-900">Freshness</TableCell>
              <TableCell className="font-bold text-amber-600">64</TableCell>
              <TableCell><span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-50 text-amber-700">Moderate</span></TableCell>
              <TableCell className="text-slate-500">48-80</TableCell>
              <TableCell className="text-right text-slate-600">Cedar Grove Elementary (80)</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SchoolComparison() {
  return (
    <div className="space-y-6 mt-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-1">School comparison</h3>
        <p className="text-sm text-slate-500 mb-6">Overall scores, participation, and concept breakdown by school</p>
        
        <div className="space-y-3 max-w-3xl mb-12">
           {/* Mock Bar chart */}
           <div className="flex items-center gap-4">
             <div className="w-48 text-sm font-medium text-slate-700 text-right truncate">Maple Ridge Middle</div>
             <div className="flex-1">
               <AnimatedBar value={85} className="h-6 bg-emerald-500 rounded-sm" />
             </div>
           </div>
           <div className="flex items-center gap-4">
             <div className="w-48 text-sm font-medium text-slate-700 text-right truncate">Sunset Elementary</div>
             <div className="flex-1">
               <AnimatedBar value={70} className="h-6 bg-emerald-500 rounded-sm" />
             </div>
           </div>
           <div className="flex items-center gap-4">
             <div className="w-48 text-sm font-medium text-slate-700 text-right truncate">Hillside Middle</div>
             <div className="flex-1">
               <AnimatedBar value={68} className="h-6 bg-emerald-400 rounded-sm" />
             </div>
           </div>
           <div className="flex items-center gap-4">
             <div className="w-48 text-sm font-medium text-slate-700 text-right truncate">Pine Grove Elementary</div>
             <div className="flex-1">
               <AnimatedBar value={45} className="h-6 bg-red-400 rounded-sm" />
             </div>
           </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School</TableHead>
              <TableHead>Overall</TableHead>
              <TableHead>Participation</TableHead>
              <TableHead>Taste</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="font-medium text-slate-900">North Hills Elementary</div>
                <div className="text-xs text-slate-500">K-5</div>
              </TableCell>
              <TableCell className="font-bold text-emerald-600">72</TableCell>
              <TableCell>
                <div className="text-slate-900">84% - 92 of 110</div>
              </TableCell>
              <TableCell className="text-emerald-600">79</TableCell>
              <TableCell><StatusChip status="published" /></TableCell>
              <TableCell><Link href="#" className="text-indigo-600 text-sm font-medium hover:underline">View report</Link></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium text-slate-900">Hillside Middle</div>
                <div className="text-xs text-slate-500">6-8</div>
              </TableCell>
              <TableCell className="font-bold text-emerald-500">68</TableCell>
              <TableCell>
                <div className="text-slate-900">77% - 115 of 150</div>
              </TableCell>
              <TableCell className="text-emerald-500">75</TableCell>
              <TableCell><StatusChip status="under-review" /></TableCell>
              <TableCell><Link href="#" className="text-indigo-600 text-sm font-medium hover:underline">View report</Link></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function AnalyticsCharts() {
  const [activeTab, setActiveTab] = useState('rollup');

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Reports & Analytics</h1>
        <p className="text-sm text-slate-500">District roll-up and school comparison for Fall 2025 (published)</p>
      </div>

      <Tabs 
        tabs={[
          { id: 'rollup', label: 'District roll-up' },
          { id: 'comparison', label: 'School comparison' }
        ]} 
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <FilterDropdown label="Grade band" options={[{ value: 'all', label: 'K-8' }]} />
          <FilterDropdown label="Period" options={[{ value: 'fall2025', label: 'Fall 2025' }]} />
          <div className="text-sm text-slate-500 ml-2">Based on your schools' latest reports for the selected period.</div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
            Year-over-year
          </button>
          <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
            District benchmarks
          </button>
        </div>
      </div>

      {activeTab === 'rollup' && <DistrictRollup />}
      {activeTab === 'comparison' && <SchoolComparison />}
    </div>
  );
}
