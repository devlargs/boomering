import type { TaskStats } from "../types/Task";

interface TaskStatsProps {
  stats: TaskStats;
}

export const TaskStatsComponent: React.FC<TaskStatsProps> = ({ stats }) => {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-3xl font-bold text-gray-100 mb-1">
            {stats.total}
          </div>
          <div className="text-sm text-gray-400">Total Tasks</div>
        </div>

        <div>
          <div className="text-3xl font-bold text-green-500 mb-1">
            {stats.completed}
          </div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>

        <div>
          <div className="text-3xl font-bold text-blue-500 mb-1">
            {stats.remaining}
          </div>
          <div className="text-sm text-gray-400">Remaining</div>
        </div>
      </div>
    </div>
  );
};
