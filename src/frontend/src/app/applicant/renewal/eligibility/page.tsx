'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Loader2,
  AlertCircle,
  CreditCard,
  Calendar,
  Clock,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  FileText,
  Shield,
  AlertTriangle,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import LicenseService, { RenewalEligibilityResponse, LicenseCategoryOption } from '@/services/license.service';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function RenewalEligibilityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const displayCategoryName = searchParams.get('displayCategoryName') || '';

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categoryId || '');
  const [categories, setCategories] = useState<LicenseCategoryOption[]>([]);

  const t = {
    title: 'التحقق من الأهلية لتجديد الرخصة',
    currentLicense: 'الرخصة الحالية',
    licenseNumber: 'رقم الرخصة',
    category: 'الفئة',
    expiryDate: 'تاريخ الانتهاء',
    status: 'الحالة',
    active: 'نشطة',
    expired: 'منتهية',
    expiredWithinGrace: 'منتهية (ضمن فترة السماح)',
    gracePeriod: 'فترة السماح',
    renewalFee: 'رسوم التجديد',
    days: 'يوم',
    daysRemaining: 'متبقي {{days}} يوم',
    proceed: 'بدء التجديد',
    back: 'العودة للخدمات',
    notEligible: 'غير مؤهل للتجديد',
    ineligibleReason: 'السبب',
    loading: 'جاري التحقق من الأهلية...',
    currency: 'ريال',
    expiresIn: 'متبقي',
    selectCategory: 'اختر الفئة',
    gracePeriodEnded: 'انتهت فترة السماح',
    noActiveLicense: 'لا توجد رخصة نشطة لهذه الفئة',
    error: 'حدث خطأ أثناء التحقق من الأهلية',
    errorLoading: 'فشل تحميل الفئات',
    renewalservices: 'خدمات التجديد',
  };

  // Fetch license categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['license-categories'],
    queryFn: async () => {
      const response = await LicenseService.getUserLicenseCategories();
      return response.data || [];
    },
    enabled: !categoryId,
  });

  useEffect(() => {
    if (categoriesData && Array.isArray(categoriesData)) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  // Fetch eligibility when category is selected
  const { data: eligibilityData, isLoading: eligibilityLoading, error: eligibilityError, refetch } = useQuery({
    queryKey: ['renewal-eligibility', selectedCategoryId],
    queryFn: () => LicenseService.checkRenewalEligibility(Number(selectedCategoryId)),
    enabled: !!selectedCategoryId,
  });

  const eligibility: RenewalEligibilityResponse | null = eligibilityData?.data || null;
  const isEligible = eligibility?.isEligible ?? false;
  const displayCatName = eligibility?.licenseCategoryName ?? displayCategoryName;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ar-YE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getDaysRemaining = () => {
    if (!eligibility?.gracePeriodEndsAt) return 0;
    const graceEnd = new Date(eligibility.gracePeriodEndsAt);
    const now = new Date();
    const diff = Math.floor((graceEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const handleProceed = async () => {
    if (!selectedCategoryId || !isEligible) return;
    
    try {
      const response = await LicenseService.createRenewal({
        oldLicenseId: eligibilityData?.data?.licenseId || 0,
        licenseCategoryId: Number(selectedCategoryId),
      });

      if (response.success && response.data) {
        toast.success('تم إنشاء طلب التجديد بنجاح');
        router.push(`/renewal/application?applicationId=${response.data.id}`);
      } else {
        toast.error(response.message || 'فشل إنشاء طلب التجديد');
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'حدث خطأ');
    }
  };

  const handleCategoryChange = (newCategoryId: string) => {
    setSelectedCategoryId(newCategoryId);
    const category = categories.find(c => c.id === Number(newCategoryId));
    if (category) {
      const url = new URL(window.location.href);
      url.searchParams.set('categoryId', newCategoryId);
      url.searchParams.set('displayCatName', category.nameAr);
      window.history.pushState({}, '', url.toString());
    }
  };

  // Loading state for categories
  if (!categoryId && categoriesLoading) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4" dir="rtl">
        <Card className="border-none shadow-2xl rounded-3xl">
          <CardHeader className="text-center pb-2">
            <Skeleton className="h-10 w-64 mx-auto bg-neutral-100" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-16 w-full bg-neutral-100" />
            <Skeleton className="h-16 w-full bg-neutral-100" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show category selection if no categoryId provided
  if (!categoryId && categories.length > 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-l from-[#1a3a8f] to-[#00215a] p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight">{t.renewalservices}</h1>
                  <p className="text-white/70 font-bold text-sm">{t.selectCategory}</p>
                </div>
              </div>
            </div>
            <CardContent className="p-8 space-y-4">
              <div className="grid gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(String(cat.id))}
                    className={cn(
                      "p-6 border-4 rounded-2xl text-start transition-all duration-300",
                      selectedCategoryId === String(cat.id)
                        ? "border-[#1a3a8f] bg-[#1a3a8f]/5 shadow-xl"
                        : "border-neutral-100 hover:border-[#1a3a8f]/30 hover:bg-neutral-50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-neutral-900">
                          {cat.nameAr}
                        </span>
                        <span className="block text-sm font-bold text-neutral-400 mt-1">
                          {cat.code}
                        </span>
                      </div>
                      <ArrowLeft className={cn(
                        "w-6 h-6 transition-transform",
                        selectedCategoryId === String(cat.id) ? "text-[#1a3a8f]" : "text-neutral-300"
                      )} />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Loading eligibility check
  if (eligibilityLoading) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4" dir="rtl">
        <Card className="border-none shadow-2xl rounded-3xl">
          <CardHeader className="text-center pb-2">
            <Skeleton className="h-10 w-64 mx-auto bg-neutral-100" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-40 w-full bg-neutral-100 rounded-2xl" />
            <Skeleton className="h-24 w-full bg-neutral-100 rounded-2xl" />
            <div className="flex gap-4">
              <Skeleton className="h-14 flex-1 bg-neutral-100 rounded-xl" />
              <Skeleton className="h-14 flex-1 bg-neutral-100 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error or not eligible state
  if (eligibilityError || (!isEligible && eligibility)) {
    const errorMessage = eligibility?.reason || 'غير مؤهل للتجديد';
    
    return (
      <div className="max-w-2xl mx-auto py-12 px-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
            <div className="bg-red-500 p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight">{t.notEligible}</h1>
                  <p className="text-white/70 font-bold text-sm">{displayCatName}</p>
                </div>
              </div>
            </div>
            <CardContent className="p-8 space-y-6">
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>{t.ineligibleReason}</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              
              <div className="flex gap-4">
                <Link href="/dashboard" className="flex-1">
                  <Button variant="outline" className="w-full h-14 rounded-xl font-black">
                    <ArrowRight className="w-5 h-5 me-2" />
                    {t.back}
                  </Button>
                </Link>
                <Button 
                  onClick={() => refetch()} 
                  className="flex-1 h-14 rounded-xl font-black bg-[#1a3a8f]"
                >
                  <Loader2 className="w-5 h-5 me-2" />
                  إعادة المحاولة
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Main eligibility display
  return (
    <div className="max-w-2xl mx-auto py-12 px-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-l from-[#1a3a8f] to-[#00215a] p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">{t.title}</h1>
                <p className="text-white/70 font-bold text-sm">{displayCatName}</p>
              </div>
            </div>
          </div>

          <CardContent className="p-8 space-y-8">
            {/* Current License Details */}
            <div className="p-6 bg-neutral-50 rounded-2xl border-2 border-neutral-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#1a3a8f]/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#1a3a8f]" />
                </div>
                <h2 className="text-xl font-black text-neutral-900">{t.currentLicense}</h2>
              </div>

              <div className="grid gap-4">
                <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                  <span className="text-neutral-500 font-bold">{t.licenseNumber}</span>
                  <span className="font-black text-neutral-900 font-mono">
                    {eligibilityData?.data?.licenseNumber || '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                  <span className="text-neutral-500 font-bold">{t.category}</span>
                  <span className="font-black text-neutral-900">{displayCatName}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                  <span className="text-neutral-500 font-bold">{t.expiryDate}</span>
                  <span className="font-black text-neutral-900">
                    {formatDate(eligibility?.currentLicenseExpiresAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-neutral-500 font-bold">{t.status}</span>
                  <Badge className={cn(
                    "px-4 py-1 rounded-full font-black",
                    isEligible 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  )}>
                    {isEligible ? t.active : t.expired}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Fee and Grace Period */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-[#1a3a8f]/5 rounded-2xl border-2 border-[#1a3a8f]/10">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-[#1a3a8f]" />
                  <span className="text-sm font-bold text-neutral-500">{t.renewalFee}</span>
                </div>
                <span className="text-3xl font-black text-[#1a3a8f]">
                  {eligibility?.renewalFeeAmount || 0}
                  <span className="text-base font-bold ms-2">{t.currency}</span>
                </span>
              </div>
              
              <div className="p-6 bg-amber-50 rounded-2xl border-2 border-amber-100">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-bold text-neutral-500">{t.gracePeriod}</span>
                </div>
                <span className="text-3xl font-black text-amber-700">
                  {getDaysRemaining()}
                  <span className="text-base font-bold ms-2">{t.days}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full h-14 rounded-xl font-black border-neutral-200">
                  <ArrowRight className="w-5 h-5 me-2" />
                  {t.back}
                </Button>
              </Link>
              <Button 
                onClick={handleProceed}
                className="flex-1 h-14 rounded-xl font-black bg-[#1a3a8f] hover:bg-[#002868] gap-2"
              >
                {t.proceed}
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}