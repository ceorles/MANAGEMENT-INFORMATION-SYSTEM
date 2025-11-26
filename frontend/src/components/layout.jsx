import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css'; 

const Layout = ({ children }) => {
    const location = useLocation();
    
    // Helper to get the current role from URL (e.g. /login/student -> returns "student")
    const pathParts = location.pathname.split('/');
    const pageType = pathParts[1]; // 'login' or 'signup'
    const userRole = pathParts[2]; // 'student' or 'librarian'

    // Define the Top Right Content
    let navContent = null;

    if (pageType === 'login' && userRole) {
        // CASE: We are on a Login Page -> Show "Sign-Up" button
        navContent = (
            <div style={{display: 'flex', alignItems: 'center'}}>
                <span style={{ fontWeight: 'bold', marginRight: '15px', fontSize: '14px' }}>
                    Don’t have Account?
                </span>
                <Link to={`/signup/${userRole}`} className="nav-btn-black">
                    Sign-Up
                </Link>
            </div>
        );
    } else if (pageType === 'signup' && userRole) {
        // CASE: We are on a Signup Page -> Show "Log In" button
        navContent = (
            <div style={{display: 'flex', alignItems: 'center'}}>
                <span style={{ fontWeight: 'bold', marginRight: '15px', fontSize: '14px' }}>
                    If you have an account
                </span>
                <Link to={`/login/${userRole}`} className="nav-btn-black">
                    Log In
                </Link>
            </div>
        );
    }

    return (
        <div className="auth-wrapper">
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="logo">
                    <img src="https://via.placeholder.com/40" alt="" style={{height: '40px', marginRight: '10px'}}/> 
                    {/* ^ Replace src with your actual Logo Image URL */}
                    LIB<span>YTE</span>
                </div>
                <div>
                    {navContent}
                </div>
            </nav>

            {/* PAGE CONTENT */}
            <div className="container">
                {children}
            </div>
        </div>
    );
};

export default Layout;