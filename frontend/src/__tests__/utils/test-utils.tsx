import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

interface WrapperProps {
  children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps): React.ReactElement => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

const customRender = (
  ui: ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {}
): ReturnType<typeof render> => {
  return render(ui, {
    wrapper: Wrapper,
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render }; 