'use client';

import React from 'react';
import Link from 'next/link';
import { ClipboardList, FileText, Info } from 'lucide-react';
import { StatusChip } from '@/components/ui/StatusChip';
import { EmptyState } from '@/components/dashboard/district/shared/EmptyState';
import {
  DISTRICT_ACTIVITY,
  SCHOOL_ADMINISTRATORS,
  SCHOOL_SURVEYS,
  getSchool,
  initialsOf,
  participationRate,
} from '@/constants/districtData';

/**
 * "District dashboard>school>view>overview" (2226:8786).
 *
 * Four metric tiles, then a 2/3 + 1/3 split: current and recent surveys plus
 * recent activity on the left, school administrator and latest report on the
 * right.
 */
export function SchoolOverview({ schoolId }: { schoolId: string }) {
  const school = getSchool(schoolId);
  if (!school) return null;

  const surveys = SCHOOL_SURVEYS.filter((s) => s.schoolId === schoolId);
  const activity = DISTRICT_ACTIVITY.filter((a) => a.schoolId === schoolId);
  const administrator = SCHOOL_ADMINISTRATORS.find((a) => a.schoolId === schoolId);
  const latestSurvey = surveys[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Current & recent surveys ---------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
            <h2 className="text-[15px] font-bold text-slate-900">
              Current &amp; recent surveys
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Surveys are run by the school. As district administrator, you can
              reopen a closed survey if a correction is needed.
            </p>

            <div className="mt-4 space-y-2">
              {surveys.length === 0 ? (
                <EmptyState
                  icon={<ClipboardList className="w-5 h-5" />}
                  title="No surveys yet"
                  description="Once this school opens its first survey window it will be listed here."
                  className="py-10"
                />
              ) : (
                surveys.slice(0, 3).map((survey) => (
                  <div
                    key={survey.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-medium text-slate-900">
                        {survey.grades}
                      </span>
                      <span className="text-sm text-slate-500">{survey.term}</span>
                      <StatusChip
                        status={survey.status}
                        label={survey.status === 'open' ? 'Open' : undefined}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-sm text-slate-900">
                        {survey.responses} ·{' '}
                        {participationRate(survey.responses, survey.target)}%
                      </span>
                      <span className="text-xs text-slate-400">
                        Closes {survey.closesOn}
                      </span>
                      <Link
                        href={`/district/schools/${schoolId}/surveys`}
                        className="text-iris text-xs font-medium hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent activity ------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[15px] font-bold text-slate-900">Recent activity</h2>
              <Link
                href={`/district/schools/${schoolId}/activity`}
                className="text-xs font-medium text-iris hover:underline"
              >
                View full activity
              </Link>
            </div>

            <div className="mt-3 space-y-2">
              {activity.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  Nothing recorded for this school yet.
                </p>
              ) : (
                activity.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="flex gap-3 rounded-lg bg-[#FAF9F6] px-3 py-2.5"
                  >
                    <Info className="w-5 h-5 shrink-0 text-slate-400 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm text-slate-900">
                        <span className="font-medium">{event.actor}</span>{' '}
                        <span className="font-normal text-slate-600">
                          {event.description}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{event.timeAgo}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* School administrator -------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card">
            <div className="px-6 pt-6 pb-5">
              <h2 className="text-base font-semibold text-slate-900">
                School administrator
              </h2>
            </div>

            <div className="px-6 pb-6">
              {administrator?.name ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FFECD1] text-gold flex items-center justify-center text-xs font-bold shrink-0">
                      {initialsOf(administrator.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {administrator.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {administrator.email}
                      </p>
                    </div>
                    <span
                      className={
                        administrator.status === 'active'
                          ? 'shrink-0 rounded-full border border-sage-200 bg-[#E3F5E3] px-2 py-0.5 text-[11px] font-semibold text-sage'
                          : 'shrink-0 rounded-full border border-gold-200 bg-[#FFECD1] px-2 py-0.5 text-[11px] font-semibold text-gold'
                      }
                    >
                      {administrator.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </div>

                  {administrator.invitedOn && (
                    <p className="text-[11px] text-slate-400 mt-2">
                      Invited {administrator.invitedOn}
                    </p>
                  )}

                  <Link
                    href={`/district/schools/${schoolId}/administrator`}
                    className="mt-4 flex items-center justify-center w-full rounded-full border border-[#D6E0D2] bg-sage-50 px-4 py-2 text-sm font-medium text-sage hover:bg-[#e8eee5] transition-colors"
                  >
                    View administrator
                  </Link>
                </>
              ) : (
                <p className="py-4 text-center text-sm text-slate-500">
                  No administrator is assigned to this school.
                </p>
              )}

              <p className="mt-3 text-center text-[11px] text-slate-400">
                Each school has one administrator, set when the school was created.
              </p>
            </div>
          </div>

          {/* Latest report --------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card">
            <div className="px-6 pt-6 pb-5">
              <h2 className="text-base font-semibold text-slate-900">Latest report</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {latestSurvey
                  ? `${latestSurvey.term} · ${latestSurvey.status === 'published' ? 'Published' : 'Under review'}`
                  : 'No report yet'}
              </p>
            </div>

            <div className="px-6 pb-6">
              {latestSurvey ? (
                <>
                  <div className="flex flex-wrap items-center gap-3 pb-4">
                    <StatusChip status={latestSurvey.status} />
                    <span className="text-sm text-slate-500">{latestSurvey.term}</span>
                  </div>

                  <dl className="flex items-center justify-between gap-3 pb-4">
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Participation
                      </dt>
                      <dd className="mt-0.5 flex items-baseline gap-1">
                        <span className="text-lg font-bold text-slate-900">
                          {latestSurvey.responses}
                        </span>
                        <span className="text-sm text-slate-400">
                          / {latestSurvey.target}
                        </span>
                      </dd>
                    </div>
                    <span className="h-11 w-px bg-slate-200" aria-hidden />
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Rate
                      </dt>
                      <dd className="mt-0.5 text-lg font-bold text-slate-900">
                        {participationRate(latestSurvey.responses, latestSurvey.target)}%
                      </dd>
                    </div>
                    <span className="h-11 w-px bg-slate-200" aria-hidden />
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Version
                      </dt>
                      <dd className="mt-0.5 text-lg font-bold text-slate-900">1</dd>
                    </div>
                  </dl>

                  <Link
                    href={`/district/schools/${schoolId}/reports`}
                    className="flex h-10 items-center justify-center w-full rounded-full bg-sage px-5 text-sm font-semibold text-white hover:opacity-80 transition-colors"
                  >
                    View report
                  </Link>
                </>
              ) : (
                <EmptyState
                  icon={<FileText className="w-5 h-5" />}
                  title="No report yet"
                  description="A report is generated once a survey closes."
                  className="py-8"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
