import React from "react";

// ==========================================
// 1. GradeBadge Component (Exported for sidebar use)
// ==========================================
export type GradeBandType = "6-8" | "K-5" | "9-12" | string;

interface GradeBadgeProps {
  gradeBand: GradeBandType;
}

export function GradeBadge({ gradeBand }: GradeBadgeProps) {
  let bgClass = "";
  let textClass = "";

  switch (gradeBand) {
    case "6-8":
      bgClass = "bg-[#FFF1DD]";
      textClass = "text-[#8A4B04]";
      break;
    case "K-5":
      bgClass = "bg-[#F0EAFB]";
      textClass = "text-[#4D1C9A]";
      break;
    case "9-12":
      bgClass = "bg-[#E3F5E3]";
      textClass = "text-[#1D6B1D]";
      break;
    default:
      bgClass = "bg-slate-100";
      textClass = "text-slate-600";
  }

  return (
    <span
      className={`inline-flex items-center justify-center text-[11px] font-semibold font-sans px-2 py-0.5 rounded-full select-none ${bgClass} ${textClass}`}
    >
      {gradeBand}
    </span>
  );
}

// ==========================================
// 2. FlagBadge Component
// ==========================================
export type FlagColorType = "orange" | "red" | string;

interface FlagBadgeProps {
  text: string;
  color: FlagColorType;
}

function FlagBadge({ text, color }: FlagBadgeProps) {
  let bgClass = "";
  let textClass = "";

  switch (color) {
    case "orange":
      bgClass = "bg-[#FFECD1]";
      textClass = "text-[#D97706]";
      break;
    case "red":
      bgClass = "bg-[#FDEAEA]";
      textClass = "text-[#D8201D]";
      break;
    default:
      bgClass = "bg-slate-100";
      textClass = "text-slate-600";
  }

  return (
    <span
      className={`inline-flex items-center justify-center text-[11px] font-semibold font-sans px-2.5 py-0.5 rounded-full select-none ${bgClass} ${textClass}`}
    >
      {text}
    </span>
  );
}

// ==========================================
// 3. TableHeader Component
// ==========================================
function TableHeader() {
  return (
    <thead className="bg-[#FAF9F6] border-b border-[#EFEDE8]">
      <tr>
        <th className="text-left text-[11px] font-medium text-[#9A9A9A] font-sans py-3 px-4">
          School
        </th>
        <th className="text-left text-[11px] font-medium text-[#9A9A9A] font-sans py-3 px-4">
          Grade Band
        </th>
        <th className="text-left text-[11px] font-medium text-[#9A9A9A] font-sans py-3 px-4">
          Period
        </th>
        <th className="text-left text-[11px] font-medium text-[#9A9A9A] font-sans py-3 px-4">
          Flag
        </th>
        <th className="text-left text-[11px] font-medium text-[#9A9A9A] font-sans py-3 px-4">
          Waiting
        </th>
        <th className="py-3 px-4 w-20" aria-label="Actions"></th>
      </tr>
    </thead>
  );
}

// ==========================================
// 4. TableRow Component
// ==========================================
export interface ReportRowData {
  school: string;
  gradeBand: GradeBandType;
  period: string;
  flagText: string;
  flagColor: FlagColorType;
  waiting: string;
}

interface TableRowProps {
  rowData: ReportRowData;
}

function TableRow({ rowData }: TableRowProps) {
  return (
    <tr className="border-b border-[#EFEDE8] hover:bg-[#FAF9F6]/50 transition-colors">
      <td className="text-[14px] font-medium text-[#2B2B2B] font-secondary py-3.5 px-4">
        {rowData.school}
      </td>
      <td className="py-3.5 px-4">
        <GradeBadge gradeBand={rowData.gradeBand} />
      </td>
      <td className="text-[14px] font-normal text-[#6D6D6D] font-secondary py-3.5 px-4">
        {rowData.period}
      </td>
      <td className="py-3.5 px-4">
        <FlagBadge text={rowData.flagText} color={rowData.flagColor} />
      </td>
      <td className="text-[14px] font-normal text-[#6D6D6D] font-secondary py-3.5 px-4">
        {rowData.waiting}
      </td>
      <td className="py-3.5 px-4 text-right">
        <button className="text-[13px] font-medium text-[#6D28D9] font-secondary hover:underline cursor-pointer">
          Review
        </button>
      </td>
    </tr>
  );
}

// ==========================================
// 5. Main ReportsTable Component
// ==========================================
const MOCK_REPORTS: ReportRowData[] = [
  {
    school: "Sample Middle School",
    gradeBand: "6-8",
    period: "Fall 2025",
    flagText: "Low response count",
    flagColor: "orange",
    waiting: "2h",
  },
  {
    school: "Riverside Elementary",
    gradeBand: "K-5",
    period: "Fall 2025",
    flagText: "AI language check",
    flagColor: "red",
    waiting: "5h",
  },
  {
    school: "Lincoln High School",
    gradeBand: "9-12",
    period: "Fall 2025",
    flagText: "QC check failed",
    flagColor: "orange",
    waiting: "1d",
  },
  {
    school: "DeKalb Brilliance Academy",
    gradeBand: "K-5",
    period: "Fall 2025",
    flagText: "Manual review",
    flagColor: "red",
    waiting: "1d",
  },
  {
    school: "Oakwood Middle",
    gradeBand: "6-8",
    period: "Fall 2025",
    flagText: "Methodology change",
    flagColor: "orange",
    waiting: "2d",
  },
];

export function ReportsTable() {
  return (
    <div className="bg-white rounded-xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col h-full">
      {/* Table Header Section */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-[#EFEDE8]">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-semibold text-[#2B2B2B] font-sans">
            Reports awaiting review
          </h2>
          <span className="inline-flex items-center justify-center text-[11px] font-bold font-sans text-slate-500 bg-slate-100 h-5 px-1.5 rounded-full select-none">
            5
          </span>
        </div>
        <button className="text-[13px] font-medium text-[#6D28D9] font-secondary hover:underline cursor-pointer">
          View all
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <TableHeader />
          <tbody>
            {MOCK_REPORTS.map((report, index) => (
              <TableRow key={index} rowData={report} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
