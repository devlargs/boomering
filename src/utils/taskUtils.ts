import type { Task, TaskStats, SortOption, Priority } from '../types/Task';

export const calculateTaskStats = (tasks: Task[]): TaskStats => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const remaining = total - completed;

    return { total, completed, remaining };
};

export const sortTasks = (tasks: Task[], sortBy: SortOption): Task[] => {
    const sortedTasks = [...tasks];

    switch (sortBy) {
        case 'priority': {
            const priorityOrder: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
            return sortedTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        }

        case 'name':
            return sortedTasks.sort((a, b) => a.description.localeCompare(b.description));

        case 'created':
        default:
            return sortedTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
};

export const getPriorityConfig = (priority: Priority) => {
    const configs = {
        low: {
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-700',
            dotColor: 'bg-blue-500',
            borderColor: 'border-blue-200',
        },
        medium: {
            bgColor: 'bg-green-100',
            textColor: 'text-green-700',
            dotColor: 'bg-green-500',
            borderColor: 'border-green-200',
        },
        high: {
            bgColor: 'bg-red-100',
            textColor: 'text-red-700',
            dotColor: 'bg-red-500',
            borderColor: 'border-red-200',
        },
    };

    return configs[priority];
};

export const getSortOptionText = (sortBy: SortOption): string => {
    const options = {
        created: 'Sort by Created',
        priority: 'Sort by Priority',
        name: 'Sort by Name',
    };

    return options[sortBy];
};

export const validateTask = (description: string, priority: Priority): string | null => {
    if (!description.trim()) {
        return 'Task description is required';
    }

    if (description.trim().length > 200) {
        return 'Task description must be less than 200 characters';
    }

    if (!['low', 'medium', 'high'].includes(priority)) {
        return 'Invalid priority level';
    }

    return null;
};
