import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from './navigation-menu'
import { Button } from './button'

const meta: Meta<typeof NavigationMenu> = {
  title: 'UI/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>الخدمات</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
              <li className="row-span-3">
                <NavigationMenuLink href="/" className="flex flex-col justify-end p-6 bg-primary/10 rounded-md">
                  <div className="mb-2 text-lg font-medium">رخصة جديدة</div>
                  <p className="text-sm text-muted-foreground">قدّم طلب رخصة قيادة جديدة</p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="/" className="block p-3 rounded-md hover:bg-accent">
                  <div className="font-medium">تجديد الرخصة</div>
                  <p className="text-sm text-muted-foreground">جدد رخصتك الحالية</p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="/" className="block p-3 rounded-md hover:bg-accent">
                  <div className="font-medium">بديل فاقد</div>
                  <p className="text-sm text-muted-foreground">استبدل رخصةفاقدة أو تالفة</p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>حالة الطلب</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-6">
              <li>
                <NavigationMenuLink href="/" className="block p-4 rounded-md hover:bg-accent">
                  <div className="font-medium">تتبع الطلب</div>
                  <p className="text-sm text-muted-foreground">اعرف حالة طلبك الحالي</p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="/" className="block p-4 rounded-md hover:bg-accent">
                  <div className="font-medium">المواعيد</div>
                  <p className="text-sm text-muted-foreground">اعرف مواعيدك القادمة</p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/">معلومات</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  ),
}