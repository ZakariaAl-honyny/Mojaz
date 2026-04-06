'use client';

import { useTranslations } from 'next-intl';
import {
  Users,
  FileCheck,
  TrendingUp,
  Database,
  BarChart3,
  Layout,
  ShieldCheck,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StatBlock {
  label: string;
  value: string;
  trend: string;
  isUp: boolean;
  icon: any;
  color: string;
}

const StatBlockComponent = ({ label, value, trend, isUp, icon: Icon, color }: StatBlock) => (
  <Card className="border-none shadow-2xl rounded-3xl overflow-hidden p-2 group bg-white">
    <CardContent className="p-8 flex items-center justify-between">
      <div className="space-y-4">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center p-3.5 shadow-lg", color)}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="text-sm font-black text-neutral-400 uppercase tracking-widest leading-none mb-2">{label}</p>
          <h3 className="text-4xl font-black text-neutral-900 tracking-tighter">{value}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-1 text-xs font-black px-2 py-1 rounded-lg",
            isUp ? "bg-success/10 text-success" : "bg-error/10 text-error"
          )}>
            {isUp ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {trend}
          </div>
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Since last month</span>
        </div>
      </div>
      <div className="h-full w-2 bg-neutral-50 rounded-full group-hover:bg-primary-500 transition-colors hidden md:block"></div>
    </CardContent>
  </Card>
);

export default function EmployeeDashboardPage() {
  const t = useTranslations('admin');

  const adminStats: StatBlock[] = [
    { label: 'Total Applicants', value: '14,829', trend: '+12.4%', isUp: true, icon: Users, color: 'bg-primary-500 shadow-primary-500/20' },
    { label: 'Avg Pass Rate', value: '68%', trend: '+2.1%', isUp: true, icon: FileCheck, color: 'bg-success shadow-success/20' },
    { label: 'System Revenue', value: '4.2M SAR', trend: '-1.2%', isUp: false, icon: TrendingUp, color: 'bg-orange-500 shadow-orange-500/20' },
    { label: 'Active Employees', value: '124', trend: 'Stable', isUp: true, icon: ShieldCheck, color: 'bg-neutral-900 shadow-neutral-900/20' },
  ];

  return (
    <div className="space-y-12 py-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 px-2">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-neutral-900 tracking-tight leading-none uppercase">Administrative Console</h1>
          <p className="text-lg text-neutral-500 max-w-xl font-medium leading-relaxed italic">
            Real-time synchronization across 24 regional testing centers and medical facilities.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-14 px-8 rounded-2xl border-neutral-100 bg-white font-bold gap-3 shadow-xl hover:translate-y-[-2px] transition-all">
            <Database className="w-5 h-5 text-neutral-400" />
            Download Audit Logs
          </Button>
          <Button className="h-14 px-8 rounded-2xl bg-neutral-900 hover:bg-black font-bold text-white shadow-2xl transition-all hover:scale-105">
            System Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {adminStats.map((stat, i) => (
          <StatBlockComponent key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 border-none shadow-2xl rounded-[3rem] overflow-hidden p-2 bg-white">
          <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-black text-neutral-900 leading-none">Operating Volume</CardTitle>
              <CardDescription className="text-neutral-500 font-medium italic mt-2">Daily license processing across all categories.</CardDescription>
            </div>
            <div className="w-40 h-10 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between px-4">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Last 30 Days</span>
              <BarChart3 className="w-4 h-4 text-primary-500" />
            </div>
          </CardHeader>
          <CardContent className="p-10 min-h-[400px] flex items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-60">
            <div className="text-center space-y-4">
              <Layout className="w-20 h-20 text-neutral-100 mx-auto animate-bounce" />
              <p className="text-neutral-300 font-black italic uppercase tracking-[0.2em] text-xl">Operational Graph Ready</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden p-10 bg-primary-900 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="w-32 h-32" />
            </div>
            <h4 className="text-2xl font-black mb-6">Security Perimeter</h4>
            <div className="space-y-6">
              {[
                { label: 'Firewall', status: 'Online', health: 'Healthy' },
                { label: 'Encryption', status: 'Active', health: 'AES-256' },
                { label: 'Cloud DB', status: 'Connected', health: 'Synched' },
              ].map((sys, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">{sys.label}</span>
                    <span className="font-black text-lg">{sys.status}</span>
                  </div>
                  <span className="text-[10px] px-3 py-1 bg-success/20 text-success rounded-full font-black uppercase">{sys.health}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden p-2 bg-white">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <Users className="w-5 h-5 text-primary-500" />
                Recent Staff Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              {[
                { name: 'Dr. Sarah K.', action: 'Certified Medical (ID-482)', time: '2m' },
                { name: 'Captain Omar', action: 'Approved Test (ID-993)', time: '14m' },
                { name: 'Admin Ali', action: 'Modified System Settings', time: '1h' },
              ].map((act, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral-100 rounded-xl group-hover:scale-110 transition-transform"></div>
                    <div className="flex flex-col leading-none">
                      <span className="text-sm font-bold text-neutral-900">{act.name}</span>
                      <span className="text-[10px] text-neutral-400 font-medium">{act.action}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-neutral-300 uppercase italic">{act.time} ago</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
