"use client";

import React, { useState } from "react";
import { 
  Building2, 
  MoreVertical, 
  ClipboardCheck, 
  FileText, 
  User, 
  BookOpen, 
  Clock, 
  RotateCw, 
  ChevronDown 
} from "lucide-react";
import { Customer } from "./CustomersPage";

interface CustomerDetailsProps {
  customer: Customer;
  onBack: () => void;
}

export function CustomerDetails({ customer, onBack }: CustomerDetailsProps) {
  const [activeTab, setActiveTab] = useState("Overview");

  // Reusable card secondary button styling
  const btnSecondaryClass = "w-full py-2.5 rounded-full border border-[#D6E0D2] bg-[#F2F5F0] text-[#586D4D] hover:bg-[#E5EAE2] font-semibold text-[13px] transition-colors cursor-pointer focus:outline-none text-center block";

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-10 font-sans">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-sans font-medium mb-1 select-none">
        <span 
          onClick={onBack} 
          className="hover:text-slate-800 cursor-pointer transition-colors"
        >
          Customers
        </span>
        <span>/</span>
        <span className="text-slate-800 font-bold">{customer.name}</span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-[24px] font-bold text-[#2B2B2B] leading-tight">
              {customer.name}
            </h1>
            
            {/* Pill Badges */}
            <div className="flex items-center gap-1.5">
              <span className="bg-[#F0EAFB] text-[#6D28D9] font-bold text-[10px] uppercase tracking-wide px-2.5 py-0.5 rounded-full">
                {customer.type}
              </span>
              <span className="bg-[#F0EAFB] text-[#6D28D9] font-bold text-[10px] uppercase tracking-wide px-2.5 py-0.5 rounded-full">
                Elementary
              </span>
              <span className="bg-[#FEE2E2] text-[#991B1B] font-bold text-[10px] uppercase tracking-wide px-2.5 py-0.5 rounded-full">
                {customer.subscriptionStatus}
              </span>
            </div>
          </div>
          <p className="text-[13px] text-slate-400 font-semibold">
            Contracts with SFWG directly
          </p>
        </div>

        <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Active Surveys */}
        <div className="bg-white rounded-[20px] border border-[#E8E6E1] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[112px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active surveys
            </span>
            <div className="w-7 h-7 rounded-full bg-[#EAF2E6] text-[#526B4E] flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[28px] font-bold text-[#2B2B2B] leading-none mt-2">
            0
          </span>
        </div>

        {/* KPI 2: Reports this term */}
        <div className="bg-white rounded-[20px] border border-[#E8E6E1] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[112px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Reports this term
            </span>
            <div className="w-7 h-7 rounded-full bg-[#F0EAFB] text-[#6D28D9] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[28px] font-bold text-[#2B2B2B] leading-none mt-2">
            0
          </span>
        </div>

        {/* KPI 3: School admin */}
        <div className="bg-white rounded-[20px] border border-[#E8E6E1] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[112px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              School admin
            </span>
            <div className="w-7 h-7 rounded-full bg-[#FFECD1] flex items-center justify-center shrink-0">
              <svg width="16" height="23" viewBox="0 0 16 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.24219 12.6499V13.8999C6.56719 13.8999 5.93802 14.0707 5.35469 14.4124C4.78802 14.7457 4.33802 15.1957 4.00469 15.7624C3.66302 16.3457 3.49219 16.9791 3.49219 17.6624H2.24219C2.24219 16.7541 2.47135 15.9124 2.92969 15.1374C3.37135 14.3791 3.96719 13.7791 4.71719 13.3374C5.49219 12.8791 6.33385 12.6499 7.24219 12.6499ZM7.24219 12.0249C6.56719 12.0249 5.93802 11.8582 5.35469 11.5249C4.78802 11.1916 4.33802 10.7416 4.00469 10.1749C3.66302 9.59157 3.49219 8.96032 3.49219 8.28115C3.49219 7.60199 3.66302 6.97074 4.00469 6.3874C4.33802 5.82074 4.78802 5.37074 5.35469 5.0374C5.93802 4.69574 6.56927 4.5249 7.24844 4.5249C7.9276 4.5249 8.55885 4.69574 9.14219 5.0374C9.70052 5.37074 10.1464 5.82074 10.4797 6.3874C10.8214 6.97074 10.9922 7.60199 10.9922 8.28115C10.9922 8.96032 10.8214 9.59157 10.4797 10.1749C10.1464 10.7416 9.70052 11.1916 9.14219 11.5249C8.55885 11.8582 7.92552 12.0249 7.24219 12.0249ZM7.24219 10.7749C7.69219 10.7749 8.10885 10.6645 8.49219 10.4437C8.87552 10.2228 9.17969 9.92074 9.40469 9.5374C9.62969 9.15407 9.74219 8.73532 9.74219 8.28115C9.74219 7.82699 9.62969 7.40824 9.40469 7.0249C9.17969 6.64157 8.87552 6.3374 8.49219 6.1124C8.10885 5.8874 7.69219 5.7749 7.24219 5.7749C6.79219 5.7749 6.37552 5.8874 5.99219 6.1124C5.60885 6.3374 5.30469 6.64157 5.07969 7.0249C4.85469 7.40824 4.74219 7.82699 4.74219 8.28115C4.74219 8.73532 4.85469 9.15407 5.07969 9.5374C5.30469 9.92074 5.60885 10.2228 5.99219 10.4437C6.37552 10.6645 6.79219 10.7749 7.24219 10.7749ZM8.86719 15.6624C8.82552 15.4957 8.80469 15.327 8.80469 15.1562C8.80469 14.9853 8.82552 14.8166 8.86719 14.6499L8.24219 14.2874L8.86719 13.2124L9.49219 13.5624C9.74219 13.3291 10.0339 13.1624 10.3672 13.0624V12.3374H11.6172V13.0624C11.9505 13.1624 12.2422 13.3291 12.4922 13.5624L13.1172 13.2124L13.7422 14.2874L13.1172 14.6499C13.1589 14.8166 13.1797 14.9853 13.1797 15.1562C13.1797 15.327 13.1589 15.4957 13.1172 15.6624L13.7422 16.0249L13.1172 17.0999L12.4922 16.7499C12.2422 16.9832 11.9505 17.1499 11.6172 17.2499V17.9624H10.3672V17.2499C10.0339 17.1499 9.74219 16.9832 9.49219 16.7499L8.86719 17.0999L8.24219 16.0249L8.86719 15.6624ZM10.9922 16.0874C11.2505 16.0874 11.4714 15.9978 11.6547 15.8187C11.838 15.6395 11.9297 15.4187 11.9297 15.1562C11.9297 14.8937 11.838 14.6728 11.6547 14.4937C11.4714 14.3145 11.2505 14.2228 10.9922 14.2187C10.7339 14.2145 10.513 14.3041 10.3297 14.4874C10.1464 14.6707 10.0547 14.8937 10.0547 15.1562C10.0547 15.4187 10.1464 15.6416 10.3297 15.8249C10.513 16.0082 10.7339 16.0999 10.9922 16.0999V16.0874Z" fill="#8A5A04" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <span className="text-[20px] font-bold text-[#2B2B2B] leading-tight">
              None
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              Vacant position
            </span>
          </div>
        </div>

        {/* KPI 4: Current grade bands */}
        <div className="bg-white rounded-[20px] border border-[#E8E6E1] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[112px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Current grade bands
            </span>
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <span className="bg-[#F5F3FB] text-[#6D28D9] rounded-full px-2.5 py-0.5 text-[11px] font-bold mt-2.5 w-fit">
            K-5
          </span>
        </div>

        {/* KPI 5: Last activity */}
        <div className="bg-white rounded-[20px] border border-[#E8E6E1] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[112px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Last activity
            </span>
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[20px] font-bold text-[#2B2B2B] leading-none mt-2 font-sans">
            3mo ago
          </span>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#EFEDE8] pb-0">
        {["Overview", "Surveys", "Reports", "Activity", "Subscription"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3.5 text-[14px] font-bold transition-colors relative cursor-pointer focus:outline-none ${
                isActive ? "text-[#6D28D9]" : "text-[#9A9A9A] hover:text-slate-700"
              }`}
            >
              {tab}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#6D28D9] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card: Current & recent surveys */}
            <div className="bg-white rounded-3xl border border-[#E8E6E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
              <h2 className="text-[15px] font-bold text-[#2B2B2B] p-6 pb-4">
                Current &amp; recent surveys
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-y border-[#EFEDE8]">
                      <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3.5 px-6 font-sans">Grade band</th>
                      <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3.5 px-6 font-sans">Period</th>
                      <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3.5 px-6 font-sans">Status</th>
                      <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3.5 px-6 font-sans">Participation</th>
                      <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3.5 px-6 font-sans">Closes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Empty survey list */}
                    <tr>
                      <td colSpan={5} className="h-6" />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card: Recent activity */}
            <div className="bg-white rounded-3xl border border-[#E8E6E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-8 flex flex-col items-center min-h-[360px]">
              <h2 className="text-[15px] font-bold text-[#2B2B2B] self-start mb-12">
                Recent activity
              </h2>
              
              {/* Center Empty State */}
              <div className="flex flex-col items-center justify-center my-auto">
                <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4 shrink-0">
                  <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.5 2.66659C18.2952 2.66659 20.0112 3.01325 21.648 3.70659C23.2144 4.38214 24.6092 5.3377 25.8324 6.57325C27.0556 7.80881 28.0016 9.2177 28.6704 10.7999C29.3568 12.4533 29.7 14.1866 29.7 15.9999C29.7 17.8133 29.3568 19.5466 28.6704 21.1999C28.0016 22.7821 27.0556 24.191 25.8324 25.4266C24.6092 26.6621 23.2144 27.6177 21.648 28.2933C20.0112 28.9866 18.2952 29.3333 16.5 29.3333C14.7048 29.3333 12.9888 28.9866 11.352 28.2933C9.78565 27.6177 8.39085 26.6621 7.16765 25.4266C5.94445 24.191 4.99845 22.7821 4.32965 21.1999C3.64325 19.5466 3.30005 17.8133 3.30005 15.9999H5.94005C5.94005 17.9377 6.42405 19.7333 7.39205 21.3866C8.32485 22.9866 9.58325 24.2577 11.1672 25.1999C12.804 26.1777 14.5816 26.6666 16.5 26.6666C18.4184 26.6666 20.196 26.1777 21.8328 25.1999C23.4168 24.2577 24.6752 22.9866 25.608 21.3866C26.576 19.7333 27.06 17.9377 27.06 15.9999C27.06 14.0621 26.576 12.2666 25.608 10.6133C24.6752 9.01325 23.4168 7.74214 21.8328 6.79992C20.196 5.82214 18.4184 5.33325 16.5 5.33325C14.7224 5.33325 13.0504 5.75992 11.484 6.61325C9.97045 7.43103 8.72965 8.55992 7.76165 9.99992H11.22V12.6666H3.30005V4.6665H5.94005V7.99992C7.17205 6.34659 8.69445 5.04881 10.5072 4.10659C12.3728 3.14659 14.3704 2.66659 16.5 2.66659ZM17.82 9.33325V15.4399L22.0968 19.7599L20.2224 21.6533L15.18 16.5599V9.33325H17.82Z" fill="#9A9A9A"/>
                  </svg>
                </div>
                <h3 className="text-[14px] font-bold text-[#2B2B2B] mb-1">
                  No activity
                </h3>
                <p className="text-[13px] text-slate-400 font-semibold text-center max-w-[320px] leading-relaxed">
                  Actvityies will appear here once the school creates them.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column (1/3 width) */}
          <div className="space-y-6">
            
            {/* Card: School administrator */}
            <div className="bg-white rounded-3xl border border-[#E8E6E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 className="text-[15px] font-bold text-[#2B2B2B]">
                School administrator
              </h3>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFECD1] flex items-center justify-center shrink-0">
                  <svg width="16" height="23" viewBox="0 0 16 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.24219 12.6499V13.8999C6.56719 13.8999 5.93802 14.0707 5.35469 14.4124C4.78802 14.7457 4.33802 15.1957 4.00469 15.7624C3.66302 16.3457 3.49219 16.9791 3.49219 17.6624H2.24219C2.24219 16.7541 2.47135 15.9124 2.92969 15.1374C3.37135 14.3791 3.96719 13.7791 4.71719 13.3374C5.49219 12.8791 6.33385 12.6499 7.24219 12.6499ZM7.24219 12.0249C6.56719 12.0249 5.93802 11.8582 5.35469 11.5249C4.78802 11.1916 4.33802 10.7416 4.00469 10.1749C3.66302 9.59157 3.49219 8.96032 3.49219 8.28115C3.49219 7.60199 3.66302 6.97074 4.00469 6.3874C4.33802 5.82074 4.78802 5.37074 5.35469 5.0374C5.93802 4.69574 6.56927 4.5249 7.24844 4.5249C7.9276 4.5249 8.55885 4.69574 9.14219 5.0374C9.70052 5.37074 10.1464 5.82074 10.4797 6.3874C10.8214 6.97074 10.9922 7.60199 10.9922 8.28115C10.9922 8.96032 10.8214 9.59157 10.4797 10.1749C10.1464 10.7416 9.70052 11.1916 9.14219 11.5249C8.55885 11.8582 7.92552 12.0249 7.24219 12.0249ZM7.24219 10.7749C7.69219 10.7749 8.10885 10.6645 8.49219 10.4437C8.87552 10.2228 9.17969 9.92074 9.40469 9.5374C9.62969 9.15407 9.74219 8.73532 9.74219 8.28115C9.74219 7.82699 9.62969 7.40824 9.40469 7.0249C9.17969 6.64157 8.87552 6.3374 8.49219 6.1124C8.10885 5.8874 7.69219 5.7749 7.24219 5.7749C6.79219 5.7749 6.37552 5.8874 5.99219 6.1124C5.60885 6.3374 5.30469 6.64157 5.07969 7.0249C4.85469 7.40824 4.74219 7.82699 4.74219 8.28115C4.74219 8.73532 4.85469 9.15407 5.07969 9.5374C5.30469 9.92074 5.60885 10.2228 5.99219 10.4437C6.37552 10.6645 6.79219 10.7749 7.24219 10.7749ZM8.86719 15.6624C8.82552 15.4957 8.80469 15.327 8.80469 15.1562C8.80469 14.9853 8.82552 14.8166 8.86719 14.6499L8.24219 14.2874L8.86719 13.2124L9.49219 13.5624C9.74219 13.3291 10.0339 13.1624 10.3672 13.0624V12.3374H11.6172V13.0624C11.9505 13.1624 12.2422 13.3291 12.4922 13.5624L13.1172 13.2124L13.7422 14.2874L13.1172 14.6499C13.1589 14.8166 13.1797 14.9853 13.1797 15.1562C13.1797 15.327 13.1589 15.4957 13.1172 15.6624L13.7422 16.0249L13.1172 17.0999L12.4922 16.7499C12.2422 16.9832 11.9505 17.1499 11.6172 17.2499V17.9624H10.3672V17.2499C10.0339 17.1499 9.74219 16.9832 9.49219 16.7499L8.86719 17.0999L8.24219 16.0249L8.86719 15.6624ZM10.9922 16.0874C11.2505 16.0874 11.4714 15.9978 11.6547 15.8187C11.838 15.6395 11.9297 15.4187 11.9297 15.1562C11.9297 14.8937 11.838 14.6728 11.6547 14.4937C11.4714 14.3145 11.2505 14.2228 10.9922 14.2187C10.7339 14.2145 10.513 14.3041 10.3297 14.4874C10.1464 14.6707 10.0547 14.8937 10.0547 15.1562C10.0547 15.4187 10.1464 15.6416 10.3297 15.8249C10.513 16.0082 10.7339 16.0999 10.9922 16.0999V16.0874Z" fill="#8A5A04" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <span className="text-[13px] font-bold text-[#2B2B2B] block">
                    No active administrator
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                    Vacant • requires SFWG-assisted assignment
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed pt-1.5">
                Each school has one administrator, set when the school is created. They activate their account via an invitation. To change who holds the role, contact SFWG support.
              </p>
            </div>

            {/* Card: Survey configuration */}
            <div className="bg-white rounded-3xl border border-[#E8E6E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 className="text-[15px] font-bold text-[#2B2B2B]">
                Survey configuration
              </h3>
              
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-400 font-semibold">Grade bands</span>
                  <span className="font-bold text-[#2B2B2B]">K-5</span>
                </div>
                
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-400 font-semibold">Active instrument</span>
                  <span className="bg-[#EAF2E6] text-[#526B4E] rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    K-5 • v3 active
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed pt-1.5 border-t border-[#EFEDE8]">
                Survey instruments are authored by SFWG. Schools cannot edit questions.
              </p>
            </div>

            {/* Card: Subscription */}
            <div className="bg-white rounded-3xl border border-[#E8E6E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-[#2B2B2B]">
                  Subscription
                </h3>
                <span className="bg-[#FEE2E2] text-[#991B1B] rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {customer.subscriptionStatus}
                </span>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-400 font-semibold">Plan level</span>
                  <span className="font-bold text-[#2B2B2B]">Standard</span>
                </div>
                
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-400 font-semibold">Renewal date</span>
                  <span className="font-bold text-[#2B2B2B]">Ended 1 Mar 2026</span>
                </div>
              </div>

              <div className="pt-2">
                <button type="button" className={btnSecondaryClass}>
                  Manage subscription
                </button>
              </div>
            </div>

            {/* Card: School settings */}
            <div className="bg-white rounded-3xl border border-[#E8E6E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h3 className="text-[15px] font-bold text-[#2B2B2B]">
                School settings
              </h3>

              <div className="flex items-start justify-between gap-4 pt-1">
                <div className="space-y-0.5">
                  <span className="text-[13px] font-bold text-[#2B2B2B] block">
                    Reopen permission
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold block leading-snug">
                    Allow school admins to reopen their own closed surveys
                  </span>
                </div>
                <span className="bg-slate-100 text-slate-500 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5">
                  Disabled
                </span>
              </div>

              <div className="pt-2">
                <button type="button" className={btnSecondaryClass}>
                  Edit
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === "Surveys" && (
        <div className="space-y-6">
          
          {/* Surveys Header with count and filters */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-0.5">
              <h2 className="font-secondary font-normal text-[14px] text-[#6D6D6D]">
                0 surveys
              </h2>
              <p className="text-[13px] text-slate-400 font-semibold leading-relaxed">
                A school can run one survey per grade band at a time.
              </p>
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              {["Grade band", "Status", "Period"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-[#E8E6E1] text-[#6D6D6D] font-secondary font-normal text-[14px] rounded-full flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
                >
                  <span>{filter}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Large Full Width Empty State Card */}
          <div className="bg-white rounded-3xl border border-[#E8E6E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-16 flex flex-col items-center justify-center min-h-[360px]">
            <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4 shrink-0">
              <svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.6637 8.2016e-05V2.66675H22.6631C23.0364 2.66675 23.3519 2.79564 23.6096 3.05342C23.8674 3.31119 23.9963 3.62675 23.9963 4.00008V25.3334C23.9963 25.7067 23.8674 26.0223 23.6096 26.2801C23.3519 26.5379 23.0364 26.6667 22.6631 26.6667H1.33312C0.95985 26.6667 0.644344 26.5379 0.386606 26.2801C0.128869 26.0223 0 25.7067 0 25.3334V4.00008C0 3.62675 0.128869 3.31119 0.386606 3.05342C0.644344 2.79564 0.95985 2.66675 1.33312 2.66675H5.3325V8.2016e-05H18.6637ZM5.3325 5.33342H2.66625V24.0001H21.33V5.33342H18.6637V8.00008H5.3325V5.33342ZM7.99875 18.6667V21.3334H5.3325V18.6667H7.99875ZM7.99875 14.6667V17.3334H5.3325V14.6667H7.99875ZM7.99875 10.6667V13.3334H5.3325V10.6667H7.99875ZM15.9975 2.66675H7.99875V5.33342H15.9975V2.66675Z" fill="#9A9A9A"/>
              </svg>
            </div>
            <h3 className="text-[14px] font-bold text-[#2B2B2B] mb-1">
              No surveys yet
            </h3>
            <p className="text-[13px] text-slate-400 font-semibold text-center max-w-[360px] leading-relaxed">
              Survey runs will appear here once the school creates them.
            </p>
          </div>

        </div>
      )}

      {activeTab === "Reports" && (
        <div className="space-y-6">
          
          {/* Reports Header with count and filters */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-0.5">
              <h2 className="font-secondary font-normal text-[14px] text-[#6D6D6D]">
                0 reports
              </h2>
              <p className="text-[13px] text-slate-400 font-semibold leading-relaxed">
                Reports are PDF only. There are no public report links.
              </p>
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              {["Grade band", "Period"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-[#E8E6E1] text-[#6D6D6D] font-secondary font-normal text-[14px] rounded-full flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
                >
                  <span>{filter}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Large Full Width Empty State Card */}
          <div className="bg-white rounded-3xl border border-[#E8E6E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-16 flex flex-col items-center justify-center min-h-[360px]">
            <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4 shrink-0">
              <svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.665 6.66675H13.3313V20.0001H10.665V6.66675ZM15.9975 12.0001H18.6637V20.0001H15.9975V12.0001ZM5.3325 14.6667H7.99875V20.0001H5.3325V14.6667ZM15.9975 2.66675H2.66625V24.0001H21.33V8.00008H15.9975V2.66675ZM0 1.33342C0 0.960083 0.128869 0.644527 0.386606 0.386749C0.644344 0.128971 0.95985 8.2016e-05 1.33312 8.2016e-05H17.3306L23.9963 6.66675V25.3334C23.9963 25.689 23.8674 26.0001 23.6096 26.2667C23.3519 26.5334 23.0364 26.6667 22.6631 26.6667H1.33312C0.95985 26.6667 0.644344 26.5379 0.386606 26.2801C0.128869 26.0223 0 25.7067 0 25.3334V1.33342Z" fill="#9A9A9A"/>
              </svg>
            </div>
            <h3 className="text-[14px] font-bold text-[#2B2B2B] mb-1">
              No reports yet
            </h3>
            <p className="text-[13px] text-slate-400 font-semibold text-center max-w-[360px] leading-relaxed">
              Reports appear here after a survey closes and is analysed.
            </p>
          </div>

        </div>
      )}

      {activeTab === "Activity" && (
        <div className="bg-white rounded-3xl border border-[#E8E6E1] p-16 flex flex-col items-center justify-center min-h-[360px]">
          <h3 className="text-[14px] font-bold text-[#2B2B2B]">Activity logs view</h3>
        </div>
      )}

      {activeTab === "Subscription" && (
        <div className="bg-white rounded-3xl border border-[#E8E6E1] p-16 flex flex-col items-center justify-center min-h-[360px]">
          <h3 className="text-[14px] font-bold text-[#2B2B2B]">Subscription configuration view</h3>
        </div>
      )}

    </div>
  );
}
