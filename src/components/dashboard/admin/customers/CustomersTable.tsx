"use client";

import React, { useState } from "react";
import { MoreVertical, ChevronLeft, ChevronRight, X, RotateCw, AlertCircle } from "lucide-react";
import { Customer } from "./CustomersPage";

interface CustomersTableProps {
  customers: Customer[];
  currentPage: number;
  totalPages: number;
  startRange: number;
  endRange: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onViewCustomer: (customer: Customer) => void;
}

const TYPE_BADGE_CLASSES: Record<Customer["type"], string> = {
  District: "bg-[#F3E8FF] text-[#6B21A8]",
  Standalone: "bg-slate-100 text-slate-700"
};

const SUBSCRIPTION_BADGE_CLASSES: Record<Customer["subscriptionStatus"], string> = {
  Active: "bg-[#D1FAE5] text-[#065F46]",
  Expiring: "bg-[#FEF3C7] text-[#92400E]",
  "Grace period": "bg-[#FFEDD5] text-[#C2410C]",
  Deactivated: "bg-[#FEE2E2] text-[#991B1B]",
  "Read-only": "bg-slate-100 text-slate-700"
};

export function CustomersTable({
  customers,
  currentPage,
  totalPages,
  startRange,
  endRange,
  totalCount,
  onPageChange,
  onViewCustomer
}: CustomersTableProps) {
  // Dropdown State
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

  // Modal State
  const [activeModal, setActiveModal] = useState<{
    type: "restore" | "activate" | "deactivate" | "suspend";
    customer: Customer;
  } | null>(null);
  const [reason, setReason] = useState("");

  return (
    <div className="bg-white rounded-xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#EFEDE8]">
              <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3.5 px-6 font-sans">Customer</th>
              <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3.5 px-6 font-sans">Type</th>
              <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3.5 px-6 font-sans">Schools</th>
              <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3.5 px-6 font-sans">Subscription</th>
              <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3.5 px-6 font-sans">Active surveys</th>
              <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3.5 px-6 font-sans">Last activity</th>
              <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3.5 px-6 font-sans">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-[#EFEDE8] last:border-b-0 hover:bg-slate-50/50">
                
                {/* Customer Info */}
                <td className="py-4.5 px-6 font-sans leading-tight">
                  <span className="text-[14px] font-bold text-slate-800 block">
                    {customer.name}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                    {customer.subtitle}
                  </span>
                </td>

                {/* Type */}
                <td className="py-4.5 px-6">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide inline-block ${TYPE_BADGE_CLASSES[customer.type]}`}>
                    {customer.type}
                  </span>
                </td>

                {/* Schools */}
                <td className="py-4.5 px-6 text-[13px] font-bold text-slate-800 font-sans">
                  {customer.schoolsCovered !== null ? customer.schoolsCovered : "—"}
                </td>

                {/* Subscription */}
                <td className="py-4.5 px-6 font-sans">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide inline-block ${SUBSCRIPTION_BADGE_CLASSES[customer.subscriptionStatus]}`}>
                    {customer.subscriptionStatus}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
                    {customer.subscriptionDetail}
                  </span>
                </td>

                {/* Active surveys */}
                <td className="py-4.5 px-6 text-[13px] font-bold text-slate-800 font-sans">
                  {customer.activeSurveys !== null ? customer.activeSurveys : "—"}
                </td>

                {/* Last activity */}
                <td className="py-4.5 px-6 text-[13px] text-slate-500 font-sans">
                  {customer.lastActivity}
                </td>

                {/* Actions */}
                <td className="py-4.5 px-6">
                  <div className="flex items-center gap-4 relative">
                    <button
                      onClick={() => {
                        if (customer.type === "Standalone" && customer.subscriptionStatus === "Deactivated") {
                          onViewCustomer(customer);
                        }
                      }}
                      className="text-[13px] font-semibold text-[#6D28D9] hover:underline cursor-pointer font-sans focus:outline-none"
                    >
                      View
                    </button>
                    
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdownId(activeDropdownId === customer.id ? null : customer.id)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded hover:bg-slate-100 focus:outline-none flex items-center justify-center"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {activeDropdownId === customer.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40 cursor-default"
                            onClick={() => setActiveDropdownId(null)}
                          />
                          <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_4px_16px_rgba(0,0,0,0.08)] py-2 z-50 origin-top-right">
                            <button
                              onClick={() => setActiveDropdownId(null)}
                              className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none"
                            >
                              Manage users
                            </button>
                            <hr className="border-[#EFEDE8] my-1" />
                            {customer.subscriptionStatus === "Deactivated" ? (
                              <>
                                <button
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    setActiveModal({ type: "restore", customer });
                                    setReason("");
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[#854D0E] hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none"
                                >
                                  Restore access
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    setActiveModal({ type: "activate", customer });
                                    setReason("");
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[#16A34A] hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none"
                                >
                                  Activate
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    setActiveModal({ type: "suspend", customer });
                                    setReason("");
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[#854D0E] hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none"
                                >
                                  Suspend access
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    setActiveModal({ type: "deactivate", customer });
                                    setReason("");
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[#B91C1C] hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none"
                                >
                                  Deactivate
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>

              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400 text-[13px] font-sans">
                  No customers found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#EFEDE8] bg-slate-50/10">
        <span className="text-[13px] text-slate-400 font-semibold font-sans">
          Showing {startRange}–{endRange} of {totalCount}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg border border-[#E8E6E1] flex items-center justify-center transition-colors focus:outline-none ${
              currentPage === 1
                ? "text-slate-300 bg-slate-50/50 cursor-not-allowed"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = currentPage === pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors focus:outline-none cursor-pointer ${
                  isCurrent
                    ? "bg-[#6D28D9] text-white shadow-sm"
                    : "border border-[#E8E6E1] text-slate-500 hover:bg-slate-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg border border-[#E8E6E1] flex items-center justify-center transition-colors focus:outline-none ${
              currentPage === totalPages
                ? "text-slate-300 bg-slate-50/50 cursor-not-allowed"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Modals Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          {/* Modal box */}
          <div className="relative bg-white w-full max-w-[440px] rounded-[24px] border border-[#E8E6E1] shadow-2xl p-6 flex flex-col items-center">
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute right-4.5 top-4.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Modal Icon Header */}
            {activeModal.type === "restore" && (
              <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-4">
                <svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.95075 12.1798C7.9926 11.2776 9.15885 10.5776 10.4495 10.0798C11.7713 9.58206 13.1474 9.33317 14.578 9.33317C16.1641 9.33317 17.6803 9.6365 19.1264 10.2432C20.5104 10.8343 21.7427 11.6704 22.8234 12.7515C23.9041 13.8326 24.74 15.0654 25.3309 16.4498C25.9373 17.8965 26.2405 19.4132 26.2405 20.9998C26.2405 22.2287 26.0539 23.4187 25.6807 24.5698C25.3231 25.6898 24.8022 26.7321 24.118 27.6965L20.4093 20.9998H23.908C23.908 19.3043 23.4804 17.7332 22.6252 16.2865C21.801 14.8865 20.6892 13.7743 19.2897 12.9498C17.8435 12.0943 16.273 11.6665 14.578 11.6665C13.3496 11.6665 12.1678 11.8998 11.0326 12.3665C9.94413 12.8176 8.97225 13.4476 8.117 14.2565L6.95075 12.1798ZM22.2053 29.8198C21.1635 30.7221 19.9972 31.4221 18.7066 31.9198C17.3848 32.4176 16.0086 32.6665 14.578 32.6665C12.9919 32.6665 11.4758 32.3632 10.0297 31.7565C8.6457 31.1654 7.41336 30.3293 6.33264 29.2482C5.25191 28.1671 4.4161 26.9343 3.8252 25.5498C3.21875 24.1032 2.91553 22.5865 2.91553 20.9998C2.91553 19.7709 3.10213 18.5809 3.47533 17.4298C3.83298 16.3098 4.3539 15.2676 5.0381 14.3032L8.74678 20.9998H5.24803C5.24803 22.6954 5.67565 24.2665 6.5309 25.7132C7.35505 27.1132 8.46688 28.2254 9.86638 29.0498C11.3125 29.9054 12.8831 30.3332 14.578 30.3332C15.8065 30.3332 16.9883 30.0998 18.1234 29.6332C19.2119 29.1821 20.1838 28.5521 21.0391 27.7432L22.2053 29.8198Z" fill="#1D6B1D"/>
                </svg>
              </div>
            )}
            {activeModal.type === "activate" && (
              <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-[#2E7D32]" />
              </div>
            )}
            {activeModal.type === "deactivate" && (
              <div className="w-12 h-12 rounded-full bg-[#FFEBEE] flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-[#C62828]" />
              </div>
            )}
            {activeModal.type === "suspend" && (
              <div className="w-12 h-12 rounded-full bg-[#FFF3E0] flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-[#D84315]" />
              </div>
            )}

            {/* Modal Title */}
            <h3 className="text-center text-[20px] font-semibold text-[#2B2B2B] mb-2 font-sans">
              {activeModal.type === "restore" && "Restore access?"}
              {activeModal.type === "activate" && "Activate account?"}
              {activeModal.type === "deactivate" && "Deactivate account?"}
              {activeModal.type === "suspend" && "Suspend access?"}
            </h3>

            {/* Modal Description */}
            <p className="text-center text-[14px] text-[#6D6D6D] leading-relaxed mb-5 px-1 font-secondary font-normal">
              {activeModal.type === "restore" &&
                `This will fully restore access for ${activeModal.customer.name}. All services will resume immediately.`}
              {activeModal.type === "activate" &&
                `This will activate ${activeModal.customer.name}. All data & access will be restored.`}
              {activeModal.type === "deactivate" &&
                `This will permanently deactivate ${activeModal.customer.name}. All access will be revoked and data will be archived.`}
              {activeModal.type === "suspend" &&
                `This will temporarily suspend access for ${activeModal.customer.name}. They will not be able to log in or run surveys.`}
            </p>

            {/* Reason Textarea (Only for activate, deactivate, suspend) */}
            {activeModal.type !== "restore" && (
              <div className="w-full text-left font-sans">
                <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason..."
                  className="w-full h-24 bg-[#FAF9F5] border border-[#E8E6E1] rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none mb-5 font-secondary font-medium"
                />
              </div>
            )}

            {/* Actions Buttons Footer */}
            <div className="flex items-center justify-end gap-3 w-full font-sans">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-full border border-[#D6E0D2] bg-[#F2F5F0] text-[#586D4D] hover:bg-[#E5EAE2] font-secondary font-medium text-[13px] transition-colors cursor-pointer focus:outline-none"
              >
                Cancel
              </button>

              {activeModal.type === "restore" && (
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 rounded-full bg-[#526B4E] hover:bg-[#465C42] text-white font-semibold text-[13px] transition-colors cursor-pointer focus:outline-none"
                >
                  Restore access
                </button>
              )}
              {activeModal.type === "activate" && (
                <button
                  onClick={() => setActiveModal(null)}
                  disabled={!reason.trim()}
                  className={`px-6 py-2.5 rounded-full text-white font-semibold text-[13px] transition-colors focus:outline-none ${
                    reason.trim()
                      ? "bg-[#15803D] hover:bg-[#166534] cursor-pointer"
                      : "bg-[#15803D]/60 cursor-not-allowed"
                  }`}
                >
                  Activate
                </button>
              )}
              {activeModal.type === "deactivate" && (
                <button
                  onClick={() => setActiveModal(null)}
                  disabled={!reason.trim()}
                  className={`px-6 py-2.5 rounded-full text-white font-semibold text-[13px] transition-colors focus:outline-none ${
                    reason.trim()
                      ? "bg-[#B91C1C] hover:bg-[#991B1B] cursor-pointer"
                      : "bg-[#B91C1C]/60 cursor-not-allowed"
                  }`}
                >
                  Deactivate
                </button>
              )}
              {activeModal.type === "suspend" && (
                <button
                  onClick={() => setActiveModal(null)}
                  disabled={!reason.trim()}
                  className={`px-6 py-2.5 rounded-full text-white font-semibold text-[13px] transition-colors focus:outline-none ${
                    reason.trim()
                      ? "bg-[#D97706] hover:bg-[#B45309] cursor-pointer"
                      : "bg-[#D97706]/60 cursor-not-allowed"
                  }`}
                >
                  Suspend access
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
