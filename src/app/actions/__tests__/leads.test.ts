import { describe, it, expect, vi } from "vitest";

// Mock supabase before importing the module
vi.mock("@/utils/supabase", () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({ data: { id: "mock-lead-id" }, error: null })),
        })),
      })),
    })),
  },
}));

vi.mock("@/app/actions", () => ({
  getTenantId: vi.fn(() => Promise.resolve("a0000000-0000-0000-0000-000000000000")),
}));

import { calculateLeadScore } from "../leads";

describe("leads.ts - calculateLeadScore", () => {
  describe("role-based scoring", () => {
    it("gives 40 points for Director de Planta", async () => {
      const result = await calculateLeadScore(
        "test@company.com",
        "Director de Planta",
        "baja"
      );
      // role=40, urgency=5, no penalty = 45
      expect(result.score).toBe(45);
    });

    it("gives 40 points for Gerente de Mantenimiento", async () => {
      const result = await calculateLeadScore(
        "test@company.com",
        "Gerente de Mantenimiento",
        "baja"
      );
      expect(result.score).toBe(45);
    });

    it("gives 40 points for Supervisor de HVAC / Operaciones", async () => {
      const result = await calculateLeadScore(
        "test@company.com",
        "Supervisor de HVAC / Operaciones",
        "baja"
      );
      expect(result.score).toBe(45);
    });

    it("gives 25 points for Ingeniero de Proyectos", async () => {
      const result = await calculateLeadScore(
        "test@company.com",
        "Ingeniero de Proyectos",
        "baja"
      );
      // role=25, urgency=5 = 30
      expect(result.score).toBe(30);
    });

    it("gives 25 points for Compras / Abastecimiento", async () => {
      const result = await calculateLeadScore(
        "test@company.com",
        "Compras / Abastecimiento",
        "baja"
      );
      expect(result.score).toBe(30);
    });

    it("gives 10 points for unknown/other roles", async () => {
      const result = await calculateLeadScore(
        "test@company.com",
        "Otro",
        "baja"
      );
      // role=10, urgency=5 = 15
      expect(result.score).toBe(15);
    });
  });

  describe("urgency-based scoring", () => {
    it("gives 40 points for alta urgency", async () => {
      const result = await calculateLeadScore(
        "test@company.com",
        "Otro",
        "alta"
      );
      // role=10, urgency=40 = 50
      expect(result.score).toBe(50);
    });

    it("gives 20 points for media urgency", async () => {
      const result = await calculateLeadScore(
        "test@company.com",
        "Otro",
        "media"
      );
      // role=10, urgency=20 = 30
      expect(result.score).toBe(30);
    });

    it("gives 5 points for baja urgency", async () => {
      const result = await calculateLeadScore(
        "test@company.com",
        "Otro",
        "baja"
      );
      // role=10, urgency=5 = 15
      expect(result.score).toBe(15);
    });
  });

  describe("email domain scoring", () => {
    it("penalizes gmail.com by -20 points", async () => {
      const corporate = await calculateLeadScore(
        "user@company.com",
        "Director de Planta",
        "media"
      );
      const gmail = await calculateLeadScore(
        "user@gmail.com",
        "Director de Planta",
        "media"
      );
      // corporate: role=40, urgency=20 = 60; gmail: 60-20 = 40
      expect(corporate.score).toBe(60);
      expect(gmail.score).toBe(40);
    });

    it("penalizes yahoo.com by -20 points", async () => {
      const result = await calculateLeadScore(
        "user@yahoo.com",
        "Otro",
        "media"
      );
      // role=10, urgency=20, penalty=-20 = 10
      expect(result.score).toBe(10);
    });

    it("penalizes outlook.com by -20 points", async () => {
      const result = await calculateLeadScore(
        "user@outlook.com",
        "Otro",
        "baja"
      );
      // role=10, urgency=5, penalty=-20 = -5, clamped to 0
      expect(result.score).toBe(0);
    });

    it("penalizes hotmail.com", async () => {
      const result = await calculateLeadScore(
        "user@hotmail.com",
        "Otro",
        "baja"
      );
      expect(result.score).toBe(0); // clamped
    });

    it("does not penalize corporate emails", async () => {
      const result = await calculateLeadScore(
        "user@aeromax.co",
        "Ingeniero de Proyectos",
        "alta"
      );
      // role=25, urgency=40, no penalty = 65
      expect(result.score).toBe(65);
    });
  });

  describe("risk level classification", () => {
    it("classifies CALIENTE for score >= 70", async () => {
      const result = await calculateLeadScore(
        "user@company.com",
        "Director de Planta",
        "alta"
      );
      // role=40, urgency=40 = 80
      expect(result.score).toBe(80);
      expect(result.riskLevel).toBe("CALIENTE");
    });

    it("classifies TIBIO for score 40-69", async () => {
      const result = await calculateLeadScore(
        "user@company.com",
        "Director de Planta",
        "baja"
      );
      // role=40, urgency=5 = 45
      expect(result.score).toBe(45);
      expect(result.riskLevel).toBe("TIBIO");
    });

    it("classifies FRIO for score < 40", async () => {
      const result = await calculateLeadScore(
        "user@company.com",
        "Otro",
        "baja"
      );
      // role=10, urgency=5 = 15
      expect(result.score).toBe(15);
      expect(result.riskLevel).toBe("FRIO");
    });

    it("classifies SPAM for disposable email domains", async () => {
      const result = await calculateLeadScore(
        "user@yopmail.com",
        "Director de Planta",
        "alta"
      );
      expect(result.score).toBe(0);
      expect(result.riskLevel).toBe("SPAM");
    });

    it("classifies SPAM for mailinator.com", async () => {
      const result = await calculateLeadScore(
        "user@mailinator.com",
        "Director de Planta",
        "alta"
      );
      expect(result.riskLevel).toBe("SPAM");
      expect(result.score).toBe(0);
    });

    it("classifies SPAM for tempmail.com", async () => {
      const result = await calculateLeadScore(
        "user@tempmail.com",
        "Otro",
        "media"
      );
      expect(result.riskLevel).toBe("SPAM");
    });

    it("classifies SPAM for emails shorter than 5 characters", async () => {
      const result = await calculateLeadScore(
        "a@b",
        "Director de Planta",
        "alta"
      );
      expect(result.riskLevel).toBe("SPAM");
      expect(result.score).toBe(0);
    });

    it("classifies SPAM for emails without @", async () => {
      const result = await calculateLeadScore(
        "noemail",
        "Director de Planta",
        "alta"
      );
      expect(result.riskLevel).toBe("SPAM");
      expect(result.score).toBe(0);
    });
  });

  describe("score boundaries", () => {
    it("score never exceeds 100", async () => {
      const result = await calculateLeadScore(
        "user@company.com",
        "Director de Planta",
        "alta"
      );
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it("score never goes below 0", async () => {
      const result = await calculateLeadScore(
        "user@outlook.com",
        "Otro",
        "baja"
      );
      // role=10, urgency=5, penalty=-20 = -5, but clamped to 0
      expect(result.score).toBeGreaterThanOrEqual(0);
    });

    it("exact boundary at 70 is CALIENTE", async () => {
      // role=40 (Director) + urgency=40 (alta) - penalty=20 (gmail) = 60 -> TIBIO
      // role=25 (Ingeniero) + urgency=40 (alta) + no penalty = 65 -> TIBIO
      // role=40 (Director) + urgency=40 (alta) = 80 -> CALIENTE
      const result = await calculateLeadScore(
        "user@company.com",
        "Director de Planta",
        "alta"
      );
      // 80 >= 70 -> CALIENTE
      expect(result.riskLevel).toBe("CALIENTE");
    });

    it("score of exactly 40 is TIBIO", async () => {
      // role=40 (Director) + urgency=20 (media) - penalty=20 (gmail) = 40
      const result = await calculateLeadScore(
        "user@gmail.com",
        "Director de Planta",
        "media"
      );
      // 40 >= 40 -> TIBIO
      expect(result.score).toBe(40);
      expect(result.riskLevel).toBe("TIBIO");
    });
  });
});
