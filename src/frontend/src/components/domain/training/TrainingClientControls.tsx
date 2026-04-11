"use client";

import React, { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Loader2 } from "lucide-react";
import { TrainingRecordDto } from "@/types/training.types";
import { useSubmitExemption } from "@/hooks/useTraining";

// Lazy load the exemption modal (bundle-dynamic-imports)
const ExemptionModal = dynamic(
  () => import("./ExemptionModal").then((mod) => mod.ExemptionModal),
  { ssr: false, loading: () => <Loader2 className="w-6 h-6 animate-spin text-primary-600" /> }
);

// We'll also need a RequestModal if employees can *submit* requests.
// For now, let's assume T045 refers to the review modal placeholder or a general exemption action hub.

interface TrainingClientControlsProps {
  record: TrainingRecordDto;
}

/**
 * TrainingClientControls - Client island for interactive training actions (Exemptions).
 */
export function TrainingClientControls({ record }: TrainingClientControlsProps) {
  const t = useTranslations("training.page");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mt-4">
      <Button 
        variant="outline" 
        className="w-full border-dashed border-2 hover:bg-amber-50 hover:border-amber-300 text-amber-700 font-bold transition-all"
        onClick={() => setIsModalOpen(true)}
      >
        <ShieldAlert className="w-4 h-4 me-2" />
        {t('requestExemption')}
      </Button>

      {isModalOpen && (
        <ExemptionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          record={record}
          onApprove={async () => { console.log("Approved"); }}
          onReject={async () => { console.log("Rejected"); }}
        />
      )}
    </div>
  );
}
