'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Timer, Ban, RefreshCw } from 'lucide-react';
import { SubscriptionItem, OverrideItem } from '../types';
import DateField from '@/components/ui/DateField';

interface ApplyOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionItem;
  onApply: (override: OverrideItem) => void;
}

type OverrideActionType = 'extend_grace' | 'suspend' | 'restore_access';
type GraceDurationOption = '+7 days' | '+14 days' | '+30 days' | 'Custom date';

export function ApplyOverrideModal({
  isOpen,
  onClose,
  subscription,
  onApply,
}: ApplyOverrideModalProps) {
  const currentStatus = subscription.status;

  const availableActions = useMemo<OverrideActionType[]>(() => {
    switch (currentStatus) {
      case 'Active':
      case 'Expiring':
        return ['suspend'];
      case 'In grace':
        return ['extend_grace', 'suspend'];
      case 'Read-only':
        return ['restore_access', 'suspend'];
      case 'Deactivated':
      default:
        return ['restore_access'];
    }
  }, [currentStatus]);

  const [activeAction, setActiveAction] = useState<OverrideActionType>(availableActions[0]);
  const [graceDuration, setGraceDuration] = useState<GraceDurationOption>('+30 days');
  const [customGraceDate, setCustomGraceDate] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveAction(availableActions[0]);
      setGraceDuration('+30 days');
      setCustomGraceDate('');
      setReason('');
    }
  }, [isOpen, availableActions]);

  if (!isOpen) return null;

  const calculateGraceEndDate = () => {
    if (graceDuration === 'Custom date') {
      return customGraceDate || '1 Oct 2024';
    }
    const daysToAdd =
      graceDuration === '+7 days' ? 7 : graceDuration === '+14 days' ? 14 : 30;
    const base = subscription.graceEndDate || subscription.renewalDate;
    const baseDate = base ? new Date(base) : new Date();
    baseDate.setDate(baseDate.getDate() + daysToAdd);
    return baseDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isFormValid = reason.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    let overrideTitle = '';
    if (activeAction === 'extend_grace') {
      overrideTitle = `Grace period extended (${graceDuration === 'Custom date' ? customGraceDate : graceDuration})`;
    } else if (activeAction === 'suspend') {
      overrideTitle = 'Account suspended immediately';
    } else if (activeAction === 'restore_access') {
      overrideTitle = 'Full access restored';
    }

    const newOverride: OverrideItem = {
      id: `ovr-${Date.now()}`,
      title: overrideTitle,
      type: activeAction,
      appliedBy: 'Emily Matsuda',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: reason.trim(),
      expiryDate: activeAction === 'extend_grace' ? calculateGraceEndDate() : undefined,
    };

    onApply(newOverride);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 modal-backdrop animate-in fade-in duration-200 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#FFFFFF] rounded-3xl shadow-2xl p-6 sm:p-7 border border-[#E8E6E1] z-10 animate-in zoom-in-95 fade-in duration-200 font-sans">
        {/* Header Icon + Title */}
        <div className="flex items-center gap-3 pb-2">
          {activeAction === 'extend_grace' && (
            <div className="w-10 h-10 rounded-full bg-[#FFF1DE] flex items-center justify-center text-[#D97706] shrink-0">
              <Timer className="w-5 h-5" strokeWidth={2.2} />
            </div>
          )}
          {activeAction === 'suspend' && (
            <div className="w-10 h-10 rounded-full bg-[#FDEAEA] flex items-center justify-center text-[#D8201D] shrink-0">
              <Ban className="w-5 h-5" strokeWidth={2.2} />
            </div>
          )}
          {activeAction === 'restore_access' && (
            <div className="w-10 h-10 rounded-full bg-[#E3F5E3] flex items-center justify-center text-[#1D6B1D] shrink-0">
              <RefreshCw className="w-5 h-5" strokeWidth={2.2} />
            </div>
          )}

          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#1F1F1F] font-sans leading-tight">
            {activeAction === 'extend_grace' && 'Extend grace period?'}
            {activeAction === 'suspend' && 'Suspend immediately?'}
            {activeAction === 'restore_access' && 'Restore access?'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Override Type Selector Pills */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-[#1F1F1F] font-sans block">
              Override type
            </label>
            <div className="flex items-center gap-2">
              {availableActions.map((action) => {
                const isSelected = activeAction === action;
                let label = 'Extend grace';
                let Icon = Timer;
                if (action === 'suspend') {
                  label = 'Suspend';
                  Icon = Ban;
                } else if (action === 'restore_access') {
                  label = 'Restore access';
                  Icon = RefreshCw;
                }

                return (
                  <button
                    key={action}
                    type="button"
                    onClick={() => setActiveAction(action)}
                    className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      availableActions.length === 1 ? 'w-auto' : 'flex-1'
                    } ${
                      isSelected
                        ? 'bg-[#6D28D9] text-white shadow-sm'
                        : 'bg-[#FAF9F6] border border-[#E8E6E1] text-[#6D6D6D] hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extend Grace Duration Sub-Options */}
          {activeAction === 'extend_grace' && (
            <div className="space-y-2.5 pt-1">
              <label className="text-[12px] font-bold text-[#1F1F1F] font-sans block">
                Extend grace by
              </label>

              <div className="flex items-center gap-1.5 flex-wrap">
                {(['+7 days', '+14 days', '+30 days', 'Custom date'] as GraceDurationOption[]).map(
                  (opt) => {
                    const isSelected = graceDuration === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setGraceDuration(opt)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#6D28D9] text-white shadow-sm'
                            : 'bg-[#FAF9F6] border border-[#E8E6E1] text-[#2B2B2B] hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  }
                )}
              </div>

              {graceDuration !== 'Custom date' ? (
                <div className="p-3.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl text-xs text-[#2B2B2B] font-sans leading-snug">
                  Grace period will now end on{' '}
                  <span className="font-bold text-[#1F1F1F]">{calculateGraceEndDate()}</span> —{' '}
                  <span className="font-semibold text-slate-500">-674 days from today.</span>
                </div>
              ) : (
                <div className="space-y-1 pt-1">
                  <label className="text-[12px] font-bold text-[#1F1F1F] font-sans block">
                    New grace end date
                  </label>
                  <DateField
                    value={customGraceDate}
                    onChange={(iso) => setCustomGraceDate(iso)}
                    placeholder="-/-/-"
                  />
                </div>
              )}
            </div>
          )}

          {/* Reason Field */}
          <div className="space-y-1.5">
            <div className="flex items-center">
              <label className="text-[12px] font-bold text-[#1F1F1F] font-sans">
                Reason
              </label>
              <span className="text-[#D8201D] font-bold ml-0.5">*</span>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the reason for this override..."
              rows={3}
              required
              className="w-full p-3.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl text-xs sm:text-sm font-sans text-[#2B2B2B] placeholder:text-slate-400 focus:outline-none focus:ring-0 resize-none leading-relaxed min-h-[90px]"
            />
          </div>

          {/* Suspend Immediate Warning Box */}
          {activeAction === 'suspend' && (
            <div className="p-3 bg-[#FDEAEA] border border-[#FCD4D4] rounded-2xl text-[12px] text-[#D8201D] font-secondary leading-snug">
              This will immediately suspend access for this customer. All active surveys will be paused.
            </div>
          )}

          {/* Bottom Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#F2F5F0] hover:bg-[#E5EAE2] text-[#3A4A32] text-xs sm:text-sm font-semibold rounded-full cursor-pointer transition-colors border border-[#D6E0D2]"
            >
              Cancel
            </button>

            {activeAction === 'extend_grace' && (
              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                  isFormValid
                    ? 'bg-[#D97706] hover:bg-[#B45309] text-white cursor-pointer'
                    : 'bg-[#F0C070]/60 text-white opacity-90 cursor-not-allowed'
                }`}
              >
                Extend grace period
              </button>
            )}

            {activeAction === 'suspend' && (
              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                  isFormValid
                    ? 'bg-[#D8201D] hover:bg-[#B91C1C] text-white cursor-pointer'
                    : 'bg-[#ECA19F] text-white opacity-90 cursor-not-allowed'
                }`}
              >
                Suspend immediately
              </button>
            )}

            {activeAction === 'restore_access' && (
              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                  isFormValid
                    ? 'bg-[#4E6547] hover:bg-[#3E563A] text-white cursor-pointer'
                    : 'bg-[#B4C2B0] text-white opacity-90 cursor-not-allowed'
                }`}
              >
                Restore access
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
