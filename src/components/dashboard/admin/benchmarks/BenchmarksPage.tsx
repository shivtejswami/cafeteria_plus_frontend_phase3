'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle2, Info, X } from 'lucide-react';
import { FiltersBar } from './FiltersBar';
import { BenchmarksTable } from './BenchmarksTable';
import { ManageBenchmarkDrawer } from './ManageBenchmarkDrawer';
import { UploadBenchmarkModal } from './UploadBenchmarkModal';
import { EnableDisableModal } from './EnableDisableModal';
import EmptyStateToggle from '@/components/ui/EmptyStateToggle';
import { BENCHMARKS_DATA } from './mockData';
import {
  BenchmarkRecord,
  TypeFilterOption,
  StatusFilterOption,
  GradeFilterOption,
  SortFilterOption,
} from './types';

interface ToastState {
  id: number;
  type: 'success' | 'info';
  message: string;
  isExiting?: boolean;
}

export function BenchmarksPage() {
  const router = useRouter();
  const [benchmarks, setBenchmarks] = useState<BenchmarkRecord[]>(BENCHMARKS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilterOption>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('All');
  const [gradeFilter, setGradeFilter] = useState<GradeFilterOption>('All');
  const [sortOption, setSortOption] = useState<SortFilterOption>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected Item & Drawer / Modal States
  const [selectedItem, setSelectedItem] = useState<BenchmarkRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Enable/Disable Confirmation Modal State
  const [modalState, setModalState] = useState<{
    item: BenchmarkRecord | null;
    mode: 'enable' | 'disable' | null;
    isOpen: boolean;
  }>({
    item: null,
    mode: null,
    isOpen: false,
  });

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

  // Filter & Sort Logic
  const filteredBenchmarks = useMemo(() => {
    return benchmarks
      .filter((item) => {
        // Type Filter
        if (typeFilter !== 'All') {
          if (!item.comparisonBasis.includes(typeFilter as any) && item.type !== typeFilter) {
            return false;
          }
        }

        // Status Filter
        if (statusFilter !== 'All') {
          if (item.status !== statusFilter) return false;
        }

        // Grade Filter
        if (gradeFilter !== 'All') {
          if (item.gradeLevel !== gradeFilter) return false;
        }

        // Search Filter
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchSubtitle = item.subtitle.toLowerCase().includes(q);
          if (!matchTitle && !matchSubtitle) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'name') {
          return a.title.localeCompare(b.title);
        }
        if (sortOption === 'cohort_size') {
          return b.schoolCount - a.schoolCount;
        }
        if (sortOption === 'effective_date') {
          return a.effectivePeriod.localeCompare(b.effectivePeriod);
        }
        return 0;
      });
  }, [benchmarks, typeFilter, statusFilter, gradeFilter, searchQuery, sortOption]);

  const isFiltered =
    searchQuery.trim() !== '' ||
    typeFilter !== 'All' ||
    statusFilter !== 'All' ||
    gradeFilter !== 'All' ||
    sortOption !== 'name';

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('All');
    setStatusFilter('All');
    setGradeFilter('All');
    setSortOption('name');
    setCurrentPage(1);
  };

  const handleManage = (item: BenchmarkRecord) => {
    router.push(`/admin/benchmarks/${item.id}`);
  };

  const handleViewCohort = (item: BenchmarkRecord) => {
    router.push(`/admin/benchmarks/cohort/${item.id}`);
  };

  const handleToggleStatus = (item: BenchmarkRecord) => {
    const isNowActive = item.status === 'Disabled' || item.status === 'Draft';
    setModalState({
      item,
      mode: isNowActive ? 'enable' : 'disable',
      isOpen: true,
    });
  };

  const handleConfirmEnableDisable = (
    item: BenchmarkRecord,
    mode: 'enable' | 'disable'
  ) => {
    const updatedStatus = mode === 'enable' ? 'Active' : 'Disabled';
    setBenchmarks((prev) =>
      prev.map((b) => (b.id === item.id ? { ...b, status: updatedStatus } : b))
    );

    showToast(
      'success',
      `Benchmark "${item.title}" ${mode === 'enable' ? 'enabled' : 'disabled'} successfully.`
    );
  };

  const handleRefreshSchedule = () => {
    router.push('/admin/benchmarks/schedule');
  };

  const handleUploadSuccess = (title: string) => {
    showToast('success', `Dataset "${title}" uploaded and queued for processing.`);
  };

  // Export handlers
  const handleExportExcel = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Title,Subtitle,Cohort,Label,Status,Effective']
        .concat(
          filteredBenchmarks.map(
            (s) =>
              `"${s.title}","${s.subtitle}","${s.schoolCount}","${s.label}","${s.status}","${s.effectivePeriod}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'benchmarks_datasets.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('info', 'Exporting benchmarks to Excel...');
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Title,Subtitle,Cohort,Label,Status,Effective']
        .concat(
          filteredBenchmarks.map(
            (s) =>
              `"${s.title}","${s.subtitle}","${s.schoolCount}","${s.label}","${s.status}","${s.effectivePeriod}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'benchmarks_datasets.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('info', 'Exporting benchmarks to CSV...');
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-[1600px] mx-auto w-full pb-10 font-sans min-w-0">
      {/* Toast Notification */}
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

      {/* Top Action Buttons (Responsive Grid/Row) */}
      <div className="grid grid-cols-1 sm:flex sm:items-center justify-end gap-2.5 sm:gap-3 w-full">
        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#54664B] hover:bg-[#43523C] rounded-full shadow-xs transition-all cursor-pointer text-center whitespace-nowrap"
        >
          Upload benchmark dataset
        </button>

        <button
          type="button"
          onClick={handleRefreshSchedule}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#3A4A32] bg-[#F4F7F2] border border-[#DDE6D9] hover:bg-[#E7ECE4] rounded-full transition-all cursor-pointer text-center whitespace-nowrap"
        >
          Refresh schedule
        </button>
      </div>

      {/* Info Callout Banner (Shield Icon - Responsive) */}
      <div className="bg-[#FFFFFF] border border-[#E8E6E1] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex items-start gap-3 sm:gap-4">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F0EAFB] text-[#6825C2] flex items-center justify-center shrink-0 mt-0.5">
          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm font-sans min-w-0">
          <p className="font-bold text-[#2B2B2B] leading-snug">
            Benchmarks only appear to schools when at least 10 comparable schools have participated, and are weighted so no single school can be identified.
          </p>
          <p className="text-[11px] sm:text-xs text-[#8E8E8E] font-secondary leading-normal">
            A benchmark cannot be labelled “national” until SFWG confirms the dataset is broad and representative until then it is shown as the “Cafeteria Pulse participating-school benchmark”.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
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
        gradeFilter={gradeFilter}
        onGradeFilterChange={(g) => {
          setGradeFilter(g);
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

      {/* Benchmarks Table */}
      <EmptyStateToggle
        isEmpty={filteredBenchmarks.length === 0}
        emptyIcon="ri-file-list-3-line"
        emptyTitle={
          isFiltered
            ? 'No matching benchmark datasets'
            : 'No benchmarks found'
        }
        emptyDescription={
          isFiltered
            ? 'Try adjusting your search query, status, type, or grade filters.'
            : 'There are currently no benchmark datasets configured in the system.'
        }
      >
        <BenchmarksTable
          benchmarks={filteredBenchmarks}
          totalCount={filteredBenchmarks.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onManage={handleManage}
          onViewCohort={handleViewCohort}
          onToggleStatus={handleToggleStatus}
        />
      </EmptyStateToggle>

      {/* Detail / Cohort Drawer */}
      <ManageBenchmarkDrawer
        item={selectedItem}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Upload Modal */}
      <UploadBenchmarkModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Enable / Disable Confirmation Modal */}
      <EnableDisableModal
        item={modalState.item}
        mode={modalState.mode}
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ item: null, mode: null, isOpen: false })}
        onConfirm={handleConfirmEnableDisable}
      />
    </div>
  );
}
