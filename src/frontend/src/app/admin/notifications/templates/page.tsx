// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/lib/enums';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Mail,
  MessageSquare,
  Bell,
  Edit,
  Eye,
  Save,
  X,
  Loader2,
  Send,
  RefreshCw,
  Copy,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

// Notification template type
interface NotificationTemplate {
  id: string;
  eventType: string;
  channel: 'Email' | 'SMS' | 'Push' | 'InApp';
  titleAr: string;
  bodyAr: string;
  isActive: boolean;
  variables: string[];
}

// Sample notification templates (placeholder data)
const DEFAULT_TEMPLATES: NotificationTemplate[] = [
  {
    id: '1',
    eventType: 'ApplicationSubmitted',
    channel: 'Email',
    titleAr: 'تم استلام طلبك',
    bodyAr: 'مرحباً {{fullName}}، تم استلام طلب رخصة القيادة رقم {{applicationNumber}} بنجاح. يمكنك متابعة حالة طلبك من خلال حسابك.',
    isActive: true,
    variables: ['fullName', 'applicationNumber']
  },
  {
    id: '2',
    eventType: 'ApplicationSubmitted',
    channel: 'SMS',
    titleAr: 'طلب جديد',
    bodyAr: 'تم استلام طلبك رقم {{applicationNumber}}. ستتلقى إشعاراً عند تحديث حالة الطلب.',
    isActive: true,
    variables: ['applicationNumber']
  },
  {
    id: '3',
    eventType: 'MedicalExamScheduled',
    channel: 'Email',
    titleAr: 'موعد الفحص الطبي',
    bodyAr: 'موعد فحصك الطبي هو {{appointmentDate}} الساعة {{appointmentTime}} في {{centerName}}. يرجى الحضور قبل الموعد بـ 15 دقيقة.',
    isActive: true,
    variables: ['appointmentDate', 'appointmentTime', 'centerName']
  },
  {
    id: '4',
    eventType: 'MedicalExamResult',
    channel: 'Email',
    titleAr: 'نتيجة الفحص الطبي',
    bodyAr: 'مرحباً {{fullName}}، نُعلمك بأن نتيجة الفحص الطبي لطلب {{applicationNumber}} هي: {{result}}.',
    isActive: true,
    variables: ['fullName', 'applicationNumber', 'result']
  },
  {
    id: '5',
    eventType: 'TheoryTestScheduled',
    channel: 'Email',
    titleAr: 'موعد الاختبار النظري',
    bodyAr: 'موعد اختبارك النظري هو {{appointmentDate}} الساعة {{appointmentTime}} في {{centerName}}.',
    isActive: true,
    variables: ['appointmentDate', 'appointmentTime', 'centerName']
  },
  {
    id: '6',
    eventType: 'TheoryTestResult',
    channel: 'Email',
    titleAr: 'نتيجة الاختبار النظري',
    bodyAr: 'مرحباً {{fullName}}، نُعلمك بأن نتيجة الاختبار النظري لطلب {{applicationNumber}} هي: {{result}}.',
    isActive: true,
    variables: ['fullName', 'applicationNumber', 'result']
  },
  {
    id: '7',
    eventType: 'PracticalTestScheduled',
    channel: 'Email',
    titleAr: 'موعد الاختبار العملي',
    bodyAr: 'موعد اختبارك العملي هو {{appointmentDate}} الساعة {{appointmentTime}} في {{centerName}}.',
    isActive: true,
    variables: ['appointmentDate', 'appointmentTime', 'centerName']
  },
  {
    id: '8',
    eventType: 'LicenseIssued',
    channel: 'Email',
    titleAr: 'تم إصدار رخصة القيادة',
    bodyAr: 'تهانينا! تم إصدار رخصة القيادة رقم {{licenseNumber}}. يمكنك استلامها من مركز المرور.',
    isActive: true,
    variables: ['licenseNumber']
  },
  {
    id: '9',
    eventType: 'PaymentReceived',
    channel: 'SMS',
    titleAr: 'دفعة مستلمة',
    bodyAr: 'تم استلام دفعة مبلغ {{amount}} ريال. رقم المرجع: {{referenceNumber}}.',
    isActive: true,
    variables: ['amount', 'referenceNumber']
  },
  {
    id: '10',
    eventType: 'ApplicationRejected',
    channel: 'Email',
    titleAr: 'تم رفض الطلب',
    bodyAr: 'نأسف لإبلاغك بأن طلب رخصة القيادة رقم {{applicationNumber}} قد تم رفضه. السبب: {{reason}}.',
    isActive: true,
    variables: ['applicationNumber', 'reason']
  }
];

// Event type labels
const EVENT_TYPE_LABELS: Record<string, string> = {
  ApplicationSubmitted: 'تقديم طلب',
  MedicalExamScheduled: 'موعد الفحص الطبي',
  MedicalExamResult: 'نتيجة الفحص الطبي',
  TheoryTestScheduled: 'موعد الاختبار النظري',
  TheoryTestResult: 'نتيجة الاختبار النظري',
  PracticalTestScheduled: 'موعد الاختبار العملي',
  PracticalTestResult: 'نتيجة الاختبار العملي',
  LicenseIssued: 'إصدار الرخصة',
  PaymentReceived: 'دفعة مستلمة',
  ApplicationRejected: 'رفض الطلب'
};

// Channel icons and labels
const CHANNEL_INFO = {
  Email: { icon: Mail, label: 'بريد إلكتروني', color: 'text-blue-600 bg-blue-100' },
  SMS: { icon: MessageSquare, label: 'رسالة نصية', color: 'text-green-600 bg-green-100' },
  Push: { icon: Bell, label: 'إشعار فوري', color: 'text-purple-600 bg-purple-100' },
  InApp: { icon: Bell, label: 'إشعار داخل التطبيق', color: 'text-orange-600 bg-orange-100' }
};

export default function NotificationTemplatesPage() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(DEFAULT_TEMPLATES);
  const [loading, setLoading] = useState(false);
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterEvent, setFilterEvent] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewLang, setPreviewLang] = useState<'ar' | 'en'>('ar');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [saving, setSaving] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Client-side RBAC check
  useEffect(() => {
    if (!isAuthenticated || user?.role !== UserRole.Admin) {
      router.replace('/forbidden');
      return;
    }
  }, [user, isAuthenticated, router]);

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesChannel = filterChannel === 'all' || template.channel === filterChannel;
    const matchesEvent = filterEvent === 'all' || template.eventType === filterEvent;
    const matchesSearch = !searchTerm || 
      template.titleAr.includes(searchTerm) || 
      template.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesChannel && matchesEvent && matchesSearch;
  });

  // Get unique event types
  const eventTypes = [...new Set(templates.map(t => t.eventType))];

  const handleToggleActive = async (templateId: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTemplates(templates.map(template => 
        template.id === templateId ? { ...template, isActive: !template.isActive } : template
      ));
      toast.success(templates.find(t => t.id === templateId)?.isActive 
        ? 'تم تعطيل القالب بنجاح' 
        : 'تم تفعيل القالب بنجاح');
    } catch (error) {
      console.error('Failed to toggle template:', error);
      toast.error('فشل في تغيير حالة القالب');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (template: NotificationTemplate) => {
    setEditingTemplate({ ...template });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingTemplate) return;
    
    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTemplates(templates.map(template => 
        template.id === editingTemplate.id ? editingTemplate : template
      ));
      setIsEditOpen(false);
      setEditingTemplate(null);
      toast.success('تم حفظ القالب بنجاح');
    } catch (error) {
      console.error('Failed to save template:', error);
      toast.error('فشل في حفظ القالب');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const renderPreviewContent = (template: NotificationTemplate) => {
    let body = template.bodyAr;
    let title = template.titleAr;
    
    // Replace variables with sample values for preview
    template.variables.forEach(variable => {
      const sampleValues: Record<string, string> = {
        fullName: 'أحمد محمد',
        applicationNumber: 'MOJ-2025-12345678',
        appointmentDate: '15/06/2025',
        appointmentTime: '09:00 صباحاً',
        centerName: 'مركز المرور الرئيسي',
        result: 'ناجح',
        licenseNumber: 'L-2025-123456',
        amount: '100',
        referenceNumber: 'REF-2025-001',
        reason: 'عدم استيفاء المتطلبات'
      };
      body = body.replace(new RegExp(`{{${variable}}}`, 'g'), sampleValues[variable] || variable);
    });
    
    return { title, body };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Bell className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-900">
              قوالب الإشعارات
            </h1>
            <p className="text-sm text-neutral-500">
              إدارة قوالب الإشعارات البريدية والرسائل النصية
            </p>
          </div>
        </div>
        <Button
          className="bg-primary-600 hover:bg-primary-700 text-white gap-2"
        >
          <Save className="h-4 w-4" />
          إضافة قالب جديد
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-neutral-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="البحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pe-10"
              />
              <Eye className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            </div>
            <Select value={filterChannel} onValueChange={setFilterChannel}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="القناة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="Email">{CHANNEL_INFO.Email.label}</SelectItem>
                <SelectItem value="SMS">{CHANNEL_INFO.SMS.label}</SelectItem>
                <SelectItem value="Push">{CHANNEL_INFO.Push.label}</SelectItem>
                <SelectItem value="InApp">{CHANNEL_INFO.InApp.label}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEvent} onValueChange={setFilterEvent}>
              <SelectTrigger className="w-full lg:w-[220px]">
                <SelectValue placeholder="نوع الحدث" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {eventTypes.map(eventType => (
                  <SelectItem key={eventType} value={eventType}>
                    {EVENT_TYPE_LABELS[eventType] || eventType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map(template => {
          const channelInfo = CHANNEL_INFO[template.channel];
          const ChannelIcon = channelInfo.icon;
          
          return (
            <Card 
              key={template.id} 
              className={`border-neutral-200 shadow-sm transition-all duration-200 hover:shadow-md ${
                !template.isActive ? 'opacity-60' : ''
              }`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${channelInfo.color}`}>
                      <ChannelIcon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-neutral-700">
                      {channelInfo.label}
                    </span>
                  </div>
                  <Badge 
                    variant={template.isActive ? 'default' : 'secondary'}
                    className={template.isActive ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-600'}
                  >
                    {template.isActive ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-primary-900 mb-2">{template.titleAr}</h3>
                <p className="text-sm text-neutral-500 line-clamp-2 mb-3">{template.bodyAr}</p>
                
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      {EVENT_TYPE_LABELS[template.eventType] || template.eventType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreview(template)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4 text-neutral-500" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEdit(template)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4 text-primary-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="border-neutral-200 shadow-sm">
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
            <p className="text-neutral-500">لا توجد قوالب إشعارات</p>
          </CardContent>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>معاينة القالب</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.eventType && EVENT_TYPE_LABELS[selectedTemplate.eventType]}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-4">
              {/* Preview Content */}
              <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                <div className="mb-4">
                  <label className="text-sm font-medium text-neutral-500 mb-1 block">
                    العنوان
                  </label>
                  <div className="p-3 bg-white border border-neutral-200 rounded-lg">
                    {renderPreviewContent(selectedTemplate).title}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-500 mb-1 block">
                    المحتوى
                  </label>
                  <div className="p-3 bg-white border border-neutral-200 rounded-lg whitespace-pre-wrap text-sm">
                    {renderPreviewContent(selectedTemplate).body}
                  </div>
                </div>
              </div>

              {/* Variables Info */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-neutral-500">المتغيرات المتاحة:</span>
                {selectedTemplate.variables.map(variable => (
                  <Badge key={variable} variant="outline" className="text-xs font-mono">
                    {`{{${variable}}}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعديل القالب</DialogTitle>
          </DialogHeader>
          
          {editingTemplate && (
            <div className="space-y-4">
              {/* Channel Info */}
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                {(() => {
                  const channelInfo = CHANNEL_INFO[editingTemplate.channel];
                  const ChannelIcon = channelInfo.icon;
                  return (
                    <>
                      <div className={`p-2 rounded-lg ${channelInfo.color}`}>
                        <ChannelIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium">{channelInfo.label}</span>
                        <span className="text-neutral-500 text-sm mx-2">-</span>
                        <span className="text-sm text-neutral-500">
                          {EVENT_TYPE_LABELS[editingTemplate.eventType] || editingTemplate.eventType}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Arabic Fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-1 block">العنوان</label>
                  <Input
                    value={editingTemplate.titleAr}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, titleAr: e.target.value })}
                    placeholder="أدخل العنوان بالعربية"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-1 block">المحتوى</label>
                  <Textarea
                    value={editingTemplate.bodyAr}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, bodyAr: e.target.value })}
                    placeholder="أدخل المحتوى بالعربية"
                    rows={6}
                  />
                </div>
              </div>

              {/* Variables Display */}
              <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-800">المتغيرات المتاحة:</span>
                {editingTemplate.variables.map(variable => (
                  <Badge key={variable} variant="outline" className="text-xs font-mono border-blue-300 text-blue-700 bg-white">
                    {`{{${variable}}}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              إلغاء
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              disabled={saving}
              className="bg-primary-600 hover:bg-primary-700 text-white gap-2"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}