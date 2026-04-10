'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WizardErrorDisplayProps {
  error: any;
  onRetry: () => void;
  errorMessage: string;
  retryLabel: string;
}

export default function WizardErrorDisplay({
  error,
  onRetry,
  errorMessage,
  retryLabel
}: WizardErrorDisplayProps) {
  if (!error) return null;

  return (
    <div
      role="alert"
      className="p-4 rounded-gov bg-status-error/10 border border-status-error/30 dark:bg-status-error/20 mb-6 animate-in zoom-in-95 duration-200"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-status-error">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            {errorMessage}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            onRetry();
          }}
          className="bg-white dark:bg-neutral-800 border-status-error/50 hover:bg-status-error/5 w-full sm:w-auto"
        >
          <RefreshCw className="w-4 h-4 me-2" />
          {retryLabel}
        </Button>
      </div>
    </div>
  );
}
