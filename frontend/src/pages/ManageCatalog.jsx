import React, { useState, useEffect } from 'react';
import LibrarianSidebar from '../components/LibrarianSidebar';
import { FaTrash, FaPlus, FaCheckCircle, FaUpload } from 'react-icons/fa';
import '../styles/Dashboard.css';

const ManageCatalog = () => {
    const [books, setBooks] = useState([]);
    
    // success box
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // form state
    const [formData, setFormData] = useState({
        title: '', author: '', isbn: '', quantity: 1, category: 'Fiction', synopsis: '', cover_image: null
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        const token = localStorage.getItem('access_token');
        const res = await fetch('http://127.0.0.1:8000/api/books/manage/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setBooks(data);
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Delete this book?")) return;
        const token = localStorage.getItem('access_token');
        await fetch(`http://127.0.0.1:8000/api/books/manage/${id}/`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchBooks();
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, cover_image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');

        const data = new FormData();
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('isbn', formData.isbn);
        data.append('quantity', formData.quantity);
        data.append('category', formData.category);
        data.append('synopsis', formData.synopsis);
        if (formData.cover_image) {
            data.append('cover_image', formData.cover_image);
        }

        const response = await fetch('http://127.0.0.1:8000/api/books/manage/', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: data
        });

        if (response.ok) {
            setShowSuccessModal(true); // success box
            fetchBooks();
            setFormData({ title: '', author: '', isbn: '', quantity: 1, category: 'Fiction', synopsis: '', cover_image: null });
            // taga reset  ng file input visual
            document.getElementById('fileInput').value = ""; 
        } else {
            alert("Failed to add book.");
        }
    };

    return (
        <div className="dashboard-container">
            <LibrarianSidebar />
            <div className="main-content">
                
                {/* ADD BOOK FORM SECTION */}
                <div className="card" style={{ marginBottom: '30px', borderTop: '5px solid #8B6508' }}>
                    <div className="card-header">
                        <h2 style={{margin:0}}>Add New Book</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px'}}>
                        
                        {/* Left Column */}
                        <div>
                            <label style={{display:'block', fontWeight:'bold', marginBottom:'5px'}}>Title:</label>
                            <input type="text" className="modal-input" required 
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})} 
                            />

                            <label style={{display:'block', fontWeight:'bold', marginBottom:'5px'}}>Author:</label>
                            <input type="text" className="modal-input" required 
                                value={formData.author}
                                onChange={e => setFormData({...formData, author: e.target.value})} 
                            />

                            <div style={{display:'flex', gap:'10px'}}>
                                <div style={{flex:1}}>
                                    <label style={{display:'block', fontWeight:'bold', marginBottom:'5px'}}>ISBN:</label>
                                    <input type="text" className="modal-input" required 
                                        value={formData.isbn}
                                        onChange={e => setFormData({...formData, isbn: e.target.value})} 
                                    />
                                </div>
                                <div style={{flex:1}}>
                                    <label style={{display:'block', fontWeight:'bold', marginBottom:'5px'}}>Qty:</label>
                                    <input type="number" className="modal-input" required 
                                        value={formData.quantity}
                                        onChange={e => setFormData({...formData, quantity: e.target.value})} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                            <label style={{display:'block', fontWeight:'bold', marginBottom:'5px'}}>Category:</label>
                            <select className="modal-input" 
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="Fiction">Fiction</option>
                                <option value="Academic">Academic</option>
                                <option value="Non-Fiction">Non-Fiction</option>
                                <option value="Modern">Modern Literature</option>
                                <option value="Graphic">Graphic Literature</option>
                                <option value="Children">Children Books</option>
                            </select>

                            <label style={{display:'block', fontWeight:'bold', marginBottom:'5px'}}>Synopsis:</label>
                            <textarea className="modal-input" rows="2" 
                                value={formData.synopsis}
                                onChange={e => setFormData({...formData, synopsis: e.target.value})}
                            ></textarea>

                            <label style={{display:'block', fontWeight:'bold', marginBottom:'5px'}}>Cover Image:</label>
                            <div style={{display:'flex', gap:'10px'}}>
                                <input type="file" id="fileInput" className="modal-input" onChange={handleFileChange} style={{flex:1}} />
                                <button type="submit" className="btn-confirm" style={{height:'42px', display:'flex', alignItems:'center', gap:'5px'}}>
                                    <FaPlus /> Add Book
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* BOOK LIST TABLE */}
                <div className="card">
                    <div className="card-header">
                        <h2 style={{margin:0}}>Book Catalog List</h2>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Qty</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(b => (
                                <tr key={b.id}>
                                    <td>{b.title}</td>
                                    <td>{b.author}</td>
                                    <td>{b.category}</td>
                                    <td>{b.quantity}</td>
                                    <td>
                                        <button className="action-btn delete-btn" onClick={() => handleDelete(b.id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <FaCheckCircle size={50} color="#8B6508" style={{marginBottom: '10px'}} />
                        <h3 className="modal-header">Success!</h3>
                        <p className="modal-text">New book has been added to the catalog.</p>
                        <button className="btn-confirm" onClick={() => setShowSuccessModal(false)}>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCatalog;