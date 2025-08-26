import { describe, expect, it } from 'vitest';
import type { Priority, SortOption, Task } from '../../types/Task';
import {
    calculateTaskStats,
    getPriorityConfig,
    sortTasks,
    validateTask
} from '../taskUtils';

const mockTasks: Task[] = [
    {
        id: '1',
        description: 'High priority task',
        priority: 'high',
        completed: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: '2',
        description: 'Medium priority task',
        priority: 'medium',
        completed: true,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
    },
    {
        id: '3',
        description: 'Low priority task',
        priority: 'low',
        completed: false,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
    },
];

describe('calculateTaskStats', () => {
    it('should calculate correct stats for empty tasks array', () => {
        const stats = calculateTaskStats([]);
        expect(stats).toEqual({
            total: 0,
            completed: 0,
            remaining: 0,
        });
    });

    it('should calculate correct stats for tasks with mixed completion status', () => {
        const stats = calculateTaskStats(mockTasks);
        expect(stats).toEqual({
            total: 3,
            completed: 1,
            remaining: 2,
        });
    });

    it('should calculate correct stats for all completed tasks', () => {
        const completedTasks = mockTasks.map(task => ({ ...task, completed: true }));
        const stats = calculateTaskStats(completedTasks);
        expect(stats).toEqual({
            total: 3,
            completed: 3,
            remaining: 0,
        });
    });
});

describe('sortTasks', () => {
    it('should sort by priority correctly', () => {
        const sorted = sortTasks(mockTasks, 'priority');
        expect(sorted[0].priority).toBe('high');
        expect(sorted[1].priority).toBe('medium');
        expect(sorted[2].priority).toBe('low');
    });

    it('should sort by name alphabetically', () => {
        const sorted = sortTasks(mockTasks, 'name');
        expect(sorted[0].description).toBe('High priority task');
        expect(sorted[1].description).toBe('Low priority task');
        expect(sorted[2].description).toBe('Medium priority task');
    });

    it('should sort by creation date (newest first)', () => {
        const sorted = sortTasks(mockTasks, 'created');
        expect(sorted[0].id).toBe('3');
        expect(sorted[1].id).toBe('2');
        expect(sorted[2].id).toBe('1');
    });

    it('should default to created sort when invalid option provided', () => {
        const sorted = sortTasks(mockTasks, 'invalid' as SortOption);
        expect(sorted[0].id).toBe('3');
    });
});

describe('getPriorityConfig', () => {
    it('should return correct config for low priority', () => {
        const config = getPriorityConfig('low');
        expect(config).toEqual({
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-700',
            dotColor: 'bg-blue-500',
            borderColor: 'border-blue-200',
        });
    });

    it('should return correct config for medium priority', () => {
        const config = getPriorityConfig('medium');
        expect(config).toEqual({
            bgColor: 'bg-green-100',
            textColor: 'text-green-700',
            dotColor: 'bg-green-500',
            borderColor: 'border-green-200',
        });
    });

    it('should return correct config for high priority', () => {
        const config = getPriorityConfig('high');
        expect(config).toEqual({
            bgColor: 'bg-red-100',
            textColor: 'text-red-700',
            dotColor: 'bg-red-500',
            borderColor: 'border-red-200',
        });
    });
});

describe('validateTask', () => {
    it('should return null for valid task', () => {
        const result = validateTask('Valid task description', 'medium');
        expect(result).toBeNull();
    });

    it('should return error for empty description', () => {
        const result = validateTask('', 'medium');
        expect(result).toBe('Task description is required');
    });

    it('should return error for whitespace-only description', () => {
        const result = validateTask('   ', 'medium');
        expect(result).toBe('Task description is required');
    });

    it('should return error for description longer than 200 characters', () => {
        const longDescription = 'a'.repeat(201);
        const result = validateTask(longDescription, 'medium');
        expect(result).toBe('Task description must be less than 200 characters');
    });

    it('should return error for invalid priority', () => {
        const result = validateTask('Valid description', 'invalid' as Priority);
        expect(result).toBe('Invalid priority level');
    });

    it('should accept all valid priority levels', () => {
        expect(validateTask('Valid description', 'low')).toBeNull();
        expect(validateTask('Valid description', 'medium')).toBeNull();
        expect(validateTask('Valid description', 'high')).toBeNull();
    });
});
