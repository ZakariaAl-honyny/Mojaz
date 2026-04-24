import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion'

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<any>

export const Default: Story = {
  args: {
    type: 'single',
    collapsible: true,
},
  render: (args) => (
    <Accordion type="single" collapsible className="w-[350px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>ما هي متطلبات الرخصة؟</AccordionTrigger>
        <AccordionContent>
          تتطلب الرخصة اجتياز فحص طبي نظری واختبار نظرى وعملى.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>كم تبلغ رسوم الرخصة؟</AccordionTrigger>
        <AccordionContent>
          تختلف الرسوم حسب فئة الرخصة المطلوبة. يرجى مراجعة قسم الرسوم.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>كم مدة صلاحية الرخصة؟</AccordionTrigger>
        <AccordionContent>
          صالحة الرخصة 10 سنوات من تاريخ الإصدار.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiple: Story = {
  args: {
    type: 'multiple',
  },
  render: (args) => (
    <Accordion type="multiple" className="w-[350px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>كيف أقدم طلب الرخصة؟</AccordionTrigger>
        <AccordionContent>
          يمكن تقديم الطلب عبر الموقع الإلكتروني أو زيارة أقرب مركز.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>ما المستندات المطلوبة؟</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc list-inside space-y-1">
            <li>صورة شخصية حديثة</li>
            <li>شهادة طبية</li>
            <li>شهادة حسن سلوك</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}