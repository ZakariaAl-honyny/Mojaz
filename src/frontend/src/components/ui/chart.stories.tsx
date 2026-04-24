import type { Meta, StoryObj } from '@storybook/react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from './chart'

const chartData = [
  { month: 'يناير', desktop: 186, mobile: 80 },
  { month: 'فبراير', desktop: 305, mobile: 200 },
  { month: 'مارس', desktop: 237, mobile: 120 },
  { month: 'أبريل', desktop: 73, mobile: 190 },
  { month: 'مايو', desktop: 209, mobile: 130 },
  { month: 'يونيو', desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: 'سطح المكتب',
    color: 'var(--primary)',
  },
  mobile: {
    label: 'الجوال',
    color: 'var(--secondary)',
  },
} satisfies ChartConfig

const meta: Meta<typeof ChartContainer> = {
  title: 'UI/Chart',
  component: ChartContainer,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ChartContainer>

export const Default: Story = {
  args: {
    config: chartConfig,
    className: 'min-h-[200px] w-full',
  },
  render: (args) => (
    <ChartContainer {...args}>
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
}
