import { render, screen, fireEvent } from "@testing-library/react";
import { AddLogForm } from "@/components/AddLogForm";

jest.mock("@/app/actions", () => ({
  addLog: jest.fn(() => Promise.resolve()),
}));

describe("AddLogForm", () => {
  it("renderiza os 4 tipos de registro como opcoes de radio", () => {
    render(<AddLogForm plantId="p1" />);
    expect(screen.getByRole("radio", { name: /Rega/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Sa/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Anota/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Aduba/i })).toBeInTheDocument();
  });

  it("o tipo 'Rega' esta selecionado por padrao", () => {
    render(<AddLogForm plantId="p1" />);
    expect(screen.getByRole("radio", { name: /Rega/i })).toBeChecked();
  });

  it("os tipos sao agrupados em fieldset com legend", () => {
    render(<AddLogForm plantId="p1" />);
    expect(screen.getByRole("group", { name: /Tipo de registro/i })).toBeInTheDocument();
  });

  it("nao exibe select de saude quando tipo nao e HEALTH", () => {
    render(<AddLogForm plantId="p1" />);
    expect(screen.queryByLabelText(/Estado de sa/i)).toBeNull();
  });

  it("exibe select de saude quando tipo HEALTH e selecionado", () => {
    render(<AddLogForm plantId="p1" />);
    fireEvent.click(screen.getByRole("radio", { name: /Sa/i }));
    expect(screen.getByLabelText(/Estado de sa/i)).toBeInTheDocument();
  });

  it("select de saude contem as 3 opcoes", () => {
    render(<AddLogForm plantId="p1" />);
    fireEvent.click(screen.getByRole("radio", { name: /Sa/i }));
    expect(screen.getByRole("option", { name: /Saud/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Aten/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Doente/i })).toBeInTheDocument();
  });

  it("renderiza campo de anotacao e upload de foto", () => {
    render(<AddLogForm plantId="p1" />);
    expect(screen.getByRole("textbox", { name: /Anotacao/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Foto/i)).toBeInTheDocument();
  });

  it("renderiza botao de submit", () => {
    render(<AddLogForm plantId="p1" />);
    expect(screen.getByRole("button", { name: /Adicionar registro/i })).toBeInTheDocument();
  });

  it("altera o tipo selecionado ao clicar em outro radio", () => {
    render(<AddLogForm plantId="p1" />);
    fireEvent.click(screen.getByRole("radio", { name: /Aduba/i }));
    expect(screen.getByRole("radio", { name: /Aduba/i })).toBeChecked();
    expect(screen.getByRole("radio", { name: /Rega/i })).not.toBeChecked();
  });
});
