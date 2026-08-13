"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Layers,
  School as SchoolIcon,
  MapPin,
  Clipboard,
  Hash,
  AlertCircle,
  ArrowUpRight
} from "lucide-react";

// --- TYPES & INTERFACES ---

export interface TimelineEvent {
  id: number;
  title: string;
  detail: string;
  timestamp: string;
  relativeTime: string;
  status: "normal" | "escalated";
}

export interface RetryHistoryRecord {
  id: number;
  attempt: string;
  timestamp: string;
  relativeTime: string;
  outcome: "Success" | "Failed";
  detail: string;
}

export interface RelatedJobLog {
  id: number;
  jobName: string;
  outcome: "Success" | "Failed";
  timestamp: string;
  relativeTime: string;
  detail: string;
}

// --- MOCK DETAILS DATA FOR DYNAMIC API PRESENTATION ---

const TIMELINE_DATA: TimelineEvent[] = [
  {
    id: 1,
    title: "Issue detected",
    detail: "Analysis pipeline reported failure for run run-8341",
    timestamp: "16 Jul 2026 14:54",
    relativeTime: "20m ago",
    status: "normal"
  },
  {
    id: 2,
    title: "Auto-retry scheduled",
    detail: "Attempt 1 queued with 2m backoff",
    timestamp: "16 Jul 2026 14:54",
    relativeTime: "20m ago",
    status: "normal"
  },
  {
    id: 3,
    title: "Auto-retry failed",
    detail: "Same error: COHORT_MIN_NOT_MET",
    timestamp: "16 Jul 2026 14:56",
    relativeTime: "18m ago",
    status: "normal"
  },
  {
    id: 4,
    title: "Escalated to Open",
    detail: "Requires manual review — de-identification reduced cohort below minimum",
    timestamp: "16 Jul 2026 14:56",
    relativeTime: "18m ago",
    status: "escalated"
  }
];

const RETRY_HISTORY_DATA: RetryHistoryRecord[] = [
  {
    id: 1,
    attempt: "#1",
    timestamp: "16 Jul 2026 14:56",
    relativeTime: "18m ago",
    outcome: "Failed",
    detail: "Cohort still below minimum after same filter"
  }
];

const RELATED_JOBS_DATA: RelatedJobLog[] = [
  {
    id: 1,
    jobName: "Analysis — Sample Middle School 6-8 Fall 2025",
    outcome: "Failed",
    timestamp: "16 Jul 2026 14:54",
    relativeTime: "22m ago",
    detail: "Error: cohort under minimum threshold after de-identification"
  },
  {
    id: 2,
    jobName: "Analysis — Hillside Middle 6-8 Fall 2025",
    outcome: "Success",
    timestamp: "16 Jul 2026 15:10",
    relativeTime: "6m ago",
    detail: "Completed in 2m 05s"
  }
];

export function SupportStatusDetailPage({ issueId }: { issueId: string }) {
  const [isRecomputeModalOpen, setIsRecomputeModalOpen] = useState(false);

  const displayId = issueId || "iss-001";
  const issueTitle = "Analysis run failed — Sample Middle School 6-8 Fall 2025";

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-10">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-slate-400 font-medium font-sans">
        <Link href="/admin/system-status" className="hover:text-slate-600 transition-colors">
          Support status
        </Link>
        <span>/</span>
        <span className="text-slate-500 font-semibold">{displayId}</span>
      </div>

      {/* Single Card Container containing Main Header to Event Timeline */}
      <div className="bg-white rounded-xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-6 space-y-6">
        
        {/* Main Header Content */}
        <div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="space-y-2">
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-[#FCE7F3] text-[#9D174D]">
                  Analysis
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-[#FEE2E2] text-[#991B1B]">
                  Critical
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-[#FEE2E2] text-[#991B1B]">
                  Open
                </span>
              </div>
              
              {/* Issue Title */}
              <h1 className="text-[20px] font-bold text-slate-800 font-sans tracking-tight leading-snug">
                {issueTitle}
              </h1>
            </div>

            {/* Action Button */}
            <div className="shrink-0">
              <button
                onClick={() => setIsRecomputeModalOpen(true)}
                className="px-6 py-2.5 rounded-full bg-[#526B4E] hover:bg-[#465C42] text-white text-[13px] font-bold transition-colors cursor-pointer focus:outline-none"
              >
                Retry now
              </button>
            </div>
          </div>

          {/* Metadata List Grid */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4 mt-5 border-t border-[#EFEDE8]">
            {/* Detected */}
            <div className="flex items-center gap-2 text-[13px] text-slate-500 font-sans">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Detected: <span className="font-bold text-slate-700">16 Jul 2026 - 20m ago</span>
              </span>
            </div>

            {/* Service */}
            <div className="flex items-center gap-2 text-[13px] text-slate-500 font-sans">
              <Layers className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Service: <span className="w-2 h-2 rounded-full bg-[#8A5A04] inline-block mr-1"></span>
                <span className="font-bold text-slate-700">Analysis pipeline</span>
              </span>
            </div>

            {/* School */}
            <div className="flex items-center gap-2 text-[13px] text-slate-500 font-sans">
              <SchoolIcon className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                School: <span className="font-bold text-slate-700">Sample Middle School</span>
              </span>
            </div>

            {/* District */}
            <div className="flex items-center gap-2 text-[13px] text-slate-500 font-sans">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                District: <span className="font-bold text-slate-700">North Hills School District</span>
              </span>
            </div>

            {/* Survey */}
            <div className="flex items-center gap-2 text-[13px] text-slate-500 font-sans">
              <Clipboard className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Survey: <span className="font-bold text-slate-700">6-8 - Fall 2025</span>
              </span>
            </div>
          </div>

          {/* Run Metadata */}
          <div className="flex items-center gap-2 text-[13px] text-slate-500 font-sans pt-3 border-t border-[#EFEDE8]">
            <Hash className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Run <span className="font-bold text-slate-800">run-8341</span>
            </span>
          </div>
        </div>

        {/* Error Details Banner */}
        <div className="bg-[#FEF2F2] border border-[#EF4444]/20 rounded-xl p-5 flex gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex-shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5 text-[#EF4444]" />
          </div>
          <div className="flex flex-col items-start gap-1 w-full">
            <span className="text-[14px] font-bold text-[#991B1B] font-sans">Error details</span>
            <span className="text-[11px] font-mono font-bold text-[#991B1B] bg-white border border-[#EF4444]/10 rounded px-1.5 py-0.5 mt-0.5 inline-block uppercase">
              COHORT_MIN_NOT_MET
            </span>
            <span className="text-[13px] text-[#B91C1C] font-semibold font-sans mt-1.5 leading-relaxed">
              Cohort under minimum threshold after de-identification filter applied
            </span>
            <span className="text-[12px] font-mono text-slate-400 mt-1 leading-normal select-all">
              analysis-engine/src/cohort_validator.rs:147 - validate_deidentified_cohort
            </span>
          </div>
        </div>

        <hr className="border-[#EFEDE8]" />

        {/* Affected Section */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-sans">
            Affected
          </span>
          <button className="text-[#6D28D9] font-bold text-[14px] hover:underline cursor-pointer flex items-center gap-1.5 font-sans group">
            <span>Report on hold: Sample Middle School — 6-8 - Fall 2025</span>
            <ArrowUpRight className="w-4 h-4 text-[#6D28D9] transition-transform duration-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        <hr className="border-[#EFEDE8]" />

        {/* Diagnostics Section */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-sans">
            Diagnostics
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            {/* Card 1 */}
            <div className="bg-[#FAF9F7]/60 border border-[#E8E6E1]/80 rounded-xl p-4 flex flex-col justify-between h-[82px]">
              <span className="text-[11px] font-bold text-slate-400 font-sans leading-none">Original cohort size</span>
              <span className="text-[14px] font-bold text-slate-800 font-sans leading-none">142 students</span>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FAF9F7]/60 border border-[#E8E6E1]/80 rounded-xl p-4 flex flex-col justify-between h-[82px]">
              <span className="text-[11px] font-bold text-slate-400 font-sans leading-none">After de-identification</span>
              <span className="text-[13px] font-bold text-slate-800 font-sans leading-tight">
                8 schools (9 students removed as outliers)
              </span>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FAF9F7]/60 border border-[#E8E6E1]/80 rounded-xl p-4 flex flex-col justify-between h-[82px]">
              <span className="text-[11px] font-bold text-slate-400 font-sans leading-none">Minimum threshold</span>
              <span className="text-[14px] font-bold text-slate-800 font-sans leading-none">10 schools</span>
            </div>

            {/* Card 4 */}
            <div className="bg-[#FAF9F7]/60 border border-[#E8E6E1]/80 rounded-xl p-4 flex flex-col justify-between h-[82px]">
              <span className="text-[11px] font-bold text-slate-400 font-sans leading-none">Survey version</span>
              <span className="text-[13px] font-semibold text-slate-500 font-sans leading-none">v2.4 (Fall 2025)</span>
            </div>

            {/* Card 5 */}
            <div className="bg-[#FAF9F7]/60 border border-[#E8E6E1]/80 rounded-xl p-4 flex flex-col justify-between h-[82px]">
              <span className="text-[11px] font-bold text-slate-400 font-sans leading-none">Analysis engine</span>
              <span className="text-[13px] font-semibold text-slate-500 font-mono leading-none">ae-2026.07.14-stable</span>
            </div>

          </div>
        </div>

        <hr className="border-[#EFEDE8]" />

        {/* Event Timeline Section */}
        <div className="space-y-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-sans">
            Event timeline
          </span>
          <div className="relative pl-6 border-l-2 border-[#EFEDE8] space-y-6 ml-3">
            {TIMELINE_DATA.map((event) => {
              const isEscalated = event.status === "escalated";
              const dotColor = isEscalated ? "bg-red-500 ring-4 ring-red-100" : "bg-slate-300 ring-4 ring-slate-100";

              return (
                <div key={event.id} className="relative flex flex-col sm:flex-row justify-between items-start gap-2">
                  {/* Timeline Bullet */}
                  <span className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${dotColor}`} />
                  
                  {/* Detail */}
                  <div className="space-y-0.5">
                    <h4 className="text-[13px] font-bold text-slate-800 font-sans leading-none">
                      {event.title}
                    </h4>
                    <p className="text-[12px] text-slate-500 font-sans leading-relaxed">
                      {event.detail}
                    </p>
                  </div>

                  {/* Time metadata */}
                  <div className="text-right shrink-0 mt-0.5">
                    <span className="text-[13px] font-bold text-slate-800 font-sans block leading-none">
                      {event.timestamp}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium font-sans mt-1 block">
                      {event.relativeTime}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Retry History Section */}
      <div className="bg-white rounded-xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#EFEDE8]">
          <h2 className="text-[15px] font-bold text-slate-800 font-sans">Retry history</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EFEDE8]">
                <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 font-sans">Attempt</th>
                <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 font-sans">Time</th>
                <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 font-sans">Outcome</th>
                <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 font-sans">Detail</th>
              </tr>
            </thead>
            <tbody>
              {RETRY_HISTORY_DATA.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50">
                  <td className="py-4 px-6 text-[13px] font-bold text-slate-800 font-sans">
                    {record.attempt}
                  </td>
                  <td className="py-4 px-6 text-[13px] font-bold text-slate-800 font-sans leading-tight">
                    <div>{record.timestamp}</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">{record.relativeTime}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-[#FEE2E2] text-[#991B1B] inline-block">
                      {record.outcome}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[13px] text-slate-500 font-sans">
                    {record.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Related Job Logs Section */}
      <div className="bg-white rounded-xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#EFEDE8]">
          <h2 className="text-[15px] font-bold text-slate-800 font-sans">Related job logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EFEDE8]">
                <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 font-sans">Job</th>
                <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 font-sans">Outcome</th>
                <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 font-sans">Time</th>
                <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 font-sans">Detail</th>
              </tr>
            </thead>
            <tbody>
              {RELATED_JOBS_DATA.map((job) => {
                const isFailed = job.outcome === "Failed";
                const badgeColor = isFailed ? "bg-[#FEE2E2] text-[#991B1B]" : "bg-[#D1FAE5] text-[#065F46]";

                return (
                  <tr key={job.id} className="border-b border-[#EFEDE8] last:border-b-0 hover:bg-slate-50/50">
                    <td className="py-4 px-6 text-[13px] font-bold text-slate-800 font-sans">
                      {job.jobName}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide inline-block ${badgeColor}`}>
                        {job.outcome}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[13px] font-bold text-slate-800 font-sans leading-tight">
                      <div>{job.timestamp}</div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">{job.relativeTime}</div>
                    </td>
                    <td className="py-4 px-6 text-[13px] text-slate-500 font-sans">
                      {job.detail}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Run Manual Recompute Modal */}
      {isRecomputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
          {/* Backdrop click to close */}
          <div 
            className="absolute inset-0 cursor-default" 
            onClick={() => setIsRecomputeModalOpen(false)} 
          />
          
          <div className="relative bg-white rounded-[24px] border border-[#E8E6E1] shadow-[0_12px_24px_rgba(0,0,0,0.12)] p-8 max-w-[540px] w-full mx-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-[20px] font-bold text-slate-900 font-sans tracking-tight mb-3">
              Run manual recompute?
            </h3>
            <p className="text-[14px] text-slate-500 font-normal font-sans leading-relaxed mb-6">
              This will re-run <span className="font-bold text-slate-800">{issueTitle}</span> outside the normal schedule. A manual recompute is logged as an occasional override and recorded in the audit log.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsRecomputeModalOpen(false)}
                className="px-6 py-2.5 rounded-full border border-[#D5E5D5] bg-[#F4F9F4] text-[#4F6C50] text-[13px] font-bold hover:bg-[#EBF3EB] transition-colors cursor-pointer focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsRecomputeModalOpen(false);
                }}
                className="px-6 py-2.5 rounded-full bg-[#526B4E] hover:bg-[#465C42] text-white text-[13px] font-bold transition-colors cursor-pointer focus:outline-none"
              >
                Retry now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
