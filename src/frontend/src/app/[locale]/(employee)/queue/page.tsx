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
import Link from "next/link";
import { useParams } from "next/navigation";

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
         <div className="flex flex-col">
            <span className="font-bold text-primary-900 border border-primary-200 bg-primary-50 px-2 py-0.5 rounded text-sm font-mono self-start cursor-pointer hover:bg-primary-100 transition-colors">
               {info.getValue()}
            </span>
         </div>
      ),
    }),
    columnHelper.accessor("applicantName", {
      header: t("columns.applicant"),
      cell: (info) => (
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-black text-neutral-400">
               {info.getValue().charAt(0)}
            </div>
            <span className="font-bold text-neutral-800">{info.getValue()}</span>
         </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: t("columns.category"),
    }),
    columnHelper.accessor("status", {
      header: t("columns.status"),
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor("stage", {
      header: t("columns.stage"),
      cell: (info) => (
         <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 uppercase tracking-widest bg-neutral-50 px-2 py-1 rounded">
            <Activity className="w-3.5 h-3.5 text-primary-500" />
            {info.getValue()}
         </span>
      ),
    }),
    columnHelper.accessor("submittedAt", {
      header: t("columns.submittedAt"),
      cell: (info) => (
         <span className="text-neutral-400 font-medium italic italic">
            {new Date(info.getValue()).toLocaleDateString(locale as string)}
         </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: t("columns.actions"),
      cell: (info) => (
         <Link href={`/${locale}/queue/${info.row.original.id}/review`}>
            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-primary-50 hover:text-primary-600">
               <ExternalLink className="h-5 w-5" />
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
    <div className="space-y-12 py-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 px-2">
        <div className="space-y-2">
           <h1 className="text-5xl font-black text-neutral-900 tracking-tight leading-none uppercase">{t("title")}</h1>
           <p className="text-lg text-neutral-500 max-w-xl font-medium leading-relaxed italic">
              {t("subtitle")}
           </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-300 rtl:right-4 rtl:left-auto" />
            <Input
              placeholder={t("filters.search")}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-12 rtl:pr-12 h-14 rounded-2xl border-neutral-100 bg-white shadow-xl focus:ring-primary-500 font-bold"
            />
          </div>
          <Button variant="outline" className="h-14 px-6 rounded-2xl border-neutral-100 bg-white font-bold gap-3 shadow-xl hover:translate-y-[-2px] transition-all">
            <Filter className="h-5 w-5 text-neutral-400" />
            Filter
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white p-4">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-neutral-50">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-8 py-8 text-[11px] font-black text-neutral-300 uppercase tracking-[0.3em]"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2 cursor-pointer hover:text-neutral-900 transition-colors">
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
                      className="group border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-all font-medium py-10"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-8 py-8">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-8 py-32 text-center text-neutral-200 font-black uppercase text-xl italic tracking-widest">
                      {t("empty")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-10 flex items-center justify-between border-t border-neutral-50 bg-neutral-50/20">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] italic">
              Showing <span className="text-neutral-900">{table.getRowModel().rows.length}</span> of <span className="text-neutral-900">{mockData.length}</span> processing units
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-12 w-12 rounded-2xl border-neutral-100 shadow-xl bg-white disabled:opacity-30 transition-all hover:translate-x-[-2px]"
              >
                <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-12 w-12 rounded-2xl border-neutral-100 shadow-xl bg-white disabled:opacity-30 transition-all hover:translate-x-[2px]"
              >
                <ChevronRight className="h-5 w-5 rtl:rotate-180" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
