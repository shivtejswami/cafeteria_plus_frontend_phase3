"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { DASHBOARD_CONFIG } from "@/constants/navigation";
import { SIDEBAR_GLYPHS } from "@/components/layout/SidebarIcons";
import * as LucideIcons from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  // Determine the current dashboard type from the URL
  const dashboardType = pathname?.startsWith("/admin")
    ? "admin"
    : pathname?.startsWith("/school")
      ? "school"
      : "district";

  const config = DASHBOARD_CONFIG[dashboardType];

  return (
    // linear-gradient(0deg, #2E115B, #3C1677) — the darker stop sits at the bottom.
    <aside className="h-full w-64 bg-linear-to-t from-[#2E115B] to-[#3C1677] text-slate-200 flex-col hidden md:flex border-r border-[#3C1677]">
      <div className="h-16 flex items-center px-4 border-b border-[#3C1677]">
        <Image src="/sidebarlogo.svg" alt="Cafeteria Plus Logo" width={180} height={40} priority className="object-contain" />
      </div>
      <div className="px-4 py-4">
        <div className="bg-[#4D3382] rounded-full px-3 py-1.5 text-[11px] font-semibold text-white mb-6 truncate w-max max-w-full">
          {config?.title || "Dashboard"}
        </div>
        <nav className="flex-1 space-y-1">
          {config?.links.map((link) => {
            const isActive =
              link.href === `/${dashboardType}`
                ? pathname === `/${dashboardType}`
                : pathname?.startsWith(link.href);

            const Glyph = SIDEBAR_GLYPHS[link.icon];
            const Icon = (LucideIcons as any)[link.icon];

            return (
              <div key={link.href} className="relative">
                {isActive && (
                  <div className="absolute -left-2 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-[#7C9A6D]" />
                )}

                <Link
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[15px] font-medium transition-colors ${isActive
                    ? "bg-white/12 text-white"
                    : "text-white/70 hover:bg-white/8 hover:text-white"
                    }`}
                >
                  {Glyph ? (
                    <Glyph className="h-7 w-5 shrink-0" />
                  ) : (
                    Icon && <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
                  )}
                  <span>{link.name}</span>
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
