import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaBookOpen, FaExchangeAlt, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Dashboard.css';

const LibrarianSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [name, setName] = useState('Librarian'); // Default state

    useEffect(() => {
        const storedName = localStorage.getItem('user_name');
        if (storedName) {
            setName(storedName);
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path ? 'sidebar-link active' : 'sidebar-link';

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8B6508" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    <h2>LIB<span style={{color: '#8B6508'}}>YTE</span></h2>
                </div>

                <div className="profile-section">
                    <div className="avatar-circle">
                        <img src="https://via.placeholder.com/80" alt="Admin" /> 
                    </div>
                    <h3>{name}</h3> 
                </div>
            </div>

            <nav className="sidebar-nav">
                <Link to="/librarian-dashboard" className={isActive('/librarian-dashboard')}>
                    <FaHome className="icon" /> Home
                </Link>
                <Link to="/librarian/members" className={isActive('/librarian/members')}>
                    <FaUsers className="icon" /> Members
                </Link>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt />
                </button>
            </div>
        </div>
    );
};

export default LibrarianSidebar;