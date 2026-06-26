"use client";

import React, { useState } from "react";
import { Target, Award, MapPin, ShieldCheck, FileCheck } from "lucide-react";

interface AboutSectionProps {
  primaryColor: string;
}

export default function AboutSection({ primaryColor }: AboutSectionProps) {
  const [activeEmpresaTab, setActiveEmpresaTab] = useState<"capacidades" | "certificaciones" | "seguridad">("capacidades");

  return (
    <section id="empresa" className="py-24 bg-[#F2EFE9] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="border-b pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-slate-300">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color: primaryColor }}>// CUMPLIMIENTO REGULATORIO</span>
            <h2 className="text-3xl font-black uppercase mt-1 text-slate-950 font-display">Evolución Industrial & Normas</h2>
          </div>
          <p className="text-xs font-mono text-slate-550 uppercase max-w-md">
            Respaldamos su proyecto bajo auditorías de ingeniería y certificaciones de campo en Colombia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="hardware-plate p-8 rounded-3xl bg-white space-y-4">
            <div className="flex items-center gap-3" style={{ color: primaryColor }}>
              <Target className="h-5 w-5" />
              <h3 className="font-sans font-black text-xl uppercase tracking-tight text-slate-950 font-display font-bold">Nuestra Misión B2B</h3>
            </div>
            <p className="text-xs text-slate-655 leading-relaxed normal-case font-sans font-light">
              Asegurar la continuidad operativa de la gran industria del Caribe y el continente latinoamericano a través del suministro, fabricación y diagnóstico predictivo de unidades de flujo de aire de alta capacidad, optimizando el consumo energético y garantizando la total seguridad laboral y ambiental en entornos críticos.
            </p>
          </div>

          <div className="hardware-plate p-8 rounded-3xl bg-white space-y-4">
            <div className="flex items-center gap-3" style={{ color: primaryColor }}>
              <Award className="h-5 w-5" />
              <h3 className="font-sans font-black text-xl uppercase tracking-tight text-slate-950 font-display font-bold">Visión de Ingeniería</h3>
            </div>
            <p className="text-xs text-slate-655 leading-relaxed normal-case font-sans font-light">
              Consolidarnos para el 2030 como el principal fabricante y comisionador tecnológico de sistemas de ventilación forzada e inyección en el norte de Sudamérica y Centroamérica, liderando la transición hacia la ventilación inteligente basada en telemetría de vibración computacional en la nube.
            </p>
          </div>
        </div>

        {/* Interactive tabs */}
        <div className="hardware-plate p-8 rounded-3xl bg-white space-y-8">
          <div className="flex border-b border-slate-200 pb-3 gap-6 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveEmpresaTab("capacidades")}
              className="font-mono text-xs uppercase tracking-widest pb-2 px-1 transition-all whitespace-nowrap cursor-pointer border-b-2 font-bold text-left"
              style={{
                color: activeEmpresaTab === "capacidades" ? primaryColor : "#71717a",
                borderColor: activeEmpresaTab === "capacidades" ? primaryColor : "transparent"
              }}
            >
              [+] CAPACIDADES EN TALLER
            </button>
            
            <button
              type="button"
              onClick={() => setActiveEmpresaTab("certificaciones")}
              className="font-mono text-xs uppercase tracking-widest pb-2 px-1 transition-all whitespace-nowrap cursor-pointer border-b-2 font-bold text-left"
              style={{
                color: activeEmpresaTab === "certificaciones" ? primaryColor : "#71717a",
                borderColor: activeEmpresaTab === "certificaciones" ? primaryColor : "transparent"
              }}
            >
              [+] CERTIFICACIONES DE CALIDAD
            </button>
            
            <button
              type="button"
              onClick={() => setActiveEmpresaTab("seguridad")}
              className="font-mono text-xs uppercase tracking-widest pb-2 px-1 transition-all whitespace-nowrap cursor-pointer border-b-2 font-bold text-left"
              style={{
                color: activeEmpresaTab === "seguridad" ? primaryColor : "#71717a",
                borderColor: activeEmpresaTab === "seguridad" ? primaryColor : "transparent"
              }}
            >
              [+] CULTURA DE SEGURIDAD (HSEQ)
            </button>
          </div>

          <div className="min-h-[180px]">
            {activeEmpresaTab === "capacidades" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-sans font-bold text-lg text-slate-900 uppercase font-display">
                    Planta de Producción en Vía 40, Barranquilla
                  </h4>
                  <p className="text-xs text-slate-655 leading-relaxed font-sans normal-case font-light">
                    Contamos con una planta industrial propia de 2,400 m² equipada con maquinaria de precisión CNC pesada para el corte y rolado de lámina de acero hasta calibre 3/8”, balanceadoras dinámicas de banco calibradas bajo normas ISO, y laboratorios de pruebas aerodinámicas con túnel de viento instrumentado.
                  </p>
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold" style={{ color: primaryColor }}>
                    <MapPin className="h-4 w-4" /> Ubi: Zona Industrial Vía 40, Atlántico
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-mono text-[9px] text-slate-400 uppercase tracking-wider font-bold">
                    CAPACIDADES E INFRAESTRUCTURA:
                  </h5>
                  <ul className="space-y-2 text-xs text-slate-700 font-mono">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">[✓]</span>
                      <span>Balanceo dinámico in-situ y en banco hasta 5 toneladas.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">[✓]</span>
                      <span>Soldadores homologados ASME Sección IX.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">[✓]</span>
                      <span>Modelado fluidodinámico computacional CFD interno.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">[✓]</span>
                      <span>Comisionamiento y alineación láser portátil.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeEmpresaTab === "certificaciones" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-sans font-bold text-lg text-slate-900 uppercase font-display">
                    Garantía de Calidad y Cumplimiento Normativo
                  </h4>
                  <p className="text-xs text-slate-655 leading-relaxed font-sans normal-case font-light">
                    Nuestros procesos operativos y de ingeniería están completamente auditados y certificados por organismos reguladores nacionales, garantizando que cada impulsor fabricado cumpla estrictamente con la reglamentación eléctrica y de seguridad nacional.
                  </p>
                </div>

                <div className="space-y-3 font-mono text-[10px] text-slate-650">
                  <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-900 font-bold block uppercase">RETIE / NTC 2050 (Colombia)</span>
                      <p className="text-[9px] text-slate-500 normal-case leading-normal mt-1">
                        Cumplimiento obligatorio en el cableado, megado de motores y acometidas de fuerza de todos nuestros equipos instalados.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <FileCheck className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: primaryColor }} />
                    <div>
                      <span className="text-slate-900 font-bold block uppercase">ISO 9001:2015 Certificado</span>
                      <p className="text-[9px] text-slate-500 normal-case leading-normal mt-1">
                        Certificado internacional de gestión de calidad en los procesos de cálculo de ingeniería, compras de material y soldadura.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeEmpresaTab === "seguridad" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-sans font-bold text-lg text-slate-900 uppercase font-display">
                    Cultura de Cero Accidentes HSEQ
                  </h4>
                  <p className="text-xs text-slate-655 leading-relaxed font-sans normal-case font-light">
                    Priorizamos la vida humana sobre cualquier factor productivo. Toda intervención en sitio de nuestro personal de campo cuenta con protocolos estrictos de bloqueo de energías (LOTO), análisis de trabajo seguro (ATS) y el debido cumplimiento de las resoluciones de seguridad vigentes en Colombia.
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="font-mono text-[9px] text-slate-400 uppercase tracking-wider font-bold">
                    POLÍTICA Y NORMAS APLICADAS DE CAMPO:
                  </h5>
                  <ul className="space-y-2 text-xs text-slate-700 font-mono">
                    <li className="flex items-center gap-2">
                      <span className="font-bold" style={{ color: primaryColor }}>[▶]</span>
                      <span>ISO 45001:2018 (Seguridad y Salud en el Trabajo).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-bold" style={{ color: primaryColor }}>[▶]</span>
                      <span>Resolución 5018 de MinTrabajo (Seguridad en instalaciones eléctricas).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-bold" style={{ color: primaryColor }}>[▶]</span>
                      <span>Coordinadores de alturas certificados bajo Resolución 4272.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-bold" style={{ color: primaryColor }}>[▶]</span>
                      <span>Protocolo LOTO de bloqueo mecánico y eléctrico estricto en plantas.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
