import React from 'react';
import Link from 'next/link';
import { SubscriptionItem } from '../types';

interface SubscriptionDetailHeaderProps {
  subscription: SubscriptionItem;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  isSaving: boolean;
}

export function SubscriptionDetailHeader({
  subscription,
  hasUnsavedChanges,
  onSave,
  isSaving,
}: SubscriptionDetailHeaderProps) {
  // Status Chip styling matching Screenshot 1
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
    statusBg = 'bg-[#FFF1DE]';
    statusText = 'text-[#D97706]';
    dotColor = 'bg-[#D97706]';
  }

  return (
    <div className="space-y-2.5 font-sans w-full">
      {/* 1. Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-sans">
        <Link
          href="/admin/subscriptions"
          className="text-slate-500 hover:text-[#6D28D9] transition-colors cursor-pointer"
        >
          Subscriptions
        </Link>
        <span className="text-slate-400">/</span>
        <span className="font-semibold text-[#2B2B2B] truncate">{subscription.customer}</span>
      </nav>

      {/* 2. Top Banner Card matching Screenshot 1 */}
      <div className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl border border-[#E8E6E1] p-5 sm:p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Title & Badges in one unified inline row */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <h1 className="text-[20px] sm:text-[22px] md:text-[24px] font-bold text-[#1F1F1F] font-sans leading-tight">
              {subscription.customer}
            </h1>

            {subscription.type === 'District' ? (
              <span className="bg-[#F0EAFB] text-[#6D28D9] text-[11px] font-semibold px-2 py-0.5 rounded-full font-sans">
                District
              </span>
            ) : (
              <span className="bg-[#F1EFEA] text-[#6D6D6D] text-[11px] font-semibold px-2 py-0.5 rounded-md font-sans">
                Standalone school
              </span>
            )}

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-sans ${statusBg} ${statusText}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
              <span>{subscription.status}</span>
            </span>
          </div>

          {/* Subtitle / Plan & Dates */}
          <p className="text-[12px] sm:text-[13px] text-[#9A9A9A] font-secondary leading-relaxed mt-1">
            {subscription.planName || (subscription.type === 'District' ? 'District Plan' : 'Single School Pro')} · {subscription.termStart} — {subscription.termEnd} · Renewal: {subscription.renewalDate}
            {subscription.graceEndDate && ` · Grace until ${subscription.graceEndDate}`}
          </p>
        </div>

        {/* Save Changes Button */}
        <div className="shrink-0 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={onSave}
            disabled={!hasUnsavedChanges || isSaving}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center cursor-pointer ${hasUnsavedChanges && !isSaving
                ? 'bg-[#4E6B48] hover:bg-[#3E563A] text-white cursor-pointer'
                : 'bg-[#B4C2B0] text-white opacity-90 cursor-not-allowed'
              }`}
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
