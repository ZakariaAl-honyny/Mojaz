// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/lib/enums';
import { userService, UserDto } from '@/services/user.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ShieldCheck, 
  UserCog, 
  Mail, 
  Phone,
  CheckCircle2,
  XCircle,
  Activity,
  User as UserIcon,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function UsersPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Client-side RBAC check
  useEffect(() => {
    if (!isAuthenticated || user?.role !== UserRole.Admin) {
      router.replace('/forbidden');
      return;
    }
    
    // Fetch data only if authorized
    let isMounted = true;
    
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        if (isMounted) {
          setUsers(data);
        }
      } catch (error) {
        console.error('فشل في تحميل قائمة المستخدمين:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchUsers();
    
    return () => {
      isMounted = false;
    };
  }, [user, isAuthenticated, router]);

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      await userService.updateUserStatus(userId, isActive);
      setUsers(users.map(u => u.id === userId ? { ...u, isActive } : u));
    } catch (error) {
      console.error('فشل في تحديث حالة المستخدم:', error);
    }
  };

  const getRoleLabel = (role: string | number) => {
    const roles: Record<string, string> = {
      'admin': 'مدير النظام',
      'manager': 'مدير فرع',
      'receptionist': 'موظف استقبال',
      'doctor': 'طبيب فاحص',
      'examiner': 'ضابط فحص',
      'security': 'مسؤول أمن',
      'applicant': 'متقدم (مواطن)',
    };
    return roles[role.toLowerCase()] || role;
  };

  const getRoleBadgeStyle = (role: string | number) => {
    const roleStr = String(role).toLowerCase();
    switch (roleStr) {
      case 'admin': return 'bg-red-50 text-red-700 border-red-100';
      case 'manager': return 'bg-blue-50 text-[#1a3a8f] border-blue-100';
      case 'examiner': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'doctor': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-100';
    }
  };

  const filteredUsers = users.filter(user =>
    String(user.fullName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(user.email).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-10 font-arabic" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-neutral-100 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1a3a8f] shadow-sm">
               <UserCog className="w-6 h-6" />
             </div>
             <div>
               <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">إدارة الكادر والصلاحيات</h1>
               <p className="text-lg text-neutral-400 font-bold">إدارة حسابات الموظفين، تحديد الأدوار، والتحكم في الوصول للنظام</p>
             </div>
          </div>
        </div>
        <Link href="/admin/users/new">
          <Button className="h-10 md:h-12 px-6 md:px-8 rounded-md bg-[#1a3a8f] hover:bg-black font-black text-sm md:text-base gap-2 md:gap-3 transition-all">
            <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
            إضافة حساب جديد
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1a3a8f]">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-black text-neutral-900 leading-none">{users.length}</p>
                <p className="text-sm text-neutral-400 font-bold mt-2">إجمالي المستخدمين</p>
              </div>
           </div>
        </Card>
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-black text-neutral-900 leading-none">{users.filter(u => u.isActive).length}</p>
                <p className="text-sm text-neutral-400 font-bold mt-2">الحسابات النشطة</p>
              </div>
           </div>
        </Card>
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-black text-neutral-900 leading-none">{users.length > 0 ? Math.round((users.filter(u => u.isActive).length / users.length) * 100) : 0}%</p>
                <p className="text-sm text-neutral-400 font-bold mt-2">كفاءة التفعیل</p>
              </div>
           </div>
        </Card>
      </div>

      {/* Content Card */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="p-10 border-b border-neutral-50 bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black text-neutral-800">قائمة الكادر التشغيلي</CardTitle>
              <CardDescription className="font-bold text-neutral-400">يمكنك البحث بالفحص أو البريد الإلكتروني وتعديل صلاحيات الوصول</CardDescription>
            </div>
            <div className="relative w-full md:w-96 group">
              <Search className="absolute start-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-[#1a3a8f] transition-colors" />
              <Input
                placeholder="ابحث عن اسم، بريد، أو رقم هاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 ps-14 rounded-[1.5rem] border-neutral-100 bg-neutral-50/50 font-bold focus:ring-2 focus:ring-[#1a3a8f]/5 focus:border-[#1a3a8f] transition-all"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-6">
              <div className="w-14 h-14 border-4 border-[#1a3a8f]/20 border-t-[#1a3a8f] rounded-full animate-spin"></div>
              <p className="text-lg font-black text-neutral-500 animate-pulse">جاري جلب بيانات الكادر...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-neutral-50 rounded-[2rem] flex items-center justify-center mx-auto text-neutral-300">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <p className="text-xl font-black text-neutral-400">لا يوجد مستخدمون مطابقون لبحثك</p>
              <Button variant="ghost" className="font-bold text-[#1a3a8f]" onClick={() => setSearchTerm('')}>إلغاء البحث</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead className="bg-neutral-50/50 border-b border-neutral-100">
                  <tr>
                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">الاسم والبيانات الشخصية</th>
                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] text-center">الدور / الصلاحية</th>
                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">تاريخ الإضافة</th>
                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] text-center">حالة الحساب</th>
                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] text-end">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  <AnimatePresence>
                    {filteredUsers.map((user, idx) => (
                      <motion.tr 
                        key={user.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group hover:bg-neutral-50/50 transition-all border-b border-neutral-50 last:border-0"
                      >
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-5">
                              <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner",
                                user.isActive ? "bg-blue-50 text-[#1a3a8f]" : "bg-neutral-100 text-neutral-400"
                              )}>
                                {user.fullName.charAt(0)}
                              </div>
                              <div className="space-y-1">
                                <p className="text-neutral-900 font-black text-lg group-hover:text-[#1a3a8f] transition-colors">{user.fullName}</p>
                                <div className="flex items-center gap-4 text-xs font-bold text-neutral-400 group-hover:text-neutral-500 transition-colors">
                                   <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {user.email}</span>
                                   <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {user.phoneNumber}</span>
                                </div>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <Badge className={cn("border px-4 py-2 rounded-xl font-black text-xs transition-all ring-offset-2 ring-[#1a3a8f]/5 h-9", getRoleBadgeStyle(user.appRole))}>
                             {getRoleLabel(user.appRole)}
                          </Badge>
                        </td>
                        <td className="px-10 py-6">
                           <p className="text-sm font-black text-neutral-500">{new Date().toLocaleDateString('ar-YE', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center justify-center gap-4">
                            <span className={cn("text-[10px] font-black uppercase tracking-widest", user.isActive ? "text-emerald-500" : "text-neutral-300")}>
                              {user.isActive ? "نشط حالياً" : "غير مفعل"}
                            </span>
                            <Switch
                              checked={user.isActive}
                              onCheckedChange={(checked) => handleToggleStatus(user.id, checked)}
                              className="data-[state=checked]:bg-emerald-500 scale-110"
                            />
                          </div>
                        </td>
                        <td className="px-10 py-6 text-end">
                           <Button variant="ghost" size="icon" className="w-12 h-12 rounded-[1rem] hover:bg-white hover:shadow-xl hover:text-[#1a3a8f] transition-all opacity-0 group-hover:opacity-100">
                             <MoreHorizontal className="w-6 h-6" />
                           </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
