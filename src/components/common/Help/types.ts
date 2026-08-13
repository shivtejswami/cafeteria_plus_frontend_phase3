/**
 * Shared help-centre contract. The school and district dashboards publish their
 * own topics and questions; everything below is dashboard-agnostic.
 */

export interface HelpTopicItem {
  id: string;
  title: string;
  description: string;
  /** Remixicon class, e.g. 'ri-book-open-line'. */
  icon: string;
  href: string;
  /** Omit to hide the "N articles" line. */
  articleCount?: number;
}

export interface HelpQuestionItem {
  id: string;
  question: string;
  href: string;
  /** Chip shown on the right, usually the owning topic. */
  topicLabel?: string;
}

export interface HelpSupportInfo {
  email: string;
  contactHref: string;
  /** Defaults to "Contact SFWG support". */
  contactLabel?: string;
}

/**
 * Where each help screen links to. Every dashboard mounts help under its own
 * prefix, so the shared screens take these rather than hard-coding /school/...
 */
export interface HelpRoutes {
  home: string;
  contact: string;
  requests: string;
  topic: (topicSlug: string) => string;
  article: (topicSlug: string, articleSlug: string) => string;
}

export interface HelpArticleItem {
  slug: string;
  title: string;
  summary: string;
}

/** Anything other than 'resolved' counts as still open. */
export type HelpRequestStatus = 'open' | 'viewed' | 'in-progress' | 'resolved';

export interface HelpSupportRequestItem {
  id: string;
  reference: string;
  category: string;
  subject: string;
  message: string;
  /** ISO date or an already-formatted display string. */
  submittedDate: string;
  status: HelpRequestStatus;
  resolvedDate?: string;
  /** What support did about it; shown in the expanded detail once resolved. */
  resolutionNote?: string;
  attachmentName?: string;
  /** e.g. "1 day ago" — shown next to the status chip when present. */
  updatedLabel?: string;
}

export interface HelpContactCategory {
  value: string;
  label: string;
}
