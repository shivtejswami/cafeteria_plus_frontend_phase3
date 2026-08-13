'use client';

import { useState } from 'react';

import DateField from '@/components/ui/DateField';

interface ExtendClosingDateModalProps {
  open: boolean;
  currentCloseDate: string;
  onConfirm: (newDate: string, newTime: string) => void;
  onCancel: () => void;
}

export default function ExtendClosingDateModal({
  open,
  currentCloseDate,
  onConfirm,
  onCancel,
}: ExtendClosingDateModalProps) {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('15:00');

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm(newDate, newTime);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-[460px] w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain border border-[#E8E6E1] shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Extend closing date"
      >
        <h3 className="text-lg sm:text-xl font-bold text-[#2B2B2B]">Extend closing date</h3>
        <p className="text-[13px] text-[#6D6D6D]">
          Current close: <span className="font-semibold text-[#2B2B2B]">{currentCloseDate}</span>
        </p>

        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-[#9A9A9A] uppercase tracking-wider mb-1.5">
              New close date
            </label>
            <DateField
              value={newDate}
              onChange={setNewDate}
              aria-label="New close date"
              className="w-full h-11 px-4 rounded-2xl flex items-center justify-between gap-2 text-base sm:text-[14px] text-left outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#586D4D] focus-visible:ring-offset-1 bg-[#FAF9F6] border border-[#E8E6E1]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#9A9A9A] uppercase tracking-wider mb-1.5">
              New close time
            </label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full h-11 px-4 rounded-2xl text-base sm:text-[14px] outline-none focus:outline-none focus:ring-0 bg-[#FAF9F6] border border-[#E8E6E1] text-[#2B2B2B]"
            />
          </div>
        </div>

        <div className="rounded-2xl p-3.5 flex items-start gap-2.5 bg-[#F2F5F0] border border-[#D6E0D2]">
          <span className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-[#586D4D]">
            <i className="ri-information-line"></i>
          </span>
          <p className="text-[13px] leading-relaxed text-[#4A4A4A]">
            Allowed while the survey is still collecting. Once it closes and analysis starts, you&apos;ll need a reopen request.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 pt-2">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#F4F6F2] border border-[#E8E6E1] text-[#586D4D] hover:bg-[#eaf0e7] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!newDate}
            className="w-full sm:w-auto rounded-full h-11 px-6 text-[14px] font-semibold whitespace-nowrap bg-[#586D4D] text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            Save new date
          </button>
        </div>
      </div>
    </div>
  );
}