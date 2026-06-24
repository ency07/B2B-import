import { describe, it, expect } from "vitest";
import {
  getAchForEnvironment,
  calculateAirDensity,
  generateEngineeringReport,
  calculateRequiredCfm,
  ACH_BY_ENVIRONMENT,
  CRITICALITY_BY_ENVIRONMENT,
} from "../engineering";

describe("engineering.ts", () => {
  describe("getAchForEnvironment", () => {
    it("returns correct ACH for heavy_plant", () => {
      expect(getAchForEnvironment("heavy_plant")).toBe(45);
    });

    it("returns correct ACH for data_center", () => {
      expect(getAchForEnvironment("data_center")).toBe(30);
    });

    it("returns correct ACH for warehouse", () => {
      expect(getAchForEnvironment("warehouse")).toBe(8);
    });

    it("returns correct ACH for fundicion", () => {
      expect(getAchForEnvironment("fundicion")).toBe(45);
    });

    it("returns correct ACH for mecanico", () => {
      expect(getAchForEnvironment("mecanico")).toBe(20);
    });

    it("returns correct ACH for alimentos", () => {
      expect(getAchForEnvironment("alimentos")).toBe(15);
    });

    it("returns default ACH for unknown environments", () => {
      expect(getAchForEnvironment("unknown")).toBe(10);
      expect(getAchForEnvironment("")).toBe(10);
    });
  });

  describe("calculateAirDensity", () => {
    it("returns standard density at sea level and 20°C", () => {
      const density = calculateAirDensity(0, 20);
      expect(density).toBeCloseTo(1.204, 2);
    });

    it("decreases density at higher altitudes", () => {
      const seaLevel = calculateAirDensity(0, 20);
      const bogota = calculateAirDensity(2640, 20); // Bogotá altitude
      expect(bogota).toBeLessThan(seaLevel);
    });

    it("decreases density at higher temperatures", () => {
      const cold = calculateAirDensity(0, 10);
      const hot = calculateAirDensity(0, 40);
      expect(hot).toBeLessThan(cold);
    });

    it("returns reasonable value for Bogotá conditions (2640m, 14°C)", () => {
      const density = calculateAirDensity(2640, 14);
      // Expected ~0.9 kg/m³ at Bogotá altitude
      expect(density).toBeGreaterThan(0.8);
      expect(density).toBeLessThan(1.1);
    });
  });

  describe("generateEngineeringReport", () => {
    it("calculates correct volume in cubic meters", () => {
      const report = generateEngineeringReport(
        { length: 10, width: 5, height: 3 },
        "default",
        0,
        20,
        false
      );
      expect(report.cubicMeters).toBe(150);
    });

    it("converts cubic meters to cubic feet correctly", () => {
      const report = generateEngineeringReport(
        { length: 10, width: 10, height: 5 },
        "default",
        0,
        20,
        false
      );
      // 500 m³ * 35.3147 = 17657.35
      expect(report.cubicFeet).toBeCloseTo(17657.35, 0);
    });

    it("applies pollutant factor for heavy_plant environment", () => {
      const normalReport = generateEngineeringReport(
        { length: 10, width: 10, height: 5 },
        "warehouse",
        0,
        20,
        false
      );
      const heavyReport = generateEngineeringReport(
        { length: 10, width: 10, height: 5 },
        "heavy_plant",
        0,
        20,
        false
      );
      // heavy_plant has ACH=45 and pollutant factor 1.3 vs warehouse ACH=8 and factor 1.0
      // The ratio should reflect both ACH difference AND pollutant factor
      expect(heavyReport.cfm).toBeGreaterThan(normalReport.cfm);
    });

    it("returns zero CFM for zero-volume dimensions", () => {
      const report = generateEngineeringReport(
        { length: 0, width: 10, height: 5 },
        "default",
        0,
        20,
        false
      );
      expect(report.cfm).toBe(0);
      expect(report.cubicMeters).toBe(0);
    });

    it("handles negative dimensions by clamping volume to zero", () => {
      const report = generateEngineeringReport(
        { length: -5, width: 10, height: 3 },
        "default",
        0,
        20,
        false
      );
      expect(report.cubicMeters).toBe(0);
      expect(report.cfm).toBe(0);
    });

    it("uses higher static pressure when ducts are present", () => {
      const noDucts = generateEngineeringReport(
        { length: 20, width: 10, height: 5 },
        "warehouse",
        0,
        20,
        false
      );
      const withDucts = generateEngineeringReport(
        { length: 20, width: 10, height: 5 },
        "warehouse",
        0,
        20,
        true
      );
      expect(noDucts.staticPressure).toBe(0.5);
      expect(withDucts.staticPressure).toBe(1.5);
    });

    it("calculates equipment count based on CFM / 7500", () => {
      const report = generateEngineeringReport(
        { length: 50, width: 30, height: 10 },
        "heavy_plant",
        0,
        20,
        false
      );
      // 15000 m³ * 35.3147 = 529720.5 ft³; ACH=45; CFM = (529720.5 * 45 / 60) * 1.3 ≈ 516478
      // eqCount = ceil(516478 / 7500) = 69
      expect(report.eqCount).toBeGreaterThan(0);
      expect(report.eqCount).toBe(Math.ceil(report.cfm / 7500));
    });

    it("generates mixed distribution for heavy_plant/data_center", () => {
      const report = generateEngineeringReport(
        { length: 20, width: 10, height: 5 },
        "data_center",
        0,
        20,
        false
      );
      expect(report.distribution).toContain("Inyectores");
      expect(report.distribution).toContain("Extractores tipo Hongo");
    });

    it("generates axial distribution for warehouse/default", () => {
      const report = generateEngineeringReport(
        { length: 20, width: 10, height: 5 },
        "warehouse",
        0,
        20,
        false
      );
      expect(report.distribution).toContain("Extractores Axiales Murales");
    });

    it("assigns correct criticality by environment", () => {
      const heavyReport = generateEngineeringReport(
        { length: 10, width: 10, height: 5 },
        "heavy_plant",
        0,
        20,
        false
      );
      expect(heavyReport.criticality).toBe("ALTA");

      const warehouseReport = generateEngineeringReport(
        { length: 10, width: 10, height: 5 },
        "warehouse",
        0,
        20,
        false
      );
      expect(warehouseReport.criticality).toBe("BAJA");
    });

    it("calculates power in HP and kW correctly", () => {
      const report = generateEngineeringReport(
        { length: 20, width: 10, height: 5 },
        "warehouse",
        0,
        20,
        false
      );
      // HP = (CFM * SP) / 6356
      const expectedHp = Number(
        ((report.cfm * report.staticPressure) / 6356).toFixed(1)
      );
      expect(report.powerHp).toBe(expectedHp);
      // kW = HP * 0.746 / 0.94
      const expectedKw = Number(((expectedHp * 0.746) / 0.94).toFixed(1));
      expect(report.powerKw).toBe(expectedKw);
    });

    it("calculates noise based on equipment count", () => {
      const report = generateEngineeringReport(
        { length: 20, width: 10, height: 5 },
        "warehouse",
        0,
        20,
        false
      );
      if (report.eqCount > 0) {
        const expectedNoise = Math.round(68 + 10 * Math.log10(report.eqCount));
        expect(report.noiseDba).toBe(expectedNoise);
      }
    });

    it("provides investment ranges in COP and USD", () => {
      const report = generateEngineeringReport(
        { length: 20, width: 10, height: 5 },
        "warehouse",
        0,
        20,
        false
      );
      expect(report.investmentRangeMinCop).toBeLessThan(
        report.investmentRangeMaxCop
      );
      expect(report.investmentRangeMinUsd).toBeLessThan(
        report.investmentRangeMaxUsd
      );
      // USD should be COP / 4000
      expect(report.investmentRangeMinUsd).toBe(
        Math.round(report.investmentRangeMinCop / 4000)
      );
    });
  });

  describe("calculateRequiredCfm", () => {
    it("returns cfm, cubicMeters, cubicFeet, and ach", () => {
      const result = calculateRequiredCfm(
        { length: 10, width: 5, height: 3 },
        "default"
      );
      expect(result).toHaveProperty("cfm");
      expect(result).toHaveProperty("cubicMeters");
      expect(result).toHaveProperty("cubicFeet");
      expect(result).toHaveProperty("ach");
    });

    it("uses altitude=0, temp=20, hasDucts=false as defaults", () => {
      const result = calculateRequiredCfm(
        { length: 10, width: 5, height: 3 },
        "warehouse"
      );
      const fullReport = generateEngineeringReport(
        { length: 10, width: 5, height: 3 },
        "warehouse",
        0,
        20,
        false
      );
      expect(result.cfm).toBe(fullReport.cfm);
      expect(result.cubicMeters).toBe(fullReport.cubicMeters);
    });

    it("works correctly for mining environment (maps to default ACH)", () => {
      const result = calculateRequiredCfm(
        { length: 15, width: 10, height: 4 },
        "mining"
      );
      // mining is not in ACH_BY_ENVIRONMENT, so defaults to 10
      expect(result.ach).toBe(10);
    });
  });

  describe("constants", () => {
    it("ACH_BY_ENVIRONMENT contains all expected environments", () => {
      const keys = Object.keys(ACH_BY_ENVIRONMENT);
      expect(keys).toContain("heavy_plant");
      expect(keys).toContain("data_center");
      expect(keys).toContain("warehouse");
      expect(keys).toContain("default");
    });

    it("CRITICALITY_BY_ENVIRONMENT maps correctly", () => {
      expect(CRITICALITY_BY_ENVIRONMENT["heavy_plant"]).toBe("ALTA");
      expect(CRITICALITY_BY_ENVIRONMENT["data_center"]).toBe("ALTA");
      expect(CRITICALITY_BY_ENVIRONMENT["warehouse"]).toBe("BAJA");
      expect(CRITICALITY_BY_ENVIRONMENT["mecanico"]).toBe("MEDIA");
    });
  });
});
