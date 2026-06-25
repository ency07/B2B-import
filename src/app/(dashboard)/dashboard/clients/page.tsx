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
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { 
  ArrowUpDown, 
  Search, 
  UserPlus, 
  Phone,
  Mail,
  FileCheck2,
  ClipboardList,
  Briefcase
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, LoadingState, ErrorAlert, DataTable, SheetFormActions, TabNavigation } from "@/components/shared";
import { formatCop } from "@/utils/format";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
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

// Zod schema for client registration (flexible B2B Tax ID NIT/Cédula)
const clientSchema = z.object({
  taxId: z
    .string()
    .min(8, { message: "El ID Fiscal/NIT debe tener al menos 8 caracteres." })
    .max(15, { message: "El ID Fiscal/NIT no puede superar los 15 caracteres." })
    .regex(/^[A-Z0-9-]{8,15}$/, {
      message: "Identificación fiscal inválida. Use letras, números y guiones.",
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

  const [loadError, setLoadError] = React.useState<string | null>(null);

  // Sheet States
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [sheetMode, setSheetMode] = React.useState<"create" | "detail">("create");
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);
  const [activeTab, setActiveTab] = React.useState<"info" | "contacts" | "history">("info");

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
    setLoadError(null);
    try {
      const data = await getClients(tenantParam);
      setClients(data);
    } catch (err: any) {
      console.error("Error loading clients:", err);
      setLoadError(err.message || "Error al cargar los clientes.");
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
      setIsSheetOpen(false);
      form.reset();
      await loadClients();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Ocurrió un error al registrar el cliente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenCreate = () => {
    setSheetMode("create");
    setSelectedClient(null);
    form.reset();
    setErrorMsg(null);
    setIsSheetOpen(true);
  };

  const handleOpenDetail = (client: Client) => {
    setSheetMode("detail");
    setSelectedClient(client);
    setActiveTab("info");
    setIsSheetOpen(true);
  };

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "taxId",
      header: "ID Fiscal / NIT",
      cell: ({ row }) => <code className="text-[11px] font-mono text-foreground/80">{row.getValue("taxId")}</code>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 hover:text-foreground cursor-pointer font-semibold transition-colors border-none bg-transparent p-0 outline-hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
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
        return <div className="text-right font-mono font-bold text-foreground">{formatCop(amount)}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let variantStyle = "border-border bg-accent text-muted-foreground";
        if (status === "ACTIVO") {
          variantStyle = "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450";
        } else if (status === "PENDIENTE") {
          variantStyle = "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-450";
        } else if (status === "SUSPENDIDO") {
          variantStyle = "border-destructive/20 bg-destructive/10 text-destructive";
        }
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono border ${variantStyle}`}>
            {status}
          </span>
        );
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
        pageSize: 12,
      },
    },
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-1 space-y-6">
      
      <PageHeader
        moduleLabel="Módulo de Clientes B2B"
        title="Cuentas Industriales"
        description="Catálogo unificado de clientes B2B, contactos técnicos y facturación consolidada."
        action={
          <Button onClick={handleOpenCreate} className="flex items-center gap-2 cursor-pointer bg-card hover:bg-accent border border-border text-foreground text-xs py-4 px-6 rounded-md shadow-sm transition-all active:scale-[0.98]">
            <UserPlus className="w-4 h-4" /> Registrar Cliente
          </Button>
        }
      />

      {/* Filter and table */}
      <div className="space-y-4">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar por razón social..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="pl-9 h-9 text-xs bg-card border-border text-foreground rounded-md shadow-inner"
          />
        </div>

        {loading ? (
          <LoadingState message="Cargando cuentas..." />
        ) : (
          <DataTable
            table={table}
            columnCount={5}
            emptyMessage="// No se encontraron cuentas registradas."
            onRowClick={handleOpenDetail}
          />
        )}
      </div>

      {/* Slide-out Sheet Panel for Creation / Detailed Drill-down */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="bg-card border-l border-border p-0 overflow-y-auto w-full sm:max-w-xl backdrop-blur-md">
          
          {/* MODO CREACIÓN */}
          {sheetMode === "create" && (
            <div className="p-8 space-y-6">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold">// Nueva Cuenta</span>
                <h3 className="text-base font-mono uppercase tracking-wider font-bold text-foreground mt-0.5">Registrar Cliente B2B</h3>
                <p className="text-xs text-muted-foreground">Ingrese la identificación tributaria y la razón social legal de la planta.</p>
              </div>

              <ErrorAlert message={errorMsg} />

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {/* Tax ID */}
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-foreground">NIT / Cédula / ID Fiscal</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. 901201567-8" {...field} className="bg-background border-border text-foreground shadow-inner focus-visible:ring-primary" />
                        </FormControl>
                        <FormMessage className="text-[10px] text-destructive font-mono" />
                      </FormItem>
                    )}
                  />

                  {/* Business Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-foreground">Razón Social</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. Minera El Roble S.A." {...field} className="bg-background border-border text-foreground shadow-inner focus-visible:ring-primary" />
                        </FormControl>
                        <FormMessage className="text-[10px] text-destructive font-mono" />
                      </FormItem>
                    )}
                  />

                  {/* Segment */}
                  <FormField
                    control={form.control}
                    name="segment"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-foreground">Segmento Industrial</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background border-border text-foreground shadow-inner focus:ring-primary">
                              <SelectValue placeholder="Selecciona el segmento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-border text-foreground">
                            <SelectItem value="Minería">Minería / Siderurgia</SelectItem>
                            <SelectItem value="Alimentos">Alimentos / Farmacéutica</SelectItem>
                            <SelectItem value="Data Center">Data Center / Servidores</SelectItem>
                            <SelectItem value="HVAC Comercial">HVAC Comercial</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] text-destructive font-mono" />
                      </FormItem>
                    )}
                  />

                  {/* Contact Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-foreground">Correo Electrónico Corporativo</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="compras@mineradelroble.co" {...field} className="bg-background border-border text-foreground shadow-inner focus-visible:ring-primary" />
                        </FormControl>
                        <FormMessage className="text-[10px] text-destructive font-mono" />
                      </FormItem>
                    )}
                  />

                  <SheetFormActions
                    submitting={submitting}
                    onCancel={() => setIsSheetOpen(false)}
                    submitLabel="Guardar Cliente"
                  />
                </form>
              </Form>
            </div>
          )}

          {/* MODO DETALLE (DRILL-DOWN) */}
          {sheetMode === "detail" && selectedClient && (
            <div className="flex flex-col h-full bg-card">
              
              {/* Header de Ficha */}
              <div className="p-8 border-b border-border space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase font-bold">// Ficha de Cliente B2B</span>
                    <h3 className="text-base font-semibold text-foreground tracking-tight leading-tight">{selectedClient.name}</h3>
                    <code className="text-[9px] font-mono text-muted-foreground block">ID: {selectedClient.id}</code>
                  </div>
                  
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono border ${
                    selectedClient.status === "ACTIVO" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450" :
                    selectedClient.status === "PENDIENTE" ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-450" :
                    "border-destructive/20 bg-destructive/10 text-destructive"
                  }`}>
                    {selectedClient.status}
                  </span>
                </div>

                <TabNavigation
                  tabs={[
                    { id: "info", label: "Especificación" },
                    { id: "contacts", label: "Contactos (3)" },
                    { id: "history", label: "Historial Comercial" }
                  ]}
                  activeTab={activeTab}
                  onTabChange={(id) => setActiveTab(id as "info" | "contacts" | "history")}
                />
              </div>

              {/* Contenido de Ficha */}
              <div className="p-8 flex-1 space-y-6">
                
                {/* TAB 1: INFO GENERAL */}
                {activeTab === "info" && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg border border-border bg-accent/25 space-y-4 shadow-xs">
                      <h4 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase font-bold">// Datos de Registro</h4>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground block">Identificación Fiscal (NIT)</span>
                          <span className="font-mono font-bold text-foreground block mt-1">{selectedClient.taxId}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Segmento Técnico</span>
                          <span className="text-foreground block mt-1">{selectedClient.segment}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Facturación Consolidada</span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-450 block mt-1">{formatCop(selectedClient.totalInvoiced)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">País de Operación</span>
                          <span className="text-foreground block mt-1">Colombia</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-accent/25 space-y-3 shadow-xs">
                      <h4 className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase font-bold">// Parámetros Operacionales de Planta</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed font-light">
                        Este cliente cuenta con especificaciones de preingeniería registradas desde el wizard. Para verificar el análisis de CFD y la velocidad en ductos, consulte el expediente técnico en el módulo de Requerimientos.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: CONTACTOS MOCK */}
                {activeTab === "contacts" && (
                  <div className="space-y-4">
                    {[
                      { name: "Ing. Clara Restrepo", role: "Directora de Operaciones / HVAC", phone: "+57 312 456 7890", email: "c.restrepo@empresa.com", lead: true },
                      { name: "Mario Pérez", role: "Jefe de Mantenimiento", phone: "+57 300 987 6543", email: "m.perez@empresa.com", lead: false },
                      { name: "Sonia Valencia", role: "Compras / Abastecimiento", phone: "+57 315 222 3344", email: "s.valencia@empresa.com", lead: false }
                    ].map((contact, idx) => (
                      <div key={idx} className="p-4 rounded-lg border border-border bg-accent/20 flex items-start justify-between gap-4 shadow-xs">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground">{contact.name}</span>
                            {contact.lead && <span className="text-[8px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono">Principal</span>}
                          </div>
                          <span className="text-[10px] text-muted-foreground block">{contact.role}</span>
                          <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono pt-1">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-primary" /> {contact.phone}</span>
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-primary" /> {contact.email}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 3: HISTORIAL MOCK */}
                {activeTab === "history" && (
                  <div className="space-y-4 font-mono text-xs">
                    {[
                      { code: "COT-2026-004", desc: "Red Extracción Axial Fundición", amount: 15400000, date: "2026-06-15", status: "Aprobado", icon: FileCheck2 },
                      { code: "OT-9942", desc: "Balanceo Dinámico Turbina Extractor 15HP", amount: 2500000, date: "2026-06-10", status: "Finalizado", icon: Briefcase },
                      { code: "DIA-00892", desc: "Diagnóstico Caudal Naves A-B", amount: 0, date: "2026-06-08", status: "Emitido", icon: ClipboardList }
                    ].map((hist, idx) => {
                      const Icon = hist.icon;
                      return (
                        <div key={idx} className="p-4 rounded-lg border border-border bg-accent/20 flex items-center justify-between gap-4 shadow-xs">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-card text-muted-foreground border border-border">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground">{hist.code}</span>
                                <span className="text-[9px] px-1.5 py-0.2 bg-card text-muted-foreground rounded border border-border">{hist.status}</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground font-sans block mt-0.5">{hist.desc}</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="font-bold text-foreground block">{hist.amount > 0 ? formatCop(hist.amount) : "N/A"}</span>
                            <span className="text-[9px] text-muted-foreground block">{hist.date}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

              {/* Botón de Cierre de Ficha */}
              <div className="p-6 border-t border-border bg-accent/20 flex justify-end">
                <Button onClick={() => setIsSheetOpen(false)} className="border-border hover:bg-accent text-xs text-foreground cursor-pointer bg-card">
                  Cerrar Panel
                </Button>
              </div>
            </div>
          )}

        </SheetContent>
      </Sheet>
    </div>
  );
}
