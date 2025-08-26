import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import type { Task } from "../../types/Task";
import { TaskList } from "../TaskList";

const mockTasks: Task[] = [
  {
    id: "1",
    description: "First task",
    priority: "high",
    completed: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    description: "Second task",
    priority: "medium",
    completed: true,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    description: "Third task",
    priority: "low",
    completed: false,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
];

const mockOnToggleComplete = vi.fn();
const mockOnDelete = vi.fn();

const renderWithProvider = (component: React.ReactElement) => {
  return render(<DarkModeProvider>{component}</DarkModeProvider>);
};

describe("TaskList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render task list title", () => {
    renderWithProvider(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Your Tasks")).toBeInTheDocument();
  });

  it("should render sort dropdown", () => {
    renderWithProvider(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Date Created")).toBeInTheDocument();
  });

  it("should render all tasks", () => {
    renderWithProvider(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("First task")).toBeInTheDocument();
    expect(screen.getByText("Second task")).toBeInTheDocument();
    expect(screen.getByText("Third task")).toBeInTheDocument();
  });

  it("should render empty state when no tasks", () => {
    renderWithProvider(
      <TaskList
        tasks={[]}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
    expect(
      screen.getByText("Add your first task to get started!")
    ).toBeInTheDocument();
  });

  it("should call onToggleComplete when task checkbox is clicked", () => {
    renderWithProvider(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    // With "created" (desc) sort, the newest task is first -> id "3"
    fireEvent.click(checkboxes[0]);

    expect(mockOnToggleComplete).toHaveBeenCalledWith("3");
  });

  it("should call onDelete when task delete button is clicked", () => {
    renderWithProvider(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByTitle("Delete task");
    // First row corresponds to newest task id "3"
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith("3");
  });

  it("should render priority badges for all tasks", () => {
    renderWithProvider(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("high")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
    expect(screen.getByText("low")).toBeInTheDocument();
  });

  it("should show completed tasks with strikethrough", () => {
    renderWithProvider(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const completedTask = screen.getByText("Second task");
    expect(completedTask).toHaveClass("line-through");
  });

  it("should show correct checkbox states", () => {
    renderWithProvider(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    // Order: Third (false), Second (true), First (false)
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it("should render sort options in dropdown", () => {
    renderWithProvider(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const sortButton = screen.getByText("Date Created");
    fireEvent.click(sortButton);

    // Use getAllByText to avoid collision between selection and option label
    expect(screen.getAllByText("Date Created").length).toBeGreaterThan(0);
    expect(screen.getByText("Priority")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("should sort tasks by priority when priority option is selected", () => {
    renderWithProvider(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const sortButton = screen.getByText("Date Created");
    fireEvent.click(sortButton);

    const priorityOption = screen.getByText("Priority");
    fireEvent.click(priorityOption);

    const taskElements = screen.getAllByText(/task$/);
    expect(taskElements[0]).toHaveTextContent("First task");
  });

  it("should sort tasks by name when name option is selected", () => {
    renderWithProvider(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const sortButton = screen.getByText("Date Created");
    fireEvent.click(sortButton);

    const nameOption = screen.getByText("Name");
    fireEvent.click(nameOption);

    const taskElements = screen.getAllByText(/task$/);
    expect(taskElements[0]).toHaveTextContent("First task");
  });

  it("should close dropdown when clicking outside", () => {
    renderWithProvider(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const sortButton = screen.getByText("Date Created");
    fireEvent.click(sortButton);

    expect(screen.getAllByText("Date Created").length).toBeGreaterThan(0);

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText("Priority")).not.toBeInTheDocument();
    expect(screen.queryByText("Name")).not.toBeInTheDocument();
  });

  it("should apply dark mode styles", () => {
    renderWithProvider(
      <TaskList
        tasks={mockTasks}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const title = screen.getByText("Your Tasks");
    expect(title).toHaveClass("text-gray-200");
  });
});
