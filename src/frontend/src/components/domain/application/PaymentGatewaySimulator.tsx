"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ShieldCheck, Lock, CheckCircle2, ArrowRight, Loader2, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentGatewaySimulatorProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentGatewaySimulator({ amount, onSuccess, onCancel }: PaymentGatewaySimulatorProps) {
  const [step, setStep] = useState<"entry" | "processing" | "success">("entry");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePay = () => {
    setStep("processing");
    setTimeout(() => setStep("success"), 3000);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-3xl"
        onClick={onCancel}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl"
      >
        <Card className="gov-glass-panel rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)]">
           <CardContent className="p-0">
              <AnimatePresence mode="wait">
                 {step === "entry" && (
                   <motion.div 
                    key="entry"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-12 space-y-10"
                   >
                      <div className="flex justify-between items-start">
                         <div className="space-y-2">
                            <h2 className="text-4xl font-black text-white tracking-tighter">Sovereign Link</h2>
                            <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Secure Financial Settlement</p>
                         </div>
                         <div className="w-16 h-16 bg-primary-600/10 border border-primary-500/20 rounded-2xl flex items-center justify-center">
                            <Landmark className="w-8 h-8 text-primary-500" />
                         </div>
                      </div>

                      <div className="relative group perspective-1000">
                         <div className="w-full aspect-[1.586/1] rounded-[2rem] bg-gradient-to-br from-neutral-800 to-neutral-950 p-8 flex flex-col justify-between border border-white/10 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 blur-[60px]" />
                            <div className="flex justify-between items-center">
                               <div className="w-12 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-md opacity-80" />
                               <div className="flex gap-2">
                                  <div className="w-8 h-8 rounded-full bg-red-500 opacity-60" />
                                  <div className="w-8 h-8 rounded-full bg-orange-500 -ml-4 opacity-60" />
                               </div>
                            </div>
                            <div className="space-y-4">
                               <p className="text-2xl font-mono text-white tracking-[0.2em]">{cardNumber.padEnd(16, "•").replace(/(.{4})/g, "$1 ")}</p>
                               <div className="flex justify-between items-end">
                                  <div>
                                     <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mb-1">Card Holder</p>
                                     <p className="text-xs font-black text-white uppercase uppercase">National System Account</p>
                                  </div>
                                  <div className="text-end">
                                     <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mb-1">CVV</p>
                                     <p className="text-xs font-black text-white font-mono">{cvv.padEnd(3, "•")}</p>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-primary-500 uppercase tracking-widest px-1">Card Number</label>
                               <input 
                                  value={cardNumber}
                                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                                  className="h-14 w-full bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-mono focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                                  placeholder="0000 0000 0000 0000"
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-primary-500 uppercase tracking-widest px-1">CVV</label>
                               <input 
                                  value={cvv}
                                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                                  className="h-14 w-full bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-mono focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                                  placeholder="•••"
                               />
                            </div>
                         </div>

                         <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Total Transaction Value</p>
                               <p className="text-3xl font-black text-white">{amount} SAR</p>
                            </div>
                            <div className="flex gap-2 text-primary-500">
                               <ShieldCheck className="w-5 h-5" />
                               <span className="text-[10px] font-black uppercase tracking-widest">PCI DSS Compliant</span>
                            </div>
                         </div>

                         <Button 
                            onClick={handlePay}
                            disabled={cardNumber.length < 16}
                            className="h-16 w-full rounded-[1.5rem] bg-primary-600 hover:bg-primary-500 text-white font-black uppercase tracking-widest text-sm shadow-[0_20px_40px_rgba(0,108,53,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
                         >
                            Authorize Settlement
                         </Button>
                      </div>
                   </motion.div>
                 )}

                 {step === "processing" && (
                    <motion.div 
                       key="processing"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="p-20 text-center space-y-12"
                    >
                       <div className="relative w-24 h-24 mx-auto">
                          <Loader2 className="w-24 h-24 text-primary-500 animate-spin opacity-20" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Lock className="w-8 h-8 text-primary-400 animate-pulse" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Securing Interchange</h3>
                          <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Awaiting Global Financial Response</p>
                       </div>
                    </motion.div>
                 )}

                 {step === "success" && (
                    <motion.div 
                       key="success"
                       initial={{ scale: 0.9, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       className="p-20 text-center space-y-12"
                    >
                       <div className="w-32 h-32 bg-primary-600 rounded-[3rem] mx-auto flex items-center justify-center shadow-[0_20px_60px_rgba(0,108,53,0.5)]">
                          <CheckCircle2 className="w-16 h-16 text-white" />
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-4xl font-black text-white tracking-tighter uppercase">Success</h3>
                          <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Transaction ID: TX-MOJ-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                       </div>
                       <Button 
                          onClick={onSuccess}
                          className="h-16 px-12 rounded-[1.2rem] bg-white text-black hover:bg-neutral-200 font-black uppercase tracking-widest text-sm w-full transition-all"
                       >
                          Return to Portal
                          <ArrowRight className="w-5 h-5 rtl:rotate-180 ml-3" />
                       </Button>
                    </motion.div>
                 )}
              </AnimatePresence>
           </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
