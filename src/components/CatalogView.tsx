"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Wind, Search, Activity, ArrowRight } from "lucide-react";
import { CatalogSearch } from "@/components/CatalogSearch";
import { CatalogCategory } from "@/app/actions/catalog";

// Import modular subcomponents
import HeroSection from "./marketing/HeroSection";
import SolutionsSection from "./marketing/SolutionsSection";
import ServicesSection from "./marketing/ServicesSection";
import TechnicalCatalog from "./marketing/TechnicalCatalog";
import AboutSection from "./marketing/AboutSection";
import EngineeringForm from "./marketing/EngineeringForm";
import FooterSection from "./marketing/FooterSection";

interface CatalogViewProps {
  catalog: CatalogCategory[];
  branding: Record<string, any>;
  tenantCode: string;
}

export default function CatalogView({ catalog, branding, tenantCode }: CatalogViewProps) {
  const [mounted, setMounted] = useState(false);
  const [otSearchQuery, setOtSearchQuery] = useState("");
  const [prefilledDescription, setPrefilledDescription] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll Spy State
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["inicio", "soluciones", "servicios", "proceso", "casos", "catalogo", "contacto"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const primaryColor = branding.color_primario || "#0284c7";
  const siteName = branding.nombre_comercial || "AeroMax Industrial";
  const siteLogo = branding.logo_claro_url || "";

  // Flatten products from database catalog tree
  const products = catalog.flatMap(cat => 
    cat.subcategories.flatMap(sub => 
      sub.families.flatMap(fam => 
        fam.series.flatMap(ser => 
          ser.products.map(prod => {
            const specs = prod.specifications || {};
            const nameLower = prod.name.toLowerCase();

            // Default values
            let cfmMin = 1000;
            let cfmMax = 10000;
            let pressMin = 0.1;
            let pressMax = 1.5;
            let material = specs["material"] || specs["Material"] || "Acero Galvanizado";
            let power = specs["potencia"] || specs["Potencia"] || specs["motor"] || specs["Motor"] || "1.5 HP";
            let imagePath = "/industrial_plant_ventilation.png"; // Fallback image

            if (nameLower.includes("hongo") || nameLower.includes("techo") || nameLower.includes("extractor tipo hongo")) {
              cfmMin = 1500;
              cfmMax = 12000;
              pressMin = 0.2;
              pressMax = 1.2;
              material = specs["material"] || specs["Material"] || "Acero Inoxidable 304";
              power = specs["potencia"] || specs["Potencia"] || specs["motor"] || specs["Motor"] || "2.0 HP";
              imagePath = "/extractor_hongo_inox.png";
            } else if (nameLower.includes("axial") && nameLower.includes("tubo")) {
              cfmMin = 2000;
              cfmMax = 18000;
              pressMin = 0.2;
              pressMax = 1.0;
              material = specs["material"] || specs["Material"] || "Acero Pintado Epóxico";
              power = specs["potencia"] || specs["Potencia"] || specs["motor"] || specs["Motor"] || "3.0 HP";
              imagePath = "/axial_duct_fan.png";
            } else if (nameLower.includes("axial") || nameLower.includes("ventilador axial")) {
              cfmMin = 5000;
              cfmMax = 25000;
              pressMin = 0.1;
              pressMax = 0.6;
              material = specs["material"] || specs["Material"] || "Aluminio / Acero";
              power = specs["potencia"] || specs["Potencia"] || specs["motor"] || specs["Motor"] || "5.0 HP";
              imagePath = "/axial_duct_fan.png";
            } else if (nameLower.includes("centrífugo") || nameLower.includes("blower") || nameLower.includes("ventilador centrífugo")) {
              cfmMin = 2500;
              cfmMax = 20000;
              pressMin = 0.5;
              pressMax = 4.5;
              material = specs["material"] || specs["Material"] || "Acero Reforzado";
              power = specs["potencia"] || specs["Potencia"] || specs["motor"] || specs["Motor"] || "7.5 HP";
              imagePath = "/industrial_centrifugal_fan.png";
            } else if (nameLower.includes("encajonado") || nameLower.includes("ventilador encajonado") || nameLower.includes("multiusos") || nameLower.includes("extractor multiusos")) {
              cfmMin = 1200;
              cfmMax = 12000;
              pressMin = 0.2;
              pressMax = 1.5;
              material = specs["material"] || specs["Material"] || "Gabinete Acústico Galv";
              power = specs["potencia"] || specs["Potencia"] || specs["motor"] || specs["Motor"] || "1.5 HP";
              imagePath = "/ventilador_encajonado.png";
            }

            const sku = prod.productCode || `AX-${prod.id.slice(0, 6).toUpperCase()}`;
            const subtitle = nameLower.includes("hongo") ? "Extractor de Techo Centrífugo"
                           : nameLower.includes("tubo") ? "Ventilador Tubo Axial de Media Presión"
                           : nameLower.includes("axial") ? "Ventilador Axial de Alta Presión"
                           : nameLower.includes("centrífugo") ? "Soplador Centrífugo de Alta Capacidad"
                           : nameLower.includes("encajonado") ? "Unidad de Ventilación Acústica"
                           : "Ventilador Industrial de Ingeniería";

            const caudalVal = specs["caudal"] || specs["Caudal"] || `${Math.round(cfmMax * 1.7).toLocaleString("es-CO")} m³/h`;
            const presionVal = specs["presion"] || specs["Presión"] || `${Math.round(pressMax * 249)} Pa`;
            const motorVal = power;
            const eficienciaVal = specs["eficiencia"] || specs["Eficiencia"] || "92%";
            const ruidoVal = specs["ruido"] || specs["Ruido"] || "68 dB";

            let certificaciones: string[] = [];
            if (specs["certificaciones"] || specs["Certificaciones"]) {
              certificaciones = (specs["certificaciones"] || specs["Certificaciones"]).split(",").map((c: string) => c.trim());
            } else {
              certificaciones = ["ISO 5801", "CE"];
              if (nameLower.includes("axial")) certificaciones.push("ATEX", "IP55");
              else if (nameLower.includes("centrífugo")) certificaciones.push("UL", "NEMA");
              else certificaciones.push("IP54");
              
              if (!nameLower.includes("importado")) {
                certificaciones.push("Fabricación Nacional");
              }
            }

            let aplicaciones: string[] = [];
            if (specs["aplicaciones"] || specs["Aplicaciones"]) {
              aplicaciones = (specs["aplicaciones"] || specs["Aplicaciones"]).split(",").map((a: string) => a.trim());
            } else {
              if (nameLower.includes("axial")) {
                aplicaciones = ["Cementeras", "Acerías", "Minería", "Plantas químicas"];
              } else if (nameLower.includes("centrífugo")) {
                aplicaciones = ["Petroquímica", "Papelera", "Cementeras", "Silos"];
              } else if (nameLower.includes("hongo")) {
                aplicaciones = ["Hospitales", "Laboratorios", "Alimentos", "Cocinas"];
              } else {
                aplicaciones = ["Minería", "Cemento", "Alimentos", "Química"];
              }
            }

            let badge = "ATEX";
            if (nameLower.includes("hongo")) badge = "PREMIUM";
            else if (nameLower.includes("tubo")) badge = "BEST SELLER";
            else if (nameLower.includes("encajonado")) badge = "NUEVO";
            else if (nameLower.includes("centrífugo")) badge = "PERSONALIZABLE";

            let status = "Disponible";
            if (prod.status) {
              status = prod.status;
            } else {
              if (nameLower.includes("tubo") || nameLower.includes("centrífugo")) status = "Fabricación Especial";
              else if (nameLower.includes("hongo")) status = "Entrega inmediata";
              else status = "Bajo pedido";
            }

            let metricsRatings = { caudal: 80, presion: 70, ruido: 40, eficiencia: 92 };
            if (nameLower.includes("hongo")) {
              metricsRatings = { caudal: 45, presion: 35, ruido: 25, eficiencia: 88 };
            } else if (nameLower.includes("tubo")) {
              metricsRatings = { caudal: 70, presion: 60, ruido: 65, eficiencia: 90 };
            } else if (nameLower.includes("axial")) {
              metricsRatings = { caudal: 90, presion: 80, ruido: 55, eficiencia: 92 };
            } else if (nameLower.includes("centrífugo")) {
              metricsRatings = { caudal: 60, presion: 95, ruido: 80, eficiencia: 94 };
            } else if (nameLower.includes("encajonado")) {
              metricsRatings = { caudal: 55, presion: 45, ruido: 20, eficiencia: 89 };
            }

            return {
              id: prod.id,
              productCode: prod.productCode,
              name: prod.name,
              description: prod.description || "",
              cfmMin,
              cfmMax,
              pressMin,
              pressMax,
              material,
              power,
              categoryName: cat.name,
              familyName: fam.name,
              sku,
              subtitle,
              caudalVal,
              presionVal,
              motorVal,
              eficienciaVal,
              ruidoVal,
              certificaciones,
              aplicaciones,
              badge,
              status,
              metricsRatings,
              images: [{ filePath: imagePath, altText: prod.name }],
              documents: prod.documents || [],
              cadFiles: prod.cadFiles || []
            };
          })
        )
      )
    )
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen font-sans antialiased bg-[#FAF9F5] text-slate-900 relative">
      <style>{`
        :root {
          --brand-primary: ${primaryColor};
        }
        html {
          scroll-behavior: smooth;
        }
        .schematic-grid {
          background-image: radial-gradient(circle, rgba(30, 41, 59, 0.04) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .hardware-plate {
          background: linear-gradient(145deg, #ffffff 0%, #f7f6f2 100%);
          border: 1px solid #e2e0d7;
          box-shadow: 
            0 1px 2px rgba(18, 24, 36, 0.01),
            0 8px 24px -4px rgba(18, 24, 36, 0.03),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.9);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hardware-plate:hover {
          transform: translateY(-3px);
          border-color: var(--brand-primary);
          box-shadow: 
            0 12px 32px -8px rgba(18, 24, 36, 0.08),
            0 0 0 1px var(--brand-primary),
            inset 0 1px 0 0 rgba(255, 255, 255, 1);
        }
        .premium-btn-tactile {
          box-shadow: 
            0 2px 4px 0 rgba(18, 24, 36, 0.05),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .premium-btn-tactile:active {
          transform: scale(0.97);
        }
        .premium-btn-secondary {
          background: #ffffff;
          border: 1px solid #dcdad0;
          box-shadow: 
            0 1px 2px 0 rgba(18, 24, 36, 0.02),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.9);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .premium-btn-secondary:hover {
          background: #fbfbfa;
          border-color: #b5b2a3;
        }
      `}</style>

      {/* 1. NAVEGACIÓN GLOBAL & PORTAL CLIENTE */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 bg-[#FAF9F5]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 flex items-center justify-between gap-4 text-[9px] font-mono uppercase tracking-widest text-slate-450 border-b border-slate-200/20 pb-1.5">
          <div className="flex items-center gap-1 text-slate-400">
            <Activity className="w-2.5 h-2.5" /> STATUS: OPERACIÓN CONTINUA EN PLANTA
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/portal?tenant=${tenantCode}`} className="hover:text-slate-900 transition-colors flex items-center gap-1 font-bold">
              Portal Cliente <span className="text-[7px]">➔</span>
            </Link>
            <span className="opacity-30 select-none">•</span>
            <Link href={`/dashboard?tenant=${tenantCode}`} className="hover:text-slate-900 transition-colors flex items-center gap-1 font-bold">
              Portal ERP <span className="text-[7px]">➔</span>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {siteLogo ? (
              <img src={siteLogo} alt={siteName} className="h-8 w-auto object-contain" />
            ) : (
              <a href="#inicio" className="flex items-center gap-2 group">
                <Wind className="w-5 h-5 transition-transform duration-700 group-hover:rotate-180" style={{ color: primaryColor }} />
                <span className="text-xs font-black tracking-widest uppercase font-mono text-slate-900">
                  {siteName}
                </span>
              </a>
            )}
          </div>

          {/* Menú de Navegación con Separadores "+" */}
          <nav className="hidden lg:flex items-center gap-4 text-[10px] font-mono uppercase">
            <a 
              href="#inicio" 
              className={`transition-colors font-bold tracking-wider ${activeSection === "inicio" ? "text-slate-900 font-extrabold" : "text-slate-500 hover:text-slate-900"}`}
              style={activeSection === "inicio" ? { color: primaryColor } : undefined}
            >
              Inicio
            </a>
            <span className="text-slate-300 font-light select-none">+</span>
            <a 
              href="#soluciones" 
              className={`transition-colors font-bold tracking-wider ${activeSection === "soluciones" ? "text-slate-900 font-extrabold" : "text-slate-500 hover:text-slate-900"}`}
              style={activeSection === "soluciones" ? { color: primaryColor } : undefined}
            >
              Soluciones
            </a>
            <span className="text-slate-300 font-light select-none">+</span>
            <a 
              href="#servicios" 
              className={`transition-colors font-bold tracking-wider ${activeSection === "servicios" ? "text-slate-900 font-extrabold" : "text-slate-500 hover:text-slate-900"}`}
              style={activeSection === "servicios" ? { color: primaryColor } : undefined}
            >
              Servicios
            </a>
            <span className="text-slate-300 font-light select-none">+</span>
            <a 
              href="#proceso" 
              className={`transition-colors font-bold tracking-wider ${activeSection === "proceso" ? "text-slate-950 font-extrabold" : "text-slate-500 hover:text-slate-900"}`}
              style={activeSection === "proceso" ? { color: primaryColor } : undefined}
            >
              Proceso
            </a>
            <span className="text-slate-300 font-light select-none">+</span>
            <a 
              href="#casos" 
              className={`transition-colors font-bold tracking-wider ${activeSection === "casos" ? "text-slate-900 font-extrabold" : "text-slate-500 hover:text-slate-900"}`}
              style={activeSection === "casos" ? { color: primaryColor } : undefined}
            >
              Casos
            </a>
            <span className="text-slate-300 font-light select-none">+</span>
            <a 
              href="#catalogo" 
              className={`transition-colors font-bold tracking-wider ${activeSection === "catalogo" ? "text-slate-900 font-extrabold" : "text-slate-500 hover:text-slate-900"}`}
              style={activeSection === "catalogo" ? { color: primaryColor } : undefined}
            >
              Catálogo Técnico
            </a>
            <span className="text-slate-300 font-light select-none">+</span>
            <a 
              href="#contacto" 
              className={`transition-colors font-bold tracking-wider ${activeSection === "contacto" ? "text-slate-900 font-extrabold" : "text-slate-500 hover:text-slate-900"}`}
              style={activeSection === "contacto" ? { color: primaryColor } : undefined}
            >
              Contacto
            </a>
          </nav>

          {/* Buscador Global de Catálogo */}
          <div className="w-full flex justify-center mb-8">
            <CatalogSearch tenantCode={tenantCode} onProductSelect={(product) => {
              const detailModal = document.querySelector('[data-product-detail-trigger]') as HTMLElement;
              if (detailModal) detailModal.click();
            }} />
          </div>

          {/* Buscador de OTs y Enlaces */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 bg-[#FAF9F5] border border-slate-300/60 rounded-full px-3 py-1 text-[10px] font-mono shadow-xs focus-within:border-slate-800 transition-colors">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar OT o Cuenta..."
                value={otSearchQuery}
                onChange={(e) => setOtSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && otSearchQuery.trim()) {
                    window.location.href = `/portal?tenant=${tenantCode}&search=${encodeURIComponent(otSearchQuery)}`;
                  }
                }}
                className="bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 w-36 text-[10px] focus:ring-0 focus:outline-none p-0"
              />
            </div>
            
            <Link 
              href={`/wizard?tenant=${tenantCode}`}
              className="text-[9px] font-mono font-bold uppercase tracking-wider px-5 py-2.5 rounded-full text-white flex items-center gap-1.5 transition-all premium-btn-tactile hover:brightness-105 active:scale-95"
              style={{ backgroundColor: primaryColor }}
            >
              Dimensionar Proyecto <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <HeroSection tenantCode={tenantCode} primaryColor={primaryColor} siteName={siteName} />

      {/* 3. SOLUTIONS SECTION */}
      <SolutionsSection tenantCode={tenantCode} primaryColor={primaryColor} />

      {/* 4-6. SERVICES, PROCESS & CASES SECTIONS */}
      <ServicesSection primaryColor={primaryColor} onSelectService={(srvTitle) => setPrefilledDescription(`Solicito visita técnica para servicio: ${srvTitle}`)} />

      {/* 7. TECHNICAL CATALOG SECTION */}
      <TechnicalCatalog products={products} primaryColor={primaryColor} tenantCode={tenantCode} />

      {/* 8. ABOUT COMPANY SECTION */}
      <AboutSection primaryColor={primaryColor} />

      {/* 9. ENGINEERING CONTACT FORM */}
      <EngineeringForm tenantCode={tenantCode} primaryColor={primaryColor} prefilledDescription={prefilledDescription} />

      {/* FOOTER SECTION */}
      <FooterSection tenantCode={tenantCode} siteName={siteName} />
    </div>
  );
}
