'use client';

import { useState, useMemo, type ReactNode } from 'react';
import Image from 'next/image';
import { SchoolSurveyConfig } from '@/lib/studentSurveyData';
import ReadAloudButton from '@/components/student-survey/ReadAloudButton';
import StudentPrivacyNotice from './StudentPrivacyNotice';
import LunchTrayIllustration from '@/components/student-survey/LunchTrayIllustration';

interface SurveyWelcomeProps {
  config: SchoolSurveyConfig;
  onStart: () => void;
  isK5?: boolean;
  is912?: boolean;
}

export default function SurveyWelcome({ config, onStart, isK5 = true, is912 = false }: SurveyWelcomeProps) {
  const [showPrivacy, setShowPrivacy] = useState(false);

  const readAloudContent = useMemo(() => {
    return `Welcome to the school lunch survey for ${config.schoolName}. Tell us about your school lunch! We want to know what you think about the food at school. There are no wrong answers, just tell us what you really think. Nobody will know it's you. It takes about ${config.estimatedMinutes} minutes. You can skip questions you don't want to answer.`;
  }, [config.schoolName, config.estimatedMinutes]);

  if (showPrivacy) {
    if (is912) {
      return (
        <StudentPrivacyNotice
          isK5={false}
          is912={true}
          schoolName={config.schoolName}
          schoolLogoUrl={config.schoolLogoUrl}
          onBack={() => setShowPrivacy(false)}
          onContinue={onStart}
        />
      );
    }
    if (!isK5) {
      return (
        <StudentPrivacyNotice
          isK5={false}
          schoolName={config.schoolName}
          schoolLogoUrl={config.schoolLogoUrl}
          onBack={() => setShowPrivacy(false)}
          onContinue={onStart}
        />
      );
    }
    return (
      <K5PrivacyNotice
        onBack={() => setShowPrivacy(false)}
        onContinue={onStart}
        schoolName={config.schoolName}
        schoolLogoUrl={config.schoolLogoUrl}
      />
    );
  }

  if (is912) {
    return <NineTwelveWelcome config={config} onStart={onStart} onShowPrivacy={() => setShowPrivacy(true)} />;
  }

  if (!isK5) {
    return <MiddleWelcome config={config} onStart={onStart} onShowPrivacy={() => setShowPrivacy(true)} />;
  }

  return (
    <div
      className="h-screen overflow-hidden flex flex-col bg-[linear-gradient(126.52deg,_#FFF8EE_0%,_#FDF6E3_40%,_#FAF9F6_100%)]"
    >
      {/* Full-width header: logo extreme left, read aloud extreme right */}
      <div className="w-full flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-3">
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
        <ReadAloudButton content={readAloudContent} iconOnly={true} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="min-h-full flex flex-col">
      {/* Illustration */}
      <div className="w-full max-w-[520px] mx-auto px-5 pb-8 relative z-10">
        {/* Decorative blobs */}
        <div className="absolute top-6 left-8 w-16 h-16 rounded-full opacity-40 bg-sage-100 pointer-events-none" />
        <div className="absolute top-20 right-12 w-10 h-10 rounded-full opacity-30 bg-iris-50 pointer-events-none" />
        <div className="absolute bottom-16 left-16 w-8 h-8 rounded-full opacity-25 bg-gold-50 pointer-events-none" />
        <div className="absolute top-32 left-1/3 w-6 h-6 rounded-full opacity-20 bg-sage-100 pointer-events-none" />

        <div
          className="rounded-[32px] overflow-hidden mx-auto border-[3px] border-white shadow-[0_8px_40px_rgba(88,109,77,0.12),_inset_0_0_0_1px_rgba(255,255,255,0.5)]"
        >
          {config.schoolCode === 'north-hills-elementary' ? (
            <img
              src="/K-5 welcome image.jpg"
              alt="Welcome to North Hills Elementary"
              width={702}
              height={394}
              className="w-full h-auto object-cover block opacity-100 rotate-0"
            />
          ) : (
            <LunchTrayIllustration />
          )}
        </div>
      </div>

      <div className="flex-1 w-full max-w-[520px] mx-auto px-5 pt-4 pb-12 flex flex-col">

        <h1
          className="font-sans font-extrabold text-[22px] sm:text-[34px] leading-snug sm:leading-[39.1px] tracking-[0px] text-center align-middle mb-4 text-ink"
        >
          Tell us about your school lunch !
        </h1>

        <p
          className="font-sans font-normal text-[18px] leading-[29.25px] tracking-[0px] text-center align-middle text-[#5A5A5A] mb-8"
        >
          We want to know what you think about the food at school. There are <br></br>
          no wrong answers — just tell us <br></br>
          what you really think.
        </p>

        <div className="space-y-3 mb-8">
          <ReassuranceCard
            icon={<Image src="/lock-3d.png" alt="Nobody will know it's you" width={28} height={28} className="object-contain" />}
            text="Nobody will know it's you"
            accentBg="border-sage-200"
            accentBorder="border-sage-200"
            iconBg="bg-[#f3f7f1] border border-[#dce6d8]"
          />
          <ReassuranceCard
            icon={<Image src="/clock-3d.png" alt="It takes about 5-7 minutes" width={28} height={28} className="object-contain" />}
            text={`It takes about ${config.estimatedMinutes} minutes`}
            accentBg="border-sage-200"
            accentBorder="border-sage-200"
            iconBg="bg-[#fff8ee] border border-[#faeedc]"
          />
          <ReassuranceCard
            icon={<Image src="/thumb-3d.png" alt="You can skip questions" width={28} height={28} className="object-contain" />}
            text="You can skip questions you don't want to answer"
            accentBg="border-sage-200"
            accentBorder="border-sage-200"
            iconBg="bg-[#f3f7f1] border border-[#dce6d8]"
          />
        </div>

        <button
          onClick={onStart}
          className="mt-auto md:mt-0 w-full max-w-[335px] py-2 gap-3 rotate-0 opacity-100 rounded-[81px] mx-auto text-white font-sans font-bold text-[17px] sm:text-[18px] tracking-[0px] text-center align-middle whitespace-nowrap transition-all duration-200 hover:opacity-95 active:scale-[0.97] focus:outline-none focus-visible:ring-4 focus-visible:ring-iris/30 flex items-center justify-center mb-4 bg-sage shadow-[0_8px_32px_rgba(88,109,77,0.38),_0_2px_8px_rgba(88,109,77,0.15)]"
        >
          Start
        </button>

        <div className="text-center">
          <button
            onClick={() => setShowPrivacy(true)}
            className="text-[15px] sm:text-[16px] font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded px-3 py-2 text-iris min-h-[44px]"
          >
            How we keep this private
          </button>
        </div>

        <p className="text-[14px] text-center mt-6 text-stone">
          Need help? Ask your teacher.
        </p>

      </div>
      </div>
      </div>
    </div>
  );
}

function NineTwelveWelcome({
  config,
  onStart,
  onShowPrivacy,
}: {
  config: SchoolSurveyConfig;
  onStart: () => void;
  onShowPrivacy: () => void;
}) {
  const readAloudContent = `School meals survey. Your school wants honest feedback about the food. This is anonymous — no login, no name, and your individual answers aren't visible to staff. Takes about 6 minutes.`;

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-canvas">
      {/* Full-width header: logo & grade band left, read aloud right */}
      <div className="w-full flex-shrink-0 flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex flex-col gap-1.5 min-w-0">
          {config.schoolLogoUrl ? (
            <img
              src={config.schoolLogoUrl}
              alt={`${config.schoolName} logo`}
              className="h-8 w-auto object-contain flex-shrink-0 self-start"
            />
          ) : (
            <span className="text-[14px] font-bold text-sage truncate">
              {config.schoolName}
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

      <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="min-h-full w-full max-w-[480px] mx-auto px-5 pt-4 pb-10 flex flex-col">
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

        <div className="mt-auto md:mt-4">
          <button
            onClick={onStart}
            className="w-full max-w-[335px] py-2 rotate-0 opacity-100 rounded-full text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap transition-all duration-100 hover:opacity-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 flex items-center justify-center gap-2 mb-6 bg-sage mx-auto"
          >
            Start
          </button>

          <p className="text-[13px] leading-[19.5px] tracking-[0px] font-normal text-center text-[#B5B0A8] mb-6">
            Need help? Ask your teacher.
          </p>

          <div className="text-center">
            <button
              onClick={onShowPrivacy}
              className="text-[14px] font-medium whitespace-nowrap transition-opacity duration-100 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded px-2 py-1 text-iris"
            >
              How anonymity works
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function MiddleWelcome({
  config,
  onStart,
  onShowPrivacy,
}: {
  config: SchoolSurveyConfig;
  onStart: () => void;
  onShowPrivacy: () => void;
}) {
  const readAloudContent = `Tell us what you think about school meals. Your school wants honest feedback about the food. This is anonymous — no one will know what you picked. It takes about ${config.estimatedMinutes} minutes. You can skip questions you don't want to answer.`;

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-canvas">
      {/* Full-width header: logo & grade band left, read aloud right */}
      <div className="w-full flex-shrink-0 flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex flex-col gap-1.5 min-w-0">
          {config.schoolLogoUrl ? (
            <img
              src={config.schoolLogoUrl}
              alt={`${config.schoolName} logo`}
              className="h-9 w-auto object-contain flex-shrink-0 self-start"
            />
          ) : (
            <span className="text-[14px] font-bold text-sage truncate">
              {config.schoolName}
            </span>
          )}
          <div>
            <span className="inline-block rounded-full px-3 py-0.5 text-[12px] font-semibold bg-sage-100 text-sage">
              Grades 6–8
            </span>
          </div>
        </div>
        <ReadAloudButton content={readAloudContent} iconOnly={true} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="min-h-full w-full max-w-[520px] mx-auto px-5 pt-2 pb-10 flex flex-col">
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
          <CompactFact
            icon="ri-shield-check-line"
            label="Anonymous"
            text="No name, no login"
          />
          <CompactFact
            icon="ri-time-line"
            label={`About ${config.estimatedMinutes} minutes`}
            text="Quick and simple"
          />
          <CompactFact
            icon="ri-skip-right-line"
            label="Skip anything"
            text="You don't have to answer everything"
          />
        </div>

        <button
          onClick={onStart}
          className="mt-auto md:mt-0 w-full max-w-[335px] mx-auto rounded-full text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap transition-all duration-150 hover:opacity-95 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 py-2 flex items-center justify-center gap-2 mb-3 bg-sage shadow-[0_4px_16px_rgba(88,109,77,0.25)]"
        >
          <span>Start</span>
          <i className="ri-arrow-right-line text-[18px]"></i>
        </button>

        <p className="text-[13px] text-center mt-4 text-stone">
          Need help? Ask your teacher.
        </p>

        <div className="text-center mt-2">
          <button
            onClick={onShowPrivacy}
            className="text-[14px] font-medium whitespace-nowrap transition-opacity duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded px-2 py-1 text-iris"
          >
            How your privacy works
          </button>
        </div>
      </div>
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
  accentBg?: string;
  accentBorder?: string;
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

function K5PrivacyNotice({
  onBack,
  onContinue,
  schoolName,
  schoolLogoUrl,
}: {
  onBack: () => void;
  onContinue: () => void;
  schoolName: string;
  schoolLogoUrl?: string;
}) {
  const readAloudContent = useMemo(() => {
    return `This is private. We don't ask your name. We don't know who you are. Your teacher can't see what you picked. We only ask what grade you're in, so we know which answers came from your class group. We remember on this computer that you answered, so you don't get asked twice. Please don't type your name when you write an answer.`;
  }, []);

  return (
    <div className="min-h-screen bg-canvas">
      <div
        className="w-full relative overflow-hidden bg-[linear-gradient(160deg,_#f2f5f0_0%,_#e8efe4_50%,_#faf9f6_100%)] rounded-bl-[56px] rounded-br-[56px]"
      >
        <div className="absolute top-8 right-10 w-14 h-14 rounded-full opacity-30 bg-sage-200" />
        <div className="absolute bottom-10 left-12 w-10 h-10 rounded-full opacity-20 bg-sage-100" />

        <div className="w-full max-w-[520px] mx-auto px-5 pt-6 pb-8 relative z-10">
          {/* Header row: Logo left, Read Aloud right */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              {schoolLogoUrl ? (
                <img
                  src={schoolLogoUrl}
                  alt={`${schoolName} logo`}
                  className="h-9 w-auto object-contain flex-shrink-0"
                />
              ) : (
                <span className="text-[14px] font-bold text-sage truncate">
                  {schoolName}
                </span>
              )}
            </div>
            <ReadAloudButton content={readAloudContent} iconOnly={true} />
          </div>

          {/* Back button row */}
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-[16px] font-semibold transition-all duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded whitespace-nowrap text-iris"
            >
              <i className="ri-arrow-left-line"></i>
              Back
            </button>
          </div>

          <div className="text-center">
            <div
              className="w-24 h-24 rounded-[28px] flex items-center justify-center mx-auto mb-5 bg-white shadow-[0_8px_32px_rgba(88,109,77,0.14),_0_2px_8px_rgba(0,0,0,0.04)] border-2 border-line"
            >
              <Image src="/private-3d.png" alt="Privacy Shield" width={52} height={52} className="object-contain" />
            </div>
            <h1 className="text-[22px] sm:text-[30px] font-bold mb-3 text-ink">
              This is private
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[520px] mx-auto px-5 pt-8 pb-10 flex flex-col gap-6">
        <div className="space-y-3 mb-2 flex flex-col">
          <PrivacyPoint icon={<Image src="/monkey-3d.png" alt="Monkey" width={28} height={28} className="object-contain" />} text="We don't ask your name. We don't know who you are." iconBg="bg-[#fff8ee] border border-[#faeedc]" />
          <PrivacyPoint icon={<Image src="/teacher-3d.png" alt="Teacher" width={28} height={28} className="object-contain" />} text="Your teacher can't see what you picked." iconBg="bg-[#fff8ee] border border-[#faeedc]" />
          <PrivacyPoint icon={<Image src="/cap-3d.png" alt="Grade" width={28} height={28} className="object-contain" />} text="We only ask what grade you're in, so we know which answers came from your class group." iconBg="bg-[#f3f7f1] border border-[#dce6d8]" />
          <PrivacyPoint icon={<Image src="/laptop-3d.png" alt="Laptop" width={28} height={28} className="object-contain" />} text="We remember on this computer that you answered, so you don't get asked twice." iconBg="bg-[#f3f7f1] border border-[#dce6d8]" />
          <PrivacyPoint icon={<Image src="/pencil-3d.png" alt="Pencil" width={28} height={28} className="object-contain" />} text="Please don't type your name when you write an answer." iconBg="bg-[#fff8ee] border border-[#faeedc]" />
        </div>

        <button
          onClick={onContinue}
          className="mt-auto md:mt-0 w-full max-w-[335px] py-2 gap-3 rotate-0 opacity-100 rounded-[81px] mx-auto text-white font-sans font-bold text-[17px] sm:text-[18px] tracking-[0px] text-center align-middle whitespace-nowrap transition-all duration-200 hover:opacity-95 active:scale-[0.97] focus:outline-none focus-visible:ring-4 focus-visible:ring-iris/30 flex items-center justify-center bg-sage shadow-[0_8px_32px_rgba(88,109,77,0.38),_0_2px_8px_rgba(88,109,77,0.15)]"
        >
          Okay, let&apos;s start
        </button>

        <button
          onClick={onBack}
          className="w-full max-w-[335px] py-2 px-5 gap-2 rotate-0 opacity-100 rounded-full mx-auto text-[#3B4834] font-sans font-bold text-[17px] sm:text-[18px] flex items-center justify-center bg-[#D6E0D2] border border-[#D6E0D2] transition-all duration-150 hover:opacity-80 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2"
        >
          Go back
        </button>
      </div>
    </div>
  );
}

function PrivacyPoint({ icon, text, iconBg = 'bg-sage-50 border border-sage-200' }: { icon: ReactNode; text: string; iconBg?: string }) {
  return (
    <div
      className="w-full max-w-[335px] mx-auto rounded-[22px] pt-[17px] pr-[17px] pb-[17px] pl-[20px] flex items-center gap-[16px] bg-white border-t border-r border-b border-l-[4px] border-sage-200 border-l-sage-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] rotate-0 opacity-100"
    >
      <div
        className={`w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <p
        className="font-sans font-normal text-[15px] leading-[20.63px] tracking-[0px] align-middle text-ink"
      >
        {text}
      </p>
    </div>
  );
}