'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Send, 
  Users, 
  User, 
  Shield, 
  Filter,
  Calendar,
  Eye,
  Check,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

type SendToType = 'single' | 'all' | 'role' | 'filter';

const templates = [
  { id: 'payment', title: 'Payment Reminder', titleAr: 'تذكير بالدفع', category: 'payment' },
  { id: 'appointment', title: 'Appointment Reminder', titleAr: 'تذكير بالموعد', category: 'appointment' },
  { id: 'status', title: 'Status Update', titleAr: 'تحديث الحالة', category: 'status' },
  { id: 'system', title: 'System Announcement', titleAr: 'إعلان النظام', category: 'system' },
  { id: 'custom', title: 'Custom Message', titleAr: 'رسالة مخصصة', category: 'custom' },
];

const roles = [
  { id: 'Applicant', name: 'Applicant', nameAr: 'متقدم', count: 150 },
  { id: 'Receptionist', name: 'Receptionist', nameAr: 'موظف الاستقبال', count: 10 },
  { id: 'Doctor', name: 'Doctor', nameAr: 'طبيب', count: 5 },
  { id: 'Examiner', name: 'Examiner', nameAr: 'مختبر', count: 8 },
  { id: 'Manager', name: 'Manager', nameAr: 'مدير', count: 3 },
  { id: 'Admin', name: 'Admin', nameAr: 'مدير نظام', count: 2 },
];

const mockUsers = [
  { id: '1', name: 'أحمد محمد', email: 'ahmed@example.com', role: 'Applicant' },
  { id: '2', name: 'سارة علي', email: 'sarah@example.com', role: 'Applicant' },
  { id: '3', name: 'خالد عمر', email: 'khaled@example.com', role: 'Applicant' },
];

export default function EmployeeNotificationsPage() {
  const t = useTranslations('notification');
  const user = useAuthStore(state => state.user);
  const [sendToType, setSendToType] = useState<SendToType>('single');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.title);
      if (template.category === 'payment') {
        setMessage('Dear Applicant,\n\nThis is a reminder that you have a pending payment for your driving license application. Please complete the payment to proceed with your application.\n\nBest regards,\nMojaz Team');
      } else if (template.category === 'appointment') {
        setMessage('Dear Applicant,\n\nThis is a reminder about your upcoming appointment. Please ensure to arrive on time.\n\nBest regards,\nMojaz Team');
      } else if (template.category === 'status') {
        setMessage('Dear Applicant,\n\nYour application status has been updated. Please log in to view the details.\n\nBest regards,\nMojaz Team');
      }
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const handleSchedule = async () => {
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSending(false);
    setScheduled(true);
    setTimeout(() => setScheduled(false), 3000);
  };

  // Only show for authorized roles
  const canAccess = user?.role && ['Admin', 'Manager', 'Receptionist'].includes(user.role);

  if (!canAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-600">Access Denied</h2>
          <p className="text-neutral-400 mt-2">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
          <Send className="w-6 h-6 text-primary-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{t('employee.sendNotification')}</h1>
          <p className="text-neutral-500">Send notifications to users</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="space-y-6">
          {/* Send To Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t('employee.sendTo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Send To Type Selection */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button
                  variant={sendToType === 'single' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSendToType('single')}
                  className="flex flex-col h-auto py-3"
                >
                  <User className="w-4 h-4 mb-1" />
                  {t('employee.sendToSingle')}
                </Button>
                <Button
                  variant={sendToType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSendToType('all')}
                  className="flex flex-col h-auto py-3"
                >
                  <Users className="w-4 h-4 mb-1" />
                  {t('employee.sendToAll')}
                </Button>
                <Button
                  variant={sendToType === 'role' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSendToType('role')}
                  className="flex flex-col h-auto py-3"
                >
                  <Shield className="w-4 h-4 mb-1" />
                  {t('employee.sendToRole')}
                </Button>
                <Button
                  variant={sendToType === 'filter' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSendToType('filter')}
                  className="flex flex-col h-auto py-3"
                >
                  <Filter className="w-4 h-4 mb-1" />
                  {t('employee.sendToFilter')}
                </Button>
              </div>

              {/* Dynamic Input Based on Selection */}
              <div className="pt-2">
                {sendToType === 'single' && (
                  <div>
                    <Label>{t('employee.selectUser')}</Label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map(userItem => (
                          <SelectItem key={userItem.id} value={userItem.id}>
                            {userItem.name} ({userItem.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {sendToType === 'role' && (
                  <div>
                    <Label>{t('employee.selectRole')}</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name} ({role.count} users)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {sendToType === 'all' && (
                  <div className="p-4 bg-primary-50 rounded-xl">
                    <p className="text-sm text-neutral-600">
                      This will send the notification to <span className="font-bold text-primary-500">all users</span> in the system.
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Total users: ~178
                    </p>
                  </div>
                )}

                {sendToType === 'filter' && (
                  <div className="space-y-3">
                    <div>
                      <Label>Application Status</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="medicaldone">Medical Done</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Message Section */}
          <Card>
            <CardHeader>
              <CardTitle>Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template Selection */}
              <div>
                <Label className="mb-2 block">{t('employee.template')}</Label>
                <div className="flex flex-wrap gap-2">
                  {templates.map(template => (
                    <Button
                      key={template.id}
                      variant={selectedTemplate === template.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      {template.title}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <Label>{t('employee.subject')}</Label>
                <Input
                  value={subject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                  placeholder="Enter notification subject"
                  className="mt-1"
                />
              </div>

              {/* Message */}
              <div>
                <Label>{t('employee.message')}</Label>
                <Textarea
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows={6}
                  className="mt-1"
                />
              </div>

              {/* Schedule Toggle */}
              <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
                <input
                  type="checkbox"
                  id="schedule"
                  checked={scheduleEnabled}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScheduleEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="schedule" className="flex-1 cursor-pointer">
                  <p className="font-semibold text-neutral-900">{t('employee.schedule')}</p>
                  <p className="text-sm text-neutral-400">Schedule notification for later</p>
                </label>
              </div>

              {/* Schedule Date/Time */}
              {scheduleEnabled && (
                <div className="grid grid-cols-2 gap-3 p-4 border border-primary-200 bg-primary-50/30 rounded-xl">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={scheduledDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScheduledDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={scheduledTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScheduledTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="w-4 h-4 me-2" />
                  {t('employee.preview')}
                </Button>
                
                {scheduleEnabled ? (
                  <Button
                    onClick={handleSchedule}
                    disabled={isSending || !subject || !message}
                    className="flex-1 sm:flex-none"
                  >
                    {isSending ? (
                      <>
                        <Clock className="w-4 h-4 me-2 animate-spin" />
                        Scheduling...
                      </>
                    ) : scheduled ? (
                      <>
                        <Check className="w-4 h-4 me-2" />
                        {t('employee.scheduleSuccess')}
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 me-2" />
                        {t('employee.scheduleNotification')}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSend}
                    disabled={isSending || !subject || !message || (sendToType === 'single' && !selectedUser) || (sendToType === 'role' && !selectedRole)}
                    className="flex-1 sm:flex-none"
                  >
                    {isSending ? (
                      <>
                        <span className="animate-spin me-2">⏳</span>
                        Sending...
                      </>
                    ) : sent ? (
                      <>
                        <Check className="w-4 h-4 me-2" />
                        {t('employee.notificationSent')}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 me-2" />
                        {t('employee.send')}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          {showPreview && (
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {t('employee.preview')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Send className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">Mojaz Platform</p>
                      <p className="text-xs text-neutral-400">noreply@mojaz.sa</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    {subject || 'Notification Subject'}
                  </h3>
                  <div className="text-sm text-neutral-600 whitespace-pre-wrap">
                    {message || 'Your message will appear here...'}
                  </div>
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <p className="text-xs text-neutral-400">
                      This is an automated notification from the Mojaz Driving License Platform.
                    </p>
                  </div>
                </div>

                {/* Recipients Preview */}
                <div className="mt-4 p-4 bg-primary-50 rounded-xl">
                  <p className="text-sm font-semibold text-neutral-700 mb-2">
                    Recipients:
                  </p>
                  {sendToType === 'single' && selectedUser && (
                    <p className="text-sm text-neutral-600">
                      {mockUsers.find(u => u.id === selectedUser)?.name} ({mockUsers.find(u => u.id === selectedUser)?.email})
                    </p>
                  )}
                  {sendToType === 'role' && selectedRole && (
                    <p className="text-sm text-neutral-600">
                      All {roles.find(r => r.id === selectedRole)?.name} users ({roles.find(r => r.id === selectedRole)?.count})
                    </p>
                  )}
                  {sendToType === 'all' && (
                    <p className="text-sm text-neutral-600">
                      All users in the system (~178 recipients)
                    </p>
                  )}
                  {sendToType === 'filter' && (
                    <p className="text-sm text-neutral-600">
                      Filtered users based on selected criteria
                    </p>
                  )}
                </div>

                {scheduleEnabled && scheduledDate && scheduledTime && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <p className="text-sm font-semibold text-amber-800">
                      {t('employee.scheduledFor')}:
                    </p>
                    <p className="text-sm text-amber-700">
                      {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="w-4 h-4 me-3" />
                Send Test Notification
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="w-4 h-4 me-3" />
                View Scheduled Notifications
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Check className="w-4 h-4 me-3" />
                Notification History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}