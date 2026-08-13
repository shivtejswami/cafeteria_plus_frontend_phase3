"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { AdminUser } from "./UsersPage";
import { CreateDistrictModal } from "../customers/CreateDistrictModal";
import { CreateSchoolModal } from "../customers/CreateSchoolModal";
import { Pagination } from "@/components/ui/Pagination";
import { Input } from "@/components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import RowMenu from "@/components/ui/RowMenu";

interface UsersTableProps {
  users: AdminUser[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (p: number) => void;
}

export function UsersTable({ users, currentPage, totalPages, totalCount, onPageChange }: UsersTableProps) {
  const [resendInviteUser, setResendInviteUser] = useState<AdminUser | null>(null);
  const [replaceAdminUser, setReplaceAdminUser] = useState<AdminUser | null>(null);
  const [replaceFullName, setReplaceFullName] = useState("");
  const [replaceEmail, setReplaceEmail] = useState("");
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);

  const handleUpdateDetails = (u: AdminUser) => {
    if (u.role === "District administrator") {
      setIsDistrictModalOpen(true);
    } else {
      setIsSchoolModalOpen(true);
    }
  };

  return (
    <div>
      <div className="w-full">
        <Table className="w-full text-left border-collapse">
          <TableHeader>
            <TableRow className="border-b-2 border-divider h-[62px] rotate-0 opacity-100 pb-[2px]">
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider h-[62px] rotate-0 opacity-100 border-b-2 border-divider pb-[2px] pl-4 pr-6">Name</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider h-[62px] rotate-0 opacity-100 border-b-2 border-divider pb-[2px] px-6">Email</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider h-[62px] rotate-0 opacity-100 border-b-2 border-divider pb-[2px] px-6">Role</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider h-[62px] rotate-0 opacity-100 border-b-2 border-divider pb-[2px] px-6">Tenant</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider h-[62px] rotate-0 opacity-100 border-b-2 border-divider pb-[2px] px-6">Status</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider h-[62px] rotate-0 opacity-100 border-b-2 border-divider pb-[2px] px-6">Last active</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider h-[62px] rotate-0 opacity-100 border-b-2 border-divider pb-[2px] px-6"> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id} className="border-b border-divider hover:bg-slate-50/50">
                <TableCell className="h-[81.5px] pb-px pl-4 pr-6 font-secondary font-medium text-[15px] leading-[20.63px] tracking-[0px] text-slate-800 align-middle">{u.name}</TableCell>
                <TableCell className="h-[81.5px] pb-px px-6 font-secondary font-normal text-[13px] leading-[19.5px] text-slate-500 align-middle">{u.email}</TableCell>
                <TableCell className="h-[81.5px] pb-px px-6 align-middle"><div className="flex items-center">
                  {u.role === 'District administrator' ? (
                    <span
                      className="inline-flex items-center justify-center w-[124.25px] h-[20.5px] rounded-full pt-0.5 pr-2.5 pb-0.5 pl-2.5 text-[10px] font-semibold whitespace-nowrap bg-[#F0EAFB] text-[#4D1C9A]"
                    >
                      {u.role}
                    </span>
                  ) : u.role === 'School administrator' ? (
                    <span
                      className="inline-flex items-center justify-center w-[124.25px] h-[20.5px] rounded-full pt-0.5 pr-2.5 pb-0.5 pl-2.5 text-[10px] font-semibold whitespace-nowrap bg-[#F1EFEA] text-[#6D6D6D]"
                    >
                      {u.role}
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center justify-center w-[124.25px] h-[20.5px] rounded-full pt-0.5 pr-2.5 pb-0.5 pl-2.5 text-[10px] font-semibold whitespace-nowrap bg-[#F1EFEA] text-[#6D6D6D]"
                    >
                      {u.role}
                    </span>
                  )}
                </div></TableCell>
                <TableCell className="h-[81.5px] pb-px px-6 font-secondary font-medium text-[14px] leading-5.25 text-iris align-middle">{u.tenant}</TableCell>
                <TableCell className="h-[81.5px] pb-px px-6 align-middle">
                  {u.status === 'Active' ? (
                    <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[12px] font-semibold bg-[#E3F5E3] text-[#1D6B1D]">
                      Active
                    </span>
                  ) : u.status === 'Pending' ? (
                    <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[12px] font-semibold bg-[#FFECD1] text-[#8A5A04]">
                      Pending
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[12px] font-semibold bg-[#F1EFEA] text-[#9a9a9a]">
                      Deactivated
                    </span>
                  )}
                </TableCell>
                <TableCell className="h-[81.5px] pb-px px-6 text-[13px] text-slate-500 align-middle">{u.lastActive}</TableCell>
                <TableCell className="h-[81.5px] pb-px px-6 align-middle">
                  <div className="flex items-center gap-4 relative">
                    <button className="text-[13px] font-semibold text-iris hover:underline">View</button>
                    <RowMenu ariaLabel={`Open actions for ${u.name}`}>
                      {(close) => (
                        <>
                          <button
                            onClick={() => {
                              close();
                              handleUpdateDetails(u);
                            }}
                            className="flex w-full items-center px-4 py-3 text-left text-[14px] font-normal text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            Update details
                          </button>
                          {u.status === 'Active' && u.role === 'District administrator' && (
                            <button
                              onClick={() => {
                                close();
                                setReplaceAdminUser(u);
                              }}
                              className="flex w-full items-center px-4 py-3 text-left text-[14px] font-normal text-[#6D28D9] transition-colors hover:bg-slate-50"
                            >
                              Replace administrator
                            </button>
                          )}
                          {u.status === 'Pending' && (
                            <button
                              onClick={() => {
                                close();
                                setResendInviteUser(u);
                              }}
                              className="flex w-full items-center px-4 py-3 text-left text-[14px] font-normal text-[#8A5A04] transition-colors hover:bg-slate-50"
                            >
                              Resend invitation
                            </button>
                          )}
                        </>
                      )}
                    </RowMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalCount}
        itemsPerPage={users.length}
        itemName="administrators"
        onPageChange={onPageChange}
      />

      {resendInviteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-120 max-w-120 h-69 bg-white rounded-2xl p-8 shadow-[0_12px_40px_rgba(0,0,0,0.12)] rotate-0 opacity-100 flex flex-col justify-between items-center text-center">
            <button
              onClick={() => setResendInviteUser(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center w-full">
              <div className="mb-3">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28Z" fill="#FFECD1"/>
                  <path d="M37.5999 19C37.8687 19 38.0959 19.0967 38.2815 19.29C38.4671 19.4833 38.5599 19.72 38.5599 20V36C38.5599 36.28 38.4671 36.5167 38.2815 36.71C38.0959 36.9033 37.8687 37 37.5999 37H20.3199C20.0511 37 19.8239 36.9033 19.6383 36.71C19.4527 36.5167 19.3599 36.28 19.3599 36V35H36.6399V23.3L28.9599 30.5L19.3599 21.5V20C19.3599 19.72 19.4527 19.4833 19.6383 19.29C19.8239 19.0967 20.0511 19 20.3199 19H37.5999ZM25.1199 31V33H17.4399V31H25.1199ZM22.2399 26V28H17.4399V26H22.2399ZM36.2175 21H21.7023L28.9599 27.8L36.2175 21Z" fill="#D97706"/>
                </svg>
              </div>

              <h3 className="font-sans font-semibold text-[20px] leading-7.5 tracking-normal text-center text-slate-900 mb-1">
                Resend Invite
              </h3>

              <p className="font-secondary font-normal text-[14px] leading-5.25 tracking-normal text-center text-slate-500 max-w-100">
                This will resend invite to &quot;{resendInviteUser.tenant}&quot; school admin -<br />
                <span className="font-semibold text-slate-700">{resendInviteUser.name}</span>
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 w-full">
              <button
                onClick={() => setResendInviteUser(null)}
                className="w-[84.921875px] h-10 pt-px pr-5.25 pb-px pl-5.25 rounded-full border border-[#D8EAD8] bg-[#EEF7EE] text-sage text-[14px] font-medium hover:bg-[#e2f0e2] transition-colors flex items-center justify-center rotate-0 opacity-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setResendInviteUser(null);
                }}
                className="w-[161.265625px] h-10 pr-6 pl-6 rounded-full bg-[#F58200] text-white text-[14px] font-medium hover:bg-[#e07600] transition-colors flex items-center justify-center rotate-0 opacity-100 shadow-sm"
              >
                Resend Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {replaceAdminUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-120 max-w-full bg-white rounded-3xl p-8 shadow-[0_16px_48px_rgba(0,0,0,0.14)] rotate-0 opacity-100 flex flex-col items-center">
            <button
              onClick={() => {
                setReplaceAdminUser(null);
                setReplaceFullName("");
                setReplaceEmail("");
              }}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-full bg-[#F0EAFB] flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 17H17M17 17L13 13M17 17L13 21M20 7H7M7 7L11 3M7 7L11 11" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h3 className="font-sans font-bold text-[22px] leading-7.5 text-slate-900 text-center mb-1">
              Replace district administrator
            </h3>

            <p className="font-secondary text-[14px] text-slate-500 text-center mb-4">
              Current: {replaceAdminUser.name} at {replaceAdminUser.tenant}
            </p>

            <div className="w-full bg-[#FFF9EE] border border-[#FDE68A] rounded-xl p-4 mb-6 text-left">
              <p className="text-[13px] leading-[19.5px] text-[#8A5A04] font-medium">
                This replaces {replaceAdminUser.name} with a new district administrator. {replaceAdminUser.name} will be deactivated once the new administrator accepts their invitation.
              </p>
            </div>

            <div className="w-full text-left space-y-4 mb-6">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Full name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={replaceFullName}
                  onChange={e => setReplaceFullName(e.target.value)}
                  placeholder="e.g. Dana Piper"
                  className="w-full bg-[#F9F9F8] border-[#E8E6E1] rounded-xl px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-400 focus:border-iris focus:bg-white transition-all h-auto"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={replaceEmail}
                  onChange={e => setReplaceEmail(e.target.value)}
                  placeholder="d.piper@school.edu"
                  className="w-full bg-[#F9F9F8] border-[#E8E6E1] rounded-xl px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-400 focus:border-iris focus:bg-white transition-all h-auto"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 w-full">
              <button
                onClick={() => {
                  setReplaceAdminUser(null);
                  setReplaceFullName("");
                  setReplaceEmail("");
                }}
                className="px-6 py-2.5 rounded-full bg-[#EEF7EE] border border-[#D8EAD8] text-sage text-[14px] font-medium hover:bg-[#e2f0e2] transition-colors flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                disabled={!replaceFullName.trim() || !replaceEmail.trim()}
                onClick={() => {
                  setReplaceAdminUser(null);
                  setReplaceFullName("");
                  setReplaceEmail("");
                }}
                className={`px-6 py-2.5 rounded-full text-[14px] font-medium transition-colors flex items-center justify-center ${
                  !replaceFullName.trim() || !replaceEmail.trim()
                    ? "bg-[#BAC5B9] text-white cursor-not-allowed"
                    : "bg-[#526B4E] hover:bg-[#465C42] text-white shadow-sm"
                }`}
              >
                Replace administrator
              </button>
            </div>
          </div>
        </div>
      )}

      {isDistrictModalOpen && (
        <CreateDistrictModal
          isOpen={isDistrictModalOpen}
          onClose={() => setIsDistrictModalOpen(false)}
        />
      )}

      {isSchoolModalOpen && (
        <CreateSchoolModal
          isOpen={isSchoolModalOpen}
          onClose={() => setIsSchoolModalOpen(false)}
        />
      )}
    </div>
  );
}
