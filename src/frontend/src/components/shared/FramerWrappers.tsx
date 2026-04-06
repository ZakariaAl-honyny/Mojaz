'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react';

export const FadeIn = ({ children, delay = 0, ...props }: { children: React.ReactNode, delay?: number } & HTMLMotionProps<'div'>) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay }}
    {...props}
  >
    {children}
  </motion.div>
);

export const SlideUp = ({ children, delay = 0, distance = 20, ...props }: { children: React.ReactNode, delay?: number, distance?: number } & HTMLMotionProps<'div'>) => (
  <motion.div
    initial={{ opacity: 0, y: distance }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.21, 0.45, 0.32, 0.9] }}
    {...props}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({ children, delay = 0, ...props }: { children: React.ReactNode, delay?: number } & HTMLMotionProps<'div'>) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
    {...props}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ children, ...props }: { children: React.ReactNode } & HTMLMotionProps<'div'>) => (
  <motion.div
    initial="initial"
    animate="animate"
    variants={{
      animate: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    }}
    {...props}
  >
    {children}
  </motion.div>
);
