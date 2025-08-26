import { useState, useEffect, useRef } from "react";
import type { Task, SortOption } from "../types/Task";
import { TaskItem } from "./TaskItem";
import { sortTasks } from "../utils/taskUtils";
import Dropdown from "./Dropdown";
import type { DropdownOption } from "./Dropdown";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onDelete,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>("created");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions: DropdownOption[] = [
    { value: "created", label: "Date Created" },
    { value: "priority", label: "Priority" },
    { value: "name", label: "Name" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const sortedTasks = sortTasks(tasks, sortBy);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Your Tasks</h2>

        <div ref={dropdownRef}>
          <Dropdown
            options={sortOptions}
            value={sortBy}
            onChange={(value) => setSortBy(value as SortOption)}
            isOpen={isDropdownOpen}
            onToggle={toggleDropdown}
            placeholder="Sort by"
            className="w-48"
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-lg font-medium">No tasks yet</p>
            <p className="text-sm">Add your first task to get started!</p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};
