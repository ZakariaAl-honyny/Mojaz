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
import { getColumns } from './columns';
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="group transition-all duration-500 hover:z-10 relative"
    >
      {row.getVisibleCells().map((cell: any) => (
        <td 
          key={cell.id} 
          className={cn(
            "px-8 py-6 whitespace-nowrap bg-white/5 backdrop-blur-md border-y border-transparent transition-all duration-500",
            "group-hover:bg-white/10 group-hover:border-primary-500/20 first:rounded-s-[1.5rem] last:rounded-e-[1.5rem] first:border-s last:border-e",
            "group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
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
  const t = useTranslations('dashboard.employee.queue');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const tableColumns = useMemo(() => getColumns(t), [t]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['employee-queue', globalFilter],
    queryFn: () => dashboardService.getEmployeeQueue({ search: globalFilter }),
  });

  const tableData = useMemo(() => data?.data?.items || [], [data]);

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
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
    <div className="space-y-10">
      {/* Premium Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative w-full lg:w-[520px] group/input">
          <Search className="absolute start-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 transition-colors group-focus-within/input:text-primary-500" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="ps-14 h-16 border-white/5 bg-white/5 focus:bg-white/10 focus:ring-4 focus:ring-primary-500/10 transition-all rounded-2xl font-bold text-lg text-white placeholder:text-neutral-600"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-16 gap-3 border-white/10 rounded-2xl px-10 bg-white/5 hover:bg-white/10 transition-all font-black text-xs uppercase tracking-widest text-white">
            <Filter className="w-5 h-5 text-primary-500" />
            {t('advancedFilter')}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-16 w-16 rounded-2xl hover:bg-white/10 hover:shadow-2xl transition-all border border-white/5"
            onClick={() => refetch()}
          >
            <RefreshCcw className={cn("w-6 h-6 text-neutral-400 transition-all", isLoading && "animate-spin text-primary-500")} />
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="relative rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto pb-10">
          <table className="w-full text-start border-separate border-spacing-y-4 px-2">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-10 pb-4 text-start text-[10px] font-black text-neutral-500 uppercase tracking-[0.25em]">
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
            <tbody className="relative">
              <AnimatePresence mode="popLayout" initial={false}>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="bg-white/5 border border-white/5 rounded-[1.5rem]">
                      {tableColumns.map((_, j) => (
                        <td key={`cell-${i}-${j}`} className="px-8 py-8 first:rounded-s-[1.5rem] last:rounded-e-[1.5rem]">
                          <div className="h-6 bg-white/5 rounded-xl animate-pulse w-full"></div>
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
                    <td colSpan={tableColumns.length} className="h-80 text-center p-20 bg-white/5 rounded-[2.5rem] backdrop-blur-3xl border-2 border-dashed border-white/10 shadow-2xl">
                      <div className="max-w-md mx-auto space-y-6">
                        <div className="w-24 h-24 bg-primary-600/10 rounded-full flex items-center justify-center mx-auto border border-primary-500/20 shadow-inner">
                          <Search className="w-12 h-12 text-primary-500/50" />
                        </div>
                        <div>
                           <p className="text-white font-black text-2xl tracking-tighter mb-2">{t('noResults')}</p>
                           <p className="text-neutral-500 font-bold text-sm">{t('noResultsDescription')}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footnote / Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 py-10 px-12 bg-white/5 border-t border-white/5 backdrop-blur-2xl rounded-b-[2.5rem]">
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.25em]">
            <span className="text-primary-400">{table.getRowModel().rows.length}</span> {t(table.getRowModel().rows.length === 1 ? 'recordsFound' : 'recordsFound_plural', { count: table.getRowModel().rows.length })} 
            <span className="mx-4 text-white/10">|</span>
            {t('total')} <span className="text-white">{data?.data?.totalCount || 0}</span>
          </p>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-14 w-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronRight className="w-6 h-6 rtl:rotate-180" />
            </Button>
            <div className="h-14 px-8 flex items-center bg-white/10 rounded-2xl border border-white/5 font-black text-lg text-white shadow-xl">
              {table.getState().pagination.pageIndex + 1}
            </div>
            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-14 w-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
