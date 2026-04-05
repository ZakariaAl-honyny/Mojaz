'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Search, 
  User, 
  Stethoscope, 
  CheckCircle2, 
  Activity, 
  AlertCircle,
  Eye,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MedicalResultsPage() {
  const t = useTranslations('medical');
  const [searchId, setSearchId] = useState('');
  const [applicantFound, setApplicantFound] = useState(false);

  const handleSearch = () => {
    // Simulated Search
    if (searchId) setApplicantFound(true);
  };

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-5xl font-black text-neutral-900 tracking-tight leading-none">Medical Verification</h1>
           <p className="text-lg text-neutral-500 max-w-xl font-medium leading-relaxed italic">
              Medical Examiner Portal: Search for applicants and submit certified health results.
           </p>
        </div>
      </div>

      <Card className="border-none shadow-2xl rounded-3xl overflow-hidden p-2 bg-white">
         <CardContent className="p-10 space-y-8">
            <div className="max-w-2xl mx-auto space-y-6">
               <div className="space-y-2">
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
                       className="h-12 px-8 rounded-xl bg-primary-500 hover:bg-primary-600 font-bold shadow-lg shadow-primary-500/20"
                     >
                       Find Applicant
                     </Button>
                  </div>
               </div>

               {applicantFound && (
                 <div className="animate-in fade-in slide-in-from-top-4 duration-500 p-8 bg-neutral-50 rounded-3xl border border-neutral-100 flex items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-500 shadow-sm border border-neutral-100">
                          <User className="w-8 h-8" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-neutral-900 uppercase">Ahmed Al-Salmi</h3>
                          <p className="text-sm font-bold text-neutral-400">Application: MOJ-2025-48291037 (Category B)</p>
                       </div>
                    </div>
                    <div className="px-5 py-2 bg-warning/10 text-warning rounded-full text-xs font-black uppercase tracking-widest border border-warning/10">
                       Pending Medical
                    </div>
                 </div>
               )}
            </div>
         </CardContent>
      </Card>

      {applicantFound && (
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <Card className="xl:col-span-2 border-none shadow-2xl rounded-3xl overflow-hidden bg-white p-2">
               <CardHeader className="p-10 pb-0">
                  <CardTitle className="text-3xl font-black text-neutral-900 flex items-center gap-4">
                     <Stethoscope className="w-8 h-8 text-primary-500" />
                     Health Assessment Form
                  </CardTitle>
                  <CardDescription className="text-neutral-500 font-medium">Verify vision, blood group and general medical fitness.</CardDescription>
               </CardHeader>
               <CardContent className="p-10 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <Label className="text-sm font-black uppercase tracking-wider text-neutral-400">Vision Check (L/R)</Label>
                        <div className="grid grid-cols-2 gap-4">
                           <Input className="h-14 text-center text-2xl font-black rounded-2xl" placeholder="6/6" />
                           <Input className="h-14 text-center text-2xl font-black rounded-2xl" placeholder="6/9" />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <Label className="text-sm font-black uppercase tracking-wider text-neutral-400">Blood Group</Label>
                        <select className="flex h-14 w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-2 text-lg font-bold">
                           <option>Select Group</option>
                           <option>A+</option>
                           <option>O+</option>
                           <option>AB-</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <Label className="text-sm font-black uppercase tracking-wider text-neutral-400">Detailed Observations</Label>
                     <textarea 
                        className="w-full h-40 rounded-2xl border border-neutral-100 bg-neutral-50 p-6 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        placeholder="Enter any medical conditions, allergies, or physical considerations..."
                     />
                  </div>

                  <div className="flex items-center gap-4 p-6 bg-primary-50 rounded-2xl border border-primary-100/20">
                     <CheckCircle2 className="w-6 h-6 text-primary-500" />
                     <p className="text-sm font-bold text-primary-900 leading-none">Applicant meets all general licensing health standards.</p>
                  </div>

                  <div className="flex justify-end pt-6">
                     <Button className="h-16 px-12 text-xl font-black bg-primary-900 hover:bg-black rounded-2xl shadow-2xl transition-all hover:translate-y-[-4px]">
                        Save & Certify Results
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <div className="space-y-8">
               <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white p-2">
                  <CardHeader className="p-8">
                     <CardTitle className="text-xl font-bold flex items-center gap-3">
                        <Activity className="w-5 h-5 text-warning" />
                        Application Status
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-6">
                     <div className="space-y-2">
                        <div className="flex justify-between text-xs font-black uppercase text-neutral-400 tracking-widest">
                           <span>Verification Progress</span>
                           <span>35%</span>
                        </div>
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                           <div className="h-full bg-warning w-[35%]" />
                        </div>
                     </div>
                     <p className="text-xs text-neutral-500 leading-relaxed font-medium italic">
                        Medical results will trigger notification to the applicant via SMS and push alert.
                     </p>
                  </CardContent>
               </Card>

               <div className="p-10 bg-primary-500 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-150"></div>
                  <AlertCircle className="w-12 h-12 mb-6 text-primary-200" />
                  <h4 className="text-2xl font-black mb-4 leading-tight">Digital Seal Required</h4>
                  <p className="text-sm font-bold text-primary-100/80 leading-relaxed italic">
                     By clicking 'Certify', you are signing these results with your electronic health practitioner ID.
                  </p>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
