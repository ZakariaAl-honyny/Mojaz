"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              checked: (child.props as any).value === value,
              onChange: (value: string) => onValueChange?.(value),
            });
          }
          return child;
        })}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    checked?: boolean;
    onChange?: (value: string) => void;
  }
>(({ className, checked, onChange, ...props }, ref) => {
  return (
    <input
      type="radio"
      ref={ref}
      checked={checked}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        "h-4 w-4 border border-neutral-300 dark:border-neutral-600 text-primary-500 focus:ring-2 focus:ring-primary-500",
        className
      )}
      {...props}
    />
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
