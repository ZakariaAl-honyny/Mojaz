import { getTranslations } from "next-intl/server";
import { ManagerReviewFlow } from "@/components/domain/application/ManagerReviewFlow";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "application" });
  return {
    title: `Sovereign Review - ${id} | DrivingLicenseIssuanceSystem`,
  };
}

export default async function ApplicationReviewPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id } = await params;

  // Mock data for showcase
  const application = {
    id,
    number: id,
    applicantName: "ZAKARIA MOHAMMED AL-HONONY",
    status: "InReview",
    type: "New License",
    category: "B",
  };

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto space-y-16">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 bg-primary-600/10 border border-primary-500/20 rounded-[1.5rem] flex items-center justify-center mb-4">
          <ShieldCheck className="w-10 h-10 text-primary-500" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
          Administrative Authority
        </h1>
        <p className="text-neutral-500 font-bold uppercase tracking-[0.3em] text-xs">
          Ministry of Transport & Logistics - Secure Review Portal
        </p>
      </div>

      <ManagerReviewFlow
        applicationId={application.number}
        applicantName={application.applicantName}
        onDecision={(decision, notes) => {
          console.log(`Decision: ${decision}, Notes: ${notes}`);
        }}
      />
    </div>
  );
}
