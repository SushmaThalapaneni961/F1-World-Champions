import { vi } from 'vitest';
import { useNavigate, useParams } from 'react-router-dom';

export const mockMatchMedia = (matches: boolean = false) => {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

export const mockMobileView = () => mockMatchMedia(true);
export const mockDesktopView = () => mockMatchMedia(false);

export const createMockAtomImplementation = (atomValues: Record<string, any>) => {
  return (atom: any) => {
    if (atom in atomValues) {
      return Array.isArray(atomValues[atom]) ? atomValues[atom] : [atomValues[atom]];
    }
    return [null];
  };
};

export const createMockNavigate = () => {
  const mockNavigate = vi.fn();
  (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  return mockNavigate;
};

export const createMockParams = (params: Record<string, string>) => {
  (useParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue(params);
};

export const findTableCell = (container: HTMLElement, text: string) => {
  return container.querySelector(`td:has-text("${text}")`);
};

export const findTableHeader = (container: HTMLElement, text: string) => {
  return container.querySelector(`th:has-text("${text}")`);
};

export const findTableRow = (container: HTMLElement, text: string) => {
  return container.querySelector(`tr:has-text("${text}")`);
}; 