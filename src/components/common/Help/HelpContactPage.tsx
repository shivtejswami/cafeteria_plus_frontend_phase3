'use client';

import { useState } from 'react';
import Link from 'next/link';
import HelpBreadcrumb from './HelpBreadcrumb';
import HelpContactForm from './HelpContactForm';
import type { HelpContactCategory, HelpQuestionItem, HelpRoutes } from './types';

interface HelpContactPageProps {
  routes: HelpRoutes;
  categories: HelpContactCategory[];
  defaultEmail: string;
  supportEmail: string;
  /** Shown in the "before you contact us" panel. */
  suggestions?: HelpQuestionItem[];
  openRequestCount?: number;
}

export default function HelpContactPage({
  routes,
  categories,
  defaultEmail,
  supportEmail,
  suggestions = [],
  openRequestCount = 0,
}: HelpContactPageProps) {
  const [sent, setSent] = useState<{ email: string; reference: string } | null>(null);

  return (
    <div className="space-y-6">
      <header>
        <HelpBreadcrumb crumbs={[{ label: 'Help', href: routes.home }, { label: 'Contact support' }]} />
        <h1 className="text-[19px] sm:text-[24px] font-bold mt-3 mb-1 text-ink">Contact SFWG support</h1>
        <p className="text-[14px] sm:text-[15px] text-muted">
          Send a request and SFWG will follow up with you directly.
        </p>
      </header>

      {suggestions.length > 0 && !sent && (
        <div className="rounded-2xl p-4 sm:p-5 bg-iris-50 border border-[#e0d4f7]">
          <h2 className="text-[14px] font-semibold mb-3 flex items-start gap-2 text-iris">
            <span className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
              <i className="ri-lightbulb-line text-base"></i>
            </span>
            Before you contact us — these articles often answer the question
          </h2>
          <div className="space-y-1">
            {suggestions.map((s) => (
              <Link
                key={s.id}
                href={s.href}
                className="block text-[13px] font-medium py-1.5 px-2 -mx-2 rounded-lg transition-colors duration-150 hover:bg-[#e6daf7] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 text-iris"
              >
                {s.question}
              </Link>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-t-[#e0d4f7]">
            <Link
              href={routes.home}
              className="text-[12px] font-medium transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-iris"
            >
              Browse all help topics →
            </Link>
          </div>
        </div>
      )}

      {sent ? (
        <div className="rounded-2xl p-5 sm:p-8 text-center bg-white border border-line shadow-card">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-sage-100">
            <span className="w-7 h-7 flex items-center justify-center text-sage">
              <i className="ri-check-line text-3xl"></i>
            </span>
          </div>
          <h2 className="text-[17px] sm:text-[20px] font-bold mb-5 text-ink">Your request has been sent to SFWG</h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-center gap-2 sm:gap-3">
            <Link
              href={routes.requests}
              className="inline-flex justify-center items-center gap-1.5 h-11 px-5 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 text-ink bg-white border border-line"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-list-check text-base"></i>
              </span>
              My requests
            </Link>
            <Link
              href={routes.home}
              className="inline-flex justify-center items-center gap-1.5 h-11 px-5 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 text-ink bg-white border border-line"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-home-line text-base"></i>
              </span>
              Help home
            </Link>
            <button
              onClick={() => setSent(null)}
              className="inline-flex justify-center items-center gap-1.5 h-11 px-5 rounded-full text-[14px] font-semibold whitespace-nowrap transition-opacity duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 text-white bg-sage"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-add-line text-base"></i>
              </span>
              Submit another request
            </button>
          </div>

          <p className="text-[14px] leading-relaxed max-w-[480px] mx-auto mt-5 text-muted">
            They will follow up with you directly at <strong className="text-ink">{sent.email}</strong>. You can track
            its status in My requests.
          </p>
          <p className="text-[12px] mt-2 text-subtle">Reference: {sent.reference}</p>
        </div>
      ) : (
        <HelpContactForm
          categories={categories}
          defaultEmail={defaultEmail}
          cancelHref={routes.home}
          onSuccess={(email, reference) => setSent({ email, reference })}
        />
      )}

      <div className="rounded-2xl p-4 sm:p-5 bg-sage-50 border border-sage-200">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-sage-100">
            <span className="w-5 h-5 flex items-center justify-center text-sage">
              <i className="ri-information-line text-xl"></i>
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] sm:text-[16px] font-semibold mb-2 text-ink">How support works</h3>
            <ul className="space-y-2 text-[13px] leading-relaxed text-ink-700">
              <li className="flex items-start gap-2">
                <span className="mt-[0.5em] w-1.5 h-1.5 rounded-full shrink-0 bg-sage" />
                Support is provided by SFWG — requests are handled directly by SFWG outside the platform.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[0.5em] w-1.5 h-1.5 rounded-full shrink-0 bg-sage" />
                Reach SFWG at <strong>{supportEmail}</strong> if you need to follow up on an existing request.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[0.5em] w-1.5 h-1.5 rounded-full shrink-0 bg-sage" />
                Your request appears in <strong>My requests</strong> as{' '}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-gold-100 text-gold">
                  Open
                </span>
                . SFWG will contact you directly, and it is marked{' '}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-sage-100 text-sage">
                  Resolved
                </span>{' '}
                once handled.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Link
        href={routes.requests}
        className="flex items-center justify-between gap-3 rounded-xl p-4 transition-colors duration-150 group hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 bg-white border border-line shadow-hairline"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-iris-50">
            <span className="w-4 h-4 flex items-center justify-center text-iris">
              <i className="ri-list-check text-lg"></i>
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-medium text-ink">My requests</p>
            <p className="text-[12px] text-muted">
              {openRequestCount} open request{openRequestCount === 1 ? '' : 's'}
            </p>
          </div>
        </div>
        <span className="w-5 h-5 flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 text-subtle">
          <i className="ri-arrow-right-s-line text-lg"></i>
        </span>
      </Link>
    </div>
  );
}
