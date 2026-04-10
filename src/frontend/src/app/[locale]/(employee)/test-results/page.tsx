'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Search, 
  Target, 
  Car,
  Award,
  ChevronRight,
  TrendingDown,
  XCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TheoryResultForm } from '@/components/domain/theory/TheoryResultForm';
import ApplicationService from '@/services/application.service';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function TestResultsPage() {
  const t = useTranslations('test');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [application, setApplication] = useState<any | null>(null);

  const handleSearch = async () => {
    if (!searchQuery) return;
    
    setIsSearching(true);
    setApplication(null);
    try {
      // Use the list endpoint with search query
      const response = await ApplicationService.getApplications({ search: searchQuery, pageSize: 1 });
      if (response.success && response.data?.items && response.data.items.length > 0) {
        setApplication(response.data.items[0]);
      } else {
        toast.error('Application not found');
      }
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const isTheoryStage = application?.currentStage === 'Theory' || application?.status === 'TheoryTest';
  const isPracticalStage = application?.currentStage === 'Practical' || application?.status === 'PracticalTest';

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-5xl font-black text-neutral-900 tracking-tight leading-none">Testing Center</h1>
           <p className="text-lg text-neutral-500 max-w-xl font-medium leading-relaxed italic">
              Examiner Portal: Evaluate theory and practical driving sessions with digital certification.
           </p>
        </div>
      </div>

      <Card className="border-none shadow-2xl rounded-3xl overflow-hidden p-2 bg-white">
         <CardContent className="p-10 space-y-8">
            <div className="max-w-2xl mx-auto space-y-6">
               <Label className="text-base font-bold">Applicant Identity / Application No.</Label>
               <div className="flex gap-4">
                  <div className="relative flex-1">
                     <Search className="absolute left-4 top-3.5 h-5 w-5 text-neutral-300 rtl:left-auto rtl:right-4" />
                     <Input 
                       className="h-12 ps-12 rounded-xl text-lg font-bold" 
                       placeholder="e.g. MOJ-2025-..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                     />
                  </div>
                  <Button 
                    size="lg" 
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="h-12 px-8 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold shadow-lg shadow-orange-500/20"
                  >
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Load Exam"}
                  </Button>
               </div>

               {application && (
                 <div className="animate-in fade-in slide-in-from-top-4 duration-500 p-8 bg-neutral-50 rounded-3xl border border-neutral-100 flex items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm border border-neutral-100">
                          <Car className="w-8 h-8" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-neutral-900 uppercase">{application.applicantName}</h3>
                          <p className="text-sm font-bold text-neutral-400">Application: {application.applicationNumber} ({application.licenseCategoryNameEn})</p>
                       </div>
                    </div>
                    <div className={cn(
                      "px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border",
                      isTheoryStage ? "bg-primary/10 text-primary border-primary/10" : "bg-blue-500/10 text-blue-500 border-blue-500/10"
                    )}>
                       {isTheoryStage ? "Theory Test" : "Practical Test"}
                    </div>
                 </div>
               )}
            </div>
         </CardContent>
      </Card>

      {application && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          {isTheoryStage ? (
            <TheoryResultForm 
              applicationId={application.id} 
              applicantName={application.applicantName}
              onSuccess={() => {
                setApplication(null);
                setSearchQuery('');
              }}
            />
          ) : isPracticalStage ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <Card className="xl:col-span-2 border-none shadow-2xl rounded-3xl overflow-hidden bg-white p-2">
                <CardHeader className="p-10 pb-0">
                  <CardTitle className="text-3xl font-black text-neutral-900 flex items-center gap-4">
                     <Target className="w-8 h-8 text-orange-500" />
                     Practical Evaluation
                  </CardTitle>
                  <CardDescription className="text-neutral-500 font-medium">Record observations for the practical driving assessment.</CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                   <p className="text-center py-20 text-muted-foreground italic">Practical evaluation form integration pending...</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-none shadow-2xl rounded-3xl p-10 text-center">
              <p className="text-xl font-bold text-error">Application is not in a testing stage.</p>
              <p className="text-neutral-500 mt-2">Current Stage: {application.currentStage}</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
