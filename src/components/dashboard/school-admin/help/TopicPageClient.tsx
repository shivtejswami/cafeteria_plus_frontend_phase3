'use client';

import { useMemo } from 'react';
import { HelpTopicPage } from '@/components/common/Help';
import type { HelpArticleItem, HelpTopicItem } from '@/components/common/Help';
import { helpTopics, helpArticles, getTopicBySlug, getArticleCountForTopic } from '@/lib/schoolHelpContent';
import { schoolHelpRoutes, SUPPORT_EMAIL } from '@/lib/schoolHelpRoutes';

/** Up to three topics that follow this one, wrapping around the list. */
function getSiblingTopics(currentSlug: string): HelpTopicItem[] {
  const currentIdx = helpTopics.findIndex((t) => t.slug === currentSlug);
  const siblings: HelpTopicItem[] = [];

  for (let i = 1; i <= helpTopics.length && siblings.length < 3; i += 1) {
    const topic = helpTopics[(currentIdx + i) % helpTopics.length];
    if (topic.slug === currentSlug) continue;
    siblings.push({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      icon: topic.icon,
      href: schoolHelpRoutes.topic(topic.slug),
      articleCount: getArticleCountForTopic(topic.id),
    });
  }

  return siblings;
}

export default function TopicPageClient({ topicSlug }: { topicSlug: string }) {
  const topic = getTopicBySlug(topicSlug);

  const articles = useMemo<HelpArticleItem[]>(
    () =>
      helpArticles
        .filter((a) => a.topic === topicSlug)
        .map((a) => ({ slug: a.slug, title: a.title, summary: a.snippet })),
    [topicSlug]
  );

  const relatedTopics = useMemo(() => getSiblingTopics(topicSlug), [topicSlug]);

  if (!topic) {
    return (
      <div className="rounded-2xl p-6 sm:p-10 text-center bg-white border border-line shadow-card">
        <p className="text-[15px] font-medium mb-1 text-ink">Topic not found</p>
        <p className="text-[13px] text-muted">This help topic doesn&apos;t exist or has been moved.</p>
      </div>
    );
  }

  return (
    <HelpTopicPage
      routes={schoolHelpRoutes}
      topicSlug={topicSlug}
      topicTitle={topic.title}
      topicDescription={topic.description}
      articles={articles}
      relatedTopics={relatedTopics}
      support={{ email: SUPPORT_EMAIL, contactHref: schoolHelpRoutes.contact }}
    />
  );
}
