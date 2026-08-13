'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft,
  UploadCloud,
  Database,
  Sliders,
  Calendar,
  BarChart2,
  Clock,
  Award,
  Eye,
  CheckCircle2,
  Info,
  Trash2,
  Layers,
  Check,
  Building2,
} from 'lucide-react';
import { BENCHMARKS_DATA } from '../mockData';

interface ManageBenchmarkPageProps {
  id?: string;
}

export function ManageBenchmarkPage({ id: propId }: ManageBenchmarkPageProps = {}) {
  const router = useRouter();
  const params = useParams();
  const benchmarkId = propId || (params?.id as string);

  // Find benchmark or fallback to elementary benchmark
  const initialItem =
    BENCHMARKS_DATA.find((b) => b.id === benchmarkId) || BENCHMARKS_DATA[0];

  // Form States
  const [benchmarkName, setBenchmarkName] = useState(initialItem.title);
  const [benchmarkRepresents, setBenchmarkRepresents] = useState(
    `Compared with participating elementary schools using the same survey version (${initialItem.gradeLevel} v3) and similar enrollment.`
  );
  const [explanatoryNotes, setExplanatoryNotes] = useState(
    'Aggregated de-identified scores from all participating elementary schools. Weighted so no single school contributes more than 8% of any category mean.'
  );
  const [schoolLevel, setSchoolLevel] = useState(initialItem.gradeLevel);
  const [enrollmentBand, setEnrollmentBand] = useState('300–599');
  const [surveyVersion] = useState('K-5 v3');
  const [effectiveDate, setEffectiveDate] = useState('25/03/2026');
  const [calculationPeriod, setCalculationPeriod] = useState(
    '15 Sep 2025 – 22 Nov 2025'
  );
  const [sampleSize, setSampleSize] = useState(initialItem.schoolCount.toString());
  const [isDeidentified, setIsDeidentified] = useState(true);
  const [refreshCadenceDetails, setRefreshCadenceDetails] = useState(
    'Every fall survey window (September–November)'
  );

  // Approval Gate States
  const [gates, setGates] = useState({
    methodology: true,
    sufficientDataset: false,
    applicableSurvey: true,
    refreshCadence: false,
    approverRecorded: false,
    cohortMinimum: true,
  });

  const [approverName, setApproverName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Benchmark dataset configuration saved successfully.');
  };

  const handleDisable = () => {
    showToast('Benchmark disabled. It will no longer appear in school reports.');
  };

  const confirmedGatesCount = [
    gates.methodology,
    gates.sufficientDataset,
    gates.applicableSurvey,
    gates.refreshCadence,
    gates.approverRecorded,
  ].filter(Boolean).length;

  return (
    <div className="space-y-5 sm:space-y-6 max-w-[1000px] mx-auto w-full pb-16 font-sans min-w-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[70] bg-white border border-[#E8E6E1] shadow-2xl rounded-2xl px-4 py-3.5 flex items-center gap-3 text-xs sm:text-sm text-[#2B2B2B] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#8E8E8E] font-secondary">
        <Link
          href="/admin/benchmarks"
          className="hover:text-[#6825C2] transition-colors flex items-center gap-1 shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Benchmarks</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-[#2B2B2B] truncate">{initialItem.title}</span>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full font-sans">
        {/* Datasets */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[11px] sm:text-xs font-semibold text-[#8E8E8E] leading-tight">
              Datasets
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-bold text-[#2B2B2B]">6</div>
        </div>

        {/* Participating-school (active) */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[11px] sm:text-xs font-semibold text-[#8E8E8E] leading-tight">
              Participating-school (active)
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E3F5E3] text-[#196319] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-bold text-[#2B2B2B]">2</div>
        </div>

        {/* National (active) */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[11px] sm:text-xs font-semibold text-[#8E8E8E] leading-tight">
              National (active)
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F4F7F2] text-[#4D5E44] flex items-center justify-center shrink-0">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-bold text-[#2B2B2B]">0</div>
        </div>

        {/* Schools in largest cohort */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[11px] sm:text-xs font-semibold text-[#8E8E8E] leading-tight">
              Schools in largest cohort
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F1EFEA] text-[#6E6B65] flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-bold text-[#2B2B2B]">41</div>
        </div>
      </div>

      {/* Main Centered Form Container */}
      <form
        onSubmit={handleSave}
        className="bg-white border border-[#E8E6E1] rounded-2xl p-4 sm:p-8 space-y-6 sm:space-y-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]"
      >
        {/* Section 0: Top Status Badge & Minimum Cohort Check Banner */}
        <div className="space-y-3 pb-2 border-b border-[#EFEDE8]">
          <div className="flex items-center justify-between">
            <span className="bg-[#E3F5E3] text-[#196319] text-xs font-semibold px-3 py-1 rounded-full">
              Active
            </span>
            <button
              type="button"
              className="text-xs font-bold text-[#6825C2] hover:underline cursor-pointer"
            >
              View cohort details
            </button>
          </div>

          <div className="bg-[#E3F5E3]/60 border border-[#C6E9C6] rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 text-xs sm:text-sm text-[#196319]">
            <Check className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <p className="font-bold">22 comparable schools meets the 10-school minimum</p>
              <p className="text-xs text-[#276735]">
                This benchmark will be shown to schools that meet the comparison criteria.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Dataset file upload */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0">
              <UploadCloud className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#2B2B2B]">
              Dataset file upload
            </h3>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#2B2B2B]">
              Upload benchmark dataset file <span className="text-red-500">*</span>
            </label>

            {/* Uploaded File Container */}
            <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-full bg-[#E3F5E3] text-[#196319] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Check className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-bold text-[#2B2B2B] break-all sm:break-normal leading-tight">
                    elementary_benchmark_fall2025_v3.csv
                  </div>
                  <div className="text-[11px] text-[#8E8E8E] mt-0.5">0 B · Upload complete</div>
                </div>
              </div>

              {/* Separator line for mobile screens */}
              <div className="block sm:hidden w-full border-t border-[#E8E6E1]" />

              <div className="flex items-center justify-end gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#2B2B2B] bg-white border border-[#E8E6E1] rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Replace
                </button>
                <button
                  type="button"
                  aria-label="Delete file"
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-[#8E8E8E] font-secondary leading-relaxed pt-1">
              Upload de-identified aggregate data suitable for benchmarking. The dataset must contain school-level aggregates no student-level or personally identifiable records. Data is weighted so no single school can be identified or reverse-engineered.
            </p>
          </div>
        </div>

        <div className="border-t border-[#EFEDE8]" />

        {/* Section 2: Dataset identity */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#2B2B2B]">
              Dataset identity
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">
                Benchmark name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={benchmarkName}
                onChange={(e) => setBenchmarkName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs sm:text-sm text-[#2B2B2B] focus:outline-none focus:border-[#6825C2] font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">
                What this benchmark represents
              </label>
              <input
                type="text"
                value={benchmarkRepresents}
                onChange={(e) => setBenchmarkRepresents(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs sm:text-sm text-[#2B2B2B] focus:outline-none focus:border-[#6825C2] font-sans"
              />
              <span className="text-[11px] text-[#8E8E8E] font-secondary mt-1 block">
                This is the plain-language label schools see.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">
                Explanatory notes
              </label>
              <textarea
                rows={3}
                value={explanatoryNotes}
                onChange={(e) => setExplanatoryNotes(e.target.value)}
                className="w-full p-3.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs sm:text-sm text-[#2B2B2B] focus:outline-none focus:border-[#6825C2] font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#EFEDE8]" />

        {/* Section 3: Comparison criteria (v1) */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#2B2B2B]">
              Comparison criteria (v1)
            </h3>
          </div>

          <p className="text-xs text-[#8E8E8E] font-secondary leading-relaxed">
            v1 benchmarks compare schools by these criteria. Keeping the set small keeps comparison groups large enough to be safe.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">
                School level
              </label>
              <select
                value={schoolLevel}
                onChange={(e) => setSchoolLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs sm:text-sm text-[#2B2B2B] focus:outline-none focus:border-[#6825C2]"
              >
                <option value="K-5">K-5</option>
                <option value="6-8">6 - 8</option>
                <option value="9-12">9 - 12</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">
                Enrollment band
              </label>
              <select
                value={enrollmentBand}
                onChange={(e) => setEnrollmentBand(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs sm:text-sm text-[#2B2B2B] focus:outline-none focus:border-[#6825C2]"
              >
                <option value="Under 300">Under 300</option>
                <option value="300–599">300–599</option>
                <option value="600–999">600–999</option>
                <option value="1,000+">1,000+</option>
                <option value="All">All</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8E8E8E] mb-1">
                Survey version
              </label>
              <input
                type="text"
                disabled
                value={surveyVersion}
                className="w-full px-3.5 py-2.5 bg-[#F1EFEA] border border-[#E8E6E1] rounded-xl text-xs sm:text-sm text-[#8E8E8E] cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#EFEDE8]" />

        {/* Section 4: Applicability & dates */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#2B2B2B]">
              Applicability & dates
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">
                Effective dates
              </label>
              <input
                type="text"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs sm:text-sm text-[#2B2B2B] focus:outline-none focus:border-[#6825C2]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">
                Calculation period
              </label>
              <input
                type="text"
                value={calculationPeriod}
                onChange={(e) => setCalculationPeriod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs sm:text-sm text-[#2B2B2B] focus:outline-none focus:border-[#6825C2]"
              />
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-[#2B2B2B]">Applicable grade band</span>
            <p className="text-xs text-[#8E8E8E] font-secondary">Derived from survey version: K-5</p>
          </div>
        </div>

        <div className="border-t border-[#EFEDE8]" />

        {/* Section 5: Data source & sample */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#2B2B2B]">
              Data source & sample
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">
                Sample size (number of schools)
              </label>
              <input
                type="number"
                value={sampleSize}
                onChange={(e) => setSampleSize(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs sm:text-sm text-[#2B2B2B] focus:outline-none focus:border-[#6825C2]"
              />
              <span className="text-[11px] text-[#8E8E8E] font-secondary mt-1 block">
                Must be at least 10 for the benchmark to appear to schools.
              </span>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="deidentifiedCheck"
                checked={isDeidentified}
                onChange={(e) => setIsDeidentified(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#6825C2] rounded border-[#E8E6E1] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="deidentifiedCheck" className="text-xs text-[#2B2B2B] font-semibold cursor-pointer">
                Data is de-identified aggregates only
                <span className="block text-[#8E8E8E] font-normal font-secondary mt-0.5">
                  Benchmarks use de-identified aggregates only, weighted so no single school can be identified or reverse-engineered.
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-[#EFEDE8]" />

        {/* Section 6: Cohort & representativeness summary */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#2B2B2B]">
              Cohort & representativeness summary
            </h3>
          </div>

          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-4 sm:p-6 space-y-5">
            <div className="text-xs font-semibold text-[#8E8E8E] uppercase tracking-wider">
              Cohort & representativeness summary
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2 border-b border-[#EFEDE8]">
              <div>
                <span className="text-xs font-semibold text-[#8E8E8E]">Schools in dataset</span>
                <div className="text-3xl font-bold text-[#276735] mt-1">22</div>
                <span className="text-[11px] text-[#8E8E8E]">minimum 10 required to surface to schools</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#8E8E8E]">Primary comparison group</span>
                <div className="text-sm font-bold text-[#2B2B2B] mt-1">Elementary · 300–599</div>
                <span className="text-[11px] text-[#8E8E8E]">22 schools qualify</span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="text-xs font-semibold text-[#8E8E8E] mb-1">Qualifying schools per comparison criterion</div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1.5 border-b border-[#EFEDE8]/50">
                <span className="text-[#2B2B2B]">By school level <strong className="font-semibold">Elementary</strong></span>
                <span className="font-semibold text-[#276735] shrink-0">22 schools <span className="text-[#8E8E8E] font-normal">(100% of dataset)</span> ✓</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1.5 border-b border-[#EFEDE8]/50">
                <span className="text-[#2B2B2B]">By enrollment band <strong className="font-semibold">300–599</strong></span>
                <span className="font-semibold text-[#276735] shrink-0">18 schools <span className="text-[#8E8E8E] font-normal">(82% of dataset)</span> ✓</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1.5">
                <span className="text-[#2B2B2B]">By survey version <strong className="font-semibold">K-5 v3</strong></span>
                <span className="font-semibold text-[#276735] shrink-0">22 schools <span className="text-[#8E8E8E] font-normal">(100% of dataset)</span> ✓</span>
              </div>

              <div className="bg-[#E3F5E3]/60 border border-[#C6E9C6] rounded-2xl p-3.5 mt-3 flex items-start gap-2.5 text-xs text-[#196319]">
                <Check className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold">22 schools meets the 10-school minimum for benchmarking</p>
                  <p className="text-[#276735]">This benchmark will be visible to schools that meet the comparison criteria in their reports.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#EFEDE8]" />

        {/* Section 7: Benchmark type & activation */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#2B2B2B]">
              Benchmark type & activation
            </h3>
          </div>

          {/* Amber Warning Box */}
          <div className="bg-[#FFF2DC] border border-[#FDE3B5] rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-[#B46B09]">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <p className="font-bold">
                Until an approved national dataset is activated, this benchmark is labelled &quot;Cafeteria Pulse participating-school benchmark.&quot;
              </p>
              <p className="text-xs text-[#9C5B09]">
                The word &quot;national&quot; is never applied automatically or prematurely. The consumer-facing label you see below is exactly what schools and districts will see on their benchmark screens.
              </p>
            </div>
          </div>

          {/* Consumer Facing Label Preview (Active Badge Right Aligned Header) */}
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-4 sm:p-5 space-y-3 font-sans">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#8E8E8E]">Consumer-facing label</span>
              <span className="bg-[#E3F5E3] text-[#196319] text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0">
                Active
              </span>
            </div>
            <div>
              <span className="bg-[#ECE6F8] text-[#6825C2] text-xs font-semibold px-3 py-1.5 rounded-full inline-block leading-snug max-w-full">
                Cafeteria Pulse participating-school benchmark
              </span>
            </div>
            <p className="text-xs text-[#8E8E8E] font-secondary leading-relaxed pt-0.5">
              This is the exact wording schools and districts will see on their benchmark comparison screens. The label changes only when a national dataset is explicitly activated.
            </p>
          </div>

          {/* Radio Options */}
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="text-xs font-semibold text-[#8E8E8E]">Benchmark type & activation</div>

            {/* Selected Radio */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#F0EAFB]/50 border border-[#6825C2] flex items-start gap-3">
              <input
                type="radio"
                name="benchmarkType"
                checked
                readOnly
                className="mt-1 text-[#6825C2] focus:ring-0 cursor-pointer shrink-0"
              />
              <div>
                <span className="text-xs sm:text-sm font-bold text-[#2B2B2B]">
                  Cafeteria Pulse participating-school benchmark
                </span>
                <p className="text-xs text-[#8E8E8E] mt-0.5 leading-relaxed">
                  The default label. Always available so long as the cohort meets the 10-school minimum. Shows schools they are compared with other Cafeteria Pulse participants. &quot;National&quot; is not applied automatically just because data spans multiple schools.
                </p>
              </div>
            </div>

            {/* Disabled Radio */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E8E6E1] flex items-start gap-3 opacity-60">
              <input
                type="radio"
                name="benchmarkType"
                disabled
                className="mt-1 text-slate-400 focus:ring-0 cursor-not-allowed shrink-0"
              />
              <div>
                <span className="text-xs sm:text-sm font-bold text-[#8E8E8E]">
                  National benchmark
                </span>
                <p className="text-xs text-[#8E8E8E] mt-0.5 leading-relaxed">
                  National labelling requires all five approval gate items below to be confirmed and the cohort to meet the 10-school minimum.
                </p>
              </div>
            </div>

            {/* National Benchmark Approval Gate List */}
            <div className="pt-2 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-[#2B2B2B]">National benchmark approval gate</h4>
                <p className="text-[11px] text-[#8E8E8E] leading-normal mt-0.5">
                  Each item must be explicitly confirmed by SFWG. None are auto-checked. Until all five items are met plus the cohort satisfies the 10-school minimum, only the &quot;Cafeteria Pulse participating-school benchmark&quot; label is available.
                </p>
              </div>

              {/* Gate Items List */}
              <div className="space-y-2">
                {/* Gate 1 */}
                <div className="p-3 bg-white border border-[#E8E6E1] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={gates.methodology}
                      onChange={(e) => setGates({ ...gates, methodology: e.target.checked })}
                      className="mt-0.5 text-[#6825C2] rounded border-[#E8E6E1] shrink-0"
                    />
                    <div>
                      <span className="font-bold text-[#2B2B2B]">Methodology documented</span>
                      <p className="text-[#8E8E8E] text-[11px]">A documented methodology is attached and confirmed by SFWG.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#196319] shrink-0 self-end sm:self-center">Confirmed</span>
                </div>

                {/* Gate 2 */}
                <div className="p-3 bg-white border border-[#E8E6E1] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={gates.sufficientDataset}
                      onChange={(e) => setGates({ ...gates, sufficientDataset: e.target.checked })}
                      className="mt-0.5 text-[#6825C2] rounded border-[#E8E6E1] shrink-0"
                    />
                    <div>
                      <span className="font-bold text-[#2B2B2B]">Dataset sufficiently broad and representative</span>
                      <p className="text-[#8E8E8E] text-[11px]">The dataset covers enough schools across the comparison criteria to be considered nationally representative.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGates({ ...gates, sufficientDataset: !gates.sufficientDataset })}
                    className="text-[11px] font-semibold text-[#8E8E8E] hover:text-[#2B2B2B] cursor-pointer shrink-0 self-end sm:self-center"
                  >
                    Confirm
                  </button>
                </div>

                {/* Gate 3 */}
                <div className="p-3 bg-white border border-[#E8E6E1] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={gates.applicableSurvey}
                      onChange={(e) => setGates({ ...gates, applicableSurvey: e.target.checked })}
                      className="mt-0.5 text-[#6825C2] rounded border-[#E8E6E1] shrink-0"
                    />
                    <div>
                      <span className="font-bold text-[#2B2B2B]">Applicable survey version & calculation period approved</span>
                      <p className="text-[#8E8E8E] text-[11px]">The survey version and calculation period have been reviewed and approved for national benchmarking.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#196319] shrink-0 self-end sm:self-center">Confirmed</span>
                </div>

                {/* Gate 4 */}
                <div className="p-3 bg-white border border-[#E8E6E1] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={gates.refreshCadence}
                      onChange={(e) => setGates({ ...gates, refreshCadence: e.target.checked })}
                      className="mt-0.5 text-[#6825C2] rounded border-[#E8E6E1] shrink-0"
                    />
                    <div>
                      <span className="font-bold text-[#2B2B2B]">Refresh cadence documented</span>
                      <p className="text-[#8E8E8E] text-[11px]">How often this benchmark will be refreshed is documented and scheduled.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGates({ ...gates, refreshCadence: !gates.refreshCadence })}
                    className="text-[11px] font-semibold text-[#8E8E8E] hover:text-[#2B2B2B] cursor-pointer shrink-0 self-end sm:self-center"
                  >
                    Confirm
                  </button>
                </div>

                {/* Gate 5 Approver */}
                <div className="p-3 bg-white border border-[#E8E6E1] rounded-xl space-y-2 text-xs">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={gates.approverRecorded}
                      onChange={(e) => setGates({ ...gates, approverRecorded: e.target.checked })}
                      className="mt-0.5 text-[#6825C2] rounded border-[#E8E6E1] shrink-0"
                    />
                    <div>
                      <span className="font-bold text-[#2B2B2B]">Approver recorded</span>
                      <p className="text-[#8E8E8E] text-[11px]">Who approved attestation, so it is never &quot;national&quot; without a record.</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pl-0 sm:pl-6 w-full pt-1">
                    <input
                      type="text"
                      placeholder="Name of the SFWG member approving national status"
                      value={approverName}
                      onChange={(e) => setApproverName(e.target.value)}
                      className="w-full sm:flex-1 px-3 py-2 bg-[#FAF9F6] border border-[#E8E6E1] rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setGates({ ...gates, approverRecorded: true })}
                      className="w-full sm:w-auto px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-200 cursor-pointer text-center"
                    >
                      Confirm
                    </button>
                  </div>
                </div>

                {/* Gate 6 Cohort minimum */}
                <div className="p-3 bg-white border border-[#E8E6E1] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={gates.cohortMinimum}
                      readOnly
                      className="mt-0.5 text-[#6825C2] rounded border-[#E8E6E1] shrink-0"
                    />
                    <div>
                      <span className="font-bold text-[#2B2B2B]">Cohort meets 10-school minimum</span>
                      <p className="text-[#8E8E8E] text-[11px]">Automatically derived from uploaded data.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#196319] shrink-0 self-end sm:self-center">Met</span>
                </div>
              </div>

              {/* Refresh cadence details */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">
                  Refresh cadence details
                </label>
                <input
                  type="text"
                  value={refreshCadenceDetails}
                  onChange={(e) => setRefreshCadenceDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E6E1] rounded-xl text-xs sm:text-sm text-[#2B2B2B]"
                />
                <span className="text-[11px] text-[#8E8E8E] mt-1 block">
                  Add details about how often this benchmark dataset is refreshed. This supplements the gate checkbox above.
                </span>
              </div>

              {/* Approval Summary Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
                <span className="text-xs text-[#8E8E8E]">
                  {confirmedGatesCount} of 5 gate items confirmed. Confirm all items above to enable national activation.
                </span>
                <button
                  type="button"
                  disabled={confirmedGatesCount < 5}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-200 text-slate-400 font-semibold rounded-full text-xs cursor-not-allowed disabled:opacity-60 text-center"
                >
                  Activate as national
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#EFEDE8]" />

        {/* Section 8: Status & visibility */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#2B2B2B]">
              Status & visibility
            </h3>
          </div>

          <div className="bg-[#F0EAFB]/40 border border-[#E5DBF8] rounded-2xl p-4 text-xs sm:text-sm text-[#6825C2] flex items-start gap-2.5">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              Schools that meet the comparison criteria will see this benchmark in their reports, labelled &quot;Cafeteria Pulse participating-school benchmark.&quot;
            </span>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-4 border-t border-[#EFEDE8] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
          <button
            type="button"
            onClick={handleDisable}
            className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#D8201D] border border-[#D8201D] hover:bg-red-50 rounded-full transition-colors cursor-pointer text-center"
          >
            Disable benchmark
          </button>

          <div className="grid grid-cols-2 sm:flex sm:items-center justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => router.push('/admin/benchmarks')}
              className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#3A4A32] bg-[#F4F7F2] border border-[#DDE6D9] hover:bg-[#E7ECE4] rounded-full transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#54664B] hover:bg-[#43523C] rounded-full shadow-xs transition-colors cursor-pointer text-center"
            >
              Save dataset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
