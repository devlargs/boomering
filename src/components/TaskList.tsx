import { useState } from "react";
import type { Task, SortOption } from "../types/Task";
import { TaskItem } from "./TaskItem";
import { sortTasks, getSortOptionText } from "../utils/taskUtils";

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

  const sortedTasks = sortTasks(tasks, sortBy);

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Your Tasks</h2>

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-600 text-gray-100 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <span>{getSortOptionText(sortBy)}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
              {(["created", "priority", "name"] as SortOption[]).map(
                (option) => (
                  <button
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                      sortBy === option
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "text-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{getSortOptionText(option)}</span>
                      {sortBy === option && (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              )}
            </div>
          )}
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
