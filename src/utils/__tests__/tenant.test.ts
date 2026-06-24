import { describe, it, expect } from "vitest";
import {
  getTenantConfig,
  parseToHslChannels,
  formatColorForDb,
  MOCK_TENANTS,
} from "../tenant";

describe("tenant.ts", () => {
  describe("getTenantConfig", () => {
    it("returns acme config for 'acme' tenant", () => {
      const config = getTenantConfig("acme");
      expect(config.name).toBe("AeroMax Industrial");
      expect(config.primaryColor).toBe("199 89% 48%");
    });

    it("returns apex config for 'apex' tenant", () => {
      const config = getTenantConfig("apex");
      expect(config.name).toBe("Apex Logística B2B");
      expect(config.primaryColor).toBe("142 72% 29%");
    });

    it("returns default config for null tenant", () => {
      const config = getTenantConfig(null);
      expect(config.name).toBe("AeroMax Industrial");
      expect(config.primaryColor).toBe("240 5.9% 10%");
    });

    it("returns default config for undefined tenant", () => {
      const config = getTenantConfig(undefined);
      expect(config.name).toBe("AeroMax Industrial");
    });

    it("returns default config for unknown tenant id", () => {
      const config = getTenantConfig("nonexistent_tenant");
      expect(config).toEqual(MOCK_TENANTS.default);
    });

    it("returns ventitech config same as acme", () => {
      const ventitech = getTenantConfig("ventitech");
      const acme = getTenantConfig("acme");
      expect(ventitech.name).toBe(acme.name);
      expect(ventitech.primaryColor).toBe(acme.primaryColor);
    });
  });

  describe("parseToHslChannels", () => {
    it("returns already-formatted HSL channels as-is", () => {
      expect(parseToHslChannels("199 89% 48%")).toBe("199 89% 48%");
    });

    it("parses hsl() functional notation", () => {
      expect(parseToHslChannels("hsl(210, 50%, 40%)")).toBe("210 50% 40%");
    });

    it("parses hsla() with alpha", () => {
      expect(parseToHslChannels("hsla(120, 60%, 70%, 0.5)")).toBe(
        "120 60% 70%"
      );
    });

    it("converts 6-digit hex to HSL channels", () => {
      // #ff0000 is pure red = hsl(0, 100%, 50%)
      const result = parseToHslChannels("#ff0000");
      expect(result).toBe("0 100% 50%");
    });

    it("converts 3-digit hex to HSL channels", () => {
      // #f00 = #ff0000 = hsl(0, 100%, 50%)
      const result = parseToHslChannels("#f00");
      expect(result).toBe("0 100% 50%");
    });

    it("converts white hex correctly", () => {
      // #ffffff = hsl(0, 0%, 100%)
      const result = parseToHslChannels("#ffffff");
      expect(result).toBe("0 0% 100%");
    });

    it("converts black hex correctly", () => {
      // #000000 = hsl(0, 0%, 0%)
      const result = parseToHslChannels("#000000");
      expect(result).toBe("0 0% 0%");
    });

    it("converts a medium blue hex", () => {
      // #0000ff = pure blue = hsl(240, 100%, 50%)
      const result = parseToHslChannels("#0000ff");
      expect(result).toBe("240 100% 50%");
    });

    it("converts green hex", () => {
      // #00ff00 = pure green = hsl(120, 100%, 50%)
      const result = parseToHslChannels("#00ff00");
      expect(result).toBe("120 100% 50%");
    });

    it("returns fallback for unsupported format", () => {
      expect(parseToHslChannels("rgb(255, 0, 0)")).toBe("240 5.9% 10%");
      expect(parseToHslChannels("not-a-color")).toBe("240 5.9% 10%");
    });

    it("handles whitespace trimming", () => {
      expect(parseToHslChannels("  199 89% 48%  ")).toBe("199 89% 48%");
    });
  });

  describe("formatColorForDb", () => {
    it("converts space-separated HSL channels to hsl() format", () => {
      expect(formatColorForDb("199 89% 48%")).toBe("hsl(199, 89%, 48%)");
    });

    it("converts another HSL channels value", () => {
      expect(formatColorForDb("240 100% 50%")).toBe("hsl(240, 100%, 50%)");
    });

    it("returns non-channel formats unchanged", () => {
      expect(formatColorForDb("hsl(199, 89%, 48%)")).toBe(
        "hsl(199, 89%, 48%)"
      );
      expect(formatColorForDb("#ff0000")).toBe("#ff0000");
    });

    it("handles whitespace trimming", () => {
      expect(formatColorForDb("  142 72% 29%  ")).toBe("hsl(142, 72%, 29%)");
    });
  });

  describe("MOCK_TENANTS", () => {
    it("contains expected tenant keys", () => {
      expect(MOCK_TENANTS).toHaveProperty("acme");
      expect(MOCK_TENANTS).toHaveProperty("apex");
      expect(MOCK_TENANTS).toHaveProperty("ventitech");
      expect(MOCK_TENANTS).toHaveProperty("default");
    });

    it("all tenants have required fields", () => {
      for (const [, config] of Object.entries(MOCK_TENANTS)) {
        expect(config).toHaveProperty("name");
        expect(config).toHaveProperty("primaryColor");
        expect(typeof config.name).toBe("string");
        expect(typeof config.primaryColor).toBe("string");
      }
    });
  });
});
