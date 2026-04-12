import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

interface TestAttemptBadgeProps {
  result: 'Pass' | 'Fail' | 'Absent';
}

export function TestAttemptBadge({ result }: TestAttemptBadgeProps) {
  const t = useTranslations('practical.result');
  
  if (result === 'Pass') {
    return <Badge className="bg-green-500 hover:bg-green-600 text-white">{t('pass')}</Badge>;
  }
  
  if (result === 'Fail') {
    return <Badge variant="destructive">{t('fail')}</Badge>;
  }
  
  return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">{t('absent')}</Badge>;
}
