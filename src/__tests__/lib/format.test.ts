import {
  formatDateTime,
  formatDate,
  LOG_TYPE_LABELS,
  LOG_TYPE_EMOJI,
  HEALTH_STATUS_LABELS,
} from "@/lib/format";

describe("Format utilities", () => {
  describe("formatDateTime", () => {
    it("formats a Date object correctly", () => {
      const date = new Date("2024-06-12T00:00:00");
      const result = formatDateTime(date);
      // Result should be in pt-BR format with date
      expect(result).toMatch(/12/);
      expect(result).toMatch(/jun/);
      expect(result).toMatch(/2024/);
      expect(result).toMatch(/:/); // Has time
    });

    it("formats a date string correctly", () => {
      const dateString = "2024-06-12T00:00:00";
      const result = formatDateTime(dateString);
      expect(result).toMatch(/12.*jun.*2024/);
    });

    it("includes time in formatted output", () => {
      const date = new Date("2024-06-12T14:30:00");
      const result = formatDateTime(date);
      expect(result).toMatch(/:/); // Has time separator
    });

    it("handles different dates correctly", () => {
      const date = new Date("2024-01-01T00:00:00");
      const result = formatDateTime(date);
      expect(result).toMatch(/01.*jan.*2024/);
    });
  });

  describe("formatDate", () => {
    it("formats a Date object without time", () => {
      const date = new Date("2024-06-12T14:30:00");
      const result = formatDate(date);
      // Should include date but focus on format consistency
      expect(result).toMatch(/12/);
      expect(result).toMatch(/jun/);
      expect(result).toMatch(/2024/);
    });

    it("formats a date string without extensive time", () => {
      const dateString = "2024-06-12T14:30:00";
      const result = formatDate(dateString);
      expect(result).toMatch(/12.*jun.*2024/);
    });

    it("handles different dates correctly", () => {
      const date = new Date("2024-12-25T10:00:00");
      const result = formatDate(date);
      expect(result).toMatch(/25/);
      expect(result).toMatch(/dez/);
      expect(result).toMatch(/2024/);
    });

    it("formatDate and formatDateTime both include date", () => {
      const date = new Date("2024-06-12T14:30:00");
      const dateResult = formatDate(date);
      const dateTimeResult = formatDateTime(date);
      
      // Both should have the date
      expect(dateResult).toMatch(/12.*jun.*2024/);
      expect(dateTimeResult).toMatch(/12.*jun.*2024/);
    });
  });

  describe("LOG_TYPE_LABELS", () => {
    it("has labels for all log types", () => {
      expect(LOG_TYPE_LABELS.WATERING).toBe("Rega");
      expect(LOG_TYPE_LABELS.HEALTH).toBe("Saúde");
      expect(LOG_TYPE_LABELS.NOTE).toBe("Anotação");
      expect(LOG_TYPE_LABELS.FERTILIZE).toBe("Adubação");
    });

    it("has all required types", () => {
      expect(Object.keys(LOG_TYPE_LABELS)).toHaveLength(4);
      expect(Object.keys(LOG_TYPE_LABELS)).toContain("WATERING");
      expect(Object.keys(LOG_TYPE_LABELS)).toContain("HEALTH");
      expect(Object.keys(LOG_TYPE_LABELS)).toContain("NOTE");
      expect(Object.keys(LOG_TYPE_LABELS)).toContain("FERTILIZE");
    });
  });

  describe("LOG_TYPE_EMOJI", () => {
    it("has emojis for all log types", () => {
      expect(LOG_TYPE_EMOJI.WATERING).toBe("💧");
      expect(LOG_TYPE_EMOJI.HEALTH).toBe("🩺");
      expect(LOG_TYPE_EMOJI.NOTE).toBe("📝");
      expect(LOG_TYPE_EMOJI.FERTILIZE).toBe("🌱");
    });

    it("has all required types", () => {
      expect(Object.keys(LOG_TYPE_EMOJI)).toHaveLength(4);
    });

    it("all emojis are non-empty strings", () => {
      Object.values(LOG_TYPE_EMOJI).forEach((emoji) => {
        expect(typeof emoji).toBe("string");
        expect(emoji.length).toBeGreaterThan(0);
      });
    });
  });

  describe("HEALTH_STATUS_LABELS", () => {
    it("has labels for all health statuses", () => {
      expect(HEALTH_STATUS_LABELS.HEALTHY).toBe("Saudável");
      expect(HEALTH_STATUS_LABELS.ATTENTION).toBe("Atenção");
      expect(HEALTH_STATUS_LABELS.SICK).toBe("Doente");
    });

    it("has all required statuses", () => {
      expect(Object.keys(HEALTH_STATUS_LABELS)).toHaveLength(3);
      expect(Object.keys(HEALTH_STATUS_LABELS)).toContain("HEALTHY");
      expect(Object.keys(HEALTH_STATUS_LABELS)).toContain("ATTENTION");
      expect(Object.keys(HEALTH_STATUS_LABELS)).toContain("SICK");
    });
  });
});
