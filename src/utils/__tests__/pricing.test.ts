import { describe, it, expect } from "vitest";
import {
  estimatePrice,
  BASE_PRICE_BY_SERVICE,
  URGENCY_MULTIPLIERS,
  COP_TO_USD_RATE,
} from "../pricing";

describe("pricing.ts", () => {
  describe("estimatePrice", () => {
    it("returns correct base price for fabricacion service", () => {
      const result = estimatePrice("fabricacion", "baja", 0);
      expect(result.basePriceCop).toBe(1200000);
    });

    it("returns correct base price for venta service", () => {
      const result = estimatePrice("venta", "baja", 0);
      expect(result.basePriceCop).toBe(800000);
    });

    it("returns correct base price for mantenimiento service", () => {
      const result = estimatePrice("mantenimiento", "baja", 0);
      expect(result.basePriceCop).toBe(300000);
    });

    it("returns correct base price for reparacion service", () => {
      const result = estimatePrice("reparacion", "baja", 0);
      expect(result.basePriceCop).toBe(500000);
    });

    it("uses default price for unknown service type", () => {
      const result = estimatePrice("unknown_service", "baja", 0);
      expect(result.basePriceCop).toBe(500000);
    });

    it("applies urgency multiplier for alta urgency (+35%)", () => {
      const result = estimatePrice("fabricacion", "alta", 0);
      expect(result.urgencyMultiplier).toBe(1.35);
      // With 0 volume, subtotal equals base price
      expect(result.estimatedTotalCop).toBe(
        Math.round(1200000 * 1.35)
      );
    });

    it("applies urgency multiplier for media urgency (+10%)", () => {
      const result = estimatePrice("fabricacion", "media", 0);
      expect(result.urgencyMultiplier).toBe(1.1);
    });

    it("applies no urgency multiplier for baja urgency", () => {
      const result = estimatePrice("fabricacion", "baja", 0);
      expect(result.urgencyMultiplier).toBe(1.0);
    });

    it("uses default multiplier for unknown urgency", () => {
      const result = estimatePrice("fabricacion", "desconocida", 0);
      expect(result.urgencyMultiplier).toBe(1.0);
    });

    it("increases price with volume (each 100m³ adds 5%)", () => {
      const zeroVol = estimatePrice("fabricacion", "baja", 0);
      const hundredVol = estimatePrice("fabricacion", "baja", 100);
      const twoHundredVol = estimatePrice("fabricacion", "baja", 200);

      // 100m³: volumeModifier = 1 + (100/100) * 0.05 = 1.05
      expect(hundredVol.subtotalCop).toBe(Math.round(1200000 * 1.05));
      // 200m³: volumeModifier = 1 + (200/100) * 0.05 = 1.10
      expect(twoHundredVol.subtotalCop).toBe(Math.round(1200000 * 1.10));
      // Prices should increase with volume
      expect(hundredVol.estimatedTotalCop).toBeGreaterThan(
        zeroVol.estimatedTotalCop
      );
      expect(twoHundredVol.estimatedTotalCop).toBeGreaterThan(
        hundredVol.estimatedTotalCop
      );
    });

    it("handles zero volume correctly (modifier = 1.0)", () => {
      const result = estimatePrice("venta", "baja", 0);
      // volumeModifier = 1 + max(0, 0/100) * 0.05 = 1.0
      expect(result.subtotalCop).toBe(800000);
    });

    it("handles negative volume (clamped to 0 modifier)", () => {
      const result = estimatePrice("venta", "baja", -50);
      // max(0, -50/100) = 0, so modifier = 1.0
      expect(result.subtotalCop).toBe(800000);
    });

    it("calculates USD conversion correctly", () => {
      const result = estimatePrice("fabricacion", "baja", 0);
      expect(result.estimatedTotalUsd).toBe(
        Math.round((result.estimatedTotalCop / COP_TO_USD_RATE) * 100) / 100
      );
    });

    it("provides ±15% deviation range", () => {
      const result = estimatePrice("fabricacion", "media", 200);
      expect(result.rangeMinCop).toBe(
        Math.round(result.estimatedTotalCop * 0.85)
      );
      expect(result.rangeMaxCop).toBe(
        Math.round(result.estimatedTotalCop * 1.15)
      );
    });

    it("range min is always less than range max", () => {
      const result = estimatePrice("reparacion", "alta", 500);
      expect(result.rangeMinCop).toBeLessThan(result.rangeMaxCop);
      expect(result.rangeMinUsd).toBeLessThan(result.rangeMaxUsd);
    });

    it("returns the COP_TO_USD rate in the result", () => {
      const result = estimatePrice("fabricacion", "baja", 0);
      expect(result.rate).toBe(4000);
    });

    it("combines urgency and volume correctly", () => {
      const result = estimatePrice("fabricacion", "alta", 300);
      // base = 1200000, volumeMod = 1 + 3*0.05 = 1.15, subtotal = 1380000
      // total = 1380000 * 1.35 = 1863000
      expect(result.subtotalCop).toBe(Math.round(1200000 * 1.15));
      expect(result.estimatedTotalCop).toBe(
        Math.round(Math.round(1200000 * 1.15) * 1.35)
      );
    });
  });

  describe("constants", () => {
    it("BASE_PRICE_BY_SERVICE has expected entries", () => {
      expect(BASE_PRICE_BY_SERVICE).toHaveProperty("fabricacion");
      expect(BASE_PRICE_BY_SERVICE).toHaveProperty("venta");
      expect(BASE_PRICE_BY_SERVICE).toHaveProperty("mantenimiento");
      expect(BASE_PRICE_BY_SERVICE).toHaveProperty("reparacion");
      expect(BASE_PRICE_BY_SERVICE).toHaveProperty("default");
    });

    it("URGENCY_MULTIPLIERS has expected entries", () => {
      expect(URGENCY_MULTIPLIERS).toHaveProperty("alta");
      expect(URGENCY_MULTIPLIERS).toHaveProperty("media");
      expect(URGENCY_MULTIPLIERS).toHaveProperty("baja");
      expect(URGENCY_MULTIPLIERS).toHaveProperty("default");
    });

    it("all multipliers are >= 1.0", () => {
      for (const val of Object.values(URGENCY_MULTIPLIERS)) {
        expect(val).toBeGreaterThanOrEqual(1.0);
      }
    });

    it("COP_TO_USD_RATE is 4000", () => {
      expect(COP_TO_USD_RATE).toBe(4000);
    });
  });
});
