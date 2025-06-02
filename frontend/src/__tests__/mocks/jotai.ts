import { vi } from 'vitest';

const mockAtom = vi.fn((initialValue: any) => ({
  init: initialValue,
}));

export { mockAtom as atom }; 