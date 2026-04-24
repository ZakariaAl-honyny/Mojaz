import type { Meta, StoryObj } from '@storybook/react'
import { Field } from './field'
import { Input } from './input'
import { Label } from './label'
import { Mail } from 'lucide-react'

const meta: Meta<typeof Field> = {
  title: 'UI/Field',
  component: Field,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Field>

export const Default: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <Field>
        <Label>البريد الإلكتروني</Label>
        <div className="relative">
          <Input placeholder="name@example.com" className="ps-10" />
          <Mail className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        </div>
      </Field>

      <Field>
        <Label>ملاحظات إضافية</Label>
        <Input placeholder="اكتب هنا..." />
        <p className="text-xs text-muted-foreground">هذا نص توضيحي أسفل الحقل.</p>
      </Field>
    </div>
  ),
}

export const Error: Story = {
  render: () => (
    <div className="w-[400px]">
      <Field>
        <Label className="text-destructive">البريد الإلكتروني</Label>
        <Input placeholder="name@example.com" className="border-destructive" />
        <p className="text-xs text-destructive">البريد الإلكتروني غير صحيح.</p>
      </Field>
    </div>
  ),
}
