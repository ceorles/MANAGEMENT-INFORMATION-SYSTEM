import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaBookOpen, FaExchangeAlt, FaChartLine, FaSignOutAlt, FaCamera } from 'react-icons/fa';
import '../styles/Dashboard.css';

const LibrarianSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [name, setName] = useState('Librarian');
    const [profileImage, setProfileImage] = useState(null);
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        const storedName = localStorage.getItem('user_name');
        if (storedName) setName(storedName);

        fetchProfileImage();
    }, []);

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `http://127.0.0.1:8000${path}`;
    };

    const fetchProfileImage = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/librarian/profile/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (data.profile_picture) {
                setProfileImage(getImageUrl(data.profile_picture));
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const token = localStorage.getItem('access_token');
        const formData = new FormData();
        formData.append('profile_picture', file);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/librarian/profile/', {
                method: 'PATCH', 
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                setProfileImage(getImageUrl(data.profile_picture));
                alert("Profile picture updated!");
            } else {
                alert("Failed to upload image.");
            }
        } catch (error) {
            console.error("Error uploading:", error);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

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
                    
                    <div 
                        className="avatar-circle" 
                        onClick={handleImageClick} 
                        style={{cursor: 'pointer', position: 'relative'}}
                        title="Click to change profile picture"
                    >
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" style={{width:'80px', height:'80px', objectFit:'cover', borderRadius:'50%'}} />
                        ) : (
                            <img src="https://via.placeholder.com/80" alt="Default" style={{width:'80px', height:'80px', objectFit:'cover', borderRadius:'50%'}} />
                        )}
                        
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{display: 'none'}} 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        
                        <div style={{
                            position: 'absolute', bottom: '0', right: '0', 
                            background: '#8B6508', borderRadius: '50%', 
                            padding: '5px', color: 'white', fontSize: '10px'
                        }}>
                            <FaCamera />
                        </div>
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
                <Link to="/librarian/catalog" className={isActive('/librarian/catalog')}>
                    <FaBookOpen className="icon" /> Manage Catalog
                </Link>
                <Link to="/librarian/issue-return" className={isActive('/librarian/issue-return')}>
                    <FaExchangeAlt className="icon" /> Issue / Return
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