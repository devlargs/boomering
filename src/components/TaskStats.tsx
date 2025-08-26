import { useDarkMode } from "../contexts/DarkModeContext";
import type { TaskStats } from "../types/Task";

interface TaskStatsProps {
  stats: TaskStats;
}

export const TaskStatsComponent: React.FC<TaskStatsProps> = ({ stats }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
        <div className="flex items-center gap-2">
          <span
            className={`text-2xl font-bold ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {stats.total}
          </span>
          <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
            Total Tasks
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-green-600">
            {stats.completed}
          </span>
          <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
            Completed
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-2xl font-bold ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {stats.remaining}
          </span>
          <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
            Remaining
          </span>
        </div>
      </div>
    </div>
  );
};
