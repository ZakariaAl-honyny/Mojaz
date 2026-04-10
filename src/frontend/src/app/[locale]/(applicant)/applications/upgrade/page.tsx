'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tractor, CarFront, AlertCircle, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import LicenseService, { LicenseDto, UpgradeTargetCategory } from '@/services/license.service';

interface UpgradeStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function UpgradePage() {
  const t = useTranslations('application.upgrade');
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [licenses, setLicenses] = useState<LicenseDto[]>([]);
  const [selectedLicense, setSelectedLicense] = useState<LicenseDto | null>(null);
  const [upgradeTargets, setUpgradeTargets] = useState<UpgradeTargetCategory[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<UpgradeTargetCategory | null>(null);
  const [branchId, setBranchId] = useState('');
  const [confirmAccuracy, setConfirmAccuracy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadLicenses();
  }, []);

  const loadLicenses = async () => {
    try {
      setIsLoading(true);
      const response = await LicenseService.getUserLicenses();
      if (response.success && response.data) {
        // Filter only active licenses
        const activeLicenses = response.data.filter(l => l.status === 'Active');
        setLicenses(activeLicenses);
      }
    } catch (err) {
      setError('Failed to load your licenses');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUpgradeTargets = async (licenseId: string) => {
    try {
      const response = await LicenseService.getUpgradeTargets(licenseId);
      if (response.success && response.data) {
        setUpgradeTargets(response.data);
      }
    } catch (err) {
      setError('Failed to load available upgrades');
    }
  };

  const handleLicenseSelect = (license: LicenseDto) => {
    setSelectedLicense(license);
    setSelectedTarget(null);
    loadUpgradeTargets(license.id);
    setCurrentStep(2);
  };

  const handleTargetSelect = (target: UpgradeTargetCategory) => {
    setSelectedTarget(target);
    setCurrentStep(3);
  };

  const handleSubmit = async () => {
    if (!selectedLicense || !selectedTarget || !branchId) return;
    
    try {
      setIsSubmitting(true);
      const response = await LicenseService.submitUpgrade(
        selectedLicense.id,
        selectedTarget.id,
        branchId
      );
      
      if (response.success) {
        router.push('/applications');
      } else {
        setError(response.message || 'Failed to submit upgrade application');
      }
    } catch (err) {
      setError('Failed to submit upgrade application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">{t('title')}</h1>
        <p className="text-neutral-500">{t('subtitle')}</p>
      </div>

      {/* Stepper */}
      <div className="flex gap-4 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                currentStep === step
                  ? "bg-primary-500 text-white"
                  : currentStep > step
                  ? "bg-primary-100 text-primary-700"
                  : "bg-neutral-100 text-neutral-400"
              )}
            >
              {step}
            </div>
            <span className={cn(
              "ms-3 font-medium",
              currentStep >= step ? "text-primary-900" : "text-neutral-400"
            )}>
              {step === 1 && t('steps.selectLicense')}
              {step === 2 && t('steps.selectTarget')}
              {step === 3 && t('steps.review')}
            </span>
          </div>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>×</Button>
        </div>
      )}

      {/* Step 1: Select Current License */}
      {currentStep === 1 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>{t('steps.selectLicense')}</CardTitle>
          </CardHeader>
          <CardContent>
            {licenses.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">{t('noLicenses')}</p>
            ) : (
              <div className="grid gap-4">
                {licenses.map((license) => (
                  <button
                    key={license.id}
                    onClick={() => handleLicenseSelect(license)}
                    className={cn(
                      "p-6 rounded-2xl border-2 flex items-center justify-between transition-all",
                      "border-neutral-200 hover:border-primary-300 hover:bg-neutral-50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-neutral-100 text-neutral-500">
                        {license.licenseCategoryCode === 'F' ? (
                          <Tractor className="w-6 h-6" />
                        ) : (
                          <CarFront className="w-6 h-6" />
                        )}
                      </div>
                      <div className="text-start">
                        <h3 className="font-semibold text-lg">
                          {license.licenseCategoryNameEn}
                        </h3>
                        <p className="text-sm text-neutral-500">
                          {t('licenseNumber')}: {license.licenseNumber}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-neutral-400 rtl:rotate-180" />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Target Category */}
      {currentStep === 2 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>{t('steps.selectTarget')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-primary-50 rounded-xl">
              <p className="text-sm text-primary-700">
                {t('upgradingFrom')} <strong>{selectedLicense?.licenseCategoryNameEn}</strong>
              </p>
            </div>
            
            {upgradeTargets.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">{t('noUpgradesAvailable')}</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {upgradeTargets.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => handleTargetSelect(target)}
                    className={cn(
                      "p-6 rounded-2xl border-2 flex items-center justify-between transition-all",
                      "border-neutral-200 hover:border-primary-300 hover:bg-neutral-50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary-100 text-primary-600">
                        <CarFront className="w-6 h-6" />
                      </div>
                      <div className="text-start">
                        <h3 className="font-semibold text-lg">{target.nameEn}</h3>
                        <p className="text-sm text-neutral-500">{t('minAge')}: {target.minAge}</p>
                        {target.requiresFieldTest && (
                          <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                            {t('fieldTestRequired')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                      selectedTarget?.id === target.id ? "border-primary-500" : "border-neutral-300"
                    )}>
                      {selectedTarget?.id === target.id && (
                        <div className="w-3 h-3 bg-primary-500 rounded-full" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="mt-6"
            >
              <ArrowLeft className="w-4 h-4 me-2 rtl:rotate-180" />
              {t('back')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Submit */}
      {currentStep === 3 && selectedTarget && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>{t('steps.review')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-neutral-500 block text-sm">{t('currentLicense')}</span>
                  <span className="font-medium">{selectedLicense?.licenseCategoryNameEn}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-sm">{t('targetCategory')}</span>
                  <span className="font-medium">{selectedTarget.nameEn}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-sm">{t('licenseNumber')}</span>
                  <span className="font-medium">{selectedLicense?.licenseNumber}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('branch')}</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm"
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                >
                  <option value="">{t('selectBranch')}</option>
                  <option value="riyadh-1">{t('riyadhBranch')}</option>
                  <option value="jeddah-1">{t('jeddahBranch')}</option>
                  <option value="dammam-1">{t('dammamBranch')}</option>
                </select>
              </div>

              <div className="flex items-start gap-3 p-4 bg-secondary-50 border border-secondary-200 rounded-xl">
                <Checkbox 
                  id="accuracy" 
                  checked={confirmAccuracy} 
                  onCheckedChange={(checked) => setConfirmAccuracy(checked as boolean)} 
                />
                <Label htmlFor="accuracy" className="text-sm cursor-pointer">
                  {t('confirmAccuracy')}
                </Label>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
              >
                <ArrowLeft className="w-4 h-4 me-2 rtl:rotate-180" />
                {t('back')}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!confirmAccuracy || !branchId || isSubmitting}
                className="bg-primary-500 hover:bg-primary-600"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 me-2 animate-spin" />}
                {t('submit')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}