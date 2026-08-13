'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { SurveyInstrument, sectionLabels } from '@/lib/surveyInstruments';
import { endTiming, detectStraightLining, recordSignals } from '@/lib/surveyIntegrity';
import { getEscapeCount } from '@/lib/surveyToken';
import { getRateLimitTrips } from '@/lib/surveyRateLimit';
import { buildScreens, estimateTotalSeconds, formatTimeRemaining } from '@/lib/surveyScreenBuilder';
import QuestionRenderer, { getReadAloudContent } from './QuestionRenderer';
import QuestionGroupScreen from './QuestionGroupScreen';
import SurveyProgress from './SurveyProgress';
import SectionIntro from './SectionIntro';
import ReviewScreen from './ReviewScreen';
import ReadAloudButton from './ReadAloudButton';
import StudentPrivacyNotice from './StudentPrivacyNotice';
import StudentAccessibilityNotice from './StudentAccessibilityNotice';

interface StudentSurveyProps {
  instrument: SurveyInstrument;
  schoolName: string;
  schoolCode: string;
  schoolLogoUrl?: string;
  onSubmitComplete: () => void;
}

export default function StudentSurvey({ instrument, schoolName, schoolCode, schoolLogoUrl, onSubmitComplete }: StudentSurveyProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>({});
  const [otherValues, setOtherValues] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [validationError, setValidationError] = useState(false);
  const [showSectionIntro, setShowSectionIntro] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [returnToReview, setReturnToReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);
  const [is912State, setIs912State] = useState(false);
  const [elapsedSeconds912, setElapsedSeconds912] = useState(0);
  const submitCountRef = useRef(0);
  const prevVisibleIdsRef = useRef<string[]>([]);
  const rateLimitTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);

  const isK5 = instrument.gradeBand === 'K-5';
  const is912 = instrument.gradeBand === '9-12';

  const visibleQuestions = useMemo(() => {
    return instrument.questions.filter((q) => {
      if (!q.dependsOn) return true;

      if (q.dependsOn.condition === 'eats-school-meals') {
        const bFreq = answers['hs-breakfast-freq'] ?? answers['ms-breakfast-freq'];
        const lFreq = answers['hs-lunch-freq'] ?? answers['ms-lunch-freq'];
        if (bFreq === '0' && lFreq === '0') {
          return false;
        }
        return true;
      }

      const depAnswer = answers[q.dependsOn.questionId];
      if (!depAnswer) return true;
      const numVal = parseInt(depAnswer);
      if (isNaN(numVal)) return true;
      if (q.dependsOn.condition === 'less-than') {
        return numVal < q.dependsOn.value;
      }
      if (q.dependsOn.condition === 'equals') {
        return numVal === q.dependsOn.value;
      }
      return true;
    });
  }, [instrument.questions, answers]);

  const screens912 = useMemo(() => {
    if (!is912) return [];
    return buildScreens(visibleQuestions, instrument);
  }, [is912, visibleQuestions, instrument]);

  const totalTimeEstimate = useMemo(() => {
    return estimateTotalSeconds(visibleQuestions);
  }, [visibleQuestions]);

  useEffect(() => {
    if (is912 && startTimeRef.current === 0) {
      startTimeRef.current = Date.now();
    }
  }, [is912]);

  useEffect(() => {
    if (is912) {
      elapsedTimerRef.current = setInterval(() => {
        setElapsedSeconds912(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 5000);
    }
    return () => {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
      }
    };
  }, [is912]);

  useEffect(() => {
    const currentIds = visibleQuestions.map((q) => q.id);
    const prevIds = prevVisibleIdsRef.current;

    if (prevIds.length === 0) {
      prevVisibleIdsRef.current = currentIds;
      return;
    }

    const removedIds = prevIds.filter((id) => !currentIds.includes(id));

    if (removedIds.length > 0) {
      setAnswers((prev) => {
        const next = { ...prev };
        removedIds.forEach((id) => delete next[id]);
        return next;
      });
      setMultiAnswers((prev) => {
        const next = { ...prev };
        removedIds.forEach((id) => delete next[id]);
        return next;
      });
      setOtherValues((prev) => {
        const next = { ...prev };
        removedIds.forEach((id) => delete next[id]);
        return next;
      });
    }

    prevVisibleIdsRef.current = currentIds;
  }, [visibleQuestions]);

  useEffect(() => {
    return () => {
      if (rateLimitTimerRef.current) {
        clearInterval(rateLimitTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (rateLimitSeconds > 0) {
      rateLimitTimerRef.current = setInterval(() => {
        setRateLimitSeconds((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            if (rateLimitTimerRef.current) {
              clearInterval(rateLimitTimerRef.current);
              rateLimitTimerRef.current = null;
            }
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (rateLimitTimerRef.current) {
        clearInterval(rateLimitTimerRef.current);
        rateLimitTimerRef.current = null;
      };
    };
  }, [rateLimitSeconds]);

  const totalSteps = is912 ? screens912.length : visibleQuestions.length;
  const currentQ = !is912 ? visibleQuestions[currentStep] : null;
  const currentScreen = is912 ? screens912[currentStep] : null;

  useEffect(() => {
    if (currentStep >= totalSteps && totalSteps > 0) {
      setCurrentStep(totalSteps - 1);
    }
  }, [currentStep, totalSteps]);

  useEffect(() => {
    if (is912 && currentStep >= totalSteps && totalSteps > 0) {
      setCurrentStep(Math.max(0, totalSteps - 1));
    }
  }, [screens912, currentStep, totalSteps, is912]);

  const sectionSteps = useMemo(() => {
    if (is912) {
      const map: Record<string, { total: number; indices: number[] }> = {};
      screens912.forEach((screen, i) => {
        if (!map[screen.section]) map[screen.section] = { total: 0, indices: [] };
        map[screen.section].total++;
        map[screen.section].indices.push(i);
      });
      return map;
    }
    const map: Record<string, { total: number; indices: number[] }> = {};
    visibleQuestions.forEach((q, i) => {
      if (!map[q.section]) map[q.section] = { total: 0, indices: [] };
      map[q.section].total++;
      map[q.section].indices.push(i);
    });
    return map;
  }, [is912, visibleQuestions, screens912]);

  const stepInSection = useMemo(() => {
    if (is912) {
      if (!currentScreen) return 0;
      const info = sectionSteps[currentScreen.section];
      if (!info) return 0;
      return info.indices.indexOf(currentStep) + 1;
    }
    if (!currentQ) return 0;
    const info = sectionSteps[currentQ.section];
    if (!info) return 0;
    return info.indices.indexOf(currentStep) + 1;
  }, [is912, currentStep, currentQ, currentScreen, sectionSteps]);

  const isLastSection = useMemo(() => {
    if (is912) {
      if (!currentScreen) return false;
      const sections = ['about-you', 'breakfast', 'lunch', 'your-meals', 'your-ideas'];
      const lastVisibleSection = sections.filter((s) => sectionSteps[s] && sectionSteps[s].total > 0).pop();
      return currentScreen.section === lastVisibleSection;
    }
    if (!currentQ) return false;
    const sections = ['about-you', 'breakfast', 'lunch', 'your-meals', 'your-ideas'];
    const lastVisibleSection = sections.filter((s) => sectionSteps[s] && sectionSteps[s].total > 0).pop();
    return currentQ.section === lastVisibleSection;
  }, [is912, currentQ, currentScreen, sectionSteps]);

  const getAnswer = (qId: string): string => answers[qId] || '';
  const getMultiAnswer = (qId: string): string[] => multiAnswers[qId] || [];
  const getOtherValue = (qId: string): string => otherValues[qId] || '';

  const handleAnswer = useCallback((idOrValue: string, value?: string) => {
    if (is912 && value !== undefined) {
      setAnswers((prev) => ({ ...prev, [idOrValue]: value }));
      setValidationError(false);
      return;
    }
    if (!is912 && !currentQ) return;
    if (!is912 && currentQ) {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: idOrValue }));
      setValidationError(false);
    }
  }, [is912, currentQ]);

  const handleMultiAnswer = useCallback((selectedOrId: string[] | string, otherTextOrSelected?: string[] | string, maybeOtherText?: string) => {
    if (is912 && typeof selectedOrId === 'string') {
      const qId = selectedOrId;
      const selected = (otherTextOrSelected as string[]) || [];
      const otherText = (maybeOtherText as string) || '';
      setMultiAnswers((prev) => ({ ...prev, [qId]: selected }));
      setOtherValues((prev) => ({ ...prev, [qId]: otherText }));
      setValidationError(false);
      return;
    }
    if (!is912 && currentQ) {
      setMultiAnswers((prev) => ({ ...prev, [currentQ.id]: selectedOrId as string[] }));
      setOtherValues((prev) => ({ ...prev, [currentQ.id]: (otherTextOrSelected as string) || '' }));
      setValidationError(false);
    }
  }, [is912, currentQ]);

  const isAnswered = currentQ
    ? (currentQ.type === 'multi-select'
        ? getMultiAnswer(currentQ.id).length > 0
        : getAnswer(currentQ.id).trim().length > 0)
    : false;

  const isStepRequired = currentQ ? currentQ.type !== 'open-ended' : false;

  const getNudgeMessage = useCallback(() => {
    if (!currentQ) return '';
    if (currentQ.type === 'grade') return isK5 ? 'Tap your grade to keep going.' : 'Select your grade to continue.';
    if (currentQ.type === 'frequency') return isK5 ? 'Pick a number to keep going.' : 'Select an answer to continue.';
    if (currentQ.type === 'three-point') return isK5 ? 'Tap a face to keep going.' : 'Select an answer to continue.';
    if (currentQ.type === 'dietary') return isK5 ? 'Pick an answer to keep going.' : 'Select an answer to continue.';
    return isK5 ? 'Pick an answer to keep going.' : 'Select an answer to continue.';
  }, [currentQ, isK5]);

  const goToReview = useCallback(() => {
    setShowReview(true);
    setReturnToReview(false);
    setSendFailed(false);
  }, []);

  const handleNext = useCallback(() => {
    if (is912) {
      if (returnToReview) {
        goToReview();
        return;
      }
      if (currentStep < totalSteps - 1) {
        setCurrentStep((s) => s + 1);
        setValidationError(false);
      } else {
        goToReview();
      }
      return;
    }

    if (!currentQ) return;

    if (isStepRequired && !isAnswered) {
      setValidationError(true);
      return;
    }

    if (returnToReview) {
      goToReview();
      return;
    }

    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      const nextQ = visibleQuestions[nextStep];

      if (nextQ.section !== currentQ.section) {
        setShowSectionIntro(nextQ.section);
        setCurrentStep(nextStep);
      } else {
        setCurrentStep(nextStep);
      }
      setValidationError(false);
    } else {
      goToReview();
    }
  }, [is912, currentStep, currentQ, totalSteps, visibleQuestions, isStepRequired, isAnswered, returnToReview, goToReview]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setValidationError(false);
      setReturnToReview(false);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    if (is912) {
      if (returnToReview) {
        goToReview();
        return;
      }
      if (currentStep < totalSteps - 1) {
        setCurrentStep((s) => s + 1);
        setValidationError(false);
      } else {
        goToReview();
      }
      return;
    }

    if (returnToReview) {
      goToReview();
      return;
    }

    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      const nextQ = visibleQuestions[nextStep];
      if (nextQ.section !== currentQ!.section) {
        setShowSectionIntro(nextQ.section);
        setCurrentStep(nextStep);
      } else {
        setCurrentStep(nextStep);
      }
      setValidationError(false);
    } else {
      goToReview();
    }
  }, [is912, currentStep, totalSteps, visibleQuestions, returnToReview, goToReview]);

  const handleJumpTo = useCallback((index: number) => {
    setShowReview(false);

    if (is912) {
      const targetQ = visibleQuestions[index];
      if (!targetQ) {
        setCurrentStep(totalSteps - 1);
      } else {
        const screenIdx = screens912.findIndex((s) =>
          s.questions.some((q) => q.id === targetQ.id)
        );
        setCurrentStep(screenIdx >= 0 ? screenIdx : totalSteps - 1);
      }
    } else {
      setCurrentStep(Math.max(0, Math.min(index, totalSteps - 1)));
    }

    setValidationError(false);
    setReturnToReview(true);
  }, [is912, totalSteps, visibleQuestions, screens912]);

  const handleBackToSurvey = useCallback(() => {
    setShowReview(false);
    setCurrentStep(totalSteps - 1);
    setValidationError(false);
    setReturnToReview(false);
  }, [totalSteps]);

  const submitAnswers = useCallback(() => {
    submitCountRef.current += 1;

    const completionTimeMs = endTiming(schoolCode);
    const escapeCount = getEscapeCount(schoolCode);
    const rateLimitTrips = getRateLimitTrips(schoolCode);

    const threePointAnswers = instrument.questions
      .filter((q) => q.type === 'three-point')
      .map((q) => answers[q.id])
      .filter(Boolean);

    const isStraightLining = detectStraightLining(threePointAnswers);

    recordSignals(schoolCode, {
      completionTimeMs,
      submissionCount: submitCountRef.current,
      escapeCount,
      rateLimitTrips,
      straightLining: isStraightLining,
    });
  }, [schoolCode, instrument.questions, answers]);

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
    setSendFailed(false);
    setRateLimitSeconds(0);

    submitAnswers();

    const attempt = submitCountRef.current;

    setTimeout(() => {
      setIsSubmitting(false);

      if (attempt >= 3) {
        setSendFailed(false);
        setRateLimitSeconds(30);
      } else if (attempt >= 2) {
        setSendFailed(true);
      } else {
        onSubmitComplete();
      }
    }, 800);
  }, [submitAnswers, onSubmitComplete]);

  const handleRetry = useCallback(() => {
    setSendFailed(false);
    handleSubmit();
  }, [handleSubmit]);

  if (is912 && showSectionIntro) {
    setShowSectionIntro(null);
    return null;
  }

  if (!is912 && showSectionIntro) {
    if (!isK5 && showSectionIntro === 'about-you') {
      setShowSectionIntro(null);
      return null;
    }

    const sectionQs = sectionSteps[showSectionIntro]?.total || 0;

    return (
      <SectionIntro
        section={showSectionIntro}
        isK5={isK5}
        gradeBandDisplay={instrument.gradeBandDisplay}
        questionCount={sectionQs}
        onContinue={() => setShowSectionIntro(null)}
        schoolName={schoolName}
        schoolLogoUrl={schoolLogoUrl}
      />
    );
  }

  if (showPrivacy) {
    return (
      <StudentPrivacyNotice
        isK5={isK5}
        is912={is912}
        schoolName={schoolName}
        schoolLogoUrl={schoolLogoUrl}
        gradeBandDisplay={instrument.gradeBandDisplay}
        onBack={() => setShowPrivacy(false)}
        onContinue={() => setShowPrivacy(false)}
        onSwitchToAccessibility={() => {
          setShowPrivacy(false);
          setShowAccessibility(true);
        }}
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
          setShowPrivacy(true);
        }}
      />
    );
  }

  if (showReview) {
    return (
      <ReviewScreen
        instrument={instrument}
        visibleQuestions={visibleQuestions}
        answers={answers}
        multiAnswers={multiAnswers}
        otherValues={otherValues}
        onJumpTo={handleJumpTo}
        onSubmit={handleSubmit}
        onBackToSurvey={handleBackToSurvey}
        isK5={isK5}
        isSubmitting={isSubmitting}
        sendFailed={sendFailed}
        rateLimitSeconds={rateLimitSeconds}
        onRetry={handleRetry}
        schoolName={schoolName}
        schoolLogoUrl={schoolLogoUrl}
      />
    );
  }

  if (is912 && currentScreen) {
    const progressPercent = totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;
    const timeRemaining = formatTimeRemaining(totalTimeEstimate, elapsedSeconds912);
    const previousSection = currentStep > 0 ? screens912[currentStep - 1]?.section : '';

    return (
      <QuestionGroupScreen
        screen={currentScreen}
        instrument={instrument}
        answers={answers}
        multiAnswers={multiAnswers}
        otherValues={otherValues}
        onAnswer={handleAnswer}
        onMultiAnswer={handleMultiAnswer}
        onContinue={handleNext}
        onBack={handleBack}
        onSkip={handleSkip}
        isFirstScreen={currentStep === 0}
        isLastScreen={currentStep === totalSteps - 1}
        validationError={validationError}
        screenIndex={currentStep}
        totalScreens={totalSteps}
        timeRemaining={timeRemaining}
        progressPercent={progressPercent}
        previousSection={previousSection}
        schoolName={schoolName}
        schoolLogoUrl={schoolLogoUrl}
      />
    );
  }

  if (!currentQ) return null;

  const canAdvance = !isStepRequired || isAnswered;
  const sectionLabel = sectionLabels[currentQ.section] || currentQ.section;
  const isFirstStep = currentStep === 0;
  const sectionInfo = sectionSteps[currentQ.section];
  const readAloudText = getReadAloudContent(currentQ, instrument);
  const isOpenEnded = currentQ.type === 'open-ended';

  return (
    <div className="h-full min-h-0 flex flex-col bg-canvas">
      <header className="flex-none w-full px-5 pt-5 pb-3 bg-canvas">
        <div className="w-full max-w-[520px] md:max-w-[640px] mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col items-start gap-1.5 min-w-0">
              {schoolLogoUrl ? (
                <img
                  src={schoolLogoUrl}
                  alt={`${schoolName} logo`}
                  className="h-8 w-auto object-contain flex-shrink-0 self-start"
                />
              ) : (
                <span className="text-[14px] font-bold text-sage truncate">
                  {schoolName}
                </span>
              )}
              <span
                className="inline-block rounded-full px-3 py-0.5 text-[12px] font-semibold bg-sage-100 text-sage"
              >
                {instrument.gradeBandDisplay}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ReadAloudButton content={readAloudText} iconOnly={true} />
            </div>
          </div>

          <div className="mt-3">
            <SurveyProgress
              currentStep={currentStep + 1}
              totalSteps={totalSteps}
              sectionLabel={sectionLabel}
              stepInSection={stepInSection}
              totalInSection={sectionInfo?.total || 0}
              isK5={isK5}
              isLastSection={isLastSection}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full max-w-[520px] md:max-w-[640px] mx-auto px-5 pt-4 pb-4">
        <div className="mb-1">
          <h1
            className={`${isK5 ? 'text-[22px] sm:text-[28px] font-bold' : 'text-[22px] sm:text-[24px] font-bold'} text-ink leading-[1.25]`}
          >
            {currentQ.question}
          </h1>
        </div>

        {currentQ.helper && (
          <p className="text-[16px] mt-1.5 text-muted">
            {currentQ.helper}
          </p>
        )}

        <div className="mt-6">
          <QuestionRenderer
            question={currentQ}
            instrument={instrument}
            answer={getAnswer(currentQ.id)}
            multiAnswer={getMultiAnswer(currentQ.id)}
            otherValue={getOtherValue(currentQ.id)}
            onAnswer={handleAnswer}
            onMultiAnswer={handleMultiAnswer}
          />
        </div>
        
        <div className="mt-1 min-h-0" role="status" aria-live="polite">
          {validationError && (
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 flex items-center justify-center">
                <i className="ri-error-warning-line text-iris"></i>
              </span>
              <span className="text-[14px] font-medium text-iris">
                {getNudgeMessage()}
              </span>
            </div>
          )}
        </div>
      </main>

      <footer className="flex-none w-full max-w-[520px] md:max-w-[640px] mx-auto px-5 pt-3 pb-5">
          <div className="flex flex-col gap-3">
            {isOpenEnded ? (
              <div className="flex gap-3 w-full max-w-[335px] mx-auto">
                <button
                  onClick={handleSkip}
                  className="w-[161.5px] flex-1 py-2 px-5 gap-2 rotate-0 opacity-100 rounded-[9999px] text-[17px] sm:text-[18px] font-bold text-sage bg-white border-2 border-[#D6E0D2] whitespace-nowrap transition-all duration-150 hover:opacity-80 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 cursor-pointer flex items-center justify-center"
                >
                  Skip
                </button>
                <button
                  onClick={handleNext}
                  className={`w-[161.5px] flex-1 py-2 gap-3 rotate-0 opacity-100 rounded-[81px] text-[17px] sm:text-[18px] font-bold text-white whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 cursor-pointer flex items-center justify-center ${
                    !canAdvance
                      ? 'bg-sage-300 opacity-60 cursor-not-allowed'
                      : 'bg-sage hover:opacity-95 active:scale-[0.98]'
                  }`}
                >
                  Next
                </button>
              </div>
            ) : (
              <button
                onClick={handleNext}
                className={`w-full max-w-[335px] py-2 gap-3 rotate-0 opacity-100 rounded-[81px] text-[17px] sm:text-[18px] font-bold text-white whitespace-nowrap mx-auto transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 cursor-pointer flex items-center justify-center ${
                  !canAdvance
                    ? 'bg-sage-300 opacity-60 cursor-not-allowed'
                    : 'bg-sage hover:opacity-95 active:scale-[0.98]'
                }`}
              >
                {returnToReview
                  ? 'Done'
                  : currentStep === totalSteps - 1
                    ? 'Review answers'
                    : 'Next'}
              </button>
            )}

            {!isFirstStep && (
              <button
                onClick={handleBack}
                className="w-full max-w-[335px] py-2 px-5 gap-2 rotate-0 opacity-100 rounded-full text-sage font-sans font-bold text-[17px] sm:text-[18px] flex items-center justify-center bg-sage-50 border border-[#D6E0D2] mx-auto transition-all duration-150 hover:opacity-80 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 cursor-pointer"
              >
                Back
              </button>
            )}
          </div>
          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              onClick={() => setShowPrivacy(true)}
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