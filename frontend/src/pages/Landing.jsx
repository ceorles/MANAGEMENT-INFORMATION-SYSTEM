import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import LoadingScreen from '../components/LoadingScreen';

const Landing = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleNavigation = (path) => {
        setIsLoading(true);
        setTimeout(() => {
            navigate(path);
        }, 1500); 
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <div className="landing-container">
            <div className="landing-content">
                
                <div className="landing-logo" style={{ 
                    display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    gap: '30px', marginBottom: '30px'
                }}>
                    <img src={logo} alt="Libyte Logo" style={{ width: '150px', height: 'auto', objectFit: 'contain', marginRight: '-30px' }} />
                    <h1 style={{fontSize: '64px', color: '#333', margin: 0, fontWeight: '800', lineHeight: '1'}}>
                        LIB<span style={{color: '#8B6508'}}>YTE</span>
                    </h1>
                </div>  

                <h2 style={{color: '#000', marginBottom: '40px', fontSize: '24px', fontWeight: '600'}}>
                    Access Your Library.<br/>Please log in as:
                </h2>

                <div className="role-buttons">
                    <button onClick={() => handleNavigation('/login/student')} className="role-btn" style={{cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px'}}>
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                        </svg>
                        Student
                    </button>

                    <button onClick={() => handleNavigation('/login/librarian')} className="role-btn" style={{cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px'}}>
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        Librarian
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landing;