// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/lib/enums';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  GitBranch,
  ArrowRight,
  Settings,
  Save,
  X,
  Loader2,
  Edit,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

// Workflow stage type
interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  requiredRole: string;
  allowedTransitions: string[];
  autoProgress: boolean;
}

// Sample workflow stages (placeholder data)
const DEFAULT_STAGES: WorkflowStage[] = [
  {
    id: 'draft',
    name: 'مسودة',
    description: 'حالة أولية للطلب لم يتم تقديمه بعد',
    order: 1,
    isActive: true,
    requiredRole: 'Applicant',
    allowedTransitions: ['submitted'],
    autoProgress: false
  },
  {
    id: 'submitted',
    name: 'مُقدَّم',
    description: 'تم تقديم الطلب للمراجعة',
    order: 2,
    isActive: true,
    requiredRole: 'Receptionist',
    allowedTransitions: ['inReview', 'rejected'],
    autoProgress: false
  },
  {
    id: 'inReview',
    name: 'قيد المراجعة',
    description: 'قيد المراجعة من قبل الموظف المسؤول',
    order: 3,
    isActive: true,
    requiredRole: 'Doctor,Examiner,Manager',
    allowedTransitions: ['medicalExam', 'securityCheck', 'rejected'],
    autoProgress: false
  },
  {
    id: 'medicalExam',
    name: 'الفحص الطبي',
    description: 'تم إحالة الطلب للفحص الطبي',
    order: 4,
    isActive: true,
    requiredRole: 'Doctor',
    allowedTransitions: ['theoryTest', 'rejected'],
    autoProgress: true
  },
  {
    id: 'theoryTest',
    name: 'الاختبار النظري',
    description: 'موعد الاختبار النظري',
    order: 5,
    isActive: true,
    requiredRole: 'Examiner',
    allowedTransitions: ['practicalTest', 'rejected'],
    autoProgress: true
  },
  {
    id: 'practicalTest',
    name: 'الاختبار العملي',
    description: 'موعد الاختبار العملي',
    order: 6,
    isActive: true,
    requiredRole: 'Examiner',
    allowedTransitions: ['securityCheck', 'rejected'],
    autoProgress: true
  },
  {
    id: 'securityCheck',
    name: 'التحقق الأمني',
    description: 'التحقق من السجل الأمني',
    order: 7,
    isActive: true,
    requiredRole: 'Security',
    allowedTransitions: ['approved', 'rejected'],
    autoProgress: false
  },
  {
    id: 'approved',
    name: 'مقبول',
    description: 'تم اعتماد الطلب',
    order: 8,
    isActive: true,
    requiredRole: 'Manager',
    allowedTransitions: ['licenseIssued'],
    autoProgress: false
  },
  {
    id: 'licenseIssued',
    name: 'رخصة مُصدرة',
    description: 'تم إصدار رخصة القيادة',
    order: 9,
    isActive: true,
    requiredRole: 'Manager',
    allowedTransitions: [],
    autoProgress: true
  },
  {
    id: 'rejected',
    name: 'مرفوض',
    description: 'تم رفض الطلب',
    order: 10,
    isActive: true,
    requiredRole: 'Receptionist,Doctor,Examiner,Manager,Security',
    allowedTransitions: ['draft'],
    autoProgress: false
  }
];

export default function WorkflowsPage() {
  const stages = DEFAULT_STAGES; // Use default stages directly for hardcoded logic
  const [stagesList, setStagesList] = useState<WorkflowStage[]>(stages);
  const [loading, setLoading] = useState(false);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [editingStage, setEditingStage] = useState<string | null>(null);
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

  const handleToggleStage = async (stageId: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setStagesList(stagesList.map(stage =>
        stage.id === stageId ? { ...stage, isActive: !stage.isActive } : stage
      ));
      toast.success(stagesList.find(s => s.id === stageId)?.isActive
        ? 'تم تعطيل المرحلة بنجاح'
        : 'تم تفعيل المرحلة بنجاح');
    } catch (error) {
      console.error('Failed to toggle stage:', error);
      toast.error('فشل في تغيير حالة المرحلة');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTransitions = async (stageId: string, newTransitions: string[]) => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setStagesList(stagesList.map(stage =>
        stage.id === stageId ? { ...stage, allowedTransitions: newTransitions } : stage
      ));
      setEditingStage(null);
      toast.success('تم حفظ التحولات بنجاح');
    } catch (error) {
      console.error('Failed to save transitions:', error);
      toast.error('فشل في حفظ التحولات');
    } finally {
      setSaving(false);
    }
  };

  const toggleExpand = (stageId: string) => {
    setExpandedStage(expandedStage === stageId ? null : stageId);
  };

  const getStageLabel = (stageId: string) => {
    const stage = stagesList.find(s => s.id === stageId);
    return stage ? stage.name : stageId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <GitBranch className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-900">
              إدارة سير العمل
            </h1>
            <p className="text-sm text-neutral-500">
              تكوين مراحل سير عمل الطلبات
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push('/admin/workflows/configure')}
          className="bg-primary-600 hover:bg-primary-700 text-white gap-2"
        >
          <Settings className="h-4 w-4" />
          {'تكوين متقدم'}
        </Button>
      </div>

      {/* Info Card */}
      <Card className="border-primary-200 bg-primary-50/50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Layers className="h-5 w-5 text-primary-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-primary-900 text-sm">
                معلومات حول سير العمل
              </h3>
              <p className="text-sm text-primary-700 mt-1">
                يعرض هذا القسم المراحل المختلفة لسير عمل طلبات رخصة القيادة. يمكنك تفعيل/تعطيل المراحل وتكوين التحولات المسموح بينها.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Stages */}
      <div className="space-y-4">
        {[...stagesList].sort((a, b) => (a.order || 0) - (b.order || 0)).map((stage, index) => (
          <Card
            key={stage.id}
            className={`border-neutral-200 shadow-sm transition-all duration-200 ${!stage.isActive ? 'opacity-60' : ''
              }`}
          >
            <CardContent className="p-0">
              {/* Stage Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-50 transition-colors"
                onClick={() => toggleExpand(stage.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
                    {stage.order}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900">{stage.name}</h3>
                    <p className="text-sm text-neutral-500">{stage.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={stage.isActive ? 'default' : 'secondary'} className={stage.isActive ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-600'}>
                    {stage.isActive ? 'نشط' : 'غير نشط'}
                  </Badge>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={stage.isActive}
                      onCheckedChange={() => handleToggleStage(stage.id)}
                      disabled={loading}
                    />
                  </div>
                  {expandedStage === stage.id ? (
                    <ChevronUp className="h-5 w-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-neutral-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedStage === stage.id && (
                <div className="border-t border-neutral-200 p-4 bg-neutral-50/50">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Current Transitions */}
                    <div>
                      <label className="text-sm font-medium text-neutral-700 mb-2 block">
                        التحولات المسموح بها
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {stage.allowedTransitions.length > 0 ? (
                          stage.allowedTransitions.map(transitionId => (
                            <Badge key={transitionId} variant="outline" className="border-primary-300 text-primary-700 bg-white">
                              {getStageLabel(transitionId)}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-neutral-400 italic">
                            لا توجد تحولات
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stage Info */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-neutral-700">
                          الدور المسؤول
                        </label>
                        <p className="text-sm text-neutral-600 mt-1">
                          {stage.requiredRole.split(',').map(role => {
                            const roles: Record<string, string> = {
                              'Applicant': 'مقدم الطلب',
                              'Receptionist': 'موظف الاستقبال',
                              'Doctor': 'طبيب',
                              'Examiner': 'فاحص',
                              'Manager': 'مدير',
                              'Security': 'أمن'
                            };
                            return roles[role.trim()] || role;
                          }).join('، ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-neutral-700">
                          تقدم تلقائي
                        </span>
                        <span>:</span>
                        <Badge variant={stage.autoProgress ? 'default' : 'outline'} className={stage.autoProgress ? 'bg-blue-100 text-blue-800' : ''}>
                          {stage.autoProgress ? 'نعم' : 'لا'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Flow Visualization */}
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <label className="text-sm font-medium text-neutral-700 mb-3 block">
                      مسار التدفق
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {index > 0 && (
                        <>
                          <ArrowRight className="h-4 w-4 text-neutral-400 rotate-180" />
                        </>
                      )}
                      <div className="px-3 py-2 bg-primary-100 border border-primary-200 rounded-lg">
                        <span className="text-sm font-medium text-primary-800">{stage.name}</span>
                      </div>
                      {stage.allowedTransitions.length > 0 && (
                        <>
                          <ArrowRight className="h-4 w-4 text-neutral-400 rotate-180" />
                          <div className="flex gap-1">
                            {stage.allowedTransitions.slice(0, 3).map(transitionId => (
                              <span key={transitionId} className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded">
                                {getStageLabel(transitionId)}
                              </span>
                            ))}
                            {stage.allowedTransitions.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-500 rounded">
                                +{stage.allowedTransitions.length - 3}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingStage(editingStage === stage.id ? null : stage.id)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      تحرير التحولات
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <Card className="border-neutral-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-primary-900">
            دليل المراحل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-500" />
              <span className="text-neutral-600">نشط</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral-400" />
              <span className="text-neutral-600">غير نشط</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-3 w-3 text-neutral-400 rotate-180" />
              <span className="text-neutral-600">تحويل</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-3 w-3 text-neutral-400" />
              <span className="text-neutral-600">تلقائي</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}