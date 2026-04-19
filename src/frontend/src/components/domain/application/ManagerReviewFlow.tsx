"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  UserCheck, 
  X, 
  Check, 
  AlertTriangle, 
  FileText, 
  Activity, 
  ClipboardList,
  History,
  MessageSquare,
  BadgeCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ManagerReviewFlowProps {
  applicationId: string;
  applicantName: string;
  onDecision: (decision: "approve" | "reject", notes: string) => void;
}

export function ManagerReviewFlow({ applicationId, applicantName, onDecision }: ManagerReviewFlowProps) {
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (!decision) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => onDecision(decision, notes), 2000);
    }, 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      <AnimatePresence mode="wait">
        {!showSuccess ? (
          <motion.div
            key="interface"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-10"
          >
            {/* Sovereign Header */}
            <div className="flex justify-between items-end bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl">
               <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/10 border border-primary-500/30 text-[10px] font-black uppercase tracking-widest text-primary-400">
                     <ShieldCheck className="w-3.5 h-3.5" />
                     Sovereign Review Session
                  </div>
                  <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                     Reviewing: {applicationId}
                  </h1>
                  <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Applicant: {applicantName}</p>
               </div>
               <div className="text-end">
                  <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Queue Priority</p>
                  <p className="text-2xl font-black text-primary-500">EXPRESS</p>
               </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
               {/* Validation Section */}
               <Card className="gov-glass-panel rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                  <CardHeader className="p-8 pb-4">
                     <CardTitle className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                        <ClipboardList className="w-6 h-6 text-primary-500" />
                        Verification Checklist
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-4 space-y-4">
                     {[
                        { label: "Identity Document Integrity", status: "Verified" },
                        { label: "Medical Verification Status", status: "Verified" },
                        { label: "Theory Examination Result", status: "Verified (Pass)" },
                        { label: "Financial Settlement Confirmation", status: "Verified" },
                     ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-5 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/10 transition-all">
                           <span className="font-bold text-neutral-400 group-hover:text-white transition-colors">{item.label}</span>
                           <div className="flex items-center gap-2 text-primary-500">
                              <Check className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                           </div>
                        </div>
                     ))}
                  </CardContent>
               </Card>

               {/* Decision Section */}
               <div className="space-y-8">
                  <Card className="gov-glass-panel rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                     <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                           <BadgeCheck className="w-6 h-6 text-primary-500" />
                           Final Decision
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="p-8 pt-4 space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                           <button 
                              onClick={() => setDecision("approve")}
                              className={cn(
                                 "relative h-32 rounded-[2rem] flex flex-col items-center justify-center gap-3 border-2 transition-all duration-500",
                                 decision === "approve" 
                                    ? "bg-primary-600 border-primary-400 text-white shadow-[0_20px_40px_rgba(0,108,53,0.3)] scale-105" 
                                    : "bg-white/5 border-white/5 text-neutral-500 hover:bg-white/10"
                              )}
                           >
                              <Check className={cn("w-8 h-8", decision === "approve" ? "text-white" : "text-neutral-600")} />
                              <span className="font-black uppercase tracking-widest text-[10px]">Approve Issuance</span>
                           </button>

                           <button 
                              onClick={() => setDecision("reject")}
                              className={cn(
                                 "relative h-32 rounded-[2rem] flex flex-col items-center justify-center gap-3 border-2 transition-all duration-500",
                                 decision === "reject" 
                                    ? "bg-red-600 border-red-400 text-white shadow-[0_20px_40px_rgba(239,68,68,0.3)] scale-105" 
                                    : "bg-white/5 border-white/5 text-neutral-500 hover:bg-white/10"
                              )}
                           >
                              <X className={cn("w-8 h-8", decision === "reject" ? "text-white" : "text-neutral-600")} />
                              <span className="font-black uppercase tracking-widest text-[10px]">Reject Application</span>
                           </button>
                        </div>

                        <div className="space-y-4">
                           <div className="flex items-center justify-between px-1">
                              <label className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Decision Rationale (Audit Log)</label>
                              <MessageSquare className="w-4 h-4 text-neutral-600" />
                           </div>
                           <textarea 
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Describe the rationale for this administrative decision..."
                              className="w-full h-32 bg-white/5 border border-white/10 rounded-[2rem] p-6 text-white text-sm focus:ring-2 focus:ring-primary-500/50 outline-none resize-none transition-all placeholder:text-neutral-600"
                           />
                        </div>

                        <Button 
                           onClick={handleSubmit}
                           disabled={!decision || isSubmitting}
                           className="w-full h-16 rounded-[1.5rem] bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-neutral-200 transition-all disabled:opacity-20"
                        >
                           {isSubmitting ? (
                              <div className="flex items-center gap-3">
                                 <Activity className="w-4 h-4 animate-pulse" />
                                 Transmitting Authority
                              </div>
                           ) : (
                              "Execute Sovereign Decision"
                           )}
                        </Button>
                     </CardContent>
                  </Card>

                  <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center gap-4">
                     <AlertTriangle className="w-6 h-6 text-red-500 opacity-50" />
                     <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest leading-relaxed">
                        Irreversible administrative action. This decision will be logged in the National Civil Registry database.
                     </p>
                  </div>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl space-y-10"
          >
             <div className="w-32 h-32 bg-primary-600 rounded-[3rem] flex items-center justify-center shadow-[0_32px_64px_rgba(0,108,53,0.5)]">
                <ShieldCheck className="w-16 h-16 text-white" />
             </div>
             <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Authority Logged</h2>
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Decision ID: MOJ-DEC-{Math.random().toString(36).substring(7).toUpperCase()}</p>
             </div>
             <div className="flex items-center gap-3 text-primary-500">
                <Activity className="w-5 h-5 animate-pulse" />
                <span className="font-black uppercase tracking-widest text-[10px]">Synchronizing Registries...</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
