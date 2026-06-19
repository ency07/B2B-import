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
import { ArrowUpDown, Search, ChevronLeft, ChevronRight, Briefcase, Plus, Sparkles } from "lucide-react";

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

// Initial mock jobs
const INITIAL_JOBS: Job[] = [
  { id: "1", code: "JOB-2026-001", description: "Mantenimiento preventivo subestación eléctrica sur", assignedTech: "Ing. Carlos Mendoza", priority: "ALTA", startDate: "2026-06-20", endDate: "2026-06-22", status: "EN_PROGRESO" },
  { id: "2", code: "JOB-2026-002", description: "Instalación de acometida y cableado estructurado racks", assignedTech: "Téc. Andrés Silva", priority: "MEDIA", startDate: "2026-06-21", endDate: "2026-06-25", status: "PENDIENTE" },
  { id: "3", code: "JOB-2026-003", description: "Calibración de sensores de presión de líneas de vapor", assignedTech: "Ing. Carlos Mendoza", priority: "ALTA", startDate: "2026-06-15", endDate: "2026-06-16", status: "COMPLETADA" },
  { id: "4", code: "JOB-2026-004", description: "Pintura y adecuación física bodegas de químicos", assignedTech: "Téc. Sofía Ramos", priority: "BAJA", startDate: "2026-06-25", endDate: "2026-06-28", status: "PENDIENTE" },
];

export default function JobsPage() {
  const [jobs, setJobs] = React.useState<Job[]>(INITIAL_JOBS);
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

  const onSubmit = (values: JobFormValues) => {
    const nextCode = `JOB-2026-00${jobs.length + 1}`;
    const newJob: Job = {
      id: String(jobs.length + 1),
      code: nextCode,
      description: values.description,
      assignedTech: values.assignedTech,
      priority: values.priority as "BAJA" | "MEDIA" | "ALTA",
      startDate: values.startDate,
      endDate: values.endDate,
      status: "PENDIENTE",
    };
    setJobs((prev) => [newJob, ...prev]);
    setIsDialogOpen(false);
    form.reset();
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
      cell: ({ row }) => <div className="max-w-xs md:max-w-md truncate font-medium">{row.getValue("description")}</div>,
    },
    {
      accessorKey: "assignedTech",
      header: "Responsable",
      cell: ({ row }) => <span className="text-sm">{row.getValue("assignedTech")}</span>,
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="w-3.5 h-3.5" /> Módulo de Operaciones
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Órdenes de Trabajo (Jobs)
          </h1>
          <p className="text-sm text-muted-foreground">
            Control de actividades, asignación de responsabilidades y monitoreo de plazos de entrega.
          </p>
        </div>

        {/* Dialog Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Crear Orden de Trabajo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Orden de Trabajo</DialogTitle>
              <DialogDescription>
                Ingresa los detalles para la planificación e inicio del trabajo.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción del Trabajo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Reparación de caldera principal..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Assigned Technician */}
                <FormField
                  control={form.control}
                  name="assignedTech"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsable / Técnico</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el responsable" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ing. Carlos Mendoza">Ing. Carlos Mendoza</SelectItem>
                          <SelectItem value="Téc. Andrés Silva">Téc. Andrés Silva</SelectItem>
                          <SelectItem value="Téc. Sofía Ramos">Téc. Sofía Ramos</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Priority */}
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

                {/* Date Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Start Date */}
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha Inicio</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* End Date */}
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha Fin</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Programar OT</Button>
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
            placeholder="Buscar por descripción..."
            value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
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
                  <TableCell colSpan={7} className="h-24 text-center">
                    No hay trabajos programados.
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
