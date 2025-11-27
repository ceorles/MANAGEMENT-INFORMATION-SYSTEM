import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import '../styles/Student.css';

const StudentNavbar = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false); // State to toggle menu

    useEffect(() => {
        setName(localStorage.getItem('user_name') || 'Student');
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <nav className="student-navbar">
            <div className="navbar-logo">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#8B6508" strokeWidth="2" style={{marginRight:'10px'}}>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                LIB<span>YTE</span>
            </div>
            
            <div className="navbar-links">
                <Link to="/student-dashboard" className="nav-link">Borrow Books</Link>
                <Link to="/student/return" className="nav-link">Return Books</Link>
                
                <div className="profile-container">
                    <FaUserCircle 
                        size={32} 
                        className="profile-icon" 
                        onClick={() => setShowDropdown(!showDropdown)} 
                    />

                    {showDropdown && (
                        <div className="profile-dropdown">
                            <div className="dropdown-arrow"></div>
                            <div className="dropdown-item name">
                                {name}
                            </div>
                            <div className="dropdown-divider"></div>
                            <div className="dropdown-item logout" onClick={handleLogout}>
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default StudentNavbar;