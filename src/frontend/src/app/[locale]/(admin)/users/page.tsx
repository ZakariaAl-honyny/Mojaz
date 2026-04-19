'use client';

import { useState, useEffect } from 'react';
import { userService, UserDto } from '@/services/user.service';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useTranslations } from 'next-intl';

export default function UsersPage() {
  const t = useTranslations('admin');
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      await userService.updateUserStatus(userId, isActive);
      setUsers(users.map(u => u.id === userId ? { ...u, isActive } : u));
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-900">{t('users.title')}</h1>
          <Button className="bg-primary-500 hover:bg-primary-600">
            {t('users.add')}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <Input
              placeholder={t('users.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">{t('common.loading')}</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">{t('users.noUsers')}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-4 text-start">{t('users.name')}</th>
                      <th className="p-4 text-start">{t('users.email')}</th>
                      <th className="p-4 text-start">{t('users.phone')}</th>
                      <th className="p-4 text-start">{t('users.role')}</th>
                      <th className="p-4 text-start">{t('users.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{user.fullName}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">{user.phoneNumber}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                            {t(`users.roles.${user.appRole}`)}
                          </span>
                        </td>
                        <td className="p-4">
                          <Switch
                            checked={user.isActive}
                            onCheckedChange={(checked) => handleToggleStatus(user.id, checked)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}