'use client';

import Link from 'next/link';
import HelpTopicGrid, { HelpTopicGridSkeleton } from './HelpTopicGrid';
import HelpPopularQuestions, { HelpPopularQuestionsSkeleton } from './HelpPopularQuestions';
import HelpSupportCard from './HelpSupportCard';
import type { HelpQuestionItem, HelpSupportInfo, HelpTopicItem } from './types';

interface HelpPageProps {
  /** Accessible page title; the dashboard header already shows it visually. */
  title: string;
  topics: HelpTopicItem[];
  questions?: HelpQuestionItem[];
  questionsDescription?: string;
  support: HelpSupportInfo;
  /** Adds the "My requests (N open)" pill beside the topic heading. */
  requests?: { href: string; openCount: number };
  isLoading?: boolean;
}

export default function HelpPage({
  title,
  topics,
  questions = [],
  questionsDescription,
  support,
  requests,
  isLoading = false,
}: HelpPageProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="sr-only">{title}</h1>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-[17px] sm:text-[18px] font-semibold text-ink">Browse by topic</h2>
          {requests && (
            <Link
              href={requests.href}
              className="inline-flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2 h-9 px-4 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 text-ink bg-white border border-line shadow-hairline"
            >
              <span className="w-4 h-4 flex items-center justify-center text-sage">
                <i className="ri-list-check text-base"></i>
              </span>
              My requests
              {requests.openCount > 0 && <span className="text-subtle">({requests.openCount} open)</span>}
            </Link>
          )}
        </div>

        {isLoading ? <HelpTopicGridSkeleton count={topics.length || 6} /> : <HelpTopicGrid topics={topics} />}
      </section>

      {questions.length > 0 &&
        (isLoading ? (
          <HelpPopularQuestionsSkeleton />
        ) : (
          <HelpPopularQuestions questions={questions} description={questionsDescription} />
        ))}

      <HelpSupportCard {...support} />
    </div>
  );
}
