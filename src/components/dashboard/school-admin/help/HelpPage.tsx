'use client';

import { useMemo } from 'react';
import { HelpPage as CommonHelpPage } from '@/components/common/Help';
import type { HelpQuestionItem, HelpTopicItem } from '@/components/common/Help';
import { helpTopics, popularQuestions, getArticleCountForTopic, getTopicBySlug } from '@/lib/schoolHelpContent';
import { schoolSupportRequests } from '@/lib/schoolSupportRequests';

export default function HelpPage() {
  const openCount = schoolSupportRequests.filter((r) => r.status === 'open').length;

  const topics = useMemo<HelpTopicItem[]>(
    () =>
      helpTopics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        icon: topic.icon,
        href: `/school/help/${topic.slug}`,
        articleCount: getArticleCountForTopic(topic.id),
      })),
    []
  );

  const questions = useMemo<HelpQuestionItem[]>(
    () =>
      popularQuestions.map((q) => ({
        id: String(q.id),
        question: q.question,
        href: `/school/help/${q.topicSlug}/${q.articleSlug}`,
        topicLabel: getTopicBySlug(q.topicSlug)?.title,
      })),
    []
  );

  return (
    <CommonHelpPage
      title="Help"
      topics={topics}
      questions={questions}
      questionsDescription="Quick answers to the most common questions from school administrators."
      requests={{ href: '/school/help/requests', openCount }}
      support={{ email: 'support@sfwgroup.org', contactHref: '/school/help/contact' }}
    />
  );
}
