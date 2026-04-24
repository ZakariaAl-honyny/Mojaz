'use client';

import { useState } from 'react';
import { 
  Search, 
  Stethoscope, 
  CheckCircle2, 
  Activity, 
  AlertCircle,
  Eye,
  UserCircle,
  Thermometer,
  ShieldCheck,
  ClipboardPen,
  ArrowLeft,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function MedicalResultsPage() {
  const [searchId, setSearchId] = useState('');
  const [applicantFound, setApplicantFound] = useState(false);

  const handleSearch = () => {
    // Simulated Search
    if (searchId) setApplicantFound(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-12 font-arabic" dir="rtl">
      {/* Institutional Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 px-4">
         <div className="flex items-center gap-8">
            <div className="w-2.5 h-20 bg-rose-600 rounded-full shadow-2xl shadow-rose-900/40 relative">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-rose-400 rounded-full opacity-50 blur-sm" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tighter leading-none mb-4">
                إدخال نتائج الفحص الطبي
              </h1>
              <p className="text-neutral-500 font-bold text-lg max-w-2xl leading-relaxed">
                بوابة الكادر الطبي المعتمدة لمصادقة نتائج اللياقة الصحية. البيانات المدخلة ستؤثر بشكل مباشر على استحقاق رخصة القيادة.
              </p>
            </div>
         </div>
      </header>

      {/* Search Console */}
      <Card className="border-none shadow-2xl shadow-black/5 rounded-[3rem] overflow-hidden p-3 bg-white mx-4 relative overflow-hidden group">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(25,58,143,0.02),transparent)] pointer-events-none" />
         <CardContent className="p-12 space-y-10 relative z-10">
            <div className="max-w-4xl mx-auto space-y-10">
               <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-rose-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-rose-100 shadow-inner group-hover:scale-110 transition-transform duration-700">
                     <Stethoscope className="w-10 h-10 text-rose-600" />
                  </div>
                  <h2 className="text-3xl font-black text-neutral-900 tracking-tight">التحقق من هوية المتقدم</h2>
                  <p className="text-neutral-400 font-bold text-lg max-w-xl mx-auto leading-relaxed">أدخل رقم الهوية الشخصية أو رقم الطلب السيادي للبدء في إجراءات الفحص الطبي الرسمي.</p>
               </div>

               <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                     <div className="relative flex-1 group">
                        <Search className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-neutral-300 transition-colors group-focus-within:text-rose-600" />
                        <Input 
                          className="h-20 pe-16 rounded-[1.75rem] text-2xl font-black border-2 border-neutral-100 bg-neutral-50/50 focus:bg-white focus:ring-8 focus:ring-rose-900/5 focus:border-rose-600/30 transition-all duration-500 tabular-nums shadow-inner" 
                          placeholder="0001-2025-00000000" 
                          value={searchId}
                          onChange={(e) => setSearchId(e.target.value)}
                        />
                     </div>
<Button 
                        size="lg" 
                        onClick={handleSearch}
                        className="h-10 md:h-12 px-6 md:px-8 rounded-md bg-[#1a3a8f] hover:bg-[#152d6f] text-sm md:text-base text-white font-black transition-all active:scale-95 group"
                      >
                        <span className="flex items-center gap-3 md:gap-4">
                           ابدأ عملية التحقق
                           <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
                        </span>
                      </Button>
                  </div>
               </div>

               <AnimatePresence>
                 {applicantFound && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.95, y: 30 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     className="p-10 bg-[#1a3a8f] rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl text-white relative overflow-hidden"
                   >
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
                       <div className="flex items-center gap-8 relative z-10">
                          <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-white shadow-inner border border-white/20">
                             <User className="w-12 h-12" />
                          </div>
                          <div className="text-center md:text-right space-y-2">
                             <h3 className="text-3xl font-black tracking-tight">أحمد فؤاد السلمي</h3>
                             <p className="text-lg font-bold text-white/50">رقم الطلب: MOJ-2025-48291037 • فئة (ب) خصوصي</p>
                          </div>
                       </div>
                       <div className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl text-base font-black border border-white/20 flex items-center gap-4 relative z-10">
                          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                          بانتظار مصادقة الفحص
                       </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
         </CardContent>
      </Card>

      <AnimatePresence>
        {applicantFound && (
           <motion.div 
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             className="grid grid-cols-1 xl:grid-cols-3 gap-10 px-4"
           >
              <Card className="xl:col-span-2 border-none shadow-3xl rounded-[3.5rem] overflow-hidden bg-white">
                 <CardHeader className="p-12 pb-8 border-b border-neutral-50 flex flex-col items-center sm:flex-row sm:justify-between gap-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner border border-rose-100">
                        <ClipboardPen className="w-8 h-8" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-black text-neutral-900 tracking-tight">التقرير الطبي الرسمي</CardTitle>
                        <CardDescription className="text-neutral-400 font-bold text-lg mt-1 italic leading-relaxed">تحليل اللياقة الصحية والمؤشرات الحيوية للمتقدم.</CardDescription>
                      </div>
                    </div>
                    <div className="px-6 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] font-mono">ID: MED-992-X</div>
                 </CardHeader>
                 <CardContent className="p-12 space-y-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="space-y-6">
                          <Label className="text-xs font-black text-[#1a3a8f] uppercase tracking-[0.2em] ms-2 flex items-center gap-3">
                            <Eye className="w-5 h-5 opacity-40" />
                            قياس حدة البصر (يسار | يمين)
                          </Label>
                          <div className="grid grid-cols-2 gap-8">
                             <Input className="h-20 text-center text-3xl font-black rounded-[1.5rem] border-2 border-neutral-100 bg-neutral-50/50 focus:border-rose-600 focus:bg-white focus:ring-8 focus:ring-rose-50 transition-all font-mono shadow-inner" placeholder="6/6" />
                             <Input className="h-20 text-center text-3xl font-black rounded-[1.5rem] border-2 border-neutral-100 bg-neutral-50/50 focus:border-rose-600 focus:bg-white focus:ring-8 focus:ring-rose-50 transition-all font-mono shadow-inner" placeholder="6/6" />
                          </div>
                       </div>
                       <div className="space-y-6 text-right">
                          <Label className="text-xs font-black text-[#1a3a8f] uppercase tracking-[0.2em] ms-2 flex items-center gap-3">
                            <Thermometer className="w-5 h-5 opacity-40" />
                            فصيلة الدم الموثقة (BLOOD TYPE)
                          </Label>
                          <div className="relative group">
                            <select className="flex h-20 w-full rounded-[1.5rem] border-2 border-neutral-100 bg-neutral-50/50 px-8 py-2 text-2xl font-black focus:bg-white focus:border-rose-600 focus:ring-8 focus:ring-rose-50 outline-none transition-all appearance-none cursor-pointer shadow-inner">
                                <option className="font-arabic">-- اختر الفصيلة --</option>
                                <option>A+</option>
                                <option>O+</option>
                                <option>A-</option>
                                <option>B+</option>
                                <option>AB+</option>
                            </select>
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                <Activity className="w-6 h-6 text-[#1a3a8f]" />
                            </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <Label className="text-xs font-black text-neutral-400 uppercase tracking-[0.25em] ms-2">خلاصة التشخيص والملاحظات السريرية</Label>
                       <textarea 
                          className="w-full h-52 rounded-[2.5rem] border-2 border-neutral-100 bg-neutral-50/50 p-10 text-xl font-bold focus:ring-8 focus:ring-blue-900/5 focus:bg-white focus:border-[#1a3a8f] outline-none transition-all placeholder:text-neutral-300 shadow-inner"
                          placeholder="أدخل التشخيص الطبي المفصل هنا، أي ملاحظات تتعلق بالحواس أو الجهاز الحركي..."
                        />
                    </div>

                    <div className="flex items-start gap-8 p-10 bg-emerald-50/70 rounded-[3rem] border border-emerald-100 group hover:bg-emerald-100/50 transition-all duration-500">
                       <CheckCircle2 className="w-10 h-10 text-emerald-600 mt-1 shrink-0" />
                       <div className="space-y-2">
                          <h5 className="text-xl font-black text-emerald-900">إقرار كفاءة صحية</h5>
                          <p className="text-lg font-bold text-emerald-800/70 leading-relaxed italic">نؤكد بصفتنا جهة طبية معتمدة بأن المتقدم المذكور أعلاه قد خضع لكافة الاختبارات اللازمة وهو لائق صحياً لقيادة المركبات وفقاً للفئة المحددة في طلبه.</p>
                       </div>
                    </div>

                    <div className="flex justify-end pt-10">
                       <Button className="h-10 md:h-12 px-6 md:px-8 rounded-md bg-[#1a3a8f] hover:bg-[#152d6f] text-sm md:text-base font-black text-white transition-all active:scale-95 flex items-center gap-3 md:gap-4 group">
                          <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform duration-500" />
                          اعتماد النتائج سيادياً
                       </Button>
                    </div>
                 </CardContent>
              </Card>

              <div className="space-y-10">
                 <Card className="border-none shadow-3xl rounded-[3rem] overflow-hidden bg-white p-4 group">
                    <CardHeader className="p-10 border-b border-neutral-50 bg-neutral-50/30 group-hover:bg-neutral-50 transition-colors duration-500">
                       <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-800">
                          <Activity className="w-8 h-8 text-[#D4A017] animate-bounce" />
                          مؤشر الإنجاز
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                       <div className="space-y-4">
                          <div className="flex justify-between text-[11px] font-black uppercase text-neutral-400 tracking-[0.3em]">
                             <span>اكتمال نموذج الفحص</span>
                             <span className="text-[#1a3a8f]">55%</span>
                          </div>
                          <div className="h-4 bg-neutral-50 rounded-full overflow-hidden border border-neutral-100 p-1">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "55%" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-l from-[#1a3a8f] to-blue-400 rounded-full relative"
                             >
                                <div className="absolute top-0 right-0 w-full h-1/2 bg-white/20 rounded-full" />
                             </motion.div>
                          </div>
                       </div>
                       <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                           <p className="text-sm text-blue-900 leading-relaxed font-bold italic text-center">
                              سيتم مزامنة البيانات فورتسجيلها مع السجل الرقمي الموحد للإدارة العامة للمرور.
                           </p>
                       </div>
                    </CardContent>
                 </Card>

                 <div className="p-12 bg-gradient-to-br from-neutral-900 to-[#1a3a8f] rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent)] pointer-events-none" />
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl transition-all duration-1000 group-hover:scale-110 group-hover:translate-x-10" />
                    
                    <AlertCircle className="w-20 h-20 mb-8 text-[#D4A017] opacity-60 group-hover:rotate-12 transition-transform duration-700" />
                    <h4 className="text-3xl font-black mb-6 leading-tight tracking-tight text-white">المسؤولية المهنية والقانونية</h4>
                    <p className="text-lg font-bold text-white/50 leading-relaxed italic mb-8">
                       بصفتك ضابطاً طبياً مخولاً، فإن مصادقتك على هذا التقرير تعني تحملك المسؤولية القانونية الكاملة عن صحة التشخيص وتوافقه مع المعايير السيادية لسلامة الطرق.
                    </p>
                    <div className="flex items-center gap-4 py-3 px-6 bg-white/5 rounded-2xl border border-white/10 w-fit">
                        <Label className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">مصادق بـ:</Label>
                        <span className="text-xs font-black text-[#D4A017] uppercase tracking-[0.1em]">DIGITAL_CERT_V2</span>
                    </div>
                 </div>
              </div>
           </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center pb-12 opacity-40 select-none pt-12">
         <div className="flex items-center gap-6 py-5 px-10 rounded-full border border-neutral-100 bg-white/50 backdrop-blur-sm shadow-sm group hover:opacity-100 transition-opacity">
            <ShieldCheck className="w-6 h-6 text-rose-600" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-500">بوابة المصادقة الطبية - نظام رخص القيادة السيادي</span>
         </div>
      </div>
    </div>
  );
}
