"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, ArrowLeft } from "lucide-react";
import { PaymentSimModal } from "./PaymentSimModal";
import { PaymentHistoryList } from "./PaymentHistoryList";
import { FeeType, ApplicationStages } from "@/lib/enums";
import { usePaymentStore } from "@/stores/payment-store";
import { cn } from "@/lib/utils";

interface PaymentSectionProps {
  applicationId: number;
  applicationNumber: string;
  licenseCategoryId?: string;
  amount: number;
  currentStage?: string;
  licenseCategoryCode?: string;
}

// Helper to determine fee type based on current stage
const getFeeTypeFromStage = (stage?: string): FeeType => {
  if (stage === ApplicationStages.Stage09IssuancePayment) {
    return FeeType.IssuanceFee;
  }
  return FeeType.ApplicationFee;
};

// Helper to get display amount based on stage and category
const getDisplayAmount = (stage?: string, amount?: number, categoryCode?: string): number => {
  // If we have a valid amount from API, use it
  if (amount && amount > 0) {
    return amount;
  }
  
  // Default amounts based on stage - these would come from API in production
  if (stage === ApplicationStages.Stage09IssuancePayment) {
    // Issuance fee is typically higher
    return 200; // Default issuance fee
  }
  
  // Default application fee
  return 100;
};

// Helper to get stage-specific message
const getStageMessage = (stage?: string): { title: string; description: string } => {
  if (stage === ApplicationStages.Stage09IssuancePayment) {
    return {
      title: "سداد رسوم إصدار رخصة القيادة",
      description: "هذه الرسوم المطلوبة لإصدار رخصة القيادة الجديدة بعد اجتياز جميع الاختبارات",
    };
  }
  
  return {
    title: "سداد الرسوم الحكومية",
    description: "رسوم تقديم طلب رخصة القيادةيشمل رسوم الخدمات الإدارية والفحص",
  };
};

export function PaymentSection({
  applicationId,
  applicationNumber,
  licenseCategoryId,
  amount,
  currentStage,
  licenseCategoryCode,
}: PaymentSectionProps) {

  const { isProcessing } = usePaymentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"card" | "jeeb">("jeeb");

  // Determine fee type and display info based on current stage
  const feeType = getFeeTypeFromStage(currentStage);
  const isIssuancePayment = feeType === FeeType.IssuanceFee;
  const displayAmount = getDisplayAmount(currentStage, amount, licenseCategoryCode);
  const stageMessage = getStageMessage(currentStage);

  const handlePaymentSuccess = (success: boolean) => {
    setIsModalOpen(false);
    if (success) {
      window.location.reload();
    }
  };

  return (
    <div id="payment-section" className="space-y-4 md:space-y-6 font-arabic" dir="rtl">
      <Card className="shadow-2xl shadow-blue-900/5 border-neutral-100 rounded-[2rem] overflow-hidden bg-white">
        <CardHeader className="p-6 md:p-8 border-b border-neutral-50 bg-neutral-50/30">
          <CardTitle className="text-xl md:text-2xl flex items-center gap-4 font-black text-[#1a3a8f]">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-blue-50">
               <CreditCard className="w-6 h-6 text-[#1a3a8f]" />
            </div>
            {stageMessage.title}
          </CardTitle>
          {isIssuancePayment && (
            <p className="text-sm text-neutral-500 font-bold mt-2 pe-16">
              {stageMessage.description}
            </p>
          )}
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-8">
          {/* Payment Method Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedMethod("jeeb")}
              className={cn(
                "relative group flex items-center gap-5 p-6 rounded-[1.5rem] border-2 transition-all duration-500 text-right",
                selectedMethod === "jeeb"
                  ? "border-[#1a3a8f] bg-blue-50/50 shadow-xl shadow-blue-900/5"
                  : "border-neutral-100 hover:border-blue-100 bg-white"
              )}
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                selectedMethod === "jeeb" ? "bg-[#1a3a8f] text-white rotate-6" : "bg-neutral-50 text-neutral-400 group-hover:rotate-6"
              )}>
                <div className="font-black text-xl">ج</div>
              </div>
              <div>
                <h4 className="font-black text-neutral-900 text-lg">محفظة جيب</h4>
                <p className="text-xs font-bold text-neutral-400 mt-1">الدفع السريع والآمن</p>
              </div>
              {selectedMethod === "jeeb" && (
                <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-[#1a3a8f] flex items-center justify-center shadow-lg">
                   <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              )}
            </button>

            <button
              onClick={() => setSelectedMethod("card")}
              className={cn(
                "relative group flex items-center gap-5 p-6 rounded-[1.5rem] border-2 transition-all duration-500 text-right",
                selectedMethod === "card"
                  ? "border-[#1a3a8f] bg-blue-50/50 shadow-xl shadow-blue-900/5"
                  : "border-neutral-100 hover:border-blue-100 bg-white"
              )}
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                selectedMethod === "card" ? "bg-[#1a3a8f] text-white rotate-6" : "bg-neutral-50 text-neutral-400 group-hover:rotate-6"
              )}>
                <CreditCard className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-black text-neutral-900 text-lg">بطاقة بنكية</h4>
                <p className="text-xs font-bold text-neutral-400 mt-1">مدى، فيزا، ماستركارد</p>
              </div>
              {selectedMethod === "card" && (
                <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-[#1a3a8f] flex items-center justify-center shadow-lg">
                   <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              )}
            </button>
          </div>

          <div className="pt-4">
             <Button 
                className="w-full h-16 bg-[#1a3a8f] hover:bg-[#152d6f] text-white border-0 shadow-2xl shadow-blue-900/20 text-lg font-black rounded-2xl transition-all gap-4 group"
                disabled={isProcessing}
                onClick={() => {
                  setSimulateFailure(false);
                  setIsModalOpen(true);
                }}
              >
                {isProcessing ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    سداد {displayAmount.toLocaleString('ar-YE')} ريال
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-[-4px] transition-transform">
                       <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                    </div>
                  </>
                )}
              </Button>

              {/* Simulation Controls - Discreetly styled for internal use */}
              <div className="mt-8 flex justify-center border-t border-dashed border-neutral-100 pt-6">
                <button 
                  className="text-[10px] text-neutral-200 hover:text-red-300 font-bold transition-colors"
                  disabled={isProcessing}
                  onClick={() => {
                    setSimulateFailure(true);
                    setIsModalOpen(true);
                  }}
                >
                  محاكاة فشل العملية (للتطوير فقط)
                </button>
              </div>
          </div>
        </CardContent>
      </Card>

      <PaymentHistoryList applicationNumber={applicationNumber} />

      <PaymentSimModal
        isOpen={isModalOpen}
        onClose={handlePaymentSuccess}
        applicationNumber={applicationNumber}
        feeType={feeType}
        licenseCategoryId={licenseCategoryId}
        amount={displayAmount}
        paymentMethod={selectedMethod}
        shouldSimulateFailure={simulateFailure}
      />
    </div>
  );
}
