"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel
} from "@tanstack/react-table";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MoreVertical,
  Activity,
  User,
  ShieldCheck,
  RefreshCcw,
  Tag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for MVP
const mockData = [
  {
    id: "a1b2c3d4",
    applicationNumber: "MOJ-2025-48291037",
    applicantName: "أحمد عبدالله العامري",
    category: "خصوصي",
    status: "InReview",
    stage: "مراجعة المستندات",
    submittedAt: "2025-01-10T08:30:00Z"
  },
  {
    id: "b2c3d4e5",
    applicationNumber: "MOJ-2025-11223344",
    applicantName: "صالح الراشد",
    category: "دراجة نارية",
    status: "Submitted",
    stage: "إنشاء الطلب",
    submittedAt: "2025-01-12T10:15:00Z"
  },
  {
    id: "c3d4e5f6",
    applicationNumber: "MOJ-2025-55667788",
    applicantName: "ليلى إبراهيم محمد",
    category: "خصوصي",
    status: "Paid",
    stage: "الفحص الطبي",
    submittedAt: "2025-01-14T09:45:00Z"
  }
];

export default function EmployeeApplicationsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("applicationNumber", {
      header: () => <div className="text-right">رقم الطلب</div>,
      cell: (info) => (
        <div className="flex items-center gap-3 text-right">
          <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 border border-primary-100/50">
             <Tag className="w-4 h-4 text-[#1a3a8f]" />
          </div>
          <span className="font-black text-[#1a3a8f] tracking-tight leading-none">
            {info.getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("applicantName", {
      header: () => <div className="text-right">مقدم الطلب</div>,
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200">
             <User className="w-4 h-4 text-neutral-500" />
          </div>
          <span className="font-black text-neutral-800 text-sm">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: () => <div className="text-right">الفئة</div>,
      cell: (info) => (
        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-neutral-100 text-neutral-900 text-[10px] font-black border border-neutral-200 tracking-widest uppercase">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: () => <div className="text-right">الحالة</div>,
      cell: (info) => <div className="flex justify-start"><StatusBadge status={info.getValue()} /></div>,
    }),
    columnHelper.accessor("stage", {
      header: () => <div className="text-right">المرحلة الحالية</div>,
      cell: (info) => (
        <div className="flex items-center gap-2 text-[11px] font-black text-neutral-500 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4A017] animate-pulse shrink-0" />
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("submittedAt", {
      header: () => <div className="text-right">التاريخ</div>,
      cell: (info) => (
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs text-neutral-900 font-black tracking-tight leading-none">
            {new Date(info.getValue()).toLocaleDateString('ar-YE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </span>
          <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-widest leading-none">
             أرشفة سيادية
          </span>
        </div>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-left px-4">إجراء</div>,
      cell: (info) => (
        <div className="flex justify-end gap-2 px-4 text-left">
          <Link href={`/employee/queue/${info.row.original.id}/review`}>
            <Button variant="outline" className="h-10 px-4 bg-white border-neutral-200 text-[#1a3a8f] hover:bg-neutral-50 hover:border-primary-200 rounded-xl font-black text-xs transition-all gap-2 shadow-sm">
                <ExternalLink className="h-4 w-4" />
                تحصيل ومراجعة
            </Button>
          </Link>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: mockData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10 font-arabic py-6 sm:py-10" dir="rtl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 px-4">
         <div className="flex items-center gap-4 md:gap-6">
            <div className="w-1 md:w-1.5 h-10 md:h-12 bg-[#1a3a8f] rounded-full shadow-lg shadow-blue-900/20" />
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight leading-none mb-1.5 md:mb-3">
                مركز مراجعة الطلبات
              </h1>
              <p className="text-neutral-500 font-bold text-xs md:text-sm max-w-lg leading-relaxed opacity-80">
                فرز ومعالجة طلبات رخص القيادة الواردة للمنظومة المركزية بالإدارة العامة للمرور.
              </p>
            </div>
         </div>
      </header>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 bg-white border border-neutral-200 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-sm mx-4">
        <div className="relative w-full lg:w-[420px] group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-[#1a3a8f] transition-colors" />
          <Input
            placeholder="البحث في الأرشيف (برقم الطلب، الاسم، أو الحالة)..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pr-12 h-11 md:h-12 border-neutral-100 bg-neutral-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all rounded-lg md:rounded-xl font-bold text-sm text-right"
          />
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
           <Button variant="outline" className="h-11 md:h-12 gap-2 md:gap-3 border-neutral-200 rounded-lg md:rounded-xl px-4 md:px-5 bg-white hover:bg-neutral-50 transition-all font-black text-[10px] md:text-xs uppercase tracking-widest shadow-sm">
             <Filter className="w-3.5 h-3.5 md:w-4 md:h-4 text-neutral-400" />
             تصفية الأرشيف
           </Button>
           <Button variant="ghost" size="icon" className="h-11 w-11 md:h-12 md:w-12 rounded-lg md:rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-all shadow-sm">
             <RefreshCcw className="w-3.5 h-3.5 md:w-4 md:h-4 text-neutral-400" />
           </Button>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="relative mx-4">
        <Card className="border border-neutral-200 shadow-sm rounded-xl md:rounded-2xl lg:rounded-[2rem] overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="bg-neutral-50/50">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em] border-b border-neutral-100"
                        >
                          <div className={cn(
                             "flex items-center gap-2",
                             header.column.getCanSort() ? "cursor-pointer hover:text-[#1a3a8f] transition-colors" : ""
                          )} onClick={header.column.getToggleSortingHandler()}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {table.getRowModel().rows.length > 0 ? (
                      table.getRowModel().rows.map((row, index) => (
                        <motion.tr
                          key={row.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-neutral-50/10 transition-all cursor-pointer"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length} className="px-8 py-32 text-center">
                          <div className="max-w-xs mx-auto space-y-4">
                             <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto border border-neutral-100">
                                <Search className="w-8 h-8 text-neutral-200" />
                             </div>
                             <p className="text-neutral-400 font-bold text-sm tracking-tight">لا توجد طلبات للعرض حالياً في ملف المراجعة.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="p-4 md:p-6 lg:p-8 flex items-center justify-between border-t border-neutral-100 bg-neutral-50/10">
              <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-1.5 md:gap-3">
                عرض <span className="text-[#1a3a8f]">{table.getRowModel().rows.length}</span> من أصل <span className="text-neutral-900">{mockData.length}</span> سجلات مراجعة
              </div>
              <div className="flex items-center gap-1.5 md:gap-3">
                <Button
                  variant="outline"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="h-8 md:h-10 w-8 md:w-10 p-0 rounded-lg md:rounded-xl border-neutral-200 bg-white hover:bg-neutral-50 shadow-sm disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="h-3.5 md:h-4 w-3.5 md:w-4 rtl:rotate-180" />
                </Button>
                <div className="h-8 md:h-10 px-3 md:px-4 flex items-center bg-white rounded-lg md:rounded-xl border border-neutral-200 font-black text-[10px] md:text-xs">
                   {table.getState().pagination.pageIndex + 1}
                </div>
                <Button
                  variant="outline"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="h-8 md:h-10 w-8 md:w-10 p-0 rounded-lg md:rounded-xl border-neutral-200 bg-white hover:bg-neutral-50 shadow-sm disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="h-3.5 md:h-4 w-3.5 md:w-4 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pb-10 opacity-30 select-none">
         <div className="flex items-center gap-4 py-3 px-6 rounded-full border border-neutral-200">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">المركز الفني الموحد - نظام سيادي آمن</span>
         </div>
      </div>
    </div>
  );
}
