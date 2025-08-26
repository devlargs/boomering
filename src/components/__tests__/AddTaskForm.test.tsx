import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { AddTaskForm } from "../AddTaskForm";

const mockOnAddTask = vi.fn();

const renderWithProvider = (component: React.ReactElement) => {
  return render(<DarkModeProvider>{component}</DarkModeProvider>);
};

describe("AddTaskForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render form elements", () => {
    renderWithProvider(<AddTaskForm onAddTask={mockOnAddTask} />);

    expect(screen.getByText("+ Add New Task")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter task description...")
    ).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("should call onAddTask with valid input when form is submitted", async () => {
    renderWithProvider(<AddTaskForm onAddTask={mockOnAddTask} />);

    const input = screen.getByPlaceholderText("Enter task description...");
    const submitButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "New test task" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnAddTask).toHaveBeenCalledWith("New test task", "medium");
    });
  });

  it("should clear form after successful submission", async () => {
    renderWithProvider(<AddTaskForm onAddTask={mockOnAddTask} />);

    const input = screen.getByPlaceholderText("Enter task description...");
    const submitButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "New test task" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  it("should show error for empty description", async () => {
    renderWithProvider(<AddTaskForm onAddTask={mockOnAddTask} />);

    const input = screen.getByPlaceholderText("Enter task description...");
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(
        screen.getByText("Task description is required")
      ).toBeInTheDocument();
    });

    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  it("should show error for description with only whitespace", async () => {
    renderWithProvider(<AddTaskForm onAddTask={mockOnAddTask} />);

    const input = screen.getByPlaceholderText("Enter task description...");

    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(
        screen.getByText("Task description is required")
      ).toBeInTheDocument();
    });

    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  it("should show error for description longer than 200 characters", async () => {
    renderWithProvider(<AddTaskForm onAddTask={mockOnAddTask} />);

    const input = screen.getByPlaceholderText("Enter task description...");
    const submitButton = screen.getByText("Add");
    const longDescription = "a".repeat(201);

    fireEvent.change(input, { target: { value: longDescription } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Task description must be less than 200 characters")
      ).toBeInTheDocument();
    });

    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  it("should submit form when Enter key is pressed", async () => {
    renderWithProvider(<AddTaskForm onAddTask={mockOnAddTask} />);

    const input = screen.getByPlaceholderText("Enter task description...");

    fireEvent.change(input, { target: { value: "New test task" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(mockOnAddTask).toHaveBeenCalledWith("New test task", "medium");
    });
  });

  it("should not submit form when Shift+Enter is pressed", async () => {
    renderWithProvider(<AddTaskForm onAddTask={mockOnAddTask} />);

    const input = screen.getByPlaceholderText("Enter task description...");

    fireEvent.change(input, { target: { value: "New test task" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", shiftKey: true });

    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  it("should disable submit button when description is empty", () => {
    renderWithProvider(<AddTaskForm onAddTask={mockOnAddTask} />);

    const submitButton = screen.getByText("Add");
    expect(submitButton).toBeDisabled();
  });

  it("should enable submit button when description is provided", () => {
    renderWithProvider(<AddTaskForm onAddTask={mockOnAddTask} />);

    const input = screen.getByPlaceholderText("Enter task description...");
    const submitButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "New test task" } });

    expect(submitButton).not.toBeDisabled();
  });

  it("should show loading state when isLoading is true", () => {
    renderWithProvider(
      <AddTaskForm onAddTask={mockOnAddTask} isLoading={true} />
    );

    expect(screen.getByText("Adding...")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter task description...")
    ).toBeDisabled();
  });

  it("should disable submit button when loading", () => {
    renderWithProvider(
      <AddTaskForm onAddTask={mockOnAddTask} isLoading={true} />
    );

    const submitButton = screen.getByText("Adding...");
    expect(submitButton).toBeDisabled();
  });

  it("should trim whitespace from description before submission", async () => {
    renderWithProvider(<AddTaskForm onAddTask={mockOnAddTask} />);

    const input = screen.getByPlaceholderText("Enter task description...");
    const submitButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "  Test task  " } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnAddTask).toHaveBeenCalledWith("Test task", "medium");
    });
  });

  it("should reset priority to medium after submission", async () => {
    renderWithProvider(<AddTaskForm onAddTask={mockOnAddTask} />);

    const input = screen.getByPlaceholderText("Enter task description...");
    const submitButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "Test task" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnAddTask).toHaveBeenCalledWith("Test task", "medium");
    });
  });
});
