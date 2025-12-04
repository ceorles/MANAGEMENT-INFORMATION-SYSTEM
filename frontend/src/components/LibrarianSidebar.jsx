<<<<<<< HEAD
import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaBookOpen, FaExchangeAlt, FaChartLine, FaSignOutAlt, FaCamera } from 'react-icons/fa';
import '../styles/Dashboard.css';

const LibrarianSidebar = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [name, setName] = useState('Librarian');
    const [profileImage, setProfileImage] = useState(null);
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        const storedName = localStorage.getItem('user_name');
        if (storedName) setName(storedName);
        fetchProfileImage();
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 700);
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
        <>
        {isMobile && (
            <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: 64, background: 'linear-gradient(90deg, #fffbe6 0%, #f7e9c4 100%)', boxShadow: '0 2px 8px #f7e9c4', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B6508" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    <h2 style={{fontWeight: 700, fontSize: 22, letterSpacing: 2, color: '#8B6508'}}>LIB<span style={{color: '#d4af37'}}>YTE</span></h2>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{background: 'none', border: 'none', fontSize: 28, color: '#8B6508', cursor: 'pointer'}}>
                    {sidebarOpen ? '✖' : '☰'}
                </button>
            </div>
        )}
        <div className="sidebar" style={{
            background: 'rgba(255, 250, 230, 0.95)',
            boxShadow: '0 8px 32px 0 rgba(139,101,8,0.12)',
            borderRadius: '0 32px 32px 0',
            border: '1.5px solid #f7e9c4',
            padding: isMobile ? '24px 12px' : '32px 18px',
            margin: '0',
            height: '100vh',
            display: isMobile ? (sidebarOpen ? 'flex' : 'none') : 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 201,
            minWidth: isMobile ? '160px' : '200px',
            maxWidth: isMobile ? '70vw' : '220px',
            width: isMobile ? '70vw' : '220px',
            backdropFilter: 'blur(12px)',
            transition: 'box-shadow 0.3s, background 0.3s',
            overflow: 'hidden',
        }}>
            <div className="sidebar-header" style={{marginBottom: 4, width: '100%'}}>
                <div className="sidebar-logo" style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, justifyContent: 'center'}}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8B6508" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    <h2 style={{fontWeight: 700, fontSize: 22, letterSpacing: 1, color: '#8B6508', textShadow: '0 2px 8px #f7e9c4'}}>LIB<span style={{color: '#d4af37'}}>YTE</span></h2>
                </div>
                <div className="profile-section" style={{textAlign: 'center', marginBottom: 10, borderBottom: '1.5px solid #e8e0d5', paddingBottom: 6, width: '100%'}}>
                    <div 
                        className="avatar-circle" 
                        onClick={handleImageClick} 
                        style={{cursor: 'pointer', position: 'relative', display: 'inline-block', boxShadow: '0 4px 16px rgba(139,101,8,0.12)', background: 'rgba(255,255,255,0.90)', borderRadius: '50%', padding: 6, border: '2px solid #d4af37'}}
                        title="Click to change profile picture"
                    >
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" style={{width:'56px', height:'56px', objectFit:'cover', borderRadius:'50%', border: '2px solid #d4af37', boxShadow: '0 2px 8px #f7e9c4'}} />
                        ) : (
                            <img src="https://via.placeholder.com/56" alt="Default" style={{width:'56px', height:'56px', objectFit:'cover', borderRadius:'50%', border: '2px solid #d4af37', boxShadow: '0 2px 8px #f7e9c4'}} />
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
                            background: 'linear-gradient(135deg, #d4af37 0%, #8B6508 100%)', borderRadius: '50%', 
                            padding: '6px', color: 'white', fontSize: '13px', boxShadow: '0 2px 8px #f7e9c4', border: '2px solid #fff'
                        }}>
                            <FaCamera />
                        </div>
                    </div>
                    <h3 style={{fontWeight: 600, fontSize: 15, marginTop: 6, color: '#8B6508', letterSpacing: 1}}>{name}</h3> 
                </div>
            </div>
            <nav className="sidebar-nav" style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, marginBottom: '150px', width: '100%'}}>
                <Link to="/librarian-dashboard" className={isActive('/librarian-dashboard')} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', textDecoration: 'none', color: '#8B6508', fontWeight: 700, fontSize: 17, borderRadius: 14, transition: 'all 0.3s', background: location.pathname === '/librarian-dashboard' ? 'linear-gradient(90deg, #f7e9c4 0%, #fffbe6 100%)' : 'none', boxShadow: location.pathname === '/librarian-dashboard' ? '0 2px 8px #f7e9c4' : 'none', border: location.pathname === '/librarian-dashboard' ? '1.5px solid #d4af37' : 'none', letterSpacing: 1}
                }>
                    <FaHome className="icon" style={{fontSize: 20}} /> Home
                </Link>
                <Link to="/librarian/members" className={isActive('/librarian/members')} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', textDecoration: 'none', color: '#8B6508', fontWeight: 700, fontSize: 17, borderRadius: 14, transition: 'all 0.3s', background: location.pathname === '/librarian/members' ? 'linear-gradient(90deg, #f7e9c4 0%, #fffbe6 100%)' : 'none', boxShadow: location.pathname === '/librarian/members' ? '0 2px 8px #f7e9c4' : 'none', border: location.pathname === '/librarian/members' ? '1.5px solid #d4af37' : 'none', letterSpacing: 1}
                }>
                    <FaUsers className="icon" style={{fontSize: 20}} /> Members
                </Link>
                <Link to="/librarian/catalog" className={isActive('/librarian/catalog')} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', textDecoration: 'none', color: '#8B6508', fontWeight: 700, fontSize: 17, borderRadius: 14, transition: 'all 0.3s', background: location.pathname === '/librarian/catalog' ? 'linear-gradient(90deg, #f7e9c4 0%, #fffbe6 100%)' : 'none', boxShadow: location.pathname === '/librarian/catalog' ? '0 2px 8px #f7e9c4' : 'none', border: location.pathname === '/librarian/catalog' ? '1.5px solid #d4af37' : 'none', letterSpacing: 1}
                }>
                    <FaBookOpen className="icon" style={{fontSize: 20}} /> Manage Catalog
                </Link>
                <Link to="/librarian/issue-return" className={isActive('/librarian/issue-return')} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', textDecoration: 'none', color: '#8B6508', fontWeight: 700, fontSize: 17, borderRadius: 14, transition: 'all 0.3s', background: location.pathname === '/librarian/issue-return' ? 'linear-gradient(90deg, #f7e9c4 0%, #fffbe6 100%)' : 'none', boxShadow: location.pathname === '/librarian/issue-return' ? '0 2px 8px #f7e9c4' : 'none', border: location.pathname === '/librarian/issue-return' ? '1.5px solid #d4af37' : 'none', letterSpacing: 1}
                }>
                    <FaExchangeAlt className="icon" style={{fontSize: 20}} /> Issue / Return
                </Link>
            </nav>
            <div className="sidebar-footer" style={{
                textAlign: 'center',
                width: '100%',
                paddingBottom: 18,
                background: 'transparent',
            }}>
                <button onClick={handleLogout} className="logout-btn" style={{
                    background: 'linear-gradient(90deg, #d4af37 0%, #8B6508 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 14,
                    padding: '12px 24px',
                    fontWeight: 800,
                    fontSize: 17,
                    boxShadow: '0 2px 8px #f7e9c4',
                    cursor: 'pointer',
                    transition: 'background 0.3s',
                    marginBottom: 100
                }}>
                    <FaSignOutAlt />
                </button>
            </div>
        </div>
        </>
    );
};

export default LibrarianSidebar;
=======
import React from 'react';
import { FaHome, FaUsers, FaBook, FaExchangeAlt, FaFileAlt, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import logo from '../assets/logo.png';


const LibrarianSidebar = () => (
  <aside className="w-72 min-h-screen bg-white flex flex-col items-center py-6 px-4 border-r-4 border-[#8A5F0F] shadow-lg">
    <div className="flex flex-col items-center w-full mb-2">
      <div className="flex items-center gap-2 mb-2">
        <img src={logo} alt="Libyte Logo" style={{ width: '4.5rem', height: '4.5rem', objectFit: 'contain' }} />
        <span className="text-4xl font-extrabold tracking-tight" style={{ color: '#8A5F0F', letterSpacing: '-2px' }}>LIB</span>
        <span className="text-4xl font-extrabold tracking-tight text-black" style={{ letterSpacing: '-2px' }}>YTE</span>
      </div>
    </div>

    <div className="flex flex-col items-center w-full mb-2">
      <img src="https://i.imgur.com/1Q9Z1Zm.png" alt="Profile" className="w-20 h-20 rounded-full border-2 border-yellow-200 object-cover mb-2" />
      <h2 className="text-2xl font-semibold text-black mb-1">Kim Batumbakal</h2>
      <hr className="w-32 border-t border-gray-400 mb-2" />
    </div>

    <nav className="flex flex-col gap-2 w-full mt-2">
      <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-full border-2 border-[#8A5F0F] text-[#8A5F0F] font-bold text-lg mb-1 bg-[#FAF6F0]">
        <FaHome className="text-2xl" /> Home
      </a>
      <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-[#FAF6F0] text-[#8A5F0F] font-semibold text-lg">
        <FaUsers className="text-2xl" /> Members
      </a>
      <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-[#FAF6F0] text-[#8A5F0F] font-semibold text-lg">
        <FaBook className="text-2xl" /> Manage Catalog
      </a>
      <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-[#FAF6F0] text-[#8A5F0F] font-semibold text-lg">
        <FaExchangeAlt className="text-2xl" /> Issue / Return
      </a>
      <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-[#FAF6F0] text-[#8A5F0F] font-semibold text-lg">
        <FaChartLine className="text-2xl" /> Generate Report
      </a>
    </nav>
    <div className="flex-grow" />
    <div className="flex flex-col items-center w-full mt-8 mb-2">
      <button className="flex items-center justify-center w-10 h-10 rounded-full text-[#8A5F0F] hover:bg-[#FAF6F0]">
        <FaSignOutAlt className="text-2xl" />
      </button>
    </div>
    <div className="mt-2 text-xs text-gray-400 text-center">
      © 2025 Libyte<br />ver. 2.67.67
    </div>
  </aside>
);

export default LibrarianSidebar;
>>>>>>> b9daade5e9291570267858c187b1b32302287f23
