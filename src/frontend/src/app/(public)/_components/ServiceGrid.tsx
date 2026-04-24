"use client";

import { motion } from "framer-motion";
import { 
  FilePlus, 
  RotateCcw, 
  Copy, 
  ArrowUpCircle, 
  Globe, 
  Tractor, 
  Clock, 
  GraduationCap 
} from "lucide-react";
import Link from "next/link";
import { StaggeredFade, StaggeredItem } from "@/components/ui/StaggeredFade";

export function ServiceGrid() {
  const services = [
    { 
      id: "new", 
      icon: FilePlus, 
      title: "إصدار رخصة جديدة", 
      description: "ابدأ إجراءات الحصول على رخصة قيادة لأول مرة وفق المعايير الوطنية.", 
      href: "/applications/new" 
    },
    { 
      id: "renewal", 
      icon: RotateCcw, 
      title: "تجديد رخصة القيادة", 
      description: "خدمة تجديد الرخص المنتهية أو التي أوشكت على الانتهاء إلكترونياً.", 
      href: "/applications/new?service=renewal" 
    },
    { 
      id: "replacement", 
      icon: Copy, 
      title: "بدل فاقد / تالف", 
      description: "استخراج نسخة بديلة للرخص المفقودة أو التالفة في وقت قياسي.", 
      href: "/applications/new?service=replacement" 
    },
    { 
      id: "upgrade", 
      icon: ArrowUpCircle, 
      title: "ترقية فئة الرخصة", 
      description: "إضافة فئات جديدة إلى رخصتك الحالية (من خصوصي إلى نقل عام إلخ).", 
      href: "/applications/new?service=upgrade" 
    },
    { 
      id: "agricultural", 
      icon: Tractor, 
      title: "المعدات والجرارات", 
      description: "تراخيص خاصة لقيادة المعدات الزراعية والإنشائية والآلات الثقيلة.", 
      href: "/applications/new?service=agricultural" 
    },
    { 
      id: "probationary", 
      icon: Clock, 
      title: "الرخص المؤقتة", 
      description: "إصدار ومتابعة تصاريح القيادة المؤقتة للفئات المستحقة.", 
      href: "/applications/new?service=probationary" 
    },
    { 
      id: "learner", 
      icon: GraduationCap, 
      title: "تصاريح التعلم", 
      description: "خدمات المتقدمين للمدارس والتعلم تحت إشراف المراكز المعتمدة.", 
      href: "/applications/new?service=learner" 
    },
    { 
      id: "international", 
      icon: Globe, 
      title: "الرخص الدولية", 
      description: "اعتماد وتوثيق الرخص الدولية للعمل بها داخل وخارج الجمهورية.", 
      href: "/applications/new?service=international" 
    },
  ];

  return (
    <section className="py-32 bg-[#f8fafc]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 space-y-6">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#1a3a8f] font-arabic leading-tight">
            الخدمات الإلكترونية الشاملة
          </h2>
          <p className="text-lg text-neutral-500 font-bold max-w-2xl">
            بوابة الإدارة العامة للمرور لتسهيل كافة إجراءات رخص القيادة عبر رحلة رقمية متكاملة توفر الوقت والجهد.
          </p>
          <div className="w-24 h-1.5 bg-[#D4A017] rounded-full" />
        </div>

        <StaggeredFade className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <StaggeredItem key={service.id}>
              <Link 
                href={service.href}
                className="group relative block h-full p-10 bg-white border border-neutral-100 rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(26,58,143,0.1)] hover:-translate-y-2 overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#1a3a8f]/[0.02] rounded-bl-[100%] transition-all duration-500 group-hover:scale-150 group-hover:bg-[#1a3a8f]/[0.05]" />
                
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-50 text-[#1a3a8f] group-hover:bg-[#1a3a8f] group-hover:text-white transition-all duration-500 shadow-sm">
                    <service.icon className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-neutral-900 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-6 flex items-center justify-between">
                     <span className="text-xs font-black uppercase tracking-widest text-neutral-400 group-hover:text-[#D4A017] transition-colors">ابدأ الآن</span>
                     <div className="w-10 h-10 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-300 group-hover:border-[#1a3a8f] group-hover:text-[#1a3a8f] transition-all duration-500">
                        <span className="text-xl font-light scale-150 rtl:rotate-180">→</span>
                     </div>
                  </div>
                </div>
              </Link>
            </StaggeredItem>
          ))}
        </StaggeredFade>
      </div>
    </section>
  );
}

