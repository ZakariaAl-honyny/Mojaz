"use client";

import { useState, useEffect, useRef } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { paymentService, type FeeType } from "@/services/payment.service";
import { Loader2, CheckCircle2, XCircle, CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";
import { usePaymentStore } from "@/stores/payment-store";

interface PaymentSimModalProps {
  isOpen: boolean;
  onClose: (success: boolean) => void;
  applicationNumber: string;
  feeType: FeeType;
  licenseCategoryId?: string;
  amount: number;
  paymentMethod?: string;
  shouldSimulateFailure?: boolean;
}

export function PaymentSimModal({
  isOpen,
  onClose,
  applicationNumber,
  feeType,
  licenseCategoryId,
  amount,
  paymentMethod = "jeeb",
  shouldSimulateFailure = false,
}: PaymentSimModalProps) {

  const { isProcessing, startProcessing, stopProcessing, clearSession } = usePaymentStore();
  const [step, setStep] = useState<"processing" | "success" | "failure">("processing");
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const hasInitiatedRef = useRef(false);

  useEffect(() => {
    if (isOpen && !hasInitiatedRef.current) {
      hasInitiatedRef.current = true;
      startPaymentFlow();
    }
    if (!isOpen) {
      hasInitiatedRef.current = false;
    }
  }, [isOpen]);

  const startPaymentFlow = async () => {
    try {
      setStep("processing");

      // 1. Initiate basic payment on backend
      const initiateRes = await paymentService.initiatePayment(applicationNumber, {
        feeType,
        licenseCategoryId,
      });

      if (!initiateRes.success || !initiateRes.data) {
        toast.error(initiateRes.message || "فشل في بدء عملية السداد الإلكتروني.");
        onClose(false);
        return;
      }

      const newPaymentId = initiateRes.data.id;
      setPaymentId(newPaymentId);
      
      // Global Lock Started
      startProcessing(newPaymentId);

      // 2. Simulate the 2-second processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 3. Confirm payment based on simulation flag
      const confirmRes = await paymentService.confirmPayment({
        paymentId: newPaymentId,
        paymentMethod: paymentMethod,
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
      stopProcessing();
    }
  };

  const handleFinish = () => {
    // PREVENT: Closing during an active global lock
    if (isProcessing) return;

    onClose(step === "success");
    // Reset state for next time
    setTimeout(() => {
      setStep("processing");
      setPaymentId(null);
      clearSession();
    }, 300);
  };

  const handleRetry = () => {
    startPaymentFlow();
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Prevent closing via backdrop or ESC while processing
        if (!open && isProcessing) return;
        if (!open) handleFinish();
      }}
    >
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
            {step === "processing" && "جاري معالجة عملية السداد"}
            {step === "success" && "تمت عملية السداد بنجاح"}
            {step === "failure" && "فشلت عملية السداد"}
          </DialogTitle>
          
          <DialogDescription className="text-neutral-500 mt-2">
            {step === "processing" && "يرجى الانتظار بينما نقوم بتأكيد العملية مع مزود الخدمة."}
            {step === "success" && `تم سداد مبلغ ${amount.toLocaleString('ar-YE')} ريال بنجاح. سيتم تحديث حالة طلبك فوراً.`}
            {step === "failure" && "لم نتمكن من إتمام عملية السداد. يرجى التأكد من رصيدك أو المحاولة مرة أخرى."}
          </DialogDescription>
        </DialogHeader>

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="w-10 h-10 text-[#1a3a8f] animate-spin mb-4" />
            <span className="text-sm font-black text-[#1a3a8f] animate-pulse">
              جاري الاتصال بمركز الدفع ({paymentMethod === "jeeb" ? "محفظة جيب" : "البطاقة البنكية"})...
            </span>
          </div>
        )}

        <DialogFooter className="sm:justify-center border-t border-neutral-100 pt-6 mt-4">
          {step === "success" && (
            <Button 
              onClick={handleFinish}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-6 rounded-xl transition-all shadow-lg shadow-primary-200"
            >
              موافق
            </Button>
          )}
          {step === "failure" && (
            <div className="flex flex-col gap-3 w-full">
              <Button 
                onClick={handleRetry}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-6 rounded-xl transition-all"
              >
                إعادة المحاولة
              </Button>
              <Button 
                variant="outline" 
                onClick={handleFinish}
                className="w-full border-neutral-200 text-neutral-600 hover:bg-neutral-50 py-6 rounded-xl"
              >
                إغلاق
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}