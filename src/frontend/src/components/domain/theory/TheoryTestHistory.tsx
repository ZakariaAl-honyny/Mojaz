'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { History, Calendar, CheckCircle2, XCircle, User, AlertCircle } from 'lucide-react';
import theoryService from '@/services/theory.service';
import { TheoryTestDto } from '@/types/theory.types';
import { cn } from '@/lib/utils';

interface TheoryTestHistoryProps {
  applicationId: string;
}

export function TheoryTestHistory({ applicationId }: TheoryTestHistoryProps) {
  const t = useTranslations('theory');
  
  const { data, isLoading } = useQuery({
    queryKey: ['theory-history', applicationId],
    queryFn: () => theoryService.getHistory(applicationId),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <History className="w-5 h-5" />
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const attempts = data?.data?.items || [];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="border-none shadow-md overflow-hidden bg-card">
      <CardHeader className="bg-muted/50 border-b">
        <CardTitle className="text-xl flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          {t('history.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {attempts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>{t('history.empty')}</p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:start-[19px] before:w-0.5 before:bg-muted before:h-full pb-2">
            {attempts.map((attempt: TheoryTestDto) => (
              <div key={attempt.id} className="relative ps-11">
                {/* Timeline dot */}
                <div className={cn(
                  "absolute start-0 top-1 w-10 h-10 rounded-full border-4 border-background flex items-center justify-center z-10 shadow-sm",
                  attempt.result === 'Pass' ? "bg-green-500 text-white" : "bg-red-500 text-white"
                )}>
                  {attempt.result === 'Pass' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </div>

                <div className="bg-muted/30 rounded-xl p-5 border hover:bg-muted/50 transition-colors">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <h4 className="font-bold text-lg">
                        {t('history.attempt', { number: attempt.attemptNumber })}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(attempt.conductedAt)}
                      </div>
                    </div>
                    <Badge variant={attempt.result === 'Pass' ? "default" : "destructive"} className="px-3 py-1 text-sm uppercase">
                      {attempt.isAbsent ? t('history.status.Absent') : t(`history.status.${attempt.result}`)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground font-medium">{t('fields.score')}</span>
                      <span className="text-lg font-bold">
                        {attempt.isAbsent ? t('history.absent') : `${attempt.score}/${attempt.passingScore}`}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground font-medium flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        Examiner
                      </span>
                      <span className="font-medium text-foreground">
                        {attempt.examinerName || '-'}
                      </span>
                    </div>
                  </div>

                  {attempt.notes && (
                    <div className="mt-4 pt-4 border-t border-muted italic text-muted-foreground text-sm">
                      {attempt.notes}
                    </div>
                  )}

                  {(attempt.result === 'Fail' || attempt.result === 'Absent') && attempt.retakeEligibleAfter && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {t('history.eligibleDate', { date: formatDate(attempt.retakeEligibleAfter) })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}