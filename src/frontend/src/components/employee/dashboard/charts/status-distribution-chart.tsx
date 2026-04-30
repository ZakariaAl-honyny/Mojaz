'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ApplicationStatus } from '@/types/application.types';
import { ApplicationStatusLabels } from '@/lib/enumMappers';

interface StatusDistributionChartProps {
  data: { status: number; count: number }[];
}

// Convert numeric status to display label
const getStatusLabel = (status: number): string => {
  const label = ApplicationStatusLabels[status as ApplicationStatus];
  return label ?? String(status);
};

const COLORS = ['#1a3a8f', '#D4A017', '#10B981', '#EF4444', '#3B82F6', '#F59E0B', '#9CA3AF', '#8B5CF6', '#EC4899', '#06B6D4'];

export const StatusDistributionChart = ({ data }: StatusDistributionChartProps) => {
  // Transform data to use status labels instead of numeric values
  const chartData = data.map(item => ({
    status: getStatusLabel(item.status),
    count: item.count,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="count"
            nameKey="status"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};