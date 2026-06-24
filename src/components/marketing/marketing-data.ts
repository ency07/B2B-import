export interface ServiceItem {
  code: string;
  title: string;
  description: string;
}

export interface CaseStudyItem {
  id: string;
  title: string;
  client: string;
  description: string;
  details: string;
  metrics: string;
}

export interface ProcessStepItem {
  step: string;
  name: string;
  desc: string;
}

export const getServicesData = (): ServiceItem[] => [
  {
    code: "SRV-01",
    title: "Balanceo Estático y Dinámico",
    description: "Corrección milimétrica de distribución de pesos y alineación del eje de giro para alcanzar niveles de vibración admisibles bajo norma ISO 1940."
  },
  {
    code: "SRV-02",
    title: "Mediciones Aerodinámicas",
    description: "Determinación en campo de caudales de aire (CFM), presiones estáticas, perfiles de velocidad y levantamiento físico de curvas de rendimiento reales."
  },
  {
    code: "SRV-03",
    title: "Fabricación y Reparación",
    description: "Reconstrucción estructural de turbinas, soldadura especializada homologada, cambio de rodamientos y alineación láser de sistemas de transmisión."
  },
  {
    code: "SRV-04",
    title: "Sistemas de Extracción/Inyección",
    description: "Diseño termodinámico y montaje de unidades tipo hongo en acero inoxidable con instrumentación digital de presión diferencial integrada."
  }
];

export const getCaseStudiesData = (): CaseStudyItem[] => [
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

export const getProcessStepsData = (): ProcessStepItem[] => [
  { step: "01", name: "Telemetría Inicial", desc: "Toma de mediciones físicas en sitio: velocidad de flujo, caída de presión con manómetros diferenciales y niveles de vibración espectral." },
  { step: "02", name: "Simulación CFD", desc: "Construcción de gemelos digitales tridimensionales del flujo de aire para simular pérdidas de carga y trayectorias térmicas antes de fabricar." },
  { step: "03", name: "Fabricación Especial", desc: "Mecanizado de turbinas y carcasas en acero estructural pesado con soldadura continua y balanceo dinámico de precisión en taller." },
  { step: "04", name: "Comisionamiento", desc: "Instalación en sitio, alineación láser de poleas, balanceo dinámico final a grado G2.5 y entrega de informe certificado de caudal." }
];
