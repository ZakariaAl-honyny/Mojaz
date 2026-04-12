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
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

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
  const t = useTranslations('license');
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
        return 'bg-green-100 text-green-800';
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
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-950">{t('title')}</h1>
          <p className="text-neutral-500 mt-1">{t('subtitle')}</p>
        </div>
      </div>

      {/* Licenses Grid */}
      {licenses.length === 0 ? (
        <Card className="border-dashed border-2 border-neutral-200">
          <CardContent className="py-16 text-center">
            <Award className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">
              {t('myLicenses')}
            </h3>
            <p className="text-neutral-500 mb-6">{t('subtitle')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {licenses.map((license) => (
            <Card 
              key={license.id} 
              className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Card Header with Status */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">{t('class')} {license.class}</p>
                    <h3 className="text-2xl font-bold mt-1 tracking-wider">{license.number}</h3>
                  </div>
                  <Badge className={getStatusColor(license.status)}>
                    {getStatusLabel(license.status)}
                  </Badge>
                </div>
              </div>

              {/* Card Content */}
              <CardContent className="p-6 space-y-4">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">{t('issueDate')}</p>
                      <p className="text-sm font-semibold text-neutral-900">{license.issueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isExpiringSoon(license.expiryDate) ? 'bg-orange-50' : 'bg-purple-50'}`}>
                      <Clock className={`w-5 h-5 ${isExpiringSoon(license.expiryDate) ? 'text-orange-600' : 'text-purple-600'}`} />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">{t('expiryDate')}</p>
                      <p className={`text-sm font-semibold ${isExpiringSoon(license.expiryDate) ? 'text-orange-600' : 'text-neutral-900'}`}>
                        {license.expiryDate}
                        {isExpiringSoon(license.expiryDate) && (
                          <AlertTriangle className="w-3 h-3 inline-block ms-1 text-orange-500" />
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Center */}
                <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
                  <Shield className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-neutral-600">{license.center}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/${locale}/licenses/${license.id}`} className="flex-1">
                    <Button className="w-full gap-2 bg-primary-500 hover:bg-primary-600">
                      <ExternalLink className="w-4 h-4" />
                      {t('digitalLicense')}
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" className="border-neutral-200">
                    <QrCode className="w-4 h-4 text-neutral-600" />
                  </Button>
                  <Button variant="outline" size="icon" className="border-neutral-200">
                    <Share2 className="w-4 h-4 text-neutral-600" />
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
