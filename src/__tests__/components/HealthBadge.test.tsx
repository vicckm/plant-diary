import { render, screen } from "@testing-library/react";
import { HealthBadge } from "@/components/HealthBadge";

describe("HealthBadge", () => {
  it("exibe 'Saudavel' e emoji correto para HEALTHY", () => {
    render(<HealthBadge status="HEALTHY" />);
    expect(screen.getByText(/Saud/i)).toBeInTheDocument();
    expect(screen.getByText("✅")).toBeInTheDocument();
  });

  it("exibe 'Atencao' e emoji correto para ATTENTION", () => {
    render(<HealthBadge status="ATTENTION" />);
    expect(screen.getByText(/Aten/i)).toBeInTheDocument();
    expect(screen.getByText("⚠️")).toBeInTheDocument();
  });

  it("exibe 'Doente' e emoji correto para SICK", () => {
    render(<HealthBadge status="SICK" />);
    expect(screen.getByText(/Doente/i)).toBeInTheDocument();
    expect(screen.getByText("🚑")).toBeInTheDocument();
  });
});
