'use client';

import SubscriptionStatusCard from '@/components/school-admin/subscription/components/SubscriptionStatusCard';
import SubscriptionWhatsIncluded from '@/components/school-admin/subscription/components/SubscriptionWhatsIncluded';
import SubscriptionContactPanel from '@/components/school-admin/subscription/components/SubscriptionContactPanel';
import { SchoolAdminData, SubscriptionData } from '@/lib/schoolAdminData';

interface SubscriptionPageProps {
  schoolData: SchoolAdminData;
  /** Status and billing type come from the account — SFWG drives both. */
  subscriptionData: SubscriptionData;
}

export default function SubscriptionPage({ subscriptionData: data }: SubscriptionPageProps) {
  const isGrace = data.status === 'grace-period';
  const isReadOnly = data.status === 'read-only';

  return (
    <div className="space-y-4 sm:space-y-6">
      {isGrace && data.graceDaysRemaining !== null && (
        <div className="rounded-2xl p-4 sm:p-5 flex items-start gap-3 bg-gold-100 border border-[#f5d0a3]">
          <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-gold">
            <i className="ri-time-line text-lg"></i>
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-ink">Your subscription has expired</p>
            <p className="text-[13px] leading-relaxed text-ink-700">
              You still have full access for {data.graceDaysRemaining} days while renewal is arranged. SFWG will send
              renewal reminders.
            </p>
          </div>
        </div>
      )}

      {isReadOnly && (
        <div className="rounded-2xl p-4 sm:p-5 flex items-start gap-3 bg-canvas border border-line">
          <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-muted">
            <i className="ri-eye-line text-lg"></i>
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-ink">Your access is now read-only</p>
            <p className="text-[13px] leading-relaxed text-ink-700">
              You can view and download reports, but can&apos;t start or change surveys, invite users, or edit settings.
              Any in-flight survey has been automatically paused and will resume on renewal.
            </p>
          </div>
        </div>
      )}

      <SubscriptionStatusCard data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SubscriptionWhatsIncluded data={data} />
        <SubscriptionContactPanel data={data} />
      </div>
    </div>
  );
}
