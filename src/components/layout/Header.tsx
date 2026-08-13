"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { DASHBOARD_CONFIG } from "@/constants/navigation";
import { NotificationBell } from "@/components/common/NotificationBell";
import { resolvePageMeta } from "@/constants/pageMeta";
import { UserDropdown } from "@/components/common/UserDropdown";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState<string | null>(null);

  // Determine the current dashboard type from the URL
  const dashboardType = pathname?.startsWith("/admin")
    ? "admin"
    : pathname?.startsWith("/school")
      ? "school"
      : "district";

  const config = DASHBOARD_CONFIG[dashboardType];

  // Mock data based on dashboard type for UI purposes
  const profileInitials = dashboardType === "admin" ? "EM" : dashboardType === "school" ? "SN" : "KL";
  const notificationCount = pathname === "/admin/system-status" ? "1" : (dashboardType === "admin" ? "3" : dashboardType === "school" ? "2" : "1");

  // Dynamic header title and subtitle.
  // District routes are driven by the route map in constants/pageMeta so the
  // header matches the Figma HEADER-4 frame on every screen. Other dashboards
  // keep their existing behaviour.
  const meta = resolvePageMeta(pathname ?? "");
  const title = meta?.title ?? "";
  const subtitle = meta?.subtitle ?? "";

  useEffect(() => {
    // Check initial state
    const stored = sessionStorage.getItem("viewingInstrumentTitle");
    if (stored) {
      setCustomTitle(stored);
    }

    const handleTitleChange = () => {
      const active = sessionStorage.getItem("viewingInstrumentTitle");
      setCustomTitle(active || null);
    };

    window.addEventListener("view-instrument-change", handleTitleChange);
    return () => {
      window.removeEventListener("view-instrument-change", handleTitleChange);
    };
  }, []);

  const displayTitle = customTitle || title;
  const displaySubtitle = customTitle ? "" : subtitle;

  return (
    <>
      <header className="h-16 bg-[#FFFFFF] border-b border-[#E8E6E1] flex items-center justify-between px-4 md:px-6">
      {/* Left Side: Mobile Menu Button & Breadcrumb */}
      <div className="flex items-center space-x-3 md:w-1/3 min-w-0">
        <button
          className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg focus:outline-none"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <LucideIcons.Menu className="h-5 w-5" />
        </button>
        
        <div className="flex items-center space-x-2 truncate">
          
          <div className="flex flex-col justify-center truncate">
            {title && <h1 className="text-[15px] font-bold text-slate-800 truncate">{title}</h1>}
            {/* {subtitle && <p className="text-[12px] text-slate-400 font-medium truncate">{subtitle}</p>} */}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4 md:space-x-6 min-w-0 flex-shrink-0">
        
        {/* Search Bar for Admin */}
        {dashboardType === "admin" && (
          <div className="hidden md:flex relative w-[160px] lg:w-[280px] h-[36px]">
            <input
              type="text"
              placeholder="Search customers, schools, surveys..."
              className="w-full h-[36px] pt-px pr-[17px] pb-px pl-[37px] bg-[#FAF9F6] border border-[#E8E6E1] rounded-[10px] rotate-0 opacity-100 text-[13px] text-slate-700 placeholder-slate-400 placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-[#392467]/30 focus:border-[#392467]"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}

          {/* Notification Area */}
          {/* Notifications */}
          <NotificationBell count={Number(notificationCount)} />

          {/* User Profile Menu */}
          <UserDropdown initials={profileInitials} />
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-64 bg-gradient-to-b from-[#2E115B] to-[#3C1677] h-full shadow-xl flex flex-col overflow-y-auto">
            <div className="h-16 flex items-center px-4 border-b border-[#3C1677] justify-between">
              <span className="text-white font-bold">Cafeteria Plus</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/70 hover:text-white">
                <LucideIcons.X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-4 py-4">
              <div className="bg-[#4D3382] rounded-full px-3 py-1.5 text-[11px] font-semibold text-white mb-6 truncate w-max max-w-full">
                {config?.title || "Dashboard"}
              </div>
              <nav className="flex-1 space-y-1">
                {config?.links.map((link) => {
                  const isActive = link.href === `/${dashboardType}` ? pathname === `/${dashboardType}` : pathname?.startsWith(link.href);
                  const Icon = (LucideIcons as any)[link.icon];
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-colors ${isActive ? "bg-[#4D3382] text-white font-medium" : "text-slate-300 hover:bg-[#4D3382]/50"
                        }`}
                    >
                      {Icon && <Icon className="w-4 h-4" strokeWidth={2.5} />}
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
