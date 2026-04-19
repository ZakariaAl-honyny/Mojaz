import { getTranslations } from "next-intl/server";
import { ApplicationTimeline, TimelineStage } from "@/components/domain/application/ApplicationTimeline";
import { StatusBadge } from "@/components/domain/application/StatusBadge";
import { ApplicationStatus } from "@/types/api.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard, Activity, CalendarClock } from "lucide-react";
import { Link } from "@/i18n/routing";
import { GateLockIndicator } from "@/components/domain/training/GateLockIndicator";
import { TheoryTestHistory } from "@/components/domain/theory/TheoryTestHistory";
import { PaymentSection } from "@/components/domain/payment/PaymentSection";
import { JourneySimulatorTrigger } from "@/components/domain/application/JourneySimulatorTrigger";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "application.details" });
  return {
    title: `${t("title")} - ${id} | DrivingLicenseIssuanceSystem`,
  };
}

export default async function ApplicationDetailsPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale });

  // Mock data for MVP Showcase
  const appData = {
    id,
    number: "MOJ-2025-AGRIC-01",
    category: "Agricultural",
    status: "InReview" as ApplicationStatus,
    createdAt: "2025-01-10T08:30:00Z",
  };

  const isAgricultural = appData.category === "Agricultural";

  const timelineStages: TimelineStage[] = [
    { id: "1", nameKey: "creation", status: "completed", timestamp: "2025-01-10T08:30:00Z" },
    { id: "2", nameKey: "documentReview", status: "completed", timestamp: "2025-01-11T10:00:00Z" },
    { id: "3", nameKey: "training", status: "current", extraContent: <GateLockIndicator isLocked={true} /> },
    { id: "4", nameKey: "payment", status: "pending" },
    { id: "5", nameKey: "medical", status: "pending" },
    { id: "6", nameKey: "theory", status: "pending" },
    { id: "7", nameKey: isAgricultural ? "fieldTest" : "practical", status: "pending" },
    { id: "8", nameKey: "issuance", status: "pending" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 bg-white/5 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent group-hover:via-primary-500 transition-all duration-700" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] font-black uppercase tracking-widest text-primary-400">
              Official System Record
            </div>
            <StatusBadge status={appData.status} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-4 font-arabic leading-none">{appData.number}</h1>
          <p className="text-neutral-500 flex items-center gap-3 font-bold text-lg">
            <CalendarClock className="w-5 h-5 text-primary-500" />
            {t("application.details.submittedOn")}: {new Date(appData.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 relative z-10">
          <JourneySimulatorTrigger applicationId={id} />

          <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 text-neutral-400 font-black hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all uppercase tracking-widest text-xs">
            {t("application.details.cancelButton")}
          </Button>
          <Button className="h-16 px-10 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white font-black shadow-xl shadow-primary-900/40 gap-3 uppercase tracking-widest text-xs">
            <CreditCard className="w-5 h-5" />
            {t("application.details.payButton")}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Timeline (Main Content Area) */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-2xl font-black flex items-center gap-4 text-white uppercase tracking-tight">
                <div className="w-2.5 h-10 bg-primary-500 rounded-full shadow-[0_0_20px_rgba(0,108,53,0.5)]" />
                {t("application.details.timelineTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-10">
              <ApplicationTimeline stages={timelineStages} />
            </CardContent>
          </Card>

          <TheoryTestHistory applicationId={id} />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-10">
          <Card className="border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black flex items-center gap-4 text-white uppercase tracking-tight">
                <FileText className="w-6 h-6 text-primary-500" />
                {t("application.details.documentsTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-4">
              <div className="flex justify-between items-center p-5 bg-white/5 border border-white/5 rounded-2xl group/item hover:bg-white/10 transition-all">
                <span className="font-bold text-neutral-400 group-hover:text-white transition-colors">{t("application.details.docId")}</span>
                <StatusBadge showIcon={false} status="Approved" className="text-[10px] px-3 py-1 font-black" />
              </div>
              <div className="flex justify-between items-center p-5 bg-white/5 border border-white/5 rounded-2xl group/item hover:bg-white/10 transition-all">
                <span className="font-bold text-neutral-400 group-hover:text-white transition-colors">{t("application.details.docMedical")}</span>
                <StatusBadge showIcon={false} status="Pending" className="text-[10px] px-3 py-1 font-black" />
              </div>

              <Link href={`/${locale}/applications/${id}/documents`} className="block mt-4">
                <Button variant="outline" className="w-full h-14 rounded-xl border-white/10 bg-white/5 text-white font-black hover:bg-white/10 transition-all">
                  {t("application.details.manageDocsButton")}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <PaymentSection
            applicationId={id}
            amount={100}
          />

        </div>
      </div>
    </div>
  );
}
