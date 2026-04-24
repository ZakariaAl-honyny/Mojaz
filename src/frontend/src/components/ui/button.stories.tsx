import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button, buttonVariants } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Button visual variant',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether button is disabled',
    },
    asChild: {
      control: 'boolean',
      description: 'Whether to render as child component',
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
    children: 'زر افتراضى',
    variant: 'default',
    size: 'default',
  },
}

export const Primary: Story = {
  args: {
    children: 'تقديم الطلب',
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    children: 'زر ثانوى',
    variant: 'secondary',
  },
}

export const Outline: Story = {
  args: {
    children: 'زر حدودى',
    variant: 'outline',
  },
}

export const Ghost: Story = {
  args: {
    children: 'زر شفاف',
    variant: 'ghost',
  },
}

export const Destructive: Story = {
  args: {
    children: 'حذف',
    variant: 'destructive',
  },
}

export const Link: Story = {
  args: {
    children: 'رابط',
    variant: 'link',
  },
}

export const Small: Story = {
  args: {
    children: 'صغير',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: 'كبير',
    size: 'lg',
  },
}

export const Icon: Story = {
  args: {
    children: '+',
    size: 'icon',
  },
}

export const Disabled: Story = {
  args: {
    children: 'معطل',
    disabled: true,
  },
}