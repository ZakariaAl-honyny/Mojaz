"use client";

import { motion, useSpring, useTransform, useInView, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { 
  Users, 
  MapPin, 
  Clock, 
  UserCheck,
  ShieldCheck,
  Globe
} from "lucide-react";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const node = ref.current;
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate(value) {
          node.textContent = Math.round(value).toLocaleString() + suffix;
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  );
}

export function PlatformStats() {
  const stats = [
    { 
      id: "s1", 
      icon: Users, 
      value: 100, 
      suffix: "K+", 
      label: "رخصة إلكترونية صادرة",
      color: "#1a3a8f" 
    },
    { 
      id: "s2", 
      icon: MapPin, 
      value: 55, 
      label: "مركز معتمد للخدمة",
      color: "#D4A017"
    },
    { 
      id: "s3", 
      icon: Clock, 
      value: 15, 
      suffix: " دقيقة", 
      label: "متوسط وقت المعالجة",
      color: "#1a3a8f"
    },
    { 
      id: "s4", 
      icon: UserCheck, 
      value: 250, 
      suffix: "K+", 
      label: "طلب مكتمل بنجاح",
      color: "#D4A017"
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-[#0a0f1a]">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1a3a8f] opacity-[0.05] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4A017] opacity-[0.05] blur-[120px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 border border-white/10 text-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                  style={{ boxShadow: `0 20px 40px -10px ${stat.color}33` }}
                >
                  <stat.icon className="w-10 h-10" style={{ color: stat.color }} />
                </div>
                
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-neutral-500 group-hover:text-white transition-colors duration-500">
                    {stat.label}
                  </div>
                </div>
              </div>
              
              {/* Subtle underline accent */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] rounded-full transition-all duration-500 group-hover:w-[40%]" 
                style={{ backgroundColor: stat.color }}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Trust indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-30"
        >
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-6 h-6" />
             <span className="text-xs font-black uppercase tracking-widest text-white">نظام معتمد سيادياً</span>
          </div>
          <div className="flex items-center gap-3">
             <Globe className="w-6 h-6" />
             <span className="text-xs font-black uppercase tracking-widest text-white">التحول الرقمي الموحد</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
