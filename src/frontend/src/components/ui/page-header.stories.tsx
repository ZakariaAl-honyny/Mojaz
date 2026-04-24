import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PageHeader } from './page-header'
import { Button } from './button'

const meta: Meta<typeof PageHeader> = {
  title: 'UI/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Page title',
    },
    description: {
      control: 'text',
      description: 'Optional description',
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
  },
}

export const SimpleTitle: Story = {
  args: {
    title: 'عنوان فقط',
  },
}

export const WithBreadcrumbs: Story = {
  args: {
    title: 'عنوان نموذجى',
    description: 'نص وصف نموذجى يظهر هنا',
    breadcrumbs: [
      { label: 'الرئيسية', href: '/' },
      { label: 'القسم', href: '/section' },
      { label: 'الصفحة الحالية', isCurrent: true },
    ],
  },
}

export const WithBreadcrumbsNoCurrent: Story = {
  args: {
    title: 'عنوان نموذجى',
    breadcrumbs: [
      { label: 'الرئيسية', href: '/' },
      { label: 'القسم', href: '/section' },
      { label: 'القسم الفرعى', href: '/section/subsection' },
    ],
  },
}

export const WithAction: Story = {
  args: {
    title: 'عنوان نموذجى',
    description: 'نص وصف نموذجى يظهر هنا',
    action: <Button>إجراء نموذجى</Button>,
  },
}

export const WithBreadcrumbsAndAction: Story = {
  args: {
    title: 'عنوان نموذجى',
    breadcrumbs: [
      { label: 'الرئيسية', href: '/' },
      { label: 'القسم', href: '/section' },
    ],
    action: <Button>إجراء نموذجى</Button>,
  },
}