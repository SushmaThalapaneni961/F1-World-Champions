import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../__tests__/utils/test-utils';
import { Error } from '../../../components/common/Error/Error';

describe('Error Component', () => {
  it('renders with default props', () => {
    render(<Error message="Something went wrong" />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    expect(screen.getByTestId('error-icon').closest('.error-container')).toHaveClass('unknown');
  });

  it('renders with custom type', () => {
    render(<Error message="Network error" type="network" />);
    
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    expect(screen.getByTestId('error-icon').closest('.error-container')).toHaveClass('network');
  });

  it('renders with custom icon', () => {
    const customIcon = <span data-testid="custom-icon">🚨</span>;
    render(<Error message="Custom error" icon={customIcon} />);
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByText('🚨')).toBeInTheDocument();
  });

  it('renders with primary action button', () => {
    const handleAction = vi.fn();
    render(
      <Error 
        message="Action error" 
        action={{
          label: 'Retry',
          onClick: handleAction
        }}
      />
    );
    
    const button = screen.getByRole('button', { name: 'Retry' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('error-action', 'primary');
    
    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('renders with secondary action button', () => {
    const handleSecondaryAction = vi.fn();
    render(
      <Error 
        message="Multiple actions" 
        action={{
          label: 'Primary',
          onClick: vi.fn()
        }}
        secondaryAction={{
          label: 'Cancel',
          onClick: handleSecondaryAction
        }}
      />
    );
    
    const primaryButton = screen.getByRole('button', { name: 'Primary' });
    const secondaryButton = screen.getByRole('button', { name: 'Cancel' });
    
    expect(primaryButton).toHaveClass('error-action', 'primary');
    expect(secondaryButton).toHaveClass('error-action', 'secondary');
    
    fireEvent.click(secondaryButton);
    expect(handleSecondaryAction).toHaveBeenCalledTimes(1);
  });

  it('renders with details', () => {
    render(
      <Error 
        message="Error with details" 
        details="More information about the error"
      />
    );
    
    expect(screen.getByText('Error with details')).toBeInTheDocument();
    expect(screen.getByText('More information about the error')).toBeInTheDocument();
  });

  it('renders different icons based on error type', () => {
    const { rerender } = render(<Error message="Network error" type="network" />);
    expect(screen.getByTestId('error-icon').closest('.error-container')).toHaveClass('network');

    rerender(<Error message="Timeout error" type="timeout" />);
    expect(screen.getByTestId('error-icon').closest('.error-container')).toHaveClass('timeout');

    rerender(<Error message="Empty error" type="empty" />);
    expect(screen.getByTestId('error-icon').closest('.error-container')).toHaveClass('empty');

    rerender(<Error message="API error" type="api" />);
    expect(screen.getByTestId('error-icon').closest('.error-container')).toHaveClass('api');
  });

  it('handles undefined action and secondaryAction', () => {
    render(<Error message="Simple error" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles empty details', () => {
    render(<Error message="No details error" />);
    expect(screen.queryByTestId('error-details')).not.toBeInTheDocument();
  });
}); 