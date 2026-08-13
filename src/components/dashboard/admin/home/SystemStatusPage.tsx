"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MoreVertical } from "lucide-react";

// --- TYPES & INTERFACES ---

export interface ServiceStatus {
  id: string;
  title: string;
  status: "Operational" | "Degraded";
  metrics: string;
  details: string;
}

export interface Issue {
  id: number;
  title: string;
  type: "Analysis" | "Report generation" | "Collection" | "Notification";
  severity: "Critical" | "Warning" | "Info";
  affected: string;
  detectedDate: string;
  detectedTime: string;
  detectedRelative: string;
  status: "Open" | "Retrying" | "Resolved";
}

export interface JobHistory {
  id: number;
  jobName: string;
  outcome: "Success" | "Failed" | "Retrying" | "Retried";
  timestamp: string;
  relativeTime: string;
  detail: string;
}

// --- MOCK DATA FOR API-READY STRUCTURE ---

const SERVICES_DATA: ServiceStatus[] = [
  {
    id: "analysis-pipeline",
    title: "Analysis pipeline",
    status: "Degraded",
    metrics: "5 runs in progress - avg 2m 12s",
    details: "1 run failed in the last hour. Processing queue depth is normal."
  },
  {
    id: "report-generation",
    title: "Report generation",
    status: "Operational",
    metrics: "3 generating - 0 failed",
    details: "All report generation jobs are completing normally."
  },
  {
    id: "survey-collection",
    title: "Survey collection",
    status: "Operational",
    metrics: "34 surveys open - links healthy",
    details: "Collection endpoints responding. 1,847 responses received today."
  },
  {
    id: "notifications",
    title: "Notifications",
    status: "Operational",
    metrics: "Delivery normal - 99.6% rate",
    details: "Email and in-app notifications delivering within 90 seconds."
  },
  {
    id: "benchmark-refresh",
    title: "Benchmark refresh",
    status: "Operational",
    metrics: "Next 1 Dec 2026 - last run success",
    details: "All benchmark datasets refreshed on schedule."
  },
  {
    id: "data-storage-api",
    title: "Data storage / API",
    status: "Operational",
    metrics: "Latency 12ms - 99.99% uptime",
    details: "API endpoints healthy. No degraded queries detected."
  }
];

const ISSUES_DATA: Issue[] = [
  {
    id: 1,
    title: "Analysis run failed Sample Middle School 6-8 Fall 2025",
    type: "Analysis",
    severity: "Critical",
    affected: "Report on hold: Sample Middle School 6-8 - Fall 2025",
    detectedDate: "16 Jul 2026",
    detectedTime: "14:54",
    detectedRelative: "20m ago",
    status: "Open"
  },
  {
    id: 2,
    title: "Report generation stalled Riverside Elementary K-5 Spring 2026",
    type: "Report generation",
    severity: "Warning",
    affected: "Report in generating queue: Riverside Elementary K-5 - Spring 2026",
    detectedDate: "16 Jul 2026",
    detectedTime: "14:38",
    detectedRelative: "36m ago",
    status: "Retrying"
  },
  {
    id: 3,
    title: "Survey link errors on some Chromebook models (Lenovo 100e)",
    type: "Collection",
    severity: "Warning",
    affected: "3 schools reporting: North Hills School District",
    detectedDate: "15 Jul 2026",
    detectedTime: "22:12",
    detectedRelative: "17h ago",
    status: "Retrying"
  },
  {
    id: 4,
    title: "Notification email delays batch delivery lagging by ~8 minutes",
    type: "Notification",
    severity: "Info",
    affected: "56 delayed notifications across 12 schoo...",
    detectedDate: "16 Jul 2026",
    detectedTime: "15:08",
    detectedRelative: "6m ago",
    status: "Resolved"
  }
];

const JOB_HISTORY_DATA: JobHistory[] = [
  {
    id: 1,
    jobName: "Analysis · Vox Collegiate 6-8 Fall 2025",
    outcome: "Success",
    timestamp: "16 Jul 2026 15:14",
    relativeTime: "2m ago",
    detail: "Completed in 1m 48s"
  },
  {
    id: 2,
    jobName: "Analysis · Sample Middle School 6-8 Fall 2025",
    outcome: "Failed",
    timestamp: "16 Jul 2026 14:54",
    relativeTime: "22m ago",
    detail: "Error: cohort under minimum threshold after de-identification"
  },
  {
    id: 3,
    jobName: "Report generation · Riverside Elementary K-5 Spring 2026",
    outcome: "Retried",
    timestamp: "16 Jul 2026 14:38",
    relativeTime: "38m ago",
    detail: "Retry attempt 2 of 3: generating charts"
  },
  {
    id: 4,
    jobName: "Benchmark refresh · National 6-8 Composite",
    outcome: "Success",
    timestamp: "16 Jul 2026 13:30",
    relativeTime: "1h 46m ago",
    detail: "Refresh completed. 1,642 schools included."
  },
  {
    id: 5,
    jobName: "Analysis · Hillside Middle 6-8 Fall 2025",
    outcome: "Success",
    timestamp: "16 Jul 2026 15:10",
    relativeTime: "6m ago",
    detail: "Completed in 2m 05s"
  },
  {
    id: 6,
    jobName: "Survey collection · nightly batch",
    outcome: "Success",
    timestamp: "16 Jul 2026 09:30",
    relativeTime: "5h 46m ago",
    detail: "1,847 responses collected. 0 errors."
  },
  {
    id: 7,
    jobName: "Notification batch · morning digest",
    outcome: "Success",
    timestamp: "16 Jul 2026 12:30",
    relativeTime: "2h 46m ago",
    detail: "234 notifications delivered"
  },
  {
    id: 8,
    jobName: "Analysis · Riverside Elementary K-5 Spring 2026",
    outcome: "Success",
    timestamp: "16 Jul 2026 14:40",
    relativeTime: "36m ago",
    detail: "Completed in 1m 32s"
  }
];

// --- BADGE STYLE MAPS ---

const TYPE_BADGE_CLASSES: Record<Issue["type"], string> = {
  Analysis: "bg-[#FCE7F3] text-[#9D174D]",
  "Report generation": "bg-[#F3E8FF] text-[#6B21A8]",
  Collection: "bg-[#EFF6FF] text-[#1E40AF]",
  Notification: "bg-[#D1FAE5] text-[#065F46]"
};

const SEVERITY_BADGE_CLASSES: Record<Issue["severity"], string> = {
  Critical: "bg-[#FEE2E2] text-[#991B1B]",
  Warning: "bg-[#FEF3C7] text-[#92400E]",
  Info: "bg-[#F3F4F6] text-[#374151]"
};

const STATUS_BADGE_CLASSES: Record<Issue["status"], string> = {
  Open: "bg-[#FEE2E2] text-[#991B1B]",
  Retrying: "bg-[#FEF3C7] text-[#92400E]",
  Resolved: "bg-[#D1FAE5] text-[#065F46]"
};

const OUTCOME_BADGE_CLASSES: Record<JobHistory["outcome"], string> = {
  Success: "bg-[#D1FAE5] text-[#065F46]",
  Failed: "bg-[#FEE2E2] text-[#991B1B]",
  Retrying: "bg-[#FEF3C7] text-[#92400E]",
  Retried: "bg-[#FEF3C7] text-[#92400E]"
};

// --- REUSABLE SUB-COMPONENTS ---

function ServiceCard({ service }: { service: ServiceStatus }) {
  const isDegraded = service.status === "Degraded";
  const dotColor = isDegraded ? "bg-[#8A5A04]" : "bg-[#1D6B1D]";
  const textColor = isDegraded ? "text-[#8A5A04]" : "text-[#1D6B1D]";

  return (
    <div className="bg-white rounded-xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-5">
      <div className="flex justify-between items-center">
        <span className="text-[14px] font-bold text-slate-800 font-sans">{service.title}</span>
        <div className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
          <span className={`text-[12px] font-semibold font-sans ${textColor}`}>{service.status}</span>
        </div>
      </div>
      <div className="text-[13px] font-semibold text-slate-800 mt-3 font-sans">
        {service.metrics}
      </div>
      <div className="text-[12px] text-slate-400 mt-1 font-sans leading-relaxed">
        {service.details}
      </div>
    </div>
  );
}

// --- MAIN SYSTEM STATUS PAGE ---

export function SystemStatusPage() {
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [retryIssue, setRetryIssue] = useState<Issue | null>(null);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-10">
      
      {/* Degraded Alert Banner */}
      <div className="bg-[#FFECD1] border border-[#C8E6C8] px-5 py-4 rounded-xl flex items-start gap-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div className="flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-[#8A5A04]" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="9" />
            <path
              fill="#FFECD1"
              d="M10 5a1 1 0 011 1v4a1 1 0 11-2 0V6a1 1 0 011-1zm0 8a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-bold text-[#8A5A04] font-sans">
            Degraded <span className="font-normal text-[#8A5A04]/80 mx-1.5">·</span> 2 issues need attention
          </span>
          <span className="text-[12px] text-[#8A5A04]/85 font-medium font-sans">
            1 service degraded · 2 issues open
          </span>
        </div>
      </div>

      {/* Service KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES_DATA.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* Issues Needing Attention Section */}
      <div className="bg-white rounded-xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-6 py-4 flex justify-between items-center border-b border-[#EFEDE8]">
          <h2 className="text-[15px] font-bold text-slate-800 font-sans">Issues needing attention</h2>
          <span className="text-[12px] text-slate-400 font-medium font-sans">
            {ISSUES_DATA.length} issues
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EFEDE8]">
                <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 font-sans">Issue</th>
                <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 font-sans">Type</th>
                <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 font-sans">Severity</th>
                <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 font-sans">Affected</th>
                <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 font-sans">Detected</th>
                <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 font-sans">Status</th>
                <th className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 px-6 font-sans">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ISSUES_DATA.map((issue) => (
                <tr key={issue.id} className="border-b border-[#EFEDE8] last:border-b-0 hover:bg-slate-50/50">
                  <td className="py-4 px-6 text-[13px] font-bold text-slate-800 font-sans max-w-xs leading-snug">
                    {issue.title}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans tracking-wide inline-block ${TYPE_BADGE_CLASSES[issue.type]}`}>
                      {issue.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans tracking-wide inline-block ${SEVERITY_BADGE_CLASSES[issue.severity]}`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[#6D28D9] font-semibold text-[13px] hover:underline cursor-pointer font-sans leading-snug block max-w-[200px] truncate">
                      {issue.affected}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[13px] font-bold text-slate-800 font-sans leading-tight">
                    <div>{issue.detectedDate}</div>
                    <div>{issue.detectedTime}</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">{issue.detectedRelative}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans tracking-wide inline-block ${STATUS_BADGE_CLASSES[issue.status]}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4 relative">
                      <Link
                        href={`/admin/system-status/iss-${String(issue.id).padStart(3, "0")}`}
                        className="text-[13px] font-semibold text-[#6D28D9] hover:underline cursor-pointer font-sans"
                      >
                        View
                      </Link>
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdownId(activeDropdownId === issue.id ? null : issue.id)}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded hover:bg-slate-100 focus:outline-none flex items-center justify-center"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeDropdownId === issue.id && (
                          <>
                            <div
                              className="fixed inset-0 z-40 cursor-default"
                              onClick={() => setActiveDropdownId(null)}
                            />
                            <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl border border-[#E8E6E1] shadow-[0_4px_12px_rgba(0,0,0,0.08)] py-2 z-50 origin-top-right">
                              {issue.status !== "Retrying" && (
                                <button
                                  onClick={() => {
                                    setRetryIssue(issue);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                  Retry
                                </button>
                              )}
                              <button
                                onClick={() => setActiveDropdownId(null)}
                                className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                              >
                                View logs
                              </button>
                              {issue.status !== "Retrying" && (
                                <button
                                  onClick={() => setActiveDropdownId(null)}
                                  className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                  View affected report
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Job History Section */}
      <div className="bg-white rounded-xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-6 py-4 flex justify-between items-center border-b border-[#EFEDE8]">
          <h2 className="text-[15px] font-bold text-slate-800 font-sans">Recent job history</h2>
          <button className="text-[13px] font-semibold text-[#6D28D9] hover:underline cursor-pointer font-sans">
            View full logs
          </button>
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
              {JOB_HISTORY_DATA.map((job) => (
                <tr key={job.id} className="border-b border-[#EFEDE8] last:border-b-0 hover:bg-slate-50/50">
                  <td className="py-4 px-6 text-[13px] font-bold text-slate-800 font-sans">
                    {job.jobName}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans tracking-wide inline-block ${OUTCOME_BADGE_CLASSES[job.outcome]}`}>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Footer Note */}
      <div className="bg-white rounded-xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] px-5 py-4 flex items-center gap-3 w-full">
        <div className="flex-shrink-0 mt-0.5 text-indigo-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <div className="text-[13px] text-slate-500 font-sans">
          Escalations and retries are recorded in the audit log.
        </div>
      </div>

      {/* Run Manual Recompute Modal */}
      {retryIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
          {/* Backdrop click to close */}
          <div 
            className="absolute inset-0 cursor-default" 
            onClick={() => setRetryIssue(null)} 
          />
          
          <div className="relative bg-white rounded-[24px] border border-[#E8E6E1] shadow-[0_12px_24px_rgba(0,0,0,0.12)] p-8 max-w-[540px] w-full mx-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-[20px] font-bold text-slate-900 font-sans tracking-tight mb-3">
              Run manual recompute?
            </h3>
            <p className="text-[14px] text-slate-500 font-normal font-sans leading-relaxed mb-6">
              This will re-run <span className="font-bold text-slate-800">{retryIssue.title}</span> outside the normal schedule. A manual recompute is logged as an occasional override and recorded in the audit log.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRetryIssue(null)}
                className="px-6 py-2.5 rounded-full border border-[#D5E5D5] bg-[#F4F9F4] text-[#4F6C50] text-[13px] font-bold hover:bg-[#EBF3EB] transition-colors cursor-pointer focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setRetryIssue(null);
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
