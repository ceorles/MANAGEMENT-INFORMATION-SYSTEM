import React, { useState, useEffect } from 'react';

const StudentDashboard = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/api/books/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setBooks(data);
    };

    const handleBorrow = async (bookId) => {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/api/borrow/', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ book_id: bookId })
        });
        
        if (response.ok) {
            alert("Book borrowed successfully!");
            fetchBooks(); // Refresh list to update quantity
        } else {
            alert("Failed to borrow book.");
        }
    };

    return (
        <div>
            <h2>Student Space</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {books.map(book => (
                    <div key={book.id} style={{ border: '2px solid #8B6508', padding: '15px', borderRadius: '10px' }}>
                        <h3>{book.title}</h3>
                        <p>Author: {book.author}</p>
                        <p>Available: {book.quantity}</p>
                        <button 
                            className="submit-btn" 
                            style={{width: '100%', marginTop: '10px'}}
                            onClick={() => handleBorrow(book.id)}
                            disabled={book.quantity === 0}
                        >
                            {book.quantity > 0 ? 'Borrow Book' : 'Out of Stock'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;