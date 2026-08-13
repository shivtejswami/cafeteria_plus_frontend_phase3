'use client';

import { useState, useMemo, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReadAloudButton from '@/components/student-survey/ReadAloudButton';
import LunchTrayIllustration from '@/components/student-survey/LunchTrayIllustration';

const SCHOOL_NAME = 'North Hills Elementary';
const ESTIMATED_MINUTES = '5\u20137 min';

export default function StudentWelcome({ isK5 = true, is912 = false }: { isK5?: boolean; is912?: boolean }) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const readAloudContent = useMemo(() => {
    return `Welcome to the school lunch survey for ${SCHOOL_NAME}. Tell us about your school lunch! We want to know what you think about the food at school. There are no wrong answers, just tell us what you really think. Nobody will know it's you. It takes about ${ESTIMATED_MINUTES}. You can skip questions you don't want to answer.`;
  }, []);

  const handleStart = () => {
    setIsStarting(true);
    setTimeout(() => {
      router.push('/student/enter-code');
    }, 150);
  };

  if (is912) {
    return (
      <div className="min-h-screen flex flex-col bg-canvas">
        <div className="w-full bg-canvas">
          <div className="w-full max-w-[480px] mx-auto px-5 pt-6 pb-3">
            <span className="text-[14px] font-medium text-muted">
              {SCHOOL_NAME}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full max-w-[480px] mx-auto px-5 pt-6 pb-10 flex flex-col">
          <h1
            className="text-[22px] leading-snug mb-2 text-ink font-bold"
          >
            School meals survey
          </h1>

          <p
            className="text-[15px] leading-relaxed mb-6 text-ink-700"
          >
            Your school wants honest feedback about the food. This is anonymous — no login, no name, and your individual answers aren&apos;t visible to staff.
          </p>

          <div className="space-y-2 mb-8">
            <div
              className="rounded-[14px] px-4 py-3 flex items-center gap-3 bg-white border border-line"
            >
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-sage-50">
                <i className="ri-shield-check-line text-[16px] text-sage"></i>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-ink">
                  Anonymous
                </p>
                <p className="text-[13px] text-muted">
                  No name, no login, no tracking
                </p>
              </div>
            </div>
            <div
              className="rounded-[14px] px-4 py-3 flex items-center gap-3 bg-white border border-line"
            >
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-sage-50">
                <i className="ri-time-line text-[16px] text-sage"></i>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-ink">
                  About 6 minutes
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={isStarting}
            className={`mt-auto md:mt-0 w-full max-w-[335px] mx-auto rounded-full text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap transition-all duration-100 hover:opacity-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 py-2 flex items-center justify-center gap-2 mb-4 bg-sage ${isStarting ? 'opacity-80' : 'opacity-100'}`}
          >
            Start
          </button>

          <div className="text-center">
            <button
              onClick={() => router.push('/student/privacy')}
              className="text-[14px] font-medium whitespace-nowrap transition-opacity duration-100 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded px-2 py-1 text-iris"
            >
              How anonymity works
            </button>
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
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-muted">
                {SCHOOL_NAME}
              </span>
              <span
                className="inline-block rounded-full px-3 py-1 text-[11px] font-medium bg-sage-100 text-sage"
              >
                Anonymous
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-[520px] mx-auto px-5 pt-2 pb-10 flex flex-col">
          <h1
            className="text-[22px] sm:text-[24px] leading-snug mb-3 text-ink font-bold"
          >
            Tell us what you think about school meals
          </h1>

          <p
            className="text-[15px] sm:text-[16px] leading-relaxed mb-6 text-ink-700"
          >
            Your school wants honest feedback about the food. This is anonymous — no one will know what you picked.
          </p>

          <div className="space-y-2.5 mb-8">
            <CompactFact icon="ri-shield-check-line" label="Anonymous" text="No name, no login" />
            <CompactFact icon="ri-time-line" label={`About ${ESTIMATED_MINUTES}`} text="Quick and simple" />
            <CompactFact icon="ri-skip-right-line" label="Skip anything" text="You don't have to answer everything" />
          </div>

          <button
            onClick={handleStart}
            disabled={isStarting}
            className={`mt-auto md:mt-0 w-full max-w-[335px] mx-auto rounded-full text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap transition-all duration-150 hover:opacity-95 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 py-2 flex items-center justify-center gap-2 mb-3 bg-sage shadow-[0_4px_16px_rgba(88,109,77,0.25)] ${isStarting ? 'opacity-80' : 'opacity-100'}`}
          >
            <span>Start</span>
            <i className="ri-arrow-right-line text-[18px]"></i>
          </button>

          <div className="text-center">
            <button
              onClick={() => router.push('/student/privacy')}
              className="text-[14px] font-medium whitespace-nowrap transition-opacity duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded px-2 py-1 text-iris"
            >
              How your privacy works
            </button>
          </div>

          <p className="text-[13px] text-center mt-6 text-stone">
            Need help? Ask your teacher.
          </p>
        </div>
      </div>
    );
  }

  // K-5 version (existing code below remains unchanged)
  return (
    <div className="min-h-screen flex flex-col bg-canvas">

      <div
        className="w-full relative overflow-hidden bg-[linear-gradient(180deg,_#fdf8ed_0%,_#faf9f6_100%)] rounded-bl-[48px] rounded-br-[48px]"
      >
        {SCHOOL_NAME === 'North Hills Elementary' ? (
          <img
            src="/K-5 welcome image.jpg"
            alt="Welcome to North Hills Elementary"
            width={702}
            height={394}
            className="w-full h-auto object-cover block"
          />
        ) : (
          <LunchTrayIllustration />
        )}

        <div className="absolute top-5 right-5">
          <ReadAloudButton content={readAloudContent} iconOnly={true} />
        </div>
      </div>

      <div className="flex-1 w-full max-w-[520px] mx-auto px-5 pt-7 pb-10 flex flex-col">

        <div className="text-center mb-2">
          <p
            className="text-[22px] font-bold text-iris"
          >
            {SCHOOL_NAME}
          </p>
        </div>

        <h1
          className="font-sans font-extrabold text-[22px] sm:text-[34px] leading-snug sm:leading-[39.1px] tracking-[0px] text-center align-middle mb-3 text-ink"
        >
          Tell us about your school lunch !
        </h1>

        <p
          className="font-sans font-normal text-[18px] leading-[29.25px] tracking-[0px] text-center align-middle text-[#5A5A5A] mb-7"
        >
          We want to know what you think about the food at school. There are no wrong answers — just tell us what you really think.
        </p>

        <div className="space-y-3 mb-7">
          <ReassuranceCard
            icon={<Image src="/lock-3d.png" alt="Nobody will know it's you" width={28} height={28} className="object-contain" />}
            text="Nobody will know it's you"
            iconBg="bg-[#f3f7f1] border border-[#dce6d8]"
          />
          <ReassuranceCard
            icon={<Image src="/clock-3d.png" alt="It takes about 5-7 minutes" width={28} height={28} className="object-contain" />}
            text={`It takes about ${ESTIMATED_MINUTES}`}
            iconBg="bg-[#fff8ee] border border-[#faeedc]"
          />
          <ReassuranceCard
            icon={<Image src="/thumb-3d.png" alt="You can skip questions" width={28} height={28} className="object-contain" />}
            text="You can skip questions you don't want to answer"
            iconBg="bg-[#f3f7f1] border border-[#dce6d8]"
          />
        </div>

        <button
          onClick={handleStart}
          disabled={isStarting}
          className={`mt-auto md:mt-0 w-full max-w-[335px] py-2 gap-3 rotate-0 opacity-100 rounded-[81px] mx-auto text-white font-sans font-bold text-[17px] sm:text-[18px] tracking-[0px] text-center align-middle whitespace-nowrap transition-all duration-150 hover:opacity-95 active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-iris/30 flex items-center justify-center mb-4 bg-sage shadow-[0_6px_28px_rgba(88,109,77,0.40)] ${isStarting ? 'opacity-80' : 'opacity-100'}`}
        >
          Start
        </button>

        <div className="text-center">
          <button
            onClick={() => router.push('/student/privacy')}
            className="text-[16px] font-semibold whitespace-nowrap transition-opacity duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded text-iris"
          >
            How we keep this private
          </button>
        </div>

        <p className="text-[14px] text-center mt-6 text-stone">
          Need help? Ask your teacher.
        </p>

      </div>
    </div>
  );
}

function CompactFact({ icon, label, text }: { icon: string; label: string; text: string }) {
  return (
    <div
      className="rounded-[16px] px-4 py-3 flex items-center gap-3 bg-white border border-line shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
    >
      <div className="w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0 bg-sage-50">
        <i className={`${icon} text-[18px] text-sage`}></i>
      </div>
      <div>
        <p className="text-[15px] font-semibold text-ink">
          {label}
        </p>
        <p className="text-[13px] text-muted">
          {text}
        </p>
      </div>
    </div>
  );
}

function ReassuranceCard({
  icon,
  text,
  iconBg = 'bg-sage-50 border border-sage-100',
}: {
  icon: ReactNode;
  text: string;
  iconBg?: string;
}) {
  return (
    <div
      className="w-full max-w-[335px] min-h-[82px] mx-auto py-[16px] px-[20px] flex items-center gap-[16px] transition-transform duration-150 active:scale-[0.98] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-line rounded-[22px]"
    >
      <div
        className={`w-12 h-12 rounded-[18px] flex items-center justify-center flex-shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <p
        className="text-[17px] sm:text-[18px] font-bold leading-[1.3] text-ink"
      >
        {text}
      </p>
    </div>
  );
}