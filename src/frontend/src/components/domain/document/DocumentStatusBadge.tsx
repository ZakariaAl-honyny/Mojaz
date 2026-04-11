// Document Status Badge Component

'use client';

import { useTranslations } from 'next-intl';
import { DocumentStatus } from '@/types/document.types';

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export function DocumentStatusBadge({ status, className = '' }: DocumentStatusBadgeProps) {
  const t = useTranslations('document.status');

  const getStatusConfig = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.Pending:
        return {
          label: t('pending'),
          className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        };
      case DocumentStatus.Approved:
        return {
          label: t('approved'),
          className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        };
      case DocumentStatus.Rejected:
        return {
          label: t('rejected'),
          className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}

export default DocumentStatusBadge;