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
  const t = useTranslations('license');
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
        return 'bg-green-100 text-green-800 border-green-200';
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
        className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-500 transition-colors"
      >
        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        <span className="text-sm font-medium">{t('myLicenses')}</span>
      </Link>

      {/* Digital License Card - Official Look */}
      <Card className="overflow-hidden border-0 shadow-2xl">
        {/* License Header */}
        <div className="bg-gradient-to-br from-primary-800 via-primary-600 to-primary-700 p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Shield className="w-10 h-10" />
                <div>
                  <h2 className="text-xl font-bold">مُجاز</h2>
                  <p className="text-white/80 text-sm">Mojaz Platform</p>
                </div>
              </div>
              <Badge className={`${getStatusColor(license.status)} border`}>
                {t(license.status)}
              </Badge>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Photo */}
              <div className="w-32 h-40 bg-white/10 rounded-lg border-2 border-white/30 flex items-center justify-center overflow-hidden">
                <User className="w-16 h-16 text-white/50" />
              </div>

              {/* License Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wider">{t('number')}</p>
                  <p className="text-2xl font-bold tracking-widest">{license.number}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/70 text-xs">{t('class')}</p>
                    <p className="text-xl font-bold">{license.class}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">{t('status')}</p>
                    <p className="text-sm font-semibold">{t(license.status)}</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white p-2 rounded-lg">
                <QrCode className="w-24 h-24 text-primary-700" />
              </div>
            </div>
          </div>
        </div>

        {/* License Body */}
        <CardContent className="p-8 bg-neutral-50">
          {/* Holder Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-neutral-800 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-500" />
                {license.holder.name}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-neutral-500">{t('application.create.fields.nationalId')}</p>
                  <p className="font-semibold text-neutral-800">{license.holder.nationalId}</p>
                </div>
                <div>
                  <p className="text-neutral-500">{t('application.create.fields.dateOfBirth')}</p>
                  <p className="font-semibold text-neutral-800">{license.holder.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-neutral-500">{t('application.create.fields.nationality')}</p>
                  <p className="font-semibold text-neutral-800">{license.holder.nationality}</p>
                </div>
                <div>
                  <p className="text-neutral-500">{t('application.create.fields.gender')}</p>
                  <p className="font-semibold text-neutral-800">{license.holder.gender}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-100">
                <Calendar className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-neutral-500 text-xs">{t('issueDate')}</p>
                  <p className="font-semibold text-neutral-800">{license.issueDate}</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${isExpiringSoon(license.expiryDate) ? 'bg-orange-50 border-orange-200' : 'bg-white border-neutral-100'}`}>
                <Clock className={`w-5 h-5 ${isExpiringSoon(license.expiryDate) ? 'text-orange-600' : 'text-primary-500'}`} />
                <div>
                  <p className="text-neutral-500 text-xs">{t('expiryDate')}</p>
                  <p className={`font-semibold ${isExpiringSoon(license.expiryDate) ? 'text-orange-700' : 'text-neutral-800'}`}>
                    {license.expiryDate}
                    {isExpiringSoon(license.expiryDate) && (
                      <AlertTriangle className="w-3 h-3 inline-block ms-1 text-orange-500" />
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-100">
                <MapPin className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-neutral-500 text-xs">مركز الإصدار</p>
                  <p className="font-semibold text-neutral-800">{license.center}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Restrictions */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium text-sm">القيود: {license.restrictions || "لا توجد"}</span>
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
