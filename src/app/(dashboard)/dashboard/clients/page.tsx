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
import { ArrowUpDown, Search, ChevronLeft, ChevronRight, UserPlus, Sparkles } from "lucide-react";

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
import { getClients, createClient } from "@/app/actions";

// Zod schema for client registration
const clientSchema = z.object({
  taxId: z
    .string()
    .min(12, { message: "El RFC debe tener al menos 12 caracteres." })
    .max(13, { message: "El RFC no puede superar los 13 caracteres." })
    .regex(/^[A-Z0-9]{12,13}$/, {
      message: "RFC inválido. Debe contener solo letras mayúsculas y números.",
    }),
  name: z.string().min(5, { message: "La razón social debe tener al menos 5 caracteres." }),
  segment: z.string().min(1, { message: "Por favor, selecciona el segmento del cliente." }),
  email: z.string().email({ message: "Por favor, ingresa un correo electrónico válido." }),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface Client {
  id: string;
  taxId: string;
  name: string;
  segment: string;
  totalInvoiced: number;
  status: "ACTIVO" | "SUSPENDIDO" | "PENDIENTE";
}

export default function ClientsPage() {
  const searchParams = useSearchParams();
  const tenantParam = searchParams.get("tenant");

  const [clients, setClients] = React.useState<Client[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      taxId: "",
      name: "",
      segment: "",
      email: "",
    },
  });

  const loadClients = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getClients(tenantParam);
      setClients(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tenantParam]);

  React.useEffect(() => {
    loadClients();
  }, [loadClients]);

  const onSubmit = async (values: ClientFormValues) => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await createClient(tenantParam, values);
      setIsDialogOpen(false);
      form.reset();
      await loadClients();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Ocurrió un error al registrar el cliente.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "taxId",
      header: "RFC",
      cell: ({ row }) => <code className="text-xs font-mono">{row.getValue("taxId")}</code>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 hover:text-foreground cursor-pointer font-semibold transition-colors border-none bg-transparent p-0 outline-hidden"
        >
          Razón Social
          <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
        </button>
      ),
      cell: ({ row }) => <div className="font-semibold text-foreground">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "segment",
      header: "Segmento",
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.getValue("segment")}</span>,
    },
    {
      accessorKey: "totalInvoiced",
      header: () => <div className="text-right font-semibold">Facturado Acum.</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalInvoiced"));
        const formatted = new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(amount);
        return <div className="text-right font-mono font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let variant: "success" | "warning" | "destructive" | "secondary" = "secondary";
        if (status === "ACTIVO") variant = "success";
        if (status === "PENDIENTE") variant = "warning";
        if (status === "SUSPENDIDO") variant = "destructive";
        return <Badge variant={variant} className="text-[10px] font-semibold">{status}</Badge>;
      },
    },
  ];

  const table = useReactTable({
    data: clients,
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
            <Sparkles className="w-3.5 h-3.5" /> Módulo de Clientes
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Clientes B2B
          </h1>
          <p className="text-sm text-muted-foreground">
            Administración y registro de empresas clientes con reglas de aislamiento multi-tenant.
          </p>
        </div>

        {/* Dialog Modal for adding new clients */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 cursor-pointer">
              <UserPlus className="w-4 h-4" /> Registrar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Ingresa los datos fiscales y de contacto de la empresa.
              </DialogDescription>
            </DialogHeader>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                {errorMsg}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                {/* Tax ID */}
                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RFC / ID Fiscal</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. ACM901201TR4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razón Social</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Acme Industrial S.A. de C.V." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Segment */}
                <FormField
                  control={form.control}
                  name="segment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Segmento Comercial</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el segmento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Industrial">Industrial</SelectItem>
                          <SelectItem value="Corporativo">Corporativo</SelectItem>
                          <SelectItem value="Comercial">Comercial</SelectItem>
                          <SelectItem value="Pymes">Pymes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo de Contacto</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contacto@empresa.com" {...field} />
                      </FormControl>
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
                    Guardar Cliente
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
            placeholder="Buscar por razón social..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 border border-border rounded-lg bg-zinc-950/20">
            <Spinner size="lg" className="text-primary mb-2" />
            <span className="text-xs text-muted-foreground">Cargando clientes...</span>
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
                      <TableCell colSpan={5} className="h-24 text-center">
                        No se encontraron clientes registrados.
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

