import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../__tests__/utils/test-utils';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner/LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders with default text', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Please wait" />);
    expect(screen.getByText('Please wait')).toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders with empty text', () => {
    render(<LoadingSpinner text="" />);
    expect(screen.queryByTestId('loading-text')).not.toBeInTheDocument();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('spinner-container')).toHaveClass('loading-spinner-container');
    expect(screen.getByTestId('spinner')).toHaveClass('spinner');
    expect(screen.getByTestId('loading-text')).toHaveClass('loading-text');
  });
}); 