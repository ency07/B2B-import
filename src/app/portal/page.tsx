"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  Download,
  CreditCard,
  AlertTriangle,
  Wind,
  ShieldCheck,
  UserCheck,
  FileCode,
  Building,
  HelpCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { getTenantConfig } from "@/utils/tenant";

// Formatting utility for COP/USD
const formatCurrency = (amount: number) => {
  if (amount < 100000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

function CustomerPortalContent() {
  const searchParams = useSearchParams();
  const tenantParam = searchParams.get("tenant") || "acme";
  const config = getTenantConfig(tenantParam);

  const [activeSection, setActiveSection] = React.useState<"ots" | "invoices" | "docs">("ots");

  // Client session mock data
  const clientName = "Fundición Andina S.A.";
  const clientNit = "NIT-800.198.273-5";

  // OTs in fabrication for this client
  const [ots, setOts] = React.useState([
    {
      code: "JOB-2026-001",
      title: "Extractor Axial VentiTech VT-7500 CFM",
      status: "PRUEBAS", // DISEÑO -> CORTE -> BALANCEO -> PRUEBAS -> DESPACHO
      progress: 80,
      tech: "Ing. Carlos Mendoza",
      startDate: "2026-06-12",
      endDate: "2026-06-25",
      cadFile: "AX-7500-REF.dwg",
      specFile: "FT-AX-7500.pdf",
    },
    {
      code: "JOB-2026-002",
      title: "Extractor Tipo Hongo HG-5000 Acero Inoxidable",
      status: "CORTE",
      progress: 40,
      tech: "Téc. Andrés Silva",
      startDate: "2026-06-15",
      endDate: "2026-07-05",
      cadFile: "HG-5000-SS.step",
      specFile: "FT-HG-5000.pdf",
    }
  ]);

  // Invoices for this client
  const [invoices, setInvoices] = React.useState([
    {
      code: "FAC-2026-012",
      date: "2026-06-12",
      concept: "Anticipo 50% - Fabricación de Turbomáquinas Ax-7500",
      total: 35000000,
      paid: 35000000,
      status: "PAGADA"
    },
    {
      code: "FAC-2026-013",
      date: "2026-06-19",
      concept: "Saldo Final 50% - Entrega e Instalación de Turbomáquinas",
      total: 35000000,
      paid: 0,
      status: "PENDIENTE"
    }
  ]);

  // White label styling apply on mount
  React.useEffect(() => {
    if (config.primaryColor) {
      const root = document.documentElement;
      root.style.setProperty("--primary", config.primaryColor);
      root.style.setProperty("--ring", config.primaryColor);
    }
  }, [config]);

  const handleSimulatePayment = (invCode: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.code === invCode ? { ...inv, status: "PAGADA", paid: inv.total } : inv
    ));
    alert(`Pago simulado exitosamente para la factura ${invCode}. Estado actualizado a PAGADA.`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      
      {/* Client Portal Header / Navbar */}
      <header className="border-b border-zinc-900 bg-zinc-950 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-white font-mono">
              VT
            </div>
            <div>
              <span className="text-xs font-mono text-zinc-400 block leading-none">PORTAL CLIENTES</span>
              <span className="font-display font-bold text-sm text-zinc-200 tracking-tight mt-0.5">{config.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            <span className="text-zinc-500 hidden sm:inline">Cuenta:</span>
            <span className="text-zinc-300 font-bold">{clientName}</span>
            <Badge variant="secondary" className="text-[9px]">{clientNit}</Badge>
          </div>
        </div>
      </header>

      {/* Main Portal View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Portal Hero SLA */}
        <div className="rounded-2xl border border-zinc-850 bg-zinc-900/10 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
              <Sparkles className="w-3.5 h-3.5" /> Estado de Cuenta y Obras
            </div>
            <h2 className="font-display text-xl font-bold tracking-tight text-zinc-100">
              Bienvenido al Centro de Control de {clientName}
            </h2>
            <p className="text-xs text-zinc-400">
              Monitoree el avance físico en taller de sus extractores y consulte el historial de facturación CFDI.
            </p>
          </div>

          {/* SLA Quick indicators */}
          <div className="flex gap-4 font-mono text-xs">
            <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-lg text-center min-w-[110px]">
              <span className="text-[10px] text-zinc-500 uppercase block">En Taller</span>
              <span className="text-lg font-bold text-sky-400 mt-0.5 block">{ots.filter(o => o.status !== "DESPACHO").length} OTs</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-lg text-center min-w-[110px]">
              <span className="text-[10px] text-zinc-500 uppercase block">Por Pagar</span>
              <span className="text-lg font-bold text-red-400 mt-0.5 block">
                {formatCurrency(invoices.reduce((sum, inv) => sum + (inv.status === "PENDIENTE" ? inv.total : 0), 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-900 text-xs mt-2">
          {[
            { id: "ots", label: "Estado de Fabricación (OTs)" },
            { id: "invoices", label: "Facturas y Pagos" },
            { id: "docs", label: "Descarga de Planos y Fichas" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`pb-2.5 px-4 font-medium transition-colors border-b-2 relative -mb-[2px] cursor-pointer ${
                activeSection === tab.id 
                  ? "border-sky-500 text-sky-400 font-bold" 
                  : "border-transparent text-zinc-400 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Section View Content */}
        <div className="p-8 rounded-2xl border border-zinc-850 bg-zinc-900/10 backdrop-blur-md min-h-[400px]">
          
          {/* SECTION 1: ACTIVE OTs */}
          {activeSection === "ots" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">Taller en vivo</span>
                <h3 className="text-base font-semibold text-zinc-200 mt-0.5">Seguimiento Físico de Equipos</h3>
                <p className="text-xs text-zinc-500">Conozca la fase exacta de producción en la que se encuentran sus ventiladores industriales.</p>
              </div>

              <div className="space-y-6">
                {ots.map((ot) => {
                  const phases = ["DISEÑO", "CORTE", "BALANCEO", "PRUEBAS", "DESPACHO"];
                  const currentPhaseIdx = phases.indexOf(ot.status);

                  return (
                    <div key={ot.code} className="border border-zinc-900 bg-zinc-950/20 p-5 rounded-xl space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="font-mono text-xs font-semibold text-sky-400 bg-sky-950/40 border border-sky-900/30 px-2 py-0.5 rounded">
                            {ot.code}
                          </span>
                          <h4 className="text-sm font-semibold text-zinc-200 mt-1">{ot.title}</h4>
                        </div>
                        <div className="text-right sm:text-right">
                          <span className="text-[10px] font-mono text-zinc-400 block">PROGRESO ESTIMADO</span>
                          <span className="text-lg font-mono font-bold text-emerald-400">{ot.progress}%</span>
                        </div>
                      </div>

                      {/* Lineal Phase Tracker */}
                      <div className="grid grid-cols-5 gap-2 pt-2">
                        {phases.map((ph, idx) => {
                          const isCompleted = idx < currentPhaseIdx;
                          const isCurrent = idx === currentPhaseIdx;

                          return (
                            <div key={ph} className="space-y-1.5 text-center">
                              <div className={`h-1.5 rounded-full transition-all ${
                                isCompleted ? "bg-emerald-500" : isCurrent ? "bg-sky-500 animate-pulse" : "bg-zinc-900"
                              }`} />
                              <span className={`text-[9px] font-mono tracking-wider font-bold block ${
                                isCompleted ? "text-emerald-400" : isCurrent ? "text-sky-400 font-bold" : "text-zinc-400"
                              }`}>
                                {ph}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Technical specifications */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-3 border-t border-zinc-900/50 font-mono text-zinc-500">
                        <div>
                          <span>Operario Responsable:</span>
                          <span className="text-zinc-300 block font-sans">{ot.tech}</span>
                        </div>
                        <div>
                          <span>Inicio Planificado:</span>
                          <span className="text-zinc-300 block">{ot.startDate}</span>
                        </div>
                        <div>
                          <span>Entrega Estimada:</span>
                          <span className="text-zinc-300 block">{ot.endDate}</span>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <a 
                            onClick={() => alert(`Descargando plano CAD ${ot.cadFile}...`)}
                            className="bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-850 p-1.5 rounded cursor-pointer flex items-center justify-center"
                            title="Descargar Plano CAD"
                          >
                            <FileCode className="w-4 h-4" />
                          </a>
                          <a 
                            onClick={() => alert(`Descargando ficha técnica ${ot.specFile}...`)}
                            className="bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-850 p-1.5 rounded cursor-pointer flex items-center justify-center"
                            title="Descargar Ficha Técnica PDF"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: INVOICES & PAYMENTS */}
          {activeSection === "invoices" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">Billing B2B</span>
                <h3 className="text-base font-semibold text-zinc-200 mt-0.5">Historial de Facturación</h3>
                <p className="text-xs text-zinc-500">Consulte el desglose de saldos y realice pagos electrónicos de sus folios.</p>
              </div>

              <div className="rounded-xl border border-zinc-850 bg-zinc-950/15 overflow-hidden">
                <table className="w-full border-collapse text-left text-xs font-mono">
                  <thead className="bg-zinc-900/50 border-b border-zinc-850 text-[10px] uppercase text-zinc-400 font-bold">
                    <tr>
                      <th className="p-3 pl-4">Folio</th>
                      <th className="p-3">Fecha</th>
                      <th className="p-3">Concepto</th>
                      <th className="p-3 text-right">Monto Total</th>
                      <th className="p-3 text-right">Saldo Restante</th>
                      <th className="p-3 text-center">Estado</th>
                      <th className="p-3 text-center pr-4">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-300 divide-y divide-zinc-900">
                    {invoices.map((inv) => {
                      const balance = inv.total - inv.paid;
                      return (
                        <tr key={inv.code} className="hover:bg-zinc-900/20">
                          <td className="p-3 pl-4 font-bold text-sky-400">{inv.code}</td>
                          <td className="p-3 text-zinc-500">{inv.date}</td>
                          <td className="p-3 font-sans text-zinc-200">{inv.concept}</td>
                          <td className="p-3 text-right">{formatCurrency(inv.total)}</td>
                          <td className={`p-3 text-right font-bold ${balance > 0 ? "text-red-400" : "text-zinc-500"}`}>
                            {formatCurrency(balance)}
                          </td>
                          <td className="p-3 text-center">
                            <Badge variant={inv.status === "PAGADA" ? "success" : "destructive"} className="text-[9px]">
                              {inv.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-center pr-4">
                            {balance > 0 ? (
                              <Button 
                                onClick={() => handleSimulatePayment(inv.code)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-sans h-7 px-2.5 flex items-center gap-1 cursor-pointer"
                              >
                                <CreditCard className="w-3.5 h-3.5" /> Pagar en Línea
                              </Button>
                            ) : (
                              <button 
                                onClick={() => alert("Imprimiendo recibo...")}
                                className="text-zinc-500 hover:text-zinc-300"
                                title="Imprimir Recibo"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 3: TECHNICAL DOCUMENTS */}
          {activeSection === "docs" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">Downloads</span>
                <h3 className="text-base font-semibold text-zinc-200 mt-0.5">Repositorio de Ingeniería</h3>
                <p className="text-xs text-zinc-500">Descargue planos vectoriales, manuales de instalación y reportes de QA.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Manual de Operación y Mantenimiento", type: "PDF Manual", desc: "Instrucciones de engrase de rodamientos y calibración de poleas.", size: "4.2 MB", icon: FileText },
                  { title: "Plano Vectorial Caracol Axial Ax-7500", type: "CAD DWG", desc: "Plano dimensional completo de anclajes físicos.", size: "12.8 MB", icon: FileCode },
                  { title: "Reporte de Balanceo Dinámico ISO G2.5", type: "Certificado QA", desc: "Certificado de vibración y excentricidad firmado por inspector.", size: "1.5 MB", icon: ShieldCheck },
                  { title: "Catálogo Aerodinámico de VentiTech", type: "Catálogo Técnico", desc: "Curvas de rendimiento CFM vs inWG de toda la serie.", size: "6.8 MB", icon: Wind }
                ].map((doc, idx) => {
                  const Icon = doc.icon;
                  return (
                    <div key={idx} className="border border-zinc-900 bg-zinc-950/20 p-4 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                          <Icon className="w-5 h-5 text-sky-500" />
                        </div>
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-semibold text-zinc-200">{doc.title}</h4>
                            <p className="text-[10px] text-zinc-500 font-mono">{doc.type} • {doc.size}</p>
                            <p className="text-[11px] text-zinc-400 leading-tight pt-1 font-sans">{doc.desc}</p>
                          </div>
                      </div>
                      <Button 
                        onClick={() => alert(`Iniciando descarga de ${doc.title}...`)}
                        className="bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-850 p-2.5 h-8.5 rounded cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-[10px] font-mono text-zinc-400">
        <div className="flex items-center justify-center gap-2">
          <Building className="w-3.5 h-3.5" />
          <span>Soporte Técnico ERP: 01-8000-VENTITECH | 2026 VentiTech S.A.S.</span>
        </div>
      </footer>

    </div>
  );
}

export default function CustomerPortal() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono">
        Cargando Portal...
      </div>
    }>
      <CustomerPortalContent />
    </React.Suspense>
  );
}
