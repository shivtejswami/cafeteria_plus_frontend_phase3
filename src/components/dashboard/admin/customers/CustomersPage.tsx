"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, ChevronDown } from "lucide-react";
import { CustomerKpis } from "./CustomerKpis";
import { CustomersTable } from "./CustomersTable";
import { FilterDropdown } from "../../../ui/FilterDropdown";
import { CreateDistrictModal } from "./CreateDistrictModal";
import { CreateSchoolModal } from "./CreateSchoolModal";
import { CustomerDetails } from "./CustomerDetails";

// --- TYPES & INTERFACES ---

export interface Customer {
  id: number;
  name: string;
  subtitle: string;
  type: "District" | "Standalone";
  schoolsCovered: number | null;
  subscriptionStatus: "Active" | "Expiring" | "Grace period" | "Deactivated" | "Read-only";
  subscriptionDetail: string;
  activeSurveys: number | null;
  lastActivity: string;
}

// --- MOCK CUSTOMER DATA ---

const CUSTOMERS_DATA: Customer[] = [
  {
    id: 1,
    name: "Brightwater Elementary",
    subtitle: "Standalone school • K-5",
    type: "Standalone",
    schoolsCovered: null,
    subscriptionStatus: "Deactivated",
    subscriptionDetail: "Ended 1 Mar 2026",
    activeSurveys: null,
    lastActivity: "3mo ago"
  },
  {
    id: 2,
    name: "Cedar Ridge Middle School",
    subtitle: "Standalone school • 6-8",
    type: "Standalone",
    schoolsCovered: null,
    subscriptionStatus: "Active",
    subscriptionDetail: "15 Mar 2027",
    activeSurveys: 2,
    lastActivity: "1d ago"
  },
  {
    id: 3,
    name: "DeKalb County Schools",
    subtitle: "District • 9 schools",
    type: "District",
    schoolsCovered: 9,
    subscriptionStatus: "Expiring",
    subscriptionDetail: "30 Jul 2026",
    activeSurveys: 3,
    lastActivity: "1d ago"
  },
  {
    id: 4,
    name: "Harbor View High School",
    subtitle: "Standalone school • 9-12",
    type: "Standalone",
    schoolsCovered: null,
    subscriptionStatus: "Grace period",
    subscriptionDetail: "Expired 2 Jul 2026",
    activeSurveys: null,
    lastActivity: "1w ago"
  },
  {
    id: 5,
    name: "Lincoln High School",
    subtitle: "Standalone school • 9-12",
    type: "Standalone",
    schoolsCovered: null,
    subscriptionStatus: "Grace period",
    subscriptionDetail: "Expired 20 Jun 2026",
    activeSurveys: null,
    lastActivity: "4d ago"
  },
  {
    id: 6,
    name: "Maple Grove Elementary",
    subtitle: "Standalone school • K-5",
    type: "Standalone",
    schoolsCovered: null,
    subscriptionStatus: "Active",
    subscriptionDetail: "20 Apr 2027",
    activeSurveys: 1,
    lastActivity: "5h ago"
  },
  {
    id: 7,
    name: "North Hills School District",
    subtitle: "District • 18 schools",
    type: "District",
    schoolsCovered: 18,
    subscriptionStatus: "Active",
    subscriptionDetail: "5 Jan 2027",
    activeSurveys: 8,
    lastActivity: "4h ago"
  },
  {
    id: 8,
    name: "Oakwood Independent",
    subtitle: "Standalone school • 6-8",
    type: "Standalone",
    schoolsCovered: null,
    subscriptionStatus: "Read-only",
    subscriptionDetail: "Expired 12 May 2026",
    activeSurveys: null,
    lastActivity: "2w ago"
  },
  {
    id: 9,
    name: "Pine Valley Academy",
    subtitle: "Standalone school • K-5",
    type: "Standalone",
    schoolsCovered: null,
    subscriptionStatus: "Expiring",
    subscriptionDetail: "8 Aug 2026",
    activeSurveys: null,
    lastActivity: "6d ago"
  },
  {
    id: 10,
    name: "Riverside Unified School District",
    subtitle: "District • 14 schools",
    type: "District",
    schoolsCovered: 14,
    subscriptionStatus: "Active",
    subscriptionDetail: "12 Sep 2026",
    activeSurveys: 6,
    lastActivity: "2h ago"
  },
  {
    id: 11,
    name: "Spring Valley District",
    subtitle: "District • 6 schools",
    type: "District",
    schoolsCovered: 6,
    subscriptionStatus: "Active",
    subscriptionDetail: "18 Dec 2026",
    activeSurveys: 4,
    lastActivity: "3d ago"
  },
  {
    id: 12,
    name: "Westside Charter School",
    subtitle: "Standalone school • K-5",
    type: "Standalone",
    schoolsCovered: null,
    subscriptionStatus: "Expiring",
    subscriptionDetail: "15 Sep 2026",
    activeSurveys: 1,
    lastActivity: "5d ago"
  }
];

export function CustomersPage() {
  // Selected Customer View State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("Name A-Z");
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [isCreateDistrictModalOpen, setIsCreateDistrictModalOpen] = useState(false);
  const [isCreateSchoolModalOpen, setIsCreateSchoolModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered and Sorted Data
  const processedCustomers = useMemo(() => {
    let result = [...CUSTOMERS_DATA];

    // Search filter
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(lower));
    }

    // Type filter
    if (typeFilter !== "All") {
      result = result.filter(c => c.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter(c => c.subscriptionStatus === statusFilter);
    }

    // Sort order
    result.sort((a, b) => {
      if (sortOrder === "Name A-Z") {
        return a.name.localeCompare(b.name);
      }
      if (sortOrder === "Recently added") {
        return b.id - a.id;
      }
      if (sortOrder === "Most schools") {
        return (b.schoolsCovered || 0) - (a.schoolsCovered || 0);
      }
      if (sortOrder === "Renewal date") {
        return a.subscriptionDetail.localeCompare(b.subscriptionDetail);
      }
      return 0;
    });

    return result;
  }, [searchTerm, typeFilter, statusFilter, sortOrder]);

  // Paginated Data
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedCustomers.slice(start, start + itemsPerPage);
  }, [processedCustomers, currentPage]);

  const totalPages = Math.ceil(processedCustomers.length / itemsPerPage) || 1;

  // Pagination Details
  const startRange = processedCustomers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRange = Math.min(currentPage * itemsPerPage, processedCustomers.length);

  if (selectedCustomer && selectedCustomer.type === "Standalone" && selectedCustomer.subscriptionStatus === "Deactivated") {
    return (
      <CustomerDetails 
        customer={selectedCustomer} 
        onBack={() => setSelectedCustomer(null)} 
      />
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-10">

      {/* Stat KPI Grid */}
      <CustomerKpis />

      {/* Button Create customer row */}
      <div className="flex justify-end pt-1 relative">
        <div className="relative">
          <button
            onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
            className="bg-[#526B4E] hover:bg-[#465C42] text-white px-5 py-2.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create customer</span>
            <ChevronDown className="w-4 h-4 opacity-80 pl-0.5 border-l border-white/20" />
          </button>

          {isCreateDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setIsCreateDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_4px_16px_rgba(0,0,0,0.08)] py-2 z-50 origin-top-right">
                <button
                  onClick={() => {
                    setIsCreateDropdownOpen(false);
                    setIsCreateDistrictModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none"
                >
                  New district
                </button>
                <button
                  onClick={() => {
                    setIsCreateDropdownOpen(false);
                    setIsCreateSchoolModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none"
                >
                  New standalone school
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex items-center justify-between gap-4 bg-slate-50/10">

        {/* Left Filters */}
        <div className="flex items-center gap-3 flex-nowrap shrink-0">

          {/* Search by Name */}
          <div className="relative w-[240px] sm:w-[280px] shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-[#E8E6E1] bg-white rounded-full text-[13px] placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 w-full whitespace-nowrap"
            />
          </div>

          {/* Type Filter */}
          <FilterDropdown
            label="Type"
            options={[
              { value: "All", label: "All" },
              { value: "District", label: "Districts" },
              { value: "Standalone", label: "Standalone schools" }
            ]}
            value={typeFilter}
            onChange={(val) => {
              setTypeFilter(val);
              setCurrentPage(1);
            }}
            className="shrink-0"
          />

          {/* Subscription Status Filter */}
          <FilterDropdown
            label="Subscription Status"
            options={[
              { value: "All", label: "All" },
              { value: "Active", label: "Active" },
              { value: "Expiring", label: "Expiring" },
              { value: "Grace period", label: "Grace period" },
              { value: "Read-only", label: "Read-only" },
              { value: "Deactivated", label: "Deactivated" }
            ]}
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            className="shrink-0"
          />

        </div>

        {/* Right Sorting Pill */}
        <div className="flex justify-end shrink-0">
          <FilterDropdown
            label="Sort"
            options={[
              { value: "Name A-Z", label: "Name A-Z" },
              { value: "Recently added", label: "Recently added" },
              { value: "Renewal date", label: "Renewal date" },
              { value: "Most schools", label: "Most schools" }
            ]}
            value={sortOrder}
            onChange={(val) => {
              setSortOrder(val);
              setCurrentPage(1);
            }}
            className="shrink-0 [&>button]:border-[#D8B4FE] [&>button]:bg-[#FAF5FF] [&>button]:hover:bg-[#F3E8FF] [&>button_svg]:!text-[#6D28D9] [&>button_.text-slate-400]:!text-[#A78BFA] [&>button_span+span]:!text-[#6D28D9] [&>button_span+span]:font-bold"
          />
        </div>

      </div>

      {/* Main Customers Table List Component */}
      <CustomersTable
        customers={paginatedCustomers}
        currentPage={currentPage}
        totalPages={totalPages}
        startRange={startRange}
        endRange={endRange}
        totalCount={processedCustomers.length}
        onPageChange={setCurrentPage}
        onViewCustomer={setSelectedCustomer}
      />

      {isCreateDistrictModalOpen && (
        <CreateDistrictModal
          isOpen={isCreateDistrictModalOpen}
          onClose={() => setIsCreateDistrictModalOpen(false)}
          existingNames={CUSTOMERS_DATA.map(c => c.name)}
        />
      )}

      {isCreateSchoolModalOpen && (
        <CreateSchoolModal
          isOpen={isCreateSchoolModalOpen}
          onClose={() => setIsCreateSchoolModalOpen(false)}
          existingNames={CUSTOMERS_DATA.map(c => c.name)}
        />
      )}

    </div>
  );
}
