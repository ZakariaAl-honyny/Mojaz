import type { Meta, StoryObj } from '@storybook/react'
import { Toaster } from './sonner'
import { toast } from 'sonner'
import { Button } from './button'

const meta: Meta<typeof Toaster> = {
  title: 'UI/Sonner',
  component: Toaster,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Toaster>

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast("تم تنفيذ الإجراء بنجاح", {
            description: "يوم الأحد، 3 ديسمبر 2023 الساعة 9:00 صباحاً",
            action: {
              label: "تراجع",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        إظهار الإشعار
      </Button>
    </>
  ),
}
