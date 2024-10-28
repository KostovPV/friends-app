import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css';

export default function Footer() {
  return (
    <footer>
      <ul className="footer__categories">

        <li><Link to="/">Начало</Link></li>
        <li><Link to="/book">Резервирай</Link></li>
        <li><Link to="/terms">Условия</Link></li>
        <li><Link to="/contacts">Контакти</Link></li>
      </ul>
      <div className="footer__more">
        <div className="footer__more-text">Харесваш ни, гласувай за нас тук</div>
        <a href="//bgtop.net/vote/1730040725" target="_blank" rel="noopener noreferrer" className="footer__vote-button">
          <img src="/assets/bg_top_logo10.gif" alt="Vote Icon" className="footer__vote-icon" />
        </a>

      </div>
      <div className="footer__copyright">
        <small>Всички права запазени ©. Страницата е направена от Plan B Web Services.</small>
      </div>
    </footer>
  )
}