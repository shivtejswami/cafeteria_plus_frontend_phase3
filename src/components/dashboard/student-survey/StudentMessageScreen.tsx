'use client';

import { useMemo } from 'react';
import ReadAloudButton from '@/components/student-survey/ReadAloudButton';

interface StudentMessageScreenProps {
  emoji?: string;
  iconName?: string;
  title: string;
  body: string;
  bodyTwo?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  helperLine?: string;
  iconBg?: string;   // tailwind bg-* class
  gradientFrom?: string;  // tailwind from-* class
  gradientTo?: string;    // tailwind to-* class
  isK5?: boolean;
  is912?: boolean;
}

export default function StudentMessageScreen({
  emoji,
  iconName,
  title,
  body,
  bodyTwo,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  helperLine,
  iconBg = 'bg-sage-50',
  gradientFrom = 'from-sage-50',
  gradientTo = 'to-canvas',
  isK5 = true,
  is912 = false,
}: StudentMessageScreenProps) {
  const readAloudContent = useMemo(() => {
    let text = `${title}. ${body}`;
    if (bodyTwo) text += ` ${bodyTwo}`;
    if (helperLine) text += ` ${helperLine}`;
    return text;
  }, [title, body, bodyTwo, helperLine]);

  // All grade bands now use the K-5 premium layout

  // All grade bands use the same premium layout
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <div
        className={`w-full relative overflow-hidden rounded-bl-[56px] rounded-br-[56px] bg-gradient-to-b ${gradientFrom} ${gradientTo}`}
      >
        <div className={`absolute top-6 left-10 w-12 h-12 rounded-full opacity-25 ${iconBg}`} />
        <div className={`absolute top-24 right-8 w-8 h-8 rounded-full opacity-15 ${iconBg}`} />
        <div className={`absolute bottom-12 left-1/4 w-6 h-6 rounded-full opacity-10 ${iconBg}`} />

        <div className="w-full max-w-[520px] mx-auto px-5 pt-6 pb-10 relative z-10">
          <div className="flex justify-end">
            <ReadAloudButton content={readAloudContent} />
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[520px] mx-auto px-5 pb-10 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div
            className="w-full rounded-[32px] p-8 bg-white border border-line shadow-[0_4px_32px_rgba(0,0,0,0.05),_0_1px_4px_rgba(0,0,0,0.03)]"
          >
            <div className="mb-6">
              <div
                className={`w-28 h-28 rounded-[28px] flex items-center justify-center mx-auto shadow-[0_8px_32px_rgba(0,0,0,0.06)] border-2 border-[rgba(255,255,255,0.6)] ${iconBg}`}
              >
                <span className="text-[52px]" role="img" aria-hidden="true">{emoji}</span>
              </div>
            </div>

            <h1
              className="text-[22px] sm:text-[30px] leading-tight mb-4 text-ink font-extrabold"
            >
              {title}
            </h1>

            <p
              className="text-[18px] leading-relaxed mb-2 text-ink-700"
            >
              {body}
            </p>

            {bodyTwo && (
              <p
                className="text-[18px] leading-relaxed text-ink-600"
              >
                {bodyTwo}
              </p>
            )}

            {actionLabel && onAction && (
              <div className="mt-7">
                <button
                  onClick={onAction}
                  className="inline-block rounded-[28px] px-10 py-[18px] text-[18px] font-bold whitespace-nowrap transition-all duration-200 hover:opacity-95 active:scale-[0.97] focus:outline-none focus-visible:ring-4 focus-visible:ring-iris/30 bg-sage text-white shadow-[0_6px_28px_rgba(88,109,77,0.35),_0_2px_8px_rgba(88,109,77,0.12)]"
                >
                  {actionLabel}
                </button>
              </div>
            )}

            {secondaryLabel && onSecondary && (
              <div className="mt-3">
                <button
                  onClick={onSecondary}
                  className="inline-block rounded-[28px] px-8 py-3.5 text-[16px] font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-80 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 bg-transparent text-iris border-2 border-line-strong"
                >
                  {secondaryLabel}
                </button>
              </div>
            )}
          </div>

          {helperLine && (
            <p
              className="text-[16px] mt-6 text-stone"
            >
              {helperLine}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}