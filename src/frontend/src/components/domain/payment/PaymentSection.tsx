"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Landmark, ShieldCheck } from "lucide-react";
import { PaymentGatewaySimulator } from "../application/PaymentGatewaySimulator";
import { PaymentHistoryList } from "./PaymentHistoryList";
import { AnimatePresence } from "framer-motion";

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
    <div className="space-y-10">
      <Card className="border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="text-xl font-black flex items-center gap-4 text-white uppercase tracking-tight">
            <Landmark className="w-6 h-6 text-primary-500" />
            {t("paymentsTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-4 space-y-6">
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center text-center gap-2">
             <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mb-1">Outstanding Balance</p>
             <p className="text-4xl font-black text-white">{amount} <span className="text-lg text-neutral-500 ml-1">SAR</span></p>
          </div>

          <Button 
            className="w-full h-16 rounded-[1.2rem] bg-primary-600 hover:bg-primary-500 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primary-900/40 transition-all active:scale-95"
            onClick={() => {
              setSimulateFailure(false);
              setIsModalOpen(true);
            }}
          >
            Authorize Payment
          </Button>

          <div className="flex items-center justify-center gap-2 pt-2 grayscale opacity-40">
             <ShieldCheck className="w-4 h-4" />
             <span className="text-[8px] font-black uppercase tracking-widest text-white">Sovereign Encryption Active</span>
          </div>
        </CardContent>
      </Card>

      <PaymentHistoryList applicationId={applicationId} />

      <AnimatePresence>
        {isModalOpen && (
          <PaymentGatewaySimulator 
            amount={amount}
            onSuccess={() => handlePaymentSuccess(true)}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
