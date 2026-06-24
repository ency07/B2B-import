"use client";

import React from "react";
import Link from "next/link";

interface FooterSectionProps {
  tenantCode: string;
  siteName: string;
}

export default function FooterSection({ tenantCode, siteName }: FooterSectionProps) {
  return (
    <footer className="pt-20 pb-8 border-t font-mono text-[9px] uppercase tracking-wider bg-[#FAF9F5] border-slate-200 text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-2 md:border-r border-slate-200 pr-4">
          <span className="font-bold text-slate-800 block mb-3">// COMPAÑÍA</span>
          <p className="text-slate-500 normal-case leading-relaxed">Cra 38 #51-88, Barranquilla, Atlántico. Diseños aerodinámicos de alta eficiencia y continuidad de planta.</p>
        </div>
        <div className="space-y-2 md:border-r border-slate-200 pr-4">
          <span className="font-bold text-slate-800 block mb-3">// HOMOLOGACIÓN</span>
          <p className="text-slate-500 leading-relaxed">AMCA member standard, ASHRAE active member, RETIE certified designs, NTC 2050 electrical compliance.</p>
        </div>
        <div className="space-y-2 md:border-r border-slate-200 pr-4">
          <span className="font-bold text-slate-800 block mb-3">// PORTALES INTEGRADOS</span>
          <div className="flex flex-col gap-1.5">
            <Link href={`/portal?tenant=${tenantCode}`} className="hover:text-slate-950 transition-colors">➔ Portal Clientes B2B</Link>
            <Link href={`/dashboard?tenant=${tenantCode}`} className="hover:text-slate-950 transition-colors">➔ Administración ERP</Link>
          </div>
        </div>
        <div className="space-y-2">
          <span className="font-bold text-slate-800 block mb-3">// SERVICIO TÉCNICO</span>
          <p className="text-slate-500 leading-relaxed">Ingeniero especialista de guardia. Tiempo de respuesta promedio en portal: &lt; 4 horas hábiles.</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-[40px] sm:text-[70px] lg:text-[100px] font-black text-slate-200/50 tracking-[0.25em] select-none pointer-events-none font-display w-full text-center leading-none my-4 uppercase">
          {siteName}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[8px] text-slate-400">
        <span>© 2026 {siteName.toUpperCase()}. TODOS LOS DERECHOS RESERVADOS.</span>
        <span>DISEÑO DE INGENIERÍA HOMOLOGADO DE CONFIEZA</span>
      </div>
    </footer>
  );
}
