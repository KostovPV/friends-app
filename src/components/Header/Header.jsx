
import './Header.css';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

function Header() {


    return (
        <>

            <header>
                <nav>
                    <div className="logo">

                    </div>
                    <input type="checkbox" id="menu-toggle" className="menu-toggle" />
                    <label htmlFor="menu-toggle" className="burger-menu">
                        <span className="line"></span>
                        <span className="line"></span>
                        <span className="line"></span>
                    </label>
                    <ul>
                        <li><a href="/">Начало</a></li>
                        <li><a href="/book-party">Запази парти</a></li>
                        <li><a href="/terms">Условия</a></li>
                        <li><a href="/contacts">Контакти</a></li>
                        <li><a href="/upload">Качи снимка</a></li>
                        <li><a href="/auth">Вход за потребители</a></li>
                        <li><a href="/gallery">Галерия</a></li>
                    </ul>
                    <div className="top-social">
                        <a href="https://www.facebook.com/profile.php?id=61554304582027" aria-label="Facebook Profile">
                            <FaFacebook className="social-icon" />
                        </a>
                        <a href="https://www.instagram.com" aria-label="Instagram Profile">
                            <FaInstagram className="social-icon"  />
                        </a>
                    </div>
                    <div className="search-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                </nav>
            </header>

        </>
    )
}

export default Header