'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, FileBadge, User, ClipboardList, Zap, ArrowLeft } from 'lucide-react';
import theoryService from '@/services/theory.service';
import { SubmitTheoryResultRequest } from '@/types/theory.types';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const theoryResultSchema = z.object({
  score: z.coerce.number().min(0, "الدرجة يجب أن تكون 0 على الأقل").max(100, "الدرجة لا يمكن أن تتجاوز 100"),
  isAbsent: z.boolean().default(false),
  notes: z.string().optional(),
});

interface TheoryResultFormProps {
  applicationId: string;
  applicantName: string;
  onSuccess?: () => void;
}

export function TheoryResultForm({ applicationId, applicantName, onSuccess }: TheoryResultFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof theoryResultSchema>>({
    resolver: zodResolver(theoryResultSchema),
    defaultValues: {
      score: 0,
      isAbsent: false,
      notes: '',
    },
  });

  const isAbsent = form.watch('isAbsent');
  const score = form.watch('score');
  const minPassScore = 80;
  const isPassing = score >= minPassScore;

  async function onSubmit(values: z.infer<typeof theoryResultSchema>) {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const response = await theoryService.submitResult(applicationId, values as SubmitTheoryResultRequest);
      if (response.success) {
        toast.success("تم رصد نتيجة الاختبار النظري بنجاح.");
        onSuccess?.();
      } else {
        setServerError(response.message || "حدث خطأ أثناء رصد النتيجة.");
      }
    } catch (error: any) {
      setServerError(error.response?.data?.message || "فشل النظام في معالجة الطلب.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-2xl bg-white/80 backdrop-blur-3xl rounded-[3rem] overflow-hidden font-arabic" dir="rtl">
      <CardHeader className="bg-[#1a3a8f]/5 p-10 border-b border-[#1a3a8f]/10 text-center space-y-4">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl border border-[#1a3a8f]/10">
          <ClipboardList className="w-10 h-10 text-[#1a3a8f]" />
        </div>
        <CardTitle className="text-3xl font-black text-[#1a3a8f] tracking-tighter">رصد نتيجة الاختبار النظري</CardTitle>
        <div className="flex items-center justify-center gap-2 bg-white/50 px-6 py-2 rounded-full border border-[#1a3a8f]/10 mx-auto w-fit">
           <User className="w-4 h-4 text-[#1a3a8f]" />
           <span className="text-sm font-black text-neutral-600">المتقدم: {applicantName}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-10 md:p-14">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              <FormField
                control={form.control}
                name="isAbsent"
                render={({ field }) => (
                  <FormItem className={cn(
                    "flex flex-row items-start gap-4 space-y-0 rounded-[2rem] border-4 p-6 transition-all duration-300 cursor-pointer",
                    field.value ? "bg-red-500/5 border-red-500 shadow-lg shadow-red-500/20" : "bg-neutral-50/50 border-neutral-50 hover:border-[#1a3a8f]/20"
                  )} onClick={() => {
                      const newVal = !field.value;
                      field.onChange(newVal);
                      if (newVal) form.setValue('score', 0);
                  }}>
                    <FormControl>
                      <div className={cn(
                        "w-8 h-8 rounded-xl border-4 flex items-center justify-center transition-all",
                        field.value ? "bg-red-500 border-red-500" : "border-neutral-200 bg-white"
                      )}>
                        {field.value && <AlertCircle className="w-4 h-4 text-white" />}
                      </div>
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="text-lg font-black text-neutral-800 cursor-pointer leading-tight">
                        إثبات غياب المتقدم
                      </FormLabel>
                      <p className="text-xs font-bold text-neutral-400">تفعيل هذا الخيار في حال عدم حضور المتقدم لموعد الاختبار</p>
                    </div>
                  </FormItem>
                )}
              />

              <AnimatePresence mode="wait">
                {!isAbsent && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <FormField
                      control={form.control}
                      name="score"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-black text-[#1a3a8f] me-2">درجة الاختبار (من 100)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field} 
                                className="h-16 text-2xl font-black text-center border-none bg-neutral-100/50 rounded-2xl focus:ring-4 focus:ring-[#1a3a8f]/10"
                              />
                              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1a3a8f]/20 font-black">/ 100</div>
                            </div>
                          </FormControl>
                          {score > 0 && (
                            <div className={cn(
                              "mt-2 px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 border-2 transition-colors",
                              isPassing 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                : "bg-red-50 text-red-600 border-red-100"
                            )}>
                              {isPassing ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                              {isPassing ? "اجتياز (ناجح)" : "إخفاق (راسب)"} • {score} من {minPassScore} كحد أدنى
                            </div>
                          )}
                          <FormMessage className="font-bold text-xs" />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-black text-[#1a3a8f] me-2">ملاحظات الفاحص الإضافية</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="دون أي ملاحظات حول سير الاختبار أو تحديات واجهت المتقدم..."
                      className="min-h-[120px] rounded-[2rem] border-none bg-neutral-100/50 p-6 font-bold text-lg focus:ring-4 focus:ring-[#1a3a8f]/10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-bold text-xs" />
                </FormItem>
              )}
            />

            {serverError && (
              <Alert variant="destructive" className="rounded-2xl border-4">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="font-black">خطأ في رصد النتيجة</AlertTitle>
                <AlertDescription className="font-bold">{serverError}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full h-20 bg-[#1a3a8f] hover:bg-[#00215a] text-white text-xl font-black rounded-[2rem] shadow-2xl shadow-blue-900/40 transition-all flex items-center justify-center gap-4 group" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-7 w-7 animate-spin" />
                  جاري الاعتماد...
                </>
              ) : (
                <>
                  <span>اعتمـاد النتيجة النهائية</span>
                  <ArrowLeft className="w-7 h-7 transition-transform group-hover:-translate-x-2" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
