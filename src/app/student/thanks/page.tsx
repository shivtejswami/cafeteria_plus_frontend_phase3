'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ThanksContent() {
  const searchParams = useSearchParams();
  const gradeBand = searchParams.get('band') || '';

  if (gradeBand === '9-12') {
    return (
      <div className="min-h-screen flex flex-col bg-canvas">
        <div className="flex-1 w-full max-w-120 mx-auto px-5 flex flex-col items-center justify-center text-center">
          <div
            className="w-full rounded-xl p-8 bg-surface border border-line shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          >
            <div className="mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto bg-sage-100"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-check-line text-xl text-sage"></i>
                </span>
              </div>
            </div>

            <h1
              className="text-2xl font-bold mb-2 text-ink"
            >
              Submitted
            </h1>

            <p
              className="text-sm leading-relaxed mb-1 text-ink-700"
            >
              Your responses were sent anonymously.
            </p>

            <p
              className="text-sm leading-relaxed mb-5 text-muted"
            >
              Your school uses this feedback to make decisions about meals.
            </p>

            <p className="text-sm text-muted">
              You can close this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (gradeBand === 'K-5') {
    return (
      <div className="min-h-screen flex flex-col bg-canvas">
        <div className="w-full bg-canvas">
          <div className="w-full max-w-lg mx-auto px-5 pt-6 pb-4">
            <span className="text-sm font-semibold text-muted">
              Thanks for answering
            </span>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg mx-auto px-5 pt-2 pb-10 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div
              className="w-full rounded-2xl p-6 bg-surface border border-line shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              <div className="mb-5">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto bg-sage-100"
                >
                  <span className="w-8 h-8 flex items-center justify-center">
                    <i className="ri-check-double-line text-2xl text-sage"></i>
                  </span>
                </div>
              </div>

              <h1
                className="text-2xl leading-snug mb-3 text-ink font-bold"
              >
                Thank you
              </h1>

              <p
                className="text-sm sm:text-base leading-relaxed mb-2 text-ink-700"
              >
                Your answers were sent. Nobody will know they came from you.
              </p>

              <p
                className="text-sm sm:text-base leading-relaxed mb-5 text-ink-600"
              >
                Your school will use what you said to help make lunch better.
              </p>

              <div className="flex justify-center mb-5">
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-sage-50 border border-sage-200"
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-shield-check-line text-base text-sage"></i>
                  </span>
                  <span className="text-sm font-semibold text-sage">
                    Your answers are private
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted">
                You can close this page now.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <div className="flex-1 w-full max-w-md mx-auto px-5 flex flex-col items-center justify-center text-center">
        <div
          className="w-full rounded-2xl p-8 bg-surface border border-line shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
          <div className="mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto bg-sage-100"
            >
              <span className="w-6 h-6 flex items-center justify-center">
                <i className="ri-check-line text-2xl text-sage"></i>
              </span>
            </div>
          </div>

          <h1
            className="text-2xl font-bold mb-3 text-ink"
          >
            Submitted
          </h1>

          <p
            className="text-base leading-relaxed mb-1.5 text-ink-700"
          >
            Thanks & your answers were sent anonymously.
          </p>

          <p
            className="text-sm leading-relaxed mb-6 text-muted"
          >
            Your school will use this feedback to improve meals.
          </p>

          <div className="flex justify-center mb-5">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-sage-50 border border-sage-200"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-shield-check-line text-sm text-sage"></i>
              </span>
              <span className="text-xs font-semibold text-sage">
                Anonymous
              </span>
            </div>
          </div>

          <p className="text-sm text-muted">
            You can close this page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StudentThanks() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-canvas">
          <div className="w-5 h-5 rounded-full border-2 animate-spin border-line border-t-sage"></div>
        </div>
      }
    >
      <ThanksContent />
    </Suspense>
  );
}