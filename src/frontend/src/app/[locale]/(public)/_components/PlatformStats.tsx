"use client";

import { useTranslations } from "next-intl";
import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { 
  Users, 
  MapPin, 
  Clock, 
  UserCheck 
} from "lucide-react";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const spring = useSpring(0, {
    mass: 1,
    stiffness: 100,
    damping: 30,
  });
  
  const displayValue = useTransform(spring, (current) => 
    Math.round(current).toLocaleString() + suffix
  );

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return (
    <motion.span ref={ref} className="tabular-nums">
      {displayValue}
    </motion.span>
  );
}

export function PlatformStats() {
  const t = useTranslations("landing.stats");

  const stats = [
    { id: "s1", icon: Users, value: 4.2, suffix: "M+", labelKey: "active_licenses" },
    { id: "s2", icon: MapPin, value: 142, labelKey: "approved_centers" },
    { id: "s3", icon: Clock, value: 18, suffix: ` ${t("minutes")}`, labelKey: "processing_time" },
    { id: "s4", icon: UserCheck, value: 12, suffix: "M+", labelKey: "verified_citizens" },
  ];

  return (
    <section className="py-24 bg-white dark:bg-neutral-900 border-y border-neutral-100 dark:border-neutral-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center text-center space-y-4 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tighter">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-400 group-hover:text-secondary-500 transition-colors">
                  {t(stat.labelKey)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
