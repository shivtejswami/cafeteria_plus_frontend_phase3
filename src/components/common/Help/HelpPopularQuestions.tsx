import Link from 'next/link';
import type { HelpQuestionItem } from './types';

interface HelpPopularQuestionsProps {
  questions: HelpQuestionItem[];
  title?: string;
  description?: string;
}

export default function HelpPopularQuestions({
  questions,
  title = 'Popular questions',
  description,
}: HelpPopularQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card">
      <h2 className="text-[17px] sm:text-[18px] font-semibold text-ink">{title}</h2>
      {description && <p className="text-[13px] mt-1 mb-3 text-muted">{description}</p>}

      <ul className="space-y-0.5" role="list">
        {questions.map((q) => (
          <li key={q.id}>
            <Link
              href={q.href}
              className="flex items-start sm:items-center gap-3 py-3 px-3 -mx-3 rounded-xl transition-colors duration-150 group hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1"
            >
              <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 text-iris">
                <i className="ri-question-answer-line text-lg"></i>
              </span>
              <span className="text-[14px] flex-1 min-w-0 group-hover:underline text-ink">{q.question}</span>
              {q.topicLabel && (
                <span className="hidden sm:inline-flex items-center text-[11px] font-medium shrink-0 px-2 py-0.5 rounded-full bg-iris-50 text-iris">
                  {q.topicLabel}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HelpPopularQuestionsSkeleton() {
  return (
    <div className="rounded-2xl p-4 sm:p-6 animate-pulse bg-white border border-line shadow-card">
      <div className="h-5 rounded w-36 mb-2 bg-sage-50" />
      <div className="h-4 rounded w-64 mb-4 bg-sage-50" />
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <div className="w-5 h-5 rounded shrink-0 bg-iris-50" />
            <div className="h-4 rounded flex-1 bg-sage-50" />
            <div className="hidden sm:block h-5 w-16 rounded-full bg-iris-50" />
          </div>
        ))}
      </div>
    </div>
  );
}
