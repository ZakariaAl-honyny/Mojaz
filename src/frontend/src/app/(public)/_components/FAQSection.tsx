"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { 
      id: 1, 
      q: "كيف يمكنني التقديم على رخصة قيادة جديدة؟", 
      a: "يمكنك البدء بالضغط على 'ابدأ الآن' في القسم الرئيسي واتباع خطوات التسجيل عبر المنصة بكل سهولة." 
    },
    { 
      id: 2, 
      q: "ما هي الوثائق المطلوبة لتجديد الرخصة؟", 
      a: "عادة ما يكتفي بوجود هوية وطنية سارية المفعول وتقرير طبي حديث من مراكز معتمدة مربوطة بالنظام." 
    },
    { 
      id: 3, 
      q: "ماذا تشمل هذه النسخة الأولية من المنصة؟", 
      a: "هذه النسخة (MVP) تركز على الخدمات الجوهرية كإصدار وتجديد الرخص وبدل الفاقد. تم تأجيل بعض 'المكونات الأمامية' الإضافية والخدمات المتقدمة للمرحلة الثانية لضمان أقصى درجات الاستقرار." 
    },
  ];

  return (
    <section className="py-24 bg-neutral-50">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <ScrollReveal>
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 font-arabic ltr:font-english">
              الأسئلة الشائعة
            </h2>
            <div className="flex justify-center">
              <div className="h-1.5 w-12 bg-secondary-500 rounded-full" />
            </div>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal key={faq.id} delay={index * 0.1}>
                <div className="group border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-start gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${isOpen ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <span className={`text-lg font-bold font-arabic ltr:font-english transition-colors ${isOpen ? 'text-primary-600' : 'text-neutral-900'}`}>
                        {faq.q}
                      </span>
                    </div>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-secondary-500 text-neutral-900 rotate-180' : 'bg-neutral-100 text-neutral-500'}`}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-2 text-neutral-600 leading-relaxed border-t border-neutral-100 mt-4 mx-6">
                           <p className="pt-4">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
