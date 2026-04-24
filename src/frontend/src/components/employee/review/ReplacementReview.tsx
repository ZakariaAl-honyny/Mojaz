'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/static-translations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import ApplicationService from '@/services/application.service';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Search, 
  FileText, 
  AlertCircle,
  ArrowUpRight,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const verifyStolenReportSchema = z.object({
  isApproved: z.boolean(),
  comments: z.string().min(5, { message: "التعليقات يجب أن لا تقل عن 5 أحرف" }),
});

type VerifyFormValues = z.infer<typeof verifyStolenReportSchema>;

interface ReplacementReviewProps {
  application: any;
}

export default function ReplacementReview({ application }: ReplacementReviewProps) {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('application');
  const applicationId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifyStolenReportSchema),
    defaultValues: {
      isApproved: true,
      comments: '',
    },
  });

  const onSubmit = async (values: VerifyFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await ApplicationService.verifyStolenReport(applicationId, values);
      if (result.success) {
        toast.success("تم اعتماد مراجعة محضر السرقة بنجاح.");
        router.back();
      } else {
        toast.error(result.message || "حدث خطأ أثناء رصد المراجعة.");
      }
    } catch (error) {
      toast.error("فشل النظام في معالجة الطلب.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 font-arabic max-w-5xl mx-auto py-10" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 px-4">
        <div className="space-y-6">
           <button 
             onClick={() => router.back()} 
             className="flex items-center gap-2 text-[#1a3a8f] font-black hover:-translate-x-2 transition-transform text-sm uppercase tracking-widest"
           >
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
              الرجوع لقائمة المهام
           </button>
           <div>
              <h1 className="text-5xl lg:text-6xl font-black text-neutral-900 tracking-tighter leading-none mb-4">
                 تدقيق بلاغ السرقة
              </h1>
              <p className="text-neutral-500 font-bold text-lg max-w-2xl leading-relaxed italic">
                 مراجعة وتحقق سيادي من محضـر الشرطة المرفق لطلب استبدال الرخصة المفقودة.
              </p>
           </div>
        </div>
        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-xl p-4 rounded-[2.5rem] border border-neutral-100 shadow-xl">
           <div className="w-14 h-14 bg-[#1a3a8f] rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-900/20">
              <FileText className="w-7 h-7" />
           </div>
           <div>
              <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest leading-none mb-1">رقم المعاملة السيادي</p>
              <p className="text-xl font-black text-[#1a3a8f] tracking-tight">{application?.applicationNumber || 'MOJ-2025-XXXX'}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
           {/* Section 1: Application Summary */}
           <Card className="border-none shadow-3xl rounded-[3.5rem] overflow-hidden bg-white p-2 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017]/5 rounded-bl-[100px] pointer-events-none" />
              <CardHeader className="p-10 pb-6">
                 <CardTitle className="text-2xl font-black text-neutral-900 flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400">
                       <Search className="w-6 h-6" />
                    </div>
                    ملخص بيانات المتقدم
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-10 pt-0 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <Label className="text-xs font-black text-neutral-300 uppercase tracking-widest">اسم صاحب الرخصة</Label>
                    <p className="text-xl font-black text-neutral-800">{application?.applicantName || 'جاري التحميل...'}</p>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-xs font-black text-neutral-300 uppercase tracking-widest">سبب الاستبدال</Label>
                    <p className="text-xl font-black text-neutral-800 flex items-center gap-3">
                       <ShieldCheck className="w-5 h-5 text-rose-500" />
                       {application?.replacementReason || 'مفقودة / مسروقة'}
                    </p>
                 </div>
              </CardContent>
           </Card>

           {/* Section 2: Police Report Review */}
           <Card className="border-none shadow-3xl rounded-[3.5rem] overflow-hidden bg-white p-2 relative group">
              <CardHeader className="p-10 pb-6 border-b border-neutral-50 flex flex-row items-center justify-between">
                 <CardTitle className="text-2xl font-black text-neutral-900 flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#D4A017]">
                       <ExternalLink className="w-6 h-6" />
                    </div>
                    محضر الشرطة الرقمي
                 </CardTitle>
                 <Button 
                    variant="outline" 
                    className="h-14 px-8 rounded-2xl border-2 border-neutral-100 font-black text-[#1a3a8f] gap-4 hover:bg-neutral-50"
                    onClick={() => window.open(application?.policeReportUrl, '_blank')}
                 >
                    <Search className="w-5 h-5" />
                    معاينة الوثيقة
                 </Button>
              </CardHeader>
              <CardContent className="p-10">
                 <div className="aspect-[4/3] bg-neutral-50 rounded-[2.5rem] border-4 border-dashed border-neutral-100 flex flex-col items-center justify-center text-center space-y-6 group-hover:bg-neutral-100/50 transition-colors cursor-zoom-in">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-black/5 group-hover:scale-110 transition-transform">
                       <FileText className="w-12 h-12 text-neutral-200" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-xl font-black text-neutral-400">انقر للمعاينة المكبرة للوثيقة</p>
                       <p className="text-sm font-bold text-neutral-300">يجب التأكد من وجود ختم مركز الشرطة وتاريخ البلاغ</p>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        <div className="space-y-10">
           {/* Section 3: Decision Console */}
           <Card className="border-none shadow-3xl rounded-[3.5rem] overflow-hidden bg-neutral-900 p-2 text-white relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,160,23,0.1),transparent)] pointer-events-none" />
              <CardHeader className="p-10 pb-6">
                 <CardTitle className="text-2xl font-black">قرار التدقيق المهني</CardTitle>
                 <CardDescription className="text-white/40 font-bold mt-2">توصية المراجع بناءً على الوثائق المرفقة</CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-4 space-y-10">
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                       <FormField
                          control={form.control}
                          name="isApproved"
                          render={({ field }) => (
                             <FormItem className="space-y-6">
                                <FormControl>
                                   <RadioGroup
                                      onValueChange={(value) => field.onChange(value === 'true')}
                                      defaultValue={field.value ? 'true' : 'false'}
                                      className="grid grid-cols-1 gap-4"
                                   >
                                      <FormItem onClick={() => field.onChange(true)}>
                                         <FormControl>
                                            <div className={cn(
                                               "flex items-center gap-6 p-6 rounded-3xl border-2 transition-all cursor-pointer group",
                                               field.value ? "bg-emerald-500/10 border-emerald-500" : "bg-white/5 border-white/5 hover:border-white/20"
                                            )}>
                                               <div className={cn(
                                                  "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                                                  field.value ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/40" : "border-white/20"
                                               )}>
                                                  {field.value && <CheckCircle2 className="w-4 h-4 text-white" />}
                                               </div>
                                               <div className="space-y-1">
                                                  <p className="font-black text-lg">قبول المحضر</p>
                                                  <p className="text-xs font-bold text-white/30">الوثيقة مطابقة للمعايير الأمنية</p>
                                               </div>
                                            </div>
                                         </FormControl>
                                      </FormItem>
                                      <FormItem onClick={() => field.onChange(false)}>
                                         <FormControl>
                                            <div className={cn(
                                               "flex items-center gap-6 p-6 rounded-3xl border-2 transition-all cursor-pointer group",
                                               !field.value ? "bg-rose-500/10 border-rose-500" : "bg-white/5 border-white/5 hover:border-white/20"
                                            )}>
                                               <div className={cn(
                                                  "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                                                  !field.value ? "bg-rose-500 border-rose-500 shadow-lg shadow-rose-500/40" : "border-white/20"
                                               )}>
                                                  {!field.value && <XCircle className="w-4 h-4 text-white" />}
                                               </div>
                                               <div className="space-y-1">
                                                  <p className="font-black text-lg text-rose-200">رفض لعدم الكفاية</p>
                                                  <p className="text-xs font-bold text-white/30">الوثيقة غير واضحة أو غير مكتملة</p>
                                               </div>
                                            </div>
                                         </FormControl>
                                      </FormItem>
                                   </RadioGroup>
                                </FormControl>
                                <FormMessage className="text-rose-400 font-bold text-xs" />
                             </FormItem>
                          )}
                       />

                       <FormField
                          control={form.control}
                          name="comments"
                          render={({ field }) => (
                             <FormItem className="space-y-4">
                                <FormLabel className="text-xs font-black text-white/40 uppercase tracking-widest mr-2">ملاحظات التدقيق الإضافية</FormLabel>
                                <FormControl>
                                   <Textarea
                                      placeholder="دون ملاحظاتك المهنية هنا لتبرير قرار القبول أو الرفض..."
                                      className="min-h-[160px] rounded-[2.5rem] bg-white/5 border-none p-8 font-bold text-lg placeholder:text-white/10 focus:ring-4 focus:ring-amber-500/20 transition-all text-white"
                                      {...field}
                                   />
                                </FormControl>
                                <FormMessage className="text-rose-400 font-bold text-xs" />
                             </FormItem>
                          )}
                       />

                       <Button
                          type="submit"
                          className="w-full h-20 bg-[#D4A017] hover:bg-[#b88a10] text-black text-xl font-black rounded-[2rem] shadow-3xl shadow-amber-900/40 transition-all flex items-center justify-center gap-4 group"
                          disabled={isSubmitting}
                       >
                          {isSubmitting ? (
                             <>
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                   <ShieldCheck className="h-7 w-7" />
                                </motion.div>
                                جاري الاعتماد السيادي...
                             </>
                          ) : (
                             <>
                                <span>اعتمـاد نتيجة المراجعة</span>
                                <ArrowUpRight className="w-7 h-7 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                             </>
                          )}
                       </Button>
                    </form>
                 </Form>
              </CardContent>
           </Card>

           <Card className="border-none shadow-2xl rounded-[3rem] p-12 bg-white/50 backdrop-blur-xl border border-white/20 text-center space-y-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[#1a3a8f] shadow-inner mb-2">
                 <AlertCircle className="w-8 h-8" />
              </div>
              <h5 className="text-xl font-black text-neutral-800">تنويه المراجع</h5>
              <p className="text-sm font-bold text-neutral-400 leading-relaxed italic">
                 "يتحمل المراجع المسؤولية القانونية الكاملة عن صحة البيانات والتحقق من الوثائق الرسمية المرفقة."
              </p>
           </Card>
        </div>
      </div>

      {/* Trust Footer */}
      <div className="flex justify-center pb-12 opacity-30 select-none pt-12">
         <div className="flex items-center gap-6 py-5 px-10 rounded-full border border-neutral-100 bg-white/50 backdrop-blur-sm shadow-sm">
            <ShieldCheck className="w-6 h-6 text-[#1a3a8f]" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-500">نظام المراجعة والتدقيق الموحد - الإدارة العامة للمرور</span>
         </div>
      </div>
    </div>
  );
}
