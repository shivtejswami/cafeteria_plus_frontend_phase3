import { SubscriptionData } from '@/lib/schoolAdminData';
import Link from 'next/link';

export default function SubscriptionContactPanel({ data }: { data: SubscriptionData }) {
  const isLapsed = data.status === 'grace-period' || data.status === 'read-only' || data.status === 'deactivated';

  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card"
    >
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-[16px] sm:text-[17px] font-semibold mb-1 text-ink"
          >
            Renewal &amp; support
          </h2>
          <p className="text-[13px] leading-relaxed text-muted"
          >
            {isLapsed
              ? 'Your subscription needs attention. Contact SFWG to arrange renewal and restore full access.'
              : `Your subscription renews on ${data.renewalDate}. SFWG will send renewal reminders ahead of that date.`
            }
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-xl p-4 min-w-0 bg-canvas border border-line"
          >
            <p className="text-[12px] mb-1 text-subtle"
            >
              Billing contact
            </p>
            <p className="text-[14px] font-medium wrap-break-word text-ink"
            >
              {data.billingContactName}
            </p>
            <p className="text-[13px] mt-0.5 break-all text-muted"
            >
              {data.billingContactEmail}
            </p>
          </div>

          <div className="rounded-xl p-4 min-w-0 bg-canvas border border-line"
          >
            <p className="text-[12px] mb-1 text-subtle"
            >
              Current term
            </p>
            <p className="text-[14px] font-medium wrap-break-word text-ink"
            >
              {data.termStart} – {data.termEnd}
            </p>
            <p className="text-[13px] mt-0.5 text-muted"
            >
              Renews {data.renewalDate}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Link
            href="/school/help/contact"
            className="inline-flex w-full sm:w-auto justify-center items-center gap-1.5 rounded-full h-10 px-5 text-[13px] font-semibold whitespace-nowrap transition-opacity duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 bg-sage text-white"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-customer-service-line text-sm"></i>
            </span>
            Contact support
          </Link>
          {isLapsed && (
            <Link
              href="/school/reports"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-1.5 rounded-full h-10 px-5 text-[13px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 bg-white border border-line text-ink"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-file-chart-line text-sm"></i>
              </span>
              View reports
            </Link>
          )}
        </div>

        <p className="text-[11px] leading-relaxed pt-3 border-t border-t-line text-muted-500">
          No payment or checkout is available in this portal. All billing, invoicing, and renewals are handled externally by SFWG.
        </p>
      </div>
    </div>
  );
}