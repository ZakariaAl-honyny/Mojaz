import { ApplicationWizard } from "@/components/domain/application/ApplicationWizard";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "application.create" });
  return {
    title: t("title") + " - Mojaz",
  };
}

export default function NewApplicationPage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <ApplicationWizard />
    </div>
  );
}
