'use client';

import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';

export default function LicensesPage() {
  const licenses = [
    { id: '1', name: 'أحمد محمد علي', number: 'MOJ-2025-48291037', category: 'ب', status: 'Active', expire: '2028-04-15' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-3" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="bg-white rounded-xl p-3 flex items-center gap-3">
          <Link href="/dashboard">
            <button className="p-2 hover:bg-gray-100 rounded-lg"><ArrowRight className="w-5 h-5" /></button>
          </Link>
          <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold">الرخص</h1>
            <p className="text-xs text-gray-500">{licenses.length} رخصة</p>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden">
          {licenses.map(item => (
            <div key={item.id} className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.number}</p>
                </div>
              </div>
              <div className="text-end">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">نشط</span>
                <p className="text-xs text-gray-400 mt-1">ينتهي: {item.expire}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}