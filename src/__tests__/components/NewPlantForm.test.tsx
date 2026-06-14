import { render, screen, fireEvent } from "@testing-library/react";
import { NewPlantForm } from "@/components/NewPlantForm";
import { createPlant } from "@/app/actions";

jest.mock("@/app/actions", () => ({
  createPlant: jest.fn(),
}));

describe("NewPlantForm", () => {
  it("renderiza todos os campos obrigatorios e opcionais", () => {
    render(<NewPlantForm />);
    expect(screen.getByLabelText(/Nome \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apelido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Especie/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Local/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Regar a cada/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Foto de capa/i)).toBeInTheDocument();
  });

  it("o campo de intervalo de rega tem valor padrao de 7", () => {
    render(<NewPlantForm />);
    const input = screen.getByLabelText(/Regar a cada/i) as HTMLInputElement;
    expect(input.value).toBe("7");
  });

  it("o campo nome e obrigatorio (atributo required)", () => {
    render(<NewPlantForm />);
    const nameInput = screen.getByLabelText(/Nome \*/i);
    expect(nameInput).toBeRequired();
  });

  it("exibe pre-visualizacao da foto ao selecionar arquivo", () => {
    // jsdom nao suporta URL.createObjectURL nativamente; fazemos mock
    global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
    render(<NewPlantForm />);

    const file = new File(["content"], "plant.jpg", { type: "image/jpeg" });
    const input = screen.getByLabelText(/Foto de capa/i);
    fireEvent.change(input, { target: { files: [file] } });

    const preview = screen.getByAltText(/Pré-visualização/i);
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute("src", "blob:mock-url");
  });

  it("nao exibe pre-visualizacao antes de selecionar arquivo", () => {
    render(<NewPlantForm />);
    expect(screen.queryByAltText(/Pré-visualização/i)).toBeNull();
  });

  it("renderiza o botao de submit", () => {
    render(<NewPlantForm />);
    expect(screen.getByRole("button", { name: /Cadastrar planta/i })).toBeInTheDocument();
  });
});
