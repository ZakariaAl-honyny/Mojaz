'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/domain/application/StatusBadge';
import { useRouter } from '@/i18n/routing';
import { cn } from '@/lib/utils';

// Mock data
const mockApplications = [
  {
    id: 'MOJ-2025-48291037',
    applicationNumber: 'MOJ-2025-48291037',
    type: 'newLicense',
    category: 'B',
    categoryName: 'Private Car',
    status: 'Submitted',
    date: '2025-03-15T10:30:00Z',
    progress: 20
  },
  {
    id: 'MOJ-2025-99210382',
    applicationNumber: 'MOJ-2025-99210382',
    type: 'renewal',
    category: 'B',
    categoryName: 'Private Car',
    status: 'Issued',
    date: '2025-02-10T08:00:00Z',
    progress: 100
  },
  {
    id: 'MOJ-2025-12345678',
    applicationNumber: 'MOJ-2025-12345678',
    type: 'newLicense',
    category: 'A',
    categoryName: 'Motorcycle',
    status: 'InReview',
    date: '2025-03-10T14:20:00Z',
    progress: 40
  }
];

type FilterType = 'all' | 'pending' | 'inProgress' | 'completed';

export default function ApplicantApplicationsPage() {
  const t = useTranslations('applications');
  const ts = useTranslations('application.status');
  const router = useRouter();
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApplications = mockApplications.filter(app => {
    // Filter by status category
    if (filter === 'pending' && !['Submitted', 'Draft'].includes(app.status)) return false;
    if (filter === 'inProgress' && !['InReview', 'Paid', 'MedicalDone', 'TheoryDone', 'PracticalDone'].includes(app.status)) return false;
    if (filter === 'completed' && !['Approved', 'Issued'].includes(app.status)) return false;
    
    // Filter by search query
    if (searchQuery && !app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  const FilterTab = ({ value, label, count }: { value: FilterType; label: string; count: number }) => (
    <button
      onClick={() => setFilter(value)}
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
        filter === value
          ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
          : "bg-white text-neutral-600 hover:bg-neutral-50"
      )}
    >
      {label}
      <span className={cn(
        "text-xs px-2 py-0.5 rounded-full",
        filter === value ? "bg-white/20" : "bg-neutral-100"
      )}>
        {count}
      </span>
    </button>
  );

  return (
    <div className="space-y-10 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-neutral-900 tracking-tight leading-none">
            {t('title')}
          </h1>
          <p className="text-lg text-neutral-400 max-w-lg font-medium leading-relaxed italic">
            {t('subtitle')}
          </p>
        </div>
        <Button
          size="lg"
          className="h-16 px-8 rounded-2xl bg-primary-500 hover:bg-primary-600 shadow-2xl shadow-primary-500/20 text-lg font-bold transition-all active:scale-95 flex items-center gap-4 group"
          onClick={() => router.push('/applications/new')}
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          {t('filters.newApplication')}
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col md:flex-row gap-3">
        <FilterTab 
          value="all" 
          label={t('filters.all')} 
          count={mockApplications.length} 
        />
        <FilterTab 
          value="pending" 
          label={t('filters.pending')} 
          count={mockApplications.filter(a => ['Submitted', 'Draft'].includes(a.status)).length} 
        />
        <FilterTab 
          value="inProgress" 
          label={t('filters.inProgress')} 
          count={mockApplications.filter(a => ['InReview', 'Paid', 'MedicalDone', 'TheoryDone', 'PracticalDone'].includes(a.status)).length} 
        />
        <FilterTab 
          value="completed" 
          label={t('filters.completed')} 
          count={mockApplications.filter(a => ['Approved', 'Issued'].includes(a.status)).length} 
        />
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-neutral-300 rtl:left-auto rtl:right-4" />
          <Input 
            className="h-12 ps-12 rounded-xl border-neutral-100 bg-white shadow-sm" 
            placeholder={t('filters.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <Card 
              key={app.id} 
              className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 p-2 group bg-white rounded-3xl cursor-pointer"
              onClick={() => router.push(`/applications/${app.id}`)}
            >
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6 flex-1">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center p-4",
                    app.status === 'Issued' ? "bg-success/10 text-success" : "bg-primary-500/10 text-primary-500"
                  )}>
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-500 transition-colors uppercase tracking-tight">
                      {app.categoryName}
                    </h3>
                    <p className="text-sm font-bold text-neutral-400 tracking-wider">
                      {t('filters.columns.number')}: {app.applicationNumber}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-12 flex-1 md:justify-center">
                  <div className="text-center md:text-left rtl:md:text-right">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">
                      {t('filters.columns.status')}
                    </p>
                    <StatusBadge status={app.status} />
                  </div>

                  <div className="w-48 text-center md:text-left rtl:md:text-right hidden sm:block">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">
                      Progress
                    </p>
                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-1000", 
                          app.status === 'Issued' ? "bg-success w-full" : "bg-primary-500",
                          app.progress === 100 ? "w-full" : `w-[${app.progress}%]`
                        )} 
                        style={{ width: `${app.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-xl bg-neutral-50 text-neutral-400 hover:bg-neutral-100 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/applications/${app.id}`);
                    }}
                  >
                    <Eye className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-none shadow-xl rounded-3xl p-12">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-neutral-300" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-2">
                {t('filters.empty')}
              </h3>
              <p className="text-neutral-400 mb-6 max-w-md">
                {t('filters.emptySubtitle')}
              </p>
              <Button
                size="lg"
                className="h-14 px-8 rounded-2xl bg-primary-500 hover:bg-primary-600 shadow-lg"
                onClick={() => router.push('/applications/new')}
              >
                <Plus className="w-5 h-5 me-2" />
                {t('filters.newApplication')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}