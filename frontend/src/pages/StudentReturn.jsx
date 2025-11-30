import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import StudentNavbar from '../components/StudentNavbar';
import '../styles/Student.css';

const StudentReturn = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Search State
    const navigate = useNavigate();
    
    // Modal State
    const [showReadModal, setShowReadModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null); 

    const categories = [
        { key: 'Academic', label: 'Academic / Educational' },
        { key: 'Fiction', label: 'Fiction' },
        { key: 'Non-Fiction', label: 'Non-Fiction' },
        { key: 'Modern', label: 'Modern Literature' },
        { key: 'Graphic', label: 'Graphic Literature' },
        { key: 'Children', label: 'Children Books' },
    ];

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

            if (Array.isArray(data)) {
                setBorrowedBooks(data);
            } else {
                setBorrowedBooks([]);
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
                fetchBorrowedBooks(); 
            } else {
                alert("Failed to return book.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path; 
        return `http://127.0.0.1:8000${path}`;
    };

    // based on search
    const filteredRecords = borrowedBooks.filter(r => 
        r.book_title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const HistoryCard = ({ record }) => (
        <div className="book-card" style={{height: 'auto', paddingBottom: '15px'}}>
            <div className="book-cover">
                {record.book_cover ? (
                    <img 
                        src={getImageUrl(record.book_cover)} 
                        alt={record.book_title} 
                        style={{width:'100%', height:'100%', objectFit:'cover'}} 
                    />
                ) : (
                    <div className="no-cover">No Image</div>
                )}
            </div>

            <div className="book-info">
                <h4>{record.book_title}</h4>
                <p style={{fontSize:'12px', color:'#777'}}>Date: {record.borrow_date}</p>
                
                <div style={{
                    margin: '10px 0', 
                    padding: '5px', 
                    borderRadius: '5px', 
                    textAlign: 'center',
                    backgroundColor: 
                        record.status === 'Pending' ? '#fff3cd' : 
                        record.status === 'Approved' ? '#d4edda' : 
                        record.status === 'Returned' ? '#cce5ff' : '#f8d7da',
                    color: 
                        record.status === 'Pending' ? '#856404' : 
                        record.status === 'Approved' ? '#155724' : 
                        record.status === 'Returned' ? '#004085' : '#721c24',
                    fontWeight: 'bold',
                    fontSize: '14px'
                }}>
                    Status: {record.status}
                </div>

                <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                    {record.status === 'Approved' && (
                        <>
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
                        </>
                    )}

                    {record.status === 'Returned' && (
                        <button 
                            className="action-btn-gold" 
                            onClick={() => navigate(`/student/borrow/${record.book_id}`)}
                        >
                            Borrow Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <StudentNavbar />
            <div className="student-container">
                
                {/* SEARCH BAR */}
                <div className="search-wrapper">
                    <FaSearch className="search-icon"/>
                    <input 
                        type="text" 
                        placeholder="Search your history..." 
                        className="student-search"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {borrowedBooks.length === 0 ? (
                    <p style={{textAlign:'center'}}>You haven't borrowed any books yet.</p>
                ) : (
                    <>
                        {searchTerm ? (
                            <div className="book-grid">
                                {filteredRecords.map(record => (
                                    <HistoryCard key={record.id} record={record} />
                                ))}
                            </div>
                        ) : (
                            categories.map(cat => {
                                // borrowed books by category
                                const recordsInCat = borrowedBooks.filter(r => r.book_category === cat.key);
                                if (recordsInCat.length === 0) return null; // Hide empty categories

                                return (
                                    <div key={cat.key} className="category-section">
                                        <h3>{cat.label}</h3>
                                        <div className="book-row">
                                            {recordsInCat.map(record => (
                                                <HistoryCard key={record.id} record={record} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </>
                )}
            </div>

            {/* READ MODAL */}
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