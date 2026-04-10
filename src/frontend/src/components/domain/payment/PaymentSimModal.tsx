"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { paymentService } from "@/services/payment.service";
import { Loader2, CheckCircle2, XCircle, CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";

interface PaymentSimModalProps {
  isOpen: boolean;
  onClose: (success: boolean) => void;
  applicationId: string;
  feeType: number;
  licenseCategoryId?: string;
  amount: number;
  shouldSimulateFailure?: boolean;
}

export function PaymentSimModal({
  isOpen,
  onClose,
  applicationId,
  feeType,
  licenseCategoryId,
  amount,
  shouldSimulateFailure = false,
}: PaymentSimModalProps) {
  const t = useTranslations("payment.modal");
  const [step, setStep] = useState<"processing" | "success" | "failure">("processing");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !isProcessing) {
      startPaymentFlow();
    }
  }, [isOpen]);

  const startPaymentFlow = async () => {
    try {
      setIsProcessing(true);
      setStep("processing");

      // 1. Initiate basic payment on backend
      const initiateRes = await paymentService.initiatePayment(applicationId, {
        feeType,
        licenseCategoryId,
      });

      if (!initiateRes.success || !initiateRes.data) {
        toast.error(initiateRes.message || "Failed to initiate payment");
        onClose(false);
        return;
      }

      const newPaymentId = initiateRes.data.id;
      setPaymentId(newPaymentId);

      // 2. Simulate the 2-second processing delay (US1)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 3. Confirm payment based on simulation flag (US2)
      const confirmRes = await paymentService.confirmPayment({
        paymentId: newPaymentId,
        isSuccessful: !shouldSimulateFailure,
      });

      if (confirmRes.success && !shouldSimulateFailure) {
        setStep("success");
      } else {
        setStep("failure");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setStep("failure");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    onClose(step === "success");
    // Reset state for next time
    setTimeout(() => {
      setStep("processing");
      setPaymentId(null);
    }, 300);
  };

  const handleRetry = () => {
    startPaymentFlow();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleFinish()}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
        <DialogHeader className="items-center text-center pb-2">
          {step === "processing" && (
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <CreditCard className="w-8 h-8 text-primary-500" />
            </div>
          )}
          {step === "success" && (
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          )}
          {step === "failure" && (
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          )}
          
          <DialogTitle className="text-xl font-bold text-neutral-900">
            {step === "processing" && t("processingTitle")}
            {step === "success" && t("successTitle")}
            {step === "failure" && t("errorTitle")}
          </DialogTitle>
          
          <DialogDescription className="text-neutral-500 mt-2">
            {step === "processing" && t("processingMessage")}
            {step === "success" && t("successMessage", { amount, currency: "SAR" })}
            {step === "failure" && t("errorMessage")}
          </DialogDescription>
        </DialogHeader>

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
            <span className="text-sm font-medium text-primary-600 animate-pulse">
              Gateway Connection...
            </span>
          </div>
        )}

        <DialogFooter className="sm:justify-center border-t border-neutral-100 pt-6 mt-4">
          {step === "success" && (
            <Button 
              onClick={handleFinish}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-6 rounded-xl transition-all shadow-lg shadow-primary-200"
            >
              {t("successFinish") || "Done"}
            </Button>
          )}
          {step === "failure" && (
            <div className="flex flex-col gap-3 w-full">
              <Button 
                onClick={handleRetry}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-6 rounded-xl transition-all"
              >
                {t("retryButton") || "Retry"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleFinish}
                className="w-full border-neutral-200 text-neutral-600 hover:bg-neutral-50 py-6 rounded-xl"
              >
                {t("cancelButton") || "Close"}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}