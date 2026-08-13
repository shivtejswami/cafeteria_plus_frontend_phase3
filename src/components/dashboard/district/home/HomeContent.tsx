'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Building2,
  FileText,
  RefreshCw,
  School,
  Users,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { StatusChip } from '@/components/ui/StatusChip';
import { Pagination } from '@/components/ui/Pagination';
import { ActivityRow } from '@/components/common/Activity/ActivityRow';
import { AttentionDot } from '@/components/dashboard/district/shared/AttentionDot';
import { LevelChip } from '@/components/dashboard/district/shared/LevelChip';
import { ParticipationCell } from '@/components/dashboard/district/shared/ParticipationCell';
import { SectionCard } from '@/components/dashboard/district/shared/SectionCard';
import { DISTRICT, DISTRICT_ACTIVITY, CURRENT_USER, SCHOOLS } from '@/constants/districtData';
import { barWidthClass } from '@/utils/barWidth';

const SCHOOLS_PER_PAGE = 8;
const ACTIVITY_PER_PAGE = 5;

/** District home — frame "District dashboard>home" (2226:3). */
export function HomeContent() {
  const [schoolPage, setSchoolPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);

  const schoolPages = Math.ceil(SCHOOLS.length / SCHOOLS_PER_PAGE);
  const currentSchools = SCHOOLS.slice(
    (schoolPage - 1) * SCHOOLS_PER_PAGE,
    schoolPage * SCHOOLS_PER_PAGE,
  );

  const activityPages = Math.ceil(DISTRICT_ACTIVITY.length / ACTIVITY_PER_PAGE);
  const currentActivity = DISTRICT_ACTIVITY.slice(
    (activityPage - 1) * ACTIVITY_PER_PAGE,
    activityPage * ACTIVITY_PER_PAGE,
  );

  const attentionSubtext = (
    <div className="text-gold text-[11px] bg-[#FFF9F0] w-fit p-1.5 rounded-full flex items-center gap-1 font-semibold">
      <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 3C0 1.34315 1.34315 0 3 0C4.65685 0 6 1.34315 6 3C6 4.65685 4.65685 6 3 6C1.34315 6 0 4.65685 0 3Z" fill="#D97706" />
      </svg>
      attention
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {CURRENT_USER.firstName}
        </h1>
        <p className="text-sm text-slate-500">
          Wednesday, 15 July 2026 · {DISTRICT.schools} schools
        </p>
      </div>

      {/* Metric tiles ------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Schools"
          value={DISTRICT.schools}
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 14 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 10H13.75V11.25H0V10H1.25V0.625C1.25 0.45 1.31042 0.302083 1.43125 0.18125C1.55208 0.0604162 1.7 0 1.875 0H8.125C8.3 0 8.44792 0.0604162 8.56875 0.18125C8.68958 0.302083 8.75 0.45 8.75 0.625V10H11.25V5H10V3.75H11.875C12.05 3.75 12.1979 3.81042 12.3188 3.93125C12.4396 4.05208 12.5 4.2 12.5 4.375V10ZM2.5 1.25V10H7.5V1.25H2.5ZM3.75 5H6.25V6.25H3.75V5ZM3.75 2.5H6.25V3.75H3.75V2.5Z"
                fill="#6D6D6D"
              />
            </svg>
          }
          iconBgColor="bg-[#F1EFEA]"
          iconTextColor="text-[#6D6D6D]"
          href="/district/schools"
          className="border-t-3"
        />
        <StatCard
          title="Active surveys"
          value={DISTRICT.activeSurveys}
          subtext="across the district"
          icon={<svg width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.8125 13.75H2.8125C2.6375 13.75 2.48958 13.6896 2.36875 13.5687C2.24792 13.4479 2.1875 13.3 2.1875 13.125V1.875C2.1875 1.7 2.24792 1.55208 2.36875 1.43125C2.48958 1.31042 2.6375 1.25 2.8125 1.25H12.8125C12.9875 1.25 13.1354 1.31042 13.2563 1.43125C13.3771 1.55208 13.4375 1.7 13.4375 1.875V13.125C13.4375 13.3 13.3771 13.4479 13.2563 13.5687C13.1354 13.6896 12.9875 13.75 12.8125 13.75ZM12.1875 12.5V2.5H3.4375V12.5H12.1875ZM5.3125 4.375H10.3125V5.625H5.3125V4.375ZM5.3125 6.875H10.3125V8.125H5.3125V6.875ZM5.3125 9.375H10.3125V10.625H5.3125V9.375Z" fill="#586D4D" />
          </svg>
          }
          iconBgColor="bg-[#E3F5E3]"
          iconTextColor="text-[#586D4D]"
          href="/district/schools?status=open"
          className="border-t-3"
        />
        <StatCard
          title="Reports available"
          value={DISTRICT.reportsAvailable}
          subtext="this term"
          icon={<svg width="16" height="16" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 3.125H6.25V9.375H5V3.125ZM7.5 5.625H8.75V9.375H7.5V5.625ZM2.5 6.875H3.75V9.375H2.5V6.875ZM7.5 1.25H1.25V11.25H10V3.75H7.5V1.25ZM0 0.625C0 0.45 0.0604167 0.302083 0.18125 0.18125C0.302083 0.0604162 0.45 0 0.625 0H8.125L11.25 3.125V11.875C11.25 12.0417 11.1896 12.1875 11.0688 12.3125C10.9479 12.4375 10.8 12.5 10.625 12.5H0.625C0.45 12.5 0.302083 12.4396 0.18125 12.3187C0.0604167 12.1979 0 12.05 0 11.875V0.625Z" fill="#6D28D9"/>
</svg>

          }
          iconBgColor="bg-[#F0EAFB]"
          iconTextColor="text-[#6D28D9]"
          href="/district/reports-analytics"
          className="border-t-3"
        />
        <StatCard
          title="Schools below target"
          value={DISTRICT.schoolsBelowTarget}
          subtext={attentionSubtext}
          icon={<svg width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.2749 9.0501V10.3626C7.86657 10.2209 7.4499 10.1501 7.0249 10.1501C6.34157 10.1501 5.70824 10.3209 5.1249 10.6626C4.55824 10.9876 4.1124 11.4334 3.7874 12.0001C3.44574 12.5834 3.2749 13.2168 3.2749 13.9001H2.0249C2.0249 12.9918 2.2499 12.1501 2.6999 11.3751C3.14157 10.6168 3.74157 10.0168 4.4999 9.5751C5.2749 9.1251 6.11657 8.9001 7.0249 8.9001C7.4499 8.9001 7.86657 8.9501 8.2749 9.0501ZM7.0249 8.2751C6.34157 8.2751 5.70824 8.10426 5.1249 7.7626C4.55824 7.42926 4.1124 6.97926 3.7874 6.4126C3.44574 5.82926 3.2749 5.19801 3.2749 4.51885C3.2749 3.83968 3.44574 3.20843 3.7874 2.6251C4.1124 2.05843 4.55824 1.6126 5.1249 1.2876C5.70824 0.94593 6.33949 0.775098 7.01865 0.775098C7.69782 0.775098 8.32907 0.94593 8.9124 1.2876C9.47907 1.6126 9.92907 2.05843 10.2624 2.6251C10.6041 3.20843 10.7749 3.83968 10.7749 4.51885C10.7749 5.19801 10.6041 5.82926 10.2624 6.4126C9.92907 6.97926 9.47907 7.42926 8.9124 7.7626C8.32907 8.10426 7.6999 8.2751 7.0249 8.2751ZM7.0249 7.0251C7.4749 7.0251 7.89157 6.9126 8.2749 6.6876C8.65824 6.4626 8.9624 6.15843 9.1874 5.7751C9.4124 5.39176 9.5249 4.97301 9.5249 4.51885C9.5249 4.06468 9.4124 3.64593 9.1874 3.2626C8.9624 2.87926 8.65824 2.57718 8.2749 2.35635C7.89157 2.13551 7.47282 2.0251 7.01865 2.0251C6.56449 2.0251 6.14574 2.13551 5.7624 2.35635C5.37907 2.57718 5.07699 2.87926 4.85615 3.2626C4.63532 3.64593 4.5249 4.06468 4.5249 4.51885C4.5249 4.97301 4.63532 5.39176 4.85615 5.7751C5.07699 6.15843 5.37907 6.4626 5.7624 6.6876C6.14574 6.9126 6.56657 7.0251 7.0249 7.0251ZM11.3999 11.1376L12.7249 9.8126L13.5999 10.7001L12.2749 12.0251L13.5999 13.3501L12.7249 14.2251L11.3999 12.9001L10.0749 14.2251L9.1874 13.3501L10.5124 12.0251L9.1874 10.7001L10.0749 9.8126L11.3999 11.1376Z" fill="#D97706" />
          </svg>
          }
          iconBgColor="bg-[#FFECD1]"
          iconTextColor="text-[#D97706]"
          href="/district/schools?participation=below"
          valueColor="text-[#D97706]"
          className="border-t-3"
        />
        <StatCard
          title="Reopen requests"
          value={DISTRICT.reopenRequests}
          subtext={attentionSubtext}
          icon={<svg width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.8125 2.5C6.97083 2.5 6.17917 2.7 5.4375 3.1C4.72083 3.48333 4.13333 4.0125 3.675 4.6875H5.3125V5.9375H1.5625V2.1875H2.8125V3.75C3.39583 2.975 4.11667 2.36667 4.975 1.925C5.85833 1.475 6.80417 1.25 7.8125 1.25C8.6625 1.25 9.475 1.4125 10.25 1.7375C10.9917 2.05417 11.6521 2.50208 12.2312 3.08125C12.8104 3.66042 13.2583 4.32083 13.575 5.0625C13.9 5.8375 14.0625 6.65 14.0625 7.5H12.8125C12.8125 6.59167 12.5833 5.75 12.125 4.975C11.6833 4.225 11.0875 3.62917 10.3375 3.1875C9.5625 2.72917 8.72083 2.5 7.8125 2.5ZM2.8125 7.5C2.8125 8.40833 3.04167 9.25 3.5 10.025C3.94167 10.775 4.5375 11.3708 5.2875 11.8125C6.0625 12.2708 6.90417 12.5 7.8125 12.5C8.65417 12.5 9.44583 12.3 10.1875 11.9C10.9042 11.5167 11.4917 10.9875 11.95 10.3125H10.3125V9.0625H14.0625V12.8125H12.8125V11.25C12.2292 12.025 11.5083 12.6333 10.65 13.075C9.76667 13.525 8.82083 13.75 7.8125 13.75C6.9625 13.75 6.15 13.5875 5.375 13.2625C4.63333 12.9458 3.97292 12.4979 3.39375 11.9187C2.81458 11.3396 2.36667 10.6792 2.05 9.9375C1.725 9.1625 1.5625 8.35 1.5625 7.5H2.8125Z" fill="#D97706" />
          </svg>
          }
          iconBgColor="bg-[#FFECD1]"
          iconTextColor="text-[#D97706]"
          href="/district/reopen-requests"
          valueColor="text-[#D97706]"
          className="border-t-3"
        />
        <StatCard
          title="District satisfaction"
          value={`${DISTRICT.satisfaction}%`}
          icon={<svg width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.8125 13.75C6.9625 13.75 6.15 13.5875 5.375 13.2625C4.63333 12.9458 3.97292 12.4979 3.39375 11.9187C2.81458 11.3396 2.36667 10.6792 2.05 9.9375C1.725 9.1625 1.5625 8.35 1.5625 7.5C1.5625 6.65 1.725 5.8375 2.05 5.0625C2.36667 4.32083 2.81458 3.66042 3.39375 3.08125C3.97292 2.50208 4.63333 2.05417 5.375 1.7375C6.15 1.4125 6.9625 1.25 7.8125 1.25C8.6625 1.25 9.475 1.4125 10.25 1.7375C10.9917 2.05417 11.6521 2.50208 12.2312 3.08125C12.8104 3.66042 13.2583 4.32083 13.575 5.0625C13.9 5.8375 14.0625 6.65 14.0625 7.5C14.0625 8.35 13.9 9.1625 13.575 9.9375C13.2583 10.6792 12.8104 11.3396 12.2312 11.9187C11.6521 12.4979 10.9917 12.9458 10.25 13.2625C9.475 13.5875 8.6625 13.75 7.8125 13.75ZM7.8125 12.5C8.72083 12.5 9.5625 12.2708 10.3375 11.8125C11.0875 11.3708 11.6833 10.775 12.125 10.025C12.5833 9.25 12.8125 8.40833 12.8125 7.5C12.8125 6.59167 12.5833 5.75 12.125 4.975C11.6833 4.225 11.0875 3.62917 10.3375 3.1875C9.5625 2.72917 8.72083 2.5 7.8125 2.5C6.90417 2.5 6.0625 2.72917 5.2875 3.1875C4.5375 3.62917 3.94167 4.225 3.5 4.975C3.04167 5.75 2.8125 6.59167 2.8125 7.5C2.8125 8.40833 3.04167 9.25 3.5 10.025C3.94167 10.775 4.5375 11.3708 5.2875 11.8125C6.0625 12.2708 6.90417 12.5 7.8125 12.5ZM4.6875 8.125H5.9375C5.9375 8.46667 6.02083 8.78125 6.1875 9.06875C6.35417 9.35625 6.58125 9.58333 6.86875 9.75C7.15625 9.91667 7.47083 10 7.8125 10C8.15417 10 8.46875 9.91667 8.75625 9.75C9.04375 9.58333 9.27083 9.35625 9.4375 9.06875C9.60417 8.78125 9.6875 8.46667 9.6875 8.125H10.9375C10.9375 8.69167 10.7979 9.21458 10.5188 9.69375C10.2396 10.1729 9.86042 10.5521 9.38125 10.8312C8.90208 11.1104 8.37917 11.25 7.8125 11.25C7.24583 11.25 6.72292 11.1104 6.24375 10.8312C5.76458 10.5521 5.38542 10.1729 5.10625 9.69375C4.82708 9.21458 4.6875 8.69167 4.6875 8.125ZM5.3125 6.875C5.05417 6.875 4.83333 6.78333 4.65 6.6C4.46667 6.41667 4.375 6.19583 4.375 5.9375C4.375 5.67917 4.46667 5.45833 4.65 5.275C4.83333 5.09167 5.05417 5 5.3125 5C5.57083 5 5.79167 5.09167 5.975 5.275C6.15833 5.45833 6.25 5.67917 6.25 5.9375C6.25 6.19583 6.15833 6.41667 5.975 6.6C5.79167 6.78333 5.57083 6.875 5.3125 6.875ZM10.3125 6.875C10.0542 6.875 9.83333 6.78333 9.65 6.6C9.46667 6.41667 9.375 6.19583 9.375 5.9375C9.375 5.67917 9.46667 5.45833 9.65 5.275C9.83333 5.09167 10.0542 5 10.3125 5C10.5708 5 10.7917 5.09167 10.975 5.275C11.1583 5.45833 11.25 5.67917 11.25 5.9375C11.25 6.19583 11.1583 6.41667 10.975 6.6C10.7917 6.78333 10.5708 6.875 10.3125 6.875Z" fill="#586D4D" />
          </svg>
          }
          iconBgColor="bg-[#E3F5E3]"
          iconTextColor="text-[#586D4D]"
          href="/district/reports-analytics"
          className="border-t-3"
          subtext={
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sage rounded-full"
                  style={{ width: `${DISTRICT.satisfaction}%` }}
                />
              </div>
              <span className="text-xs font-medium text-sage">
                {DISTRICT.satisfaction}%
              </span>
            </div>
          }
        />
      </div>

      {/* Your schools -------------------------------------------------- */}
      <SectionCard
        title="Your schools"
        action={{ label: 'View all schools', href: '/district/schools' }}
        legend={
          <span className="flex items-center gap-1.5">
            <AttentionDot />
            <span className="text-xs text-[#9A9A9A]">requires attention</span>
          </span>
        }
        footer={
          schoolPages > 1 ? (
            <Pagination
              currentPage={schoolPage}
              totalPages={schoolPages}
              totalItems={SCHOOLS.length}
              itemsPerPage={SCHOOLS_PER_PAGE}
              itemName="schools"
              onPageChange={setSchoolPage}
            />
          ) : null
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Participation</TableHead>
              <TableHead>Report</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSchools.map((school) => (
              <TableRow key={school.id}>
                <TableCell className="font-medium text-slate-900">
                  <div className="flex items-center gap-2">
                    {school.needsAttention && <AttentionDot />}
                    <Link
                      href={`/district/schools/${school.id}`}
                      className="truncate hover:text-[#6D28D9]"
                    >
                      {school.name}
                    </Link>
                    <LevelChip level={school.level} />
                  </div>
                </TableCell>
                <TableCell>
                  <StatusChip status={school.status} />
                </TableCell>
                <TableCell>
                  <ParticipationCell
                    responses={school.responses}
                    target={school.target}
                    belowTarget={school.belowTarget}
                  />
                </TableCell>
                <TableCell>
                  {school.latestReport ? (
                    <Link
                      href={`/district/schools/${school.id}/reports`}
                      className="text-[#6D28D9] text-sm font-medium hover:underline"
                    >
                      View
                    </Link>
                  ) : (
                    <span className="text-slate-400">–</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      {/* Recent activity ----------------------------------------------- */}
      <SectionCard
        title="Recent activity"
        action={{ label: 'View all activity', href: '/district/activity' }}
        footer={
          activityPages > 1 ? (
            <Pagination
              currentPage={activityPage}
              totalPages={activityPages}
              totalItems={DISTRICT_ACTIVITY.length}
              itemsPerPage={ACTIVITY_PER_PAGE}
              itemName="activities"
              onPageChange={setActivityPage}
            />
          ) : null
        }
      >
        <div className="divide-y divide-slate-100">
          {currentActivity.map((event) => (
            <ActivityRow key={event.id} event={event} />
          ))}
        </div>
      </SectionCard>

      {/* Quick report links -------------------------------------------- */}
      <nav aria-label="District reports" className="flex flex-wrap gap-3">
        {[
          { label: 'District roll-up report', href: '/district/reports-analytics' },
          { label: 'School comparison', href: '/district/reports-analytics/school-comparison' },
          { label: 'District benchmarks', href: '/district/reports-analytics/district-benchmarks' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
