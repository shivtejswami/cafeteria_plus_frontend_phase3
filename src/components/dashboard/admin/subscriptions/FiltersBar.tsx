import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Check,
  FileText,
} from 'lucide-react';
import {
  TypeFilterOption,
  StatusFilterOption,
  RenewalFilterOption,
  SortFilterOption,
} from './types';

interface FiltersBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: TypeFilterOption;
  onTypeFilterChange: (type: TypeFilterOption) => void;
  statusFilter: StatusFilterOption;
  onStatusFilterChange: (status: StatusFilterOption) => void;
  renewalFilter: RenewalFilterOption;
  onRenewalFilterChange: (renewal: RenewalFilterOption) => void;
  sortOption: SortFilterOption;
  onSortOptionChange: (sort: SortFilterOption) => void;
  onExportExcel: () => void;
  onExportCsv: () => void;
  onClearFilters: () => void;
  isFiltered: boolean;
}

const TYPE_OPTIONS: TypeFilterOption[] = ['All', 'District', 'Standalone schools'];

const STATUS_OPTIONS: StatusFilterOption[] = [
  'All',
  'Active',
  'Expiring',
  'Grace',
  'Read-only',
  'Deactivated',
];

const RENEWAL_OPTIONS: RenewalFilterOption[] = [
  'All',
  'Renews in 30 days',
  'Renews in 60 days',
  'Renews in 90 days',
];

const SORT_OPTIONS: { value: SortFilterOption; label: string }[] = [
  { value: 'renewal', label: 'Renewal date' },
  { value: 'status', label: 'Status' },
  { value: 'customer', label: 'Customer name' },
];

export function FiltersBar({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  renewalFilter,
  onRenewalFilterChange,
  sortOption,
  onSortOptionChange,
  onExportExcel,
  onExportCsv,
  onClearFilters,
  isFiltered,
}: FiltersBarProps) {
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isRenewalOpen, setIsRenewalOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const typeRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const renewalRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setIsTypeOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setIsStatusOpen(false);
      }
      if (renewalRef.current && !renewalRef.current.contains(e.target as Node)) {
        setIsRenewalOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setIsExportOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.value === sortOption)?.label || 'Renewal date';

  // Excel SVG Icon
  const ExcelIcon = () => (
    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path
        d="M2.1 1.79922L9.95 0.674219C10.0417 0.665886 10.1208 0.68672 10.1875 0.736719C10.2542 0.786719 10.2958 0.853386 10.3125 0.93672V14.0117C10.3125 14.1034 10.2812 14.1784 10.2188 14.2367C10.1562 14.2951 10.0833 14.3242 10 14.3242L2.1 13.1992C1.94167 13.1742 1.8125 13.1034 1.7125 12.9867C1.6125 12.8701 1.5625 12.7367 1.5625 12.5867V2.41172C1.5625 2.26172 1.6125 2.12839 1.7125 2.01172C1.8125 1.89505 1.94167 1.82422 2.1 1.79922ZM2.8125 2.96172V12.0367L9.0625 12.9367V2.06172L2.8125 2.96172ZM10.9375 11.8742H12.8125V3.12422H10.9375V1.87422H13.4375C13.6125 1.87422 13.7604 1.93464 13.8813 2.05547C14.0021 2.1763 14.0625 2.32422 14.0625 2.49922V12.4992C14.0625 12.6742 14.0021 12.8221 13.8813 12.943C13.7604 13.0638 13.6125 13.1242 13.4375 13.1242H10.9375V11.8742ZM6.6875 7.49922L8.4375 9.99922H6.9375L5.9375 8.57422L4.9375 9.99922H3.4375L5.1875 7.49922L3.4375 4.99922H4.9375L5.9375 6.42422L6.9375 4.99922H8.4375L6.6875 7.49922Z"
        fill="#586D4D"
      />
    </svg>
  );

  return (
    <div className="flex flex-col gap-2 w-full font-sans">
      {/* ============================================================ */}
      {/* 1. DESKTOP LAYOUT (xl: >= 1280px) -> Single 1-line toolbar  */}
      {/* ============================================================ */}
      <div className="hidden xl:flex items-center justify-between gap-3 w-full">
        {/* Left Side: Search + Type + Status + Renewal */}
        <div className="flex items-center gap-2.5">
          {/* Search Box */}
          <div className="relative w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by customer, billing reference..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E8E6E1] rounded-full text-sm text-[#2B2B2B] placeholder:text-slate-400 focus:outline-none focus:ring-0 shadow-sm font-sans"
            />
          </div>

          {/* Type Dropdown */}
          <div className="relative shrink-0" ref={typeRef}>
            <button
              type="button"
              onClick={() => setIsTypeOpen(!isTypeOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E8E6E1] rounded-full text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer select-none whitespace-nowrap"
            >
              <span className="text-slate-500 font-normal">Type:</span>
              <span className="font-semibold text-[#2B2B2B]">{typeFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {isTypeOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-48 bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {TYPE_OPTIONS.map((t) => {
                  const isSelected = typeFilter === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        onTypeFilterChange(t);
                        setIsTypeOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#F0EAFB] text-[#6D28D9] font-medium'
                          : 'text-[#2B2B2B] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected && <Check className="w-4 h-4 text-[#6D28D9]" />}
                        <span className={isSelected ? '' : 'pl-6'}>{t}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative shrink-0" ref={statusRef}>
            <button
              type="button"
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E8E6E1] rounded-full text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer select-none whitespace-nowrap"
            >
              <span className="text-slate-500 font-normal">Status:</span>
              <span className="font-semibold text-[#2B2B2B]">{statusFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {isStatusOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-44 bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {STATUS_OPTIONS.map((status) => {
                  const isSelected = statusFilter === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        onStatusFilterChange(status);
                        setIsStatusOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#F0EAFB] text-[#6D28D9] font-medium'
                          : 'text-[#2B2B2B] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected && <Check className="w-4 h-4 text-[#6D28D9]" />}
                        <span className={isSelected ? '' : 'pl-6'}>{status}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Renewal Dropdown */}
          <div className="relative shrink-0" ref={renewalRef}>
            <button
              type="button"
              onClick={() => setIsRenewalOpen(!isRenewalOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E8E6E1] rounded-full text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer select-none whitespace-nowrap"
            >
              <span className="text-slate-500 font-normal">Renewal:</span>
              <span className="font-semibold text-[#2B2B2B]">{renewalFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {isRenewalOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-52 bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {RENEWAL_OPTIONS.map((opt) => {
                  const isSelected = renewalFilter === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        onRenewalFilterChange(opt);
                        setIsRenewalOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#F0EAFB] text-[#6D28D9] font-medium'
                          : 'text-[#2B2B2B] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected && <Check className="w-4 h-4 text-[#6D28D9]" />}
                        <span className={isSelected ? '' : 'pl-6'}>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Sort Pill + Split Export Button */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown Pill */}
          <div className="relative shrink-0" ref={sortRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F5F0FA] border border-[#6D28D9] rounded-full text-sm hover:bg-[#EBDDF8] transition-colors shadow-sm cursor-pointer select-none whitespace-nowrap"
            >
              <span className="text-slate-400 font-normal">Sort:</span>
              <span className="font-semibold text-[#6D28D9]">{currentSortLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = sortOption === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSortOptionChange(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#F0EAFB] text-[#6D28D9] font-medium'
                          : 'text-[#2B2B2B] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected && <Check className="w-4 h-4 text-[#6D28D9]" />}
                        <span className={isSelected ? '' : 'pl-6'}>{opt.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Split Export Dropdown Button */}
          <div className="relative shrink-0" ref={exportRef}>
            <div className="inline-flex items-center bg-[#F2F5F0] border border-[#D6E0D2] rounded-full shadow-sm overflow-hidden select-none">
              <button
                type="button"
                onClick={onExportExcel}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[#3A4A32] font-medium hover:bg-[#E5EAE2] transition-colors cursor-pointer"
              >
                <ExcelIcon />
                <span>Export</span>
              </button>
              <button
                type="button"
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="px-2.5 py-2.5 border-l border-[#D6E0D2] text-[#586D4D] hover:bg-[#E5EAE2] transition-colors cursor-pointer flex items-center justify-center"
              >
                <ChevronDown className="w-3.5 h-3.5 text-[#586D4D]" />
              </button>
            </div>

            {isExportOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl border border-[#E8E6E1] shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    onExportExcel();
                    setIsExportOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-[#2B2B2B] hover:bg-slate-50 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <ExcelIcon />
                  <span>Export to Excel</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onExportCsv();
                    setIsExportOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-[#2B2B2B] hover:bg-slate-50 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Export to CSV</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. TABLET & MOBILE (< xl:) -> Clean full-width multi-row grid*/}
      {/* ============================================================ */}
      <div className="flex xl:hidden flex-col gap-2.5 w-full">
        {/* Row 1: Search Bar Full Width */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by customer, billing reference..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E8E6E1] rounded-full text-xs sm:text-sm text-[#2B2B2B] placeholder:text-slate-400 focus:outline-none focus:ring-0 shadow-sm font-sans"
          />
        </div>

        {/* Row 2: Type, Status, Renewal Pills */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {/* Type Dropdown */}
          <div className="relative w-full" ref={typeRef}>
            <button
              type="button"
              onClick={() => setIsTypeOpen(!isTypeOpen)}
              className="w-full inline-flex items-center justify-between px-3 py-2 bg-white border border-[#E8E6E1] rounded-full text-xs text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer select-none"
            >
              <div className="flex items-center gap-1 truncate">
                <span className="text-slate-500 font-normal">Type:</span>
                <span className="font-semibold text-[#2B2B2B] truncate">{typeFilter}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {isTypeOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-44 bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {TYPE_OPTIONS.map((t) => {
                  const isSelected = typeFilter === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        onTypeFilterChange(t);
                        setIsTypeOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#F0EAFB] text-[#6D28D9] font-medium'
                          : 'text-[#2B2B2B] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected && <Check className="w-4 h-4 text-[#6D28D9]" />}
                        <span className={isSelected ? '' : 'pl-6'}>{t}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative w-full" ref={statusRef}>
            <button
              type="button"
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="w-full inline-flex items-center justify-between px-3 py-2 bg-white border border-[#E8E6E1] rounded-full text-xs text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer select-none"
            >
              <div className="flex items-center gap-1 truncate">
                <span className="text-slate-500 font-normal">Status:</span>
                <span className="font-semibold text-[#2B2B2B] truncate">{statusFilter}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {isStatusOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-44 bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {STATUS_OPTIONS.map((status) => {
                  const isSelected = statusFilter === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        onStatusFilterChange(status);
                        setIsStatusOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#F0EAFB] text-[#6D28D9] font-medium'
                          : 'text-[#2B2B2B] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected && <Check className="w-4 h-4 text-[#6D28D9]" />}
                        <span className={isSelected ? '' : 'pl-6'}>{status}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Renewal Dropdown */}
          <div className="relative w-full" ref={renewalRef}>
            <button
              type="button"
              onClick={() => setIsRenewalOpen(!isRenewalOpen)}
              className="w-full inline-flex items-center justify-between px-3 py-2 bg-white border border-[#E8E6E1] rounded-full text-xs text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer select-none"
            >
              <div className="flex items-center gap-1 truncate">
                <span className="text-slate-500 font-normal">Renewal:</span>
                <span className="font-semibold text-[#2B2B2B] truncate">{renewalFilter}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {isRenewalOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {RENEWAL_OPTIONS.map((opt) => {
                  const isSelected = renewalFilter === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        onRenewalFilterChange(opt);
                        setIsRenewalOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#F0EAFB] text-[#6D28D9] font-medium'
                          : 'text-[#2B2B2B] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected && <Check className="w-4 h-4 text-[#6D28D9]" />}
                        <span className={isSelected ? '' : 'pl-6'}>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Sort & Split Export Button (2 full-width columns in 1 row) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
          {/* Sort Dropdown Pill */}
          <div className="relative w-full" ref={sortRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full inline-flex items-center justify-between px-3.5 sm:px-4 py-2 bg-[#F5F0FA] border border-[#6D28D9] rounded-full text-xs sm:text-sm text-[#6D28D9] hover:bg-[#EBDDF8] transition-colors shadow-sm cursor-pointer select-none"
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-slate-400 font-normal">Sort:</span>
                <span className="font-semibold text-[#6D28D9] truncate">{currentSortLabel}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
            </button>

            {isSortOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-full sm:w-56 bg-white rounded-2xl border border-[#E8E6E1] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = sortOption === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSortOptionChange(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#F0EAFB] text-[#6D28D9] font-medium'
                          : 'text-[#2B2B2B] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected && <Check className="w-4 h-4 text-[#6D28D9]" />}
                        <span className={isSelected ? '' : 'pl-6'}>{opt.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Split Export Dropdown Button */}
          <div className="relative w-full" ref={exportRef}>
            <div className="w-full inline-flex items-center justify-between bg-[#F2F5F0] border border-[#D6E0D2] rounded-full shadow-sm overflow-hidden select-none text-xs sm:text-sm">
              <button
                type="button"
                onClick={onExportExcel}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-[#3A4A32] font-medium hover:bg-[#E5EAE2] transition-colors cursor-pointer flex-1 truncate"
              >
                <ExcelIcon />
                <span>Export</span>
              </button>
              <button
                type="button"
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="px-2.5 sm:px-3 py-2.5 border-l border-[#D6E0D2] text-[#586D4D] hover:bg-[#E5EAE2] transition-colors cursor-pointer flex items-center justify-center shrink-0"
              >
                <ChevronDown className="w-3.5 h-3.5 text-[#586D4D]" />
              </button>
            </div>

            {isExportOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-full sm:w-48 bg-white rounded-xl border border-[#E8E6E1] shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    onExportExcel();
                    setIsExportOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs sm:text-sm text-[#2B2B2B] hover:bg-slate-50 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <ExcelIcon />
                  <span>Export to Excel</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onExportCsv();
                    setIsExportOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs sm:text-sm text-[#2B2B2B] hover:bg-slate-50 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Export to CSV</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CLEAR FILTERS BUTTON (Right-aligned below the filter bar) */}
      {/* ============================================================ */}
      {isFiltered && (
        <div className="flex justify-end pr-1 pt-0.5">
          <button
            type="button"
            onClick={onClearFilters}
            className="text-[13px] font-semibold text-[#6D28D9] hover:underline cursor-pointer transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
