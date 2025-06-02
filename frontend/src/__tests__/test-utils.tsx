import { render } from '@testing-library/react';
import { Provider } from 'jotai';

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    wrapper: ({ children }) => <Provider>{children}</Provider>,
    ...options,
  });

export * from '@testing-library/react';
export { customRender as render };
