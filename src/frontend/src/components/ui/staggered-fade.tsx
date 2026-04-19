"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface StaggeredFadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}

export function StaggeredFade({
  children,
  className,
  delay = 0,
  stagger = 0.1,
}: StaggeredFadeProps) {
  const childArray = Array.isArray(children) ? children : [children];
  
  return (
    <div className={cn(className)}>
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            delay: delay + index * stagger,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

interface StaggeredItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggeredItem({ children, className }: StaggeredItemProps) {
  return <div className={cn(className)}>{children}</div>;
}