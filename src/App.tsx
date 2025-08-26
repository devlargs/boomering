import { useState, useEffect } from "react";
import type { Task, Priority } from "./types/Task";
import { TaskStatsComponent } from "./components/TaskStats";
import { AddTaskForm } from "./components/AddTaskForm";
import { TaskList } from "./components/TaskList";
import {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
} from "./utils/indexedDB";
import { calculateTaskStats } from "./utils/taskUtils";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedTasks = await getAllTasks();
      setTasks(loadedTasks);
    } catch (err) {
      setError("Failed to load tasks. Please refresh the page.");
      console.error("Error loading tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (description: string, priority: Priority) => {
    try {
      setError(null);
      const newTask = await addTask({
        description,
        priority,
        completed: false,
      });
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (err) {
      setError("Failed to add task. Please try again.");
      console.error("Error adding task:", err);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      setError(null);
      const taskToUpdate = tasks.find((task) => task.id === taskId);
      if (!taskToUpdate) return;

      const updatedTask = {
        ...taskToUpdate,
        completed: !taskToUpdate.completed,
      };
      await updateTask(updatedTask);

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (err) {
      setError("Failed to update task. Please try again.");
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setError(null);
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError("Failed to delete task. Please try again.");
      console.error("Error deleting task:", err);
    }
  };

  const stats = calculateTaskStats(tasks);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">
            Task Manager
          </h1>
          <p className="text-gray-400">
            Organize your tasks efficiently with priority management
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-300 font-medium">{error}</span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <p className="mt-2 text-gray-400">Loading tasks...</p>
          </div>
        ) : (
          <>
            <TaskStatsComponent stats={stats} />

            <AddTaskForm onAddTask={handleAddTask} isLoading={isLoading} />

            <TaskList
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
