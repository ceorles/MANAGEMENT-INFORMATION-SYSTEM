import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

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
        <div className="split-screen">
            <div className="split-left">
                
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#8B6508',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    marginBottom: '30px',
                    width: 'fit-content',
                    fontSize: '16px'
                }}>
                    <FaArrowLeft /> Back
                </Link>
                {/* --------------------------- */}

                <h2>{title} Log-In</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username or Email:</label>
                        <input 
                            type="text" 
                            name="username"
                            placeholder="Enter your Username or Email Address" 
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Enter your Password" 
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="submit-btn">Log - In</button>
                </form>
            </div>
            <div className="split-right">
                <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80" alt="Books" />
            </div>
        </div>
    );
};

export default Login;