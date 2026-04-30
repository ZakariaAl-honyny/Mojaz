"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ApplicationService } from "@/services/application.service";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, XCircle, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface ApplicationActionButtonsProps {
  applicationId: string;
  applicationStatus: string;
  token?: string;
}

export function ApplicationActionButtons({ applicationId, applicationStatus, token }: ApplicationActionButtonsProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleScrollToPayment = () => {
    const paymentSection = document.getElementById("payment-section");
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: "smooth", block: "center" });
      
      // Add a brief highlight effect
      paymentSection.classList.add("ring-4", "ring-[#1a3a8f]/20", "transition-all", "duration-500");
      setTimeout(() => {
        paymentSection.classList.remove("ring-4", "ring-[#1a3a8f]/20");
      }, 2000);
    } else {
      toast.info("قسم السداد غير متاح حالياً لهذا الطلب");
    }
  };

  const handleCancelApplication = async () => {
    if (!cancelReason.trim()) {
      toast.error("يرجى ذكر سبب الإلغاء");
      return;
    }

    setIsCancelling(true);
    try {
      const result = await ApplicationService.cancelApplication(applicationId, cancelReason, token);
      if (result.success) {
        toast.success("تم إلغاء الطلب بنجاح");
        setShowCancelDialog(false);
        router.refresh(); // Refresh page to show updated status
      } else {
        toast.error(result.message || "فشل إلغاء الطلب");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء محاولة إلغاء الطلب");
    } finally {
      setIsCancelling(false);
    }
  };

  // Only show buttons if application is not in a terminal state
  const isTerminal = ["Issued", "Cancelled", "Rejected", "Expired"].includes(applicationStatus);
  if (isTerminal) return null;

  return (
    <>
      <div className="flex gap-2 md:gap-4 shrink-0 relative z-10 w-full sm:w-auto">
        <Button 
          variant="outline" 
          onClick={() => setShowCancelDialog(true)}
          className="flex-1 sm:flex-none h-10 md:h-12 px-5 md:px-6 rounded-md text-sm md:text-base text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 font-black transition-all gap-2"
        >
          <XCircle className="w-4 h-4" />
          إلغاء الطلب
        </Button>
        <Button 
          onClick={handleScrollToPayment}
          className="flex-1 sm:flex-none h-10 md:h-12 px-6 md:px-8 rounded-md bg-[#D4A017] hover:bg-[#b88a14] text-white text-sm md:text-base font-black transition-all active:scale-95 shadow-lg shadow-[#D4A017]/10 gap-2"
        >
          <CreditCard className="w-4 h-4" />
          سداد الرسوم
        </Button>
      </div>

      {/* Cancellation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="font-arabic" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-neutral-900">تأكيد إلغاء الطلب</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-bold text-neutral-500 py-4">
              هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ هذا الإجراء لا يمكن التراجع عنه. يرجى ذكر سبب الإلغاء أدناه:
            </AlertDialogDescription>
            <Textarea 
              placeholder="اكتب سبب الإلغاء هنا..." 
              className="mt-2 min-h-[100px] font-bold text-sm"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0 mt-6">
            <AlertDialogCancel className="font-black">تراجع</AlertDialogCancel>
            <Button 
              variant="destructive" 
              className="font-black bg-red-600 hover:bg-red-700" 
              onClick={handleCancelApplication}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ms-2" />
                  جاري الإلغاء...
                </>
              ) : (
                "تأكيد الإلغاء"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
