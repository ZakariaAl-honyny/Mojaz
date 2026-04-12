"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { trainingEntrySchema, type TrainingEntryFormValues } from "@/lib/validations/training.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainingEntryFormProps {
  applicationId: string;
  recordId?: string;
  onSuccess?: () => void;
  onSubmit: (values: TrainingEntryFormValues) => Promise<any>;
  className?: string;
}

/**
 * TrainingEntryForm - Employee-facing form to record training hours.
 * Designed with a ledger-inspired grid and Royal Green accents.
 */
export function TrainingEntryForm({
  applicationId,
  recordId,
  onSuccess,
  onSubmit,
  className,
}: TrainingEntryFormProps) {
  const t = useTranslations("training.form");
  const tv = useTranslations("training.validation");
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
        "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 shadow-sm relative",
        className
      )}
    >
      {/* Decorative corner accents for ledger aesthetic */}
      <div className="absolute top-0 right-0 w-8 h-8 opacity-10 bg-primary-600 rounded-bl-3xl"></div>
      
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <PlusCircle className="w-5 h-5 text-primary-600" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500">
            {t('title')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          {/* Hours Input */}
          <div className="md:col-span-1 space-y-2">
            <Label htmlFor="additionalHours" className="text-xs font-bold text-neutral-400">
              {t('hoursLabel')}
            </Label>
            <div className="relative">
              <Input
                id="additionalHours"
                type="number"
                step="0.5"
                {...register("additionalHours")}
                className={cn(
                  "font-mono text-lg border-2 focus:ring-primary-500",
                  errors.additionalHours ? "border-status-error" : "border-neutral-100"
                )}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-300">HRS</span>
            </div>
            {errors.additionalHours && (
              <p className="text-[10px] text-status-error font-bold leading-tight">
                {tv(errors.additionalHours.message as any)}
              </p>
            )}
          </div>

          {/* Notes Input */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="notes" className="text-xs font-bold text-neutral-400">
              {t('notesLabel')}
            </Label>
            <Input
              id="notes"
              {...register("notes")}
              placeholder={t('notesPlaceholder')}
              className="border-2 border-neutral-100 focus:ring-primary-500"
            />
            {errors.notes && (
              <p className="text-[10px] text-status-error font-bold whitespace-nowrap">
                {tv(errors.notes.message as any)}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-1">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold h-10 shadow-lg shadow-primary-900/10 active:scale-95 transition-all"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t('submitButton')
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Visual divider for the bottom of the card */}
      <div className="mt-6 border-t border-dashed border-neutral-100 dark:border-neutral-800 pt-2 flex justify-between">
        <span className="text-[9px] font-mono text-neutral-300">MOJAZ-TRN-ENTRY</span>
        <span className="text-[9px] font-mono text-neutral-300">REF: {applicationId.substring(0,8)}</span>
      </div>
    </form>
  );
}
