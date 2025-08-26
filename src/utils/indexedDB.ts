import type { Task } from '../types/Task';

const DB_NAME = 'TaskManagerDB';
const DB_VERSION = 1;
const STORE_NAME = 'tasks';

export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            reject(new Error('Failed to open database'));
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('createdAt', 'createdAt', { unique: false });
                store.createIndex('priority', 'priority', { unique: false });
                store.createIndex('completed', 'completed', { unique: false });
            }
        };
    });
};

export const getAllTasks = async (): Promise<Task[]> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onerror = () => {
            reject(new Error('Failed to get tasks'));
        };

        request.onsuccess = () => {
            const tasks = request.result.map((task: Record<string, unknown>) => ({
                ...task,
                createdAt: new Date(task.createdAt as string),
                updatedAt: new Date(task.updatedAt as string),
            })) as Task[];
            resolve(tasks);
        };
    });
};

export const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const newTask: Task = {
            ...task,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const request = store.add(newTask);

        request.onerror = () => {
            reject(new Error('Failed to add task'));
        };

        request.onsuccess = () => {
            resolve(newTask);
        };
    });
};

export const updateTask = async (task: Task): Promise<Task> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const updatedTask: Task = {
            ...task,
            updatedAt: new Date(),
        };

        const request = store.put(updatedTask);

        request.onerror = () => {
            reject(new Error('Failed to update task'));
        };

        request.onsuccess = () => {
            resolve(updatedTask);
        };
    });
};

export const deleteTask = async (taskId: string): Promise<void> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(taskId);

        request.onerror = () => {
            reject(new Error('Failed to delete task'));
        };

        request.onsuccess = () => {
            resolve();
        };
    });
};

export const clearAllTasks = async (): Promise<void> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onerror = () => {
            reject(new Error('Failed to clear tasks'));
        };

        request.onsuccess = () => {
            resolve();
        };
    });
};
