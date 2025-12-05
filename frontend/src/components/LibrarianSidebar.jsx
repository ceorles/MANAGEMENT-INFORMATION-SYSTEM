import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaBook, FaExchangeAlt, FaChartLine, FaSignOutAlt, FaCamera, FaBars, FaTimes } from 'react-icons/fa';
import { jwtDecode } from "jwt-decode"; 
import logo from '../assets/logo.png';
import LoadingScreen from './LoadingScreen';
import '../styles/Dashboard.css';

const LibrarianSidebar = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [name, setName] = useState('Librarian');
    const [profileImage, setProfileImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.name) setName(decoded.name);
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }

        fetchProfileImage();
        
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 900);
            if (window.innerWidth > 900) setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `http://127.0.0.1:8000${path}`;
    };

    const fetchProfileImage = async () => {
        const token = sessionStorage.getItem('access_token');
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

        const token = sessionStorage.getItem('access_token');
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
        setIsLoading(true);
        setTimeout(() => {
            sessionStorage.clear();
            navigate('/');
        }, 1500);
    };

    const getLinkStyle = (path) => {
        const isActive = location.pathname === path;
        return {
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px',
            borderRadius: '50px', textDecoration: 'none', fontSize: '18px', fontWeight: '600',
            marginBottom: '8px', transition: 'all 0.3s',
            backgroundColor: isActive ? '#FAF6F0' : 'transparent',
            border: isActive ? '2px solid #8A5F0F' : '2px solid transparent',
            color: '#8A5F0F'
        };
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <>
            {isMobile && (
                <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '70px', background: 'white', borderBottom: '4px solid #8B6508', zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', boxSizing: 'border-box'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <img src={logo} alt="Logo" style={{height: '40px', width: 'auto', objectFit: 'contain'}} />
                        <div style={{fontSize: '24px', fontWeight: '800', lineHeight: '1'}}>
                            <span style={{color: '#8A5F0F'}}>LIB</span>
                            <span style={{color: 'black'}}>YTE</span>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{background: 'none', border: 'none', fontSize: '28px', color: '#8B6508', cursor: 'pointer'}}>
                        {sidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            )}

            {isMobile && sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, backdropFilter: 'blur(2px)'}} />
            )}

            <div className="sidebar" style={{width: '280px', minHeight: '100vh', backgroundColor: 'white', borderRight: '4px solid #8A5F0F', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 20px', position: 'fixed', top: 0, left: isMobile ? (sidebarOpen ? '0' : '-300px') : '0', transition: 'left 0.3s ease-in-out', zIndex: 2101, boxShadow: '4px 0 15px rgba(0,0,0,0.1)', marginTop: isMobile ? '0' : '0'}}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <img src={logo} alt="Libyte Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                    <div style={{fontSize: '32px', fontWeight: '800', lineHeight: '1'}}>
                        <span style={{color: '#8A5F0F'}}>LIB</span>
                        <span style={{color: 'black'}}>YTE</span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
                    <div onClick={handleImageClick} style={{ position: 'relative', cursor: 'pointer', marginBottom: '10px' }}>
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #fde047', objectFit: 'cover' }} />
                        ) : (
                            <img src="https://via.placeholder.com/80" alt="Default" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #fde047' }} />
                        )}
                        <div style={{position: 'absolute', bottom: '0', right: '0', background: '#8A5F0F', borderRadius: '50%', padding: '6px', color: 'white', fontSize: '12px', border: '2px solid white'}}>
                            <FaCamera />
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} style={{display: 'none'}} accept="image/*" onChange={handleFileChange} />
                    <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'black', margin: '5px 0' }}>{name}</h2>
                    <hr style={{ width: '60%', border: 'none', borderTop: '1px solid #ccc' }} />
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '5px' }}>
                    <Link to="/librarian-dashboard" style={getLinkStyle('/librarian-dashboard')} onClick={() => setSidebarOpen(false)}><FaHome style={{fontSize: '24px'}} /> Home</Link>
                    <Link to="/librarian/members" style={getLinkStyle('/librarian/members')} onClick={() => setSidebarOpen(false)}><FaUsers style={{fontSize: '24px'}} /> Members</Link>
                    <Link to="/librarian/catalog" style={getLinkStyle('/librarian/catalog')} onClick={() => setSidebarOpen(false)}><FaBook style={{fontSize: '24px'}} /> Manage Catalog</Link>
                    <Link to="/librarian/issue-return" style={getLinkStyle('/librarian/issue-return')} onClick={() => setSidebarOpen(false)}><FaExchangeAlt style={{fontSize: '24px'}} /> Issue / Return</Link>
                </nav>

                <div style={{ flexGrow: 1 }}></div>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                    <button onClick={handleLogout} style={{width: '50px', height: '50px', borderRadius: '50%', border: 'none', backgroundColor: 'transparent', color: '#8A5F0F', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'}} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FAF6F0'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <FaSignOutAlt />
                    </button>
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#999', textAlign: 'center' }}>© 2025 Libyte<br />ver. 2.67.67</div>
                </div>
            </div>
        </>
    );
};

export default LibrarianSidebar;