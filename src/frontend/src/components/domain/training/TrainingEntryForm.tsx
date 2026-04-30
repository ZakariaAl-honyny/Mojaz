"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trainingEntrySchema, type TrainingEntryFormValues } from "@/lib/validations/training.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, History, FileText, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainingEntryFormProps {
  applicationId: number;
  applicationNumber?: string;
  recordId?: string;
  onSuccess?: () => void;
  onSubmit: (values: TrainingEntryFormValues) => Promise<any>;
  className?: string;
}

/**
 * TrainingEntryForm - Employee-facing form to record training hours.
 * 100% Arabic, institutional King Blue aesthetic.
 */
export function TrainingEntryForm({
  applicationId,
  applicationNumber,
  recordId,
  onSuccess,
  onSubmit,
  className,
}: TrainingEntryFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TrainingEntryFormValues>({
    resolver: zodResolver(trainingEntrySchema),
    defaultValues: {
      additionalHours: 1,
      notes: "",
    },
  });

  const handleFormSubmit = (values: TrainingEntryFormValues) => {
    startTransition(async () => {
      try {
        await onSubmit(values);
        reset();
        onSuccess?.();
      } catch (error) {
        console.error("Failed to add hours:", error);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn(
        "bg-white border-none rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/5 relative overflow-hidden font-arabic transition-all",
        className
      )}
      dir="rtl"
    >
      {/* Institutional Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 bg-[#1a3a8f] rounded-bl-[4rem]"></div>

      <div className="space-y-10">
        <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#1a3a8f]/5 flex items-center justify-center border border-[#1a3a8f]/10">
            <PlusCircle className="w-6 h-6 text-[#1a3a8f]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#1a3a8f] tracking-tight">رصد ساعات التدريب</h3>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">إضافة جلسة تدريبية جديدة للمتقدم</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
          {/* Hours Input */}
          <div className="md:col-span-1 space-y-4">
            <Label htmlFor="additionalHours" className="text-sm font-black text-[#1a3a8f] me-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              عدد الساعات
            </Label>
            <div className="relative">
              <Input
                id="additionalHours"
                type="number"
                step="0.5"
                {...register("additionalHours")}
                className={cn(
                  "h-16 font-mono font-black text-2xl border-none bg-neutral-50 rounded-2xl px-6 focus:ring-4 focus:ring-[#1a3a8f]/10 transition-all",
                  errors.additionalHours ? "ring-2 ring-red-500" : ""
                )}
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-black text-[#1a3a8f]/30">ساعة</span>
            </div>
            {errors.additionalHours && (
              <p className="text-xs text-red-500 font-bold px-2">
                عدد الساعات غير صالح
              </p>
            )}
          </div>

          {/* Notes Input */}
          <div className="md:col-span-2 space-y-4">
            <Label htmlFor="notes" className="text-sm font-black text-[#1a3a8f] me-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              ملاحظات المدرب (اختياري)
            </Label>
            <Input
              id="notes"
              {...register("notes")}
              placeholder="وصف موجز لأداء المتقدم في الجلسة..."
              className="h-16 border-none bg-neutral-50 rounded-2xl px-6 font-bold focus:ring-4 focus:ring-[#1a3a8f]/10 transition-all"
            />
            {errors.notes && (
              <p className="text-xs text-red-500 font-bold px-2">
                الملاحظات طويلة جداً
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-1 pt-9">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#1a3a8f] hover:bg-[#00215a] text-white font-black h-16 rounded-2xl shadow-xl shadow-blue-900/30 active:scale-95 transition-all text-lg group"
            >
              {isPending ? (
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              ) : (
                <span className="flex items-center gap-3">
                   إضافة الساعات
                   <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Audit Info Footer */}
      <div className="mt-10 border-t border-neutral-50 pt-6 flex justify-between items-center opacity-30 group hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
           <History className="w-3 h-3" />
           <span className="text-[10px] font-black font-mono">MOJAZ-TRN-ENTRY-CORE</span>
        </div>
        <span className="text-[10px] font-black font-mono text-start">رقم الطلب المرجعي: {applicationNumber || String(applicationId)}</span>
      </div>
    </form>
  );
}
