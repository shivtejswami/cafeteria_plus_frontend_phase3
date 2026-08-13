'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { SubscriptionItem, SubscriptionStatus } from '../types';
import DateField from '@/components/ui/DateField';

interface SubscriptionDetailsFormProps {
  subscription: SubscriptionItem;
  formData: {
    status: SubscriptionStatus;
    termStart: string;
    termEnd: string;
    renewalDate: string;
    contactName: string;
    contactEmail: string;
    billingRef: string;
    notes: string;
  };
  onChange: (field: string, value: string) => void;
}

const STATUS_OPTIONS: SubscriptionStatus[] = [
  'Active',
  'Expiring',
  'In grace',
  'Read-only',
  'Deactivated',
];

export function SubscriptionDetailsForm({
  subscription,
  formData,
  onChange,
}: SubscriptionDetailsFormProps) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl border border-[#E8E6E1] p-4 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] space-y-4 font-sans min-w-0 w-full">
      <h2 className="text-[16px] sm:text-[17px] font-bold text-[#1F1F1F] font-sans leading-tight">
        Subscription details
      </h2>

      {/* Row 1: Status, Start date, End date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 w-full">
        {/* Custom Status Dropdown */}
        <div className="space-y-1.5 min-w-0" ref={statusRef}>
          <label className="text-[12px] font-bold text-[#1F1F1F] font-sans block">
            Status
          </label>
          <div className="relative w-full">
            <button
              type="button"
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="w-full flex items-center justify-between px-3.5 sm:px-4 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl text-xs sm:text-sm font-sans text-[#2B2B2B] focus:outline-none focus:ring-0 cursor-pointer select-none text-left min-w-0"
            >
              <span className="font-semibold text-[#1F1F1F] truncate">{formData.status}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#1F1F1F] opacity-70 shrink-0 ml-2 transition-transform duration-200 ${
                  isStatusOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isStatusOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#FFFFFF] border border-[#E8E6E1] rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden font-sans">
                {STATUS_OPTIONS.map((st) => {
                  const isSelected = formData.status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onChange('status', st);
                        setIsStatusOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-xs sm:text-sm text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#F5F0FA] text-[#6D28D9] font-bold'
                          : 'text-[#2B2B2B] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <span>{st}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#6D28D9]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Start date with DateField Calendar */}
        <div className="space-y-1.5 min-w-0">
          <label className="text-[12px] font-bold text-[#1F1F1F] font-sans block">
            Start date
          </label>
          <DateField
            value={formData.termStart}
            onChange={(iso) => onChange('termStart', iso)}
            placeholder="YYYY-MM-DD"
          />
        </div>

        {/* End date with DateField Calendar */}
        <div className="space-y-1.5 min-w-0">
          <label className="text-[12px] font-bold text-[#1F1F1F] font-sans block">
            End date
          </label>
          <DateField
            value={formData.termEnd}
            onChange={(iso) => onChange('termEnd', iso)}
            placeholder="YYYY-MM-DD"
          />
        </div>
      </div>

      {/* Row 2: Renewal date, Billing contact name, Billing contact email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 w-full">
        {/* Renewal date with DateField Calendar */}
        <div className="space-y-1.5 min-w-0">
          <label className="text-[12px] font-bold text-[#1F1F1F] font-sans block">
            Renewal date
          </label>
          <DateField
            value={formData.renewalDate}
            onChange={(iso) => onChange('renewalDate', iso)}
            placeholder="YYYY-MM-DD"
          />
        </div>

        {/* Billing contact name */}
        <div className="space-y-1.5 min-w-0">
          <label className="text-[12px] font-bold text-[#1F1F1F] font-sans block">
            Billing contact name
          </label>
          <input
            type="text"
            value={formData.contactName}
            onChange={(e) => onChange('contactName', e.target.value)}
            placeholder="Contact name"
            className="w-full px-3.5 sm:px-4 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl text-xs sm:text-sm font-sans text-[#2B2B2B] placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
        </div>

        {/* Billing contact email */}
        <div className="space-y-1.5 min-w-0">
          <label className="text-[12px] font-bold text-[#1F1F1F] font-sans block">
            Billing contact email
          </label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => onChange('contactEmail', e.target.value)}
            placeholder="email@example.com"
            className="w-full px-3.5 sm:px-4 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl text-xs sm:text-sm font-sans text-[#2B2B2B] placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      {/* Row 3: Invoice / customer ref */}
      <div className="space-y-1.5 w-full sm:w-1/2 xl:w-1/3 min-w-0">
        <label className="text-[12px] font-bold text-[#1F1F1F] font-sans block">
          Invoice / customer ref
        </label>
        <input
          type="text"
          value={formData.billingRef}
          onChange={(e) => onChange('billingRef', e.target.value)}
          placeholder="INV-..."
          className="w-full px-3.5 sm:px-4 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl text-xs sm:text-sm font-sans text-[#2B2B2B] placeholder:text-slate-400 focus:outline-none focus:ring-0 font-mono"
        />
      </div>

      {/* Row 4: Internal account notes */}
      <div className="space-y-1.5 w-full min-w-0">
        <label className="text-[12px] font-bold text-[#1F1F1F] font-sans block">
          Internal account notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Add internal financial or account management notes..."
          rows={3}
          className="w-full p-4 bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl text-xs sm:text-sm text-[#2B2B2B] placeholder:text-slate-400 focus:outline-none focus:ring-0 resize-none font-sans leading-relaxed"
        />
        <p className="text-[11px] text-[#9A9A9A] font-secondary mt-1.5">
          These notes are only visible to SFWG. Customers never see internal financial notes.
        </p>
      </div>
    </div>
  );
}
