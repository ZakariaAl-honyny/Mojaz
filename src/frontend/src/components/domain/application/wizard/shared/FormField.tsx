'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormFieldProps {
  label: string;
  id: string;
  error?: { message?: string };
  children: React.ReactNode;
  className?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export function FormField({
  label,
  id,
  error,
  children,
  className,
  required,
  icon
}: FormFieldProps) {
  return (
    <div className={cn("space-y-3 font-arabic group", className)}>
      <div className="flex items-center justify-between px-1">
          <Label 
            htmlFor={id} 
            className={cn(
              "text-sm font-black transition-all duration-500 flex items-center gap-2",
              error ? "text-red-500" : "text-neutral-700 group-focus-within:text-[#1a3a8f]"
            )}
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
          
          <AnimatePresence>
              {!error && (
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.5 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="text-[9px] font-black text-emerald-500/40 uppercase tracking-[0.2em] flex items-center gap-1 opacity-0 group-focus-within:opacity-100 transition-opacity"
                  >
                      <ShieldCheck className="w-3 h-3" />
                      إدخال آمن
                  </motion.div>
              )}
          </AnimatePresence>
      </div>

      <div className="relative">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              id,
              name: (child.props as any).name || id,
              'aria-invalid': !!error,
              'aria-describedby': error ? `${id}-error` : undefined,
              className: cn(
                (child.props as any).className,
                "h-16 rounded-[1.25rem] border border-neutral-100 bg-neutral-50/50 px-8 font-bold transition-all duration-700 placeholder:text-neutral-300 focus-visible:ring-offset-0 focus-visible:ring-[6px] focus-visible:ring-[#1a3a8f]/5 shadow-sm",
                error 
                  ? "border-red-100 bg-red-50/30 ring-red-100 focus-visible:ring-red-500/5 focus-visible:border-red-500" 
                  : "hover:bg-white hover:border-[#1a3a8f]/20 focus-visible:bg-white focus-visible:border-[#1a3a8f] focus-visible:shadow-xl focus-visible:shadow-blue-900/5"
              )
            });
          }
          return child;
        })}
      </div>

      <AnimatePresence>
          {error?.message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id={`${id}-error`} 
              role="alert" 
              className="flex items-center gap-2 text-[10px] font-black text-red-500 px-2 uppercase tracking-[0.1em]"
            >
              <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
              {error.message}
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  error?: { message?: string };
  children: React.ReactNode;
  required?: boolean;
  icon?: React.ReactNode;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(({
  label,
  id,
  error,
  children,
  className,
  required,
  icon,
  ...props
}, ref) => {
  return (
    <FormField label={label} id={id} error={error} className={className} required={required}>
      <select
        ref={ref}
        id={id}
        name={props.name || id}
        className={cn(
          "flex h-16 w-full rounded-[1.25rem] border border-neutral-100 bg-neutral-50/50 px-8 text-sm font-bold transition-all duration-700",
          "appearance-none", // Remove default arrow
          "focus-visible:outline-none focus-visible:ring-[6px] focus-visible:ring-[#1a3a8f]/5 focus-visible:border-[#1a3a8f]",
          error ? "border-red-100 bg-red-50/30" : "hover:bg-white hover:border-[#1a3a8f]/20 focus-visible:bg-white"
        )}
        style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231a3a8f' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, 
            backgroundPosition: 'left 1.75rem center', 
            backgroundRepeat: 'no-repeat' 
        }}
        {...props}
      >
        {children}
      </select>
    </FormField>
  );
});

SelectField.displayName = 'SelectField';
