"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Search, Plus, Sparkles, ShoppingCart, Warehouse, CheckCircle2, ArrowRight, X, Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { getPurchaseOrders, getPurchaseOrderDetail, createPurchaseOrder, updatePurchaseOrderStatus, receivePurchaseOrderItems, getVendors, createVendor } from "@/app/actions/inventory-purchases";
import { exportPurchaseOrdersToExcel } from "@/app/actions/exports-finance";
import { exportToExcel, exportToCsv } from "@/utils/file-exports";

const formatCurrency = (amount: number) => {
  if (amount < 100000) return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(amount);
};

interface PO {
  id: string; code: string; vendorName: string; vendorCode: string; orderDate: string;
  expectedDeliveryDate: string; actualDeliveryDate: string; subtotalAmount: number;
  taxAmount: number; totalAmount: number; currency: string;
  status: "BORRADOR" | "ENVIADA" | "APROBADA" | "EN_CAMINO" | "RECIBIDO_PARCIAL" | "RECIBIDO" | "CANCELADA";
  paymentStatus: "PENDIENTE" | "PARCIALMENTE_PAGADA" | "PAGADA"; notes: string;
}
interface Vendor { id: string; code: string; name: string; taxId: string; contactName: string; contactEmail: string; contactPhone: string; city: string; paymentTerms: number; status: string; }
interface POItem {
  id: string; line_number: number; description: string; quantity: number; unit: string;
  unit_price: number; line_total: number; received_quantity: number; quality_checked: boolean;
  inventory_items?: { item_code: string; name: string; unit: string } | null;
}

export default function PurchasesPage() {
  const searchParams = useSearchParams();
  const tenantParam = searchParams.get("tenant");

  const [purchaseOrders, setPurchaseOrders] = React.useState<PO[]>([]);
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPO, setSelectedPO] = React.useState<PO | null>(null);
  const [poItems, setPoItems] = React.useState<POItem[]>([]);
  const [loadingDetail, setLoadingDetail] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Create PO state
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [newItems, setNewItems] = React.useState<{ description: string; quantity: string; unit: string; unitPrice: string }[]>([
    { description: "", quantity: "", unit: "u.", unitPrice: "" },
  ]);
  const [selectedVendorId, setSelectedVendorId] = React.useState("");
  const [expectedDate, setExpectedDate] = React.useState("");
  const [poNotes, setPoNotes] = React.useState("");

  // Vendor create state
  const [isVendorOpen, setIsVendorOpen] = React.useState(false);
  const [vendorForm, setVendorForm] = React.useState({ legalName: "", taxId: "", contactName: "", contactEmail: "", contactPhone: "", city: "Bogotá", paymentTerms: "30" });
  const [submittingVendor, setSubmittingVendor] = React.useState(false);

  // Receive modal
  const [receiveModalOpen, setReceiveModalOpen] = React.useState(false);
  const [receiveItems, setReceiveItems] = React.useState<Record<string, { qty: string; checked: boolean }>>({});

  const loadData = React.useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [pos, vnds] = await Promise.all([getPurchaseOrders(tenantParam), getVendors(tenantParam)]);
      setPurchaseOrders(pos); setVendors(vnds);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar datos.");
    } finally { setLoading(false); }
  }, [tenantParam]);

  React.useEffect(() => { loadData(); }, [loadData]);

  const loadDetail = async (po: PO) => {
    setSelectedPO(po); setLoadingDetail(true);
    try {
      const detail = await getPurchaseOrderDetail(tenantParam, po.id);
      setPoItems((detail as Record<string, unknown>).purchase_order_items as POItem[] || []);
    } catch (err) { console.error(err); }
    finally { setLoadingDetail(false); }
  };

  const handleStatusUpdate = async (poId: string, newStatus: string) => {
    setSubmitting(true);
    try {
      await updatePurchaseOrderStatus(tenantParam, poId, newStatus);
      await loadData();
      if (selectedPO?.id === poId) setSelectedPO(prev => prev ? { ...prev, status: newStatus as PO["status"] } : null);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Error al actualizar estado."); }
    finally { setSubmitting(false); }
  };

  const handleCreatePO = async () => {
    if (!selectedVendorId) { setSubmitError("Selecciona un proveedor."); return; }
    const validItems = newItems.filter(i => i.description.trim() && Number(i.quantity) > 0 && Number(i.unitPrice) >= 0);
    if (validItems.length === 0) { setSubmitError("Agrega al menos un ítem."); return; }
    setSubmitting(true); setSubmitError(null);
    try {
      await createPurchaseOrder(tenantParam, {
        vendorId: selectedVendorId,
        expectedDeliveryDate: expectedDate || undefined,
        notes: poNotes || undefined,
        items: validItems.map(i => ({ description: i.description, quantity: Number(i.quantity), unit: i.unit || "u.", unitPrice: Number(i.unitPrice) })),
      });
      setIsCreateOpen(false); resetCreateForm(); await loadData();
    } catch (err: unknown) { setSubmitError(err instanceof Error ? err.message : "Error al crear OC."); }
    finally { setSubmitting(false); }
  };

  const resetCreateForm = () => {
    setSelectedVendorId(""); setExpectedDate(""); setPoNotes("");
    setNewItems([{ description: "", quantity: "", unit: "u.", unitPrice: "" }]);
  };

  const handleCreateVendor = async () => {
    if (!vendorForm.legalName.trim()) return;
    setSubmittingVendor(true);
    try {
      await createVendor(tenantParam, {
        legalName: vendorForm.legalName, taxId: vendorForm.taxId, contactName: vendorForm.contactName,
        contactEmail: vendorForm.contactEmail || undefined, contactPhone: vendorForm.contactPhone,
        city: vendorForm.city, paymentTerms: Number(vendorForm.paymentTerms || 30),
      });
      const vnds = await getVendors(tenantParam); setVendors(vnds);
      setIsVendorOpen(false); setVendorForm({ legalName: "", taxId: "", contactName: "", contactEmail: "", contactPhone: "", city: "Bogotá", paymentTerms: "30" });
    } catch (err) { console.error(err); }
    finally { setSubmittingVendor(false); }
  };

  const openReceiveModal = () => {
    if (!poItems.length) return;
    const initial: Record<string, { qty: string; checked: boolean }> = {};
    poItems.forEach(item => { initial[item.id] = { qty: String(Number(item.quantity) - Number(item.received_quantity)), checked: false }; });
    setReceiveItems(initial); setReceiveModalOpen(true);
  };

  const handleReceive = async () => {
    if (!selectedPO) return; setSubmitting(true);
    try {
      const items = Object.entries(receiveItems).map(([id, val]) => ({ itemId: id, receivedQty: Number(val.qty), qualityChecked: val.checked }));
      await receivePurchaseOrderItems(tenantParam, selectedPO.id, items);
      setReceiveModalOpen(false); await loadDetail(selectedPO); await loadData();
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const handleExport = async (format: "xlsx" | "csv") => {
    try {
      const data = await exportPurchaseOrdersToExcel(tenantParam);
      const filename = `Ordenes_Compra_${new Date().toISOString().substring(0, 10)}`;
      if (format === "xlsx") exportToExcel(data, filename, "Ordenes de Compra");
      else exportToCsv(data, filename);
    } catch (err) { console.error("Export error:", err); }
  };

  const filteredPOs = purchaseOrders.filter(po =>
    po.code.toLowerCase().includes(searchQuery.toLowerCase()) || po.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const newTotal = newItems.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0);

  const statusVariant = (status: string): "secondary" | "warning" | "success" | "destructive" => {
    if (status === "RECIBIDO") return "success";
    if (status === "EN_CAMINO" || status === "RECIBIDO_PARCIAL") return "warning";
    if (status === "CANCELADA") return "destructive";
    return "secondary";
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Módulo de Abastecimiento
          </div>
          <h1 className="text-base font-mono uppercase tracking-widest font-bold text-foreground mt-1">Órdenes de Compra (OC)</h1>
          <p className="text-xs text-muted-foreground">Control de adquisiciones con gestión de proveedores y recepción en bodega.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => handleExport("xlsx")} variant="outline" className="text-xs border-border bg-card hover:bg-accent text-foreground cursor-pointer flex items-center gap-1"><FileSpreadsheet className="w-3.5 h-3.5" />Excel</Button>
          <Button onClick={() => handleExport("csv")} variant="outline" className="text-xs border-border bg-card hover:bg-accent text-foreground cursor-pointer flex items-center gap-1"><Download className="w-3.5 h-3.5" />CSV</Button>
          <Button onClick={() => setIsVendorOpen(true)} variant="outline" className="flex items-center gap-2 text-xs border-border bg-card hover:bg-accent text-foreground cursor-pointer"><Plus className="w-3.5 h-3.5" />Proveedor</Button>
          <Button onClick={() => { resetCreateForm(); setIsCreateOpen(true); }} className="flex items-center gap-2 bg-card hover:bg-accent border border-border text-foreground text-xs py-4 px-6 rounded-md shadow-sm cursor-pointer"><Plus className="w-4 h-4" />Nueva OC</Button>
        </div>
      </div>

      {error && <div className="p-3.5 rounded-md bg-destructive/10 border border-destructive/20 text-xs text-destructive font-mono">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* PO List */}
        <div className="xl:col-span-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Buscar por folio o proveedor..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-card border-border text-xs h-9 rounded-md shadow-inner" />
          </div>
          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {loading ? (
              <div className="flex items-center justify-center py-12"><Spinner size="lg" /></div>
            ) : filteredPOs.map(po => (
              <div key={po.id} onClick={() => loadDetail(po)} className={`p-4 rounded-xl border transition-all cursor-pointer text-left space-y-2.5 ${selectedPO?.id === po.id ? "bg-accent border-primary/50 shadow-md" : "bg-card/50 border-border hover:bg-accent/40"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-foreground bg-accent border border-border px-1.5 py-0.5 rounded shadow-sm">{po.code}</span>
                  <Badge variant={statusVariant(po.status)} className="text-[8px] py-0 px-1 font-semibold font-mono uppercase">{po.status}</Badge>
                </div>
                <h4 className="text-xs font-semibold text-foreground tracking-tight line-clamp-1">{po.vendorName}</h4>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono">
                  <span>{po.orderDate}</span>
                  <span className="text-foreground font-bold">{formatCurrency(po.totalAmount)}</span>
                </div>
              </div>
            ))}
            {!loading && filteredPOs.length === 0 && (
              <div className="border border-border bg-card/20 rounded-xl p-8 text-center text-xs text-muted-foreground font-mono uppercase tracking-widest">// Sin órdenes de compra.</div>
            )}
          </div>
        </div>

        {/* PO Detail */}
        <div className="xl:col-span-8 border border-border bg-card/45 rounded-xl backdrop-blur-md overflow-hidden flex flex-col min-h-[640px]">
          {selectedPO ? (
            <div className="flex-grow flex flex-col">
              <div className="p-6 border-b border-border bg-accent/25 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-muted-foreground">{selectedPO.code}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">• {selectedPO.orderDate}</span>
                  </div>
                  <h3 className="font-mono text-sm uppercase tracking-wider font-bold text-foreground mt-0.5">{selectedPO.vendorName}</h3>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant={statusVariant(selectedPO.status)} className="text-[10px] font-semibold py-0.5 px-2">{selectedPO.status}</Badge>
                  <div className="text-[10px] font-mono text-muted-foreground">Pago: {selectedPO.paymentStatus}</div>
                </div>
              </div>

              <div className="p-6 flex-1 space-y-6 overflow-y-auto max-h-[580px]">
                {/* Items table */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <ShoppingCart className="w-3.5 h-3.5 text-primary" /> Materiales Adquiridos
                  </div>
                  {loadingDetail ? (
                    <div className="flex items-center justify-center py-8"><Spinner size="lg" /></div>
                  ) : (
                    <div className="rounded-lg border border-border bg-accent/20 overflow-hidden">
                      <table className="w-full border-collapse text-left">
                        <thead className="bg-accent/40 border-b border-border text-[9px] font-mono uppercase text-muted-foreground font-bold">
                          <tr><th className="p-2 pl-3">Descripción</th><th className="p-2 text-right">Cantidad</th><th className="p-2 text-right">Costo Unit.</th><th className="p-2 text-right pr-3">Total</th></tr>
                        </thead>
                        <tbody className="text-xs font-mono text-foreground divide-y divide-border/40">
                          {poItems.map((it) => (
                            <tr key={it.id} className="hover:bg-accent/20">
                              <td className="p-2 pl-3 font-sans font-medium">{it.description}</td>
                              <td className="p-2 text-right">
                                {it.received_quantity > 0 ? <><span className="text-emerald-600">{it.received_quantity}</span>/{it.quantity}</> : it.quantity} {it.unit}
                              </td>
                              <td className="p-2 text-right">{formatCurrency(it.unit_price)}</td>
                              <td className="p-2 text-right font-bold pr-3">{formatCurrency(it.line_total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="flex justify-end text-xs font-mono">
                    <div className="bg-accent/25 border border-border rounded px-4 py-2 flex items-center gap-4 shadow-sm">
                      <span className="text-muted-foreground uppercase font-bold">// Total:</span>
                      <span className="text-emerald-600 dark:text-emerald-450 font-bold text-sm">{formatCurrency(selectedPO.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {selectedPO.notes && (
                  <div className="text-xs text-muted-foreground bg-accent/10 border border-border rounded-lg p-3">
                    <span className="font-mono font-bold uppercase text-[10px]">Notas: </span>{selectedPO.notes}
                  </div>
                )}

                {/* Status Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  {selectedPO.status === "BORRADOR" && (
                    <Button onClick={() => handleStatusUpdate(selectedPO.id, "ENVIADA")} disabled={submitting} className="text-xs cursor-pointer">
                      {submitting ? <Spinner size="sm" className="mr-1" /> : <ArrowRight className="w-3.5 h-3.5 mr-1" />}Enviar a Proveedor
                    </Button>
                  )}
                  {selectedPO.status === "ENVIADA" && (
                    <Button onClick={() => handleStatusUpdate(selectedPO.id, "APROBADA")} disabled={submitting} className="text-xs cursor-pointer">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />Aprobar
                    </Button>
                  )}
                  {selectedPO.status === "APROBADA" && (
                    <Button onClick={() => handleStatusUpdate(selectedPO.id, "EN_CAMINO")} disabled={submitting} className="text-xs cursor-pointer">
                      <ShoppingCart className="w-3.5 h-3.5 mr-1" />Marcar En Camino
                    </Button>
                  )}
                  {(selectedPO.status === "EN_CAMINO" || selectedPO.status === "RECIBIDO_PARCIAL") && (
                    <Button onClick={openReceiveModal} disabled={submitting} className="text-xs cursor-pointer">
                      <Warehouse className="w-3.5 h-3.5 mr-1" />Recibir en Bodega
                    </Button>
                  )}
                  {!["RECIBIDO", "CANCELADA"].includes(selectedPO.status) && (
                    <Button onClick={() => handleStatusUpdate(selectedPO.id, "CANCELADA")} variant="destructive" disabled={submitting} className="text-xs cursor-pointer ml-auto">
                      Cancelar OC
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Selecciona una orden de compra</p>
            </div>
          )}
        </div>
      </div>

      {/* Create PO Sheet */}
      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className="bg-card border-l border-border p-0 overflow-y-auto w-full sm:max-w-2xl">
          <div className="p-8 space-y-6">
            <SheetHeader>
              <SheetTitle className="text-base font-mono uppercase">Nueva Orden de Compra</SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">Crea una OC con los ítems y proveedor.</SheetDescription>
            </SheetHeader>
            {submitError && <div className="p-3.5 rounded-md bg-destructive/10 border border-destructive/20 text-xs text-destructive font-mono">{submitError}</div>}

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Proveedor *</Label>
              <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
                <SelectTrigger className="bg-background border-border text-foreground text-xs shadow-inner"><SelectValue placeholder="Selecciona proveedor" /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {vendors.filter(v => v.status === "ACTIVO").map(v => <SelectItem key={v.id} value={v.id}>{v.code} - {v.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div><Label className="text-xs font-semibold">Fecha Entrega Esperada</Label><Input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} className="mt-1 bg-background border-border text-foreground text-xs shadow-inner" /></div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Ítems de la OC *</Label>
                <Button type="button" onClick={() => setNewItems(prev => [...prev, { description: "", quantity: "", unit: "u.", unitPrice: "" }])} variant="outline" size="sm" className="text-[10px] border-border cursor-pointer"><Plus className="w-3 h-3 mr-1" />Agregar</Button>
              </div>
              {newItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-5"><Input placeholder="Descripción" value={item.description} onChange={(e) => setNewItems(prev => prev.map((r, i) => i === idx ? { ...r, description: e.target.value } : r))} className="bg-background border-border text-foreground text-[11px] shadow-inner h-8" /></div>
                  <div className="col-span-2"><Input type="number" placeholder="Cant." value={item.quantity} onChange={(e) => setNewItems(prev => prev.map((r, i) => i === idx ? { ...r, quantity: e.target.value } : r))} className="bg-background border-border text-foreground text-[11px] shadow-inner h-8" /></div>
                  <div className="col-span-1"><Input placeholder="u." value={item.unit} onChange={(e) => setNewItems(prev => prev.map((r, i) => i === idx ? { ...r, unit: e.target.value } : r))} className="bg-background border-border text-foreground text-[11px] shadow-inner h-8" /></div>
                  <div className="col-span-3"><Input type="number" placeholder="P. unit." value={item.unitPrice} onChange={(e) => setNewItems(prev => prev.map((r, i) => i === idx ? { ...r, unitPrice: e.target.value } : r))} className="bg-background border-border text-foreground text-[11px] shadow-inner h-8" /></div>
                  <div className="col-span-1 flex items-center justify-center">
                    {newItems.length > 1 && <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer hover:bg-destructive/10" onClick={() => setNewItems(prev => prev.filter((_, i) => i !== idx))}><X className="w-3.5 h-3.5 text-destructive" /></Button>}
                  </div>
                </div>
              ))}
              <div className="text-right text-xs font-mono text-muted-foreground">Total Estimado: <span className="text-foreground font-bold">{formatCurrency(newTotal)}</span></div>
            </div>

            <Textarea placeholder="Notas internas (opcional)..." value={poNotes} onChange={(e) => setPoNotes(e.target.value)} className="bg-background border-border text-foreground text-xs shadow-inner min-h-[60px]" />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="border-border text-foreground text-xs cursor-pointer bg-card">Cancelar</Button>
              <Button onClick={handleCreatePO} disabled={submitting} className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs cursor-pointer px-4">
                {submitting && <Spinner size="sm" className="mr-2" />}Crear OC
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Vendor Sheet */}
      <Sheet open={isVendorOpen} onOpenChange={setIsVendorOpen}>
        <SheetContent className="bg-card border-l border-border p-0 overflow-y-auto w-full sm:max-w-md">
          <div className="p-8 space-y-6">
            <SheetHeader>
              <SheetTitle className="text-base font-mono uppercase">Nuevo Proveedor</SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">Registra un proveedor en el sistema.</SheetDescription>
            </SheetHeader>
            <div className="space-y-4">
              <div><Label className="text-xs font-semibold">Razón Social *</Label><Input placeholder="Nombre legal" value={vendorForm.legalName} onChange={(e) => setVendorForm(prev => ({ ...prev, legalName: e.target.value }))} className="mt-1 bg-background border-border text-foreground text-xs shadow-inner" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs font-semibold">NIT</Label><Input placeholder="901.xxx.xxx-x" value={vendorForm.taxId} onChange={(e) => setVendorForm(prev => ({ ...prev, taxId: e.target.value }))} className="mt-1 bg-background border-border text-foreground text-xs shadow-inner" /></div>
                <div><Label className="text-xs font-semibold">Teléfono</Label><Input value={vendorForm.contactPhone} onChange={(e) => setVendorForm(prev => ({ ...prev, contactPhone: e.target.value }))} className="mt-1 bg-background border-border text-foreground text-xs shadow-inner" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs font-semibold">Contacto</Label><Input value={vendorForm.contactName} onChange={(e) => setVendorForm(prev => ({ ...prev, contactName: e.target.value }))} className="mt-1 bg-background border-border text-foreground text-xs shadow-inner" /></div>
                <div><Label className="text-xs font-semibold">Email</Label><Input type="email" value={vendorForm.contactEmail} onChange={(e) => setVendorForm(prev => ({ ...prev, contactEmail: e.target.value }))} className="mt-1 bg-background border-border text-foreground text-xs shadow-inner" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs font-semibold">Ciudad</Label><Input value={vendorForm.city} onChange={(e) => setVendorForm(prev => ({ ...prev, city: e.target.value }))} className="mt-1 bg-background border-border text-foreground text-xs shadow-inner" /></div>
                <div><Label className="text-xs font-semibold">Plazo Pago (días)</Label><Input type="number" value={vendorForm.paymentTerms} onChange={(e) => setVendorForm(prev => ({ ...prev, paymentTerms: e.target.value }))} className="mt-1 bg-background border-border text-foreground text-xs shadow-inner" /></div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setIsVendorOpen(false)} className="border-border text-foreground text-xs cursor-pointer bg-card">Cancelar</Button>
                <Button onClick={handleCreateVendor} disabled={submittingVendor} className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs cursor-pointer">
                  {submittingVendor && <Spinner size="sm" className="mr-2" />}Crear Proveedor
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Receive Modal */}
      <Dialog open={receiveModalOpen} onOpenChange={setReceiveModalOpen}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-mono uppercase">Recepción en Bodega — {selectedPO?.code}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Registra cantidades recibidas y verifica calidad.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {poItems.map(item => {
              const pending = Number(item.quantity) - Number(item.received_quantity);
              const ri = receiveItems[item.id] || { qty: String(pending), checked: false };
              return (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-accent/20">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{item.description}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">Pedido: {item.quantity} {item.unit} • Recibido previo: {item.received_quantity}</p>
                  </div>
                  <Input type="number" value={ri.qty} max={pending} onChange={(e) => setReceiveItems(prev => ({ ...prev, [item.id]: { ...prev[item.id], qty: e.target.value } }))} className="w-20 bg-background border-border text-foreground text-xs shadow-inner h-8 text-center" />
                  <div className="flex items-center gap-2">
                    <Checkbox checked={ri.checked} onCheckedChange={(checked) => setReceiveItems(prev => ({ ...prev, [item.id]: { ...prev[item.id], checked: !!checked } }))} />
                    <span className="text-[10px] text-muted-foreground">OK</span>
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReceiveModalOpen(false)} className="text-xs cursor-pointer">Cancelar</Button>
            <Button onClick={handleReceive} disabled={submitting} className="text-xs cursor-pointer">
              {submitting ? <Spinner size="sm" className="mr-1" /> : <Warehouse className="w-3.5 h-3.5 mr-1" />}Confirmar Recepción
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}