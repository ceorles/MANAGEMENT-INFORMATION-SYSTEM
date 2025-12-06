import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { jwtDecode } from "jwt-decode"; 
import logo from '../assets/logo.png';
import LoadingScreen from './LoadingScreen';
import '../styles/Student.css'; 
import { API_URL } from '../apiConfig';

const StudentNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState('Student'); 
    const [showDropdown, setShowDropdown] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setName(decoded.name || 'Student'); 
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    // --- UPDATED LOGOUT ---
    const handleLogout = () => {
        setIsLoading(true);
        setTimeout(() => {
            sessionStorage.clear();
            navigate('/');
        }, 1500);
    };

    const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

    if (isLoading) return <LoadingScreen />;

    return (
        <nav className="student-navbar modern-navbar">
            <div className="navbar-logo modern-logo">
                <img src={logo} alt="Libyte Logo" style={{ height: '45px', width: 'auto', marginRight: '10px', objectFit: 'contain' }} />
                <span className="brand-main">LIB</span><span className="brand-accent">YTE</span>
            </div>

            <div className="navbar-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
            </div>

            <div className={`navbar-links modern-links${menuOpen ? ' open' : ''}`}>
                <Link to="/student-dashboard" className={isActive('/student-dashboard')} onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/student/return" className={isActive('/student/return')} onClick={() => setMenuOpen(false)}>Book History</Link>

                <div className="profile-container modern-profile desktop-only">
                    <FaUserCircle size={36} className="profile-icon modern-profile-icon" onClick={() => setShowDropdown(!showDropdown)} />
                    {showDropdown && (
                        <div className="profile-dropdown modern-dropdown animate-dropdown">
                            <div className="dropdown-arrow modern-arrow"></div>
                            <div className="dropdown-item name modern-name">{name}</div>
                            <div className="dropdown-divider modern-divider"></div>
                            <div className="dropdown-item logout modern-logout" onClick={handleLogout}>Logout</div>
                        </div>
                    )}
                </div>

                <div className="mobile-profile-section">
                    <div className="mobile-divider"></div>
                    <div className="mobile-user-info">
                        <FaUserCircle size={24} color="#8B6508" />
                        <span className="mobile-username">{name}</span>
                    </div>
                    <button className="mobile-logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default StudentNavbar;