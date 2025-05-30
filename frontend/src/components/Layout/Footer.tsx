import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__container">
        <p className="footer__copyright">
          © {currentYear} F1 World Champions. All rights reserved.
        </p>
        <div className="footer__links">
          <a href="https://www.formula1.com" target="_blank" rel="noopener noreferrer" className="footer__link">
            Official F1 Website
          </a>
          <span className="footer__separator">|</span>
          <a href="https://www.fia.com" target="_blank" rel="noopener noreferrer" className="footer__link">
            FIA
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 