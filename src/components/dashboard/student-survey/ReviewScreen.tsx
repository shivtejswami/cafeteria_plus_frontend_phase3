'use client';

import { useState, useMemo, useCallback } from 'react';
import { SurveyQuestion, SurveyInstrument, sectionLabels } from '@/lib/surveyInstruments';
import ReadAloudButton from './ReadAloudButton';
import RatingReviewBlock from './RatingReviewBlock';
import StudentPrivacyNotice from './StudentPrivacyNotice';
import StudentAccessibilityNotice from './StudentAccessibilityNotice';

interface ReviewScreenProps {
  instrument: SurveyInstrument;
  visibleQuestions: SurveyQuestion[];
  answers: Record<string, string>;
  multiAnswers: Record<string, string[]>;
  otherValues: Record<string, string>;
  onJumpTo: (index: number) => void;
  onSubmit: () => void;
  onBackToSurvey: () => void;
  isK5: boolean;
  isSubmitting: boolean;
  sendFailed: boolean;
  rateLimitSeconds: number;
  onRetry: () => void;
  schoolName?: string;
  schoolLogoUrl?: string;
}

const reviewSectionLabels912: Record<string, string> = {
  'about-you': 'About you',
  'breakfast': 'Breakfast',
  'lunch': 'Lunch',
  'your-meals': 'Your meals',
  'your-ideas': 'Your ideas',
};

function getAnswerWord(answers: Record<string, string>, qId: string): string {
  const a = answers[qId] || '';
  return a;
}

function getDisplayAnswer(
  q: SurveyQuestion,
  instrument: SurveyInstrument,
  answers: Record<string, string>,
  multiAnswers: Record<string, string[]>,
  otherValues: Record<string, string>,
  isK5: boolean
): { text: string; emoji?: string; isEmpty: boolean } {
  if (q.type === 'multi-select') {
    const selected = multiAnswers[q.id] || [];
    if (selected.length === 0) {
      return { text: 'Skipped', isEmpty: true };
    }
    const parts = selected.map((v) => {
      const opt = q.options?.find((o) => o.value === v);
      if (opt?.hasOtherInput) {
        const other = otherValues[q.id] || '';
        return other ? `${opt.label}: ${other}` : opt.label;
      }
      return opt?.label || v;
    });
    return { text: parts.join(', '), isEmpty: false };
  }

  const answer = answers[q.id] || '';
  if (!answer) {
    return { text: 'Skipped', isEmpty: true };
  }

  if (q.type === 'grade') {
    const opt = instrument.gradeOptions.find((g) => g.value === answer);
    return { text: opt?.value || answer, isEmpty: false };
  }

  if (q.type === 'three-point') {
    if (isK5) {
      switch (answer) {
        case 'yes': return { text: 'Yes', emoji: '\uD83D\uDE42', isEmpty: false };
        case 'sometimes': return { text: 'Sometimes', emoji: '\uD83D\uDE10', isEmpty: false };
        case 'no': return { text: 'No', emoji: '\uD83D\uDE41', isEmpty: false };
        default: return { text: answer, isEmpty: false };
      }
    }
    switch (answer) {
      case 'yes': return { text: 'Yes', isEmpty: false };
      case 'sometimes': return { text: 'Sometimes', isEmpty: false };
      case 'no': return { text: 'No', isEmpty: false };
      default: return { text: answer, isEmpty: false };
    }
  }

  if (q.type === 'frequency') {
    const num = parseInt(answer);
    return { text: `${num} day${num === 1 ? '' : 's'}`, isEmpty: false };
  }

  if (q.type === 'dietary') {
    switch (answer) {
      case 'yes': return { text: 'Yes', isEmpty: false };
      case 'no': return { text: 'No', isEmpty: false };
      case 'no-restrictions': return { text: "I don't have any dietary restrictions", isEmpty: false };
      default: return { text: answer, isEmpty: false };
    }
  }

  return { text: answer, isEmpty: false };
}

function PencilIcon() {
  return (
    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M10.1502 6.0498L9.2627 5.1623L3.4502 10.9873V11.8623H4.3252L10.1502 6.0498ZM11.0377 5.1623L11.9252 4.2748L11.0377 3.3873L10.1502 4.2748L11.0377 5.1623ZM4.8502 13.1123H2.2002V10.4623L10.5877 2.0623C10.7127 1.94564 10.8627 1.8873 11.0377 1.8873C11.2127 1.8873 11.3585 1.94564 11.4752 2.0623L13.2502 3.8373C13.3669 3.95397 13.4252 4.0998 13.4252 4.2748C13.4252 4.4498 13.3669 4.5998 13.2502 4.7248L4.8502 13.1123Z"
        fill="currentColor"
      />
    </svg>
  );
}

function buildReadAloudContent(
  visibleQuestions: SurveyQuestion[],
  instrument: SurveyInstrument,
  answers: Record<string, string>,
  multiAnswers: Record<string, string[]>,
  otherValues: Record<string, string>
): string {
  const parts: string[] = ['Check your answers. Look at what you picked. Tap Change if you want to pick something else.'];
  const sectionOrder = ['about-you', 'breakfast', 'lunch', 'your-meals', 'your-ideas'];

  sectionOrder.forEach((sectionKey) => {
    const qs = visibleQuestions.filter((q) => q.section === sectionKey);
    if (qs.length === 0) return;
    const label = sectionLabels[sectionKey] || sectionKey;
    parts.push(`Section: ${label}.`);
    qs.forEach((q) => {
      const result = getDisplayAnswer(q, instrument, answers, multiAnswers, otherValues, true);
      parts.push(`Question: ${q.question}. Your answer: ${result.text}.`);
    });
  });

  return parts.join(' ');
}

export default function ReviewScreen({
  instrument,
  visibleQuestions,
  answers,
  multiAnswers,
  otherValues,
  onJumpTo,
  onSubmit,
  onBackToSurvey,
  isK5,
  isSubmitting,
  sendFailed,
  rateLimitSeconds,
  onRetry,
  schoolName,
  schoolLogoUrl,
}: ReviewScreenProps) {
  const [openEndedExpanded, setOpenEndedExpanded] = useState<Record<string, boolean>>({});
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);

  const is912 = instrument.gradeBand === '9-12';

  if (showPrivacyNotice) {
    return (
      <StudentPrivacyNotice
        is912={is912}
        schoolName={schoolName}
        schoolLogoUrl={schoolLogoUrl}
        gradeBandDisplay={instrument.gradeBandDisplay}
        onBack={() => setShowPrivacyNotice(false)}
        onSwitchToAccessibility={() => {
          setShowPrivacyNotice(false);
          setShowAccessibility(true);
        }}
        isK5={isK5}
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

  const sections = useMemo(() => {
    const map: Record<string, SurveyQuestion[]> = {};
    visibleQuestions.forEach((q) => {
      if (!map[q.section]) map[q.section] = [];
      map[q.section].push(q);
    });
    return map;
  }, [visibleQuestions]);

  const sectionOrder = ['about-you', 'breakfast', 'lunch', 'your-meals', 'your-ideas'];

  const answeredCount = useMemo(() => {
    return visibleQuestions.filter((q) => {
      if (q.type === 'multi-select') return (multiAnswers[q.id] || []).length > 0;
      return (answers[q.id] || '').trim().length > 0;
    }).length;
  }, [visibleQuestions, answers, multiAnswers]);

  const readAloudContent = useMemo(
    () => buildReadAloudContent(visibleQuestions, instrument, answers, multiAnswers, otherValues),
    [visibleQuestions, instrument, answers, multiAnswers, otherValues]
  );

  const toggleExpand = useCallback((qId: string) => {
    setOpenEndedExpanded((prev) => ({ ...prev, [qId]: !prev[qId] }));
  }, []);

  const handleJumpToQuestion = useCallback((q: SurveyQuestion) => {
    const idx = visibleQuestions.indexOf(q);
    if (idx >= 0) onJumpTo(idx);
  }, [visibleQuestions, onJumpTo]);

  const normalizeLabel = (key: string): string => {
    if (is912) return reviewSectionLabels912[key] || key;
    if (isK5) return sectionLabels[key] || key;
    if (key === 'your-meals') return 'Food and cafeteria';
    if (key === 'your-ideas') return 'Your feedback';
    return sectionLabels[key] || key;
  };

  const activeSectionLabels = is912 ? reviewSectionLabels912 : sectionLabels;

  if (is912) {
    return (
      <div className="h-full min-h-0 flex flex-col bg-canvas">
        <header className="flex-none w-full px-5 pt-5 pb-3 bg-canvas">
          <div className="w-full max-w-[580px] md:max-w-[640px] mx-auto flex items-start justify-between gap-4">
            <div className="flex flex-col items-start gap-1.5 min-w-0">
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
                <span
                  className="inline-block rounded-full px-3 py-0.5 text-[12px] font-semibold bg-sage-100 text-sage"
                >
                  {instrument.gradeBandDisplay}
                </span>
              </div>
            </div>
            <ReadAloudButton content={readAloudContent} iconOnly={true} />
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full max-w-[580px] md:max-w-[640px] mx-auto px-5 pt-2 pb-6">
          <h1
            className="text-[22px] font-bold text-ink leading-[1.2] mb-[2px]"
          >
            Review
          </h1>
          <div className="mb-5">
            <p className="font-['Roboto'] font-normal text-[15px] leading-[22.5px] tracking-[0px] align-middle text-muted">
              Check anything you want to change before you submit.
            </p>
          </div>

          <div className="space-y-6">
            {sectionOrder.map((sectionKey) => {
              const qs = sections[sectionKey];
              if (!qs || qs.length === 0) return null;
              const label = reviewSectionLabels912[sectionKey] || sectionKey;

              const ratingQs = qs.filter((q) => q.type === 'three-point');
              const nonRatingQs = qs.filter((q) => q.type !== 'three-point');

              return (
                <div key={sectionKey}>
                  <h2
                    className="text-[12px] font-semibold uppercase tracking-wide mb-2 px-1 text-subtle"
                  >
                    {label}
                  </h2>

                  {ratingQs.length > 0 && (
                    <div className="mb-3">
                      <RatingReviewBlock
                        questions={ratingQs}
                        answers={answers}
                        onJumpTo={handleJumpToQuestion}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    {nonRatingQs.map((q) => {
                      const visibleIndex = visibleQuestions.indexOf(q);
                      const result = getDisplayAnswer(q, instrument, answers, multiAnswers, otherValues, false);

                      if (q.type === 'multi-select' && !result.isEmpty) {
                        const selected = multiAnswers[q.id] || [];
                        return (
                          <div
                            key={q.id}
                            className="rounded-[14px] p-4 transition-colors duration-100 bg-white border border-line shadow-whisper"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <p
                                  className="text-[13px] font-medium mb-2 text-muted break-words leading-[1.35]"
                                >
                                  {q.question}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {selected.map((v) => {
                                    const opt = q.options?.find((o) => o.value === v);
                                    if (opt?.hasOtherInput) {
                                      const other = otherValues[q.id] || '';
                                      return (
                                        <span
                                          key={v}
                                          className="inline-block rounded-full px-3 py-1 text-[14px] font-medium bg-sage-50 text-sage border border-sage-200"
                                        >
                                          {other ? `${opt.label}: ${other}` : opt.label}
                                        </span>
                                      );
                                    }
                                    return (
                                      <span
                                        key={v}
                                        className="inline-block rounded-full px-3 py-1 text-[14px] font-medium bg-sage-50 text-sage border border-sage-200"
                                      >
                                        {opt?.label || v}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                              <button
                                onClick={() => onJumpTo(visibleIndex)}
                                className="flex-shrink-0 h-[44px] px-4 rounded-full text-[15px] font-semibold whitespace-nowrap transition-all duration-100 hover:opacity-90 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 cursor-pointer bg-iris-50 text-iris"
                                aria-label={`Change answer for: ${q.question}`}
                              >
                                Change
                              </button>
                            </div>
                          </div>
                        );
                      }

                      if (q.type === 'open-ended') {
                        const fullText = result.text;
                        const isEmpty = result.isEmpty;
                        const isLong = fullText.length > 120;
                        const isExpanded = openEndedExpanded[q.id];
                        const displayText = isLong && !isExpanded
                          ? fullText.substring(0, 120) + '...'
                          : fullText;

                        return (
                          <div
                            key={q.id}
                            className={`rounded-[14px] p-4 transition-colors duration-100 bg-white shadow-whisper ${isEmpty ? 'border border-dashed border-[#d4d0c9]' : 'border border-line'}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <p
                                  className="text-[13px] font-medium mb-2 text-muted break-words leading-[1.35]"
                                >
                                  {q.question}
                                </p>
                                {isEmpty ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[15px] text-subtle">Skipped</span>
                                    <button
                                      onClick={() => onJumpTo(visibleIndex)}
                                      className="text-[14px] font-semibold whitespace-nowrap transition-opacity duration-100 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded cursor-pointer text-sage"
                                    >
                                      Answer
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <p
                                      className="text-[15px] leading-relaxed text-ink-700 break-words"
                                    >
                                      {displayText}
                                    </p>
                                    {isLong && (
                                      <button
                                        onClick={() => toggleExpand(q.id)}
                                        className="text-[14px] font-semibold mt-1 whitespace-nowrap transition-opacity duration-100 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded cursor-pointer text-sage"
                                      >
                                        {isExpanded ? 'See less' : 'See all'}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => onJumpTo(visibleIndex)}
                                className="flex-shrink-0 h-[44px] px-4 rounded-full text-[15px] font-semibold whitespace-nowrap transition-all duration-100 hover:opacity-90 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 cursor-pointer bg-iris-50 text-iris"
                                aria-label={`Change answer for: ${q.question}`}
                              >
                                Change
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={q.id}
                          className={`rounded-[14px] p-4 transition-colors duration-100 bg-white shadow-whisper ${result.isEmpty ? 'border border-dashed border-[#d4d0c9]' : 'border border-line'}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p
                                className="text-[13px] font-medium mb-1.5 text-muted break-words leading-[1.35]"
                              >
                                {q.question}
                              </p>
                              <span
                                className={`text-[16px] font-semibold ${result.isEmpty ? 'text-subtle' : 'text-sage'}`}
                              >
                                {result.isEmpty ? 'Skipped' : result.text}
                              </span>
                            </div>
                            <button
                              onClick={() => onJumpTo(visibleIndex)}
                              className="flex-shrink-0 h-[44px] px-4 rounded-full text-[15px] font-semibold whitespace-nowrap transition-all duration-100 hover:opacity-90 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 cursor-pointer bg-iris-50 text-iris"
                              aria-label={`Change answer for: ${q.question}`}
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        <footer className="flex-none w-full px-5 pt-3 pb-8">
          <div className="w-full max-w-[580px] md:max-w-[640px] mx-auto">
            <div className="flex flex-col items-center gap-3">
              {sendFailed ? (
                <div className="text-center mb-1 w-full flex flex-col items-center">
                  <p className="text-[15px] font-medium mb-2 text-muted">
                    Didn&apos;t send. Check your connection and try again.
                  </p>
                  <button
                    onClick={onRetry}
                    className="w-full max-w-[335px] py-2 gap-3 rounded-[81px] text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap flex items-center justify-center transition-all duration-100 hover:opacity-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 cursor-pointer bg-sage"
                  >
                    Try again
                  </button>
                </div>
              ) : rateLimitSeconds > 0 ? (
                <div className="text-center mb-1 w-full flex flex-col items-center">
                  <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mx-auto mb-3 bg-[#fff3e0]">
                    <span className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-timer-line text-[22px] text-[#b45309]"></i>
                    </span>
                  </div>
                  <p className="text-[15px] font-semibold mb-1 text-ink">Too many attempts</p>
                  <p className="text-[14px] mb-1 text-muted">Try again in {rateLimitSeconds}s.</p>
                  <button
                    disabled
                    className="w-full max-w-[335px] py-2 gap-3 rounded-[81px] text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap flex items-center justify-center bg-sage-300"
                  >
                    Submit
                  </button>
                </div>
              ) : isSubmitting ? (
                <button
                  disabled
                  className="w-full max-w-[335px] py-2 gap-3 rounded-[81px] text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap flex items-center justify-center bg-sage opacity-85"
                >
                  <span
                    className="w-4 h-4 rounded-full border-2 animate-spin inline-block border-[rgba(255,255,255,0.3)] border-t-white"
                    aria-hidden="true"
                  ></span>
                  Submitting...
                </button>
              ) : (
                <button
                  onClick={onSubmit}
                  className="w-full max-w-[335px] py-2 gap-3 rounded-[81px] text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap flex items-center justify-center transition-all duration-100 hover:opacity-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 cursor-pointer bg-sage"
                >
                  Submit
                </button>
              )}

              {!isSubmitting && !rateLimitSeconds && !sendFailed && (
                <button
                  onClick={onBackToSurvey}
                  className="w-full max-w-[335px] py-2 px-5 gap-2 rounded-[9999px] border border-[#D6E0D2] text-sage bg-sage-50 text-[17px] sm:text-[18px] font-bold whitespace-nowrap flex items-center justify-center transition-all duration-100 hover:opacity-80 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 cursor-pointer"
                >
                  Back
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (!isK5) {
    return (
      <div className="h-full min-h-0 flex flex-col bg-canvas">
        <header className="flex-none w-full px-5 pt-5 pb-3 bg-canvas">
          <div className="w-full max-w-[580px] mx-auto">
            <div className="flex items-start justify-between gap-4">
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
                  <span
                    className="inline-block rounded-full px-3 py-0.5 text-[12px] font-semibold bg-sage-100 text-sage"
                  >
                    {instrument.gradeBandDisplay}
                  </span>
                </div>
              </div>
              <ReadAloudButton content={readAloudContent} iconOnly={true} />
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full max-w-[580px] mx-auto px-5 pt-2 pb-6">
          <h1
            className="text-[22px] sm:text-[24px] font-bold text-ink leading-[1.2] mb-[2px]"
          >
            Review your answers
          </h1>
          <div className="flex items-center gap-3 mb-5">
            <p className="text-[15px] text-muted">
              Check anything you want to change before you submit.
            </p>
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-[13px] font-medium bg-sage-100 text-sage"
            >
              {answeredCount} {answeredCount === 1 ? 'answer' : 'answers'}
            </span>
          </div>

          <div className="space-y-5">
            {sectionOrder.map((sectionKey) => {
              const qs = sections[sectionKey];
              if (!qs || qs.length === 0) return null;
              const label = normalizeLabel(sectionKey);

              if (sectionKey === 'your-meals') {
                return (
                  <div key={sectionKey}>
                    <h2
                      className="text-[12px] font-semibold uppercase tracking-wide mb-2 px-1 text-subtle"
                    >
                      {label}
                    </h2>
                    <div
                      className="rounded-xl overflow-hidden bg-white border border-line shadow-whisper"
                    >
                      {qs.map((q, idx) => {
                        const visibleIndex = visibleQuestions.indexOf(q);
                        const isDietary = q.type === 'dietary';
                        const answerWord = isDietary
                          ? (() => {
                              const a = answers[q.id] || '';
                              switch (a) {
                                case 'yes': return 'Yes';
                                case 'no': return 'No';
                                case 'no-restrictions': return "I don't have any dietary restrictions";
                                default: return '\u2014';
                              }
                            })()
                          : (() => {
                              const a = answers[q.id] || '';
                              switch (a) {
                                case 'yes': return 'Yes';
                                case 'sometimes': return 'Sometimes';
                                case 'no': return 'No';
                                default: return '\u2014';
                              }
                            })();
                        const isUnanswered = answerWord === '\u2014';

                        return (
                          <div
                            key={q.id}
                            className={`flex items-center gap-3 px-4 py-3 transition-colors duration-100 hover:bg-[#fafaf8] ${idx < qs.length - 1 ? 'border-b border-b-[#f0ede7]' : 'border-borderBottom-0'}`}
                          >
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-[14px] leading-snug line-clamp-2 text-ink break-words"
                                title={q.question}
                              >
                                {q.question}
                              </p>
                            </div>

                            {isDietary ? (
                              <div className="flex items-center gap-2 flex-shrink-0 max-w-[180px]">
                                <span
                                  className={`text-[15px] font-semibold text-right leading-snug break-words ${isUnanswered ? 'text-subtle' : 'text-sage'}`}
                                >
                                  {isUnanswered ? 'Not answered' : answerWord}
                                </span>
                                <button
                                  onClick={() => onJumpTo(visibleIndex)}
                                  className="flex items-center justify-center w-[36px] h-[36px] rounded-full flex-shrink-0 transition-all duration-150 hover:opacity-80 active:scale-[0.95] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 cursor-pointer bg-iris-50 text-iris"
                                  aria-label={`Change answer for: ${q.question}`}
                                >
                                  <span className="w-4 h-4 flex items-center justify-center">
                                    <PencilIcon />
                                  </span>
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span
                                  className={`text-[15px] font-semibold whitespace-nowrap ${isUnanswered ? 'text-subtle' : 'text-sage'}`}
                                >
                                  {isUnanswered ? '\u2014' : answerWord}
                                </span>
                                <button
                                  onClick={() => onJumpTo(visibleIndex)}
                                  className="flex items-center justify-center w-[36px] h-[36px] rounded-full flex-shrink-0 transition-all duration-150 hover:opacity-80 active:scale-[0.95] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 cursor-pointer bg-iris-50 text-iris"
                                  aria-label={`Change answer for: ${q.question}`}
                                >
                                  <span className="w-4 h-4 flex items-center justify-center">
                                    <PencilIcon />
                                  </span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <div key={sectionKey}>
                  <h2
                    className="text-[12px] font-semibold uppercase tracking-wide mb-2 px-1 text-subtle"
                  >
                    {label}
                  </h2>
                  <div className="space-y-2">
                    {qs.map((q) => {
                      const visibleIndex = visibleQuestions.indexOf(q);
                      const result = getDisplayAnswer(q, instrument, answers, multiAnswers, otherValues, false);

                      if (q.type === 'multi-select' && !result.isEmpty) {
                        const selected = multiAnswers[q.id] || [];
                        return (
                          <div
                            key={q.id}
                            className="rounded-xl p-4 bg-white border border-line shadow-whisper"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <p
                                  className="text-[15px] font-medium mb-2 text-muted break-words leading-[1.35]"
                                >
                                  {q.question}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {selected.map((v) => {
                                    const opt = q.options?.find((o) => o.value === v);
                                    if (opt?.hasOtherInput) {
                                      const other = otherValues[q.id] || '';
                                      return (
                                        <span
                                          key={v}
                                          className="inline-block rounded-full px-3 py-1 text-[14px] font-medium bg-sage-50 text-sage border border-sage-200"
                                        >
                                          {other ? `${opt.label}: ${other}` : opt.label}
                                        </span>
                                      );
                                    }
                                    return (
                                      <span
                                        key={v}
                                        className="inline-block rounded-full px-3 py-1 text-[14px] font-medium bg-sage-50 text-sage border border-sage-200"
                                      >
                                        {opt?.label || v}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                              <button
                                onClick={() => onJumpTo(visibleIndex)}
                                className="flex items-center gap-1 h-[24px] pt-[2px] pr-[12px] pb-[2px] pl-[8px] rounded-full text-[12px] font-bold leading-none whitespace-nowrap transition-all duration-150 hover:opacity-90 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 cursor-pointer flex-shrink-0 bg-[#F0EAFB] text-iris"
                                aria-label={`Change answer for: ${q.question}`}
                              >
                                <span className="w-4 h-4 flex items-center justify-center">
                                  <PencilIcon />
                                </span>
                                Change
                              </button>
                            </div>
                          </div>
                        );
                      }

                      if (q.type === 'open-ended') {
                        const fullText = result.text;
                        const isEmpty = result.isEmpty;
                        const isLong = fullText.length > 120;
                        const isExpanded = openEndedExpanded[q.id];
                        const displayText = isLong && !isExpanded
                          ? fullText.substring(0, 120) + '...'
                          : fullText;

                        return (
                          <div
                            key={q.id}
                            className={`rounded-xl p-4 bg-white shadow-whisper ${isEmpty ? 'border border-dashed border-[#d4d0c9]' : 'border border-line'}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <p
                                  className="text-[15px] font-medium mb-2 text-muted break-words leading-[1.35]"
                                >
                                  {q.question}
                                </p>
                                {isEmpty ? (
                                  <p className="text-[15px] text-subtle">Skipped</p>
                                ) : (
                                  <div>
                                    <p
                                      className="text-[16px] leading-relaxed text-ink-700 break-words"
                                    >
                                      {displayText}
                                    </p>
                                    {isLong && (
                                      <button
                                        onClick={() => toggleExpand(q.id)}
                                        className="text-[14px] font-semibold mt-1 whitespace-nowrap transition-opacity duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded cursor-pointer text-sage"
                                      >
                                        {isExpanded ? 'See less' : 'See all'}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => onJumpTo(visibleIndex)}
                                className="flex items-center gap-1 h-[24px] pt-[2px] pr-[12px] pb-[2px] pl-[8px] rounded-full text-[12px] font-bold leading-none whitespace-nowrap transition-all duration-150 hover:opacity-90 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 cursor-pointer flex-shrink-0 bg-[#F0EAFB] text-iris"
                                aria-label={`Change answer for: ${q.question}`}
                              >
                                <span className="w-4 h-4 flex items-center justify-center">
                                  <PencilIcon />
                                </span>
                                Change
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={q.id}
                          className={`rounded-xl p-4 bg-white shadow-whisper ${result.isEmpty ? 'border border-dashed border-[#d4d0c9]' : 'border border-line'}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p
                                className="text-[15px] font-medium mb-1.5 text-muted break-words leading-[1.35]"
                              >
                                {q.question}
                              </p>
                              <span
                                className={`text-[17px] font-semibold ${result.isEmpty ? 'text-subtle' : 'text-sage'}`}
                              >
                                {result.isEmpty ? 'Skipped' : result.text}
                              </span>
                            </div>
                            <button
                              onClick={() => onJumpTo(visibleIndex)}
                              className="flex items-center gap-1 h-[24px] pt-[2px] pr-[12px] pb-[2px] pl-[8px] rounded-full text-[12px] font-bold leading-none whitespace-nowrap transition-all duration-150 hover:opacity-90 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 cursor-pointer flex-shrink-0 bg-[#F0EAFB] text-iris"
                              aria-label={`Change answer for: ${q.question}`}
                            >
                              <span className="w-4 h-4 flex items-center justify-center">
                                <PencilIcon />
                              </span>
                              Change
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        <footer className="flex-none w-full px-5 pt-3 pb-8">
          <div className="w-full max-w-[580px] mx-auto">
            {/*<p
              className="text-center text-[15px] font-medium mb-3 text-muted"
            >
              Your answers are anonymous. Once you submit, you can&apos;t change them.
            </p>*/}

            <div className="flex flex-col items-center gap-3">
              {sendFailed ? (
                <div className="text-center mb-1 w-full flex flex-col items-center">
                  <p
                    className="text-[16px] font-medium mb-2 text-muted"
                  >
                    That didn&apos;t send. Check your connection and try again.
                  </p>
                  <button
                    onClick={onRetry}
                    className="w-full max-w-[335px] py-2 gap-3 rounded-[81px] text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap transition-all duration-150 hover:opacity-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 cursor-pointer bg-sage shadow-sage-lg flex items-center justify-center"
                  >
                    Try again
                  </button>
                </div>
              ) : rateLimitSeconds > 0 ? (
                <div className="text-center mb-1 w-full flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-[#fff3e0]">
                    <span className="w-7 h-7 flex items-center justify-center">
                      <i className="ri-timer-line text-[24px] text-[#b45309]"></i>
                    </span>
                  </div>
                  <p
                    className="text-[16px] font-semibold mb-1 text-ink"
                  >
                    Too many attempts
                  </p>
                  <p
                    className="text-[15px] mb-1 text-muted"
                  >
                    Try again in {rateLimitSeconds} seconds.
                  </p>
                  <button
                    disabled
                    className="w-full max-w-[335px] py-2 gap-3 rounded-[81px] text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap bg-sage-300 flex items-center justify-center"
                  >
                    Submit
                  </button>
                </div>
              ) : isSubmitting ? (
                <button
                  disabled
                  className="w-full max-w-[335px] py-2 gap-3 rounded-[81px] text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap flex items-center justify-center bg-sage shadow-sage-lg opacity-85"
                >
                  <span
                    className="w-5 h-5 rounded-full border-2 animate-spin inline-block border-[rgba(255,255,255,0.3)] border-t-white"
                    aria-hidden="true"
                  ></span>
                  Submitting...
                </button>
              ) : (
                <button
                  onClick={onSubmit}
                  className="w-full max-w-[335px] py-2 gap-3 rounded-[81px] text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap transition-all duration-150 hover:opacity-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 cursor-pointer bg-sage shadow-sage-lg flex items-center justify-center"
                >
                  Submit
                </button>
              )}

              {!isSubmitting && !rateLimitSeconds && !sendFailed && (
                <button
                  onClick={onBackToSurvey}
                  className="w-full max-w-[335px] py-2 px-5 gap-2 rounded-full border border-[#D6E0D2] transition-all duration-150 hover:opacity-80 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 cursor-pointer bg-[#D6E0D2] text-ink text-[17px] sm:text-[18px] font-bold whitespace-nowrap flex items-center justify-center"
                >
                  Back
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 flex flex-col bg-canvas">
      <header className="flex-none w-full px-5 pt-5 pb-3 bg-canvas">
        <div className="w-full max-w-[580px] mx-auto">
          <div className="flex items-start justify-between gap-4">
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
                <span
                  className="inline-block rounded-full px-3 py-0.5 text-[12px] font-semibold bg-sage-100 text-sage"
                >
                  {instrument.gradeBandDisplay}
                </span>
              </div>
            </div>
            <ReadAloudButton content={readAloudContent} iconOnly={true} />
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full max-w-[580px] mx-auto px-5 pt-2 pb-6">
        <h1
          className="text-[22px] sm:text-[28px] font-bold text-ink leading-[1.2] mb-[4px]"
        >
          Check your answers
        </h1>
        <p className="text-[15px] mb-6 text-muted">
          Look at what you picked. Tap Change if you want to pick something else.
        </p>

        <div className="space-y-5">
          {sectionOrder.map((sectionKey) => {
            const qs = sections[sectionKey];
            if (!qs || qs.length === 0) return null;
            const label = sectionLabels[sectionKey] || sectionKey;

            return (
              <div key={sectionKey}>
                <h2
                  className="text-[12px] font-semibold uppercase tracking-wide mb-2 px-1 text-subtle"
                >
                  {label}
                </h2>
                <div className="space-y-2">
                  {qs.map((q) => {
                    const visibleIndex = visibleQuestions.indexOf(q);
                    const result = getDisplayAnswer(q, instrument, answers, multiAnswers, otherValues, true);

                    return (
                      <div
                        key={q.id}
                        className={`rounded-xl p-4 transition-all duration-150 bg-white shadow-whisper ${result.isEmpty ? 'border border-dashed border-[#d4d0c9]' : 'border border-line'}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-[18px] font-semibold text-ink break-words leading-[1.35]"
                            >
                              {q.question}
                            </p>

                            <div className="mt-2">
                              {q.type === 'open-ended' && result.isEmpty && (
                                <div className="flex items-center gap-2">
                                  <span className="text-[15px] text-subtle">
                                    {result.text}
                                  </span>
                                  <button
                                    onClick={() => onJumpTo(visibleIndex)}
                                    className="text-[15px] font-semibold whitespace-nowrap transition-opacity duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded cursor-pointer text-sage"
                                    aria-label={`Answer: ${q.question}`}
                                  >
                                    Answer it
                                  </button>
                                </div>
                              )}

                              {q.type === 'open-ended' && !result.isEmpty && (
                                <div>
                                  {(() => {
                                    const fullText = result.text;
                                    const isLong = fullText.length > 120;
                                    const isExpanded = openEndedExpanded[q.id];
                                    const displayText = isLong && !isExpanded
                                      ? fullText.substring(0, 120) + '...'
                                      : fullText;

                                    return (
                                      <>
                                        <p
                                          className="text-[16px] leading-relaxed text-ink-700 break-words"
                                        >
                                          {displayText}
                                        </p>
                                        {isLong && (
                                          <button
                                            onClick={() => toggleExpand(q.id)}
                                            className="text-[14px] font-semibold mt-1 whitespace-nowrap transition-opacity duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded cursor-pointer text-sage"
                                          >
                                            {isExpanded ? 'See less' : 'See all'}
                                          </button>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                              )}

                              {q.type !== 'open-ended' && (
                                <div className="flex items-center gap-2">
                                  {result.emoji && (
                                    <span className="text-[24px]" role="img" aria-hidden="true">
                                      {result.emoji}
                                    </span>
                                  )}
                                  {q.type !== 'multi-select' && (
                                    <span
                                      className={`text-[18px] font-semibold break-words ${result.isEmpty ? 'text-subtle' : 'text-sage'}`}
                                    >
                                      {result.text}
                                    </span>
                                  )}
                                </div>
                              )}

                              {q.type === 'multi-select' && !result.isEmpty && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {(() => {
                                    const selected = multiAnswers[q.id] || [];
                                    return selected.map((v) => {
                                      const opt = q.options?.find((o) => o.value === v);
                                      if (opt?.hasOtherInput) {
                                        const other = otherValues[q.id] || '';
                                        return (
                                          <span
                                            key={v}
                                            className="inline-flex items-center justify-center min-h-[31px] pt-[5px] pb-[5px] px-[13px] rounded-full border border-sage-200 bg-sage-50 text-sage text-[14px] font-semibold text-center break-words"
                                          >
                                            {other ? `${opt.label}: ${other}` : opt.label}
                                          </span>
                                        );
                                      }
                                      return (
                                        <span
                                          key={v}
                                          className="inline-flex items-center justify-center min-h-[31px] pt-[5px] pb-[5px] px-[13px] rounded-full border border-sage-200 bg-sage-50 text-sage text-[14px] font-semibold text-center break-words"
                                        >
                                          {opt?.label || v}
                                        </span>
                                      );
                                    });
                                  })()}
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => onJumpTo(visibleIndex)}
                            className="flex items-center gap-1 h-[24px] pt-[2px] pr-[12px] pb-[2px] pl-[8px] rounded-full text-[12px] font-bold leading-none whitespace-nowrap transition-all duration-150 hover:opacity-90 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 cursor-pointer flex-shrink-0 bg-[#F0EAFB] text-iris"
                            aria-label={`Change answer for: ${q.question}`}
                          >
                            <span className="w-4 h-4 flex items-center justify-center">
                              <PencilIcon />
                            </span>
                            Change
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="flex-none w-full px-4 sm:px-5 pt-3 pb-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <div className="w-full max-w-[580px] mx-auto">
          <p
            className="text-center text-[15px] font-medium mb-3 text-muted"
          >
            When you send this, nobody will know it came from you.
          </p>

            <div className="flex flex-col items-center gap-3">
              {sendFailed ? (
                <div className="text-center mb-1 w-full flex flex-col items-center">
                  <p
                    className="text-[16px] font-medium mb-2 text-muted"
                  >
                    That didn&apos;t send. Let&apos;s try again.
                  </p>
                  <button
                    onClick={onRetry}
                    className="w-full max-w-[335px] py-2 gap-3 rounded-[81px] text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap transition-all duration-150 hover:opacity-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 cursor-pointer bg-sage shadow-sage-lg flex items-center justify-center"
                  >
                    Try again
                  </button>
                </div>
              ) : rateLimitSeconds > 0 ? (
                <div className="text-center mb-1 w-full flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 bg-[#fff3e0]"
                  >
                    <span className="text-[32px]" role="img" aria-hidden="true">{'\u23F3'}</span>
                  </div>
                  <p
                    className="text-[18px] font-semibold mb-1 text-ink"
                  >
                    Let&apos;s wait a little bit
                  </p>
                  <p
                    className="text-[15px] mb-1 text-muted"
                  >
                    Try again in {rateLimitSeconds} seconds. Your answers are safe.
                  </p>
                  <button
                    disabled
                    className="w-full max-w-[335px] py-2 gap-3 rounded-[81px] text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap bg-sage-300 flex items-center justify-center"
                  >
                    Send my answers
                  </button>
                </div>
              ) : isSubmitting ? (
                <button
                  disabled
                  className="w-full max-w-[335px] py-2 gap-3 rounded-[81px] text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap flex items-center justify-center bg-sage shadow-sage-lg opacity-85"
                >
                  <span
                    className="w-5 h-5 rounded-full border-2 animate-spin inline-block border-[rgba(255,255,255,0.3)] border-t-white"
                    aria-hidden="true"
                  ></span>
                  Sending...
                </button>
              ) : (
                <button
                  onClick={onSubmit}
                  className="w-full max-w-[335px] py-2 gap-3 rounded-[81px] text-white text-[17px] sm:text-[18px] font-bold whitespace-nowrap transition-all duration-150 hover:opacity-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 cursor-pointer bg-sage shadow-sage-lg flex items-center justify-center"
                >
                  Send my answers
                </button>
              )}

              {!isSubmitting && !rateLimitSeconds && !sendFailed && (
                <button
                  onClick={onBackToSurvey}
                  className="w-full max-w-[335px] py-2 px-5 gap-2 rounded-full border border-[#D6E0D2] transition-all duration-150 hover:opacity-80 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 cursor-pointer bg-[#D6E0D2] text-ink text-[17px] sm:text-[18px] font-bold whitespace-nowrap flex items-center justify-center"
                >
                  Back
                </button>
              )}
            </div>

          {!isSubmitting && !rateLimitSeconds && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setShowPrivacyNotice(true)}
                className="text-[13px] font-medium whitespace-nowrap transition-opacity duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded cursor-pointer text-iris"
              >
                Privacy
              </button>
              <button
                onClick={() => setShowAccessibility(true)}
                className="text-[13px] font-medium whitespace-nowrap transition-opacity duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 rounded cursor-pointer text-iris"
              >
                Accessibility
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
