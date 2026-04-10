"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Gate4ValidationResult, FinalDecisionType, ApplicationDecision } from "@/types/finalApproval.types";
import { finalApprovalService } from "@/services/finalApproval.service";
import { Gate4Checklist } from "./Gate4Checklist";
import { FinalDecisionModal } from "./FinalDecisionModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinalApprovalPanelProps {
  applicationId: string;
  isEditable?: boolean;
}

export function FinalApprovalPanel({ applicationId, isEditable = true }: FinalApprovalPanelProps) {
  const t = useTranslations("final-approval");
  const [showModal, setShowModal] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<FinalDecisionType | null>(null);

  const {
    data: gate4Result,
    isLoading,
    error,
    refetch
  } = useQuery<Gate4ValidationResult>({
    queryKey: ["gate4", applicationId],
    queryFn: () => finalApprovalService.getGate4Status(applicationId),
    enabled: !!applicationId,
    refetchOnMount: true,
  });

  const handleDecisionSelect = (decision: FinalDecisionType) => {
    setSelectedDecision(decision);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (error || !gate4Result) {
    return (
      <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-950/20">
        <div className="text-center text-red-600 dark:text-red-400">
          <p className="font-medium">{t("errors.loadFailed")}</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            {t("common.retry")}
          </Button>
        </div>
      </Card>
    );
  }

  const canApprove = gate4Result.isFullyPassed;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("gate4.title")}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t("gate4.subtitle")}</p>
        </div>
      </div>

      {/* Gate 4 Checklist */}
      <Gate4Checklist result={gate4Result} />

      {/* Action Buttons - Only show if editable */}
      {isEditable && (
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <Button
            onClick={() => handleDecisionSelect(FinalDecisionType.Approved)}
            disabled={!canApprove}
            className={cn(
              "flex-1 min-w-[140px]",
              canApprove
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
            )}
          >
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t("actions.approve")}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleDecisionSelect(FinalDecisionType.Rejected)}
            className="flex-1 min-w-[140px] border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:hover:bg-red-950"
          >
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {t("actions.reject")}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleDecisionSelect(FinalDecisionType.Returned)}
            className="flex-1 min-w-[140px] border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300 dark:border-amber-800 dark:hover:bg-amber-950"
          >
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            {t("actions.return")}
          </Button>
        </div>
      )}

      {/* Decision Modal */}
      {showModal && selectedDecision && (
        <FinalDecisionModal
          applicationId={applicationId}
          decision={selectedDecision}
          gate4Passed={gate4Result.isFullyPassed}
          onClose={() => {
            setShowModal(false);
            setSelectedDecision(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setSelectedDecision(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}