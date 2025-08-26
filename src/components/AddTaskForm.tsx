import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import type { Priority } from "../types/Task";
import { validateTask } from "../utils/taskUtils";
import type { DropdownOption } from "./Dropdown";
import Dropdown from "./Dropdown";

interface AddTaskFormProps {
  onAddTask: (description: string, priority: Priority) => void;
  isLoading?: boolean;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onAddTask,
  isLoading = false,
}) => {
  const { isDarkMode } = useDarkMode();
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [error, setError] = useState<string | null>(null);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const priorityOptions: DropdownOption[] = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsPriorityDropdownOpen(false);
      }
    };

    if (isPriorityDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPriorityDropdownOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    const validationError = validateTask(description, priority);
    if (validationError) {
      setError(validationError);
      return;
    }

    onAddTask(description.trim(), priority);

    setDescription("");
    setPriority("medium");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const togglePriorityDropdown = () => {
    setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
  };

  return (
    <div className="mb-6">
      <h2
        className={`text-xl font-semibold mb-4 ${
          isDarkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        + Add New Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter task description..."
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
              }`}
              disabled={isLoading}
            />
          </div>

          <div className="w-32" ref={dropdownRef}>
            <Dropdown
              options={priorityOptions}
              value={priority}
              onChange={(value) => setPriority(value as Priority)}
              isOpen={isPriorityDropdownOpen}
              onToggle={togglePriorityDropdown}
              placeholder="Priority"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !description.trim()}
            className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
        </div>

        {error && (
          <div
            className={`text-sm p-3 rounded-lg border ${
              isDarkMode
                ? "text-red-400 bg-red-900/20 border-red-700"
                : "text-red-600 bg-red-50 border-red-200"
            }`}
          >
            {error}
          </div>
        )}
      </form>
    </div>
  );
};
