import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HeroSection } from './hero-section'

const meta: Meta<typeof HeroSection> = {
  title: 'UI/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  argTypes: {
    gradient: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'muted'],
      description: 'Background gradient variant',
    },
    align: {
      control: 'select',
      options: ['center', 'start', 'end'],
      description: 'Text alignment',
    },
    showWave: {
      control: 'boolean',
      description: 'Whether to show wave decoration at bottom',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'عنوان نموذجى',
    subtitle: 'وصف فرعى نموذجى يظهر هنا',
    gradient: 'primary',
    align: 'center',
    showWave: true,
  },
}

export const PrimaryGradient: Story = {
  args: {
    title: 'تدرج أساسى',
    subtitle: 'هذا يستخدم التدرج الأساسي',
    gradient: 'primary',
    align: 'center',
    showWave: true,
  },
}

export const SecondaryGradient: Story = {
  args: {
    title: 'تدرج ثانوى',
    subtitle: 'هذا يستخدم التدرج الثنائي',
    gradient: 'secondary',
    align: 'center',
    showWave: true,
  },
}

export const AccentGradient: Story = {
  args: {
    title: 'تدرج مميز',
    subtitle: 'هذا يستخدم التدرج المميز',
    gradient: 'accent',
    align: 'center',
    showWave: true,
  },
}

export const MutedGradient: Story = {
  args: {
    title: 'تدرج باهت',
    subtitle: 'هذا يستخدم تدرجاً باهتاً',
    gradient: 'muted',
    align: 'center',
    showWave: true,
  },
}

export const AlignStart: Story = {
  args: {
    title: 'عنوان بمحاذاة اليسار',
    subtitle: 'هذا المحتوى بمحاذاة اليسار',
    gradient: 'primary',
    align: 'start',
    showWave: true,
  },
}

export const AlignEnd: Story = {
  args: {
    title: 'عنوان بمحاذاة اليمين',
    subtitle: 'هذا المحتوى بمحاذاة اليمين',
    gradient: 'primary',
    align: 'end',
    showWave: true,
  },
}

export const NoWave: Story = {
  args: {
    title: 'بدون زخرفة موجة',
    subtitle: 'هذا القسم بدون موجة في الأسفل',
    gradient: 'primary',
    align: 'center',
    showWave: false,
  },
}

export const NoSubtitle: Story = {
  args: {
    title: 'عنوان فقط',
    gradient: 'primary',
    align: 'center',
    showWave: true,
  },
}