import type { Meta, StoryObj } from '@storybook/react'
import { Toaster } from './toaster'
import { useToast } from '@/hooks/use-toast'
import { Button } from './button'
import { ToastAction } from './toast'

const meta: Meta<typeof Toaster> = {
  title: 'UI/Toast',
  component: Toaster,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Toaster>

export const Default: Story = {
  render: () => {
    const { toast } = useToast()

    return (
      <>
        <Toaster />
        <Button
          variant="outline"
          onClick={() => {
            toast({
              title: "تم إرسال الطلب",
              description: "طلبك قيد المراجعة حالياً.",
              action: (
                <ToastAction altText="تراجع">تراجع</ToastAction>
              ),
            })
          }}
        >
          إظهار الإشعار
        </Button>
      </>
    )
  },
}
