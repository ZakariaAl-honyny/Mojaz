// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { isAdminRole } from '@/lib/enums';
import { 
  feeService, 
  FeeDto, 
  FeeType, 
  LicenseCategory,
  CreateFeeRequest,
  UpdateFeeRequest
} from '@/services/fee.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useTranslations } from '@/lib/static-translations';
import {
  DollarSign,
  ArrowRight,
  Save,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

// Fee type labels
const FEE_TYPE_LABELS: Record<string, string> = {
  ApplicationFee: 'رسوم التقديم',
  MedicalExamFee: 'رسوم الفحص الطبي',
  TheoryTestFee: 'رسوم الاختبار النظري',
  PracticalTestFee: 'رسوم الاختبار العملي',
  IssuanceFee: 'رسوم إصدار الرخصة',
  RetakeFee: 'رسوم إعادة الاختبار'
};

// License category labels
const CATEGORY_LABELS: Record<string, string> = {
  A: 'دراجة نارية',
  B: 'سيارة خصوصي',
  C: 'نقل عام',
  D: 'حافلة',
  E: 'أشغال شاقة',
  F: 'زراعية'
};

export default function FeeFormPage() {
  const t = useTranslations('admin');
  const params = useParams();
  const router = useRouter();
  const feeId = params.id as string;
  const isEditMode = feeId && feeId !== 'new';

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CreateFeeRequest>({
    feeType: FeeType.ApplicationFee,
    licenseCategory: LicenseCategory.A,
    amount: 0,
    currency: 'SAR',
    effectiveFrom: new Date().toISOString().split('T')[0],
    effectiveTo: '',
    description: ''
  });

  const { user, isAuthenticated } = useAuth();

  // Client-side RBAC check
  useEffect(() => {
    if (!isAuthenticated || !isAdminRole(user?.role)) {
      router.replace('/forbidden');
      return;
    }
    
    if (isEditMode) {
      fetchFee();
    }
  }, [user, isAuthenticated, router, feeId]);

  const fetchFee = async () => {
    try {
      setLoading(true);
      const fee = await feeService.getFeeById(feeId);
      setFormData({
        feeType: fee.feeType,
        licenseCategory: fee.licenseCategory,
        amount: fee.amount,
        currency: fee.currency,
        effectiveFrom: fee.effectiveFrom.split('T')[0],
        effectiveTo: fee.effectiveTo?.split('T')[0] || '',
        description: fee.description || ''
      });
    } catch (error) {
      console.error('Failed to load fee:', error);
      toast.error('فشل في تحميل البيانات');
      router.push('/admin/fees');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.amount <= 0) {
      toast.error('يرجى إدخال مبلغ صحيح');
      return;
    }

    if (!formData.effectiveFrom) {
      toast.error('يرجى إدخال تاريخ سريان');
      return;
    }

    try {
      setSaving(true);

      const requestData = {
        ...formData,
        effectiveTo: formData.effectiveTo || undefined
      };

      if (isEditMode) {
        await feeService.updateFee(feeId, requestData as UpdateFeeRequest);
        toast.success('تم التحديث بنجاح');
      } else {
        await feeService.createFee(requestData);
        toast.success('تم الإنشاء بنجاح');
      }
      
      router.push('/admin/fees');
    } catch (error: any) {
      console.error('Failed to save fee:', error);
      const errorMsg = error?.response?.data?.message || 'فشل في الحفظ';
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/fees');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <DollarSign className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary-900">
            {isEditMode ? 'تعديل الرسوم' : 'إضافة رسوم جديد'}
          </h1>
          <p className="text-sm text-neutral-500">
            {isEditMode ? 'تعديل بيانات الرسوم' : 'إدخال بيانات رسوم جديدة'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-neutral-200 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fee Type */}
            <div className="space-y-2">
              <Label htmlFor="feeType" className="text-primary-700 font-medium">
                نوع الرسوم *
              </Label>
              <Select
                value={formData.feeType}
                onValueChange={(value) => setFormData({ ...formData, feeType: value as FeeType })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FEE_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* License Category */}
            <div className="space-y-2">
              <Label htmlFor="licenseCategory" className="text-primary-700 font-medium">
                فئة الرخصة *
              </Label>
              <Select
                value={formData.licenseCategory}
                onValueChange={(value) => setFormData({ ...formData, licenseCategory: value as LicenseCategory })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount and Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="amount" className="text-primary-700 font-medium">
                  المبلغ *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="h-11 font-mono text-left"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-primary-700 font-medium">
                  العملة
                </Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                    <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Effective From */}
            <div className="space-y-2">
              <Label htmlFor="effectiveFrom" className="text-primary-700 font-medium">
                تاريخ السريان *
              </Label>
              <Input
                id="effectiveFrom"
                type="date"
                value={formData.effectiveFrom}
                onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                className="h-11"
              />
            </div>

            {/* Effective To */}
            <div className="space-y-2">
              <Label htmlFor="effectiveTo" className="text-primary-700 font-medium">
                تاريخ الانتهاء
              </Label>
              <Input
                id="effectiveTo"
                type="date"
                value={formData.effectiveTo}
                onChange={(e) => setFormData({ ...formData, effectiveTo: e.target.value })}
                className="h-11"
                placeholder="اختياري"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-primary-700 font-medium">
                الوصف
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[100px]"
                placeholder="وصف اختياري للرسوم..."
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary-600 hover:bg-primary-700 text-white gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {isEditMode ? 'تحديث' : 'حفظ'}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="border-neutral-300 text-neutral-700 gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}