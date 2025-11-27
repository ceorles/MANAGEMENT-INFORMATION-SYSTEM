import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import { FaChevronLeft, FaCheckCircle } from 'react-icons/fa';
import '../styles/Student.css';

const BorrowForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        student_id: '',
        book_title: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const storedName = localStorage.getItem('user_name');
        const storedId = localStorage.getItem('student_id');

        const fetchBook = async () => {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://127.0.0.1:8000/api/books/${id}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setBook(data);
            
            setFormData({
                name: storedName || '',
                student_id: storedId || '',
                book_title: data.title,
                date: new Date().toISOString().split('T')[0]
            });
        };

        fetchBook();
    }, [id]);

    const handleConfirmBorrow = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        
        try {
            const response = await fetch('http://127.0.0.1:8000/api/borrow/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ book_id: book.id }) 
            });
            
            if (response.ok) {
                setShowModal(true);
            } else {
                const err = await response.json();
                alert("Error: " + (err.error || "Could not borrow book."));
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate('/student-dashboard'); // Go back to dashboard
    };

    if (!book) return <div>Loading...</div>;

    return (
        <div>
            <StudentNavbar />
            <div className="student-container">
                <button className="back-btn" onClick={() => navigate(-1)} style={{marginBottom: '20px'}}>
                    <FaChevronLeft /> Back
                </button>

                <div className="details-layout">
                    <div className="details-image">
                        {book.cover_image ? (
                            <img src={`http://127.0.0.1:8000${book.cover_image}`} alt={book.title} />
                        ) : (
                            <div className="no-cover-large">No Image</div>
                        )}
                        <h2 style={{marginTop: '20px', fontSize: '24px'}}>{book.title}</h2>
                        <p style={{fontWeight:'bold'}}>by {book.author}</p>
                    </div>

                    <div className="details-info" style={{paddingLeft: '50px'}}>
                        <p style={{fontStyle: 'italic', color: '#555', marginBottom: '20px'}}>
                            Please kindly fill up the forms to borrow the book
                        </p>

                        <form onSubmit={handleConfirmBorrow} className="borrow-form">
                            <label>Name:</label>
                            <input type="text" value={formData.name} readOnly className="form-input-box" />

                            <label>Student ID:</label>
                            <input type="text" value={formData.student_id} readOnly className="form-input-box" />

                            <label>Book Name:</label>
                            <input type="text" value={formData.book_title} readOnly className="form-input-box" />

                            <label>Date of Borrow:</label>
                            <input type="date" value={formData.date} readOnly className="form-input-box" />

                            <button type="submit" className="borrow-btn-large" style={{width: '200px'}}>
                                Borrow
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <FaCheckCircle size={50} color="#8B6508" style={{marginBottom: '10px'}} />
                        <h3 className="modal-header">Success!</h3>
                        <p className="modal-text">
                            The book has been recorded in the Librarian Dashboard.
                        </p>
                        <button className="btn-modal-ok" onClick={handleCloseModal}>
                            OK
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BorrowForm;