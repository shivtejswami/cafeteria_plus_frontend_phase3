'use client';

import React, { useState, useEffect } from 'react';
import { X, Info, AlertTriangle, CheckCircle2, Ban } from 'lucide-react';
import { BenchmarkRecord } from './types';

interface EnableDisableModalProps {
  item: BenchmarkRecord | null;
  mode: 'enable' | 'disable' | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: BenchmarkRecord, mode: 'enable' | 'disable') => void;
}

export function EnableDisableModal({
  item,
  mode,
  isOpen,
  onClose,
  onConfirm,
}: EnableDisableModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(false);
  }, [isOpen, item, mode]);

  if (!isOpen || !item || !mode) return null;

  const isEnable = mode === 'enable';

  const handleAction = () => {
    if (!isChecked) return;
    onConfirm(item, mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto font-sans flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div className="relative bg-white rounded-3xl border border-[#E8E6E1] shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 z-10 p-6 space-y-5">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {isEnable ? (
              <div className="w-10 h-10 rounded-full bg-[#E3F5E3] text-[#196319] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#FDEAEA] text-[#D8201D] flex items-center justify-center shrink-0">
                <Ban className="w-5 h-5" />
              </div>
            )}

            <div>
              <h3 className="text-lg font-bold text-[#2B2B2B]">
                {isEnable ? 'Enable this benchmark?' : 'Disable this benchmark?'}
              </h3>
              <p className="text-xs text-[#8E8E8E] font-secondary mt-0.5">{item.title}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Box 1: What Happens Info Card */}
        {isEnable ? (
          <div className="bg-[#E3F5E3]/60 border border-[#C6E9C6] rounded-2xl p-4 space-y-2 text-xs text-[#196319]">
            <div className="flex items-center gap-2 font-bold text-[#196319]">
              <Info className="w-4 h-4" />
              <span>What happens when enabled</span>
            </div>
            <ul className="space-y-1 pl-1 text-[11px] sm:text-xs text-[#276735] leading-relaxed">
              <li>— Schools will see this benchmark in their comparisons again.</li>
              <li>— New reports will include this benchmark dataset.</li>
              <li>— This action is recorded in the audit log.</li>
            </ul>
          </div>
        ) : (
          <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-4 space-y-2 text-xs text-[#2B2B2B]">
            <div className="flex items-center gap-2 font-bold text-[#2B2B2B]">
              <Info className="w-4 h-4 text-[#8E8E8E]" />
              <span>What happens when disabled</span>
            </div>
            <ul className="space-y-1 pl-1 text-[11px] sm:text-xs text-[#8E8E8E] font-secondary leading-relaxed">
              <li>— Schools will no longer see this benchmark in their comparisons.</li>
              <li>— Existing reports that reference this benchmark are unaffected.</li>
              <li>— The benchmark dataset is preserved and can be re-enabled at any time.</li>
              <li>— This action is recorded in the audit log.</li>
            </ul>
          </div>
        )}

        {/* Box 2: Warning Callout (Disable Mode Only) */}
        {!isEnable && (
          <div className="bg-[#FDEAEA] border border-[#F9C5C5] rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-[#D8201D]">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="leading-snug">
              Disabling a benchmark may affect school-facing dashboards. Make sure stakeholders are aware before proceeding.
            </span>
          </div>
        )}

        {/* Checkbox Confirmation */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id="modalConfirmCheck"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className={`mt-0.5 w-4 h-4 rounded border-[#E8E6E1] focus:ring-0 cursor-pointer ${
              isEnable ? 'text-[#196319]' : 'text-[#D8201D]'
            }`}
          />
          <label htmlFor="modalConfirmCheck" className="text-xs font-semibold text-[#2B2B2B] cursor-pointer">
            {isEnable
              ? 'I understand this will enable the benchmark dataset.'
              : 'I understand this will disable the benchmark dataset.'}
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-[#3A4A32] bg-[#F4F7F2] border border-[#DDE6D9] hover:bg-[#E7ECE4] rounded-full transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {isEnable ? (
            <button
              type="button"
              disabled={!isChecked}
              onClick={handleAction}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold text-white rounded-full transition-all ${
                isChecked
                  ? 'bg-[#1D6B1D] hover:bg-[#155215] cursor-pointer shadow-xs'
                  : 'bg-[#85AD82] cursor-not-allowed opacity-70'
              }`}
            >
              Enable benchmark
            </button>
          ) : (
            <button
              type="button"
              disabled={!isChecked}
              onClick={handleAction}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold text-white rounded-full transition-all ${
                isChecked
                  ? 'bg-[#D8201D] hover:bg-[#B81917] cursor-pointer shadow-xs'
                  : 'bg-[#F99B9B] cursor-not-allowed opacity-70'
              }`}
            >
              Disable benchmark
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
