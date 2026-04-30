"use client";

import { LicenseStatus } from "@/lib/enums";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw, Download, Car } from "lucide-react";
import { useTranslations } from "@/lib/static-translations";
import { cn } from "@/lib/utils";

export interface LicenseCardProps {
  license: {
    id: string;
    licenseNumber: string;
    categoryName: string;
    categoryCode: string;
    issuedAt: string;
    expiresAt: string;
    status: LicenseStatus | string;
    replacementCount?: number;
  };
  onRequestReplacement?: () => void;
  onRenew?: () => void;
  onViewPdf?: () => void;
}

function getStatusLabel(status: LicenseStatus | string): { label: string; className: string } {
  const statusNum = typeof status === 'string' ? parseInt(status, 10) : status;
  
  switch (statusNum) {
    case LicenseStatus.Active:
      return { label: "نشطة", className: "bg-emerald-100 text-emerald-700 border-emerald-200" };
    case LicenseStatus.Expired:
      return { label: "منتهية", className: "bg-red-100 text-red-700 border-red-200" };
    case LicenseStatus.Suspended:
      return { label: "معلقة", className: "bg-amber-100 text-amber-700 border-amber-200" };
    case LicenseStatus.Revoked:
      return { label: "ملغاة", className: "bg-red-100 text-red-700 border-red-200" };
    case LicenseStatus.Replaced:
      return { label: "بديلة", className: "bg-blue-100 text-blue-700 border-blue-200" };
    case LicenseStatus.Renewed:
      return { label: "مجددة", className: "bg-purple-100 text-purple-700 border-purple-200" };
    case LicenseStatus.Superseded:
      return { label: "مستبدلة", className: "bg-neutral-100 text-neutral-700 border-neutral-200" };
    default:
      return { label: "غير معروفة", className: "bg-neutral-100 text-neutral-700 border-neutral-200" };
  }
}

function isExpiringSoon(expiresAt: string): boolean {
  const expiryDate = new Date(expiresAt);
  const today = new Date();
  const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-YE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function LicenseCard({
  license,
  onRequestReplacement,
  onRenew,
  onViewPdf
}: LicenseCardProps) {
  const t = useTranslations('license');
  
  const statusInfo = getStatusLabel(license.status);
  const isActive = typeof license.status === 'number' ? license.status === LicenseStatus.Active : license.status === '0';
  const isExpired = typeof license.status === 'number' ? license.status === LicenseStatus.Expired : license.status === '1';
  const showRenewButton = isActive && isExpiringSoon(license.expiresAt);
  
  return (
    <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
      {/* Header with category info */}
      <div className="bg-gradient-to-l from-[#1a3a8f] to-[#2d4a9f] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">
              {t('card.title', { categoryName: license.categoryName })}
            </h3>
            <p className="text-white/70 text-sm">
              {t('card.categoryCode', { code: license.categoryCode })}
            </p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        {/* License details grid */}
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-neutral-100">
            <span className="text-neutral-500 text-sm">{t('card.number')}</span>
            <span className="font-mono font-bold text-neutral-900 text-sm">{license.licenseNumber}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-neutral-100">
            <span className="text-neutral-500 text-sm">{t('card.category')}</span>
            <span className="font-medium text-neutral-900">
              {license.categoryName} ({license.categoryCode})
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-neutral-100">
            <span className="text-neutral-500 text-sm">{t('card.issuedAt')}</span>
            <span className="font-medium text-neutral-900">{formatDate(license.issuedAt)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-neutral-100">
            <span className="text-neutral-500 text-sm">{t('card.expiresAt')}</span>
            <span className={cn(
              "font-medium",
              isExpiringSoon(license.expiresAt) ? "text-amber-600" : "text-neutral-900"
            )}>
              {formatDate(license.expiresAt)}
              {isExpiringSoon(license.expiresAt) && (
                <span className="ms-2 text-xs text-amber-600">({t('card.expiringSoon')})</span>
              )}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-neutral-100">
            <span className="text-neutral-500 text-sm">{t('card.status')}</span>
            <span className={cn(
              "px-3 py-1 rounded-lg text-sm font-medium border",
              statusInfo.className
            )}>
              {statusInfo.label}
            </span>
          </div>
          
          {license.replacementCount !== undefined && license.replacementCount > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-neutral-100">
              <span className="text-neutral-500 text-sm">{t('card.replacementCount')}</span>
              <span className="font-medium text-neutral-900">{license.replacementCount}</span>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-4">
          {onViewPdf && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewPdf}
              className="flex-1 min-w-[120px]"
            >
              <Download className="w-4 h-4 ms-2" />
              {t('card.viewPdf')}
            </Button>
          )}
          
          {isActive && onRequestReplacement && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRequestReplacement}
              className="flex-1 min-w-[120px]"
            >
              <RefreshCw className="w-4 h-4 ms-2" />
              {t('card.requestReplacement')}
            </Button>
          )}
          
          {showRenewButton && onRenew && (
            <Button
              size="sm"
              onClick={onRenew}
              className="flex-1 min-w-[120px] bg-[#1a3a8f] hover:bg-[#2d4a9f]"
            >
              <FileText className="w-4 h-4 ms-2" />
              {t('card.renew')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}