import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import LoadingScreen from '../components/LoadingScreen';
import { FaChevronLeft } from 'react-icons/fa';
import '../styles/Student.css'; 
import '../styles/BookDetails.css';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [relatedBooks, setRelatedBooks] = useState([]);

    useEffect(() => {
        fetchBookDetails();
    }, [id]);

    const fetchBookDetails = async () => {
        const token = sessionStorage.getItem('access_token');
        
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/books/${id}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setBook(data);

            if (data.category) {
                const resRel = await fetch(`http://127.0.0.1:8000/api/books/related/?category=${data.category}&book_id=${data.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dataRel = await resRel.json();
                setRelatedBooks(dataRel);
            }
        } catch (error) {
            console.error("Error loading book:", error);
        }
    };

    const handleBorrow = () => {
        navigate(`/student/borrow/${book.id}`);
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `http://127.0.0.1:8000${path}`;
    };

    if (!book) return <LoadingScreen />;

    return (
        <div className="dashboard-bg">
            <div className="grid"></div>
            <StudentNavbar />
            
            <div className="student-container">
                <button className="back-btn" onClick={() => navigate(-1)} style={{marginBottom: '20px'}}>
                    <FaChevronLeft /> Back
                </button>

                <div className="details-layout">
                    
                    <div className="details-card-glass">
                    
                        <div className="details-image">
                            {book.cover_image ? (
                                <img 
                                    src={getImageUrl(book.cover_image)} 
                                    alt={book.title} 
                                />
                            ) : (
                                <div className="no-cover-large">No Image</div>
                            )}
                        </div>
                        <div className="details-info">
                            <h1 className="details-title">{book.title}</h1>
                            <h3 className="details-author">by {book.author}</h3>
                            
                            <div className="details-meta">
                                <span className="details-category">{book.category}</span>
                                <span className="details-quantity">
                                    {book.quantity > 0 ? `${book.quantity} Available` : 'Out of Stock'}
                                </span>
                            </div>

                            <p className="synopsis">
                                {book.synopsis || "No synopsis available for this book."}
                            </p>

                            <button 
                                className="borrow-btn-large" 
                                onClick={handleBorrow} 
                                disabled={book.quantity <= 0}
                            >
                                {book.quantity > 0 ? 'Borrow' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>

                    {relatedBooks.length > 0 && (
                        <div className="more-like-this modern-more-like">
                            <h3 style={{borderLeft: '5px solid #8B6508', paddingLeft: '10px', marginBottom: '20px'}}>
                                More like this
                            </h3>
                            <div className="mini-grid modern-mini-grid">
                                {relatedBooks.map(b => (
                                    <Link key={b.id} to={`/student/book/${b.id}`} className="mini-card modern-mini-card">
                                        {b.cover_image ? (
                                            <img 
                                                src={getImageUrl(b.cover_image)} 
                                                alt={b.title} 
                                            />
                                        ) : <div className="no-cover-mini"></div>}
                                        <p>{b.title}</p>
                                        <span>{b.author}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetails;