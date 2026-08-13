import Link from 'next/link';
import type { HelpTopicItem } from './types';

export default function HelpTopicGrid({ topics }: { topics: HelpTopicItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {topics.map((topic) => (
        <Link
          key={topic.id}
          href={topic.href}
          className="group block w-full rounded-2xl p-4 sm:p-5 transition-all duration-150 hover:border-sage-200 hover:shadow-raised focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-2 bg-white border border-line shadow-card"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-iris-50">
              <span className="w-5 h-5 flex items-center justify-center text-iris">
                <i className={`${topic.icon} text-xl`}></i>
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold mb-1 group-hover:underline text-ink">{topic.title}</h3>
              <p className="text-[13px] leading-snug text-muted">{topic.description}</p>
              {topic.articleCount !== undefined && (
                <span className="block text-[12px] font-medium mt-1.5 text-subtle">
                  {topic.articleCount} article{topic.articleCount === 1 ? '' : 's'}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function HelpTopicGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-2xl p-4 sm:p-5 animate-pulse bg-white border border-line shadow-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl shrink-0 bg-iris-50" />
            <div className="flex-1 space-y-2">
              <div className="h-5 rounded w-2/3 bg-sage-50" />
              <div className="h-4 rounded w-full bg-sage-50" />
              <div className="h-3 rounded w-16 bg-sage-50" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
