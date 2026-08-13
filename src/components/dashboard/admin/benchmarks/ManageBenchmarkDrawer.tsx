'use client';

import React from 'react';
import { X, Building2, Calendar, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { BenchmarkRecord } from './types';

interface ManageBenchmarkDrawerProps {
  item: BenchmarkRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ManageBenchmarkDrawer({
  item,
  isOpen,
  onClose,
}: ManageBenchmarkDrawerProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#E8E6E1] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-[#EFEDE8] flex items-center justify-between bg-[#FAF9F6]">
            <div>
              <span className="text-xs font-semibold text-[#6D28D9] uppercase tracking-wider">
                Benchmark Cohort Details
              </span>
              <h3 className="text-xl font-bold text-[#2B2B2B] mt-0.5">{item.title}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[#2B2B2B]">
            {/* Quick Summary Card */}
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E6E1] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-[#9A9A9A]">Cohort Size</span>
                <span className={`font-bold ${item.isBelowMinimum ? 'text-[#D97706]' : 'text-[#1D6B1D]'}`}>
                  {item.schoolCount} schools {item.isBelowMinimum ? '(below minimum)' : '✓'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-[#9A9A9A]">Status</span>
                <span className="font-semibold text-[#6D28D9]">{item.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-[#9A9A9A]">Label</span>
                <span className="font-semibold text-[#2B2B2B]">{item.label}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-[#9A9A9A]">Effective Period</span>
                <span className="font-semibold text-[#2B2B2B]">{item.effectivePeriod}</span>
              </div>
            </div>

            {/* Comparison Basis List */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#9A9A9A] uppercase tracking-wider">
                Comparison Basis
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {item.comparisonBasis.map((cb, idx) => (
                  <span
                    key={idx}
                    className="bg-[#F1EFEA] text-[#6D6D6D] text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {cb}
                  </span>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div>
                  <div className="text-xs font-medium text-[#9A9A9A]">Refresh Schedule</div>
                  <div className="text-sm font-semibold text-[#2B2B2B] mt-0.5">
                    {item.refreshedText} · {item.nextRefreshText}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div>
                  <div className="text-xs font-medium text-[#9A9A9A]">Target Grade Level</div>
                  <div className="text-sm font-semibold text-[#2B2B2B] mt-0.5">
                    {item.gradeLevel}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div>
                  <div className="text-xs font-medium text-[#9A9A9A]">Dataset Description</div>
                  <div className="text-xs text-slate-600 mt-1 bg-slate-50 p-3 rounded-lg border border-[#E8E6E1]">
                    {item.subtitle}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#EFEDE8] bg-[#FAF9F6] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 border border-[#E8E6E1] bg-white rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
