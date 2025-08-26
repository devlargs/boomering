import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Task } from '../../types/Task';
import {
    addTask,
    clearAllTasks,
    deleteTask,
    getAllTasks,
    initDB,
    updateTask
} from '../indexedDB';

const mockTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
    description: 'Test task',
    priority: 'medium',
    completed: false,
};

const mockFullTask: Task = {
    id: 'test-uuid-123',
    description: 'Test task',
    priority: 'medium',
    completed: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
};

describe('IndexedDB Utils', () => {
    let mockIndexedDB: any;
    let mockDB: any;
    let mockTransaction: any;
    let mockStore: any;

    beforeEach(() => {
        mockStore = {
            getAll: vi.fn(),
            add: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            clear: vi.fn(),
        };

        mockTransaction = {
            objectStore: vi.fn().mockReturnValue(mockStore),
        };

        mockDB = {
            transaction: vi.fn().mockReturnValue(mockTransaction),
            objectStoreNames: {
                contains: vi.fn().mockReturnValue(true),
            },
        };

        mockIndexedDB = {
            open: vi.fn(),
        };

        if (!window.indexedDB) {
            Object.defineProperty(window, 'indexedDB', {
                value: mockIndexedDB,
                writable: true,
                configurable: true,
            });
        } else {
            Object.assign(window.indexedDB, mockIndexedDB);
        }

        if (!window.crypto) {
            Object.defineProperty(window, 'crypto', {
                value: {
                    randomUUID: () => 'test-uuid-123',
                },
                writable: true,
                configurable: true,
            });
        } else {
            Object.assign(window.crypto, {
                randomUUID: () => 'test-uuid-123',
            });
        }
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('initDB', () => {
        it('should initialize database successfully', async () => {
            const openRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
                onupgradeneeded: vi.fn(),
                result: mockDB,
            };

            mockIndexedDB.open.mockReturnValue(openRequest);

            setTimeout(() => {
                openRequest.onsuccess();
            }, 0);

            const result = await initDB();
            expect(result).toBe(mockDB);
        });

        it('should handle database initialization error', async () => {
            const openRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
                onupgradeneeded: vi.fn(),
            };

            mockIndexedDB.open.mockReturnValue(openRequest);

            setTimeout(() => {
                openRequest.onerror();
            }, 0);

            await expect(initDB()).rejects.toThrow('Failed to open database');
        });
    });

    describe('getAllTasks', () => {
        it('should retrieve all tasks successfully', async () => {
            const mockTasks = [
                {
                    ...mockFullTask,
                    createdAt: mockFullTask.createdAt.toISOString(),
                    updatedAt: mockFullTask.updatedAt.toISOString(),
                },
            ];

            const storeRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
                result: mockTasks,
            };

            const openRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
                result: mockDB,
            };
            mockIndexedDB.open.mockReturnValue(openRequest);

            mockStore.getAll.mockReturnValue(storeRequest);

            setTimeout(() => {
                openRequest.onsuccess();
                setTimeout(() => {
                    storeRequest.onsuccess();
                }, 0);
            }, 0);

            const result = await getAllTasks();
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('test-uuid-123');
            expect(result[0].createdAt).toBeInstanceOf(Date);
            expect(result[0].updatedAt).toBeInstanceOf(Date);
        });

        it('should handle getAllTasks error', async () => {
            const storeRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
            };

            const openRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
                result: mockDB,
            };
            mockIndexedDB.open.mockReturnValue(openRequest);

            mockStore.getAll.mockReturnValue(storeRequest);

            setTimeout(() => {
                openRequest.onsuccess();
                setTimeout(() => {
                    storeRequest.onerror();
                }, 0);
            }, 0);

            await expect(getAllTasks()).rejects.toThrow('Failed to get tasks');
        });
    });

    describe('addTask', () => {
        it('should add task successfully', async () => {
            const expectedTask = {
                ...mockTask,
                id: 'test-uuid-123',
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            };

            const storeRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
            };

            const openRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
                result: mockDB,
            };
            mockIndexedDB.open.mockReturnValue(openRequest);

            mockStore.add.mockReturnValue(storeRequest);

            setTimeout(() => {
                openRequest.onsuccess();
                setTimeout(() => {
                    storeRequest.onsuccess();
                }, 0);
            }, 0);

            const result = await addTask(mockTask);
            expect(result).toMatchObject(expectedTask);
            expect(mockStore.add).toHaveBeenCalledWith(expectedTask);
        });

        it('should handle addTask error', async () => {
            const storeRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
            };

            const openRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
                result: mockDB,
            };
            mockIndexedDB.open.mockReturnValue(openRequest);

            mockStore.add.mockReturnValue(storeRequest);

            setTimeout(() => {
                openRequest.onsuccess();
                setTimeout(() => {
                    storeRequest.onerror();
                }, 0);
            }, 0);

            await expect(addTask(mockTask)).rejects.toThrow('Failed to add task');
        });
    });

    describe('updateTask', () => {
        it('should update task successfully', async () => {
            const updatedTask = {
                ...mockFullTask,
                completed: true,
                updatedAt: expect.any(Date),
            };

            const storeRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
            };

            const openRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
                result: mockDB,
            };
            mockIndexedDB.open.mockReturnValue(openRequest);

            mockStore.put.mockReturnValue(storeRequest);

            setTimeout(() => {
                openRequest.onsuccess();
                setTimeout(() => {
                    storeRequest.onsuccess();
                }, 0);
            }, 0);

            const result = await updateTask({ ...mockFullTask, completed: true });
            expect(result).toMatchObject(updatedTask);
            expect(mockStore.put).toHaveBeenCalledWith(updatedTask);
        });

        it('should handle updateTask error', async () => {
            const storeRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
            };

            const openRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
                result: mockDB,
            };
            mockIndexedDB.open.mockReturnValue(openRequest);

            mockStore.put.mockReturnValue(storeRequest);

            setTimeout(() => {
                openRequest.onsuccess();
                setTimeout(() => {
                    storeRequest.onerror();
                }, 0);
            }, 0);

            await expect(updateTask(mockFullTask)).rejects.toThrow('Failed to update task');
        });
    });

    describe('deleteTask', () => {
        it('should delete task successfully', async () => {
            const storeRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
            };

            const openRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
                result: mockDB,
            };
            mockIndexedDB.open.mockReturnValue(openRequest);

            mockStore.delete.mockReturnValue(storeRequest);

            setTimeout(() => {
                openRequest.onsuccess();
                setTimeout(() => {
                    storeRequest.onsuccess();
                }, 0);
            }, 0);

            await expect(deleteTask('test-uuid-123')).resolves.toBeUndefined();
            expect(mockStore.delete).toHaveBeenCalledWith('test-uuid-123');
        });

        it('should handle deleteTask error', async () => {
            const storeRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
            };

            const openRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
                result: mockDB,
            };
            mockIndexedDB.open.mockReturnValue(openRequest);

            mockStore.delete.mockReturnValue(storeRequest);

            setTimeout(() => {
                openRequest.onsuccess();
                setTimeout(() => {
                    storeRequest.onerror();
                }, 0);
            }, 0);

            await expect(deleteTask('test-uuid-123')).rejects.toThrow('Failed to delete task');
        });
    });

    describe('clearAllTasks', () => {
        it('should clear all tasks successfully', async () => {
            const storeRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
            };

            const openRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
                result: mockDB,
            };
            mockIndexedDB.open.mockReturnValue(openRequest);

            mockStore.clear.mockReturnValue(storeRequest);

            setTimeout(() => {
                openRequest.onsuccess();
                setTimeout(() => {
                    storeRequest.onsuccess();
                }, 0);
            }, 0);

            await expect(clearAllTasks()).resolves.toBeUndefined();
            expect(mockStore.clear).toHaveBeenCalled();
        });

        it('should handle clearAllTasks error', async () => {
            const storeRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
            };

            const openRequest = {
                onerror: vi.fn(),
                onsuccess: vi.fn(),
                result: mockDB,
            };
            mockIndexedDB.open.mockReturnValue(openRequest);

            mockStore.clear.mockReturnValue(storeRequest);

            setTimeout(() => {
                openRequest.onsuccess();
                setTimeout(() => {
                    storeRequest.onerror();
                }, 0);
            }, 0);

            await expect(clearAllTasks()).rejects.toThrow('Failed to clear tasks');
        });
    });
});
