import { render, screen, fireEvent } from "@testing-library/react";
import { PlantImage } from "@/components/PlantImage";

describe("PlantImage", () => {
  it("renderiza a imagem quando src e valido", () => {
    render(<PlantImage src="/uploads/test.jpg" alt="Monstera" />);
    const img = screen.getByRole("img", { name: "Monstera" });
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toMatch(/uploads%2Ftest\.jpg|\/uploads\/test\.jpg/);
  });

  it("exibe fallback emoji quando src e null", () => {
    render(<PlantImage src={null} alt="Samambaia" />);
    expect(screen.getByRole("img", { name: "Samambaia sem foto" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Samambaia" })).toBeNull();
  });

  it("troca para fallback quando a imagem falha ao carregar", () => {
    render(<PlantImage src="/uploads/inexistente.jpg" alt="Suculenta" />);
    const img = screen.getByRole("img", { name: "Suculenta" });
    fireEvent.error(img);
    expect(screen.getByRole("img", { name: "Suculenta sem foto" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Suculenta" })).toBeNull();
  });

  it("usa fallbackLabel personalizado", () => {
    render(<PlantImage src={null} alt="Jurema" fallbackLabel="Planta sem foto" />);
    expect(screen.getByRole("img", { name: "Planta sem foto" })).toBeInTheDocument();
  });
});
