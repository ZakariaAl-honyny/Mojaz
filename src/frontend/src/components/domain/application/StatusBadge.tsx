"use client";

import { cn } from "@/lib/utils";
import { ApplicationStatus, ApplicationStatusLabels } from "@/types/application.types";

interface StatusBadgeProps {
  status: ApplicationStatus | number | string;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  let colorClass = "bg-neutral-100 text-neutral-800 border-neutral-200";
  let dotClass = "bg-neutral-500";
  let translatedStatus = "غير معروف";

  // Handle numeric enum value
  const numericStatus = typeof status === 'number' ? status : Number(status) || 0;

  switch (numericStatus) {
    case ApplicationStatus.Draft:
      translatedStatus = "مسودة";
      colorClass = "bg-neutral-100 text-neutral-600 border-neutral-200";
      dotClass = "bg-neutral-400";
      break;
    case ApplicationStatus.Submitted:
      translatedStatus = "مُقدَّم";
      colorClass = "bg-blue-50 text-[#1a3a8f] border-blue-100";
      dotClass = "bg-[#1a3a8f]";
      break;
    case ApplicationStatus.DocumentReview:
      translatedStatus = "مراجعة المستندات";
      colorClass = "bg-blue-50 text-[#1a3a8f] border-blue-100";
      dotClass = "bg-[#1a3a8f]";
      break;
    case ApplicationStatus.InReview:
      translatedStatus = "قيد المراجعة";
      colorClass = "bg-blue-50 text-[#1a3a8f] border-blue-100";
      dotClass = "bg-[#1a3a8f]";
      break;
    case ApplicationStatus.MedicalExam:
      translatedStatus = "الفحص الطبي";
      colorClass = "bg-purple-50 text-purple-700 border-purple-100";
      dotClass = "bg-purple-500";
      break;
    case ApplicationStatus.Training:
      translatedStatus = "التدريب";
      colorClass = "bg-purple-50 text-purple-700 border-purple-100";
      dotClass = "bg-purple-500";
      break;
    case ApplicationStatus.TheoryTest:
      translatedStatus = "الاختبار النظري";
      colorClass = "bg-purple-50 text-purple-700 border-purple-100";
      dotClass = "bg-purple-500";
      break;
    case ApplicationStatus.PracticalTest:
      translatedStatus = "الاختبار العملي";
      colorClass = "bg-purple-50 text-purple-700 border-purple-100";
      dotClass = "bg-purple-500";
      break;
    case ApplicationStatus.Approved:
      translatedStatus = "مقبول";
      colorClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
      dotClass = "bg-emerald-500";
      break;
    case ApplicationStatus.Payment:
      translatedStatus = "الدفع";
      colorClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
      dotClass = "bg-emerald-500";
      break;
    case ApplicationStatus.Issued:
      translatedStatus = "مصدرة";
      colorClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
      dotClass = "bg-emerald-500";
      break;
    case ApplicationStatus.Active:
      translatedStatus = "نشط";
      colorClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
      dotClass = "bg-emerald-500";
      break;
    case ApplicationStatus.Rejected:
      translatedStatus = "مرفوض";
      colorClass = "bg-red-50 text-red-700 border-red-100";
      dotClass = "bg-red-500";
      break;
    case ApplicationStatus.Cancelled:
      translatedStatus = "ملغى";
      colorClass = "bg-neutral-100 text-neutral-500 border-neutral-200";
      dotClass = "bg-neutral-400";
      break;
    case ApplicationStatus.Expired:
      translatedStatus = "منتهي الصلاحية";
      colorClass = "bg-neutral-100 text-neutral-500 border-neutral-200";
      dotClass = "bg-neutral-400";
      break;
    default:
      // Fallback for unknown numeric values
      translatedStatus = "غير معروف";
      colorClass = "bg-neutral-100 text-neutral-800 border-neutral-200";
      dotClass = "bg-neutral-500";
      break;
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