import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css'; // External CSS
import API_BASE_URL from '../apiconfig';
import { multiStepContext } from '../StepContext';

function SignIn() {
    const { currentEmail, setcurrentEmail } = useContext(multiStepContext);

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await fetch(`${API_BASE_URL}/admin/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setMessage(data.message);

                // Save token and email to localStorage
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("email", formData.email);

                // Set email in context
                setcurrentEmail(formData.email);

                // Clear form and navigate
                setFormData({ email: "", password: "" });
                navigate('/home');
            } else {
                setError(data.error || "Something went wrong");
            }
        } catch (err) {
            setError("Failed to connect to server");
        }
    };

    return (
        <div className="signin-container">
            <div className="form-box">
                <h2>Sign In</h2>
                {message && <p className="success-msg">{message}</p>}
                {error && <p className="error-msg">{error}</p>}

                <form onSubmit={handleSubmit} className="signin-form">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />

                    <button type="submit" className="submit-btn">Sign In</button>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
