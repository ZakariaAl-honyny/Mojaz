'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { practicalService } from '@/services/practical.service';
import { TestAttemptBadge } from './TestAttemptBadge';
import { Calendar, User, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useLocale } from 'next-intl';

interface PracticalTestHistoryProps {
  applicationId: string;
}

export function PracticalTestHistory({ applicationId }: PracticalTestHistoryProps) {
  const t = useTranslations('practical.history');
  const locale = useLocale();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['practicalHistory', applicationId],
    queryFn: () => practicalService.getHistory(applicationId),
  });

  if (isLoading) {
    return <div className="space-y-4 animate-pulse">
      {[1, 2].map(i => (
        <Card key={i} className="w-full h-48 bg-neutral-100" />
      ))}
    </div>;
  }

  if (error || !data || !data.data || data.data.items.length === 0) {
    return (
      <Card className="bg-neutral-50 border-neutral-200 border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-8 text-neutral-500">
          <FileText className="w-12 h-12 mb-4 text-neutral-300" />
          <p>{t('noHistory')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary-900">{t('title')}</h3>
      {data.data.items.map((test) => (
        <Card key={test.id} className="overflow-hidden border-start-4 border-start-primary-500">
          <CardHeader className="bg-neutral-50 pb-3 border-b border-neutral-100 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base font-semibold">
                {t('attempt', { number: test.attemptNumber })}
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Calendar className="w-3.5 h-3.5 me-1" />
                {formatDate(test.conductedAt, locale)}
              </CardDescription>
            </div>
            <TestAttemptBadge result={test.result} />
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-sm">
            {test.isAbsent ? (
              <div className="flex items-start text-orange-600 bg-orange-50 p-3 rounded-md">
                <AlertTriangle className="w-5 h-5 me-2 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{t('isAbsent')}</p>
                  <p className="text-orange-500 text-xs mt-1">{t('absentDescription')}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  <div className="flex flex-col">
                    <span className="text-neutral-500 text-xs">{t('score')}</span>
                    <span className="font-medium text-neutral-900">{test.score} / {test.passingScore}</span>
                  </div>
                  {test.vehicleUsed && (
                    <div className="flex flex-col">
                      <span className="text-neutral-500 text-xs">{t('vehicleUsed')}</span>
                      <span className="font-medium text-neutral-900">{test.vehicleUsed}</span>
                    </div>
                  )}
                </div>

                <hr className="border-neutral-100" />

                <div className="space-y-2">
                  <div className="flex items-start">
                    <User className="w-4 h-4 me-2 shrink-0 mt-0.5 text-neutral-400" />
                    <div>
                      <span className="text-neutral-500 text-xs block">{t('examiner')}</span>
                      <span className="font-medium text-neutral-900">{test.examinerName || '—'}</span>
                    </div>
                  </div>

                  {test.notes && (
                    <div className="flex items-start bg-neutral-50 p-2 rounded text-neutral-700">
                      <FileText className="w-4 h-4 me-2 shrink-0 mt-0.5 text-neutral-400" />
                      <div>
                        <span className="text-neutral-500 text-xs block mb-0.5">{t('notes')}</span>
                        {test.notes}
                      </div>
                    </div>
                  )}
                  
                  {/* Internal notes only visible to employees, this is handled by role-based rendering at page level if needed, but here it's included for examiners */}
                  {test.examinerNotes && (
                    <div className="flex items-start bg-yellow-50 p-2 rounded text-yellow-800">
                      <AlertTriangle className="w-4 h-4 me-2 shrink-0 mt-0.5 text-yellow-600" />
                      <div>
                        <span className="text-yellow-600 text-xs block mb-0.5">{t('examinerNotes')}</span>
                        {test.examinerNotes}
                      </div>
                    </div>
                  )}
                </div>

                {(test.requiresAdditionalTraining || test.needsManualTransmissionEndorsement) && (
                  <div className="bg-primary-50 p-3 rounded-md border border-primary-100">
                    <h4 className="text-primary-800 text-xs font-semibold mb-2 uppercase tracking-wider">{t('requirements')}</h4>
                    <ul className="space-y-1">
                      {test.requiresAdditionalTraining && (
                        <li className="flex items-center text-primary-700">
                          <CheckCircle className="w-4 h-4 me-2" /> 
                          {t('requiresTraining')} ({test.additionalHoursRequired} {t('hours')})
                        </li>
                      )}
                      {test.needsManualTransmissionEndorsement && (
                        <li className="flex items-center text-primary-700">
                          <CheckCircle className="w-4 h-4 me-2" /> 
                          {t('manualEndorsement')}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </>
            )}

            {test.result !== 'Pass' && test.retakeEligibleAfter && (
              <div className="text-xs text-neutral-500 mt-2 bg-neutral-50 p-2 rounded text-center">
                {t('retakeEligible', { date: formatDate(test.retakeEligibleAfter, locale) })}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
