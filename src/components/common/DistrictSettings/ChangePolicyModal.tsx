"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface ChangePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ChangePolicyModal({ isOpen, onClose, onConfirm }: ChangePolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] p-6 relative">
        <h2 className="text-lg font-semibold text-[#1F1F1F] mb-3">Change reopen policy?</h2>
        
        <p className="text-sm text-[#545454] leading-relaxed mb-4">
          School administrators will be able to reopen their own closed surveys without district approval. This applies to all schools in the district.
        </p>
        <p className="text-sm text-[#7A7A7A] leading-relaxed mb-8">
          This change will be audit-logged. Existing surveys are unaffected.
        </p>

        <div className="flex items-center gap-3 justify-end">
          <Button 
            variant="outline" 
            className="px-5 h-10 text-[#545454] border-[#E8E6E1] hover:bg-gray-50 rounded-full font-medium"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            className="px-5 h-10 bg-[#4F8146] hover:bg-[#3f6738] text-white rounded-full font-medium shadow-sm"
            onClick={onConfirm}
          >
            Change policy
          </Button>
        </div>
      </div>
    </div>
  );
}
