import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css'; 

const Layout = ({ children }) => {
    const location = useLocation();
    
    const pathParts = location.pathname.split('/');
    const pageType = pathParts[1]; // 'login' or 'signup'
    const userRole = pathParts[2]; // 'student' or 'librarian'

    let navContent = null;

    if (pageType === 'login' && userRole) {
        // Login - Sign-Up
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
        // Signup - Log In
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
                    LIB<span>YTE</span>
                </div>
                <div>
                    {navContent}
                </div>
            </nav>

            <div className="container">
                {children}
            </div>
        </div>
    );
};

export default Layout;