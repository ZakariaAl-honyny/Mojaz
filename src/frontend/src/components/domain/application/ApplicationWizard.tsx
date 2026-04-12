"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CopyPlus, FileKey2, RefreshCw, CarFront, Bike, Truck, Activity, Tractor } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for wizard options
const SERVICE_TIPES = [
  { id: "new", key: "newLicense", icon: FileKey2 },
  { id: "renewal", key: "renewal", icon: RefreshCw },
  { id: "replacement", key: "replacement", icon: CopyPlus },
  { id: "upgrade", key: "categoryUpgrade", icon: RefreshCw },
];

const CATEGORIES = [
  { id: "motorcycle", key: "motorcycle", icon: Bike, minAge: 16 },
  { id: "private", key: "privateCar", icon: CarFront, minAge: 18 },
  { id: "taxi", key: "publicTaxi", icon: CarFront, minAge: 21 },
  { id: "heavy", key: "heavyVehicle", icon: Truck, minAge: 21 },
  { id: "agricultural", key: "agricultural", icon: Tractor, minAge: 18 },
];

export function ApplicationWizard() {
  const t = useTranslations("application.create");
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

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateStep = () => {
    setError(null);
    if (currentStep === 1 && !formData.serviceType) return false;
    if (currentStep === 2 && !formData.categoryId) return false;
    if (currentStep === 3) {
      if (!formData.nationalId || !formData.dateOfBirth) {
        setError("National ID and Date of Birth are required.");
        return false;
      }
      
      const selectedCategory = CATEGORIES.find(c => c.id === formData.categoryId);
      if (selectedCategory) {
        const age = calculateAge(formData.dateOfBirth);
        if (age < selectedCategory.minAge) {
          setError(`You must be at least ${selectedCategory.minAge} years old for this category.`);
          return false;
        }
      }

      // Mock Active Application Check
      if (formData.nationalId === "1234567890") {
        setError("Our records show you already have an active application. Please check your dashboard.");
        return false;
      }
    }
    return true;
  };

  const updateForm = (field: string, value: any) => {
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

      {/* Stepper logic */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4 custom-scrollbar">
        {STEPS.map((step) => {
          const isActive = step.num === currentStep;
          const isPast = step.num < currentStep;
          return (
            <div key={step.num} className="flex items-center min-w-[max-content]">
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
                  {SERVICE_TIPES.map((srv) => (
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
                      <div className={cn("p-4 rounded-full", formData.serviceType === srv.id ? "bg-primary-100 text-primary-600" : "bg-neutral-100 text-neutral-500")}>
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
                      </div>
                      <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center", formData.categoryId === cat.id ? "border-primary-500" : "border-neutral-300")}>
                         {formData.categoryId === cat.id && <div className="w-3 h-3 bg-primary-500 rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Personal Data */}
              {currentStep === 3 && (
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
                      value={formData.preferredCenter} 
                      onChange={(e) => updateForm("preferredCenter", e.target.value)}
                      data-testid="select-center"
                    >
                      <option value="">Select Branch</option>
                      <option value="riyadh-1">Riyadh Main Branch</option>
                      <option value="jeddah-1">Jeddah North Branch</option>
                      <option value="dammam-1">Dammam Branch</option>
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
                      data-testid="textarea-special-needs"
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
                        <span className="font-medium">{formData.serviceType || "-"}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">{t("fields.category")}</span>
                        <span className="font-medium">{formData.categoryId || "-"}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">{t("fields.nationalId")}</span>
                        <span className="font-medium">{formData.nationalId || "-"}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">{t("fields.preferredCenter")}</span>
                        <span className="font-medium">{formData.preferredCenter || "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-secondary-50 border border-secondary-200 rounded-xl">
                    <Checkbox id="accuracy" data-testid="checkbox-accuracy" checked={formData.confirmAccuracy} onCheckedChange={(checked) => updateForm("confirmAccuracy", checked)} />
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
        <Button 
          variant="outline" 
          onClick={prevStep} 
          disabled={currentStep === 1}
          data-testid="wizard-prev"
          className="border-neutral-200 hover:bg-neutral-100 text-neutral-700"
        >
          {t("prev")}
        </Button>
        
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
              // Stub: submit logic
              console.log("Submitting:", formData);
              alert(t("success"));
            }}
          >
            {t("submit")}
          </Button>
        )}
      </div>
    </div>
  );
}