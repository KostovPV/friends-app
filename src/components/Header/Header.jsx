import './Header.css';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { useAuthContext } from '../../hooks/useAuthContext';
import UserProfile from '../UserProfile/UserProfile';
import { useEffect, useState } from 'react';

function Header() {
  const { user, authIsReady } = useAuthContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Set logged-in state when user changes
  useEffect(() => {
    if (authIsReady) {
      setIsLoggedIn(!!user); // Update login state when auth is ready
    }
  }, [authIsReady, user]);

  // Handle loading state before authentication is ready
  if (!authIsReady) {
    return <header>Loading...</header>;
  }

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
          <li><a href="/">Начало</a></li>
          <li><a href="/contacts">Контакти</a></li>
          <li><a href="/terms">Условия</a></li>
          <li><a href="/book">Резервирай</a></li>
          {!isLoggedIn ? (
            <>
              <li><a href="/login">Вход</a></li>
              <li><a href="/register">Регистрация</a></li>
            </>
          ) : (
            <>
              <li><a href="/logout">Изход</a></li>
              <li><a href="/upload">Качи снимка</a></li>
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

        {isLoggedIn && <UserProfile user={user} />}
      </nav>
    </header>
  );
}

export default Header;
