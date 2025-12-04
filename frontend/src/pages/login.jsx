import React, { useState } from 'react';
import booksImg from '../assets/books.png';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/Login.css';

const Login = ({ userType }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const title = userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : "User";

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('role', data.role);
                // save name for the dashboard
                localStorage.setItem('user_name', data.name); 
                
                if (data.student_id) {
                    localStorage.setItem('student_id', data.student_id);
                }

                if (userType && data.role !== userType) {
                   alert(`Error: You are a ${data.role}, but you tried to log in as a ${userType}.`);
                   return;
                }

                if (data.role === 'student') {
                    navigate('/student-dashboard');
                } else if (data.role === 'librarian') {
                    navigate('/librarian-dashboard');
                }
            } else {
                alert("Login Failed: " + (data.detail || "Invalid credentials"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Could not connect to the server.");
        }
    };

    return (
        <div className="login-card-outer large">
            <div className="login-card-image large">
                <img src={booksImg} alt="Books" />
            </div>
            <div className="login-card-form large">
                <div className="login-back-btn-row">
                    <Link to="/" className="login-back-btn" aria-label="Back">
                        <FaArrowLeft size={18} />
                        <span className="login-back-btn-text">Back</span>
                    </Link>
                </div>
                <h2 className="login-main-title">Log In as {title}</h2>
                <p className="login-subtitle">Enter your credentials to access your account.</p>
                <form onSubmit={handleSubmit} className="login-form-modern">
                    <div className="form-group">
                        <label>Username or Email:</label>
                        <input 
                            type="text" 
                            name="username"
                            placeholder="Username or Email"
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            autoComplete="username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Password"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn-modern">Log In</button>
                </form>
                <div className="signup-link-container-modern">
                    <span>Don't have Account? </span>
                    {userType === 'student' && (
                        <Link to="/signup/student" className="signup-link-modern">Signup</Link>
                    )}
                    {userType === 'librarian' && (
                        <Link to="/signup/librarian" className="signup-link-modern">Signup</Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;