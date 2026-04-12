'use client';

import { useState, useEffect } from 'react';
import { settingsService, SystemSettingDto } from '@/services/settings.service';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [locale, setLocale] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getAllSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (setting: SystemSettingDto) => {
    setEditingKey(setting.key);
    setEditValue(setting.value);
  };

  const handleSave = async (key: string) => {
    try {
      await settingsService.updateSetting(key, editValue);
      setSettings(settings.map(s => s.key === key ? { ...s, value: editValue } : s));
      setEditingKey(null);
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditValue('');
  };

  const t = (key: string) => {
    const translations: Record<string, string> = {
      'settings.title': locale === 'ar' ? 'إعدادات النظام' : 'System Settings',
      'settings.key': locale === 'ar' ? 'المفتاح' : 'Key',
      'settings.value': locale === 'ar' ? 'القيمة' : 'Value',
      'settings.description': locale === 'ar' ? 'الوصف' : 'Description',
      'settings.actions': locale === 'ar' ? 'الإجراءات' : 'Actions',
      'settings.save': locale === 'ar' ? 'حفظ' : 'Save',
      'settings.cancel': locale === 'ar' ? 'إلغاء' : 'Cancel',
      'settings.edit': locale === 'ar' ? 'تعديل' : 'Edit',
      'settings.noSettings': locale === 'ar' ? 'لا توجد إعدادات' : 'No settings found',
    };
    return translations[key] || key;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-primary-900">{t('settings.title')}</h1>

        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : settings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">{t('settings.noSettings')}</div>
            ) : (
              <div className="space-y-4">
                {settings.map((setting) => (
                  <div key={setting.key} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-primary-900">{setting.key}</div>
                      {setting.description && (
                        <div className="text-sm text-gray-500">{setting.description}</div>
                      )}
                    </div>
                    <div className="flex-1">
                      {editingKey === setting.key ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="max-w-xs"
                        />
                      ) : (
                        <span className="text-gray-700">{setting.value}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {editingKey === setting.key ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleSave(setting.key)}
                            className="bg-primary-500"
                          >
                            {t('settings.save')}
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            {t('settings.cancel')}
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleEdit(setting)}>
                          {t('settings.edit')}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}