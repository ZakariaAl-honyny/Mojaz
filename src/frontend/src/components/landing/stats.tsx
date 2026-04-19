"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";

const stats = [
  { value: 150000, labelKey: "statsLicensesIssued", suffix: "+" },
  { value: 50000, labelKey: "statsActiveUsers", suffix: "+" },
  { value: 98, labelKey: "statsSuccessRate", suffix: "%" },
  { value: 3, labelKey: "statsProcessingTime", suffix: "" },
];

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!start) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);
  
  return count;
}

function StatItem({ value, labelKey, suffix }: { value: number; labelKey: string; suffix: string }) {
  const t = useTranslations("landing");
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 2000, isVisible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-2">
        {formatNumber(count)}{suffix}
      </div>
      <p className="text-primary-foreground/80 text-lg">{t(labelKey)}</p>
    </div>
  );
}

export function Stats() {
  const t = useTranslations("landing");

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-primary via-primary to-accent">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl mb-4">
            {t("statsTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              labelKey={stat.labelKey}
              suffix={stat.suffix}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
