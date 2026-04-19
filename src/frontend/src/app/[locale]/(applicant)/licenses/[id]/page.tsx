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
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function DigitalLicensePage() {
  const t = useTranslations('licenses');
  const { locale, id } = useParams();

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
        return 'bg-King blue-100 text-King blue-800 border-King blue-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
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
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Back Link */}
      <Link
        href={`/${locale}/licenses`}
        className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors group"
      >
        <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-black font-arabic uppercase tracking-widest">{t('myLicenses')}</span>
      </Link>

      {/* Digital License Card - Official Look */}
      <Card className="overflow-hidden border-0 shadow-2xl rounded-[2.5rem] gov-glass-panel border-white/5">
        {/* License Header */}
        <div className="bg-gradient-to-br from-primary via-primary-700 to-primary-800 p-10 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Shield className="w-12 h-12 text-white/90" />
                <div>
                  <h2 className="text-2xl font-black font-arabic tracking-tight">{t('digitalLicensePlatform')}</h2>
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Driving License Issuance System</p>
                </div>
              </div>
              <Badge className={cn(
                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl",
                license.status === 'active' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
              )}>
                {t(license.status)}
              </Badge>
            </div>

            <div className="flex flex-col md:flex-row gap-10 items-start">
              {/* Photo */}
              <div className="w-32 h-40 bg-white/10 rounded-2xl border-2 border-white/20 flex items-center justify-center overflow-hidden backdrop-blur-md">
                <User className="w-16 h-16 text-white/30" />
              </div>

              {/* License Details */}
              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-white/50 text-[10px] uppercase font-black tracking-widest mb-1">{t('number')}</p>
                  <p className="text-3xl font-black tracking-[0.2em] font-english">{license.number}</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">{t('class')}</p>
                    <p className="text-2xl font-black font-english">{license.class}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">{t('status')}</p>
                    <p className="text-sm font-black font-arabic uppercase tracking-wider">{t(license.status)}</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white p-3 rounded-2xl shadow-2xl">
                <QrCode className="w-24 h-24 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* License Body */}
        <CardContent className="p-10 bg-black/20 backdrop-blur-3xl">
          {/* Holder Information */}
          <div className="grid md:grid-cols-2 gap-10 mb-10">
            <div className="space-y-6">
              <h3 className="font-black text-xl text-white font-arabic flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <User className="w-4 h-4 text-primary" />
                </div>
                {license.holder.name}
              </h3>
              <div className="grid grid-cols-2 gap-6 text-[11px]">
                <div>
                  <p className="text-neutral-500 font-black uppercase tracking-widest mb-1">{t('fields.nationalId')}</p>
                  <p className="font-black text-white text-base font-english">{license.holder.nationalId}</p>
                </div>
                <div>
                  <p className="text-neutral-500 font-black uppercase tracking-widest mb-1">{t('fields.dateOfBirth')}</p>
                  <p className="font-black text-white text-base font-english">{license.holder.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-neutral-500 font-black uppercase tracking-widest mb-1">{t('fields.nationality')}</p>
                  <p className="font-black text-white text-base font-arabic">{license.holder.nationality}</p>
                </div>
                <div>
                  <p className="text-neutral-500 font-black uppercase tracking-widest mb-1">{t('fields.gender')}</p>
                  <p className="font-black text-white text-base font-arabic">{license.holder.gender}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 group hover:border-primary/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                   <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-1">{t('issueDate')}</p>
                  <p className="font-black text-white text-sm font-english">{license.issueDate}</p>
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-4 p-5 rounded-2xl border transition-all",
                isExpiringSoon(license.expiryDate) ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/10 group hover:border-primary/30'
              )}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isExpiringSoon(license.expiryDate) ? 'bg-orange-500/20' : 'bg-primary/10')}>
                   <Clock className={cn("w-5 h-5", isExpiringSoon(license.expiryDate) ? 'text-orange-400' : 'text-primary')} />
                </div>
                <div>
                  <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-1">{t('expiryDate')}</p>
                  <p className={cn("font-black text-sm font-english", isExpiringSoon(license.expiryDate) ? 'text-orange-400' : 'text-white')}>
                    {license.expiryDate}
                    {isExpiringSoon(license.expiryDate) && (
                      <AlertTriangle className="w-3 h-3 inline-block ms-2 text-orange-500 animate-pulse" />
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 group hover:border-primary/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                   <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-1">{t('center')}</p>
                  <p className="font-black text-white text-sm font-arabic">{license.center}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Restrictions */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
              </div>
            <span className="font-bold text-sm font-arabic">{t('restrictions')}: <span className="text-neutral-400 px-2 font-medium">{license.restrictions || t('none')}</span></span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center py-4">
        <Button
          onClick={handleDownloadPdf}
          className="h-14 px-8 gap-3 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] font-black text-[10px] uppercase tracking-widest"
        >
          <Download className="w-4 h-4" />
          {t('downloadPdf')}
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="h-14 px-8 gap-3 border-white/10 bg-white/5 text-primary hover:bg-white/10 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
        >
          <Share2 className="w-4 h-4" />
          {t('shareLicense')}
        </Button>
        <Button
          variant="outline"
          className="h-14 px-8 gap-3 border-white/10 bg-white/5 text-neutral-400 hover:text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
        >
          <Printer className="w-4 h-4" />
          {t('employee.manage.actions.print')}
        </Button>
        <Button
          variant="outline"
          className="h-14 px-8 gap-3 border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
        >
          <AlertTriangle className="w-4 h-4" />
          {t('reportLost')}
        </Button>
      </div>
    </div>
  );
}
