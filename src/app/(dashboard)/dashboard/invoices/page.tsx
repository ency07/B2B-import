"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Search, ChevronLeft, ChevronRight, FileText, Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Zod schema for invoice creation
const invoiceSchema = z.object({
  clientName: z.string().min(1, { message: "Por favor, selecciona un cliente." }),
  amount: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "El importe total debe ser un número positivo mayor a 0.",
    }),
  description: z.string().min(5, { message: "Por favor, ingresa los conceptos de facturación." }),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface Invoice {
  id: string;
  code: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  total: number;
  status: "PAGADA" | "PARCIAL" | "PENDIENTE";
}

// Initial mock invoices
const INITIAL_INVOICES: Invoice[] = [
  { id: "1", code: "FAC-2026-001", clientName: "Acme Industrial S.A. de C.V.", issueDate: "2026-06-01", dueDate: "2026-07-01", total: 450200.5, status: "PAGADA" },
  { id: "2", code: "FAC-2026-002", clientName: "Apex Logistics B2B Group", issueDate: "2026-06-10", dueDate: "2026-07-10", total: 890450.0, status: "PARCIAL" },
  { id: "3", code: "FAC-2026-003", clientName: "Acme Industrial S.A. de C.V.", issueDate: "2026-06-18", dueDate: "2026-07-18", total: 12500.0, status: "PENDIENTE" },
  { id: "4", code: "FAC-2026-004", clientName: "Distribuidora Comercial del Centro", issueDate: "2026-06-12", dueDate: "2026-07-12", total: 125000.75, status: "PENDIENTE" },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = React.useState<Invoice[]>(INITIAL_INVOICES);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientName: "",
      amount: "",
      description: "",
    },
  });

  const onSubmit = (values: InvoiceFormValues) => {
    const nextCode = `FAC-2026-00${invoices.length + 1}`;
    const today = new Date().toISOString().split("T")[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const dueDateStr = nextMonth.toISOString().split("T")[0];

    const newInvoice: Invoice = {
      id: String(invoices.length + 1),
      code: nextCode,
      clientName: values.clientName,
      issueDate: today,
      dueDate: dueDateStr,
      total: Number(values.amount),
      status: "PENDIENTE",
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    setIsDialogOpen(false);
    form.reset();
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "code",
      header: "Folio Factura",
      cell: ({ row }) => <code className="text-xs font-mono font-semibold">{row.getValue("code")}</code>,
    },
    {
      accessorKey: "clientName",
      header: "Cliente B2B",
      cell: ({ row }) => <div className="font-semibold">{row.getValue("clientName")}</div>,
    },
    {
      accessorKey: "issueDate",
      header: "Fecha Emisión",
      cell: ({ row }) => <span className="text-xs font-mono">{row.getValue("issueDate")}</span>,
    },
    {
      accessorKey: "dueDate",
      header: "Vencimiento",
      cell: ({ row }) => {
        const dueDate = new Date(row.getValue("dueDate"));
        const today = new Date();
        const isOverdue = dueDate < today && row.original.status !== "PAGADA";
        return (
          <span className={`text-xs font-mono ${isOverdue ? "text-destructive font-bold" : ""}`}>
            {row.getValue("dueDate")}
            {isOverdue && " (VENCIDO)"}
          </span>
        );
      },
    },
    {
      accessorKey: "total",
      header: () => <div className="text-right font-semibold">Monto Total</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total"));
        const formatted = new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(amount);
        return <div className="text-right font-mono font-semibold">{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Estado de Pago",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let variant: "success" | "warning" | "destructive" | "secondary" = "secondary";
        if (status === "PAGADA") variant = "success";
        if (status === "PARCIAL") variant = "warning";
        if (status === "PENDIENTE") variant = "destructive";
        return <Badge variant={variant} className="text-[10px] font-semibold">{status}</Badge>;
      },
    },
  ];

  const table = useReactTable({
    data: invoices,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="w-3.5 h-3.5" /> Módulo de Finanzas
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Facturas y Cobranza
          </h1>
          <p className="text-sm text-muted-foreground">
            Administración de cuentas por cobrar, emisión de facturas CFDI y control de estados de pago.
          </p>
        </div>

        {/* Dialog Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Emitir Factura
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Emisión de Factura</DialogTitle>
              <DialogDescription>
                Ingresa los conceptos e importe total para generar el registro de venta.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                {/* Client Selection */}
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente B2B</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Acme Industrial S.A. de C.V.">Acme Industrial S.A. de C.V.</SelectItem>
                          <SelectItem value="Apex Logistics B2B Group">Apex Logistics B2B Group</SelectItem>
                          <SelectItem value="Distribuidora Comercial del Centro">Distribuidora Comercial del Centro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Importe Total (MXN)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ej. 150000.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conceptos de Facturación</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Servicio de soporte técnico mes de Junio" {...field} />
                      </FormControl>
                      <FormDescription>
                        Desglose breve del servicio o materiales vendidos.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Emitir CFDI</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and table */}
      <div className="space-y-4">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente..."
            value={(table.getColumn("clientName")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("clientName")?.setFilterValue(event.target.value)}
            className="pl-9"
          />
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron facturas emitidas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
