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
import { CopyPlus, FileKey2, RefreshCw, CarFront, Bike, Truck, Bus, Activity, Save, Clock, Tractor, ChevronRight, ChevronLeft, ShieldCheck, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { WizardProgressBar } from "./wizard/WizardProgressBar";
import { StepId, ServiceType } from '@/types/wizard.types';
import { useWizardStore } from "@/stores/wizard-store";
import { MedicalVerificationFlow } from "./MedicalVerificationFlow";
import { TheoryTestSimulator } from "./TheoryTestSimulator";

// Service types for step 1
const SERVICE_TYPES = [
  { id: "new", key: "newLicense", icon: FileKey2, serviceType: ServiceType.NewLicense },
  { id: "renewal", key: "renewal", icon: RefreshCw, serviceType: ServiceType.Renewal },
  { id: "replacement", key: "replacement", icon: CopyPlus, serviceType: ServiceType.Replacement },
  { id: "upgrade", key: "categoryUpgrade", icon: RefreshCw, serviceType: ServiceType.CategoryUpgrade },
];

const CATEGORIES = [
  { id: "A", key: "motorcycle", icon: Bike, minAge: 16 },
  { id: "B", key: "privateCar", icon: CarFront, minAge: 18 },
  { id: "C", key: "publicTaxi", icon: CarFront, minAge: 21 },
  { id: "D", key: "heavyVehicle", icon: Truck, minAge: 21 },
  { id: "E", key: "bus", icon: Bus, minAge: 21 },
  { id: "F", key: "agricultural", icon: Tractor, minAge: 18 },
];

const BRANCHES = [
  { id: "riyadh-main", nameAr: "الرياض - الفرع الرئيسي", nameEn: "Riyadh Main Branch" },
  { id: "jeddah-north", nameAr: "جدة - الفرع الشمالي", nameEn: "Jeddah North Branch" },
  { id: "dammam", nameAr: "الدمام", nameEn: "Dammam Branch" },
  { id: "khobar", nameAr: "الخبر", nameEn: "Khobar Branch" },
  { id: "makkah", nameAr: "مكة المكرمة", nameEn: "Makkah Branch" },
];

export function ApplicationWizard() {
  const t = useTranslations("application.create");
  const router = useRouter();
  const store = useWizardStore();

  const [error, setError] = useState<string | null>(null);

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

    if (store.currentStep === 1 && !store.step1.serviceType) {
      setError(t("validation.required"));
      return false;
    }

    if (store.currentStep === 2 && !store.step2.categoryCode) {
      setError(t("validation.required"));
      return false;
    }

    if (store.currentStep === 3) {
      if (!store.step3.nationalId || !store.step3.dateOfBirth) {
        setError(t("validation.required"));
        return false;
      }
    }

    if (store.currentStep === 4 && !store.step4.preferredCenterId) {
      setError(t("validation.required"));
      return false;
    }

    if (store.currentStep === 5 && !store.declarationAccepted) {
      setError(t("validation.required"));
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      store.goTo((store.currentStep + 1) as StepId);
    }
  };

  const prevStep = () => {
    setError(null);
    store.goTo((store.currentStep - 1) as StepId);
  };

  const isNewLicense = store.step1.serviceType === ServiceType.NewLicense;

  const getStepsHeader = () => {
    const baseSteps = [
      { num: 1, title: t("steps.service") },
      { num: 2, title: t("steps.category") },
      { num: 3, title: t("steps.personal") },
      { num: 4, title: t("steps.details") },
      { num: 5, title: t("steps.review") },
    ];
    if (isNewLicense) {
      return [
        ...baseSteps,
        { num: 6, title: "Medical" },
        { num: 7, title: "Theory" },
      ];
    }
    return baseSteps;
  };

  const totalSteps = isNewLicense ? 7 : 5;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-4xl font-black text-white mb-4 tracking-tighter transition-all">
          {t("title")}
        </h1>
        <p className="text-neutral-500 font-bold uppercase tracking-[0.2em] text-xs">
          Sovereign License Issuance Service
        </p>
      </div>

      <div className="mb-12 max-w-4xl mx-auto">
        <WizardProgressBar
          currentStep={store.currentStep}
          onStepClick={(step) => store.goTo(step as StepId)}
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-black uppercase tracking-widest text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Helper Sidebar */}
        <div className="lg:col-span-3 space-y-4 hidden lg:block">
          <Card className="bg-white/5 border border-white/10 rounded-[2rem] p-6">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1">Current Progress</p>
                <p className="text-xl font-black text-white">{Math.round((store.currentStep / totalSteps) * 100)}% Complete</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-primary-500" />
                  Encrypted Submission
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-neutral-400">
                  <Clock className="w-4 h-4 text-primary-500" />
                  Est. Time: 12 Minutes
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Wizard Area */}
        <div className="lg:col-span-9 space-y-8">
          <Card className="gov-glass-panel rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={store.currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-12"
                >
                  {/* Step 1: Service Type */}
                  {store.currentStep === 1 && (
                    <div className="space-y-12">
                      <div className="space-y-3">
                        <h2 className="text-3xl font-black text-white tracking-tight">{t("steps.service")}</h2>
                        <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">{t("description.service")}</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {SERVICE_TYPES.map((srv) => (
                          <button
                            key={srv.id}
                            onClick={() => store.setStep1({ serviceType: srv.serviceType })}
                            className={cn(
                              "relative group p-8 rounded-[2rem] flex items-center gap-8 border transition-all duration-500",
                              store.step1.serviceType === srv.serviceType
                                ? "bg-primary-600 border-primary-400 shadow-[0_20px_40px_rgba(0,108,53,0.3)] scale-[1.02]"
                                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                            )}
                          >
                            <div className={cn(
                              "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                              store.step1.serviceType === srv.serviceType ? "bg-white text-primary-600" : "bg-white/5 text-neutral-500"
                            )}>
                              <srv.icon className="w-8 h-8" />
                            </div>
                            <span className={cn(
                              "text-xl font-black tracking-tight",
                              store.step1.serviceType === srv.serviceType ? "text-white" : "text-neutral-400"
                            )}>
                              {t(`fields.${srv.key}` as any)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Category */}
                  {store.currentStep === 2 && (
                    <div className="space-y-12">
                      <div className="space-y-3">
                        <h2 className="text-3xl font-black text-white tracking-tight">{t("steps.category")}</h2>
                        <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">{t("description.category")}</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => store.setStep2({ categoryCode: cat.id as any })}
                            className={cn(
                              "relative group p-8 rounded-[2rem] flex justify-between items-center border transition-all duration-500",
                              store.step2.categoryCode === cat.id
                                ? "bg-primary-600 border-primary-400 shadow-[0_20px_40px_rgba(0,108,53,0.3)] scale-[1.02]"
                                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                            )}
                          >
                            <div className="flex items-center gap-6">
                              <cat.icon className={cn("w-10 h-10", store.step2.categoryCode === cat.id ? "text-white" : "text-neutral-600")} />
                              <div className="text-start">
                                <h3 className="text-xl font-black text-white">{t(`fields.${cat.key}` as any)}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary-400/70">Min Age: {cat.minAge}</p>
                              </div>
                            </div>
                            <div className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                              store.step2.categoryCode === cat.id ? "border-white bg-white" : "border-white/10"
                            )}>
                              {store.step2.categoryCode === cat.id && <div className="w-2 h-2 bg-primary-600 rounded-full" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Personal (Refactored to check nationalId/dob) */}
                  {store.currentStep === 3 && (
                    <div className="space-y-12">
                      <div className="space-y-3">
                        <h2 className="text-3xl font-black text-white tracking-tight">{t("steps.personal")}</h2>
                        <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">Verification of Identity Details</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-xs font-black text-primary-500 uppercase tracking-widest">National ID</Label>
                          <Input
                            value={store.step3.nationalId}
                            onChange={(e) => store.setStep3({ nationalId: e.target.value })}
                            className="h-16 bg-white/5 border-white/10 rounded-2xl text-xl font-black tracking-widest text-white px-6 focus:ring-primary-500 focus:bg-white/10 transition-all"
                            placeholder="1XXXXXXXXX"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-xs font-black text-primary-500 uppercase tracking-widest">Date of Birth</Label>
                          <Input
                            type="date"
                            value={store.step3.dateOfBirth}
                            onChange={(e) => store.setStep3({ dateOfBirth: e.target.value })}
                            className="h-16 bg-white/5 border-white/10 rounded-2xl text-xl font-black text-white px-6 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Details */}
                  {store.currentStep === 4 && (
                    <div className="space-y-12">
                      <div className="space-y-3">
                        <h2 className="text-3xl font-black text-white tracking-tight">{t("steps.details")}</h2>
                        <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">Administrative Hub Selection</p>
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                           <Label className="text-xs font-black text-primary-500 uppercase tracking-widest">Preferred License Center</Label>
                           <div className="grid md:grid-cols-2 gap-4">
                              {BRANCHES.map((branch) => (
                                 <button
                                    key={branch.id}
                                    onClick={() => store.setStep4({ preferredCenterId: branch.id })}
                                    className={cn(
                                       "p-6 rounded-2xl border transition-all text-start group",
                                       store.step4.preferredCenterId === branch.id 
                                          ? "bg-primary-600 border-primary-400 text-white" 
                                          : "bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10"
                                    )}
                                 >
                                    <p className="font-arabic font-black text-lg">{branch.nameAr}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{branch.nameEn}</p>
                                 </button>
                              ))}
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Review & Submit */}
                  {store.currentStep === 5 && (
                    <div className="space-y-12">
                      <div className="space-y-3">
                        <h2 className="text-3xl font-black text-white tracking-tight">{t("steps.review")}</h2>
                        <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">Final Approval of Application Data</p>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-10">
                        <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1 block">Service Request</span>
                            <p className="text-2xl font-black text-white">{store.step1.serviceType}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1 block">License Category</span>
                            <p className="text-2xl font-black text-white font-mono">{store.step2.categoryCode}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1 block">National Identifier</span>
                            <p className="text-2xl font-black text-white font-mono tracking-widest">{store.step3.nationalId}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1 block">Full Name (System)</span>
                            <p className="text-2xl font-black text-white">ZAKARIA MOHAMMED AL-HONONY</p>
                          </div>
                        </div>

                        <div className="pt-10 border-t border-white/5">
                          <div className={cn(
                            "flex items-start gap-4 p-8 rounded-[2rem] transition-all duration-500",
                            store.declarationAccepted ? "bg-primary-600/10 border border-primary-500/30" : "bg-white/5 border border-white/5 hover:bg-white/10"
                          )}>
                            <Checkbox
                              id="accuracy"
                              checked={store.declarationAccepted}
                              onCheckedChange={(checked) => store.setDeclaration(checked as boolean)}
                              className="w-8 h-8 rounded-xl border-white/20 data-[state=checked]:bg-primary-600"
                            />
                            <Label htmlFor="accuracy" className="text-lg font-bold text-neutral-300 leading-relaxed cursor-pointer select-none">
                              I hereby certify that all information provided is accurate and I understand the legal implications of falsifying government records.
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 6: Medical Flow (Dynamic) */}
                  {store.currentStep === 6 && (
                    <MedicalVerificationFlow
                      applicationId={store.applicationId || "MOJ-SIM-123"}
                      onComplete={() => {
                        store.setMedicalVerified(true);
                        store.goTo(7);
                      }}
                    />
                  )}

                  {/* Step 7: Theory Test Simulator (Dynamic) */}
                  {store.currentStep === 7 && (
                    <TheoryTestSimulator
                      onComplete={(score) => {
                        store.setTheoryTestResult(score >= 2, score);
                        store.goTo(8);
                      }}
                    />
                  )}

                  {/* Step 8: Success / Final State */}
                  {store.currentStep === 8 && (
                    <div className="text-center py-20 space-y-12">
                      <div className="w-32 h-32 bg-primary-600 rounded-[3rem] items-center justify-center flex mx-auto shadow-[0_20px_60px_rgba(0,108,53,0.5)]">
                        <ClipboardCheck className="w-16 h-16 text-white" />
                      </div>
                      <div className="space-y-4">
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Application Vaulted</h2>
                        <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Awaiting Final Administrative Review</p>
                      </div>
                      <Button
                        onClick={() => router.push("/dashboard")}
                        className="h-16 px-16 rounded-[1.5rem] bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-neutral-200 transition-all"
                      >
                        Go to Sovereign Dashboard
                      </Button>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          {store.currentStep < 6 && (
            <div className="flex justify-between items-center bg-black/40 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={store.currentStep === 1}
                className="h-14 px-8 rounded-2xl text-neutral-400 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-xs gap-3 transition-all disabled:opacity-20"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                Previous Step
              </Button>

              <Button
                onClick={nextStep}
                disabled={store.currentStep === 5 && !store.declarationAccepted}
                className="h-14 px-12 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white font-black uppercase tracking-widest text-xs gap-3 transition-all shadow-lg hover:shadow-primary-500/30 active:scale-95 disabled:opacity-30"
              >
                {store.currentStep === 5 ? "Invoke Submission" : "Advance to Step " + (store.currentStep + 1)}
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Missing Lucide icons
function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}