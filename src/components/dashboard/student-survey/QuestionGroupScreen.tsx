'use client';

import { SurveyQuestion, SurveyInstrument } from '@/lib/surveyInstruments';
import { SurveyScreen, isScreenFullyAnswered } from '@/lib/surveyScreenBuilder';
import SectionHeader from './SectionHeader';
import ThreePointBlock from './ThreePointBlock';
import ReadAloudButton from './ReadAloudButton';
import { useRef, useEffect, useState } from 'react';
import StudentPrivacyNotice from './StudentPrivacyNotice';
import StudentAccessibilityNotice from './StudentAccessibilityNotice';
import { barWidthClass } from '@/utils/barWidth';

interface QuestionGroupScreenProps {
  screen: SurveyScreen;
  instrument: SurveyInstrument;
  answers: Record<string, string>;
  multiAnswers: Record<string, string[]>;
  otherValues: Record<string, string>;
  onAnswer: (questionId: string, value: string) => void;
  onMultiAnswer: (questionId: string, selected: string[], otherText: string) => void;
  onContinue: () => void;
  onBack: () => void;
  onSkip: () => void;
  isFirstScreen: boolean;
  isLastScreen: boolean;
  validationError: boolean;
  screenIndex: number;
  totalScreens: number;
  timeRemaining: string;
  progressPercent: number;
  previousSection: string;
  schoolName?: string;
  schoolLogoUrl?: string;
}

const DAY_OPTIONS = [
  { value: '0', label: '0 days' },
  { value: '1', label: '1 day' },
  { value: '2', label: '2 days' },
  { value: '3', label: '3 days' },
  { value: '4', label: '4 days' },
  { value: '5', label: '5 days' },
];

const DIETARY_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'no-restrictions', label: "I don't have any dietary restrictions" },
];

export default function QuestionGroupScreen({
  screen,
  instrument,
  answers,
  multiAnswers,
  otherValues,
  onAnswer,
  onMultiAnswer,
  onContinue,
  onBack,
  onSkip,
  isFirstScreen,
  isLastScreen,
  validationError,
  screenIndex,
  totalScreens,
  timeRemaining,
  progressPercent,
  previousSection,
  schoolName,
  schoolLogoUrl,
}: QuestionGroupScreenProps) {
  const { allAnswered, unansweredCount, unansweredIds } = isScreenFullyAnswered(screen, answers, multiAnswers);

  const canAdvance = allAnswered;
  const hasOpenEnded = screen.questions.some((q) => q.type === 'open-ended');
  const isRatingGroup = screen.isRatingGroup && screen.questions.length > 1;
  const isGradeScreen = instrument.gradeBand === '9-12' && screen.questions.some((q) => q.type === 'grade');
  const [localValidation, setLocalValidation] = useState(false);

  const showSectionHeader = previousSection && previousSection !== screen.section;

  const readAloudContent = screen.questions
    .map((q) => {
      let text = `${q.question}. ${q.helper || ''}`;
      if (q.type === 'grade' && instrument.gradeOptions) {
        text += ` Options: ${instrument.gradeOptions.map((g) => g.label || g.value).join(', ')}.`;
      } else if (q.type === 'frequency') {
        text += ` Options: 0 days, 1 day, 2 days, 3 days, 4 days, 5 days.`;
      } else if (q.type === 'three-point') {
        text += ` Options: Yes, Sometimes, No.`;
      } else if (q.options && q.options.length > 0) {
        text += ` Options: ${q.options.map((o) => o.label).join(', ')}.`;
      }
      return text;
    })
    .join(' ');

  const handleFrequencySelect = (qId: string, value: string) => {
    onAnswer(qId, value);
  };

  const handleMultiToggle = (q: SurveyQuestion, optValue: string) => {
    const current = multiAnswers[q.id] || [];
    const mutuallyExclusiveOption = q.options?.find((o) => o.mutuallyExclusive);
    const otherOption = q.options?.find((o) => o.hasOtherInput);
    const isMutuallyExclusiveSelected = mutuallyExclusiveOption && current.includes(mutuallyExclusiveOption.value);

    if (mutuallyExclusiveOption && optValue === mutuallyExclusiveOption.value) {
      if (isMutuallyExclusiveSelected) {
        onMultiAnswer(q.id, [], '');
      } else {
        onMultiAnswer(q.id, [optValue], otherValues[q.id] || '');
      }
      return;
    }

    if (mutuallyExclusiveOption && isMutuallyExclusiveSelected) {
      onMultiAnswer(q.id, [optValue], otherValues[q.id] || '');
      return;
    }

    const next = current.includes(optValue)
      ? current.filter((v) => v !== optValue)
      : [...current, optValue];

    const otherText = otherOption && !next.includes(otherOption.value)
      ? ''
      : (otherValues[q.id] || '');

    onMultiAnswer(q.id, next, otherText);
  };

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

function limitToMaxWords(text: string, maxWords: number = 10): string {
  const words = text.trim().split(/\s+/);
  if (!text.trim() || words.length <= maxWords) {
    return text;
  }
  let wordCount = 0;
  let cutoffIndex = text.length;
  const regex = /\S+/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    wordCount++;
    if (wordCount === maxWords) {
      cutoffIndex = match.index + match[0].length;
      break;
    }
  }
  return text.slice(0, cutoffIndex);
}

  const handleOtherChange = (qId: string, text: string) => {
    const limited = limitToMaxWords(text, 10);
    onMultiAnswer(qId, multiAnswers[qId] || [], limited);
  };

  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);

  const handleContinueClick = () => {
    if (allAnswered) {
      setLocalValidation(false);
      onContinue();
    } else {
      setLocalValidation(true);
    }
  };

  if (showPrivacyNotice) {
    return (
      <StudentPrivacyNotice
        is912={true}
        schoolName={schoolName}
        schoolLogoUrl={schoolLogoUrl}
        gradeBandDisplay={instrument.gradeBandDisplay}
        onBack={() => setShowPrivacyNotice(false)}
        onSwitchToAccessibility={() => {
          setShowPrivacyNotice(false);
          setShowAccessibility(true);
        }}
        isK5={false}
      />
    );
  }

  if (showAccessibility) {
    return (
      <StudentAccessibilityNotice
        schoolName={schoolName}
        schoolLogoUrl={schoolLogoUrl}
        gradeBandDisplay={instrument.gradeBandDisplay}
        onBack={() => setShowAccessibility(false)}
        onSwitchToPrivacy={() => {
          setShowAccessibility(false);
          setShowPrivacyNotice(true);
        }}
      />
    );
  }

  return (
    <div className="h-full min-h-0 flex flex-col bg-canvas">
      <header className="flex-none w-full px-5 pt-5 pb-3 bg-canvas">
        <div className="w-full max-w-[520px] md:max-w-[640px] mx-auto">
          {/* Row 1: School logo/name + Read Aloud button */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center min-w-0">
              {schoolLogoUrl ? (
                <img
                  src={schoolLogoUrl}
                  alt={`${schoolName || 'School'} logo`}
                  className="h-8 w-auto object-contain flex-shrink-0"
                />
              ) : (
                <span className="text-[14px] font-bold text-sage truncate">
                  {schoolName || ''}
                </span>
              )}
            </div>
            <ReadAloudButton content={readAloudContent} iconOnly={true} />
          </div>

          {/* Row 2: Grade band (left) + Time remaining only on grade screen (right) */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="inline-block rounded-full px-3 py-0.5 text-[12px] font-semibold bg-sage-100 text-sage whitespace-nowrap"
            >
              {instrument.gradeBandDisplay}
            </span>
            {isGradeScreen && (
              <span className="text-[13px] font-medium text-muted whitespace-nowrap">
                {timeRemaining}
              </span>
            )}
          </div>

          {/* Row 3: Section label (left) + Question count (right) */}
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-[13px] font-medium text-[#9A9A9A]"
            >
              {screen.sectionLabel}
            </span>
            <span className="text-[13px] font-semibold text-sage">
              Question {screenIndex + 1} of {totalScreens}
            </span>
          </div>

          <div
            className="w-full h-2 rounded-full overflow-hidden bg-line mb-1"
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out bg-[linear-gradient(90deg,_#7a9a65,_#586d4d)] ${barWidthClass(progressPercent)}`}
            />
          </div>

          <div className="flex justify-end">
            <span className="text-[11px] font-medium text-[#c4c4c4]">
              {progressPercent}%
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full max-w-[520px] md:max-w-[640px] mx-auto px-5 pt-4 pb-2">

        {isRatingGroup && (
          <p
            className="text-[12px] font-medium mb-5 text-muted"
          >
            Select one for each.
          </p>
        )}

        <div className={isRatingGroup ? 'space-y-5' : 'space-y-0'}>
          {screen.questions.map((q, idx) => {
            if (q.type === 'three-point') {
              return (
                <div key={q.id}>
                  <ThreePointBlock
                    question={q.question}
                    questionId={q.id}
                    value={answers[q.id] || ''}
                    onChange={(val) => onAnswer(q.id, val)}
                    highlightUnanswered={localValidation && unansweredIds.includes(q.id)}
                  />
                  {idx < screen.questions.length - 1 && (
                    <div className="mt-5 border-t border-line" />
                  )}
                </div>
              );
            }

            if (q.type === 'frequency') {
              return (
                <div key={q.id}>
                  <h1
                    className="text-[22px] font-bold mb-1 text-ink leading-[1.25]"
                  >
                    {q.question}
                  </h1>
                  {q.helper && (
                    <p className="text-[14px] mt-1 mb-5 text-muted">
                      {q.helper}
                    </p>
                  )}
                  <div className="flex flex-col gap-2" role="radiogroup" aria-label={q.question}>
                    {DAY_OPTIONS.map((opt) => {
                      const isSelected = (answers[q.id] || '') === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleFrequencySelect(q.id, opt.value)}
                          className={`w-full rounded-[16px] px-4 transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.99] cursor-pointer min-h-[44px] ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border-[1.5px] border-line'}`}
                          role="radio"
                          aria-checked={isSelected}
                        >
                          <div className="flex items-center py-3">
                            <span
                              className={`text-[15px] font-medium ${isSelected ? 'text-sage' : 'text-ink'}`}
                            >
                              {opt.label}
                            </span>
                            {isSelected && (
                              <span
                                className="ml-auto w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-sage"
                              >
                                <i className="ri-check-line text-[12px] text-white"></i>
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (q.type === 'grade') {
              return (
                <div key={q.id}>
                  <h1
                    className="text-[22px] font-bold mb-1 text-ink leading-[1.25]"
                  >
                    {q.question}
                  </h1>
                  <div className="grid grid-cols-4 gap-2 mt-5" role="radiogroup" aria-label="What grade are you in?">
                    {instrument.gradeOptions.map((opt) => {
                      const isSelected = (answers[q.id] || '') === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => onAnswer(q.id, opt.value)}
                          className={`relative rounded-[16px] flex items-center justify-center transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.99] cursor-pointer min-h-[64px] ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border-[1.5px] border-line'}`}
                          role="radio"
                          aria-checked={isSelected}
                        >
                          <span
                            className={`text-[24px] font-bold ${isSelected ? 'text-sage' : 'text-ink'}`}
                          >
                            {opt.value}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {q.privacyNote && (
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 mt-4 bg-sage-100"
                    >
                      <span className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-shield-check-line text-[12px] text-sage"></i>
                      </span>
                      <span className="text-[13px] leading-[19.5px] tracking-[0px] font-medium text-sage align-middle font-sans">
                        {q.privacyNote}
                      </span>
                    </div>
                  )}
                </div>
              );
            }

            if (q.type === 'dietary') {
              return (
                <div key={q.id}>
                  <h1
                    className="text-[22px] font-bold mb-1 text-ink leading-[1.25]"
                  >
                    {q.question}
                  </h1>
                  <div
                    className="rounded-[12px] p-4 mt-5 bg-[#faf8fe] border border-[#e9e0f5]"
                    role="radiogroup"
                    aria-label={q.question}
                  >
                    <div
                      className="flex items-center gap-2 mb-3 pb-3 border-b border-dashed border-b-[#d4d0c9]"
                    >
                      <span
                        className="w-4 h-4 flex items-center justify-center rounded-md bg-iris-50"
                      >
                        <i className="ri-information-line text-[12px] text-iris"></i>
                      </span>
                      <span
                        className="text-[12px] font-medium text-iris"
                      >
                        This question is a bit different
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {DIETARY_OPTIONS.map((opt) => {
                        const isSelected = (answers[q.id] || '') === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => onAnswer(q.id, opt.value)}
                            className={`w-full text-left rounded-[16px] transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.99] cursor-pointer ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border-[1.5px] border-line'}`}
                            role="radio"
                            aria-checked={isSelected}
                          >
                            <div className="flex items-center gap-3 px-4 py-3">
                              <span
                                className={`text-[15px] font-medium leading-snug flex-1 break-words leading-[1.35] ${isSelected ? 'text-sage' : 'text-ink'}`}
                              >
                                {opt.label}
                              </span>
                              {isSelected && (
                                <span
                                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-sage"
                                >
                                  <i className="ri-check-line text-[12px] text-white"></i>
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            if (q.type === 'multi-select') {
              const selected = multiAnswers[q.id] || [];
              const otherOpt = q.options?.find((o) => o.hasOtherInput);
              const isOtherSelected = otherOpt && selected.includes(otherOpt.value);
              const otherText = otherValues[q.id] || '';

              return (
                <div key={q.id}>
                  <h1
                    className="text-[22px] font-bold mb-1 text-ink leading-[1.25]"
                  >
                    {q.question}
                  </h1>
                  {q.helper && (
                    <p className="text-[14px] mt-1 mb-5 text-muted">
                      {q.helper}
                    </p>
                  )}
                  <div className="flex flex-col gap-2" role="group" aria-label={q.question}>
                    {(q.options || []).map((opt) => {
                      const isSelected = selected.includes(opt.value);
                      return (
                        <div key={opt.value}>
                          <button
                            onClick={() => handleMultiToggle(q, opt.value)}
                            className={`w-full text-left rounded-[16px] transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 active:scale-[0.99] cursor-pointer min-h-[44px] ${isSelected ? 'bg-sage-50' : 'bg-white'} ${isSelected ? 'border-2 border-sage' : 'border-[1.5px] border-line'}`}
                            role="checkbox"
                            aria-checked={isSelected}
                          >
                            <div className="flex items-start gap-3 px-4 py-3">
                              <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-100 ${isSelected ? 'bg-sage' : 'bg-[#f0ede8]'} ${isSelected ? 'border-2 border-sage' : 'border border-[#d6d2c8]'}`}
                              >
                                {isSelected && (
                                  <i className="ri-check-line text-[12px] text-white"></i>
                                )}
                              </span>
                              <span
                                className={`text-[15px] font-medium leading-snug break-words ${isSelected ? 'text-sage' : 'text-ink'}`}
                              >
                                {opt.label}
                              </span>
                            </div>
                          </button>

                          {opt.hasOtherInput && isOtherSelected && (
                            <div className="mt-2">
                              <div
                                className="rounded-[12px] overflow-hidden bg-white border-[1.5px] border-line"
                              >
                                <textarea
                                  value={otherText}
                                  onChange={(e) => handleOtherChange(q.id, e.target.value)}
                                  placeholder="Tell us more..."
                                  aria-label={`Other: ${q.question}`}
                                  rows={3}
                                  className="w-full p-4 leading-relaxed resize-none focus:outline-none text-[15px] text-ink bg-transparent border-0"
                                />
                                <div
                                  className="flex items-center justify-between px-4 py-2.5 border-t border-t-[#f0eee9] bg-canvas"
                                >
                                  <span className="text-[11px] font-medium text-sage">
                                    Don&apos;t include your name or anyone else&apos;s
                                  </span>
                                  <span className="text-[11px] font-medium text-subtle">
                                    {countWords(otherText)} / 10
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (q.type === 'open-ended') {
              const val = answers[q.id] || '';
              const wordCount = countWords(val);
              const nearLimit = wordCount >= 8;

              return (
                <div key={q.id}>
                  <h1
                    className="text-[22px] font-bold mb-1 text-ink leading-[1.25]"
                  >
                    {q.question}
                  </h1>
                  {q.helper && (
                    <p className="text-[14px] mt-1 mb-5 text-muted">
                      {q.helper}
                    </p>
                  )}
                  <div
                    className="rounded-[12px] overflow-hidden bg-white border-[1.5px] border-line"
                  >
                    <textarea
                      value={val}
                      onChange={(e) => onAnswer(q.id, limitToMaxWords(e.target.value, 10))}
                      placeholder="Type your answer..."
                      aria-label={q.question}
                      rows={4}
                      className="w-full p-5 leading-relaxed resize-none focus:outline-none text-[15px] text-ink bg-transparent border-0 leading-[1.6]"
                    />
                    <div
                      className="flex items-center justify-between px-4 py-2.5 border-t border-t-[#f0eee9] bg-canvas"
                    >
                      {q.anonymityReminder ? (
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-shield-check-line text-[12px] text-sage"></i>
                          </span>
                          <span className="text-[12px] font-medium text-sage">
                            {q.anonymityReminder}
                          </span>
                        </div>
                      ) : (
                        <span />
                      )}
                      <span
                        className={`text-[12px] font-medium tabular-nums ${nearLimit ? 'text-[#b45309]' : 'text-subtle'}`}
                      >
                        {wordCount} / 10
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>

        <div className="mt-3 min-h-[28px]" role="status" aria-live="polite">
          {localValidation && !allAnswered && (
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-error-warning-line text-iris"></i>
              </span>
              <span className="text-[13px] font-medium text-iris">
                {unansweredCount} question{unansweredCount !== 1 ? 's' : ''} left on this screen.
              </span>
            </div>
          )}
        </div>
      </main>

      <footer className="flex-none w-full max-w-[520px] md:max-w-[640px] mx-auto px-5 pt-3 pb-5">
          <div className="flex flex-col gap-2.5">
            {hasOpenEnded && !canAdvance ? (
              <div className="flex gap-3 w-full max-w-[335px] mx-auto">
                <button
                  onClick={onSkip}
                  className="w-[161.5px] flex-1 py-2 px-5 gap-2 rotate-0 opacity-100 rounded-[9999px] text-[17px] sm:text-[18px] font-bold text-sage bg-white border-2 border-[#D6E0D2] whitespace-nowrap transition-all duration-150 hover:opacity-80 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 cursor-pointer flex items-center justify-center"
                >
                  Skip
                </button>
                <button
                  onClick={handleContinueClick}
                  className={`w-[161.5px] flex-1 py-2 gap-3 rotate-0 opacity-100 rounded-[81px] text-[17px] sm:text-[18px] font-bold text-white whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 cursor-pointer flex items-center justify-center ${
                    canAdvance ? 'hover:opacity-95 active:scale-[0.98] bg-sage' : 'bg-sage-300'
                  }`}
                >
                  Continue
                </button>
              </div>
            ) : (
              <button
                onClick={handleContinueClick}
                className={`w-full max-w-[335px] py-2 gap-3 rotate-0 opacity-100 rounded-[81px] mx-auto text-white font-sans font-bold text-[17px] sm:text-[18px] flex items-center justify-center whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 cursor-pointer ${
                  canAdvance ? 'hover:opacity-95 active:scale-[0.98] bg-sage' : 'bg-sage-300'
                }`}
              >
                {isLastScreen ? 'Review answers' : 'Continue'}
              </button>
            )}

            {!isFirstScreen && (
              <button
                onClick={onBack}
                className="w-full max-w-[335px] py-2 px-5 gap-2 rotate-0 opacity-100 rounded-full mx-auto text-sage font-sans font-bold text-[17px] sm:text-[18px] flex items-center justify-center bg-sage-50 border border-[#D6E0D2] transition-all duration-150 hover:opacity-80 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 cursor-pointer shadow-none"
              >
                Back
              </button>
            )}
          </div>
          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              onClick={() => setShowPrivacyNotice(true)}
              className="text-[12px] font-medium whitespace-nowrap transition-opacity duration-100 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded cursor-pointer text-iris"
            >
              Privacy
            </button>
            <button
              onClick={() => setShowAccessibility(true)}
              className="text-[12px] font-medium whitespace-nowrap transition-opacity duration-100 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded cursor-pointer text-iris"
            >
              Accessibility
            </button>
          </div>
      </footer>
    </div>
  );
}