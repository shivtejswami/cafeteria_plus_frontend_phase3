"use client";

import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { UsersTable } from "./UsersTable";
import { Input } from "@/components/ui/Input";
import FilterDropdown from "@/components/ui/FilterDropdown";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "District administrator" | "School administrator" | "Pending";
  tenant: string;
  status: "Active" | "Pending" | "Deactivated";
  type: "District" | "Standalone";
  lastActive: string;
}

const MOCK_USERS: AdminUser[] = [
  { id: 1, name: "Sarah Chen", email: "sarah.chen@riverside.edu", role: "District administrator", tenant: "Riverside Unified School District", status: "Active", type: "District", lastActive: "2h ago" },
  { id: 2, name: "Marcus Webb", email: "marcus.webb@riverside.edu", role: "School administrator", tenant: "Riverside Middle", status: "Active", type: "Standalone", lastActive: "5h ago" },
  { id: 3, name: "Julia Rojas", email: "julia.rojas@riverside.edu", role: "School administrator", tenant: "Riverside Elementary", status: "Pending", type: "Standalone", lastActive: "—" },
  { id: 4, name: "Patricia Davis", email: "pdavis@dekalb.k12.ga.us", role: "District administrator", tenant: "DeKalb County Schools", status: "Active", type: "District", lastActive: "1d ago" },
  { id: 5, name: "Thomas Wright", email: "twright@dekalb.k12.ga.us", role: "School administrator", tenant: "DeKalb Middle Academy", status: "Active", type: "Standalone", lastActive: "1d ago" },
  { id: 6, name: "David Park", email: "dpark@summitvalley.edu", role: "District administrator", tenant: "Summit Valley District", status: "Active", type: "District", lastActive: "1h ago" },
  { id: 7, name: "Angela Torres", email: "atorres@summitvalley.edu", role: "School administrator", tenant: "Valley Middle", status: "Active", type: "Standalone", lastActive: "1h ago" },
  { id: 8, name: "Karen Liu", email: "kliu@nhsd.edu", role: "District administrator", tenant: "North Hills School District", status: "Active", type: "District", lastActive: "4h ago" },
  { id: 9, name: "Tomas Reyes", email: "t.reyes@nhsd.edu", role: "School administrator", tenant: "Hillside Middle", status: "Active", type: "Standalone", lastActive: "4h ago" },
  { id: 10, name: "Carlos Rivera", email: "c.rivera@nhsd.edu", role: "School administrator", tenant: "Fairview Elementary", status: "Deactivated", type: "Standalone", lastActive: "1w ago" },
  { id: 11, name: "Aisha Patel", email: "a.patel@lakeside.edu", role: "School administrator", tenant: "Lakeside High", status: "Active", type: "Standalone", lastActive: "3h ago" },
  { id: 12, name: "Ben Cooper", email: "b.cooper@lakeside.edu", role: "District administrator", tenant: "Lakeside District", status: "Active", type: "District", lastActive: "2d ago" },
  { id: 13, name: "Carmen Ortiz", email: "c.ortiz@pinecrest.edu", role: "School administrator", tenant: "Pinecrest Elementary", status: "Pending", type: "Standalone", lastActive: "—" },
  { id: 14, name: "Diego Marquez", email: "d.marquez@pinecrest.edu", role: "School administrator", tenant: "Pinecrest Middle", status: "Active", type: "Standalone", lastActive: "6h ago" },
  { id: 15, name: "Evelyn Kim", email: "e.kim@brighton.edu", role: "District administrator", tenant: "Brighton Schools", status: "Active", type: "District", lastActive: "30m ago" },
  { id: 16, name: "Felix Nguyen", email: "f.nguyen@brighton.edu", role: "School administrator", tenant: "Brighton High", status: "Active", type: "Standalone", lastActive: "5h ago" },
  { id: 17, name: "Grace Lee", email: "g.lee@oakridge.edu", role: "School administrator", tenant: "Oakridge Elementary", status: "Deactivated", type: "Standalone", lastActive: "2w ago" },
  { id: 18, name: "Hannah Scott", email: "h.scott@oakridge.edu", role: "District administrator", tenant: "Oakridge District", status: "Active", type: "District", lastActive: "8h ago" },
  { id: 19, name: "Ian Bell", email: "i.bell@maple.edu", role: "School administrator", tenant: "Maple Middle", status: "Active", type: "Standalone", lastActive: "4d ago" },
  { id: 20, name: "Jasmine Roy", email: "j.roy@maple.edu", role: "School administrator", tenant: "Maple High", status: "Pending", type: "Standalone", lastActive: "—" },
  { id: 21, name: "Kyle Fisher", email: "k.fisher@riverside.edu", role: "School administrator", tenant: "Riverside High", status: "Active", type: "Standalone", lastActive: "2h ago" },
  { id: 22, name: "Lina Gomez", email: "l.gomez@dekalb.k12.ga.us", role: "School administrator", tenant: "DeKalb Elementary", status: "Active", type: "Standalone", lastActive: "3d ago" },
  { id: 23, name: "Marcus Young", email: "m.young@summitvalley.edu", role: "School administrator", tenant: "Summit Valley High", status: "Active", type: "Standalone", lastActive: "6h ago" },
  { id: 24, name: "Nia Brown", email: "n.brown@nhsd.edu", role: "District administrator", tenant: "North Hills School District", status: "Active", type: "District", lastActive: "1h ago" },
  { id: 25, name: "Omar Khalid", email: "o.khalid@fairview.edu", role: "School administrator", tenant: "Fairview Middle", status: "Deactivated", type: "Standalone", lastActive: "3w ago" },
  { id: 26, name: "Priya Desai", email: "p.desai@lakeside.edu", role: "School administrator", tenant: "Lakeside Elementary", status: "Active", type: "Standalone", lastActive: "7h ago" }
];

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const perPage = 26;

  const filtered = useMemo(() => {
    let result = [...MOCK_USERS];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.tenant.toLowerCase().includes(s));
    }
    if (roleFilter !== "All") result = result.filter(r => r.role === roleFilter);
    if (statusFilter !== "All") result = result.filter(r => r.status === statusFilter);
    if (typeFilter !== "All") result = result.filter(r => r.type === typeFilter);
    return result;
  }, [search, roleFilter, statusFilter, typeFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const shown = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-4 lg:space-y-6 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 w-full">
        {/* District Administrators */}
        <div className="relative h-24 lg:h-28 w-full bg-white rounded-2xl border border-[#E8E6E1] p-4 lg:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="text-xs lg:text-sm text-slate-400">
            District administrators
          </div>

          <div className="text-2xl lg:text-3xl font-bold mt-1.5 lg:mt-2 text-slate-900">
            5
          </div>

          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F3E8FF] flex items-center justify-center">
            <svg
              width="16"
              height="23"
              viewBox="0 0 16 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-5"
            >
              <path
                d="M6.94995 12.4877V13.7377C6.27495 13.7377 5.64578 13.9085 5.06245 14.2502C4.49578 14.5835 4.04578 15.0294 3.71245 15.5877C3.37078 16.171 3.19995 16.8044 3.19995 17.4877H1.94995C1.94995 16.5794 2.17912 15.7377 2.63745 14.9627C3.07912 14.2044 3.67495 13.6044 4.42495 13.1627C5.19995 12.7127 6.04162 12.4877 6.94995 12.4877ZM6.94995 11.8627C6.27495 11.8627 5.64578 11.6919 5.06245 11.3502C4.49578 11.0169 4.04578 10.5669 3.71245 10.0002C3.37078 9.41686 3.19995 8.78561 3.19995 8.10645C3.19995 7.42728 3.37078 6.79603 3.71245 6.2127C4.04578 5.65436 4.49578 5.20853 5.06245 4.8752C5.64578 4.53353 6.27703 4.3627 6.9562 4.3627C7.63537 4.3627 8.26662 4.53353 8.84995 4.8752C9.40828 5.20853 9.85412 5.65436 10.1875 6.2127C10.5291 6.79603 10.7 7.42728 10.7 8.10645C10.7 8.78561 10.5291 9.41686 10.1875 10.0002C9.85412 10.5669 9.40828 11.0169 8.84995 11.3502C8.26662 11.6919 7.63328 11.8627 6.94995 11.8627ZM6.94995 10.6127C7.39995 10.6127 7.81662 10.5002 8.19995 10.2752C8.58328 10.0502 8.88745 9.74603 9.11245 9.3627C9.33745 8.97936 9.44995 8.5627 9.44995 8.1127C9.44995 7.6627 9.33745 7.24603 9.11245 6.8627C8.88745 6.47936 8.58328 6.1752 8.19995 5.9502C7.81662 5.7252 7.39995 5.6127 6.94995 5.6127C6.49995 5.6127 6.08328 5.7252 5.69995 5.9502C5.31662 6.1752 5.01245 6.47936 4.78745 6.8627C4.56245 7.24603 4.44995 7.6627 4.44995 8.1127C4.44995 8.5627 4.56245 8.97936 4.78745 9.3627C5.01245 9.74603 5.31662 10.0502 5.69995 10.2752C6.08328 10.5002 6.49995 10.6127 6.94995 10.6127ZM10.7 17.1752L8.86245 18.1377L9.21245 16.0877L7.72495 14.6502L9.78745 14.3502L10.7 12.4877L11.625 14.3502L13.675 14.6502L12.1875 16.0877L12.5375 18.1377L10.7 17.1752Z"
                fill="#6D28D9"
              />
            </svg>
          </div>
        </div>

        {/* School Administrators */}
        <div className="relative h-24 lg:h-28 w-full bg-white rounded-2xl border border-[#E8E6E1] p-4 lg:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="text-xs lg:text-sm text-slate-400">
            School administrators
          </div>

          <div className="text-2xl lg:text-3xl font-bold mt-1.5 lg:mt-2 text-slate-900">
            18
          </div>

          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#EEF4EA] flex items-center justify-center">
            <svg
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3.5"
            >
              <path
                d="M5 8.125V9.375C4.325 9.375 3.69583 9.54583 3.1125 9.8875C2.54583 10.2208 2.09583 10.6708 1.7625 11.2375C1.42083 11.8208 1.25 12.4542 1.25 13.1375H0C0 12.2292 0.229167 11.3875 0.6875 10.6125C1.12917 9.85417 1.725 9.25417 2.475 8.8125C3.25 8.35417 4.09167 8.125 5 8.125ZM5 7.5C4.325 7.5 3.69583 7.33333 3.1125 7C2.54583 6.66667 2.09583 6.21667 1.7625 5.65C1.42083 5.06667 1.25 4.43542 1.25 3.75625C1.25 3.07708 1.42083 2.44583 1.7625 1.8625C2.09583 1.29583 2.54583 0.845833 3.1125 0.5125C3.69583 0.170834 4.32708 0 5.00625 0C5.68542 0 6.31667 0.170834 6.9 0.5125C7.45833 0.845833 7.90417 1.29583 8.2375 1.8625C8.57917 2.44583 8.75 3.07708 8.75 3.75625C8.75 4.43542 8.57917 5.06667 8.2375 5.65C7.90417 6.21667 7.45833 6.66667 6.9 7C6.31667 7.33333 5.68333 7.5 5 7.5ZM5 6.25C5.45 6.25 5.86667 6.13958 6.25 5.91875C6.63333 5.69792 6.9375 5.39583 7.1625 5.0125C7.3875 4.62917 7.5 4.21042 7.5 3.75625C7.5 3.30208 7.3875 2.88333 7.1625 2.5C6.9375 2.11667 6.63333 1.8125 6.25 1.5875C5.86667 1.3625 5.45 1.25 5 1.25C4.55 1.25 4.13333 1.3625 3.75 1.5875C3.36667 1.8125 3.0625 2.11667 2.8375 2.5C2.6125 2.88333 2.5 3.30208 2.5 3.75625C2.5 4.21042 2.6125 4.62917 2.8375 5.0125C3.0625 5.39583 3.36667 5.69792 3.75 5.91875C4.13333 6.13958 4.55 6.25 5 6.25ZM6.625 11.1375C6.58333 10.9708 6.5625 10.8021 6.5625 10.6312C6.5625 10.4604 6.58333 10.2917 6.625 10.125L6 9.7625L6.625 8.6875L7.25 9.0375C7.5 8.80417 7.79167 8.6375 8.125 8.5375V7.8125H9.375V8.5375C9.70833 8.6375 10 8.80417 10.25 9.0375L10.875 8.6875L11.5 9.7625L10.875 10.125C10.9167 10.2917 10.9375 10.4604 10.9375 10.6312C10.9375 10.8021 10.9167 10.9708 10.875 11.1375L11.5 11.5L10.875 12.575L10.25 12.225C10 12.4583 9.70833 12.625 9.375 12.725V13.4375H8.125V12.725C7.79167 12.625 7.5 12.4583 7.25 12.225L6.625 12.575L6 11.5L6.625 11.1375ZM8.75 11.5625C9.00833 11.5625 9.22917 11.4729 9.4125 11.2938C9.59583 11.1146 9.6875 10.8937 9.6875 10.6312C9.6875 10.3687 9.59583 10.1479 9.4125 9.96875C9.22917 9.78958 9.00833 9.69792 8.75 9.69375C8.49167 9.68958 8.27083 9.77917 8.0875 9.9625C7.90417 10.1458 7.8125 10.3687 7.8125 10.6312C7.8125 10.8937 7.90417 11.1167 8.0875 11.3C8.27083 11.4833 8.49167 11.575 8.75 11.575V11.5625Z"
                fill="#586D4D"
              />
            </svg>
          </div>
        </div>

        {/* Pending Invitations */}
        <div className="relative h-24 lg:h-28 w-full bg-white rounded-2xl border border-[#E8E6E1] p-4 lg:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="text-xs lg:text-sm text-slate-400">
            Pending invitations
          </div>

          <div className="text-2xl lg:text-3xl font-bold mt-1.5 lg:mt-2 text-slate-900">
            2
          </div>

          <div className="absolute top-4 right-4 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                fill="#FFECD1"
              />
              <path
                d="M22.2422 10.375C22.4172 10.375 22.5651 10.4354 22.6859 10.5562C22.8068 10.6771 22.8672 10.825 22.8672 11V21C22.8672 21.175 22.8068 21.3229 22.6859 21.4437C22.5651 21.5646 22.4172 21.625 22.2422 21.625H10.9922C10.8172 21.625 10.6693 21.5646 10.5484 21.4437C10.4276 21.3229 10.3672 21.175 10.3672 21V20.375H21.6172V13.0625L16.6172 17.5625L10.3672 11.9375V11C10.3672 10.825 10.4276 10.6771 10.5484 10.5562C10.6693 10.4354 10.8172 10.375 10.9922 10.375H22.2422ZM14.1172 17.875V19.125H9.11719V17.875H14.1172ZM12.2422 14.75V16H9.11719V14.75H12.2422ZM21.3422 11.625H11.8922L16.6172 15.875L21.3422 11.625Z"
                fill="#D97706"
              />
            </svg>
          </div>

          <div className="absolute bottom-4 right-4 text-sm text-[#8A5A04]">
            2 awaiting response
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 w-full">
        {/* Search input with Input component */}
        <div className="relative flex items-center w-full lg:flex-1 lg:max-w-[640px] h-9">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by school, name, or email..."
            className="pl-10 h-9 bg-white border-[#E8E6E1] rounded-lg text-sm w-full"
          />
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0 flex-wrap">
          <FilterDropdown
            label="Role"
            value={roleFilter}
            onChange={opt => { setRoleFilter(opt); setPage(1); }}
            options={[
              { value: "All", label: "All" },
              { value: "District administrator", label: "District administrator" },
              { value: "School administrator", label: "School administrator" }
            ]}
            className="min-w-30"
          />

          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={opt => { setStatusFilter(opt); setPage(1); }}
            options={[
              { value: "All", label: "All" },
              { value: "Active", label: "Active" },
              { value: "Pending", label: "Pending" },
              { value: "Deactivated", label: "Deactivated" }
            ]}
            className="min-w-30"
          />

          <FilterDropdown
            label="Type"
            value={typeFilter}
            onChange={opt => { setTypeFilter(opt); setPage(1); }}
            options={[
              { value: "All", label: "All" },
              { value: "District", label: "District" },
              { value: "Standalone", label: "Standalone" }
            ]}
            className="min-w-30"
          />

          <div className="relative">
            <button onClick={() => setOpenDropdown(openDropdown === 'export' ? null : 'export')} className="inline-flex items-center gap-2 rounded-full bg-[#EEF7EE] border border-[#D8EAD8] px-3 py-1 text-sm text-sage">
              <svg width="16" height="23" viewBox="0 0 16 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-5">
                <path d="M2.2875 5.5502L10.1375 4.4252C10.2292 4.41686 10.3083 4.4377 10.375 4.4877C10.4417 4.5377 10.4833 4.60436 10.5 4.6877V17.7627C10.5 17.8544 10.4688 17.9294 10.4062 17.9877C10.3438 18.046 10.2708 18.0752 10.1875 18.0752L2.2875 16.9502C2.12917 16.9252 2 16.8544 1.9 16.7377C1.8 16.621 1.75 16.4877 1.75 16.3377V6.1627C1.75 6.0127 1.8 5.87936 1.9 5.7627C2 5.64603 2.12917 5.5752 2.2875 5.5502ZM3 6.7127V15.7877L9.25 16.6877V5.8127L3 6.7127ZM11.125 15.6252H13V6.8752H11.125V5.6252H13.625C13.8 5.6252 13.9479 5.68561 14.0688 5.80645C14.1896 5.92728 14.25 6.0752 14.25 6.2502V16.2502C14.25 16.4252 14.1896 16.5731 14.0688 16.6939C13.9479 16.8148 13.8 16.8752 13.625 16.8752H11.125V15.6252ZM6.875 11.2502L8.625 13.7502H7.125L6.125 12.3252L5.125 13.7502H3.625L5.375 11.2502L3.625 8.7502H5.125L6.125 10.1752L7.125 8.7502H8.625L6.875 11.2502Z" fill="#586D4D"/>
              </svg>
              <span className="font-medium">Export</span>
              <span className="h-6 w-px bg-[#D8EAD8] mx-2" />
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M1 1L5 5L9 1" stroke="#586D4D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {openDropdown === 'export' && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_8px_24px_rgba(0,0,0,0.08)] py-2 overflow-hidden z-50">
                  <button className="w-full flex items-center gap-3 px-4 py-3 font-sans font-normal text-[14px] leading-5.25 text-ink hover:bg-slate-50">
                    <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-5.25">
                      <path d="M2.66238 5.18012L9.98643 4.13012C10.072 4.12234 10.1458 4.14178 10.208 4.18845C10.2702 4.23512 10.3091 4.29734 10.3246 4.37512V16.5785C10.3246 16.664 10.2955 16.734 10.2372 16.7885C10.1789 16.8429 10.1108 16.8701 10.0331 16.8701L2.66238 15.8201C2.51465 15.7968 2.39414 15.7307 2.30084 15.6218C2.20754 15.5129 2.16089 15.3885 2.16089 15.2485V5.75178C2.16089 5.61178 2.20754 5.48734 2.30084 5.37845C2.39414 5.26956 2.51465 5.20345 2.66238 5.18012ZM3.32714 6.26512V14.7351L9.15839 15.5751V5.42512L3.32714 6.26512ZM10.9078 14.5835H12.6571V6.41678H10.9078V5.25012H13.2403C13.4035 5.25012 13.5415 5.30651 13.6543 5.41928C13.767 5.53206 13.8234 5.67012 13.8234 5.83345V15.1668C13.8234 15.3301 13.767 15.4682 13.6543 15.581C13.5415 15.6937 13.4035 15.7501 13.2403 15.7501H10.9078V14.5835ZM6.94251 10.5001L8.57526 12.8335H7.17576L6.24276 11.5035L5.30976 12.8335H3.91026L5.54301 10.5001L3.91026 8.16678H5.30976L6.24276 9.49678L7.17576 8.16678H8.57526L6.94251 10.5001Z" fill="#586D4D"/>
                    </svg>
                    <span>Export to Excel</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 font-sans font-normal text-[14px] leading-5.25 text-ink hover:bg-slate-50">
                    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2.75 h-3">
                      <path d="M10.4963 3.50033V11.0837C10.4963 11.247 10.4399 11.385 10.3271 11.4978C10.2144 11.6106 10.0764 11.667 9.91313 11.667H0.583125C0.41985 11.667 0.281844 11.6106 0.169106 11.4978C0.0563687 11.385 0 11.247 0 11.0837V0.583659C0 0.420325 0.0563687 0.282269 0.169106 0.169492C0.281844 0.0567141 0.41985 0.000325203 0.583125 0.000325203H6.9975L10.4963 3.50033ZM9.33 4.08366H6.41437V1.16699H1.16625V10.5003H9.33V4.08366ZM2.91563 2.91699H4.665V4.08366H2.91563V2.91699ZM2.91563 5.25033H7.58063V6.41699H2.91563V5.25033ZM2.91563 7.58366H7.58063V8.75033H2.91563V7.58366Z" fill="#6D6D6D"/>
                    </svg>
                    <span>Export to CSV</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Users Table Container */}
      <div className="bg-white rounded-xl p-4 w-full overflow-x-auto">
        <div className="min-w-[700px]">
          <UsersTable users={shown} currentPage={page} totalPages={totalPages} totalCount={total} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
