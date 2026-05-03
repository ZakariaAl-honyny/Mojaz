"use client";

import { motion } from "framer-motion";
import { 
  UserCheck, 
  Activity, 
  BookOpen, 
  FileText, 
  Car, 
  ShieldCheck 
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function WorkflowSection() {
  const steps = [
    { id: 1, icon: UserCheck, title: "التسجيل الرقمي", description: "قدم طلبك من خلال المنصة." },
    { id: 2, icon: Activity, title: "الفحص الطبي", description: "اكمل فحوصات اللياقة في المراكز المعتمدة." },
    { id: 3, icon: BookOpen, title: "مدرسة القيادة", description: "التحق ببرامج تدريب احترافية." },
    { id: 4, icon: FileText, title: "الاختبار النظري", description: "اجتز تقييم المعلومات الإلكتروني." },
    { id: 5, icon: Car, title: "الاختبار العملي", description: "أثبت مهاراتك في القيادة على الطريق." },
    { id: 6, icon: ShieldCheck, title: "إصدار الرخصة", description: "استلم رخصتك الرقمية والمطبوعة." },
  ];

  return (
    <section className="py-20 bg-[#1E3A8A] relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: "url('/noise.svg')" }} />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <ScrollReveal>
             <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white font-arabic ltr:font-english">
               رحلتك نحو الرخصة
             </h2>
          </ScrollReveal>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {steps.map((step, index) => (
              <ScrollReveal 
                key={step.id} 
                delay={index * 0.1}
                className="relative flex flex-col items-center text-center space-y-6 group"
              >
                {/* Step Circle */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-white/5 border-4 border-white/10 flex items-center justify-center text-white transition-all duration-500 group-hover:bg-[#D4A017] group-hover:border-[#D4A017]/30 group-hover:text-neutral-900 shadow-2xl">
                   <step.icon className="w-8 h-8" />
                   
                   {/* Step Number Badge */}
                   <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#D4A017] text-neutral-900 text-xs font-bold flex items-center justify-center border-2 border-[#1E3A8A] group-hover:bg-white transition-colors">
                     {step.id}
                   </div>
                </div>

                <div className="space-y-2 px-4">
                  <h3 className="text-xl font-bold text-white font-arabic ltr:font-english">
                    {step.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Mobile/Tablet Connecting Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center py-4">
                     <motion.div
                       animate={{ y: [0, 10, 0] }}
                       transition={{ duration: 2, repeat: Infinity }}
                       className="text-white/20"
                     >
                       ↓
                     </motion.div>
                  </div>
                )}
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Feature Callout at Bottom */}
        <ScrollReveal delay={0.8} className="mt-20 pt-10 border-t border-white/10 text-center">
           <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-secondary-500 font-bold">
             <ShieldCheck className="w-6 h-6" />
             <span>نظام مؤتمت بالكامل لضمان عدالة التقييم وسرعة الإنجاز</span>
           </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
