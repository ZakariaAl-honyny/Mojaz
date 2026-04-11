"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { FinalDecisionType, FinalizeApplicationRequest } from "@/types/finalApproval.types";
import { finalApprovalService } from "@/services/finalApproval.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinalDecisionModalProps {
  applicationId: string;
  decision: FinalDecisionType;
  gate4Passed: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RETURN_STAGES = [
  { value: "02-Documents", labelKey: "stages.02-Documents" },
  { value: "04-Medical", labelKey: "stages.04-Medical" },
  { value: "06-Theory", labelKey: "stages.06-Theory" },
  { value: "07-Practical", labelKey: "stages.07-Practical" },
];

export function FinalDecisionModal({
  applicationId,
  decision,
  gate4Passed,
  onClose,
  onSuccess,
}: FinalDecisionModalProps) {
  const t = useTranslations("final-approval");
  const [step, setStep] = useState<"form" | "confirm" | "success" | "error">("form");
  const [formData, setFormData] = useState<FinalizeApplicationRequest>({
    decision,
    reason: "",
    returnToStage: "",
    managerNotes: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const mutation = useMutation({
    mutationFn: (data: FinalizeApplicationRequest) =>
      finalApprovalService.finalize(applicationId, data),
    onSuccess: () => {
      setStep("success");
    },
    onError: (error: any) => {
      setErrorMessage(error?.message || t("errors.submitFailed"));
      setStep("error");
    },
  });

  const isReasonRequired = decision === FinalDecisionType.Rejected || decision === FinalDecisionType.Returned;
  const isReturnStageRequired = decision === FinalDecisionType.Returned;

  // Block approval if Gate4 not passed
  const canApprove = decision !== FinalDecisionType.Approved || gate4Passed;

  const handleSubmit = () => {
    if (isReasonRequired && !formData.reason?.trim()) {
      return;
    }
    if (isReturnStageRequired && !formData.returnToStage) {
      return;
    }
    setStep("confirm");
  };

  const handleConfirm = () => {
    mutation.mutate(formData);
  };

  const getDecisionIcon = () => {
    switch (decision) {
      case FinalDecisionType.Approved:
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case FinalDecisionType.Rejected:
        return <XCircle className="w-16 h-16 text-red-500" />;
      case FinalDecisionType.Returned:
        return <ArrowLeft className="w-16 h-16 text-amber-500" />;
    }
  };

  const getDecisionTitle = () => {
    switch (decision) {
      case FinalDecisionType.Approved:
        return t("confirm.approve");
      case FinalDecisionType.Rejected:
        return t("confirm.reject");
      case FinalDecisionType.Returned:
        return t("confirm.return");
    }
  };

  const getDecisionMessage = () => {
    switch (decision) {
      case FinalDecisionType.Approved:
        return t("confirm.approveMessage");
      case FinalDecisionType.Rejected:
        return t("confirm.rejectMessage");
      case FinalDecisionType.Returned:
        return t("confirm.returnMessage");
    }
  };

  // Success State
  if (step === "success") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Card className="w-full max-w-md p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">{t("messages.success")}</h3>
          <p className="text-gray-500 mb-6">
            {decision === FinalDecisionType.Approved && "Application has been approved and moved to payment stage."}
            {decision === FinalDecisionType.Rejected && "Application has been permanently rejected."}
            {decision === FinalDecisionType.Returned && "Application has been returned to the specified stage."}
          </p>
          <Button onClick={onSuccess} className="w-full">
            {t("common.continue")}
          </Button>
        </Card>
      </div>
    );
  }

  // Error State
  if (step === "error") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">{t("errors.submitFailed")}</h3>
          <p className="text-red-500 mb-6">{errorMessage}</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {t("common.cancel")}
            </Button>
            <Button onClick={() => setStep("form")} className="flex-1">
              {t("common.tryAgain")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Confirm State
  if (step === "confirm") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="flex justify-center mb-4">{getDecisionIcon()}</div>
          <h3 className="text-2xl font-bold mb-2">{getDecisionTitle()}</h3>
          <p className="text-gray-500 mb-6">{getDecisionMessage()}</p>
          
          {formData.reason && (
            <div className="text-left bg-gray-50 dark:bg-gray-900 p-3 rounded-lg mb-6">
              <p className="text-sm text-gray-500">{t("form.reason")}:</p>
              <p className="font-medium">{formData.reason}</p>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
              {t("common.back")}
            </Button>
            <Button 
              onClick={handleConfirm} 
              className={cn(
                "flex-1",
                decision === FinalDecisionType.Approved && "bg-green-600 hover:bg-green-700",
                decision === FinalDecisionType.Rejected && "bg-red-600 hover:bg-red-700",
                decision === FinalDecisionType.Returned && "bg-amber-600 hover:bg-amber-700"
              )}
              disabled={mutation.isPending}
            >
              {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("common.confirm")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Form State
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">{getDecisionTitle()}</h3>
            <p className="text-sm text-gray-500">{t("gate4.title")}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XCircle className="w-5 h-5" />
          </Button>
        </div>

        {/* Block approval if Gate4 failed */}
        {!canApprove && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950/30 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 font-medium">
              {t("messages.gate4Failed")}
            </p>
            <p className="text-sm text-red-500 mt-1">
              Cannot approve - some Gate 4 conditions are not met.
            </p>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Reason - Required for Reject/Return */}
          <div>
            <Label htmlFor="reason">
              {t("form.reason")} {isReasonRequired && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id="reason"
              placeholder={t("form.reasonPlaceholder")}
              value={formData.reason || ""}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className={cn(
                isReasonRequired && "border-red-300 focus:border-red-500"
              )}
              rows={3}
            />
            {isReasonRequired && !formData.reason?.trim() && (
              <p className="text-sm text-red-500 mt-1">{t("form.reasonRequired")}</p>
            )}
          </div>

          {/* Return Stage - Required for Return only */}
          {decision === FinalDecisionType.Returned && (
            <div>
              <Label htmlFor="returnToStage">
                {t("form.returnToStage")} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <select
                  id="returnToStage"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  value={formData.returnToStage || ""}
                  onChange={(e) => setFormData({ ...formData, returnToStage: e.target.value })}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1rem"
                  }}
                >
                  <option value="">{t("form.selectStage")}</option>
                  {RETURN_STAGES.map((stage) => (
                    <option key={stage.value} value={stage.value}>
                      {t(stage.labelKey)}
                    </option>
                  ))}
                </select>
              </div>
              {!formData.returnToStage && (
                <p className="text-sm text-red-500 mt-1">{t("form.reasonRequired")}</p>
              )}
            </div>
          )}

          {/* Manager Notes - Optional */}
          <div>
            <Label htmlFor="managerNotes">{t("form.managerNotes")}</Label>
            <Textarea
              id="managerNotes"
              placeholder={t("form.managerNotesPlaceholder")}
              value={formData.managerNotes || ""}
              onChange={(e) => setFormData({ ...formData, managerNotes: e.target.value })}
              rows={2}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {t("common.cancel")}
          </Button>
          <Button 
            onClick={handleSubmit}
            className={cn(
              "flex-1",
              decision === FinalDecisionType.Approved && "bg-green-600 hover:bg-green-700",
              decision === FinalDecisionType.Rejected && "bg-red-600 hover:bg-red-700",
              decision === FinalDecisionType.Returned && "bg-amber-600 hover:bg-amber-700"
            )}
            disabled={
              (isReasonRequired && !formData.reason?.trim()) ||
              (isReturnStageRequired && !formData.returnToStage) ||
              !canApprove
            }
          >
            {t("common.continue")}
          </Button>
        </div>
      </Card>
    </div>
  );
}