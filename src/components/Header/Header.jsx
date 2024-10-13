import './Header.css';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { useAuthContext } from '../../hooks/useAuthContext'; // Import the Auth context

function Header() {
  const { user } = useAuthContext(); // Get the user from context

  return (
    <header>
      <nav>
        <div className="logo"></div>
        <input type="checkbox" id="menu-toggle" className="menu-toggle" />
        <label htmlFor="menu-toggle" className="burger-menu">
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </label>
        <ul className="nav-links">
          <li><a href="/">Начало</a></li> {/* Home */}
          <li><a href="/contacts">Контакти</a></li> {/* Contacts */}
          <li><a href="/terms">Условия</a></li> {/* Terms */}
          <li><a href="/book">Резервирай</a></li> {/* Book */}
          {!user ? (
            <>
              <li><a href="/login">Вход</a></li> {/* Login */}
              <li><a href="/register">Регистрация</a></li> {/* Register */}
            </>
          ) : (
            <>
              <li><a href="/logout">Изход</a></li> {/* Logout */}
              <li><a href="/upload">Качи снимка</a></li> {/* Upload */}
              <li><a href="/profile">Профил</a></li> {/* Upload */}
            </>
          )}
        </ul>
        <div className="top-social">
          <a href="https://www.facebook.com/profile.php?id=61566720999276" aria-label="Facebook Profile">
            <FaFacebook className="social-icon" />
          </a>
          <a href="https://www.instagram.com" aria-label="Instagram Profile">
            <FaInstagram className="social-icon" />
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
