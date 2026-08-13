import Link from 'next/link';
import { SubscriptionData } from '@/lib/schoolAdminData';

const STATUS_CONFIG: Record<string, { chip: string; text: string; dot: string; label: string }> = {
  active: { chip: 'bg-leaf-50', text: 'text-sage', dot: 'bg-sage', label: 'Active' },
  'renewal-due': { chip: 'bg-gold-100', text: 'text-gold', dot: 'bg-gold', label: 'Renewal approaching' },
  'grace-period': { chip: 'bg-gold-100', text: 'text-gold', dot: 'bg-gold', label: 'Grace period' },
  'read-only': { chip: 'bg-surface-100', text: 'text-muted', dot: 'bg-muted', label: 'Read-only' },
  deactivated: { chip: 'bg-brick-50', text: 'text-brick', dot: 'bg-brick', label: 'Deactivated' },
};

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[12px] mb-1 text-subtle">{label}</p>
      <p className="text-[14px] sm:text-[15px] font-semibold wrap-break-word text-ink">{children}</p>
    </div>
  );
}

export default function SubscriptionStatusCard({ data }: { data: SubscriptionData }) {
  const status = STATUS_CONFIG[data.status] || STATUS_CONFIG.active;
  const isDistrictCovered = data.customerType === 'district';

  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="min-w-0">
          <h2 className="text-[16px] sm:text-[17px] font-semibold text-ink">Subscription status</h2>
          <p className="text-[13px] mt-0.5 text-subtle">Your school agreement with SFWG</p>
        </div>
        <span
          className={`inline-flex items-center shrink-0 rounded-full px-3 py-1 text-[12px] sm:text-[13px] font-semibold whitespace-nowrap ${status.chip} ${status.text}`}
        >
          <span className={`w-2 h-2 rounded-full mr-1.5 shrink-0 ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <Stat label="Plan">{data.plan}</Stat>
        <Stat label="Status">
          <span className="flex flex-wrap items-baseline gap-x-2">
            {status.label}
            {data.status === 'grace-period' && data.graceDaysRemaining !== null && (
              <span className="text-[12px] font-medium text-gold">{data.graceDaysRemaining} days remaining</span>
            )}
          </span>
        </Stat>
        <Stat label="Renewal date">{data.renewalDate}</Stat>
        <Stat label="Current term">
          {data.termStart} – {data.termEnd}
        </Stat>
        <Stat label="Billing">{isDistrictCovered ? 'School (district-covered)' : 'Standalone School'}</Stat>
      </div>

      {isDistrictCovered && data.districtName && (
        <div className="flex items-start gap-2 rounded-xl p-3 mt-5 bg-sage-50 border border-sage-200">
          <span className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-sage">
            <i className="ri-building-2-line text-[15px]"></i>
          </span>
          <p className="text-[12px] leading-relaxed text-ink-700">
            Covered under {data.districtName}&apos;s subscription. The district holds the subscription agreement. Your
            school is covered for the duration of the district&apos;s term.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl p-3 mt-3 bg-canvas border border-line">
        <div className="flex items-start gap-2 min-w-0">
          <span className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 text-muted-500">
            <i className="ri-information-line text-[15px]"></i>
          </span>
          <p className="text-[12px] leading-relaxed text-muted">
            Billing is handled by {data.billingContactName}. To make changes or ask about your subscription,
          </p>
        </div>
        <Link
          href="/school/help/contact"
          className="inline-flex w-full sm:w-auto justify-center items-center gap-1.5 shrink-0 rounded-full h-9 px-4 text-[12px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-sage-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-1 bg-white border border-line text-ink"
        >
          <span className="w-3.5 h-3.5 flex items-center justify-center text-sage">
            <i className="ri-customer-service-line text-sm"></i>
          </span>
          Contact support
        </Link>
      </div>
    </div>
  );
}
