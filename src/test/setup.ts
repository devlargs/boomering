import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

Object.defineProperty(window, 'crypto', {
    value: {
        randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
    },
});

Object.defineProperty(window, 'indexedDB', {
    value: {
        open: vi.fn(),
    },
});
