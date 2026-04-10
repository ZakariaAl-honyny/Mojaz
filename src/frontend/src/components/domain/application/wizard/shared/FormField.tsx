'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  id: string;
  error?: { message?: string };
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export function FormField({
  label,
  id,
  error,
  children,
  className,
  required
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label 
        htmlFor={id} 
        className={cn(
          "transition-colors",
          error && "text-status-error"
        )}
      >
        {label}
        {required && <span className="ms-1 text-status-error">*</span>}
      </Label>
      <div className="relative">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              id,
              'aria-invalid': !!error,
              'aria-describedby': error ? `${id}-error` : undefined,
              className: cn(
                (child.props as any).className,
                error && "border-status-error focus-visible:ring-status-error"
              )
            });
          }
          return child;
        })}
      </div>
      {error?.message && (
        <p 
          id={`${id}-error`} 
          role="alert" 
          className="text-xs text-status-error animate-in fade-in slide-in-from-top-1"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  error?: { message?: string };
  children: React.ReactNode;
}

export function SelectField({
  label,
  id,
  error,
  children,
  className,
  ...props
}: SelectFieldProps) {
  return (
    <FormField label={label} id={id} error={error} className={className}>
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors",
          "border-neutral-200 dark:border-neutral-700"
        )}
        {...props}
      >
        {children}
      </select>
    </FormField>
  );
}
