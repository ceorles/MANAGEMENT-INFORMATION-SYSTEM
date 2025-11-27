import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div className="signup-container">
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
                Register as {title}
            </h3>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name:</label>
                    <input type="text" name="name" placeholder="Last name, First name" onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" placeholder="email@address.com" onChange={handleChange} required />
                </div>

                {userType === 'librarian' && (
                    <div className="form-group">
                        <label>Username:</label>
                        <input type="text" name="username" placeholder="Create a username" onChange={handleChange} required />
                    </div>
                )}

                {userType === 'student' && (
                    <>
                        <div className="form-group">
                            <label>Student ID:</label>
                            <input type="text" name="student_id" placeholder="e.g. 2023-0001" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Contact Number:</label>
                            <input type="text" name="contact_number" placeholder="+639..." onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Sex:</label>
                            <select 
                                name="sex" 
                                onChange={handleChange}
                                style={{
                                    width: '100%', padding: '12px', border: '2px solid #8B6508', 
                                    borderRadius: '25px', outline: 'none'
                                }}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </>
                )}

                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" placeholder="Min 8 characters" onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input type="password" name="confirm_password" placeholder="Verify Password" onChange={handleChange} required />
                </div>

                <button type="submit" className="submit-btn">Sign-Up</button>

            </form>
        </div>
    );
};

export default Signup;