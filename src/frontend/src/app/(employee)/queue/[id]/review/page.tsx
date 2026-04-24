"use client";

import { useState, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  FileText, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  ShieldCheck,
  XCircle,
  Clock,
  ChevronLeft,
  Layers,
  CheckCircle,
  XOctagon,
  Loader2
} from "lucide-react";
import Link from "next/link";
import applicationService, { ApplicationWithDetailsDto } from "@/services/application.service";
import { useTranslations } from "@/lib/static-translations";
import { DocumentDto, DocumentStatus } from "@/types/document.types";
import { ApplicationStatus } from "@/types/application.types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/domain/application/StatusBadge";

// Map license category code to Arabic label
const getCategoryLabel = (code: number | null): string => {
  if (!code) return "";
  switch (code) {
    case 1: return "دراجة نارية";
    case 2: return "سيارة خصوصي";
    case 3: return "نقل عام";
    case 4: return "حافلة";
    case 5: return "مقطورة";
    case 6: return "صف خاص";
    default: return `فئة ${code}`;
  }
};

// Map service type to Arabic label
const getServiceLabel = (serviceType: number): string => {
  switch (serviceType) {
    case 1: return "رخصة جديدة";
    case 2: return "تجديد الرخصة";
    case 3: return "بدل فاقد/تالف";
    case 4: return "ترقية الرخصة";
    default: return "خدمة أخرى";
  }
};

// Document type to Arabic label
const getDocumentTypeLabel = (documentType: number): string => {
  switch (documentType) {
    case 1: return "صورة البطاقة";
    case 2: return "الصورة الشخصية";
    case 3: return "التقرير الطبي";
    case 4: return "شهادة التدريب";
    case 5: return "إثبات العنوان";
    case 6: return "موافقة ولي الأمر";
    case 7: return "الرخصة السابقة";
    case 8: return "وثائق خاصة";
    default: return "مستند";
  }
};

// Get status from document status enum
const getDocumentStatusLabel = (status: DocumentStatus): string => {
  switch (status) {
    case DocumentStatus.Pending: return "بانتظار المراجعة";
    case DocumentStatus.Approved: return "معتمد";
    case DocumentStatus.Rejected: return "مرفوض";
    default: return "غير معروف";
  }
};

interface RejectModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
}

function RejectModal({ open, onClose, onConfirm, isLoading }: RejectModalProps) {
  const t = useTranslations('review');
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-[2rem] p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <XOctagon className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-black text-neutral-900">{t('decision.confirmReject')}</h3>
              <p className="text-sm text-neutral-500">{t('decision.rejectPlaceholder')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black text-neutral-400 uppercase tracking-widest">
              {t('decision.confirmReject')}
            </Label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('decision.rejectPlaceholder')}
              className="w-full h-32 rounded-2xl border border-neutral-100 p-4 text-lg font-bold placeholder:text-neutral-300 focus:outline-none focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all resize-none font-arabic"
            />
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-14 rounded-2xl border-neutral-200 font-black text-neutral-600 hover:bg-neutral-50 transition-all font-arabic"
            >
              {t('decision.cancel')}
            </Button>
            <Button
              onClick={() => onConfirm(reason)}
              disabled={!reason.trim() || isLoading}
              className="flex-1 h-14 rounded-2xl bg-red-500 hover:bg-red-600 font-black text-white transition-all font-arabic"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('decision.submit')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ApproveModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

function ApproveModal({ open, onClose, onConfirm, isLoading }: ApproveModalProps) {
  const t = useTranslations('review');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-[2rem] p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          
          <div>
            <h3 className="text-xl font-black text-neutral-900 mb-2">{t('decision.confirmApprove')}</h3>
            <p className="text-neutral-500">سيتم تقديم الطلب للمرحلة التالية</p>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-14 rounded-2xl border-neutral-200 font-black text-neutral-600 hover:bg-neutral-50 transition-all font-arabic"
            >
              {t('decision.cancel')}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-black text-white transition-all font-arabic"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('decision.submit')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentCard({ document }: { document: DocumentDto }) {
  const t = useTranslations('review');
  const status = document.status as unknown as DocumentStatus;
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-neutral-50 rounded-[32px] border border-neutral-100 group hover:border-blue-200 transition-all cursor-pointer">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <FileText className="w-7 h-7 text-neutral-400 group-hover:text-[#1a3a8f] transition-colors" />
        </div>
        <div className="space-y-1">
          <p className="font-black text-xl text-neutral-800 font-arabic">
            {document.documentTypeName || getDocumentTypeLabel(document.documentType)}
          </p>
          <p className="text-xs text-neutral-400">
            {new Date(document.createdAt).toLocaleDateString('ar-YE')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <div className={`px-4 py-2 rounded-full text-sm font-bold ${
          status === DocumentStatus.Approved ? 'bg-emerald-100 text-emerald-600' :
          status === DocumentStatus.Rejected ? 'bg-red-100 text-red-600' :
          'bg-amber-100 text-amber-600'
        }`}>
          {getDocumentStatusLabel(status)}
        </div>
        <Button 
          variant="outline" 
          className="rounded-md bg-white border-neutral-100 font-black font-arabic h-10 px-5 text-[#1a3a8f] hover:bg-[#1a3a8f] hover:text-white transition-all"
          onClick={() => window.open(document.downloadUrl, '_blank')}
        >
          {t('documents.view')}
        </Button>
      </div>
    </div>
  );
}

export default function ApplicationReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const t = useTranslations('review');
  const queryClient = useQueryClient();
  const [remarks, setRemarks] = useState("");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Fetch application details
  const { data: appData, isLoading } = useQuery({
    queryKey: ['application-details', id],
    queryFn: () => applicationService.getApplicationDetails(id),
    enabled: !!id,
  });

  const application = appData?.data;

  // Fetch documents
  const { data: docsData } = useQuery({
    queryKey: ['application-documents', id],
    queryFn: () => applicationService.getApplicationDocuments(id),
    enabled: !!id,
  });

  const documents = docsData?.data || [];

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: () => applicationService.approveApplication(id, remarks || undefined),
    onSuccess: (res) => {
      if (res.data) {
        setActionSuccess('approved');
        queryClient.invalidateQueries({ queryKey: ['employee-queue'] });
        setTimeout(() => {
          window.location.href = '/queue';
        }, 2000);
      }
    },
    onError: () => {
      setActionSuccess('error');
    }
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: (reason: string) => applicationService.rejectApplication(id, reason),
    onSuccess: (res) => {
      if (res.data) {
        setActionSuccess('rejected');
        queryClient.invalidateQueries({ queryKey: ['employee-queue'] });
        setTimeout(() => {
          window.location.href = '/queue';
        }, 2000);
      }
    },
    onError: () => {
      setActionSuccess('error');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#1a3a8f]" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <XOctagon className="w-16 h-16 text-red-400" />
        <p className="text-xl font-black text-neutral-600">الطلب غير موجود</p>
        <Link href="/queue">
          <Button className="font-arabic">{t('backLink')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-10" dir="rtl">
      {/* Success Message */}
      {actionSuccess && (
        <div className={`fixed top-6 start-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-2xl shadow-2xl font-bold font-arabic ${
          actionSuccess === 'approved' ? 'bg-emerald-500 text-white' :
          actionSuccess === 'rejected' ? 'bg-red-500 text-white' :
          'bg-red-500 text-white'
        }`}>
          {actionSuccess === 'approved' ? t('messages.approved') :
           actionSuccess === 'rejected' ? t('messages.rejected') :
           t('messages.error')}
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-4">
        <div className="space-y-4">
          <Link href="/queue" className="inline-flex items-center gap-2 text-[#1a3a8f] font-black mb-2 hover:-translate-x-1 transition-transform font-arabic text-sm">
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            {t('backLink')}
          </Link>
          <div className="flex flex-wrap items-center gap-6">
            <h1 className="text-5xl font-black text-neutral-900 tracking-tighter font-arabic">
              {t('title')}
            </h1>
            <StatusBadge status={application.status} className="h-10 px-6 font-black rounded-2xl" />
          </div>
          <p className="text-xl text-neutral-400 font-bold font-arabic flex items-center gap-3">
            رقم الطلب: <span className="text-[#1a3a8f] font-black">{application.applicationNumber}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="xl:col-span-3 space-y-10">
          {/* Section 1: Applicant Info */}
          <Card className="border-none shadow-3xl rounded-[48px] overflow-hidden bg-white p-2">
            <CardHeader className="p-12 pb-6">
              <CardTitle className="text-2xl font-black flex items-center gap-5 text-neutral-900 font-arabic">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <User className="w-8 h-8 text-[#1a3a8f]" />
                </div>
                {t('sections.applicantInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-12 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <div className="space-y-3">
                <Label className="text-xs font-black text-neutral-300 uppercase tracking-widest font-arabic">
                  {t('fields.fullName')}
                </Label>
                <p className="text-xl font-black text-neutral-800 font-arabic">
                  {application.applicantName || application.fullName || '—'}
                </p>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black text-neutral-300 uppercase tracking-widest font-arabic">
                  {t('fields.nationalId')}
                </Label>
                <p className="text-2xl font-black text-[#1a3a8f]">{application.nationalId || '—'}</p>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black text-neutral-300 uppercase tracking-widest font-arabic">
                  {t('fields.serviceType')}
                </Label>
                <div className="flex items-center gap-3 font-black text-neutral-800 font-arabic">
                  <Layers className="w-5 h-5 text-neutral-300" />
                  {getServiceLabel(application.serviceType)}
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black text-neutral-300 uppercase tracking-widest font-arabic">
                  {t('fields.category')}
                </Label>
                <p className="text-xl font-black text-neutral-800 font-arabic">
                  {getCategoryLabel(application.licenseCategoryCode)}
                </p>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black text-neutral-300 uppercase tracking-widest font-arabic">
                  {t('fields.phone')}
                </Label>
                <div className="flex items-center gap-3 font-bold text-neutral-800">
                  <Phone className="w-5 h-5 text-neutral-300" />
                  {application.mobileNumber || '—'}
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black text-neutral-300 uppercase tracking-widest font-arabic">
                  {t('fields.email')}
                </Label>
                <div className="flex items-center gap-3 font-bold text-neutral-800">
                  <Mail className="w-5 h-5 text-neutral-300" />
                  {application.email || '—'}
                </div>
              </div>
              <div className="space-y-3 md:col-span-2 lg:col-span-3">
                <Label className="text-xs font-black text-neutral-300 uppercase tracking-widest font-arabic">
                  {t('fields.address')}
                </Label>
                <div className="flex items-center gap-3 font-bold text-neutral-800 font-arabic">
                  <MapPin className="w-5 h-5 text-[#D4A017]" />
                  {[application.address, application.city, application.region].filter(Boolean).join(' - ') || '—'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Documents */}
          <Card className="border-none shadow-3xl rounded-[48px] overflow-hidden bg-white p-2">
            <CardHeader className="p-12 pb-6">
              <CardTitle className="text-2xl font-black flex items-center gap-5 text-neutral-900 font-arabic">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-[#1a3a8f]" />
                </div>
                {t('sections.documents')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-12 pt-0 space-y-6">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))
              ) : (
                <div className="text-center py-8 text-neutral-400 font-bold">
                  لا توجد مستندات مرفقة
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-10">
          {/* Section 3: Decision */}
          <Card className="border-none shadow-3xl rounded-[48pt] overflow-hidden bg-[#1a3a8f] p-2 text-white relative">
            <CardHeader className="p-10 pb-6 border-b border-white/5">
              <CardTitle className="text-2xl font-black font-arabic">
                {t('sections.decision')}
              </CardTitle>
              <CardDescription className="text-blue-200 font-bold mt-2 font-arabic opacity-80 underline decoration-[#D4A017] decoration-2 underline-offset-8">
                يتطلب التحقق من كافة الشروط قبل الاعتماد
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-10 space-y-10">
              <div className="space-y-4">
                <Label className="text-xs font-black text-blue-200/50 uppercase tracking-widest font-arabic">
                  {t('decision.remarks')}
                </Label>
                <textarea 
                  className="w-full bg-black/20 rounded-[32pt] border border-white/10 p-8 font-bold text-white placeholder:text-blue-300/30 h-48 focus:outline-none focus:border-[#D4A017] transition-all text-lg font-arabic"
                  placeholder={t('decision.remarksPlaceholder')}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-6 pt-4">
                <Button 
                  className="h-20 rounded-[28pt] bg-emerald-500 hover:bg-emerald-600 font-black text-xl gap-4 shadow-3xl shadow-emerald-500/20 transition-all hover:scale-[1.02] font-arabic"
                  onClick={() => setShowApproveModal(true)}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                >
                  <ShieldCheck className="w-8 h-8" />
                  {t('decision.approve')}
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 rounded-[28pt] border-white/10 bg-white/5 hover:bg-red-500 hover:border-red-500 font-black text-xl gap-4 transition-all font-arabic text-red-200"
                  onClick={() => setShowRejectModal(true)}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                >
                  <XCircle className="w-8 h-8" />
                  {t('decision.reject')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="border-none shadow-3xl rounded-[48pt] overflow-hidden bg-white p-2">
            <CardHeader className="p-10 pb-6">
              <CardTitle className="text-xl font-black flex items-center gap-4 text-neutral-900 font-arabic">
                <Clock className="w-6 h-6 text-[#D4A017]" />
                {t('sections.history')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-8">
              {[
                { user: "مركز المعالجة", action: "تم إدراج الطلب في القائمة", time: new Date(application.createdAt).toLocaleDateString('ar-YE') },
                { user: application.applicantName || "المتقدم", action: "تقديم الطلب الأولي", time: new Date(application.createdAt).toLocaleDateString('ar-YE') }
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between border-b border-neutral-50 pb-6 last:border-0 last:pb-0 group" >
                  <div className="space-y-1">
                    <p className="font-black text-neutral-800 group-hover:text-[#1a3a8f] transition-colors font-arabic">{h.action}</p>
                    <p className="text-xs font-bold text-neutral-400 font-arabic">
                      {t('history.by')} <span className="text-neutral-600">{h.user}</span>
                    </p>
                  </div>
                  <span className="text-xs font-black text-neutral-300 font-arabic">{h.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <ApproveModal
        open={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={() => approveMutation.mutate()}
        isLoading={approveMutation.isPending}
      />

      <RejectModal
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={(reason) => rejectMutation.mutate(reason)}
        isLoading={rejectMutation.isPending}
      />
    </div>
  );
}