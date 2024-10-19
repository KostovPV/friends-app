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
      <div className="footer__copyright">
        <small>All Rights Resrved &copy; Copyright, Plan B Web Services</small>
      </div>
    </footer>
  )
}