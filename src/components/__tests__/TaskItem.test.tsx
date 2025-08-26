import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import type { Task } from "../../types/Task";
import { TaskItem } from "../TaskItem";

const mockTask: Task = {
  id: "1",
  description: "Test task",
  priority: "medium",
  completed: false,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

const mockOnToggleComplete = vi.fn();
const mockOnDelete = vi.fn();

const renderWithProvider = (component: React.ReactElement) => {
  return render(<DarkModeProvider>{component}</DarkModeProvider>);
};

describe("TaskItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render task description", () => {
    renderWithProvider(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Test task")).toBeInTheDocument();
  });

  it("should render priority badge", () => {
    renderWithProvider(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("should render delete button", () => {
    renderWithProvider(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTitle("Delete task")).toBeInTheDocument();
  });

  it("should call onToggleComplete when checkbox is clicked", () => {
    renderWithProvider(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockOnToggleComplete).toHaveBeenCalledWith("1");
  });

  it("should call onDelete when delete button is clicked", () => {
    renderWithProvider(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByTitle("Delete task");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });

  it("should show completed task with strikethrough", () => {
    const completedTask = { ...mockTask, completed: true };

    renderWithProvider(
      <TaskItem
        task={completedTask}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const description = screen.getByText("Test task");
    expect(description).toHaveClass("line-through");
  });

  it("should show unchecked checkbox for incomplete task", () => {
    renderWithProvider(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("should show checked checkbox for completed task", () => {
    const completedTask = { ...mockTask, completed: true };

    renderWithProvider(
      <TaskItem
        task={completedTask}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("should render different priority badges correctly", () => {
    const highPriorityTask = { ...mockTask, priority: "high" as const };
    const lowPriorityTask = { ...mockTask, priority: "low" as const };

    const { rerender } = renderWithProvider(
      <TaskItem
        task={highPriorityTask}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("high")).toBeInTheDocument();

    rerender(
      <DarkModeProvider>
        <TaskItem
          task={lowPriorityTask}
          onToggleComplete={mockOnToggleComplete}
          onDelete={mockOnDelete}
        />
      </DarkModeProvider>
    );

    expect(screen.getByText("low")).toBeInTheDocument();
  });
});
