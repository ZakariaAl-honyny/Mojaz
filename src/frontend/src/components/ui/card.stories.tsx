import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from './card'
import { Button } from './button'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>بطاقة افتراضية</CardTitle>
        <CardDescription>
          نص وصف بطاقة افتراضي يظهر هنا لاختبار التصميم
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>محتوى البطاقة يظهر هنا</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline">إلغاء</Button>
        <Button>تأكيد</Button>
      </CardFooter>
    </Card>
  ),
}

export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>عنوان البطاقة</CardTitle>
        <CardDescription>وصف مختصر للبطاقة</CardDescription>
      </CardHeader>
    </Card>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>عنوان البطاقة</CardTitle>
        <CardDescription>وصف مختصر للبطاقة</CardDescription>
        <CardAction>
          <Button size="sm">إجراء</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>محتوى إضافي يظهر هنا</p>
      </CardContent>
    </Card>
  ),
}

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent>
        <p>محتوى البطاقة فقط بدون ترويسة أو تذييل</p>
      </CardContent>
    </Card>
  ),
}