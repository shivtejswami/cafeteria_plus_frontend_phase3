'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/district/shared/EmptyState';
import { SCHOOL_ADMINISTRATORS, initialsOf } from '@/constants/districtData';

const STATUS_STYLE: Record<string, string> = {
  active: 'border-emerald-100 bg-[#E8F5E9] text-sage',
  pending: 'border-orange-100 bg-[#FFECD1] text-gold',
  deactivated: 'border-red-100 bg-white text-red-600',
  vacant: 'border-orange-100 bg-[#FFECD1] text-gold',
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  pending: 'Pending activation',
  deactivated: 'Deactivated',
  vacant: 'Vacant',
};

/** "District dashboard>school>view>administrator" (2226:9756). */
export function SchoolAdministrator({ schoolId }: { schoolId: string }) {
  const administrator = SCHOOL_ADMINISTRATORS.find((a) => a.schoolId === schoolId);

  if (!administrator?.name) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <EmptyState
          icon={<Users className="w-5 h-5" />}
          title="Nobody administers this school"
          description="A school needs an administrator before it can run a survey. Assign one from the People screen."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-sage-50 text-sage flex items-center justify-center text-lg font-bold shrink-0">
            {initialsOf(administrator.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">{administrator.name}</h2>
              <span
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLE[administrator.status]}`}
              >
                {STATUS_LABEL[administrator.status]}
              </span>

            </div>

            <p className="ml-0.5 text-sm text-muted">{administrator.email}</p>
            <p className="mt-2 text-sm text-[#9A9A9A]">
              This school's administrator was added when the school was created and has been invited to activate their account.
            </p>
            {administrator.invitedOn && (
              <p className="mt-1 text-sm font-medium text-gold">Invited {administrator.invitedOn} · Expires in 2 days</p>
            )}
          </div>

        </div>


      </div>

      <div className="bg-surface-100 rounded-2xl border border-border p-5 text-sm text-slate-600">
        <div className="flex items-start justify-center gap-3">
          <div className="mt-1"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.83125 11.667C5.0382 11.667 4.28014 11.5153 3.55706 11.212C2.86509 10.9164 2.24892 10.4984 1.70856 9.95783C1.16819 9.41727 0.750288 8.80088 0.454838 8.10866C0.151613 7.38533 0 6.62699 0 5.83366C0 5.04033 0.151613 4.28199 0.454838 3.55866C0.750288 2.86644 1.16819 2.25005 1.70856 1.70949C2.24892 1.16894 2.86509 0.750881 3.55706 0.455325C4.28014 0.151992 5.0382 0.000325203 5.83125 0.000325203C6.6243 0.000325203 7.38236 0.151992 8.10544 0.455325C8.79741 0.750881 9.41358 1.16894 9.95394 1.70949C10.4943 2.25005 10.9122 2.86644 11.2077 3.55866C11.5109 4.28199 11.6625 5.04033 11.6625 5.83366C11.6625 6.62699 11.5109 7.38533 11.2077 8.10866C10.9122 8.80088 10.4943 9.41727 9.95394 9.95783C9.41358 10.4984 8.79741 10.9164 8.10544 11.212C7.38236 11.5153 6.6243 11.667 5.83125 11.667ZM5.83125 10.5003C6.67872 10.5003 7.464 10.2864 8.18707 9.85866C8.88682 9.44644 9.44274 8.89033 9.85481 8.19033C10.2824 7.46699 10.4963 6.68144 10.4963 5.83366C10.4963 4.98588 10.2824 4.20033 9.85481 3.47699C9.44274 2.77699 8.88682 2.22088 8.18707 1.80866C7.464 1.38088 6.67872 1.16699 5.83125 1.16699C4.98378 1.16699 4.1985 1.38088 3.47543 1.80866C2.77568 2.22088 2.21976 2.77699 1.80769 3.47699C1.38006 4.20033 1.16625 4.98588 1.16625 5.83366C1.16625 6.68144 1.38006 7.46699 1.80769 8.19033C2.21976 8.89033 2.77568 9.44644 3.47543 9.85866C4.1985 10.2864 4.98378 10.5003 5.83125 10.5003ZM5.24813 2.91699H6.41437V4.08366H5.24813V2.91699ZM5.24813 5.25033H6.41437V8.75033H5.24813V5.25033Z" fill="#6D6D6D" />
          </svg>
          </div>
          <div>
            This school has one administrator, set when the school was created and invited automatically. You can't add, replace, resend, or revoke school administrators — any changes to the administrator of this school require SFWG assistance.
          </div>
        </div>
      </div>
    </div>
  );
}