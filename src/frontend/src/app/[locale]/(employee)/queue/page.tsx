"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
  Activity
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/domain/application/StatusBadge";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

// Mock data for MVP
const mockData = [
  {
    id: "a1b2c3d4",
    applicationNumber: "MOJ-2025-48291037",
    applicantName: "Ahmed Abdullah",
    category: "Private Car",
    status: "InReview",
    stage: "Document Review",
    submittedAt: "2025-01-10T08:30:00Z"
  },
  {
    id: "b2c3d4e5",
    applicationNumber: "MOJ-2025-11223344",
    applicantName: "Saleh Al-Rashid",
    category: "Motorcycle",
    status: "Submitted",
    stage: "Application Creation",
    submittedAt: "2025-01-12T10:15:00Z"
  },
  {
    id: "c3d4e5f6",
    applicationNumber: "MOJ-2025-55667788",
    applicantName: "Laila Ibrahim",
    category: "Private Car",
    status: "Paid",
    stage: "Medical Examination",
    submittedAt: "2025-01-14T09:45:00Z"
  },
  {
    id: "d4e5f6g7",
    applicationNumber: "MOJ-2025-99887766",
    applicantName: "Fahad Khan",
    category: "Heavy Vehicle",
    status: "Approved",
    stage: "Issuance",
    submittedAt: "2025-01-15T11:20:00Z"
  }
];

export default function EmployeeQueuePage() {
  const t = useTranslations("applications.employee");
  const { locale } = useParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("applicationNumber", {
      header: t("columns.number"),
      cell: (info) => (
        <span className="font-black text-primary-400 tracking-widest text-sm bg-primary-600/10 px-4 py-2 rounded-xl border border-primary-500/20">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("applicantName", {
      header: t("columns.applicant"),
      cell: (info) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-primary-500 shadow-2xl">
            {info.getValue().charAt(0)}
          </div>
          <span className="font-black text-white text-base tracking-tight">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: t("columns.category"),
      cell: (info) => <span className="text-neutral-400 font-bold">{info.getValue()}</span>
    }),
    columnHelper.accessor("status", {
      header: t("columns.status"),
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor("stage", {
      header: t("columns.stage"),
      cell: (info) => (
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
          <Activity className="w-3.5 h-3.5 text-primary-500" />
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("submittedAt", {
      header: t("columns.submittedAt"),
      cell: (info) => (
        <span className="text-neutral-500 font-black text-xs uppercase tracking-widest">
          {new Date(info.getValue()).toLocaleDateString(locale as string)}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: t("columns.actions"),
      cell: (info) => (
        <Link href={`/${locale}/queue/${info.row.original.id}/review`}>
          <Button variant="ghost" className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 hover:bg-primary-600 hover:text-white transition-all hover:scale-110 shadow-2xl">
            <ExternalLink className="h-6 w-6" />
          </Button>
        </Link>
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
    <div className="space-y-12 py-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 px-2">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary-400">
            <Activity className="w-3.5 h-3.5" />
            Live Queue Management
          </div>
          <h1 className="text-5xl font-black text-white tracking-widest leading-none font-arabic uppercase">
            {t("title")}
          </h1>
          <p className="text-xl text-neutral-400 max-w-xl font-bold font-arabic leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 group-focus-within:text-primary-400 transition-colors" />
            <Input
              placeholder={t("filters.search")}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-16 ps-16 rounded-[1.5rem] border-white/10 bg-white/5 backdrop-blur-xl text-white placeholder:text-neutral-500 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all font-bold"
            />
          </div>
          <Button className="h-16 px-8 rounded-2xl border border-white/10 bg-white/5 text-white font-black flex items-center gap-3 hover:bg-white/10 transition-all shadow-xl">
            <Filter className="h-5 w-5 text-primary-400" />
            Filter
          </Button>
        </div>
      </div>

      <Card className="border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-3xl rounded-[3rem] overflow-hidden p-6">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-separate border-spacing-y-4">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-8 pb-4 text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="group cursor-pointer"
                    >
                      {row.getVisibleCells().map((cell, idx) => (
                        <td 
                          key={cell.id} 
                          className={cn(
                            "px-8 py-8 bg-white/[0.02] border-y border-white/5 group-hover:bg-white/[0.08] group-hover:border-primary-500/30 transition-all duration-300",
                            idx === 0 && "rounded-s-[2rem] border-s",
                            idx === row.getVisibleCells().length - 1 && "rounded-e-[2rem] border-e"
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-8 py-48 text-center text-neutral-600 font-black uppercase text-2xl tracking-[0.2em] italic">
                      {t("empty")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-10 p-10 flex items-center justify-between rounded-[2rem] bg-white/[0.03] border border-white/5">
            <div className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">
              Unit Analysis: <span className="text-primary-400">{table.getRowModel().rows.length}</span> / <span className="text-white">{mockData.length}</span> active items
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-16 w-16 rounded-2xl border-white/10 bg-white/5 text-neutral-400 disabled:opacity-20 hover:bg-white/10 hover:text-white transition-all shadow-xl"
              >
                <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-16 w-16 rounded-2xl border-white/10 bg-white/5 text-neutral-400 disabled:opacity-20 hover:bg-white/10 hover:text-white transition-all shadow-xl"
              >
                <ChevronRight className="h-6 w-6 rtl:rotate-180" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
