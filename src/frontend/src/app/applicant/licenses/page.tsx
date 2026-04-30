'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  Calendar,
  QrCode,
  AlertTriangle,
  ExternalLink,
  Award,
  Clock,
  Shield,
  RefreshCw,
  Share2
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from '@/lib/static-translations';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import LicenseService, { LicenseDto } from '@/services/license.service';
import { LicenseStatus as LicenseStatusEnum } from '@/lib/enums';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApplicantLicensesPage() {
  const t = useTranslations('license');
  const params = useParams();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['applicant-licenses'],
    queryFn: () => LicenseService.getUserLicenses(),
  });

  const licenses = data?.data || [];

  const getStatusConfig = (status: number) => {
    switch (status) {
      case LicenseStatusEnum.Active:
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          label: t('active'),
          icon: Shield
        };
      case LicenseStatusEnum.Expired:
        return {
          color: 'bg-red-50 text-red-700 border-red-100',
          label: t('expired'),
          icon: AlertTriangle
        };
      case LicenseStatusEnum.Suspended:
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-100',
          label: t('suspended'),
          icon: Clock
        };
      default:
        return {
          color: 'bg-neutral-50 text-neutral-700 border-neutral-100',
          label: 'غير معروف',
          icon: Shield
        };
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('ar-YE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 font-arabic" dir="rtl">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48 bg-neutral-100" />
          <Skeleton className="h-5 w-64 bg-neutral-100" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-[280px] w-full rounded-2xl bg-neutral-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-4 text-center font-arabic" dir="rtl">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900 mb-2">فشل تحميل البيانات</h2>
        <p className="text-neutral-500 mb-8">حدث خطأ أثناء محاولة جلب التراخيص من الخادم الحوكمي.</p>
        <Button
          onClick={() => refetch()}
          className="bg-[#1a3a8f] hover:bg-[#152d6f] gap-2 rounded-xl h-12 px-8 font-black"
        >
          <RefreshCw className="w-5 h-5" />
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 md:py-12 px-4 space-y-8 font-arabic" dir="rtl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-1.5 h-10 bg-[#1a3a8f] rounded-full shadow-lg shadow-blue-900/20" />
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight leading-none mb-1">
              {t('title')}
            </h1>
            <p className="text-neutral-400 font-bold text-[10px] md:text-xs uppercase tracking-widest leading-none">
              {t('subtitle')}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Badge variant="outline" className="h-8 px-3 border-emerald-100 bg-emerald-50 text-emerald-600 text-[10px] font-black flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            متصل بقاعدة البيانات المركزية
          </Badge>
        </motion.div>
      </header>

      {/* Licenses Grid */}
      <AnimatePresence mode="wait">
        {licenses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-neutral-100 rounded-3xl"
          >
            <div className="w-24 h-24 rounded-full bg-neutral-50 flex items-center justify-center mb-6">
              <Award className="w-12 h-12 text-neutral-200" />
            </div>
            <h3 className="text-xl font-black text-neutral-400 tracking-tight">
              {t('myLicenses')}
            </h3>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {licenses.map((license: LicenseDto, index) => {
              const status = getStatusConfig(license.status);
              const expiringSoon = isExpiringSoon(license.expiresAt);

              return (
                <motion.div
                  key={license.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <Card className="overflow-hidden border border-neutral-100 shadow-xl shadow-neutral-100/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 rounded-3xl group-hover:-translate-y-1">
                    {/* Visual Card Top Section */}
                    <div className="bg-[#1a3a8f] p-6 md:p-8 relative overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#fff_0%,_transparent_70%)]" />
                      <div className="absolute top-0 end-0 w-32 h-32 bg-white/5 blur-3xl -me-16 -mt-16" />

                      <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">فئة الرخصة</span>
                            <h3 className="text-xl md:text-2xl font-black text-white tracking-widest">{license.licenseCategoryNameAr}</h3>
                          </div>
                          <div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black border shadow-lg backdrop-blur-md",
                            status.color
                          )}>
                            {status.label}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">رقم الرخصة الموحد</span>
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-[#D4A017]" />
                            <p className="text-2xl md:text-3xl font-black text-[#D4A017] tracking-[0.1em]">{license.licenseNumber}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Body Section */}
                    <CardContent className="p-6 md:p-8 bg-white space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-neutral-400 mb-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">{t('issueDate')}</span>
                          </div>
                          <p className="text-sm font-black text-neutral-900">{formatDate(license.issuedAt)}</p>
                        </div>

                        <div className="space-y-2">
                          <div className={cn(
                            "flex items-center gap-2 mb-1",
                            expiringSoon ? "text-orange-500" : "text-neutral-400"
                          )}>
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">{t('expiryDate')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              "text-sm font-black",
                              expiringSoon ? "text-orange-600" : "text-neutral-900"
                            )}>
                              {formatDate(license.expiresAt)}
                            </p>
                            {expiringSoon && (
                              <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Administrative Details */}
                      <div className="pt-5 border-t border-dashed border-neutral-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-neutral-50 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-neutral-400" />
                          </div>
                          <span className="text-[10px] font-bold text-neutral-500">مركز الإصدار: الإدارة العامة للمرور</span>
                        </div>
                        <QrCode className="w-6 h-6 text-neutral-200" />
                      </div>

                      {/* Unified Actions */}
                      <div className="grid grid-cols-5 gap-3 pt-4">
                        <Link href={`/licenses/${license.id}`} className="col-span-3">
                          <Button className="w-full h-12 bg-[#1a3a8f] hover:bg-[#152d6f] text-white rounded-xl font-black gap-2 shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98]">
                            <ExternalLink className="w-4 h-4" />
                            استعراض الهوية الرقمية
                          </Button>
                        </Link>
                        <Button variant="outline" className="col-span-1 h-12 rounded-xl border-neutral-200 hover:bg-neutral-50 flex flex-col items-center justify-center p-0">
                          <QrCode className="w-5 h-5 text-neutral-600" />
                        </Button>
                        <Button variant="outline" className="col-span-1 h-12 rounded-xl border-neutral-200 hover:bg-neutral-50 flex flex-col items-center justify-center p-0">
                          <Share2 className="w-5 h-5 text-neutral-600" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

