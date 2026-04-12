'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Bell, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Trash2, 
  Plus,
  Send,
  Check
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const mockDevices = [
  {
    id: '1',
    deviceToken: 'fcm-token-12345',
    deviceType: 'ios' as const,
    deviceName: 'iPhone 15 Pro',
    lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: '2',
    deviceToken: 'fcm-token-67890',
    deviceType: 'web' as const,
    deviceName: 'Chrome on Windows',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
];

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'ios':
      return Smartphone;
    case 'android':
      return Tablet;
    case 'web':
      return Monitor;
    default:
      return Smartphone;
  }
};

export default function PushNotificationSettingsPage() {
  const t = useTranslations('notification');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [appointmentAlerts, setAppointmentAlerts] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState(true);
  const [systemAnnouncements, setSystemAnnouncements] = useState(false);
  const [devices, setDevices] = useState(mockDevices);
  const [isTesting, setIsTesting] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const handleTestNotification = async () => {
    setIsTesting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTesting(false);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleRemoveDevice = (deviceId: string) => {
    setDevices(devices.filter(d => d.id !== deviceId));
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{t('settings.title')}</h1>
        <p className="text-neutral-500 mt-1">{t('settings.pushNotifications')}</p>
      </div>

      {/* Push Notifications Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary-500" />
            {t('settings.pushEnabled')}
          </CardTitle>
          <CardDescription>
            Enable or disable push notifications on all your devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
            <div>
              <p className="font-semibold text-neutral-900">{t('settings.pushNotifications')}</p>
              <p className="text-sm text-neutral-500">
                {pushEnabled 
                  ? 'You will receive push notifications on your devices' 
                  : 'Push notifications are disabled'}
              </p>
            </div>
            <Switch
              checked={pushEnabled}
              onCheckedChange={setPushEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      {pushEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.title')}</CardTitle>
            <CardDescription>
              Choose which types of notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Payment Reminders */}
            <div className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">💳</span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{t('settings.paymentReminders')}</p>
                  <p className="text-sm text-neutral-400">
                    Get notified about pending payments and due dates
                  </p>
                </div>
              </div>
              <Switch
                checked={paymentReminders}
                onCheckedChange={setPaymentReminders}
              />
            </div>

            {/* Appointment Alerts */}
            <div className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📅</span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{t('settings.appointmentAlerts')}</p>
                  <p className="text-sm text-neutral-400">
                    Receive reminders about upcoming appointments
                  </p>
                </div>
              </div>
              <Switch
                checked={appointmentAlerts}
                onCheckedChange={setAppointmentAlerts}
              />
            </div>

            {/* Status Updates */}
            <div className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-amber-600 text-lg">📋</span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{t('settings.statusUpdates')}</p>
                  <p className="text-sm text-neutral-400">
                    Get updates about your application status changes
                  </p>
                </div>
              </div>
              <Switch
                checked={statusUpdates}
                onCheckedChange={setStatusUpdates}
              />
            </div>

            {/* System Announcements */}
            <div className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <span className="text-neutral-600 text-lg">🔔</span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{t('settings.systemAnnouncements')}</p>
                  <p className="text-sm text-neutral-400">
                    Receive system updates and announcements
                  </p>
                </div>
              </div>
              <Switch
                checked={systemAnnouncements}
                onCheckedChange={setSystemAnnouncements}
              />
            </div>

            {/* Test Notification Button */}
            <div className="pt-4 border-t border-neutral-100">
              <Button
                variant="outline"
                onClick={handleTestNotification}
                disabled={isTesting}
                className="w-full"
              >
                {isTesting ? (
                  <>
                    <span className="animate-spin me-2">⏳</span>
                    Sending...
                  </>
                ) : testSent ? (
                  <>
                    <Check className="w-4 h-4 me-2" />
                    Test Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 me-2" />
                    {t('settings.testNotification')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Device Management */}
      {pushEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.deviceManagement')}</CardTitle>
            <CardDescription>
              Manage devices that receive push notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {devices.length === 0 ? (
              <div className="text-center py-8">
                <Smartphone className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
                <p className="text-neutral-400">{t('settings.noDevices')}</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="w-4 h-4 me-2" />
                  Add Device
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {devices.map((device) => {
                  const Icon = getDeviceIcon(device.deviceType);
                  return (
                    <div 
                      key={device.id}
                      className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">{device.deviceName}</p>
                          <p className="text-xs text-neutral-400">
                            Last active: {formatLastActive(device.lastActive)}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {device.deviceType}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-error hover:bg-error/10"
                        onClick={() => handleRemoveDevice(device.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>
          {t('settings.savePreferences')}
        </Button>
      </div>
    </div>
  );
}