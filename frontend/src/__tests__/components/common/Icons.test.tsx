import { describe, it, expect } from 'vitest';
import { render } from '../../../__tests__/utils/test-utils';
import { ArrowLeft } from '../../../components/common/Icons/Icons';

describe('Icons Components', () => {
  describe('ArrowLeft Icon', () => {
    it('renders with default props', () => {
      const { container } = render(<ArrowLeft />);
      const icon = container.querySelector('svg');

      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('width', '24');
      expect(icon).toHaveAttribute('height', '24');
      expect(icon).toHaveClass('icon');
    });

    it('applies custom size', () => {
      const size = 32;
      const { container } = render(<ArrowLeft size={size} />);
      const icon = container.querySelector('svg');

      expect(icon).toHaveAttribute('width', size.toString());
      expect(icon).toHaveAttribute('height', size.toString());
    });

    it('applies custom color', () => {
      const color = '#FF0000';
      const { container } = render(<ArrowLeft color={color} />);
      const icon = container.querySelector('svg');

      expect(icon).toHaveAttribute('stroke', color);
    });

    it('applies additional className', () => {
      const className = 'custom-class';
      const { container } = render(<ArrowLeft className={className} />);
      const icon = container.querySelector('svg');

      expect(icon).toHaveClass('icon', className);
    });

    it('maintains SVG attributes', () => {
      const { container } = render(<ArrowLeft />);
      const icon = container.querySelector('svg');

      expect(icon).toHaveAttribute('fill', 'none');
      expect(icon).toHaveAttribute('stroke-width', '2');
      expect(icon).toHaveAttribute('stroke-linecap', 'round');
      expect(icon).toHaveAttribute('stroke-linejoin', 'round');
    });
  });
});
