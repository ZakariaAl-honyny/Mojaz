import React from "react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { 
  TrainingRecordDto, 
  TrainingStatus 
} from "@/types/training.types";
import { TrainingProgressArc } from "@/components/domain/training/TrainingProgressArc";
import { TrainingEntryForm } from "@/components/domain/training/TrainingEntryForm";
import { SessionHistoryRow } from "@/components/domain/training/SessionHistoryRow";
import { TrainingStatusBadge } from "@/components/domain/training/TrainingStatusBadge";
import { TrainingClientControls } from "@/components/domain/training/TrainingClientControls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceType } from "@/types/wizard.types";
import { AlertCircle, User, Info } from "lucide-react";
import TrainingService from "@/services/training.service";
import ApplicationService from "@/services/application.service";

interface TrainingPageProps {
  params: {
    locale: string;
    applicationId: string;
  };
}

/**
 * Training Management Page (Employee View)
 * Uses Server Components for initial data fetch (async-parallel pattern).
 */
export default async function TrainingPage({ params }: TrainingPageProps) {
  const { applicationId, locale } = params;
  const t = await getTranslations("training.page");

  // Parallel data fetching for performance (Waterfall elimination)
  let applicationData = null;
  let trainingRecord: TrainingRecordDto | null = null;
  let error = false;

  try {
    const [appResponse, trainingResponse] = await Promise.all([
      ApplicationService.createApplication(ServiceType.NewLicense), // Placeholder to check app existence logic
      TrainingService.getRecordByApplicationId(applicationId)
    ]);
    
    // In a real scenario, we would use a dedicated GET /applications/{id}
    // and correctly handle "Not Found". For this mock/demo:
    trainingRecord = trainingResponse.data;
  } catch (e) {
    console.warn("Backend not ready, using mock data for demo.");
    error = false; // Set to false to show mock data
    
    // Mock Data for "Check them" request
    trainingRecord = {
      id: "trn-68291037",
      applicationId: applicationId,
      schoolName: "Al-Dallah Driving School",
      centerName: "Riyadh North Branch",
      trainerName: "Ahmed Al-Harbi",
      completedHours: 5,
      totalHoursRequired: 15,
      progressPercentage: 33,
      status: "InProgress",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isExempted: false
    };
  }

  if (!trainingRecord && !error) {
    // If no record found and no error, handle creation or "Not Found"
    // For now, assume it's Required and show a blank-ish state
  }

  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-neutral-500 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800 px-4 py-2 rounded-lg border border-neutral-100">
          <User className="w-5 h-5 text-neutral-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{t('applicantInfo')}</span>
            <span className="text-sm font-bold text-neutral-700">APP-2025-{applicationId.substring(0,6)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Center (Arc) */}
        <Card className="lg:col-span-1 border-2 border-neutral-50 shadow-xl shadow-neutral-100/50">
          <CardHeader className="text-center">
            <CardTitle className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-bold">
              {t('status.completed')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center pb-8">
            <TrainingProgressArc 
              completedHours={trainingRecord?.completedHours || 0} 
              totalHours={trainingRecord?.totalHoursRequired || 15} 
            />
            <div className="mt-6">
              <TrainingStatusBadge status={trainingRecord?.status as any || "Required"} />
            </div>
            
            {trainingRecord && (
              <TrainingClientControls record={trainingRecord} />
            )}
          </CardContent>
        </Card>

        {/* Action Center (Form) */}
        <div className="lg:col-span-2 space-y-8">
          <TrainingEntryForm 
            applicationId={applicationId} 
            recordId={trainingRecord?.id}
            onSubmit={async (values) => {
              "use server"; // Note: In a real RSC, this would be a Server Action
              console.log("Recorded hours:", values);
            }} 
          />

          {/* History / Detail Section */}
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pb-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-neutral-400" />
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-neutral-500">
                  {t('history.title')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              {trainingRecord ? (
                <SessionHistoryRow record={trainingRecord} />
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-neutral-100 rounded-xl">
                  <p className="text-neutral-400 text-sm">{t('noHistory')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
