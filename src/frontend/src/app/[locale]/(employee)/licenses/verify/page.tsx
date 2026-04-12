'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  QrCode,
  Search,
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileKey2,
  User,
  Calendar,
  Clock,
  History,
  Scan
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface VerificationResult {
  licenseNumber: string;
  holderName: string;
  nationalId: string;
  category: string;
  status: 'valid' | 'invalid';
  issueDate: string;
  expiryDate: string;
  verifiedAt: string;
}

interface VerificationHistory {
  id: string;
  licenseNumber: string;
  result: 'valid' | 'invalid';
  timestamp: string;
  verifier: string;
}

export default function LicenseVerificationPage() {
  const t = useTranslations('license');
  const { locale } = useParams();
  const [searchType, setSearchType] = useState<'number' | 'nationalId'>('number');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<VerificationResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [scanning, setScanning] = useState(false);

  // Mock verification history
  const verificationHistory: VerificationHistory[] = [
    {
      id: "vh-001",
      licenseNumber: "MOJ-2025-48291037",
      result: "valid",
      timestamp: "2025-01-15 14:30",
      verifier: "أمنستي الوحدة"
    },
    {
      id: "vh-002",
      licenseNumber: "MOJ-2023-12345678",
      result: "invalid",
      timestamp: "2025-01-14 09:15",
      verifier: "أمنستي الوحدة"
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response - randomly valid/invalid for demo
    setSearchResult({
      licenseNumber: searchQuery,
      holderName: "أحمد عبدالله محمد",
      nationalId: "1023456789",
      category: "B",
      status: searchQuery.includes('invalid') ? 'invalid' : 'valid',
      issueDate: "2025-01-15",
      expiryDate: "2028-01-15",
      verifiedAt: new Date().toISOString()
    });
    setIsSearching(false);
  };

  const handleScanQr = () => {
    setScanning(true);
    // Would trigger camera for QR scanning
    setTimeout(() => {
      setScanning(false);
      setSearchQuery('MOJ-2025-48291037');
      handleSearch();
    }, 2000);
  };

  const getResultIcon = (status: 'valid' | 'invalid') => {
    return status === 'valid' ? (
      <CheckCircle2 className="w-16 h-16 text-green-500" />
    ) : (
      <XCircle className="w-16 h-16 text-red-500" />
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary-950">{t('verification.title')}</h1>
        <p className="text-neutral-500 mt-1">{t('employee.issue.subtitle')}</p>
      </div>

      {/* Search Card */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          {/* Search Type Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={searchType === 'number' ? 'default' : 'outline'}
              onClick={() => setSearchType('number')}
              className={searchType === 'number' ? 'bg-primary-500' : ''}
            >
              {t('verification.searchByNumber')}
            </Button>
            <Button
              variant={searchType === 'nationalId' ? 'default' : 'outline'}
              onClick={() => setSearchType('nationalId')}
              className={searchType === 'nationalId' ? 'bg-primary-500' : ''}
            >
              {t('verification.searchByNationalId')}
            </Button>
          </div>

          {/* Search Input */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input 
                placeholder={
                  searchType === 'number' 
                    ? t('verification.searchByNumber')
                    : t('verification.searchByNationalId')
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="ps-12 h-12 text-lg border-neutral-200"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="h-12 px-8 bg-primary-500 hover:bg-primary-600"
            >
              {isSearching ? (
                <span className="animate-pulse">...</span>
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>
            <Button 
              onClick={handleScanQr}
              variant="outline"
              className="h-12 px-6 border-primary-200 text-primary-700"
            >
              <Camera className="w-5 h-5" />
            </Button>
          </div>

          {/* QR Scanner Modal (simplified) */}
          {scanning && (
            <div className="mt-4 p-8 bg-neutral-900 rounded-xl text-center">
              <Camera className="w-12 h-12 text-white mx-auto mb-4 animate-pulse" />
              <p className="text-white">{t('verification.scanQr')}...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Result */}
      {searchResult && (
        <Card className={`border-0 shadow-lg overflow-hidden ${
          searchResult.status === 'valid' 
            ? 'bg-gradient-to-br from-green-50 to-white' 
            : 'bg-gradient-to-br from-red-50 to-white'
        }`}>
          <div className={`p-4 text-white text-center ${
            searchResult.status === 'valid' 
              ? 'bg-green-500' 
              : 'bg-red-500'
          }`}>
            {getResultIcon(searchResult.status)}
            <h2 className="text-2xl font-bold mt-2">
              {searchResult.status === 'valid' ? t('verification.valid') : t('verification.invalid')}
            </h2>
          </div>
          <CardContent className="p-6">
            {searchResult.status === 'valid' ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FileKey2 className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-xs text-neutral-500">{t('number')}</p>
                      <p className="font-bold text-neutral-900">{searchResult.licenseNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-xs text-neutral-500">الحامل</p>
                      <p className="font-semibold text-neutral-900">{searchResult.holderName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileKey2 className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-xs text-neutral-500">{t('application.create.fields.nationalId')}</p>
                      <p className="font-semibold text-neutral-900">{searchResult.nationalId}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-primary-200 text-primary-700">
                      {t('class')} {searchResult.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-xs text-neutral-500">{t('issueDate')}</p>
                      <p className="font-semibold text-neutral-900">{searchResult.issueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-xs text-neutral-500">{t('expiryDate')}</p>
                      <p className="font-semibold text-neutral-900">{searchResult.expiryDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-neutral-800 mb-2">
                  الرخصة غير صالحة
                </h3>
                <p className="text-neutral-600">
                  الرخصة رقم {searchResult.licenseNumber} غير صالحة أو منتهية الصلاحية
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Verification History */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="w-5 h-5 text-neutral-500" />
            {t('verification.history')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {verificationHistory.length === 0 ? (
            <div className="py-8 text-center text-neutral-500">
              {t('verification.noHistory')}
            </div>
          ) : (
            <div className="space-y-3">
              {verificationHistory.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {item.result === 'valid' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-neutral-900">{item.licenseNumber}</p>
                      <p className="text-sm text-neutral-500">{item.timestamp}</p>
                    </div>
                  </div>
                  <Badge className={item.result === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {item.result === 'valid' ? t('verification.valid') : t('verification.invalid')}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
