'use client';

import { useTranslations } from 'next-intl';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from '@/i18n/routing';

export default function ApplicationsListPage() {
  const t = useTranslations('applications');
  const router = useRouter();

  const applications = [
    { id: 'MOJ-2025-48291037', type: 'Category B License', status: 'Submitted', date: 'Mar 15, 2025', progress: 20 },
    { id: 'MOJ-2025-99210382', type: 'International Permit', status: 'Approved', date: 'Feb 10, 2025', progress: 100 },
  ];

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-5xl font-black text-neutral-900 tracking-tight leading-none">Your Applications</h1>
           <p className="text-lg text-neutral-400 max-w-lg font-medium leading-relaxed italic">
              Track, manage, and view the status of your driving license requests.
           </p>
        </div>
        <Button 
          size="lg" 
          className="h-16 px-8 rounded-2xl bg-primary-500 hover:bg-primary-600 shadow-2xl shadow-primary-500/20 text-lg font-bold transition-all active:scale-95 flex items-center gap-4 group"
          onClick={() => router.push('/applications/new')}
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          New Application
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-neutral-300 rtl:left-auto rtl:right-4" />
            <Input className="h-12 ps-12 rounded-xl border-neutral-100 bg-white shadow-sm" placeholder="Search by ID or Type..." />
         </div>
         <Button variant="outline" className="h-12 px-6 rounded-xl border-neutral-100 bg-white gap-2 font-bold shadow-sm hover:translate-y-[-2px] transition-all">
            <Filter className="w-5 h-5" />
            Filters
         </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {applications.map((app, i) => (
           <Card key={i} className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 p-2 group bg-white rounded-3xl cursor-pointer">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="flex items-center gap-6 flex-1">
                    <div className={cn(
                       "w-16 h-16 rounded-2xl flex items-center justify-center p-4",
                       app.status === 'Approved' ? "bg-success/10 text-success" : "bg-primary-500/10 text-primary-500"
                    )}>
                       <FileText className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-500 transition-colors uppercase tracking-tight">{app.type}</h3>
                       <p className="text-sm font-bold text-neutral-400 tracking-wider">ID: {app.id}</p>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row items-center gap-12 flex-1 md:justify-center">
                    <div className="text-center md:text-left rtl:md:text-right">
                       <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">Status</p>
                       <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", app.status === 'Approved' ? "bg-success" : "bg-warning animate-pulse")} />
                          <span className="font-bold text-neutral-900 uppercase text-xs">{app.status}</span>
                       </div>
                    </div>

                    <div className="w-48 text-center md:text-left rtl:md:text-right hidden sm:block">
                       <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">Progress</p>
                       <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div className={cn("h-full transition-all duration-1000", app.status === 'Approved' ? "bg-success w-full" : "bg-primary-500 w-[20%]")} />
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-12 w-12 rounded-xl bg-neutral-50 text-neutral-400 hover:bg-neutral-100 transition-all"
                      onClick={() => router.push(`/applications/${app.id}`)}
                    >
                       <Eye className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-neutral-400 hover:bg-neutral-100">
                       <MoreHorizontal className="w-5 h-5" />
                    </Button>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>
    </div>
  );
}

// Add cn utility export for convenience or import from lib
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
