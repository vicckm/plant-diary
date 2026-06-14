import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/StatusBadge";
import type { WateringInfo } from "@/lib/watering";

const base: WateringInfo = {
  nextWateringAt: new Date(),
  lastWateringAt: null,
  daysUntilNext: 0,
  status: "ok",
};

describe("StatusBadge", () => {
  it("exibe 'Regar hoje' para status due-today", () => {
    render(<StatusBadge info={{ ...base, status: "due-today", daysUntilNext: 0 }} />);
    expect(screen.getByText("Regar hoje")).toBeInTheDocument();
  });

  it("exibe dias atrasados para status overdue", () => {
    render(<StatusBadge info={{ ...base, status: "overdue", daysUntilNext: -2 }} />);
    expect(screen.getByText("Atrasada 2 dia(s)")).toBeInTheDocument();
  });

  it("exibe dias restantes para status ok", () => {
    render(<StatusBadge info={{ ...base, status: "ok", daysUntilNext: 4 }} />);
    expect(screen.getByText("Em 4 dia(s)")).toBeInTheDocument();
  });

  it("o emoji de agua e aria-hidden", () => {
    render(<StatusBadge info={{ ...base, status: "ok", daysUntilNext: 1 }} />);
    const emoji = screen.getByText("💧");
    expect(emoji).toHaveAttribute("aria-hidden");
  });
});
