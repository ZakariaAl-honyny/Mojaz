'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Search, 
  Target, 
  CheckCircle2, 
  XCircle, 
  Award, 
  FileText, 
  Car,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestResultsPage() {
  const t = useTranslations('test');
  const [searchId, setSearchId] = useState('');
  const [applicantFound, setApplicantFound] = useState(false);
  const [result, setResult] = useState<'pass' | 'fail' | null>(null);

  const handleSearch = () => {
    if (searchId) setApplicantFound(true);
  };

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
                       placeholder="e.g. 1092837482" 
                       value={searchId}
                       onChange={(e) => setSearchId(e.target.value)}
                     />
                  </div>
                  <Button 
                    size="lg" 
                    onClick={handleSearch}
                    className="h-12 px-8 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold shadow-lg shadow-orange-500/20"
                  >
                    Load Exam
                  </Button>
               </div>

               {applicantFound && (
                 <div className="animate-in fade-in slide-in-from-top-4 duration-500 p-8 bg-neutral-50 rounded-3xl border border-neutral-100 flex items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm border border-neutral-100">
                          <Car className="w-8 h-8" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-neutral-900 uppercase">Salim Al-Harbi</h3>
                          <p className="text-sm font-bold text-neutral-400">Application: MOJ-2025-99210382 (Category B)</p>
                       </div>
                    </div>
                    <div className="px-5 py-2 bg-blue-500/10 text-blue-500 rounded-full text-xs font-black uppercase tracking-widest border border-blue-500/10">
                       Practical Test
                    </div>
                 </div>
               )}
            </div>
         </CardContent>
      </Card>

      {applicantFound && (
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <Card className="xl:col-span-2 border-none shadow-2xl rounded-3xl overflow-hidden bg-white p-2">
               <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-black text-neutral-900 flex items-center gap-4">
                       <Target className="w-8 h-8 text-orange-500" />
                       Performance Evaluation
                    </CardTitle>
                    <CardDescription className="text-neutral-500 font-medium">Record observations for the practical driving assessment.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                     <Button 
                       variant={result === 'pass' ? 'default' : 'outline'}
                       className={cn("h-14 px-8 rounded-2xl font-black text-xl gap-3 transition-all", result === 'pass' ? "bg-success hover:bg-success shadow-success/20" : "")}
                       onClick={() => setResult('pass')}
                     >
                        <CheckCircle2 className="w-6 h-6" />
                        PASS
                     </Button>
                     <Button 
                       variant={result === 'fail' ? 'destructive' : 'outline'}
                       className={cn("h-14 px-8 rounded-2xl font-black text-xl gap-3 transition-all", result === 'fail' ? "bg-error hover:bg-error shadow-error/20" : "")}
                       onClick={() => setResult('fail')}
                     >
                        <XCircle className="w-6 h-6" />
                        FAIL
                     </Button>
                  </div>
               </CardHeader>
               <CardContent className="p-10 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <Label className="text-sm font-black uppercase tracking-wider text-neutral-400">Mistakes / Penalties</Label>
                        <Input className="h-14 rounded-2xl text-lg font-bold" type="number" placeholder="0" max="10" />
                     </div>
                     <div className="space-y-4">
                        <Label className="text-sm font-black uppercase tracking-wider text-neutral-400">Success Score</Label>
                        <Input className="h-14 rounded-2xl text-xl font-black text-primary-500 text-center" placeholder="%" />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <Label className="text-sm font-black uppercase tracking-wider text-neutral-400">Examiner Comments</Label>
                     <textarea 
                        className="w-full h-40 rounded-2xl border border-neutral-100 bg-neutral-50 p-6 text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        placeholder="Detailed feedback regarding lane control, signals, and speed adherence..."
                     />
                  </div>

                  <div className="flex justify-end pt-6">
                     <Button className="h-16 px-12 text-xl font-black bg-neutral-900 hover:bg-black rounded-2xl shadow-2xl transition-all hover:translate-y-[-4px]">
                        Submit Digital Evaluation
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <div className="space-y-8">
               <div className="p-10 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Award className="w-40 h-40" />
                  </div>
                  <h4 className="text-2xl font-black mb-4 leading-tight">Examiner Standards</h4>
                  <p className="text-sm font-bold text-neutral-400 leading-relaxed mb-8 italic">
                     Assessment criteria follow the MOJ-2025 standard for safe road operation.
                  </p>
                  <Button variant="ghost" className="w-full justify-between h-14 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all px-6">
                     View Grading Rubric
                     <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                  </Button>
               </div>

               <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white p-2">
                  <CardHeader className="p-8">
                     <CardTitle className="text-xl font-bold flex items-center gap-3">
                        <TrendingDown className="w-5 h-5 text-error" />
                        Critical Infractions
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-4">
                     {['Failed to stop at signal', 'Speeds above limit', 'No lane indicator'].map((item, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-error/5 rounded-xl border border-error/10">
                          <span className="text-sm font-bold text-error">{item}</span>
                          <XCircle className="w-4 h-4 text-error" />
                       </div>
                     ))}
                  </CardContent>
               </Card>
            </div>
         </div>
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
