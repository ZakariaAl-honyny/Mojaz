import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from './sidebar'
import { Home, Inbox, User, Settings, FileText } from 'lucide-react'

// Wrap in SidebarProvider for the stories
const SidebarProviderDecorator = (Story: React.ElementType) => (
  <SidebarProvider>
    <div className="flex w-full h-[600px]" dir="rtl">
      <Story />
      <div className="flex-1 p-8 bg-neutral-50/50">
        <div className="flex items-center justify-between mb-8">
           <SidebarTrigger />
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-600/10 flex items-center justify-center text-primary-600">
                <User size={20} />
              </div>
           </div>
        </div>
        
        <div className="space-y-6">
          <div className="h-40 w-full bg-white rounded-3xl border border-neutral-100 shadow-sm p-8">
            <h2 className="text-2xl font-black text-neutral-900 mb-2 font-arabic">مرحباً بك في لوحة التحكم</h2>
            <p className="text-neutral-500 font-bold font-arabic">هذه منطقة المحتوى الرئيسية للمنصة</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
             <div className="h-32 bg-white rounded-3xl border border-neutral-100 shadow-sm" />
             <div className="h-32 bg-white rounded-3xl border border-neutral-100 shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  </SidebarProvider>
)

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Organisms/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  decorators: [SidebarProviderDecorator],
}

export default meta
type Story = StoryObj<typeof Sidebar>

export const Default: Story = {
  render: () => (
    <Sidebar side="right">
      <SidebarHeader className="p-6 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
            م
          </div>
          <span className="font-black text-neutral-900 tracking-tighter font-arabic">منصة مُـجاز</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="font-black text-neutral-400 text-[10px] uppercase tracking-widest px-4 mb-2 font-arabic">الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive className="h-12 rounded-xl px-4 font-bold font-arabic">
                  <Home className="size-5" />
                  <span>لوحة القيادة</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-12 rounded-xl px-4 font-bold font-arabic">
                  <Inbox className="size-5" />
                  <span>الطلبات والخدمات</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-12 rounded-xl px-4 font-bold font-arabic">
                  <FileText className="size-5" />
                  <span>سجل المعاملات</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="font-black text-neutral-400 text-[10px] uppercase tracking-widest px-4 mb-2 font-arabic">الإعدادات</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-12 rounded-xl px-4 font-bold font-arabic">
                  <User className="size-5" />
                  <span>الملف الشخصي</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-12 rounded-xl px-4 font-bold font-arabic">
                  <Settings className="size-5" />
                  <span>إعدادات النظام</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  ),
}
