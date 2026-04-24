import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Badge, badgeVariants } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'info'],
      description: 'Badge visual variant',
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
    children: 'افتراضى',
    variant: 'default',
  },
}

export const Primary: Story = {
  args: {
    children: 'مقبول',
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    children: 'ثانوى',
    variant: 'secondary',
  },
}

export const Success: Story = {
  args: {
    children: 'نجاح',
    variant: 'success',
  },
}

export const Warning: Story = {
  args: {
    children: 'تحذير',
    variant: 'warning',
  },
}

export const Info: Story = {
  args: {
    children: 'معلومات',
    variant: 'info',
  },
}

export const Destructive: Story = {
  args: {
    children: 'مرفوض',
    variant: 'destructive',
  },
}

export const Outline: Story = {
  args: {
    children: 'حدودى',
    variant: 'outline',
  },
}