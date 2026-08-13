import Link from 'next/link';
import type { HelpSupportInfo } from './types';

export default function HelpSupportCard({ email, contactHref, contactLabel = 'Contact SFWG support' }: HelpSupportInfo) {
  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-sage-50 border border-sage-200">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-sage-100">
          <span className="w-5 h-5 flex items-center justify-center text-sage">
            <i className="ri-customer-service-line text-xl"></i>
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-[15px] sm:text-[16px] font-semibold mb-1 text-ink">Still need help?</h2>
          <p className="text-[13px] leading-relaxed mb-3 text-ink-700">
            Support is provided by SFWG. Reach us at{' '}
            <a href={`mailto:${email}`} className="font-medium underline underline-offset-2 break-all hover:opacity-80 text-sage">
              {email}
            </a>
            .
          </p>
          <Link
            href={contactHref}
            className="inline-flex w-full sm:w-auto justify-center sm:justify-start items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 text-ink bg-white/70 border border-line"
          >
            <span className="w-4 h-4 flex items-center justify-center text-iris">
              <i className="ri-mail-send-line text-sm"></i>
            </span>
            {contactLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
