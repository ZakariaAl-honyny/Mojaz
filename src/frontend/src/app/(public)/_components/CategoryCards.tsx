"use client";

import { motion } from "framer-motion";
import { 
  Bike, 
  Car, 
  Bus, 
  Truck, 
  HardHat, 
  Tractor 
} from "lucide-react";
import { StaggeredFade, StaggeredItem } from "@/components/ui/StaggeredFade";

export function CategoryCards() {
  const categories = [
    { code: "A", icon: Bike, age: 16, title: "الدراجات النارية", desc: "دراجات آلية ذات عجلتين أو أكثر" },
    { code: "B", icon: Car, age: 18, title: "المركبات الخصوصية", desc: "سيارات الركوب الخصوصي والتحميل الخفيف" },
    { code: "C", icon: Bus, age: 21, title: "النقل العام", desc: "حافلات نقل الركاب المتوسطة والكبيرة" },
    { code: "D", icon: Truck, age: 21, title: "المركبات الثقيلة", desc: "شاحنات النقل الثقيل والمعدات الكبيرة" },
    { code: "E", icon: HardHat, age: 21, title: "المعدات الإنشائية", desc: "معدات الأشغال العامة والإنشاءات" },
    { code: "F", icon: Tractor, age: 18, title: "الآلات الزراعية", desc: "الجرارات والآلات الزراعية المتحركة" },
  ];

  return (
    <section id="categories" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 px-4">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#1a3a8f] font-arabic">
              فئات الرخص المتاحة
            </h2>
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">نظام التصنيف الموحد • الجمهورية اليمنية</p>
          </div>
          <div className="h-1.5 w-32 bg-[#1a3a8f] rounded-full hidden md:block" />
        </div>

        <StaggeredFade className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <StaggeredItem key={category.code}>
              <div className="group relative p-10 bg-neutral-50 border border-neutral-100 rounded-[2.5rem] transition-all duration-500 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(26,58,143,0.12)] hover:border-[#1a3a8f]/10">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-20 h-20 rounded-3xl bg-white border border-neutral-100 flex items-center justify-center text-[#1a3a8f] group-hover:bg-[#1a3a8f] group-hover:text-white transition-all duration-500 transform group-hover:-rotate-6 shadow-sm group-hover:shadow-xl group-hover:shadow-[#1a3a8f]/30">
                    <category.icon className="w-10 h-10" />
                  </div>
                  <span className="text-6xl font-black text-neutral-200 group-hover:text-[#1a3a8f]/5 transition-colors duration-500">
                    {category.code}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-neutral-900">
                    {category.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {category.desc}
                  </p>
                  
                  <div className="pt-4 flex items-center gap-4">
                    <div className="px-4 py-2 rounded-xl bg-white border border-neutral-100 text-[#D4A017] text-xs font-black shadow-sm">
                      السن +{category.age} عاماً
                    </div>
                    <div className="h-px flex-1 bg-neutral-100" />
                  </div>
                </div>
              </div>
            </StaggeredItem>
          ))}
        </StaggeredFade>
      </div>
    </section>
  );
}
