"use client";

import React, { useState, useRef, useEffect } from "react";
import { Building2, ChevronDown, Check, Receipt, Calendar, AlertCircle, Info } from "lucide-react";

interface CreateDistrictModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingNames?: string[];
}

export function CreateDistrictModal({ isOpen, onClose, existingNames }: CreateDistrictModalProps) {
  const [step, setStep] = useState(1);

  // Button style variables
  const btnSecondaryClass = "px-6 py-2.5 rounded-full border border-[#D6E0D2] bg-[#F2F5F0] text-[#586D4D] hover:bg-[#E5EAE2] font-secondary font-medium text-[13px] transition-colors cursor-pointer focus:outline-none";
  const btnPrimaryClass = "px-6 py-2.5 rounded-full bg-[#526B4E] hover:bg-[#465C42] text-white font-semibold text-[13px] transition-colors cursor-pointer focus:outline-none";

  // Step 1: District Details State
  const [districtName, setDistrictName] = useState("");
  const [shortName, setShortName] = useState("");
  const [districtType, setDistrictType] = useState("");
  const [region, setRegion] = useState("");
  const [isDistrictTypeOpen, setIsDistrictTypeOpen] = useState(false);
  const districtTypeRef = useRef<HTMLDivElement>(null);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (districtTypeRef.current && !districtTypeRef.current.contains(event.target as Node)) {
        setIsDistrictTypeOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showError = districtName.trim().toLowerCase() === "riverside unified school district" || (
    !!existingNames && existingNames.some(name => name.toLowerCase() === districtName.trim().toLowerCase())
  );

  // Step 2: District Subscription State
  const [status, setStatus] = useState("Active");
  const [endExpiryDate, setEndExpiryDate] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [billingContactName, setBillingContactName] = useState("");
  const [billingContactEmail, setBillingContactEmail] = useState("");
  const [invoiceRefNumber, setInvoiceRefNumber] = useState("");
  const [internalNotes, setInternalNotes] = useState("SFWG-only operational notes about this subscription...");

  // Step 3: Administrator State (Placeholder)
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  // Validation submit tracking states
  const [submittedStep1, setSubmittedStep1] = useState(false);
  const [submittedStep2, setSubmittedStep2] = useState(false);
  const [submittedStep3, setSubmittedStep3] = useState(false);

  const nameError = (submittedStep1 && !districtName.trim())
    ? "District name is required"
    : showError
      ? "This name is already occupied"
      : null;

  const expiryDateError = (submittedStep2 && !endExpiryDate.trim())
    ? "End / expiry date is required"
    : null;

  const adminNameError = (submittedStep3 && !adminName.trim())
    ? "Administrator name is required"
    : null;
  const adminEmailError = (submittedStep3 && !adminEmail.trim())
    ? "Administrator email is required"
    : null;

  if (!isOpen) return null;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedStep1(true);
    if (districtName.trim() && !showError) {
      setStep(2);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedStep2(true);
    if (endExpiryDate.trim()) {
      setStep(3);
    }
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedStep3(true);
    if (adminName.trim() && adminEmail.trim()) {
      setStep(4);
    }
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      districtName,
      shortName,
      districtType,
      region,
      status,
      endExpiryDate,
      renewalDate,
      billingContactName,
      billingContactEmail,
      invoiceRefNumber,
      internalNotes,
      adminName,
      adminEmail
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      {/* Backdrop click to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-white w-full max-w-[660px] rounded-[24px] border border-[#E8E6E1] shadow-2xl p-5 sm:p-8 flex flex-col z-10 font-sans max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain custom-scrollbar">

        {/* Top Tag pill (Visible on Step 4) */}
        {step === 4 && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F4F3EF] rounded-full w-fit mb-4">
            <Building2 className="w-3.5 h-3.5 text-[#586D4D]" />
            <span className="text-[12px] font-medium text-[#586D4D]">District</span>
          </div>
        )}

        {/* Stepper Header */}
        <div className="flex items-center justify-center flex-wrap gap-x-1.5 gap-y-2 sm:gap-x-3 w-full mb-6 sm:mb-8 select-none shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            {step > 1 ? (
              <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#526B4E] text-white font-bold text-[11px] sm:text-[13px]">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </span>
            ) : (
              <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#6D28D9] text-white font-bold text-[11px] sm:text-[13px]">
                1
              </span>
            )}
            <span className={`font-semibold text-[11px] sm:text-[13px] ${step === 4 ? "text-[#526B4E]" : step > 1 ? "text-slate-500" : "text-[#2B2B2B]"}`}>
              District details
            </span>
          </div>

          <div className={`w-6 sm:w-14 h-[1px] ${step > 1 ? "bg-[#526B4E]" : "bg-[#EFEDE8]"}`} />

          <div className="flex items-center gap-1 sm:gap-2">
            {step > 2 ? (
              <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#526B4E] text-white font-bold text-[11px] sm:text-[13px]">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </span>
            ) : step === 2 ? (
              <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#6D28D9] text-white font-bold text-[11px] sm:text-[13px]">
                2
              </span>
            ) : (
              <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FAF9F5] border border-[#E8E6E1] text-[#B0B0B0] font-bold text-[11px] sm:text-[13px]">
                2
              </span>
            )}
            <span className={`font-semibold text-[11px] sm:text-[13px] ${step === 4 ? "text-[#526B4E]" : step === 2 ? "text-[#2B2B2B]" : "text-[#B0B0B0]"}`}>
              Subscription
            </span>
          </div>

          <div className={`w-6 sm:w-14 h-[1px] ${step > 2 ? "bg-[#526B4E]" : "bg-[#EFEDE8]"}`} />

          <div className="flex items-center gap-1 sm:gap-2">
            {step > 3 ? (
              <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#526B4E] text-white font-bold text-[11px] sm:text-[13px]">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </span>
            ) : step === 3 ? (
              <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#6D28D9] text-white font-bold text-[11px] sm:text-[13px]">
                3
              </span>
            ) : (
              <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FAF9F5] border border-[#E8E6E1] text-[#B0B0B0] font-bold text-[11px] sm:text-[13px]">
                3
              </span>
            )}
            <span className={`font-semibold text-[11px] sm:text-[13px] ${step === 4 ? "text-[#526B4E]" : step === 3 ? "text-[#2B2B2B]" : "text-[#B0B0B0]"}`}>
              Administrator
            </span>
          </div>
        </div>

        {/* STEP 1: District Details */}
        {step === 1 && (
          <>
            {/* Modal Info Header */}
            <div className="flex items-start gap-4 mb-6 shrink-0">
              <div className="w-11 h-11 rounded-[12px] bg-[#F0EAFB] flex items-center justify-center shrink-0">
                <svg width="17" height="24" viewBox="0 0 17 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.33152 17.2668V8.4001C2.33152 8.25788 2.3715 8.12899 2.45145 8.01343C2.5314 7.89787 2.638 7.81787 2.77125 7.77343L9.20722 5.42676C9.29606 5.39121 9.38267 5.39343 9.46706 5.43343C9.55145 5.47343 9.60697 5.53788 9.63362 5.62676C9.65139 5.66232 9.66027 5.69788 9.66027 5.73343V9.0401L13.871 10.4401C14.0042 10.4845 14.113 10.5668 14.1974 10.6868C14.2818 10.8068 14.324 10.9379 14.324 11.0801V17.2668H15.6565V18.6001H0.999023V17.2668H2.33152ZM3.66402 17.2668H8.32777V7.1601L3.66402 8.86676V17.2668ZM12.9915 17.2668V11.5601L9.66027 10.4401V17.2668H12.9915Z" fill="#6D28D9" />
                </svg>
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-[#2B2B2B] leading-tight mb-1">
                  District details
                </h2>
                <p className="text-[13px] text-[#9A9A9A]">
                  Set up a new district account on the platform.
                </p>
              </div>
            </div>

            {/* Form */}
            <form noValidate onSubmit={handleStep1Submit} className="space-y-5">
              {/* District Name */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#2B2B2B]">
                  District name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Riverside Unified School District"
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  className={`w-full bg-[#FAF9F5] border rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#B0B0B0] focus:outline-none focus:ring-1 font-sans ${nameError
                      ? "form-input-error focus:ring-[#EF4444]"
                      : "border-[#E8E6E1] focus:ring-slate-400"
                    }`}
                />
                {nameError && (
                  <p className="form-error-text">
                    {nameError}
                  </p>
                )}
              </div>

              {/* Short Name / Code */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#2B2B2B]">
                  Short name / code
                </label>
                <input
                  type="text"
                  placeholder="e.g. RUSD"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E8E6E1] rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans"
                />
                <p className="text-[11px] text-[#9A9A9A] font-medium leading-none pl-0.5">
                  An internal reference used in lists and search.
                </p>
              </div>

              {/* District Type & Region */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5" ref={districtTypeRef}>
                  <label className="block text-[13px] font-bold text-[#2B2B2B]">
                    District type / setting
                  </label>
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setIsDistrictTypeOpen(!isDistrictTypeOpen)}
                      className="w-full bg-[#FAF9F5] border border-[#E8E6E1] rounded-2xl px-4 py-3 text-[13px] text-left text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans flex items-center justify-between cursor-pointer"
                    >
                      <span className={districtType ? "text-[#2B2B2B]" : "text-[#B0B0B0]"}>
                        {districtType || "Select type..."}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${isDistrictTypeOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isDistrictTypeOpen && (
                      <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white border border-[#E8E6E1] rounded-[16px] shadow-[0_8px_25px_rgba(0,0,0,0.1)] py-2 z-50 overflow-hidden font-sans">
                        {["Urban", "Suburban", "Rural", "Mixed"].map((option) => (
                          <div
                            key={option}
                            onClick={() => {
                              setDistrictType(option);
                              setIsDistrictTypeOpen(false);
                            }}
                            className={`px-4 py-2.5 text-[13px] cursor-pointer transition-colors ${
                              districtType === option
                                ? "bg-[#FAF9F5] font-semibold text-[#2B2B2B]"
                                : "text-[#2B2B2B] hover:bg-[#FAF9F5]"
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9A9A9A] font-medium leading-normal pl-0.5">
                    Used later to define comparable groups; can be changed.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#2B2B2B]">
                    Region / state
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. California"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#E8E6E1] rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#E8E6E1] mt-8 mb-6" />

              {/* Action Buttons */}
              <div className="flex items-center justify-between w-full pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className={btnSecondaryClass}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={nameError === "This name is already occupied"}
                  className={`px-6 py-2.5 rounded-full text-white font-semibold text-[13px] transition-colors focus:outline-none ${nameError === "This name is already occupied"
                      ? "bg-[#526B4E]/60 cursor-not-allowed"
                      : "bg-[#526B4E] hover:bg-[#465C42] cursor-pointer"
                    }`}
                >
                  Continue
                </button>
              </div>
            </form>
          </>
        )}

        {/* STEP 2: District Subscription */}
        {step === 2 && (
          <>
            {/* Modal Info Header */}
            <div className="flex items-start gap-4 mb-6 shrink-0">
              <div className="w-11 h-11 rounded-[12px] bg-[#F0EAFB] flex items-center justify-center shrink-0">
                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.9923 14.6665H3.66477C3.30055 14.6665 2.9652 14.5776 2.65873 14.3998C2.35225 14.2221 2.11018 13.9798 1.93252 13.6732C1.75485 13.3665 1.66602 13.0309 1.66602 12.6665V1.99984C1.66602 1.81317 1.73042 1.65539 1.85923 1.5265C1.98804 1.39762 2.14572 1.33317 2.33227 1.33317H11.6598C11.8463 1.33317 12.004 1.39762 12.1328 1.5265C12.2616 1.65539 12.326 1.81317 12.326 1.99984V9.99984H14.991V12.6665C14.991 13.0309 14.9022 13.3665 14.7245 13.6732C14.5468 13.9798 14.3048 14.2221 13.9983 14.3998C13.6918 14.5776 13.3565 14.6665 12.9923 14.6665ZM12.326 11.3332V12.6665C12.326 12.8532 12.3904 13.0109 12.5192 13.1398C12.648 13.2687 12.8057 13.3332 12.9923 13.3332C13.1788 13.3332 13.3365 13.2687 13.4653 13.1398C13.5941 13.0109 13.6585 12.8532 13.6585 12.6665V11.3332H12.326ZM10.9935 13.3332V2.6665H2.99852V12.6665C2.99852 12.8532 3.06292 13.0109 3.19173 13.1398C3.32054 13.2687 3.47822 13.3332 3.66477 13.3332H10.9935ZM4.33102 4.6665H9.66102V5.99984H4.33102V4.6665ZM4.33102 7.33317H9.66102V8.6665H4.33102V7.33317ZM4.33102 9.99984H7.66227V11.3332H4.33102V9.99984Z" fill="#6D28D9" />
                </svg>
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-[#2B2B2B] leading-tight mb-1">
                  District subscription
                </h2>
                <p className="text-[13px] text-[#9A9A9A]">
                  Track this district's subscription record. No payments are processed here.
                </p>
              </div>
            </div>

            {/* Form */}
            <form noValidate onSubmit={handleStep2Submit} className="space-y-5">

              {/* Status & Expiry Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status */}
                <div className="space-y-1.5" ref={statusRef}>
                  <label className="block text-[13px] font-bold text-[#2B2B2B]">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setIsStatusOpen(!isStatusOpen)}
                      className="w-full bg-[#FAF9F5] border border-[#E8E6E1] rounded-2xl px-4 py-3 text-[13px] text-left text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans font-medium flex items-center justify-between cursor-pointer"
                    >
                      <span>{status || "Active"}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${isStatusOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isStatusOpen && (
                      <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white border border-[#E8E6E1] rounded-[16px] shadow-[0_8px_25px_rgba(0,0,0,0.1)] py-2 z-50 overflow-hidden font-sans">
                        {["Active", "Grace", "Read-only", "Deactivated"].map((option) => (
                          <div
                            key={option}
                            onClick={() => {
                              setStatus(option);
                              setIsStatusOpen(false);
                            }}
                            className={`px-4 py-2.5 text-[13px] cursor-pointer transition-colors ${
                              status === option
                                ? "bg-[#FAF9F5] font-semibold text-[#2B2B2B]"
                                : "text-[#2B2B2B] hover:bg-[#FAF9F5]"
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9A9A9A] font-medium leading-normal pl-0.5">
                    Subscription state governs the district's access.
                  </p>
                </div>

                {/* Expiry Date */}
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#2B2B2B]">
                    End / expiry date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="-/-/-"
                      value={endExpiryDate}
                      onChange={(e) => setEndExpiryDate(e.target.value)}
                      className={`w-full bg-[#FAF9F5] border rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#B0B0B0] focus:outline-none focus:ring-1 pr-10 font-sans ${expiryDateError
                          ? "form-input-error focus:ring-[#EF4444]"
                          : "border-[#E8E6E1] focus:ring-slate-400"
                        }`}
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {expiryDateError && (
                    <p className="form-error-text">
                      {expiryDateError}
                    </p>
                  )}
                  <p className="text-[11px] text-[#9A9A9A] font-medium leading-normal pl-0.5 mt-1">
                    When the district subscription expires. Drives grace, read-only, and deactivation for the district and all its schools.
                  </p>
                </div>
              </div>

              {/* Renewal Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#2B2B2B]">
                    Renewal date
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="-/-/-"
                      value={renewalDate}
                      onChange={(e) => setRenewalDate(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#E8E6E1] rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-slate-400 pr-10 font-sans"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-[#9A9A9A] font-medium leading-normal pl-0.5">
                    Optional. May default relative to the end date.
                  </p>
                </div>
                <div />
              </div>

              {/* Billing Contact Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#2B2B2B]">
                    Billing contact name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maria Rodriguez"
                    value={billingContactName}
                    onChange={(e) => setBillingContactName(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#E8E6E1] rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#2B2B2B]">
                    Billing contact email
                  </label>
                  <input
                    type="email"
                    placeholder="billing@district.org"
                    value={billingContactEmail}
                    onChange={(e) => setBillingContactEmail(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#E8E6E1] rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans"
                  />
                </div>
              </div>

              {/* Invoice / Reference Number */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#2B2B2B]">
                  Invoice / customer reference number
                </label>
                <input
                  type="text"
                  placeholder="e.g. INV-DIST-2026-001"
                  value={invoiceRefNumber}
                  onChange={(e) => setInvoiceRefNumber(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E8E6E1] rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans"
                />
                <p className="text-[11px] text-[#9A9A9A] font-medium leading-none pl-0.5">
                  Optional. For cross-referencing with external invoicing.
                </p>
              </div>

              {/* Internal Notes */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#2B2B2B]">
                  Internal account notes
                </label>
                <div className="flex items-center gap-1.5 text-[#D97706] text-[11px] font-semibold pl-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Internal &mdash; not visible to the customer.</span>
                </div>
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="w-full h-24 bg-[#FAF9F5] border border-[#E8E6E1] rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none font-sans font-medium"
                />
              </div>

              {/* Info Box 1 (Sage/Stone) */}
              <div className="bg-[#FAF9F5] border border-[#EFEDE8] rounded-[16px] p-4 flex gap-3 text-[12px] text-[#6D6D6D] leading-relaxed">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  This subscription covers the district and the schools under it. The platform tracks subscriptions &mdash; it does not process payments. Invoicing and proration happen outside the platform. Schools added later are covered by this agreement; any mid-term billing is handled off-platform.
                </p>
              </div>

              {/* Info Box 2 (Lavender) */}
              <div className="bg-[#FAF5FF] border border-[#E8DCF5] rounded-[16px] p-4 flex gap-3 text-[12px] text-[#6D28D9] leading-relaxed">
                <Info className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5" />
                <p>
                  A district is created empty. You&apos;ll add schools afterward from the district record &mdash; they inherit this subscription agreement automatically.
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#E8E6E1] mt-8 mb-6" />

              {/* Action Buttons */}
              <div className="flex items-center justify-between w-full pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className={btnSecondaryClass}
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={btnSecondaryClass}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={btnPrimaryClass}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        {/* STEP 3: Administrator details */}
        {step === 3 && (
          <>
            {/* Modal Info Header */}
            <div className="flex items-start gap-4 mb-6 shrink-0">
              <div className="w-11 h-11 rounded-[12px] bg-[#F0EAFB] flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15V13.5C12 12.7044 11.6839 11.9413 11.1213 11.3787C10.5587 10.8161 9.79565 10.5 9 10.5H3C2.20435 10.5 1.44129 10.8161 0.87868 11.3787C0.316071 11.9413 0 12.7044 0 13.5V15" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 7.5C7.65685 7.5 9 6.15685 9 4.5C9 2.84315 7.65685 1.5 6 1.5C4.34315 1.5 3 2.84315 3 4.5C3 6.15685 4.34315 7.5 6 7.5Z" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 4.5V10.5" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 7.5H18" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-[#2B2B2B] leading-tight mb-1">
                  District administrator
                </h2>
                <p className="text-[13px] text-[#9A9A9A]">
                  SFWG creates the administrator for a district. They&apos;ll receive a secure invitation to set their password and complete sign-in.
                </p>
              </div>
            </div>

            {/* Form */}
            <form noValidate onSubmit={handleStep3Submit} className="space-y-5">
              {/* Administrator full name */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#2B2B2B]">
                  Administrator full name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maria Rodriguez"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className={`w-full bg-[#FAF9F5] border rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#B0B0B0] focus:outline-none focus:ring-1 font-sans ${adminNameError
                      ? "form-input-error focus:ring-[#EF4444]"
                      : "border-[#E8E6E1] focus:ring-slate-400"
                    }`}
                />
                {adminNameError && (
                  <p className="form-error-text">
                    {adminNameError}
                  </p>
                )}
              </div>

              {/* Administrator email */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#2B2B2B]">
                  Administrator email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="admin@district.org"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className={`w-full bg-[#FAF9F5] border rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#B0B0B0] focus:outline-none focus:ring-1 font-sans ${adminEmailError
                      ? "form-input-error focus:ring-[#EF4444]"
                      : "border-[#E8E6E1] focus:ring-slate-400"
                    }`}
                />
                {adminEmailError && (
                  <p className="form-error-text">
                    {adminEmailError}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-[#2B2B2B]">
                  Role
                </label>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#FAF5FF] border border-[#E8DCF5] rounded-xl w-fit">
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1L1.5 2.8V6.4C1.5 9.1 3.4 11.6 6 12.7C8.6 11.6 10.5 9.1 10.5 6.4V2.8L6 1Z" stroke="#6D28D9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 6.5L5.5 8L8 5" stroke="#6D28D9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[13px] font-semibold text-[#6D28D9] leading-none">
                    District administrator
                  </span>
                </div>
                <p className="text-[11px] text-[#9A9A9A] font-medium leading-none pl-0.5">
                  District administrators manage and view all schools in their own district.
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#E8E6E1] mt-8 mb-6" />

              {/* Info Box 1 (Sage/Stone) */}
              <div className="bg-[#FAF9F5] border border-[#EFEDE8] rounded-[16px] p-4 flex gap-3 text-[12px] text-[#6D6D6D] leading-relaxed">
                <Check className="w-4 h-4 text-[#526B4E] shrink-0 mt-0.5" />
                <p>
                  The administrator will receive an email invitation with a secure link to set their password and activate their account.
                </p>
              </div>

              {/* Info Box 2 (Lavender) */}
              <div className="bg-[#FAF5FF] border border-[#E8DCF5] rounded-[16px] p-4 flex gap-3 text-[12px] text-[#6D28D9] leading-relaxed">
                <Info className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5" />
                <p>
                  The invitation link expires after 7 days. If the administrator needs assistance with activation, contact SFWG support.
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#E8E6E1] mt-8 mb-6" />

              {/* Action Buttons */}
              <div className="flex items-center justify-between w-full pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className={btnSecondaryClass}
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className={btnSecondaryClass}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={btnPrimaryClass}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        {/* STEP 4: Review & confirm */}
        {step === 4 && (
          <>
            {/* Modal Info Header */}
            <div className="flex items-start gap-4 mb-6 shrink-0">
              <div className="w-11 h-11 rounded-[12px] bg-[#EAF2E6] flex items-center justify-center shrink-0">
                <svg width="17" height="24" viewBox="0 0 17 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.10131 13.1865L9.03406 14.1199L14.6839 8.47985L15.6166 9.42652L9.03406 16.0132L4.79671 11.7599L5.74279 10.8265L8.10131 13.1865ZM8.10131 11.2932L11.3926 7.98652L12.3387 8.93318L9.03406 12.2399L8.10131 11.2932ZM6.22249 15.0665L5.27641 16.0132L1.03906 11.7599L1.97181 10.8265L2.91789 11.7599L6.22249 15.0665Z" fill="#586D4D" />
                </svg>
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-[#2B2B2B] leading-tight mb-1">
                  Review &amp; confirm
                </h2>
                <p className="text-[13px] text-[#9A9A9A]">
                  Check everything below before creating the district.
                </p>
              </div>
            </div>

            {/* Content Cards Container */}
            <div className="space-y-4 font-sans">
              {/* Card 1: District */}
              <div className="bg-[#FAF9F5] border border-[#EFEDE8] rounded-[20px] p-6 space-y-4">
                <h3 className="text-[13px] font-bold text-[#9A9A9A]">District</h3>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Name</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {districtName || "asdf"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Short name</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {shortName || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Type / setting</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {districtType || "Suburban"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Region</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {region || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Contact email</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {billingContactEmail || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Subscription */}
              <div className="bg-[#FAF9F5] border border-[#EFEDE8] rounded-[20px] p-6 space-y-4">
                <h3 className="text-[13px] font-bold text-[#9A9A9A]">Subscription</h3>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Plan</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">District Plan</span>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Status</span>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#EAF2E6] text-[#526B4E] rounded-full w-fit text-[12px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#526B4E]" />
                      <span>{status || "Active"}</span>
                    </div>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Start</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">6 Aug 2026</span>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Expiry</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {endExpiryDate || "17 Aug 2026"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Renewal</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {renewalDate || "1 Sep 2026"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Billing contact</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {billingContactName || "—"}
                    </span>
                  </div>
                </div>

                {/* Lavender Pill Tag */}
                <div className="flex items-center gap-2 px-3 py-1 bg-[#F5F3FB] rounded-full w-fit text-[12px] font-medium text-[#6D28D9] mt-2">
                  <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.95272 8.84167C4.18582 8.93056 4.37591 9.08056 4.52298 9.29167C4.67006 9.50278 4.74359 9.73889 4.74359 10C4.74359 10.2278 4.68809 10.4375 4.57709 10.6292C4.46609 10.8208 4.31486 10.9722 4.12338 11.0833C3.93191 11.1944 3.72239 11.25 3.49484 11.25C3.26729 11.25 3.05778 11.1944 2.86631 11.0833C2.67483 10.9722 2.52359 10.8208 2.41259 10.6292C2.30159 10.4375 2.24609 10.2278 2.24609 10C2.24609 9.73333 2.32379 9.49167 2.47919 9.275C2.63459 9.05833 2.83439 8.90833 3.07859 8.825V6.175C2.83439 6.09167 2.63459 5.94167 2.47919 5.725C2.32379 5.50833 2.24609 5.26667 2.24609 5C2.24609 4.77222 2.30159 4.5625 2.41259 4.37083C2.52359 4.17917 2.67483 4.02778 2.86631 3.91667C3.05778 3.80556 3.26729 3.75 3.49484 3.75C3.72239 3.75 3.93191 3.80556 4.12338 3.91667C4.31486 4.02778 4.46609 4.17917 4.57709 4.37083C4.68809 4.5625 4.74359 4.77222 4.74359 5C4.74359 5.26667 4.66589 5.50833 4.51049 5.725C4.35509 5.94167 4.15529 6.09167 3.91109 6.175V7.5C4.08869 7.36667 4.28294 7.26389 4.49384 7.19167C4.70474 7.11944 4.92674 7.08333 5.15984 7.08333H6.82484C7.10789 7.08333 7.36181 6.99722 7.58658 6.825C7.81136 6.65278 7.95982 6.43056 8.03197 6.15833C7.79887 6.06944 7.60878 5.91944 7.46171 5.70833C7.31463 5.49722 7.24109 5.26111 7.24109 5C7.24109 4.77222 7.29659 4.5625 7.40759 4.37083C7.51859 4.17917 7.66983 4.02778 7.86131 3.91667C8.05278 3.80556 8.26229 3.75 8.48984 3.75C8.71739 3.75 8.92691 3.80556 9.11838 3.91667C9.30986 4.02778 9.46109 4.17917 9.57209 4.37083C9.68309 4.5625 9.73859 4.77222 9.73859 5C9.73859 5.27222 9.65812 5.51806 9.49717 5.7375C9.33622 5.95694 9.12809 6.10833 8.87279 6.19167C8.81729 6.51389 8.69242 6.80694 8.49817 7.07083C8.30392 7.33472 8.06111 7.54167 7.76973 7.69167C7.47836 7.84167 7.16339 7.91667 6.82484 7.91667H5.15984C4.87679 7.91667 4.62288 8.00278 4.39811 8.175C4.17333 8.34722 4.02487 8.56944 3.95272 8.84167ZM3.49484 9.58333C3.37829 9.58333 3.27978 9.62361 3.19931 9.70417C3.11883 9.78472 3.07859 9.88333 3.07859 10C3.07859 10.1167 3.11883 10.2153 3.19931 10.2958C3.27978 10.3764 3.37829 10.4167 3.49484 10.4167C3.61139 10.4167 3.70991 10.3764 3.79038 10.2958C3.87086 10.2153 3.91109 10.1167 3.91109 10C3.91109 9.88333 3.87086 9.78472 3.79038 9.70417C3.70991 9.62361 3.61139 9.58333 3.49484 9.58333ZM3.49484 4.58333C3.37829 4.58333 3.27978 4.62361 3.19931 4.70417C3.11883 4.78472 3.07859 4.88333 3.07859 5C3.07859 5.11667 3.11883 5.21528 3.19931 5.29583C3.27978 5.37639 3.37829 5.41667 3.49484 5.41667C3.61139 5.41667 3.70991 5.37639 3.79038 5.29583C3.87086 5.21528 3.91109 5.11667 3.91109 5C3.91109 4.88333 3.87086 4.78472 3.79038 4.70417C3.70991 4.62361 3.61139 4.58333 3.49484 4.58333ZM8.48984 4.58333C8.37329 4.58333 8.27478 4.62361 8.19431 4.70417C8.11383 4.78472 8.07359 4.88333 8.07359 5C8.07359 5.11667 8.11383 5.21528 8.19431 5.29583C8.27478 5.37639 8.37329 5.41667 8.48984 5.41667C8.60639 5.41667 8.70491 5.37639 8.78538 5.29583C8.86586 5.21528 8.90609 5.11667 8.90609 5C8.90609 4.88333 8.86586 4.78472 8.78538 4.70417C8.70491 4.62361 8.60639 4.58333 8.48984 4.58333Z" fill="#6D28D9" />
                  </svg>
                  <span>Covers the district and all schools added under it</span>
                </div>
              </div>

              {/* Card 3: Administrator */}
              <div className="bg-[#FAF9F5] border border-[#EFEDE8] rounded-[20px] p-6 space-y-4">
                <h3 className="text-[13px] font-bold text-[#9A9A9A]">Administrator</h3>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Name</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {adminName || "dfg"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Email</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B] break-all">
                      {adminEmail || "himanifonix@gmail.com"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-[#E8E6E1] mt-8 mb-6" />

            {/* Action Buttons */}
            <div className="flex items-center justify-between w-full pt-1">
              <button
                type="button"
                onClick={onClose}
                className={btnSecondaryClass}
              >
                Cancel
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className={btnSecondaryClass}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStep4Submit}
                  className={btnPrimaryClass}
                >
                  Create district &amp; send invitation
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
