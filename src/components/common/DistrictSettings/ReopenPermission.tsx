"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Link as LinkIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import ChangePolicyModal from "./ChangePolicyModal";

type PolicyOption = "direct" | "requested";

export default function ReopenPermission() {
  const [currentPolicy, setCurrentPolicy] = useState<PolicyOption>("requested");
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyOption>("requested");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isDirty = currentPolicy !== selectedPolicy;

  const handleSaveClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmChange = () => {
    setCurrentPolicy(selectedPolicy);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setSelectedPolicy(currentPolicy);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-8">
        <h2 className="text-xl font-semibold text-[#1F1F1F] mb-1">Survey reopen permission</h2>
        <p className="text-sm text-[#7A7A7A] mb-6">Controls how corrections to closed surveys are handled across your district.</p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Option 1 */}
          <div 
            onClick={() => setSelectedPolicy("direct")}
            className={cn(
              "flex-1 p-5 rounded-xl border-2 cursor-pointer transition-colors relative",
              selectedPolicy === "direct" 
                ? "border-[#4F8146] bg-[#F9FCF8]" 
                : "border-[#E8E6E1] bg-white hover:border-[#D1D5DB]"
            )}
          >
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  selectedPolicy === "direct" ? "border-[#4F8146]" : "border-[#C1C1C1]"
                )}>
                  {selectedPolicy === "direct" && <div className="w-2.5 h-2.5 rounded-full bg-[#4F8146]" />}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[#1F1F1F] mb-2 text-sm leading-snug">School administrators can reopen their own closed surveys directly</h3>
                <p className="text-[#545454] text-xs leading-relaxed">
                  School admins do not need district approval. Reopening a closed survey supersedes its current report – a new report version is created after the survey is re-closed.
                </p>
              </div>
            </div>
          </div>

          {/* Option 2 */}
          <div 
            onClick={() => setSelectedPolicy("requested")}
            className={cn(
              "flex-1 p-5 rounded-xl border-2 cursor-pointer transition-colors relative",
              selectedPolicy === "requested" 
                ? "border-[#4F8146] bg-[#F9FCF8]" 
                : "border-[#E8E6E1] bg-[#FAFAFA] hover:border-[#D1D5DB]"
            )}
          >
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  selectedPolicy === "requested" ? "border-[#4F8146]" : "border-[#C1C1C1]"
                )}>
                  {selectedPolicy === "requested" && <div className="w-2.5 h-2.5 rounded-full bg-[#4F8146]" />}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[#1F1F1F] mb-2 text-sm leading-snug">Reopens must be requested and approved by the district administrator</h3>
                <p className="text-[#545454] text-xs leading-relaxed">
                  School admins submit a reopen request that appears in your{" "}
                  <Link href="/district/reopen-requests" className="text-[#5B2DA3] underline underline-offset-2">Reopen requests queue</Link>
                  . You can approve or decline each request. Reopening supersedes the current report.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        {isDirty && (
          <div className="bg-[#FFF9EA] border border-[#FBE6A2] rounded-xl p-4 flex gap-3 mb-6">
            <Info className="text-[#EAB308] mt-0.5 flex-shrink-0" size={18} />
            <div>
              <p className="font-semibold text-[#1F1F1F] text-sm">This change applies to all schools in the district going forward.</p>
              <p className="text-sm text-[#7A7A7A] mt-1">Existing surveys are unaffected. All changes are audit-logged. School administrators will see the updated policy the next time they view a closed survey.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-[#E8E6E1]">
          <Link href="/district/reopen-requests" className="flex items-center gap-2 text-sm text-[#5B2DA3] font-medium hover:underline mb-4 sm:mb-0">
            <LinkIcon size={16} />
            View Reopen requests queue
          </Link>
          <p className="text-xs text-[#989898]">Reopening a closed survey supersedes its report — a new version is created after re-close.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            disabled={!isDirty}
            onClick={handleSaveClick}
            className={cn(
              "px-6 h-11 rounded-full font-medium transition-colors cursor-pointer",
              isDirty
                ? "bg-[#4F8146] hover:bg-[#3f6738] text-white shadow-sm"
                : "bg-[#F5F8F5] text-[#A5C0A1] shadow-none"
            )}
          >
            Save changes
          </Button>
          <Button 
            variant="outline" 
            disabled={!isDirty}
            onClick={handleCancel}
            className={cn(
              "px-6 h-11 rounded-full font-medium cursor-pointer border-[#E8E6E1]",
              !isDirty && "opacity-50 cursor-not-allowed"
            )}
          >
            Cancel
          </Button>
        </div>
        <p className="text-xs text-[#989898]">Changes apply going forward and do not affect closed surveys retroactively. All policy changes are audit-logged.</p>
      </div>

      <ChangePolicyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmChange} 
      />
    </>
  );
}
