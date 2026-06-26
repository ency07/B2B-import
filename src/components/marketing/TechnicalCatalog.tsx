"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wind, Sliders, Check, Maximize2, ShieldCheck, FileCheck, ChevronRight } from "lucide-react";

// Dynamically generate engineering specification cards based on product name and attributes
const getEngineeringSpecs = (product: any) => {
  if (!product) return {
    acople: "Directo",
    aislamiento: "Clase F",
    rodamientos: "SKF L10",
    balanceo: "G2.5",
    tempMax: "80°C",
    thickness: "3.4mm",
    curvePath: "M 30 30 Q 130 45 270 100",
    ptX: 150,
    ptY: 50,
    description: ""
  };
  
  const name = product.name || "";
  const nameLower = name.toLowerCase();
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const uniqueSeed = Math.abs(hash);
  
  const isCentrifugal = nameLower.includes("centrífugo") || nameLower.includes("blower") || nameLower.includes("hongo");
  const isAxial = nameLower.includes("axial") || nameLower.includes("tubo");
  
  let acople = "Directo por Manguito Flexible";
  let aislamiento = "Clase H (Hasta 180°C) - IP55";
  let rodamientos = "SKF de doble hilera de rodillos (L10 > 50,000h)";
  let balanceo = "Grado G2.5 (ISO 1940-1) - Residual < 1.0 mm/s";
  let tempMax = "80°C Continua / 120°C Picos";
  let thickness = 'Calibre 3/16" (4.70mm) Soldadura Continua';
  
  let curvePath = "";
  let ptX = 0;
  let ptY = 0;
  let description = "";
  
  const offset1 = (uniqueSeed % 15) - 7;
  const offset2 = (uniqueSeed % 20) - 10;
  
  if (isCentrifugal) {
    acople = (uniqueSeed % 2 === 0) 
      ? "Transmisión por Poleas y Correas con Tensor Automático" 
      : "Acople Directo Integrado por Brida Monobloc";
    aislamiento = "Clase F / H - IP56 (Alta Humedad y Polvillo)";
    rodamientos = "Rodamientos SKF autoalineables en chumacera bipartida (L10 > 100,000h)";
    balanceo = "Grado G2.5 dinámico por balanceador de plano dual (ISO 1940)";
    tempMax = (uniqueSeed % 2 === 0) ? "150°C Operación Continua" : "250°C con Disco de Enfriamiento Especial";
    thickness = 'Calibre 1/4" (6.35mm) Acero Estructural ASTM A36';
    
    const peakY = 20 + (uniqueSeed % 10);
    const midY = 55 + offset1;
    const endY = 115 + offset2;
    curvePath = `M 30 ${peakY} Q 120 ${midY} 270 ${endY}`;
    ptX = 110 + (uniqueSeed % 40);
    ptY = Math.round(peakY + (ptX - 30) * (endY - peakY) / 240 + offset1 / 2);
    
    description = `Turbomáquina centrífuga de alta eficiencia diseñada para vencer caídas de presión elevadas en naves industriales complejas. Equipado con álabes atrasados auto-limpiantes balanceados bajo norma ISO 1940-1 G2.5, reduciendo la vibración residual a menos de 1.2 mm/s. Su voluta soldada de flujo continuo asegura una conversión óptima de presión dinámica a estática, garantizando una operación estable a bajas revoluciones y un consumo energético reducido en plantas cementeras, mineras y químicas.`;
  } else if (isAxial) {
    acople = (uniqueSeed % 2 === 0)
      ? "Acople Directo (Hélice montada sobre el eje del motor)"
      : "Transmisión por Poleas y Correas (Motor externo al flujo)";
    aislamiento = "Clase H - Aislamiento F400 (Resiste 400°C por 2 horas)";
    rodamientos = "Rodamientos de bolas prelubricados de por vida, sellados de fábrica";
    balanceo = "Balanceado estático y dinámico en fábrica a Grado G2.5";
    tempMax = "60°C de operación estándar (Apto para extracción de humos calientes)";
    thickness = 'Calibre 12 (2.70mm) Acero al Carbono Galvanizado en Caliente por inmersión';
    
    const startY = 45 + (uniqueSeed % 10);
    const midY = 65 + offset1;
    const endY = 95 + offset2;
    curvePath = `M 30 ${startY} Q 160 ${midY} 270 ${endY}`;
    ptX = 140 + (uniqueSeed % 50);
    ptY = Math.round(startY + (ptX - 30) * (endY - startY) / 240 + offset2 / 3);
    
    description = `Extractor tubo-axial industrial para alto volumen de flujo y baja presión estática. Fabricado con álabes de perfil aerofoil ajustables en reposo para optimizar la aerodinámica según la densidad del aire en la zona de instalación. El chasis cilíndrico de acero pesado con bridas empernables reduce las turbulencias de entrada. Ideal para ventilación general en plantas de ensamblaje, almacenes de gran altura y procesos de refrigeración forzada que exigen confiabilidad ininterrumpida.`;
  } else {
    acople = "Directo por Eje Estriado Flotante";
    aislamiento = "Clase F - IP54";
    rodamientos = "Rodamientos NSK sellados de bajo ruido (L10 > 60,000h)";
    balanceo = "Grado G2.5 - Vibración controlada por amortiguación elastomerica";
    tempMax = "80°C Continua";
    thickness = "Calibre 14 (1.90mm) Aluminio naval resistente a corrosión marina";
    
    const startY = 35 + (uniqueSeed % 10);
    const midY = 50 + offset1;
    const endY = 105 + offset2;
    curvePath = `M 30 ${startY} Q 140 ${midY} 270 ${endY}`;
    ptX = 130 + (uniqueSeed % 40);
    ptY = Math.round(startY + (ptX - 30) * (endY - startY) / 240);
    
    description = `Unidad de ventilación industrial multiuso optimizada para naves de almacenamiento y techados industriales. Desarrollada para operar de manera silenciosa mediante álabes radiales curvados y un recubrimiento acústico interno de alta densidad. Su persiana de gravedad integrada abre por presión estática diferencial. Cumple estrictamente con la norma de seguridad laboral para recintos cerrados con una atenuación acústica certificada por debajo de 70 dB a 1.5 metros.`;
  }
  
  return { acople, aislamiento, rodamientos, balanceo, tempMax, thickness, curvePath, ptX, ptY, description };
};

interface TechnicalCatalogProps {
  products: any[];
  primaryColor: string;
  tenantCode: string;
}

export default function TechnicalCatalog({ products, primaryColor, tenantCode }: TechnicalCatalogProps) {
  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);
  const [activeProductDetails, setActiveProductDetails] = useState<any>(null);
  const specs = activeProductDetails ? getEngineeringSpecs(activeProductDetails) : null;

  return (
    <>
      <section id="catalogo" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white my-10 rounded-3xl border border-slate-200 shadow-xs">
        <div className="border-b pb-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4 border-slate-250">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color: primaryColor }}>// PLACAS DE ESPECIFICACIÓN</span>
            <h2 className="text-3xl font-black uppercase mt-1 text-slate-950 font-display">Fichas Técnicas Homologadas</h2>
          </div>
          <p className="text-xs font-mono text-slate-500 uppercase max-w-md">
            Información densa modelada para especificadores técnicos y gerentes de mantenimiento industrial.
          </p>
        </div>

        <div className="w-full">
          <div className="space-y-6">
            {products.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-dashed font-mono text-slate-500 border-slate-350 bg-[#FAF9F5]">
                No se encontraron equipos configurados en el catálogo.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((prod) => {
                  const isCompared = comparedProductIds.includes(prod.id);
                  return (
                    <div 
                      key={prod.id}
                      className="relative flex flex-col justify-between hardware-plate rounded-3xl overflow-hidden bg-white border-slate-250"
                    >
                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-2.5 py-1 font-mono text-[7px] font-bold uppercase tracking-widest bg-slate-950 text-white rounded-full">
                          {prod.badge}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 z-10">
                        <span className={`px-2.5 py-1 font-mono text-[7px] font-bold uppercase tracking-widest rounded-full border ${
                          prod.status.includes("inmediata") || prod.status.includes("Disponible")
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}>
                          {prod.status}
                        </span>
                      </div>

                      {/* Technical Image Area */}
                      <div className="w-full h-52 shrink-0 relative overflow-hidden bg-[#FAF9F5] border-b border-slate-200 flex items-center justify-center p-6">
                        {prod.images && prod.images.length > 0 && prod.images[0].filePath ? (
                          <img 
                            src={prod.images[0].filePath} 
                            alt={prod.images[0].altText || prod.name} 
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.03] transition-transform duration-550" 
                          />
                        ) : (
                          // Deterministic technical drawings
                          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none schematic-grid" />
                            <svg 
                              className="w-16 h-16 text-slate-350 transition-transform duration-700 group-hover:rotate-180" 
                              viewBox="0 0 100 100" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="0.8"
                            >
                              <circle cx="50" cy="50" r="45" strokeDasharray="2 2" />
                              <circle cx="50" cy="50" r="30" />
                              <circle cx="50" cy="50" r="10" />
                              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                                <line 
                                  key={deg} 
                                  x1="50" y1="50" x2="50" y2="10" 
                                  transform={`rotate(${deg} 50 50)`} 
                                  stroke={primaryColor} 
                                  strokeWidth="1.2"
                                  className="opacity-70"
                                />
                              ))}
                            </svg>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-4 text-[7px] font-mono text-slate-400 uppercase tracking-widest">
                          // SPEC: {prod.sku}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-8 flex-1 flex flex-col justify-between gap-6">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                              {prod.familyName} // LÍNEA DE EQUIPO
                            </span>
                            <h3 className="text-lg font-black text-slate-950 tracking-tight leading-tight font-display">
                              {prod.name}
                            </h3>
                            <div className="text-[9px] font-mono tracking-widest uppercase font-bold" style={{ color: primaryColor }}>
                              {prod.subtitle}
                            </div>
                          </div>

                          <p className="text-[11px] leading-relaxed text-slate-600 font-sans font-light normal-case">
                            {prod.description}
                          </p>

                          <div className="grid grid-cols-2 gap-4 border-t border-slate-200/60 pt-4 font-mono text-[9px]">
                            <div>
                              <strong className="text-slate-900 block text-[7px] uppercase tracking-widest font-bold mb-1">RANGO OPERATIVO:</strong>
                              <span className="font-bold text-slate-955 block">{prod.caudalVal}</span>
                              <span className="text-slate-500 block mt-0.5">{prod.presionVal} contrapresión</span>
                            </div>
                            <div>
                              <strong className="text-slate-900 block text-[7px] uppercase tracking-widest font-bold mb-1">MATERIAL / CHASIS:</strong>
                              <span className="font-bold text-slate-955 block truncate">{prod.material}</span>
                              <span className="text-slate-500 block mt-0.5">{prod.motorVal} motorización</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="border-t border-slate-200/60 pt-5 flex items-center justify-between font-mono text-[9px] tracking-wider">
                          <button
                            onClick={() => setActiveProductDetails(prod)}
                            className="font-bold text-slate-900 hover:text-slate-950 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            FICHA DETALLADA ➔
                          </button>

                          <div className="flex items-center gap-3.5">
                            <label className="flex items-center gap-1 cursor-pointer text-slate-450 hover:text-slate-800 transition-colors select-none text-[9px] font-bold">
                              <input 
                                type="checkbox"
                                checked={isCompared}
                                onChange={() => {
                                  if (isCompared) {
                                    setComparedProductIds(prev => prev.filter(id => id !== prod.id));
                                  } else {
                                    if (comparedProductIds.length >= 3) {
                                      alert("Máximo 3 equipos para comparación.");
                                      return;
                                    }
                                    setComparedProductIds(prev => [...prev, prod.id]);
                                  }
                                }}
                                className="rounded border-slate-350 text-slate-900 focus:ring-slate-900 h-3 w-3 cursor-pointer"
                              />
                              <span>Comparar</span>
                            </label>
                            
                            <Link
                              href={`/wizard?tenant=${tenantCode}&product=${prod.id}`}
                              className="font-bold uppercase tracking-widest px-4 py-2 rounded-full text-white transition-all premium-btn-tactile hover:brightness-105 active:scale-95"
                              style={{ backgroundColor: primaryColor }}
                            >
                              Cotizar ↗
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* COMPARATOR BAR */}
      {comparedProductIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-slate-800 p-4 shadow-2xl backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-sky-450" />
              <span className="font-mono text-xs uppercase tracking-wider text-slate-350">
                Comparando {comparedProductIds.length} equipos seleccionados
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setComparedProductIds([])}
                className="text-slate-500 hover:text-white uppercase font-mono text-[10px] tracking-wider px-3.5 py-1.5 transition-all cursor-pointer"
              >
                Limpiar
              </button>
              <button 
                onClick={() => {
                  const selected = products.filter(p => comparedProductIds.includes(p.id));
                  setActiveProductDetails({
                    comparisonList: selected
                  });
                }}
                className="px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer rounded-full"
                style={{ backgroundColor: primaryColor }}
              >
                Comparar Fichas Técnicas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT DETAILS AND COMPARISON MODAL */}
      {activeProductDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-white border border-slate-300 rounded-3xl p-6 md:p-8 text-left text-slate-800 font-sans normal-case text-sm my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start border-b pb-4 mb-6 border-slate-200">
              <div>
                <span className="text-slate-400 block mb-1 text-[9px] tracking-widest font-mono uppercase">// FICHA TÉCNICA Y DIAGNÓSTICO</span>
                <h3 className="text-xl font-bold text-slate-950 tracking-tight font-display uppercase">
                  {activeProductDetails.comparisonList ? "Tabla Comparativa de Equipos" : activeProductDetails.name}
                </h3>
              </div>
              <button 
                onClick={() => setActiveProductDetails(null)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {activeProductDetails.comparisonList ? (
              /* COMPARISON DRAW SHEET */
              <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white">
                <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="p-3.5 text-slate-500 font-mono text-[9px] uppercase tracking-wider">Parámetro</th>
                      {activeProductDetails.comparisonList.map((item: any) => (
                        <th key={item.id} className="p-3.5 font-bold text-slate-900" style={{ color: primaryColor }}>
                          {item.sku}
                          <span className="block text-[9px] text-slate-500 font-normal uppercase normal-case truncate mt-0.5">{item.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-150 hover:bg-slate-50/50">
                      <td className="p-3.5 text-slate-500 font-medium font-mono text-[9px] uppercase tracking-wider">Caudal Máximo</td>
                      {activeProductDetails.comparisonList.map((item: any) => (
                        <td key={item.id} className="p-3.5 font-bold text-slate-900">{item.caudalVal}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-150 hover:bg-slate-50/50">
                      <td className="p-3.5 text-slate-500 font-medium font-mono text-[9px] uppercase tracking-wider">Presión Máxima</td>
                      {activeProductDetails.comparisonList.map((item: any) => (
                        <td key={item.id} className="p-3.5 font-bold text-slate-900">{item.presionVal}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-150 hover:bg-slate-50/50">
                      <td className="p-3.5 text-slate-500 font-medium font-mono text-[9px] uppercase tracking-wider">Motor Requerido</td>
                      {activeProductDetails.comparisonList.map((item: any) => (
                        <td key={item.id} className="p-3.5 font-bold text-slate-900">{item.motorVal}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-150 hover:bg-slate-50/50">
                      <td className="p-3.5 text-slate-500 font-medium font-mono text-[9px] uppercase tracking-wider">Eficiencia Energética</td>
                      {activeProductDetails.comparisonList.map((item: any) => (
                        <td key={item.id} className="p-3.5 font-bold text-slate-900">{item.eficienciaVal}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-150 hover:bg-slate-50/50">
                      <td className="p-3.5 text-slate-500 font-medium font-mono text-[9px] uppercase tracking-wider">Emisión Ruido</td>
                      {activeProductDetails.comparisonList.map((item: any) => (
                        <td key={item.id} className="p-3.5 font-bold text-slate-900">{item.ruidoVal}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-150 hover:bg-slate-50/50">
                      <td className="p-3.5 text-slate-500 font-medium font-mono text-[9px] uppercase tracking-wider">Material Estructural</td>
                      {activeProductDetails.comparisonList.map((item: any) => (
                        <td key={item.id} className="p-3.5 text-slate-700">{item.material}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-150 hover:bg-slate-50/50">
                      <td className="p-3.5 text-slate-500 font-medium font-mono text-[9px] uppercase tracking-wider">Certificaciones</td>
                      {activeProductDetails.comparisonList.map((item: any) => (
                        <td key={item.id} className="p-3.5">
                          <div className="flex flex-wrap gap-1">
                            {item.certificaciones.map((cert: string, idx: number) => (
                              <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[8px] rounded border border-slate-200 font-mono">
                                {cert}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50/30">
                      <td className="p-3.5 text-slate-500 font-medium font-mono text-[9px] uppercase tracking-wider">Estado / Plazo</td>
                      {activeProductDetails.comparisonList.map((item: any) => (
                        <td key={item.id} className="p-3.5 text-[10px] font-bold" style={{ color: primaryColor }}>{item.status}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3.5 text-slate-500 font-medium font-mono text-[9px] uppercase tracking-wider">Acción Comercial</td>
                      {activeProductDetails.comparisonList.map((item: any) => (
                        <td key={item.id} className="p-3.5">
                          <Link
                            href={`/wizard?tenant=${tenantCode}&product=${item.id}`}
                            className="inline-block px-4 py-2 font-mono text-[9px] font-bold text-white uppercase tracking-wider text-center transition-all cursor-pointer rounded-full"
                            style={{ backgroundColor: primaryColor }}
                          >
                            Cotizar ↗
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              /* SINGLE DETAILED TECHNICAL SPEC SHEET */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual section */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Schematic curve graph */}
                  <div className="border border-slate-200 p-5 bg-[#FAF9F5] space-y-4 rounded-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none schematic-grid" />
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">// Curva de Operación Aerodinámica</span>
                      <span className="text-[8px] text-emerald-600 font-mono tracking-widest uppercase font-bold">Punto de Trabajo</span>
                    </div>

                    <div className="relative">
                      <svg viewBox="0 0 300 130" className="w-full h-32 text-slate-400">
                        {/* Axes */}
                        <line x1="30" y1="10" x2="30" y2="110" stroke="#bbb" strokeWidth="1" />
                        <line x1="30" y1="110" x2="280" y2="110" stroke="#bbb" strokeWidth="1" />
                        {/* Grid lines */}
                        <line x1="30" y1="35" x2="280" y2="35" stroke="#eee" strokeWidth="0.5" strokeDasharray="2 2" />
                        <line x1="30" y1="65" x2="280" y2="65" stroke="#eee" strokeWidth="0.5" strokeDasharray="2 2" />
                        <line x1="150" y1="10" x2="150" y2="110" stroke="#eee" strokeWidth="0.5" strokeDasharray="2 2" />
                        {/* Curve */}
                        <path d={specs?.curvePath || "M 30 30 Q 130 45 270 100"} fill="none" stroke={primaryColor} strokeWidth="2.5" />
                        <circle cx={specs?.ptX || 150} cy={specs?.ptY || 50} r="4.5" fill="#10b981" />
                        {/* Labels */}
                        <text x="5" y="65" fill="#71717a" fontSize="6.5" transform="rotate(-90 5 65)" className="font-mono">Presión estática (Pa)</text>
                        <text x="135" y="122" fill="#71717a" fontSize="6.5" className="font-mono">Caudal (m³/h)</text>
                      </svg>
                    </div>
                  </div>

                  {/* General spec identifiers */}
                  <div className="border border-slate-200 p-5 bg-slate-50/50 rounded-2xl font-mono text-[9px] uppercase space-y-2.5">
                    <div className="text-slate-400 font-bold border-b border-slate-200 pb-1.5">// PLACA DE IDENTIFICACIÓN</div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">POTENCIA</span> <span className="font-bold text-slate-900">{activeProductDetails.motorVal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ACOPLE</span> <span className="font-bold text-slate-900">{specs?.acople}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">AISLAMIENTO</span> <span className="font-bold text-slate-900">{specs?.aislamiento}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">RODAMIENTOS</span> <span className="font-bold text-slate-900">{specs?.rodamientos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">EFICIENCIA</span> <span className="font-bold text-emerald-600">{activeProductDetails.eficienciaVal}</span>
                    </div>
                  </div>
                </div>

                {/* Technical data sheet */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-slate-50 p-5 border border-slate-200 rounded-2xl">
                    <span className="text-[10px] font-mono font-bold tracking-widest block text-slate-500 uppercase">// MEMORIA DE CÁLCULO</span>
                    <p className="text-xs text-slate-655 mt-2 leading-relaxed normal-case font-sans font-light">
                      {specs?.description || activeProductDetails.description}
                    </p>
                  </div>

                  <div className="border border-slate-200 p-5 rounded-2xl space-y-4">
                    <span className="text-[10px] text-slate-500 font-bold block tracking-widest uppercase font-mono">// ESPECIFICACIONES CONSTRUCTIVAS</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 font-mono text-[9px] uppercase">
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">SKU</span>
                        <span className="text-slate-955 font-bold">{activeProductDetails.sku}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Caudal Máx.</span>
                        <span className="text-slate-955 font-bold">{activeProductDetails.caudalVal}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Presión Máx.</span>
                        <span className="text-slate-955 font-bold">{activeProductDetails.presionVal}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Sonido Residual</span>
                        <span className="text-slate-955 font-bold">{activeProductDetails.ruidoVal}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Espesor Chapa</span>
                        <span className="text-slate-955 font-bold">{specs?.thickness}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Equilibrio Rot.</span>
                        <span className="text-slate-955 font-bold">{specs?.balanceo}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Límite Térmico</span>
                        <span className="text-slate-955 font-bold">{specs?.tempMax}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Material</span>
                        <span className="text-slate-955 font-bold truncate max-w-[120px]">{activeProductDetails.material}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-slate-200 p-4 rounded-2xl">
                      <span className="text-[8px] text-slate-450 font-bold block mb-2 tracking-widest uppercase font-mono">// HOMOLOGACIÓN</span>
                      <div className="flex flex-wrap gap-1">
                        {activeProductDetails.certificaciones.map((cert: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-50 text-slate-700 rounded border border-slate-200 text-[8px] font-bold font-mono">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border border-slate-200 p-4 rounded-2xl">
                      <span className="text-[8px] text-slate-450 font-bold block mb-2 tracking-widest uppercase font-mono">// APLICACIÓN COMERCIAL</span>
                      <div className="flex flex-wrap gap-1">
                        {activeProductDetails.aplicaciones.map((app: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-50 text-slate-700 rounded border border-slate-200 text-[8px] font-bold font-mono">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-4 font-mono text-[10px]">
                    <Link
                      href={`/wizard?tenant=${tenantCode}&product=${activeProductDetails.id}`}
                      className="px-6 py-3.5 rounded-full text-white font-bold uppercase tracking-widest transition-all premium-btn-tactile hover:brightness-105 active:scale-95 text-center flex-1"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Cotizar en Asistente Técnico ↗
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
