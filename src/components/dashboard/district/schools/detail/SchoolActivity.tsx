'use client';

import React, { useState, useMemo } from 'react';
import { Activity, Download, Check } from 'lucide-react';
import { ActivityRow } from '@/components/common/Activity/ActivityRow';
import { EmptyState } from '@/components/dashboard/district/shared/EmptyState';
import { DISTRICT_ACTIVITY } from '@/constants/districtData';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

/** "District dashboard>school>view>activity" (2226:9997). */
export function SchoolActivity({ schoolId }: { schoolId: string }) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [actorFilter, setActorFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [showToast, setShowToast] = useState(false);

  const rawEvents = DISTRICT_ACTIVITY.filter((a) => a.schoolId === schoolId);

  const events = useMemo(() => {
    let result = rawEvents;

    if (categoryFilter !== 'all') {
      result = result.filter(e => {
        const cat = e.category; // categories are already in the correct shape
        if (categoryFilter === 'surveys') return cat === 'survey';
        if (categoryFilter === 'reopen') return cat === 'reopen';
        if (categoryFilter === 'reports') return cat === 'report';
        if (categoryFilter === 'schools') return cat === 'school';
        if (categoryFilter === 'admins') return cat === 'people';
        return true;
      });
    }

    if (actorFilter !== 'all') {
      result = result.filter(e => {
        const actor = e.actor.toLowerCase();
        if (actorFilter === 'district') return actor === 'district admin';
        if (actorFilter === 'school') return actor === 'school admin';
        if (actorFilter === 'sfwg') return actor === 'sfwg';
        if (actorFilter === 'system') return actor === 'system';
        return true;
      });
    }

    // Sort by the relative time string `timeAgo` (mock data). For a mock, string compare is acceptable.
    return result.sort((a, b) => {
      if (sort === 'oldest') {
        return a.timeAgo.localeCompare(b.timeAgo);
      }
      return b.timeAgo.localeCompare(a.timeAgo);
    });
  }, [rawEvents, categoryFilter, actorFilter, sort]);

  const handleExport = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <FilterDropdown
            label="Category"
            options={[
              { value: 'all', label: 'All categories' },
              { value: 'surveys', label: 'Surveys' },
              { value: 'reopen', label: 'Reopen requests' },
              { value: 'reports', label: 'Reports' },
              { value: 'schools', label: 'Schools' },
              { value: 'admins', label: 'Administrators' },
            ]}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />

          <FilterDropdown
            label="Actor"
            options={[
              { value: 'all', label: 'All actors' },
              { value: 'district', label: 'District admin' },
              { value: 'school', label: 'School admin' },
              { value: 'sfwg', label: 'SFWG' },
              { value: 'system', label: 'System' },
            ]}
            value={actorFilter}
            onChange={setActorFilter}
          />

          <FilterDropdown
            label="Sort"
            options={[
              { value: 'newest', label: 'Newest first' },
              { value: 'oldest', label: 'Oldest first' },
            ]}
            value={sort}
            onChange={setSort}
          />
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#5B7963] hover:bg-[#4a6350] text-white text-sm font-medium rounded-full transition-colors whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {events.length === 0 ? (
          <EmptyState
            icon={<Activity className="w-5 h-5" />}
            title="No activity matches your filters"
            description="Try adjusting your category or actor filters."
          />
        ) : (
          <div className="p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Earlier this week</h3>
            <div className="divide-y divide-slate-100">
              {events.map((event) => (
                <ActivityRow key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-white border border-slate-200 shadow-lg rounded-xl px-4 py-3 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-slate-900">Data exported</span>
          <button onClick={() => setShowToast(false)} className="ml-2 text-slate-400 hover:text-slate-600">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
