"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { paymentService, PaymentDto } from "@/services/payment.service";
import { ReceiptDownloadButton } from "./ReceiptDownloadButton";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { StatusBadge } from "@/components/domain/application/StatusBadge";
import { ApplicationStatus } from "@/types/api.types";
import { CreditCard, Calendar, Hash, Receipt } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useParams } from "next/navigation";

interface PaymentHistoryListProps {
  applicationId: string;
}

export function PaymentHistoryList({ applicationId }: PaymentHistoryListProps) {
  const t = useTranslations("payment");
  const { locale } = useParams();
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const dateLocale = locale === "ar" ? ar : enUS;

  useEffect(() => {
    fetchPayments();
  }, [applicationId]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const res = await paymentService.getPaymentsByApplication(applicationId);
      if (res.success && res.data) {
        setPayments(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (payments.length === 0) {
    return null; // Don't show history if empty, the parent will handle "No payments" message
  }

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 pb-4">
        <CardTitle className="text-xl flex items-center gap-2 text-primary-900">
          <Receipt className="w-5 h-5 text-primary-500" />
          {t("historyTitle") || "Payment History"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-neutral-100">
          {payments.map((payment) => (
            <div key={payment.id} className="p-5 hover:bg-neutral-50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 text-lg">
                        {payment.amount} SAR
                      </span>
                      <StatusBadge 
                        status={getStatusString(payment.status) as ApplicationStatus} 
                      />
                    </div>
                    <div className="text-sm font-medium text-neutral-700">
                      {t(`feeTypes.${payment.feeType}`)}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(payment.createdAt), "PPP", { locale: dateLocale })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5" />
                        {payment.transactionReference}
                      </div>
                    </div>
                  </div>
                </div>

                {payment.status === 1 && ( // Assuming 1 is "Paid"
                  <ReceiptDownloadButton 
                    paymentId={payment.id} 
                    className="md:w-auto w-full" 
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper to map numeric enum to string for StatusBadge
function getStatusString(status: number): string {
  switch (status) {
    case 0: return "Submitted"; // Pending -> Blue
    case 1: return "Approved";  // Paid -> Green
    case 2: return "Rejected";  // Failed -> Red
    default: return "Submitted";
  }
}