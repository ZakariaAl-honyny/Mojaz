'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
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
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import theoryService from '@/services/theory.service';
import { SubmitTheoryResultRequest } from '@/types/theory.types';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const theoryResultSchema = z.object({
  score: z.coerce.number().min(0).max(100),
  isAbsent: z.boolean().default(false),
  notes: z.string().optional(),
});

interface TheoryResultFormProps {
  applicationId: string;
  applicantName: string;
  onSuccess?: () => void;
}

export function TheoryResultForm({ applicationId, applicantName, onSuccess }: TheoryResultFormProps) {
  const t = useTranslations('theory');
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
        toast.success(t('submit.success'));
        onSuccess?.();
      } else {
        setServerError(response.message || t('submit.error'));
      }
    } catch (error: any) {
      setServerError(error.response?.data?.message || t('submit.error'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-t-4 border-t-primary">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CheckCircle2 className="text-primary w-6 h-6" />
          {t('submit.title')}
        </CardTitle>
        <p className="text-muted-foreground">
          {t('submit.subtitle', { name: applicantName })}
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="isAbsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-md border p-4 bg-muted/30">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) form.setValue('score', 0);
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        {t('fields.isAbsent')}
                      </FormLabel>
                      <FormDescription>
                        {t('fields.isAbsentDescription')}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {!isAbsent && (
                <FormField
                  control={form.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('fields.score')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0-100" 
                          {...field} 
                          className="text-lg font-semibold"
                        />
                      </FormControl>
                      {score > 0 && (
                        <div className={cn(
                          "mt-2 px-3 py-1 rounded-full text-sm font-bold",
                          isPassing 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        )}>
                          {isPassing ? t('history.status.Pass') : t('history.status.Fail')} ({score}/{minPassScore})
                        </div>
                      )}
                      <FormDescription>
                        {t('fields.scoreDescription')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fields.notes')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('fields.notesPlaceholder')}
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('common.error')}</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full text-lg h-12" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t('submit.processing')}
                </>
              ) : (
                t('submit.button')
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
