import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table'

const meta: Meta<typeof Table> = {
  title: 'Components/Organisms/Table',
  component: Table,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Table>

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
]

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

export const ArabicRTL: Story = {
  render: () => (
    <div dir="rtl" className="font-arabic w-full">
      <Table>
        <TableCaption>قائمة الفواتير الحديثة الخاصة بك.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">الفاتورة</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>طريقة الدفع</TableHead>
            <TableHead className="text-end">المبلغ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>
                {invoice.paymentStatus === 'Paid' ? 'مدفوع' : 
                 invoice.paymentStatus === 'Pending' ? 'قيد الانتظار' : 'غير مدفوع'}
              </TableCell>
              <TableCell>
                {invoice.paymentMethod === 'Credit Card' ? 'بطاقة ائتمان' : 
                 invoice.paymentMethod === 'PayPal' ? 'باي بال' : 'حوالة بنكية'}
              </TableCell>
              <TableCell className="text-end">{invoice.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>الإجمالي</TableCell>
            <TableCell className="text-end">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
}
