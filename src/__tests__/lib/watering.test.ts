import {
  diffInDays,
  lastWateringAt,
  nextWateringAt,
  getWateringInfo,
  wateringStatusLabel,
  needsWaterNow,
} from "@/lib/watering";

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

const plant = (intervalDays = 7, createdDaysAgo = 14) => ({
  wateringIntervalDays: intervalDays,
  createdAt: daysAgo(createdDaysAgo),
});

const wateringLog = (daysBack: number) => ({
  type: "WATERING" as const,
  createdAt: daysAgo(daysBack),
});

const noteLog = (daysBack: number) => ({
  type: "NOTE" as const,
  createdAt: daysAgo(daysBack),
});

// ─── diffInDays ──────────────────────────────────────────────────────────────

describe("diffInDays", () => {
  it("retorna 0 para o mesmo dia", () => {
    const now = new Date();
    expect(diffInDays(now, now)).toBe(0);
  });

  it("retorna positivo quando to > from", () => {
    expect(diffInDays(daysAgo(3), new Date())).toBe(3);
  });

  it("retorna negativo quando to < from", () => {
    expect(diffInDays(new Date(), daysAgo(5))).toBe(-5);
  });
});

// ─── lastWateringAt ───────────────────────────────────────────────────────────

describe("lastWateringAt", () => {
  it("retorna null quando nao ha registros", () => {
    expect(lastWateringAt([])).toBeNull();
  });

  it("ignora logs que nao sao WATERING", () => {
    expect(lastWateringAt([noteLog(2)])).toBeNull();
  });

  it("retorna a rega mais recente quando ha varios registros", () => {
    const logs = [wateringLog(10), wateringLog(3), wateringLog(7)];
    const result = lastWateringAt(logs);
    expect(result).not.toBeNull();
    // result e 3 dias atras; from=result, to=now => positivo 3
    expect(diffInDays(result!, new Date())).toBe(3);
  });
});

// ─── nextWateringAt ───────────────────────────────────────────────────────────

describe("nextWateringAt", () => {
  it("baseia no createdAt quando nunca foi regada", () => {
    const p = plant(7, 10); // criada 10 dias atras, intervalo 7
    const next = nextWateringAt(p, []);
    // createdAt - 10d + 7d = -3d => ja passou
    expect(diffInDays(new Date(), next)).toBe(-3);
  });

  it("baseia na ultima rega quando ha registros", () => {
    const p = plant(7, 30);
    const logs = [wateringLog(2)]; // regada 2 dias atras
    const next = nextWateringAt(p, logs);
    // 2 dias atras + 7 = em 5 dias
    expect(diffInDays(new Date(), next)).toBe(5);
  });
});

// ─── getWateringInfo ──────────────────────────────────────────────────────────

describe("getWateringInfo", () => {
  it("status 'overdue' quando a proxima rega ja passou", () => {
    const p = plant(7, 20); // criada 20 dias atras, nunca regada => proxima ha 13 dias
    const info = getWateringInfo(p, []);
    expect(info.status).toBe("overdue");
    expect(info.daysUntilNext).toBeLessThan(0);
  });

  it("status 'due-today' quando a proxima rega e hoje", () => {
    const p = plant(7, 30);
    const logs = [wateringLog(7)]; // regada exatamente 7 dias atras
    const info = getWateringInfo(p, logs);
    expect(info.status).toBe("due-today");
    expect(info.daysUntilNext).toBe(0);
  });

  it("status 'ok' quando ainda ha dias ate a proxima rega", () => {
    const p = plant(10, 30);
    const logs = [wateringLog(3)]; // regada 3 dias atras, intervalo 10
    const info = getWateringInfo(p, logs);
    expect(info.status).toBe("ok");
    expect(info.daysUntilNext).toBe(7);
  });

  it("lastWateringAt e null quando nunca regada", () => {
    const p = plant(7, 5);
    const info = getWateringInfo(p, []);
    expect(info.lastWateringAt).toBeNull();
  });

  it("lastWateringAt reflete a rega mais recente", () => {
    const p = plant(7, 30);
    const logs = [wateringLog(4)];
    const info = getWateringInfo(p, logs);
    expect(info.lastWateringAt).not.toBeNull();
  });
});

// ─── wateringStatusLabel ──────────────────────────────────────────────────────

describe("wateringStatusLabel", () => {
  const base = {
    nextWateringAt: new Date(),
    lastWateringAt: null,
  };

  it("mostra quantos dias atrasada", () => {
    const label = wateringStatusLabel({ ...base, status: "overdue", daysUntilNext: -3 });
    expect(label).toBe("Atrasada 3 dia(s)");
  });

  it("mostra 'Regar hoje' quando due-today", () => {
    const label = wateringStatusLabel({ ...base, status: "due-today", daysUntilNext: 0 });
    expect(label).toBe("Regar hoje");
  });

  it("mostra quantos dias faltam", () => {
    const label = wateringStatusLabel({ ...base, status: "ok", daysUntilNext: 5 });
    expect(label).toBe("Em 5 dia(s)");
  });
});

// ─── needsWaterNow ────────────────────────────────────────────────────────────

describe("needsWaterNow", () => {
  const base = { nextWateringAt: new Date(), lastWateringAt: null, daysUntilNext: 0 };

  it("retorna true para overdue", () => {
    expect(needsWaterNow({ ...base, status: "overdue" })).toBe(true);
  });

  it("retorna true para due-today", () => {
    expect(needsWaterNow({ ...base, status: "due-today" })).toBe(true);
  });

  it("retorna false para ok", () => {
    expect(needsWaterNow({ ...base, status: "ok" })).toBe(false);
  });
});
