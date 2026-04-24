'use client';

import { useState, useEffect } from 'react';

interface FormattedDateProps {
  date: string | Date;
  options?: Intl.DateTimeFormatOptions;
  locale?: string;
}

export function FormattedDate({ 
  date, 
  options = { day: '2-digit', month: '2-digit', year: 'numeric' },
  locale = 'ar-YE'
}: FormattedDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="animate-pulse bg-neutral-100 rounded w-16 h-3 inline-block" />;
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return <span>{dateObj.toLocaleDateString(locale, options)}</span>;
  } catch (e) {
    return <span>{String(date)}</span>;
  }
}
