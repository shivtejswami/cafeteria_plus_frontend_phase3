'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ReadAloudButton from './ReadAloudButton';

interface StudentPrivacyNoticeProps {
  isK5?: boolean;
  is912?: boolean;
  schoolName?: string;
  schoolLogoUrl?: string;
  gradeBandDisplay?: string;
  onBack?: () => void;
  onContinue?: () => void;
  onSwitchToAccessibility?: () => void;
}

export default function StudentPrivacyNotice({
  isK5 = true,
  is912 = false,
  schoolName,
  schoolLogoUrl,
  gradeBandDisplay,
  onBack,
  onContinue,
  onSwitchToAccessibility,
}: StudentPrivacyNoticeProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const readAloudContent = useMemo(() => {
    return `This is private. We don't ask your name. We don't know who you are. Your teacher can't see what you picked. We only ask what grade you're in, so we know which answers came from your class group. We remember on this computer that you answered, so you don't get asked twice. Don't include your name or anyone else's..`;
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      setIsStarting(true);
      setTimeout(() => router.push('/student/survey'), 150);
    }
  };

  if (is912) {
    return (
      <div className="h-screen overflow-hidden flex flex-col bg-canvas">
        <div className="w-full flex-shrink-0 bg-canvas">
          <div className="w-full max-w-[480px] mx-auto px-5 pt-6 pb-2">
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
                <div>
                  <span className="inline-block rounded-full px-3 py-0.5 text-[12px] font-semibold bg-sage-100 text-sage">
                    Grades 9–12
                  </span>
                </div>
              </div>
              <ReadAloudButton content={readAloudContent} iconOnly={true} />
            </div>

            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-[14px] font-medium transition-opacity duration-100 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded whitespace-nowrap text-iris"
            >
              <span className="w-5 h-5 flex items-center justify-center">
                <i className="ri-arrow-left-line"></i>
              </span>
              Back
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="min-h-full w-full max-w-[480px] mx-auto px-4 sm:px-5 pt-2 flex flex-col pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
          <h1
            className="text-[22px] leading-snug mb-5 text-ink font-bold"
          >
            How anonymity works
          </h1>

          <div className="space-y-2 mb-8">
            <div
              className="rounded-[14px] px-4 py-3 flex items-start gap-3 bg-white border border-line"
            >
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 bg-sage-50">
                <i className="ri-user-forbid-line text-[16px] text-sage"></i>
              </div>
              <p className="text-[15px] leading-snug text-ink">
                No account, no login, no name, no email, no student ID.
              </p>
            </div>

            <div
              className="rounded-[14px] px-4 py-3 flex items-start gap-3 bg-white border border-line"
            >
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 bg-sage-50">
                <i className="ri-eye-off-line text-[16px] text-sage"></i>
              </div>
              <div>
                <p className="text-[15px] leading-snug text-ink">
                  Your individual answers are never shown to your school.
                </p>
                <p className="text-[13px] leading-snug mt-0.5 text-muted">
                  Staff see totals and themes across the whole school, not individual responses.
                </p>
              </div>
            </div>

            <div
              className="rounded-[14px] px-4 py-3 flex items-start gap-3 bg-white border border-line"
            >
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 bg-sage-50">
                <i className="ri-bar-chart-grouped-line text-[16px] text-sage"></i>
              </div>
              <div>
                <p className="text-[15px] leading-snug text-ink">
                  Your grade is the only thing collected about you
                </p>
                <p className="text-[13px] leading-snug mt-0.5 text-muted">
                  so answers can be grouped by year.
                </p>
              </div>
            </div>

            <div
              className="rounded-[14px] px-4 py-3 flex items-start gap-3 bg-white border border-line"
            >
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 bg-sage-50">
                <i className="ri-computer-line text-[16px] text-sage"></i>
              </div>
              <div>
                <p className="text-[15px] leading-snug text-ink">
                  Your answers aren&apos;t linked to your device.
                </p>
                <p className="text-[13px] leading-snug mt-0.5 text-muted">
                  This device stores a marker that you&apos;ve responded, so you aren&apos;t asked twice. It isn&apos;t connected to what you selected.
                </p>
              </div>
            </div>

            <div
              className="rounded-[14px] px-4 py-3 flex items-start gap-3 bg-white border border-line"
            >
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 bg-sage-50">
                <i className="ri-edit-line text-[16px] text-sage"></i>
              </div>
              <div>
                <p className="text-[15px] leading-snug text-ink">
                  If you write an answer, don&apos;t include names.
                </p>
                <p className="text-[13px] leading-snug mt-0.5 text-muted">
                  Free-text answers are checked and personal names are removed before analysis.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={isStarting && !onContinue}
            className={`mt-auto md:mt-0 w-full max-w-[335px] py-2 gap-3 rounded-[81px] mx-auto text-white font-sans font-bold text-[17px] sm:text-[18px] whitespace-nowrap transition-all duration-150 hover:opacity-95 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 flex items-center justify-center bg-sage ${isStarting && !onContinue ? 'opacity-80' : 'opacity-100'}`}
          >
            <span>Got it - start</span>
            <i className="ri-arrow-right-line text-[18px]"></i>
          </button>

          <button
            onClick={handleBack}
            className="w-full max-w-[335px] py-2 px-5 gap-2 rounded-[81px] mx-auto mt-3 text-sage font-sans font-bold text-[17px] sm:text-[18px] whitespace-nowrap transition-all duration-150 hover:opacity-80 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 flex items-center justify-center bg-sage-50 border border-line"
          >
            Back
          </button>
        </div>
        </div>
      </div>
    );
  }

  if (!isK5) {
    return (
      <div className="h-screen overflow-hidden flex flex-col bg-canvas">
        <div className="w-full flex-shrink-0 bg-canvas">
          <div className="w-full max-w-[520px] mx-auto px-5 pt-6 pb-2">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block rounded-[8px] border border-dashed border-stone px-3 py-1.5 text-[14px] font-semibold text-stone bg-white">
                School Logo
              </span>
              <ReadAloudButton content={readAloudContent} iconOnly={true} />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBack}
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
        <div className="min-h-full w-full max-w-[520px] mx-auto px-5 pt-2 pb-10 flex flex-col justify-between">
          <div>
            <h1
              className="text-[22px] sm:text-[28px] font-bold mb-6 text-ink mt-4"
            >
              How your privacy works
            </h1>

            <div className="space-y-2.5 mb-8">
              <PrivacyFact
                icon="ri-user-forbid-line"
                text="We don't ask your name, email, or student ID."
              />
              <PrivacyFact
                icon="ri-eye-off-line"
                text="Your teacher can't see your individual answers. They only see totals for the whole school."
              />
              <PrivacyFact
                icon="ri-bar-chart-grouped-line"
                text="We ask your grade so answers can be grouped by year — that's the only thing we collect about you."
              />
              <PrivacyFact
                icon="ri-computer-line"
                text="This device remembers you answered, so you don't get asked twice. That's not linked to you."
              />
              <PrivacyFact
                icon="ri-edit-line"
                text="If you type an answer, don't include your name or anyone else's."
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleContinue}
              disabled={isStarting && !onContinue}
              className="w-full max-w-[335px] py-2 gap-3 rotate-0 opacity-100 rounded-[81px] mx-auto text-white font-sans font-bold text-[17px] sm:text-[18px] whitespace-nowrap transition-all duration-150 hover:opacity-95 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 flex items-center justify-center bg-sage"
            >
              <span>Got it - start</span>
              <i className="ri-arrow-right-line text-[18px]"></i>
            </button>

            <button
              onClick={handleBack}
              className="w-full max-w-[335px] py-2 px-5 gap-2 rotate-0 opacity-100 rounded-[81px] mx-auto text-sage font-sans font-bold text-[17px] sm:text-[18px] whitespace-nowrap transition-all duration-150 hover:opacity-80 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 flex items-center justify-center bg-sage-50 border border-line"
            >
              Back
            </button>
          </div>

          <div className="mt-8 mb-4 flex items-center justify-center gap-4">
            <button
              disabled
              className="text-[13px] font-medium whitespace-nowrap opacity-50 cursor-not-allowed text-iris"
            >
              Privacy
            </button>
            <button
              onClick={onSwitchToAccessibility}
              className="text-[13px] font-medium whitespace-nowrap transition-opacity duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded cursor-pointer text-iris"
            >
              Accessibility
            </button>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-canvas">
      <div className="w-full flex-shrink-0 max-w-[520px] mx-auto px-5 pt-6 pb-2">
        {/* Header row: Logo left, Read Aloud right */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            {schoolLogoUrl ? (
              <img
                src={schoolLogoUrl}
                alt={`${schoolName || 'School'} logo`}
                className="h-9 w-auto object-contain flex-shrink-0"
              />
            ) : (
              <span className="text-[14px] font-bold text-sage truncate">
                {schoolName || ''}
              </span>
            )}
          </div>
          <ReadAloudButton content={readAloudContent} iconOnly={true} />
        </div>

        {/* Back button row */}
        <div className="flex items-center mb-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-[16px] font-semibold transition-all duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded whitespace-nowrap text-iris"
          >
            <i className="ri-arrow-left-line"></i>
            Back
          </button>
        </div>

      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="w-full max-w-[520px] mx-auto px-5 pb-12 flex flex-col gap-6">
        {/* Title */}
        <h1 className="text-[22px] sm:text-[28px] font-bold text-ink mt-4 text-left">
          How your privacy works
        </h1>

        <div className="space-y-3 mb-2 flex flex-col">
          <PrivacyPoint icon="ri-user-forbid-line" text="We don't ask your name, email, or student ID." />
          <PrivacyPoint icon="ri-eye-off-line" text="Your teacher can't see your individual answers. They only see totals for the whole school." />
          <PrivacyPoint icon="ri-bar-chart-grouped-line" text="We ask your grade so answers can be grouped by year — that's the only thing we collect about you." />
          <PrivacyPoint icon="ri-computer-line" text="This device remembers you answered, so you don't get asked twice. That's not linked to you." />
          <PrivacyPoint icon="ri-edit-line" text="If you type an answer, don't include your name or anyone else's." />
        </div>

        <button
          onClick={handleContinue}
          disabled={isStarting && !onContinue}
          className={`w-full max-w-[335px] py-2 gap-3 rotate-0 opacity-100 rounded-[81px] mx-auto text-white font-sans font-bold text-[17px] sm:text-[18px] leading-tight tracking-[0px] text-center align-middle whitespace-nowrap transition-all duration-200 hover:opacity-95 active:scale-[0.97] focus:outline-none focus-visible:ring-4 focus-visible:ring-iris/30 flex items-center justify-center bg-sage shadow-[0_8px_32px_rgba(88,109,77,0.38),_0_2px_8px_rgba(88,109,77,0.15)] ${isStarting && !onContinue ? 'opacity-80' : 'opacity-100'}`}
        >
          <span>Got it - start</span>
          <i className="ri-arrow-right-line text-[18px] ml-1"></i>
        </button>

        <button
          onClick={handleBack}
          className="w-full max-w-[335px] py-2 px-5 gap-2 rotate-0 opacity-100 rounded-full mx-auto text-[#3B4834] font-sans font-bold text-[17px] sm:text-[18px] flex items-center justify-center bg-[#D6E0D2] border border-[#D6E0D2] transition-all duration-150 hover:opacity-80 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2"
        >
          Back
        </button>

        <div className="mt-4 mb-4 flex items-center justify-center gap-4">
          <button
            disabled
            className="text-[13px] font-medium whitespace-nowrap opacity-50 cursor-not-allowed text-iris"
          >
            Privacy
          </button>
          <button
            onClick={onSwitchToAccessibility}
            className="text-[13px] font-medium whitespace-nowrap transition-opacity duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded cursor-pointer text-iris"
          >
            Accessibility
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

function PrivacyFact({ icon, text }: { icon: string; text: string }) {
  return (
    <div
      className="rounded-[16px] px-4 py-3 flex items-start gap-3 bg-white border border-line shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
    >
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 bg-sage-50">
        <i className={`${icon} text-[18px] text-sage`}></i>
      </div>
      <p className="text-[15px] leading-snug text-ink">
        {text}
      </p>
    </div>
  );
}

function PrivacyPoint({ icon, text }: { icon: string; text: string }) {
  return (
    <div
      className="w-full max-w-[335px] sm:max-w-none mx-auto rounded-[22px] pt-[17px] pr-[17px] pb-[17px] pl-[20px] flex items-center gap-[16px] bg-white border-t border-r border-b border-l-[4px] border-sage-200 border-l-sage-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] rotate-0 opacity-100"
    >
      <div
        className="w-9 h-9 sm:w-12 sm:h-12 rounded-[16px] flex items-center justify-center flex-shrink-0 bg-sage-50 border border-sage-200"
      >
        <i className={`${icon} text-[18px] sm:text-[24px] text-sage`}></i>
      </div>
      <p
        className="font-sans font-normal text-[15px] leading-[20.63px] tracking-[0px] align-middle text-ink"
      >
        {text}
      </p>
    </div>
  );
}