import { SurveyQuestion, SurveyInstrument } from './surveyInstruments';

export interface SurveyScreen {
  screenIndex: number;
  questions: SurveyQuestion[];
  section: string;
  sectionLabel: string;
  isRatingGroup: boolean;
}

function estimateQuestionTime(q: SurveyQuestion): number {
  switch (q.type) {
    case 'grade': return 15;
    case 'frequency': return 20;
    case 'multi-select': return 45;
    case 'three-point': return 15;
    case 'dietary': return 20;
    case 'open-ended': return 60;
    default: return 20;
  }
}

export function estimateTotalSeconds(questions: SurveyQuestion[]): number {
  return questions.reduce((total, q) => total + estimateQuestionTime(q), 0);
}

export function formatTimeRemaining(totalSeconds: number, elapsedSeconds: number): string {
  const remaining = Math.max(0, totalSeconds - elapsedSeconds);
  const minutes = Math.round(remaining / 60);
  if (minutes <= 0) return 'Less than 1 minute left';
  if (minutes === 1) return 'About 1 minute left';
  return `About ${minutes} minutes left`;
}

export function buildScreens(
  visibleQuestions: SurveyQuestion[],
  instrument: SurveyInstrument
): SurveyScreen[] {
  const screens: SurveyScreen[] = [];
  const sectionLabels: Record<string, string> = {
    'about-you': 'About you',
    'breakfast': 'Breakfast',
    'lunch': 'Lunch',
    'your-meals': 'Your meals',
    'your-ideas': 'Your ideas',
  };

  let screenIndex = 0;

  for (let i = 0; i < visibleQuestions.length; i++) {
    const q = visibleQuestions[i];
    screens.push({
      screenIndex,
      questions: [q],
      section: q.section,
      sectionLabel: sectionLabels[q.section] || q.section,
      isRatingGroup: false,
    });
    screenIndex++;
  }

  return screens;
}

export function isScreenFullyAnswered(
  screen: SurveyScreen,
  answers: Record<string, string>,
  multiAnswers: Record<string, string[]>
): { allAnswered: boolean; unansweredCount: number; unansweredIds: string[] } {
  const unansweredIds: string[] = [];

  for (const q of screen.questions) {
    if (q.type === 'open-ended') continue;

    if (q.type === 'multi-select') {
      if ((multiAnswers[q.id] || []).length === 0) {
        unansweredIds.push(q.id);
      }
    } else {
      if (!answers[q.id] || answers[q.id].trim().length === 0) {
        unansweredIds.push(q.id);
      }
    }
  }

  return {
    allAnswered: unansweredIds.length === 0,
    unansweredCount: unansweredIds.length,
    unansweredIds,
  };
}