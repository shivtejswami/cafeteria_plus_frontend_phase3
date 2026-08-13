'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Building2, Clock, Search, SearchX, UserCheck, UserX, X } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Input } from '@/components/ui/Input';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Switch } from '@/components/ui/Switch';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/dashboard/district/shared/EmptyState';
import { cn } from '@/utils/tailwind';
import {
  SCHOOL_ADMINISTRATORS,
  type AdministratorStatus,
  type SchoolAdministratorRow,
} from '@/constants/districtData';

const ITEMS_PER_PAGE = 10;

const STATUS_STYLE: Record<AdministratorStatus, string> = {
  active: 'border-[#B8D8B8] bg-[#E3F5E3] text-[#586D4D]',
  pending: 'border-[#F5D89A] bg-[#FFECD1] text-[#D97706]',
  deactivated: 'border-[#C21D1A] bg-[#FFEBEB] text-[#C21D1A]',
  vacant: 'border-[#F5D89A] bg-[#FFF3D6] text-[#B45309]',
};

const STATUS_LABEL: Record<AdministratorStatus, string> = {
  active: 'Active',
  pending: 'Pending activation',
  deactivated: 'Deactivated',
  vacant: 'Vacant',
};

/**
 * "Districct dashboard>people" (2235:5484).
 *
 * One row per school rather than per person — the district cares which schools
 * have cover, so a school with nobody assigned reads Vacant. There is no invite
 * action here; administrators are set from the school profile.
 */
export function PeopleDirectory() {
  const [people, setPeople] = useState<SchoolAdministratorRow[]>(SCHOOL_ADMINISTRATORS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('school-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deactivationReason, setDeactivationReason] = useState('');
  const [showReasonError, setShowReasonError] = useState(false);

  const [pendingToggle, setPendingToggle] = useState<SchoolAdministratorRow | null>(null);

  const summary = useMemo(
    () => ({
      totalSchools: people.length,
      activeAdministrators: people.filter((p) => p.status === 'active').length,
      pendingActivation: people.filter((p) => p.status === 'pending').length,
      vacantPositions: people.filter((p) => p.status === 'vacant').length,
    }),
    [people],
  );

  const rows = useMemo(() => {
    const needle = search.trim().toLowerCase();
    let list = people.filter((row) => {
      const matchesSearch =
        !needle ||
        row.school.toLowerCase().includes(needle) ||
        (row.name?.toLowerCase().includes(needle) ?? false) ||
        (row.email?.toLowerCase().includes(needle) ?? false);
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'school-desc':
          return b.school.localeCompare(a.school);
        case 'admin-asc':
          return (a.name ?? 'zzz').localeCompare(b.name ?? 'zzz');
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return a.school.localeCompare(b.school);
      }
    });

    return list;
  }, [people, search, statusFilter, sort]);

  const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE);
  const currentRows = rows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const reasonValid = deactivationReason.trim().length >= 10;
  const isEmptyReason = deactivationReason.trim().length === 0;

  const confirmToggle = () => {
    if (!pendingToggle) return;

    if (!reasonValid) {
      setShowReasonError(true);
      return;
    }

    setPeople((prev) =>
      prev.map((row) =>
        row.id === pendingToggle.id
          ? {
            ...row,
            accessEnabled: !row.accessEnabled,
            status: !row.accessEnabled ? 'active' : 'deactivated',
          }
          : row,
      ),
    );
    setPendingToggle(null);
    setDeactivationReason('');
    setShowReasonError(false);
  };

  const closeModal = () => {
    setPendingToggle(null);
    setDeactivationReason('');
    setShowReasonError(false);
  };

  return (
    <div className="space-y-6">
      {/* Summary tiles ------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total schools"
          value={summary.totalSchools}
          valueColor="text-[#6D6D6D]"
          icon={<svg width="16" height="16" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 10H13.75V11.25H0V10H1.25V0.625C1.25 0.45 1.31042 0.302083 1.43125 0.18125C1.55208 0.0604162 1.7 0 1.875 0H8.125C8.3 0 8.44792 0.0604162 8.56875 0.18125C8.68958 0.302083 8.75 0.45 8.75 0.625V10H11.25V5H10V3.75H11.875C12.05 3.75 12.1979 3.81042 12.3188 3.93125C12.4396 4.05208 12.5 4.2 12.5 4.375V10ZM2.5 1.25V10H7.5V1.25H2.5ZM3.75 5H6.25V6.25H3.75V5ZM3.75 2.5H6.25V3.75H3.75V2.5Z" fill="#6D6D6D" />
          </svg>
          }
          className="border-t-3"
        />
        <StatCard
          title="Active administrators"
          value={summary.activeAdministrators}
          valueColor="text-[#586D4D]"
          icon={<svg width="16" height="16" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.25 8.28711V9.59961C5.85 9.44961 5.43333 9.37461 5 9.37461C4.325 9.37461 3.69583 9.54544 3.1125 9.88711C2.54583 10.2204 2.09583 10.6704 1.7625 11.2371C1.42083 11.8204 1.25 12.4496 1.25 13.1246H0C0 12.2246 0.229167 11.3871 0.6875 10.6121C1.12917 9.85378 1.72917 9.25378 2.4875 8.81211C3.2625 8.35378 4.1 8.12461 5 8.12461C5.425 8.12461 5.84167 8.17878 6.25 8.28711ZM5 7.49961C4.325 7.49961 3.69583 7.32878 3.1125 6.98711C2.54583 6.66211 2.09583 6.21628 1.7625 5.64961C1.42083 5.06628 1.25 4.43503 1.25 3.75586C1.25 3.07669 1.42083 2.44544 1.7625 1.86211C2.09583 1.29544 2.54583 0.845443 3.1125 0.512109C3.69583 0.170443 4.32708 -0.000391006 5.00625 -0.000391006C5.68542 -0.000391006 6.31667 0.170443 6.9 0.512109C7.46667 0.845443 7.9125 1.29544 8.2375 1.86211C8.57917 2.44544 8.75 3.07669 8.75 3.75586C8.75 4.43503 8.57917 5.06628 8.2375 5.64961C7.9125 6.21628 7.46667 6.66211 6.9 6.98711C6.31667 7.32878 5.68333 7.49961 5 7.49961ZM5 6.24961C5.45833 6.24961 5.87917 6.13919 6.2625 5.91836C6.64583 5.69753 6.94792 5.39544 7.16875 5.01211C7.38958 4.62878 7.5 4.21003 7.5 3.75586C7.5 3.30169 7.38958 2.88294 7.16875 2.49961C6.94792 2.11628 6.64583 1.81211 6.2625 1.58711C5.87917 1.36211 5.46042 1.24961 5.00625 1.24961C4.55208 1.24961 4.13333 1.36211 3.75 1.58711C3.36667 1.81211 3.0625 2.11628 2.8375 2.49961C2.6125 2.88294 2.5 3.30169 2.5 3.75586C2.5 4.21003 2.6125 4.62878 2.8375 5.01211C3.0625 5.39544 3.36667 5.69753 3.75 5.91836C4.13333 6.13919 4.55 6.24961 5 6.24961ZM8.625 11.8246L10.8375 9.61211L11.725 10.4996L8.625 13.5996L6.4125 11.3871L7.3 10.4996L8.625 11.8246Z" fill="#586D4D" />
          </svg>
          }
          iconBgColor="bg-[#E3F5E3]"
          iconTextColor="text-[#586D4D]"
          className="border-t-3"
        />
        <StatCard
          title="Pending activation"
          value={summary.pendingActivation}
          valueColor="text-[#D97706]"
          icon={<svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.25 12.5C5.4 12.5 4.5875 12.3375 3.8125 12.0125C3.07083 11.6958 2.41042 11.2479 1.83125 10.6687C1.25208 10.0896 0.804167 9.42917 0.4875 8.6875C0.1625 7.9125 0 7.1 0 6.25C0 5.4 0.1625 4.5875 0.4875 3.8125C0.804167 3.07083 1.25208 2.41042 1.83125 1.83125C2.41042 1.25208 3.07083 0.804167 3.8125 0.4875C4.5875 0.162499 5.4 0 6.25 0C7.1 0 7.9125 0.162499 8.6875 0.4875C9.42917 0.804167 10.0896 1.25208 10.6687 1.83125C11.2479 2.41042 11.6958 3.07083 12.0125 3.8125C12.3375 4.5875 12.5 5.4 12.5 6.25C12.5 7.1 12.3375 7.9125 12.0125 8.6875C11.6958 9.42917 11.2479 10.0896 10.6687 10.6687C10.0896 11.2479 9.42917 11.6958 8.6875 12.0125C7.9125 12.3375 7.1 12.5 6.25 12.5ZM6.25 11.25C7.15833 11.25 8 11.0208 8.775 10.5625C9.525 10.1208 10.1208 9.525 10.5625 8.775C11.0208 8 11.25 7.15833 11.25 6.25C11.25 5.34167 11.0208 4.5 10.5625 3.725C10.1208 2.975 9.525 2.37917 8.775 1.9375C8 1.47917 7.15833 1.25 6.25 1.25C5.34167 1.25 4.5 1.47917 3.725 1.9375C2.975 2.37917 2.37917 2.975 1.9375 3.725C1.47917 4.5 1.25 5.34167 1.25 6.25C1.25 7.15833 1.47917 8 1.9375 8.775C2.37917 9.525 2.975 10.1208 3.725 10.5625C4.5 11.0208 5.34167 11.25 6.25 11.25ZM6.875 6.25H9.375V7.5H5.625V3.125H6.875V6.25Z" fill="#D97706" />
          </svg>
          }
          iconBgColor="bg-[#FFECD1]"
          iconTextColor="text-[#D97706]"
          className="border-t-3"
        />
        <StatCard
          title="Vacant positions"
          value={summary.vacantPositions}
          valueColor="text-[#D8201D]"
          icon={<svg width="16" height="16" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.25 8.27422V9.58672C5.84167 9.44505 5.425 9.37422 5 9.37422C4.31667 9.37422 3.68333 9.54505 3.1 9.88672C2.53333 10.2117 2.0875 10.6576 1.7625 11.2242C1.42083 11.8076 1.25 12.4409 1.25 13.1242H0C0 12.2159 0.225 11.3742 0.675 10.5992C1.11667 9.84089 1.71667 9.24089 2.475 8.79922C3.25 8.34922 4.09167 8.12422 5 8.12422C5.425 8.12422 5.84167 8.17422 6.25 8.27422ZM5 7.49922C4.31667 7.49922 3.68333 7.32839 3.1 6.98672C2.53333 6.65339 2.0875 6.20339 1.7625 5.63672C1.42083 5.05339 1.25 4.42214 1.25 3.74297C1.25 3.0638 1.42083 2.43255 1.7625 1.84922C2.0875 1.28255 2.53333 0.836719 3.1 0.511719C3.68333 0.170052 4.31458 -0.000781059 4.99375 -0.000781059C5.67292 -0.000781059 6.30417 0.170052 6.8875 0.511719C7.45417 0.836719 7.90417 1.28255 8.2375 1.84922C8.57917 2.43255 8.75 3.0638 8.75 3.74297C8.75 4.42214 8.57917 5.05339 8.2375 5.63672C7.90417 6.20339 7.45417 6.65339 6.8875 6.98672C6.30417 7.32839 5.675 7.49922 5 7.49922ZM5 6.24922C5.45 6.24922 5.86667 6.13672 6.25 5.91172C6.63333 5.68672 6.9375 5.38255 7.1625 4.99922C7.3875 4.61589 7.5 4.19713 7.5 3.74297C7.5 3.2888 7.3875 2.87005 7.1625 2.48672C6.9375 2.10338 6.63333 1.8013 6.25 1.58047C5.86667 1.35964 5.44792 1.24922 4.99375 1.24922C4.53958 1.24922 4.12083 1.35964 3.7375 1.58047C3.35417 1.8013 3.05208 2.10338 2.83125 2.48672C2.61042 2.87005 2.5 3.2888 2.5 3.74297C2.5 4.19713 2.61042 4.61589 2.83125 4.99922C3.05208 5.38255 3.35417 5.68672 3.7375 5.91172C4.12083 6.13672 4.54167 6.24922 5 6.24922ZM9.375 10.3617L10.7 9.03672L11.575 9.92422L10.25 11.2492L11.575 12.5742L10.7 13.4492L9.375 12.1242L8.05 13.4492L7.1625 12.5742L8.4875 11.2492L7.1625 9.92422L8.05 9.03672L9.375 10.3617Z" fill="#D8201D" />
          </svg>
          }
          iconBgColor="bg-[#FDEAEA]"
          iconTextColor="text-[#D8201D]"
          className="border-t-3"
        />
      </div>

      {/* Search and filters -------------------------------------------- */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="search"
            aria-label="Search by school or administrator name"
            placeholder="Search by school or administrator name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 w-full rounded-full border-slate-200 bg-white pl-9 pr-4 text-sm placeholder:text-slate-400 "
          />
        </div>

        <FilterDropdown
          label="Status"
          options={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending activation' },
            { value: 'deactivated', label: 'Deactivated' },
            { value: 'vacant', label: 'Vacant' },
          ]}
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        />

        <FilterDropdown
          label="Sort"
          options={[
            { value: 'school-asc', label: 'School A–Z' },
            { value: 'school-desc', label: 'School Z–A' },
            { value: 'admin-asc', label: 'Administrator A–Z' },
            { value: 'status', label: 'Status' },
          ]}
          value={sort}
          onChange={(value) => {
            setSort(value);
            setCurrentPage(1);
          }}
          className="ml-auto"
          controlClassName="min-w-[180px] justify-between"
        />
      </div>

      {/* Table ----------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {currentRows.length === 0 ? (
          <EmptyState
            icon={<SearchX className="w-5 h-5" />}
            title="No schools match these filters"
            description="Try a different search term, or clear the filters to see every school in the district."
            action={
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-full transition-colors text-sm cursor-pointer"
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School</TableHead>
                  <TableHead>Administrator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited / Joined</TableHead>
                  <TableHead className="text-right">Access</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Link
                        href={`/district/schools/${row.schoolId}`}
                        className="text-sm font-medium text-iris hover:underline"
                      >
                        {row.school}
                      </Link>
                    </TableCell>

                    <TableCell>
                      {row.name ? (
                        <>
                          <p className="text-sm font-semibold text-[#1F2937]">{row.name}</p>
                          <p className="text-xs text-slate-400">{row.email}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-iris">Vacant</p>
                          <p className="text-xs text-slate-400">No active administrator</p>
                        </>
                      )}
                    </TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium',
                          STATUS_STYLE[row.status],
                        )}
                      >
                        {STATUS_LABEL[row.status]}
                      </span>
                    </TableCell>

                    <TableCell>
                      {row.status === 'pending' ? (
                        <>
                          <p className="text-sm font-medium text-gold">Pending</p>
                          <p className="text-xs text-[#9A9A9A]">
                            Expires in {row.expiresInDays} days
                          </p>
                        </>
                      ) : row.invitedOn ? (
                        <>
                          <p className="text-sm text-[#1F2937]">{row.invitedOn}</p>
                          <p className="text-xs text-slate-400">Active: {row.lastActive}</p>
                        </>
                      ) : (
                        <span className="text-slate-400">–</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      {row.status === 'vacant' || row.status === 'pending' ? (
                        <span className="text-slate-400">–</span>
                      ) : (
                        <div className="flex justify-end">
                          <Switch
                            checked={row.accessEnabled}
                            onChange={() => setPendingToggle(row)}
                          />
                        </div>
                      )}
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
                itemName="schools"
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

     {/* Access confirmation ------------------------------------------- */}
<Modal
  isOpen={pendingToggle !== null}
  onClose={closeModal}
  className="max-w-xl w-[90vw]"
>
  <div className="p-6">
    {/* Status Icon */}
    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center">
      {pendingToggle?.accessEnabled ? (
        // Disable school administrator
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28Z"
            fill="#FDEAEA"
          />
          <path
            d="M27.9921 39.666C26.406 39.666 24.8899 39.3627 23.4437 38.756C22.0598 38.1649 20.8274 37.3288 19.7467 36.2477C18.666 35.1666 17.8302 33.9338 17.2393 32.5493C16.6328 31.1027 16.3296 29.586 16.3296 27.9993C16.3296 26.4127 16.6328 24.896 17.2393 23.4493C17.8302 22.0649 18.666 20.8321 19.7467 19.751C20.8274 18.6699 22.0598 17.8338 23.4437 17.2427C24.8899 16.636 26.406 16.3327 27.9921 16.3327C29.5782 16.3327 31.0943 16.636 32.5405 17.2427C33.9244 17.8338 35.1568 18.6699 36.2375 19.751C37.3182 20.8321 38.154 22.0649 38.7449 23.4493C39.3514 24.896 39.6546 26.4127 39.6546 27.9993C39.6546 29.586 39.3514 31.1027 38.7449 32.5493C38.154 33.9338 37.3182 35.1666 36.2375 36.2477C35.1568 37.3288 33.9244 38.1649 32.5405 38.756C31.0943 39.3627 29.5782 39.666 27.9921 39.666ZM27.9921 37.3327C29.687 37.3327 31.2576 36.9049 32.7037 36.0493C34.1032 35.2249 35.2151 34.1127 36.0392 32.7127C36.8945 31.266 37.3221 29.6949 37.3221 27.9993C37.3221 26.3038 36.8945 24.7327 36.0392 23.286C35.2151 21.886 34.1032 20.7738 32.7037 19.9493C31.2576 19.0938 29.687 18.666 27.9921 18.666C26.2971 18.666 24.7266 19.0938 23.2804 19.9493C21.8809 20.7738 20.7691 21.886 19.945 23.286C19.0897 24.7327 18.6621 26.3038 18.6621 27.9993C18.6621 29.6949 19.0897 31.266 19.945 32.7127C20.7691 34.1127 21.8809 35.2249 23.2804 36.0493C24.7266 36.9049 26.2971 37.3327 27.9921 37.3327ZM26.8258 31.4993H29.1583V33.8327H26.8258V31.4993ZM26.8258 22.166H29.1583V29.166H26.8258V22.166Z"
            fill="#D8201D"
          />
        </svg>
      ) : (
        // Activate account
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28Z" fill="#DCFCE7"/>
<path d="M27.9921 39.666C26.406 39.666 24.8899 39.3627 23.4437 38.756C22.0598 38.1649 20.8274 37.3288 19.7467 36.2477C18.666 35.1666 17.8302 33.9338 17.2393 32.5493C16.6328 31.1027 16.3296 29.586 16.3296 27.9993C16.3296 26.4127 16.6328 24.896 17.2393 23.4493C17.8302 22.0649 18.666 20.8321 19.7467 19.751C20.8274 18.6699 22.0598 17.8338 23.4437 17.2427C24.8899 16.636 26.406 16.3327 27.9921 16.3327C29.5782 16.3327 31.0943 16.636 32.5405 17.2427C33.9244 17.8338 35.1568 18.6699 36.2375 19.751C37.3182 20.8321 38.154 22.0649 38.7449 23.4493C39.3514 24.896 39.6546 26.4127 39.6546 27.9993C39.6546 29.586 39.3514 31.1027 38.7449 32.5493C38.154 33.9338 37.3182 35.1666 36.2375 36.2477C35.1568 37.3288 33.9244 38.1649 32.5405 38.756C31.0943 39.3627 29.5782 39.666 27.9921 39.666ZM27.9921 37.3327C29.687 37.3327 31.2576 36.9049 32.7037 36.0493C34.1032 35.2249 35.2151 34.1127 36.0392 32.7127C36.8945 31.266 37.3221 29.6949 37.3221 27.9993C37.3221 26.3038 36.8945 24.7327 36.0392 23.286C35.2151 21.886 34.1032 20.7738 32.7037 19.9493C31.2576 19.0938 29.687 18.666 27.9921 18.666C26.2971 18.666 24.7266 19.0938 23.2804 19.9493C21.8809 20.7738 20.7691 21.886 19.945 23.286C19.0897 24.7327 18.6621 26.3038 18.6621 27.9993C18.6621 29.6949 19.0897 31.266 19.945 32.7127C20.7691 34.1127 21.8809 35.2249 23.2804 36.0493C24.7266 36.9049 26.2971 37.3327 27.9921 37.3327ZM26.8258 31.4993H29.1583V33.8327H26.8258V31.4993ZM26.8258 22.166H29.1583V29.166H26.8258V22.166Z" fill="#1D6B1D"/>
</svg>

      )}
    </div>

    {/* Title */}
    <h2 className="text-center text-[28px] font-bold tracking-[-0.02em] text-slate-900">
      {pendingToggle?.accessEnabled
        ? 'Disable school administrator'
        : 'Activate account?'}
    </h2>

    {/* Description */}
    <p className="mt-4 text-center text-base leading-7 text-slate-600">
      {pendingToggle?.accessEnabled
        ? `This will immediately suspend access of ${pendingToggle?.name} from ${pendingToggle?.school}. All their services will be halted.`
        : `This will activate account of ${pendingToggle?.name} of ${pendingToggle?.school}. All data & access will be restored.`}
    </p>

    {/* Reason */}
    <div className="mt-6 text-left">
      <label
        htmlFor="admin-reason"
        className="mb-2 block text-sm font-semibold text-slate-900"
      >
        Reason <span className="text-[#D8201D]">*</span>
      </label>

      <textarea
        id="admin-reason"
        rows={4}
        value={deactivationReason}
        onChange={(e) => {
          setDeactivationReason(e.target.value);

          if (showReasonError) {
            setShowReasonError(false);
          }
        }}
        placeholder="Please provide a reason..."
        className="w-full rounded-xl border border-[#D9D4CC] bg-surface-100 px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400"
      />

      {showReasonError && !reasonValid && (
        <p className="mt-2 text-xs text-[#D8201D]">
          Please provide a reason with at least 10 characters.
        </p>
      )}
    </div>

    {/* Actions */}
    <div className="mt-7 flex justify-end gap-3">
      <button
        onClick={closeModal}
        className="h-11 min-w-27 cursor-pointer rounded-full border border-[#D9D4CC] bg-[#F4F2EF] px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
      >
        Cancel
      </button>

      <button
        onClick={confirmToggle}
        disabled={isEmptyReason}
        className={cn(
          'h-11 min-w-47 cursor-pointer rounded-full px-5 text-sm font-semibold text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50',
          pendingToggle?.accessEnabled
            ? 'bg-[#D8201D] hover:bg-[#b51516]'
            : 'bg-[#5B7963] hover:bg-[#4a6350]'
        )}
      >
        {pendingToggle?.accessEnabled
          ? 'Deactivate administrator'
          : 'Activate administrator'}
      </button>
    </div>
  </div>
</Modal>
    </div>
  );
}
