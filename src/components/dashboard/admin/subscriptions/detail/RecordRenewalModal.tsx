'use client';

import React, { useState } from 'react';
import { SubscriptionItem } from '../types';
import DateField from '@/components/ui/DateField';

interface RecordRenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionItem;
  onRecord: (newRenewalDate: string, note: string) => void;
}

export function RecordRenewalModal({
  isOpen,
  onClose,
  subscription,
  onRecord,
}: RecordRenewalModalProps) {
  const [renewalDate, setRenewalDate] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecord(renewalDate || '2026-07-01', note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-sans">
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 modal-backdrop animate-in fade-in duration-200 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Card - Exact Match to DIV-423 */}
      <div className="relative w-full max-w-md bg-[#FFFFFF] rounded-3xl shadow-2xl p-6 sm:p-7 border border-[#E8E6E1] z-10 animate-in zoom-in-95 fade-in duration-200">
        {/* Title */}
        <h2 className="text-[20px] font-bold text-[#1F1F1F] font-sans leading-tight">
          Record renewal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* 1. New renewal date with DatePickerCalendar */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-[#1F1F1F] font-sans block">
              New renewal date
            </label>
            <DateField
              value={renewalDate}
              onChange={(iso) => setRenewalDate(iso)}
              placeholder="-/-/-"
            />
          </div>

          {/* 2. Note */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-[#1F1F1F] font-sans block">
              Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Renewed for 2026–2027 term. Invoice sent."
              rows={3}
              className="w-full p-4 bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl text-[13px] sm:text-[14px] font-sans text-[#2B2B2B] placeholder:text-slate-600 focus:outline-none focus:ring-0 resize-none leading-relaxed min-h-[100px]"
            />
          </div>

          {/* 3. Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-[#F2F5F0] hover:bg-[#E5EAE2] text-[#4D6346] text-sm font-semibold rounded-full cursor-pointer transition-colors border border-[#D2DCD0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#4E6547] hover:bg-[#405439] text-white text-sm font-semibold rounded-full cursor-pointer transition-colors shadow-sm"
            >
              Record renewal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
