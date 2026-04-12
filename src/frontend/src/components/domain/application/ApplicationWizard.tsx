"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
<<<<<<< Updated upstream
import { CopyPlus, FileKey2, RefreshCw, CarFront, Bike, Truck, Activity, Tractor } from "lucide-react";
=======
import { CopyPlus, FileKey2, RefreshCw, CarFront, Bike, Truck, Bus, Axe, Activity, Save, Clock } from "lucide-react";
>>>>>>> Stashed changes
import { cn } from "@/lib/utils";

// Service types for step 1
const SERVICE_TYPES = [
  { id: "new", key: "newLicense", icon: FileKey2 },
  { id: "renewal", key: "renewal", icon: RefreshCw },
  { id: "replacement", key: "replacement", icon: CopyPlus },
  { id: "upgrade", key: "categoryUpgrade", icon: RefreshCw },
];

// License categories for step 2
const CATEGORIES = [
<<<<<<< Updated upstream
  { id: "motorcycle", key: "motorcycle", icon: Bike, minAge: 16 },
  { id: "private", key: "privateCar", icon: CarFront, minAge: 18 },
  { id: "taxi", key: "publicTaxi", icon: CarFront, minAge: 21 },
  { id: "heavy", key: "heavyVehicle", icon: Truck, minAge: 21 },
  { id: "agricultural", key: "agricultural", icon: Tractor, minAge: 18 },
=======
  { id: "A", key: "motorcycle", icon: Bike, minAge: 16 },
  { id: "B", key: "privateCar", icon: CarFront, minAge: 18 },
  { id: "C", key: "publicTaxi", icon: CarFront, minAge: 21 },
  { id: "D", key: "heavyVehicle", icon: Truck, minAge: 21 },
  { id: "E", key: "bus", icon: Bus, minAge: 21 },
  { id: "F", key: "agricultural", icon: Axe, minAge: 18 },
>>>>>>> Stashed changes
];

// Branches for step 4
const BRANCHES = [
  { id: "riyadh-main", nameAr: "الرياض - الفرع الرئيسي", nameEn: "Riyadh Main Branch" },
  { id: "jeddah-north", nameAr: "جدة - الفرع الشمالي", nameEn: "Jeddah North Branch" },
  { id: "dammam", nameAr: "الدمام", nameEn: "Dammam Branch" },
  { id: "khobar", nameAr: "الخبر", nameEn: "Khobar Branch" },
  { id: "makkah", nameAr: "مكة المكرمة", nameEn: "Makkah Branch" },
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
  const t = useTranslations("application.create");
<<<<<<< Updated upstream
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    serviceType: "",
    categoryId: "",
    nationalId: "",
    dateOfBirth: "",
    phone: "",
    city: "",
    preferredCenter: "",
    testLanguage: "ar",
    specialNeeds: "",
    confirmAccuracy: false,
  });
=======
  const tc = useTranslations("application");
  const router = useRouter();
  
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
>>>>>>> Stashed changes

  const calculateAge = useCallback((dob: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, []);

  const validateStep = (): boolean => {
    setError(null);
    
    if (currentStep === 1 && !formData.serviceType) {
      setError(t("validation.required"));
      return false;
    }
    
    if (currentStep === 2 && !formData.categoryId) {
      setError(t("validation.required"));
      return false;
    }
    
    if (currentStep === 2 && formData.categoryId && formData.dateOfBirth) {
      const selectedCategory = CATEGORIES.find(c => c.id === formData.categoryId);
      if (selectedCategory) {
        const age = calculateAge(formData.dateOfBirth);
        if (age < selectedCategory.minAge) {
          setError(t("validation.underage", { age: selectedCategory.minAge }));
          return false;
        }
      }
    }
    
    if (currentStep === 3) {
      if (!formData.nationalId) {
        setError(t("validation.required"));
        return false;
      }
      if (!formData.dateOfBirth) {
        setError(t("validation.required"));
        return false;
      }
      
      // Mock active application check
      if (formData.nationalId === "1234567890") {
        setError(t("validation.existingApplication"));
        return false;
      }
    }
    
    if (currentStep === 4) {
      if (!formData.preferredBranch) {
        setError(t("validation.required"));
        return false;
      }
    }
    
    if (currentStep === 5 && !formData.confirmAccuracy) {
      setError(t("validation.required"));
      return false;
    }
    
    return true;
  };

  const updateForm = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((p) => Math.min(p + 1, 5));
    }
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep((p) => Math.max(p - 1, 1));
  };

  const saveDraft = async () => {
    setAutoSaveStatus("saving");
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAutoSaveStatus("saved");
      setLastSaved(new Date());
      setTimeout(() => setAutoSaveStatus("idle"), 2000);
    } catch {
      setAutoSaveStatus("error");
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.serviceType || formData.nationalId) {
        saveDraft();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [formData]);

  const getCategoryName = (id: string): string => {
    const cat = CATEGORIES.find(c => c.id === id);
    if (!cat) return id;
    return t(`fields.${cat.key}` as any);
  };

  const getBranchName = (id: string): string => {
    const branch = BRANCHES.find(b => b.id === id);
    if (!branch) return id;
    return branch.nameAr; // Would use locale to choose
  };

  const STEPS = [
    { num: 1, title: t("steps.service") },
    { num: 2, title: t("steps.category") },
    { num: 3, title: t("steps.personal") },
    { num: 4, title: t("steps.details") },
    { num: 5, title: t("steps.review") },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">{t("title")}</h1>
        <p className="text-neutral-500">{t("subtitle")}</p>
      </div>

      {/* Stepper */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
        {STEPS.map((step) => {
          const isActive = step.num === currentStep;
          const isPast = step.num < currentStep;
          return (
            <div key={step.num} className="flex items-center min-w-max">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                  isActive
                    ? "bg-primary-500 text-white ring-4 ring-primary-100"
                    : isPast
                    ? "bg-primary-100 text-primary-700"
                    : "bg-neutral-100 text-neutral-400"
                )}
              >
                {step.num}
              </div>
              <span
                className={cn(
                  "ms-3 font-medium",
                  isActive ? "text-primary-900" : isPast ? "text-primary-700" : "text-neutral-400"
                )}
              >
                {step.title}
              </span>
              {step.num < STEPS.length && (
                <div
                  className={cn(
                    "w-12 h-1 mx-4 rounded",
                    isPast ? "bg-primary-200" : "bg-neutral-100"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Auto-save status */}
      <div className="mb-4 flex items-center gap-2 text-sm text-neutral-400">
        {autoSaveStatus === "saving" && (
          <>
            <Clock className="w-4 h-4 animate-spin" />
            <span>{t("autoSave")}</span>
          </>
        )}
        {autoSaveStatus === "saved" && (
          <>
            <Save className="w-4 h-4 text-green-500" />
            <span>{t("lastSaved")}: {lastSaved?.toLocaleTimeString()}</span>
          </>
        )}
      </div>

      {/* Wizard Content */}
      <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-xl ring-1 ring-black/5 overflow-hidden">
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8"
            >
              {/* Step 1: Service Type */}
              {currentStep === 1 && (
                <div className="grid md:grid-cols-3 gap-6">
                  {SERVICE_TYPES.map((srv) => (
                    <button
                      key={srv.id}
                      onClick={() => updateForm("serviceType", srv.id)}
                      data-testid={`service-type-${srv.id}`}
                      className={cn(
                        "p-6 rounded-2xl flex flex-col items-center gap-4 border-2 transition-all duration-300",
                        formData.serviceType === srv.id
                          ? "border-primary-500 bg-primary-50 shadow-md transform scale-[1.02]"
                          : "border-neutral-200 hover:border-primary-300 hover:bg-neutral-50"
                      )}
                    >
                      <div className={cn(
                        "p-4 rounded-full", 
                        formData.serviceType === srv.id ? "bg-primary-100 text-primary-600" : "bg-neutral-100 text-neutral-500"
                      )}>
                        <srv.icon className="w-8 h-8" />
                      </div>
                      <span className="font-semibold text-lg">{t(`fields.${srv.key}` as any)}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Category */}
              {currentStep === 2 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {(formData.serviceType === "upgrade" 
                    ? CATEGORIES.filter(cat => {
                        const currentLicense = 'private';
                        const upgradeMapping: Record<string, string> = {
                          'private': 'heavy',
                          'heavy': 'agricultural',
                          'agricultural': 'taxi',
                          'motorcycle': 'private',
                        };
                        return cat.id === upgradeMapping[currentLicense];
                      })
                    : CATEGORIES
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateForm("categoryId", cat.id)}
                      data-testid={`category-${cat.id}`}
                      className={cn(
                        "p-6 rounded-2xl flex justify-between items-center border-2 transition-all duration-300",
                        formData.categoryId === cat.id
                          ? "border-primary-500 bg-primary-50 shadow-md"
                          : "border-neutral-200 hover:border-primary-300 hover:bg-neutral-50"
                      )}
                    >
                      <div className="flex items-center gap-4">
<<<<<<< Updated upstream
                         <div className={cn("p-3 rounded-xl", formData.categoryId === cat.id ? "bg-primary-100 text-primary-600" : "bg-neutral-100 text-neutral-500")}>
                           <cat.icon className="w-6 h-6" />
                         </div>
                         <div className="text-start">
                           <h3 className="font-semibold text-lg">{t(`fields.${cat.key}` as any)}</h3>
                           <div className="flex flex-col gap-1 mt-1">
                             <p className="text-xs text-neutral-500 flex items-center gap-1">
                               <Activity className="w-3 h-3"/> {t("fields.minAge", { age: cat.minAge })}
                             </p>
                             {cat.id === "agricultural" && (
                               <p className="text-[10px] text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full w-fit font-medium">
                                 {t("fields.fieldTest")}
                               </p>
                             )}
                           </div>
                         </div>
=======
                        <div className={cn(
                          "p-3 rounded-xl", 
                          formData.categoryId === cat.id ? "bg-primary-100 text-primary-600" : "bg-neutral-100 text-neutral-500"
                        )}>
                          <cat.icon className="w-6 h-6" />
                        </div>
                        <div className="text-start">
                          <h3 className="font-semibold text-lg">{t(`fields.${cat.key}` as any)}</h3>
                          <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1">
                            <Activity className="w-4 h-4" /> 
                            {t("fields.minAge")}: {cat.minAge}
                          </p>
                        </div>
>>>>>>> Stashed changes
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center", 
                        formData.categoryId === cat.id ? "border-primary-500" : "border-neutral-300"
                      )}>
                        {formData.categoryId === cat.id && <div className="w-3 h-3 bg-primary-500 rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Personal Data */}
              {currentStep === 3 && (
<<<<<<< Updated upstream
                <div className="space-y-6">
                  {formData.serviceType === "upgrade" && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 items-start text-amber-800 text-sm">
                      <Activity className="w-5 h-5 shrink-0" />
                      <p>{t("errors.upgradeNotEligible")}</p>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>{t("fields.nationalId")}</Label>
                      <Input 
                        value={formData.nationalId} 
                        onChange={(e) => updateForm("nationalId", e.target.value)} 
                        data-testid="input-national-id"
                        placeholder="1XXXXXXXXX" 
                        className="bg-neutral-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("fields.dateOfBirth")}</Label>
                      <Input 
                        type="date" 
                        value={formData.dateOfBirth} 
                        onChange={(e) => updateForm("dateOfBirth", e.target.value)} 
                        data-testid="input-dob"
                        className="bg-neutral-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("fields.phone")}</Label>
                      <Input 
                        value={formData.phone} 
                        onChange={(e) => updateForm("phone", e.target.value)} 
                        data-testid="input-phone"
                        placeholder="05XXXXXXXX" 
                        className="bg-neutral-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("fields.city")}</Label>
                      <Input 
                        value={formData.city} 
                        onChange={(e) => updateForm("city", e.target.value)} 
                        data-testid="input-city"
                        className="bg-neutral-50"
                      />
                    </div>
=======
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{t("fields.nationalId")}</Label>
                    <Input 
                      value={formData.nationalId} 
                      onChange={(e) => updateForm("nationalId", e.target.value)} 
                      placeholder="1XXXXXXXXX" 
                      className="bg-neutral-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fields.dateOfBirth")}</Label>
                    <Input 
                      type="date" 
                      value={formData.dateOfBirth} 
                      onChange={(e) => updateForm("dateOfBirth", e.target.value)} 
                      className="bg-neutral-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fields.phone")}</Label>
                    <Input 
                      value={formData.phone} 
                      onChange={(e) => updateForm("phone", e.target.value)} 
                      placeholder="05XXXXXXXX" 
                      className="bg-neutral-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fields.email")}</Label>
                    <Input 
                      type="email"
                      value={formData.email} 
                      onChange={(e) => updateForm("email", e.target.value)} 
                      placeholder="email@example.com" 
                      className="bg-neutral-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fields.city")}</Label>
                    <Input 
                      value={formData.city} 
                      onChange={(e) => updateForm("city", e.target.value)} 
                      className="bg-neutral-50"
                    />
>>>>>>> Stashed changes
                  </div>
                </div>
              )}

              {/* Step 4: Details */}
              {currentStep === 4 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{t("fields.preferredCenter")}</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
<<<<<<< Updated upstream
                      value={formData.preferredCenter} 
                      onChange={(e) => updateForm("preferredCenter", e.target.value)}
                      data-testid="select-center"
=======
                      value={formData.preferredBranch} 
                      onChange={(e) => updateForm("preferredBranch", e.target.value)}
>>>>>>> Stashed changes
                    >
                      <option value="">{t("validation.required")}</option>
                      {BRANCHES.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fields.testLanguage")}</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      value={formData.testLanguage} 
                      onChange={(e) => updateForm("testLanguage", e.target.value)}
                      data-testid="select-language"
                    >
                      <option value="ar">{t("fields.arabic")}</option>
                      <option value="en">{t("fields.english")}</option>
                    </select>
                  </div>
                  <div className="col-span-full space-y-2">
                    <Label>{t("fields.specialNeeds")}</Label>
                    <textarea 
                      className="flex min-h-[100px] w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      value={formData.specialNeeds} 
                      onChange={(e) => updateForm("specialNeeds", e.target.value)} 
<<<<<<< Updated upstream
                      data-testid="textarea-special-needs"
=======
                      placeholder={t("fields.specialNeeds")}
>>>>>>> Stashed changes
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100">
                    <h3 className="font-semibold text-lg text-primary-900 mb-4">{t("steps.review")}</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500 block">{t("fields.serviceType")}</span>
                        <span className="font-medium">
                          {formData.serviceType ? t(`fields.${SERVICE_TYPES.find(s => s.id === formData.serviceType)?.key}` as any) : "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">{t("fields.category")}</span>
                        <span className="font-medium">
                          {formData.categoryId ? getCategoryName(formData.categoryId) : "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">{t("fields.nationalId")}</span>
                        <span className="font-medium">{formData.nationalId || "-"}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">{t("fields.preferredCenter")}</span>
                        <span className="font-medium">
                          {formData.preferredBranch ? getBranchName(formData.preferredBranch) : "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">{t("fields.phone")}</span>
                        <span className="font-medium">{formData.phone || "-"}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">{t("fields.email")}</span>
                        <span className="font-medium">{formData.email || "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-secondary-50 border border-secondary-200 rounded-xl">
<<<<<<< Updated upstream
                    <Checkbox id="accuracy" data-testid="checkbox-accuracy" checked={formData.confirmAccuracy} onCheckedChange={(checked) => updateForm("confirmAccuracy", checked)} />
=======
                    <Checkbox 
                      id="accuracy" 
                      checked={formData.confirmAccuracy} 
                      onCheckedChange={(checked) => updateForm("confirmAccuracy", checked)} 
                    />
>>>>>>> Stashed changes
                    <Label htmlFor="accuracy" className="text-sm cursor-pointer leading-tight text-neutral-700">
                      {t("fields.confirmAccuracy")}
                    </Label>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center mt-8">
<<<<<<< Updated upstream
        <Button 
          variant="outline" 
          onClick={prevStep} 
          disabled={currentStep === 1}
          data-testid="wizard-prev"
          className="border-neutral-200 hover:bg-neutral-100 text-neutral-700"
        >
          {t("prev")}
        </Button>
=======
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            className="border-neutral-200 hover:bg-neutral-100 text-neutral-700"
          >
            {t("prev")}
          </Button>
          
          <Button 
            variant="outline"
            onClick={saveDraft}
            disabled={!formData.serviceType}
            className="border-neutral-200 hover:bg-neutral-100 text-neutral-700"
          >
            <Save className="w-4 h-4 me-2" />
            {t("saveDraft")}
          </Button>
        </div>
>>>>>>> Stashed changes
        
        {currentStep < 5 ? (
          <Button 
            onClick={nextStep}
            data-testid="wizard-next"
            className="bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/20 px-8"
          >
            {t("next")}
          </Button>
        ) : (
          <Button 
            disabled={!formData.confirmAccuracy}
            className="bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/20 px-8 disabled:opacity-50"
            data-testid="wizard-submit"
            onClick={() => {
              // Handle submit
              console.log("Submitting:", formData);
              alert(t("success"));
              router.push("/applications");
            }}
          >
            {t("submit")}
          </Button>
        )}
      </div>
    </div>
  );
}