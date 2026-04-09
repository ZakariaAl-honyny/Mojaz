"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { TrainingRecordDto } from "@/types/training.types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ExemptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: TrainingRecordDto;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}

/**
 * ExemptionModal - High-fidelity review interface for Managers.
 * Features a clean ledger-style overlay.
 */
export function ExemptionModal({
  isOpen,
  onClose,
  record,
  onApprove,
  onReject,
}: ExemptionModalProps) {
  const t = useTranslations("training.form");
  const th = useTranslations("training.history");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"view" | "reject">("view");

  if (!isOpen) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onApprove(record.id);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    setIsSubmitting(true);
    try {
      await onReject(record.id, rejectionReason);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-xl shadow-2xl border-none relative overflow-hidden bg-white dark:bg-neutral-950">
        {/* Authority Header Stripe */}
        <div className="h-1 w-full bg-primary-600"></div>
        
        <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 dark:border-neutral-900">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-neutral-500">
            Review Exemption Request
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="py-6 space-y-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800">
            <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-2">{th('applicantInfo')}</h4>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-neutral-700">APP-2025-{record.applicationId.substring(0,8)}</span>
              <span className="text-neutral-500">{record.schoolName}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Exemption Reason</Label>
            <p className="text-sm p-3 bg-white dark:bg-neutral-900 border border-neutral-100 rounded-md text-neutral-700">
              {record.exemptionReason}
            </p>
          </div>

          {mode === "reject" && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <Label htmlFor="rejectionReason" className="text-xs font-bold text-status-error uppercase tracking-widest">
                Rejection Reason (Required)
              </Label>
              <textarea
                id="rejectionReason"
                className="w-full min-h-[100px] p-3 text-sm bg-status-error/5 border border-status-error/20 rounded-md focus:ring-status-error focus:border-status-error outline-none"
                placeholder="Explain why this exemption was rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-3 justify-end bg-neutral-50/50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-900 py-4">
          {mode === "view" ? (
            <>
              <Button 
                variant="outline" 
                className="text-status-error hover:bg-status-error/10 border-status-error/20"
                onClick={() => setMode("reject")}
              >
                <AlertCircle className="w-4 h-4 me-2" />
                Reject
              </Button>
              <Button 
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-8"
                onClick={handleApprove}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    <CheckCircle className="w-4 h-4 me-2" />
                    Approve Exemption
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setMode("view")}>Cancel</Button>
              <Button 
                variant="destructive"
                className="font-bold px-8 shadow-lg shadow-red-900/10"
                disabled={!rejectionReason.trim() || isSubmitting}
                onClick={handleReject}
              >
                Confirm Rejection
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
