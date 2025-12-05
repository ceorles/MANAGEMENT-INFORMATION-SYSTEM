import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BorrowedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/borrowed-books/')
      .then(response => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch borrowed books.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading borrowed books...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Borrowed Books</h2>
      {books.length === 0 ? (
        <p>You have not borrowed any books.</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Author</th>
              <th className="py-2 px-4 border-b">Borrowed Date</th>
              <th className="py-2 px-4 border-b">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, idx) => (
              <tr key={idx}>
                <td className="py-2 px-4 border-b">{book.title}</td>
                <td className="py-2 px-4 border-b">{book.author}</td>
                <td className="py-2 px-4 border-b">{book.borrowed_date}</td>
                <td className="py-2 px-4 border-b">{book.due_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BorrowedBooks;
