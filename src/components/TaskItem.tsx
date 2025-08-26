import { useDarkMode } from "../contexts/DarkModeContext";
import type { Task } from "../types/Task";
import { getPriorityConfig } from "../utils/taskUtils";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
}) => {
  const { isDarkMode } = useDarkMode();
  const priorityConfig = getPriorityConfig(task.priority);

  const handleToggleComplete = () => {
    onToggleComplete(task.id);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <div
      className={`flex items-center justify-between p-4 border rounded-lg shadow-sm ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          className={`w-5 h-5 text-green-600 rounded focus:ring-green-500 focus:ring-2 cursor-pointer ${
            isDarkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-white border-gray-300"
          }`}
        />

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span
            className={`flex-1 ${
              task.completed
                ? isDarkMode
                  ? "line-through text-gray-400"
                  : "line-through text-gray-500"
                : isDarkMode
                ? "text-gray-200"
                : "text-gray-800"
            }`}
          >
            {task.description}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${priorityConfig.bgColor} ${priorityConfig.textColor} ${priorityConfig.borderColor} border`}
        >
          {task.priority}
        </span>

        <button
          onClick={handleDelete}
          className={`p-1 rounded transition-colors ${
            isDarkMode
              ? "text-gray-400 hover:text-red-400 hover:bg-red-900/20"
              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
          }`}
          title="Delete task"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
