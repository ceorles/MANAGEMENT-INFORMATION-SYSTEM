import React, { useState } from 'react';
import booksImg from '../assets/books.png';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaExclamationCircle } from 'react-icons/fa'; 
import '../styles/Login.css';
import { jwtDecode } from "jwt-decode";
import LoadingScreen from '../components/LoadingScreen';
import { API_URL } from '../apiConfig';

const Login = ({ userType }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); // loading

    // pop out box
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const title = userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : "User";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // loading

        console.log("Attempting to login to:", `${API_URL}/api/login/`); 

        try {
            const response = await fetch(`${API_URL}/api/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem('access_token', data.access);
                sessionStorage.setItem('refresh_token', data.refresh);
                
                const decoded = jwtDecode(data.access);
                const role = decoded.role;

                if (userType && role !== userType) {
                   setIsLoading(false); // stop loading to show error
                   setErrorMessage(`Error: This account is a ${role}, but you are trying to log in as a ${userType}.`);
                   setShowErrorModal(true);
                   sessionStorage.clear();
                   return;
                }

                // animation
                setTimeout(() => {
                    if (role === 'student') {
                        navigate('/student-dashboard');
                    } else if (role === 'librarian') {
                        navigate('/librarian-dashboard');
                    } 
                }, 1500);

            } else {
                setIsLoading(false);
                setErrorMessage(data.detail || "Invalid credentials");
                setShowErrorModal(true);
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Error:", error);
            setErrorMessage("Could not connect to the server.");
            setShowErrorModal(true);
        }
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <div className="login-card-outer large">
            <div className="login-card-image large">
                <img src={booksImg} alt="Books" />
            </div>
            <div className="login-card-form large">
                <div className="login-back-btn-row">
                    <Link to="/" className="login-back-btn" aria-label="Back">
                        <FaArrowLeft size={18} />
                        <span className="login-back-btn-text">Back</span>
                    </Link>
                </div>
                <h2 className="login-main-title">Log In as {title}</h2>
                <p className="login-subtitle">Enter your credentials to access your account.</p>
                
                <form onSubmit={handleSubmit} className="login-form-modern">
                    <div className="form-group">
                        <label>Username or Email:</label>
                        <input 
                            type="text" 
                            name="username"
                            placeholder="Username or Email"
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            autoComplete="username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Password"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn-modern">Log In</button>
                </form>

                <div className="signup-link-container-modern">
                    <span>Don't have Account? </span>
                    {userType === 'student' && (
                        <Link to="/signup/student" className="signup-link-modern">Signup</Link>
                    )}
                    {userType === 'librarian' && (
                        <Link to="/signup/librarian" className="signup-link-modern">Signup</Link>
                    )}
                </div>
            </div>

            {showErrorModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <FaExclamationCircle size={50} color="#cc0000" style={{marginBottom: '10px'}} />
                        <h3 className="modal-header" style={{color: '#cc0000'}}>Login Error</h3>
                        <p className="modal-text">{errorMessage}</p>
                        <button 
                            className="btn-modal-ok" 
                            onClick={() => setShowErrorModal(false)}
                            style={{backgroundColor: '#cc0000'}}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;