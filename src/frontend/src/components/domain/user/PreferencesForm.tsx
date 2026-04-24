"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, Bell, Smartphone, CheckCircle2, XCircle, ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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
  const [isLoading, setIsLoading] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences>(initialPreferences)

  const handleToggle = async (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)

    if (onSave) {
      setIsLoading(true)
      try {
        await onSave(newPreferences)
      } catch (error) {
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
      title: 'البريد الإلكتروني الموثق',
      description: 'تلقي إشعارات الحوكمة، المواعيد المجدولة، والمخالفات عبر القنوات الرسمية.',
      enabled: preferences.enableEmail,
    },
    {
      key: 'enableSms' as const,
      icon: MessageSquare,
      title: 'خدمة الرسائل النصية السيادية (SMS)',
      description: 'تنبيهات عاجلة ورموز التحقق الثنائية لحماية هويتك الرقمية.',
      enabled: preferences.enableSms,
    },
    {
      key: 'enablePush' as const,
      icon: Smartphone,
      title: 'تنبيهات المنصة الحية',
      description: 'إشعارات دفع للمتصفح والجوال لمتابعة حالة الطلبات لحظياً.',
      enabled: preferences.enablePush,
    },
  ]

  return (
    <Card className="border border-neutral-200 shadow-2xl shadow-blue-900/5 rounded-[2.5rem] bg-white overflow-hidden font-arabic relative" dir="rtl">
      <CardHeader className="p-10 border-b border-neutral-50 bg-neutral-50/30">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 rounded-2xl bg-white border border-blue-100 shadow-sm flex items-center justify-center text-[#1a3a8f]">
              <Bell className="w-8 h-8" />
           </div>
           <div className="space-y-1">
              <CardTitle className="text-2xl font-black text-neutral-900 tracking-tight">
                تفضيلات التنبيهات والأمان
              </CardTitle>
              <CardDescription className="text-neutral-400 font-bold text-sm">
                تحكم كامل في بروتوكولات الاتصال بين المنصة وهويتك الرقمية.
              </CardDescription>
           </div>
        </div>
      </CardHeader>
      <CardContent className="p-10 space-y-4">
        <AnimatePresence mode="popLayout">
          {notificationChannels.map((channel, index) => (
            <motion.div 
              key={channel.key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-center justify-between p-7 rounded-[2rem] border transition-all duration-500 group",
                channel.enabled 
                  ? "bg-white border-[#1a3a8f]/10 shadow-xl shadow-blue-900/5" 
                  : "bg-neutral-50/50 border-neutral-100/50 grayscale"
              )}
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm transition-all duration-500 group-hover:rotate-6",
                  channel.enabled ? "bg-blue-50 text-[#1a3a8f] border-blue-100" : "bg-neutral-100 text-neutral-400 border-neutral-200"
                )}>
                  <channel.icon className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className={cn(
                    "text-lg font-black tracking-tight",
                    channel.enabled ? "text-neutral-900" : "text-neutral-400"
                  )}>
                    {channel.title}
                  </p>
                  <p className={cn(
                    "text-xs font-bold leading-relaxed max-w-sm",
                    channel.enabled ? "text-neutral-500" : "text-neutral-400"
                  )}>
                    {channel.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <Switch
                    checked={channel.enabled}
                    onCheckedChange={(checked) => handleToggle(channel.key, checked)}
                    disabled={isLoading}
                    className="data-[state=checked]:bg-[#1a3a8f] data-[state=unchecked]:bg-neutral-200 border-2 border-transparent scale-125"
                 />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Dynamic Warning Section */}
        <div className="mt-8 p-8 rounded-[2.5rem] bg-neutral-900 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-full h-full bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                  <CheckCircle2 className="w-7 h-7 text-white" />
               </div>
               <div>
                  <h4 className="text-xl font-black tracking-tight">إشعارات النظام المركزي</h4>
                  <p className="text-xs font-bold text-white/40 mt-1 uppercase tracking-widest">ملازمة للهوية الرقمية - لا يمكن إيقافها</p>
               </div>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest">نشط دائماً</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}