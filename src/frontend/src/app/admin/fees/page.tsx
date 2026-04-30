// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { isAdminRole } from '@/lib/enums';
import { feeService, FeeDto, FeeType, LicenseCategory } from '@/services/fee.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
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
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  ToggleLeft,
  ToggleRight
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

export default function FeesPage() {
  const t = useTranslations('admin');
  const [fees, setFees] = useState<FeeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Client-side RBAC check
  useEffect(() => {
    if (!isAuthenticated || !isAdminRole(user?.role)) {
      router.replace('/forbidden');
      return;
    }
    
    fetchFees();
  }, [user, isAuthenticated, router]);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const data = await feeService.getAllFees();
      setFees(data);
    } catch (error) {
      console.error('Failed to load fees:', error);
      toast.error('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسوم؟')) return;
    
    try {
      setDeletingId(id);
      await feeService.deleteFee(id);
      setFees(fees.filter(f => f.id !== id));
      toast.success('تم الحذف بنجاح');
    } catch (error) {
      console.error('Failed to delete fee:', error);
      toast.error('فشل في الحذف');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (fee: FeeDto) => {
    try {
      setTogglingId(fee.id);
      if (fee.isActive) {
        await feeService.deactivateFee(fee.id);
      } else {
        await feeService.activateFee(fee.id);
      }
      setFees(fees.map(f => 
        f.id === fee.id ? { ...f, isActive: !f.isActive } : f
      ));
      toast.success(fee.isActive ? 'تم التعطيل بنجاح' : 'تم التفعيل بنجاح');
    } catch (error) {
      console.error('Failed to toggle fee status:', error);
      toast.error('فشل في تغيير الحالة');
    } finally {
      setTogglingId(null);
    }
  };

  // Filter fees
  const filteredFees = fees.filter(fee => {
    const matchesSearch = !searchTerm || 
      FEE_TYPE_LABELS[fee.feeType]?.includes(searchTerm) ||
      CATEGORY_LABELS[fee.licenseCategory]?.includes(searchTerm) ||
      fee.amount.toString().includes(searchTerm);
    
    const matchesType = filterType === 'all' || fee.feeType === filterType;
    const matchesCategory = filterCategory === 'all' || fee.licenseCategory === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency || 'SAR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-900">
              إدارة الرسوم
            </h1>
            <p className="text-sm text-neutral-500">
              إدارة رسوم الخدمات والرخص
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push('/admin/fees/new')}
          className="bg-primary-600 hover:bg-primary-700 text-white gap-2"
        >
          <Plus className="h-4 w-4" />
          إضافة رسوم جديد
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-neutral-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="البحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="نوع الرسوم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {Object.entries(FEE_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="فئة الرخصة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-neutral-200 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>جاري التحميل...</p>
            </div>
          ) : filteredFees.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
              <p>لا توجد رسوم</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 hover:bg-neutral-50">
                  <TableHead className="text-primary-700 font-bold">نوع الرسوم</TableHead>
                  <TableHead className="text-primary-700 font-bold">فئة الرخصة</TableHead>
                  <TableHead className="text-primary-700 font-bold">المبلغ</TableHead>
                  <TableHead className="text-primary-700 font-bold">من تاريخ</TableHead>
                  <TableHead className="text-primary-700 font-bold">إلى تاريخ</TableHead>
                  <TableHead className="text-primary-700 font-bold">الحالة</TableHead>
                  <TableHead className="text-primary-700 font-bold text-end">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFees.map((fee) => (
                  <TableRow key={fee.id} className="hover:bg-neutral-50">
                    <TableCell className="font-medium">
                      {FEE_TYPE_LABELS[fee.feeType] || fee.feeType}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {CATEGORY_LABELS[fee.licenseCategory] || fee.licenseCategory}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-primary-700">
                      {formatAmount(fee.amount, fee.currency)}
                    </TableCell>
                    <TableCell>{formatDate(fee.effectiveFrom)}</TableCell>
                    <TableCell>{formatDate(fee.effectiveTo || '')}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        fee.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {fee.isActive ? 'نشط' : 'غير نشط'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleStatus(fee)}
                          disabled={togglingId === fee.id}
                          className={fee.isActive ? 'text-green-600 hover:text-green-700 hover:bg-green-50' : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'}
                        >
                          {togglingId === fee.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : fee.isActive ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/admin/fees/${fee.id}`)}
                          className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(fee.id)}
                          disabled={deletingId === fee.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {deletingId === fee.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}