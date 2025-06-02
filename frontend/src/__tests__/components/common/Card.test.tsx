import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../__tests__/utils/test-utils';
import { Card } from '../../../components/common/Card/Card';

describe('Card Component', () => {
  const mockData = {
    title: 'Test Title',
    infoRows: [
      { label: 'Label 1', value: 'Value 1' },
      { label: 'Label 2', value: 'Value 2' },
    ],
  };

  it('renders with basic props', () => {
    render(<Card {...mockData} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Label 1')).toBeInTheDocument();
    expect(screen.getByText('Value 1')).toBeInTheDocument();
    expect(screen.getByText('Label 2')).toBeInTheDocument();
    expect(screen.getByText('Value 2')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Card {...mockData} onClick={handleClick} />);

    const card = screen.getByRole('article');
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(card).toHaveClass('clickable');
  });

  it('applies custom className', () => {
    render(<Card {...mockData} className="custom-class" />);
    const card = screen.getByRole('article');
    expect(card).toHaveClass('card', 'custom-class');
  });

  it('renders with custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    render(<Card {...mockData} style={customStyle} />);

    const card = screen.getByRole('article');
    expect(card).toHaveStyle('background-color: rgb(255, 0, 0)');
  });

  it('renders with highlighted state', () => {
    render(<Card {...mockData} highlighted />);
    const card = screen.getByRole('article');
    expect(card).toHaveClass('highlighted');
  });

  it('renders with empty info rows', () => {
    render(<Card title="Empty Card" infoRows={[]} />);
    expect(screen.getByText('Empty Card')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders with null values in info rows', () => {
    const dataWithNull = {
      title: 'Test Title',
      infoRows: [
        { label: 'Label 1', value: null },
        { label: 'Label 2', value: 'Value 2' },
      ],
    };

    render(<Card {...dataWithNull} />);
    expect(screen.getByText('Label 2')).toBeInTheDocument();
    expect(screen.getByText('Value 2')).toBeInTheDocument();
    expect(screen.queryByText('Label 1')).not.toBeInTheDocument();
  });

  it('renders with long content', () => {
    const longData = {
      title: 'Very Long Title '.repeat(10).trim(),
      infoRows: [{ label: 'Long Label '.repeat(5).trim(), value: 'Long Value '.repeat(5).trim() }],
    };

    render(<Card {...longData} />);
    expect(screen.getByRole('heading')).toHaveTextContent(longData.title);
    expect(screen.getByText(longData.infoRows[0].label)).toBeInTheDocument();
    expect(screen.getByText(longData.infoRows[0].value)).toBeInTheDocument();
  });

  it('handles keyboard interaction when clickable', () => {
    const handleClick = vi.fn();
    render(<Card {...mockData} onClick={handleClick} />);

    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('tabIndex', '0');

    // Test Enter key
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Test Space key
    fireEvent.keyDown(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);

    // Test other keys (should not trigger click)
    fireEvent.keyDown(card, { key: 'a' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('handles undefined onClick', () => {
    render(<Card {...mockData} />);
    const card = screen.getByRole('article');
    expect(card).not.toHaveClass('clickable');
    expect(card).not.toHaveAttribute('tabIndex');
  });
});
