import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/Login.css';
import { API_URL } from '../apiConfig';

const Signup = ({ userType }) => {
    const navigate = useNavigate();
    const title = userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : "User";
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '', 
        password: '',
        confirm_password: '',
        student_id: '',
        contact_number: '',
        sex: 'Male'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userType === 'student') {
            if (!formData.student_id.startsWith("023A")) {
                alert("Invalid Student ID. It must start with '023A' (e.g., 023A-12345).");
                return;
            }

            const phoneRegex = /^\d{11}$/;
            if (!phoneRegex.test(formData.contact_number)) {
                alert("Invalid Contact Number. It must be exactly 11 digits (e.g., 09123456789).");
                return;
            }
        }

        if (formData.password !== formData.confirm_password) {
            alert("Passwords do not match.");
            return;
        }
        
        const apiUrl = userType === 'student' 
            ? `${API_URL}/api/signup/student/` 
            : `${API_URL}/api/signup/librarian/`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (response.ok) {
                alert(`${title} Account created successfully!`);
                navigate(`/login/${userType}`); 
            } else {
                const errorMsg = data.detail || JSON.stringify(data);
                alert("Registration Failed: " + errorMsg);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Network error. Please try again later.");
        }
    };

    return (
        <div className="login-card-outer">
            <div className="login-card-form signup-mode">
                
                <div className="login-back-btn-row">
                    <Link to={`/login/${userType}`} className="login-back-btn">
                        <FaArrowLeft size={16} /> Back
                    </Link>
                </div>

                <div className="signup-header">
                    <h2 className="login-main-title">Sign Up as {title}</h2>
                    <p className="login-subtitle">Create your account to get started.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form-modern">
                    
                    {/* name & email */}
                    <div className="form-row-2col">
                        <div className="form-group">
                            <label>Full Name:</label>
                            <input type="text" name="name" placeholder="Last Name, First Name" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="email" name="email" placeholder="Example@gmail.com" onChange={handleChange} required />
                        </div>
                    </div>

                    {/* librarian un */}
                    {userType === 'librarian' && (
                        <div className="form-group">
                            <label>Username:</label>
                            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                        </div>
                    )}

                    {/* student info */}
                    {userType === 'student' && (
                        <div className="form-row-2col">
                            <div className="form-group">
                                <label>Student ID:</label>
                                <input 
                                    type="text" 
                                    name="student_id" 
                                    placeholder="e.g. 023A-00000" 
                                    onChange={handleChange} 
                                    required 
                                    // validation helper
                                    title="023A"
                                />
                            </div>
                            <div className="form-group">
                                <label>Contact Number:</label>
                                <input 
                                    type="text" 
                                    name="contact_number" 
                                    placeholder="09xxxxxxxxx" 
                                    onChange={handleChange} 
                                    required 
                                    maxLength={11}
                                />
                            </div>
                        </div>
                    )}

                    {/* sex */}
                    {userType === 'student' && (
                        <div className="form-group">
                            <label>Sex:</label>
                            <select name="sex" onChange={handleChange}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    )}

                    {/* password */}
                    <div className="form-row-2col">
                        <div className="form-group">
                            <label>Password:</label>
                            <input type="password" name="password" placeholder="Password" onChange={handleChange} required minLength={8} />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password:</label>
                            <input type="password" name="confirm_password" placeholder="Verify Password" onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="login-btn-modern">Sign Up</button>

                    <div className="signup-link-container-modern">
                        Already have an account? <Link to={`/login/${userType}`} className="signup-link-modern">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;