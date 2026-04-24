import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from './input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'search', 'file'],
      description: 'Input type',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether input is disabled',
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
    placeholder: 'نص افتراضى',
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-2">
      <label className="text-sm font-medium" htmlFor="input">
        الاسم الكامل
      </label>
      <Input id="input" placeholder="أدخل الاسم الكامل" />
    </div>
  ),
}

export const WithValue: Story = {
  args: {
    defaultValue: 'محمود على',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'معطل',
    disabled: true,
  },
}

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'البريد الإلكتروني',
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'كلمة المرور',
  },
}

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'الرقم الوطني',
  },
}

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'بحث...',
  },
}

export const File: Story = {
  args: {
    type: 'file',
  },
}