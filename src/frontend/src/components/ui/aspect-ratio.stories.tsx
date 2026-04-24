import type { Meta, StoryObj } from '@storybook/react'
import { AspectRatio } from './aspect-ratio'
import Image from 'next/image'

const meta: Meta<typeof AspectRatio> = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AspectRatio>

export const SixteenByNine: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <div className="w-[450px]">
      <AspectRatio {...args} className="bg-muted overflow-hidden rounded-md">
        <Image
          src="https://images.unsplash.com/photo-1588345921523-c2dcd57f7d62?auto=format&fit=crop&q=80&w=1000"
          alt="Photo by Drew Beamer"
          fill
          className="object-cover"
        />
      </AspectRatio>
    </div>
  ),
}

export const Square: Story = {
  args: {
    ratio: 1,
  },
  render: (args) => (
    <div className="w-[450px]">
      <AspectRatio {...args} className="bg-muted overflow-hidden rounded-md">
        <Image
          src="https://images.unsplash.com/photo-1588345921523-c2dcd57f7d62?auto=format&fit=crop&q=80&w=1000"
          alt="Photo by Drew Beamer"
          fill
          className="object-cover"
        />
      </AspectRatio>
    </div>
  ),
}
