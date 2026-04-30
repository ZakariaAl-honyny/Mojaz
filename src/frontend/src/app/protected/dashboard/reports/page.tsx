'use client';

import Link from 'next/link';
import { BarChart3, ArrowRight, FileText, Download } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    { id: '1', title: 'تقرير المعاملات', type: 'شهري', date: 'أبريل 2025' },
    { id: '2', title: 'تقرير الفحص الطبي', type: 'أسبوعي', date: 'الأسبوع الحالي' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-3" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="bg-white rounded-xl p-3 flex items-center gap-3">
          <Link href="/dashboard">
            <button className="p-2 hover:bg-gray-100 rounded-lg"><ArrowRight className="w-5 h-5" /></button>
          </Link>
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold">التقارير</h1>
            <p className="text-xs text-gray-500">{reports.length} تقرير</p>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden">
          {reports.map(item => (
            <div key={item.id} className="p-3 border-b flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.type} • {item.date}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}