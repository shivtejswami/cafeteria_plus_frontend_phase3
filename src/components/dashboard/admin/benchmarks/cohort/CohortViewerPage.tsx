'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Search,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  Building2,
  Settings,
  Layers,
  Info,
  X,
} from 'lucide-react';
import { COHORT_GROUPS_DATA } from './mockData';
import { CohortGroupRecord } from './types';

interface CohortViewerPageProps {
  id?: string;
}

export function CohortViewerPage({ id }: CohortViewerPageProps = {}) {
  const router = useRouter();
  const [cohortGroups, setCohortGroups] = useState<CohortGroupRecord[]>(COHORT_GROUPS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeBandFilter, setGradeBandFilter] = useState('All');
  const [schoolLevelFilter, setSchoolLevelFilter] = useState('All');
  const [enrollmentFilter, setEnrollmentFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // View Schools Modal State
  const [activeSchoolListGroup, setActiveSchoolListGroup] = useState<CohortGroupRecord | null>(null);

  // Dropdown States
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [isAvailOpen, setIsAvailOpen] = useState(false);

  const gradeRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);
  const enrollRef = useRef<HTMLDivElement>(null);
  const availRef = useRef<HTMLDivElement>(null);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (gradeRef.current && !gradeRef.current.contains(e.target as Node)) setIsGradeOpen(false);
      if (levelRef.current && !levelRef.current.contains(e.target as Node)) setIsLevelOpen(false);
      if (enrollRef.current && !enrollRef.current.contains(e.target as Node)) setIsEnrollOpen(false);
      if (availRef.current && !availRef.current.contains(e.target as Node)) setIsAvailOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setActiveMenuId(null);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter Logic
  const filteredGroups = useMemo(() => {
    return cohortGroups.filter((cg) => {
      if (gradeBandFilter !== 'All') {
        if (!cg.title.includes(gradeBandFilter)) return false;
      }
      if (schoolLevelFilter !== 'All') {
        if (cg.gradeLevel !== schoolLevelFilter) return false;
      }
      if (enrollmentFilter !== 'All') {
        if (cg.enrollmentBand !== enrollmentFilter) return false;
      }
      if (availabilityFilter !== 'All') {
        if (cg.availability !== availabilityFilter) return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        if (!cg.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [cohortGroups, gradeBandFilter, schoolLevelFilter, enrollmentFilter, availabilityFilter, searchQuery]);

  const meetingCount = cohortGroups.filter((c) => !c.isBelowMinimum && c.availability === 'Available').length;
  const belowCount = cohortGroups.filter((c) => c.isBelowMinimum || c.availability === 'Withheld').length;

  const totalPages = Math.ceil(filteredGroups.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = filteredGroups.slice(startIndex, startIndex + pageSize);

  // Withheld groups list for the bottom section
  const withheldGroups = cohortGroups.filter((c) => c.withheldReason);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-16 font-sans min-w-0">
      {/* Top Header & Breadcrumb */}
      <div className="space-y-1">
        <h1 className="text-[22px] sm:text-[28px] font-bold text-[#2B2B2B] font-sans leading-tight">
          Cohort size viewer
        </h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#8E8E8E] font-secondary">
          <Link href="/admin/benchmarks" className="hover:text-[#6825C2] transition-colors">
            Benchmarks
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#2B2B2B]">Cohort viewer</span>
        </div>
      </div>

      {/* Callout Notice (Purple Shield Box) */}
      <div className="bg-white border border-[#E8E6E1] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex items-start gap-3 sm:gap-4">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0 mt-0.5">
          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm font-sans min-w-0">
          <p className="font-bold text-[#2B2B2B] leading-snug">
            A benchmark is shown only when at least 10 comparable schools qualify. Calculations are weighted so no single school makes up a disproportionate share and no school can be reverse-engineered from a displayed result.
          </p>
          <p className="text-[11px] sm:text-xs text-[#8E8E8E] font-secondary leading-normal">
            Groups below the minimum are withheld and schools see &quot;a benchmark will become available when enough comparable schools have participated.&quot;
          </p>
        </div>
      </div>

      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 w-full font-sans">
        {/* 1. Comparison groups */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex justify-between items-start">
          <div>
            <div className="text-xs font-semibold text-[#8E8E8E]">Comparison groups</div>
            <div className="text-2xl sm:text-3xl font-bold text-[#2B2B2B] mt-2">12</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        {/* 2. Meeting minimum */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex justify-between items-start">
          <div>
            <div className="text-xs font-semibold text-[#8E8E8E]">Meeting minimum</div>
            <div className="text-2xl sm:text-3xl font-bold text-[#196319] mt-2">{meetingCount}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#E3F5E3] text-[#196319] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* 3. Below minimum */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex justify-between items-start">
          <div>
            <div className="text-xs font-semibold text-[#8E8E8E]">Below minimum</div>
            <div className="text-2xl sm:text-3xl font-bold text-[#B46B09] mt-2">{belowCount}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#FFF1DD] text-[#B46B09] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* 4. Schools contributing */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex justify-between items-start">
          <div>
            <div className="text-xs font-semibold text-[#8E8E8E]">Schools contributing</div>
            <div className="text-2xl sm:text-3xl font-bold text-[#2B2B2B] mt-2">139</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#F1EFEA] text-[#6E6B65] flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
        </div>

        {/* 5. Minimum threshold */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex justify-between items-start">
          <div>
            <div className="text-xs font-semibold text-[#8E8E8E]">Minimum threshold</div>
            <div className="text-2xl sm:text-3xl font-bold text-[#2B2B2B] mt-2">10</div>
            <span className="text-[10px] text-[#8E8E8E] block leading-tight mt-0.5">
              Configurable in Platform settings
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#F1EFEA] text-[#6E6B65] flex items-center justify-center shrink-0">
            <Settings className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search comparison groups..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E8E6E1] rounded-full text-xs sm:text-sm text-[#2B2B2B] placeholder:text-slate-400 focus:outline-none focus:ring-0 shadow-sm font-sans"
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2">
          {/* Grade Band */}
          <div className="relative" ref={gradeRef}>
            <button
              type="button"
              onClick={() => setIsGradeOpen(!isGradeOpen)}
              className="w-full sm:w-auto inline-flex items-center justify-between gap-1.5 px-3.5 py-2 bg-white border border-[#E8E6E1] rounded-full text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer select-none"
            >
              <span className="text-slate-400 font-normal">Grade band:</span>
              <span className="font-semibold text-[#2B2B2B]">{gradeBandFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>
            {isGradeOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {['All', 'K-5', '6-8', '9-12'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      setGradeBandFilter(g);
                      setIsGradeOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer ${
                      gradeBandFilter === g ? 'bg-[#F0EAFB] text-[#6825C2] font-medium' : 'text-[#2B2B2B] hover:bg-slate-50'
                    }`}
                  >
                    <span>{g}</span>
                    {gradeBandFilter === g && <Check className="w-3.5 h-3.5 text-[#6825C2]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* School Level */}
          <div className="relative" ref={levelRef}>
            <button
              type="button"
              onClick={() => setIsLevelOpen(!isLevelOpen)}
              className="w-full sm:w-auto inline-flex items-center justify-between gap-1.5 px-3.5 py-2 bg-white border border-[#E8E6E1] rounded-full text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer select-none"
            >
              <span className="text-slate-400 font-normal">School level:</span>
              <span className="font-semibold text-[#2B2B2B]">{schoolLevelFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>
            {isLevelOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {['All', 'Elementary', 'Middle', 'High'].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => {
                      setSchoolLevelFilter(l);
                      setIsLevelOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer ${
                      schoolLevelFilter === l ? 'bg-[#F0EAFB] text-[#6825C2] font-medium' : 'text-[#2B2B2B] hover:bg-slate-50'
                    }`}
                  >
                    <span>{l}</span>
                    {schoolLevelFilter === l && <Check className="w-3.5 h-3.5 text-[#6825C2]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Enrollment */}
          <div className="relative" ref={enrollRef}>
            <button
              type="button"
              onClick={() => setIsEnrollOpen(!isEnrollOpen)}
              className="w-full sm:w-auto inline-flex items-center justify-between gap-1.5 px-3.5 py-2 bg-white border border-[#E8E6E1] rounded-full text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer select-none"
            >
              <span className="text-slate-400 font-normal">Enrollment:</span>
              <span className="font-semibold text-[#2B2B2B]">{enrollmentFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>
            {isEnrollOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {['All', 'Under 300', '300–599', '600–999', '1,000+'].map((eVal) => (
                  <button
                    key={eVal}
                    type="button"
                    onClick={() => {
                      setEnrollmentFilter(eVal);
                      setIsEnrollOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer ${
                      enrollmentFilter === eVal ? 'bg-[#F0EAFB] text-[#6825C2] font-medium' : 'text-[#2B2B2B] hover:bg-slate-50'
                    }`}
                  >
                    <span>{eVal}</span>
                    {enrollmentFilter === eVal && <Check className="w-3.5 h-3.5 text-[#6825C2]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="relative" ref={availRef}>
            <button
              type="button"
              onClick={() => setIsAvailOpen(!isAvailOpen)}
              className="w-full sm:w-auto inline-flex items-center justify-between gap-1.5 px-3.5 py-2 bg-white border border-[#E8E6E1] rounded-full text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer select-none"
            >
              <span className="text-slate-400 font-normal">Availability:</span>
              <span className="font-semibold text-[#2B2B2B]">{availabilityFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>
            {isAvailOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {['All', 'Available', 'Withheld', 'Not yet'].map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => {
                      setAvailabilityFilter(a);
                      setIsAvailOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer ${
                      availabilityFilter === a ? 'bg-[#F0EAFB] text-[#6825C2] font-medium' : 'text-[#2B2B2B] hover:bg-slate-50'
                    }`}
                  >
                    <span>{a}</span>
                    {availabilityFilter === a && <Check className="w-3.5 h-3.5 text-[#6825C2]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Groups Table */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden flex flex-col w-full min-w-0 font-sans">
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1020px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#EFEDE8]">
                <th className="text-left text-[12px] font-medium text-[#8E8E8E] font-sans py-4 px-5 sm:px-6 whitespace-nowrap min-w-[240px]">
                  Comparison group
                </th>
                <th className="text-left text-[12px] font-medium text-[#8E8E8E] font-sans py-4 px-4 whitespace-nowrap min-w-[180px]">
                  Criteria
                </th>
                <th className="text-left text-[12px] font-medium text-[#8E8E8E] font-sans py-4 px-4 whitespace-nowrap min-w-[140px]">
                  Qualifying schools
                </th>
                <th className="text-left text-[12px] font-medium text-[#8E8E8E] font-sans py-4 px-4 whitespace-nowrap min-w-[120px]">
                  Availability
                </th>
                <th className="text-left text-[12px] font-medium text-[#8E8E8E] font-sans py-4 px-4 whitespace-nowrap min-w-[140px]">
                  Concentration
                </th>
                <th className="text-left text-[12px] font-medium text-[#8E8E8E] font-sans py-4 px-4 whitespace-nowrap min-w-[180px]">
                  Linked benchmark
                </th>
                <th className="py-4 px-5 sm:px-6 w-28 text-right whitespace-nowrap text-[12px] font-medium text-[#8E8E8E]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs sm:text-sm text-slate-500">
                    No comparison groups match the selected filters.
                  </td>
                </tr>
              ) : (
                currentItems.map((group) => {
                  const isMenuOpen = activeMenuId === group.id;

                  return (
                    <tr
                      key={group.id}
                      className="border-b border-[#EFEDE8] hover:bg-[#FAF9F6]/60 transition-colors last:border-b-0"
                    >
                      {/* Comparison group title */}
                      <td className="py-4 px-5 sm:px-6 align-middle whitespace-nowrap">
                        <span className="text-[14px] font-bold text-[#2B2B2B]">
                          {group.title}
                        </span>
                      </td>

                      {/* Criteria Pills */}
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="bg-[#EFECE6] text-[#6E6B65] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                            {group.gradeLevel}
                          </span>
                          <span className="bg-[#EFECE6] text-[#6E6B65] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                            {group.enrollmentBand}
                          </span>
                          <span className="bg-[#EFECE6] text-[#6E6B65] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                            {group.surveyVersion}
                          </span>
                        </div>
                      </td>

                      {/* Qualifying schools */}
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        {!group.isBelowMinimum ? (
                          <div className="flex items-center gap-1">
                            <span className="text-[14px] font-bold text-[#276735]">
                              {group.qualifyingSchools}
                            </span>
                            <span className="text-[#276735] font-bold">✓</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-start leading-tight">
                            <span className="text-[14px] font-bold text-[#9C5B09]">
                              {group.qualifyingSchools}
                            </span>
                            <span className="text-[11px] text-[#9C5B09]">below minimum</span>
                          </div>
                        )}
                      </td>

                      {/* Availability */}
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        {group.availability === 'Available' && (
                          <span className="bg-[#E3F5E3] text-[#196319] text-[12px] font-semibold px-3 py-1 rounded-full">
                            Available
                          </span>
                        )}
                        {group.availability === 'Withheld' && (
                          <span className="bg-[#FFF1DD] text-[#B46B09] text-[12px] font-semibold px-3 py-1 rounded-full">
                            Withheld
                          </span>
                        )}
                        {group.availability === 'Not yet' && (
                          <span className="bg-[#F1EFEA] text-[#6E6B65] text-[12px] font-semibold px-3 py-1 rounded-full">
                            Not yet
                          </span>
                        )}
                      </td>

                      {/* Concentration */}
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        {group.concentration === 'Balanced' && (
                          <span className="text-[13px] font-bold text-[#276735]">
                            Balanced ✓
                          </span>
                        )}
                        {group.concentration === 'Concentration risk' && (
                          <span className="text-[13px] font-bold text-[#9C5B09]">
                            Concentration risk
                          </span>
                        )}
                      </td>

                      {/* Linked benchmark */}
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        {group.linkedBenchmarkTitle ? (
                          <Link
                            href={`/admin/benchmarks/${group.linkedBenchmarkId || 'bench-1'}`}
                            className="text-[13px] font-bold text-[#6825C2] hover:underline truncate max-w-[160px] block"
                          >
                            {group.linkedBenchmarkTitle}
                          </Link>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 sm:px-6 align-middle text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2.5 relative" ref={isMenuOpen ? menuRef : undefined}>
                          <button
                            type="button"
                            onClick={() => setActiveSchoolListGroup(group)}
                            className="text-[13px] font-bold text-[#6825C2] hover:underline cursor-pointer"
                          >
                            View schools
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveMenuId(isMenuOpen ? null : group.id)}
                            className="p-1 text-[#8E8E8E] hover:text-[#2B2B2B] rounded hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Popover Menu */}
                          {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveSchoolListGroup(group);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-[#2B2B2B] hover:bg-slate-50 text-left cursor-pointer"
                              >
                                View qualifying schools
                              </button>
                              {group.linkedBenchmarkId && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    router.push(`/admin/benchmarks/${group.linkedBenchmarkId}`);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3.5 py-2 text-xs font-semibold text-[#6825C2] hover:bg-slate-50 text-left cursor-pointer border-t border-[#EFEDE8]"
                                >
                                  Open linked benchmark
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-row justify-between items-center px-5 sm:px-6 py-4 border-t border-[#EFEDE8] bg-white w-full">
          <div className="text-[13px] font-normal text-[#8E8E8E] font-secondary shrink-0">
            Showing {startIndex + 1}–{Math.min(startIndex + pageSize, filteredGroups.length)} of {filteredGroups.length}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg border border-[#E8E6E1] bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-all ${
                  p === currentPage
                    ? 'bg-[#6825C2] text-white shadow-sm'
                    : 'border border-[#E8E6E1] bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg border border-[#E8E6E1] bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* "Why a group is withheld" Card Section (Screenshots 3 & 4) */}
      <div className="bg-white border border-[#E8E6E1] rounded-2xl p-5 sm:p-6 space-y-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] font-sans">
        <h3 className="text-base sm:text-lg font-bold text-[#2B2B2B]">
          Why a group is withheld
        </h3>

        <div className="space-y-4">
          {withheldGroups.map((group) => (
            <div key={group.id} className="flex items-start gap-3 text-xs sm:text-sm">
              <div className="w-5 h-5 rounded-full bg-[#FFF1DD] text-[#B46B09] flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="font-bold text-[#2B2B2B]">{group.title}</span>
                <p className="text-xs text-[#8E8E8E] font-secondary leading-relaxed">
                  {group.withheldReason}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Purple Safeguard Banner */}
        <div className="bg-[#F0EAFB]/50 border border-[#E5DBF8] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs text-[#6825C2]">
          <div className="w-7 h-7 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0 mt-0.5">
            <Shield className="w-4 h-4" />
          </div>
          <div className="space-y-1 font-sans leading-relaxed">
            <p className="font-bold">
              Withholding protects anonymity it does not mean the product is broken. Every group above is withheld for a specific safeguard reason: below the 10-school minimum, one school too dominant (concentration risk), or a new survey version cohort still building.
            </p>
            <p className="text-[11px] text-[#6825C2]/90 font-secondary">
              SFWG administrators may see which schools qualify by name for administration, but the benchmark output sent to schools remains de-identified no individual school&apos;s results are ever exposed to another school.
            </p>
          </div>
        </div>
      </div>

      {/* View Qualifying Schools Modal */}
      {activeSchoolListGroup && (
        <div className="fixed inset-0 z-50 overflow-y-auto font-sans flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveSchoolListGroup(null)}
          />
          <div className="relative bg-white rounded-3xl border border-[#E8E6E1] shadow-2xl max-w-md w-full overflow-hidden z-10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFEDE8] pb-3">
              <div>
                <span className="text-xs font-semibold text-[#6825C2]">Qualifying Schools List</span>
                <h4 className="text-base font-bold text-[#2B2B2B]">{activeSchoolListGroup.title}</h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveSchoolListGroup(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#8E8E8E]">
              {activeSchoolListGroup.qualifyingSchools} participating schools qualify under this comparison group.
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar text-xs text-[#2B2B2B]">
              {Array.from({ length: activeSchoolListGroup.qualifyingSchools || 1 }).map((_, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E8E6E1] flex justify-between">
                  <span>School #{i + 1} ({activeSchoolListGroup.gradeLevel} Academy)</span>
                  <span className="text-[#276735] font-semibold">Active</span>
                </div>
              ))}
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveSchoolListGroup(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
