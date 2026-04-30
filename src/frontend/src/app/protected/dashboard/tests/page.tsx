'use client';

import Link from 'next/link';
import { ClipboardCheck, ArrowRight, User } from 'lucide-react';

export default function TestsPage() {
  const tests = [
    { id: '1', name: 'أحمد محمد علي', type: 'نظري', number: 'MOJ-2025-48291037', status: 'Passed', date: '2025-04-15' },
    { id: '2', name: 'خالد عمر سعيد', type: 'عملي', number: 'MOJ-2025-39182746', status: 'Pending', date: '2025-04-16' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-3" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="bg-white rounded-xl p-3 flex items-center gap-3">
          <Link href="/dashboard">
            <button className="p-2 hover:bg-gray-100 rounded-lg"><ArrowRight className="w-5 h-5" /></button>
          </Link>
          <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold">الاختبارات</h1>
            <p className="text-xs text-gray-500">{tests.length} اختبار</p>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden">
          {tests.map(item => (
            <div key={item.id} className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.number} • {item.type}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${item.status === 'Passed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {item.status === 'Passed' ? 'ناجح' : 'قيد الانتظار'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}