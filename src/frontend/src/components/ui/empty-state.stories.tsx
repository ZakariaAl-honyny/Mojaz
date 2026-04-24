import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { EmptyState } from './empty-state'
import { Button } from './button'

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main title',
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

export const WithDescription: Story = {
  args: {
    title: 'لا يوجد محتوى',
    description: 'لا يوجد محتوى للعرض في هذا الوقت. يرجى المحاولة مرة أخرى لاحقاً.',
  },
}

export const WithAction: Story = {
  args: {
    title: 'عنوان نموذجى',
    description: 'نص وصف نموذجى يظهر هنا',
    action: <Button>إجراء نموذجى</Button>,
  },
}

export const TitleOnly: Story = {
  args: {
    title: 'عنوان فقط',
  },
}