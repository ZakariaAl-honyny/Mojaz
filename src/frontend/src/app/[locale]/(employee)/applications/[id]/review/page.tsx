"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { 
  FileText, 
  User, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail,
  ShieldCheck,
  XCircle,
  Clock,
  ChevronLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/domain/application/StatusBadge";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ApplicationReviewPage() {
  const { id, locale } = useParams();
  const t = useTranslations("applications.employee.review");
  const [remarks, setRemarks] = useState("");

  // Mock application details
  const app = {
    number: "MOJ-2025-48291037",
    applicant: {
      name: "Ahmed Abdullah",
      nationalId: "1028493821",
      dob: "1990-05-15",
      phone: "+966 50 123 4567",
      email: "ahmed.a@gmail.com",
      address: "Al-Olaya District, Riyadh"
    },
    service: "New License",
    category: "Private Car",
    status: "InReview",
    documents: [
      { name: "National ID Copy", status: "Approved", url: "#" },
      { name: "Medical Exam Report", status: "Pending", url: "#" },
    ]
  };

  return (
    <div className="space-y-12 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-2">
           <Link href={`/${locale}/applications`} className="inline-flex items-center gap-2 text-primary-500 font-black mb-4 hover:translate-x-[-4px] transition-all uppercase tracking-widest text-xs">
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              Return to Queue
           </Link>
           <div className="flex items-center gap-4">
              <h1 className="text-5xl font-black text-neutral-900 tracking-tight leading-none uppercase">
                {t("title")}
              </h1>
              <StatusBadge status={app.status} className="h-8 font-black uppercase tracking-widest" />
           </div>
           <p className="text-lg text-neutral-500 max-w-xl font-medium leading-relaxed italic">
              {t("subtitle", { number: app.number })}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
           {/* Section 1: Applicant Info */}
           <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white p-2">
              <CardHeader className="p-10 pb-4">
                 <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-900 uppercase tracking-tight">
                    <User className="w-8 h-8 text-primary-500" />
                    {t("applicantInfo")}
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-10 pt-0 grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">Full Name</Label>
                    <p className="text-xl font-bold text-neutral-800">{app.applicant.name}</p>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">National ID</Label>
                    <p className="text-xl font-mono font-black text-primary-700">{app.applicant.nationalId}</p>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">Phone Number</Label>
                    <div className="flex items-center gap-3 font-bold text-neutral-800">
                        <Phone className="w-4 h-4 text-neutral-300" />
                        {app.applicant.phone}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">Email Address</Label>
                    <div className="flex items-center gap-3 font-bold text-neutral-800">
                        <Mail className="w-4 h-4 text-neutral-300" />
                        {app.applicant.email}
                    </div>
                 </div>
                 <div className="md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">National Address</Label>
                    <div className="flex items-center gap-3 font-bold text-neutral-800 italic">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        {app.applicant.address}
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Section 2: Documents */}
           <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white p-2">
              <CardHeader className="p-10 pb-4">
                 <CardTitle className="text-2xl font-black flex items-center gap-4 text-neutral-900 uppercase tracking-tight">
                    <FileText className="w-8 h-8 text-primary-500" />
                    {t("documents")}
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-10 pt-0 space-y-4">
                 {app.documents.map((doc, i) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-neutral-50 rounded-3xl border border-neutral-100 group hover:border-primary-200 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-3 shadow-md group-hover:scale-110 transition-transform">
                              <FileText className="w-full h-full text-neutral-400 group-hover:text-primary-500 transition-colors" />
                           </div>
                           <div>
                              <p className="font-bold text-lg text-neutral-800 truncate max-w-[200px]">{doc.name}</p>
                              <StatusBadge status={doc.status} className="text-[10px]" showIcon={false} />
                           </div>
                        </div>
                        <Button variant="outline" className="mt-4 md:mt-0 rounded-xl bg-white border-none shadow-lg font-black uppercase text-xs tracking-widest h-12 px-6 hover:bg-black hover:text-white transition-all">
                           View Content
                        </Button>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </div>

        <div className="space-y-10">
           {/* Section 3: Decision */}
           <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-neutral-900 p-2 text-white relative">
              <CardHeader className="p-10 pb-4 border-b border-white/5">
                 <CardTitle className="text-2xl font-black uppercase tracking-tight">
                    {t("decision")}
                 </CardTitle>
                 <CardDescription className="text-neutral-500 font-medium italic mt-2">Executive authority requires validation of all prerequisites.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-8 space-y-8">
                 <div className="space-y-4">
                    <Label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">{t("remarks")}</Label>
                    <textarea 
                        className="w-full bg-white/5 rounded-3xl border border-white/10 p-6 font-bold text-white placeholder:text-neutral-700 h-40 focus:outline-none focus:border-primary-500 transition-all text-sm"
                        placeholder={t("remarksPlaceholder")}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                    />
                 </div>
                 
                 <div className="grid grid-cols-1 gap-4 pt-4">
                    <Button className="h-16 rounded-[2rem] bg-primary-500 hover:bg-primary-600 font-black text-lg gap-4 shadow-2xl shadow-primary-500/20 transition-all hover:scale-[1.02]">
                       <ShieldCheck className="w-6 h-6" />
                       {t("approve")}
                    </Button>
                    <Button variant="outline" className="h-16 rounded-[2rem] border-white/10 bg-transparent hover:bg-red-500 hover:border-red-500 font-black text-lg gap-4 transition-all">
                       <XCircle className="w-6 h-6" />
                       {t("reject")}
                    </Button>
                 </div>
              </CardContent>
           </Card>

           {/* History */}
           <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white p-2">
              <CardHeader className="p-10 pb-4">
                 <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary-500" />
                    {t("history")}
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-10 pt-0 space-y-8">
                 {[
                   { user: "System", action: "Assigned to queue", time: "2h ago" },
                   { user: "Ahmed A.", action: "Submitted Application", time: "2h ago" }
                 ].map((h, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-neutral-50 pb-4 last:border-0 last:pb-0 group">
                       <div>
                          <p className="font-black text-neutral-900 group-hover:text-primary-500 transition-colors uppercase tracking-tight">{h.action}</p>
                          <p className="text-[10px] font-medium text-neutral-400 italic">Performed by <span className="font-bold text-neutral-600">{h.user}</span></p>
                       </div>
                       <span className="text-[10px] font-black text-neutral-300 italic">{h.time}</span>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
