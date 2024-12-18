import './Header.css';
import { useEffect } from "react";
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { useAuthContext } from '../../hooks/useAuthContext';
import UserProfile from '../UserProfile/UserProfile';

function Header() {
  const { user, authIsReady } = useAuthContext();
  useEffect(() => {

  }, [user, authIsReady]);


  if (!authIsReady) {
    return <header>Зареждане...</header>;
  }

  return (
    <header>
      <nav>
        <div className="left">
          <div className="logo"></div>
          <div className='links'>
            <input type="checkbox" id="menu-toggle" className="menu-toggle" />
            <label htmlFor="menu-toggle" className="burger-menu">
              <span className="line"></span>
              <span className="line"></span>
              <span className="line"></span>
            </label>
            <ul className="nav-links">
              <li><a href="/">Начало</a></li>
              <li><a href="/contacts">Контакти</a></li>
              <li><a href="/terms">Общи условия</a></li>
              <li><a href="/book">Резервирай</a></li>
              <li><a href="/gallery">Галерия</a></li>

              {!user ? (
                <>
                  <li><a href="/login">Вход</a></li>
                  <li><a href="/register">Регистрация</a></li>
                </>
              ) : (
                <>
                  <li><a href="/logout">Изход</a></li>
                  {user.role === 'admin' && (
                    <li><a href="/upload">Качи снимка</a></li>
                  )}
                  {user.role === 'admin' && (
                    <li><a href="/statistics">Статистика</a></li>
                  )}
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="right">
          <div className="top-social">
            <a href="https://www.facebook.com/profile.php?id=61566720999276" aria-label="Visit Парти център Friends on Facebook">
              <FaFacebook className="social-icon" />
            </a>
            <a href="https://www.instagram.com/kidscenterfriends" aria-label="Visit Парти център Friends on Instagram">
              <FaInstagram className="social-icon" />
            </a>

          </div>
          <div className='user-link'>
            {user && <UserProfile user={user} />}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
