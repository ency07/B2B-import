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
import { ArrowUpDown, Search, ChevronLeft, ChevronRight, Briefcase, Plus, Sparkles } from "lucide-react";

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
import { getJobs, createJob } from "@/app/actions";

// Zod schema for job creation with date validations
const jobSchema = z.object({
  description: z.string().min(5, { message: "La descripción debe tener al menos 5 caracteres." }),
  assignedTech: z.string().min(1, { message: "Por favor, selecciona un técnico responsable." }),
  priority: z.string().min(1, { message: "Por favor, selecciona la prioridad del trabajo." }),
  startDate: z.string().min(1, { message: "Por favor, selecciona la fecha de inicio." }),
  endDate: z.string().min(1, { message: "Por favor, selecciona la fecha de finalización." }),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  message: "La fecha de finalización debe ser igual o posterior a la fecha de inicio.",
  path: ["endDate"],
});

type JobFormValues = z.infer<typeof jobSchema>;

interface Job {
  id: string;
  code: string;
  description: string;
  assignedTech: string;
  priority: "BAJA" | "MEDIA" | "ALTA";
  startDate: string;
  endDate: string;
  status: "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA" | "CANCELADA";
}

export default function JobsPage() {
  const searchParams = useSearchParams();
  const tenantParam = searchParams.get("tenant");

  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      description: "",
      assignedTech: "",
      priority: "",
      startDate: "",
      endDate: "",
    },
  });

  const loadJobs = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getJobs(tenantParam);
      setJobs(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tenantParam]);

  React.useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const onSubmit = async (values: JobFormValues) => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await createJob(tenantParam, values);
      setIsDialogOpen(false);
      form.reset();
      await loadJobs();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Ocurrió un error al registrar el trabajo.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "code",
      header: "Código OT",
      cell: ({ row }) => <code className="text-xs font-mono font-semibold">{row.getValue("code")}</code>,
    },
    {
      accessorKey: "description",
      header: "Descripción del Trabajo",
      cell: ({ row }) => <div className="max-w-xs md:max-w-md truncate font-medium text-foreground">{row.getValue("description")}</div>,
    },
    {
      accessorKey: "assignedTech",
      header: "Responsable",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("assignedTech")}</span>,
    },
    {
      accessorKey: "priority",
      header: "Prioridad",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;
        let variant: "success" | "warning" | "destructive" | "secondary" = "secondary";
        if (priority === "BAJA") variant = "secondary";
        if (priority === "MEDIA") variant = "warning";
        if (priority === "ALTA") variant = "destructive";
        return <Badge variant={variant} className="text-[10px] font-semibold">{priority}</Badge>;
      },
    },
    {
      accessorKey: "startDate",
      header: "Inicio",
      cell: ({ row }) => <span className="text-xs font-mono">{row.getValue("startDate")}</span>,
    },
    {
      accessorKey: "endDate",
      header: "Fin",
      cell: ({ row }) => <span className="text-xs font-mono">{row.getValue("endDate")}</span>,
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let variant: "success" | "warning" | "destructive" | "secondary" | "info" = "secondary";
        if (status === "COMPLETADA") variant = "success";
        if (status === "EN_PROGRESO") variant = "info";
        if (status === "PENDIENTE") variant = "warning";
        if (status === "CANCELADA") variant = "destructive";
        return <Badge variant={variant} className="text-[10px] font-semibold">{status}</Badge>;
      },
    },
  ];

  const table = useReactTable({
    data: jobs,
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="w-3.5 h-3.5" /> Módulo de Operaciones
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Trabajos y Órdenes de Trabajo (OT)
          </h1>
          <p className="text-sm text-muted-foreground">
            Planificación y seguimiento de bitácoras de ejecución de obras con validaciones automáticas.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 cursor-pointer">
              <Plus className="w-4 h-4" /> Nueva Orden de Trabajo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Abrir Orden de Trabajo</DialogTitle>
              <DialogDescription>
                Registra los parámetros operativos para programar la obra.
              </DialogDescription>
            </DialogHeader>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                {errorMsg}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción del Trabajo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Calibración de Chillers" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assignedTech"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Técnico Responsable</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el técnico" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ing. Carlos Mendoza">Ing. Carlos Mendoza (Ingeniería)</SelectItem>
                          <SelectItem value="Téc. Andrés Silva">Téc. Andrés Silva (Operaciones)</SelectItem>
                          <SelectItem value="Téc. Sofía Ramos">Téc. Sofía Ramos (Proyectos)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridad</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona la prioridad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BAJA">Baja</SelectItem>
                          <SelectItem value="MEDIA">Media</SelectItem>
                          <SelectItem value="ALTA">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Inicio Planificada</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Finalización Planificada</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                    Crear OT
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por descripción..."
            value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 border border-border rounded-lg bg-zinc-950/20">
            <Spinner size="lg" className="text-primary mb-2" />
            <span className="text-xs text-muted-foreground">Cargando órdenes de trabajo...</span>
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
                      <TableCell colSpan={7} className="h-24 text-center">
                        No se encontraron órdenes de trabajo registradas.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

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
