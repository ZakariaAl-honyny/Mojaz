'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Target,
  Car,
  Clock,
  Calendar,
  FileText,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Mock test results data
const mockTestResults = {
  theory: [
    {
      id: '1',
      attemptNumber: 1,
      date: '2025-03-10',
      score: 82,
      passingScore: 70,
      passed: true,
      certificateAvailable: true
    }
  ],
  practical: [
    {
      id: 'p1',
      attemptNumber: 1,
      date: null,
      score: null,
      passingScore: 70,
      passed: false,
      pending: true,
      scheduledDate: '2025-04-15'
    }
  ]
};

const ResultCard = ({ 
  type, 
  results 
}: { 
  type: 'theory' | 'practical'; 
  results: any[];
}) => {
  const t = useTranslations('test');
  const hasPassed = results.some(r => r.passed);
  const hasAttempt = results.find(r => r.date !== null);
  const attemptCount = results.length;

  return (
    <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center",
              type === 'theory' ? "bg-orange-100" : "bg-blue-100"
            )}>
              {type === 'theory' ? (
                <Target className="w-7 h-7 text-orange-500" />
              ) : (
                <Car className="w-7 h-7 text-blue-500" />
              )}
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-neutral-900">
                {type === 'theory' ? t('theory.title') : t('practical.title')}
              </CardTitle>
              <p className="text-sm text-neutral-500 font-medium">
                {attemptCount} {t('attempts')}
              </p>
            </div>
          </div>
          
          {hasPassed && (
            <Badge className="bg-success/10 text-success font-bold text-sm px-4 py-2">
              <CheckCircle2 className="w-4 h-4 me-1" />
              {t('pass')}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0 space-y-4">
        {hasAttempt ? (
          <div className="space-y-3">
            {results.map((result) => (
              <div 
                key={result.id} 
                className={cn(
                  "p-4 rounded-xl border",
                  result.passed 
                    ? "bg-success/5 border-success/20" 
                    : result.pending 
                      ? "bg-blue-50 border-blue-100"
                      : "bg-error/5 border-error/20"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-600">
                      Attempt #{result.attemptNumber}
                    </span>
                    {result.passed && (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    )}
                  </div>
                  <span className="text-sm text-neutral-500">
                    {result.date || 'Pending'}
                  </span>
                </div>
                
                {result.score && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-500">{t('score')}</span>
                    <span className={cn(
                      "text-2xl font-black",
                      result.passed ? "text-success" : "text-error"
                    )}>
                      {result.score}%
                    </span>
                  </div>
                )}
                
                {result.pending && (
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600">
                      Scheduled: {result.scheduledDate}
                    </span>
                  </div>
                )}
                
                {result.certificateAvailable && result.passed && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-3 h-10 font-bold rounded-xl border-primary-200 text-primary-600"
                  >
                    <Download className="w-4 h-4 me-2" />
                    {t('viewCertificate')}
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium">{t('noResultsDesc')}</p>
          </div>
        )}
        
        {/* Retake eligibility */}
        {!hasPassed && attemptCount > 0 && (
          <div className="p-4 bg-warning/10 rounded-xl border border-warning/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-warning">{t('retakeEligible')}</span>
              <RefreshCw className="w-4 h-4 text-warning" />
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              Max {t('maxAttempts')}: 3
            </p>
            <Button className="w-full h-10 font-bold rounded-xl bg-warning hover:bg-warning/90">
              <Calendar className="w-4 h-4 me-2" />
              {t('bookRetake')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function MyResultsPage() {
  const t = useTranslations('test');
  const [results] = useState(mockTestResults);

  const theoryPassed = results.theory.some(r => r.passed);
  const practicalPassed = results.practical.some(r => r.passed);

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
      </div>

      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={cn(
          "border-none shadow-xl rounded-3xl overflow-hidden",
          theoryPassed 
            ? "bg-gradient-to-br from-success to-green-600 text-white" 
            : "bg-neutral-900 text-white"
        )}>
          <CardContent className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-medium text-white/80 mb-1">{t('theory.title')}</p>
                <p className="text-3xl font-black">
                  {theoryPassed ? t('pass') : t('noResults')}
                </p>
              </div>
            </div>
            {theoryPassed && (
              <Award className="w-12 h-12 text-white/50" />
            )}
          </CardContent>
        </Card>

        <Card className={cn(
          "border-none shadow-xl rounded-3xl overflow-hidden",
          practicalPassed 
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white" 
            : "bg-neutral-900 text-white"
        )}>
          <CardContent className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Car className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-medium text-white/80 mb-1">{t('practical.title')}</p>
                <p className="text-3xl font-black">
                  {practicalPassed ? t('pass') : t('noResults')}
                </p>
              </div>
            </div>
            {practicalPassed && (
              <Award className="w-12 h-12 text-white/50" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResultCard type="theory" results={results.theory} />
        <ResultCard type="practical" results={results.practical} />
      </div>

      {/* Certificates Section */}
      {(theoryPassed || practicalPassed) && (
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-primary-50">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-xl font-bold text-neutral-900 flex items-center gap-3">
              <Award className="w-6 h-6 text-primary-500" />
              Your Certificates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {theoryPassed && (
                <div className="p-5 bg-white rounded-2xl border border-primary-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">Theory Test Certificate</p>
                      <p className="text-sm text-neutral-500">Issued: 2025-03-10</p>
                    </div>
                  </div>
                  <Button variant="outline" className="h-10 font-bold rounded-xl border-primary-200">
                    <Download className="w-4 h-4 me-2" />
                    Download
                  </Button>
                </div>
              )}
              
              {practicalPassed && (
                <div className="p-5 bg-white rounded-2xl border border-primary-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Car className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">Practical Test Certificate</p>
                      <p className="text-sm text-neutral-500">Issued: -</p>
                    </div>
                  </div>
                  <Button variant="outline" className="h-10 font-bold rounded-xl border-primary-200">
                    <Download className="w-4 h-4 me-2" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}