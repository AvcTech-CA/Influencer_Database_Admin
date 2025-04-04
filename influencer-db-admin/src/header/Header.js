import React , {useState} from 'react'
import './header.css'
import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
    const toggleMobileMenu = () => {
      setMobileMenuOpen(!isMobileMenuOpen);
    };
  
    const handleLogout = async () => {
      localStorage.removeItem("authToken"); // Remove token from localStorage
      window.location.href = "/";
  };
  return (
   <>
   
   <header className="header">
      <div className="logo">
      <img
          src="/images/Logo.png"
          alt="Logo"
        />
      </div>

      <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
        <a href="#">Home</a>
        <a href="#">About Us</a>
      </nav>

      <div className="nav-icons">
        {!localStorage.getItem('authToken') && <button className="sign-in-btn">Sign In</button>}
      </div>

      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        <i className="fas fa-bars"></i>
      </button>

      {localStorage.getItem('authToken') && <button className='log-out-btn' onClick={handleLogout}>logout</button>}

    </header>
    </>
  )
}

export default Header
