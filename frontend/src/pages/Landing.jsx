import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="landing-container">
            <div className="landing-content">
                <div className="landing-logo">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#8B6508" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    <h1 style={{fontSize: '48px', color: '#333', marginLeft: '10px'}}>
                        LIB<span style={{color: '#8B6508'}}>YTE</span>
                    </h1>
                </div>

                <h2 style={{color: '#000', marginBottom: '30px'}}>
                    Access Your Library.<br/>Please log in as:
                </h2>

                <div className="role-buttons">
                    <Link to="/login/student" className="role-btn">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px'}}>
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                        </svg>
                        Student
                    </Link>

                    <Link to="/login/librarian" className="role-btn">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '10px'}}>
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        Librarian
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Landing;