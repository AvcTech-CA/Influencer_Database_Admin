import React, { useState } from 'react';
import './signUp.css';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiconfig';

function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState("");

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const isValidPassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength) return "Password must be at least 8 characters long.";
    if (!hasUpperCase) return "Password must have at least one uppercase letter.";
    if (!hasLowerCase) return "Password must have at least one lowercase letter.";
    if (!hasNumber) return "Password must have at least one number.";
    if (!hasSpecialChar) return "Password must have at least one special character (!@#$%^&*).";

    return "";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setEmailError("");
    setPasswordError("");
  
    // Validate Email
    if (!isValidEmail(formData.email)) {
      setEmailError("Please enter a valid email address.");
      setShowPopup(true);
      return;
    }
  
    // Validate Password
    const passwordValidationMessage = isValidPassword(formData.password);
    if (passwordValidationMessage) {
      setPasswordError(passwordValidationMessage);
      setShowPopup(true);
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/admin/signUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // <-- Set header
        },
        body: JSON.stringify(formData), // <-- Send JSON
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage(data.message);
        setFormData({ email: "", password: "" });
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 2000);
      } else {
        setError(data.error || "Something went wrong");
        setShowPopup(true);
      }
    } catch (err) {
      setError("Failed to connect to server");
      setShowPopup(true);
    }
  };
  
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div className="signup-container">
        
        <div className="signup-container-form">
          <h2>Create an Admin</h2>
          <form onSubmit={handleSubmit} className="signup-form">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
            {emailError && <p style={{ color: "red" }}>{emailError}</p>}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
            />
            {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}

            <button type="submit" className="submit-btn">Sign Up</button>
          </form>
        </div>
      </div>

      {showPopup && (
        <div className="error-popup">
          <div className="error-popup-content">
            <p>{message || error}</p>
            <span className="close-icon" onClick={closePopup}>&times;</span>
            <button onClick={closePopup} className="close-popup-btn">OK</button>
          </div>
        </div>
      )}
    </>
  );
}

export default SignUp;
