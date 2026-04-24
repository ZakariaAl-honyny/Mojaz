import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './select'

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="اختر ملف" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>فئات الرخص</SelectLabel>
          <SelectItem value="a">رخصة فئة أ</SelectItem>
          <SelectItem value="b">رخصة فئة ب</SelectItem>
          <SelectItem value="c">رخصة فئة ج</SelectItem>
          <SelectItem value="d">رخصة فئة د</SelectItem>
          <SelectItem value="e">رخصة فئة ه</SelectItem>
          <SelectItem value="f">رخصة فئة و</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-[250px] gap-2">
      <label className="text-sm font-medium">فئة الرخصة</label>
      <Select defaultValue="b">
        <SelectTrigger>
          <SelectValue placeholder="اختر فئة الرخصة" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="a">رخصة فئة أ</SelectItem>
            <SelectItem value="b">رخصة فئة ب</SelectItem>
            <SelectItem value="c">رخصة فئة ج</SelectItem>
            <SelectItem value="d">رخصة فئة د</SelectItem>
            <SelectItem value="e">رخصة فئة ه</SelectItem>
            <SelectItem value="f">رخصة فئة و</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const Small: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[250px]" data-size="sm">
        <SelectValue placeholder="اختر" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">خيار أ</SelectItem>
        <SelectItem value="b">خيار ب</SelectItem>
        <SelectItem value="c">خيار ج</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Grouped: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="اختر خدمة" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>خدمات جديدة</SelectLabel>
          <SelectItem value="new-license">رخصة جديدة</SelectItem>
          <SelectItem value="renew">تجديد الرخصة</SelectItem>
          <SelectItem value="replacement">بديل فاقد</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>خدمات إضافية</SelectLabel>
          <SelectItem value="upgrade">ترقية الرخصة</SelectItem>
          <SelectItem value="international">رخصة دولية</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}