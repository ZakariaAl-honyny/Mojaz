'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/lib/enums';
import { userService, CreateUserRequest } from '@/services/user.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  UserPlus, 
  ChevronLeft, 
  ShieldCheck, 
  Mail, 
  Phone, 
  User, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Lock,
  Copy,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CreateUserPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ userId: string; temporaryPassword: string } | null>(null);
  
  const [formData, setFormData] = useState<CreateUserRequest>({
    fullName: '',
    email: '',
    phoneNumber: '',
    appRole: 'Receptionist'
  });

  // Client-side RBAC check
  useEffect(() => {
    if (isAuthenticated && user?.role !== UserRole.Admin) {
      router.replace('/forbidden');
    }
  }, [user, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await userService.createUser(formData);
      setSuccessData(response);
      toast.success('تم إنشاء الحساب بنجاح');
    } catch (error: any) {
      console.error('فشل إنشاء المستخدم:', error);
      toast.error(error.response?.data?.message || 'فشل إنشاء المستخدم، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('تم النسخ إلى الحافظة');
  };

  if (successData) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 font-arabic" dir="rtl">
        <Card className="border-none shadow-3xl rounded-[2.5rem] bg-white overflow-hidden animate-in fade-in zoom-in duration-500">
          <CardHeader className="p-10 text-center space-y-4 bg-emerald-50/50 border-b border-emerald-100">
            <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-black text-emerald-900">تم إنشاء الحساب بنجاح</CardTitle>
              <CardDescription className="text-lg font-bold text-emerald-600">يرجى تسليم بيانات الدخول المؤقتة للموظف</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <div className="grid gap-6">
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-3">
                <Label className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> الاسم الكامل
                </Label>
                <p className="text-xl font-black text-neutral-900">{formData.fullName}</p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-3 relative group">
                <Label className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> البريد الإلكتروني (اسم المستخدم)
                </Label>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black text-neutral-900">{formData.email}</p>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(formData.email)} className="h-10 w-10 rounded-xl hover:bg-white group-hover:shadow-md transition-all">
                    <Copy className="w-4 h-4 text-neutral-400" />
                  </Button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#1a3a8f] text-white space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16" />
                <Label className="text-xs font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" /> كلمة المرور المؤقتة
                </Label>
                <div className="flex items-center justify-between relative z-10">
                  <p className="text-3xl font-black tracking-widest font-mono text-[#D4A017]">{successData.temporaryPassword}</p>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(successData.temporaryPassword)} className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white hover:text-[#1a3a8f] transition-all">
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => router.push('/admin/users')}
                className="flex-1 h-14 rounded-2xl bg-[#1a3a8f] hover:bg-[#152d6f] font-black text-lg gap-3 shadow-xl shadow-blue-900/20"
              >
                العودة لقائمة المستخدمين
                <ArrowRight className="w-6 h-6" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => setSuccessData(null)}
                className="flex-1 h-14 rounded-2xl border-2 border-neutral-100 hover:bg-neutral-50 font-black text-lg text-neutral-500"
              >
                إضافة مستخدم آخر
              </Button>
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <p className="text-sm font-bold text-amber-800 leading-relaxed">
                كلمة المرور هذه مؤقتة وسيُطلب من الموظف تغييرها عند تسجيل الدخول لأول مرة. يرجى التأكد من تسليمها بشكل آمن.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 font-arabic" dir="rtl">
      {/* Breadcrumb / Back */}
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-8 hover:bg-neutral-100 text-neutral-500 font-bold gap-2 group"
      >
        <ChevronLeft className="w-5 h-5 rtl:rotate-0 group-hover:-translate-x-1 transition-transform" />
        العودة لقائمة الإدارة
      </Button>

      <Card className="border-none shadow-3xl rounded-[3rem] bg-white overflow-hidden">
        <CardHeader className="p-10 pb-4 border-b border-neutral-50">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-50 rounded-[2rem] flex items-center justify-center text-[#1a3a8f] shadow-inner">
                <UserPlus className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-3xl font-black text-neutral-900 tracking-tight">إضافة موظف للمنظومة</CardTitle>
                <CardDescription className="text-lg font-bold text-neutral-400">أدخل بيانات الموظف الأساسية وسيتم توليد بيانات دخول سيادية له</CardDescription>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Full Name */}
              <div className="space-y-3">
                <Label className="text-xs font-black text-neutral-400 uppercase tracking-widest ms-2">الاسم الكامل (رباعي)</Label>
                <div className="relative group">
                  <User className="absolute start-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-[#1a3a8f] transition-colors" />
                  <Input 
                    required
                    placeholder="مثال: أحمد محمد علي الهنياني"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="h-16 ps-14 rounded-2xl border-neutral-100 bg-neutral-50 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold text-lg"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <Label className="text-xs font-black text-neutral-400 uppercase tracking-widest ms-2">البريد الإلكتروني الرسمي</Label>
                <div className="relative group">
                  <Mail className="absolute start-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-[#1a3a8f] transition-colors" />
                  <Input 
                    required
                    type="email"
                    placeholder="admin@traffic.gov.ye"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-16 ps-14 rounded-2xl border-neutral-100 bg-neutral-50 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold text-lg"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-3">
                <Label className="text-xs font-black text-neutral-400 uppercase tracking-widest ms-2">رقم الهاتف الجوال</Label>
                <div className="relative group">
                  <Phone className="absolute start-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-[#1a3a8f] transition-colors" />
                  <Input 
                    required
                    placeholder="77XXXXXXX"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="h-16 ps-14 rounded-2xl border-neutral-100 bg-neutral-50 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold text-lg"
                  />
                </div>
              </div>

              {/* App Role */}
              <div className="space-y-3">
                <Label className="text-xs font-black text-neutral-400 uppercase tracking-widest ms-2">الدور / الرتبة الإدارية</Label>
                <div className="relative group">
                  <ShieldCheck className="absolute start-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-[#1a3a8f] transition-colors z-10" />
                  <Select 
                    defaultValue={formData.appRole} 
                    onValueChange={(v) => setFormData({ ...formData, appRole: v })}
                  >
                    <SelectTrigger className="h-16 ps-14 rounded-2xl border-neutral-100 bg-neutral-50 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold text-lg text-start">
                      <SelectValue placeholder="اختر الدور" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-neutral-200">
                      <SelectItem value="Admin" className="font-bold py-3 hover:bg-red-50">مدير نظام (Admin)</SelectItem>
                      <SelectItem value="Manager" className="font-bold py-3 hover:bg-blue-50">مدير فرع / إداري (Manager)</SelectItem>
                      <SelectItem value="Receptionist" className="font-bold py-3 hover:bg-neutral-50">موظف استقبال (Receptionist)</SelectItem>
                      <SelectItem value="Doctor" className="font-bold py-3 hover:bg-emerald-50">طبيب فحص (Doctor)</SelectItem>
                      <SelectItem value="Examiner" className="font-bold py-3 hover:bg-amber-50">ضابط فحص (Examiner)</SelectItem>
                      <SelectItem value="Security" className="font-bold py-3 hover:bg-neutral-50">مسؤول أمن (Security)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="pt-10 flex gap-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1 h-16 rounded-2xl bg-[#1a3a8f] hover:bg-black text-white font-black text-xl gap-4 transition-all shadow-2xl shadow-blue-900/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : <UserPlus className="w-7 h-7" />}
                اعتماد وإنشاء الحساب
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="px-10 h-16 rounded-2xl border-2 border-neutral-100 hover:bg-neutral-50 font-black text-xl text-neutral-400"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

