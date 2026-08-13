"use client";

import React from "react";
import { ClipboardList, FileText, Users, Building2 } from "lucide-react";
import { StatCard } from '@/components/ui/StatCard';
import { getSchool, SCHOOL_SURVEYS, SCHOOL_ADMINISTRATORS, participationRate } from '@/constants/districtData';

export function SchoolHeader({ schoolId }: { schoolId: string }) {
  const school = getSchool(schoolId);
  if (!school) return null;

  const surveys = SCHOOL_SURVEYS.filter((s) => s.schoolId === schoolId);
  const activeCount = surveys.filter((s) => s.status === 'open').length;
  const reportCount = surveys.filter((s) => s.status === 'published' || s.status === 'ready').length;
  const administrator = SCHOOL_ADMINISTRATORS.find((a) => a.schoolId === schoolId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        title="Active surveys"
        value={activeCount}
        icon={<svg width="16" height="16" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.625 12.5H0.625C0.45 12.5 0.302083 12.4396 0.18125 12.3187C0.0604167 12.1979 0 12.05 0 11.875V0.625C0 0.45 0.0604167 0.302083 0.18125 0.18125C0.302083 0.0604162 0.45 0 0.625 0H10.625C10.8 0 10.9479 0.0604162 11.0688 0.18125C11.1896 0.302083 11.25 0.45 11.25 0.625V11.875C11.25 12.05 11.1896 12.1979 11.0688 12.3187C10.9479 12.4396 10.8 12.5 10.625 12.5ZM10 11.25V1.25H1.25V11.25H10ZM3.125 3.125H8.125V4.375H3.125V3.125ZM3.125 5.625H8.125V6.875H3.125V5.625ZM3.125 8.125H8.125V9.375H3.125V8.125Z" fill="#586D4D" />
        </svg>
        }
        iconBgColor="bg-[#E3F5E3]"
        className="border-t-3"
      />
      <StatCard
        title="Reports this term"
        value={reportCount}
        icon={<svg width="16" height="16" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3.125H6.25V9.375H5V3.125ZM7.5 5.625H8.75V9.375H7.5V5.625ZM2.5 6.875H3.75V9.375H2.5V6.875ZM7.5 1.25H1.25V11.25H10V3.75H7.5V1.25ZM0 0.625C0 0.45 0.0604167 0.302083 0.18125 0.18125C0.302083 0.0604162 0.45 0 0.625 0H8.125L11.25 3.125V11.875C11.25 12.0417 11.1896 12.1875 11.0688 12.3125C10.9479 12.4375 10.8 12.5 10.625 12.5H0.625C0.45 12.5 0.302083 12.4396 0.18125 12.3187C0.0604167 12.1979 0 12.05 0 11.875V0.625Z" fill="#6D28D9" />
        </svg>
        }
        iconBgColor="bg-[#F0EAFB]"
        iconTextColor="text-purple-600"
        className="border-t-3"

      />
      <StatCard
        title="Latest participation"
        value={
          school.responses && school.target
            ? `${school.responses} · ${participationRate(school.responses, school.target)}%`
            : '–'
        }
        icon={<svg width="16" height="16" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 8.12539V9.37539C4.325 9.37539 3.69583 9.54622 3.1125 9.88789C2.54583 10.2212 2.09583 10.6671 1.7625 11.2254C1.42083 11.8087 1.25 12.4421 1.25 13.1254H0C0 12.2171 0.229167 11.3754 0.6875 10.6004C1.12917 9.84206 1.725 9.24206 2.475 8.80039C3.25 8.35039 4.09167 8.12539 5 8.12539ZM5 7.50039C4.325 7.50039 3.69583 7.32956 3.1125 6.98789C2.54583 6.65456 2.09583 6.20456 1.7625 5.63789C1.42083 5.05456 1.25 4.42331 1.25 3.74414C1.25 3.06497 1.42083 2.43372 1.7625 1.85039C2.09583 1.29206 2.54583 0.846225 3.1125 0.512892C3.69583 0.171225 4.32708 0.000391006 5.00625 0.000391006C5.68542 0.000391006 6.31667 0.171225 6.9 0.512892C7.45833 0.846225 7.90417 1.29206 8.2375 1.85039C8.57917 2.43372 8.75 3.06497 8.75 3.74414C8.75 4.42331 8.57917 5.05456 8.2375 5.63789C7.90417 6.20456 7.45833 6.65456 6.9 6.98789C6.31667 7.32956 5.68333 7.50039 5 7.50039ZM5 6.25039C5.45 6.25039 5.86667 6.13789 6.25 5.91289C6.63333 5.68789 6.9375 5.38372 7.1625 5.00039C7.3875 4.61706 7.5 4.20039 7.5 3.75039C7.5 3.30039 7.3875 2.88372 7.1625 2.50039C6.9375 2.11706 6.63333 1.81289 6.25 1.58789C5.86667 1.36289 5.45 1.25039 5 1.25039C4.55 1.25039 4.13333 1.36289 3.75 1.58789C3.36667 1.81289 3.0625 2.11706 2.8375 2.50039C2.6125 2.88372 2.5 3.30039 2.5 3.75039C2.5 4.20039 2.6125 4.61706 2.8375 5.00039C3.0625 5.38372 3.36667 5.68789 3.75 5.91289C4.13333 6.13789 4.55 6.25039 5 6.25039ZM8.75 12.8129L6.9125 13.7754L7.2625 11.7254L5.775 10.2879L7.8375 9.98789L8.75 8.12539L9.675 9.98789L11.725 10.2879L10.2375 11.7254L10.5875 13.7754L8.75 12.8129Z" fill="#586D4D" />
        </svg>
        }
        iconBgColor="bg-[#E3F5E3]"
        iconTextColor="text-emerald-600"
        className="border-t-3"

      />
      <StatCard
        title="Level · Enrolment"
        value={school.level}
        subtext={school.enrolmentBand}
        icon={<svg width="16" height="16" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 10H13.75V11.25H0V10H1.25V0.625C1.25 0.45 1.31042 0.302083 1.43125 0.18125C1.55208 0.0604162 1.7 0 1.875 0H8.125C8.3 0 8.44792 0.0604162 8.56875 0.18125C8.68958 0.302083 8.75 0.45 8.75 0.625V10H11.25V5H10V3.75H11.875C12.05 3.75 12.1979 3.81042 12.3188 3.93125C12.4396 4.05208 12.5 4.2 12.5 4.375V10ZM2.5 1.25V10H7.5V1.25H2.5ZM3.75 5H6.25V6.25H3.75V5ZM3.75 2.5H6.25V3.75H3.75V2.5Z" fill="#6D6D6D" />
        </svg>
        }
        className="border-t-3"
        iconBgColor="bg-[#F1EFEA]"

      />
    </div>
  );
}

export default SchoolHeader;
