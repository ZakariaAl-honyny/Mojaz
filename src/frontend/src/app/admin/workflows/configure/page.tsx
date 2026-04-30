// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserRole } from '@/lib/enums';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  GitBranch,
  ArrowRight,
  Save,
  Loader2,
  Edit,
  Plus,
  X,
  Trash2,
  Check,
  AlertTriangle,
  Settings,
  RotateCcw,
  ChevronLeft,
  Layers,
  Users,
  Clock,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';

// Workflow stage type
interface WorkflowStage {
  stageId: string;
  nameAr: string;
  nameEn: string;
  order: number;
  isActive: boolean;
  requiredRole: string;
  allowedTransitions: string[];
  autoProgress: boolean;
  description?: string;
}

// Request types
interface UpdateStageRequest {
  isActive?: boolean;
  requiredRole?: string;
  allowedTransitions?: string[];
  autoProgress?: boolean;
}

interface CreateStageRequest {
  stageId: string;
  nameAr: string;
  nameEn: string;
  order: number;
  requiredRole: string;
  allowedTransitions: string[];
  autoProgress: boolean;
  description?: string;
}

// Constants from backend
const STAGE_NAMES = [
  { id: '01: Creation', nameAr: 'تقديم الطلب', nameEn: 'Application Creation' },
  { id: '02: Documents', nameAr: 'المستندات', nameEn: 'Documents' },
  { id: '03: Initial Payment', nameAr: 'سداد الرسوم الأولية', nameEn: 'Initial Payment' },
  { id: '04: Medical', nameAr: 'الفحص الطبي', nameEn: 'Medical Exam' },
  { id: '05: Training', nameAr: 'التدريب', nameEn: 'Training' },
  { id: '06: Theory', nameAr: 'الاختبار النظري', nameEn: 'Theory Test' },
  { id: '07: Practical', nameAr: 'الاختبار العملي', nameEn: 'Practical Test' },
  { id: '08: Final Approval', nameAr: 'الاعتماد النهائي', nameEn: 'Final Approval' },
  { id: '09: Issuance Payment', nameAr: 'سداد رسوم الإصدار', nameEn: 'Issuance Payment' },
  { id: '10: Issuance', nameAr: 'إصدار الرخصة', nameEn: 'License Issuance' },
];

const ROLE_OPTIONS = [
  { value: 'Applicant', label: 'مقدم الطلب' },
  { value: 'Receptionist', label: 'موظف الاستقبال' },
  { value: 'Doctor', label: 'طبيب' },
  { value: 'Examiner', label: 'فاحص' },
  { value: 'Manager', label: 'مدير' },
  { value: 'Security', label: 'أمن' },
  { value: 'Admin', label: 'مدير النظام' },
];

export default function WorkflowConfigurePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateStageRequest>({});
  
  // RBAC check
  useEffect(() => {
    if (!isAuthenticated || user?.role !== UserRole.Admin) {
      router.replace('/forbidden');
    }
  }, [user, isAuthenticated, router]);

  // Fetch workflow configuration from Settings API
  const { data: stagesData, isLoading, refetch } = useQuery({
    queryKey: ['workflow-settings'],
    queryFn: async () => {
      const response = await apiClient.get('settings', { 
        params: { category: 'Workflow' } 
      });
      return response.data.data as WorkflowStage[];
    },
  });

  // Update stage mutation - uses Settings API
  const updateMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const response = await apiClient.put(`settings/${key}`, { value });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-settings'] });
      toast.success('تم تحديث الإعداد بنجاح');
    },
    onError: () => {
      toast.error('فشل في تحديث الإعداد');
    }
  });

  // Reset all workflow settings
  const resetMutation = useMutation({
    mutationFn: async () => {
      const keys = ['WORKFLOW_STAGES', 'WORKFLOW_TRANSITIONS', 'WORKFLOW_AUTO_PROGRESS'];
      for (const key of keys) {
        await apiClient.put(`settings/${key}`, { value: '' });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-settings'] });
      toast.success('تم إعادة تعيين الإعدادات');
    },
    onError: () => {
      toast.error('فشل في إعادة تعيين الإعدادات');
    }
  });

  // Default stages if API returns nothing
  const defaultStages: WorkflowStage[] = STAGE_NAMES.map((stage, index) => ({
    stageId: stage.id,
    nameAr: stage.nameAr,
    nameEn: stage.nameEn,
    order: index + 1,
    isActive: true,
    requiredRole: getRequiredRole(index + 1),
    allowedTransitions: getAllowedTransitions(index + 1),
    autoProgress: index === 3 || index === 4 || index === 5 || index === 6,
  }));

  // Handle both array and object responses from API
  const stages: WorkflowStage[] = Array.isArray(stagesData) 
    ? stagesData 
    : (stagesData?.items && Array.isArray(stagesData.items) ? stagesData.items : defaultStages);

  function getRequiredRole(order: number): string {
    const roles: Record<number, string> = {
      1: 'Applicant',
      2: 'Receptionist',
      3: 'Receptionist',
      4: 'Doctor',
      5: 'Receptionist',
      6: 'Examiner',
      7: 'Examiner',
      8: 'Manager',
      9: 'Applicant',
      10: 'Security',
    };
    return roles[order] || 'Manager';
  }

  function getAllowedTransitions(order: number): string[] {
    const transitions: Record<number, string[]> = {
      1: ['02: Documents'],
      2: ['03: Initial Payment', 'rejected'],
      3: ['04: Medical', 'rejected'],
      4: ['05: Training', 'rejected'],
      5: ['06: Theory', 'rejected'],
      6: ['07: Practical', 'rejected'],
      7: ['08: Final Approval', 'rejected'],
      8: ['09: Issuance Payment', 'rejected'],
      9: ['10: Issuance'],
      10: [],
    };
    return transitions[order] || [];
  }

  const handleToggleActive = async (stageId: string, currentActive: boolean) => {
    updateMutation.mutate({ key: `STAGE_ACTIVE_${stageId}`, value: (!currentActive).toString() });
  };

  const handleToggleAuto = async (stageId: string, currentAuto: boolean) => {
    updateMutation.mutate({ key: `STAGE_AUTO_${stageId}`, value: (!currentAuto).toString() });
  };

  const handleUpdateRole = async (stageId: string, role: string) => {
    updateMutation.mutate({ key: `STAGE_ROLE_${stageId}`, value: role });
  };

  const handleResetWorkflow = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين الإعدادات الافتراضية؟')) {
      resetMutation.mutate();
    }
  };

  const handleSave = () => {
    // Not implemented for now
  };

  const getStageInfo = (stageId: string) => {
    return stages.find(s => s.stageId === stageId) || { 
      stageId, 
      nameAr: stageId, 
      nameEn: stageId,
      order: 0,
      isActive: true,
      requiredRole: 'Manager',
      allowedTransitions: [],
      autoProgress: false
    };
  };

  const selectedStageData = selectedStage ? getStageInfo(selectedStage) : null;

  const getRoleLabel = (role: string) => {
    const roleObj = ROLE_OPTIONS.find(r => r.value === role);
    return roleObj?.label || role;
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#1a3a8f]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-arabic" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/admin/workflows')}
            className="ltr:rotate-180"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="p-2 bg-primary-100 rounded-lg">
            <Settings className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-900">
              تكوين سير العمل
            </h1>
            <p className="text-sm text-neutral-500">
              تخصيص مراحل وtransitions العملية
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleResetWorkflow}
          disabled={resetMutation.isPending}
          className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
        >
          {resetMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          إعادة تعيين
        </Button>
      </div>

      {/* Info Card */}
      <Card className="border-primary-200 bg-primary-50/50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Layers className="h-5 w-5 text-primary-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-primary-900 text-sm">
                إرشادات التكوين
              </h3>
              <p className="text-sm text-primary-700 mt-1">
                •قم بتفعيل/تعطيل كل مرحلة حسب الحاجة للنظام
                <br />
                •حدد الدور المسؤول عن كل مرحلة
                <br />
                •حدد ما إذا كانت المرحلة تتقدم تلقائياً بعد إكمال متطلباتها
                <br />
                •حدد التحولات المسموح بها لكل مرحلة
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stages List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-lg font-bold text-primary-900 mb-4">المراحل</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : (
            [...stages].sort((a, b) => (a.order || 0) - (b.order || 0)).map((stage) => (
              <Card 
                key={stage.stageId}
                className={`cursor-pointer transition-all ${
                  selectedStage === stage.stageId 
                    ? 'border-primary-500 bg-primary-50 shadow-md' 
                    : 'border-neutral-200 hover:border-primary-300'
                }`}
                onClick={() => setSelectedStage(stage.stageId)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedStage === stage.stageId
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {stage.order}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{stage.nameAr}</p>
                      <p className="text-xs text-neutral-500">{stage.nameEn}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={stage.isActive ? 'default' : 'secondary'}
                    className={stage.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-neutral-100 text-neutral-500'}
                  >
                    {stage.isActive ? 'نشط' : 'معطل'}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Stage Configuration */}
        <div className="lg:col-span-2">
          {selectedStage && selectedStageData ? (
            <Card className="border-primary-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                    {selectedStageData.order}
                  </span>
                  {selectedStageData.nameAr}
                </CardTitle>
                <CardDescription>
                  {selectedStageData.nameEn} - Order: {selectedStageData.order}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Active Toggle */}
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium">الحالة</p>
                      <p className="text-sm text-neutral-500">تفعيل أو تعطيل هذه المرحلة</p>
                    </div>
                  </div>
                  <Switch
                    checked={selectedStageData.isActive}
                    onCheckedChange={() => handleToggleActive(selectedStageData.stageId, selectedStageData.isActive)}
                    disabled={updateMutation.isPending}
                  />
                </div>

                {/* Required Role */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary-600" />
                    الدور المسؤول
                  </Label>
                  <Select
                    value={selectedStageData.requiredRole}
                    onValueChange={(value) => handleUpdateRole(selectedStageData.stageId, value)}
                    disabled={updateMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Auto Progress */}
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium">تقدم تلقائي</p>
                      <p className="text-sm text-neutral-500">التقدم للمرحلة التالية تلقائياً</p>
                    </div>
                  </div>
                  <Switch
                    checked={selectedStageData.autoProgress}
                    onCheckedChange={() => handleToggleAuto(selectedStageData.stageId, selectedStageData.autoProgress)}
                    disabled={updateMutation.isPending}
                  />
                </div>

                {/* Allowed Transitions */}
                <div className="space-y-2">
                  <Label>التحولات المسموح بها</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedStageData.allowedTransitions.length > 0 ? (
                      selectedStageData.allowedTransitions.map((transition) => {
                        const toStage = getStageInfo(transition);
                        return (
                          <Badge 
                            key={transition} 
                            variant="outline"
                            className="border-primary-300 text-primary-700 bg-white"
                          >
                            {toStage.nameAr}
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-sm text-neutral-400 italic">
                        لا توجد تحولات
                      </span>
                    )}
                  </div>
                </div>

                {/* Flow Visualization */}
                <div className="p-4 bg-primary-50 rounded-lg">
                  <Label className="text-primary-700 mb-2 block">مسار التدفق</Label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedStageData.order > 1 && (
                      <>
                        <ArrowRight className="h-4 w-4 text-neutral-400 rotate-180" />
                      </>
                    )}
                    <div className="px-3 py-1 bg-primary-600 text-white rounded text-sm font-medium">
                      {selectedStageData.nameAr}
                    </div>
                    {selectedStageData.allowedTransitions.length > 0 && (
                      <>
                        <ArrowRight className="h-4 w-4 text-neutral-400 rotate-180" />
                        <div className="flex gap-1">
                          {selectedStageData.allowedTransitions.slice(0, 3).map((t) => (
                            <span key={t} className="text-xs px-2 py-1 bg-white border border-primary-200 text-primary-700 rounded">
                              {getStageInfo(t).nameAr}
                            </span>
                          ))}
                          {selectedStageData.allowedTransitions.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-500 rounded">
                              +{selectedStageData.allowedTransitions.length - 3}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-neutral-200">
              <CardContent className="py-12 text-center">
                <GitBranch className="h-12 w-12 text-neutral-200 mx-auto mb-4" />
                <p className="text-neutral-500">
                  اختر مرحلة من القائمة لتكوينها
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}