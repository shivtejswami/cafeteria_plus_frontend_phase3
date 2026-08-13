'use client';

import React from 'react';
import Link from 'next/link';
import { ClipboardList } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { StatusChip } from '@/components/ui/StatusChip';
import { EmptyState } from '@/components/dashboard/district/shared/EmptyState';
import { SCHOOL_SURVEYS, SCHOOL_REPORTS, participationRate } from '@/constants/districtData';

/** "District dashboard>school>view>surveys" (2226:9178). */
export function SchoolSurveys({ schoolId }: { schoolId: string }) {
  const surveys = SCHOOL_SURVEYS.filter((s) => s.schoolId === schoolId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {surveys.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="w-5 h-5" />}
          title="No surveys yet"
          description="Once you open the first survey window for this school it will be listed here with its full history."
        />
      ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grade band</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Participation</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Report</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.map((survey) => {
                const report = SCHOOL_REPORTS.find((r) => r.schoolId === survey.schoolId && r.term === survey.term);
                return (
                  <TableRow key={survey.id}>
                    <TableCell className="font-semibold text-slate-900">{survey.grades}</TableCell>
                    <TableCell className="text-slate-600">{survey.term}</TableCell>
                    <TableCell>
                      <StatusChip
                        status={survey.status}
                        label={survey.status === 'open' ? 'Open' : undefined}
                      />
                    </TableCell>
                    <TableCell className="text-right text-slate-900">
                      {survey.responses} · {participationRate(survey.responses, survey.target)}%
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-slate-500">{survey.closesOn}</TableCell>
                    <TableCell className="text-slate-600">
                      {report ? (
                        <Link href={`/district/schools/${survey.schoolId}/reports/${report.id}`} className="text-iris hover:underline">
                          {report.term} report
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Link
                        href={`/district/schools/${survey.schoolId}/surveys/${survey.id}`}
                        className="text-iris text-sm font-medium hover:underline"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
      )}
    </div>
  );
}
