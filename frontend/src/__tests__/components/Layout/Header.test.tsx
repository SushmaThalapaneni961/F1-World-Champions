import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../__tests__/test-utils';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../../components/Layout/Header';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  it('renders header with logo', () => {
    renderWithRouter(<Header />);
    
    const header = screen.getByRole('banner');
    const logo = screen.getByRole('img', { name: 'F1 World Champions' });
    const logoLink = screen.getByRole('link', { name: 'F1 World Champions' });
    
    expect(header).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
    expect(logoLink).toHaveClass('header__logo', 'header__logo--animated');
  });

  it('renders navigation with home link', () => {
    renderWithRouter(<Header />);
    
    const nav = screen.getByRole('navigation');
    const homeLink = screen.getByRole('link', { name: 'Home' });
    
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('header__nav');
    expect(homeLink).toHaveClass('header__nav-link');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('applies correct container classes', () => {
    renderWithRouter(<Header />);
    
    const container = screen.getByRole('banner').firstElementChild;
    expect(container).toHaveClass('container', 'header__container');
  });

  it('maintains semantic HTML structure', () => {
    const { container } = renderWithRouter(<Header />);
    
    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelector('nav')).toBeInTheDocument();
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('has correct header classes for styling', () => {
    renderWithRouter(<Header />);
    const header = screen.getByRole('banner');
    
    expect(header).toHaveClass('header');
    expect(header.firstElementChild).toHaveClass('container', 'header__container');
  });

  it('has correct logo classes for styling', () => {
    renderWithRouter(<Header />);
    const logoLink = screen.getByRole('link', { name: 'F1 World Champions' });
    
    expect(logoLink).toHaveClass('header__logo', 'header__logo--animated');
    expect(logoLink.querySelector('img')).toBeInTheDocument();
  });

  it('renders header text', () => {
    renderWithRouter(<Header />);
    expect(screen.getByAltText('F1 World Champions')).toBeInTheDocument();
  });
}); 