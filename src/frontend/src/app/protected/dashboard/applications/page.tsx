'use client';

import Link from 'next/link';
import { FileText, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ApplicationsPage() {
  const applications = [
    { id: '1', name: 'أحمد محمد علي', number: 'MOJ-2025-48291037', category: 'ب - سيارة خصوصي', status: 'InReview', date: '2025-04-15' },
    { id: '2', name: 'خالد عمر سعيد', number: 'MOJ-2025-39182746', category: 'أ - دراجة نارية', status: 'Submitted', date: '2025-04-14' },
    { id: '3', name: 'علياء أحمد', number: 'MOJ-2025-57483910', category: 'د - حافلة', status: 'Approved', date: '2025-04-13' },
    { id: '4', name: 'محمد علي', number: 'MOJ-2025-62847190', category: 'ج - نقل عام', status: 'Rejected', date: '2025-04-12' },
    { id: '5', name: 'سارة عمران', number: 'MOJ-2025-71384926', category: 'ب - سيارة خصوصي', status: 'Approved', date: '2025-04-11' },
  ];

  const getStatus = (status: string) => {
    switch(status) {
      case 'Approved': return { label: 'مقبول', color: 'bg-green-100 text-green-700' };
      case 'Rejected': return { label: 'مرفوض', color: 'bg-red-100 text-red-700' };
      case 'InReview': return { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-700' };
      default: return { label: 'مُقدَّم', color: 'bg-blue-100 text-blue-700' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="bg-white rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="p-2 hover:bg-gray-100 rounded-lg"><ArrowRight className="w-5 h-5" /></button>
            </Link>
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold">المعاملات</h1>
              <p className="text-xs text-gray-500">{applications.length} طلب</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="بحث..." className="ps-10 h-12 rounded-xl bg-white" />
        </div>

        <div className="bg-white rounded-xl overflow-hidden">
          {applications.map(app => {
            const status = getStatus(app.status);
            return (
              <div key={app.id} className="p-3 border-b flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{app.name}</p>
                    <p className="text-xs text-gray-500">{app.number} • {app.category}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${status.color}`}>{status.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}