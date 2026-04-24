"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CopyPlus, FileKey2, RefreshCw, CarFront, Bike, Truck, Bus, Axe, Activity, Save, Clock, ShieldCheck, MapPin, Globe, User, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Service types for step 1
const SERVICE_TYPES = [
  { id: "new", label: "إصدار رخصة جديدة", icon: FileKey2, description: "طلب رخصة قيادة لأول مرة" },
  { id: "renewal", label: "تجديد رخصة", icon: RefreshCw, description: "تجديد رخصة قيادة منتهية" },
  { id: "replacement", label: "بدل تالف / مفقود", icon: CopyPlus, description: "إصدار بدل فاقد أو تالف" },
  { id: "upgrade", label: "ترقية الفئة", icon: RefreshCw, description: "إضافة فئات جديدة للرخصة" },
];

// License categories for step 2
const CATEGORIES = [
  { id: "A", label: "دراجة نارية", icon: Bike, minAge: 16 },
  { id: "B", label: "خصوصي (سيارة صغيرة)", icon: CarFront, minAge: 18 },
  { id: "C", label: "نقل خفيف (أجرة)", icon: CarFront, minAge: 21 },
  { id: "D", label: "نقل ثقيل", icon: Truck, minAge: 21 },
  { id: "E", label: "حافلة", icon: Bus, minAge: 21 },
  { id: "F", label: "مركبات زراعية / إنشائية", icon: Axe, minAge: 18 },
];

// Yemeni Branches for step 4
const BRANCHES = [
  { id: "sana-main", name: "صنعاء - المركز الرئيسي" },
  { id: "taiz", name: "تعز - فرع المدينة" },
  { id: "ibb", name: "إب - فرع المحافظة" },
  { id: "hodeidan", name: "الحديدة - فرع الميناء" },
  { id: "dhamar", name: "ذمار - فرع المدينة" },
];

interface FormData {
  serviceType: string;
  categoryId: string;
  nationalId: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  city: string;
  preferredBranch: string;
  testLanguage: "ar" | "en";
  specialNeeds: string;
  confirmAccuracy: boolean;
}

const INITIAL_FORM_DATA: FormData = {
  serviceType: "",
  categoryId: "",
  nationalId: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  city: "",
  preferredBranch: "",
  testLanguage: "ar",
  specialNeeds: "",
  confirmAccuracy: false,
};

export function ApplicationWizard() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const calculateAge = useCallback((dob: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }, []);

  const validateStep = (): boolean => {
    setError(null);
    if (currentStep === 1 && !formData.serviceType) {
      setError("يرجى اختيار نوع الخدمة المطلوبة للمتابعة");
      return false;
    }
    if (currentStep === 2 && !formData.categoryId) {
      setError("يرجى اختيار فئة الرخصة المطلوبة");
      return false;
    }
    if (currentStep === 3) {
      if (!formData.nationalId) { setError("يرجى إدخال رقم الهوية الوطنية"); return false; }
      if (!formData.dateOfBirth) { setError("يرجى إدخال تاريخ الميلاد"); return false; }
    }
    if (currentStep === 4 && !formData.preferredBranch) {
      setError("يرجى اختيار فرع المرور المفضل لإجراء المعاملة");
      return false;
    }
    return true;
  };

  const updateForm = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const nextStep = () => {
    if (validateStep()) setCurrentStep((p) => Math.min(p + 1, 5));
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep((p) => Math.max(p - 1, 1));
  };

  const STEPS = [
    { num: 1, title: "نوع الخدمة", icon: FileKey2 },
    { num: 2, title: "فئة الرخصة", icon: Globe },
    { num: 3, title: "البيانات الشخصية", icon: User },
    { num: 4, title: "تفاصيل الطلب", icon: MapPin },
    { num: 5, title: "المراجعة والتأكيد", icon: ShieldCheck },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 font-arabic" dir="rtl">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-[#1a3a8f] tracking-tighter mb-4">طلب خدمة إلكترونية</h1>
        <p className="text-neutral-500 font-bold text-lg">أكمل الخطوات التالية لتقديم طلبك للإدارة العامة للمرور</p>
      </div>

      {/* Stepper */}
      <div className="flex justify-between items-center mb-16 relative bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-x-auto no-scrollbar">
        {STEPS.map((step, idx) => {
          const isActive = step.num === currentStep;
          const isPast = step.num < currentStep;
          return (
            <div key={step.num} className="flex flex-col items-center min-w-[120px] relative z-10">
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                  isActive
                    ? "bg-[#1a3a8f] text-white shadow-2xl shadow-blue-900/30 scale-110"
                    : isPast
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-neutral-50 text-neutral-300 border border-neutral-100"
                )}
              >
                <step.icon className={cn("w-7 h-7", isActive ? "animate-pulse" : "")} />
              </div>
              <span
                className={cn(
                  "mt-4 font-black text-[10px] uppercase tracking-widest text-center whitespace-nowrap",
                  isActive ? "text-[#1a3a8f]" : isPast ? "text-emerald-600" : "text-neutral-400"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
        {/* Progress Line */}
        <div className="absolute top-[4.5rem] left-[10%] right-[10%] h-0.5 bg-neutral-100 -z-0" />
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8 p-6 rounded-3xl bg-red-400/10 border border-red-500/20 text-red-200 text-sm font-bold text-center flex items-center justify-center gap-3"
          >
            <Activity className="w-5 h-5" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wizard Content */}
      <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-3xl rounded-[3rem] ring-1 ring-black/5 overflow-hidden min-h-[500px]">
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="p-10 md:p-16"
            >
              {/* Step 1: Service Type */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {SERVICE_TYPES.map((srv) => (
                    <button
                      key={srv.id}
                      onClick={() => updateForm("serviceType", srv.id)}
                      className={cn(
                        "p-10 rounded-[2.5rem] flex flex-col items-center gap-6 border-4 text-center transition-all duration-500 group",
                        formData.serviceType === srv.id
                          ? "border-[#1a3a8f] bg-[#1a3a8f]/5 shadow-2xl scale-[1.02]"
                          : "border-neutral-100 hover:border-[#1a3a8f]/30 hover:bg-neutral-50"
                      )}
                    >
                      <div className={cn(
                        "w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500", 
                        formData.serviceType === srv.id ? "bg-[#1a3a8f] text-white shadow-xl" : "bg-neutral-100 text-neutral-400 bg-white shadow-sm"
                      )}>
                        <srv.icon className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                         <h3 className={cn("font-black text-2xl tracking-tighter", formData.serviceType === srv.id ? "text-[#1a3a8f]" : "text-neutral-700")}>{srv.label}</h3>
                         <p className="text-sm font-bold text-neutral-400">{srv.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Category */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateForm("categoryId", cat.id)}
                      className={cn(
                        "p-8 rounded-3xl flex justify-between items-center border-2 transition-all duration-500 group",
                        formData.categoryId === cat.id
                          ? "border-[#1a3a8f] bg-[#1a3a8f]/5"
                          : "border-neutral-100 hover:border-[#1a3a8f]/30 hover:bg-neutral-50"
                      )}
                    >
                      <div className="flex items-center gap-6">
                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-all", formData.categoryId === cat.id ? "bg-[#1a3a8f] text-white shadow-lg" : "bg-neutral-100 text-neutral-400")}>
                          <cat.icon className="w-8 h-8" />
                        </div>
                        <div className="text-right">
                          <h3 className={cn("font-black text-lg", formData.categoryId === cat.id ? "text-[#1a3a8f]" : "text-neutral-700")}>{cat.label}</h3>
                          <p className="text-xs font-bold text-neutral-400 mt-1">الحد الأدنى للسن: {cat.minAge} عاماً</p>
                        </div>
                      </div>
                      <div className={cn(
                         "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", 
                         formData.categoryId === cat.id ? "border-[#1a3a8f] bg-[#1a3a8f]" : "border-neutral-200"
                       )}>
                         {formData.categoryId === cat.id && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Personal Data */}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Label className="text-sm font-black text-[#1a3a8f] mr-2">رقم الهوية الوطنية / البطاقة الشخصية</Label>
                    <Input 
                      value={formData.nationalId} 
                      onChange={(e) => updateForm("nationalId", e.target.value)} 
                      placeholder="XXXXXXXXXX" 
                      className="h-16 bg-neutral-50 border-neutral-100 rounded-2xl px-6 font-bold text-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-sm font-black text-[#1a3a8f] mr-2">تاريخ الميلاد (يوم/شهر/سنة)</Label>
                    <Input 
                      type="date" 
                      value={formData.dateOfBirth} 
                      onChange={(e) => updateForm("dateOfBirth", e.target.value)} 
                      className="h-16 bg-neutral-50 border-neutral-100 rounded-2xl px-6 font-bold"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-sm font-black text-[#1a3a8f] mr-2">رقم الهاتف الجوال</Label>
                    <Input 
                      value={formData.phone} 
                      onChange={(e) => updateForm("phone", e.target.value)} 
                      placeholder="+967..." 
                      className="h-16 bg-neutral-50 border-neutral-100 rounded-2xl px-6 font-bold text-lg dir-ltr text-right"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-sm font-black text-[#1a3a8f] mr-2">البريد الإلكتروني</Label>
                    <Input 
                      type="email"
                      value={formData.email} 
                      onChange={(e) => updateForm("email", e.target.value)} 
                      placeholder="user@example.com" 
                      className="h-16 bg-neutral-50 border-neutral-100 rounded-2xl px-6 font-bold text-lg"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Details */}
              {currentStep === 4 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Label className="text-sm font-black text-[#1a3a8f] mr-2">فرع المرور المفضل</Label>
                    <select 
                      className="flex h-16 w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-6 font-bold text-lg shadow-sm outline-none focus:ring-4 focus:ring-[#1a3a8f]/10"
                      value={formData.preferredBranch} 
                      onChange={(e) => updateForm("preferredBranch", e.target.value)}
                    >
                      <option value="">اختر الفرع الأقرب إليك...</option>
                      {BRANCHES.map((branch) => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-sm font-black text-[#1a3a8f] mr-2">لغة الاختبار المفضل</Label>
                    <select 
                      className="flex h-16 w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-6 font-bold text-lg shadow-sm outline-none focus:ring-4 focus:ring-[#1a3a8f]/10"
                      value={formData.testLanguage} 
                      onChange={(e) => updateForm("testLanguage", e.target.value)}
                    >
                      <option value="ar">اللغة العربية</option>
                      <option value="en">English (الإنجليزية)</option>
                    </select>
                  </div>
                  <div className="col-span-full space-y-4">
                    <Label className="text-sm font-black text-[#1a3a8f] mr-2">هل لديك أي احتياجات خاصة؟ (اختياري)</Label>
                    <textarea 
                      className="flex min-h-[120px] w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-6 py-4 font-bold text-lg shadow-sm outline-none focus:ring-4 focus:ring-[#1a3a8f]/10"
                      value={formData.specialNeeds} 
                      onChange={(e) => updateForm("specialNeeds", e.target.value)} 
                      placeholder="يرجى ذكر أي إعاقة أو احتياج خاص لمراعاته أثناء الاختبار..."
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="space-y-10">
                  <div className="bg-[#1a3a8f]/5 p-10 rounded-[2.5rem] border border-[#1a3a8f]/10 shadow-inner">
                    <h3 className="font-black text-2xl text-[#1a3a8f] mb-8 pb-4 border-b border-[#1a3a8f]/10 flex items-center gap-3">
                      <ShieldCheck className="w-8 h-8" />
                      مراجعة بيانات الطلب
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">نوع الخدمة</span>
                        <span className="font-black text-lg text-neutral-800 block">{formData.serviceType ? SERVICE_TYPES.find(s => s.id === formData.serviceType)?.label : "غير محدد"}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">فئة الرخصة</span>
                        <span className="font-black text-lg text-neutral-800 block">{formData.categoryId ? CATEGORIES.find(c => c.id === formData.categoryId)?.label : "غير محدد"}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">رقم الهوية</span>
                        <span className="font-black text-lg text-neutral-800 block font-mono tracking-widest">{formData.nationalId || "غير محدد"}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">الفرع المختار</span>
                        <span className="font-black text-lg text-neutral-800 block">{formData.preferredBranch ? BRANCHES.find(b => b.id === formData.preferredBranch)?.name : "غير محدد"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-8 bg-amber-50/50 border border-amber-100 rounded-3xl group cursor-pointer active:scale-[0.98] transition-all" onClick={() => updateForm("confirmAccuracy", !formData.confirmAccuracy)}>
                    <div className={cn("w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all", formData.confirmAccuracy ? "bg-[#1a3a8f] border-[#1a3a8f]" : "border-neutral-200 bg-white")}>
                       {formData.confirmAccuracy && <ShieldCheck className="w-5 h-5 text-white" />}
                    </div>
                    <Label className="text-sm font-black text-neutral-700 cursor-pointer select-none">
                      أتعهد بأن جميع البيانات المدخلة صحيحة وتحت مسؤوليتي الشخصية الكاملة
                    </Label>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Footer Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-6">
        <div className="flex gap-4 w-full sm:w-auto">
          <Button 
            variant="ghost" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            className="h-16 px-8 flex-1 sm:flex-none font-black text-neutral-400 hover:text-white hover:bg-[#1a3a8f] rounded-2xl transition-all"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            السابق
          </Button>
          
          <Button 
            variant="ghost"
            onClick={() => {}}
            className="h-16 px-8 flex-1 sm:flex-none font-black text-[#1a3a8f] bg-[#1a3a8f]/5 hover:bg-[#1a3a8f]/10 rounded-2xl transition-all"
          >
            <Save className="w-5 h-5 ml-2" />
            حفظ كمسودة
          </Button>
        </div>
        
        {currentStep < 5 ? (
          <Button 
            onClick={nextStep}
            className="w-full sm:w-64 h-12 bg-[#1a3a8f] hover:bg-[#002868] text-white text-base font-bold rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center justify-center gap-2">
              <span>الخطوة التالية</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </Button>
        ) : (
          <Button 
            disabled={!formData.confirmAccuracy}
            onClick={() => {
              console.log("Submitting:", formData);
              router.push("/applications");
            }}
            className="w-full sm:w-64 h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            تقديم الطلب الآن
          </Button>
        )}
      </div>
    </div>
  );
}