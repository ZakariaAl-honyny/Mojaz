'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Image as ImageIcon, X, AlertCircle, CheckCircle2, RotateCcw, FileSearch, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentDto, DocumentRequirementDto, DocumentStatus, DocumentType } from '@/types/document.types';
import { DocumentStatusBadge } from './DocumentStatusBadge';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadCardProps {
  requirement: DocumentRequirementDto;
  document?: DocumentDto;
  onUpload: (file: File) => void;
  onDelete?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

export function UploadCard({
  requirement,
  document,
  onUpload,
  onDelete,
  isUploading = false,
  uploadProgress = 0,
  error,
}: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get document type name logic simplified for RTL hardcoded
  const documentNameMap: Record<number, string> = {
    [DocumentType.IdCopy]: 'صورة البطاقة الشخصية',
    [DocumentType.MedicalReport]: 'تقرير الفحص الطبي',
    [DocumentType.TrainingCertificate]: 'شهادة الخبرة',
    [DocumentType.AddressProof]: 'إثبات العنوان',
    [DocumentType.PersonalPhoto]: 'الصورة الشخصية',
    [DocumentType.GuardianConsent]: 'موافقة ولي الأمر',
    [DocumentType.PreviousLicense]: 'الرخصة السابقة',
  };

  const getDocumentTypeName = (type: number): string => {
    return documentNameMap[type] || 'مستند آخر';
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) return;

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) return;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }

      onUpload(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) handleFileSelect(files[0]);
    },
    [handleFileSelect]
  );

  const currentStatus = document?.status || requirement.status;
  const hasDocument = !!document || requirement.hasUpload;

  return (
    <div className="bg-white rounded-[2rem] border border-blue-50/50 p-8 shadow-2xl shadow-blue-900/5 font-arabic group transition-all duration-500 hover:shadow-blue-900/10" dir="rtl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
           <div className={cn(
             "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
             hasDocument ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-[#1a3a8f]"
           )}>
              {hasDocument ? <CheckCircle2 className="w-6 h-6" /> : <FileSearch className="w-6 h-6" />}
           </div>
           <div>
              <h3 className="text-lg font-black text-neutral-900 tracking-tight">
                {getDocumentTypeName(requirement.documentType)}
              </h3>
              <p className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] mt-1",
                requirement.isRequired ? "text-blue-400" : "text-neutral-300"
              )}>
                {requirement.isRequired ? 'مطلوب إلزامي' : 'اختياري'}
              </p>
           </div>
        </div>
        {currentStatus !== undefined && <DocumentStatusBadge status={currentStatus} />}
      </div>

      {/* Upload/Preview Section */}
      <div className="relative min-h-[160px]">
        {hasDocument ? (
          <div className="space-y-6">
            <div className="relative rounded-[1.5rem] overflow-hidden border border-neutral-100 bg-neutral-50 h-[140px] flex items-center justify-center group/preview">
               {previewUrl || (document?.contentType?.startsWith('image/')) ? (
                 <img
                   src={previewUrl || `/api/documents/${document?.id}/view`}
                   alt="Preview"
                   className="w-full h-full object-cover transition-transform duration-700 group-hover/preview:scale-110"
                 />
               ) : (
                 <FileText className="w-16 h-16 text-neutral-200" />
               )}
               
               {isUploading && (
                 <div className="absolute inset-0 bg-[#1a3a8f]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-white" />
                    <span className="text-white font-black text-xl">{uploadProgress}%</span>
                 </div>
               )}

               <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity duration-500 flex items-end p-4">
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">
                    {document?.originalFileName || 'تم الرفع بنجاح'}
                  </span>
               </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              {currentStatus !== DocumentStatus.Approved && onDelete && (
                <button
                  onClick={onDelete}
                  className="flex-1 h-12 flex items-center justify-center gap-3 rounded-xl bg-red-50 text-red-600 font-black text-sm hover:bg-red-100 transition-all border border-red-100"
                >
                  <X className="w-4 h-4" />
                  حذف الملف
                </button>
              )}
              {currentStatus === DocumentStatus.Rejected && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 h-12 flex items-center justify-center gap-3 rounded-xl bg-blue-50 text-[#1a3a8f] font-black text-sm hover:bg-blue-100 transition-all border border-blue-100"
                >
                  <RotateCcw className="w-4 h-4" />
                  إعادة الرفع
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "absolute inset-0 rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-500 cursor-pointer",
              isDragging 
                ? "bg-blue-50 border-[#1a3a8f] scale-[0.98]" 
                : "bg-neutral-50 border-neutral-200 hover:bg-white hover:border-[#1a3a8f] hover:shadow-xl hover:shadow-blue-900/5"
            )}
          >
             <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-neutral-300 group-hover:text-[#1a3a8f] transition-colors">
                <Upload className="w-6 h-6" />
             </div>
             <div className="text-center">
                <p className="text-sm font-black text-neutral-900">اسحب الملف هنا</p>
                <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-widest">أو اضغط للتصفح (الحد الأقصى 5 ميجابايت)</p>
             </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}