import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from './switch'
import { Label } from './label'

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">وضع الطيران</Label>
    </div>
  ),
}
