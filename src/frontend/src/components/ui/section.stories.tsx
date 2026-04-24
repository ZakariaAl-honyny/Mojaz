import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Section } from './section'

const meta: Meta<typeof Section> = {
  title: 'UI/Section',
  component: Section,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'muted', 'bordered', 'transparent'],
      description: 'Section background variant',
    },
    container: {
      control: 'boolean',
      description: 'Whether to use a container with max-width',
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
    children: 'محتوى نموذجى يظهر هنا',
    variant: 'default',
    container: true,
  },
}

export const Muted: Story = {
  args: {
    title: 'قسم باهت',
    description: 'يستخدم هذا القسم خلفية باهتة',
    children: 'محتوى نموذجى يظهر هنا',
    variant: 'muted',
    container: true,
  },
}

export const Bordered: Story = {
  args: {
    title: 'قسم محدد بحدود',
    description: 'يوجد حول هذا القسم حد',
    children: 'محتوى نموذجى يظهر هنا',
    variant: 'bordered',
    container: true,
  },
}

export const Transparent: Story = {
  args: {
    title: 'قسم شفاف',
    description: 'هذا القسم بدون خلفية',
    children: 'محتوى نموذجى يظهر هنا',
    variant: 'transparent',
    container: true,
  },
}

export const NoContainer: Story = {
  args: {
    title: 'قسم بعرض كامل',
    description: 'قسم بدون حدود عرضية',
    children: 'محتوى نموذجى يظهر هنا',
    variant: 'default',
    container: false,
  },
}

export const TitleOnly: Story = {
  args: {
    title: 'عنوان فقط',
    children: 'محتوى بدون وصف',
    variant: 'default',
    container: true,
  },
}