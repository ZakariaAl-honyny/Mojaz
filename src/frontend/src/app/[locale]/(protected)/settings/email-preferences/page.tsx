'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Mail, 
  Bell, 
  CreditCard, 
  Calendar, 
  FileText, 
  Check,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function EmailPreferencesPage() {
  const t = useTranslations('notification');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [testResults, setTestResults] = useState(true);
  const [licenseIssuance, setLicenseIssuance] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('user@example.com');
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleEmailChange = () => {
    // Simulate email change
    if (newEmail) {
      setCurrentEmail(newEmail);
      setNewEmail('');
      setShowEmailChange(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{t('settings.emailPreferences')}</h1>
        <p className="text-neutral-500 mt-1">{t('settings.emailNotifications')}</p>
      </div>

      {/* Email Address Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary-500" />
            Email Address
          </CardTitle>
          <CardDescription>
            Your current email address for notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-neutral-50 rounded-xl">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="font-semibold text-neutral-900">{currentEmail}</p>
                <Badge variant="secondary" className="text-xs">Verified</Badge>
              </div>
              <p className="text-sm text-neutral-400 mt-1">
                All email notifications will be sent to this address
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowEmailChange(!showEmailChange)}
            >
              Change Email
            </Button>
          </div>

          {showEmailChange && (
            <div className="mt-4 p-4 border border-primary-200 bg-primary-50/30 rounded-xl">
              <Label className="text-sm font-medium text-neutral-700 mb-2 block">
                New Email Address
              </Label>
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter new email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleEmailChange}>
                  Save
                </Button>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                You will receive a verification email to confirm the change
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Notifications Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary-500" />
            {t('settings.emailEnabled')}
          </CardTitle>
          <CardDescription>
            Enable or disable email notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
            <div>
              <p className="font-semibold text-neutral-900">{t('settings.emailNotifications')}</p>
              <p className="text-sm text-neutral-500">
                {emailEnabled 
                  ? 'You will receive email notifications' 
                  : 'Email notifications are disabled'}
              </p>
            </div>
            <Switch
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Categories */}
      {emailEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Categories</CardTitle>
            <CardDescription>
              Choose which types of notifications you want to receive via email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Application Status */}
            <div className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{t('settings.applicationStatus')}</p>
                  <p className="text-sm text-neutral-400">
                    Get notified about application status changes
                  </p>
                </div>
              </div>
              <Switch
                checked={applicationStatus}
                onCheckedChange={setApplicationStatus}
              />
            </div>

            {/* Payment Reminders */}
            <div className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{t('settings.paymentReminders')}</p>
                  <p className="text-sm text-neutral-400">
                    Receive payment reminders and receipts
                  </p>
                </div>
              </div>
              <Switch
                checked={paymentReminders}
                onCheckedChange={setPaymentReminders}
              />
            </div>

            {/* Test Results */}
            <div className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{t('settings.testResults')}</p>
                  <p className="text-sm text-neutral-400">
                    Get notified when test results are available
                  </p>
                </div>
              </div>
              <Switch
                checked={testResults}
                onCheckedChange={setTestResults}
              />
            </div>

            {/* License Issuance */}
            <div className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Badge className="w-5 h-5 text-primary-600 font-bold">🎉</Badge>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{t('settings.licenseIssuance')}</p>
                  <p className="text-sm text-neutral-400">
                    Get notified when your license is issued
                  </p>
                </div>
              </div>
              <Switch
                checked={licenseIssuance}
                onCheckedChange={setLicenseIssuance}
              />
            </div>

            {/* Promotions */}
            <div className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">🎁</span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{t('settings.promotions')}</p>
                  <p className="text-sm text-neutral-400">
                    Receive promotional offers and updates
                  </p>
                </div>
              </div>
              <Switch
                checked={promotions}
                onCheckedChange={setPromotions}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSavePreferences}
          disabled={isSaving}
          className="min-w-32"
        >
          {isSaving ? (
            <>
              <span className="animate-spin me-2">⏳</span>
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4 me-2" />
              Saved!
            </>
          ) : (
            t('settings.savePreferences')
          )}
        </Button>
      </div>
    </div>
  );
}