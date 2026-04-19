'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
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
        "px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3",
        filter === value
          ? "bg-primary-600 text-white shadow-[0_10px_20px_rgba(30,58,138,0.3)] border border-primary-400/30"
          : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5"
      )}
    >
      {label}
      <span className={cn(
        "px-2 py-0.5 rounded-md min-w-[1.5rem]",
        filter === value ? "bg-white/20 text-white" : "bg-white/10 text-neutral-500"
      )}>
        {count}
      </span>
    </button>
  );

  return (
    <div className="space-y-12 py-12 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary-400">
            <FileText className="w-3.5 h-3.5" />
            {t('title')}
          </div>
          <h1 className="text-5xl font-black text-white tracking-widest leading-none font-arabic uppercase">
            {t('title')}
          </h1>
          <p className="text-xl text-neutral-400 max-w-xl font-bold font-arabic leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
        <Button
          className="h-20 px-12 rounded-[2rem] bg-primary-600 hover:bg-primary-500 text-white shadow-[0_20px_40px_rgba(30,58,138,0.4)] transition-all hover:scale-105 active:scale-95 text-xl font-black group"
          onClick={() => router.push('/applications/new')}
        >
          <Plus className="me-4 w-7 h-7 group-hover:rotate-90 transition-transform" />
          {t('filters.newApplication')}
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
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

        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 group-focus-within:text-primary-400 transition-colors" />
          <Input 
            className="h-16 ps-16 rounded-[1.5rem] border-white/10 bg-white/5 backdrop-blur-xl text-white placeholder:text-neutral-500 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all font-bold" 
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
              className="border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] bg-white/5 backdrop-blur-3xl rounded-[2rem] overflow-hidden group hover:border-primary-500/30 transition-all duration-500 cursor-pointer"
              onClick={() => router.push(`/applications/${app.id}`)}
            >
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-8 flex-1">
                  <div className={cn(
                    "w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110",
                    app.status === 'Issued' ? "bg-emerald-500/20 text-emerald-400 shadow-emerald-500/20" : "bg-primary-600/20 text-primary-400 shadow-primary-500/20"
                  )}>
                    <FileText className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight font-arabic">
                      {app.categoryName}
                    </h3>
                    <p className="text-xs font-black text-neutral-500 tracking-[0.2em] uppercase">
                      #{app.applicationNumber}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-16 flex-1 md:justify-center">
                  <div className="text-center md:text-start">
                    <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em] mb-3">
                      {t('filters.columns.status')}
                    </p>
                    <StatusBadge status={app.status} />
                  </div>

                  <div className="w-64 hidden xl:block">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em]">
                        Progress
                      </p>
                      <span className="text-[10px] font-black text-primary-400">{app.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${app.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn(
                          "h-full rounded-full shadow-[0_0_15px_rgba(30,58,138,0.5)]", 
                          app.status === 'Issued' ? "bg-emerald-500" : "bg-primary-600"
                        )} 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-end me-4 hidden sm:block">
                    <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em] mb-1">
                      {t('filters.columns.date')}
                    </p>
                    <p className="text-sm font-black text-white">
                      {new Date(app.date).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-16 w-16 rounded-2xl bg-white/5 text-neutral-400 hover:bg-primary-600 hover:text-white hover:scale-110 transition-all border border-white/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/applications/${app.id}`);
                    }}
                  >
                    <Eye className="w-7 h-7" />
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