"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import {
  ColumnDef, ColumnFiltersState, SortingState, flexRender,
  getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, useReactTable,
} from "@tanstack/react-table";
import {
  Search, ChevronLeft, ChevronRight, ArrowRightLeft, Sparkles,
  Plus, Pencil, Trash2, Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getInventoryStock, createInventoryMovement } from "@/app/actions";
import { getInventoryItems, createInventoryItem, updateInventoryItem, softDeleteInventoryItem } from "@/app/actions/inventory-purchases";

const movementSchema = z.object({
  itemCode: z.string().min(1, { message: "Selecciona un art\u00edculo." }),
  warehouse: z.string().min(1, { message: "Selecciona la bodega." }),
  type: z.string().min(1, { message: "Selecciona el tipo." }),
  quantity: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, { message: "Cantidad debe ser > 0." }),
  notes: z.string().max(200).optional(),
});
type MovementFormValues = z.infer<typeof movementSchema>;

const itemSchema = z.object({
  itemCode: z.string().min(2, { message: "M\u00ednimo 2 caracteres." }),
  name: z.string().min(3, { message: "M\u00ednimo 3 caracteres." }),
  description: z.string().max(500).optional(),
  category: z.string().optional(),
  itemType: z.string().min(1, { message: "Selecciona el tipo." }),
  unit: z.string().min(1, { message: "Selecciona la unidad." }),
  minimumStock: z.string().optional(),
  reorderPoint: z.string().optional(),
  maximumStock: z.string().optional(),
  averageCost: z.string().optional(),
  purchasePrice: z.string().optional(),
  status: z.string().min(1, { message: "Selecciona el estado." }),
});
type ItemFormValues = z.infer<typeof itemSchema>;

interface StockItem {
  id: string; warehouseCode: string; warehouseName: string; itemCode: string;
  itemName: string; sku: string; category: string; unit: string;
  quantity: number; reserved: number; available: number;
}

interface InventoryItem {
  id: string; itemCode: string; name: string; description: string;
  category: string; itemType: string; unit: string; minimumStock: number;
  reorderPoint: number; maximumStock: number; averageCost: number;
  lastCost: number; purchasePrice: number; status: "ACTIVO" | "INACTIVO";
}

export default function InventoryPage() {
  const searchParams = useSearchParams();
  const tenantParam = searchParams.get("tenant");
  const [stock, setStock] = React.useState<StockItem[]>([]);
  const [stockLoading, setStockLoading] = React.useState(true);
  const [stockError, setStockError] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<InventoryItem[]>([]);
  const [itemsLoading, setItemsLoading] = React.useState(true);
  const [itemsError, setItemsError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"stock" | "items">("stock");
  const [isMovementSheetOpen, setIsMovementSheetOpen] = React.useState(false);
  const [submittingMovement, setSubmittingMovement] = React.useState(false);
  const [movementError, setMovementError] = React.useState<string | null>(null);
  const [isItemSheetOpen, setIsItemSheetOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<InventoryItem | null>(null);
  const [submittingItem, setSubmittingItem] = React.useState(false);
  const [itemError, setItemError] = React.useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<InventoryItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteReason, setDeleteReason] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [itemColumnFilters, setItemColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [itemSorting, setItemSorting] = React.useState<SortingState>([]);

  const movementForm = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema),
    defaultValues: { itemCode: "", warehouse: "", type: "", quantity: "", notes: "" },
  });
  const itemForm = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      itemCode: "", name: "", description: "", category: "", itemType: "Material",
      unit: "u.", minimumStock: "0", reorderPoint: "0", maximumStock: "0",
      averageCost: "0", purchasePrice: "0", status: "ACTIVO",
    },
  });

  const loadStock = React.useCallback(async () => {
    setStockLoading(true); setStockError(null);
    try { setStock(await getInventoryStock(tenantParam)); }
    catch (err: unknown) { setStockError(err instanceof Error ? err.message : "Error al cargar."); }
    finally { setStockLoading(false); }
  }, [tenantParam]);

  const loadItems = React.useCallback(async () => {
    setItemsLoading(true); setItemsError(null);
    try { setItems(await getInventoryItems(tenantParam)); }
    catch (err: unknown) { setItemsError(err instanceof Error ? err.message : "Error al cargar art\u00edculos."); }
    finally { setItemsLoading(false); }
  }, [tenantParam]);

  React.useEffect(() => { loadStock(); loadItems(); }, [loadStock, loadItems]);

  const uniqueItems = React.useMemo(() => {
    const seen = new Set<string>();
    const list: { code: string; name: string }[] = [];
    stock.forEach((s) => { if (!seen.has(s.itemCode)) { seen.add(s.itemCode); list.push({ code: s.itemCode, name: s.itemName }); } });
    return list;
  }, [stock]);

  const uniqueWarehouses = React.useMemo(() => {
    const seen = new Set<string>();
    const list: { code: string; name: string }[] = [];
    stock.forEach((s) => { if (!seen.has(s.warehouseCode)) { seen.add(s.warehouseCode); list.push({ code: s.warehouseCode, name: s.warehouseName }); } });
    return list;
  }, [stock]);

  const onMovementSubmit = async (values: MovementFormValues) => {
    setSubmittingMovement(true); setMovementError(null);
    try {
      await createInventoryMovement(tenantParam, {
        type: values.type === "ENTRADA" ? "Entrada" : "Salida",
        itemCode: values.itemCode, quantity: Number(values.quantity),
        notes: values.notes || "", sourceWarehouse: values.warehouse,
      });
      setIsMovementSheetOpen(false); movementForm.reset(); await loadStock();
    } catch (err: unknown) { setMovementError(err instanceof Error ? err.message : "Error"); }
    finally { setSubmittingMovement(false); }
  };

  const openCreateItem = () => {
    setEditingItem(null);
    itemForm.reset({ itemCode: "", name: "", description: "", category: "", itemType: "Material", unit: "u.", minimumStock: "0", reorderPoint: "0", maximumStock: "0", averageCost: "0", purchasePrice: "0", status: "ACTIVO" });
    setIsItemSheetOpen(true);
  };

  const openEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    itemForm.reset({ itemCode: item.itemCode, name: item.name, description: item.description || "", category: item.category || "", itemType: item.itemType, unit: item.unit, minimumStock: String(item.minimumStock), reorderPoint: String(item.reorderPoint), maximumStock: String(item.maximumStock), averageCost: String(item.averageCost), purchasePrice: String(item.purchasePrice), status: item.status });
    setIsItemSheetOpen(true);
  };

  const onItemSubmit = async (values: ItemFormValues) => {
    setSubmittingItem(true); setItemError(null);
    try {
      if (editingItem) {
        await updateInventoryItem(tenantParam, editingItem.id, { name: values.name, description: values.description, category: values.category, itemType: values.itemType, unit: values.unit, minimumStock: Number(values.minimumStock || 0), reorderPoint: Number(values.reorderPoint || 0), maximumStock: Number(values.maximumStock || 0), averageCost: Number(values.averageCost || 0), purchasePrice: Number(values.purchasePrice || 0), status: values.status });
      } else {
        await createInventoryItem(tenantParam, { itemCode: values.itemCode, name: values.name, description: values.description, category: values.category, itemType: values.itemType, unit: values.unit, minimumStock: Number(values.minimumStock || 0), reorderPoint: Number(values.reorderPoint || 0), maximumStock: Number(values.maximumStock || 0), averageCost: Number(values.averageCost || 0), purchasePrice: Number(values.purchasePrice || 0) });
      }
      setIsItemSheetOpen(false); await loadItems(); await loadStock();
    } catch (err: unknown) { setItemError(err instanceof Error ? err.message : "Error"); }
    finally { setSubmittingItem(false); }
  };

  const confirmDelete = (item: InventoryItem) => { setItemToDelete(item); setDeleteReason(""); setDeleteDialogOpen(true); };
  const executeDelete = async () => {
    if (!itemToDelete) return; setDeleting(true);
    try { await softDeleteInventoryItem(tenantParam, itemToDelete.id, deleteReason || "Eliminado por usuario"); setDeleteDialogOpen(false); await loadItems(); await loadStock(); }
    catch (err) { console.error(err); }
    finally { setDeleting(false); }
  };

  const stockColumns: ColumnDef<StockItem>[] = [
    { accessorKey: "warehouseName", header: "Bodega", cell: ({ row }) => <span className="font-semibold text-xs text-foreground">{row.getValue("warehouseName")}</span> },
    { accessorKey: "itemCode", header: "C\u00f3digo", cell: ({ row }) => <code className="text-[11px] font-mono text-foreground/80">{row.getValue("itemCode")}</code> },
    { accessorKey: "itemName", header: "Descripci\u00f3n", cell: ({ row }) => <div className="max-w-xs md:max-w-md truncate font-semibold text-foreground">{row.getValue("itemName")}</div> },
    { accessorKey: "quantity", header: () => <div className="text-right">F\u00edsico</div>, cell: ({ row }) => <div className="text-right font-mono text-foreground">{row.getValue("quantity")} u.</div> },
    { accessorKey: "reserved", header: () => <div className="text-right text-amber-600">Reservado</div>, cell: ({ row }) => <div className="text-right font-mono text-amber-600">{row.getValue("reserved")} u.</div> },
    { accessorKey: "available", header: () => <div className="text-right">Disponible</div>, cell: ({ row }) => { const a = Number(row.getValue("available")); return <div className="text-right font-mono font-semibold">{a} u.{a < 10 && <Badge variant="warning" className="ml-2 text-[8px] py-0 px-1 font-mono uppercase">STOCK BAJO</Badge>}</div>; } },
  ];

  const stockTable = useReactTable({ data: stock, columns: stockColumns, onSortingChange: setSorting, onColumnFiltersChange: setColumnFilters, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(), getFilteredRowModel: getFilteredRowModel(), state: { sorting, columnFilters }, initialState: { pagination: { pageSize: 10 } } });

  const itemColumns: ColumnDef<InventoryItem>[] = [
    { accessorKey: "itemCode", header: "C\u00f3digo", cell: ({ row }) => <code className="text-[11px] font-mono">{row.getValue("itemCode")}</code> },
    { accessorKey: "name", header: "Nombre", cell: ({ row }) => <span className="font-semibold text-xs">{row.getValue("name")}</span> },
    { accessorKey: "category", header: "Categor\u00eda", cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.getValue("category") || "\u2014"}</span> },
    { accessorKey: "itemType", header: "Tipo", cell: ({ row }) => <Badge variant="secondary" className="text-[9px] font-mono">{row.getValue("itemType")}</Badge> },
    { accessorKey: "unit", header: "Unidad", cell: ({ row }) => <span className="text-xs font-mono">{row.getValue("unit")}</span> },
    { accessorKey: "purchasePrice", header: () => <div className="text-right">Costo</div>, cell: ({ row }) => { const v = Number(row.getValue("purchasePrice")); return <div className="text-right text-xs font-mono">{v < 100000 ? new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:0}).format(v) : new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",minimumFractionDigits:0}).format(v)}</div>; } },
    { accessorKey: "minimumStock", header: () => <div className="text-right">M\u00edn. Stock</div>, cell: ({ row }) => <div className="text-right text-xs font-mono">{row.getValue("minimumStock")}</div> },
    { accessorKey: "status", header: "Estado", cell: ({ row }) => { const s = row.getValue("status") as string; return <Badge variant={s === "ACTIVO" ? "success" : "secondary"} className="text-[9px] font-mono uppercase">{s}</Badge>; } },
    { id: "actions", header: "", cell: ({ row }) => { const item = row.original; return <div className="flex items-center gap-1 justify-end"><Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-accent cursor-pointer" onClick={() => openEditItem(item)}><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></Button><Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-destructive/10 cursor-pointer" onClick={() => confirmDelete(item)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button></div>; } },
  ];

  const itemTable = useReactTable({ data: items, columns: itemColumns, onSortingChange: setItemSorting, onColumnFiltersChange: setItemColumnFilters, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(), getFilteredRowModel: getFilteredRowModel(), state: { sorting: itemSorting, columnFilters: itemColumnFilters }, initialState: { pagination: { pageSize: 10 } } });

  const ErrorBox = ({ msg }: { msg: string }) => <div className="p-3.5 rounded-md bg-destructive/10 border border-destructive/20 text-xs text-destructive font-mono">{msg}</div>;

  const Pagination = ({ table }: { table: ReturnType<typeof useReactTable<StockItem | InventoryItem>> }) => (
    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
      <div>P\u00e1gina {table.getState().pagination.pageIndex + 1} de {table.getPageCount() || 1}</div>
      <div className="flex items-center space-x-1.5">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="h-8 px-3 border-border bg-card hover:bg-accent text-foreground cursor-pointer"><ChevronLeft className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="h-8 px-3 border-border bg-card hover:bg-accent text-foreground cursor-pointer"><ChevronRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );

  const DataTable = <T,>({ table, colSpan }: { table: ReturnType<typeof useReactTable<T>>; colSpan: number }) => (
    <div className="rounded-lg border border-border bg-card/45 backdrop-blur-md overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="border-b border-border bg-accent/40 hover:bg-accent/40">
              {hg.headers.map((h) => <TableHead key={h.id} className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground py-3">{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>)}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-accent/30 border-b border-border/40 transition-colors">
              {row.getVisibleCells().map((cell) => <TableCell key={cell.id} className="py-2 px-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}
            </TableRow>
          )) : (
            <TableRow><TableCell colSpan={colSpan} className="h-24 text-center text-xs text-muted-foreground font-mono uppercase tracking-widest">// Sin registros.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold"><Sparkles className="w-3.5 h-3.5 text-primary" /> M\u00f3dulo de Almacenes</div>
          <h1 className="text-base font-mono uppercase tracking-widest font-bold text-foreground mt-1">Control de Inventario</h1>
          <p className="text-xs text-muted-foreground">Gesti\u00f3n de existencias, art\u00edculos y movimientos de stock.</p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet open={isMovementSheetOpen} onOpenChange={setIsMovementSheetOpen}>
            <SheetTrigger asChild><Button className="flex items-center gap-2 cursor-pointer bg-card hover:bg-accent border border-border text-foreground text-xs py-4 px-6 rounded-md shadow-sm transition-all active:scale-[0.98]"><ArrowRightLeft className="w-4 h-4" /> Registrar Movimiento</Button></SheetTrigger>
            <SheetContent className="bg-card border-l border-border p-0 overflow-y-auto w-full sm:max-w-md backdrop-blur-md">
              <div className="p-8 space-y-6 bg-card">
                <div><span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold">// Bodega / Stock</span><h3 className="text-base font-mono uppercase tracking-wider font-bold text-foreground mt-0.5">Registrar Transacci\u00f3n</h3><p className="text-xs text-muted-foreground">Registra una entrada o salida f\u00edsica de inventario.</p></div>
                {movementError && <ErrorBox msg={movementError} />}
                <Form {...movementForm}><form onSubmit={movementForm.handleSubmit(onMovementSubmit)} className="space-y-4 pt-2">
                  <FormField control={movementForm.control} name="itemCode" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">Art\u00edculo</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="bg-background border-border text-foreground text-xs shadow-inner"><SelectValue placeholder="Selecciona el art\u00edculo" /></SelectTrigger></FormControl><SelectContent className="bg-card border-border">{uniqueItems.map((i) => <SelectItem key={i.code} value={i.code}>{i.code} - {i.name}</SelectItem>)}</SelectContent></Select><FormMessage className="text-[10px] font-mono text-destructive" /></FormItem>} />
                  <FormField control={movementForm.control} name="warehouse" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">Bodega</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="bg-background border-border text-foreground text-xs shadow-inner"><SelectValue placeholder="Selecciona la bodega" /></SelectTrigger></FormControl><SelectContent className="bg-card border-border">{uniqueWarehouses.map((w) => <SelectItem key={w.code} value={w.code}>{w.name} ({w.code})</SelectItem>)}</SelectContent></Select><FormMessage className="text-[10px] font-mono text-destructive" /></FormItem>} />
                  <FormField control={movementForm.control} name="type" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">Tipo</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="bg-background border-border text-foreground text-xs shadow-inner"><SelectValue placeholder="Selecciona" /></SelectTrigger></FormControl><SelectContent className="bg-card border-border"><SelectItem value="ENTRADA">Entrada / Recepci\u00f3n</SelectItem><SelectItem value="SALIDA">Salida / Consumo</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
                  <FormField control={movementForm.control} name="quantity" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">Cantidad</FormLabel><FormControl><Input type="number" placeholder="Ej. 10" {...field} className="bg-background border-border text-foreground text-xs shadow-inner" /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={movementForm.control} name="notes" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">Comentarios</FormLabel><FormControl><Input placeholder="Referencia OT o factura" {...field} className="bg-background border-border text-foreground text-xs shadow-inner" /></FormControl><FormMessage /></FormItem>} />
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                    <Button type="button" variant="outline" onClick={() => setIsMovementSheetOpen(false)} disabled={submittingMovement} className="border-border text-foreground text-xs hover:bg-accent cursor-pointer bg-card">Cancelar</Button>
                    <Button type="submit" disabled={submittingMovement} className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs cursor-pointer px-4">{submittingMovement && <Spinner size="sm" className="mr-2 text-primary-foreground" />}Aplicar Movimiento</Button>
                  </div>
                </form></Form>
              </div>
            </SheetContent>
          </Sheet>
          <Button onClick={openCreateItem} className="flex items-center gap-2 cursor-pointer bg-card hover:bg-accent border border-border text-foreground text-xs py-4 px-6 rounded-md shadow-sm transition-all active:scale-[0.98]"><Plus className="w-4 h-4" /> Nuevo Art\u00edculo</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-card/50 border border-border rounded-lg w-fit">
        <button onClick={() => setActiveTab("stock")} className={`px-4 py-2 text-xs font-mono font-semibold rounded-md transition-all cursor-pointer ${activeTab === "stock" ? "bg-accent text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><Package className="w-3.5 h-3.5 inline mr-1.5" />Stock por Bodega</button>
        <button onClick={() => setActiveTab("items")} className={`px-4 py-2 text-xs font-mono font-semibold rounded-md transition-all cursor-pointer ${activeTab === "items" ? "bg-accent text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><Sparkles className="w-3.5 h-3.5 inline mr-1.5" />Art\u00edculos / Maestro</button>
      </div>

      {/* Stock Tab */}
      {activeTab === "stock" && (
        <div className="space-y-4">
          <div className="relative w-full max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar por art\u00edculo..." value={(stockTable.getColumn("itemName")?.getFilterValue() as string) ?? ""} onChange={(e) => stockTable.getColumn("itemName")?.setFilterValue(e.target.value)} className="pl-9 bg-card border-border text-xs text-foreground placeholder-muted-foreground/60 h-9 rounded-md shadow-inner" /></div>
          {stockLoading ? <div className="flex flex-col items-center justify-center py-12 border border-border rounded-lg bg-card/30"><Spinner size="lg" className="text-muted-foreground mb-2" /><span className="text-xs text-muted-foreground font-mono uppercase tracking-widest font-bold">Cargando existencias...</span></div> : stockError ? <ErrorBox msg={stockError} /> : <><DataTable table={stockTable} colSpan={6} /><Pagination table={stockTable} /></>}
        </div>
      )}

      {/* Items Tab */}
      {activeTab === "items" && (
        <div className="space-y-4">
          <div className="relative w-full max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar por nombre o c\u00f3digo..." value={(itemTable.getColumn("name")?.getFilterValue() as string) ?? ""} onChange={(e) => itemTable.getColumn("name")?.setFilterValue(e.target.value)} className="pl-9 bg-card border-border text-xs text-foreground placeholder-muted-foreground/60 h-9 rounded-md shadow-inner" /></div>
          {itemsLoading ? <div className="flex flex-col items-center justify-center py-12 border border-border rounded-lg bg-card/30"><Spinner size="lg" className="text-muted-foreground mb-2" /><span className="text-xs text-muted-foreground font-mono uppercase tracking-widest font-bold">Cargando art\u00edculos...</span></div> : itemsError ? <ErrorBox msg={itemsError} /> : <><DataTable table={itemTable} colSpan={9} /><Pagination table={itemTable} /></>}
        </div>
      )}

      {/* Item Create/Edit Sheet */}
      <Sheet open={isItemSheetOpen} onOpenChange={setIsItemSheetOpen}>
        <SheetContent className="bg-card border-l border-border p-0 overflow-y-auto w-full sm:max-w-lg backdrop-blur-md">
          <div className="p-8 space-y-6 bg-card">
            <div><span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold">// Art\u00edculos</span><h3 className="text-base font-mono uppercase tracking-wider font-bold text-foreground mt-0.5">{editingItem ? "Editar Art\u00edculo" : "Nuevo Art\u00edculo"}</h3><p className="text-xs text-muted-foreground">{editingItem ? "Modifica los datos del art\u00edculo." : "Registra un nuevo art\u00edculo en el sistema."}</p></div>
            {itemError && <ErrorBox msg={itemError} />}
            <Form {...itemForm}><form onSubmit={itemForm.handleSubmit(onItemSubmit)} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <FormField control={itemForm.control} name="itemCode" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">C\u00f3digo *</FormLabel><FormControl><Input disabled={!!editingItem} placeholder="Ej. MOT-001" {...field} className="bg-background border-border text-foreground text-xs shadow-inner" /></FormControl><FormMessage /></FormItem>} />
                <FormField control={itemForm.control} name="itemType" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">Tipo *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="bg-background border-border text-foreground text-xs shadow-inner"><SelectValue /></SelectTrigger></FormControl><SelectContent className="bg-card border-border"><SelectItem value="Material">Material</SelectItem><SelectItem value="Herramienta">Herramienta</SelectItem><SelectItem value="Equipo">Equipo</SelectItem><SelectItem value="Consumible">Consumible</SelectItem><SelectItem value="Repuesto">Repuesto</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
              </div>
              <FormField control={itemForm.control} name="name" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">Nombre *</FormLabel><FormControl><Input placeholder="Descripci\u00f3n del art\u00edculo" {...field} className="bg-background border-border text-foreground text-xs shadow-inner" /></FormControl><FormMessage /></FormItem>} />
              <FormField control={itemForm.control} name="description" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">Descripci\u00f3n</FormLabel><FormControl><Textarea placeholder="Detalles adicionales..." {...field} className="bg-background border-border text-foreground text-xs shadow-inner min-h-[60px]" /></FormControl><FormMessage /></FormItem>} />
              <div className="grid grid-cols-2 gap-3">
                <FormField control={itemForm.control} name="category" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">Categor\u00eda</FormLabel><FormControl><Input placeholder="Ej. Motores" {...field} className="bg-background border-border text-foreground text-xs shadow-inner" /></FormControl><FormMessage /></FormItem>} />
                <FormField control={itemForm.control} name="unit" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">Unidad *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="bg-background border-border text-foreground text-xs shadow-inner"><SelectValue /></SelectTrigger></FormControl><SelectContent className="bg-card border-border"><SelectItem value="u.">Unidad</SelectItem><SelectItem value="kg">Kilogramo</SelectItem><SelectItem value="m">Metro</SelectItem><SelectItem value="m2">Metro cuadrado</SelectItem><SelectItem value="lt">Litro</SelectItem><SelectItem value="planchas">Planchas</SelectItem><SelectItem value="rollos">Rollos</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FormField control={itemForm.control} name="minimumStock" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">Stock M\u00edn.</FormLabel><FormControl><Input type="number" {...field} className="bg-background border-border text-foreground text-xs shadow-inner" /></FormControl><FormMessage /></FormItem>} />
                <FormField control={itemForm.control} name="reorderPoint" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">Punto Reorden</FormLabel><FormControl><Input type="number" {...field} className="bg-background border-border text-foreground text-xs shadow-inner" /></FormControl><FormMessage /></FormItem>} />
                <FormField control={itemForm.control} name="maximumStock" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">Stock M\u00e1x.</FormLabel><FormControl><Input type="number" {...field} className="bg-background border-border text-foreground text-xs shadow-inner" /></FormControl><FormMessage /></FormItem>} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField control={itemForm.control} name="purchasePrice" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">Costo Compra</FormLabel><FormControl><Input type="number" placeholder="0" {...field} className="bg-background border-border text-foreground text-xs shadow-inner" /></FormControl><FormMessage /></FormItem>} />
                <FormField control={itemForm.control} name="averageCost" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">Costo Promedio</FormLabel><FormControl><Input type="number" placeholder="0" {...field} className="bg-background border-border text-foreground text-xs shadow-inner" /></FormControl><FormMessage /></FormItem>} />
              </div>
              {editingItem && <FormField control={itemForm.control} name="status" render={({ field }) => <FormItem><FormLabel className="text-xs font-semibold">Estado</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="bg-background border-border text-foreground text-xs shadow-inner"><SelectValue /></SelectTrigger></FormControl><SelectContent className="bg-card border-border"><SelectItem value="ACTIVO">ACTIVO</SelectItem><SelectItem value="INACTIVO">INACTIVO</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsItemSheetOpen(false)} disabled={submittingItem} className="border-border text-foreground text-xs hover:bg-accent cursor-pointer bg-card">Cancelar</Button>
                <Button type="submit" disabled={submittingItem} className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs cursor-pointer px-4">{submittingItem && <Spinner size="sm" className="mr-2 text-primary-foreground" />}{editingItem ? "Guardar Cambios" : "Crear Art\u00edculo"}</Button>
              </div>
            </form></Form>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader><DialogTitle className="text-sm font-mono uppercase">Confirmar Desactivaci\u00f3n</DialogTitle><DialogDescription className="text-xs text-muted-foreground">El art\u00edculo <strong>{itemToDelete?.name}</strong> ({itemToDelete?.itemCode}) ser\u00e1 desactivado (soft delete).</DialogDescription></DialogHeader>
          <div className="space-y-2"><Label className="text-xs font-semibold">Motivo de la desactivaci\u00f3n</Label><Input value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} placeholder="Ej. Art\u00edculo obsoleto, reemplazado por..." className="bg-background border-border text-foreground text-xs shadow-inner" /></div>
          <DialogFooter className="gap-2"><Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-border text-foreground text-xs cursor-pointer bg-card">Cancelar</Button><Button onClick={executeDelete} disabled={deleting} className="bg-destructive hover:bg-destructive/90 text-white text-xs cursor-pointer">{deleting && <Spinner size="sm" className="mr-2 text-white" />}Desactivar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
