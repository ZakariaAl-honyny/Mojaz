"use client";

import { cn } from "@/lib/utils";
import { ApplicationStatus } from "@/lib/enums";

interface StatusBadgeProps {
  status: ApplicationStatus | number | string;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  let colorClass = "bg-neutral-100 text-neutral-800 border-neutral-200";
  let dotClass = "bg-neutral-500";
  let translatedStatus = "غير معروف";

  // Get status string for easier matching
  const statusStr = typeof status === 'string' ? status : '';
  const numericStatus = typeof status === 'number' ? status : Number(status);

  // Helper to check if status matches (either string name or numeric value)
  const isStatus = (name: keyof typeof ApplicationStatus, value: number) => {
    return statusStr === name || (!isNaN(numericStatus) && numericStatus === value);
  };

  if (isStatus('Draft', ApplicationStatus.Draft)) {
    translatedStatus = "مسودة";
    colorClass = "bg-neutral-100 text-neutral-600 border-neutral-200";
    dotClass = "bg-neutral-400";
  } else if (isStatus('Submitted', ApplicationStatus.Submitted)) {
    translatedStatus = "مُقدَّم";
    colorClass = "bg-blue-50 text-[#1a3a8f] border-blue-100";
    dotClass = "bg-[#1a3a8f]";
  } else if (isStatus('DocumentReview', ApplicationStatus.DocumentReview)) {
    translatedStatus = "مراجعة المستندات";
    colorClass = "bg-blue-50 text-[#1a3a8f] border-blue-100";
    dotClass = "bg-[#1a3a8f]";
  } else if (isStatus('InReview', ApplicationStatus.InReview)) {
    translatedStatus = "قيد المراجعة";
    colorClass = "bg-blue-50 text-[#1a3a8f] border-blue-100";
    dotClass = "bg-[#1a3a8f]";
  } else if (isStatus('MedicalExam', ApplicationStatus.MedicalExam)) {
    translatedStatus = "الفحص الطبي";
    colorClass = "bg-purple-50 text-purple-700 border-purple-100";
    dotClass = "bg-purple-500";
  } else if (isStatus('Training', ApplicationStatus.Training)) {
    translatedStatus = "التدريب";
    colorClass = "bg-purple-50 text-purple-700 border-purple-100";
    dotClass = "bg-purple-500";
  } else if (isStatus('TheoryTest', ApplicationStatus.TheoryTest)) {
    translatedStatus = "الاختبار النظري";
    colorClass = "bg-purple-50 text-purple-700 border-purple-100";
    dotClass = "bg-purple-500";
  } else if (isStatus('PracticalTest', ApplicationStatus.PracticalTest)) {
    translatedStatus = "الاختبار العملي";
    colorClass = "bg-purple-50 text-purple-700 border-purple-100";
    dotClass = "bg-purple-500";
  } else if (isStatus('Approved', ApplicationStatus.Approved)) {
    translatedStatus = "مقبول";
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
    dotClass = "bg-emerald-500";
  } else if (isStatus('Payment', ApplicationStatus.Payment)) {
    translatedStatus = "الدفع";
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
    dotClass = "bg-emerald-500";
  } else if (isStatus('Issued', ApplicationStatus.Issued)) {
    translatedStatus = "مصدرة";
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
    dotClass = "bg-emerald-500";
  } else if (isStatus('Active', ApplicationStatus.Active)) {
    translatedStatus = "نشط";
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
    dotClass = "bg-emerald-500";
  } else if (isStatus('Rejected', ApplicationStatus.Rejected)) {
    translatedStatus = "مرفوض";
    colorClass = "bg-red-50 text-red-700 border-red-100";
    dotClass = "bg-red-500";
  } else if (isStatus('Cancelled', ApplicationStatus.Cancelled)) {
    translatedStatus = "ملغى";
    colorClass = "bg-neutral-100 text-neutral-500 border-neutral-200";
    dotClass = "bg-neutral-400";
  } else if (isStatus('Expired', ApplicationStatus.Expired)) {
    translatedStatus = "منتهي الصلاحية";
    colorClass = "bg-neutral-100 text-neutral-500 border-neutral-200";
    dotClass = "bg-neutral-400";
  } else {
    // Fallback for unknown numeric or string values
    translatedStatus = statusStr || "غير معروف";
    colorClass = "bg-neutral-100 text-neutral-800 border-neutral-200";
    dotClass = "bg-neutral-500";
  }

  return (
    <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider", colorClass, className)}>
      {showIcon && (
        <span className="me-2 flex h-1.5 w-1.5 relative">
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", dotClass)}></span>
          <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", dotClass)}></span>
        </span>
      )}
      {translatedStatus}
    </span>
  );
}