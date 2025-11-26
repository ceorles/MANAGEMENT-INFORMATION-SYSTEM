import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    // Determine what button to show on the top right
    let navAction;
    if (location.pathname === '/') {
        navAction = (
            <div>
                <span style={{ fontWeight: 'bold', marginRight: '15px' }}>Don't have Account?</span>
                <Link to="/signup" className="nav-btn">Sign-Up</Link>
            </div>
        );
    } else if (location.pathname === '/signup') {
        navAction = (
            <div>
                <span style={{ fontWeight: 'bold', marginRight: '15px' }}>If you have an account</span>
                <Link to="/" className="nav-btn">Log In</Link>
            </div>
        );
    }

    return (
        <div className="auth-wrapper">
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">
                    {/* add image */}
                    LIB<span>YTE</span>
                </div>
                <div>
                    {navAction}
                </div>
            </nav>

            {/* login or signup */}
            <div className="container">
                {children}
            </div>
        </div>
    );
};

export default Layout;