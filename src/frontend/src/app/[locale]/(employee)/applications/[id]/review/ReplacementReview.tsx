"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle2, XCircle } from 'lucide-react';

const verifyStolenReportSchema = z.object({
  isApproved: z.boolean().refine(val => val !== undefined, {
    message: "employeeReview.required",
  }),
  comments: z.string().min(5, { message: "employeeReview.commentsRequired" }),
});

type VerifyFormValues = z.infer<typeof verifyStolenReportSchema>;

interface ReplacementReviewProps {
  application: any; // Should use proper ApplicationDto type
}

export default function ReplacementReview({ application }: ReplacementReviewProps) {
  const params = useParams();
  const t = useTranslations('application');
  const applicationId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifyStolenReportSchema),
    defaultValues: {
      isApproved: false,
      comments: '',
    },
  });

  const onSubmit = async (values: VerifyFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await ApplicationService.verifyStolenReport(applicationId, values);
      if (result.success) {
        toast.success(t('replacement.employeeReview.success'));
      } else {
        toast.error(result.message || t('replacement.employeeReview.error'));
      }
    } catch (error) {
      toast.error(t('replacement.employeeReview.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStolen = application?.replacementReason === 'Stolen' || application?.replacementReason === 'مسروقة';

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-500">{t('replacement.employeeReview.title')}</h1>
        <Badge variant="outline" className="text-primary-500 border-primary-500">
          {application?.applicationNumber}
        </Badge>
      </div>

      <Card className="border-t-4 border-t-primary-500">
         <CardHeader>
           <CardTitle>{t('replacement.employeeReview.details')}</CardTitle>
           <CardDescription>{t('replacement.employeeReview.description')}</CardDescription>
         </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
             <p className="text-sm text-neutral-500">{t('replacement.employeeReview.reason')}</p>
             <p className="font-medium">{application?.replacementReason}</p>
           </div>
           <div className="space-y-2">
             <p className="text-sm text-neutral-500">{t('replacement.employeeReview.applicantName')}</p>
             <p className="font-medium">{application?.applicantName}</p>
           </div>
        </CardContent>
      </Card>

      {isStolen && (
        <Card className="border-t-4 border-t-secondary-500">
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <CheckCircle2 className="text-secondary-500" />
               {t('replacement.employeeReview.verifyReport')}
             </CardTitle>
             <CardDescription>{t('replacement.employeeReview.verifyReportDesc')}</CardDescription>
           </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-neutral-100 dark:bg-neutral-800 rounded-gov">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-neutral-700 rounded-full shadow-sm">
                  <ExternalLink className="w-5 h-5 text-primary-500" />
                </div>
                 <div>
                   <p className="font-medium">{t('replacement.employeeReview.policeReport')}</p>
                   <p className="text-xs text-neutral-500">{t('replacement.employeeReview.uploadedOn')} {application?.updatedAt}</p>
                 </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary-500 text-primary-500 hover:bg-primary-50"
                onClick={() => window.open(application?.policeReportUrl, '_blank')}
              >
                {t('replacement.employeeReview.policeReportLink')}
              </Button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="isApproved"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>{t('replacement.employeeReview.verifyReport')}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === 'true')}
                          defaultValue={field.value ? 'true' : 'false'}
                          className="flex gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-x-reverse">
                            <FormControl>
                              <RadioGroupItem value="true" />
                            </FormControl>
                            <Label className="flex items-center gap-2 cursor-pointer">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              {t('replacement.employeeReview.approve')}
                            </Label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-x-reverse">
                            <FormControl>
                              <RadioGroupItem value="false" />
                            </FormControl>
                            <Label className="flex items-center gap-2 cursor-pointer">
                              <XCircle className="w-4 h-4 text-red-500" />
                              {t('replacement.employeeReview.reject')}
                            </Label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('replacement.employeeReview.comments')}</FormLabel>
                       <FormControl>
                         <Textarea 
                           placeholder={t('replacement.employeeReview.commentsPlaceholder')} 
                           className="resize-none"
                           {...field} 
                         />
                       </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CardFooter className="px-0 pt-0">
                   <Button 
                     type="submit" 
                     className="w-full bg-primary-500 hover:bg-primary-600 text-white" 
                     disabled={isSubmitting}
                   >
                     {isSubmitting ? t('replacement.employeeReview.submitting') : t('replacement.employeeReview.submit')}
                   </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
