'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole, isManagerRole } from '@/lib/enums';
import { userService, UserDto } from '@/services/user.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Filter,
  ShieldCheck, 
  UserCog, 
  Mail, 
  Phone,
  CheckCircle2,
  XCircle,
  Activity,
  Loader2,
  MoreVertical,
  Eye,
  Edit
} from 'lucide-react';

export default function ManagerUsersPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // RBAC check - Manager or Admin can access
  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || (!isManagerRole(user?.role) && user?.role !== UserRole.Admin))) {
      router.replace('/forbidden');
    }
  }, [user, isAuthenticated, isAuthLoading, router]);

  // Fetch users
  useEffect(() => {
    let isMounted = true;
    
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        if (isMounted) {
          setUsers(data);
        }
      } catch (error) {
        console.error('فشل في تحميل المستخدمين:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    if (isAuthenticated && (isManagerRole(user?.role) || user?.role === UserRole.Admin)) {
      fetchUsers();
    }
    
    return () => { isMounted = false; };
  }, [user, isAuthenticated]);

  // Filter users
  const filteredUsers = users.filter(u => {
    const searchLower = searchTerm?.toLowerCase() || '';
    const matchesSearch = !searchTerm || 
      (u.fullName?.toLowerCase().includes(searchLower) ||
       u.email?.toLowerCase().includes(searchLower));
    const matchesRole = roleFilter === 'all' || u.role?.toString() === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Get role label
  const getRoleLabel = (role: number | string | undefined): string => {
    if (role === 0 || role === '0') return 'متقدم';
    if (role === 1 || role === '1') return 'موظف استقبال';
    if (role === 2 || role === '2') return 'طبيب';
    if (role === 3 || role === '3') return 'مفتش';
    if (role === 4 || role === '4') return 'مدير';
    if (role === 5 || role === '5') return 'أمن';
    if (role === 6 || role === '6') return 'مدير نظام';
    return 'غير محدد';
  };

  // Get role color
  const getRoleColor = (role: number | string | undefined): string => {
    if (role === 1 || role === '1') return 'bg-blue-100 text-blue-700';
    if (role === 2 || role === '2') return 'bg-green-100 text-green-700';
    if (role === 3 || role === '3') return 'bg-purple-100 text-purple-700';
    if (role === 4 || role === '4') return 'bg-amber-100 text-amber-700';
    if (role === 5 || role === '5') return 'bg-red-100 text-red-700';
    if (role === 6 || role === '6') return 'bg-neutral-800 text-white';
    return 'bg-neutral-100 text-neutral-700';
  };

  if (isAuthLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" dir="rtl">
        <Loader2 className="w-10 h-10 animate-spin text-[#1a3a8f]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 md:py-8 px-3 md:px-4 space-y-4 md:space-y-6 font-arabic" dir="rtl">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 bg-[#1a3a8f] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-neutral-900">إدارة المستخدمين</h1>
            <p className="text-xs sm:text-sm text-neutral-500 hidden sm:block">عرض وإدارة حسابات الموظفين</p>
          </div>
        </div>
        <div className="text-sm text-neutral-500">
          {filteredUsers.length} مستخدم
        </div>
      </header>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input 
            placeholder="البحث بالاسم أو البريد الإلكتروني..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pe-10 h-10"
          />
        </div>
        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-neutral-200 bg-white text-sm"
        >
          <option value="all">جميع الأدوار</option>
          <option value="1">موظف استقبال</option>
          <option value="2">طبيب</option>
          <option value="3">مفتش</option>
          <option value="4">مدير</option>
          <option value="5">أمن</option>
        </select>
      </div>

      {/* Users List */}
      <div className="grid gap-3">
        {filteredUsers.length > 0 ? filteredUsers.map((userItem) => (
          <Card key={userItem.id} className="border-none shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 sm:w-12 rounded-full bg-[#1a3a8f]/10 flex items-center justify-center flex-shrink-0">
                    <UserCog className="w-5 h-5 text-[#1a3a8f]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-neutral-900 truncate">{userItem.fullName}</p>
                    <p className="text-xs text-neutral-500 truncate">{userItem.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs ${getRoleColor(userItem.role)}`}>
                        {getRoleLabel(userItem.role)}
                      </Badge>
                      {userItem.isActive ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" />
                          نشط
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-red-600">
                          <XCircle className="w-3 h-3" />
                          غير نشط
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card className="border-none shadow-lg">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
              <p className="text-neutral-500">لا يوجد مستخدمين</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}