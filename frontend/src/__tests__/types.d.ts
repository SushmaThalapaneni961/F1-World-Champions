import '@testing-library/jest-dom';

declare module '@testing-library/jest-dom/matchers' {
  export interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveClass(className: string): R;
  }
}

declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T> {}
  interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {}
}
