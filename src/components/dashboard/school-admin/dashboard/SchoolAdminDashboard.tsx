'use client';

import DashboardGreeting from '@/components/school-admin/dashboard/components/DashboardGreeting';
import LiveSurveyCard from '@/components/school-admin/dashboard/components/LiveSurveyCard';
import LatestReportCard from '@/components/school-admin/dashboard/components/LatestReportCard';
import AtAGlanceStrip from '@/components/school-admin/dashboard/components/AtAGlanceStrip';
import UpcomingRecentList from '@/components/school-admin/dashboard/components/UpcomingRecentList';
import QuickLinks from '@/components/school-admin/dashboard/components/QuickLinks';
import GracePeriodBanner from '@/components/school-admin/common/GracePeriodBanner';
import ReadOnlyBanner from '@/components/school-admin/common/ReadOnlyBanner';
import EmptyStateToggle from '@/components/ui/EmptyStateToggle';
import type { SchoolAdminData } from '@/lib/schoolAdminData';
import type { UpcomingRecentItem } from '@/components/school-admin/dashboard/components/UpcomingRecentList';

export default function SchoolAdminDashboard({ data }: { data: SchoolAdminData }) {
  const liveSurvey = data.surveys.find(s => s.status === 'live') || null;
  const scheduledSurveys = data.surveys.filter(s => s.status === 'scheduled');
  const pastSurveys = data.surveys.filter(s => s.status === 'closed' || s.status === 'analysing' || s.status === 'under-review');
  const isReadOnly = data.subscriptionStatus === 'read-only';

  const nextScheduled = scheduledSurveys.length > 0 ? scheduledSurveys[0] : null;
  const mostRecentPast = pastSurveys.length > 0 ? pastSurveys[0] : null;

  const glanceTiles = [
    {
      label: 'Latest report',
      value: data.latestReport ? `${data.latestReport.gradeBand} ${data.latestReport.period}` : '6-8 Spring 2025',
      sub: undefined,
      href: data.latestReport ? `/school/reports/${data.latestReport.id}` : undefined,
      isEmpty: false,
      emptyLabel: 'No reports yet',
    },
    {
      label: 'Next scheduled',
      value: nextScheduled ? `${nextScheduled.gradeBand} ${nextScheduled.period}` : '6-8 Fall 2026',
      sub: nextScheduled ? `Opens ${nextScheduled.openedDate.split(' ')[0]} ${nextScheduled.openedDate.split(' ')[1]}` : 'Opens 15 September',
      href: nextScheduled ? `/school/surveys/${nextScheduled.id}` : undefined,
      isEmpty: false,
      emptyLabel: 'None scheduled',
    },
    {
      label: 'Total Reports',
      value: '23 reports',
      sub: undefined,
      href: '/school/reports',
      isEmpty: false,
    },
    {
      label: 'Total Surveys',
      value: '28 surveys',
      sub: undefined,
      href: '/school/surveys',
      isEmpty: false,
    },
  ];

  const upcomingItem: UpcomingRecentItem | null = nextScheduled
    ? {
      label: `${nextScheduled.gradeBand} ${nextScheduled.period}`,
      detail: `Opens ${nextScheduled.openedDate.split(' ')[0]} ${nextScheduled.openedDate.split(' ')[1]} ${nextScheduled.openedDate.split(' ')[2]} \u00B7 Target: ${nextScheduled.targetCount} students`,
      href: `/school/surveys/${nextScheduled.id}`,
      linkLabel: 'View',
    }
    : null;

  const recentItem: UpcomingRecentItem | null = mostRecentPast
    ? {
      label: `${mostRecentPast.gradeBand} ${mostRecentPast.period}`,
      detail:
        mostRecentPast.status === 'analysing'
          ? 'Your report is being generated.'
          : mostRecentPast.status === 'under-review'
            ? 'Report is under review.'
            : `${mostRecentPast.responseCount} of ${mostRecentPast.targetCount} responses \u00B7 Closed ${mostRecentPast.closesDate.split(' ')[0]} ${mostRecentPast.closesDate.split(' ')[1]} ${mostRecentPast.closesDate.split(' ')[2]}`,
      statusLabel:
        mostRecentPast.status === 'analysing'
          ? 'Analysing'
          : mostRecentPast.status === 'under-review'
            ? 'Under review'
            : 'Closed',
      statusColor: mostRecentPast.status === 'under-review' ? 'text-[#D97706]' : 'text-[#6D6D6D]',
      statusBg: mostRecentPast.status === 'under-review' ? 'bg-[#FFECD1]' : 'bg-[#F1EFEA]',
      // Always land on that survey's own page; it decides what to show for its status.
      href: `/school/surveys/${mostRecentPast.id}`,
      linkLabel: 'View',
    }
    : null;

  return (
    <div>
      {data.subscriptionStatus === 'grace-period' && data.graceDaysRemaining && (
        <GracePeriodBanner daysRemaining={data.graceDaysRemaining} />
      )}
      {data.subscriptionStatus === 'read-only' && <ReadOnlyBanner />}

      <DashboardGreeting
        adminName={data.adminName}
        schoolName={data.schoolName}
        todayDate={data.todayDate}
        disabled={isReadOnly}
      />

      <div className="mb-6 sm:mb-8">
        <h3
          className="text-[13px] font-semibold tracking-wider mb-3 sm:mb-4 text-[#9A9A9A] "
        >
          At a glance
        </h3>
        <AtAGlanceStrip tiles={glanceTiles} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="lg:col-span-2 h-full">
          <LiveSurveyCard survey={liveSurvey} disabled={isReadOnly} />
        </div>
        <div className="lg:col-span-1 h-full">
          {data.latestReport ? (
            <LatestReportCard report={data.latestReport} />
          ) : (
            <EmptyStateToggle
              isEmpty={true}
              emptyIcon="ri-file-chart-line"
              emptyTitle="No reports yet"
              emptyDescription="Reports appear after a survey closes and analysis completes."
            >
              <div
                className="rounded-2xl p-4 sm:p-6 text-center h-full flex flex-col items-center justify-center bg-white border border-line shadow-card"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-sage-50">
                  <span className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-file-chart-line text-[18px] text-subtle"></i>
                  </span>
                </div>
                <p className="text-[15px] font-semibold mb-1 text-ink">
                  No reports yet
                </p>
                <p className="text-[13px] text-subtle">
                  Reports appear after a survey closes and analysis completes.
                </p>
              </div>
            </EmptyStateToggle>
          )}
        </div>
      </div>

      <div className="mb-6">
        <UpcomingRecentList upcoming={upcomingItem} recent={recentItem} />
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-2 pb-4">
        <QuickLinks />
      </div>
    </div>
  );
}