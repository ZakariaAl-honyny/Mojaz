"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StaggeredFadeProps {
  children: ReactNode;
  delay?: number;
  staggerDelay?: number;
  className?: string;
}

export function StaggeredFade({
  children,
  delay = 0,
  staggerDelay = 0.1,
  className = "",
}: StaggeredFadeProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const StaggeredItem = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);
