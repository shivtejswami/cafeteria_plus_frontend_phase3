'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Info, X } from 'lucide-react';
import { SubscriptionItem, SubscriptionStatus, SchoolCovered, OverrideItem } from '../types';
import { SUBSCRIPTIONS_DATA } from '../mockData';
import { SubscriptionDetailHeader } from './SubscriptionDetailHeader';
import { SubscriptionDetailsForm } from './SubscriptionDetailsForm';
import { SchoolsCoveredCard } from './SchoolsCoveredCard';
import { RenewalsLifecycleCard } from './RenewalsLifecycleCard';
import { AdministrativeOverridesCard } from './AdministrativeOverridesCard';
import { ActivityAuditCard } from './ActivityAuditCard';
import { BillingNoticeCard } from './BillingNoticeCard';
import { ManageSchoolsModal } from './ManageSchoolsModal';
import { RecordRenewalModal } from './RecordRenewalModal';
import { ApplyOverrideModal } from './ApplyOverrideModal';

interface SubscriptionDetailPageProps {
  id: string;
}

interface ToastState {
  id: number;
  type: 'success' | 'info';
  message: string;
  isExiting?: boolean;
}

export function SubscriptionDetailPage({ id }: SubscriptionDetailPageProps) {
  const router = useRouter();

  // Find initial subscription from mock data, fallback to first item
  const initialSubscription = useMemo(() => {
    return (
      SUBSCRIPTIONS_DATA.find((s) => s.id === id) ||
      SUBSCRIPTIONS_DATA[0]
    );
  }, [id]);

  const [subscription, setSubscription] = useState<SubscriptionItem>(initialSubscription);

  // Form State
  const [formData, setFormData] = useState({
    status: initialSubscription.status,
    termStart: initialSubscription.termStart,
    termEnd: initialSubscription.termEnd,
    renewalDate: initialSubscription.renewalDate,
    contactName: initialSubscription.contactName || '',
    contactEmail: initialSubscription.contactEmail || '',
    billingRef: initialSubscription.billingRef || '',
    notes: initialSubscription.notes || '',
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showRenewalSuccess, setShowRenewalSuccess] = useState(false);

  // Modal States
  const [isSchoolsModalOpen, setIsSchoolsModalOpen] = useState(false);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);

  // Toast State
  const [toast, setToast] = useState<ToastState | null>(null);

  const dismissToast = () => {
    if (!toast) return;
    setToast((prev) => (prev ? { ...prev, isExiting: true } : null));
    setTimeout(() => {
      setToast(null);
    }, 300);
  };

  const showToast = (type: 'success' | 'info', message: string) => {
    const toastId = Date.now();
    setToast({ id: toastId, type, message, isExiting: false });
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setSubscription((prev) => ({
        ...prev,
        status: formData.status as SubscriptionStatus,
        termStart: formData.termStart,
        termEnd: formData.termEnd,
        renewalDate: formData.renewalDate,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        billingRef: formData.billingRef,
        notes: formData.notes,
        auditEvents: [
          {
            id: `aud-${Date.now()}`,
            action: 'Subscription updated',
            actor: 'Emily Matsuda',
            timestamp: new Date().toISOString(),
            description: `Status changed to ${formData.status}. Contract details saved.`,
          },
          ...(prev.auditEvents || []),
        ],
      }));
      setHasUnsavedChanges(false);
      setIsSaving(false);
      showToast('success', `Changes saved successfully for ${subscription.customer}.`);
    }, 400);
  };

  const handleSaveSchools = (updatedSchools: SchoolCovered[]) => {
    setSubscription((prev) => ({
      ...prev,
      schoolsCovered: updatedSchools,
      schoolCount: updatedSchools.filter((s) => s.isActive).length,
    }));
    showToast('success', `Schools agreement updated for ${subscription.customer}.`);
  };

  const handleRecordRenewal = (newRenewalDate: string, note: string) => {
    setShowRenewalSuccess(true);
    setSubscription((prev) => ({
      ...prev,
      status: 'Active',
      renewalDate: newRenewalDate,
      auditEvents: [
        {
          id: `aud-${Date.now()}`,
          action: 'Renewal recorded',
          actor: 'Emily Matsuda',
          timestamp: new Date().toISOString(),
          description: `Contract renewed. New renewal date: ${newRenewalDate}.`,
          note: note || undefined,
        },
        ...(prev.auditEvents || []),
      ],
    }));
    setFormData((prev) => ({
      ...prev,
      status: 'Active',
      renewalDate: newRenewalDate,
    }));
    showToast('success', `Renewal recorded for ${subscription.customer}. Status set to Active.`);
  };

  const handleApplyOverride = (override: OverrideItem) => {
    setSubscription((prev) => ({
      ...prev,
      overrides: [override, ...(prev.overrides || [])],
      auditEvents: [
        {
          id: `aud-${Date.now()}`,
          action: 'Override applied',
          actor: override.appliedBy,
          timestamp: new Date().toISOString(),
          description: override.title,
          note: override.notes,
        },
        ...(prev.auditEvents || []),
      ],
    }));
    showToast('info', `Administrative override applied: ${override.title}`);
  };

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto w-full pb-12 font-sans min-w-0">
      {/* Toast Notification with Smooth Animations */}
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
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header Banner & Breadcrumb */}
      <SubscriptionDetailHeader
        subscription={subscription}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* 2. Main 2-Column Responsive Layout (Responsive at 700-1200px) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Main Column (xl: 8 cols, full width on 700-1200px) */}
        <div className="xl:col-span-8 space-y-5 min-w-0">
          {/* Card 1: Subscription details */}
          <SubscriptionDetailsForm
            subscription={subscription}
            formData={formData}
            onChange={handleFieldChange}
          />

          {/* Card 2: Schools covered / district agreement */}
          <SchoolsCoveredCard
            schools={subscription.schoolsCovered || []}
            onManageSchools={() => setIsSchoolsModalOpen(true)}
          />

          {/* Card 3: Renewals & lifecycle */}
          <RenewalsLifecycleCard
            subscription={subscription}
            onRecordRenewal={() => setIsRenewalModalOpen(true)}
            showSuccessBanner={showRenewalSuccess}
          />
        </div>

        {/* Sidebar Column (xl: 4 cols, full width on 700-1200px) */}
        <div className="xl:col-span-4 space-y-5 min-w-0">
          {/* Sidebar Card 1: Administrative overrides */}
          <AdministrativeOverridesCard
            overrides={subscription.overrides}
            onApplyOverride={() => setIsOverrideModalOpen(true)}
          />

          {/* Sidebar Card 2: Activity / audit */}
          <ActivityAuditCard events={subscription.auditEvents} />

          {/* Sidebar Card 3: Billing Notice */}
          <BillingNoticeCard />
        </div>
      </div>

      {/* Modals */}
      <ManageSchoolsModal
        isOpen={isSchoolsModalOpen}
        onClose={() => setIsSchoolsModalOpen(false)}
        schools={subscription.schoolsCovered || []}
        customerName={subscription.customer}
        onSave={handleSaveSchools}
      />

      <RecordRenewalModal
        isOpen={isRenewalModalOpen}
        onClose={() => setIsRenewalModalOpen(false)}
        subscription={subscription}
        onRecord={handleRecordRenewal}
      />

      <ApplyOverrideModal
        isOpen={isOverrideModalOpen}
        onClose={() => setIsOverrideModalOpen(false)}
        subscription={subscription}
        onApply={handleApplyOverride}
      />
    </div>
  );
}
