import Link from 'next/link';
import { HelpArticlePage } from '@/components/common/Help';
import type { HelpArticleLink } from '@/components/common/Help/HelpArticlePage';
import { helpArticles, getArticleBySlug, getTopicBySlug, getArticlesByTopic } from '@/lib/schoolHelpContent';
import { schoolHelpRoutes, SUPPORT_EMAIL } from '@/lib/schoolHelpRoutes';

export async function generateStaticParams() {
  return helpArticles.map((a) => ({ topic: a.topic, article: a.slug }));
}

/** Same-topic articles first, then articles from neighbouring topics. */
function getRelatedArticles(currentSlug: string, topicSlug: string, count = 3): HelpArticleLink[] {
  const sameTopic = helpArticles.filter((a) => a.topic === topicSlug && a.slug !== currentSlug);
  const others = helpArticles.filter((a) => a.topic !== topicSlug);

  return [...sameTopic, ...others].slice(0, count).map((a) => ({
    slug: a.slug,
    title: a.title,
    topicTitle: getTopicBySlug(a.topic)?.title ?? a.topic,
    href: schoolHelpRoutes.article(a.topic, a.slug),
  }));
}

export default async function ArticlePage({ params }: { params: Promise<{ topic: string; article: string }> }) {
  // Next.js 15: route params are async and must be awaited before use.
  const { topic: topicParam, article: articleParam } = await params;
  const article = getArticleBySlug(articleParam);
  const topic = getTopicBySlug(topicParam);

  if (!article || !topic) {
    return (
      <div className="rounded-2xl p-6 sm:p-10 text-center bg-white border border-line shadow-card">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-surface-100">
          <span className="w-6 h-6 flex items-center justify-center text-subtle">
            <i className="ri-file-search-line text-2xl"></i>
          </span>
        </div>
        <p className="text-[15px] font-medium mb-1 text-ink">Article not found</p>
        <p className="text-[13px] mb-4 text-muted">This help article doesn&apos;t exist or has been moved.</p>
        <Link
          href={schoolHelpRoutes.home}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-medium transition-colors duration-150 hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 text-ink bg-white border border-line"
        >
          Back to Help
        </Link>
      </div>
    );
  }

  const topicArticles = getArticlesByTopic(topicParam);
  const currentIdx = topicArticles.findIndex((a) => a.slug === article.slug);
  const previous = currentIdx > 0 ? topicArticles[currentIdx - 1] : undefined;
  const next = currentIdx >= 0 && currentIdx < topicArticles.length - 1 ? topicArticles[currentIdx + 1] : undefined;

  // ~200 words a minute, rounded up so a short article still reads "1 min".
  const readingMinutes = Math.max(1, Math.round(article.body.split(/\s+/).length / 200));

  return (
    <HelpArticlePage
      routes={schoolHelpRoutes}
      topicSlug={topic.slug}
      topicTitle={topic.title}
      topicIcon={topic.icon}
      title={article.title}
      body={article.body}
      readingMinutes={readingMinutes}
      previous={previous ? { title: previous.title, href: schoolHelpRoutes.article(topic.slug, previous.slug) } : undefined}
      next={next ? { title: next.title, href: schoolHelpRoutes.article(topic.slug, next.slug) } : undefined}
      relatedArticles={getRelatedArticles(article.slug, topic.slug)}
      support={{ email: SUPPORT_EMAIL, contactHref: schoolHelpRoutes.contact }}
    />
  );
}
