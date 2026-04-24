import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from './separator'

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Separator>

export const Default: Story = {
  render: () => (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">مكونات Radix</h4>
        <p className="text-sm text-muted-foreground">
          مكتبة مكونات مفتوحة المصدر.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 rtl:space-x-reverse text-sm">
        <div>المدونة</div>
        <Separator orientation="vertical" />
        <div>المستندات</div>
        <Separator orientation="vertical" />
        <div>المصدر</div>
      </div>
    </div>
  ),
}
