'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Check, Plus, ChevronDown } from 'lucide-react';
import { SchoolCovered } from '../types';

interface ManageSchoolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schools: SchoolCovered[];
  customerName: string;
  onSave: (updatedSchools: SchoolCovered[]) => void;
}

const SCHOOL_LEVELS: ('Elementary' | 'Middle' | 'High')[] = ['Elementary', 'Middle', 'High'];

export function ManageSchoolsModal({
  isOpen,
  onClose,
  schools: initialSchools,
  customerName,
  onSave,
}: ManageSchoolsModalProps) {
  const [schools, setSchools] = useState<SchoolCovered[]>(initialSchools);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolLevel, setNewSchoolLevel] = useState<'Elementary' | 'Middle' | 'High'>('Elementary');
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const levelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (levelRef.current && !levelRef.current.contains(event.target as Node)) {
        setIsLevelOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleToggleActive = (id: string) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const handleAddSchool = () => {
    if (!newSchoolName.trim()) return;
    const newSchool: SchoolCovered = {
      id: `sch-custom-${Date.now()}`,
      name: newSchoolName.trim(),
      level: newSchoolLevel,
      isActive: true,
    };
    setSchools((prev) => [...prev, newSchool]);
    setNewSchoolName('');
  };

  const handleSave = () => {
    onSave(schools);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-sans">
      <div
        className="fixed inset-0 modal-backdrop animate-in fade-in duration-200 cursor-pointer"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md sm:max-w-lg bg-[#FFFFFF] rounded-3xl shadow-2xl p-6 sm:p-7 border border-[#E8E6E1] z-10 animate-in zoom-in-95 fade-in duration-200 flex flex-col max-h-[90vh]">
        {/* Title */}
        <h2 className="text-[20px] font-bold text-[#1F1F1F] font-sans leading-tight">
          Manage schools
        </h2>
        <p className="text-[12px] text-slate-500 font-secondary mt-0.5">
          {customerName}
        </p>

        {/* School List */}
        <div className="py-4 space-y-2 overflow-y-auto custom-scrollbar flex-1 max-h-[320px]">
          {schools.map((sch) => (
            <div
              key={sch.id}
              onClick={() => handleToggleActive(sch.id)}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                sch.isActive
                  ? 'bg-[#E5F5E5] border-[#C5E5C5] text-[#1D6B1D]'
                  : 'bg-[#FAF9F6] border-[#E8E6E1] text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    sch.isActive
                      ? 'bg-[#1D6B1D] border-[#1D6B1D] text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {sch.isActive && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                </div>
                <span className="text-[13px] font-bold font-sans">{sch.name}</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white/70">
                {sch.level}
              </span>
            </div>
          ))}
        </div>

        {/* Add school inline with custom level dropdown */}
        <div className="pt-3 border-t border-[#EFEDE8] flex items-center gap-2">
          <input
            type="text"
            value={newSchoolName}
            onChange={(e) => setNewSchoolName(e.target.value)}
            placeholder="Add new school name..."
            className="flex-1 px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs sm:text-sm font-sans placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />

          {/* Custom Level Dropdown */}
          <div className="relative shrink-0" ref={levelRef}>
            <button
              type="button"
              onClick={() => setIsLevelOpen(!isLevelOpen)}
              className="px-3 py-2.5 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-sans text-slate-700 focus:outline-none focus:ring-0 flex items-center gap-1.5 cursor-pointer select-none"
            >
              <span>{newSchoolLevel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isLevelOpen && (
              <div className="absolute bottom-full mb-1.5 right-0 w-32 bg-white border border-[#E8E6E1] rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden font-sans">
                {SCHOOL_LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setNewSchoolLevel(lvl);
                      setIsLevelOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                      newSchoolLevel === lvl
                        ? 'bg-[#F5F0FA] text-[#6D28D9] font-bold'
                        : 'text-slate-700 hover:bg-[#FAF9F6]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddSchool}
            className="px-3.5 py-2.5 bg-[#F2F5F0] hover:bg-[#E5EAE2] text-[#4D6346] border border-[#D2DCD0] rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#EFEDE8] flex items-center justify-end gap-3 mt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#F2F5F0] hover:bg-[#E5EAE2] text-[#4D6346] text-sm font-semibold rounded-full cursor-pointer transition-colors border border-[#D2DCD0]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#4E6547] hover:bg-[#405439] text-white text-sm font-semibold rounded-full cursor-pointer transition-colors shadow-sm"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
