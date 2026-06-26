"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  tenantCode: string;
  primaryColor: string;
  siteName: string;
}

export default function HeroSection({ tenantCode, primaryColor, siteName }: HeroSectionProps) {
  return (
    <section id="inicio" className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-[#FAF9F5] text-slate-900 py-16 border-b border-slate-200">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none schematic-grid" />
      
      {/* Technical Vector Lines */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[15%] top-0 bottom-0 w-[1px] bg-slate-200/50" />
        <div className="absolute right-[30%] top-0 bottom-0 w-[1px] bg-slate-200/50" />
        <div className="absolute top-[25%] left-0 right-0 h-[1px] bg-slate-200/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7 text-left space-y-6">
          <span className="text-[9px] font-mono uppercase tracking-widest px-3 py-1 rounded inline-block border bg-white/80 text-slate-500 border-slate-300/55 shadow-xs">
            // TELEMETRÍA Y CONTROL FLUIDODINÁMICO B2B
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-slate-950 leading-none uppercase font-display">
            Garantizamos <span className="font-light text-slate-400">la continuidad</span> operativa <span className="font-light text-slate-400">de su planta</span>
          </h1>
          <p className="text-sm text-slate-550 leading-relaxed max-w-2xl font-light normal-case font-sans">
            Diseño, fabricación y puesta en marcha de turbomaquinaria industrial y sistemas de renovación de caudal. Optimizamos consumos energéticos, disipamos cargas térmicas extremas y reducimos la vibración residual bajo normativas AMCA e ISO 1940.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 pt-4 font-mono">
            <Link 
              href={`/wizard?tenant=${tenantCode}`}
              className="px-8 py-4 rounded-full font-bold text-[9px] uppercase tracking-widest text-white hover:brightness-110 active:scale-[0.98] transition-all premium-btn-tactile flex items-center justify-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              Configurar Solución en Wizard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a 
              href="#catalogo"
              className="px-8 py-4 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-bold text-[9px] uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2 premium-btn-secondary cursor-pointer"
            >
              Ver Catálogo de Equipos
            </a>
          </div>

          {/* Certifications Row */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-6 opacity-90 text-[9px] font-mono text-slate-500">
            <span className="font-bold">// STANDARDS Y HOMOLOGACIÓN:</span>
            <div className="flex flex-wrap gap-2.5 font-bold">
              <span className="px-2 py-0.5 border border-slate-200 bg-white rounded-md">✓ ISO 9001:2015</span>
              <span className="px-2 py-0.5 border border-slate-200 bg-white rounded-md">✓ AMCA MEMBER</span>
              <span className="px-2 py-0.5 border border-slate-200 bg-white rounded-md">✓ ATEX EXPLOSION-PROOF</span>
              <span className="px-2 py-0.5 border border-slate-200 bg-white rounded-md">✓ RETIE COMPLIANCE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase */}
        <div className="lg:col-span-5 relative">
          <div className="relative border border-slate-300 rounded-3xl p-3 bg-white/70 backdrop-blur-md shadow-lg overflow-hidden">
            <div className="absolute top-6 left-6 z-10 font-mono text-[8px] bg-slate-900 text-white px-2 py-0.5 rounded tracking-widest uppercase opacity-75">
              // SHOWCASE: CENTRIFUGAL SYSTEM
            </div>
            <div className="absolute bottom-6 right-6 z-10 font-mono text-[8px] text-slate-800 bg-white/95 px-2 py-1 rounded border border-slate-200 uppercase tracking-widest font-bold">
              {siteName.toUpperCase()} // MODELO CENTRÍFUGO
            </div>

            {/* Technical guidance overlays */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
              <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-slate-400" />
              <div className="absolute left-1/2 top-4 bottom-4 w-[1px] bg-slate-400" />
              <div className="absolute top-10 left-10 text-[8px] font-mono text-slate-400 flex flex-col">
                <span>X: 142.5 mm</span>
                <span>Y: 980.2 mm</span>
                <span>FLOW: CONSTANT</span>
              </div>
            </div>

            {/* Real Fotorrealista image */}
            <img 
              src="/industrial_centrifugal_fan.png" 
              alt="Soplador centrífugo industrial en fábrica de cemento AeroMax" 
              className="w-full h-80 object-cover rounded-2xl filter contrast-[1.03] brightness-[0.98]"
            />
          </div>

          {/* Micro specs overlay card */}
          <div className="absolute -bottom-8 -left-8 bg-slate-900 text-white rounded-2xl p-4.5 border border-slate-800 shadow-xl max-w-[200px] font-mono text-[9px] uppercase space-y-2 z-10">
            <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 flex items-center justify-between">
              <span>TOLERANCIA</span> <span>G2.5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">PRESION ST.</span> <span className="font-bold text-white">4.5 in w.g.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">CAUDAL NOM.</span> <span className="font-bold text-white">32,500 m³/h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">RODAMIENTOS</span> <span className="font-bold text-emerald-400">✓ SKF L10</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
