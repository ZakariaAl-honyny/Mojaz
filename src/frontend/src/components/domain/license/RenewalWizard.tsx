"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CreditCard,
  Loader2,
  Clock,
  Calendar,
  FileText,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/api-client";
import toast from "react-hot-toast";
import { PaymentSimModal } from "@/components/domain/payment/PaymentSimModal";
import LicenseService from "@/services/license.service";

// --- Types ---

interface LicenseInfo {
  id: string;
  licenseNumber: string;
  categoryCode: string;
  categoryNameEn: string;
  categoryNameAr: string;
  expiresAt: string;
  status: string;
}

interface EligibilityResult {
  isEligible: boolean;
  license: LicenseInfo | null;
  message?: string;
  messageAr?: string;
  withinGracePeriod: boolean;
  renewalFee: number;
}

// --- Component ---

export default function RenewalWizard() {
  const t = useTranslations("application.renewal");
  const tCommon = useTranslations("common.renewal");
  const router = useRouter();

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Eligibility state
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [isLoadingEligibility, setIsLoadingEligibility] = useState(true);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);

  // Declaration state
  const [agreed, setAgreed] = useState(false);

  // Steps config
  const steps = [
    { id: "eligibility", label: t("steps.eligibility"), icon: Shield },
    { id: "review", label: t("steps.review"), icon: FileText },
    { id: "payment", label: t("steps.payment"), icon: CreditCard },
  ];

  // Check eligibility on mount
  useEffect(() => {
    checkEligibility();
  }, []);

  const checkEligibility = async () => {
    try {
      setIsLoadingEligibility(true);
      setEligibilityError(null);

      const response = await LicenseService.checkRenewalEligibility();

      if (response.success && response.data) {
        setEligibility(response.data);
      } else {
        setEligibilityError(response.message || "Failed to check eligibility");
        setEligibility({ isEligible: false, license: null, withinGracePeriod: false, renewalFee: 0 });
      }
    } catch (error: any) {
      setEligibilityError(error.message || "Failed to check eligibility");
      setEligibility({ isEligible: false, license: null, withinGracePeriod: false, renewalFee: 0 });
    } finally {
      setIsLoadingEligibility(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 0 && !eligibility?.isEligible) {
      return; // Can't proceed if not eligible
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmitApplication = async () => {
    if (!eligibility?.license) return;

    setIsSubmitting(true);
    try {
      const response = await LicenseService.submitRenewal(eligibility.license.id);

      if (response.success && response.data) {
        setApplicationId(response.data.id);
        setCurrentStep(2); // Move to payment step
        toast.success(t("review.submitted"));
      } else {
        toast.error(response.message || t("review.error"));
      }
    } catch (error: any) {
      toast.error(error.message || t("review.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (success: boolean) => {
    setIsPaymentModalOpen(false);
    if (success && applicationId) {
      toast.success(t("payment.success"));
      setTimeout(() => router.push("/applications"), 1500);
    }
  };

  // Loading state
  if (isLoadingEligibility) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        <p className="text-neutral-500">{tCommon("checkEligibility")}...</p>
      </div>
    );
  }

  // Not eligible state
  if (!eligibility?.isEligible) {
    return (
      <Card className="max-w-md mx-auto mt-12 border-red-100 bg-red-50/30">
        <CardHeader className="flex flex-col items-center text-center pb-2">
          <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
          <CardTitle className="text-red-700">{tCommon("notEligible")}</CardTitle>
          <CardDescription className="text-neutral-600 mt-2">
            {eligibilityError || t("eligibility.notEligibleMessage")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button onClick={() => router.push("/dashboard")} className="w-full bg-primary-500">
            {t("backToDashboard")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const license = eligibility.license!;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary-900 font-arabic">{tCommon("title")}</h1>
        <p className="text-muted-foreground">{tCommon("subtitle")}</p>
      </div>

      {/* Progress Steps */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  idx <= currentStep
                    ? "bg-primary-500 text-white"
                    : "bg-neutral-200 text-neutral-500"
                )}
              >
                {idx < currentStep ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm hidden sm:inline font-medium",
                  idx <= currentStep ? "text-primary-700" : "text-neutral-500"
                )}
              >
                {step.label}
              </span>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-px bg-neutral-200 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
          <motion.div
            className="bg-primary-500 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-neutral-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-neutral-50/50 border-b pb-4">
              <CardTitle className="text-xl font-semibold text-center">
                {steps[currentStep].label}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
              {/* Step 0: Eligibility & License Info */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  {/* Eligibility Status */}
                  <div className="flex items-center gap-3 p-4 bg-King blue-50 border border-King blue-200 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-King blue-600" />
                    <div>
                      <p className="font-semibold text-King blue-800">{tCommon("eligible")}</p>
                      <p className="text-sm text-King blue-700">{tCommon("simplifiedFlow")}</p>
                    </div>
                  </div>

                  {/* Simplified Flow Info */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 bg-neutral-50 rounded-xl text-center opacity-60">
                      <Clock className="w-5 h-5 mx-auto mb-2 text-neutral-400" />
                      <p className="text-xs text-neutral-500">{tCommon("skipTraining")}</p>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-xl text-center opacity-60">
                      <FileText className="w-5 h-5 mx-auto mb-2 text-neutral-400" />
                      <p className="text-xs text-neutral-500">{tCommon("skipTheory")}</p>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-xl text-center opacity-60">
                      <Shield className="w-5 h-5 mx-auto mb-2 text-neutral-400" />
                      <p className="text-xs text-neutral-500">{tCommon("skipPractical")}</p>
                    </div>
                  </div>

                  {/* Current License Card */}
                  <div className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border border-primary-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm text-primary-600 font-medium">{tCommon("currentLicense")}</p>
                        <h3 className="text-2xl font-bold text-primary-900 mt-1">
                          {license.categoryNameEn}
                        </h3>
                      </div>
                      <div className="p-2 bg-white rounded-lg">
                        <Shield className="w-6 h-6 text-primary-500" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-primary-700">{t("licenseNumber")}</span>
                        <span className="font-bold text-primary-900 bg-white px-3 py-1 rounded-lg">
                          {license.licenseNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-primary-700">{tCommon("expiresAt")}</span>
                        <span className="font-medium text-primary-800">
                          {new Date(license.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                      {eligibility.withinGracePeriod && (
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          <span className="text-sm text-amber-700 font-medium">
                            {tCommon("withinGracePeriod")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Medical Exam Info */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-800">{tCommon("medicalRequired")}</p>
                      <p className="text-sm text-blue-700 mt-1">{t("medicalInfo")}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Review & Declaration */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
                    <div className="flex justify-between items-center border-b pb-4">
                      <h3 className="text-lg font-bold">{t("review.summaryTitle")}</h3>
                      <div className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-bold">
                        {eligibility.renewalFee} SAR
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <span className="text-neutral-500">{t("licenseNumber")}</span>
                      <span className="font-semibold text-neutral-900">{license.licenseNumber}</span>

                      <span className="text-neutral-500">{t("category")}</span>
                      <span className="font-semibold text-neutral-900">{license.categoryNameEn}</span>

                      <span className="text-neutral-500">{t("currentExpiry")}</span>
                      <span className="font-semibold text-neutral-900">
                        {new Date(license.expiresAt).toLocaleDateString()}
                      </span>

                      <span className="text-neutral-500">{t("newExpiry")}</span>
                      <span className="font-semibold text-primary-600">
                        {t("tenYears")}
                      </span>
                    </div>
                  </div>

                  {/* Simplified Flow Reminder */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-800">
                      <strong>{t("simplifiedNote")}</strong>: {t("simplifiedNoteDesc")}
                    </p>
                  </div>

                  {/* Declaration */}
                  <div className="space-y-4">
                    <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 text-neutral-700 leading-relaxed">
                      {t("declaration.text")}
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                      <Checkbox
                        id="agreed"
                        checked={agreed}
                        onCheckedChange={(checked) => setAgreed(checked as boolean)}
                        className="data-[state=checked]:bg-primary-500"
                      />
                      <Label htmlFor="agreed" className="text-sm font-semibold cursor-pointer select-none">
                        {t("declaration.checkbox")}
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <div className="space-y-8 py-4">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center transform rotate-3">
                        <CreditCard className="w-10 h-10 text-primary-500" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-King blue-500 rounded-full flex items-center justify-center text-white border-4 border-white">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{t("payment.title")}</h3>
                      <p className="text-neutral-500 max-w-sm">{t("payment.paymentDesc")}</p>
                    </div>

                    {/* Fee Breakdown */}
                    <div className="w-full max-w-sm overflow-hidden rounded-2xl border-2 border-neutral-100">
                      <div className="p-6 bg-neutral-50 space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">{t("payment.renewalFee")}</span>
                          <span className="font-bold">{eligibility.renewalFee} SAR</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">VAT (15%)</span>
                          <span className="font-bold">0.00 SAR</span>
                        </div>
                      </div>
                      <div className="p-6 bg-primary-50 border-t-2 border-primary-100 flex justify-between items-center">
                        <span className="font-bold text-primary-900">{t("payment.total")}</span>
                        <span className="text-2xl font-black text-primary-600">
                          {eligibility.renewalFee} SAR
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="w-full max-w-sm bg-primary-500 hover:bg-primary-600 text-white py-8 rounded-2xl text-xl font-bold transition-all shadow-xl shadow-primary-200 mt-4 active:scale-95"
                    >
                      {t("payment.payButton")}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Navigation Footer */}
            <div className="flex justify-between border-t p-6 bg-neutral-50/30">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0 || isSubmitting}
                className="gap-2 font-semibold hover:bg-neutral-100"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                {t("back")}
              </Button>

              {currentStep === 0 ? (
                <Button
                  onClick={nextStep}
                  className="bg-primary-500 hover:bg-primary-600 text-white gap-2 px-8 font-bold rounded-xl"
                >
                  {t("next")}
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </Button>
              ) : currentStep === 1 ? (
                <Button
                  onClick={handleSubmitApplication}
                  disabled={!agreed || isSubmitting}
                  className="bg-primary-500 hover:bg-primary-600 text-white gap-2 px-10 py-6 text-lg font-bold rounded-2xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t("submitting")}
                    </>
                  ) : (
                    <>
                      {t("submit")} <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </Button>
              ) : (
                <div className="w-10" />
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Payment Modal */}
      <PaymentSimModal
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentSuccess}
        applicationId={applicationId || ""}
        feeType={5} // RenewalFee
        amount={eligibility?.renewalFee || 0}
      />
    </div>
  );
}