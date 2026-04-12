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
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, RefreshCcw, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Memoized Table Row for performance
const FloatingRow = memo(({ row, index }: { row: any; index: number }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="group transition-all duration-300 hover:z-10 relative"
    >
      {row.getVisibleCells().map((cell: any) => (
        <td 
          key={cell.id} 
          className={cn(
            "px-6 py-5 whitespace-nowrap bg-white border-y border-transparent transition-all duration-300",
            "group-hover:bg-neutral-50/80 group-hover:border-neutral-100 first:rounded-s-2xl last:rounded-e-2xl first:border-s last:border-e",
            "group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
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
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['employee-queue', globalFilter],
    queryFn: () => dashboardService.getEmployeeQueue({ search: globalFilter }),
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
    <div className="space-y-6">
      {/* Premium Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/60 backdrop-blur-xl p-6 rounded-[32px] shadow-2xl shadow-black/5 border border-white/40">
        <div className="relative w-full lg:w-[480px] group">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 transition-colors group-focus-within:text-primary-600" />
          <Input
            placeholder="البحث برقم الطلب أو اسم مقدم الطلب..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="ps-12 h-14 border-none bg-neutral-100/50 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all rounded-2xl font-bold text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-14 gap-3 border-neutral-200 rounded-2xl px-6 bg-white hover:bg-neutral-50 transition-all font-black text-sm">
            <Filter className="w-5 h-5 text-neutral-400" />
            فلترة متقدمة
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-14 w-14 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-100"
            onClick={() => refetch()}
          >
            <RefreshCcw className={cn("w-5 h-5 text-neutral-400 transition-all", isLoading && "animate-spin text-primary-600")} />
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="relative rounded-[32px] overflow-hidden">
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-start border-separate border-spacing-y-3 px-4">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 pb-2 text-start text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">
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
                    <tr key={`skeleton-${i}`} className="bg-white/40 rounded-2xl">
                      {columns.map((_, j) => (
                        <td key={`cell-${i}-${j}`} className="px-6 py-6 first:rounded-s-2xl last:rounded-e-2xl">
                          <div className="h-5 bg-neutral-200/50 rounded-lg animate-pulse w-full"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <FloatingRow key={row.id} row={row} index={index} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="h-64 text-center p-12 bg-white/40 rounded-[32px] backdrop-blur-sm border-2 border-dashed border-neutral-100">
                      <div className="max-w-xs mx-auto space-y-4">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
                          <Search className="w-8 h-8 text-neutral-300" />
                        </div>
                        <p className="text-neutral-500 font-black">لا توجد نتائج مطابقة لبحثك.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footnote / Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 px-10">
          <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">
            {table.getRowModel().rows.length} {table.getRowModel().rows.length === 1 ? 'نظام متاح' : 'سجلات مكتشفة'} 
            <span className="mx-2 text-neutral-200">|</span>
            إجمالي {data?.data?.totalCount || 0}
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-12 w-12 rounded-2xl border-neutral-200 bg-white hover:bg-neutral-50"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </Button>
            <div className="h-12 px-6 flex items-center bg-white rounded-2xl border border-neutral-200 font-black text-sm">
              {table.getState().pagination.pageIndex + 1}
            </div>
            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-12 w-12 rounded-2xl border-neutral-200 bg-white hover:bg-neutral-50"
            >
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
