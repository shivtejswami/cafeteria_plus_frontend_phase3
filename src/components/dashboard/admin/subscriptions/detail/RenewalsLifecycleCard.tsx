import React from 'react';
import { Timer, Check } from 'lucide-react';
import { SubscriptionItem } from '../types';

interface RenewalsLifecycleCardProps {
  subscription: SubscriptionItem;
  onRecordRenewal: () => void;
  showSuccessBanner?: boolean;
}

export function RenewalsLifecycleCard({
  subscription,
  onRecordRenewal,
  showSuccessBanner = false,
}: RenewalsLifecycleCardProps) {
  const currentStatus = subscription.status;
  const isGraceActive = currentStatus === 'In grace';

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E6E1] p-4 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
        <h2 className="text-[15px] sm:text-[16px] font-bold text-[#1F1F1F] font-sans leading-tight">
          Renewals &amp; lifecycle
        </h2>

        {/* Sage Pill Button matching user spec */}
        <button
          type="button"
          onClick={onRecordRenewal}
          className="w-full sm:w-auto bg-[#F2F5F0] border border-[#D6E0D2] text-[#3A4A32] hover:bg-[#E5EAE2] text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 sm:py-2 rounded-full transition-colors cursor-pointer shadow-sm shrink-0 flex items-center justify-center text-center"
        >
          Record renewal
        </button>
      </div>

      {/* Success Notification Banner (DIV-154) */}
      {showSuccessBanner && (
        <div className="bg-[#E5F5E5] border border-[#C5E5C5] rounded-xl p-3 sm:p-3.5 flex items-center gap-2 text-[#1D6B1D] text-xs sm:text-sm font-medium animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-[#1D6B1D] shrink-0" strokeWidth={2.5} />
          <span>Renewal recorded successfully.</span>
        </div>
      )}

      {/* Warning Callout Box for Grace Period (Screenshot 3 & Image 3) */}
      {isGraceActive && !showSuccessBanner && (
        <div className="bg-[#FFF1DE] border border-[#F2C990] rounded-2xl p-4 flex items-start gap-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
          <Timer className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[13px] font-bold text-[#8A4B04] font-sans">
              Grace period active
            </h3>
            <p className="text-[12px] text-[#8A4B04] mt-0.5 font-secondary">
              Entered {subscription.graceStartDate || '2024-08-02'} · Ends{' '}
              {subscription.graceEndDate || '2024-09-01'} ·{' '}
              {subscription.graceDaysWindow || 30}-day window
            </p>
          </div>
        </div>
      )}

      {/* Renewal Date summary */}
      <div className="pt-0.5">
        <div className="text-[13px] font-bold text-[#1F1F1F] font-sans">
          Renewal date:{' '}
          <span className="font-bold text-[#1F1F1F]">{subscription.renewalDate}</span>
        </div>
        <div className="text-[12px] text-[#9A9A9A] font-secondary mt-0.5">
          Grace window: {subscription.graceDaysWindow || 30} days · Term:{' '}
          {subscription.termStart} — {subscription.termEnd}
        </div>
      </div>

      {/* Lifecycle reference */}
      <div className="pt-2">
        <span className="text-[11px] font-semibold text-[#9A9A9A] font-sans block mb-2.5">
          Lifecycle reference
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
          {/* 1. Active */}
          <div
            className={`p-3.5 rounded-2xl transition-all ${
              currentStatus === 'Active'
                ? 'bg-[#EAF5EA] border-2 border-[#586D4D]'
                : 'bg-[#FAF9F6] border border-[#E8E6E1]'
            }`}
          >
            <div
              className={`text-[12px] font-bold font-sans flex items-center gap-1.5 ${
                currentStatus === 'Active' ? 'text-[#1D6B1D]' : 'text-[#2B2B2B]'
              }`}
            >
              {currentStatus === 'Active' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D6B1D]" />
              )}
              <span>Active</span>
            </div>
            <p className="text-[11px] text-[#6D6D6D] font-secondary mt-1 leading-snug">
              Full platform access. Renewal reminders sent at 90, 60, and 30...
            </p>
          </div>

          {/* 2. Grace period */}
          <div
            className={`p-3.5 rounded-2xl transition-all ${
              currentStatus === 'In grace'
                ? 'bg-[#FFF9F0] border-2 border-[#D97706]'
                : 'bg-[#FAF9F6] border border-[#E8E6E1]'
            }`}
          >
            <div
              className={`text-[12px] font-bold font-sans flex items-center gap-1.5 ${
                currentStatus === 'In grace' ? 'text-[#D97706]' : 'text-[#2B2B2B]'
              }`}
            >
              {currentStatus === 'In grace' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              )}
              <span>Grace period</span>
            </div>
            <p className="text-[11px] text-[#6D6D6D] font-secondary mt-1 leading-snug">
              30 days full access. Customer can still run surveys and view report...
            </p>
          </div>

          {/* 3. Read-only */}
          <div
            className={`p-3.5 rounded-2xl transition-all ${
              currentStatus === 'Read-only'
                ? 'bg-[#F5F3F0] border-2 border-[#6D6D6D]'
                : 'bg-[#FAF9F6] border border-[#E8E6E1]'
            }`}
          >
            <div
              className={`text-[12px] font-bold font-sans flex items-center gap-1.5 ${
                currentStatus === 'Read-only' ? 'text-[#6D6D6D]' : 'text-[#2B2B2B]'
              }`}
            >
              {currentStatus === 'Read-only' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#6D6D6D]" />
              )}
              <span>Read-only</span>
            </div>
            <p className="text-[11px] text-[#6D6D6D] font-secondary mt-1 leading-snug">
              No new surveys. Reports and data are viewable but not editable.
            </p>
          </div>

          {/* 4. Deactivated */}
          <div
            className={`p-3.5 rounded-2xl transition-all ${
              currentStatus === 'Deactivated'
                ? 'bg-[#FFF5F5] border-2 border-[#D8201D]'
                : 'bg-[#FAF9F6] border border-[#E8E6E1]'
            }`}
          >
            <div
              className={`text-[12px] font-bold font-sans flex items-center gap-1.5 ${
                currentStatus === 'Deactivated' ? 'text-[#D8201D]' : 'text-[#2B2B2B]'
              }`}
            >
              {currentStatus === 'Deactivated' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8201D]" />
              )}
              <span>Deactivated</span>
            </div>
            <p className="text-[11px] text-[#6D6D6D] font-secondary mt-1 leading-snug">
              Access revoked. Data retained per retention policy; never auto-deleted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
