import React, { useState } from 'react';
import './header.css';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('email'); // also clear stored email
    window.location.href = '/';
  };

  const email = localStorage.getItem('email'); // get stored email

  return (
    <>
      <header className="header">
        <div className="logo">
          <img src="/images/Logo.png" alt="Logo" />
        </div>

        <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
        {localStorage.getItem('authToken') && <a href="/home">Influencers</a> }
        {localStorage.getItem('authToken') && <a href="/users">Users</a>}
          
          {email === 'sharina@avcomm.ca' && <a href="/signUp">Create-Admin</a>}
        </nav>

        <div className="nav-icons">
          {!localStorage.getItem('authToken') && (
            <button className="sign-in-btn">Sign In</button>
          )}
        </div>

        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          &#9776;
        </button>

        {localStorage.getItem('authToken') && (
          <button className="log-out-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </header>
    </>
  );
}

export default Header;
