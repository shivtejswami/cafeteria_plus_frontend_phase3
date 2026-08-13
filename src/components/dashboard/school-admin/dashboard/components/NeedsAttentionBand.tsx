'use client';

import Link from 'next/link';
import type { SchoolAdminAlert } from '@/lib/schoolAdminData';

const typeStyles: Record<string, { bg: string; border: string; icon: string; iconColor: string; accentColor: string }> = {
  'closing-soon': { bg: 'bg-[#fff9f0]', border: 'border-gold-250', icon: 'ri-time-line', iconColor: 'text-gold', accentColor: '#d97706' },
  'low-participation': { bg: 'bg-[#fff9f0]', border: 'border-gold-250', icon: 'ri-user-unfollow-line', iconColor: 'text-gold', accentColor: '#d97706' },
  'report-ready': { bg: 'bg-[#f5f8f2]', border: 'border-sage-200', icon: 'ri-file-chart-line', iconColor: 'text-sage', accentColor: '#586d4d' },
  'subscription-renewal': { bg: 'bg-[#f8f5fc]', border: 'border-[#d9cdf0]', icon: 'ri-bank-card-line', iconColor: 'text-iris', accentColor: '#6d28d9' },
  'grace-period': { bg: 'bg-[#fff9f0]', border: 'border-gold-250', icon: 'ri-error-warning-line', iconColor: 'text-gold', accentColor: '#d97706' },
  'read-only': { bg: 'bg-[#fef5f5]', border: 'border-[#f0b8b6]', icon: 'ri-lock-line', iconColor: 'text-brick', accentColor: '#d8201d' },
};

export default function NeedsAttentionBand({ alerts }: { alerts: SchoolAdminAlert[] }) {
  if (alerts.length === 0) {
    return (
      <div
        className="rounded-2xl p-4 sm:p-5 flex items-center gap-4 bg-[#f5f8f2] border border-sage-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
      >
        <span className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-leaf-50">
          <i className="ri-check-line text-[18px] text-sage"></i>
        </span>
        <div>
          <p className="text-[15px] font-semibold text-ink">
            You&apos;re all caught up
          </p>
          <p className="text-[13px] mt-0.5 text-muted">
            Nothing needs your attention right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden bg-white border border-t-[3px] border-[#E8E6E1] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04),0px_6px_20px_0px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center gap-2 px-6 pt-5 pb-2">
        <span className="w-5 h-5 flex items-center justify-center">
          <i className="ri-notification-3-fill text-[16px] text-gold"></i>
        </span>
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-subtle">
          Needs your attention
        </h2>
      </div>

      <div>
        {alerts.map((alert, idx) => {
          const style = typeStyles[alert.type] || typeStyles['report-ready'];
          return (
            <div key={alert.id}>
              {idx > 0 && <div className="h-px mx-6 bg-line" />}
              <div className="flex items-center gap-4 px-6 py-4 group">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${style.bg}`}
                >
                  <i className={`${style.icon} text-[18px] ${style.iconColor}`}></i>
                </div>
                <p className="flex-1 text-[14px] leading-snug min-w-0 text-ink-800">
                  {alert.message}
                </p>
                <Link
                  href={alert.linkHref}
                  className="inline-flex items-center gap-1.5 rounded-full h-9 px-4 text-[13px] font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 flex-shrink-0 bg-sage-50 text-ink"
                >
                  {alert.linkLabel}
                  <span className="w-3.5 h-3.5 flex items-center justify-center">
                    <i className="ri-arrow-right-line text-[12px]"></i>
                  </span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}