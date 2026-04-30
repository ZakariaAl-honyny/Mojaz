"use client";

import React, { useState, useEffect, useRef } from "react";
import { FeeType } from "@/lib/enums";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  FileUp, 
  AlertCircle,
  CreditCard,
  Loader2,
  Clock,
  ShieldCheck,
  FileText,
  AlertTriangle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/api-client";
import toast from "react-hot-toast";
import { PaymentSimModal } from "@/components/domain/payment/PaymentSimModal";
import LicenseService from "@/services/license.service";
import { ReplacementReason } from "@/types/application.types";
import { FileUploader } from "@/components/shared/FileUploader";

const replacementSchema = z.object({
  reason: z.string({
    required_error: "يرجى اختيار سبب طلب البديل للمتابعة",
  }),
  agreed: z.boolean().refine((val) => val === true, {
    message: "يجب الموافقة على التعهد للمتابعة",
  }),
  documents: z.object({
    policeReport: z.instanceof(File).optional(),
    damagedPhoto: z.instanceof(File).optional(),
  }),
});

type ReplacementFormValues = z.infer<typeof replacementSchema>;

export default function ReplacementWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [licenseInfo, setLicenseInfo] = useState<{ id: number; number: string } | null>(null);
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
          setLicenseInfo({ id: Number(res.data.licenseId), number: res.data.licenseNumber });
        } else {
          setIsEligible(false);
          toast.error(res.message || "عذراً، أنت غير مؤهل حالياً لطلب بدل تالف/مفقود.");
        }
      } catch (err) {
        setIsEligible(false);
        toast.error("فشل التحقق من الأهلية.");
      } finally {
        setIsLoadingEligibility(false);
      }
    }
    checkEligibility();
  }, []);

  const steps = [
    { id: "reason", label: "سبب الطلب" },
    { id: "declaration", label: "التعهد والإقرار" },
    { id: "upload", label: "المرفقات" },
    { id: "review", label: "المراجعة" },
    { id: "payment", label: "الرسوم" },
  ];

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 0) isValid = await trigger("reason");
    else if (currentStep === 1) isValid = await trigger("agreed");
    else isValid = true;

    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (data: ReplacementFormValues) => {
    if (!licenseInfo || isSubmittingRef.current) return;
    isSubmittingRef.current = true;
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
        reason: reasonMap[data.reason],
        documentIds: documentIds
      });

      if (response.success && response.data) {
        setApplicationNumber(response.data.applicationNumber);
        if (data.reason === "stolen") {
          toast.success("تم تقديم الطلب بنجاح. سنقوم بمراجعة محضر الشرطة قبل المتابعة.");
          setTimeout(() => router.push("/applications"), 2000);
        } else {
          setCurrentStep(4);
          toast.success("تم تقديم الطلب بنجاح، يرجى سداد الرسوم للمتابعة.");
        }
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "فشل تقديم الطلب.");
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const handlePaymentSuccess = async (success: boolean) => {
    setIsPaymentModalOpen(false);
    if (success && applicationNumber) {
      try {
        await apiClient.post(`/applications/${applicationNumber}/process-payment`);
        toast.success("تم سداد الرسوم بنجاح. جاري إصدار الرخص الجديدة...");
        setTimeout(() => router.push("/applications"), 1500);
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || "حدث خطأ أثناء معالجة الدفع.");
      }
    }
  };

  if (isLoadingEligibility) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6 font-arabic">
        <Loader2 className="w-16 h-16 animate-spin text-[#1a3a8f]" />
        <p className="text-[#1a3a8f] font-black text-xl animate-pulse">جاري التحقق من أهلية الطلب...</p>
      </div>
    );
  }

  if (isEligible === false) {
    return (
      <Card className="max-w-2xl mx-auto mt-24 border-none bg-red-400/5 backdrop-blur-3xl p-10 rounded-[3rem] font-arabic shadow-2xl" dir="rtl">
        <CardHeader className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
             <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <CardTitle className="text-red-900 text-3xl font-black tracking-tighter">طلب غير متاح</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-8">
          <p className="text-neutral-500 font-bold text-lg leading-relaxed">
            تشير سجلاتنا إلى عدم أهليتك لطلب بدل تالف/مفقود حالياً. 
            يرجى التأكد من وجود رخصة نشطة أو مراجعة أقرب فرع للمرور.
          </p>
          <Button onClick={() => router.push("/dashboard")} className="w-full h-12 px-8 rounded-xl bg-[#1a3a8f] hover:bg-[#002868] text-white font-black transition-all">
             العودة للوحة التحكم
           </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 font-arabic space-y-12" dir="rtl">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-gradient-to-br from-[#1a3a8f] to-[#00215a] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-900/30 border border-white/20">
          <FileText className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-[#1a3a8f] tracking-tighter">إصدار بدل تالف أو فاقد</h1>
        <p className="text-neutral-500 font-bold text-lg">خدمة إلكترونية سريعة لإصدار بديل لرخصة القيادة الخاصة بك</p>
        {licenseInfo && (
           <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#1a3a8f]/5 text-[#1a3a8f] rounded-full text-sm font-black border border-[#1a3a8f]/10 mt-4">
             <ShieldCheck className="w-4 h-4" />
             رقم الرخصة النشطة: <span className="font-mono tracking-widest">{licenseInfo.number}</span>
           </div>
        )}
      </div>

      <div className="space-y-8 flex flex-col items-center">
        <div className="flex justify-between items-center w-full max-w-2xl bg-white/50 backdrop-blur-md p-6 rounded-[2rem] border border-neutral-100 shadow-sm overflow-x-auto no-scrollbar">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center gap-3 relative min-w-[80px]">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500",
                idx <= currentStep ? "bg-[#1a3a8f] text-white shadow-xl scale-110" : "bg-neutral-100 text-neutral-400 border border-neutral-200"
              )}>
                {idx < currentStep ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest text-center",
                idx <= currentStep ? "text-[#1a3a8f]" : "text-neutral-400"
              )}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full max-w-2xl bg-neutral-100 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-[#1a3a8f] h-full" 
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-3xl rounded-[3rem] overflow-hidden">
            <CardHeader className="bg-[#1a3a8f]/5 p-10 border-b border-[#1a3a8f]/10 text-center">
              <CardTitle className="text-3xl font-black text-[#1a3a8f] tracking-tighter">{steps[currentStep].label}</CardTitle>
            </CardHeader>
            <CardContent className="p-10 md:p-16">
              {currentStep === 0 && (
                <div className="space-y-8">
                  <RadioGroup 
                    onValueChange={(val) => setValue("reason", val)}
                    defaultValue={currentReason}
                    className="grid grid-cols-1 gap-6"
                  >
                    {[
                      { val: "lost", label: "فقدان الرخصة (بدل مفقود)" },
                      { val: "damaged", label: "تلف الرخصة (بدل تالف)" },
                      { val: "stolen", label: "سرقة الرخصة (يتطلب محضر شرطة)" }
                    ].map(({ val, label }) => (
                      <Label 
                        key={val} 
                        className={cn(
                          "flex items-center justify-between p-10 border-4 rounded-[2.5rem] cursor-pointer transition-all duration-300 group",
                          currentReason === val ? "border-[#1a3a8f] bg-[#1a3a8f]/5 shadow-2xl" : "border-neutral-50 hover:border-[#1a3a8f]/30 hover:bg-neutral-50"
                        )}
                      >
                        <div className="flex items-center gap-5">
                          <div className={cn("w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all", currentReason === val ? "bg-[#1a3a8f] border-[#1a3a8f]" : "border-neutral-200")}>
                             {currentReason === val && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span className={cn("text-2xl font-black tracking-tighter transition-all", currentReason === val ? "text-[#1a3a8f]" : "text-neutral-700")}>{label}</span>
                        </div>
                        {currentReason === val && <CheckCircle2 className="w-8 h-8 text-[#1a3a8f] animate-in fade-in zoom-in" />}
                      </Label>
                    ))}
                  </RadioGroup>
                   {errors.reason && <p className="text-red-500 text-xs font-black flex items-center gap-2 mt-4 px-4"><AlertCircle className="w-4 h-4" /> {errors.reason.message}</p>}
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-10">
                  <div className="p-12 bg-amber-50 rounded-[2.5rem] border border-amber-100 text-neutral-700 leading-relaxed relative overflow-hidden shadow-inner">
                    <div className="absolute -top-6 -right-6 p-4 opacity-5 bg-amber-500 rounded-full">
                      <Clock className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 space-y-6">
                       <h4 className="text-2xl font-black text-amber-900 mb-4 flex items-center gap-3">
                         <ShieldCheck className="w-8 h-8" />
                         إقرار وتعهد صاحب الطلب
                       </h4>
                       <p className="font-bold text-lg text-amber-800/80 leading-loose">
                         أقر أنا صاحب الطلب بأن جميع المعلومات والمبررات المذكورة أعلاه صحيحة وتحت مسؤوليتي الكاملة. كما أتعهد بإعادة النسخة القديمة في حال العثور عليها، وأنه لم يسبق لي استخراج بدل لهذه الرخصة خلال الستة أشهر الماضية. أي تلاعب بالبيانات يعرضني للمسائلة القانونية وفقاً للأنظمة المتبعة في الإدارة العامة للمرور.
                       </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 p-8 bg-white/50 border-2 border-neutral-100 rounded-3xl group cursor-pointer active:scale-[0.98] transition-all" onClick={() => setValue("agreed", !watch("agreed"))}>
                    <div className={cn("w-10 h-10 rounded-xl border-4 flex items-center justify-center transition-all shadow-sm", watch("agreed") ? "bg-[#1a3a8f] border-[#1a3a8f]" : "border-neutral-200 bg-white")}>
                       {watch("agreed") && <CheckCircle2 className="w-6 h-6 text-white" />}
                    </div>
                    <Label className="text-xl font-black text-neutral-700 cursor-pointer select-none leading-tight">
                       أوافق على الشروط والتعهد المذكور أعلاه
                    </Label>
                  </div>
                   {errors.agreed && <p className="text-red-500 text-xs font-black flex items-center gap-2 mt-4 px-4"><AlertCircle className="w-4 h-4" /> {errors.agreed.message}</p>}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-4 mb-10">
                    <div className="w-24 h-24 bg-[#1a3a8f]/5 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl">
                      <FileUp className="w-12 h-12 text-[#1a3a8f]" />
                    </div>
                    <h3 className="text-3xl font-black text-[#1a3a8f] tracking-tighter">مركز المرفقات السيادية</h3>
                    <p className="text-sm font-bold text-neutral-500">يرجى توفير الوثائق الرسمية المطلوبة لضمان معالجة طلبكم</p>
                  </div>
                  
                  <div className="max-w-2xl mx-auto space-y-12">
                    {currentReason === "stolen" && (
                      <FileUploader 
                        label="محضر الشرطة الرسمي"
                        value={watch("documents.policeReport")}
                        onFileSelect={(file) => setValue("documents.policeReport", file as File)}
                        error={errors.documents?.policeReport?.message}
                      />
                    )}
                    {currentReason === "damaged" && (
                      <FileUploader 
                        label="صورة الرخصة التالفة"
                        value={watch("documents.damagedPhoto")}
                        onFileSelect={(file) => setValue("documents.damagedPhoto", file as File)}
                        error={errors.documents?.damagedPhoto?.message}
                      />
                    )}
                     {currentReason === "lost" && (
                       <div className="p-20 text-center bg-neutral-50/50 rounded-[4rem] border-4 border-dashed border-neutral-100 flex flex-col items-center space-y-6 group hover:border-[#1a3a8f]/10 transition-all">
                         <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                             <ShieldCheck className="w-12 h-12 text-[#1a3a8f]/20" />
                         </div>
                         <div className="space-y-2">
                           <p className="text-2xl font-black text-neutral-900 tracking-tighter">نظام التحقق الذاتي نشط</p>
                           <p className="text-sm font-bold text-neutral-400 max-w-xs mx-auto">لا يتطلب طلب بدل مفقود مرفقات ورقية حالياً، سيتم الاعتماد على سجلاتك الرقمية.</p>
                         </div>
                       </div>
                     )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-10">
                  <div className="p-12 bg-[#1a3a8f]/5 rounded-[3rem] border border-[#1a3a8f]/10 shadow-inner space-y-10">
                    <div className="flex justify-between items-center border-b border-[#1a3a8f]/10 pb-8">
                      <h3 className="text-3xl font-black text-[#1a3a8f] tracking-tighter">ملخص الطلب</h3>
                      <div className="bg-[#1a3a8f] text-white px-8 py-3 rounded-2xl text-lg font-black shadow-xl shadow-blue-900/30">رسوم الخدمة: 50.00 ر.ي</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">سبب إصدار البديل</span>
                        <span className="font-black text-[#1a3a8f] bg-white px-6 py-4 rounded-2xl border-2 border-neutral-100 shadow-sm block w-fit">
                          {currentReason === "lost" ? "فقدان الرخصة" : currentReason === "damaged" ? "تلف الرخصة" : "سرقة الرخصة"}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">المستندات المرفقة</span>
                        <div className="space-y-3">
                          {currentReason === "stolen" && (
                            documents.policeReport 
                              ? <span className="flex items-center gap-3 text-emerald-600 font-black px-6 py-4 bg-white rounded-2xl border-2 border-emerald-100 shadow-md w-fit"><CheckCircle2 className="w-6 h-6" /> محضر الشرطة جاهز</span> 
                              : <span className="flex items-center gap-3 text-red-500 font-black px-6 py-4 bg-white rounded-2xl border-2 border-red-100 shadow-md w-fit"><AlertCircle className="w-6 h-6" /> المستند مفقود</span>
                          )}
                          {currentReason === "damaged" && (
                            documents.damagedPhoto 
                              ? <span className="flex items-center gap-3 text-emerald-600 font-black px-6 py-4 bg-white rounded-2xl border-2 border-emerald-100 shadow-md w-fit"><CheckCircle2 className="w-6 h-6" /> صورة التلف جاهزة</span> 
                              : <span className="flex items-center gap-3 text-red-500 font-black px-6 py-4 bg-white rounded-2xl border-2 border-red-100 shadow-md w-fit"><AlertCircle className="w-6 h-6" /> المستند مفقود</span>
                          )}
                          {currentReason === "lost" && <span className="text-neutral-400 font-bold italic">لا توجد مرفقات مطلوبة</span>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">رخصة القيادة المرتبطة</span>
                        <span className="font-black text-neutral-800 text-2xl font-mono tracking-widest">{licenseInfo?.number}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="py-10 space-y-12">
                  <div className="flex flex-col items-center text-center space-y-8">
                     <div className="relative">
                        <div className="w-32 h-32 bg-[#1a3a8f]/5 rounded-[2.5rem] flex items-center justify-center transform rotate-3 shadow-inner">
                          <CreditCard className="w-16 h-16 text-[#1a3a8f]" />
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white border-[6px] border-white shadow-2xl">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                     </div>
                     <div className="space-y-4">
                       <h3 className="text-4xl font-black text-[#1a3a8f] tracking-tighter">سداد الرسوم المقررة</h3>
                       <p className="text-xl font-bold text-neutral-500 max-w-sm">يرجى متابعة عملية الدفع الإلكتروني لإصدار رخصتك الجديدة</p>
                     </div>
                     
                     <div className="w-full max-w-md overflow-hidden rounded-[3rem] border-4 border-neutral-50 bg-white shadow-2xl">
                        <div className="p-10 space-y-6">
                           <div className="flex justify-between items-center text-lg">
                             <span className="text-neutral-400 font-bold">رسوم استخراج البديل</span>
                             <span className="font-black text-[#1a3a8f]">50.00 ر.ي</span>
                           </div>
                           <div className="flex justify-between items-center text-lg">
                             <span className="text-neutral-400 font-bold">ضريبة القيمة المضافة</span>
                             <span className="font-black text-[#1a3a8f]">0.00 ر.ي</span>
                           </div>
                        </div>
                        <div className="p-10 bg-[#1a3a8f] flex justify-between items-center">
                           <span className="font-black text-2xl text-white">الإجمالي المستحق</span>
                           <span className="text-4xl font-black text-white font-mono tracking-tighter">50.00 ر.ي</span>
                        </div>
                     </div>

                    <Button 
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="w-full max-w-md h-24 bg-[#1a3a8f] hover:bg-[#002868] text-white rounded-[2rem] text-2xl font-black transition-all shadow-2xl shadow-blue-900/40 mt-8 active:scale-95 group"
                    >
                      <span className="flex items-center gap-4">
                        سداد الآن وإكمال الطلب
                        <ArrowLeft className="w-8 h-8 transition-transform group-hover:-translate-x-2" />
                      </span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t p-10 bg-neutral-50/20">
              <Button 
                variant="ghost" 
                onClick={prevStep} 
                disabled={currentStep === 0 || isSubmitting}
                className="h-16 px-8 gap-4 font-black text-neutral-500 hover:text-[#1a3a8f] hover:bg-white rounded-2xl transition-all"
              >
                <ArrowRight className="w-6 h-6" />
                رجوع
              </Button>
              
              {currentStep < 3 ? (
                 <Button 
                   onClick={nextStep} 
                   disabled={isSubmitting}
                   className="h-16 px-12 bg-[#1a3a8f] hover:bg-[#002868] text-white text-lg font-black rounded-2xl shadow-xl shadow-blue-900/20 group"
                 >
                   <span>التالي</span>
                   <ArrowLeft className="w-5 h-5 me-3 transition-transform group-hover:translate-x-1" />
                 </Button>
              ) : currentStep === 3 ? (
                 <Button 
                   onClick={handleSubmit(onSubmit)} 
                   disabled={isSubmitting || isDocumentsMissing}
                   className="h-20 px-16 bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-black rounded-[2rem] shadow-2xl shadow-emerald-900/30 transition-all flex items-center gap-4 active:scale-[0.98]"
                 >
                   {isSubmitting ? (
                     <><Loader2 className="w-7 h-7 animate-spin" /> جاري التقديم...</>
                   ) : (
                     <>تأكيد الطلب والمتابعة <ShieldCheck className="w-7 h-7" /></>
                   )}
                 </Button>
              ) : (
                <div className="w-10" />
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>

      <PaymentSimModal
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentSuccess}
        applicationNumber={applicationNumber || ""}
        feeType={FeeType.ReplacementFee}
        amount={50}
      />
    </div>
  );
}
