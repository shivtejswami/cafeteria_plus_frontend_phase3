'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { KpiCards } from './KpiCards';
import { FiltersBar } from './FiltersBar';
import { ReopenRequestsTable } from './ReopenRequestsTable';
import { ReopenRequestDrawer } from './ReopenRequestDrawer';
import EmptyStateToggle from '@/components/ui/EmptyStateToggle';
import { REOPEN_REQUESTS_DATA } from './mockData';
import {
  ReopenRequest,
  StatusFilterOption,
  DistrictFilterOption,
  SortFilterOption,
  KpiSummary,
} from './types';

interface ToastState {
  id: number;
  type: 'success' | 'decline' | 'info';
  message: string;
  isExiting?: boolean;
}

export function ReopenRequestsPage() {
  const [requests, setRequests] = useState<ReopenRequest[]>(REOPEN_REQUESTS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('Pending');
  const [districtFilter, setDistrictFilter] = useState<DistrictFilterOption>('All');
  const [sortOption, setSortOption] = useState<SortFilterOption>('oldest');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected request for slide-over drawer
  const [selectedRequest, setSelectedRequest] = useState<ReopenRequest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Animated toast state
  const [toast, setToast] = useState<ToastState | null>(null);

  const dismissToast = () => {
    if (!toast) return;
    setToast((prev) => (prev ? { ...prev, isExiting: true } : null));
    setTimeout(() => {
      setToast(null);
    }, 300);
  };

  const showToast = (type: 'success' | 'decline' | 'info', message: string) => {
    const id = Date.now();
    setToast({ id, type, message, isExiting: false });
  };

  useEffect(() => {
    if (!toast || toast.isExiting) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  // 1. KPI Calculations
  const kpiMetrics: KpiSummary = useMemo(() => {
    const pendingList = requests.filter((r) => r.status === 'Pending');
    const approvedList = requests.filter((r) => r.status === 'Approved');
    const declinedList = requests.filter((r) => r.status === 'Declined');
    const oldestDays = pendingList.reduce(
      (max, item) => (item.daysWaiting > max ? item.daysWaiting : max),
      0
    );

    return {
      pendingCount: pendingList.length,
      approvedThisWeek: approvedList.length,
      declinedThisWeek: declinedList.length,
      oldestWaitingDays: oldestDays || 12,
    };
  }, [requests]);

  // 2. Filter & Sort Logic
  const filteredRequests = useMemo(() => {
    return requests
      .filter((req) => {
        // Status Filter
        if (statusFilter !== 'All' && req.status !== statusFilter) {
          return false;
        }

        // District Filter
        if (districtFilter !== 'All' && req.district !== districtFilter) {
          return false;
        }

        // Search Filter
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchSchool = req.school.toLowerCase().includes(q);
          const matchRequester = req.requestedBy.toLowerCase().includes(q);
          const matchReason = req.reason.toLowerCase().includes(q);
          const matchDistrict = req.district?.toLowerCase().includes(q) || false;
          if (!matchSchool && !matchRequester && !matchReason && !matchDistrict) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'oldest') {
          return b.daysWaiting - a.daysWaiting;
        }
        if (sortOption === 'newest') {
          return a.daysWaiting - b.daysWaiting;
        }
        if (sortOption === 'school-asc') {
          return a.school.localeCompare(b.school);
        }
        if (sortOption === 'school-desc') {
          return b.school.localeCompare(a.school);
        }
        return 0;
      });
  }, [requests, statusFilter, districtFilter, searchQuery, sortOption]);

  const isFiltered =
    searchQuery.trim() !== '' ||
    statusFilter !== 'Pending' ||
    districtFilter !== 'All' ||
    sortOption !== 'oldest';

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('Pending');
    setDistrictFilter('All');
    setSortOption('oldest');
    setCurrentPage(1);
  };

  const handleOpenDrawer = (req: ReopenRequest) => {
    setSelectedRequest(req);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleApprove = (id: string, newClosingDate: string, notes: string) => {
    let targetSchool = '';
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          targetSchool = r.school;
          const updated: ReopenRequest = {
            ...r,
            status: 'Approved',
            daysWaiting: 0,
            reportImpact: `Extended to ${newClosingDate}`,
            decision: {
              status: 'Approved',
              decidedBy: 'Emily Chatelain',
              decidedDate: '2 Jul 2026',
              notes: notes || 'Roster error confirmed in audit. Approving reopen for 10 calendar days to include the missing Grade 10 students. Current report v2 will be superseded.',
              newClosingDate: newClosingDate || '12 Jul 2026 | 17:00',
            },
          };
          setSelectedRequest(updated);
          return updated;
        }
        return r;
      })
    );
    showToast(
      'success',
      `Survey reopened for ${targetSchool || 'school'}. The requester has been notified.`
    );
  };

  const handleDecline = (id: string, reason: string) => {
    let targetSchool = '';
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          targetSchool = r.school;
          const updated: ReopenRequest = {
            ...r,
            status: 'Declined',
            daysWaiting: 0,
            decision: {
              status: 'Declined',
              decidedBy: 'Emily Chatelain',
              decidedDate: '27 Jun 2026',
              notes: reason || 'The quantitative participation is strong at 61% and the report is already published.',
            },
          };
          setSelectedRequest(updated);
          return updated;
        }
        return r;
      })
    );
    showToast(
      'decline',
      `Reopen request for ${targetSchool || 'school'} has been declined. The requester has been notified.`
    );
  };

  // Export handlers
  const handleExportExcel = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['School,Survey,Requested By,Requested Date,Days Waiting,Status,Reason']
        .concat(
          filteredRequests.map(
            (r) =>
              `"${r.school}","${r.gradeBand} - ${r.period}","${r.requestedBy}","${r.requestedDate}","${r.daysWaiting}","${r.status}","${r.reason.replace(/"/g, '""')}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'reopen_requests.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('info', 'Exporting reopen requests to Excel...');
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['School,Survey,Requested By,Requested Date,Days Waiting,Status,Reason']
        .concat(
          filteredRequests.map(
            (r) =>
              `"${r.school}","${r.gradeBand} - ${r.period}","${r.requestedBy}","${r.requestedDate}","${r.daysWaiting}","${r.status}","${r.reason.replace(/"/g, '""')}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'reopen_requests.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('info', 'Exporting reopen requests to CSV...');
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-10 font-sans min-w-0">
      {/* Animated Toast Notification (DIV-508 / DIV-509) */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[70] bg-white border border-[#E8E6E1] shadow-2xl rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm text-[#2B2B2B] font-sans max-w-md transition-all duration-300 ease-out transform ${
            toast.isExiting
              ? 'opacity-0 translate-y-4 scale-95 pointer-events-none'
              : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && (
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            )}
            {toast.type === 'decline' && (
              <Info className="w-4 h-4 text-[#6D28D9] shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="w-4 h-4 text-[#6D28D9] shrink-0" />
            )}
            <span className="leading-snug text-[#2B2B2B]">{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={dismissToast}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer rounded shrink-0 ml-1"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Top KPI Summary Cards (4-column responsive grid) */}
      <KpiCards metrics={kpiMetrics} />

      {/* 2. Filters, Search & Sort Bar */}
      <FiltersBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(s) => {
          setStatusFilter(s);
          setCurrentPage(1);
        }}
        districtFilter={districtFilter}
        onDistrictFilterChange={(d) => {
          setDistrictFilter(d);
          setCurrentPage(1);
        }}
        sortOption={sortOption}
        onSortOptionChange={(sort) => {
          setSortOption(sort);
          setCurrentPage(1);
        }}
        onExportExcel={handleExportExcel}
        onExportCsv={handleExportCsv}
        onClearFilters={handleClearFilters}
        isFiltered={isFiltered}
      />

      {/* 3. Reopen Requests Table with EmptyStateToggle and custom scrollbar */}
      <EmptyStateToggle
        isEmpty={filteredRequests.length === 0}
        emptyIcon="ri-inbox-2-line"
        emptyTitle={
          isFiltered
            ? 'No matching reopen requests'
            : 'No reopen requests'
        }
        emptyDescription={
          isFiltered
            ? 'Try adjusting your search criteria, status, or district filters to find what you are looking for.'
            : 'There are currently no survey reopen requests requiring administrative review.'
        }
      >
        <ReopenRequestsTable
          requests={filteredRequests}
          totalCount={filteredRequests.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onReview={handleOpenDrawer}
        />
      </EmptyStateToggle>

      {/* 4. Slide-in Details Drawer from Right (Full screen on small screens) */}
      <ReopenRequestDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        request={selectedRequest}
        onApprove={handleApprove}
        onDecline={handleDecline}
      />
    </div>
  );
}
