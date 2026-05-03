'use client';

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { 
  FileText, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2,
  AlertCircle,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import applicationService from "@/services/application.service";
import { DocumentStatus } from "@/types/document.types";
import { DocumentStatusLabels } from "@/lib/enumMappers";
import { cn } from "@/lib/utils";

export default function ApplicationDocumentsPage() {
  const params = useParams();
  const idStr = params.id as string;
  const id = parseInt(idStr, 10);
  const router = useRouter();

  // Fetch application basic info
  const { data: appResponse, isLoading: appLoading } = useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationService.getApplicationById(id),
    enabled: !!id,
  });

  // Fetch documents
  const { data: docsResponse, isLoading: docsLoading, error } = useQuery({
    queryKey: ['application', id, 'documents'],
    queryFn: () => applicationService.getApplicationDocuments(id),
    enabled: !!id,
  });

  if (appLoading || docsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 font-arabic">
        <Loader2 className="w-16 h-16 animate-spin text-[#1a3a8f] opacity-20" />
        <p className="text-neutral-400 font-black animate-pulse uppercase tracking-[0.3em] text-xs">جاري تحميل المستندات...</p>
      </div>
    );
  }

  const app = appResponse?.data;
  const documents = docsResponse?.data || [];

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.Approved:
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case DocumentStatus.Rejected:
        return <XCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusClass = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.Approved:
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case DocumentStatus.Rejected:
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  return (
    <div className="space-y-8 font-arabic p-4 pb-24 max-w-5xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-neutral-400 mb-2">
            <button 
              onClick={() => router.push(`/applications/${id}`)}
              className="hover:text-[#1a3a8f] transition-colors flex items-center gap-1 text-sm font-bold"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للطلب
            </button>
          </div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#1a3a8f]" />
            المستندات المرفوعة
          </h1>
          <p className="text-neutral-500 font-bold">
            عرض وحالة المستندات المرفقة للطلب رقم <span className="text-[#1a3a8f]">{app?.applicationNumber || id}</span>
          </p>
        </div>
      </div>

      {error ? (
        <Card className="border-none shadow-sm rounded-3xl bg-white p-12 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 mb-2">فشل تحميل المستندات</h2>
          <p className="text-neutral-500 font-bold mb-8">حدث خطأ أثناء محاولة جلب قائمة المستندات من الخادم.</p>
          <Button onClick={() => router.back()} className="bg-[#1a3a8f] text-white px-8 h-12 rounded-xl font-bold">
            العودة للخلف
          </Button>
        </Card>
      ) : documents.length === 0 ? (
        <Card className="border-none shadow-sm rounded-3xl bg-white p-12 text-center">
          <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-neutral-300" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 mb-2">لا توجد مستندات</h2>
          <p className="text-neutral-500 font-bold mb-8">لم يتم رفع أي مستندات لهذا الطلب بعد.</p>
          <Button onClick={() => router.push(`/applications/new?edit=${id}`)} className="bg-[#1a3a8f] text-white px-8 h-12 rounded-xl font-bold">
            إكمال الطلب ورفع المستندات
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="border-none shadow-sm rounded-2xl bg-white overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                  <div className="w-14 h-14 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0">
                    <FileText className="w-7 h-7 text-[#1a3a8f]" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-black text-neutral-900 truncate">
                        {doc.documentTypeName}
                      </h3>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black border flex items-center gap-1.5",
                        getStatusClass(doc.status)
                      )}>
                        {getStatusIcon(doc.status)}
                        {DocumentStatusLabels[doc.status]}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-xs font-bold truncate">
                      {doc.originalFileName} • {(doc.fileSizeBytes / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {doc.status === DocumentStatus.Rejected && doc.rejectionReason && (
                      <div className="mt-3 p-3 bg-rose-50/50 border border-rose-100 rounded-lg text-rose-700 text-xs font-bold flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>سبب الرفض: {doc.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-11 px-5 rounded-xl border-neutral-100 font-bold gap-2 hover:bg-neutral-50"
                      asChild
                    >
                      <a href={doc.downloadUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-4 h-4" />
                        عرض
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-11 px-5 rounded-xl border-neutral-100 font-bold gap-2 hover:bg-neutral-50"
                      onClick={() => window.open(doc.downloadUrl, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                      تحميل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4 mt-8">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
          <AlertCircle className="w-6 h-6 text-[#1a3a8f]" />
        </div>
        <div className="space-y-1">
          <h4 className="font-black text-[#1a3a8f]">ملاحظة حول مراجعة المستندات</h4>
          <p className="text-sm text-blue-800/80 font-bold leading-relaxed">
            يتم مراجعة المستندات من قبل الموظف المختص خلال 24-48 ساعة عمل. في حال رفض أي مستند، سيتم إشعارك عبر رسالة نصية لتتمكن من إعادة رفعه مرة أخرى.
          </p>
        </div>
      </div>
    </div>
  );
}
