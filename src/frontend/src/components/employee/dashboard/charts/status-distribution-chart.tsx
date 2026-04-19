import { useTranslations } from 'next-intl';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface StatusDistributionChartProps {
  data: { status: string; count: number }[];
}

const COLORS = ['#6366F1', '#06B6D4', '#10B981', '#EF4444', '#3B82F6', '#F59E0B', '#9CA3AF'];

export const StatusDistributionChart = ({ data }: StatusDistributionChartProps) => {
  const t = useTranslations('dashboard.timeline.stages');
  
  const statusData = data.map(item => ({
    ...item,
    localizedStatus: t(item.status as any) || item.status
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="count"
            nameKey="localizedStatus"
          >
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
