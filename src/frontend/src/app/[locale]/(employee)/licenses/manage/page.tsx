'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileKey2,
  Search,
  Filter,
  Download,
  RefreshCw,
  Pause,
  XCircle,
  Printer,
  Eye,
  MoreHorizontal,
  Calendar,
  Car,
  User,
  QrCode,
  FileText
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { cn } from "@/lib/utils";

interface License {
  id: string;
  number: string;
  holderName: string;
  nationalId: string;
  category: string;
  status: 'active' | 'expired' | 'suspended';
  issueDate: string;
  expiryDate: string;
}

export default function LicenseManagementPage() {
  const t = useTranslations('licenses');
  const { locale } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');

  // Mock data
  const licenses: License[] = [
    {
      id: "lic-001",
      number: "MOJ-2025-48291037",
      holderName: "أحمد عبدالله محمد",
      nationalId: "1023456789",
      category: "B",
      status: "active",
      issueDate: "2025-01-15",
      expiryDate: "2028-01-15"
    },
    {
      id: "lic-002",
      number: "MOJ-2025-11223344",
      holderName: "سعيد علي سعيد",
      nationalId: "1045678901",
      category: "A",
      status: "active",
      issueDate: "2025-02-01",
      expiryDate: "2028-02-01"
    },
    {
      id: "lic-003",
      number: "MOJ-2023-99887766",
      holderName: "خالد إبراهيم",
      nationalId: "1087654321",
      category: "C",
      status: "expired",
      issueDate: "2020-06-15",
      expiryDate: "2023-06-15"
    },
    {
      id: "lic-004",
      number: "MOJ-2024-55667788",
      holderName: "عبدالرحمن محمد",
      nationalId: "1012345678",
      category: "B",
      status: "suspended",
      issueDate: "2024-03-10",
      expiryDate: "2027-03-10"
    }
  ];

  const filteredLicenses = licenses.filter(l => {
    const matchesSearch = l.holderName.includes(searchQuery) ||
      l.number.includes(searchQuery) ||
      l.nationalId.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesClass = classFilter === 'all' || l.category === classFilter;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-primary/20 text-primary border border-primary/30 rounded-lg text-[10px] font-black uppercase tracking-widest">{t('active')}</Badge>;
      case 'expired':
        return <Badge className="bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest">{t('expired')}</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest">{t('suspended')}</Badge>;
      default:
        return null;
    }
  };

  const handleExport = () => {
    console.log('Export licenses');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white font-arabic tracking-tight">{t('employee.manage.title')}</h1>
          <p className="text-neutral-500 mt-1 font-medium">{t('employee.manage.subtitle')}</p>
        </div>
        <Button
          onClick={handleExport}
          variant="outline"
          className="h-12 px-6 gap-2 border-white/10 bg-white/5 text-primary hover:bg-white/10 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
        >
          <Download className="w-4 h-4" />
          {t('employee.manage.export')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-white/5 backdrop-blur-3xl border-white/5 rounded-[2rem]">
          <CardContent className="p-6">
            <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">{t('employee.reports.totalIssued')}</p>
            <p className="text-3xl font-black text-white">{licenses.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-white/5 backdrop-blur-3xl border-white/5 rounded-[2rem]">
          <CardContent className="p-6">
            <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">{t('employee.reports.active')}</p>
            <p className="text-3xl font-black text-primary">
              {licenses.filter(l => l.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-white/5 backdrop-blur-3xl border-white/5 rounded-[2rem]">
          <CardContent className="p-6">
            <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">{t('employee.reports.expired')}</p>
            <p className="text-3xl font-black text-red-500">
              {licenses.filter(l => l.status === 'expired').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-white/5 backdrop-blur-3xl border-white/5 rounded-[2rem]">
          <CardContent className="p-6">
            <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">{t('employee.reports.expiredSoon')}</p>
            <p className="text-3xl font-black text-orange-400">2</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm bg-white/5 border-white/5 rounded-[1.5rem] overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder={t('employee.manage.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-11 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-neutral-600 focus:ring-1 focus:ring-primary/50 font-arabic"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-arabic focus:ring-1 focus:ring-primary/50 outline-none"
            >
              <option value="all" className="bg-neutral-900">{t('employee.manage.filters.status')}</option>
              <option value="active" className="bg-neutral-900">{t('active')}</option>
              <option value="expired" className="bg-neutral-900">{t('expired')}</option>
              <option value="suspended" className="bg-neutral-900">{t('suspended')}</option>
            </select>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-arabic focus:ring-1 focus:ring-primary/50 outline-none"
            >
              <option value="all" className="bg-neutral-900">{t('employee.manage.filters.class')}</option>
              <option value="A" className="bg-neutral-900">A</option>
              <option value="B" className="bg-neutral-900">B</option>
              <option value="C" className="bg-neutral-900">C</option>
              <option value="D" className="bg-neutral-900">D</option>
              <option value="E" className="bg-neutral-900">E</option>
              <option value="F" className="bg-neutral-900">F</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* License Table */}
      <Card className="border-0 shadow-lg bg-white/5 border-white/5 rounded-[2rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/40 border-b border-white/5">
                <tr>
                  <th className="text-start px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">{t('number')}</th>
                  <th className="text-start px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">{t('fields.nationalId')}</th>
                  <th className="text-start px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">{t('holder')}</th>
                  <th className="text-start px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">{t('class')}</th>
                  <th className="text-start px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">{t('status')}</th>
                  <th className="text-start px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">{t('expiryDate')}</th>
                  <th className="text-end px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">{t('employee.manage.actions.view')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLicenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center text-neutral-600 font-bold font-arabic">
                      {t('verification.noHistory')}
                    </td>
                  </tr>
                ) : (
                  filteredLicenses.map((license) => (
                    <tr key={license.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                             <FileKey2 className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-black text-white text-sm font-english">{license.number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-neutral-400 font-medium font-english">{license.nationalId}</td>
                      <td className="px-6 py-5 text-white font-black font-arabic">{license.holderName}</td>
                      <td className="px-6 py-5">
                        <Badge className="px-3 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-black">
                          {license.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">{getStatusBadge(license.status)}</td>
                      <td className="px-6 py-5 text-neutral-400 font-medium font-english">{license.expiryDate}</td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" className="h-9 gap-2 text-primary hover:bg-primary/10 hover:text-primary rounded-lg transition-all">
                            <Eye className="w-4 h-4" />
                            <span className="font-black text-[10px] uppercase tracking-widest">{t('employee.manage.actions.view')}</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                            <Printer className="w-4 h-4" />
                          </Button>
                          {license.status === 'active' && (
                            <div className="flex gap-2">
                               <Button variant="ghost" size="icon" className="h-9 w-9 text-orange-400 hover:bg-orange-400/10 rounded-lg transition-all">
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-9 w-9 text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-all">
                                <Pause className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
