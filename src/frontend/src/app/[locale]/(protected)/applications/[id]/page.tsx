import { getTranslations } from "next-intl/server";
import { ApplicationTimeline, TimelineStage } from "@/components/domain/application/ApplicationTimeline";
import { StatusBadge } from "@/components/domain/application/StatusBadge";
import { ApplicationStatus } from "@/types/api.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard, Activity, CalendarClock } from "lucide-react";
import Link from "next/link";
import { GateLockIndicator } from "@/components/domain/training/GateLockIndicator";
import { TheoryTestHistory } from "@/components/domain/theory/TheoryTestHistory";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "application.details" });
  return {
    title: `${t("title")} - ${id} | Mojaz`,
  };
}

export default async function ApplicationDetailsPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale });

  // Mock data for MVP Showcase
  const appData = {
    id,
    number: "MOJ-2025-48291037",
    category: "Private Car",
    status: "InReview" as ApplicationStatus,
    createdAt: "2025-01-10T08:30:00Z",
  };

  const timelineStages: TimelineStage[] = [
    { id: "1", nameKey: "creation", status: "completed", timestamp: "2025-01-10T08:30:00Z" },
    { id: "2", nameKey: "documentReview", status: "completed", timestamp: "2025-01-11T10:00:00Z" },
    { id: "3", nameKey: "training", status: "current", extraContent: <GateLockIndicator isLocked={true} /> },
    { id: "4", nameKey: "payment", status: "pending" },
    { id: "5", nameKey: "medical", status: "pending" },
    { id: "6", nameKey: "theory", status: "pending" },
    { id: "7", nameKey: "practical", status: "pending" },
    { id: "8", nameKey: "issuance", status: "pending" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-primary-950">{appData.number}</h1>
            <StatusBadge status={appData.status} />
          </div>
          <p className="text-neutral-500 flex items-center gap-2">
            <CalendarClock className="w-4 h-4" />
            {t("application.details.submittedOn")}: {new Date(appData.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
            {t("application.details.cancelButton")}
          </Button>
          <Button className="bg-primary-500 hover:bg-primary-600 text-white">
            {t("application.details.payButton")}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Timeline (Main Content Area) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 rounded-t-xl pb-4">
              <CardTitle className="text-xl flex items-center gap-2 text-primary-900">
                <Activity className="w-5 h-5 text-primary-500" />
                {t("application.details.timelineTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <ApplicationTimeline stages={timelineStages} />
            </CardContent>
          </Card>

          <TheoryTestHistory applicationId={id} />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="shadow-sm border-neutral-200">
            <CardHeader className="pb-3 border-b border-neutral-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-neutral-500" />
                {t("application.details.documentsTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-sm space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg text-green-700">
                <span>{t("application.details.docId")}</span>
                <StatusBadge showIcon={false} status="Approved" className="text-[10px] px-2 py-0" />
              </div>
              <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg text-neutral-700">
                <span>{t("application.details.docMedical")}</span>
                <StatusBadge showIcon={false} status="Pending" className="text-[10px] px-2 py-0" />
              </div>

              <Link href={`/${locale}/applications/${id}/documents`}>
                <Button variant="outline" className="w-full mt-2">
                  {t("application.details.manageDocsButton")}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-neutral-200">
            <CardHeader className="pb-3 border-b border-neutral-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-neutral-500" />
                {t("application.details.paymentsTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-center py-8">
              <p className="text-neutral-500 text-sm mb-4">{t("application.details.noPaymentsMsg")}</p>
              <Button className="w-full bg-secondary-500 hover:bg-secondary-600 text-white border-0 shadow">
                {t("application.details.payButton")} (100 SAR)
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
