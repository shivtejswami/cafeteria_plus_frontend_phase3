import { SubscriptionData } from '@/lib/schoolAdminData';

export default function SubscriptionWhatsIncluded({ data }: { data: SubscriptionData }) {
  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card"
    >
      <h2 className="text-[16px] sm:text-[17px] font-semibold mb-4 text-ink"
      >
        What&apos;s included
      </h2>
      <ul className="space-y-3">
        {data.includedFeatures.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-sage">
              <i className="ri-check-line text-[15px]"></i>
            </span>
            <span className="text-[14px] leading-relaxed text-[#3a3a3a]"
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-t-line">
        <p className="text-[12px] leading-relaxed text-muted"
        >
          Your subscription covers {data.customerType === 'district' ? 'your school under the district agreement' : 'Hillside Middle'} for the full term. Renewals are handled by SFWG.
        </p>
      </div>
    </div>
  );
}