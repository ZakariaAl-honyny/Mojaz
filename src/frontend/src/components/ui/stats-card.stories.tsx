import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StatsCard } from './stats-card'

const meta: Meta<typeof StatsCard> = {
  title: 'UI/StatsCard',
  component: StatsCard,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The main value to display',
    },
    label: {
      control: 'text',
      description: 'Label describing the metric',
    },
    trend: {
      control: 'number',
      description: 'Trend indicator percentage',
    },
    trendLabel: {
      control: 'text',
      description: 'Optional trend label',
    },
    trendDirection: {
      control: 'select',
      options: ['up', 'down'],
      description: 'Whether the trend is positive or negative',
    },
  },
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: '1,234',
    label: 'تسمية نموذجية',
  },
}

export const WithPositiveTrend: Story = {
  args: {
    value: '2,567',
    label: 'تسمية نموذجية',
    trend: 15,
    trendLabel: 'مقارنة بالشهر الماضي',
    trendDirection: 'up',
  },
}

export const WithNegativeTrend: Story = {
  args: {
    value: '892',
    label: 'تسمية نموذجية',
    trend: 8,
    trendLabel: 'مقارنة بالشهر الماضي',
    trendDirection: 'down',
  },
}

export const NumericValue: Story = {
  args: {
    value: 42,
    label: 'تسمية رقمية نموذجية',
    trend: 12,
    trendDirection: 'up',
  },
}

export const NoTrend: Story = {
  args: {
    value: '5,000',
    label: 'تسمية بدون اتجاه',
  },
}

export const TrendOnlyLabel: Story = {
  args: {
    value: '3,456',
    label: 'تسمية نموذجية',
    trend: 25,
    trendDirection: 'up',
  },
}