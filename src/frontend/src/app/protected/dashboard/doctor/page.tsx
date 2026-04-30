'use client';

import Link from 'next/link';
import { Stethoscope, ArrowRight, User, Eye, Heart, X, Check } from 'lucide-react';
import { useState } from 'react';

export default function DoctorPage() {
  const [examMode, setExamMode] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const pending = [
    { id: '1', name: 'أحمد محمد علي', number: 'MOJ-2025-48291037', category: 'ب - خصوصي' },
    { id: '2', name: 'خالد عمر سعيد', number: 'MOJ-2025-39182746', category: 'أ - دراجة' },
    { id: '3', name: 'علياء أحمد', number: 'MOJ-2025-57483910', category: 'د - حافلة' },
  ];

  const completed = [
    { id: '4', name: 'سارة عمران', number: 'MOJ-2025-71384926', result: 'لائق' },
    { id: '5', name: 'محمد علي', number: 'MOJ-2025-62847190', result: 'لائق' },
  ];

  if (examMode && selected) {
    return (
      <div className="min-h-screen bg-gray-100 p-3" dir="rtl">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="bg-white rounded-xl p-3 flex items-center gap-3">
            <button onClick={() => setExamMode(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold">الفحص الطبي</h1>
              <p className="text-xs text-gray-500">{selected.name}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3">
            <h2 className="font-bold mb-2">البيانات</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-500">الاسم:</span> <span className="font-bold ms-1">{selected.name}</span></div>
              <div><span className="text-gray-500">الرقم:</span> <span className="font-bold ms-1">{selected.number}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <Eye className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <p className="font-bold text-sm">النظر</p>
              <p className="text-green-600 text-xs">6/6</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <Eye className="w-6 h-6 text-purple-500 mx-auto mb-1" />
              <p className="font-bold text-sm">السمع</p>
              <p className="text-green-600 text-xs">سليم</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
              <p className="font-bold text-sm">القلب</p>
              <p className="text-green-600 text-xs">سليم</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3">
            <h2 className="font-bold mb-2">النتيجة</h2>
            <div className="flex gap-2">
              <button onClick={() => { alert('لائق!'); setExamMode(false); }} className="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />لائق
              </button>
              <button onClick={() => { alert('غير لائق!'); setExamMode(false); }} className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                <X className="w-5 h-5" />غير لائق
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="bg-white rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="p-2 hover:bg-gray-100 rounded-lg"><ArrowRight className="w-5 h-5" /></button>
            </Link>
            <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold">عيادة الفحص الطبي</h1>
              <p className="text-xs text-gray-500">مُجاز</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="bg-yellow-50 rounded-xl p-2 text-center">
            <p className="font-bold text-sm">{pending.length}</p>
            <p className="text-xs text-yellow-600">مترقب</p>
          </div>
          <div className="bg-green-50 rounded-xl p-2 text-center">
            <p className="font-bold text-sm">{completed.length}</p>
            <p className="text-xs text-green-600">مكتمل</p>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden">
          <div className="p-2 border-b bg-yellow-50 font-bold text-sm">طابور الفحص ({pending.length})</div>
          {pending.map(item => (
            <div key={item.id} className="p-2 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.number}</p>
                </div>
              </div>
              <button onClick={() => { setSelected(item); setExamMode(true); }} className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold">فحص</button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl overflow-hidden">
          <div className="p-2 border-b bg-green-50 font-bold text-sm">نتائج ({completed.length})</div>
          {completed.map(item => (
            <div key={item.id} className="p-2 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.number}</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">{item.result}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}