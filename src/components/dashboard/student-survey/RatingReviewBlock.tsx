'use client';

import { SurveyQuestion } from '@/lib/surveyInstruments';

interface RatingReviewBlockProps {
  questions: SurveyQuestion[];
  answers: Record<string, string>;
  onJumpTo: (question: SurveyQuestion) => void;
}

function getAnswerWord(answer: string): string {
  switch (answer) {
    case 'yes': return 'Yes';
    case 'sometimes': return 'Sometimes';
    case 'no': return 'No';
    default: return '\u2014';
  }
}

export default function RatingReviewBlock({ questions, answers, onJumpTo }: RatingReviewBlockProps) {
  return (
    <div
      className="rounded-[14px] overflow-hidden bg-white border border-line shadow-whisper"
    >
      {questions.map((q, idx) => {
        const word = getAnswerWord(answers[q.id] || '');
        const isUnanswered = word === '\u2014';

        return (
          <div
            key={q.id}
            className={`flex items-center gap-3 px-4 py-3 transition-colors duration-100 hover:bg-[#fafaf8] ${idx < questions.length - 1 ? 'border-b border-b-[#f0ede7]' : 'border-borderBottom-0'}`}
          >
            <div className="flex-1 min-w-0">
              <p
                className="text-[14px] leading-snug line-clamp-2 text-ink break-words"
                title={q.question}
              >
                {q.question}
              </p>
            </div>

            <span
              className={`text-[15px] font-semibold whitespace-nowrap flex-shrink-0 text-right min-w-[80px] ${isUnanswered ? 'text-subtle' : 'text-sage'}`}
            >
              {word}
            </span>

            <button
              onClick={() => onJumpTo(q)}
              className="flex items-center justify-center w-[36px] h-[36px] rounded-full flex-shrink-0 transition-all duration-100 hover:opacity-80 active:scale-[0.95] focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 cursor-pointer bg-iris-50 text-iris"
              aria-label={`Change answer for: ${q.question}`}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-pencil-line text-[14px]"></i>
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}