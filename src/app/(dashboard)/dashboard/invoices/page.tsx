"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
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
import { ArrowUpDown, Search, ChevronLeft, ChevronRight, Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
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
import { getInvoices, createInvoice, getClients } from "@/app/actions";

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
  status: "PAGADA" | "PARCIAL" | "PENDIENTE" | "PARCIALMENTE_PAGADA";
}

interface ClientOption {
  id: string;
  name: string;
}

export default function InvoicesPage() {
  const searchParams = useSearchParams();
  const tenantParam = searchParams.get("tenant");

  const [invoices, setInvoices] = React.useState<any[]>([]);
  const [clients, setClients] = React.useState<ClientOption[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

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

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const invoicesData = await getInvoices(tenantParam);
      const clientsData = await getClients(tenantParam);
      
      setInvoices(invoicesData);
      setClients(clientsData.map(c => ({ id: c.id, name: c.name })));
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tenantParam]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const onSubmit = async (values: InvoiceFormValues) => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await createInvoice(tenantParam, {
        clientName: values.clientName,
        concept: values.description,
        amount: Number(values.amount)
      });
      setIsDialogOpen(false);
      form.reset();
      await loadData();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Ocurrió un error al emitir la factura.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "code",
      header: "Folio Factura",
      cell: ({ row }) => <code className="text-xs font-mono font-semibold">{row.getValue("code")}</code>,
    },
    {
      accessorKey: "clientName",
      header: "Cliente B2B",
      cell: ({ row }) => <div className="font-semibold text-foreground">{row.getValue("clientName")}</div>,
    },
    {
      accessorKey: "date",
      header: "Fecha Emisión",
      cell: ({ row }) => <span className="text-xs font-mono">{row.getValue("date")}</span>,
    },
    {
      accessorKey: "totalAmount",
      header: () => <div className="text-right font-semibold">Monto Total</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalAmount"));
        const formatted = new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(amount);
        return <div className="text-right font-mono font-semibold text-foreground">{formatted}</div>;
      },
    },
    {
      accessorKey: "paidAmount",
      header: () => <div className="text-right font-semibold text-emerald-600 dark:text-emerald-400">Cobrado</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("paidAmount") || "0");
        const formatted = new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(amount);
        return <div className="text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Estado de Pago",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let variant: "success" | "warning" | "destructive" | "secondary" = "secondary";
        if (status === "PAGADA") variant = "success";
        if (status === "PARCIALMENTE_PAGADA") variant = "warning";
        if (status === "PENDIENTE" || status === "EMITIDA") variant = "destructive";
        return <Badge variant={variant} className="text-[10px] font-semibold">{status === "EMITIDA" ? "PENDIENTE" : status}</Badge>;
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
            <Button className="flex items-center gap-2 cursor-pointer">
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

            {errorMsg && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                {errorMsg}
              </div>
            )}

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
                          {clients.map((c) => (
                            <SelectItem key={c.id} value={c.name}>
                              {c.name}
                            </SelectItem>
                          ))}
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
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? <Spinner size="sm" className="mr-2" /> : null}
                    Emitir CFDI
                  </Button>
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 border border-border rounded-lg bg-zinc-950/20">
            <Spinner size="lg" className="text-primary mb-2" />
            <span className="text-xs text-muted-foreground">Cargando facturas...</span>
          </div>
        ) : (
          <>
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
                Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount() || 1}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="h-8 w-8 p-0 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="h-8 w-8 p-0 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

