import React,{useState} from 'react'


function SignIn() {

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
              
                setFormData({  email: "",  password: "" });
            } else {
                setError(data.error || "Something went wrong");
            }
        } catch (err) {
            setError("Failed to connect to server");
        }
    };

  return (
    <>
        <div>
            <div>
                <h1>{message}</h1>
            </div>
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
               
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-input"
                />
                <button type="submit" className="submit-btn">Sign Up</button>
            </form>
        </div>
    </>
  )
}

export default SignIn
