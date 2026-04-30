'use client';

import Link from 'next/link';
import { ClipboardList, ArrowRight, User } from 'lucide-react';

export default function QueuePage() {
  const queue = [
    { id: '1', name: 'أحمد محمد علي', number: 'MOJ-2025-48291037', time: '09:00', status: 'waiting' },
    { id: '2', name: 'خالد عمر سعيد', number: 'MOJ-2025-39182746', time: '09:15', status: 'waiting' },
    { id: '3', name: 'علياء أحمد', number: 'MOJ-2025-57483910', time: '09:30', status: 'in-progress' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-3" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="bg-white rounded-xl p-3 flex items-center gap-3">
          <Link href="/dashboard">
            <button className="p-2 hover:bg-gray-100 rounded-lg"><ArrowRight className="w-5 h-5" /></button>
          </Link>
          <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold">طابور المراجعة</h1>
            <p className="text-xs text-gray-500">{queue.length} في الطابور</p>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden">
          {queue.map((item, i) => (
            <div key={item.id} className={`p-3 border-b flex items-center justify-between ${item.status === 'in-progress' ? 'bg-yellow-50' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${item.status === 'in-progress' ? 'bg-yellow-500 text-white' : 'bg-gray-100'}`}>
                  {i+1}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.number}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{item.time}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${item.status === 'in-progress' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.status === 'in-progress' ? 'قيد المراجعة' : 'مترقب'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}