import './Header.css';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { useAuthContext } from '../../hooks/useAuthContext';
import UserProfile from '../UserProfile/UserProfile';

function Header() {
  const { user, authIsReady } = useAuthContext();
  console.log('User:', user, 'Auth Is Ready:', authIsReady);

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
          {!user ? (
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

        {user && <UserProfile user={user} />} {/* Pass the user data */}
      </nav>
    </header>
  );
}

export default Header;
