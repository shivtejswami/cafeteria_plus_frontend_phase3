'use client';

import { useMemo } from 'react';
import ReadAloudButton from './ReadAloudButton';

interface StudentAccessibilityNoticeProps {
  gradeBandDisplay?: string;
  schoolName?: string;
  schoolLogoUrl?: string;
  onBack: () => void;
  onSwitchToPrivacy?: () => void;
}

export default function StudentAccessibilityNotice({
  gradeBandDisplay = 'Grades K-5',
  schoolName,
  schoolLogoUrl,
  onBack,
  onSwitchToPrivacy,
}: StudentAccessibilityNoticeProps) {
  const readAloudContent = useMemo(() => {
    return "Accessibility. This survey is built to work for everyone. Here are the tools and features that help make it easier to use. Read aloud. Tap the speaker button and the survey will read the question out loud to you. Keyboard navigation. You can use the Tab key on a keyboard to move between answers, and press Enter or Space to pick one. Screen reader support. If you use a screen reader like VoiceOver or TalkBack, the survey tells you what each button does. Clear focus indicators. When you use a keyboard, a bright ring shows which answer you're on so you don't lose your place. Skip questions. You never have to answer a question you don't want to. There's always a Skip button for writing questions. Zoom and large text. You can make the text bigger using your device's zoom settings. The survey still works fine. Color and contrast. We use big buttons and clear colors. Words are always easy to read against the background. Need something else? Ask your teacher for help, or email support@sfwg.org and we'll do our best to accommodate you.";
  }, []);

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-canvas">
      <div className="w-full flex-shrink-0 bg-canvas">
        <div className="w-full max-w-[520px] mx-auto px-5 pt-6 pb-2">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex flex-col gap-1.5 min-w-0">
              {schoolLogoUrl ? (
                <img
                  src={schoolLogoUrl}
                  alt={`${schoolName || 'School'} logo`}
                  className="h-8 w-auto object-contain flex-shrink-0 self-start"
                />
              ) : (
                <span className="text-[14px] font-bold text-sage truncate">
                  {schoolName || ''}
                </span>
              )}
            </div>
            <ReadAloudButton content={readAloudContent} iconOnly={true} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-[16px] font-semibold transition-opacity duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded whitespace-nowrap text-iris"
            >
              <span className="w-5 h-5 flex items-center justify-center">
                <i className="ri-arrow-left-line"></i>
              </span>
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="w-full min-h-full max-w-[520px] mx-auto px-4 sm:px-5 pt-2 pb-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))] flex flex-col justify-between">
        <div>
          <h1
            className="text-[22px] sm:text-[28px] font-bold text-ink mt-4 mb-3"
          >
            Accessibility
          </h1>

          <div className="mb-4">
            <span className="inline-block rounded-full px-3 py-1 text-[13px] font-semibold bg-iris-100 text-iris">
              {gradeBandDisplay || 'Grades 9–12'}
            </span>
          </div>

          <p className="text-[15px] leading-relaxed text-ink-700 mb-6">
            This survey is built to work for everyone. Here are the tools and features that help make it easier to use.
          </p>

          <div className="space-y-3 mb-6">
            <AccessibilityFact
              icon="ri-volume-up-line"
              title="Read aloud"
              text="Tap the speaker button and the survey will read the question out loud to you. You can hear it again anytime."
            />
            <AccessibilityFact
              icon="ri-keyboard-line"
              title="Keyboard navigation"
              text="You can use the Tab key on a keyboard to move between answers, and press Enter or Space to pick one."
            />
            <AccessibilityFact
              icon="ri-contrast-2-line"
              title="Screen reader support"
              text="If you use a screen reader like VoiceOver or TalkBack, the survey tells you what each button does."
            />
            <AccessibilityFact
              icon="ri-focus-3-line"
              title="Clear focus indicators"
              text="When you use a keyboard, a bright ring shows which answer you're on so you don't lose your place."
            />
            <AccessibilityFact
              icon="ri-skip-right-line"
              title="Skip questions"
              text="You never have to answer a question you don't want to. There's always a Skip button for writing questions."
            />
            <AccessibilityFact
              icon="ri-zoom-in-line"
              title="Zoom and large text"
              text="You can make the text bigger using your device's zoom settings. The survey still works fine."
            />
            <AccessibilityFact
              icon="ri-palette-line"
              title="Color and contrast"
              text="We use big buttons and clear colors. Words are always easy to read against the background."
            />
            <div className="rounded-[16px] p-4 flex items-start gap-4 bg-[#F2F5F0] border border-[#D6E0D2] !mt-6">
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 mt-0.5 bg-sage-100">
                <i className="ri-question-line text-[20px] text-sage"></i>
              </div>
              <div className="flex-1">
                <p className="text-[16px] font-bold text-ink mb-1">
                  Need something else?
                </p>
                <p className="text-[14px] leading-relaxed text-ink-700">
                  Ask your teacher for help, or email{" "}
                  <a href="mailto:support@sfwg.org" className="text-[#586D4D] hover:underline font-semibold">
                    support@sfwg.org
                  </a>{" "}
                  and we'll do our best to accommodate you.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-4 flex items-center justify-center gap-4">
          <button
            onClick={onSwitchToPrivacy}
            className="text-[13px] font-medium whitespace-nowrap transition-opacity duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded cursor-pointer text-iris"
          >
            Privacy
          </button>
          <button
            disabled
            className="text-[13px] font-medium whitespace-nowrap opacity-50 cursor-not-allowed text-iris"
          >
            Accessibility
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

function AccessibilityFact({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div
      className="rounded-[16px] p-4 flex items-start gap-4 bg-white border border-line shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
    >
      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 mt-0.5 bg-sage-50">
        <i className={`${icon} text-[20px] text-sage`}></i>
      </div>
      <div className="flex-1">
        <p className="text-[16px] font-bold text-ink mb-1">
          {title}
        </p>
        <p className="text-[14px] leading-relaxed text-ink-700">
          {text}
        </p>
      </div>
    </div>
  );
}
