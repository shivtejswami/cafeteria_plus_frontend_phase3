"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { DASHBOARD_CONFIG } from "@/constants/navigation";
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
    <aside className="h-full w-64 bg-gradient-to-b from-[#2E115B] to-[#3C1677] text-slate-200 flex flex-col hidden md:flex border-r border-[#3C1677]">
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

            const Icon = (LucideIcons as any)[link.icon];

            return (
              <div key={link.href} className="relative">
                {isActive && (
                  <div className="absolute -left-2 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-[#7C9A6D]" />
                )}

                <Link
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${isActive
                    ? "bg-[#4D3382] text-white font-medium"
                    : "text-slate-300 hover:bg-[#4D3382]/50"
                    }`}
                >
                  {Icon && <Icon className="h-4 w-4" strokeWidth={2.5} />}
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
