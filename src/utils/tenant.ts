export interface TenantConfig {
  name: string;
  primaryColor: string; // HSL value, e.g. "215 80% 50%"
  theme?: "light" | "dark";
}

export const MOCK_TENANTS: Record<string, TenantConfig> = {
  acme: {
    name: "Acme Corporativo",
    primaryColor: "215 80% 50%", // Vibrant Blue
    theme: "light",
  },
  apex: {
    name: "Apex Logística B2B",
    primaryColor: "142 72% 29%", // Forest Green
    theme: "dark",
  },
  default: {
    name: "ERP B2B Premium",
    primaryColor: "240 5.9% 10%", // Default Dark
    theme: "dark",
  },
};

export function getTenantConfig(tenantId?: string | null): TenantConfig {
  if (tenantId && MOCK_TENANTS[tenantId]) {
    return MOCK_TENANTS[tenantId];
  }
  return MOCK_TENANTS.default;
}
