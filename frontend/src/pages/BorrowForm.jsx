import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import { FaChevronLeft, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; 
import { jwtDecode } from "jwt-decode";
import '../styles/Student.css';
import LoadingScreen from '../components/LoadingScreen';

const BorrowForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        student_id: '',
        book_title: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        let decodedName = '';
        let decodedId = '';

        if (token) {
            try {
                const decoded = jwtDecode(token);
                decodedName = decoded.name;
                decodedId = decoded.student_id;
            } catch (error) {
                console.error("Token error:", error);
            }
        }
        // --------------------------------------

        const fetchBook = async () => {
            const response = await fetch(`http://127.0.0.1:8000/api/books/${id}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setBook(data);
            
            setFormData({
                name: decodedName || '', 
                student_id: decodedId || '',
                book_title: data.title,
                date: new Date().toISOString().split('T')[0]
            });
        };

        if (token) fetchBook();
    }, [id]);

    const handleConfirmBorrow = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('access_token');
        
        try {
            const response = await fetch('http://127.0.0.1:8000/api/borrow/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ book_id: book.id }) 
            });
            
            const data = await response.json();

            if (response.ok) {
                setShowSuccessModal(true);
            } else {
                setErrorMessage(data.error || "Could not borrow book.");
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("Network error. Please try again.");
            setShowErrorModal(true);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccessModal(false);
        navigate('/student/return');
    } 

    const handleCloseError = () => {
        setShowErrorModal(false);
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `http://127.0.0.1:8000${path}`;
    };

    if (!book) return <LoadingScreen />;

    return (
        <div className="dashboard-bg">
            <StudentNavbar />
            <div className="student-container" style={{maxWidth: 900, margin: '0 auto', padding: '32px 8px', width: '100%'}}>
                <button className="back-btn" onClick={() => navigate(-1)} style={{marginBottom: 24, marginTop: 18, borderRadius: 18, boxShadow: '0 2px 8px rgba(139,101,8,0.08)', background: 'none', color: '#8B6508', fontWeight: 600, fontSize: '1rem', padding: '10px 22px'}}>
                    <FaChevronLeft /> Back
                </button>

                <div className="details-layout" style={{background: 'rgba(255,255,255,0.85)', borderRadius: 32, boxShadow: '0 8px 32px rgba(139,101,8,0.12), 0 1.5px 8px 0 rgba(255,215,0,0.08)', padding: '40px 48px', marginBottom: 32, backdropFilter: 'blur(8px)', width: '100%', display: 'flex', flexDirection: window.innerWidth <= 600 ? 'column' : 'row', gap: window.innerWidth <= 600 ? 12 : 40, alignItems: 'flex-start'}}>
                    <div className="details-image" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: window.innerWidth <= 600 ? '100%' : 'auto', minWidth: window.innerWidth <= 600 ? '0' : '220px', maxWidth: window.innerWidth <= 600 ? '100%' : '220px'}}>
                        {book.cover_image ? (
                            <img 
                                src={getImageUrl(book.cover_image)} 
                                alt={book.title} 
                                style={{objectFit: 'cover', boxShadow: '0 4px 16px rgba(139,101,8,0.10)', background: '#fffbe6', marginBottom: 12}}
                            />
                        ) : (
                            <div className="no-cover-large" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7e9c4', color: '#8B6508', fontSize: '1.2rem', fontWeight: 600, marginBottom: 12, boxShadow: '0 4px 16px rgba(139,101,8,0.10)'}}>No Image</div>
                        )}
                        <h2 style={{marginTop: 18, fontSize: '2.2rem', fontWeight: 700, color: '#8B6508', textAlign: 'center', letterSpacing: 1}}>{book.title}</h2>
                        <p style={{fontSize: '1.2rem', color: '#555', marginTop: 4, marginBottom: 0, textAlign: 'center'}}><b>by {book.author}</b></p>
                    </div>
                    <div className="details-info" style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 0, width: '100%', minWidth: 0}}>
                        <div className="form-header" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 18, paddingBottom: 8, position: 'relative'}}>
                            <span className="form-accent" style={{width: 48, height: 6, borderRadius: 6, background: 'linear-gradient(90deg, #8B6508 0%, #FFD700 100%)', marginBottom: 8}}></span>
                            <h3 style={{fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', marginBottom: 4}}>Borrow Book Form</h3>
                            <p className="form-desc" style={{fontSize: '1rem', color: '#555', marginBottom: 0}}>Please fill out the form below to borrow this book.</p>
                        </div>
                        <form onSubmit={handleConfirmBorrow} className="borrow-form" style={{display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(255,249,220,0.4)', borderRadius: 16, boxShadow: '0 2px 8px rgba(139,101,8,0.05)', padding: '24px 20px'}}>
                            <div className="form-group" style={{display: 'flex', flexDirection: 'column', marginBottom: 10}}>
                                <label style={{fontWeight: 600, color: '#8B6508', marginBottom: 4}}>Name:</label>
                                <input type="text" value={formData.name} readOnly className="form-input-box" style={{padding: '10px 14px', borderRadius: 12, border: '1.5px solid #8B6508', fontSize: '1.08rem', color: '#222', marginBottom: 8, boxShadow: '0 2px 8px rgba(139,101,8,0.08)', outline: 'none', textAlign: 'left'}} />
                            </div>
                            <div className="form-group" style={{display: 'flex', flexDirection: 'column', marginBottom: 10}}>
                                <label style={{fontWeight: 600, color: '#8B6508', marginBottom: 4}}>Student ID:</label>
                                <input type="text" value={formData.student_id} readOnly className="form-input-box" style={{padding: '10px 14px', borderRadius: 12, border: '1.5px solid #8B6508', fontSize: '1.08rem', color: '#222', marginBottom: 8, boxShadow: '0 2px 8px rgba(139,101,8,0.08)', outline: 'none', textAlign: 'left'}} />
                            </div>
                            <div className="form-group" style={{display: 'flex', flexDirection: 'column', marginBottom: 10}}>
                                <label style={{fontWeight: 600, color: '#8B6508', marginBottom: 4}}>Book Name:</label>
                                <input type="text" value={formData.book_title} readOnly className="form-input-box" style={{padding: '10px 14px', borderRadius: 12, border: '1.5px solid #8B6508', fontSize: '1.08rem', color: '#222', marginBottom: 8, boxShadow: '0 2px 8px rgba(139,101,8,0.08)', outline: 'none', textAlign: 'left'}} />
                            </div>
                            <div className="form-group" style={{display: 'flex', flexDirection: 'column', marginBottom: 10}}>
                                <label style={{fontWeight: 600, color: '#8B6508', marginBottom: 4}}>Date of Borrow:</label>
                                <input type="date" value={formData.date} readOnly className="form-input-box" style={{padding: '10px 14px', borderRadius: 12, border: '1.5px solid #8B6508', fontSize: '1.08rem', color: '#222', marginBottom: 8, boxShadow: '0 2px 8px rgba(139,101,8,0.08)', outline: 'none', textAlign: 'left'}} />
                            </div>
                            <button type="submit" className="borrow-btn-large" style={{background: '#8B6508', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 18, padding: '12px 0', fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(139,101,8,0.10)', cursor: 'pointer', marginTop: 12, width: 180, alignSelf: 'center', transition: 'background 0.2s'}}>
                                Borrow
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-box" style={{background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(139,101,8,0.18)', padding: '32px 28px', minWidth: 320, maxWidth: '90vw', textAlign: 'center'}}>
                        <FaCheckCircle size={50} color="#8B6508" style={{marginBottom: 10}} />
                        <h3 className="modal-header" style={{fontSize: '1.3rem', fontWeight: 700, marginBottom: 10, color: '#8B6508'}}>Success!</h3>
                        <p className="modal-text" style={{fontSize: '1rem', color: '#374151', marginBottom: 18}}>
                            The book has been recorded in the Librarian Dashboard.
                        </p>
                        <button className="btn-modal-ok" onClick={handleCloseSuccess} style={{background: 'linear-gradient(90deg, #8B6508 0%, #FFD700 100%)', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 8, padding: '10px 32px', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(139,101,8,0.10)', transition: 'background 0.2s'}}>
                            OK
                        </button>
                    </div>
                </div>
            )}

            {showErrorModal && (
                <div className="modal-overlay">
                    <div className="modal-box" style={{background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(139,101,8,0.18)', padding: '32px 28px', minWidth: 320, maxWidth: '90vw', textAlign: 'center'}}>
                        <FaExclamationCircle size={50} color="#cc0000" style={{marginBottom: 10}} />
                        <h3 className="modal-header" style={{fontSize: '1.3rem', fontWeight: 700, marginBottom: 10, color: '#cc0000'}}>Oops!</h3>
                        <p className="modal-text" style={{fontSize: '1rem', color: '#374151', marginBottom: 18}}>{errorMessage}</p>
                        <button className="btn-modal-ok" onClick={handleCloseError} style={{background: '#cc0000', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 8, padding: '10px 32px', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(139,101,8,0.10)', transition: 'background 0.2s'}}>
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BorrowForm;