import type { Meta, StoryObj } from '@storybook/react'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { Label } from './label'

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">الخيار الأول</Label>
      </div>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">الخيار الثاني</Label>
      </div>
    </RadioGroup>
  ),
}
