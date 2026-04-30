'use client';

import React, { useCallback, useState, useRef } from 'react';
import { 
  FileUp, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileText, 
  Image as ImageIcon,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DOCUMENT_CONSTRAINTS } from '@/lib/validations/document.schema';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileUploaderProps {
  label: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onFileSelect: (file: File | null) => void;
  value?: File | null;
  error?: string;
  accept?: string;
  className?: string;
}

export function FileUploader({
  label,
  subtitle = "الصيغ المدعومة: JPG, PNG, PDF (الحد الأقصى 5MB)",
  icon = <FileUp className="w-8 h-8" />,
  onFileSelect,
  value,
  error,
  accept = ".jpg,.jpeg,.png,.pdf",
  className
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayError = error || internalError;

  const validateFile = (file: File): boolean => {
    setInternalError(null);

    // Size check
    if (file.size > DOCUMENT_CONSTRAINTS.MAX_FILE_SIZE) {
      setInternalError('حجم الملف يتجاوز الحد المسموح به (5 ميجابايت)');
      return false;
    }

    // Type check (basic check against extensions as MIME can be unreliable in some browsers)
    const fileName = file.name.toLowerCase();
    const isValidExt = DOCUMENT_CONSTRAINTS.ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    
    if (!isValidExt) {
      setInternalError('نوع الملف غير مدعوم. يرجى رفع ملف (JPG, PNG, PDF)');
      return false;
    }

    return true;
  };

  const handleFile = (file: File | null) => {
    if (file && validateFile(file)) {
      onFileSelect(file);
    } else if (!file) {
      onFileSelect(null);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={cn("space-y-4 font-arabic", className)} dir="rtl">
      {/* Label Area */}
      <div className="flex items-center justify-between px-2">
          <label className="text-sm font-black text-neutral-900 flex items-center gap-2 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
             <Zap className={cn("w-4 h-4 transition-colors", value ? "text-emerald-500" : "text-[#1a3a8f]/40")} />
             {label}
          </label>
          {value && (
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" />
                تم التحقق والمزامنة
             </span>
          )}
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative group transition-all duration-700 cursor-pointer overflow-hidden rounded-[2.5rem] border-4 border-dashed",
          isDragging 
            ? "border-[#1a3a8f] bg-[#1a3a8f]/5 scale-[1.01] shadow-2xl" 
            : "border-neutral-100 bg-neutral-50/50 hover:bg-white hover:border-[#1a3a8f]/30 hover:shadow-xl",
          value && "border-emerald-500/30 bg-emerald-500/5",
          displayError && "border-rose-500/30 bg-rose-500/5"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept={accept}
          className="hidden"
        />

        <div className="p-10 md:p-14 flex flex-col items-center text-center space-y-6 relative z-10">
          {value ? (
            /* File Selected State */
            <div className="space-y-6 w-full animate-in zoom-in-95 duration-500">
               <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-950/20 transform rotate-3">
                  {value.type?.includes('image') ? <ImageIcon className="w-10 h-10 text-white" /> : <FileText className="w-10 h-10 text-white" />}
               </div>
               <div className="space-y-2">
                  <p className="text-xl font-black text-neutral-900 tracking-tighter line-clamp-1 truncate px-4">{value.name || 'وثيقة مرفقة'}</p>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{value.size ? (value.size / (1024 * 1024)).toFixed(2) : '0.00'} MB • جاهز للتقديم</p>
               </div>
               <div className="flex items-center gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-14 rounded-2xl border-neutral-100 hover:bg-neutral-900 hover:text-white font-black transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (value && (value instanceof Blob || (typeof value === 'object' && 'size' in value))) {
                        try {
                          window.open(URL.createObjectURL(value as any), '_blank');
                        } catch (err) {
                          console.error("Preview failed:", err);
                        }
                      }
                    }}
                  >
                    معاينة الوثيقة
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="h-14 w-14 p-0 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-100 shadow-sm"
                    onClick={clearFile}
                  >
                    <X className="w-6 h-6" />
                  </Button>
               </div>
            </div>
          ) : (
            /* Empty State */
            <>
              <div className={cn(
                "w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 shadow-inner border",
                isDragging ? "bg-[#1a3a8f] text-white shadow-[#1a3a8f]/30" : "bg-white text-[#1a3a8f] border-neutral-50 shadow-sm group-hover:scale-110"
              )}>
                {icon}
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black text-neutral-900 tracking-tighter leading-none">
                   {isDragging ? 'أسقط الوثيقة هنا فوراً' : 'انقر هنا أو اسحب الملف للرفع'}
                </p>
                <p className="text-sm font-bold text-neutral-400 max-w-xs mx-auto leading-relaxed">
                   {subtitle}
                </p>
              </div>
            </>
          )}

          {displayError && (
             <div className="flex items-center gap-3 py-4 px-8 bg-rose-500 text-white rounded-2xl text-xs font-black animate-in slide-in-from-bottom-4 shadow-xl shadow-rose-950/20">
                <AlertCircle className="w-4 h-4" />
                {displayError}
             </div>
          )}
        </div>

        {/* Decorative Watermark */}
        <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12 pointer-events-none group-hover:opacity-[0.05] transition-opacity">
           <ShieldCheck className="w-40 h-40" />
        </div>
      </div>
    </div>
  );
}
