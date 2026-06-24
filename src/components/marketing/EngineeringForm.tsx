"use client";

import React, { useState, useEffect, useTransition } from "react";
import { MapPin, Mail, Phone, Check, Loader2 } from "lucide-react";
import { submitContactForm } from "@/app/actions/leads";

interface EngineeringFormProps {
  tenantCode: string;
  primaryColor: string;
  prefilledDescription?: string;
}

export default function EngineeringForm({ tenantCode, primaryColor, prefilledDescription }: EngineeringFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    phone: "",
    email: "",
    urgency: "media",
    description: ""
  });
  const [isPending, startTransition] = useTransition();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (prefilledDescription) {
      setFormData(prev => ({ ...prev, description: prefilledDescription }));
    }
  }, [prefilledDescription]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    startTransition(async () => {
      try {
        await submitContactForm(tenantCode, {
          name: formData.name,
          companyName: formData.companyName,
          phone: formData.phone,
          email: formData.email,
          urgency: formData.urgency,
          description: formData.description
        });
        setSubmitSuccess(true);
        setFormData({
          name: "",
          companyName: "",
          phone: "",
          email: "",
          urgency: "media",
          description: ""
        });
      } catch (err: any) {
        setSubmitError(err.message || "Error al enviar la solicitud.");
      }
    });
  };

  return (
    <section id="contacto" className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5 space-y-6">
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color: primaryColor }}>// CONTACTO TÉCNICO B2B</span>
          <h2 className="text-3xl font-black uppercase text-slate-950 font-display">Iniciar Proyecto de Ingeniería</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-sans font-light normal-case">
            Rellene nuestro formulario de recepción técnica. Su requerimiento será asignado de inmediato a un ingeniero calificado y se registrará de forma transparente en el ERP de AeroMax.
          </p>

          <div className="space-y-4 pt-6 border-t border-slate-100 font-mono text-[10px] uppercase">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-slate-450" />
              <div>
                <span className="font-bold block text-slate-900">Oficina Principal & Taller</span>
                <span className="text-slate-500 normal-case">Vía 40 #51-88, Barranquilla, Colombia</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-450" />
              <div>
                <span className="font-bold block text-slate-900">Ingeniería & Soporte</span>
                <span className="text-slate-500 normal-case">proyectos@aeromax.com.co</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-450" />
              <div>
                <span className="font-bold block text-slate-900">Atención Telefónica Directa</span>
                <span className="text-slate-500">+57 (300) 450-8899</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={handleFormSubmit} className="space-y-8 p-8 border border-slate-200 rounded-3xl bg-[#FAF9F5]/40 shadow-xs relative">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none schematic-grid" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest mb-1 text-slate-400 font-bold">// Nombre del Contacto</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-transparent border-0 border-b border-slate-200 focus:border-slate-950 px-0 py-2 text-slate-900 text-sm focus:ring-0 focus:outline-none transition-colors font-medium rounded-none"
                  placeholder="Ej. Ing. Carlos Mendoza"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest mb-1 text-slate-400 font-bold">// Razón Social / Empresa</label>
                <input 
                  type="text" 
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full bg-transparent border-0 border-b border-slate-200 focus:border-slate-950 px-0 py-2 text-slate-900 text-sm focus:ring-0 focus:outline-none transition-colors font-medium rounded-none"
                  placeholder="Ej. Cementos del Norte S.A."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest mb-1 text-slate-400 font-bold">// Correo Corporativo</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-transparent border-0 border-b border-slate-200 focus:border-slate-950 px-0 py-2 text-slate-900 text-sm focus:ring-0 focus:outline-none transition-colors font-medium rounded-none"
                  placeholder="Ej. c.mendoza@cementos.com"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest mb-1 text-slate-400 font-bold">// Teléfono Móvil</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-transparent border-0 border-b border-slate-200 focus:border-slate-950 px-0 py-2 text-slate-900 text-sm focus:ring-0 focus:outline-none transition-colors font-medium rounded-none"
                  placeholder="Ej. +57 300 450 8899"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest mb-1 text-slate-400 font-bold">// Nivel de Urgencia</label>
                <select 
                  value={formData.urgency}
                  onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                  className="w-full bg-transparent border-0 border-b border-slate-200 focus:border-slate-950 px-0 py-2 text-slate-900 text-sm focus:ring-0 focus:outline-none transition-colors font-medium rounded-none cursor-pointer"
                >
                  <option value="alta">ALTA // PARADA DE LÍNEA COMPROMETIDA</option>
                  <option value="media">MEDIA // AMPLIACIÓN O MEJORA DE NAVE</option>
                  <option value="baja">BAJA // MANTENIMIENTO PREVENTIVO ANUAL</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest mb-1 text-slate-400 font-bold">// Descripción del Requerimiento Técnico</label>
                <textarea 
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-transparent border-0 border-b border-slate-200 focus:border-slate-950 px-0 py-2 text-slate-900 text-sm focus:ring-0 focus:outline-none transition-colors font-medium rounded-none placeholder-slate-300 resize-none"
                  placeholder="Escriba aquí los detalles (caudales CFM, contrapresiones, temperaturas)."
                />
              </div>
            </div>

            {submitError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                {submitError}
              </div>
            )}

            {submitSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>SOLICITUD ENVIADA CON ÉXITO. UN INGENIERO SE PONDRÁ EN CONTACTO.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 rounded-full font-mono font-bold text-[10px] uppercase tracking-widest text-white hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-55 cursor-pointer premium-btn-tactile shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> REGISTRANDO LEADS...
                </>
              ) : (
                "REGISTRAR PROYECTO EN ERP ➔"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
