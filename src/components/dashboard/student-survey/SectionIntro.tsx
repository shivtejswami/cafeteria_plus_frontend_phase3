'use client';

import { useMemo } from 'react';
import { sectionLabels } from '@/lib/surveyInstruments';
import ReadAloudButton from './ReadAloudButton';

const SECTION_ICONS_K5: Record<string, { emoji: string; alt: string; gradient: string; iconBg: string; glow: string }> = {
  'about-you': { emoji: '\uD83D\uDC64', alt: 'Person', gradient: 'bg-iris-50', iconBg: 'bg-[#e3dbf5]', glow: 'shadow-[0_4px_24px_#e3dbf5]' },
  'breakfast': { emoji: '\uD83E\uDD5E', alt: 'Bowl with cereal', gradient: 'bg-[#fef3e2]', iconBg: 'bg-[#fde4b8]', glow: 'shadow-[0_4px_24px_#fde4b8]' },
  'lunch': { emoji: '\uD83C\uDF7D\uFE0F', alt: 'Plate with food', gradient: 'bg-sage-100', iconBg: 'bg-[#cfe4c8]', glow: 'shadow-[0_4px_24px_#cfe4c8]' },
  'your-meals': { emoji: '\uD83D\uDE0B', alt: 'Yum face', gradient: 'bg-[#fef0f8]', iconBg: 'bg-[#f5d8e8]', glow: 'shadow-[0_4px_24px_#f5d8e8]' },
  'your-ideas': { emoji: '\uD83D\uDCA1', alt: 'Lightbulb', gradient: 'bg-sage-100', iconBg: 'bg-[#cfe4c8]', glow: 'shadow-[0_4px_24px_#cfe4c8]' },
};

const SECTION_ICONS_68: Record<string, { icon: string; bg: string; color: string; glow: string }> = {
  'about-you': { icon: 'ri-user-line', bg: 'bg-iris-50', color: 'text-iris', glow: 'shadow-[0_4px_16px_#f0eafb]' },
  'breakfast': { icon: 'ri-bowl-line', bg: 'bg-[#fef3e2]', color: 'text-[#B45309]', glow: 'shadow-[0_4px_16px_#fef3e2]' },
  'lunch': { icon: 'ri-restaurant-line', bg: 'bg-sage-100', color: 'text-sage', glow: 'shadow-[0_4px_16px_#e3efe0]' },
  'your-meals': { icon: 'ri-star-line', bg: 'bg-[#fef0f8]', color: 'text-[#be185d]', glow: 'shadow-[0_4px_16px_#fef0f8]' },
  'your-ideas': { icon: 'ri-lightbulb-line', bg: 'bg-sage-100', color: 'text-sage', glow: 'shadow-[0_4px_16px_#e3efe0]' },
};

interface SectionIntroProps {
  section: string;
  isK5: boolean;
  gradeBandDisplay?: string;
  questionCount: number;
  onContinue: () => void;
  schoolName?: string;
  schoolLogoUrl?: string;
}

export default function SectionIntro({ section, isK5, gradeBandDisplay, questionCount, onContinue, schoolName, schoolLogoUrl }: SectionIntroProps) {
  const label = sectionLabels[section] || section;

  const k5Icons = SECTION_ICONS_K5[section] || SECTION_ICONS_K5['about-you'];
  const icons68 = SECTION_ICONS_68[section] || SECTION_ICONS_68['about-you'];

  const { title, subtitle } = useMemo(() => {
    if (!isK5) {
      if (section === 'about-you') return { title: 'About you', subtitle: 'One question.' };
      if (section === 'breakfast') return { title: 'Breakfast', subtitle: 'About breakfast at school.' };
      if (section === 'lunch') return { title: 'Lunch', subtitle: 'About lunch at school.' };
      if (section === 'your-meals') return { title: 'The food and cafeteria', subtitle: 'Rate each statement.' };
      if (section === 'your-ideas') return { title: 'Your ideas', subtitle: 'Last part.' };
      return { title: label, subtitle: '' };
    }

    if (section === 'about-you') return { title: 'First, a question about you', subtitle: 'Just one!' };
    if (section === 'breakfast') {
      if (questionCount <= 1) return { title: "Now let's talk about breakfast", subtitle: 'A quick question about breakfast.' };
      return { title: "Now let's talk about breakfast", subtitle: 'Some questions about breakfast at school.' };
    }
    if (section === 'lunch') {
      if (questionCount <= 1) return { title: "Now let's talk about lunch", subtitle: 'A quick question about lunch.' };
      return { title: "Now let's talk about lunch", subtitle: 'Some questions about lunch at school.' };
    }
    if (section === 'your-meals') return { title: 'How is the food?', subtitle: 'Tell us what you think. Tap a face for each one.' };
    if (section === 'your-ideas') return { title: 'How is the food?', subtitle: "Almost done. Tell us what you'd like." };
    return { title: label, subtitle: '' };
  }, [section, isK5, questionCount, label]);

  const readAloudContent = useMemo(() => {
    return `${title}. ${subtitle}. ${questionCount} question${questionCount !== 1 ? 's' : ''} in this part.`;
  }, [title, subtitle, questionCount]);

  if (!isK5) {
    return (
      <div className="min-h-screen flex flex-col bg-canvas">
        <div className="w-full bg-canvas">
          <div className="w-full max-w-[520px] mx-auto px-5 pt-5 pb-2 flex items-start justify-between">
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
                  {gradeBandDisplay || 'Grades 6–8'}
                </span>
              </div>
            </div>
            <ReadAloudButton content={readAloudContent} iconOnly={true} />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-start pt-12 md:pt-16 px-5 pb-12">
          <div className="w-full max-w-[380px] text-center">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${icons68.bg} ${icons68.glow}`}
            >
              <span className="w-7 h-7 flex items-center justify-center">
                <i className={`${icons68.icon} text-[24px] ${icons68.color}`}></i>
              </span>
            </div>

            <h2
              className="text-[22px] sm:text-[24px] font-bold mb-2 text-ink leading-[1.2]"
            >
              {title}
            </h2>

            <p className="text-[15px] mb-1 text-muted">
              {subtitle}
            </p>

            <p className="text-[13px] font-medium mb-8 text-subtle">
              {questionCount} question{questionCount !== 1 ? 's' : ''}
            </p>

            <button
              onClick={onContinue}
              className="w-full max-w-[335px] py-2 gap-3 rotate-0 opacity-100 rounded-[81px] mx-auto text-white font-sans font-bold text-[17px] sm:text-[18px] flex items-center justify-center bg-sage transition-all duration-150 hover:opacity-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 cursor-pointer shadow-none"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      {/* Header bar at the top */}
      <div className="w-full bg-canvas">
        <div className="w-full max-w-[520px] mx-auto px-5 pt-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {schoolLogoUrl ? (
              <img
                src={schoolLogoUrl}
                alt={`${schoolName || 'School'} logo`}
                className="h-8 w-auto object-contain flex-shrink-0"
              />
            ) : (
              <span className="text-[14px] font-bold text-sage truncate">
                {schoolName || 'North Hills Elementary'}
              </span>
            )}
          </div>
          <ReadAloudButton content={readAloudContent} iconOnly={true} />
        </div>
      </div>

      {/* Main content shifted up */}
      <div className="flex-1 flex flex-col items-center justify-start pt-12 md:pt-16 px-5 pb-12">
        <div className="w-full max-w-[420px] text-center">
          {section === 'breakfast' ? (
            <img
              src="/breakfast.png"
              alt="Breakfast"
              width={96}
              height={96}
              className="w-[96px] h-[96px] rounded-full rotate-0 opacity-100 object-cover mx-auto mb-5 animate-fade-in"
            />
          ) : section === 'lunch' ? (
            <img
              src="/lunch.png"
              alt="Lunch"
              width={96}
              height={96}
              className="w-[96px] h-[96px] rounded-full rotate-0 opacity-100 object-cover mx-auto mb-5 animate-fade-in"
            />
          ) : section === 'your-ideas' ? (
            <img
              src="/ideas-k-5.png"
              alt={k5Icons.alt}
              width={96}
              height={96}
              className="w-[96px] h-[96px] rounded-full rotate-0 opacity-100 object-cover mx-auto mb-5 animate-fade-in"
            />
          ) : (
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 ${k5Icons.gradient} ${k5Icons.glow}`}
            >
              <span className="text-[44px] leading-none" role="img" aria-label={k5Icons.alt}>
                {k5Icons.emoji}
              </span>
            </div>
          )}

          <span
            className="inline-block rounded-full px-4 py-1.5 text-[13px] font-semibold mb-4 bg-sage-100 text-sage"
          >
            {label}
          </span>

          <h2
            className="text-[22px] sm:text-[28px] font-bold mb-2 text-ink leading-[1.2]"
          >
            {title}
          </h2>

          <p className="text-[18px] mb-3 text-muted">
            {subtitle}
          </p>

          <p className="text-[15px] font-medium mb-6 text-[#9A9A9A]">
            {questionCount} question{questionCount !== 1 ? 's' : ''}
          </p>

          <div className="flex flex-col gap-3 items-center">
            <button
              onClick={onContinue}
              className="w-full max-w-[335px] py-2 gap-3 rotate-0 opacity-100 rounded-[81px] mx-auto text-white font-sans font-bold text-[17px] sm:text-[18px] flex items-center justify-center bg-sage transition-all duration-150 hover:opacity-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 shadow-none"
            >
              Let&apos;s go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}