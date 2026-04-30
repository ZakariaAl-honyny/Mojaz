// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/lib/enums';
import { settingsService, SystemSettingDto } from '@/services/settings.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/lib/static-translations';
import { Settings, Save, X, Edit, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const t = useTranslations('admin');
  const [settings, setSettings] = useState<SystemSettingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
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
    
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await settingsService.getAllSettings();
        if (isMounted) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        if (isMounted) {
          toast.error(t('settings.saveError'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchSettings();
    
    return () => {
      isMounted = false;
    };
  }, [t, user, isAuthenticated, router]);

  const handleEdit = (setting: SystemSettingDto) => {
    setEditingKey(setting.key);
    setEditValue(setting.value);
  };

  const handleSave = async (key: string) => {
    try {
      setSaving(true);
      await settingsService.updateSetting(key, editValue);
      setSettings(settings.map(s => s.key === key ? { ...s, value: editValue } : s));
      setEditingKey(null);
      toast.success(t('settings.saveSuccess'));
    } catch (error) {
      console.error('Failed to update setting:', error);
      toast.error(t('settings.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditValue('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Settings className="h-6 w-6 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-primary-900">
          {t('settings.title')}
        </h1>
      </div>

      <Card className="border-neutral-200 shadow-sm">
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>جاري تحميل الإعدادات...</p>
            </div>
          ) : settings.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">{t('settings.noSettings')}</div>
          ) : Array.isArray(settings) ? (
            <div className="grid gap-4">
              {settings.map((setting) => (
                <div key={setting.key} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-neutral-200 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex-1">
                    <div className="font-bold text-primary-700 text-sm tracking-wide uppercase">
                      {setting.key}
                    </div>
                    {setting.description && (
                      <div className="text-sm text-neutral-500 mt-1">
                        {setting.description}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    {editingKey === setting.key ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="h-10 bg-white"
                        autoFocus
                      />
                    ) : (
                      <div className="px-3 py-2 bg-white border border-neutral-200 rounded-lg font-mono text-sm">
                        {setting.value}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingKey === setting.key ? (
                      <>
                        <Button
                          size="sm"
                          disabled={saving}
                          onClick={() => handleSave(setting.key)}
                          className="bg-primary-600 hover:bg-primary-700 text-white gap-2 px-4"
                        >
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          {t('settings.save')}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancel} className="text-neutral-500">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(setting)}
                        className="gap-2 border-neutral-200"
                      >
                        <Edit className="h-4 w-4" />
                        {t('settings.edit')}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">حدث خطأ في عرض الإعدادات.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
