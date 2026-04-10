"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { usePendingExemptions, useApproveExemption, useRejectExemption } from "@/hooks/useTraining";
import { ExemptionCard } from "@/components/domain/training/ExemptionCard";
import { ExemptionModal } from "@/components/domain/training/ExemptionModal";
import { TrainingRecordDto } from "@/types/training.types";
import { Loader2, Inbox } from "lucide-react";

/**
 * ExemptionsQueuePage - Manager view to review all pending training exemptions.
 */
export default function ExemptionsQueuePage() {
  const t = useTranslations("training.page");
  const { data: response, isLoading } = usePendingExemptions();
  const approveMutation = useApproveExemption();
  const rejectMutation = useRejectExemption();
  
  const [selectedRecord, setSelectedRecord] = useState<TrainingRecordDto | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600 mb-4" />
        <p className="text-neutral-500 font-medium">Loading exemption queue...</p>
      </div>
    );
  }

  const items = response?.data || [];

  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">{t('queueTitle')}</h1>
        <p className="text-neutral-500 mt-1">{t('queueSubtitle')}</p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-neutral-100 rounded-2xl p-20 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-neutral-300" />
          </div>
          <h3 className="text-lg font-bold text-neutral-800">{t('noPending')}</h3>
          <p className="text-neutral-500 max-w-sm mt-2 font-medium">All training exemption requests have been processed. Systems are current.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((record) => (
            <ExemptionCard 
              key={record.id} 
              record={record} 
              onReview={() => setSelectedRecord(record)} 
            />
          ))}
        </div>
      )}

      {selectedRecord && (
        <ExemptionModal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          record={selectedRecord}
          onApprove={async (id) => {
            await approveMutation.mutateAsync({ id, data: { actionBy: 'system', notes: 'Approved via manager panel' } });
          }}
          onReject={async (id, reason) => {
            await rejectMutation.mutateAsync({ id, data: { actionBy: 'system', notes: reason } });
          }}
        />
      )}
    </div>
  );
}
