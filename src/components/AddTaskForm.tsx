import { useState, useEffect, useRef } from "react";
import type { Priority } from "../types/Task";
import { validateTask } from "../utils/taskUtils";
import Dropdown from "./Dropdown";
import type { DropdownOption } from "./Dropdown";

interface AddTaskFormProps {
  onAddTask: (description: string, priority: Priority) => void;
  isLoading?: boolean;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onAddTask,
  isLoading = false,
}) => {
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
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
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
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors placeholder-gray-400"
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
            className="px-6 py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
        </div>

        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-700">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};
