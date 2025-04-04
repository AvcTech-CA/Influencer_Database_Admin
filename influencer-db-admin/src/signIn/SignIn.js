import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css'; // Import external CSS

function SignIn() {
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
            const response = await fetch("http://localhost:5000/admin/signin", {
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
                localStorage.setItem("authToken", data.token);
                navigate('/home');
                setFormData({ email: "", password: "" });
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
