'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { BenchmarkRecord } from './types';

interface BenchmarksTableProps {
  benchmarks: BenchmarkRecord[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onManage: (item: BenchmarkRecord) => void;
  onViewCohort: (item: BenchmarkRecord) => void;
  onToggleStatus: (item: BenchmarkRecord) => void;
}

export function BenchmarksTable({
  benchmarks,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onManage,
  onViewCohort,
  onToggleStatus,
}: BenchmarksTableProps) {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = benchmarks.slice(startIndex, startIndex + pageSize);
  const startItem = totalCount === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + pageSize, totalCount);

  // Active Three-Dots Menu state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden flex flex-col w-full min-w-0 font-sans">
      {/* Table Scrollable Container */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[1020px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#EFEDE8]">
              <th className="text-left text-[12px] font-medium text-[#8E8E8E] font-sans py-4 px-5 sm:px-6 whitespace-nowrap min-w-[240px]">
                Benchmark
              </th>
              <th className="text-left text-[12px] font-medium text-[#8E8E8E] font-sans py-4 px-4 whitespace-nowrap min-w-[200px]">
                Comparison basis
              </th>
              <th className="text-left text-[12px] font-medium text-[#8E8E8E] font-sans py-4 px-4 whitespace-nowrap min-w-[120px]">
                Cohort
              </th>
              <th className="text-left text-[12px] font-medium text-[#8E8E8E] font-sans py-4 px-4 whitespace-nowrap min-w-[170px]">
                Label
              </th>
              <th className="text-left text-[12px] font-medium text-[#8E8E8E] font-sans py-4 px-4 whitespace-nowrap min-w-[120px]">
                Status
              </th>
              <th className="text-left text-[12px] font-medium text-[#8E8E8E] font-sans py-4 px-4 whitespace-nowrap min-w-[140px]">
                Effective
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
                  No benchmarks match the selected filters.
                </td>
              </tr>
            ) : (
              currentItems.map((item) => {
                const isMenuOpen = activeMenuId === item.id;

                return (
                  <tr
                    key={item.id}
                    className="border-b border-[#EFEDE8] hover:bg-[#FAF9F6]/60 transition-colors last:border-b-0"
                  >
                    {/* Benchmark Title & Subtitle */}
                    <td className="py-4 px-5 sm:px-6 align-middle whitespace-nowrap">
                      <div className="flex flex-col items-start">
                        <button
                          type="button"
                          onClick={() => onManage(item)}
                          className="text-[14px] font-bold text-[#2B2B2B] hover:text-[#6825C2] cursor-pointer text-left font-sans transition-colors"
                        >
                          {item.title}
                        </button>
                        <span className="text-[12px] text-[#8E8E8E] font-secondary mt-0.5">
                          {item.subtitle}
                        </span>
                      </div>
                    </td>

                    {/* Comparison Basis Pills */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                      <div className="flex flex-wrap items-center gap-1.5 max-w-[220px]">
                        {item.comparisonBasis.map((cb, idx) => (
                          <span
                            key={idx}
                            className="bg-[#EFECE6] text-[#6E6B65] text-[11px] font-semibold px-2.5 py-0.5 rounded-full font-sans"
                          >
                            {cb}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Cohort */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                      {!item.isBelowMinimum ? (
                        <div className="flex items-center gap-1">
                          <span className="text-[14px] font-bold text-[#276735] font-sans">
                            {item.schoolCount} schools
                          </span>
                          <span className="text-[#276735] font-bold">✓</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-start">
                          <span className="text-[14px] font-bold text-[#9C5B09] font-sans">
                            {item.schoolCount} schools
                          </span>
                          <span className="text-[11px] text-[#9C5B09] font-secondary">
                            below minimum
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Label Pill */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                      {item.label === 'Participating-school' ? (
                        <span className="bg-[#ECE6F8] text-[#6825C2] text-[11px] font-semibold px-2.5 py-1 rounded-full font-sans">
                          Participating-school
                        </span>
                      ) : (
                        <span className="bg-[#FFF2DC] text-[#B46B09] text-[11px] font-semibold px-2.5 py-1 rounded-full font-sans">
                          National pending approval
                        </span>
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                      {item.status === 'Active' && (
                        <span className="bg-[#E3F5E3] text-[#196319] text-[12px] font-semibold px-3 py-1 rounded-full font-sans">
                          Active
                        </span>
                      )}
                      {item.status === 'Below minimum' && (
                        <span className="bg-[#FFF1DD] text-[#B46B09] text-[12px] font-semibold px-3 py-1 rounded-full font-sans">
                          Below minimum
                        </span>
                      )}
                      {item.status === 'Draft' && (
                        <span className="bg-[#FFF1DD] text-[#B46B09] text-[12px] font-semibold px-3 py-1 rounded-full font-sans">
                          Draft
                        </span>
                      )}
                      {item.status === 'Disabled' && (
                        <span className="bg-[#EFECE6] text-[#6E6B65] text-[12px] font-semibold px-3 py-1 rounded-full font-sans">
                          Disabled
                        </span>
                      )}
                    </td>

                    {/* Effective Period */}
                    <td className="py-4 px-4 align-middle whitespace-nowrap">
                      <div className="flex flex-col items-start">
                        <span className="text-[13px] font-bold text-[#2B2B2B] font-sans">
                          {item.effectivePeriod}
                        </span>
                        <span className="text-[11px] text-[#8E8E8E] font-secondary mt-0.5">
                          {item.refreshedText} · {item.nextRefreshText}
                        </span>
                      </div>
                    </td>

                    {/* Actions (Manage + Three dots menu) */}
                    <td className="py-4 px-5 sm:px-6 align-middle text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2.5 relative" ref={isMenuOpen ? menuRef : undefined}>
                        <button
                          type="button"
                          onClick={() => onManage(item)}
                          className="text-[13px] font-bold text-[#6825C2] font-sans hover:underline cursor-pointer"
                        >
                          Manage
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveMenuId(isMenuOpen ? null : item.id)}
                          className="p-1 text-[#8E8E8E] hover:text-[#2B2B2B] rounded hover:bg-slate-100 transition-colors cursor-pointer"
                          aria-label="More options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Popover Menu */}
                        {isMenuOpen && (
                          <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-100">
                            <button
                              type="button"
                              onClick={() => {
                                onViewCohort(item);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3.5 py-2 text-xs font-semibold text-[#2B2B2B] hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                            >
                              <span>View cohort</span>
                            </button>
                            <div className="my-1 border-t border-[#EFEDE8]" />
                            {item.status === 'Disabled' || item.status === 'Draft' ? (
                              <button
                                type="button"
                                onClick={() => {
                                  onToggleStatus(item);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-[#16A34A] hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                              >
                                <span>Enable</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  onToggleStatus(item);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-[#D8201D] hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                              >
                                <span>Disable</span>
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
      <div className="flex flex-row justify-between items-center px-5 sm:px-6 py-4 border-t border-[#EFEDE8] bg-[#FFFFFF] w-full">
        <div className="text-[13px] font-normal text-[#8E8E8E] font-secondary shrink-0">
          Showing {startItem}–{endItem} of {totalCount}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="w-8 h-8 rounded-lg border border-[#E8E6E1] bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#6825C2] text-white shadow-sm'
                    : 'border border-[#E8E6E1] bg-white text-[#2B2B2B] hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="w-8 h-8 rounded-lg border border-[#E8E6E1] bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
