"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageSquare, Bell, Smartphone, CheckCircle2, XCircle } from "lucide-react"

interface NotificationPreferences {
  enableEmail: boolean
  enableSms: boolean
  enablePush: boolean
}

interface PreferencesFormProps {
  initialPreferences?: NotificationPreferences
  onSave?: (preferences: NotificationPreferences) => Promise<void>
}

export function PreferencesForm({ 
  initialPreferences = { 
    enableEmail: true, 
    enableSms: true, 
    enablePush: true 
  }, 
  onSave 
}: PreferencesFormProps) {
  const t = useTranslations('settings')
  const [isLoading, setIsLoading] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences>(initialPreferences)

  const handleToggle = async (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)

    // Auto-save on toggle
    if (onSave) {
      setIsLoading(true)
      try {
        await onSave(newPreferences)
      } catch (error) {
        // Revert on error
        setPreferences(preferences)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const notificationChannels = [
    {
      key: 'enableEmail' as const,
      icon: Mail,
      title: t('notifications.email'),
      description: t('notifications.emailDesc'),
      enabled: preferences.enableEmail,
    },
    {
      key: 'enableSms' as const,
      icon: MessageSquare,
      title: t('notifications.sms'),
      description: t('notifications.smsDesc'),
      enabled: preferences.enableSms,
    },
    {
      key: 'enablePush' as const,
      icon: Smartphone,
      title: t('notifications.push'),
      description: t('notifications.pushDesc'),
      enabled: preferences.enablePush,
    },
  ]

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {t('notifications.title')}
        </CardTitle>
        <CardDescription className="text-neutral-500 dark:text-neutral-400">
          {t('notifications.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Toggleable notification channels */}
        {notificationChannels.map((channel) => (
          <div 
            key={channel.key}
            className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <channel.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  {channel.title}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {channel.description}
                </p>
              </div>
            </div>
            <Switch
              checked={channel.enabled}
              onCheckedChange={(checked) => handleToggle(channel.key, checked)}
              disabled={isLoading}
            />
          </div>
        ))}

        {/* In-App notification info (always enabled, not toggleable) */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {t('notifications.inApp')}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {t('notifications.inAppDesc')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
              ✓
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}