'use client';

import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2 } from 'lucide-react';

interface UploadBenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (title: string) => void;
}

export function UploadBenchmarkModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: UploadBenchmarkModalProps) {
  const [datasetName, setDatasetName] = useState('');
  const [gradeLevel, setGradeLevel] = useState<'K-5' | '6-8' | '9-12' | 'All'>('K-5');
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!datasetName.trim()) return;
    onUploadSuccess(datasetName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl border border-[#E8E6E1] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 z-10">
        {/* Header */}
        <div className="p-6 border-b border-[#EFEDE8] flex items-center justify-between bg-[#FAF9F6]">
          <div>
            <h3 className="text-xl font-bold text-[#2B2B2B]">Upload benchmark dataset</h3>
            <p className="text-xs text-[#9A9A9A] mt-0.5">
              Upload comparison datasets owned and approved by SFWG.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">
              Dataset Name
            </label>
            <input
              type="text"
              required
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              placeholder="e.g. 2026 National Elementary Benchmark"
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8E6E1] rounded-xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#6D28D9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">
              Grade Level Cohort
            </label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8E6E1] rounded-xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#6D28D9]"
            >
              <option value="K-5">K-5 (Elementary)</option>
              <option value="6-8">6-8 (Middle school)</option>
              <option value="9-12">9-12 (High school)</option>
              <option value="All">All Grades</option>
            </select>
          </div>

          {/* File Upload Box */}
          <div className="border-2 border-dashed border-[#E8E6E1] rounded-2xl p-6 text-center bg-[#FAF9F6] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
            <UploadCloud className="w-8 h-8 text-[#6D28D9] mb-2" />
            <span className="text-sm font-semibold text-[#2B2B2B]">
              Click to select or drop CSV/Excel dataset file
            </span>
            <span className="text-xs text-[#9A9A9A] mt-1">
              Supports .csv, .xlsx up to 25MB
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 border border-[#E8E6E1] rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#586D4D] hover:bg-[#495c3e] rounded-full shadow-sm transition-colors cursor-pointer"
            >
              Upload dataset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
