'use client';

import Link from 'next/link';
import HelpBreadcrumb from './HelpBreadcrumb';
import HelpSupportCard from './HelpSupportCard';
import type { HelpArticleItem, HelpRoutes, HelpSupportInfo, HelpTopicItem } from './types';

interface HelpTopicPageProps {
  routes: HelpRoutes;
  topicSlug: string;
  topicTitle: string;
  topicDescription: string;
  articles: HelpArticleItem[];
  /** Other topics, shown as pills under the article list. */
  relatedTopics?: HelpTopicItem[];
  support: HelpSupportInfo;
}

export default function HelpTopicPage({
  routes,
  topicSlug,
  topicTitle,
  topicDescription,
  articles,
  relatedTopics = [],
  support,
}: HelpTopicPageProps) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <header>
        <HelpBreadcrumb crumbs={[{ label: 'Help', href: routes.home }, { label: topicTitle }]} />
        <h1 className="text-[19px] sm:text-[24px] font-bold mt-3 mb-1 text-ink">{topicTitle}</h1>
        <p className="text-[14px] sm:text-[15px] text-muted">{topicDescription}</p>
        <p className="text-[13px] mt-3 text-subtle">
          {articles.length} article{articles.length === 1 ? '' : 's'}
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="rounded-2xl p-6 sm:p-10 text-center bg-white border border-line shadow-card">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-surface-100">
            <span className="w-6 h-6 flex items-center justify-center text-subtle">
              <i className="ri-file-list-3-line text-2xl"></i>
            </span>
          </div>
          <p className="text-[15px] font-medium mb-1 text-ink">No articles in this topic yet.</p>
          <p className="text-[13px] text-muted">Check back soon, or contact support if you need help now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={routes.article(topicSlug, article.slug)}
              className="group flex items-start justify-between gap-4 rounded-xl p-4 sm:p-5 transition-colors duration-150 hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 bg-white border border-line"
            >
              <div className="min-w-0">
                <h2 className="text-[15px] font-semibold mb-1 wrap-break-word group-hover:underline text-ink">
                  {article.title}
                </h2>
                <p className="text-[13px] leading-snug wrap-break-word text-muted">{article.summary}</p>
              </div>
              <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-150 group-hover:translate-x-0.5 text-subtle">
                <i className="ri-arrow-right-s-line text-lg"></i>
              </span>
            </Link>
          ))}
        </div>
      )}

      {relatedTopics.length > 0 && (
        <section>
          <h2 className="text-[13px] font-medium mb-2 text-subtle">Related topics</h2>
          <div className="flex flex-wrap gap-2">
            {relatedTopics.map((topic) => (
              <Link
                key={topic.id}
                href={topic.href}
                className="inline-flex items-center gap-2 h-9 px-3.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors duration-150 hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 text-ink bg-white border border-line"
              >
                <span className="w-4 h-4 flex items-center justify-center text-sage">
                  <i className={`${topic.icon} text-sm`}></i>
                </span>
                {topic.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <HelpSupportCard {...support} />
    </div>
  );
}
