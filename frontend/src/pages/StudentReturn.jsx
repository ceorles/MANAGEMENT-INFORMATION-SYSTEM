import React, { useState, useEffect } from 'react';
import StudentNavbar from '../components/StudentNavbar';
import '../styles/Student.css';

const StudentReturn = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    
    const [showReadModal, setShowReadModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null); 

    useEffect(() => {
        fetchBorrowedBooks();
    }, []);

    const fetchBorrowedBooks = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/student/borrowed-books/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok && Array.isArray(data)) {
                setBorrowedBooks(data);
            } else {
                console.error("API Error:", data);
                setBorrowedBooks([]); // Must be empty
            }
            
        } catch (error) {
            console.error("Error fetching books:", error);
            setBorrowedBooks([]); 
        }
    };

    const handleReturn = async (recordId) => {
        if (!window.confirm("Are you sure you want to return this book?")) return;

        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/return/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ record_id: recordId })
            });

            if (response.ok) {
                alert("Book returned successfully!");
               
                setBorrowedBooks(borrowedBooks.filter(item => item.id !== recordId));
            } else {
                alert("Failed to return book.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <StudentNavbar />
            <div className="student-container">
                <h2>My Borrowed Books</h2>
                
                {borrowedBooks.length === 0 ? (
                    <p>You haven't borrowed any books yet.</p>
                ) : (
                    <div className="book-grid">
                        {borrowedBooks.map(record => (
                            <div key={record.id} className="book-card" style={{height: 'auto', paddingBottom: '15px'}}>
                                
                                <div className="book-cover">
                                    {record.book_cover ? (
                                        <img 
                                            src={`http://127.0.0.1:8000${record.book_cover}`} 
                                            alt={record.book_title} 
                                            style={{width:'100%', height:'100%', objectFit:'cover'}} 
                                        />
                                    ) : (
                                        <div className="no-cover">No Image</div>
                                    )}
                                </div>

                                <div className="book-info">
                                    <h4>{record.book_title}</h4>
                                    <p>Borrowed: {record.borrow_date}</p>
                                    
                                    <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'10px'}}>
                                        
                                        <button className="action-btn-gold" onClick={() => {
                                            setSelectedBook({ 
                                                title: record.book_title, 
                                                synopsis: record.book_synopsis 
                                            });
                                            setShowReadModal(true);
                                        }}>
                                            Read
                                        </button>

                                        <button className="action-btn-brown" onClick={() => handleReturn(record.id)}>
                                            Return
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showReadModal && (
                <div className="modal-overlay">
                    <div className="modal-box" style={{textAlign:'left'}}>
                        <h3 className="modal-header">{selectedBook?.title}</h3>
                        <p style={{fontStyle:'italic', marginBottom:'10px'}}>Synopsis:</p>
                        
                        <p className="modal-text">
                            {selectedBook?.synopsis || "No synopsis available."}
                        </p>

                        <div style={{textAlign:'center'}}>
                            <button className="btn-modal-ok" onClick={() => setShowReadModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentReturn;