"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  FileUp, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle,
  CreditCard
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

// --- Types & Schema ---

const replacementSchema = z.object({
  reason: z.enum(["lost", "damaged", "stolen"], {
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
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const {
    register,
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
    setIsSubmitting(true);
    try {
      const uploadResults: { [key: string]: string } = {};

      if (data.reason === "stolen" && data.documents.policeReport) {
        const formData = new FormData();
        formData.append("file", data.documents.policeReport);
        const res = await apiClient.post("/applications/documents/upload", formData);
        uploadResults.policeReport = res.data.data.id;
      }

      if (data.reason === "damaged" && data.documents.damagedPhoto) {
        const formData = new FormData();
        formData.append("file", data.documents.damagedPhoto);
        const res = await apiClient.post("/applications/documents/upload", formData);
        uploadResults.damagedPhoto = res.data.data.id;
      }

      const response = await apiClient.post("/api/v1/applications/replacement", {
        reason: data.reason,
        documents: uploadResults,
      });

       if (response.data.success && response.data.data) {
         setApplicationId(response.data.data.id);
         setCurrentStep(4); // Move to Payment step
         toast.success(t("review.submitted"));
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
         // Optionally redirect to dashboard or status page
       } catch (error: any) {
         toast.error(error.response?.data?.message || t("payment.error"));
       }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary-500 font-arabic">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
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
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center">{steps[currentStep].label}</CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 0 && (
                <div className="space-y-4">
                  <RadioGroup 
                    onValueChange={(val) => setValue("reason", val as any)}
                    defaultValue={currentReason}
                    className="grid grid-cols-1 gap-4"
                  >
                    {Object.entries({ lost: t("reasons.lost"), damaged: t("reasons.damaged"), stolen: t("reasons.stolen") }).map(([value, label]) => (
                      <Label 
                        key={value} 
                        className={cn(
                          "flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-neutral-50",
                          currentReason === value ? "border-primary-500 bg-primary-50" : "border-neutral-200"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={value} id={value} />
                          <span className="font-medium">{label}</span>
                        </div>
                        {currentReason === value && <CheckCircle2 className="w-5 h-5 text-primary-500" />}
                      </Label>
                    ))}
                  </RadioGroup>
                   {errors.reason && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {t(errors.reason.message || "")}</p>}
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6 py-4">
                  <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 text-sm text-neutral-600 leading-relaxed">
                    {t("declaration.text")}
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <Checkbox 
                      id="agreed" 
                      onCheckedChange={(checked) => setValue("agreed", checked as any)}
                      checked={watch("agreed")}
                    />
                    <Label htmlFor="agreed" className="text-sm font-medium cursor-pointer">
                      {t("declaration.checkbox")}
                    </Label>
                  </div>
                   {errors.agreed && <p className="text-destructive text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {t(errors.agreed.message || "")}</p>}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <FileUp className="w-12 h-12 text-primary-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{t("upload.title")}</p>
                  </div>
                  
                  <div className="grid gap-6">
                    {currentReason === "stolen" && (
                      <div className="space-y-2">
                        <Label className="font-semibold">{t("upload.policeReport")}</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="file" 
                            onChange={(e) => setValue("documents.policeReport", e.target.files?.[0])}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                    {currentReason === "damaged" && (
                      <div className="space-y-2">
                        <Label className="font-semibold">{t("upload.damagedPhoto")}</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="file" 
                            onChange={(e) => setValue("documents.damagedPhoto", e.target.files?.[0])}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                     {currentReason === "lost" && (
                       <div className="p-4 text-center bg-neutral-50 rounded-lg border border-dashed border-neutral-300 text-sm text-neutral-500">
                         {t("upload.noDocs")}
                       </div>
                     )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4">
                    <h3 className="text-lg font-bold border-b pb-2">{t("review.summaryTitle")}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <span className="text-muted-foreground">{t("review.reasonLabel")}</span>
                      <span className="font-medium">{t(`reasons.${currentReason}`)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <span className="text-muted-foreground">{t("review.documentsLabel")}</span>
                      <div className="text-sm space-y-1">
                        {currentReason === "stolen" && (watch("documents.policeReport") ? <span>✓ {t("upload.policeReport")}</span> : <span className="text-destructive">Missing</span>)}
                        {currentReason === "damaged" && (watch("documents.damagedPhoto") ? <span>✓ {t("upload.damagedPhoto")}</span> : <span className="text-destructive">Missing</span>)}
                         {currentReason === "lost" && <span>{t("review.noneRequired")}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6 py-4">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-primary-500" />
                    </div>
                     <div>
                       <h3 className="text-xl font-bold">{t("payment.title")}</h3>
                       <p className="text-muted-foreground">{t("payment.paymentDesc")}</p>
                     </div>
                     <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 w-full max-w-xs space-y-3">
                       <div className="flex justify-between text-sm">
                         <span className="text-muted-foreground">{t("payment.amountLabel")}</span>
                         <span className="font-semibold">{t("payment.feeAmount")}</span>
                       </div>
                       <div className="border-t pt-3 flex justify-between font-bold text-lg">
                         <span>{t("payment.total")}</span>
                         <span className="text-primary-500">{t("payment.feeAmount")}</span>
                       </div>
                     </div>
                    <Button 
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="w-full max-w-xs bg-primary-500 hover:bg-primary-600 text-white py-6 rounded-xl font-semibold transition-all shadow-lg shadow-primary-200"
                    >
                      {t("payment.payButton")}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6 bg-neutral-50/50">
              <Button 
                variant="ghost" 
                onClick={prevStep} 
                disabled={currentStep === 0 || isSubmitting}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                {t("review.back")}
              </Button>
              
              {currentStep < steps.length - 1 && currentStep !== 4 ? (
                 <Button 
                   onClick={nextStep} 
                   className="bg-primary-500 hover:bg-primary-600 text-white gap-2"
                 >
                   {t("review.next")}
                   <ChevronRight className="w-4 h-4" />
                 </Button>
              ) : currentStep === 3 ? (
                 <Button 
                   onClick={handleSubmit(onSubmit)} 
                    disabled={isSubmitting || isDocumentsMissing}
                   className="bg-primary-500 hover:bg-primary-600 text-white gap-2"
                 >
                   {isSubmitting ? t("review.submitting") : t("review.submit")}
                   {!isSubmitting && <CheckCircle2 className="w-4 h-4" />}
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
