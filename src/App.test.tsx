import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import * as indexedDB from "./utils/indexedDB";

vi.mock("./utils/indexedDB");

const renderWithProvider = (component: React.ReactElement) => {
  return render(<DarkModeProvider>{component}</DarkModeProvider>);
};

describe("App Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should render app with header and main components", async () => {
    vi.mocked(indexedDB.getAllTasks).mockResolvedValue([]);

    renderWithProvider(<App />);

    expect(screen.getByText("Todo List")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("+ Add New Task")).toBeInTheDocument();
      expect(screen.getByText("Your Tasks")).toBeInTheDocument();
    });
  });

  it("should load and display tasks from IndexedDB", async () => {
    const mockTasks = [
      {
        id: "1",
        description: "Test task 1",
        priority: "high" as const,
        completed: false,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "2",
        description: "Test task 2",
        priority: "medium" as const,
        completed: true,
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
      },
    ];

    vi.mocked(indexedDB.getAllTasks).mockResolvedValue(mockTasks);

    renderWithProvider(<App />);

    await waitFor(() => {
      expect(screen.getByText("Test task 1")).toBeInTheDocument();
      expect(screen.getByText("Test task 2")).toBeInTheDocument();
    });
  });

  it("should show loading state while fetching tasks", () => {
    vi.mocked(indexedDB.getAllTasks).mockImplementation(
      () => new Promise(() => {})
    );

    renderWithProvider(<App />);

    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();
  });

  it("should show error when loading tasks fails", async () => {
    vi.mocked(indexedDB.getAllTasks).mockRejectedValue(
      new Error("Database error")
    );

    renderWithProvider(<App />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load tasks. Please refresh the page.")
      ).toBeInTheDocument();
    });
  });

  it("should add new task successfully", async () => {
    const mockNewTask = {
      id: "new-task-id",
      description: "New task",
      priority: "medium" as const,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(indexedDB.getAllTasks).mockResolvedValue([]);
    vi.mocked(indexedDB.addTask).mockResolvedValue(mockNewTask);

    renderWithProvider(<App />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter task description...")
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Enter task description...");
    const addButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "New task" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(indexedDB.addTask).toHaveBeenCalledWith({
        description: "New task",
        priority: "medium",
        completed: false,
      });
    });

    await waitFor(() => {
      expect(screen.getByText("New task")).toBeInTheDocument();
    });
  });

  it("should toggle task completion status", async () => {
    const mockTasks = [
      {
        id: "1",
        description: "Test task",
        priority: "medium" as const,
        completed: false,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ];

    const updatedTask = { ...mockTasks[0], completed: true };

    vi.mocked(indexedDB.getAllTasks).mockResolvedValue(mockTasks);
    vi.mocked(indexedDB.updateTask).mockResolvedValue(updatedTask);

    renderWithProvider(<App />);

    await waitFor(() => {
      expect(screen.getByText("Test task")).toBeInTheDocument();
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(indexedDB.updateTask).toHaveBeenCalledWith(updatedTask);
    });

    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });

  it("should delete task successfully", async () => {
    const mockTasks = [
      {
        id: "1",
        description: "Test task",
        priority: "medium" as const,
        completed: false,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ];

    vi.mocked(indexedDB.getAllTasks).mockResolvedValue(mockTasks);
    vi.mocked(indexedDB.deleteTask).mockResolvedValue();

    renderWithProvider(<App />);

    await waitFor(() => {
      expect(screen.getByText("Test task")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTitle("Delete task");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(indexedDB.deleteTask).toHaveBeenCalledWith("1");
    });

    await waitFor(() => {
      expect(screen.queryByText("Test task")).not.toBeInTheDocument();
    });
  });

  it("should show error when adding task fails", async () => {
    vi.mocked(indexedDB.getAllTasks).mockResolvedValue([]);
    vi.mocked(indexedDB.addTask).mockRejectedValue(new Error("Add failed"));

    renderWithProvider(<App />);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter task description...")
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Enter task description...");
    const addButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "New task" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to add task. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("should show error when updating task fails", async () => {
    const mockTasks = [
      {
        id: "1",
        description: "Test task",
        priority: "medium" as const,
        completed: false,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ];

    vi.mocked(indexedDB.getAllTasks).mockResolvedValue(mockTasks);
    vi.mocked(indexedDB.updateTask).mockRejectedValue(
      new Error("Update failed")
    );

    renderWithProvider(<App />);

    await waitFor(() => {
      expect(screen.getByText("Test task")).toBeInTheDocument();
    });

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to update task. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("should show error when deleting task fails", async () => {
    const mockTasks = [
      {
        id: "1",
        description: "Test task",
        priority: "medium" as const,
        completed: false,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ];

    vi.mocked(indexedDB.getAllTasks).mockResolvedValue(mockTasks);
    vi.mocked(indexedDB.deleteTask).mockRejectedValue(
      new Error("Delete failed")
    );

    renderWithProvider(<App />);

    await waitFor(() => {
      expect(screen.getByText("Test task")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTitle("Delete task");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to delete task. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("should display task statistics correctly", async () => {
    const mockTasks = [
      {
        id: "1",
        description: "Task 1",
        priority: "high" as const,
        completed: false,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "2",
        description: "Task 2",
        priority: "medium" as const,
        completed: true,
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
      },
      {
        id: "3",
        description: "Task 3",
        priority: "low" as const,
        completed: false,
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-03"),
      },
    ];

    vi.mocked(indexedDB.getAllTasks).mockResolvedValue(mockTasks);

    renderWithProvider(<App />);

    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  it("should show empty state when no tasks exist", async () => {
    vi.mocked(indexedDB.getAllTasks).mockResolvedValue([]);

    renderWithProvider(<App />);

    await waitFor(() => {
      expect(screen.getByText("No tasks yet")).toBeInTheDocument();
      expect(
        screen.getByText("Add your first task to get started!")
      ).toBeInTheDocument();
    });
  });
});
