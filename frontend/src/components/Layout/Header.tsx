import { Link } from 'react-router-dom';
import f1Logo from '../../../public/F1-logo-square.svg';
import './Header.scss';

const Header = () => {
  return (
    <header className="header">
      <div className="container header__container">
        <Link to="/" className="header__logo">
          <img src={f1Logo} alt="F1 World Champions" />
        </Link>
        <nav className="header__nav">
          <Link to="/" className="header__nav-link">Home</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 