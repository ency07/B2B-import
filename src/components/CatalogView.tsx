"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { 
  Wind, 
  ArrowRight, 
  Sun, 
  Moon, 
  Download, 
  Calendar, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  Filter, 
  Check, 
  Loader2, 
  Maximize2,
  Sliders,
  ChevronRight,
  User,
  Settings,
  Target,
  Award,
  ShieldCheck,
  FileCheck,
  Search,
  Activity,
  AlertTriangle,
  Flame,
  Thermometer,
  Disc
} from "lucide-react";
import { CatalogCategory } from "@/app/actions/catalog";
import { submitContactForm } from "@/app/actions/leads";

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

interface CatalogViewProps {
  catalog: CatalogCategory[];
  branding: Record<string, any>;
  tenantCode: string;
}

export default function CatalogView({ catalog, branding, tenantCode }: CatalogViewProps) {
  const [mounted, setMounted] = useState(false);
  const [otSearchQuery, setOtSearchQuery] = useState("");

  // Form state
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

  // Modal & comparison states
  const [activeCaseStudy, setActiveCaseStudy] = useState<string | null>(null);
  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);
  const [activeProductDetails, setActiveProductDetails] = useState<any>(null);
  const specs = activeProductDetails ? getEngineeringSpecs(activeProductDetails) : null;
  
  // Active company tab state
  const [activeEmpresaTab, setActiveEmpresaTab] = useState<"capacidades" | "certificaciones" | "seguridad">("capacidades");

  useEffect(() => {
    setMounted(true);
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

            if (nameLower.includes("hongo") || nameLower.includes("techo")) {
              cfmMin = 1500;
              cfmMax = 12000;
              pressMin = 0.2;
              pressMax = 1.2;
              material = specs["material"] || specs["Material"] || "Acero Inoxidable 304";
              power = specs["potencia"] || specs["Potencia"] || specs["motor"] || specs["Motor"] || "2.0 HP";
            } else if (nameLower.includes("axial") && nameLower.includes("tubo")) {
              cfmMin = 2000;
              cfmMax = 18000;
              pressMin = 0.2;
              pressMax = 1.0;
              material = specs["material"] || specs["Material"] || "Acero Pintado Epóxico";
              power = specs["potencia"] || specs["Potencia"] || specs["motor"] || specs["Motor"] || "3.0 HP";
            } else if (nameLower.includes("axial")) {
              cfmMin = 5000;
              cfmMax = 25000;
              pressMin = 0.1;
              pressMax = 0.6;
              material = specs["material"] || specs["Material"] || "Aluminio / Acero";
              power = specs["potencia"] || specs["Potencia"] || specs["motor"] || specs["Motor"] || "5.0 HP";
            } else if (nameLower.includes("centrífugo") || nameLower.includes("blower")) {
              cfmMin = 2500;
              cfmMax = 20000;
              pressMin = 0.5;
              pressMax = 4.5;
              material = specs["material"] || specs["Material"] || "Acero Reforzado";
              power = specs["potencia"] || specs["Potencia"] || specs["motor"] || specs["Motor"] || "7.5 HP";
            } else if (nameLower.includes("encajonado")) {
              cfmMin = 1200;
              cfmMax = 12000;
              pressMin = 0.2;
              pressMax = 1.5;
              material = specs["material"] || specs["Material"] || "Gabinete Acústico Galv";
              power = specs["potencia"] || specs["Potencia"] || specs["motor"] || specs["Motor"] || "1.5 HP";
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
              images: prod.images || [],
              documents: prod.documents || [],
              cadFiles: prod.cadFiles || []
            };
          })
        )
      )
    )
  );

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

  const services = [
    {
      code: "SRV-01",
      title: "Balanceo Estático y Dinámico",
      description: "Corrección milimétrica de distribución de pesos y alineación del eje de giro para alcanzar niveles de vibración admisibles bajo norma ISO 1940.",
      icon: <Sliders className="w-6 h-6" style={{ color: primaryColor }} />
    },
    {
      code: "SRV-02",
      title: "Mediciones Aerodinámicas",
      description: "Determinación en campo de caudales de aire (CFM), presiones estáticas, perfiles de velocidad y levantamiento físico de curvas de rendimiento reales.",
      icon: <Wind className="w-6 h-6" style={{ color: primaryColor }} />
    },
    {
      code: "SRV-03",
      title: "Fabricación y Reparación",
      description: "Reconstrucción estructural de turbinas, soldadura especializada homologada, cambio de rodamientos y alineación láser de sistemas de transmisión.",
      icon: <Activity className="w-6 h-6" style={{ color: primaryColor }} />
    },
    {
      code: "SRV-04",
      title: "Sistemas de Extracción/Inyección",
      description: "Diseño termodinámico y montaje de unidades tipo hongo en acero inoxidable con instrumentación digital de presión diferencial integrada.",
      icon: <Settings className="w-6 h-6" style={{ color: primaryColor }} />
    }
  ];

  const caseStudies = [
    {
      id: "case-01",
      title: "Molienda de Clinker",
      client: "Cementera del Caribe",
      description: "Optimización del flujo de aire y arrastre térmico en la cámara de molienda principal. Reducción del 14% en consumo eléctrico del extractor principal.",
      details: "Se reemplazó un ventilador axial deteriorado por un Blower de alta eficiencia balanceado dinámicamente in-situ. El caudal promedio aumentó de 12,000 CFM a 18,500 CFM constantes a una presión de 3.2 in w.g. con control de velocidad variable automatizado.",
      metrics: "Ahorro energético: 14% | Aumento flujo: +54% | Vibración: <1.2 mm/s"
    },
    {
      id: "case-02",
      title: "Presurización en Silos Portuarios",
      client: "Terminal Graneles del Norte",
      description: "Diseño e implementación de sistema de presurización controlada y filtración de aire para evitar la acumulación de polvos inflamables.",
      details: "Instalación de 4 unidades de inyección encajonadas insonorizadas con filtración G4+F7 redundante. Control de presión diferencial automatizada para garantizar un delta positivo de +15 Pa constantes contra atmósfera exterior.",
      metrics: "Presión interna: +15 Pa | Caudal: 8,500 CFM x4 | Norma: NFPA 61"
    },
    {
      id: "case-03",
      title: "Ventilación en Minería de Carbón",
      client: "Consorcio Carbonífero Guajira",
      description: "Modernización y robustecimiento de sistemas de inyección principal para galerías subterráneas profundas de explotación.",
      details: "Fabricación de 2 ventiladores tubo axiales gemelos de 60 pulgadas en acero estructural de alta resistencia con álabes de perfil aerodinámico de ángulo variable. Soporte de presiones estáticas elevadas de hasta 4.5 in w.g.",
      metrics: "Flujo total: 95,000 CFM | Motores: 75 HP x2 | Nivel de ruido: <85 dBA"
    },
    {
      id: "case-04",
      title: "Disipación Térmica en Data Center",
      client: "DataCloud Services",
      description: "Rediseño del flujo de aire de enfriamiento del área de servidores de alta densidad mediante confinamiento de pasillo caliente.",
      details: "Balanceo termodinámico con extractores de techo tipo hongo fabricados en acero inoxidable 304, operados mediante variadores de frecuencia integrados al sistema de gestión del edificio (BMS).",
      metrics: "PUE obtenido: 1.18 | Disipación: 450 kW | Temperatura aire: 22°C ± 1°C"
    }
  ];

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
        .schematic-grid-dark {
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
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
            <a href="#inicio" className="text-slate-500 hover:text-slate-900 transition-colors font-bold tracking-wider">Inicio</a>
            <span className="text-slate-300 font-light select-none">+</span>
            <a href="#soluciones" className="text-slate-500 hover:text-slate-900 transition-colors font-bold tracking-wider text-[#0284c7]" style={{ color: primaryColor }}>Soluciones</a>
            <span className="text-slate-300 font-light select-none">+</span>
            <a href="#servicios" className="text-slate-500 hover:text-slate-900 transition-colors font-bold tracking-wider">Servicios</a>
            <span className="text-slate-300 font-light select-none">+</span>
            <a href="#proceso" className="text-slate-500 hover:text-slate-900 transition-colors font-bold tracking-wider">Proceso</a>
            <span className="text-slate-300 font-light select-none">+</span>
            <a href="#casos" className="text-slate-500 hover:text-slate-900 transition-colors font-bold tracking-wider">Casos</a>
            <span className="text-slate-300 font-light select-none">+</span>
            <a href="#catalogo" className="text-slate-500 hover:text-slate-900 transition-colors font-bold tracking-wider">Catálogo Técnico</a>
            <span className="text-slate-300 font-light select-none">+</span>
            <a href="#contacto" className="text-slate-500 hover:text-slate-900 transition-colors font-bold tracking-wider">Contacto</a>
          </nav>

          {/* Buscador de OTs y Enlaces */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 bg-[#FAF9F5] border border-slate-300/60 rounded-full px-3 py-1 text-[10px] font-mono shadow-xs focus-within:border-slate-800 transition-colors">
              <Search className="w-3.5 h-3.5 text-slate-450" />
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
                AEROMAX-3D // MODELO CENTRÍFUGO
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

      {/* 3. BLOQUE DE SOLUCIONES (Enfocado en Problemas Reales) */}
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
                  <div className="space-y-2 text-xs leading-relaxed font-sans text-slate-650 normal-case">
                    <p><strong className="text-slate-900 font-mono text-[9px] uppercase tracking-widest font-bold block">// CAUSA RAÍZ EN PLANTA:</strong> Ductos mal dimensionados o codos abruptos aumentan la contrapresión y fuerzan el motor.</p>
                    <p><strong className="text-slate-900 font-mono text-[9px] uppercase tracking-widest font-bold block">// SOLUCIÓN DE INGENIERÍA:</strong> Rediseño fluidodinámico asistido por CFD y ventiladores de álabes atrasados.</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2.5">
                  <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[9px] font-mono text-emerald-800">
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
                  <div className="space-y-2 text-xs leading-relaxed font-sans text-slate-650 normal-case">
                    <p><strong className="text-slate-900 font-mono text-[9px] uppercase tracking-widest font-bold block">// CAUSA RAÍZ EN PLANTA:</strong> Equipos desbalanceados transmiten vibraciones destructivas a chumaceras y desalinean el eje.</p>
                    <p><strong className="text-slate-900 font-mono text-[9px] uppercase tracking-widest font-bold block">// SOLUCIÓN DE INGENIERÍA:</strong> Balanceo dinámico dual plano in-situ grado G2.5 con sensores láser.</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2.5">
                  <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[9px] font-mono text-emerald-800">
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
                  <div className="space-y-2 text-xs leading-relaxed font-sans text-slate-650 normal-case">
                    <p><strong className="text-slate-900 font-mono text-[9px] uppercase tracking-widest font-bold block">// CAUSA RAÍZ EN PLANTA:</strong> Alta carga térmica residual acumulada en naves cerradas, violando límites de temperatura y SST.</p>
                    <p><strong className="text-slate-900 font-mono text-[9px] uppercase tracking-widest font-bold block">// SOLUCIÓN DE INGENIERÍA:</strong> Renovación forzada con unidades tubo-axiales con álabes aerofoil variables.</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2.5">
                  <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[9px] font-mono text-emerald-800">
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
                  <div className="space-y-2 text-xs leading-relaxed font-sans text-slate-650 normal-case">
                    <p><strong className="text-slate-900 font-mono text-[9px] uppercase tracking-widest font-bold block">// CAUSA RAÍZ EN PLANTA:</strong> Concentración de polvos orgánicos finos o vapores corrosivos con riesgo de ignición por fricción.</p>
                    <p><strong className="text-slate-900 font-mono text-[9px] uppercase tracking-widest font-bold block">// SOLUCIÓN DE INGENIERÍA:</strong> Turbomáquinas de inoxidable 316L con motores ATEX antichispas.</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2.5">
                  <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[9px] font-mono text-emerald-800">
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
                    {React.cloneElement(srv.icon, { className: "w-6 h-6 transition-colors duration-300 group-hover:text-white" })}
                  </div>
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block font-bold mb-2">{srv.code}</span>
                  <h3 className="text-base font-black uppercase mb-3 text-slate-950 group-hover:text-slate-800 transition-colors tracking-tight font-display">{srv.title}</h3>
                  <p className="text-xs text-slate-650 leading-relaxed font-sans font-light normal-case">{srv.description}</p>
                </div>

                <a 
                  href="#contacto"
                  onClick={() => setFormData(prev => ({ ...prev, description: `Solicito visita técnica para servicio: ${srv.title}` }))}
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
            {[
              { step: "01", name: "Telemetría Inicial", desc: "Toma de mediciones físicas en sitio: velocidad de flujo, caída de presión con manómetros diferenciales y niveles de vibración espectral." },
              { step: "02", name: "Simulación CFD", desc: "Construcción de gemelos digitales tridimensionales del flujo de aire para simular pérdidas de carga y trayectorias térmicas antes de fabricar." },
              { step: "03", name: "Fabricación Especial", desc: "Mecanizado de turbinas y carcasas en acero estructural pesado con soldadura continua y balanceo dinámico de precisión en taller." },
              { step: "04", name: "Comisionamiento", desc: "Instalación en sitio, alineación láser de poleas, balanceo dinámico final a grado G2.5 y entrega de informe certificado de caudal." }
            ].map((prc, idx) => (
              <div key={idx} className="relative p-8 hardware-plate rounded-3xl overflow-hidden bg-white">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none schematic-grid" />
                <span className="text-4xl font-black font-mono absolute top-4 right-4 leading-none select-none text-slate-200" style={{ color: `${primaryColor}1a` }}>{prc.step}</span>
                <div className="relative z-10 space-y-3 pt-4">
                  <h3 className="text-sm font-black uppercase text-slate-950 font-display tracking-tight">{prc.name}</h3>
                  <p className="text-xs text-slate-650 leading-relaxed font-sans font-light normal-case">{prc.desc}</p>
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
                  <p className="text-xs text-slate-650 leading-relaxed font-sans font-light normal-case">{cs.description}</p>
                  
                  <div className="p-4 bg-emerald-50 border border-emerald-200/60 rounded-2xl font-mono text-[9px] uppercase tracking-widest text-emerald-800 shadow-sm">
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

      {/* 7. CATÁLOGO TÉCNICO (Fichas Físicas) */}
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
                        {prod.images && prod.images.length > 0 ? (
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
                              <span className="font-bold text-slate-950 block">{prod.caudalVal}</span>
                              <span className="text-slate-500 block mt-0.5">{prod.presionVal} contrapresión</span>
                            </div>
                            <div>
                              <strong className="text-slate-900 block text-[7px] uppercase tracking-widest font-bold mb-1">MATERIAL / CHASIS:</strong>
                              <span className="font-bold text-slate-950 block truncate">{prod.material}</span>
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

      {/* 8. SECCIÓN EMPRESA (Capacidad y Operación) */}
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
                <h3 className="font-sans font-black text-xl uppercase tracking-tight text-slate-950 font-display">Nuestra Misión B2B</h3>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed normal-case font-sans font-light">
                Asegurar la continuidad operativa de la gran industria del Caribe y el continente latinoamericano a través del suministro, fabricación y diagnóstico predictivo de unidades de flujo de aire de alta capacidad, optimizando el consumo energético y garantizando la total seguridad laboral y ambiental en entornos críticos.
              </p>
            </div>

            <div className="hardware-plate p-8 rounded-3xl bg-white space-y-4">
              <div className="flex items-center gap-3" style={{ color: primaryColor }}>
                <Award className="h-5 w-5" />
                <h3 className="font-sans font-black text-xl uppercase tracking-tight text-slate-950 font-display">Visión de Ingeniería</h3>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed normal-case font-sans font-light">
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
                className="font-mono text-xs uppercase tracking-widest pb-2 px-1 transition-all whitespace-nowrap cursor-pointer border-b-2 font-bold"
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
                className="font-mono text-xs uppercase tracking-widest pb-2 px-1 transition-all whitespace-nowrap cursor-pointer border-b-2 font-bold"
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
                className="font-mono text-xs uppercase tracking-widest pb-2 px-1 transition-all whitespace-nowrap cursor-pointer border-b-2 font-bold"
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
                    <p className="text-xs text-slate-650 leading-relaxed font-sans normal-case">
                      Contamos con una planta industrial propia de 2,400 m² equipada con maquinaria de precisión CNC pesada para el corte y rolado de lámina de acero hasta calibre 3/8”, balanceadoras dinámicas de banco calibradas bajo normas ISO, y laboratorios de pruebas aerodinámicas con túnel de viento instrumentado.
                    </p>
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase" style={{ color: primaryColor }}>
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
                    <p className="text-xs text-slate-650 leading-relaxed font-sans normal-case">
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
                    <p className="text-xs text-slate-650 leading-relaxed font-sans normal-case">
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

      {/* 9. CONTACTO (Formulario sobre retícula minimalista) */}
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

      {/* FOOTER */}
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

      {/* MODAL: Case Studies Details */}
      {activeCaseStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-[#FAF9F5] border border-slate-300 rounded-3xl p-8 text-left text-slate-800 font-mono uppercase text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b pb-4 mb-6 border-slate-200">
              <h3 className="text-base font-bold" style={{ color: primaryColor }}>INFORME TÉCNICO DE CASO DE ESTUDIO</h3>
              <button 
                onClick={() => setActiveCaseStudy(null)}
                className="p-1 rounded-full bg-slate-100 hover:bg-slate-250 text-slate-500 hover:text-slate-900 border border-slate-200"
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
                    <p className="text-slate-650 leading-relaxed normal-case font-sans font-light">{cs.description}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">SOLUCIÓN DE INGENIERÍA</span>
                    <p className="text-slate-650 leading-relaxed normal-case font-sans font-light">{cs.details}</p>
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
                className="text-slate-500 hover:text-white uppercase font-mono text-[10px] tracking-wider px-3.5 py-1.5 transition-all"
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
                <h3 className="text-xl font-bold text-slate-955 tracking-tight font-display uppercase">
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
                    <p className="text-xs text-slate-650 mt-2 leading-relaxed normal-case font-sans font-light">
                      {specs?.description || activeProductDetails.description}
                    </p>
                  </div>

                  <div className="border border-slate-200 p-5 rounded-2xl space-y-4">
                    <span className="text-[10px] text-slate-500 font-bold block tracking-widest uppercase font-mono">// ESPECIFICACIONES CONSTRUCTIVAS</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 font-mono text-[9px] uppercase">
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">SKU</span>
                        <span className="text-slate-950 font-bold">{activeProductDetails.sku}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Caudal Máx.</span>
                        <span className="text-slate-950 font-bold">{activeProductDetails.caudalVal}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Presión Máx.</span>
                        <span className="text-slate-950 font-bold">{activeProductDetails.presionVal}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Sonido Residual</span>
                        <span className="text-slate-950 font-bold">{activeProductDetails.ruidoVal}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Espesor Chapa</span>
                        <span className="text-slate-950 font-bold">{specs?.thickness}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Equilibrio Rot.</span>
                        <span className="text-slate-950 font-bold">{specs?.balanceo}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Límite Térmico</span>
                        <span className="text-slate-950 font-bold">{specs?.tempMax}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Material</span>
                        <span className="text-slate-950 font-bold truncate max-w-[120px]">{activeProductDetails.material}</span>
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
                      <span className="text-[8px] text-slate-455 font-bold block mb-2 tracking-widest uppercase font-mono">// APLICACIÓN COMERCIAL</span>
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
    </div>
  );
}
