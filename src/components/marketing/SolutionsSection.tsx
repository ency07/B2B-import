"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Activity, Thermometer, Flame } from "lucide-react";

interface SolutionsSectionProps {
  tenantCode: string;
  primaryColor: string;
}

export default function SolutionsSection({ tenantCode, primaryColor }: SolutionsSectionProps) {
  return (
    <section id="soluciones" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b pb-6 mb-16 border-slate-250 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color: primaryColor }}>// INGENIERÍA SOLUCIONISTA</span>
            <h2 className="text-3xl font-black uppercase mt-1 text-slate-950 font-display">Problemas Industriales Críticos & Soluciones</h2>
          </div>
          <p className="text-xs font-mono text-slate-500 uppercase max-w-md">
            No listamos catálogo genérico. Identifique la sintomatología de su planta y consulte la respuesta computacional AeroMax.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* SOLUCIÓN 1: Estrangulamiento de Caudal */}
          <div className="hardware-plate rounded-3xl overflow-hidden flex flex-col md:flex-row group">
            <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden bg-slate-900">
              <div className="absolute inset-0 bg-slate-950/20 z-10" />
              <img 
                src="/axial_duct_fan.png" 
                alt="Extractor axial en conducto de aire de planta" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 z-20 font-mono text-[7px] bg-slate-900/90 text-white px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest font-bold">
                PRB-CODE: FLOW-CFD
              </div>
            </div>
            <div className="md:w-7/12 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> ESTRANGULAMIENTO DE CAUDAL
                </div>
                <h3 className="text-lg font-black uppercase text-slate-950 font-display leading-tight">Pérdidas de Carga Aerodinámica</h3>
                <div className="space-y-2 text-xs leading-relaxed font-sans text-slate-655 normal-case">
                  <p><strong className="text-slate-900 font-mono text-[9px] uppercase tracking-widest font-bold block">// CAUSA RAÍZ EN PLANTA:</strong> Ductos mal dimensionados o codos abruptos aumentan la contrapresión y fuerzan el motor.</p>
                  <p><strong className="text-slate-900 font-mono text-[9px] uppercase tracking-widest font-bold block">// SOLUCIÓN DE INGENIERÍA:</strong> Rediseño fluidodinámico asistido por CFD y ventiladores de álabes atrasados.</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2.5">
                <div className="px-3 py-1.5 bg-emerald-550/5 border border-emerald-500/20 rounded-lg text-[9px] font-mono text-emerald-800">
                  <strong>MEJORA COMPROBADA:</strong> -25% en pérdida de carga
                </div>
                <Link 
                  href={`/wizard?tenant=${tenantCode}&problem=caudal`}
                  className="text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 hover:text-slate-950 transition-colors"
                  style={{ color: primaryColor }}
                >
                  Diagnóstico Caudal ➔
                </Link>
              </div>
            </div>
          </div>

          {/* SOLUCIÓN 2: Fatiga Vibracional */}
          <div className="hardware-plate rounded-3xl overflow-hidden flex flex-col md:flex-row group">
            <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden bg-slate-900">
              <div className="absolute inset-0 bg-slate-950/20 z-10" />
              <img 
                src="/rotor_dynamic_balancing.png" 
                alt="Ingeniero calibrando vibración de rotor de turbina" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 z-20 font-mono text-[7px] bg-slate-900/90 text-white px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest font-bold">
                PRB-CODE: ISO-1940
              </div>
            </div>
            <div className="md:w-7/12 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5 text-red-600" /> FATIGA VIBRACIONAL Y RUIDO
                </div>
                <h3 className="text-lg font-black uppercase text-slate-950 font-display leading-tight">Paradas de Línea por Desbalance</h3>
                <div className="space-y-2 text-xs leading-relaxed font-sans text-slate-655 normal-case">
                  <p><strong className="text-slate-900 font-mono text-[9px] uppercase tracking-widest font-bold block">// CAUSA RAÍZ EN PLANTA:</strong> Equipos desbalanceados transmiten vibraciones destructivas a chumaceras y desalinean el eje.</p>
                  <p><strong className="text-slate-900 font-mono text-[9px] uppercase tracking-widest font-bold block">// SOLUCIÓN DE INGENIERÍA:</strong> Balanceo dinámico dual plano in-situ grado G2.5 con sensores láser.</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2.5">
                <div className="px-3 py-1.5 bg-emerald-550/5 border border-emerald-500/20 rounded-lg text-[9px] font-mono text-emerald-800">
                  <strong>MEJORA COMPROBADA:</strong> MTBF de rodamiento &gt; 50k h
                </div>
                <Link 
                  href={`/wizard?tenant=${tenantCode}&problem=vibracion`}
                  className="text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 hover:text-slate-950 transition-colors"
                  style={{ color: primaryColor }}
                >
                  Programar Balanceo ➔
                </Link>
              </div>
            </div>
          </div>

          {/* SOLUCIÓN 3: Sofoco Térmico */}
          <div className="hardware-plate rounded-3xl overflow-hidden flex flex-col md:flex-row group">
            <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden bg-slate-900">
              <div className="absolute inset-0 bg-slate-950/20 z-10" />
              <img 
                src="/industrial_plant_ventilation.png" 
                alt="Ductos de aire en nave industrial" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 z-20 font-mono text-[7px] bg-slate-900/90 text-white px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest font-bold">
                PRB-CODE: THERM-SST
              </div>
            </div>
            <div className="md:w-7/12 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                  <Thermometer className="w-3.5 h-3.5 text-orange-600" /> SOFOCO TÉRMICO
                </div>
                <h3 className="text-lg font-black uppercase text-slate-950 font-display leading-tight">Carga Térmica Extrema en Planta</h3>
                <div className="space-y-2 text-xs leading-relaxed font-sans text-slate-655 normal-case">
                  <p><strong className="text-slate-900 font-mono text-[9px] uppercase tracking-widest font-bold block">// CAUSA RAÍZ EN PLANTA:</strong> Alta carga térmica residual acumulada en naves cerradas, violando límites de temperatura y SST.</p>
                  <p><strong className="text-slate-900 font-mono text-[9px] uppercase tracking-widest font-bold block">// SOLUCIÓN DE INGENIERÍA:</strong> Renovación forzada con unidades tubo-axiales con álabes aerofoil variables.</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2.5">
                <div className="px-3 py-1.5 bg-emerald-550/5 border border-emerald-500/20 rounded-lg text-[9px] font-mono text-emerald-800">
                  <strong>MEJORA COMPROBADA:</strong> Reducción de hasta 8°C en zona
                </div>
                <Link 
                  href={`/wizard?tenant=${tenantCode}&problem=termico`}
                  className="text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 hover:text-slate-950 transition-colors"
                  style={{ color: primaryColor }}
                >
                  Calcular Renovación ➔
                </Link>
              </div>
            </div>
          </div>

          {/* SOLUCIÓN 4: Atmósferas Explosivas */}
          <div className="hardware-plate rounded-3xl overflow-hidden flex flex-col md:flex-row group">
            <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden bg-slate-900">
              <div className="absolute inset-0 bg-slate-950/20 z-10" />
              <img 
                src="/industrial_centrifugal_fan.png" 
                alt="Soplador centrífugo industrial" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 z-20 font-mono text-[7px] bg-slate-900/90 text-white px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest font-bold">
                PRB-CODE: ATEX-ZONE
              </div>
            </div>
            <div className="md:w-7/12 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-red-700" /> ATMÓSFERAS EXPLOSIVAS
                </div>
                <h3 className="text-lg font-black uppercase text-slate-950 font-display leading-tight">Presencia de Gases & Polvos Inflamables</h3>
                <div className="space-y-2 text-xs leading-relaxed font-sans text-slate-655 normal-case">
                  <p><strong className="text-slate-900 font-mono text-[9px] uppercase tracking-widest font-bold block">// CAUSA RAÍZ EN PLANTA:</strong> Concentración de polvos orgánicos finos o vapores corrosivos con riesgo de ignición por fricción.</p>
                  <p><strong className="text-slate-900 font-mono text-[9px] uppercase tracking-widest font-bold block">// SOLUCIÓN DE INGENIERÍA:</strong> Turbomáquinas de inoxidable 316L con motores ATEX antichispas.</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2.5">
                <div className="px-3 py-1.5 bg-emerald-550/5 border border-emerald-500/20 rounded-lg text-[9px] font-mono text-emerald-800">
                  <strong>MEJORA COMPROBADA:</strong> Certificación ATEX Zona 1/21
                </div>
                <Link 
                  href={`/wizard?tenant=${tenantCode}&problem=explosiva`}
                  className="text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 hover:text-slate-950 transition-colors"
                  style={{ color: primaryColor }}
                >
                  Configurar ATEX ➔
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
