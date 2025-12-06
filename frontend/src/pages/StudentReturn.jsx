import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaQuestionCircle, FaCheckCircle } from 'react-icons/fa';
import StudentNavbar from '../components/StudentNavbar';
import '../styles/Student.css';
import { API_URL } from '../apiConfig';

const StudentReturn = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    
    // --- MODAL STATES ---
    const [showReadModal, setShowReadModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false); 
    const [showSuccessReturnModal, setShowSuccessReturnModal] = useState(false);
    
    const [selectedBook, setSelectedBook] = useState(null); 
    const [recordToReturn, setRecordToReturn] = useState(null);

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
        const token = sessionStorage.getItem('access_token');
        try {
            const response = await fetch(`${API_URL}/api/student/borrowed-books/`, {
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

    const handleReturnClick = (recordId) => {
        setRecordToReturn(recordId);
        setShowReturnModal(true);
    };

    const confirmReturn = async () => {
        if (!recordToReturn) return;

        const token = sessionStorage.getItem('access_token');
        try {
            const response = await fetch(`${API_URL}/api/return/`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ record_id: recordToReturn })
            });

            if (response.ok) {
                setShowReturnModal(false);
                setRecordToReturn(null);
                fetchBorrowedBooks(); 
                setShowSuccessReturnModal(true);
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
        return `${API_URL}${path}`;
    };

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
                            <button className="action-btn-brown" onClick={() => handleReturnClick(record.id)}>
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
                                const recordsInCat = borrowedBooks.filter(r => r.book_category === cat.key);
                                if (recordsInCat.length === 0) return null;

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

            {/* read sypnosis */}
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

            {/* confirm pop out box */}
            {showReturnModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <FaQuestionCircle size={50} color="#8B6508" style={{marginBottom: '15px'}} />
                        <h3 className="modal-header">Return Book</h3>
                        <p className="modal-text">Are you sure you want to return this book?</p>
                        
                        <div style={{display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px'}}>
                            <button 
                                onClick={() => setShowReturnModal(false)}
                                style={{backgroundColor: '#ccc', color: '#333', padding: '10px 30px', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px'}}
                            >
                                Cancel
                            </button>
                            <button onClick={confirmReturn} className="btn-modal-ok">OK</button>
                        </div>
                    </div>
                </div>
            )}

            {/* success pop out box*/}
            {showSuccessReturnModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <FaCheckCircle size={50} color="#8B6508" style={{marginBottom: '10px'}} />
                        <h3 className="modal-header">Success!</h3>
                        <p className="modal-text">Book returned successfully!</p>
                        <button className="btn-modal-ok" onClick={() => setShowSuccessReturnModal(false)}>
                            OK
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default StudentReturn;