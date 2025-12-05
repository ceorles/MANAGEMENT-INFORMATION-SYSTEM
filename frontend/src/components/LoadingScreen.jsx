import React from 'react';
import logo from '../assets/logo.png';
import '../styles/Student.css';

const LoadingScreen = () => {
    return (
        <div className="loading-container">
            <div className="loading-content">
                <img src={logo} alt="Loading..." className="loading-logo" />
                <div className="loading-bar"></div>
            </div>
        </div>
    );
};

export default LoadingScreen;