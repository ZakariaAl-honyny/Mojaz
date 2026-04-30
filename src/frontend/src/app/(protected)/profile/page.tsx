'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isEmployeeRole, isAdminRole, isApplicantRole, getRoleLabel } from '@/lib/enums';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, UserDto } from '@/services/user.service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  User as UserIcon,
  Mail,
  Phone,
  CreditCard,
  Shield,
  Calendar,
  Edit,
  KeyRound,
  Building2,
  Save,
  X,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Flag,
  Droplets,
  Lock,
  Unlock,
  ShieldAlert,
  FileText
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Validation Schema
const profileSchema = z.object({
  fullName: z.string().min(5, 'الاسم يجب أن يكون 5 أحرف على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phoneNumber: z.string().min(9, 'رقم الهاتف يجب أن يكون 9 أرقام على الأقل'),
  nationalId: z.string().min(10, 'رقم الهوية يجب أن يكون 10 أرقام على الأقل'),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 1. Fetch fresh data from backend
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: () => userService.getMe(),
    enabled: !!user?.id,
  });

  // 2. Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // 3. Update Mutation
  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormValues) => userService.updateCurrentUser(data),
    onSuccess: (updatedUser: any) => {
      // Update local store
      updateUser({
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        nationalId: updatedUser.nationalId,
        address: updatedUser.address,
        city: updatedUser.city,
        region: updatedUser.region,
      });

      // Invalidate query
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });

      toast({
        title: 'تم التحديث بنجاح',
        description: 'تمت مزامنة بياناتك مع السجل الوطني بنجاح.',
        variant: 'default',
      });
      setIsEditModalOpen(false);
    },
    onError: (err: any) => {
      toast({
        title: 'فشل التحديث',
        description: err.response?.data?.message || 'عذراً، فشل تحديث البيانات. يرجى المحاولة لاحقاً.',
        variant: 'destructive',
      });
    }
  });

  const onEditClick = () => {
    if (profile) {
      reset({
        fullName: profile.fullName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        nationalId: profile.nationalId,
        address: profile.address || '',
        city: profile.city || '',
        region: profile.region || '',
      });
      setIsEditModalOpen(true);
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col items-center justify-center h-96 gap-4" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-[#1a3a8f]" />
        <p className="text-neutral-500 font-black tracking-widest uppercase text-xs animate-pulse">جاري تحميل بياناتك الرسمية...</p>
      </div>
    );
  }

  const currentProfile = profile || (user as any);
  const roleId = currentProfile?.appRole ?? currentProfile?.role;
  const roleLabel = getRoleLabel(roleId);

  const getGenderLabel = (gender?: number) => {
    switch (gender) {
      case 1: return 'ذكر';
      case 2: return 'أنثى';
      default: return 'غير محدد';
    }
  };

  const getBloodTypeLabel = (bt?: number) => {
    const labels = [
      'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
    ];
    return bt !== undefined && bt >= 0 && bt < labels.length ? labels[bt] : 'غير معروف';
  };

  const getRelativeTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'اليوم';
    if (diffDays === 1) return 'منذ يوم';
    if (diffDays === 2) return 'منذ يومين';
    if (diffDays <= 10) return `منذ ${diffDays} أيام`;
    return `منذ ${diffDays} يوماً`;
  };

  const getInitials = (name: string) => {
    return name
      ? name.split(' ').map(n => n.charAt(0)).slice(0, 2).join('').toUpperCase()
      : 'M';
  };

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-10 px-4 font-arabic" dir="rtl">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-1.5 h-8 md:h-10 bg-[#1a3a8f] rounded-full shadow-lg shadow-blue-900/20" />
          <div>
            <h1 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight leading-none mb-1">
              الملف الشخصي
            </h1>
            <p className="text-neutral-500 font-bold text-[10px] uppercase tracking-widest leading-none">
              إدارة الهوية الرقمية والبيانات الموحدة
            </p>
          </div>
        </div>

        <div className="flex gap-2.5">
          <Link href="/profile/change-password">
            <Button variant="outline" className="h-10 px-5 rounded-lg border-neutral-200 bg-white hover:bg-neutral-50 gap-2 font-black text-[10px] uppercase tracking-widest transition-all">
              <KeyRound className="w-4 h-4 text-neutral-400" />
              تغيير كلمة المرور
            </Button>
          </Link>
          <Button
            onClick={onEditClick}
            className="h-10 px-5 rounded-lg bg-[#1a3a8f] hover:bg-[#152d6f] text-white shadow-lg shadow-blue-900/10 gap-2 font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <Edit className="w-4 h-4" />
            تعديل البيانات
          </Button>
        </div>
      </header>

      {/* Profile Header Card */}
      <Card className="border border-neutral-200 shadow-sm bg-white rounded-2xl overflow-hidden mb-8 group">
        <div className="h-28 md:h-36 bg-gradient-to-l from-[#1a3a8f] to-[#0f1e4a] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#fff_0%,_transparent_70%)]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1a3a8f]/30 blur-[100px] -mr-32 -mt-32" />
        </div>
        <CardContent className="relative px-6 md:px-10 pb-8 md:pb-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8 -mt-14 md:-mt-16">
            {/* Avatar */}
            <div className="relative mx-auto md:mx-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-[#1a3a8f] to-[#00215a] border-[6px] border-white shadow-2xl flex items-center justify-center text-white font-black overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage src="" alt={currentProfile.fullName} />
                  <AvatarFallback className="bg-transparent text-white text-4xl font-black">
                    {getInitials(currentProfile.fullName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -bottom-2 -start-2 w-10 h-10 bg-emerald-500 border-4 border-white rounded-xl flex items-center justify-center shadow-xl animate-bounce-subtle">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-start self-center md:self-end pb-2">
              <h2 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight mb-2">
                {currentProfile.fullName}
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-4">
                <Badge className="bg-[#1a3a8f] hover:bg-[#152d6f] border-none text-white font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md shadow-blue-900/10">
                  {roleLabel}
                </Badge>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-full border border-neutral-100">
                  <Building2 className="w-3.5 h-3.5 text-[#1a3a8f]" />
                  <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">
                    الإدارة العامة للمرور
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* Personal Information */}
        <Card className="border border-neutral-200 shadow-sm bg-white rounded-2xl overflow-hidden hover:border-[#1a3a8f]/10 transition-colors">
          <CardHeader className="p-5 md:p-6 border-b border-neutral-50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center border border-primary-100/50">
                <UserIcon className="w-5 h-5 text-[#1a3a8f]" />
              </div>
              <CardTitle className="text-lg font-black text-neutral-900 tracking-tight">
                البيانات الشخصية والاتصال
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow
              icon={<UserIcon className="w-4 h-4 text-neutral-400" />}
              label="الاسم الكامل"
              value={currentProfile.fullName}
            />
            <InfoRow
              icon={<CreditCard className="w-4 h-4 text-neutral-400" />}
              label="رقم الهوية الوطنية"
              value={currentProfile.nationalId || 'غير مسجل'}
              highlight
            />
            <InfoRow
              icon={<Phone className="w-4 h-4 text-neutral-400" />}
              label="رقم الهاتف"
              value={currentProfile.phoneNumber || 'غير مسجل'}
            />
            <InfoRow
              icon={<Mail className="w-4 h-4 text-neutral-400" />}
              label="البريد الإلكتروني"
              value={currentProfile.email}
            />
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="border border-neutral-200 shadow-sm bg-white rounded-2xl overflow-hidden hover:border-[#D4A017]/10 transition-colors">
          <CardHeader className="p-5 md:p-6 border-b border-neutral-50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100/50">
                <Building2 className="w-5 h-5 text-[#D4A017]" />
              </div>
              <CardTitle className="text-lg font-black text-neutral-900 tracking-tight">
                العنوان والمكان
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow
              icon={<MapPin className="w-4 h-4 text-neutral-400" />}
              label="المنطقة"
              value={currentProfile.region || 'غير محدد'}
            />
            <InfoRow
              icon={<MapPin className="w-4 h-4 text-neutral-400" />}
              label="المدينة"
              value={currentProfile.city || 'غير محدد'}
            />
            <div className="sm:col-span-2">
              <InfoRow
                icon={<Building2 className="w-4 h-4 text-neutral-400" />}
                label="العنوان التفصيلي"
                value={currentProfile.address || 'لم يتم إدخال عنوان تفصيلي'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Official Metadata */}
        <Card className="border border-neutral-200 shadow-sm bg-white rounded-2xl overflow-hidden hover:border-[#1a3a8f]/10 transition-colors">
          <CardHeader className="p-5 md:p-6 border-b border-neutral-50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100/50">
                <ShieldCheck className="w-5 h-5 text-slate-500" />
              </div>
              <CardTitle className="text-lg font-black text-neutral-900 tracking-tight">
                البيانات الرسمية
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow
              icon={<Flag className="w-4 h-4 text-neutral-400" />}
              label="الجنسية"
              value={currentProfile.nationality || 'غير محدد'}
            />
            <InfoRow
              icon={<Droplets className="w-4 h-4 text-neutral-400" />}
              label="فصيلة الدم"
              value={getBloodTypeLabel(currentProfile.bloodType)}
            />
            <InfoRow
              icon={<UserIcon className="w-4 h-4 text-neutral-400" />}
              label="الجنس"
              value={getGenderLabel(currentProfile.gender)}
            />
            <InfoRow
              icon={<Calendar className="w-4 h-4 text-neutral-400" />}
              label="تاريخ الميلاد"
              value={currentProfile.dateOfBirth ? new Date(currentProfile.dateOfBirth).toLocaleDateString('ar-YE') : 'غير متاح'}
            />
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card className="border border-neutral-200 shadow-sm bg-white rounded-2xl overflow-hidden hover:border-[#1a3a8f]/10 transition-colors">
          <CardHeader className="p-5 md:p-6 border-b border-neutral-50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center border border-primary-100/50">
                <Shield className="w-5 h-5 text-[#1a3a8f]" />
              </div>
              <CardTitle className="text-lg font-black text-neutral-900 tracking-tight">
                حالة الحساب
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50/50 border border-neutral-100/30">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#1a3a8f]" />
                <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">حالة الحساب</span>
              </div>
              <Badge className={cn(
                "font-black text-[10px] px-3 py-1 rounded-full border-none shadow-sm",
                currentProfile.isSecurityBlocked ? "bg-red-500 text-white" :
                  currentProfile.isLocked ? "bg-amber-500 text-white" :
                    currentProfile.isActive ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"
              )}>
                {currentProfile.isSecurityBlocked ? 'محظور أمنياً' :
                  currentProfile.isLocked ? 'مؤمن/مغلق' :
                    currentProfile.isActive ? 'نشط' : 'غير نشط'}
              </Badge>
            </div>

            <InfoRow
              icon={<Shield className="w-4 h-4 text-neutral-400" />}
              label="مستوى الصلاحيات"
              value={roleLabel}
              highlight
            />
            <InfoRow
              icon={<Calendar className="w-4 h-4 text-neutral-400" />}
              label="تاريخ الانضمام"
              value={currentProfile.createdAt ? new Date(currentProfile.createdAt).toLocaleDateString('ar-YE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : '---'}
            />
          </CardContent>
        </Card>
      </div>

      {/* Verification Status */}
      <div className={cn(
        "mt-8 p-5 md:p-6 rounded-2xl flex items-center gap-4 md:gap-6 shadow-sm border transition-all",
        (currentProfile.isEmailVerified && currentProfile.isPhoneVerified)
          ? "bg-emerald-50 border-emerald-100"
          : "bg-amber-50 border-amber-100"
      )}>
        <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm shrink-0">
          {(currentProfile.isEmailVerified && currentProfile.isPhoneVerified) ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          ) : (
            <ShieldAlert className="w-8 h-8 text-amber-500" />
          )}
        </div>
        <div className="space-y-1 text-start">
          <h4 className={cn(
            "text-base md:text-lg font-black tracking-tight",
            (currentProfile.isEmailVerified && currentProfile.isPhoneVerified) ? "text-emerald-900" : "text-amber-900"
          )}>
            {(currentProfile.isEmailVerified && currentProfile.isPhoneVerified)
              ? 'الحساب موثق بالكامل'
              : 'الحساب بحاجة لتوثيق إضافي'}
          </h4>
          <p className={cn(
            "text-xs md:text-sm font-bold opacity-80",
            (currentProfile.isEmailVerified && currentProfile.isPhoneVerified) ? "text-emerald-700" : "text-amber-700"
          )}>
            {currentProfile.isEmailVerified ? '✓ تم التحقق من البريد' : '✗ البريد غير موثق'}
            <span className="mx-2">•</span>
            {currentProfile.isPhoneVerified ? '✓ تم التحقق من الهاتف' : '✗ الهاتف غير موثق'}
          </p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[450px] font-arabic p-0 overflow-hidden border-none shadow-2xl rounded-2xl" dir="rtl">
          <div className="bg-[#1a3a8f] px-6 py-8 relative">
            <div className="relative z-10">
              <DialogTitle className="text-xl font-black text-white mb-2">تحديث بيانات المنظومة</DialogTitle>
              <DialogDescription className="text-blue-100 font-bold text-xs opacity-80">
                يرجى التأكد من دقة البيانات المدخلة حيث سيتم مراجعتها رسمياً.
              </DialogDescription>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-black text-neutral-400 px-1">الاسم الكامل</Label>
                <div className="relative">
                  <UserIcon className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                  <Input
                    {...register('fullName')}
                    className="ps-10 h-12 bg-neutral-50/50 border-neutral-100 rounded-xl focus:ring-[#1a3a8f]/5 focus:border-[#1a3a8f]/20 font-bold"
                  />
                </div>
                {errors.fullName && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.fullName.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black text-neutral-400 px-1">رقم الهوية</Label>
                  <Input
                    {...register('nationalId')}
                    className="h-12 bg-neutral-50/50 border-neutral-100 rounded-xl focus:ring-[#1a3a8f]/5 focus:border-[#1a3a8f]/20 font-bold"
                  />
                  {errors.nationalId && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.nationalId.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black text-neutral-400 px-1">رقم الهاتف</Label>
                  <Input
                    {...register('phoneNumber')}
                    className="h-12 bg-neutral-50/50 border-neutral-100 rounded-xl focus:ring-[#1a3a8f]/5 focus:border-[#1a3a8f]/20 font-bold"
                  />
                  {errors.phoneNumber && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.phoneNumber.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black text-neutral-400 px-1">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                  <Input
                    {...register('email')}
                    className="ps-10 h-12 bg-neutral-50/50 border-neutral-100 rounded-xl focus:ring-[#1a3a8f]/5 focus:border-[#1a3a8f]/20 font-bold"
                  />
                </div>
                {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black text-neutral-400 px-1">المنطقة</Label>
                  <Input
                    {...register('region')}
                    className="h-12 bg-neutral-50/50 border-neutral-100 rounded-xl focus:ring-[#1a3a8f]/5 focus:border-[#1a3a8f]/20 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black text-neutral-400 px-1">المدينة</Label>
                  <Input
                    {...register('city')}
                    className="h-12 bg-neutral-50/50 border-neutral-100 rounded-xl focus:ring-[#1a3a8f]/5 focus:border-[#1a3a8f]/20 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black text-neutral-400 px-1">العنوان التفصيلي</Label>
                <div className="relative">
                  <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                  <Input
                    {...register('address')}
                    className="ps-10 h-12 bg-neutral-50/50 border-neutral-100 rounded-xl focus:ring-[#1a3a8f]/5 focus:border-[#1a3a8f]/20 font-bold"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-3 sm:gap-0 sm:flex-row-reverse pb-2">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 h-12 bg-[#1a3a8f] hover:bg-[#152d6f] text-white rounded-xl font-black gap-2 shadow-lg shadow-blue-900/10"
              >
                {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                حفظ التغييرات
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 h-12 rounded-xl border-neutral-200 font-black text-neutral-500"
              >
                إلغاء
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Reusable Info Row Component
function InfoRow({
  icon,
  label,
  value,
  highlight = false
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50/50 border border-neutral-100/30 transition-all hover:bg-white hover:shadow-sm">
      <div className="w-9 h-9 rounded-lg bg-white border border-neutral-100 flex items-center justify-center flex-shrink-0 shadow-sm">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] text-neutral-400 font-black uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className={`text-sm font-bold tracking-tight ${highlight ? 'text-[#1a3a8f]' : 'text-neutral-900'} truncate`}>
          {value}
        </p>
      </div>
    </div>
  );
}