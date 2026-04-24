import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Alert, AlertTitle, AlertDescription } from './alert'
import { Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react'

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: 'Alert variant',
    },
  },
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Alert className="w-[350px]">
      <Info className="size-4" />
      <AlertTitle>عنوان التنبيه</AlertTitle>
      <AlertDescription>
        نص الوصف يظهر هنا للتأكد من التنسيق الصحيح
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
  render: () => (
    <Alert variant="destructive" className="w-[350px]">
      <XCircle className="size-4" />
      <AlertTitle>خطأ</AlertTitle>
      <AlertDescription>
        حدث خطأ أثناء معالجة طلبك يرجى المحاولة مرة أخرى
      </AlertDescription>
    </Alert>
  ),
}

export const WithSuccess: Story = {
  render: () => (
    <Alert className="w-[350px]">
      <CheckCircle className="size-4" />
      <AlertTitle>نجاح</AlertTitle>
      <AlertDescription>
        تم إرسال طلبك بنجاح
      </AlertDescription>
    </Alert>
  ),
}

export const WithWarning: Story = {
  render: () => (
    <Alert className="w-[350px]">
      <AlertTriangle className="size-4" />
      <AlertTitle>تحذير</AlertTitle>
      <AlertDescription>
        يرجى التأكد من صحة البيانات المدخلة
      </AlertDescription>
    </Alert>
  ),
}