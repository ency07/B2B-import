"use client";

import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData> {
  table: TanstackTable<TData>;
  columnCount: number;
  emptyMessage?: string;
  onRowClick?: (row: TData) => void;
  selectedRowId?: string | null;
  idAccessor?: keyof TData;
}

export function DataTable<TData>({
  table,
  columnCount,
  emptyMessage = "// No se encontraron registros.",
  onRowClick,
  selectedRowId,
  idAccessor,
}: DataTableProps<TData>) {
  return (
    <>
      <div className="rounded-lg border border-border bg-card/45 backdrop-blur-md overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-border bg-accent/40 hover:bg-accent/40">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground py-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isSelected = selectedRowId != null && idAccessor != null && (row.original as Record<string, unknown>)[idAccessor as string] === selectedRowId;
                return (
                  <TableRow
                    key={row.id}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                    className={`hover:bg-accent/30 cursor-pointer border-b border-border/40 transition-colors ${isSelected ? "bg-accent/35" : ""}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2 px-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-24 text-center text-xs text-muted-foreground font-mono uppercase tracking-widest">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </>
  );
}

interface DataTablePaginationProps<TData> {
  table: TanstackTable<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
      <div>
        Página {table.getState().pagination.pageIndex + 1} de{" "}
        {table.getPageCount() || 1}
      </div>
      <div className="flex items-center space-x-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="h-8 px-3 border-border bg-card hover:bg-accent text-foreground cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="h-8 px-3 border-border bg-card hover:bg-accent text-foreground cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
