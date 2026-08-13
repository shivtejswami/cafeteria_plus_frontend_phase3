'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  RotateCw,
  Settings,
  ChevronDown,
  Clock,
  List,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MoreVertical,
  Shield,
  Check,
  X,
  Info,
} from 'lucide-react';
import { BENCHMARK_SCHEDULES_DATA } from './mockData';
import {
  BenchmarkScheduleRecord,
  ScheduleFrequency,
  ScheduleDay,
} from './types';

interface ToastState {
  id: number;
  type: 'success' | 'info';
  message: string;
  isExiting?: boolean;
}

export function RefreshSchedulePage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<BenchmarkScheduleRecord[]>(
    BENCHMARK_SCHEDULES_DATA
  );

  // Global Schedule Form State
  const [globalFrequency, setGlobalFrequency] = useState<ScheduleFrequency>('Weekly');
  const [globalDay, setGlobalDay] = useState<ScheduleDay>('Monday');
  const [globalTime, setGlobalTime] = useState('02:00');
  const [globalTimezone, setGlobalTimezone] = useState('America/Chicago');

  // Dropdown States for Global Schedule
  const [isFreqOpen, setIsFreqOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const freqRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);

  // Three dots popover state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Modal States
  const [runNowItem, setRunNowItem] = useState<BenchmarkScheduleRecord | null>(null);
  const [editCadenceItem, setEditCadenceItem] = useState<BenchmarkScheduleRecord | null>(null);
  const [selectedOverrideFreq, setSelectedOverrideFreq] = useState<ScheduleFrequency>('Monthly');

  // Toast state
  const [toast, setToast] = useState<ToastState | null>(null);

  const dismissToast = () => {
    if (!toast) return;
    setToast((prev) => (prev ? { ...prev, isExiting: true } : null));
    setTimeout(() => setToast(null), 300);
  };

  const showToast = (type: 'success' | 'info', message: string) => {
    const id = Date.now();
    setToast({ id, type, message, isExiting: false });
  };

  useEffect(() => {
    if (!toast || toast.isExiting) return;
    const timer = setTimeout(() => dismissToast(), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (freqRef.current && !freqRef.current.contains(e.target as Node)) setIsFreqOpen(false);
      if (dayRef.current && !dayRef.current.contains(e.target as Node)) setIsDayOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setActiveMenuId(null);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveGlobalSchedule = () => {
    showToast('success', 'Global refresh schedule updated successfully.');
  };

  const handleConfirmRunNow = () => {
    if (!runNowItem) return;
    showToast(
      'success',
      `Manual refresh queued for "${runNowItem.title}". Results will update shortly.`
    );
    setRunNowItem(null);
  };

  const handleSaveOverride = () => {
    if (!editCadenceItem) return;
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === editCadenceItem.id
          ? {
              ...s,
              cadence: selectedOverrideFreq,
              isOverride: true,
              overrideFrequency: selectedOverrideFreq,
            }
          : s
      )
    );
    showToast(
      'success',
      `Cadence override for "${editCadenceItem.title}" set to ${selectedOverrideFreq}.`
    );
    setEditCadenceItem(null);
  };

  const handleResetToGlobal = () => {
    if (!editCadenceItem) return;
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === editCadenceItem.id
          ? {
              ...s,
              cadence: 'Weekly (global)',
              isOverride: false,
              overrideFrequency: undefined,
            }
          : s
      )
    );
    showToast(
      'info',
      `Cadence for "${editCadenceItem.title}" reset to global schedule (Weekly).`
    );
    setEditCadenceItem(null);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto w-full pb-16 font-sans min-w-0">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[70] bg-[#FFFFFF] border border-[#E8E6E1] shadow-2xl rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm text-[#2B2B2B] font-sans max-w-md transition-all duration-300 ease-out transform ${
            toast.isExiting
              ? 'opacity-0 translate-y-4 scale-95 pointer-events-none'
              : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && (
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="w-4 h-4 text-[#6D28D9] shrink-0" />
            )}
            <span className="leading-snug text-[#2B2B2B]">{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={dismissToast}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer rounded shrink-0 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}


      {/* Top Banner Notice (Rotate Purple Circle) */}
      <div className="bg-white border border-[#E8E6E1] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex items-start gap-3 sm:gap-4">
        <div className="w-8 h-8 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0 mt-0.5">
          <RotateCw className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm font-sans min-w-0">
          <p className="font-bold text-[#2B2B2B] leading-snug">
            Benchmarks recompute automatically on a set schedule. Each benchmark shows schools when it was last refreshed, so comparisons are always dated.
          </p>
          <p className="text-[11px] sm:text-xs text-[#8E8E8E] font-secondary leading-normal">
            Refreshing recomputes from de-identified aggregates and re-checks the minimum-cohort and weighting safeguards. A benchmark can move between Available and Withheld as participation changes.
          </p>
        </div>
      </div>

      {/* Global schedule Card (Screenshot 1 & 5) */}
      <div className="bg-white border border-[#E8E6E1] rounded-2xl p-5 sm:p-8 space-y-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] font-sans">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#2B2B2B]">
              Global schedule
            </h3>
            <p className="text-xs text-[#8E8E8E] font-secondary">
              Applies to all benchmarks unless a benchmark has its own override.
            </p>
          </div>
        </div>

        {/* Global Schedule Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Frequency */}
          <div className="space-y-1 relative" ref={freqRef}>
            <label className="block text-xs font-semibold text-[#2B2B2B]">Frequency</label>
            <button
              type="button"
              onClick={() => setIsFreqOpen(!isFreqOpen)}
              className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs sm:text-sm text-[#2B2B2B] flex items-center justify-between cursor-pointer"
            >
              <span>{globalFrequency}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            {isFreqOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-full bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {(['Weekly', 'Fortnightly', 'Monthly', 'Quarterly'] as ScheduleFrequency[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setGlobalFrequency(f);
                      setIsFreqOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between cursor-pointer ${
                      globalFrequency === f ? 'bg-[#F0EAFB] text-[#6825C2] font-semibold' : 'text-[#2B2B2B] hover:bg-slate-50'
                    }`}
                  >
                    <span>{f}</span>
                    {globalFrequency === f && <Check className="w-3.5 h-3.5 text-[#6825C2]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Day */}
          <div className="space-y-1 relative" ref={dayRef}>
            <label className="block text-xs font-semibold text-[#2B2B2B]">Day</label>
            <button
              type="button"
              onClick={() => setIsDayOpen(!isDayOpen)}
              className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs sm:text-sm text-[#2B2B2B] flex items-center justify-between cursor-pointer"
            >
              <span>{globalDay}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            {isDayOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-full bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as ScheduleDay[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setGlobalDay(d);
                      setIsDayOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between cursor-pointer ${
                      globalDay === d ? 'bg-[#F0EAFB] text-[#6825C2] font-semibold' : 'text-[#2B2B2B] hover:bg-slate-50'
                    }`}
                  >
                    <span>{d}</span>
                    {globalDay === d && <Check className="w-3.5 h-3.5 text-[#6825C2]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#2B2B2B]">Time</label>
            <input
              type="text"
              value={globalTime}
              onChange={(e) => setGlobalTime(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs sm:text-sm text-[#2B2B2B] focus:outline-none focus:border-[#6825C2]"
            />
          </div>

          {/* Timezone */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#2B2B2B]">Timezone</label>
            <input
              type="text"
              value={globalTimezone}
              onChange={(e) => setGlobalTimezone(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs sm:text-sm text-[#2B2B2B] focus:outline-none focus:border-[#6825C2]"
            />
          </div>
        </div>

        {/* Next Scheduled Refresh Banner */}
        <div className="bg-[#F0EAFB]/60 border border-[#E5DBF8] rounded-2xl p-4 flex items-center gap-3 text-xs sm:text-sm text-[#6825C2]">
          <Clock className="w-4 h-4 shrink-0" />
          <span className="font-semibold">
            Next scheduled refresh: 27 Jul 2026, {globalTime}
          </span>
        </div>

        {/* Card Action Buttons (Responsive Grid/Row) */}
        <div className="grid grid-cols-2 sm:flex sm:items-center justify-end gap-2.5 sm:gap-3 pt-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => router.push('/admin/benchmarks')}
            className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#3A4A32] bg-[#F4F7F2] border border-[#DDE6D9] hover:bg-[#E7ECE4] rounded-full transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveGlobalSchedule}
            className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#54664B] hover:bg-[#43523C] rounded-full shadow-xs transition-colors cursor-pointer text-center"
          >
            Save schedule
          </button>
        </div>
      </div>

      {/* Per-benchmark schedule Card & Table (Screenshot 2) */}
      <div className="bg-white border border-[#E8E6E1] rounded-2xl p-5 sm:p-8 space-y-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] font-sans">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0">
            <List className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#2B2B2B]">
              Per-benchmark schedule
            </h3>
            <p className="text-xs text-[#8E8E8E] font-secondary">
              Override individual benchmark cadences where needed.
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="border border-[#E8E6E1] rounded-2xl overflow-hidden">
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#EFEDE8]">
                  <th className="text-left text-[12px] font-medium text-[#8E8E8E] py-3.5 px-5 whitespace-nowrap min-w-[240px]">
                    Benchmark
                  </th>
                  <th className="text-left text-[12px] font-medium text-[#8E8E8E] py-3.5 px-4 whitespace-nowrap min-w-[150px]">
                    Cadence
                  </th>
                  <th className="text-left text-[12px] font-medium text-[#8E8E8E] py-3.5 px-4 whitespace-nowrap min-w-[140px]">
                    Last refreshed
                  </th>
                  <th className="text-left text-[12px] font-medium text-[#8E8E8E] py-3.5 px-4 whitespace-nowrap min-w-[140px]">
                    Next refresh
                  </th>
                  <th className="text-left text-[12px] font-medium text-[#8E8E8E] py-3.5 px-4 whitespace-nowrap min-w-[160px]">
                    Last run
                  </th>
                  <th className="text-right text-[12px] font-medium text-[#8E8E8E] py-3.5 px-5 whitespace-nowrap min-w-[140px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((item) => {
                  const isMenuOpen = activeMenuId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-[#EFEDE8] hover:bg-[#FAF9F6]/60 transition-colors last:border-b-0"
                    >
                      {/* Benchmark Title & Subtitle */}
                      <td className="py-4 px-5 align-middle whitespace-nowrap">
                        <div className="flex flex-col items-start">
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/benchmarks/${item.id}`)}
                            className="text-[14px] font-bold text-[#2B2B2B] hover:text-[#6825C2] cursor-pointer text-left transition-colors"
                          >
                            {item.title}
                          </button>
                          <span className="text-[11px] text-[#8E8E8E] font-secondary mt-0.5">
                            {item.subtitle}
                          </span>
                        </div>
                      </td>

                      {/* Cadence */}
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-[#2B2B2B]">
                            {item.cadence}
                          </span>
                          {item.isOverride && (
                            <span className="bg-[#ECE6F8] text-[#6825C2] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              Override
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Last Refreshed */}
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-bold text-[#2B2B2B]">
                            {item.lastRefreshed}
                          </span>
                          <span className="text-[11px] text-[#8E8E8E] font-secondary">
                            {item.lastRefreshedAgo}
                          </span>
                        </div>
                      </td>

                      {/* Next Refresh */}
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-bold text-[#2B2B2B]">
                            {item.nextRefresh}
                          </span>
                          <span className="text-[11px] text-[#8E8E8E] font-secondary">
                            {item.nextRefreshShort}
                          </span>
                        </div>
                      </td>

                      {/* Last Run Status Pill */}
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        {item.lastRunStatus === 'Success' && (
                          <span className="bg-[#E3F5E3] text-[#196319] text-[11px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                            <span>✓</span> Success
                          </span>
                        )}
                        {item.lastRunStatus === 'Skipped below minimum' && (
                          <span className="bg-[#FFF1DD] text-[#B46B09] text-[11px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                            <span>⏭</span> Skipped below minimum
                          </span>
                        )}
                        {item.lastRunStatus === 'Failed' && (
                          <span className="bg-[#FDEAEA] text-[#D8201D] text-[11px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                            <span>✕</span> Failed
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 align-middle text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2 relative" ref={isMenuOpen ? menuRef : undefined}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditCadenceItem(item);
                              setSelectedOverrideFreq(
                                item.overrideFrequency || 'Monthly'
                              );
                            }}
                            className="text-xs font-bold text-[#6825C2] hover:underline cursor-pointer"
                          >
                            Edit Cadence
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveMenuId(isMenuOpen ? null : item.id)}
                            className="p-1 text-[#8E8E8E] hover:text-[#2B2B2B] rounded hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Popover Menu (Screenshot 4) */}
                          {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setRunNowItem(item);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-[#2B2B2B] hover:bg-slate-50 text-left cursor-pointer"
                              >
                                Run now
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  router.push(`/admin/benchmarks/${item.id}`);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-[#6825C2] hover:bg-slate-50 text-left cursor-pointer border-t border-[#EFEDE8]"
                              >
                                View benchmark
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  showToast('info', `Viewing last-run activity log for "${item.title}".`);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-[#8E8E8E] hover:bg-slate-50 text-left cursor-pointer"
                              >
                                View last-run log
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3.5 border-t border-[#EFEDE8] bg-white text-xs text-[#8E8E8E] font-secondary">
            Showing 1–{schedules.length} of {schedules.length}
          </div>
        </div>
      </div>

      {/* Bottom Safeguard Notice Banner (Screenshot 3) */}
      <div className="bg-white border border-[#E8E6E1] rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex items-start gap-3.5 text-xs sm:text-sm font-sans">
        <div className="w-7 h-7 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0 mt-0.5">
          <Shield className="w-4 h-4" />
        </div>
        <div className="space-y-1.5 min-w-0">
          <p className="font-bold text-[#2B2B2B]">
            Each refresh re-evaluates the minimum-cohort and concentration safeguards.
          </p>
          <p className="text-xs text-[#8E8E8E] font-secondary leading-relaxed">
            A benchmark can move between Available and Withheld between refreshes as participation changes. Schools always see the last-refreshed date so they know how current a comparison is.
          </p>
          <Link
            href="/admin/benchmarks/cohort/bench-1"
            className="text-xs font-bold text-[#6825C2] hover:underline block pt-0.5"
          >
            View cohort status
          </Link>
        </div>
      </div>

      {/* Modal 1: Run now? Modal (Screenshot 4) */}
      {runNowItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto font-sans flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setRunNowItem(null)}
          />
          <div className="relative bg-white rounded-3xl border border-[#E8E6E1] shadow-2xl max-w-md w-full overflow-hidden z-10 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFF1DD] text-[#B46B09] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#2B2B2B]">Run now?</h3>
                <p className="text-xs text-[#8E8E8E] font-secondary leading-relaxed">
                  This will recompute <strong className="font-semibold text-[#2B2B2B]">{runNowItem.title}</strong> outside its scheduled cadence. The primary model is scheduled this is an occasional manual override.
                </p>
                <span className="text-[11px] text-[#8E8E8E] block pt-1">
                  Last refreshed: {runNowItem.lastRefreshed}
                </span>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#EFEDE8]">
              <button
                type="button"
                onClick={() => setRunNowItem(null)}
                className="px-5 py-2 text-xs sm:text-sm font-semibold text-[#3A4A32] bg-[#F4F7F2] border border-[#DDE6D9] hover:bg-[#E7ECE4] rounded-full transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRunNow}
                className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#54664B] hover:bg-[#43523C] rounded-full shadow-xs transition-colors cursor-pointer"
              >
                Run now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Cadence Override Modal (Screenshot 4) */}
      {editCadenceItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto font-sans flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setEditCadenceItem(null)}
          />
          <div className="relative bg-white rounded-3xl border border-[#E8E6E1] shadow-2xl max-w-md w-full overflow-hidden z-10 p-6 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#2B2B2B]">Edit cadence override</h3>
                <p className="text-xs text-[#8E8E8E] font-secondary leading-relaxed">
                  Set a custom refresh cadence for <strong className="font-semibold text-[#2B2B2B]">{editCadenceItem.title}</strong>. This overrides the global schedule.
                </p>
              </div>
            </div>

            {/* Pill Choices Group */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#2B2B2B]">Cadence</label>
              <div className="flex flex-wrap items-center gap-2">
                {(['Weekly', 'Fortnightly', 'Monthly', 'Quarterly'] as ScheduleFrequency[]).map((f) => {
                  const isSel = selectedOverrideFreq === f;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedOverrideFreq(f)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#E3F5E3] text-[#196319] border border-[#C6E9C6]'
                          : 'bg-[#F4F7F2] text-[#3A4A32] border border-[#DDE6D9] hover:bg-[#E7ECE4]'
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-between gap-3 border-t border-[#EFEDE8]">
              <button
                type="button"
                onClick={handleResetToGlobal}
                className="px-4 py-2 text-xs font-semibold text-[#3A4A32] bg-[#F4F7F2] border border-[#DDE6D9] hover:bg-[#E7ECE4] rounded-full transition-colors cursor-pointer"
              >
                Reset to global
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditCadenceItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveOverride}
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#54664B] hover:bg-[#43523C] rounded-full shadow-xs transition-colors cursor-pointer"
                >
                  Save override
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
