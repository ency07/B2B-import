import { describe, it, expect } from "vitest";
import { getBrandingDefaults } from "../branding-defaults";
import type { BrandingConfig } from "../branding-defaults";

describe("branding-defaults.ts", () => {
  describe("getBrandingDefaults", () => {
    it("returns AeroMax defaults for null tenant code", () => {
      const config = getBrandingDefaults(null);
      expect(config.nombre_comercial).toBe("AeroMax Industrial");
      expect(config.razon_social).toBe("AeroMax Industrial S.A.S.");
    });

    it("returns AeroMax defaults for undefined tenant code", () => {
      const config = getBrandingDefaults(undefined);
      expect(config.nombre_comercial).toBe("AeroMax Industrial");
    });

    it("returns AeroMax defaults for non-apex tenant code", () => {
      const config = getBrandingDefaults("acme");
      expect(config.nombre_comercial).toBe("AeroMax Industrial");
      expect(config.nit).toBe("901.201.764-3");
    });

    it("returns Apex defaults for 'apex' tenant code", () => {
      const config = getBrandingDefaults("apex");
      expect(config.nombre_comercial).toBe("Apex Logística B2B");
      expect(config.razon_social).toBe("Apex Logistics B2B Group S.A. de C.V.");
      expect(config.nit).toBe("APX150508LL2");
    });

    it("handles case-insensitive apex matching (uppercase)", () => {
      const config = getBrandingDefaults("APEX");
      expect(config.nombre_comercial).toBe("Apex Logística B2B");
    });

    it("handles case-insensitive apex matching (mixed case)", () => {
      const config = getBrandingDefaults("Apex");
      expect(config.nombre_comercial).toBe("Apex Logística B2B");
    });

    it("returns correct Apex contact info", () => {
      const config = getBrandingDefaults("apex");
      expect(config.telefono_principal).toBe("+57 601 765 4321");
      expect(config.email_corporativo).toBe("info@apexlogistics.com");
      expect(config.web).toBe("https://apexlogistics.com");
    });

    it("returns correct AeroMax contact info", () => {
      const config = getBrandingDefaults("ventitech");
      expect(config.telefono_principal).toBe("+57 300 123 4567");
      expect(config.email_corporativo).toBe("contacto@aeromax.co");
      expect(config.web).toBe("https://aeromax.co");
    });

    it("uses same localization for all tenants", () => {
      const apex = getBrandingDefaults("apex");
      const aeromax = getBrandingDefaults(null);
      expect(apex.zona_horaria).toBe("America/Bogota");
      expect(aeromax.zona_horaria).toBe("America/Bogota");
      expect(apex.idioma).toBe("es");
      expect(apex.moneda).toBe("COP");
      expect(apex.formato_fecha).toBe("DD/MM/YYYY");
    });

    it("returns different primary colors for apex vs default", () => {
      const apex = getBrandingDefaults("apex");
      const aeromax = getBrandingDefaults(null);
      expect(apex.color_primario).toBe("#2563EB");
      expect(aeromax.color_primario).toBe("#0284c7");
    });

    it("has shared status colors across tenants", () => {
      const apex = getBrandingDefaults("apex");
      const aeromax = getBrandingDefaults(null);
      expect(apex.color_exito).toBe(aeromax.color_exito);
      expect(apex.color_warning).toBe(aeromax.color_warning);
      expect(apex.color_danger).toBe(aeromax.color_danger);
      expect(apex.color_info).toBe(aeromax.color_info);
    });

    it("returns complete BrandingConfig interface fields", () => {
      const config = getBrandingDefaults(null);
      const keys: (keyof BrandingConfig)[] = [
        "nombre_comercial",
        "razon_social",
        "nit",
        "direccion",
        "ciudad",
        "pais",
        "telefono_principal",
        "email_corporativo",
        "web",
        "zona_horaria",
        "idioma",
        "moneda",
        "formato_fecha",
        "formato_hora",
        "separador_decimal",
        "separador_miles",
        "logo_claro_url",
        "logo_oscuro_url",
        "logo_login_url",
        "logo_pdf_url",
        "favicon_url",
        "splash_url",
        "loader_url",
        "icono_movil_url",
        "whatsapp",
        "color_primario",
        "color_secundario",
        "color_exito",
        "color_warning",
        "color_danger",
        "color_info",
        "tipografia_principal",
        "border_radius",
        "sombras",
        "animaciones",
        "firma_url",
        "sello_url",
        "nombre_erp",
        "nombre_portal_cliente",
        "titulo_navegador",
        "landing_video_url",
        "landing_titulo",
        "landing_subtitulo",
        "dossier_url",
        "plantilla_correo_asunto",
        "plantilla_correo_cuerpo",
        "plantilla_pdf_encabezado",
        "plantilla_pdf_pie",
      ];
      for (const key of keys) {
        expect(config).toHaveProperty(key);
        expect(typeof config[key]).toBe("string");
      }
    });

    it("returns ERP name variations per tenant", () => {
      const apex = getBrandingDefaults("apex");
      const aeromax = getBrandingDefaults(null);
      expect(apex.nombre_erp).toBe("Apex ERP");
      expect(aeromax.nombre_erp).toBe("AeroMax ERP Administrador");
    });

    it("returns correct landing video URL", () => {
      const config = getBrandingDefaults(null);
      expect(config.landing_video_url).toBe("/video_hero.mp4");
    });

    it("uses Inter as default typography", () => {
      const config = getBrandingDefaults(null);
      expect(config.tipografia_principal).toBe("Inter");
    });

    it("email template contains placeholder", () => {
      const config = getBrandingDefaults(null);
      expect(config.plantilla_correo_asunto).toContain("{{nombre_comercial}}");
    });
  });
});
