import React from "react";
import Link from "next/link";

export function FooterStatusBar() {
  return (
    <footer className="bg-white rounded-xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
        {/* Analysis pipeline status */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></span>
          <span className="text-[13px] font-normal text-slate-500 font-sans">
            Analysis pipeline:{" "}
            <span className="font-semibold text-[#1D6B1D]">Operational</span>
          </span>
        </div>

        {/* Report generation status */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></span>
          <span className="text-[13px] font-normal text-slate-500 font-sans">
            Report generation:{" "}
            <span className="font-semibold text-[#1D6B1D]">Operational</span>
          </span>
        </div>
      </div>

      <div>
        <Link
          href="/admin/system-status"
          className="text-[13px] font-medium text-[#6D28D9] font-secondary hover:underline cursor-pointer"
        >
          View system status
        </Link>
      </div>
    </footer>
  );
}
