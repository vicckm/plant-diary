import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WaterButton } from "@/components/WaterButton";
import { waterNow } from "@/app/actions";

jest.mock("@/app/actions", () => ({
  waterNow: jest.fn(() => Promise.resolve()),
}));

describe("WaterButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o botao com texto padrao", () => {
    render(<WaterButton plantId="plant-1" />);

    expect(screen.getByRole("button", { name: /Reguei agora/i })).toBeInTheDocument();
  });

  it("chama waterNow com o plantId ao clicar", async () => {
    render(<WaterButton plantId="plant-abc" />);

    await userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(waterNow).toHaveBeenCalledWith("plant-abc");
    });
  });

  it("o botao nao esta desabilitado inicialmente", async () => {
    render(<WaterButton plantId="plant-1" />);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });
});
