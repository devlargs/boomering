export type Priority = 'low' | 'medium' | 'high';

export type SortOption = 'created' | 'priority' | 'name';

export interface Task {
    id: string;
    description: string;
    priority: Priority;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface TaskStats {
    total: number;
    completed: number;
    remaining: number;
}
