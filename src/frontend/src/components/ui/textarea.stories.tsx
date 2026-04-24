import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Textarea } from './textarea'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether textarea is disabled',
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
    placeholder: 'أدخل الوصف هنا...',
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-2">
      <label className="text-sm font-medium" htmlFor="textarea">
        الوصف
      </label>
      <Textarea id="textarea" placeholder="أدخل الوصف هنا..." />
    </div>
  ),
}

export const WithValue: Story = {
  args: {
    defaultValue: 'هذا نص افتراضى يظهر في الحقل',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'معطل',
    disabled: true,
  },
}

export const Multiple: Story = {
  args: {
    placeholder: 'ملاحظات إضافية...',
    rows: 5,
  },
}