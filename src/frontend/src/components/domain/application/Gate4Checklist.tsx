"use client";

import { useTranslations } from "next-intl";
import { Gate4Condition, Gate4ValidationResult } from "@/types/finalApproval.types";
import { cn } from "@/lib/utils";

interface Gate4ChecklistProps {
  result: Gate4ValidationResult;
  isLoading?: boolean;
}

export function Gate4Checklist({ result, isLoading }: Gate4ChecklistProps) {
  const t = useTranslations("final-approval");
  const locale = useTranslations();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Status */}
      <div
        className={cn(
          "p-4 rounded-lg border-2 transition-all duration-300",
          result.isFullyPassed
            ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800"
            : "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              result.isFullyPassed
                ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                : "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400"
            )}
          >
            {result.isFullyPassed ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {result.isFullyPassed ? t("gate4.isFullyPassed") : t("gate4.hasFailures")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {result.conditions.filter((c) => c.isPassed).length} / {result.conditions.length} {t("gate4.passed").toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Conditions List */}
      <div className="space-y-3">
        {result.conditions.map((condition, index) => (
          <ConditionRow
            key={condition.key}
            condition={condition}
            delay={index * 50}
          />
        ))}
      </div>
    </div>
  );
}

function ConditionRow({ condition, delay }: { condition: Gate4Condition; delay: number }) {
  const t = useTranslations("final-approval");

  const conditionLabel = t(`gate4.conditions.${condition.key}`, { defaultValue: condition.key });

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border transition-all duration-300",
        condition.isPassed
          ? "bg-white border-green-200 dark:bg-gray-900 dark:border-green-800"
          : "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            condition.isPassed
              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
              : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
          )}
        >
          {condition.isPassed ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div>
          <p className="font-medium">{conditionLabel}</p>
          {!condition.isPassed && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {condition.failureMessageEn}
            </p>
          )}
        </div>
      </div>
      <span
        className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          condition.isPassed
            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
        )}
      >
        {condition.isPassed ? t("gate4.passed") : t("gate4.failed")}
      </span>
    </div>
  );
}