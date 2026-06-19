"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  FileText,
  DollarSign,
  Briefcase,
  Users,
  Percent,
} from "lucide-react";

// Mock data for charts
const FINANCIAL_DATA = [
  { month: "Ene", facturado: 65000, cobrado: 48000 },
  { month: "Feb", facturado: 78000, cobrado: 62000 },
  { month: "Mar", facturado: 92000, cobrado: 75000 },
  { month: "Abr", facturado: 81000, cobrado: 79000 },
  { month: "May", facturado: 104000, cobrado: 90000 },
  { month: "Jun", facturado: 124500, cobrado: 98200 },
];

const JOB_CATEGORIES = [
  { name: "Montajes", activos: 15, completados: 28 },
  { name: "Mantenimiento", activos: 18, completados: 45 },
  { name: "Preingeniería", activos: 6, completados: 12 },
  { name: "Garantías", activos: 3, completados: 9 },
];

const LEAD_SOURCES = [
  { name: "Wizard / Web", value: 45, color: "var(--color-primary, #18181b)" },
  { name: "Telefonía", value: 30, color: "#10b981" }, // Emerald
  { name: "Referido B2B", value: 25, color: "#f59e0b" }, // Amber
];

export default function DashboardPage() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-[50vh] text-muted-foreground animate-pulse">
        Cargando analítica...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Dashboard Analítico
        </h1>
        <p className="text-sm text-muted-foreground">
          Centro de monitoreo de facturación, trabajos y conversión comercial en tiempo real.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-xs relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Facturación Emitida
            </span>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">$124,500.00</div>
          <div className="mt-1 text-xs text-emerald-500 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.5% vs mes anterior
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pagos Recibidos
            </span>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">$98,200.00</div>
          <div className="mt-1 text-xs text-emerald-500 font-medium">
            78.8% de tasa de cobro directo
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Órdenes de Trabajo
            </span>
            <Briefcase className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">42 Activas</div>
          <div className="mt-1 text-xs text-amber-500 font-medium">
            5 actividades pendientes de asignar
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cumplimiento SLA
            </span>
            <Percent className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">94.4%</div>
          <div className="mt-1 text-xs text-emerald-500 font-medium">
            18 leads atendidos a tiempo
          </div>
        </div>
      </div>

      {/* Charts Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Financial Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card shadow-xs flex flex-col">
          <div className="mb-4">
            <h3 className="font-display text-lg font-bold text-foreground">
              Flujo de Caja (Facturado vs Cobrado)
            </h3>
            <p className="text-xs text-muted-foreground">
              Comparativa semestral del valor de facturas emitidas frente a abonos registrados.
            </p>
          </div>
          <div className="h-80 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={FINANCIAL_DATA} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFacturado" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary, #18181b)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-primary, #18181b)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCobrado" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--border), 0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="currentColor" className="text-[10px] text-muted-foreground" tickLine={false} />
                <YAxis stroke="currentColor" className="text-[10px] text-muted-foreground" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelClassName="font-semibold text-foreground"
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                <Area
                  type="monotone"
                  name="Facturado ($)"
                  dataKey="facturado"
                  stroke="var(--color-primary, #18181b)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorFacturado)"
                />
                <Area
                  type="monotone"
                  name="Cobrado ($)"
                  dataKey="cobrado"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCobrado)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Source Pie Chart */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-xs flex flex-col">
          <div className="mb-4">
            <h3 className="font-display text-lg font-bold text-foreground">
              Conversión de Leads
            </h3>
            <p className="text-xs text-muted-foreground">
              Distribución de prospectos según el canal de captación comercial.
            </p>
          </div>
          <div className="h-60 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={LEAD_SOURCES}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {LEAD_SOURCES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground">100</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total Leads</span>
            </div>
          </div>
          {/* Legend Items */}
          <div className="mt-4 space-y-2 text-xs">
            {LEAD_SOURCES.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
                <span className="font-semibold text-foreground">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Categories Bar Chart */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-xs flex flex-col">
        <div className="mb-4">
          <h3 className="font-display text-lg font-bold text-foreground">
            Desempeño de Órdenes de Trabajo por Categoría
          </h3>
          <p className="text-xs text-muted-foreground">
            Comparativa de trabajos activos frente a completados de forma acumulada.
          </p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={JOB_CATEGORIES} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--border), 0.1)" vertical={false} />
              <XAxis dataKey="name" stroke="currentColor" className="text-[10px] text-muted-foreground" tickLine={false} />
              <YAxis stroke="currentColor" className="text-[10px] text-muted-foreground" tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              <Bar name="Activas" dataKey="activos" fill="var(--color-primary, #18181b)" radius={[4, 4, 0, 0]} />
              <Bar name="Completadas" dataKey="completados" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
