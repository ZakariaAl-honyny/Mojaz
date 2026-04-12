'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BookOpen,
  Car,
  GraduationCap,
  Award,
  Download,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Mock data for progress tracking
const mockProgress = {
  overall: 65,
  medical: {
    status: 'passed',
    date: '2025-02-15',
    passed: true
  },
  theoryTraining: {
    hoursCompleted: 18,
    hoursRequired: 20,
    completed: true
  },
  theoryTest: {
    attempts: 1,
    maxAttempts: 3,
    score: 82,
    date: '2025-03-10',
    passed: true
  },
  practicalTraining: {
    hoursCompleted: 12,
    hoursRequired: 30,
    completed: false,
    instructor: 'Ahmed Al-Mutairi',
    center: 'North Riyadh Driving Center'
  },
  practicalTest: {
    attempts: 0,
    maxAttempts: 3,
    score: null,
    passed: false,
    date: null,
    pending: true
  }
};

// Custom Progress component since shadcn/ui Progress doesn't exist
const ProgressBar = ({ value, className = '' }: { value: number; className?: string }) => (
  <div className={cn("h-2 bg-neutral-100 rounded-full overflow-hidden", className)}>
    <div 
      className="h-full bg-primary-500 rounded-full transition-all duration-500" 
      style={{ width: `${value}%` }}
    />
  </div>
);

const ProgressCard = ({ 
  title, 
  status, 
  icon: Icon, 
  children,
  color = 'primary'
}: { 
  title: string; 
  status?: string;
  icon: any;
  children?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}) => {
  const colorClasses = {
    primary: 'bg-primary-500/10 text-primary-500 border-primary-100',
    success: 'bg-success/10 text-success border-success/10',
    warning: 'bg-warning/10 text-warning border-warning/10',
    error: 'bg-error/10 text-error border-error/10',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/10'
  };
  
  const iconBgClasses = {
    primary: 'bg-primary-500',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-blue-500'
  };

  return (
    <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
      <CardHeader className="p-6 pb-2">
        <div className="flex items-center justify-between">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", iconBgClasses[color])}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {status && (
            <Badge className={cn(
              "font-bold text-xs uppercase tracking-wider px-3 py-1",
              status === 'passed' ? "bg-success/10 text-success" : 
              status === 'failed' ? "bg-error/10 text-error" :
              status === 'pending' ? "bg-warning/10 text-warning" :
              "bg-neutral-100 text-neutral-600"
            )}>
              {status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2 space-y-4">
        <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
        {children}
      </CardContent>
    </Card>
  );
};

export default function ProgressPage() {
  const t = useTranslations('progress');
  const [progress] = useState(mockProgress);

  const getStatusBadge = (passed: boolean | null | undefined, pending?: boolean) => {
    if (pending) {
      return (
        <Badge className="bg-warning/10 text-warning font-bold text-xs uppercase">
          {t('stages.pending') || 'Pending'}
        </Badge>
      );
    }
    if (passed === true) {
      return (
        <Badge className="bg-success/10 text-success font-bold text-xs uppercase">
          {t('medical.passed')}
        </Badge>
      );
    }
    if (passed === false) {
      return (
        <Badge className="bg-error/10 text-error font-bold text-xs uppercase">
          {t('medical.failed')}
        </Badge>
      );
    }
    return (
      <Badge className="bg-neutral-100 text-neutral-600 font-bold text-xs uppercase">
        {t('medical.pending')}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-none">
            {t('title')}
          </h1>
          <p className="text-lg text-neutral-500 max-w-xl font-medium leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-start">
            <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">{t('overall')}</p>
            <p className="text-3xl font-black text-primary-500">{progress.overall}%</p>
          </div>
          <ProgressBar 
            value={progress.overall} 
            className="w-32 h-3"
          />
        </div>
      </div>

      {/* Stage Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Medical Examination */}
        <ProgressCard 
          title={t('medical.title')} 
          status={progress.medical.passed ? t('medical.passed') : t('medical.failed')}
          icon={Activity}
          color={progress.medical.passed ? 'success' : 'error'}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-500">{t('medical.date')}</span>
              <span className="text-sm font-bold text-neutral-900">15/02/2025</span>
            </div>
            {progress.medical.passed && (
              <Button 
                variant="outline" 
                className="w-full h-11 font-bold rounded-xl border-primary-200 text-primary-600 hover:bg-primary-50"
              >
                <Download className="w-4 h-4 me-2" />
                {t('downloadCertificate')}
              </Button>
            )}
          </div>
        </ProgressCard>

        {/* Theory Training */}
        <ProgressCard 
          title={t('stages.theoryTraining')}
          status={progress.theoryTraining.completed ? t('theory.passed') : 'pending'}
          icon={BookOpen}
          color={progress.theoryTraining.completed ? 'success' : 'warning'}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-500">{t('training.hoursCompleted')}</span>
              <span className="text-lg font-black text-primary-500">
                {progress.theoryTraining.hoursCompleted}/{progress.theoryTraining.hoursRequired}
              </span>
            </div>
            <ProgressBar 
              value={(progress.theoryTraining.hoursCompleted / progress.theoryTraining.hoursRequired) * 100}
            />
          </div>
        </ProgressCard>

        {/* Theory Test */}
        <ProgressCard 
          title={t('theory.title')} 
          status={progress.theoryTest.passed ? t('theory.passed') : t('theory.failed')}
          icon={BookOpen}
          color={progress.theoryTest.passed ? 'success' : 'error'}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-500">{t('theory.score')}</span>
              <span className="text-2xl font-black text-success">{progress.theoryTest.score}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-500">{t('theory.attempts')}</span>
              <span className="text-sm font-bold text-neutral-900">
                {progress.theoryTest.attempts}/{progress.theoryTest.maxAttempts}
              </span>
            </div>
            {progress.theoryTest.passed && (
              <Button 
                variant="outline" 
                className="w-full h-11 font-bold rounded-xl border-primary-200 text-primary-600 hover:bg-primary-50"
              >
                <Award className="w-4 h-4 me-2" />
                {t('theory.certificate')}
              </Button>
            )}
          </div>
        </ProgressCard>

        {/* Practical Training */}
        <ProgressCard 
          title={t('stages.practicalTraining')}
          status={progress.practicalTraining.completed ? t('training.hoursCompleted') : 'in-progress'}
          icon={Car}
          color={progress.practicalTraining.completed ? 'success' : 'warning'}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-500">{t('training.hoursCompleted')}</span>
              <span className="text-lg font-black text-warning">
                {progress.practicalTraining.hoursCompleted}/{progress.practicalTraining.hoursRequired}
              </span>
            </div>
            <ProgressBar 
              value={(progress.practicalTraining.hoursCompleted / progress.practicalTraining.hoursRequired) * 100}
            />
            <div className="pt-2 border-t border-neutral-100">
              <p className="text-xs font-medium text-neutral-400">{t('training.instructor')}: <span className="text-neutral-900">{progress.practicalTraining.instructor}</span></p>
              <p className="text-xs font-medium text-neutral-400">{t('training.center')}: <span className="text-neutral-900">{progress.practicalTraining.center}</span></p>
            </div>
          </div>
        </ProgressCard>

        {/* Practical Test */}
        <ProgressCard 
          title={t('practical.title')} 
          status={progress.practicalTest.pending ? 'pending' : (progress.practicalTest.passed ? t('practical.passed') : t('practical.failed'))}
          icon={Car}
          color={progress.practicalTest.pending ? 'info' : (progress.practicalTest.passed ? 'success' : 'error')}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-500">{t('practical.attempts')}</span>
              <span className="text-sm font-bold text-neutral-900">
                {progress.practicalTest.attempts}/{progress.practicalTest.maxAttempts}
              </span>
            </div>
            {progress.practicalTest.pending && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm font-bold text-blue-600">{t('bookRetake')}</p>
              </div>
            )}
            {!progress.practicalTest.pending && !progress.practicalTest.passed && progress.practicalTest.attempts < progress.practicalTest.maxAttempts && (
              <Button className="w-full h-11 font-bold rounded-xl bg-warning hover:bg-warning/90">
                <Clock className="w-4 h-4 me-2" />
                {t('bookRetake')}
              </Button>
            )}
          </div>
        </ProgressCard>
      </div>

      {/* Certificate Download Section */}
      <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black">{t('downloadCertificate')}</h3>
              <p className="text-primary-100 font-medium">Download your theory test certificate</p>
            </div>
          </div>
          <Button className="h-14 px-8 bg-white text-primary-600 font-bold rounded-2xl hover:bg-white/90">
            <Download className="w-5 h-5 me-2" />
            {t('downloadCertificate')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}