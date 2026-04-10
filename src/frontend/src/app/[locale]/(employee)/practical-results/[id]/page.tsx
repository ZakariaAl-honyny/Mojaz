import { getTranslations } from 'next-intl/server';
import { PracticalResultForm } from '@/components/domain/practical/PracticalResultForm';
import { PracticalTestHistory } from '@/components/domain/practical/PracticalTestHistory';

interface PracticalResultPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function PracticalResultPage({ params }: PracticalResultPageProps) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'practical' });

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">{t('form.title')}</h1>
          <p className="text-neutral-500 mt-2 text-lg">
            Application ID: {id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <PracticalResultForm applicationId={id} />
        </div>
        
        <div className="lg:col-span-5">
          <PracticalTestHistory applicationId={id} />
        </div>
      </div>
    </div>
  );
}
