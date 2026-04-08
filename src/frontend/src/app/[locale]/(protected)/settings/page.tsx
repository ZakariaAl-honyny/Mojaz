'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { PreferencesForm } from '@/components/domain/user/PreferencesForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle2 } from 'lucide-react'

interface NotificationPreferences {
  enableEmail: boolean
  enableSms: boolean
  enablePush: boolean
}

export default function SettingsPage() {
  const t = useTranslations('settings')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // In a real app, these would come from the API
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enableEmail: true,
    enableSms: true,
    enablePush: true
  })

  const handleSavePreferences = async (newPreferences: NotificationPreferences) => {
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      // Simulate API call - in production, this would call the backend
      // await userService.updateNotificationPreferences(newPreferences)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setPreferences(newPreferences)
      setSaveSuccess(true)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save preferences:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {t('title')}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {t('subtitle')}
          </p>
        </div>
        
        {saveSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">{t('notifications.success')}</span>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <PreferencesForm 
        initialPreferences={preferences}
        onSave={handleSavePreferences}
      />
    </div>
  )
}