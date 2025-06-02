import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../__tests__/utils/test-utils';
import { Button } from '../../../components/common/Button/Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('button', 'primary');
  });

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: /secondary/i });
    expect(button).toHaveClass('button', 'secondary');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with left icon', () => {
    render(
      <Button icon={<span data-testid="test-icon">icon</span>} iconPosition="left">
        With Icon
      </Button>,
    );

    const icon = screen.getByTestId('test-icon');
    const button = screen.getByRole('button', { name: /with icon/i });

    expect(icon).toBeInTheDocument();
    expect(button).toHaveClass('with-icon');
    expect(button.firstElementChild).toContainElement(icon);
  });

  it('renders with right icon', () => {
    render(
      <Button icon={<span data-testid="test-icon">icon</span>} iconPosition="right">
        With Icon
      </Button>,
    );

    const icon = screen.getByTestId('test-icon');
    const button = screen.getByRole('button', { name: /with icon/i });

    expect(icon).toBeInTheDocument();
    expect(button).toHaveClass('with-icon');
    expect(button.lastElementChild).toContainElement(icon);
  });

  it('applies additional className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button', { name: /custom/i });
    expect(button).toHaveClass('custom-class');
  });
});
