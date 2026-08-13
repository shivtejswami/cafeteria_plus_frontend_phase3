'use client';

import { useState, useEffect, useCallback } from 'react';
import { SchoolSurveyConfig } from '@/lib/studentSurveyData';
import { getInstrument } from '@/lib/surveyInstruments';
import { hasSubmitted, writeToken, clearToken, recordEscape } from '@/lib/surveyToken';
import { checkRateLimit, recordSubmission, recordRateLimitTrip } from '@/lib/surveyRateLimit';
import { startTiming } from '@/lib/surveyIntegrity';
import SurveyWelcome from '@/components/student-survey/SurveyWelcome';
import StudentSurvey from '@/components/student-survey/StudentSurvey';
import StudentMessageScreen from '@/components/student-survey/StudentMessageScreen';
import ReadAloudButton from '@/components/student-survey/ReadAloudButton';

interface SurveyGateProps {
  config: SchoolSurveyConfig;
}

type Screen =
  | 'checking'
  | 'already-answered'
  | 'welcome'
  | 'survey'
  | 'thanks'
  | 'rate-limited'
  | 'closed'
  | 'missed-cutoff'
  | 'not-started'
  | 'paused'
  | 'cancelled'
  | 'link-invalid';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function SurveyGate({ config }: SurveyGateProps) {
  const [screen, setScreen] = useState<Screen>('checking');
  const [rateLimitWait, setRateLimitWait] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const isK5 = config.gradeBand === 'K-5';
  const is912 = config.gradeBand === '9-12';
  const instrument = getInstrument(config.gradeBand);

  useEffect(() => {
    if (config.surveyStatus === 'link-invalid') {
      setScreen('link-invalid');
      return;
    }
    if (config.surveyStatus === 'cancelled') {
      setScreen('cancelled');
      return;
    }
    if (config.surveyStatus === 'paused') {
      setScreen('paused');
      return;
    }
    if (config.surveyStatus === 'closed') {
      const now = new Date();
      const closeDate = new Date(config.closesAt);
      const hoursSinceClose = (now.getTime() - closeDate.getTime()) / (1000 * 60 * 60);
      if (hoursSinceClose >= 0 && hoursSinceClose < 24) {
        setScreen('missed-cutoff');
      } else {
        setScreen('closed');
      }
      return;
    }
    if (config.surveyStatus === 'not-started') {
      setScreen('not-started');
      return;
    }

    setScreen('welcome');
  }, [config.schoolCode, config.surveyStatus, config.closesAt]);

  const handleEscapeToken = useCallback(() => {
    recordEscape(config.schoolCode);
    clearToken(config.schoolCode);
    setScreen('welcome');
  }, [config.schoolCode]);

  const handleStartSurvey = useCallback(() => {
    startTiming(config.schoolCode);
    setScreen('survey');
  }, [config.schoolCode]);

  const handleSubmitComplete = useCallback(() => {
    const rl = checkRateLimit(config.schoolCode);

    if (!rl.allowed) {
      setRateLimitWait(rl.waitMs);
      setScreen('rate-limited');
      recordRateLimitTrip(config.schoolCode);
      return;
    }

    recordSubmission(config.schoolCode);
    writeToken(config.schoolCode);
    setScreen('thanks');
  }, [config.schoolCode]);

  useEffect(() => {
    if (screen !== 'rate-limited' || rateLimitWait <= 0) return;

    const seconds = Math.ceil(rateLimitWait / 1000);
    setCountdown(seconds);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timer = setTimeout(() => {
      recordSubmission(config.schoolCode);
      writeToken(config.schoolCode);
      setScreen('thanks');
    }, rateLimitWait);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [screen, rateLimitWait, config.schoolCode]);

  if (screen === 'link-invalid') {
    if (is912) {
      return (
        <StudentMessageScreen
          is912={true}
          iconName="ri-link-unlink"
          title="Link no longer valid"
          body="Your school may have issued a new link. Check with your teacher."
          iconBg="bg-sage-50"
        />
      );
    }
    if (!isK5) {
      return (
        <StudentMessageScreen
          isK5={false}
          iconName="ri-link-unlink"
          title="This link no longer works"
          body="Your school may have shared a new one. Ask your teacher."
          iconBg="bg-sage-50"
          gradientFrom="from-canvas"
          gradientTo="to-canvas"
        />
      );
    }
    return (
      <StudentMessageScreen
        isK5={true}
        emoji="🔗"
        title="This link doesn't work now"
        body="Your school might have a new link. Ask your teacher for it."
        helperLine="Your teacher can give you the right link."
        iconBg="bg-gold-50"
        gradientFrom="from-gold-50"
        gradientTo="to-canvas"
      />
    );
  }

  if (screen === 'cancelled') {
    if (is912) {
      return (
        <StudentMessageScreen
          is912={true}
          iconName="ri-information-line"
          title="Survey cancelled"
          body="Your school cancelled this survey. No action needed."
          iconBg="bg-sage-50"
        />
      );
    }
    if (!isK5) {
      return (
        <StudentMessageScreen
          isK5={false}
          iconName="ri-information-line"
          title="This survey was cancelled"
          body="Your school cancelled it. Nothing you need to do."
          iconBg="bg-sage-50"
          gradientFrom="from-canvas"
          gradientTo="to-canvas"
        />
      );
    }
    return (
      <StudentMessageScreen
        isK5={true}
        emoji="ℹ️"
        title="This survey stopped"
        body="Your school stopped this survey. You don't need to do anything."
        helperLine="Ask your teacher if you have questions."
        iconBg="bg-iris-50"
        gradientFrom="from-iris-50"
        gradientTo="to-canvas"
      />
    );
  }

  if (screen === 'paused') {
    if (is912) {
      return (
        <StudentMessageScreen
          is912={true}
          iconName="ri-pause-circle-line"
          title="Paused"
          body="Your school has paused this survey. Check back later."
          iconBg="bg-sage-50"
        />
      );
    }
    if (!isK5) {
      return (
        <StudentMessageScreen
          isK5={false}
          iconName="ri-pause-circle-line"
          title="Paused right now"
          body="Your school paused this survey. Try again later."
          iconBg="bg-sage-50"
          gradientFrom="from-canvas"
          gradientTo="to-canvas"
        />
      );
    }
    return (
      <StudentMessageScreen
        isK5={true}
        emoji="⏸️"
        title="Paused for now"
        body="Your teacher paused this survey. You can try again later."
        helperLine="Your teacher will tell you when to try again."
        iconBg="bg-iris-50"
        gradientFrom="from-iris-50"
        gradientTo="to-canvas"
      />
    );
  }

  if (screen === 'closed') {
    if (is912) {
      return (
        <StudentMessageScreen
          is912={true}
          iconName="ri-check-line"
          title="Survey closed"
          body="This survey is no longer accepting responses."
          iconBg="bg-sage-50"
        />
      );
    }
    if (!isK5) {
      return (
        <StudentMessageScreen
          isK5={false}
          iconName="ri-check-line"
          title="This survey has closed"
          body="Thanks anyway — it's no longer accepting answers."
          iconBg="bg-sage-50"
          gradientFrom="from-canvas"
          gradientTo="to-canvas"
        />
      );
    }
    return (
      <StudentMessageScreen
        isK5={true}
        emoji="✅"
        title="All finished"
        body="This survey is closed now. Thanks for helping!"
        helperLine="Ask your teacher if you have questions."
        iconBg="bg-sage-100"
        gradientFrom="from-sage-100"
        gradientTo="to-canvas"
      />
    );
  }

  if (screen === 'missed-cutoff') {
    if (is912) {
      return (
        <StudentMessageScreen
          is912={true}
          iconName="ri-time-line"
          title="Deadline passed"
          body="This survey closed recently."
          iconBg="bg-sage-50"
        />
      );
    }
    if (!isK5) {
      return (
        <StudentMessageScreen
          isK5={false}
          iconName="ri-time-line"
          title="You just missed the deadline"
          body="This survey closed a short while ago."
          iconBg="bg-sage-50"
          gradientFrom="from-canvas"
          gradientTo="to-canvas"
        />
      );
    }
    return (
      <StudentMessageScreen
        isK5={true}
        emoji="⏰"
        title="You just missed it"
        body="This survey closed a little while ago. Thanks for trying!"
        helperLine="Ask your teacher if there's another way to share your thoughts."
        iconBg="bg-gold-50"
        gradientFrom="from-gold-50"
        gradientTo="to-canvas"
      />
    );
  }

  if (screen === 'not-started') {
    const openDate = formatDate(config.opensAt);
    if (is912) {
      return (
        <StudentMessageScreen
          is912={true}
          iconName="ri-calendar-line"
          title="Survey hasn't opened"
          body={`Opens ${openDate}.`}
          iconBg="bg-sage-50"
        />
      );
    }
    if (!isK5) {
      return (
        <StudentMessageScreen
          isK5={false}
          iconName="ri-calendar-line"
          title="This survey hasn't opened yet"
          body={`It opens on ${openDate}. Check back then.`}
          iconBg="bg-sage-50"
          gradientFrom="from-canvas"
          gradientTo="to-canvas"
        />
      );
    }
    return (
      <StudentMessageScreen
        isK5={true}
        emoji="📅"
        title="Not open yet"
        body="This survey isn't open yet. Come back when your teacher says it's time!"
        helperLine="Ask your teacher when the survey opens."
        iconBg="bg-gold-50"
        gradientFrom="from-gold-50"
        gradientTo="to-canvas"
      />
    );
  }

  if (screen === 'checking') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-canvas">
        <div className="flex flex-col items-center gap-5">
          <div
            className="w-12 h-12 rounded-full border-[3px] animate-spin border-line border-t-sage"
          />
          <p className="text-[16px] font-medium text-muted">
            Getting things ready...
          </p>
        </div>
      </div>
    );
  }



  if (screen === 'rate-limited') {
    if (is912) {
      return (
        <div className="min-h-screen flex flex-col bg-canvas">
          <div className="flex-1 w-full max-w-[480px] mx-auto px-5 flex flex-col items-center justify-center text-center">
            <div
              className="w-full rounded-[14px] p-6 bg-white border border-line"
            >
              <div className="mb-4">
                <div
                  className="w-12 h-12 rounded-[12px] flex items-center justify-center mx-auto bg-gold-50"
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-time-line text-[20px] text-[#8a6500]"></i>
                  </span>
                </div>
              </div>

              <h1
                className="text-[22px] leading-snug mb-2 text-ink font-bold"
              >
                Just a moment
              </h1>

              <p
                className="text-[15px] leading-relaxed mb-4 text-ink-700"
              >
                Too many responses at once. Your answers will submit automatically.
              </p>

              {countdown > 0 && (
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-[12px] mb-2 bg-gold-50 border border-[#f5e6c8]"
                >
                  <div role="timer" aria-label={`${countdown} seconds remaining`}>
                    <p
                      className="text-[28px] font-bold text-sage"
                    >
                      {countdown}
                    </p>
                  </div>
                </div>
              )}

              <p className="text-[13px] mt-3 text-stone">
                Your answers are safe — they&apos;ll be sent when the wait is over.
              </p>
            </div>
          </div>
        </div>
      );
    }
    if (!isK5) {
      return (
        <div className="min-h-screen flex flex-col bg-canvas">
          <div className="w-full bg-canvas">
            <div className="w-full max-w-[520px] mx-auto px-5 pt-6 pb-4">
              <span className="text-[14px] font-semibold text-muted">
                {config.schoolName}
              </span>
            </div>
          </div>

          <div className="flex-1 w-full max-w-[520px] mx-auto px-5 pt-2 pb-10 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div
                className="w-full rounded-[20px] p-6 bg-white border border-line shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              >
                <div className="mb-5">
                  <div
                    className="w-16 h-16 rounded-[16px] flex items-center justify-center mx-auto bg-gold-50"
                  >
                    <span className="w-8 h-8 flex items-center justify-center">
                      <i className="ri-time-line text-[24px] text-[#8a6500]"></i>
                    </span>
                  </div>
                </div>

                <h1
                  className="text-[22px] sm:text-[24px] leading-snug mb-3 text-ink font-bold"
                >
                  Just a moment
                </h1>

                <div role="status" aria-live="polite" aria-atomic="true">
                  <p
                    className="text-[15px] sm:text-[16px] leading-relaxed mb-4 text-ink-700"
                  >
                    We&apos;re seeing a lot of responses. Let&apos;s wait a little bit.
                  </p>
                </div>

                {countdown > 0 && (
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-[16px] mb-2 bg-gold-50 border border-[#f5e6c8]"
                  >
                    <div role="timer" aria-label={`${countdown} seconds remaining`}>
                      <p
                        className="text-[28px] font-bold text-sage"
                      >
                        {countdown}
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-[13px] mt-3 text-stone">
                  Your answers are safe — they&apos;ll be sent when the wait is over.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const content = `Just a moment. We're seeing a lot of responses. Let's wait a little bit. Try again in ${countdown} seconds.`;
    return (
      <div className="min-h-screen flex flex-col bg-canvas">
        <div
          className="w-full relative overflow-hidden bg-[linear-gradient(160deg,_#fef6e8_0%,_#fdf0d5_50%,_#faf9f6_100%)] rounded-bl-[56px] rounded-br-[56px]"
        >
          <div className="absolute top-6 left-12 w-12 h-12 rounded-full opacity-20 bg-[#f5e6c8]" />
          <div className="absolute top-20 right-10 w-8 h-8 rounded-full opacity-15 bg-[#f0e0b8]" />

          <div className="w-full max-w-[520px] mx-auto px-5 pt-6 pb-10 relative z-10">
            <div className="flex justify-end">
              <ReadAloudButton content={content} />
            </div>
          </div>
        </div>
        <div className="flex-1 w-full max-w-[520px] mx-auto px-5 pb-10 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div
              className="w-full rounded-[32px] p-8 bg-white border border-line shadow-[0_4px_32px_rgba(0,0,0,0.05)]"
            >
              <div className="mb-6">
                <div
                  className="w-28 h-28 rounded-[28px] flex items-center justify-center mx-auto bg-gold-50 shadow-[0_8px_32px_rgba(214,176,80,0.12)] border-2 border-[rgba(255,255,255,0.6)]"
                >
                  <span className="text-[52px]" role="img" aria-hidden="true">⏳</span>
                </div>
              </div>
              <h1
                className="text-[22px] sm:text-[30px] leading-tight mb-4 text-ink font-extrabold"
              >
                Just a moment
              </h1>
              <p
                className="text-[18px] leading-relaxed mb-4 text-ink-700"
              >
                We&apos;re seeing a lot of responses. Let&apos;s wait a little bit.
              </p>
              {countdown > 0 && (
                <div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] mb-2 bg-gold-50 border-2 border-[#f5e6c8]"
                >
                  <p
                    className="text-[36px] font-bold text-sage"
                    aria-live="polite"
                    aria-label={`${countdown} seconds remaining`}
                  >
                    {countdown}
                  </p>
                </div>
              )}
              <p className="text-[15px] mt-3 text-stone">
                Your answers are safe — they&apos;ll be sent when the wait is over.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'welcome') {
    return <SurveyWelcome config={config} onStart={handleStartSurvey} isK5={isK5} is912={is912} />;
  }

  if (screen === 'survey') {
    return (
      <StudentSurvey
        instrument={instrument}
        schoolName={config.schoolName}
        schoolCode={config.schoolCode}
        schoolLogoUrl={config.schoolLogoUrl}
        onSubmitComplete={handleSubmitComplete}
      />
    );
  }

  // All grade bands show the same thank you screen

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <div
        className="w-full relative overflow-hidden bg-[linear-gradient(160deg,_#e3efe0_0%,_#d8ead4_50%,_#faf9f6_100%)] rounded-bl-[56px] rounded-br-[56px]"
      >
        <div className="absolute top-8 right-12 w-16 h-16 rounded-full opacity-20 bg-[#c4dfc0]" />
        <div className="absolute bottom-12 left-16 w-10 h-10 rounded-full opacity-15 bg-[#b8d4b2]" />
        <div className="absolute top-24 left-1/3 w-8 h-8 rounded-full opacity-10 bg-[#a8cc9f]" />

        {/* Full-width header: logo extreme left, read aloud extreme right */}
        <div className="w-full flex items-center justify-between px-5 pt-5 pb-3 relative z-10">
          <div className="flex items-center gap-2 min-w-0">
            {config.schoolLogoUrl ? (
              <img
                src={config.schoolLogoUrl}
                alt={`${config.schoolName} logo`}
                className="h-9 w-auto object-contain flex-shrink-0"
              />
            ) : (
              <span className="text-[14px] font-bold text-sage truncate">
                {config.schoolName}
              </span>
            )}
          </div>
          <ReadAloudButton content="Thank you! Your answers were sent. You helped make school meals better!" iconOnly={true} />
        </div>

        <div className="w-full max-w-[520px] mx-auto px-5 pb-8 relative z-10 text-center">
          <div className="mb-5 flex justify-center">
            <div className="relative w-[208px] h-[208px] mx-auto -mt-6 -mb-8">
              <svg width="208" height="208" viewBox="0 0 208 208" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_dd_2254_77634)">
                  <path d="M48 64C48 48.536 60.536 36 76 36H132C147.464 36 160 48.536 160 64V120C160 135.464 147.464 148 132 148H76C60.536 148 48 135.464 48 120V64Z" fill="#586D4D" shapeRendering="crispEdges"/>
                  <path d="M76 37.5H132C146.636 37.5 158.5 49.3645 158.5 64V120C158.5 134.636 146.636 146.5 132 146.5H76C61.3645 146.5 49.5 134.636 49.5 120V64C49.5 49.3645 61.3645 37.5 76 37.5Z" stroke="white" strokeOpacity="0.4" strokeWidth="3" shapeRendering="crispEdges"/>
                  
                  <rect x="76" y="63.92" width="56" height="56" rx="14" fill="url(#paint_check_bg)" />
                  <rect x="76.5" y="64.42" width="55" height="55" rx="13.5" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
                  <path d="M91 92.42L99.5 100.92L117 81.92" stroke="white" strokeWidth="6" strokeLinecap="butt" strokeLinejoin="miter" />
                </g>
                <defs>
                  <linearGradient id="paint_check_bg" x1="104" y1="63.92" x2="104" y2="119.92" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3CD52E" />
                    <stop offset="1" stopColor="#00A800" />
                  </linearGradient>
                  <filter id="filter0_dd_2254_77634" x="0" y="0" width="208" height="208" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="12"/>
                    <feGaussianBlur stdDeviation="24"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.3451 0 0 0 0 0.4275 0 0 0 0 0.302 0 0 0 0.3 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2254_77634"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="4"/>
                    <feGaussianBlur stdDeviation="8"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.3451 0 0 0 0 0.4275 0 0 0 0 0.302 0 0 0 0.15 0"/>
                    <feBlend mode="normal" in2="effect1_dropShadow_2254_77634" result="effect2_dropShadow_2254_77634"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2254_77634" result="shape"/>
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
          <h1
            className="text-[22px] sm:text-[38px] leading-tight font-extrabold text-ink text-center"
          >
            Thank you!
          </h1>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[520px] mx-auto px-5 pt-8 pb-10 text-center">
        <p className="text-[20px] leading-relaxed font-semibold text-ink">
          Your answers were sent. You helped make school meals better!
        </p>

        <div className="flex justify-center mt-6">
          <div
            className="inline-flex items-center gap-2.5 rounded-full px-5 py-3 bg-sage-50 border border-sage-200 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
          >
            <span className="text-[22px]" role="img" aria-hidden="true">🔒</span>
            <span className="text-[15px] font-semibold text-sage">
              Your answers are private — no one can see they came from you
            </span>
          </div>
        </div>

        <p className="text-[18px] mt-7 leading-relaxed text-ink-700">
          You&apos;re all finished. You can close this page now.
        </p>

        <p className="text-[15px] mt-8 text-stone">
          Thanks for helping!
        </p>
      </div>
    </div>
  );
}