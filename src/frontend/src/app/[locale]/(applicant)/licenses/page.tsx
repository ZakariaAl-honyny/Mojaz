'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Calendar,
  QrCode,
  AlertTriangle,
  Download,
  Share2,
  ExternalLink,
  Award,
  Clock,
  Shield
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { cn } from "@/lib/utils";

interface License {
  id: string;
  number: string;
  class: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'suspended';
  center: string;
}

export default function ApplicantLicensesPage() {
  const t = useTranslations('licenses');
  const { locale } = useParams();

  // Mock data for MVP
  const licenses: License[] = [
    {
      id: "lic-001",
      number: "MOJ-2025-48291037",
      class: "B",
      issueDate: "2025-01-15",
      expiryDate: "2028-01-15",
      status: "active",
      center: "الرياض - العليا"
    },
    {
      id: "lic-002",
      number: "MOJ-2023-12345678",
      class: "A",
      issueDate: "2023-03-20",
      expiryDate: "2026-03-20",
      status: "expired",
      center: "الرياض - العليا"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-King blue-100 text-King blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return t('active');
      case 'expired':
        return t('expired');
      case 'suspended':
        return t('suspended');
      default:
        return status;
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
      {/* Header */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary">
            <CreditCard className="w-3.5 h-3.5" />
            {t('title')}
          </div>
          <h1 className="text-5xl font-black text-white tracking-widest leading-none font-arabic uppercase">
            {t('title')}
          </h1>
          <p className="text-xl text-neutral-400 max-w-xl font-bold font-arabic leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Licenses Grid */}
      {licenses.length === 0 ? (
        <Card className="border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] bg-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden">
          <CardContent className="py-24 text-center">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
              <Award className="w-12 h-12 text-neutral-600" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tight font-arabic">
              {t('myLicenses')}
            </h3>
            <p className="text-xl text-neutral-500 font-bold max-w-md mx-auto font-arabic">
              {t('verification.noHistory')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {licenses.map((license) => (
            <Card
              key={license.id}
              className="border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all duration-500"
            >
              {/* Card Header with Status */}
              <div className="bg-gradient-to-br from-primary/20 to-primary/40 p-10 border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[60px] -mr-20 -mt-20 group-hover:bg-primary/30 transition-colors" />
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/20 border border-primary/30 text-[10px] font-black text-primary-400 uppercase tracking-widest">
                      {t('class')} {license.class}
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-widest drop-shadow-2xl font-english">{license.number}</h3>
                  </div>
                  <Badge className={cn(
                    "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg",
                    license.status === 'active' ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-red-500 text-white shadow-red-500/20"
                  )}>
                    {getStatusLabel(license.status)}
                  </Badge>
                </div>
              </div>

              {/* Card Content */}
              <CardContent className="p-10 space-y-10 relative z-10">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                      <Calendar className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">{t('issueDate')}</p>
                      <p className="text-lg font-black text-white leading-none font-english">{license.issueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-16 h-16 rounded-[1.5rem] flex items-center justify-center border group-hover:scale-110 transition-transform",
                      isExpiringSoon(license.expiryDate) ? 'bg-orange-500/10 border-orange-500/20' : 'bg-white/5 border-white/10'
                    )}>
                      <Clock className={cn("w-8 h-8", isExpiringSoon(license.expiryDate) ? 'text-orange-400' : 'text-primary')} />
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">{t('expiryDate')}</p>
                      <p className={cn("text-lg font-black leading-none font-english", isExpiringSoon(license.expiryDate) ? 'text-orange-400' : 'text-white')}>
                        {license.expiryDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Center */}
                <div className="flex items-center gap-4 py-6 border-y border-white/5">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <Shield className="w-4 h-4 text-neutral-500" />
                  </div>
                  <span className="text-sm font-bold text-neutral-400 font-arabic">{license.center}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Link href={`/${locale}/licenses/${license.id}`} className="flex-1">
                    <Button className="w-full h-16 gap-4 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-black text-base uppercase tracking-widest group/btn">
                      <ExternalLink className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform rtl:group-hover/btn:-translate-x-1" />
                      {t('digitalLicense')}
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" className="h-16 w-16 rounded-2xl border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition-all">
                    <QrCode className="w-6 h-6" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-16 w-16 rounded-2xl border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition-all">
                    <Share2 className="w-6 h-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
