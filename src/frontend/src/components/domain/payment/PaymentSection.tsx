"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { PaymentSimModal } from "./PaymentSimModal";
import { PaymentHistoryList } from "./PaymentHistoryList";

interface PaymentSectionProps {
  applicationId: string;
  licenseCategoryId?: string;
  amount: number;
}

export function PaymentSection({
  applicationId,
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
    <div className="space-y-6">
      <Card className="shadow-sm border-neutral-200">
        <CardHeader className="pb-3 border-b border-neutral-100">
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-neutral-500" />
            {t("paymentsTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col gap-3">
          <Button 
            className="w-full bg-secondary-500 hover:bg-secondary-600 text-white border-0 shadow py-6"
            onClick={() => {
              setSimulateFailure(false);
              setIsModalOpen(true);
            }}
          >
            {t("payButton")} ({amount} SAR)
          </Button>

          {/* Hidden button for developers/testing to simulate failure */}
          <button 
            className="text-[10px] text-neutral-300 hover:text-neutral-400 self-center"
            onClick={() => {
              setSimulateFailure(true);
              setIsModalOpen(true);
            }}
          >
            Simulate Failure
          </button>
        </CardContent>
      </Card>

      <PaymentHistoryList applicationId={applicationId} />

      <PaymentSimModal
        isOpen={isModalOpen}
        onClose={handlePaymentSuccess}
        applicationId={applicationId}
        feeType={0} // Default to ApplicationFee for now
        licenseCategoryId={licenseCategoryId}
        amount={amount}
        shouldSimulateFailure={simulateFailure}
      />
    </div>
  );
}
