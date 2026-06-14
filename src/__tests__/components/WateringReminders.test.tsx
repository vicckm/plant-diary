import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WateringReminders } from "@/components/WateringReminders";
import type { ReminderPlant } from "@/components/WateringReminders";

const overdueP: ReminderPlant = { id: "1", name: "Monstera", label: "Atrasada 3 dia(s)", overdue: true };
const dueTodayP: ReminderPlant = { id: "2", name: "Samambaia", label: "Regar hoje", overdue: false };

function mockNotification(options?: {
  permission?: NotificationPermission;
  requestPermission?: jest.Mock<Promise<NotificationPermission>>;
}) {
  const permission = options?.permission ?? "default";
  const requestPermission =
    options?.requestPermission ??
    jest.fn<Promise<NotificationPermission>, []>(() => Promise.resolve(permission));

  class MockNotification {
    static permission = permission;
    static requestPermission = requestPermission;

    constructor(_title: string, _options?: NotificationOptions) {}
  }

  Object.defineProperty(window, "Notification", {
    writable: true,
    configurable: true,
    value: MockNotification,
  });

  return { requestPermission, MockNotification };
}

describe("WateringReminders", () => {
  beforeEach(() => {
    mockNotification();
  });

  it("exibe mensagem positiva quando lista esta vazia", () => {
    render(<WateringReminders plants={[]} />);

    expect(screen.getByText(/Tudo em dia/i)).toBeInTheDocument();
  });

  it("exibe aviso com contagem de plantas que precisam de agua", () => {
    render(<WateringReminders plants={[overdueP, dueTodayP]} />);

    expect(screen.getByText(/2 planta\(s\) precisam de/i)).toBeInTheDocument();
  });

  it("exibe links para cada planta", () => {
    render(<WateringReminders plants={[overdueP, dueTodayP]} />);

    expect(screen.getByRole("link", { name: /Monstera/i })).toHaveAttribute(
      "href",
      "/plants/1",
    );

    expect(screen.getByRole("link", { name: /Samambaia/i })).toHaveAttribute(
      "href",
      "/plants/2",
    );
  });

  it("exibe botao de ativar notificacoes quando permissao e 'default'", () => {
    render(<WateringReminders plants={[overdueP]} />);

    expect(
      screen.getByRole("button", { name: /Ativar notifica/i }),
    ).toBeInTheDocument();
  });

  it("solicita permissao ao clicar no botao de notificacoes", async () => {
    const requestPermission = jest.fn<Promise<NotificationPermission>, []>(() =>
      Promise.resolve("granted"),
    );
    mockNotification({ requestPermission });

    render(<WateringReminders plants={[overdueP]} />);
    await userEvent.click(screen.getByRole("button", { name: /Ativar notifica/i }));

    await waitFor(() => {
      expect(requestPermission).toHaveBeenCalledTimes(1);
    });
  });

  it("exibe aviso quando notificacoes estao bloqueadas", () => {
    mockNotification({ permission: "denied" });
    render(<WateringReminders plants={[overdueP]} />);

    expect(screen.getByText(/bloqueadas/i)).toBeInTheDocument();
  });

  it("o aside de alerta tem aria-label", () => {
    render(<WateringReminders plants={[overdueP]} />);

    expect(screen.getByRole("complementary", { name: /Lembretes de rega/i })).toBeInTheDocument();
  });

  it("o aside de estado positivo tem role=status", () => {
    render(<WateringReminders plants={[]} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
