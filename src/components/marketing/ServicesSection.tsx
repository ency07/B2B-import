"use client";

import React, { useState } from "react";
import { Sliders, Wind, Activity, Settings, ChevronRight } from "lucide-react";
import { getServicesData, getCaseStudiesData, getProcessStepsData, ServiceItem, CaseStudyItem, ProcessStepItem } from "./marketing-data";

interface ServicesSectionProps {
  primaryColor: string;
  onSelectService: (srvTitle: string) => void;
}

export default function ServicesSection({ primaryColor, onSelectService }: ServicesSectionProps) {
  const [activeCaseStudy, setActiveCaseStudy] = useState<string | null>(null);

  const services = getServicesData();
  const caseStudies = getCaseStudiesData();
  const processSteps = getProcessStepsData();

  const getIcon = (code: string) => {
    switch (code) {
      case "SRV-01":
        return <Sliders className="w-6 h-6" style={{ color: primaryColor }} />;
      case "SRV-02":
        return <Wind className="w-6 h-6" style={{ color: primaryColor }} />;
      case "SRV-03":
        return <Activity className="w-6 h-6" style={{ color: primaryColor }} />;
      case "SRV-04":
        return <Settings className="w-6 h-6" style={{ color: primaryColor }} />;
      default:
        return <Settings className="w-6 h-6" style={{ color: primaryColor }} />;
    }
  };

  return (
    <>
      {/* 4. INGENIERÍA Y SERVICIOS */}
      <section id="servicios" className="py-24 bg-[#F2EFE9] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b pb-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4 border-slate-350 opacity-90">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color: primaryColor }}>// RESPALDO EN CAMPO</span>
              <h2 className="text-3xl font-black uppercase mt-1 text-slate-950 font-display">Ingeniería y Servicios Predictivos</h2>
            </div>
            <p className="text-xs font-mono text-slate-500 uppercase max-w-md">
              Capacidades técnicas homologadas para diagnóstico aerodinámico y balanceo dinámico in-situ en Colombia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((srv, idx) => (
              <div 
                key={idx}
                className="p-8 hardware-plate rounded-3xl flex flex-col justify-between group relative overflow-hidden bg-white"
              >
                <div className="absolute inset-0 opacity-[0.01] pointer-events-none group-hover:opacity-[0.03] transition-opacity schematic-grid" />
                <div>
                  <div className="p-3 w-fit rounded-2xl mb-6 bg-slate-100 border border-slate-200 group-hover:bg-slate-900 group-hover:border-slate-800 transition-all duration-300">
                    {React.cloneElement(getIcon(srv.code), { className: "w-6 h-6 transition-colors duration-300 group-hover:text-white" })}
                  </div>
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block font-bold mb-2">{srv.code}</span>
                  <h3 className="text-base font-black uppercase mb-3 text-slate-950 group-hover:text-slate-800 transition-colors tracking-tight font-display">{srv.title}</h3>
                  <p className="text-xs text-slate-655 leading-relaxed font-sans font-light normal-case">{srv.description}</p>
                </div>

                <a 
                  href="#contacto"
                  onClick={() => onSelectService(srv.title)}
                  className="mt-8 text-[9px] font-mono font-bold text-slate-800 hover:text-slate-950 flex items-center gap-1.5 uppercase tracking-wider relative z-10"
                >
                  Agendar Visita <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROCESO DE TRABAJO */}
      <section id="proceso" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b pb-6 mb-16 border-slate-250 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color: primaryColor }}>// RUTA METODOLÓGICA</span>
              <h2 className="text-3xl font-black uppercase mt-1 text-slate-950 font-display">Proceso de Ejecución de Proyectos</h2>
            </div>
            <p className="text-xs font-mono text-slate-500 uppercase max-w-md">
              Garantía de cumplimiento desde el levantamiento de telemetría física hasta la alineación láser final en planta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((prc, idx) => (
              <div key={idx} className="relative p-8 hardware-plate rounded-3xl overflow-hidden bg-white">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none schematic-grid" />
                <span className="text-4xl font-black font-mono absolute top-4 right-4 leading-none select-none text-slate-200" style={{ color: `${primaryColor}1a` }}>{prc.step}</span>
                <div className="relative z-10 space-y-3 pt-4">
                  <h3 className="text-sm font-black uppercase text-slate-950 font-display tracking-tight">{prc.name}</h3>
                  <p className="text-xs text-slate-655 leading-relaxed font-sans font-light normal-case">{prc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CASOS DE ÉXITO */}
      <section id="casos" className="py-24 bg-[#FAF9F5] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b pb-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4 border-slate-250">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color: primaryColor }}>// DESEMPEÑO AUDITADO</span>
              <h2 className="text-3xl font-black uppercase mt-1 text-slate-950 font-display">Casos de Éxito en la Gran Industria</h2>
            </div>
            <p className="text-xs font-mono text-slate-500 uppercase max-w-md">
              Proyectos reales que demuestran incrementos en disponibilidad de planta y reducciones energéticas comprobables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {caseStudies.map((cs) => (
              <div 
                key={cs.id}
                className="p-8 hardware-plate rounded-3xl flex flex-col justify-between group relative overflow-hidden bg-white"
              >
                <div className="absolute inset-0 opacity-[0.01] pointer-events-none schematic-grid" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="text-[10px] font-mono text-slate-550 uppercase tracking-widest font-bold">{cs.client}</span>
                    <span className="text-[9px] font-mono text-slate-450 uppercase tracking-widest bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 font-bold">{cs.id}</span>
                  </div>
                  <h3 className="text-lg font-black uppercase text-slate-950 tracking-tight font-display">{cs.title}</h3>
                  <p className="text-xs text-slate-655 leading-relaxed font-sans font-light normal-case">{cs.description}</p>
                  
                  <div className="p-4 bg-emerald-50/5 border border-emerald-500/20 rounded-2xl font-mono text-[9px] uppercase tracking-widest text-emerald-800 shadow-sm">
                    <span className="font-bold text-emerald-950 block mb-1.5">// MÉTRICAS AUDITADAS EN SITIO:</span>
                    {cs.metrics}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={() => setActiveCaseStudy(cs.id)}
                    className="w-full py-3.5 bg-slate-900 text-white hover:bg-slate-800 text-[9px] font-mono font-bold uppercase tracking-widest transition-all rounded-full cursor-pointer text-center border border-slate-900 premium-btn-tactile"
                  >
                    Ver Informe de Ingeniería ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL: Case Studies Details */}
      {activeCaseStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-[#FAF9F5] border border-slate-300 rounded-3xl p-8 text-left text-slate-800 font-mono uppercase text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b pb-4 mb-6 border-slate-200">
              <h3 className="text-base font-bold" style={{ color: primaryColor }}>INFORME TÉCNICO DE CASO DE ESTUDIO</h3>
              <button 
                onClick={() => setActiveCaseStudy(null)}
                className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 border border-slate-200"
              >
                ✕
              </button>
            </div>
            
            {(() => {
              const cs = caseStudies.find(c => c.id === activeCaseStudy);
              if (!cs) return null;
              return (
                <div className="space-y-6">
                  <div>
                    <span className="text-slate-400 block mb-1">PROYECTO</span>
                    <p className="text-sm font-bold text-slate-950">{cs.title}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">CLIENTE</span>
                    <p className="text-slate-900">{cs.client}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">REQUERIMIENTO INICIAL</span>
                    <p className="text-xs text-slate-655 leading-relaxed normal-case font-sans font-light">{cs.description}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">SOLUCIÓN DE INGENIERÍA</span>
                    <p className="text-xs text-slate-655 leading-relaxed normal-case font-sans font-light">{cs.details}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-250">
                    <span className="text-emerald-950 font-bold block mb-1">MÉTRICAS VERIFICADAS</span>
                    <p className="text-emerald-800 font-bold">{cs.metrics}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}
