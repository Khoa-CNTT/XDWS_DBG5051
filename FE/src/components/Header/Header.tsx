import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.scss';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Đóng menu khi chuyển trang
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src="https://ext.same-assets.com/0/1160240166.svg" alt="Smart Order" />
          </Link>

          <div
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <nav className={`main-nav ${isMenuOpen ? 'active' : ''}`}>
            <ul>
              <li>
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/thuc-don" className={location.pathname === '/thuc-don' ? 'active' : ''}>
                  Thực đơn
                </Link>
              </li>
              <li>
                <Link to="/dat-ban" className={location.pathname === '/dat-ban' ? 'active' : ''}>
                  Đặt bàn
                </Link>
              </li>
              <li>
                <Link to="/qr-demo" className={location.pathname === '/qr-demo' ? 'active' : ''}>
                  Hướng dẫn QR
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
