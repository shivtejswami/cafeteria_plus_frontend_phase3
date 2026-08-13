'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Clock } from 'lucide-react';
import { SubscriptionItem, SubscriptionStatus } from './types';
import DateField from '@/components/ui/DateField';

interface ManageSubscriptionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionItem | null;
  onSave: (updated: Partial<SubscriptionItem>) => void;
}

export function ManageSubscriptionDrawer({
  isOpen,
  onClose,
  subscription,
  onSave,
}: ManageSubscriptionDrawerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<SubscriptionStatus>('Active');
  const [termStart, setTermStart] = useState('');
  const [termEnd, setTermEnd] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen && subscription) {
      setIsVisible(true);
      setSelectedStatus(subscription.status);
      setTermStart(subscription.termStart);
      setTermEnd(subscription.termEnd);
      setRenewalDate(subscription.renewalDate);
      setNotes(subscription.notes || '');
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, subscription]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !subscription) return null;

  const handleSave = () => {
    onSave({
      id: subscription.id,
      status: selectedStatus,
      termStart,
      termEnd,
      renewalDate,
      notes,
    });
    onClose();
  };

  let statusBg = 'bg-[#E3F5E3]';
  let statusText = 'text-[#1D6B1D]';
  let dotColor = 'bg-[#1D6B1D]';

  if (subscription.status === 'Deactivated') {
    statusBg = 'bg-[#FDEAEA]';
    statusText = 'text-[#D8201D]';
    dotColor = 'bg-[#D8201D]';
  } else if (subscription.status === 'Read-only') {
    statusBg = 'bg-[#F1EFEA]';
    statusText = 'text-[#6D6D6D]';
    dotColor = 'bg-[#6D6D6D]';
  } else if (subscription.status === 'In grace' || subscription.status === 'Expiring') {
    statusBg = 'bg-[#FFF1DD]';
    statusText = 'text-[#D97706]';
    dotColor = 'bg-[#D97706]';
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 modal-backdrop transition-opacity duration-300 cursor-pointer ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Container: Fullscreen on mobile, right drawer on sm+ */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-auto max-w-full flex pl-0 sm:pl-10">
        <div
          className={`w-full sm:w-[540px] md:w-[620px] lg:w-[680px] bg-[#FFFFFF] shadow-2xl transition-transform duration-300 ease-out transform ${
            isVisible ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col h-full overflow-hidden sm:border-l border-[#E8E6E1]`}
        >
          {/* Fixed Header (Intact during scroll) */}
          <div className="p-4 sm:p-6 md:p-8 pb-4 sm:pb-4 md:pb-4 border-b border-[#EFEDE8] flex justify-between items-start shrink-0 bg-white z-10">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[20px] sm:text-[24px] font-bold text-[#2B2B2B] font-sans leading-tight">
                  {subscription.customer}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold font-sans ${statusBg} ${statusText}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                  <span>{subscription.status}</span>
                </span>
              </div>
              <p className="text-[12px] sm:text-[13px] text-slate-500 font-secondary mt-1">
                Manage subscription details, term agreements, and billing status
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 -mr-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer rounded-lg hover:bg-slate-100"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 md:p-8 space-y-3.5 sm:space-y-4 custom-scrollbar">
            {/* Card 1: Account Overview */}
            <div className="bg-[#FAF9F6] rounded-2xl border border-[#E8E6E1] p-4 sm:p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] space-y-3">
              <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans block">
                Account overview
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-[#9A9A9A] font-sans block">Customer</span>
                  <span className="text-[13px] sm:text-[14px] font-bold text-[#2B2B2B]">
                    {subscription.customer}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#9A9A9A] font-sans block">Type</span>
                  <span className="text-[13px] sm:text-[14px] font-bold text-[#2B2B2B]">
                    {subscription.type}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#9A9A9A] font-sans block">Schools covered</span>
                  <span className="text-[13px] sm:text-[14px] font-bold text-[#2B2B2B]">
                    {subscription.schoolCount} schools
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#9A9A9A] font-sans block">Billing reference</span>
                  <span className="text-[13px] sm:text-[14px] font-mono font-medium text-[#2B2B2B]">
                    {subscription.billingRef || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Term and Renewal Dates with DatePickerCalendar */}
            <div className="bg-[#FAF9F6] rounded-2xl border border-[#E8E6E1] p-4 sm:p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] space-y-3">
              <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans block">
                Term &amp; Renewal Schedule
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#6D6D6D]">Term start</label>
                  <DateField
                    value={termStart}
                    onChange={(iso) => setTermStart(iso)}
                    placeholder="YYYY-MM-DD"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#6D6D6D]">Term end</label>
                  <DateField
                    value={termEnd}
                    onChange={(iso) => setTermEnd(iso)}
                    placeholder="YYYY-MM-DD"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#6D6D6D]">Renewal date</label>
                  <DateField
                    value={renewalDate}
                    onChange={(iso) => setRenewalDate(iso)}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>

              {subscription.graceEndDate && (
                <div className="p-3 bg-[#FFF9F0] border border-[#F0C070] rounded-xl flex items-center gap-2 text-xs text-[#8A4B04]">
                  <Clock className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>Grace period active until {subscription.graceEndDate}</span>
                </div>
              )}
            </div>

            {/* Card 3: School Coverage Details */}
            <div className="bg-[#FAF9F6] rounded-2xl border border-[#E8E6E1] p-4 sm:p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans block">
                  Schools under license
                </span>
                <span className="text-xs font-semibold text-[#6D28D9]">
                  {subscription.schoolCount} Active
                </span>
              </div>
              <p className="text-[12px] text-[#6D6D6D] font-secondary mt-2">
                All assigned cafeteria survey modules and student reporting dashboards are currently synchronized with this license agreement.
              </p>
            </div>

            {/* Card 4: Change Status & Notes */}
            <div className="bg-[#FAF9F6] rounded-2xl border border-[#E8E6E1] p-4 sm:p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] space-y-3">
              <span className="text-[11px] sm:text-[12px] font-semibold text-[#9A9A9A] font-sans block">
                Update subscription status
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['Active', 'Expiring', 'In grace', 'Read-only', 'Deactivated'] as SubscriptionStatus[]).map(
                  (st) => {
                    const isCurrent = selectedStatus === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedStatus(st)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#6D28D9] text-white shadow-sm'
                            : 'bg-white border border-[#E8E6E1] text-[#2B2B2B] hover:bg-slate-100'
                        }`}
                      >
                        {isCurrent && <Check className="w-3.5 h-3.5" />}
                        <span>{st}</span>
                      </button>
                    );
                  }
                )}
              </div>

              <div className="pt-2">
                <label className="text-[12px] font-bold text-[#2B2B2B] font-sans block mb-1">
                  Administrative notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this subscription agreement..."
                  rows={2}
                  className="w-full p-3 bg-white border border-[#E8E6E1] rounded-xl text-xs sm:text-sm text-[#2B2B2B] placeholder:text-slate-400 focus:outline-none focus:ring-0 resize-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* Fixed Footer Actions */}
          <div className="p-4 sm:p-6 md:p-8 pt-3 sm:pt-4 border-t border-[#EFEDE8] flex items-center justify-end gap-3 shrink-0 bg-white z-10 w-full">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-[#F1F5F0] hover:bg-[#E5EAE2] text-[#3A4A32] text-xs sm:text-sm font-semibold rounded-full transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs sm:text-sm font-semibold rounded-full transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" strokeWidth={2.5} />
              <span>Save changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
