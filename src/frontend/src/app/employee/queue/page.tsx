'use client';

import React from 'react';
import { EmployeeApplicationQueue } from '@/components/employee/queue/employee-application-queue';

export default function EmployeeQueuePage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <EmployeeApplicationQueue />
    </div>
  );
}
