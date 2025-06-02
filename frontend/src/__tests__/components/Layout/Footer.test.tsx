import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../__tests__/test-utils';
import Footer from '../../../components/Layout/Footer';

describe('Footer Component', () => {
  it('renders footer with copyright notice', () => {
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    const currentYear = new Date().getFullYear();
    const copyright = screen.getByText(`© ${currentYear} F1 World Champions. All rights reserved.`);
    
    expect(footer).toBeInTheDocument();
    expect(copyright).toBeInTheDocument();
    expect(copyright).toHaveClass('footer__copyright');
  });

  it('renders external links', () => {
    render(<Footer />);
    
    const f1Link = screen.getByRole('link', { name: 'Official F1 Website' });
    const fiaLink = screen.getByRole('link', { name: 'FIA' });
    
    expect(f1Link).toBeInTheDocument();
    expect(fiaLink).toBeInTheDocument();
    expect(f1Link).toHaveAttribute('href', 'https://www.formula1.com');
    expect(fiaLink).toHaveAttribute('href', 'https://www.fia.com');
  });

  it('applies correct link attributes', () => {
    render(<Footer />);
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveClass('footer__link');
    });
  });

  it('renders separator between links', () => {
    render(<Footer />);
    
    const separator = screen.getByText('|');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('footer__separator');
  });

  it('applies correct container classes', () => {
    render(<Footer />);
    
    const container = screen.getByRole('contentinfo').firstElementChild;
    expect(container).toHaveClass('container', 'footer__container');
  });

  it('maintains semantic HTML structure', () => {
    const { container } = render(<Footer />);
    
    expect(container.querySelector('footer')).toBeInTheDocument();
    expect(container.querySelector('.footer__links')).toBeInTheDocument();
    expect(container.querySelector('.footer__copyright')).toBeInTheDocument();
  });

  it('has correct link classes for styling', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    
    links.forEach(link => {
      expect(link).toHaveClass('footer__link');
    });
  });

  it('renders footer text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2025 F1 World Champions/i)).toBeInTheDocument();
  });
}); 