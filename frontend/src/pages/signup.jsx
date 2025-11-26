import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LibrarianSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirm_password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Connect to Django Backend
            const response = await fetch('http://127.0.0.1:8000/api/signup/librarian/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (response.ok) {
                alert("Account created! Please log in.");
                navigate('/'); // Redirect to Login
            } else {
                alert("Error: " + JSON.stringify(data));
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="auth-wrapper">
            <nav className="navbar">
                <div className="logo">LIB<span>YTE</span></div>
                <div>
                    <span style={{ fontWeight: 'bold', marginRight: '15px' }}>If you have an account</span>
                    <Link to="/" className="nav-btn">Log In</Link>
                </div>
            </nav>

            <div className="container">
                <div className="signup-container">
                    <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
                        Step into your space. Register with Libyte today.
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name:</label>
                            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Username:</label>
                            <input type="text" name="username" placeholder="Username" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="email" name="email" placeholder="example@email.com" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input type="password" name="password" placeholder="Min 8 characters" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password:</label>
                            <input type="password" name="confirm_password" placeholder="Verify Password" onChange={handleChange} />
                        </div>
                        <button type="submit" className="submit-btn">Sign-Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LibrarianSignup;