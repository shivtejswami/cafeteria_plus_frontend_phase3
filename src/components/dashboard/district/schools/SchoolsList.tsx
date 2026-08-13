'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Building2, Plus, Search, SearchX, Check, School, Layers, User, ClipboardList } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { StatusChip } from '@/components/ui/StatusChip';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Input } from '@/components/ui/Input';
import { AttentionDot } from '@/components/dashboard/district/shared/AttentionDot';
import { EmptyState } from '@/components/dashboard/district/shared/EmptyState';
import { LevelChip } from '@/components/dashboard/district/shared/LevelChip';
import { ParticipationCell } from '@/components/dashboard/district/shared/ParticipationCell';
import {
  BAND_TARGET,
  ENROLMENT_BANDS,
  SCHOOLS,
  type DistrictSchool,
  type SchoolLevel,
} from '@/constants/districtData';

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'closed', label: 'Closed' },
  { value: 'ready', label: 'Report ready' },
  { value: 'published', label: 'Published' },
  { value: 'none', label: 'No active survey' },
];

const PARTICIPATION_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'below', label: 'Below target' },
  { value: 'on', label: 'On/above target' },
  { value: 'none', label: 'No data' },
];

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'part', label: 'Participation' },
  { value: 'recent', label: 'Recent active' },
  { value: 'level', label: 'Level' },
];

const selectClass =
  'text-sm bg-white border border-slate-200 rounded-full px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer';

type NewSchool = {
  name: string;
  level: SchoolLevel;
  enrolmentBand: string;
  contactEmail: string;
  adminName: string;
  adminEmail: string;
  region: string;
  setting: string;
  gradeBands: string[];
};

const EMPTY_FORM: NewSchool = {
  name: '',
  level: 'Elementary',
  enrolmentBand: '300–599',
  contactEmail: '',
  adminName: '',
  adminEmail: '',
  region: '',
  setting: 'Urban',
  gradeBands: [],
};

/** "District dashboard>school" (2226:4697) — the schools index. */
export function SchoolsList() {
  const [schools, setSchools] = useState<DistrictSchool[]>(SCHOOLS);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [participationFilter, setParticipationFilter] = useState('all');
  const [adminFilter, setAdminFilter] = useState('all');
  const [sort, setSort] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form, setForm] = useState<NewSchool>(EMPTY_FORM);
  const [touched, setTouched] = useState(false);
  const [modalStep, setModalStep] = useState<number>(1);

  const adminOptions = [
    { value: 'all', label: 'All' },
    { value: 'has', label: 'Has Administrator' },
    { value: 'none', label: 'No Administrator' }
  ];

  const resetFilters = () => {
    setSearchQuery('');
    setLevelFilter('all');
    setStatusFilter('all');
    setParticipationFilter('all');
    setAdminFilter('all');
    setCurrentPage(1);
  };

  const isFiltered =
    searchQuery.trim() !== '' ||
    levelFilter !== 'all' ||
    statusFilter !== 'all' ||
    participationFilter !== 'all' ||
    adminFilter !== 'all';

  const filteredSchools = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();

    const list = schools.filter((school) => {
      const matchesSearch =
        !needle ||
        school.name.toLowerCase().includes(needle) ||
        (school.administrator?.toLowerCase().includes(needle) ?? false);
      const matchesLevel =
        levelFilter === 'all' || school.level.toLowerCase() === levelFilter;
      const matchesStatus = statusFilter === 'all' || school.status === statusFilter;
      let matchesAdmin = true;
      if (adminFilter === 'has') matchesAdmin = !!school.administrator;
      else if (adminFilter === 'none') matchesAdmin = !school.administrator;

      let matchesParticipation = true;
      if (participationFilter === 'below') matchesParticipation = school.belowTarget;
      else if (participationFilter === 'on')
        matchesParticipation = school.responses !== null && !school.belowTarget;
      else if (participationFilter === 'none')
        matchesParticipation = school.responses === null;

      return (
        matchesSearch && matchesLevel && matchesStatus && matchesAdmin && matchesParticipation
      );
    });

    const rate = (s: DistrictSchool) =>
      s.responses && s.target ? (s.responses / s.target) * 100 : -1;

    const getActivityScore = (activity: string) => {
      if (activity === 'just now') return 0;
      const match = activity.match(/(\d+)\s+days?\s+ago/);
      if (match) return parseInt(match[1], 10);
      return 999;
    };

    const getLevelScore = (level: string) => {
      if (level === 'Elementary') return 1;
      if (level === 'Middle') return 2;
      if (level === 'High') return 3;
      return 4;
    };

    return [...list].sort((a, b) => {
      switch (sort) {
        case 'part':
          return rate(b) - rate(a);
        case 'recent':
          return getActivityScore(a.lastActivity) - getActivityScore(b.lastActivity);
        case 'level':
          return getLevelScore(a.level) - getLevelScore(b.level);
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [schools, searchQuery, levelFilter, statusFilter, participationFilter, adminFilter, sort]);

  const totalPages = Math.ceil(filteredSchools.length / ITEMS_PER_PAGE);
  const currentSchools = filteredSchools.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const trimmedName = form.name.trim();
  const isDuplicate =
    trimmedName.length > 2 &&
    schools.some((s) => s.name.toLowerCase() === trimmedName.toLowerCase());
  // Validate administrator email (the invitation is sent to the admin)
  const adminEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail.trim());
  const canSubmit = trimmedName.length > 2 && adminEmailValid && !isDuplicate;

  const closeModal = () => {
    setIsAddModalOpen(false);
    setForm(EMPTY_FORM);
    setTouched(false);
    setModalStep(1);
    setInvitationSent(false);
  };

  const [invitationSent, setInvitationSent] = useState(false);

  const createSchool = (keepOpen = false) => {
    setTouched(true);
    if (!canSubmit) return;

    const id = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    setSchools([
      {
        id,
        name: trimmedName,
        level: form.level,
        enrolmentBand: form.enrolmentBand,
        status: 'none',
        responses: null,
        target: null,
        administrator: form.adminName.trim() || null,
        administratorEmail: form.adminEmail.trim() || null,
        latestReport: null,
        lastActivity: 'just now',
        belowTarget: false,
        needsAttention: !form.adminName.trim(),
        satisfaction: null,
        address: 'Address not set',
        contactEmail: form.contactEmail.trim(),
      },
      ...schools,
    ]);

    setCurrentPage(1);
    if (keepOpen) {
      // Close the add-modal and show a separate invitation modal
      setIsAddModalOpen(false);
      setInvitationSent(true);
    } else {
      closeModal();
    }
  };

  const goNext = () => setModalStep((s) => Math.min(3, s + 1));
  const goBack = () => setModalStep((s) => Math.max(1, s - 1));

  const submitFinal = () => {
    createSchool(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-slate-900">{schools.length} schools</h1>
        <button
          onClick={() => { setInvitationSent(false); setIsAddModalOpen(true); }}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#5B7963] hover:bg-[#4a6350] text-white text-sm font-medium rounded-full cursor-pointer transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add school
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search schools..."
            aria-label="Search schools"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 pr-4 py-1.5 w-full text-sm bg-white border border-slate-200 rounded-full  placeholder:text-slate-400"
          />
        </div>

        <FilterDropdown
          label="Level"
          options={[
            { value: 'all', label: 'All' },
            { value: 'elementary', label: 'Elementary' },
            { value: 'middle', label: 'Middle' },
            { value: 'high', label: 'High' },
          ]}
          value={levelFilter}
          onChange={(v) => {
            setLevelFilter(v);
            setCurrentPage(1);
          }}
        />

        <FilterDropdown
          label="Survey status"
          options={STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          value={statusFilter}
          onChange={(v) => {
            setStatusFilter(v);
            setCurrentPage(1);
          }}
        />

        <FilterDropdown
          label="Participation"
          options={PARTICIPATION_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          value={participationFilter}
          onChange={(v) => {
            setParticipationFilter(v);
            setCurrentPage(1);
          }}
        />

        <FilterDropdown
          label="Admin"
          options={adminOptions}
          value={adminFilter}
          onChange={(v) => {
            setAdminFilter(v);
            setCurrentPage(1);
          }}
        />

        <FilterDropdown
          label="Sort"
          options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          value={sort}
          onChange={(v) => setSort(v)}
          className="ml-auto"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {currentSchools.length === 0 ? (
          isFiltered ? (
            <EmptyState
              icon={<SearchX className="w-5 h-5" />}
              title="No schools match these filters"
              description="Try a different search term, or clear the filters to see every school in the district."
              action={
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-full transition-colors text-sm cursor-pointer"
                >
                  Clear filters
                </button>
              }
            />
          ) : (
            <EmptyState
              icon={<Building2 className="w-5 h-5" />}
              title="No schools in this district yet"
              description="Add your first school to start running lunchtime surveys and collecting student feedback."
              action={
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-[#5B7963] hover:bg-[#4a6350] text-white font-medium rounded-full transition-colors text-sm"
                >
                  Add school
                </button>
              }
            />
          )
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School</TableHead>
                  <TableHead>Enrolment band</TableHead>
                  <TableHead>Active survey</TableHead>
                  <TableHead>Participation</TableHead>
                  <TableHead>Administrator</TableHead>
                  <TableHead>Latest report</TableHead>
                  <TableHead>Last activity</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSchools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium text-slate-900">
                      <div className="flex flex-wrap items-center gap-2">
                        {school.needsAttention && <AttentionDot />}
                        <Link
                          href={`/district/schools/${school.id}`}
                          className="truncate hover:text-indigo-700"
                        >
                          {school.name}
                        </Link>
                        <LevelChip level={school.level} />
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-slate-600">
                      {school.enrolmentBand}
                    </TableCell>
                    <TableCell>
                      <StatusChip
                        status={school.status}
                        label={school.status === 'open' ? 'Open' : undefined}
                      />
                    </TableCell>
                    <TableCell>
                      <ParticipationCell
                        responses={school.responses}
                        target={school.target}
                        belowTarget={school.belowTarget}
                        layout="stacked"
                      />
                    </TableCell>
                    <TableCell>
                      {school.administrator ? (
                        <div className="text-sm text-slate-900 truncate">
                          {school.administrator}
                        </div>
                      ) : (
                        <span className="text-sm text-red-600">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {school.latestReport ? (
                        <Link
                          href={`/district/schools/${school.id}/reports`}
                          className="text-iris text-sm font-medium hover:underline"
                        >
                          {school.latestReport}
                        </Link>
                      ) : (
                        <span className="text-slate-400">–</span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-slate-500">
                      {school.lastActivity}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/district/schools/${school.id}`}
                        className="text-iris text-sm font-medium hover:underline"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredSchools.length}
                itemsPerPage={ITEMS_PER_PAGE}
                itemName="schools"
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      {/* Add school modal */}
      <Modal isOpen={isAddModalOpen} onClose={closeModal} className="max-w-4xl w-full">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left panel - Form */}
            <div className="flex-1 bg-white rounded-2xl p-6 shadow-card">
              {/* Step indicators */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${modalStep > 1 ? 'bg-[#5B7963] text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {modalStep > 1 ? <Check className="w-4 h-4" /> : <span className="text-sm font-semibold">1</span>}
                  </div>
                  <div className={`text-sm font-medium ${modalStep >= 1 ? 'text-slate-700' : 'text-slate-500'}`}>
                    School details
                  </div>
                </div>

                <div className="flex-1 h-px bg-slate-200" />

                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${modalStep > 2 ? 'bg-[#5B7963] text-white' :
                    modalStep === 2 ? 'bg-[#5B7963] text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {modalStep > 2 ? <Check className="w-4 h-4" /> : <span className="text-sm font-semibold">2</span>}
                  </div>
                  <div className={`text-sm font-medium ${modalStep >= 2 ? 'text-slate-700' : 'text-slate-500'}`}>
                    Administrator
                  </div>
                </div>

                <div className="flex-1 h-px bg-slate-200" />

                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${modalStep === 3 ? 'bg-[#5B7963] text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                    <span className="text-sm font-semibold">3</span>
                  </div>
                  <div className={`text-sm font-medium ${modalStep === 3 ? 'text-slate-700' : 'text-slate-500'}`}>
                    Review
                  </div>
                </div>
              </div>

              <div className="mt-2">
                {/* Step 1 - School Details */}
                {modalStep === 1 && (
                  <div className="space-y-6">
                    {/* School details header */}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#F0EAFB] flex items-center justify-center shrink-0">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 15 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.32875 -0.000391006L11.3263 3.99961V5.59961H13.9913V12.2663H14.6575V13.5996H0V12.2663H0.66625V5.59961H3.33125V3.99961L7.32875 -0.000391006ZM11.3263 12.2663H12.6588V6.93294H11.3263V12.2663ZM3.33125 6.93294H1.99875V12.2663H3.33125V6.93294ZM4.66375 4.54628V12.2663H6.6625V7.59961H7.995V12.2663H9.99375V4.54628L7.32875 1.87961L4.66375 4.54628Z"
                            fill="#6D28D9"
                          />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 leading-5">
                          School details
                        </h4>
                        <p className="text-xs text-slate-500 leading-5">
                          Set up a new school on the platform.
                        </p>
                      </div>
                    </div>

                    {/* School form fields */}
                    <div className="space-y-5">
                      {/* Row 1 - School name */}
                      <div>
                        <label
                          htmlFor="school-name"
                          className="block text-sm font-medium text-slate-700 mb-1"
                        >
                          School name <span className="text-red-500">*</span>
                        </label>

                        <Input
                          id="school-name"
                          type="text"
                          autoComplete="off"
                          placeholder="e.g. Maple Grove Elementary"
                          value={form.name}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              name: e.target.value,
                            })
                          }
                          className="h-12 rounded-xl bg-canvas border-(--color-border) px-4 text-sm"
                        />

                        {isDuplicate && (
                          <p role="alert" className="text-xs text-red-600 mt-1">
                            {trimmedName} is already in this district.
                          </p>
                        )}
                      </div>

                      {/* Row 2 - School level + Enrolment band */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* School level */}
                        <div>
                          <label
                            htmlFor="school-level"
                            className="block text-sm font-medium text-slate-700 mb-1"
                          >
                            School level <span className="text-red-500">*</span>
                          </label>

                          <FilterDropdown
                            label="School level"
                            options={[
                              { value: 'Elementary', label: 'Elementary' },
                              { value: 'Middle', label: 'Middle' },
                              { value: 'High', label: 'High' },
                            ]}
                            value={form.level}
                            onChange={(v) => setForm({ ...form, level: v as SchoolLevel })}
                            controlClassName="h-12 rounded-xl bg-[#FAF9F6] border-[var(--color-border)] px-4 text-sm justify-start"
                          />
                        </div>

                        {/* Enrolment band */}
                        <div>
                          <label
                            htmlFor="enrolment-band"
                            className="block text-sm font-medium text-slate-700 mb-1"
                          >
                            Enrolment band <span className="text-red-500">*</span>
                          </label>

                          <FilterDropdown
                            label="Enrolment band"
                            options={ENROLMENT_BANDS.map((band) => ({ value: band, label: band }))}
                            value={form.enrolmentBand}
                            onChange={(v) => setForm({ ...form, enrolmentBand: v })}
                            controlClassName="h-12 rounded-xl bg-[#FAF9F6] border-[var(--color-border)] px-4 text-sm justify-start"
                          />

                          <p className="text-xs text-slate-500 mt-1">
                            Used to group comparable schools for benchmarking.
                          </p>
                        </div>
                      </div>

                      {/* Row 3 - Region / state + School setting */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Region / state */}
                        <div>
                          <label
                            htmlFor="region"
                            className="block text-sm font-medium text-slate-700 mb-1"
                          >
                            Region / state
                          </label>

                          <Input
                            id="region"
                            type="text"
                            placeholder="e.g. Texas"
                            value={form.region}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                region: e.target.value,
                              })
                            }
                            className="h-12 rounded-xl bg-[#FAF9F6] border-[var(--color-border)] px-4 text-sm"
                          />
                        </div>

                        {/* School setting */}
                        <div>
                          <label
                            htmlFor="school-setting"
                            className="block text-sm font-medium text-slate-700 mb-1"
                          >
                            School setting
                          </label>

                          <FilterDropdown
                            label="School setting"
                            options={[
                              { value: 'Urban', label: 'Urban' },
                              { value: 'Suburban', label: 'Suburban' },
                              { value: 'Rural', label: 'Rural' },
                            ]}
                            value={form.setting}
                            onChange={(v) => setForm({ ...form, setting: v })}
                            controlClassName="h-12 rounded-xl bg-[#FAF9F6] border-[var(--color-border)] px-4 text-sm justify-start"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Grade-level survey */}
                    <div className="pt-5 border-t border-slate-100">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#F0EAFB] flex items-center justify-center shrink-0">
                          <svg width="16" height="16" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.3275 -0.000325203V1.33301H11.3263C11.5128 1.33301 11.6705 1.39745 11.7993 1.52634C11.9281 1.65523 11.9925 1.81301 11.9925 1.99967V12.6663C11.9925 12.853 11.9281 13.0108 11.7993 13.1397C11.6705 13.2686 11.5128 13.333 11.3263 13.333H0.66625C0.4797 13.333 0.322021 13.2686 0.193213 13.1397C0.0644042 13.0108 0 12.853 0 12.6663V1.99967C0 1.81301 0.0644042 1.65523 0.193213 1.52634C0.322021 1.39745 0.4797 1.33301 0.66625 1.33301H2.665V-0.000325203H9.3275ZM2.665 2.66634H1.3325V11.9997H10.66V2.66634H9.3275V3.99967H2.665V2.66634ZM3.9975 9.33301V10.6663H2.665V9.33301H3.9975ZM3.9975 7.33301V8.66634H2.665V7.33301H3.9975ZM3.9975 5.33301V6.66634H2.665V5.33301H3.9975ZM7.995 1.33301H3.9975V2.66634H7.995V1.33301Z" fill="#6D28D9" />
                          </svg>
                        </div>

                        <div className="min-w-0 pt-0.5">
                          <h4 className="text-sm font-semibold text-slate-900 leading-5">
                            Grade-level survey
                          </h4>

                          <p className="text-xs text-slate-500 leading-5">
                            Choose the standardised survey this school will run.
                          </p>
                        </div>
                      </div>

                      {/* Grade options */}
                      <div className="mt-4 space-y-3">
                        {[
                          { id: "k-5", label: "K–5" },
                          { id: "6-8", label: "6–8" },
                          { id: "9-12", label: "9–12" },
                        ].map((band) => (
                          <label
                            key={band.id}
                            className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={form.gradeBands.includes(band.label)}
                              onChange={(e) => {
                                const newBands = e.target.checked
                                  ? [...form.gradeBands, band.label]
                                  : form.gradeBands.filter((b) => b !== band.label);

                                setForm({
                                  ...form,
                                  gradeBands: newBands,
                                });
                              }}
                              className="w-5 h-5 rounded border-slate-300 text-[#5B7963] focus:ring-[#5B7963]"
                            />

                            <span className="text-sm font-medium text-slate-900">
                              {band.label}
                            </span>
                          </label>
                        ))}
                      </div>

                      <p className="text-xs text-slate-500 mt-3 leading-5">
                        A school can run one survey per grade band at a time. You can enable more
                        than one grade band here if this school serves multiple bands.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2 - Administrator */}
                {modalStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#F0EAFB] flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-[#6D28D9]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">School administrator</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Each school has one school administrator. They'll receive a secure invitation to set their password and complete sign-in.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Administrator full name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g. James Chen"
                          value={form.adminName}
                          onChange={(e) => setForm({ ...form, adminName: e.target.value })}
                          className="h-12 rounded-xl bg-canvas border-border px-4 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Administrator email <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="email"
                          placeholder="admin@school.org"
                          value={form.adminEmail}
                          onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                          className="h-12 rounded-xl bg-canvas border-border px-4 text-sm"
                        />
                      </div>

                      {/* Role */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Role
                        </label>
                        <div className="flex justify-center items-center gap-2 w-fit text-sm text-iris bg-[#F0EAFB] px-3 py-2 rounded-full border border-slate-200">
                          <span><svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.33 7.04167V8.125C3.74545 8.125 3.20059 8.27306 2.69543 8.56917C2.20469 8.85806 1.81499 9.24806 1.52632 9.73917C1.23044 10.2447 1.0825 10.7936 1.0825 11.3858H0C0 10.5986 0.198458 9.86917 0.595375 9.1975C0.977858 8.54028 1.49385 8.02028 2.14335 7.6375C2.8145 7.24028 3.54338 7.04167 4.33 7.04167ZM4.33 6.5C3.74545 6.5 3.20059 6.35556 2.69543 6.06667C2.20469 5.77778 1.81499 5.38778 1.52632 4.89667C1.23044 4.39111 1.0825 3.84403 1.0825 3.25542C1.0825 2.66681 1.23044 2.11972 1.52632 1.61417C1.81499 1.12306 2.20469 0.733055 2.69543 0.444166C3.20059 0.148055 3.74725 0 4.33541 0C4.92357 0 5.47023 0.148055 5.9754 0.444166C6.45892 0.733055 6.84501 1.12306 7.13367 1.61417C7.42956 2.11972 7.5775 2.66681 7.5775 3.25542C7.5775 3.84403 7.42956 4.39111 7.13367 4.89667C6.84501 5.38778 6.45892 5.77778 5.9754 6.06667C5.47023 6.35556 4.92177 6.5 4.33 6.5ZM4.33 5.41667C4.7197 5.41667 5.08053 5.32097 5.4125 5.12958C5.74447 4.93819 6.00787 4.67639 6.20272 4.34417C6.39757 4.01194 6.495 3.64903 6.495 3.25542C6.495 2.8618 6.39757 2.49889 6.20272 2.16667C6.00787 1.83444 5.74447 1.57083 5.4125 1.37583C5.08053 1.18083 4.7197 1.08333 4.33 1.08333C3.9403 1.08333 3.57947 1.18083 3.2475 1.37583C2.91553 1.57083 2.65212 1.83444 2.45727 2.16667C2.26242 2.49889 2.165 2.8618 2.165 3.25542C2.165 3.64903 2.26242 4.01194 2.45727 4.34417C2.65212 4.67639 2.91553 4.93819 3.2475 5.12958C3.57947 5.32097 3.9403 5.41667 4.33 5.41667ZM5.73725 9.6525C5.70117 9.50806 5.68313 9.36181 5.68313 9.21375C5.68313 9.06569 5.70117 8.91944 5.73725 8.775L5.196 8.46083L5.73725 7.52917L6.2785 7.8325C6.495 7.63028 6.74758 7.48583 7.03625 7.39917V6.77083H8.11875V7.39917C8.40742 7.48583 8.66 7.63028 8.8765 7.8325L9.41775 7.52917L9.959 8.46083L9.41775 8.775C9.45383 8.91944 9.47188 9.06569 9.47188 9.21375C9.47188 9.36181 9.45383 9.50806 9.41775 9.6525L9.959 9.96667L9.41775 10.8983L8.8765 10.595C8.66 10.7972 8.40742 10.9417 8.11875 11.0283V11.6458H7.03625V11.0283C6.74758 10.9417 6.495 10.7972 6.2785 10.595L5.73725 10.8983L5.196 9.96667L5.73725 9.6525ZM7.5775 10.0208C7.80122 10.0208 7.99246 9.94319 8.15123 9.78792C8.30999 9.63264 8.38937 9.44125 8.38937 9.21375C8.38937 8.98625 8.30999 8.79486 8.15123 8.63958C7.99246 8.48431 7.80122 8.40486 7.5775 8.40125C7.35378 8.39764 7.16254 8.47528 7.00377 8.63417C6.84501 8.79306 6.76562 8.98625 6.76562 9.21375C6.76562 9.44125 6.84501 9.63444 7.00377 9.79333C7.16254 9.95222 7.35378 10.0317 7.5775 10.0317V10.0208Z" fill="#6D28D9" />
                          </svg>
                          </span>
                          <p>
                            School administrator
                          </p>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          School administrators manage only their own school.
                        </p>
                      </div>

                      {/* Info bullets */}

                      <div className="flex items-start gap-3 bg-[#E3F5E3] text-[#1D6B1D] p-4 rounded-xl">
                        <p className="text-sm  flex items-start gap-2">
                          <span className="text-[#5B7963] mt-1"><svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.70867 5.36677L9.07343 0.000103951L9.8898 0.828437L3.70867 7.02344L0 3.30177L0.816375 2.4851L3.70867 5.36677Z" fill="#1D6B1D" />
                          </svg>
                          </span>
                          The administrator will receive an email invitation with a secure link to set their password and activate their account.
                        </p>
                      </div>
                      <div className="flex items-start gap-3 bg-[#F5F3FB] text-[#3C1677] p-4 rounded-xl">
                        <p className="text-sm  flex items-start gap-2">
                          <span className="text-[#5B7963] mt-0.5"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.83125 11.667C5.0382 11.667 4.28014 11.5153 3.55706 11.212C2.86509 10.9164 2.24892 10.4984 1.70856 9.95783C1.16819 9.41727 0.750288 8.80088 0.454838 8.10866C0.151613 7.38533 0 6.62699 0 5.83366C0 5.04033 0.151613 4.28199 0.454838 3.55866C0.750288 2.86644 1.16819 2.25005 1.70856 1.70949C2.24892 1.16894 2.86509 0.750881 3.55706 0.455325C4.28014 0.151992 5.0382 0.000325203 5.83125 0.000325203C6.6243 0.000325203 7.38236 0.151992 8.10544 0.455325C8.79741 0.750881 9.41358 1.16894 9.95394 1.70949C10.4943 2.25005 10.9122 2.86644 11.2077 3.55866C11.5109 4.28199 11.6625 5.04033 11.6625 5.83366C11.6625 6.62699 11.5109 7.38533 11.2077 8.10866C10.9122 8.80088 10.4943 9.41727 9.95394 9.95783C9.41358 10.4984 8.79741 10.9164 8.10544 11.212C7.38236 11.5153 6.6243 11.667 5.83125 11.667ZM5.83125 10.5003C6.67872 10.5003 7.464 10.2864 8.18707 9.85866C8.88682 9.44644 9.44274 8.89033 9.85481 8.19033C10.2824 7.46699 10.4963 6.68144 10.4963 5.83366C10.4963 4.98588 10.2824 4.20033 9.85481 3.47699C9.44274 2.77699 8.88682 2.22088 8.18707 1.80866C7.464 1.38088 6.67872 1.16699 5.83125 1.16699C4.98378 1.16699 4.1985 1.38088 3.47543 1.80866C2.77568 2.22088 2.21976 2.77699 1.80769 3.47699C1.38006 4.20033 1.16625 4.98588 1.16625 5.83366C1.16625 6.68144 1.38006 7.46699 1.80769 8.19033C2.21976 8.89033 2.77568 9.44644 3.47543 9.85866C4.1985 10.2864 4.98378 10.5003 5.83125 10.5003ZM5.24813 2.91699H6.41437V4.08366H5.24813V2.91699ZM5.24813 5.25033H6.41437V8.75033H5.24813V5.25033Z" fill="#6D28D9" />
                          </svg>
                          </span>
                          The invitation link expires after 7 days. If activation fails, contact SFWG support – the school record has no invite or replace controls.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 - Review & confirm */}
                {modalStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#E3F5E3] flex items-center justify-center shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.06225 5.2L7.995 6.13333L13.6448 0.493333L14.5775 1.44L7.995 8.02667L3.75765 3.77333L4.70372 2.84L7.06225 5.2ZM7.06225 3.30667L10.3535 0L11.2996 0.946666L7.995 4.25333L7.06225 3.30667ZM5.18342 7.08L4.23735 8.02667L0 3.77333L0.93275 2.84L1.87883 3.77333L5.18342 7.08Z" fill="#586D4D" />
                        </svg>

                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">Review & confirm</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Check everything below before creating the school.</p>
                      </div>
                    </div>

                    <div className="bg-canvas border border-border rounded-xl p-5 space-y-4">
                      <h4 className="text-sm font-semibold text-slate-900">School</h4>
                      <dl className="grid grid-cols-2 gap-y-3 gap-x-6">
                        <div>
                          <dt className="text-xs text-slate-500">Name</dt>
                          <dd className="font-medium text-slate-900 text-sm mt-0.5">{form.name || '—'}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-slate-500">Level</dt>
                          <dd className="font-medium text-slate-900 text-sm mt-0.5">{form.level || '—'}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-slate-500">Enrolment</dt>
                          <dd className="font-medium text-slate-900 text-sm mt-0.5">{form.enrolmentBand || '—'}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-slate-500">Setting</dt>
                          <dd className="font-medium text-slate-900 text-sm mt-0.5">{form.setting || '—'}</dd>
                        </div>
                        <div className="col-span-2">
                          <dt className="text-xs text-slate-500">Grade bands</dt>
                          <dd className="font-medium text-slate-900 text-sm mt-0.5">
                            {form.gradeBands.length > 0 ? form.gradeBands.join(', ') : '—'}
                          </dd>
                        </div>
                        <div className="col-span-2">
                          <dt className="text-xs text-slate-500">Region</dt>
                          <dd className="font-medium text-slate-900 text-sm mt-0.5">{form.region || '—'}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="bg-canvas border border-border rounded-xl p-5 space-y-4">
                      <h4 className="text-sm font-semibold text-slate-900">Administrator</h4>
                      <dl className="grid grid-cols-2 gap-y-3 gap-x-6">
                        <div>
                          <dt className="text-xs text-slate-500">Name</dt>
                          <dd className="font-medium text-slate-900 text-sm mt-0.5">{form.adminName || '—'}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-slate-500">Email</dt>
                          <dd className="font-medium text-slate-900 text-sm mt-0.5">{form.adminEmail || '—'}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  {modalStep > 1 && (
                    <button
                      onClick={goBack}
                      className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  {modalStep < 3 ? (
                    <button
                      onClick={() => {
                        if (modalStep === 1) {
                          setTouched(true);
                          if (trimmedName.length <= 2 || isDuplicate) return;
                          if (!form.enrolmentBand) return;
                        }
                        if (modalStep === 2) {
                          if (!form.adminName.trim() || !form.adminEmail.trim()) return;
                          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail.trim())) return;
                        }
                        goNext();
                      }}
                      className="px-6 py-2 bg-[#5B7963] hover:bg-[#4a6350] text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                      {modalStep === 1 ? 'Continue to Administrator' : 'Continue to Review'}
                    </button>
                  ) : (
                    <button
                      onClick={submitFinal}
                      disabled={!canSubmit}
                      className="px-6 py-2 bg-[#5B7963] hover:bg-[#4a6350] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                      Create school & send invitation
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Invitation panel removed from modal; shown in separate modal below when needed */}
          </div>
        </div>
      </Modal>

      {/* Separate invitation modal shown after successful create */}
      <Modal isOpen={invitationSent} onClose={() => setInvitationSent(false)} className="max-w-sm w-full">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E3F5E3] mx-auto mb-3">
            <Check className="w-6 h-6 text-sage" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Invitation sent</h3>
          <p className="text-sm text-slate-500 mt-2">
            <span className="font-medium text-slate-900">{form.name || 'The school'}</span> has been added to North Hills School District. An invitation has been sent to{' '}
            <a href={`mailto:${form.adminEmail || form.contactEmail || ''}`} className="font-medium text-[#5B7963] hover:underline">
              {form.adminEmail || form.contactEmail || '—'}
            </a>.
          </p>

          <div className="mt-6">
            <button
              onClick={() => {
                setInvitationSent(false);
                setForm(EMPTY_FORM);
              }}
              className="px-6 py-2 cursor-pointer bg-[#5B7963] hover:bg-[#4a6350] text-white rounded-full text-sm font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}