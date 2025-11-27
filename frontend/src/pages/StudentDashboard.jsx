import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentNavbar from '../components/StudentNavbar';
import { FaSearch } from 'react-icons/fa';
import '../styles/Student.css'; 

const StudentDashboard = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        { key: 'Academic', label: 'Academic / Educational' },
        { key: 'Fiction', label: 'Fiction' },
        { key: 'Non-Fiction', label: 'Non-Fiction' },
        { key: 'Modern', label: 'Modern Literature' },
        { key: 'Graphic', label: 'Graphic Literature' },
        { key: 'Children', label: 'Children Books' },
    ];

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/books/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (Array.isArray(data)) {
                setBooks(data);
            } else {
                console.error("API Error:", data);
                setBooks([]); // Must be empty
            }

        } catch (error) {
            console.error("Error fetching books:", error);
            setBooks([]);
        }
    };

    const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <StudentNavbar />
            
            <div className="student-container">
                {/* Search Bar */}
                <div className="search-wrapper">
                    <FaSearch className="search-icon"/>
                    <input 
                        type="text" 
                        placeholder="Search for a Book" 
                        className="student-search"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {searchTerm ? (
                    <div className="book-grid">
                        {filteredBooks.map(book => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                ) : (
                    categories.map(cat => {
                        const booksInCat = books.filter(b => b.category === cat.key);
                        if (booksInCat.length === 0) return null;

                        return (
                            <div key={cat.key} className="category-section">
                                <h3>{cat.label}</h3>
                                <div className="book-row">
                                    {booksInCat.map(book => (
                                        <BookCard key={book.id} book={book} />
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

// Reusable Card
const BookCard = ({ book }) => (
    <Link to={`/student/book/${book.id}`} className="book-card-link">
        <div className="book-card">
            <div className="book-cover">
                {book.cover_image ? (
                    <img src={`http://127.0.0.1:8000${book.cover_image}`} alt={book.title} />
                ) : (
                    <div className="no-cover">No Image</div>
                )}
            </div>
            <div className="book-info">
                <h4>{book.title}</h4>
                <p>{book.category}</p>
            </div>
        </div>
    </Link>
);

export default StudentDashboard;