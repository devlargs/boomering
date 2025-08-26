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
  const priorityConfig = getPriorityConfig(task.priority);

  const handleToggleComplete = () => {
    onToggleComplete(task.id);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-700 last:border-b-0">
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          className="w-5 h-5 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
        />

        <span
          className={`flex-1 text-gray-100 ${
            task.completed ? "line-through text-gray-500" : ""
          }`}
        >
          {task.description}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${priorityConfig.bgColor} ${priorityConfig.textColor} ${priorityConfig.borderColor} border`}
        >
          {task.priority}
        </span>

        <button
          onClick={handleDelete}
          className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
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
