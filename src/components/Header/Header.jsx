
import './Header.css';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { useAuthContext } from '../../hooks/useAuthContext'; // Import the Auth context
import './Header.css'; // Ensure you import your CSS file

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
        <ul>
          <li><a href="/">Начало</a></li> {/* Home */}
          <li><a href="/contacts">Контакти</a></li> {/* Contacts */}
          <li><a href="/terms">Условия</a></li> {/* Terms */}
          {/* Conditionally render links based on user state */}
          {!user ? (
            <>
              <li><a href="/login">Вход</a></li> 
              <li><a href="/register">Регистрация</a></li> 
            </>
          ) : (<ul>
            <li><a href="/logout">Изход</a></li> 
            <li><a href="/upload">Качи снимка</a></li> 
            </ul>
          )}
        </ul>
        <div className="top-social">
          <a href="https://www.facebook.com/profile.php?id=61554304582027" aria-label="Facebook Profile">
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
