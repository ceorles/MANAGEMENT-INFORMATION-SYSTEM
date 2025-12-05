import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/Login.css';

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
        
        const apiUrl = userType === 'student' 
            ? 'http://127.0.0.1:8000/api/signup/student/' 
            : 'http://127.0.0.1:8000/api/signup/librarian/';

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
                alert("Error: " + JSON.stringify(data));
            }
        } catch (error) {
            console.error("Error:", error);
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
                            <input type="text" name="name" placeholder="Last name, First name" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="email" name="email" placeholder="email@address.com" onChange={handleChange} required />
                        </div>
                    </div>

                    {/* librarian un */}
                    {userType === 'librarian' && (
                        <div className="form-group">
                            <label>Username:</label>
                            <input type="text" name="username" placeholder="Create a username" onChange={handleChange} required />
                        </div>
                    )}

                    {/* student info */}
                    {userType === 'student' && (
                        <div className="form-row-2col">
                            <div className="form-group">
                                <label>Student ID:</label>
                                <input type="text" name="student_id" placeholder="e.g. 2023-0001" onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Contact Number:</label>
                                <input type="text" name="contact_number" placeholder="+639..." onChange={handleChange} required />
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
                            <input type="password" name="password" placeholder="Min 8 characters" onChange={handleChange} required />
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