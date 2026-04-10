"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { FinalApprovalPanel } from "@/components/domain/application/FinalApprovalPanel";
import { cn } from "@/lib/utils";

export default function FinalApprovalPage() {
  const { id, locale } = useParams();
  const t = useTranslations("final-approval");
  const commonT = useTranslations("common");
  
  const applicationId = Array.isArray(id) ? id[0] : id;

  if (!applicationId) return null;

  const isRtl = locale === "ar";

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 sm:px-6 lg:px-8 space-y-10 min-h-screen pb-24">
      {/* Simple Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
        <Link href={`/${locale}/dashboard`} className="hover:text-primary transition-colors flex items-center gap-1">
          <Home className="w-3 h-3" />
          {commonT("dashboard")}
        </Link>
        <ChevronRight className={cn("w-3 h-3", isRtl && "rotate-180")} />
        <Link href={`/${locale}/applications`} className="hover:text-primary transition-colors">
          {commonT("applications")}
        </Link>
        <ChevronRight className={cn("w-3 h-3", isRtl && "rotate-180")} />
        <span className="text-primary">{t("title")}</span>
      </nav>

      {/* Hero Header */}
      <header className="relative space-y-4">
        <div className="flex items-center gap-4">
          <Link 
            href={`/${locale}/applications/${applicationId}`}
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-all hover:bg-primary hover:text-white"
          >
            <ChevronLeft className="h-5 w-5 rtl:rotate-180 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
          </Link>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
              Stage 08 • Quality Assurance
            </span>
            <h1 className="text-5xl font-black text-neutral-900 tracking-tighter leading-none uppercase mt-1">
              {t("title")}
            </h1>
          </div>
        </div>
        
        {/* Subtle Decorative Line */}
        <div className="h-1 w-24 bg-primary rounded-full" />
      </header>

      {/* Main Orchestration Panel */}
      <main className="mt-12">
        <div className="grid grid-cols-1 gap-10">
          <div className="col-span-1">
            <FinalApprovalPanel 
              applicationId={applicationId} 
              isEditable={true} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}