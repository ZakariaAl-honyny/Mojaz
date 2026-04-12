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
  const t = useTranslations('license');
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
        return <Badge className="bg-green-100 text-green-800">{t('active')}</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">{t('expired')}</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800">{t('suspended')}</Badge>;
      default:
        return null;
    }
  };

  const handleExport = () => {
    console.log('Export licenses');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-950">{t('employee.manage.title')}</h1>
          <p className="text-neutral-500 mt-1">{t('employee.manage.subtitle')}</p>
        </div>
        <Button 
          onClick={handleExport}
          variant="outline" 
          className="gap-2 border-primary-200 text-primary-700"
        >
          <Download className="w-4 h-4" />
          {t('employee.manage.export')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-neutral-500">{t('employee.reports.totalIssued')}</p>
            <p className="text-2xl font-bold text-neutral-900">{licenses.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-neutral-500">{t('employee.reports.active')}</p>
            <p className="text-2xl font-bold text-green-600">
              {licenses.filter(l => l.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-neutral-500">{t('employee.reports.expired')}</p>
            <p className="text-2xl font-bold text-red-600">
              {licenses.filter(l => l.status === 'expired').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-neutral-500">{t('employee.reports.expiredSoon')}</p>
            <p className="text-2xl font-bold text-orange-600">2</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input 
                placeholder={t('employee.manage.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-10 border-neutral-200"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white"
            >
              <option value="all">{t('employee.manage.filters.status')}</option>
              <option value="active">{t('active')}</option>
              <option value="expired">{t('expired')}</option>
              <option value="suspended">{t('suspended')}</option>
            </select>
            <select 
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white"
            >
              <option value="all">{t('employee.manage.filters.class')}</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* License Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('number')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('application.create.fields.nationalId')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">الحامل</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('class')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('status')}</th>
                  <th className="text-start px-4 py-3 text-sm font-medium text-neutral-500">{t('expiryDate')}</th>
                  <th className="text-end px-4 py-3 text-sm font-medium text-neutral-500">{t('applications.filters.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredLicenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-neutral-500">
                      {t('applications.employee.empty')}
                    </td>
                  </tr>
                ) : (
                  filteredLicenses.map((license) => (
                    <tr key={license.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileKey2 className="w-4 h-4 text-primary-500" />
                          <span className="font-medium text-neutral-900">{license.number}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-600">{license.nationalId}</td>
                      <td className="px-4 py-3 text-neutral-900">{license.holderName}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="border-primary-200 text-primary-700">
                          {license.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(license.status)}</td>
                      <td className="px-4 py-3 text-neutral-600">{license.expiryDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="w-3 h-3" />
                            {t('employee.manage.actions.view')}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Printer className="w-3 h-3" />
                          </Button>
                          {license.status === 'active' && (
                            <>
                              <Button variant="ghost" size="sm" className="gap-1 text-orange-600">
                                <RefreshCw className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-1 text-yellow-600">
                                <Pause className="w-3 h-3" />
                              </Button>
                            </>
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
