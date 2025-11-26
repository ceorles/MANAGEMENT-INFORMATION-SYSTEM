import React, { useState } from 'react';
// We don't import Navbar here anymore

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... your fetch logic to Django ...
        console.log("Logging in...", formData);
    };

    return (
        <div className="split-screen">
            <div className="split-left">
                <h2>Log-In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username or Email:</label>
                        <input type="text" onChange={(e) => setFormData({...formData, username: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
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