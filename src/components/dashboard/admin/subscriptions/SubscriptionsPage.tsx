'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Info, X } from 'lucide-react';
import { KpiCards } from './KpiCards';
import { FiltersBar } from './FiltersBar';
import { SubscriptionsTable } from './SubscriptionsTable';
import EmptyStateToggle from '@/components/ui/EmptyStateToggle';
import { SUBSCRIPTIONS_DATA } from './mockData';
import {
  SubscriptionItem,
  TypeFilterOption,
  StatusFilterOption,
  RenewalFilterOption,
  SortFilterOption,
  SubscriptionKpiSummary,
} from './types';

interface ToastState {
  id: number;
  type: 'success' | 'info';
  message: string;
  isExiting?: boolean;
}

export function SubscriptionsPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(SUBSCRIPTIONS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilterOption>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('All');
  const [renewalFilter, setRenewalFilter] = useState<RenewalFilterOption>('All');
  const [sortOption, setSortOption] = useState<SortFilterOption>('renewal');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Animated toast state
  const [toast, setToast] = useState<ToastState | null>(null);

  const dismissToast = () => {
    if (!toast) return;
    setToast((prev) => (prev ? { ...prev, isExiting: true } : null));
    setTimeout(() => {
      setToast(null);
    }, 300);
  };

  const showToast = (type: 'success' | 'info', message: string) => {
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
  const kpiMetrics: SubscriptionKpiSummary = useMemo(() => {
    const activeList = subscriptions.filter((s) => s.status === 'Active');
    const expiringList = subscriptions.filter((s) => s.status === 'Expiring');
    const graceList = subscriptions.filter((s) => s.status === 'In grace');
    const readOnlyList = subscriptions.filter((s) => s.status === 'Read-only');
    const deactivatedList = subscriptions.filter((s) => s.status === 'Deactivated');

    return {
      active: activeList.length,
      expiring30Days: expiringList.length,
      inGrace: graceList.length,
      readOnly: readOnlyList.length,
      deactivated: deactivatedList.length,
    };
  }, [subscriptions]);

  // 2. Filter & Sort Logic
  const filteredSubscriptions = useMemo(() => {
    return subscriptions
      .filter((sub) => {
        // Type Filter
        if (typeFilter !== 'All') {
          if (typeFilter === 'District' && sub.type !== 'District') return false;
          if (typeFilter === 'Standalone schools' && sub.type !== 'Standalone school') return false;
        }

        // Status Filter
        if (statusFilter !== 'All') {
          if (statusFilter === 'Grace' && sub.status !== 'In grace') return false;
          if (statusFilter !== 'Grace' && sub.status !== statusFilter) return false;
        }

        // Renewal Filter
        if (renewalFilter !== 'All') {
          if (renewalFilter === 'Renews in 30 days' && sub.status !== 'Expiring') return false;
        }

        // Search Filter
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchCustomer = sub.customer.toLowerCase().includes(q);
          const matchBilling = sub.billingRef?.toLowerCase().includes(q) || false;
          const matchContact = sub.contactName?.toLowerCase().includes(q) || false;
          const matchPlan = sub.planName?.toLowerCase().includes(q) || false;
          if (!matchCustomer && !matchBilling && !matchContact && !matchPlan) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'renewal') {
          return a.renewalDate.localeCompare(b.renewalDate);
        }
        if (sortOption === 'status') {
          return a.status.localeCompare(b.status);
        }
        if (sortOption === 'customer') {
          return a.customer.localeCompare(b.customer);
        }
        return 0;
      });
  }, [subscriptions, typeFilter, statusFilter, renewalFilter, searchQuery, sortOption]);

  const isFiltered =
    searchQuery.trim() !== '' ||
    typeFilter !== 'All' ||
    statusFilter !== 'All' ||
    renewalFilter !== 'All' ||
    sortOption !== 'renewal';

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('All');
    setStatusFilter('All');
    setRenewalFilter('All');
    setSortOption('renewal');
    setCurrentPage(1);
  };

  const handleManage = (sub: SubscriptionItem) => {
    router.push(`/admin/subscriptions/${sub.id}`);
  };

  // Export handlers
  const handleExportExcel = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Customer,Type,Status,Term Start,Term End,Renewal Date,Schools,Billing Ref']
        .concat(
          filteredSubscriptions.map(
            (s) =>
              `"${s.customer}","${s.type}","${s.status}","${s.termStart}","${s.termEnd}","${s.renewalDate}","${s.schoolCount}","${s.billingRef || ''}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'subscriptions.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('info', 'Exporting subscriptions to Excel...');
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Customer,Type,Status,Term Start,Term End,Renewal Date,Schools,Billing Ref']
        .concat(
          filteredSubscriptions.map(
            (s) =>
              `"${s.customer}","${s.type}","${s.status}","${s.termStart}","${s.termEnd}","${s.renewalDate}","${s.schoolCount}","${s.billingRef || ''}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'subscriptions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('info', 'Exporting subscriptions to CSV...');
  };

  const activeAgreementsCount = subscriptions.filter(
    (s) => s.status === 'Active' || s.status === 'Expiring' || s.status === 'In grace'
  ).length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-10 font-sans min-w-0">
      {/* Toast Notification with Smooth Animations */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[70] bg-[#FFFFFF] border border-[#E8E6E1] shadow-2xl rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm text-[#2B2B2B] font-sans max-w-md transition-all duration-300 ease-out transform ${
            toast.isExiting
              ? 'opacity-0 translate-y-4 scale-95 pointer-events-none'
              : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && (
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
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

      {/* 1. Top KPI Cards (5 Cards) */}
      <KpiCards metrics={kpiMetrics} />

      {/* 2. Section Header Title */}
      <div className="pt-2">
        <h2 className="text-[20px] sm:text-[22px] font-bold text-[#2B2B2B] font-sans leading-tight">
          All subscriptions
        </h2>
        <p className="text-[13px] text-[#9A9A9A] font-secondary mt-1">
          {activeAgreementsCount} active agreements across districts and standalone schools.
        </p>
      </div>

      {/* 3. Filters, Search & Sort Bar */}
      <FiltersBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        typeFilter={typeFilter}
        onTypeFilterChange={(t) => {
          setTypeFilter(t);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(s) => {
          setStatusFilter(s);
          setCurrentPage(1);
        }}
        renewalFilter={renewalFilter}
        onRenewalFilterChange={(r) => {
          setRenewalFilter(r);
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

      {/* 4. Subscriptions Table with EmptyStateToggle */}
      <EmptyStateToggle
        isEmpty={filteredSubscriptions.length === 0}
        emptyIcon="ri-file-list-3-line"
        emptyTitle={
          isFiltered
            ? 'No matching subscriptions'
            : 'No subscriptions found'
        }
        emptyDescription={
          isFiltered
            ? 'Try adjusting your search query, status, type, or renewal filters to view subscriptions.'
            : 'There are currently no customer subscriptions configured in the system.'
        }
      >
        <SubscriptionsTable
          subscriptions={filteredSubscriptions}
          totalCount={filteredSubscriptions.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onManage={handleManage}
        />
      </EmptyStateToggle>
    </div>
  );
}
