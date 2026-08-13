import Link from 'next/link';

export interface HelpCrumb {
  label: string;
  href?: string;
}

/** Trailing crumb is the current page and never renders as a link. */
export default function HelpBreadcrumb({ crumbs }: { crumbs: HelpCrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[13px]">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={`${crumb.label}-${i}`} className="flex items-center gap-2 min-w-0">
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className="whitespace-nowrap transition-colors duration-150 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-iris focus-visible:ring-offset-1 rounded text-muted"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium wrap-break-word text-ink" aria-current="page">
                {crumb.label}
              </span>
            )}
            {!isLast && (
              <span className="w-4 h-4 flex items-center justify-center text-subtle">
                <i className="ri-arrow-right-s-line text-sm"></i>
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
