'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: "ما هي المتطلبات الأساسية للحصول على رخصة قيادة؟",
    answer: "يجب ألا يقل العمر عن ١٨ عاماً (أو ١٦ للدراجات النارية)، وتوفير فحص طبي معتمد من المراكز الطبية التابعة للمرور، بالإضافة إلى صورة من البطاقة الشخصية وإثبات السكن.",
  },
  {
    question: "كم تستغرق عملية إصدار الرخصة عبر المنصة؟",
    answer: "في حال اكتمال جميع المتطلبات واجتياز الاختبارات، يتم إصدار الرخصة رقمياً فوراً، ويمكن استلام النسخة المطبوعة من أقرب مركز مرور خلال ٢٤ ساعة.",
  },
  {
    question: "هل يمكنني تجديد رخصتي المنتهية منذ سنوات؟",
    answer: "نعم، يمكنك التقديم على تجديد الرخصة عبر المنصة، وسيتم احتساب الغرامات المقررة قانوناً إن وجدت، مع ضرورة إجراء فحص طبي جديد.",
  },
  {
    question: "كيف يتم سداد الرسوم الحكومية؟",
    answer: "توفر المنصة خيارات سداد رقمية متعددة تشمل المحافظ الإلكترونية والحوالات البنكية المباشرة عبر نظام سداد الموحد.",
  },
  {
    question: "ماذا افعل إذا رُفع طلبي؟",
    answer: "في حالة رفض الطلب، ستصلك رسالة نصية وإشعار تفصيلي عبر المنصة يوضح سبب الرفض والخطوات المطلوبة لتصحيح الوضع وإعادة التقديم.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-background font-arabic" dir="rtl">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12 space-y-3">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-[#1a3a8f]/8 text-[#1a3a8f] text-xs font-bold tracking-widest border border-[#1a3a8f]/15"
            >
              مركز المساعدة
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-3xl md:text-4xl font-black text-[#0f1e4a] tracking-tight"
            >
              الأسئلة الشائعة
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="text-base text-neutral-500 font-semibold"
            >
              إجابات واضحة على أكثر الأسئلة تكراراً من المراجعين
            </motion.p>
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07 }}
                  className={cn(
                    "rounded-xl border transition-all duration-300 overflow-hidden",
                    isOpen
                      ? "border-[#1a3a8f]/25 bg-white shadow-md shadow-[#1a3a8f]/6"
                      : "border-border bg-card hover:border-[#1a3a8f]/15 hover:bg-white"
                  )}
                >
                  <button
                    onClick={() => setActiveIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-start group"
                  >
                    <span className={cn(
                      "text-base font-bold leading-snug transition-colors duration-300",
                      isOpen ? "text-[#1a3a8f]" : "text-neutral-800 group-hover:text-[#1a3a8f]"
                    )}>
                      {faq.question}
                    </span>
                    <div className={cn(
                      "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300",
                      isOpen
                        ? "bg-[#1a3a8f] border-[#1a3a8f] text-white"
                        : "border-border text-neutral-400 group-hover:border-[#1a3a8f]/30 group-hover:text-[#1a3a8f]"
                    )}>
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        isOpen ? "rotate-180" : ""
                      )} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <div className="px-6 pb-6 pt-0">
                          <div className="border-t border-border pt-4">
                            <p className="text-sm text-neutral-500 font-semibold leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
