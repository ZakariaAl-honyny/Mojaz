import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'نظام إصدار رخص القيادة | Driving License Issuance System',
  description: 'منصة متكاملة لإصدار وإدارة رخص القيادة - الإدارة العامة للمرور',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children;
}
