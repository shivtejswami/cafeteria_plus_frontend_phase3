import Link from 'next/link';
import HelpBreadcrumb from './HelpBreadcrumb';
import HelpArticleBody from './HelpArticleBody';
import HelpSupportCard from './HelpSupportCard';
import type { HelpRoutes, HelpSupportInfo } from './types';

export interface HelpArticleLink {
  slug: string;
  title: string;
  topicTitle: string;
  href: string;
}

interface HelpArticlePageProps {
  routes: HelpRoutes;
  topicSlug: string;
  topicTitle: string;
  topicIcon: string;
  title: string;
  body: string;
  readingMinutes?: number;
  previous?: { title: string; href: string };
  next?: { title: string; href: string };
  relatedArticles?: HelpArticleLink[];
  support: HelpSupportInfo;
}

export default function HelpArticlePage({
  routes,
  topicSlug,
  topicTitle,
  topicIcon,
  title,
  body,
  readingMinutes = 1,
  previous,
  next,
  relatedArticles = [],
  support,
}: HelpArticlePageProps) {
  return (
    <div className="space-y-6">
      <header>
        <HelpBreadcrumb
          crumbs={[
            { label: 'Help', href: routes.home },
            { label: topicTitle, href: routes.topic(topicSlug) },
            { label: title },
          ]}
        />
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mt-3 text-[12px] font-medium bg-iris-50 text-iris">
          <span className="w-3.5 h-3.5 flex items-center justify-center">
            <i className={`${topicIcon} text-[13px]`}></i>
          </span>
          {topicTitle}
        </span>
        <h1 className="text-[19px] sm:text-[24px] font-bold mt-2 wrap-break-word text-ink">{title}</h1>
      </header>

      <article className="rounded-2xl p-4 sm:p-6 bg-white border border-line shadow-card">
        <div className="flex items-center gap-3 pb-4 border-b border-line">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-iris-50">
            <span className="w-4 h-4 flex items-center justify-center text-iris">
              <i className="ri-file-text-line text-base"></i>
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-iris">Article</p>
            <p className="text-[12px] text-subtle">{readingMinutes} min read</p>
          </div>
        </div>

        <div className="pt-4">
          <HelpArticleBody body={body} />
        </div>
      </article>

      {(previous || next) && (
        <nav
          aria-label="Article navigation"
          className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-6"
        >
          {previous ? (
            <Link
              href={previous.href}
              className="inline-flex items-start gap-2 min-w-0 text-[13px] font-medium text-left transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-iris"
            >
              <span className="w-4 h-4 flex items-center justify-center shrink-0">
                <i className="ri-arrow-left-line text-base"></i>
              </span>
              <span className="min-w-0">{previous.title}</span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <Link
              href={next.href}
              className="inline-flex items-start sm:justify-end gap-2 min-w-0 text-[13px] font-medium transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-iris"
            >
              <span className="min-w-0 sm:text-right">{next.title}</span>
              <span className="w-4 h-4 flex items-center justify-center shrink-0">
                <i className="ri-arrow-right-line text-base"></i>
              </span>
            </Link>
          )}
        </nav>
      )}

      <Link
        href={routes.topic(topicSlug)}
        className="inline-flex items-center gap-2 text-[13px] font-medium transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-muted"
      >
        <span className="w-4 h-4 flex items-center justify-center">
          <i className="ri-arrow-left-line text-base"></i>
        </span>
        Back to {topicTitle}
      </Link>

      {relatedArticles.length > 0 && (
        <section>
          <h2 className="text-[13px] font-medium mb-2 text-subtle">Related articles</h2>
          <div className="space-y-2">
            {relatedArticles.map((article) => (
              <Link
                key={article.slug}
                href={article.href}
                className="group flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-colors duration-150 hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 bg-white border border-line"
              >
                <span className="min-w-0">
                  <span className="block text-[14px] font-medium wrap-break-word group-hover:underline text-iris">
                    {article.title}
                  </span>
                  <span className="block text-[12px] text-subtle">{article.topicTitle}</span>
                </span>
                <span className="w-5 h-5 flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 text-subtle">
                  <i className="ri-arrow-right-s-line text-lg"></i>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <HelpSupportCard {...support} />
    </div>
  );
}
