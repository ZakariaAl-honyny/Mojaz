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
import { cn } from "@/lib/utils";

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
  const t = useTranslations('licenses');
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
        return <Badge className="bg-King blue-100 text-King blue-800">{t('employee.issue.ready')}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">{t('employee.issue.pending')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-arabic tracking-tight">{t('employee.issue.title')}</h1>
          <p className="text-neutral-500 mt-1 font-medium">{t('employee.issue.subtitle')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-white/5 backdrop-blur-3xl border-white/5 rounded-[2rem] overflow-hidden group">
          <CardContent className="p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">{t('employee.issue.ready')}</p>
              <p className="text-3xl font-black text-white">
                {pendingLicenses.filter(l => l.status === 'ready').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/5 backdrop-blur-3xl border-white/5 rounded-[2rem] overflow-hidden group">
          <CardContent className="p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center border border-yellow-500/20 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">{t('employee.issue.pending')}</p>
              <p className="text-3xl font-black text-white">
                {pendingLicenses.filter(l => l.status === 'pending').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/5 backdrop-blur-3xl border-white/5 rounded-[2rem] overflow-hidden group">
          <CardContent className="p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
              <FileKey2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">{t('employee.reports.totalIssued')}</p>
              <p className="text-3xl font-black text-white">156</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Search */}
      <Card className="border-0 shadow-sm bg-white/5 border-white/5 rounded-[1.5rem] overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex gap-2 p-1 bg-black/40 rounded-xl">
              <Button
                variant="ghost"
                onClick={() => setSelectedTab('ready')}
                className={cn(
                  "rounded-lg px-6 h-10 font-black text-[10px] uppercase tracking-widest transition-all",
                  selectedTab === 'ready' ? "bg-primary text-white shadow-lg" : "text-neutral-500 hover:text-white"
                )}
              >
                {t('employee.issue.ready')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSelectedTab('pending')}
                className={cn(
                  "rounded-lg px-6 h-10 font-black text-[10px] uppercase tracking-widest transition-all",
                  selectedTab === 'pending' ? "bg-primary text-white shadow-lg" : "text-neutral-500 hover:text-white"
                )}
              >
                {t('employee.issue.pending')}
              </Button>
            </div>
            <div className="relative w-full md:w-80 group">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder={t('employee.manage.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-11 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-neutral-600 focus:ring-1 focus:ring-primary/50 font-arabic"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* License Queue List */}
      <Card className="border-0 shadow-lg bg-white/5 border-white/5 rounded-[2rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-white/5">
            {filteredLicenses.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <FileKey2 className="w-16 h-16 text-neutral-800 mx-auto opacity-20" />
                <p className="text-neutral-500 font-bold font-arabic">{t('employee.manage.search')}</p>
              </div>
            ) : (
              filteredLicenses.map((license) => (
                <div
                  key={license.id}
                  className="p-6 hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="w-7 h-7 text-primary" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-black text-white font-arabic tracking-tight">{license.applicantName}</h3>
                          <Badge className={cn(
                            "px-3 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                            license.status === 'ready' ? "bg-primary/20 text-primary border border-primary/30" : "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                          )}>
                            {license.status === 'ready' ? t('employee.issue.ready') : t('employee.issue.pending')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-5 text-[11px] text-neutral-500 font-bold">
                          <span className="flex items-center gap-1.5 font-english">
                            <FileKey2 className="w-3.5 h-3.5 text-primary/60" />
                            {license.applicationNumber}
                          </span>
                          <span className="flex items-center gap-1.5 font-arabic">
                            <Car className="w-3.5 h-3.5 text-primary/60" />
                            {t('class')} {license.category}
                          </span>
                          <span className="flex items-center gap-1.5 font-english">
                            <Calendar className="w-3.5 h-3.5 text-primary/60" />
                            {license.requestDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="h-11 px-5 gap-2 border-white/10 bg-white/5 text-neutral-400 hover:text-white rounded-xl transition-all"
                      >
                        <Printer className="w-4 h-4" />
                        <span className="font-black text-[10px] uppercase tracking-widest">{t('employee.issue.print')}</span>
                      </Button>
                      {license.status === 'ready' && (
                        <Button
                          className="h-11 px-6 gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                          onClick={() => handleIssue(license.id)}
                          disabled={issuingId === license.id}
                        >
                          {issuingId === license.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <QrCode className="w-4 h-4" />
                          )}
                          <span className="font-black text-[10px] uppercase tracking-widest">{t('employee.issue.issueDigital')}</span>
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
