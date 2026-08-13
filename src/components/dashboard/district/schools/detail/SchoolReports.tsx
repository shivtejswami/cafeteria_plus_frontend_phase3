'use client';

import React from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { StatusChip } from '@/components/ui/StatusChip';
import { EmptyState } from '@/components/dashboard/district/shared/EmptyState';
import { SCHOOL_REPORTS } from '@/constants/districtData';

/** "District dashboard>school>view>reports" (2226:9475). */
export function SchoolReports({ schoolId }: { schoolId: string }) {
  const reports = SCHOOL_REPORTS.filter((r) => r.schoolId === schoolId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {reports.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-5 h-5" />}
          title="No reports published"
          description="A report is generated automatically when a survey window closes. Nothing has closed for this school yet."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Grade band</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Participation</TableHead>
              <TableHead className="text-right">Reliability</TableHead>
              <TableHead>Published</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-semibold text-slate-900">{report.title}</TableCell>
                <TableCell className="text-slate-600">{report.term}</TableCell>
                <TableCell>
                  <StatusChip status={report.status} />
                </TableCell>
                <TableCell className="text-right text-slate-900">{report.responses}</TableCell>
                <TableCell className="text-right font-medium text-slate-900">{report.satisfaction}%</TableCell>
                <TableCell className="whitespace-nowrap text-xs text-slate-500">{report.publishedOn}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <Link href={`/district/schools/${report.schoolId}/reports/${report.id}`} className={"text-iris text-sm font-medium hover:underline"}>
                      Open report
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        // Fake client-side download for demo purposes
                        const blob = new Blob([`Report: ${report.title}`], { type: 'application/pdf' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${report.title.replace(/\s+/g, '_')}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        URL.revokeObjectURL(url);
                      }}
                      disabled={report.status !== 'published'}
                      className={
                        report.status === 'published'
                          ? 'text-sm px-3 py-1 rounded-md cursor-pointer bg-white border border-slate-200 hover:bg-slate-50'
                          : 'text-sm px-3 py-1 rounded-md bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                      }
                    >
                      Download PDF
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
