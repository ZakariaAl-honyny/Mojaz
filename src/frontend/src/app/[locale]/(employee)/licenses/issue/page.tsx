'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileKey2,
  CheckCircle2,
  Clock,
  Printer,
  QrCode,
  Search,
  User,
  Calendar,
  Car,
  ArrowRight,
  Loader2,
  Plus
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface PendingLicense {
  id: string;
  applicationNumber: string;
  applicantName: string;
  category: string;
  center: string;
  status: 'pending' | 'ready';
  requestDate: string;
}

export default function LicenseIssuancePage() {
  const t = useTranslations('license');
  const { locale } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'pending' | 'ready'>('ready');
  const [issuingId, setIssuingId] = useState<string | null>(null);

  // Mock data
  const pendingLicenses: PendingLicense[] = [
    {
      id: "lic-001",
      applicationNumber: "MOJ-2025-48291037",
      applicantName: "أحمد عبدالله محمد",
      category: "B",
      center: "الرياض - العليا",
      status: "ready",
      requestDate: "2025-01-15"
    },
    {
      id: "lic-002",
      applicationNumber: "MOJ-2025-11223344",
      applicantName: "سعيد علي سعيد",
      category: "A",
      center: "الرياض - الشمال",
      status: "pending",
      requestDate: "2025-01-14"
    },
    {
      id: "lic-003",
      applicationNumber: "MOJ-2025-99887766",
      applicantName: "خالد إبراهيم",
      category: "C",
      center: "جدة - التحلية",
      status: "ready",
      requestDate: "2025-01-13"
    }
  ];

  const filteredLicenses = pendingLicenses.filter(l => {
    const matchesSearch = l.applicantName.includes(searchQuery) || 
                         l.applicationNumber.includes(searchQuery);
    const matchesStatus = l.status === selectedTab;
    return matchesSearch && matchesStatus;
  });

  const handleIssue = async (id: string) => {
    setIssuingId(id);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIssuingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800">{t('employee.issue.ready')}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">{t('employee.issue.pending')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-950">{t('employee.issue.title')}</h1>
          <p className="text-neutral-500 mt-1">{t('employee.issue.subtitle')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-green-50/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">{t('employee.issue.ready')}</p>
              <p className="text-2xl font-bold text-neutral-900">
                {pendingLicenses.filter(l => l.status === 'ready').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-yellow-50/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">{t('employee.issue.pending')}</p>
              <p className="text-2xl font-bold text-neutral-900">
                {pendingLicenses.filter(l => l.status === 'pending').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-blue-50/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileKey2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">{t('employee.reports.totalIssued')}</p>
              <p className="text-2xl font-bold text-neutral-900">156</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <Button
                variant={selectedTab === 'ready' ? 'default' : 'outline'}
                onClick={() => setSelectedTab('ready')}
                className={selectedTab === 'ready' ? 'bg-primary-500' : ''}
              >
                {t('employee.issue.ready')}
              </Button>
              <Button
                variant={selectedTab === 'pending' ? 'default' : 'outline'}
                onClick={() => setSelectedTab('pending')}
                className={selectedTab === 'pending' ? 'bg-primary-500' : ''}
              >
                {t('employee.issue.pending')}
              </Button>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input 
                placeholder={t('employee.manage.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-10 border-neutral-200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* License Queue List */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-100">
            {filteredLicenses.length === 0 ? (
              <div className="py-12 text-center">
                <FileKey2 className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500">{t('applications.employee.empty')}</p>
              </div>
            ) : (
              filteredLicenses.map((license) => (
                <div 
                  key={license.id} 
                  className="p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                        <Car className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-neutral-900">{license.applicantName}</h3>
                          {getStatusBadge(license.status)}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500">
                          <span className="flex items-center gap-1">
                            <FileKey2 className="w-3 h-3" />
                            {license.applicationNumber}
                          </span>
                          <span className="flex items-center gap-1">
                            <Car className="w-3 h-3" />
                            {t('class')} {license.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {license.requestDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-1 border-primary-200 text-primary-700"
                      >
                        <Printer className="w-3 h-3" />
                        {t('employee.issue.print')}
                      </Button>
                      {license.status === 'ready' && (
                        <Button 
                          size="sm"
                          className="gap-1 bg-primary-500 hover:bg-primary-600"
                          onClick={() => handleIssue(license.id)}
                          disabled={issuingId === license.id}
                        >
                          {issuingId === license.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          {t('employee.issue.issueDigital')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
