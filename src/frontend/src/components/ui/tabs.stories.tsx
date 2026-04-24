import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { Label } from './label'
import { Input } from './input'
import { Button } from './button'

const meta: Meta<typeof Tabs> = {
  title: 'Components/Molecules/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex justify-center p-8 w-full">
        <div className="w-[400px]">
          <Story />
        </div>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  ),
}

export const ArabicRTL: Story = {
  render: () => (
    <div dir="rtl" className="font-arabic w-[400px]">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">الحساب</TabsTrigger>
          <TabsTrigger value="password">كلمة المرور</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>الحساب</CardTitle>
              <CardDescription>
                قم بإجراء التغييرات على حسابك هنا. انقر فوق حفظ عند الانتهاء.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">الاسم</Label>
                <Input id="name" defaultValue="حسن عبدالله" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input id="username" defaultValue="@hassan" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>حفظ التغييرات</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>كلمة المرور</CardTitle>
              <CardDescription>
                قم بتغيير كلمة المرور الخاصة بك هنا. بعد الحفظ، سيتم تسجيل خروجك.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="current">كلمة المرور الحالية</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">كلمة المرور الجديدة</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>حفظ كلمة المرور</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  ),
}
