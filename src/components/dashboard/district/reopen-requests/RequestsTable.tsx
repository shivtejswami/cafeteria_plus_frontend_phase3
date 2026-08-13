'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Inbox, Search, TimerReset, XCircle } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Input } from '@/components/ui/Input';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/dashboard/district/shared/EmptyState';
import { ReviewModal } from './ReviewModal';
import { cn } from '@/utils/tailwind';
import { REOPEN_REQUESTS, SCHOOLS, type ReopenStatus } from '@/constants/districtData';

const ITEMS_PER_PAGE = 10;

const STATUS_PILL: Record<ReopenStatus, string> = {
  pending: 'bg-[#FFECD1] text-[#8A5A04]',
  approved: 'bg-[#E3F5E3] text-[#586D4D]',
  declined: 'bg-[#FDE2E2] text-[#B91C1C]',
};

const STATUS_LABEL: Record<ReopenStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  declined: 'Declined',
};

/** "district dashboard>reopen request" (2226:11604). */
export function RequestsTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [sort, setSort] = useState('oldest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    // Implement approval logic here
    console.log('Approved', id);
    setSelectedRequestId(null);
  };

  const handleDecline = (id: string) => {
    // Implement decline logic here
    console.log('Declined', id);
    setSelectedRequestId(null);
  };

  const summary = useMemo(() => {
    const pending = REOPEN_REQUESTS.filter((r) => r.status === 'pending');
    return {
      pending: pending.length,
      approvedThisWeek: REOPEN_REQUESTS.filter((r) => r.status === 'approved').length,
      declinedThisWeek: REOPEN_REQUESTS.filter((r) => r.status === 'declined').length,
      oldestWaiting: pending.reduce((max, r) => Math.max(max, r.waitingDays), 0),
    };
  }, []);

  const rows = useMemo(() => {
    const needle = search.trim().toLowerCase();
    let list = REOPEN_REQUESTS.filter((request) => {
      const matchesSearch =
        !needle ||
        request.schoolName.toLowerCase().includes(needle) ||
        request.requestedBy.toLowerCase().includes(needle);
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      const matchesSchool = schoolFilter === 'all' || request.schoolName === schoolFilter;
      return matchesSearch && matchesStatus && matchesSchool;
    });

    list = [...list].sort((a, b) => {
      if (sort === 'school') return a.schoolName.localeCompare(b.schoolName);
      return sort === 'newest'
        ? a.waitingDays - b.waitingDays
        : b.waitingDays - a.waitingDays;
    });

    return list;
  }, [search, statusFilter, schoolFilter, sort]);

  const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE);
  const currentRows = rows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const isFiltered = search.trim() !== '' || statusFilter !== 'all' || schoolFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Queue tiles ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Pending"
          value={summary.pending}
          valueColor={summary.pending > 0 ? 'text-[#D97706]' : undefined}
          icon={<svg width="16" height="16" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.25 1.25H0V0H10V1.25H8.75V2.5C8.75 2.975 8.6375 3.43333 8.4125 3.875C8.22917 4.25 7.95833 4.62083 7.6 4.9875C7.24167 5.35417 6.7375 5.775 6.0875 6.25C6.7375 6.725 7.24167 7.14583 7.6 7.5125C7.95833 7.87917 8.22917 8.25 8.4125 8.625C8.6375 9.06667 8.75 9.525 8.75 10V11.25H10V12.5H0V11.25H1.25V10C1.25 9.525 1.3625 9.06667 1.5875 8.625C1.77083 8.25 2.04167 7.87917 2.4 7.5125C2.75833 7.14583 3.2625 6.725 3.9125 6.25C3.2625 5.775 2.75833 5.35417 2.4 4.9875C2.04167 4.62083 1.77083 4.25 1.5875 3.875C1.3625 3.43333 1.25 2.975 1.25 2.5V1.25ZM2.5 1.25V2.5C2.5 2.775 2.56667 3.04375 2.7 3.30625C2.83333 3.56875 3.03333 3.8375 3.3 4.1125C3.50833 4.32917 3.76667 4.55833 4.075 4.8C4.30833 4.98333 4.61667 5.2125 5 5.4875C5.38333 5.2125 5.69167 4.98333 5.925 4.8C6.23333 4.55833 6.49167 4.32917 6.7 4.1125C6.96667 3.8375 7.16667 3.56875 7.3 3.30625C7.43333 3.04375 7.5 2.775 7.5 2.5V1.25H2.5ZM5 7.0125C4.61667 7.2875 4.30833 7.51667 4.075 7.7C3.76667 7.94167 3.50833 8.17083 3.3 8.3875C3.03333 8.6625 2.83333 8.93125 2.7 9.19375C2.56667 9.45625 2.5 9.725 2.5 10V11.25H7.5V10C7.5 9.725 7.43333 9.45625 7.3 9.19375C7.16667 8.93125 6.96667 8.6625 6.7 8.3875C6.49167 8.17083 6.23333 7.94167 5.925 7.7C5.69167 7.51667 5.38333 7.2875 5 7.0125Z" fill="#D97706" />
          </svg>
          }
          iconBgColor="bg-[#FFECD1]"
          iconTextColor="text-[#D97706]"
          className="border-t-3"
        />
        <StatCard
          title="Approved this week"
          value={summary.approvedThisWeek}
          icon={<svg width="16" height="16" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.625 4.87539L7.5 5.75039L12.8 0.462891L13.675 1.35039L7.5 7.52539L3.525 3.53789L4.4125 2.66289L6.625 4.87539ZM6.625 3.10039L9.7125 0.00039053L10.6 0.88789L7.5 3.98789L6.625 3.10039ZM4.8625 6.63789L3.975 7.52539L0 3.53789L0.875 2.66289L1.7625 3.53789L4.8625 6.63789Z" fill="#586D4D" />
          </svg>
          }
          iconBgColor="bg-[#E3F5E3]"
          iconTextColor="text-[#586D4D]"
          className="border-t-3"
        />
        <StatCard
          title="Declined this week"
          value={summary.declinedThisWeek}
          icon={<svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.25 12.5C5.4 12.5 4.5875 12.3375 3.8125 12.0125C3.07083 11.6958 2.41042 11.2479 1.83125 10.6687C1.25208 10.0896 0.804167 9.42917 0.4875 8.6875C0.1625 7.9125 0 7.1 0 6.25C0 5.4 0.1625 4.5875 0.4875 3.8125C0.804167 3.07083 1.25208 2.41042 1.83125 1.83125C2.41042 1.25208 3.07083 0.804167 3.8125 0.4875C4.5875 0.162499 5.4 0 6.25 0C7.1 0 7.9125 0.162499 8.6875 0.4875C9.42917 0.804167 10.0896 1.25208 10.6687 1.83125C11.2479 2.41042 11.6958 3.07083 12.0125 3.8125C12.3375 4.5875 12.5 5.4 12.5 6.25C12.5 7.1 12.3375 7.9125 12.0125 8.6875C11.6958 9.42917 11.2479 10.0896 10.6687 10.6687C10.0896 11.2479 9.42917 11.6958 8.6875 12.0125C7.9125 12.3375 7.1 12.5 6.25 12.5ZM6.25 11.25C7.15833 11.25 8 11.0208 8.775 10.5625C9.525 10.1208 10.1208 9.525 10.5625 8.775C11.0208 8 11.25 7.15833 11.25 6.25C11.25 5.34167 11.0208 4.5 10.5625 3.725C10.1208 2.975 9.525 2.37917 8.775 1.9375C8 1.47917 7.15833 1.25 6.25 1.25C5.34167 1.25 4.5 1.47917 3.725 1.9375C2.975 2.37917 2.37917 2.975 1.9375 3.725C1.47917 4.5 1.25 5.34167 1.25 6.25C1.25 7.15833 1.47917 8 1.9375 8.775C2.37917 9.525 2.975 10.1208 3.725 10.5625C4.5 11.0208 5.34167 11.25 6.25 11.25ZM6.25 5.3625L8.0125 3.6L8.9 4.4875L7.1375 6.25L8.9 8.0125L8.0125 8.9L6.25 7.1375L4.4875 8.9L3.6 8.0125L5.3625 6.25L3.6 4.4875L4.4875 3.6L6.25 5.3625Z" fill="#6D6D6D" />
          </svg>
          }
          className="border-t-3"
        />
        <StatCard
          title="Oldest waiting"
          value={summary.oldestWaiting ? `${summary.oldestWaiting} days` : '–'}
          valueColor={summary.oldestWaiting > 7 ? 'text-[#D8201D]' : undefined}
          icon={<svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.25 12.5C5.4 12.5 4.5875 12.3375 3.8125 12.0125C3.07083 11.6958 2.41042 11.2479 1.83125 10.6687C1.25208 10.0896 0.804167 9.42917 0.4875 8.6875C0.1625 7.9125 0 7.1 0 6.25C0 5.4 0.1625 4.5875 0.4875 3.8125C0.804167 3.07083 1.25208 2.41042 1.83125 1.83125C2.41042 1.25208 3.07083 0.804167 3.8125 0.4875C4.5875 0.162499 5.4 0 6.25 0C7.1 0 7.9125 0.162499 8.6875 0.4875C9.42917 0.804167 10.0896 1.25208 10.6687 1.83125C11.2479 2.41042 11.6958 3.07083 12.0125 3.8125C12.3375 4.5875 12.5 5.4 12.5 6.25C12.5 7.1 12.3375 7.9125 12.0125 8.6875C11.6958 9.42917 11.2479 10.0896 10.6687 10.6687C10.0896 11.2479 9.42917 11.6958 8.6875 12.0125C7.9125 12.3375 7.1 12.5 6.25 12.5ZM6.25 11.25C7.15833 11.25 8 11.0208 8.775 10.5625C9.525 10.1208 10.1208 9.525 10.5625 8.775C11.0208 8 11.25 7.15833 11.25 6.25C11.25 5.34167 11.0208 4.5 10.5625 3.725C10.1208 2.975 9.525 2.37917 8.775 1.9375C8 1.47917 7.15833 1.25 6.25 1.25C5.34167 1.25 4.5 1.47917 3.725 1.9375C2.975 2.37917 2.37917 2.975 1.9375 3.725C1.47917 4.5 1.25 5.34167 1.25 6.25C1.25 7.15833 1.47917 8 1.9375 8.775C2.37917 9.525 2.975 10.1208 3.725 10.5625C4.5 11.0208 5.34167 11.25 6.25 11.25ZM6.875 6.25H9.375V7.5H5.625V3.125H6.875V6.25Z" fill="#D8201D" />
          </svg>
          }
          iconBgColor="bg-[#FDEAEA]"
          iconTextColor="text-[#D8201D]"
          className={summary.oldestWaiting > 7 ? 'border-t-3' : undefined}
        />
      </div>

      {/* Filters -------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="search"
              aria-label="Search by school or requester"
              placeholder="Search by school or requester"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 w-full rounded-full  bg-white pl-9 pr-4 text-sm placeholder:text-[#8A8A8A] placeholder:font-medium  "
            />
          </div>

          <FilterDropdown
            label="Status"
            options={[
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'declined', label: 'Declined' },
            ]}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          />

          <FilterDropdown
            label="School"
            options={[
              { value: 'all', label: 'All schools' },
              ...SCHOOLS.map((school) => ({ value: school.name, label: school.name })),
            ]}
            value={schoolFilter}
            onChange={(value) => {
              setSchoolFilter(value);
              setCurrentPage(1);
            }}
          />
        </div>

        <FilterDropdown
          label="Sort"
          labelClassName="text-[#6D28D9] text-xs justify-center mt-[0.5px]"
          options={[
            { value: 'oldest', label: 'Oldest pending first' },
            { value: 'newest', label: 'Newest first' },
            { value: 'school', label: 'School A–Z' },
          ]}
          value={sort}
          onChange={(value) => {
            setSort(value);
            setCurrentPage(1);
          }}
          className="ml-auto"
          controlClassName="min-w-[190px] justify-between text-[#6D28D9] border-[#6D28D9] bg-[#F0EAFB]"
        />
      </div>

      {/* Table ----------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {currentRows.length === 0 ? (
          <EmptyState
            icon={<Inbox className="w-5 h-5" />}
            title="No requests here"
            description="When a school needs more time on a survey, their request lands in this queue for your decision."
            action={
              isFiltered ? (
                <button
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('all');
                    setSchoolFilter('all');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-full transition-colors text-sm cursor-pointer"
                >
                  Clear filters
                </button>
              ) : undefined
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School</TableHead>
                  <TableHead>Survey</TableHead>
                  <TableHead>Requested by</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Report impact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRows.map((request) => (
                  <TableRow key={request.id} className="align-middle">
                    <TableCell>
                      <button
                        onClick={() => setSelectedRequestId(request.id)}
                        className="block text-sm font-semibold text-iris hover:underline text-left"
                      >
                        {request.schoolName}
                      </button>
                      <span className="mt-1 inline-flex rounded-full bg-[#E3F5E3] px-2 py-0.5 text-[11px] font-medium text-sage">
                        {request.level}
                      </span>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm font-medium text-slate-900">
                        {request.surveyGrades}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {request.responses} / {request.target} responses
                      </p>
                    </TableCell>

                    <TableCell className="text-sm font-medium text-slate-900">
                      {request.requestedBy}
                    </TableCell>

                    <TableCell className="max-w-[260px]">
                      <p className="line-clamp-2 text-xs text-slate-500">{request.reason}</p>
                    </TableCell>

                    <TableCell>
                      <p className="whitespace-nowrap text-sm text-slate-900">
                        {request.requestedOn}
                      </p>
                      {request.status === 'pending' && request.waitingDays > 0 && (
                        <p className="mt-0.5 text-xs font-medium text-[#D8201D]">
                          {request.waitingDays} days
                        </p>
                      )}
                    </TableCell>

                    <TableCell className="max-w-50">
                      <p className="text-xs text-[#8A5A04]">{request.reportImpact}</p>
                    </TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold',
                          STATUS_PILL[request.status],
                        )}
                      >
                        {STATUS_LABEL[request.status]}
                      </span>
                    </TableCell>

                    <TableCell>
                      <button
                        onClick={() => setSelectedRequestId(request.id)}
                        className="text-iris text-xs font-medium hover:underline cursor-pointer"
                      >
                        {request.status === 'pending' ? 'Review' : 'View'}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={rows.length}
                itemsPerPage={ITEMS_PER_PAGE}
                itemName="requests"
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      {selectedRequestId && (
        <ReviewModal
          requestId={selectedRequestId}
          onClose={() => setSelectedRequestId(null)}
          onApprove={handleApprove}
          onDecline={handleDecline}
        />
      )}
    </div>
  );
}
