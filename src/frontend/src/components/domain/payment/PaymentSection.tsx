"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/static-translations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { PaymentSimModal } from "./PaymentSimModal";
import { PaymentHistoryList } from "./PaymentHistoryList";

interface PaymentSectionProps {
  applicationId: string;
  applicationNumber: string;
  licenseCategoryId?: string;
  amount: number;
}

export function PaymentSection({
  applicationId,
  applicationNumber,
  licenseCategoryId,
  amount,
}: PaymentSectionProps) {
  const t = useTranslations("application.details");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);

  const handlePaymentSuccess = (success: boolean) => {
    setIsModalOpen(false);
    if (success) {
      // Refresh logic could go here, e.g., router.refresh() 
      // but for simulation, the HistoryList will re-fetch data on next mount or via cache
      window.location.reload(); // Simple refresh for showcase
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="shadow-sm border-neutral-200 rounded-xl md:rounded-2xl">
        <CardHeader className="p-4 md:p-5 border-b border-neutral-100">
          <CardTitle className="text-base md:text-lg flex items-center gap-2 font-black">
            <CreditCard className="w-5 h-5 text-neutral-500" />
            {t("paymentsTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-5 flex flex-col gap-3">
          <Button 
            className="w-full h-12 md:h-14 bg-[#D4A017] hover:bg-[#b88a14] text-white border-0 shadow-lg shadow-[#D4A017]/10 text-xs md:text-sm font-black rounded-lg md:rounded-xl"
            onClick={() => {
              setSimulateFailure(false);
              setIsModalOpen(true);
            }}
          >
            {t("payButton")} ({amount} SAR)
          </Button>

          {/* Hidden button for developers/testing to simulate failure */}
          <button 
            className="text-[9px] md:text-[10px] text-neutral-300 hover:text-neutral-400 self-center font-bold"
            onClick={() => {
              setSimulateFailure(true);
              setIsModalOpen(true);
            }}
          >
            Simulate Failure
          </button>
        </CardContent>
      </Card>

      <PaymentHistoryList applicationNumber={applicationNumber} />

      <PaymentSimModal
        isOpen={isModalOpen}
        onClose={handlePaymentSuccess}
        applicationNumber={applicationNumber}
        feeType={0} // Default to ApplicationFee for now
        licenseCategoryId={licenseCategoryId}
        amount={amount}
        shouldSimulateFailure={simulateFailure}
      />
    </div>
  );
}
