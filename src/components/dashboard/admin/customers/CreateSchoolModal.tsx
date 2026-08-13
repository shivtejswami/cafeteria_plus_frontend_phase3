"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Calendar, AlertCircle, Info } from "lucide-react";

interface CreateSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingNames?: string[];
}

export function CreateSchoolModal({ isOpen, onClose, existingNames }: CreateSchoolModalProps) {
  const [step, setStep] = useState(1);

  // Button style variables
  const btnSecondaryClass = "px-6 py-2.5 rounded-full border border-[#D6E0D2] bg-[#F2F5F0] text-[#586D4D] hover:bg-[#E5EAE2] font-secondary font-medium text-[13px] transition-colors cursor-pointer focus:outline-none";
  const btnPrimaryClass = "px-6 py-2.5 rounded-full bg-[#526B4E] hover:bg-[#465C42] text-white font-semibold text-[13px] transition-colors cursor-pointer focus:outline-none";

  // Step 1: School Details State
  const [schoolName, setSchoolName] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [enrolmentBand, setEnrolmentBand] = useState("");
  const [region, setRegion] = useState("");
  const [schoolSetting, setSchoolSetting] = useState("");

  // Grade-level survey checkboxes
  const [surveys, setSurveys] = useState<{ [key: string]: boolean }>({
    "K-5": false,
    "6-8": false,
    "9-12": false,
  });

  // Dropdown open states
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const [isBandOpen, setIsBandOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const levelRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const settingRef = useRef<HTMLDivElement>(null);

  // Step 2: School Subscription State
  const [status, setStatus] = useState("Active");
  const [endExpiryDate, setEndExpiryDate] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [billingContactName, setBillingContactName] = useState("");
  const [billingContactEmail, setBillingContactEmail] = useState("");
  const [invoiceRefNumber, setInvoiceRefNumber] = useState("");
  const [internalNotes, setInternalNotes] = useState("SFWG-only operational notes about this subscription...");

  // Step 3: School Administrator State
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  // Validation submit tracking states
  const [submittedStep1, setSubmittedStep1] = useState(false);
  const [submittedStep2, setSubmittedStep2] = useState(false);
  const [submittedStep3, setSubmittedStep3] = useState(false);

  const schoolNameError = submittedStep1 && !schoolName.trim() ? "School name is required" : null;
  const schoolLevelError = submittedStep1 && !schoolLevel.trim() ? "School level is required" : null;
  const enrolmentBandError = submittedStep1 && !enrolmentBand.trim() ? "Enrolment band is required" : null;

  const expiryDateError = submittedStep2 && !endExpiryDate.trim() ? "End / expiry date is required" : null;

  const adminNameError = submittedStep3 && !adminName.trim() ? "Administrator name is required" : null;
  const adminEmailError = submittedStep3 && !adminEmail.trim() ? "Administrator email is required" : null;

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (levelRef.current && !levelRef.current.contains(event.target as Node)) {
        setIsLevelOpen(false);
      }
      if (bandRef.current && !bandRef.current.contains(event.target as Node)) {
        setIsBandOpen(false);
      }
      if (settingRef.current && !settingRef.current.contains(event.target as Node)) {
        setIsSettingOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const toggleSurvey = (key: string) => {
    setSurveys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedStep1(true);
    if (schoolName.trim() && schoolLevel.trim() && enrolmentBand.trim()) {
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
      schoolName,
      schoolLevel,
      enrolmentBand,
      region,
      schoolSetting,
      surveys,
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
              School details
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

        {/* STEP 1: School Details */}
        {step === 1 && (
          <>
            {/* Modal Info Header */}
            <div className="flex items-start gap-4 mb-6 shrink-0">
              <div className="w-11 h-11 rounded-[12px] bg-[#F0EAFB] flex items-center justify-center shrink-0">
                <svg width="17" height="24" viewBox="0 0 17 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.32875 5.1998L12.3263 9.1998V10.7998H14.9913V17.4665H15.6575V18.7998H1V17.4665H1.66625V10.7998H4.33125V9.1998L8.32875 5.1998ZM12.3263 17.4665H13.6588V12.1331H12.3263V17.4665ZM4.33125 12.1331H2.99875V17.4665H4.33125V12.1331ZM5.66375 9.74647V17.4665H7.6625V12.7998H8.995V17.4665H10.9938V9.74647L8.32875 7.0798L5.66375 9.74647Z" fill="#6D28D9"/>
                </svg>
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-[#2B2B2B] leading-tight mb-1">
                  School details
                </h2>
                <p className="text-[13px] text-[#9A9A9A]">
                  Set up a new standalone school on the platform.
                </p>
              </div>
            </div>

            {/* Form */}
            <form noValidate onSubmit={handleStep1Submit} className="space-y-5">
              {/* School Name */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#2B2B2B]">
                  School name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maple Grove Elementary"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className={`w-full bg-[#FAF9F5] border rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#B0B0B0] focus:outline-none focus:ring-1 font-sans ${
                    schoolNameError
                      ? "form-input-error focus:ring-[#EF4444]"
                      : "border-[#E8E6E1] focus:ring-slate-400"
                  }`}
                />
                {schoolNameError && (
                  <p className="form-error-text">
                    {schoolNameError}
                  </p>
                )}
              </div>

              {/* School Level & Enrolment Band Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* School Level */}
                <div className="space-y-1.5" ref={levelRef}>
                  <label className="block text-[13px] font-bold text-[#2B2B2B]">
                    School level <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setIsLevelOpen(!isLevelOpen)}
                      className={`w-full bg-[#FAF9F5] border rounded-2xl px-4 py-3 text-[13px] text-left focus:outline-none focus:ring-1 font-sans flex items-center justify-between cursor-pointer ${
                        schoolLevelError
                          ? "form-input-error focus:ring-[#EF4444]"
                          : "border-[#E8E6E1] focus:ring-slate-400"
                      }`}
                    >
                      <span className={schoolLevel ? "text-[#2B2B2B]" : "text-[#B0B0B0]"}>
                        {schoolLevel || "Select level..."}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${isLevelOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isLevelOpen && (
                      <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white border border-[#E8E6E1] rounded-[16px] shadow-[0_8px_25px_rgba(0,0,0,0.1)] py-2 z-50 overflow-hidden font-sans">
                        {["Elementary", "Middle", "High"].map((option) => (
                          <div
                            key={option}
                            onClick={() => {
                              setSchoolLevel(option);
                              setIsLevelOpen(false);
                            }}
                            className={`px-4 py-2.5 text-[13px] cursor-pointer transition-colors ${
                              schoolLevel === option
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
                  {schoolLevelError ? (
                    <p className="form-error-text">{schoolLevelError}</p>
                  ) : (
                    <p className="text-[11px] text-[#9A9A9A] font-medium leading-normal pl-0.5">
                      Used to group comparable schools for benchmarking. Required.
                    </p>
                  )}
                </div>

                {/* Enrolment Band */}
                <div className="space-y-1.5" ref={bandRef}>
                  <label className="block text-[13px] font-bold text-[#2B2B2B]">
                    Enrolment band <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setIsBandOpen(!isBandOpen)}
                      className={`w-full bg-[#FAF9F5] border rounded-2xl px-4 py-3 text-[13px] text-left focus:outline-none focus:ring-1 font-sans flex items-center justify-between cursor-pointer ${
                        enrolmentBandError
                          ? "form-input-error focus:ring-[#EF4444]"
                          : "border-[#E8E6E1] focus:ring-slate-400"
                      }`}
                    >
                      <span className={enrolmentBand ? "text-[#2B2B2B]" : "text-[#B0B0B0]"}>
                        {enrolmentBand || "Select band..."}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${isBandOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isBandOpen && (
                      <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white border border-[#E8E6E1] rounded-[16px] shadow-[0_8px_25px_rgba(0,0,0,0.1)] py-2 z-50 overflow-hidden font-sans">
                        {["Under 300", "300–599", "600–999", "1,000+"].map((option) => (
                          <div
                            key={option}
                            onClick={() => {
                              setEnrolmentBand(option);
                              setIsBandOpen(false);
                            }}
                            className={`px-4 py-2.5 text-[13px] cursor-pointer transition-colors ${
                              enrolmentBand === option
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
                  {enrolmentBandError ? (
                    <p className="form-error-text">{enrolmentBandError}</p>
                  ) : (
                    <p className="text-[11px] text-[#9A9A9A] font-medium leading-normal pl-0.5">
                      Also used for benchmarking comparability. Required.
                    </p>
                  )}
                </div>
              </div>

              {/* Region & Setting Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Region / state */}
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#2B2B2B]">
                    Region / state
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Texas"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#E8E6E1] rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans"
                  />
                </div>

                {/* School setting */}
                <div className="space-y-1.5" ref={settingRef}>
                  <label className="block text-[13px] font-bold text-[#2B2B2B]">
                    School setting
                  </label>
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setIsSettingOpen(!isSettingOpen)}
                      className="w-full bg-[#FAF9F5] border border-[#E8E6E1] rounded-2xl px-4 py-3 text-[13px] text-left text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans flex items-center justify-between cursor-pointer"
                    >
                      <span className={schoolSetting ? "text-[#2B2B2B]" : "text-[#B0B0B0]"}>
                        {schoolSetting || "Select setting..."}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${isSettingOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isSettingOpen && (
                      <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white border border-[#E8E6E1] rounded-[16px] shadow-[0_8px_25px_rgba(0,0,0,0.1)] py-2 z-50 overflow-hidden font-sans">
                        {["Urban", "Suburban", "Rural"].map((option) => (
                          <div
                            key={option}
                            onClick={() => {
                              setSchoolSetting(option);
                              setIsSettingOpen(false);
                            }}
                            className={`px-4 py-2.5 text-[13px] cursor-pointer transition-colors ${
                              schoolSetting === option
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
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-start gap-4 mb-6 shrink-0">
                  <div className="w-11 h-11 rounded-[12px] bg-[#F0EAFB] flex items-center justify-center shrink-0">
                    <svg width="17" height="24" viewBox="0 0 17 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.6595 5.33317V6.6665H13.6583C13.8448 6.6665 14.0025 6.73095 14.1313 6.85984C14.2601 6.98873 14.3245 7.1465 14.3245 7.33317V17.9998C14.3245 18.1865 14.2601 18.3443 14.1313 18.4732C14.0025 18.6021 13.8448 18.6665 13.6583 18.6665H2.99828C2.81173 18.6665 2.65405 18.6021 2.52524 18.4732C2.39644 18.3443 2.33203 18.1865 2.33203 17.9998V7.33317C2.33203 7.1465 2.39644 6.98873 2.52524 6.85984C2.65405 6.73095 2.81173 6.6665 2.99828 6.6665H4.99703V5.33317H11.6595ZM4.99703 7.99984H3.66453V17.3332H12.992V7.99984H11.6595V9.33317H4.99703V7.99984ZM6.32953 14.6665V15.9998H4.99703V14.6665H6.32953ZM6.32953 12.6665V13.9998H4.99703V12.6665H6.32953ZM6.32953 10.6665V11.9998H4.99703V10.6665H6.32953ZM10.327 6.6665H6.32953V7.99984H10.327V6.6665Z" fill="#6D28D9"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-[20px] font-bold text-[#2B2B2B] leading-tight mb-1">
                      Grade-level survey
                    </h2>
                    <p className="text-[13px] text-[#9A9A9A]">
                      Choose the standardised survey this school will run.
                    </p>
                  </div>
                </div>

                {/* Survey Checkbox Cards */}
                <div className="space-y-3">
                  {/* Card 1: K-5 */}
                  <div
                    onClick={() => toggleSurvey("K-5")}
                    className="flex items-center gap-3 p-4 bg-white border border-[#E8E6E1] rounded-[16px] cursor-pointer hover:border-slate-300 transition-colors"
                  >
                    <div
                      className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors ${
                        surveys["K-5"]
                          ? "bg-[#526B4E] border-[#526B4E]"
                          : "border-[#D1D1D1] bg-white"
                      }`}
                    >
                      {surveys["K-5"] && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div>
                      <span className="block text-[14px] font-bold text-[#2B2B2B] leading-tight">
                        K–5
                      </span>
                      <span className="block text-[12px] text-[#9A9A9A] font-medium mt-0.5">
                        K–5 · v3 (active)
                      </span>
                    </div>
                  </div>

                  {/* Card 2: 6-8 */}
                  <div
                    onClick={() => toggleSurvey("6-8")}
                    className="flex items-center gap-3 p-4 bg-white border border-[#E8E6E1] rounded-[16px] cursor-pointer hover:border-slate-300 transition-colors"
                  >
                    <div
                      className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors ${
                        surveys["6-8"]
                          ? "bg-[#526B4E] border-[#526B4E]"
                          : "border-[#D1D1D1] bg-white"
                      }`}
                    >
                      {surveys["6-8"] && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div>
                      <span className="block text-[14px] font-bold text-[#2B2B2B] leading-tight">
                        6–8
                      </span>
                      <span className="block text-[12px] text-[#9A9A9A] font-medium mt-0.5">
                        6–8 · v3 (active)
                      </span>
                    </div>
                  </div>

                  {/* Card 3: 9-12 */}
                  <div
                    onClick={() => toggleSurvey("9-12")}
                    className="flex items-center gap-3 p-4 bg-white border border-[#E8E6E1] rounded-[16px] cursor-pointer hover:border-slate-300 transition-colors"
                  >
                    <div
                      className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors ${
                        surveys["9-12"]
                          ? "bg-[#526B4E] border-[#526B4E]"
                          : "border-[#D1D1D1] bg-white"
                      }`}
                    >
                      {surveys["9-12"] && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div>
                      <span className="block text-[14px] font-bold text-[#2B2B2B] leading-tight">
                        9–12
                      </span>
                      <span className="block text-[12px] text-[#9A9A9A] font-medium mt-0.5">
                        9–12 · v2 (active)
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[#9A9A9A] font-medium leading-normal mt-3 pl-0.5">
                  A school can run one survey per grade band at a time. You can enable more than one grade band here if this school serves multiple bands.
                </p>
              </div>

              {/* Thin Separation Line */}
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
                  className={btnPrimaryClass}
                >
                  Continue
                </button>
              </div>
            </form>
          </>
        )}

        {/* STEP 2: Subscription */}
        {step === 2 && (
          <>
            {/* Modal Info Header */}
            <div className="flex items-start gap-4 mb-6 shrink-0">
              <div className="w-11 h-11 rounded-[12px] bg-[#F0EAFB] flex items-center justify-center shrink-0">
                <svg width="17" height="24" viewBox="0 0 17 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.9923 18.6665H3.66477C3.30055 18.6665 2.9652 18.5776 2.65873 18.3998C2.35225 18.2221 2.11018 17.9798 1.93252 17.6732C1.75485 17.3665 1.66602 17.0309 1.66602 16.6665V5.99984C1.66602 5.81317 1.73042 5.65539 1.85923 5.5265C1.98804 5.39762 2.14572 5.33317 2.33227 5.33317H11.6598C11.8463 5.33317 12.004 5.39762 12.1328 5.5265C12.2616 5.65539 12.326 5.81317 12.326 5.99984V13.9998H14.991V16.6665C14.991 17.0309 14.9022 17.3665 14.7245 17.6732C14.5468 17.9798 14.3048 18.2221 13.9983 18.3998C13.6918 18.5776 13.3565 18.6665 12.9923 18.6665ZM12.326 15.3332V16.6665C12.326 16.8532 12.3904 17.0109 12.5192 17.1398C12.648 17.2687 12.8057 17.3332 12.9923 17.3332C13.1788 17.3332 13.3365 17.2687 13.4653 17.1398C13.5941 17.0109 13.6585 16.8532 13.6585 16.6665V15.3332H12.326ZM10.9935 17.3332V6.6665H2.99852V16.6665C2.99852 16.8532 3.06292 17.0109 3.19173 17.1398C3.32054 17.2687 3.47822 17.3332 3.66477 17.3332H10.9935ZM4.33102 8.6665H9.66102V9.99984H4.33102V8.6665ZM4.33102 11.3332H9.66102V12.6665H4.33102V11.3332ZM4.33102 13.9998H7.66227V15.3332H4.33102V13.9998Z" fill="#6D28D9"/>
                </svg>
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-[#2B2B2B] leading-tight mb-1">
                  Subscription
                </h2>
                <p className="text-[13px] text-[#9A9A9A]">
                  Track this school&apos;s subscription record. No payments are processed here.
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
                    Subscription state governs the customer&apos;s access.
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
                      className={`w-full bg-[#FAF9F5] border rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#B0B0B0] focus:outline-none focus:ring-1 pr-10 font-sans ${
                        expiryDateError
                          ? "form-input-error focus:ring-[#EF4444]"
                          : "border-[#E8E6E1] focus:ring-slate-400"
                      }`}
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {expiryDateError ? (
                    <p className="form-error-text">{expiryDateError}</p>
                  ) : (
                    <p className="text-[11px] text-[#9A9A9A] font-medium leading-normal pl-0.5">
                      When the district subscription expires. Drives grace, read-only, and deactivation for the district and all its schools.
                    </p>
                  )}
                </div>
              </div>

              {/* Renewal Date */}
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
                <p className="text-[11px] text-[#9A9A9A] font-medium leading-none pl-0.5">
                  Optional. May default relative to the end date.
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#E8E6E1] mt-8 mb-6" />

              {/* Billing Contact Rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-bold text-[#2B2B2B]">
                    Billing contact name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. James Morrison"
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
                    placeholder="contact@school.org"
                    value={billingContactEmail}
                    onChange={(e) => setBillingContactEmail(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#E8E6E1] rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans"
                  />
                </div>
              </div>

              {/* Invoice Reference */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#2B2B2B]">
                  Invoice / customer reference number
                </label>
                <input
                  type="text"
                  placeholder="e.g. INV-SCH-2026-001"
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
                <div className="flex items-center gap-1.5 text-[11px] text-[#D97706] font-medium pl-0.5 mb-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Internal — not visible to the customer.</span>
                </div>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E8E6E1] rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans resize-none"
                />
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#E8E6E1] mt-8 mb-6" />

              {/* Info Box */}
              <div className="bg-[#FAF9F5] border border-[#EFEDE8] rounded-[16px] p-4 flex gap-3 text-[12px] text-[#6D6D6D] leading-relaxed">
                <Info className="w-4 h-4 text-[#9A9A9A] shrink-0 mt-0.5" />
                <p>
                  The platform tracks subscriptions — it does not process payments. Invoicing and proration happen outside the platform.
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

        {/* STEP 3: School administrator */}
        {step === 3 && (
          <>
            {/* Modal Info Header */}
            <div className="flex items-start gap-4 mb-6 shrink-0">
              <div className="w-11 h-11 rounded-[12px] bg-[#F0EAFB] flex items-center justify-center shrink-0">
                <svg width="17" height="24" viewBox="0 0 17 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.66055 13.84V15.2267C8.23415 15.0756 7.78998 15 7.32805 15C6.6085 15 5.9378 15.1822 5.31597 15.5467C4.71191 15.9022 4.23221 16.3822 3.87687 16.9867C3.51266 17.6089 3.33055 18.28 3.33055 19H1.99805C1.99805 18.0311 2.24234 17.1333 2.73092 16.3067C3.20174 15.5067 3.8369 14.8711 4.6364 14.4C5.46255 13.9111 6.35976 13.6667 7.32805 13.6667C7.7811 13.6667 8.22526 13.7244 8.66055 13.84ZM7.32805 13C6.59961 13 5.92892 12.8178 5.31597 12.4533C4.71191 12.0978 4.23221 11.6178 3.87687 11.0133C3.51266 10.4 3.33055 9.72889 3.33055 9C3.33055 8.27111 3.51266 7.6 3.87687 6.98667C4.23221 6.38222 4.71191 5.90222 5.31597 5.54667C5.92892 5.18222 6.59961 5 7.32805 5C8.05648 5 8.72717 5.18222 9.34012 5.54667C9.94419 5.90222 10.4239 6.38222 10.7792 6.98667C11.1434 7.6 11.3255 8.27111 11.3255 9C11.3255 9.72889 11.1434 10.4 10.7792 11.0133C10.4239 11.6178 9.94419 12.0978 9.34012 12.4533C8.72717 12.8178 8.05648 13 7.32805 13ZM7.32805 11.6667C7.80775 11.6667 8.25191 11.5467 8.66055 11.3067C9.06918 11.0667 9.39342 10.7422 9.63327 10.3333C9.87312 9.92444 9.99305 9.48 9.99305 9C9.99305 8.52 9.87312 8.07555 9.63327 7.66667C9.39342 7.25778 9.06918 6.93333 8.66055 6.69333C8.25191 6.45333 7.80775 6.33333 7.32805 6.33333C6.84835 6.33333 6.40418 6.45333 5.99555 6.69333C5.58691 6.93333 5.26267 7.25778 5.02282 7.66667C4.78297 8.07555 4.66305 8.52 4.66305 9C4.66305 9.48 4.78297 9.92444 5.02282 10.3333C5.26267 10.7422 5.58691 11.0667 5.99555 11.3067C6.40418 11.5467 6.84835 11.6667 7.32805 11.6667ZM11.3255 15.6667V13.6667H12.658V15.6667H14.6568V17H12.658V19H11.3255V17H9.3268V15.6667H11.3255Z" fill="#6D28D9"/>
                </svg>
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-[#2B2B2B] leading-tight mb-1">
                  School administrator
                </h2>
                <p className="text-[13px] text-[#9A9A9A]">
                  Each school has one school administrator. They&apos;ll receive a secure invitation to set their password and complete sign-in.
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
                  placeholder="e.g. James Chen"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className={`w-full bg-[#FAF9F5] border rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#B0B0B0] focus:outline-none focus:ring-1 font-sans ${
                    adminNameError
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
                  placeholder="admin@school.org"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className={`w-full bg-[#FAF9F5] border rounded-2xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#B0B0B0] focus:outline-none focus:ring-1 font-sans ${
                    adminEmailError
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
                  <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_3106_29957)">
                      <path d="M6.34172 10.9632V12.0465C5.75717 12.0465 5.21231 12.1946 4.70714 12.4907C4.21641 12.7796 3.82671 13.1696 3.53804 13.6607C3.24216 14.1663 3.09422 14.7152 3.09422 15.3074H2.01172C2.01172 14.5202 2.21018 13.7907 2.60709 13.119C2.98958 12.4618 3.50557 11.9418 4.15507 11.559C4.82622 11.1618 5.5551 10.9632 6.34172 10.9632ZM6.34172 10.4215C5.75717 10.4215 5.21231 10.2771 4.70714 9.98822C4.21641 9.69933 3.82671 9.30933 3.53804 8.81822C3.24216 8.31266 3.09422 7.76558 3.09422 7.17697C3.09422 6.58836 3.24216 6.04127 3.53804 5.53572C3.82671 5.04461 4.21641 4.6546 4.70714 4.36572C5.21231 4.0696 5.75897 3.92155 6.34713 3.92155C6.93529 3.92155 7.48195 4.0696 7.98712 4.36572C8.47064 4.6546 8.85673 5.04461 9.14539 5.53572C9.44128 6.04127 9.58922 6.58836 9.58922 7.17697C9.58922 7.76558 9.44128 8.31266 9.14539 8.81822C8.85673 9.30933 8.47064 9.69933 7.98712 9.98822C7.48195 10.2771 6.93349 10.4215 6.34172 10.4215ZM6.34172 9.33822C6.73142 9.33822 7.09225 9.24252 7.42422 9.05113C7.75619 8.85974 8.01959 8.59794 8.21444 8.26572C8.40929 7.93349 8.50672 7.57058 8.50672 7.17697C8.50672 6.78335 8.40929 6.42044 8.21444 6.08822C8.01959 5.75599 7.75619 5.49238 7.42422 5.29738C7.09225 5.10238 6.73142 5.00488 6.34172 5.00488C5.95202 5.00488 5.59119 5.10238 5.25922 5.29738C4.92725 5.49238 4.66384 5.75599 4.46899 6.08822C4.27414 6.42044 4.17672 6.78335 4.17672 7.17697C4.17672 7.57058 4.27414 7.93349 4.46899 8.26572C4.66384 8.59794 4.92725 8.85974 5.25922 9.05113C5.59119 9.24252 5.95202 9.33822 6.34172 9.33822ZM7.74897 13.574C7.71289 13.4296 7.69484 13.2834 7.69484 13.1353C7.69484 12.9872 7.71289 12.841 7.74897 12.6965L7.20772 12.3824L7.74897 11.4507L8.29022 11.754C8.50672 11.5518 8.7593 11.4074 9.04797 11.3207V10.6924H10.1305V11.3207C10.4191 11.4074 10.6717 11.5518 10.8882 11.754L11.4295 11.4507L11.9707 12.3824L11.4295 12.6965C11.4656 12.841 11.4836 12.9872 11.4836 13.1353C11.4836 13.2834 11.4656 13.4296 11.4295 13.574L11.9707 13.8882L11.4295 14.8199L10.8882 14.5165C10.6717 14.7188 10.4191 14.8632 10.1305 14.9499V15.5674H9.04797V14.9499C8.7593 14.8632 8.50672 14.7188 8.29022 14.5165L7.74897 14.8199L7.20772 13.8882L7.74897 13.574ZM9.58922 13.9424C9.81294 13.9424 10.0042 13.8647 10.1629 13.7095C10.3217 13.5542 10.4011 13.3628 10.4011 13.1353C10.4011 12.9078 10.3217 12.7164 10.1629 12.5611C10.0042 12.4059 9.81294 12.3264 9.58922 12.3228C9.3655 12.3192 9.17426 12.3968 9.01549 12.5557C8.85673 12.7146 8.77734 12.9078 8.77734 13.1353C8.77734 13.3628 8.85673 13.556 9.01549 13.7149C9.17426 13.8738 9.3655 13.9532 9.58922 13.9532V13.9424Z" fill="#6D28D9"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_3106_29957">
                        <rect width="13.5312" height="13" fill="white" transform="translate(0.226562 3.25)"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="text-[13px] font-semibold text-[#6D28D9] leading-none">
                    School administrator
                  </span>
                </div>
                <p className="text-[11px] text-[#9A9A9A] font-medium leading-none pl-0.5">
                  School administrators manage only their own school.
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#E8E6E1] mt-8 mb-6" />

              {/* Info Box 1 (Sage/Stone) */}
              <div className="bg-[#F0F5EE] border border-[#DFE8DB] rounded-[16px] p-4 flex gap-3 text-[12px] text-[#586D4D] leading-relaxed">
                <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#586D4D] w-3.5 h-3.5 shrink-0 mt-0.5">
                  <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>
                  The administrator will receive an email invitation with a secure link to set their password and activate their account.
                </p>
              </div>

              {/* Info Box 2 (Lavender) */}
              <div className="bg-[#FAF5FF] border border-[#E8DCF5] rounded-[16px] p-4 flex gap-3 text-[12px] text-[#6D28D9] leading-relaxed">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#6D28D9] w-3.5 h-3.5 shrink-0 mt-0.5">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M7 6.5V10M7 4.5H7.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>
                  The invitation link expires after 7 days. If activation fails, contact SFWG support — the school record has no invite or replace controls.
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
                  Check everything below before creating the school.
                </p>
              </div>
            </div>

            {/* Content Cards Container */}
            <div className="space-y-4 font-sans">
              {/* Card 1: School */}
              <div className="bg-[#FAF9F5] border border-[#EFEDE8] rounded-[20px] p-6 space-y-4">
                <h3 className="text-[13px] font-bold text-[#9A9A9A]">School</h3>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Name</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {schoolName || "asd"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Level</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {schoolLevel || "Middle"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Enrolment</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {enrolmentBand || "Under 300"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Region</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {region || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Setting</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {schoolSetting || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Contact email</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {billingContactEmail || "—"}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Grade bands</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {Object.keys(surveys).filter(k => surveys[k]).join(", ") || "—"}
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
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">Single School</span>
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
                      {endExpiryDate || "25 Aug 2026"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Renewal</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {renewalDate || "16 Aug 2026"}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Billing contact</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {billingContactName || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Administrator */}
              <div className="bg-[#FAF9F5] border border-[#EFEDE8] rounded-[20px] p-6 space-y-4">
                <h3 className="text-[13px] font-bold text-[#9A9A9A]">Administrator</h3>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <span className="block text-[12px] text-[#9A9A9A] font-medium mb-0.5">Name</span>
                    <span className="block text-[13px] font-semibold text-[#2B2B2B]">
                      {adminName || "asd"}
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
                  Create school &amp; send invitation
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
