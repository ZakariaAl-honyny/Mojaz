import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FeatureCard } from './feature-card'
import { Button } from './button'

const meta: Meta<typeof FeatureCard> = {
  title: 'UI/FeatureCard',
  component: FeatureCard,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title',
    },
    description: {
      control: 'text',
      description: 'Card description',
    },
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'filled'],
      description: 'Visual variant',
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
    title: 'عنوان نموذجى',
    description: 'نص وصف نموذجى يظهر هنا',
    variant: 'default',
  },
}

export const Bordered: Story = {
  args: {
    title: 'عنوان نموذجى',
    description: 'نص وصف نموذجى يظهر هنا',
    variant: 'bordered',
  },
}

export const Filled: Story = {
  args: {
    title: 'عنوان نموذجى',
    description: 'نص وصف نموذجى يظهر هنا',
    variant: 'filled',
  },
}

export const WithAction: Story = {
  args: {
    title: 'عنوان نموذجى',
    description: 'نص وصف نموذجى يظهر هنا',
    action: <Button>إجراء نموذجى</Button>,
    variant: 'default',
  },
}

export const TitleOnly: Story = {
  args: {
    title: 'عنوان فقط',
  },
}