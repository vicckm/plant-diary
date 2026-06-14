import { render, screen } from "@testing-library/react";
import { LogTimeline } from "@/components/LogTimeline";
import type { LogEntry } from "@prisma/client";

function makeLog(overrides: Partial<LogEntry> = {}): LogEntry {
  return {
    id: "log-1",
    plantId: "plant-1",
    type: "WATERING",
    note: null,
    healthStatus: null,
    photoUrl: null,
    createdAt: new Date("2026-06-01T10:00:00Z"),
    ...overrides,
  };
}

describe("LogTimeline", () => {
  it("exibe mensagem de lista vazia quando nao ha logs", () => {
    render(<LogTimeline logs={[]} />);
    expect(screen.getByText(/Nenhum registro ainda/i)).toBeInTheDocument();
  });

  it("renderiza um item de rega", () => {
    render(<LogTimeline logs={[makeLog({ type: "WATERING" })]} />);
    expect(screen.getByText("Rega")).toBeInTheDocument();
  });

  it("renderiza nota de texto quando presente", () => {
    render(<LogTimeline logs={[makeLog({ type: "NOTE", note: "Folhas amareladas" })]} />);
    expect(screen.getByText("Folhas amareladas")).toBeInTheDocument();
  });

  it("exibe badge de saude quando healthStatus presente", () => {
    render(
      <LogTimeline
        logs={[makeLog({ type: "HEALTH", healthStatus: "ATTENTION" })]}
      />,
    );
    expect(screen.getByText(/Aten/i)).toBeInTheDocument();
  });

  it("exibe foto quando photoUrl presente", () => {
    render(
      <LogTimeline logs={[makeLog({ photoUrl: "/uploads/test.jpg" })]} />,
    );
    const img = screen.getByAltText("Foto do registro");
    expect(img).toHaveAttribute("src", "/uploads/test.jpg");
  });

  it("renderiza varios logs na ordem correta", () => {
    const logs = [
      makeLog({ id: "1", type: "WATERING" }),
      makeLog({ id: "2", type: "FERTILIZE" }),
      makeLog({ id: "3", type: "NOTE", note: "Testando" }),
    ];
    render(<LogTimeline logs={logs} />);
    expect(screen.getByText("Rega")).toBeInTheDocument();
    expect(screen.getByText(/Aduba/i)).toBeInTheDocument();
    expect(screen.getByText("Testando")).toBeInTheDocument();
  });

  it("o elemento time tem atributo dateTime", () => {
    render(<LogTimeline logs={[makeLog()]} />);
    const time = document.querySelector("time");
    expect(time).not.toBeNull();
    expect(time?.getAttribute("dateTime")).toBeTruthy();
  });
});
