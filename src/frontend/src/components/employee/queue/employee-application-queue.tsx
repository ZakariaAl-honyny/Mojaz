'use client';

import React, { useState, memo, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { columns } from './columns';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ChevronLeft, ChevronRight, RefreshCcw, Filter, LayoutGrid, List, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

// Memoized Table Row for performance
const FloatingRow = memo(({ row, index }: { row: any; index: number }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      className="group transition-all duration-300 hover:z-10 relative"
    >
      {row.getVisibleCells().map((cell: any) => (
        <td 
          key={cell.id} 
          className={cn(
            "px-6 py-5 whitespace-nowrap bg-white border-y border-neutral-100 transition-all duration-300",
            "group-hover:bg-neutral-50/50 group-hover:border-neutral-200 first:rounded-s-2xl last:rounded-e-2xl first:border-s last:border-e",
            "group-hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </motion.tr>
  );
});

FloatingRow.displayName = 'FloatingRow';

export function EmployeeApplicationQueue() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const debouncedFilter = useDebounce(globalFilter, 500);
  
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['employee-queue', debouncedFilter],
    queryFn: () => dashboardService.getEmployeeQueue({ search: debouncedFilter }),
  });

  const tableData = useMemo(() => data?.data?.items || [], [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-8 font-arabic" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
         <div className="flex items-center gap-5">
            <div className="w-1.5 h-10 bg-[#D4A017] rounded-full" />
            <div>
              <h2 className="text-2xl font-black text-neutral-900 tracking-tight leading-none mb-1">
                قائمة طلبات اليوم
              </h2>
              <p className="text-neutral-500 font-bold text-xs uppercase tracking-widest leading-none">إدارة المهام والتحقق الميداني</p>
            </div>
         </div>
      </div>

      {/* Institutional Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white border border-neutral-200 p-6 rounded-3xl shadow-sm">
        <div className="relative w-full lg:w-[420px] group">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-[#1a3a8f] transition-colors" />
          <Input
            placeholder="البحث برقم الطلب، الاسم، أو الهوية..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="ps-12 pe-10 h-12 border-neutral-100 bg-neutral-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all rounded-xl font-bold text-sm text-start"
          />
          <AnimatePresence>
            {globalFilter && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setGlobalFilter('')}
                className="absolute end-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-neutral-400" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-50 p-1 rounded-xl border border-neutral-100 ms-2">
             <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg bg-white shadow-sm border border-neutral-200 text-[#1a3a8f]">
                <List className="w-4 h-4" />
             </Button>
             <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg text-neutral-400 hover:text-neutral-600">
                <LayoutGrid className="w-4 h-4" />
             </Button>
          </div>
          <Button variant="outline" className="h-12 gap-3 border-neutral-200 rounded-xl px-5 bg-white hover:bg-neutral-50 transition-all font-black text-xs uppercase tracking-widest">
            <Filter className="w-4 h-4 text-neutral-400" />
            تصفية
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-all relative overflow-hidden"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCcw className={cn("w-4 h-4 text-neutral-400", isFetching && "animate-spin text-[#1a3a8f]")} />
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="relative">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-separate border-spacing-y-2 px-1" dir="rtl">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 pb-4 text-start text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em]">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout" initial={false}>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="bg-white rounded-2xl">
                      {columns.map((_, j) => (
                        <td key={`cell-${i}-${j}`} className="px-6 py-8 bg-white border-y border-neutral-100 first:border-s last:border-e first:rounded-s-2xl last:rounded-e-2xl">
                          <Skeleton className="h-4 w-full bg-neutral-100/50" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : data?.data?.items?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <FloatingRow key={row.id} row={row} index={index} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="h-80 text-center p-12 bg-white rounded-[2.5rem] border border-neutral-200 border-dashed">
                      <div className="max-w-xs mx-auto space-y-4">
                        <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto border border-neutral-100">
                          <Search className="w-8 h-8 text-neutral-200" />
                        </div>
                        <p className="text-neutral-400 font-bold text-sm tracking-tight leading-relaxed">لم يتم العثور على أي نتائج مطابقة لبحثك في قاعدة البيانات الحالية.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-10 px-6 mt-4 border-t border-neutral-100">
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-3">
             <span className="text-[#1a3a8f]">{data?.data?.totalCount || 0}</span> سجل تشغيلي في قاعدة البيانات
             <span className="w-1 h-1 rounded-full bg-neutral-300" />
             الصفحة <span className="text-neutral-900">{table.getState().pagination.pageIndex + 1}</span>
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-10 w-10 p-0 rounded-xl border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </Button>
            
            <div className="flex items-center gap-1">
               {Array.from({ length: Math.min(3, table.getPageCount()) }).map((_, i) => (
                 <button 
                  key={i}
                  className={cn(
                    "w-10 h-10 rounded-xl text-xs font-black transition-all",
                    table.getState().pagination.pageIndex === i 
                      ? "bg-[#1a3a8f] text-white shadow-lg shadow-blue-900/20" 
                      : "bg-white text-neutral-400 hover:bg-neutral-50 border border-neutral-100"
                  )}
                 >
                   {i + 1}
                 </button>
               ))}
            </div>

            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-10 w-10 p-0 rounded-xl border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
