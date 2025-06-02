import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../__tests__/utils/test-utils';
import Layout from '../../../components/Layout/Layout';
import * as RouterDom from 'react-router-dom';

// Mock the Outlet component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    Outlet: vi.fn()
  };
});

describe('Layout Component', () => {
  it('renders header with title', () => {
    vi.mocked(RouterDom.Outlet).mockImplementation(() => <div>Content</div>);
    render(<Layout />);
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'F1 World Champions' })).toBeInTheDocument();
  });

  it('renders outlet content', () => {
    vi.mocked(RouterDom.Outlet).mockImplementation(() => (
      <div data-testid="test-content">Test Content</div>
    ));
    
    render(<Layout />);
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    vi.mocked(RouterDom.Outlet).mockImplementation(() => <div>Content</div>);
    render(<Layout />);
    
    expect(screen.getByRole('banner')).toHaveClass('header');
    expect(screen.getByRole('main')).toHaveClass('layout__main');
  });

  it('renders logo in header', () => {
    vi.mocked(RouterDom.Outlet).mockImplementation(() => <div>Content</div>);
    render(<Layout />);
    
    const logo = screen.getByRole('img', { name: 'F1 World Champions' });
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveClass('header__logo');
  });

  it('renders with multiple outlet elements', () => {
    vi.mocked(RouterDom.Outlet).mockImplementation(() => (
      <>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
      </>
    ));
    
    render(<Layout />);
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('maintains semantic HTML structure', () => {
    vi.mocked(RouterDom.Outlet).mockImplementation(() => <div>Content</div>);
    render(<Layout />);
    
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument(); // main
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
    expect(screen.getByRole('navigation')).toBeInTheDocument(); // nav
  });

  it('renders footer with copyright and links', () => {
    vi.mocked(RouterDom.Outlet).mockImplementation(() => <div>Content</div>);
    render(<Layout />);

    expect(screen.getByText(/© \d{4} F1 World Champions/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Official F1 Website' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'FIA' })).toBeInTheDocument();
  });
}); 