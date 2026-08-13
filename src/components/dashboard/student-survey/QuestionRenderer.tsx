'use client';

export function getReadAloudContent(q: SurveyQuestion, instrument: SurveyInstrument): string {
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
}

import { SurveyQuestion, SurveyInstrument } from '@/lib/surveyInstruments';
import GradeQuestion from './GradeQuestion';
import ThreePointQuestion from './ThreePointQuestion';
import ThreePointBlock from './ThreePointBlock';
import FrequencyQuestion from './FrequencyQuestion';
import DietaryQuestion from './DietaryQuestion';
import MultiSelectQuestion from './MultiSelectQuestion';
import OpenEndedQuestion from './OpenEndedQuestion';

interface QuestionRendererProps {
  question: SurveyQuestion;
  instrument: SurveyInstrument;
  answer: string;
  multiAnswer: string[];
  otherValue: string;
  onAnswer: (value: string) => void;
  onMultiAnswer: (selected: string[], otherText: string) => void;
  isGrouped?: boolean;
  highlightUnanswered?: boolean;
}

export default function QuestionRenderer({
  question,
  instrument,
  answer,
  multiAnswer,
  otherValue,
  onAnswer,
  onMultiAnswer,
  isGrouped,
  highlightUnanswered,
}: QuestionRendererProps) {
  const isK5 = instrument.gradeBand === 'K-5';
  const is912 = instrument.gradeBand === '9-12';

  if (is912 && isGrouped && question.type === 'three-point') {
    return (
      <ThreePointBlock
        question={question.question}
        questionId={question.id}
        value={answer}
        onChange={onAnswer}
        highlightUnanswered={highlightUnanswered}
      />
    );
  }

  switch (question.type) {
    case 'grade':
      return (
        <GradeQuestion
          options={instrument.gradeOptions}
          value={answer}
          onSelect={onAnswer}
          privacyNote={question.privacyNote}
          isK5={isK5}
          is912={is912}
        />
      );

    case 'three-point':
      return (
        <ThreePointQuestion
          value={answer}
          onSelect={onAnswer}
          isK5={isK5}
          is912={is912}
          question={question.question}
        />
      );

    case 'frequency':
      return (
        <FrequencyQuestion
          value={answer}
          onSelect={onAnswer}
          question={question.question}
          isK5={isK5}
          is912={is912}
        />
      );

    case 'dietary':
      return (
        <DietaryQuestion
          value={answer}
          onSelect={onAnswer}
          question={question.question}
          isK5={isK5}
          is912={is912}
        />
      );

    case 'multi-select':
      return (
        <MultiSelectQuestion
          options={question.options || []}
          value={multiAnswer}
          otherValue={otherValue}
          onChange={onMultiAnswer}
          question={question.question}
          isK5={isK5}
          is912={is912}
        />
      );

    case 'open-ended':
      return (
        <OpenEndedQuestion
          value={answer}
          onChange={onAnswer}
          anonymityReminder={question.anonymityReminder}
          maxLength={question.maxLength}
          question={question.question}
          isK5={isK5}
          is912={is912}
        />
      );

    default:
      return null;
  }
}