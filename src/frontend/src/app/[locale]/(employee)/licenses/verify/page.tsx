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
  const t = useTranslations('licenses');
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
      <CheckCircle2 className="w-16 h-16 text-King blue-500" />
    ) : (
      <XCircle className="w-16 h-16 text-red-500" />
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-primary font-arabic tracking-tight">{t('verification.title')}</h1>
        <p className="text-neutral-500 mt-1 font-medium">{t('verification.subtitle')}</p>
      </div>

      {/* Search Card */}
      <Card className="border-0 shadow-lg gov-glass-panel">
        <CardContent className="p-6">
          {/* Search Type Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={searchType === 'number' ? 'default' : 'outline'}
              onClick={() => setSearchType('number')}
              className={cn("rounded-xl h-11", searchType === 'number' ? 'bg-primary text-white shadow-lg' : 'border-white/10 text-neutral-400')}
            >
              {t('verification.searchByNumber')}
            </Button>
            <Button
              variant={searchType === 'nationalId' ? 'default' : 'outline'}
              onClick={() => setSearchType('nationalId')}
              className={cn("rounded-xl h-11", searchType === 'nationalId' ? 'bg-primary text-white shadow-lg' : 'border-white/10 text-neutral-400')}
            >
              {t('verification.searchByNationalId')}
            </Button>
          </div>

          {/* Search Input */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                placeholder={
                  searchType === 'number'
                    ? t('verification.searchByNumber')
                    : t('verification.searchByNationalId')
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="ps-12 h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-primary/50 transition-all font-arabic"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="h-14 w-14 bg-primary hover:bg-primary/90 rounded-2xl shadow-xl shadow-primary/20 transition-all"
            >
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>
            <Button
              onClick={handleScanQr}
              variant="outline"
              className="h-14 w-14 border-white/10 bg-white/5 text-primary rounded-2xl hover:bg-white/10 transition-all"
            >
              <Camera className="w-5 h-5" />
            </Button>
          </div>

          {/* QR Scanner */}
          {scanning && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 p-12 bg-black/40 border border-white/10 rounded-3xl text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-primary/5 animate-pulse" />
              <Scan className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce relative z-10" />
              <p className="text-white font-black uppercase tracking-widest text-xs relative z-10">{t('verification.scanQr')}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Search Result */}
      {searchResult && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className={cn(
            "border-0 shadow-2xl overflow-hidden rounded-[2rem]",
            searchResult.status === 'valid' ? 'bg-gradient-to-br from-primary/10 via-background to-accent/5' : 'bg-gradient-to-br from-red-500/10 via-background to-accent/5'
          )}>
            <div className={cn(
              "p-8 text-white text-center flex flex-col items-center gap-4",
              searchResult.status === 'valid' ? 'bg-primary' : 'bg-red-600'
            )}>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                {searchResult.status === 'valid' ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
              </div>
              <h2 className="text-3xl font-black font-arabic tracking-tight">
                {searchResult.status === 'valid' ? t('verification.valid') : t('verification.invalid')}
              </h2>
            </div>
            <CardContent className="p-10">
              {searchResult.status === 'valid' ? (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                        <FileKey2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">{t('number')}</p>
                        <p className="font-black text-white text-lg font-english">{searchResult.licenseNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">{t('holder')}</p>
                        <p className="font-black text-white text-lg font-arabic">{searchResult.holderName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">{t('fields.nationalId')}</p>
                        <p className="font-black text-white text-lg font-english">{searchResult.nationalId}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <Badge className="px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-black">
                        {t('class')} {searchResult.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">{t('issueDate')}</p>
                        <p className="font-black text-white text-lg font-english">{searchResult.issueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">{t('expiryDate')}</p>
                        <p className="font-black text-white text-lg font-english">{searchResult.expiryDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 space-y-4">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border-4 border-red-500/20 mx-auto">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white font-arabic">
                    {t('verification.invalid')}
                  </h3>
                  <p className="text-neutral-400 font-medium max-w-sm mx-auto leading-relaxed">
                    {t('verification.invalidDesc', { number: searchResult.licenseNumber })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Verification History */}
      <Card className="border-0 shadow-sm bg-white/5 backdrop-blur-3xl rounded-[2rem] overflow-hidden border-white/5">
        <CardHeader className="p-8 pb-3 flex flex-row items-center justify-between border-b border-white/5">
          <CardTitle className="text-lg font-black text-white font-arabic flex items-center gap-3">
            <History className="w-5 h-5 text-primary" />
            {t('verification.history')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {verificationHistory.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 font-bold font-arabic">
              {t('verification.noHistory')}
            </div>
          ) : (
            <div className="space-y-4">
              {verificationHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-[1.5rem] group hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      item.result === 'valid' ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'
                    )}>
                      {item.result === 'valid' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-black text-white text-base font-english">{item.licenseNumber}</p>
                      <p className="text-sm text-neutral-500 font-medium">{item.timestamp}</p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                    item.result === 'valid' ? 'bg-primary text-white' : 'bg-red-600 text-white'
                  )}>
                    {item.result === 'valid' ? t('valid') : t('invalid')}
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
