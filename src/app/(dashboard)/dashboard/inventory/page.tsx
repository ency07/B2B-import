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
import { ArrowUpDown, Search, ChevronLeft, ChevronRight, Package, ArrowRightLeft, Sparkles } from "lucide-react";

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

// Zod schema for stock movements
const movementSchema = z.object({
  itemCode: z.string().min(1, { message: "Por favor, selecciona un artículo." }),
  warehouse: z.string().min(1, { message: "Por favor, selecciona la bodega." }),
  type: z.string().min(1, { message: "Por favor, selecciona el tipo de movimiento." }),
  quantity: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "La cantidad debe ser un número entero positivo mayor a 0.",
    }),
  notes: z.string().max(100).optional(),
});

type MovementFormValues = z.infer<typeof movementSchema>;

interface StockItem {
  id: string;
  warehouse: string;
  itemCode: string;
  description: string;
  physical: number;
  reserved: number;
  available: number;
}

// Initial mock stock data
const INITIAL_STOCK: StockItem[] = [
  { id: "1", warehouse: "Bodega Norte (Principal)", itemCode: "ART-1001", description: "Cable de cobre calibre 10 (Rollo 100m)", physical: 50, reserved: 12, available: 38 },
  { id: "2", warehouse: "Bodega Norte (Principal)", itemCode: "ART-1002", description: "Interruptor termomagnético 3x100A", physical: 15, reserved: 0, available: 15 },
  { id: "3", warehouse: "Bodega Sur (Secundaria)", itemCode: "ART-1003", description: "Válvula de compuerta 2 pulgadas bridada", physical: 8, reserved: 3, available: 5 },
  { id: "4", warehouse: "Bodega Sur (Secundaria)", itemCode: "ART-1004", description: "Manómetro de presión 0-100 psi", physical: 25, reserved: 5, available: 20 },
];

export default function InventoryPage() {
  const [stock, setStock] = React.useState<StockItem[]>(INITIAL_STOCK);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      itemCode: "",
      warehouse: "",
      type: "",
      quantity: "",
      notes: "",
    },
  });

  const onSubmit = (values: MovementFormValues) => {
    const qty = Number(values.quantity);
    setStock((prev) =>
      prev.map((item) => {
        if (item.itemCode === values.itemCode && item.warehouse === values.warehouse) {
          const newPhysical =
            values.type === "ENTRADA" ? item.physical + qty : item.physical - qty;
          const newAvailable = newPhysical - item.reserved;
          return {
            ...item,
            physical: newPhysical,
            available: newAvailable,
          };
        }
        return item;
      })
    );
    setIsDialogOpen(false);
    form.reset();
  };

  const columns: ColumnDef<StockItem>[] = [
    {
      accessorKey: "warehouse",
      header: "Bodega",
      cell: ({ row }) => <span className="font-semibold text-xs">{row.getValue("warehouse")}</span>,
    },
    {
      accessorKey: "itemCode",
      header: "Código",
      cell: ({ row }) => <code className="text-xs font-mono font-semibold">{row.getValue("itemCode")}</code>,
    },
    {
      accessorKey: "description",
      header: "Descripción",
      cell: ({ row }) => <div className="max-w-xs md:max-w-md truncate font-medium">{row.getValue("description")}</div>,
    },
    {
      accessorKey: "physical",
      header: () => <div className="text-right">Físico</div>,
      cell: ({ row }) => <div className="text-right font-mono">{row.getValue("physical")} u.</div>,
    },
    {
      accessorKey: "reserved",
      header: () => <div className="text-right text-amber-600 dark:text-amber-400">Reservado</div>,
      cell: ({ row }) => <div className="text-right font-mono text-amber-600 dark:text-amber-400">{row.getValue("reserved")} u.</div>,
    },
    {
      accessorKey: "available",
      header: () => <div className="text-right">Disponible</div>,
      cell: ({ row }) => {
        const available = Number(row.getValue("available"));
        const isLow = available < 10;
        return (
          <div className="text-right font-mono font-semibold">
            {available} u.
            {isLow && (
              <Badge variant="warning" className="ml-2 text-[9px] py-0 px-1">STOCK BAJO</Badge>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: stock,
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
            <Sparkles className="w-3.5 h-3.5" /> Módulo de Almacenes
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Control de Inventario
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitoreo de existencias de materiales, control de reservas y registro de movimientos de stock.
          </p>
        </div>

        {/* Dialog Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4" /> Registrar Movimiento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Transacción de Stock</DialogTitle>
              <DialogDescription>
                Ingresa una entrada o salida física de inventario para una bodega.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                {/* Item Selection */}
                <FormField
                  control={form.control}
                  name="itemCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Artículo / Insumo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el artículo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {stock.map((item) => (
                            <SelectItem key={item.id} value={item.itemCode}>
                              {item.itemCode} - {item.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Warehouse */}
                <FormField
                  control={form.control}
                  name="warehouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bodega Destino</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona la bodega" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Bodega Norte (Principal)">Bodega Norte (Principal)</SelectItem>
                          <SelectItem value="Bodega Sur (Secundaria)">Bodega Sur (Secundaria)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Movement Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Movimiento</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ENTRADA">Entrada / Recepción</SelectItem>
                          <SelectItem value="SALIDA">Salida / Consumo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Quantity */}
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad Transaccionada</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ej. 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comentarios / Referencia</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. OT-2026-001 o factura N°102" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Aplicar Movimiento</Button>
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
            placeholder="Buscar por artículo..."
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
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron artículos en stock.
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
