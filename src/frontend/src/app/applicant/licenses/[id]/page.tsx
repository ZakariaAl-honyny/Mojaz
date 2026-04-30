'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Download,
  Share2,
  AlertTriangle,
  Printer,
  QrCode,
  Calendar,
  Shield,
  Car,
  User,
  MapPin,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from '@/lib/static-translations';
import { useParams } from 'next/navigation';
import { cn, maskNationalId } from "@/lib/utils";

export default function DigitalLicensePage() {
  const t = useTranslations('license');
  const { id } = useParams();

  // Mock data for MVP - would be fetched from API
  const license = {
    id: id as string,
    number: "MOJ-2025-48291037",
    class: "B",
    issueDate: "2025-01-15",
    expiryDate: "2028-01-15",
    status: "active",
    center: "الرياض - العليا",
    photoUrl: "/images/license-photo-placeholder.jpg",
    holder: {
      name: "أحمد عبدالله محمد",
      nationalId: "1023456789",
      dateOfBirth: "1990-05-15",
      nationality: "سعودي",
      gender: "ذكر"
    },
    restrictions: "None",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MOJ-2025-48291037"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'expired':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'suspended':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-neutral-50 text-neutral-600 border-neutral-100';
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  };

  const handleDownloadPdf = () => {
    // Would implement PDF generation
    console.log('Download PDF');
  };

  const handleShare = () => {
    // Would implement sharing functionality
    if (navigator.share) {
      navigator.share({
        title: `رخصة قيادة رقم ${license.number}`,
        text: `رخصة قيادة رقم ${license.number} - فئة ${license.class}`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 font-arabic" dir="rtl">
      {/* Back Link */}
      <Link
        href="/licenses"
        className="inline-flex items-center gap-3 text-neutral-400 hover:text-[#1a3a8f] transition-all group font-black uppercase text-xs tracking-widest"
      >
        <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:-translate-x-1 transition-transform" />
        {t('myLicenses')}
      </Link>

      {/* Digital License Card - Official Look */}
      <Card className="overflow-hidden border-0 shadow-[0_30px_60px_-15px_rgba(26,58,143,0.15)] rounded-[2.5rem]">
        {/* License Header */}
        <div className="bg-gradient-to-br from-[#0a1941] via-[#1a3a8f] to-[#0a1941] p-12 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
             <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>
          
          {/* Decorative Gold Accent */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#D4A017]/10 rounded-full blur-[80px]" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                   <Shield className="w-8 h-8 text-[#D4A017]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">نظام رخص القيادة الرقمي</h2>
                  <p className="text-white/60 text-xs font-black uppercase tracking-[0.3em] mt-1">الجمهورية اليمنية • الإدارة العامة للمرور</p>
                </div>
              </div>
              <Badge className={cn("px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border shadow-lg", getStatusColor(license.status))}>
                {t(license.status)}
              </Badge>
            </div>

            <div className="flex flex-col md:flex-row gap-10 items-center">
              {/* Photo */}
              <div className="relative">
                <div className="w-40 h-48 bg-slate-950/50 backdrop-blur-xl rounded-[1.5rem] border-2 border-white/20 flex items-center justify-center overflow-hidden shadow-2xl relative z-10">
                  <User className="w-20 h-20 text-white/20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                </div>
                {/* Visual Security Element */}
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#D4A017] rounded-xl flex items-center justify-center shadow-lg border-2 border-[#1a3a8f] z-20">
                   <Shield className="w-6 h-6 text-[#1a3a8f]" />
                </div>
              </div>

              {/* License Details */}
              <div className="flex-1 space-y-8 text-center md:text-right">
                <div>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{t('number')}</p>
                  <p className="text-4xl font-black tracking-[0.2em] font-mono">{license.number}</p>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-12">
                  <div className="space-y-1">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">{t('class')}</p>
                    <p className="text-3xl font-black">{license.class}</p>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="space-y-1">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">{t('status')}</p>
                    <p className="text-lg font-black text-[#D4A017]">{t(license.status)}</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-[2rem] shadow-2xl hover:scale-105 transition-transform duration-500 group">
                <QrCode className="w-32 h-32 text-[#1a3a8f] group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* License Body */}
        <CardContent className="p-12 bg-white">
          {/* Holder Information */}
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="space-y-6">
              <h3 className="font-black text-2xl text-neutral-900 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1a3a8f]/10 flex items-center justify-center text-[#1a3a8f]">
                  <User className="w-5 h-5" />
                </div>
                {license.holder.name}
              </h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{t('application.create.fields.nationalId')}</p>
                  <p className="text-base font-black text-neutral-800">{maskNationalId(license.holder.nationalId)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{t('application.create.fields.dateOfBirth')}</p>
                  <p className="text-base font-black text-neutral-800">{license.holder.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{t('application.create.fields.nationality')}</p>
                  <p className="text-base font-black text-neutral-800">{license.holder.nationality}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{t('application.create.fields.gender')}</p>
                  <p className="text-base font-black text-neutral-800">{license.holder.gender}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-5 p-6 bg-neutral-50 rounded-2xl border border-neutral-100 group hover:bg-white hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#1a3a8f] group-hover:bg-[#1a3a8f] group-hover:text-white transition-colors">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">{t('issueDate')}</p>
                  <p className="text-lg font-black text-neutral-800">{license.issueDate}</p>
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-5 p-6 rounded-2xl border transition-all group hover:shadow-xl",
                isExpiringSoon(license.expiryDate) ? 'bg-red-50 border-red-100 hover:bg-white' : 'bg-neutral-50 border-neutral-100 hover:bg-white'
              )}>
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  isExpiringSoon(license.expiryDate) ? 'bg-red-500 text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
                )}>
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">{t('expiryDate')}</p>
                  <p className={cn(
                    "text-lg font-black",
                    isExpiringSoon(license.expiryDate) ? 'text-red-700' : 'text-neutral-800'
                  )}>
                    {license.expiryDate}
                    {isExpiringSoon(license.expiryDate) && (
                      <Badge variant="destructive" className="ms-3 h-5 rounded-lg text-[9px] font-black px-2">تنتهي قريباً</Badge>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Restrictions */}
          <div className="p-6 bg-amber-50/50 border border-amber-200/50 rounded-2xl flex items-center gap-5">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
               <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[9px] font-black text-amber-700/50 uppercase tracking-widest mb-0.5">القيود والملاحظات السيادية</p>
               <p className="text-base font-black text-amber-900">{license.restrictions || "لا توجد أي قيود سجلية مسجلة"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={handleDownloadPdf}
          className="gap-2 bg-primary-500 hover:bg-primary-600"
        >
          <Download className="w-4 h-4" />
          {t('downloadPdf')}
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="gap-2 border-primary-200 text-primary-700 hover:bg-primary-50"
        >
          <Share2 className="w-4 h-4" />
          {t('shareLicense')}
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-neutral-200"
        >
          <Printer className="w-4 h-4" />
          {t('employee.manage.actions.print')}
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
        >
          <AlertTriangle className="w-4 h-4" />
          {t('reportLost')}
        </Button>
      </div>
    </div>
  );
}
