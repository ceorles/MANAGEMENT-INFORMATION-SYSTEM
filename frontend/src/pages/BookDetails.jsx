import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import { FaChevronLeft } from 'react-icons/fa';
import '../styles/Student.css';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [relatedBooks, setRelatedBooks] = useState([]);

    useEffect(() => {
        fetchBookDetails();
    }, [id]);

    const fetchBookDetails = async () => {
        const token = localStorage.getItem('access_token');
        
        const res = await fetch(`http://127.0.0.1:8000/api/books/${id}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setBook(data);

        const resRel = await fetch(`http://127.0.0.1:8000/api/books/related/?category=${data.category}&book_id=${data.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataRel = await resRel.json();
        setRelatedBooks(dataRel);
    };

    const handleBorrow = () => {
        navigate(`/student/borrow/${book.id}`);
    };

    if (!book) return <div>Loading...</div>;

    return (
        <div>
            <StudentNavbar />
            <div className="student-container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FaChevronLeft /> Back
                </button>

                <div className="details-layout">
                    <div className="details-image">
                        {book.cover_image ? (
                            <img src={`http://127.0.0.1:8000${book.cover_image}`} alt={book.title} />
                        ) : (
                            <div className="no-cover-large">No Image</div>
                        )}
                    </div>

                    <div className="details-info">
                        <h1>{book.title}</h1>
                        <h3 style={{color: '#555'}}>by {book.author}</h3>
                        
                        <p className="synopsis">
                            {book.synopsis || "No synopsis available for this book."}
                        </p>

                        <button className="borrow-btn-large" onClick={handleBorrow} disabled={book.quantity <= 0}>
                            {book.quantity > 0 ? 'Borrow' : 'Out of Stock'}
                        </button>

                        <div className="more-like-this">
                            <hr />
                            <h3>More like this</h3>
                            <div className="mini-grid">
                                {relatedBooks.map(b => (
                                    <Link key={b.id} to={`/student/book/${b.id}`} className="mini-card">
                                        {b.cover_image ? (
                                            <img src={`http://127.0.0.1:8000${b.cover_image}`} alt={b.title} />
                                        ) : <div className="no-cover-mini"></div>}
                                        <p>{b.title}</p>
                                        <span>{b.author}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;