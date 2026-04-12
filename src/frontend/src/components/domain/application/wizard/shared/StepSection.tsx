"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Edit2 } from "lucide-react";

interface StepSectionProps {
  titleKey: string;
  onEdit: () => void;
  children: React.ReactNode;
}

export function StepSection({ titleKey, onEdit, children }: StepSectionProps) {
  const t = useTranslations("wizard");

  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          {t(titleKey)}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className={cn(
            "flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400",
            "hover:text-primary-700 dark:hover:text-primary-300",
            "transition-colors duration-200"
          )}
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>{t("step5.edit")}</span>
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}