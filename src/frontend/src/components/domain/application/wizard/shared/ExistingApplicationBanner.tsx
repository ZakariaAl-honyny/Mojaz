"use client";

import { useRouter } from "next/navigation";
import { useApplicationWizard } from "@/hooks/useApplicationWizard";
import { useWizardStore } from "@/stores/wizard-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";

interface ExistingApplicationBannerProps {
  applicationNumber: string;
  status: string;
}

export function ExistingApplicationBanner({
  applicationNumber,
  status,
}: ExistingApplicationBannerProps) {
  const t = useTranslations("wizard");
  const router = useRouter();
  const { resetWizard } = useWizardStore();

  const handleViewApplication = () => {
    resetWizard();
    router.push(`/applications/${applicationNumber}`);
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8 border-primary-200 bg-primary-50 dark:bg-primary-900/20">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <CardTitle className="text-xl text-primary-900 dark:text-primary-100">
          {t("existingApp.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-neutral-600 dark:text-neutral-300">
          {t("existingApp.applicationNumber", { number: applicationNumber })}
        </p>
        <p className="text-neutral-600 dark:text-neutral-300">
          {t("existingApp.status", { status })}
        </p>
        <Button
          onClick={handleViewApplication}
          className="bg-primary-500 hover:bg-primary-600"
        >
          {t("existingApp.viewApplication")}
        </Button>
      </CardContent>
    </Card>
  );
}
