/**
 * Header title + subtitle per route.
 *
 * In Figma the page title and its supporting line live inside HEADER-4, not in
 * the page body — e.g. "People" / "Administrators across North Hills School
 * District". This map drives that so the header changes as you navigate.
 * Dynamic detail routes fall through to `resolvePageMeta`.
 */
import { DISTRICT, SCHOOLS, REOPEN_REQUESTS, HELP_ARTICLES } from './districtData';

export type PageMeta = { title: string; subtitle?: string };

const D = DISTRICT.name;

const STATIC_META: Record<string, PageMeta> = {
  '/district/my-account': {
    title: 'My account',
    subtitle: 'Your profile and sign-in'
  },

  '/settings/district': {
    title: 'District settings',
    subtitle: 'Policies for North Hills School District'
  },


  '/subscription': {
    title: 'Subscription',
    subtitle: "Your district's subscription · North Hills School District"
  },

  '/district': { title: D },

  '/district/schools': {
    title: 'Schools',
    subtitle: `All schools in ${D}`,
  },
  '/district/reopen-requests': {
    title: 'Reopen requests',
    subtitle: 'Survey extension requests awaiting a district decision',
  },
  '/district/reports-analytics': {
    title: 'Reports & Analytics',
    subtitle: `District roll-up and school comparison · ${D}`,
  },
  '/district/reports-analytics/school-comparison': {
    title: 'Reports & Analytics',
    subtitle: `District roll-up and school comparison · ${D}`,
  },
  '/district/reports-analytics/survey-to-survey': {
    title: 'Survey-to-survey',
    subtitle: `Compare survey periods across ${D}`,
  },
  '/district/reports-analytics/year-over-year': {
    title: 'Year over year',
    subtitle: `How ${D} has changed across reporting periods`,
  },
  '/district/reports-analytics/district-benchmarks': {
    title: 'District benchmarks',
    subtitle: `How ${D} compares with state and national averages`,
  },
  '/district/people': {
    title: 'People',
    subtitle: `Administrators across ${D}`,
  },
  '/district/activity': {
    title: 'Activity',
    subtitle: `Everything that has happened across ${D}`,
  },
  '/district/help': {
    title: 'Help & support',
    subtitle: 'Guides for running surveys, and a way to reach us',
  },
  '/district/help/getting-started': {
    title: 'Getting started',
    subtitle: 'Find your way around Cafeteria Pulse',
  },
  '/district/help/managing-schools': {
    title: 'Managing schools',
    subtitle: 'Add schools, set enrolment bands, assign administrators',
  },
  '/district/help/my-requests': {
    title: 'My requests',
    subtitle: 'Everything you have sent to support',
  },
  '/district/help/contact': {
    title: 'Contact support',
    subtitle: 'Send a question and get a reply within one working day',
  },
  '/district/notifications': {
    title: 'Notification',
    subtitle: "Activity and alerts across your schools",
  },

  '/district/settings': {
    title: 'Notification preferences',
    subtitle: "How you're notified about your district",
  },
  // Admin routes
  '/admin': {
    title: 'Operations',
    subtitle: 'Platform health, usage, and system status',
  },
  '/admin/customers': {
    title: 'Customers',
    subtitle: 'All districts and schools on Cafeteria Plus',
  },
  '/admin/users': {
    title: 'Users',
    subtitle: 'Administrators across all customers.',
  },
  '/admin/surveys': {
    title: 'Surveys',
    subtitle: 'All surveys across every customer',
  },
  '/admin/reports': {
    title: 'Reports',
    subtitle: 'Generated reports across all customers',
  },
  '/admin/reopen-requests': {
    title: 'Reopen requests',
    subtitle: 'Survey extension requests awaiting approval',
  },
  '/admin/benchmarks': {
    title: 'Benchmarks',
    subtitle: 'State and national benchmark data management',
  },
  '/admin/subscriptions': {
    title: 'Subscriptions',
    subtitle: 'Customer billing and subscription plans',
  },
  '/admin/support': {
    title: 'Support',
    subtitle: 'Customer support tickets and help requests',
  },
  '/admin/activity': {
    title: 'Activity',
    subtitle: 'Platform-wide event log and audit trail',
  },
  '/admin/platform': {
    title: 'Platform',
    subtitle: 'Feature flags, system settings, and configuration',
  },
  '/admin/system-status': {
    title: 'System status',
    subtitle: 'Live infrastructure and service health',
  },

  '/school': { title: 'Home' },

  '/school/surveys': {
    title: 'Surveys',
    subtitle: 'Manage active, scheduled, and past surveys for Hillside Middle',
  },
  '/school/reports': {
    title: 'Reports',
    subtitle: 'Survey insights, comments, and downloadable PDF reports',
  },
  '/school/reports/year-over-year': {
    title: 'Year-over-year comparison',
  },
  '/school/reports/benchmarks': {
    title: 'Benchmarks',
  },
  '/school/activity': {
    title: 'Activity',
    subtitle: 'Log of survey actions and report updates',
  },
  '/school/help': {
    title: 'Help',
    subtitle: 'Guide and answers for Hillside Middle',
  },
  '/school/my-account': {
    title: 'Account settings',
    subtitle: 'Manage your profile and security credentials',
  },
  '/school/subscription': {
    title: 'Subscription',
  },
  '/school/notifications': {
    title: 'Notifications',
  },
};

export function resolvePageMeta(pathname: string): PageMeta | null {
  if (!pathname) return null;

  const exact = STATIC_META[pathname];
  if (exact) return exact;

  // Support status detail: /admin/system-status/([^/]+)
  const statusDetailMatch = pathname.match(/^\/admin\/system-status\/([^/]+)/);
  if (statusDetailMatch) {
    return {
      title: 'Support Status',
    };
  }

  // Admin subscription detail: /admin/subscriptions/<id>
  const adminSubMatch = pathname.match(/^\/admin\/subscriptions\/([^/]+)/);
  if (adminSubMatch) {
    return {
      title: 'Subscription detail',
      subtitle: 'Manage customer subscriptions and billing.',
    };
  }

  // School profile: /district/schools/<id>[/tab]
  const schoolMatch = pathname.match(/^\/district\/schools\/([^/]+)/);
  if (schoolMatch) {
    const school = SCHOOLS.find((s) => s.id === schoolMatch[1]);
    if (school) {
      return {
        title: school.name,
        subtitle: `${D} • ${school.level} • Enrolment ${school.enrolmentBand}`,
      };
    }
  }

  // Reopen review: /district/reopen-requests/<id>
  const reopenMatch = pathname.match(/^\/district\/reopen-requests\/([^/]+)/);
  if (reopenMatch) {
    const request = REOPEN_REQUESTS.find((r) => r.id === reopenMatch[1]);
    if (request) {
      return {
        title: `Reopen request — ${request.schoolName}`,
        subtitle: request.surveyLabel,
      };
    }
  }

  // Help article: /district/help/<section>/<slug>
  const articleMatch = pathname.match(/^\/district\/help\/[^/]+\/([^/]+)/);
  if (articleMatch) {
    const article = HELP_ARTICLES.find((a) => a.slug === articleMatch[1]);
    if (article) return { title: article.title, subtitle: article.summary };
  }

  // Nested routes fall back to their closest ancestor.
  const segments = pathname.split('/').filter(Boolean);
  for (let i = segments.length - 1; i > 0; i -= 1) {
    const parent = `/${segments.slice(0, i).join('/')}`;
    if (STATIC_META[parent]) return STATIC_META[parent];
  }

  return null;
}
