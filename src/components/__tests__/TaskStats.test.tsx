import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import type { TaskStats } from "../../types/Task";
import { TaskStatsComponent } from "../TaskStats";

const renderWithProvider = (component: React.ReactElement) => {
  return render(<DarkModeProvider>{component}</DarkModeProvider>);
};

describe("TaskStatsComponent", () => {
  it("should render stats with correct values", () => {
    const stats: TaskStats = {
      total: 10,
      completed: 6,
      remaining: 4,
    };

    const { container } = renderWithProvider(
      <TaskStatsComponent stats={stats} />
    );

    const sections = container.querySelectorAll(".flex.items-center.gap-2");
    expect(within(sections[0]).getByText("10")).toBeInTheDocument();
    expect(within(sections[1]).getByText("6")).toBeInTheDocument();
    expect(within(sections[2]).getByText("4")).toBeInTheDocument();
  });

  it("should render zero stats correctly", () => {
    const stats: TaskStats = {
      total: 0,
      completed: 0,
      remaining: 0,
    };

    const { container } = renderWithProvider(
      <TaskStatsComponent stats={stats} />
    );

    const sections = container.querySelectorAll(".flex.items-center.gap-2");
    expect(within(sections[0]).getByText("0")).toBeInTheDocument();
    expect(within(sections[1]).getByText("0")).toBeInTheDocument();
    expect(within(sections[2]).getByText("0")).toBeInTheDocument();
  });

  it("should render all completed tasks correctly", () => {
    const stats: TaskStats = {
      total: 5,
      completed: 5,
      remaining: 0,
    };

    const { container } = renderWithProvider(
      <TaskStatsComponent stats={stats} />
    );

    const sections = container.querySelectorAll(".flex.items-center.gap-2");
    expect(within(sections[0]).getByText("5")).toBeInTheDocument();
    expect(within(sections[1]).getByText("5")).toBeInTheDocument();
    expect(within(sections[2]).getByText("0")).toBeInTheDocument();
  });

  it("should render all incomplete tasks correctly", () => {
    const stats: TaskStats = {
      total: 3,
      completed: 0,
      remaining: 3,
    };

    const { container } = renderWithProvider(
      <TaskStatsComponent stats={stats} />
    );

    const sections = container.querySelectorAll(".flex.items-center.gap-2");
    expect(within(sections[0]).getByText("3")).toBeInTheDocument();
    expect(within(sections[1]).getByText("0")).toBeInTheDocument();
    expect(within(sections[2]).getByText("3")).toBeInTheDocument();
  });

  it("should render stat labels correctly", () => {
    const stats: TaskStats = {
      total: 1,
      completed: 1,
      remaining: 0,
    };

    renderWithProvider(<TaskStatsComponent stats={stats} />);

    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Remaining")).toBeInTheDocument();
  });
});
