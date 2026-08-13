import { NotificationGroup } from "./types";

export const NOTIFICATION_MOCK_DATA: NotificationGroup[] = [
  {
    id: "today",
    title: "Today",
    items: [
      {
        id: "1",
        type: "action_required",
        title: "Reopen request from Hillside Middle",
        description: "Maria Torres has asked to reopen the 6-8 Spring 2026 survey. Review the reason and decide whether to approve.",
        meta: "Hillside Middle · 25m ago · Jul 23, 2026",
        isRead: false,
        actionLabel: "Review Request",
        actionHref: "#",
      },
      {
        id: "2",
        type: "attention",
        title: "Maple Elementary is below its participation target",
        description: "Participation is 38% (76 of 200), below the target the school set for this survey. 5 days remain.",
        meta: "Maple Elementary · 55m ago · Jul 23, 2026",
        isRead: false,
        actionLabel: "View Survey",
        actionHref: "#",
      },
      {
        id: "3",
        type: "attention",
        title: "Northgate Middle's report requires additional review",
        description: "The 6-8 Spring 2026 report is being reviewed by SFWG before it's published.",
        meta: "Northgate Middle · 2h ago · Jul 23, 2026",
        isRead: false,
        actionLabel: "View School",
        actionHref: "#",
      },
      {
        id: "4",
        type: "info",
        title: "Your subscription renews on 15 August 2026",
        description: "SFWG will be in touch about renewal. Billing is handled by SFWG outside the platform.",
        meta: "Today · Jul 23, 2026",
        isRead: false,
        actionLabel: "View Subscription",
        actionHref: "#",
      }
    ]
  },
  {
    id: "yesterday",
    title: "Yesterday",
    items: [
      {
        id: "5",
        type: "info",
        title: "A benchmark is now available for 6-8",
        description: "Enough comparable schools have participated, so you can compare against the Cafeteria Pulse participating-school benchmark.",
        meta: "Yesterday · Jul 22, 2026",
        isRead: true,
        actionLabel: "View Benchmark",
        actionHref: "#",
      },
      {
        id: "6",
        type: "info",
        title: "Support request resolved",
        description: "SFWG has marked \"Export issue for Hillside report\" as resolved.",
        meta: "Yesterday · Jul 22, 2026",
        isRead: true,
        actionLabel: "My request",
        actionHref: "#",
      },
      {
        id: "7",
        type: "info",
        title: "Survey closed at Cedar Grove Elementary",
        description: "The K-5 Spring 2026 survey closed with 72% participation (144 of 200). Analysis has started.",
        meta: "Cedar Grove Elementary · Yesterday · Jul 22, 2026",
        isRead: true,
        actionLabel: "View Survey",
        actionHref: "#",
      }
    ]
  },
  {
    id: "earlier_this_week",
    title: "Earlier this week",
    items: [
      {
        id: "8",
        type: "action_required",
        title: "Reopen request still waiting",
        description: "Westbrook High's request has been waiting 3 days. The survey can't collect more responses until it's decided.",
        meta: "Westbrook High · 2 days ago · Jul 21, 2026",
        isRead: false,
        actionLabel: "Review Request",
        actionHref: "#",
      },
      {
        id: "9",
        type: "info",
        title: "Report ready for Parkview Middle",
        description: "The 6-8 Spring 2026 report is published and available to view or download as a PDF.",
        meta: "Parkview Middle · 3 days ago · Jul 20, 2026",
        isRead: true,
        actionLabel: "View Report",
        actionHref: "#",
      },
      {
        id: "10",
        type: "attention",
        title: "Survey closing soon at Hillside Middle",
        description: "The 6-8 Spring 2026 survey closes on 28 July 2026. Participation is currently 61% (183 of 300).",
        meta: "Hillside Middle · 5 days ago · Jul 18, 2026",
        isRead: true,
        actionLabel: "View Survey",
        actionHref: "#",
      },
      {
        id: "11",
        type: "info",
        title: "You approved a reopen for Elm Street Elementary",
        description: "The K-5 Fall 2025 survey is collecting again until 10 August 2026. Its current report is temporarily unavailable, and a new version will be generated when the survey closes.",
        meta: "Elm Street Elementary · 6 days ago · Jul 17, 2026",
        isRead: true,
        actionLabel: "View Survey",
        actionHref: "#",
      }
    ]
  },
  {
    id: "earlier",
    title: "Earlier",
    items: [
      {
        id: "12",
        type: "info",
        title: "Brighton Elementary added to your district",
        description: "The school has been added and its administrator invited automatically.",
        meta: "Brighton Elementary · 1 week ago · Jul 16, 2026",
        isRead: true,
        actionLabel: "View School",
        actionHref: "#",
      },
      {
        id: "13",
        type: "info",
        title: "Survey opened at Maple Elementary",
        description: "The K-5 Spring 2026 survey is now collecting responses until 5 August 2026.",
        meta: "Maple Elementary · 1 week ago · Jul 13, 2026",
        isRead: true,
        actionLabel: "View Survey",
        actionHref: "#",
      },
      {
        id: "14",
        type: "info",
        title: "Weekly participation summary",
        description: "4 surveys are open across your district. 1 school is below their target.",
        meta: "1 week ago · Jul 10, 2026",
        isRead: true,
        actionLabel: "View Schools",
        actionHref: "#",
      },
      {
        id: "15",
        type: "info",
        title: "You declined a reopen for Westbrook High",
        description: "The survey stays closed and its current report is unchanged. Westbrook High's administrator has been notified with your reason.",
        meta: "Westbrook High · 1 week ago · Jul 13, 2026",
        isRead: true,
        actionLabel: "View Request",
        actionHref: "#",
      }
    ]
  }
];
