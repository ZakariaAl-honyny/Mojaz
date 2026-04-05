import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApplicationCard } from "@/components/domain/application/ApplicationCard";
import { FileKey2, CalendarClock, BellRing, UserCircle, Plus } from "lucide-react";
import Link from "next/link";
import { ApplicationStatus } from "@/types/api.types";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale });
  return {
    title: `${t("navigation.dashboard")} | Mojaz`,
  };
}

export default async function ApplicantDashboardPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale });

  // Mock data for MVP showcase
  const user = { name: "Ahmed Abdullah" };
  const mockApplications = [
    {
      id: "a1b2c3d4",
      number: "MOJ-2025-48291037",
      categoryNameKey: "privateCar",
      status: "InReview" as ApplicationStatus,
      currentStage: "02: Document Review",
      updatedAt: "2025-01-10T08:30:00Z"
    },
    {
      id: "b2c3d4e5",
      number: "MOJ-2025-11223344",
      categoryNameKey: "motorcycle",
      status: "Draft" as ApplicationStatus,
      currentStage: "01: Application Creation",
      updatedAt: "2025-01-12T10:15:00Z"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-950">
            {t("dashboard.greeting")}, <span className="text-secondary-600">{user.name}</span>
          </h1>
          <p className="text-neutral-500 mt-1">{t("dashboard.timelineSubtitle")}</p>
        </div>
        <Link href={`/${locale}/applications/new`}>
          <Button className="bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/20 px-6 gap-2 h-11">
             <Plus className="w-5 h-5" />
             {t("dashboard.createNewApplication")}
          </Button>
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-blue-50/50">
          <CardContent className="p-5 flex flex-col gap-2">
             <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <FileKey2 className="w-5 h-5" />
             </div>
             <p className="text-sm font-medium text-neutral-500">{t("dashboard.activeApplications")}</p>
             <p className="text-2xl font-bold text-neutral-900">2</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-purple-50/50">
          <CardContent className="p-5 flex flex-col gap-2">
             <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <CalendarClock className="w-5 h-5" />
             </div>
             <p className="text-sm font-medium text-neutral-500">{t("dashboard.nextAppointment")}</p>
             <p className="text-lg font-bold text-neutral-900 line-clamp-1">—</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-orange-50/50">
          <CardContent className="p-5 flex flex-col gap-2">
             <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                <BellRing className="w-5 h-5" />
             </div>
             <p className="text-sm font-medium text-neutral-500">{t("navigation.notifications")}</p>
             <p className="text-2xl font-bold text-neutral-900">3</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-green-50/50">
          <CardContent className="p-5 flex flex-col gap-2">
             <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <UserCircle className="w-5 h-5" />
             </div>
             <p className="text-sm font-medium text-neutral-500">{t("dashboard.profileStatus")}</p>
             <p className="text-sm font-bold text-green-700 mt-1.5 px-2 py-0.5 bg-green-100 rounded self-start">مكتمل</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Applications Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
           <FileKey2 className="w-5 h-5 text-primary-500" />
           {t("dashboard.activeApplications")}
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-4">
           {mockApplications.map(app => (
              <ApplicationCard 
                key={app.id}
                id={app.id}
                number={app.number}
                categoryNameKey={app.categoryNameKey}
                status={app.status}
                currentStage={app.currentStage}
                updatedAt={app.updatedAt}
                locale={locale}
              />
           ))}
        </div>
      </div>

    </div>
  );
}
