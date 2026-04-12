"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  FileUp, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle,
  CreditCard,
  Loader2,
  Clock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/api-client";
import toast from "react-hot-toast";
import { PaymentSimModal } from "@/components/domain/payment/PaymentSimModal";
import LicenseService from "@/services/license.service";
import { ReplacementReason } from "@/types/application.types";

// --- Types & Schema ---

const replacementSchema = z.object({
  reason: z.string({
    required_error: "reasons.required",
  }),
  agreed: z.boolean().refine((val) => val === true, {
    message: "declaration.required",
  }),
  documents: z.object({
    policeReport: z.any().optional(),
    damagedPhoto: z.any().optional(),
  }),
});

type ReplacementFormValues = z.infer<typeof replacementSchema>;

export default function ReplacementWizard() {
  const t = useTranslations("application.replacement");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [licenseInfo, setLicenseInfo] = useState<{ id: string; number: string } | null>(null);
  const [isLoadingEligibility, setIsLoadingEligibility] = useState(true);

  const {
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ReplacementFormValues>({
    resolver: zodResolver(replacementSchema),
    defaultValues: {
      reason: undefined,
      agreed: false,
      documents: {},
    },
  });

  const currentReason = watch("reason");
  const documents = watch("documents");

  const isDocumentsMissing = 
    (currentReason === "damaged" && !documents?.damagedPhoto) ||
    (currentReason === "stolen" && !documents?.policeReport);

  useEffect(() => {
    async function checkEligibility() {
      try {
        const res = await LicenseService.checkReplacementEligibility();
        if (res.success && res.data?.isEligible) {
          setIsEligible(true);
          setLicenseInfo({ id: res.data.licenseId, number: res.data.licenseNumber });
        } else {
          setIsEligible(false);
          toast.error(res.message || "You are not eligible for license replacement.");
        }
      } catch (err) {
        setIsEligible(false);
        toast.error("Failed to check eligibility.");
      } finally {
        setIsLoadingEligibility(false);
      }
    }
    checkEligibility();
  }, []);

  const steps = [
    { id: "reason", label: t("steps.reason") },
    { id: "declaration", label: t("steps.declaration") },
    { id: "upload", label: t("steps.upload") },
    { id: "review", label: t("steps.review") },
    { id: "payment", label: t("steps.payment") },
  ];

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 0) {
      isValid = await trigger("reason");
    } else if (currentStep === 1) {
      isValid = await trigger("agreed");
    } else {
      isValid = true;
    }

    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (data: ReplacementFormValues) => {
    if (!licenseInfo) return;
    setIsSubmitting(true);
    try {
      const documentIds: string[] = [];

      if (data.reason === "stolen" && data.documents.policeReport) {
        const formData = new FormData();
        formData.append("file", data.documents.policeReport);
        const res = await apiClient.post("/applications/documents/upload", formData);
        documentIds.push(res.data.data.id);
      }

      if (data.reason === "damaged" && data.documents.damagedPhoto) {
        const formData = new FormData();
        formData.append("file", data.documents.damagedPhoto);
        const res = await apiClient.post("/applications/documents/upload", formData);
        documentIds.push(res.data.data.id);
      }

      const reasonMap: Record<string, number> = {
        lost: ReplacementReason.Lost,
        damaged: ReplacementReason.Damaged,
        stolen: ReplacementReason.Stolen,
      };

      const response = await LicenseService.submitReplacement({
        licenseId: licenseInfo.id,
        reason: reasonMap[data.reason] as any,
        documentIds: documentIds
      });

       if (response.success && response.data) {
         setApplicationId(response.data.id);
         
         if (data.reason === "stolen") {
           // Redirect to dashboard for stolen, as it needs verification first
           toast.success(t("review.submitted") + " " + t("employeeReview.verifyReportDesc"));
           setTimeout(() => router.push("/applications"), 2000);
         } else {
           setCurrentStep(4); // Move to Payment step
           toast.success(t("review.submitted"));
         }
       }
     } catch (error: any) {
       toast.error(error.response?.data?.message || t("review.error"));
     } finally {
       setIsSubmitting(false);
     }
   };

  const handlePaymentSuccess = async (success: boolean) => {
    setIsPaymentModalOpen(false);
    if (success && applicationId) {
       try {
         await apiClient.post(`/api/v1/applications/${applicationId}/process-payment`);
         toast.success(t("payment.success"));
         setTimeout(() => router.push("/applications"), 1500);
       } catch (error: any) {
         toast.error(error.response?.data?.message || t("payment.error"));
       }
    }
  };

  if (isLoadingEligibility) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        <p className="text-neutral-500">Checking eligibility...</p>
      </div>
    );
  }

  if (isEligible === false) {
    return (
      <Card className="max-w-md mx-auto mt-12 border-red-100 bg-red-50/30">
        <CardHeader className="flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
          <CardTitle className="text-red-700">Not Eligible</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-neutral-600 mb-6">
            Our records indicate you are not currently eligible for a license replacement.
            You must have an active license to use this service.
          </p>
          <Button onClick={() => router.push("/dashboard")} className="w-full">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary-500 font-arabic">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
        {licenseInfo && (
           <div className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold mt-2">
             License: {licenseInfo.number}
           </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                idx <= currentStep ? "bg-primary-500 text-white" : "bg-neutral-200 text-neutral-500"
              )}>
                {idx < currentStep ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={cn(
                "text-xs hidden sm:inline transition-colors",
                idx <= currentStep ? "text-primary-500 font-semibold" : "text-neutral-500"
              )}>
                {step.label}
              </span>
              {idx < steps.length - 1 && <div className="w-8 h-px bg-neutral-200 mx-2" />}
            </div>
          ))}
        </div>
        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-primary-500 h-full" 
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

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
              <CardTitle className="text-xl font-semibold text-center">{steps[currentStep].label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <RadioGroup 
                    onValueChange={(val) => setValue("reason", val as any)}
                    defaultValue={currentReason}
                    className="grid grid-cols-1 gap-4"
                  >
                    {[
                      { val: "lost", label: t("reasons.lost") },
                      { val: "damaged", label: t("reasons.damaged") },
                      { val: "stolen", label: t("reasons.stolen") }
                    ].map(({ val, label }) => (
                      <Label 
                        key={val} 
                        className={cn(
                          "flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-neutral-50",
                          currentReason === val ? "border-primary-500 bg-primary-50" : "border-neutral-200"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={val} id={val} />
                          <span className="font-medium text-lg">{label}</span>
                        </div>
                        {currentReason === val && <CheckCircle2 className="w-6 h-6 text-primary-500" />}
                      </Label>
                    ))}
                  </RadioGroup>
                   {errors.reason && <p className="text-destructive text-sm flex items-center gap-1 mt-2 font-medium"><AlertCircle className="w-4 h-4" /> {t(errors.reason.message || "")}</p>}
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-neutral-700 leading-relaxed relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Clock className="w-12 h-12" />
                    </div>
                    {t("declaration.text")}
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                    <Checkbox 
                      id="agreed" 
                      onCheckedChange={(checked) => setValue("agreed", checked as any)}
                      checked={watch("agreed")}
                      className="data-[state=checked]:bg-primary-500"
                    />
                    <Label htmlFor="agreed" className="text-sm font-semibold cursor-pointer select-none">
                      {t("declaration.checkbox")}
                    </Label>
                  </div>
                   {errors.agreed && <p className="text-destructive text-sm flex items-center gap-1 font-medium"><AlertCircle className="w-4 h-4" /> {t(errors.agreed.message || "")}</p>}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileUp className="w-8 h-8 text-primary-500" />
                    </div>
                    <p className="text-lg font-bold">{t("upload.title")}</p>
                    <p className="text-sm text-neutral-500">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                  </div>
                  
                  <div className="grid gap-6">
                    {currentReason === "stolen" && (
                      <div className="space-y-3">
                        <Label className="font-bold text-base flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary-500" />
                          {t("upload.policeReport")}
                        </Label>
                        <div className="flex items-center gap-2">
                          <div className="relative w-full">
                             <Input 
                                type="file" 
                                onChange={(e) => setValue("documents.policeReport", e.target.files?.[0])}
                                className="cursor-pointer file:bg-primary-50 file:text-primary-700 file:border-0 file:rounded-lg file:px-4 file:py-1 file:me-4 hover:file:bg-primary-100 transition-all border-2 py-6 h-auto"
                                accept=".jpg,.jpeg,.png,.pdf"
                              />
                              {watch("documents.policeReport") && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                  <CheckCircle2 className="w-5 h-5 text-success" />
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                    {currentReason === "damaged" && (
                      <div className="space-y-3">
                        <Label className="font-bold text-base flex items-center gap-2">
                           <CheckCircle2 className="w-4 h-4 text-primary-500" />
                          {t("upload.damagedPhoto")}
                        </Label>
                        <div className="flex items-center gap-2">
                           <div className="relative w-full">
                            <Input 
                              type="file" 
                              onChange={(e) => setValue("documents.damagedPhoto", e.target.files?.[0])}
                              className="cursor-pointer file:bg-primary-50 file:text-primary-700 file:border-0 file:rounded-lg file:px-4 file:py-1 file:me-4 hover:file:bg-primary-100 transition-all border-2 py-6 h-auto"
                              accept=".jpg,.jpeg,.png,.pdf"
                            />
                             {watch("documents.damagedPhoto") && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                  <CheckCircle2 className="w-5 h-5 text-success" />
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                     {currentReason === "lost" && (
                       <div className="p-8 text-center bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200 text-sm text-neutral-500">
                         <div className="mb-2"><CheckCircle2 className="w-8 h-8 text-primary-300 mx-auto" /></div>
                         {t("upload.noDocs")}
                       </div>
                     )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-6">
                    <div className="flex justify-between items-center border-b pb-4">
                      <h3 className="text-xl font-bold">{t("review.summaryTitle")}</h3>
                      <div className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-bold">FEES: {t("payment.feeAmount")}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-6 text-sm md:text-base">
                      <span className="text-neutral-500">{t("review.reasonLabel")}</span>
                      <span className="font-bold text-primary-900 bg-white px-3 py-1 rounded-lg border w-fit">{t(`reasons.${currentReason}`)}</span>
                      
                      <span className="text-neutral-500">{t("review.documentsLabel")}</span>
                      <div className="space-y-2">
                        {currentReason === "stolen" && (
                          watch("documents.policeReport") 
                            ? <span className="flex items-center gap-2 text-success font-semibold px-3 py-1 bg-white rounded-lg border w-fit"><CheckCircle2 className="w-4 h-4" /> {t("upload.policeReport")}</span> 
                            : <span className="flex items-center gap-2 text-destructive font-semibold px-3 py-1 bg-white rounded-lg border w-fit"><AlertCircle className="w-4 h-4" /> Missing</span>
                        )}
                        {currentReason === "damaged" && (
                          watch("documents.damagedPhoto") 
                            ? <span className="flex items-center gap-2 text-success font-semibold px-3 py-1 bg-white rounded-lg border w-fit"><CheckCircle2 className="w-4 h-4" /> {t("upload.damagedPhoto")}</span> 
                            : <span className="flex items-center gap-2 text-destructive font-semibold px-3 py-1 bg-white rounded-lg border w-fit"><AlertCircle className="w-4 h-4" /> Missing</span>
                        )}
                         {currentReason === "lost" && <span className="text-neutral-400 italic">{t("review.noneRequired")}</span>}
                      </div>

                      <span className="text-neutral-500">Current License</span>
                      <span className="font-semibold text-neutral-700">{licenseInfo?.number}</span>
                    </div>
                  </div>
                  {currentReason === 'stolen' && (
                    <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl flex gap-3 text-sm text-primary-800">
                      <Clock className="w-5 h-5 shrink-0" />
                      <p>{t('employeeReview.verifyReportDesc')}</p>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8 py-4">
                  <div className="flex flex-col items-center text-center space-y-4">
                     <div className="relative">
                        <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center transform rotate-3">
                          <CreditCard className="w-10 h-10 text-primary-500" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center text-white border-4 border-white">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                     </div>
                     <div>
                       <h3 className="text-2xl font-bold">{t("payment.title")}</h3>
                       <p className="text-neutral-500 max-w-sm">{t("payment.paymentDesc")}</p>
                     </div>
                     
                     <div className="w-full max-w-sm overflow-hidden rounded-2xl border-2 border-neutral-100">
                        <div className="p-6 bg-neutral-50 space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">{t("payment.amountLabel")}</span>
                            <span className="font-bold">{t("payment.feeAmount")}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">VAT (15%)</span>
                            <span className="font-bold">0.00 SAR</span>
                          </div>
                        </div>
                        <div className="p-6 bg-primary-50 border-t-2 border-primary-100 flex justify-between items-center">
                           <span className="font-bold text-primary-900">{t("payment.total")}</span>
                           <span className="text-2xl font-black text-primary-600 font-english">{t("payment.feeAmount")}</span>
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
            <CardFooter className="flex justify-between border-t p-6 bg-neutral-50/30">
              <Button 
                variant="ghost" 
                onClick={prevStep} 
                disabled={currentStep === 0 || isSubmitting}
                className="gap-2 font-semibold hover:bg-neutral-100"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                {t("review.back")}
              </Button>
              
              {currentStep < 3 ? (
                 <Button 
                   onClick={nextStep} 
                   className="bg-primary-500 hover:bg-primary-600 text-white gap-2 px-8 font-bold rounded-xl"
                 >
                   {t("review.next")}
                   <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                 </Button>
              ) : currentStep === 3 ? (
                 <Button 
                   onClick={handleSubmit(onSubmit)} 
                    disabled={isSubmitting || isDocumentsMissing}
                   className="bg-primary-500 hover:bg-primary-600 text-white gap-2 px-10 py-6 text-lg font-bold rounded-2xl"
                 >
                   {isSubmitting ? (
                     <><Loader2 className="w-5 h-5 animate-spin" /> {t("review.submitting")}</>
                   ) : (
                     <>{t("review.submit")} <CheckCircle2 className="w-5 h-5" /></>
                   )}
                 </Button>
              ) : (
                <div className="w-10" /> // Spacer for payment step
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>

      <PaymentSimModal
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentSuccess}
        applicationId={applicationId || ""}
        feeType={0} // ApplicationFee
        amount={100}
      />
    </div>
  );
}
