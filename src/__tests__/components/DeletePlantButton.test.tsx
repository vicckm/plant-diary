import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeletePlantButton } from "@/components/DeletePlantButton";
import { deletePlant } from "@/app/actions";

jest.mock("@/app/actions", () => ({
  deletePlant: jest.fn(() => Promise.resolve()),
}));

describe("DeletePlantButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o botao com texto 'Excluir'", async () => {
    render(<DeletePlantButton plantId="plant-1" />);

    expect(await screen.findByText(/Excluir/i)).toBeInTheDocument();
  });

  it("nao chama deletePlant sem confirmacao do usuario", async () => {
    window.confirm = jest.fn(() => false);

    render(<DeletePlantButton plantId="plant-1" />);

    await userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(deletePlant).not.toHaveBeenCalled();
    });
  });

  it("chama deletePlant quando usuario confirma", async () => {
    window.confirm = jest.fn(() => true);

    render(<DeletePlantButton plantId="plant-xyz" />);

    await userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(deletePlant).toHaveBeenCalledWith("plant-xyz");
    });
  });

  it("exibe o dialogo de confirmacao correto", async () => {
    window.confirm = jest.fn(() => false);

    render(<DeletePlantButton plantId="plant-1" />);

    await userEvent.click(screen.getByRole("button"));

    expect(window.confirm).toHaveBeenCalledWith(
      "Excluir esta planta e todos os registros?",
    );
  });
});
