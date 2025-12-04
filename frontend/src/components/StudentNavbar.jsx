import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../styles/Student.css'; 

const StudentNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setName(localStorage.getItem('user_name') || 'Student');
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // active path
    const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

    return (
        <nav className="student-navbar modern-navbar">
            <div className="navbar-logo modern-logo">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8B6508" strokeWidth="2" style={{marginRight:'12px'}}>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span className="brand-main">LIB</span><span className="brand-accent">YTE</span>
            </div>

            {/* Hamburger menu icon for mobile */}
            <div className="navbar-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
            </div>

            {/* Only show menu links if menuOpen is true on mobile, always show on desktop */}
            {(menuOpen || window.innerWidth > 700) && (
                <div className={`navbar-links modern-links${menuOpen ? ' open' : ''}`}>
                    <Link to="/student-dashboard" className={isActive('/student-dashboard')} onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/student/return" className={isActive('/student/return')} onClick={() => setMenuOpen(false)}>Book History</Link>

                    <div className="profile-container modern-profile">
                        <FaUserCircle 
                            size={36}
                            className="profile-icon modern-profile-icon"
                            onClick={() => setShowDropdown(!showDropdown)}
                        />
                        {showDropdown && (
                            <div className="profile-dropdown modern-dropdown animate-dropdown">
                                <div className="dropdown-arrow modern-arrow"></div>
                                <div className="dropdown-item name modern-name">{name}</div>
                                <div className="dropdown-divider modern-divider"></div>
                                <div className="dropdown-item logout modern-logout" onClick={handleLogout}>Logout</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default StudentNavbar;