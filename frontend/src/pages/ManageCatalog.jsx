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

    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (typeof window === 'undefined') return;
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
        <div className="dashboard-container" style={{background: 'linear-gradient(135deg, #fffbe6 0%, #f7e9c4 100%)', minHeight: '100vh'}}>
            <LibrarianSidebar />
            <div className="main-content" style={{marginLeft: isMobile ? 0 : '230px', padding: '24px 16px', minHeight: '100vh'}}>

                {/* ADD BOOK FORM SECTION */}
                <div className="card" style={{ marginBottom: '26px', borderTop: '4px solid #8B6508', background: 'rgba(255,255,255,0.96)', borderRadius: 18, boxShadow: '0 8px 24px rgba(139,101,8,0.12)', padding: 20, maxWidth: '1100px', marginLeft: isMobile ? 0 : '40px' }}>
                    <div className="card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                        <h2 style={{margin:0, color: '#8B6508', fontWeight: 700, letterSpacing: 1}}>Add New Book</h2>
                    </div>

                    <form onSubmit={handleSubmit} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginTop: '6px'}}>
                        {/* Left Column */}
                        <div>
                            <label style={{display:'block', fontWeight:'bold', marginBottom:'5px', color:'#8B6508'}}>Title:</label>
                            <input type="text" className="modal-input" required 
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})} 
                            />

                            <label style={{display:'block', fontWeight:'bold', marginBottom:'5px', color:'#8B6508'}}>Author:</label>
                            <input type="text" className="modal-input" required 
                                value={formData.author}
                                onChange={e => setFormData({...formData, author: e.target.value})} 
                            />

                            <div style={{display:'flex', gap:'10px'}}>
                                <div style={{flex:1}}>
                                    <label style={{display:'block', fontWeight:'bold', marginBottom:'5px', color:'#8B6508'}}>ISBN:</label>
                                    <input type="text" className="modal-input" required 
                                        value={formData.isbn}
                                        onChange={e => setFormData({...formData, isbn: e.target.value})} 
                                    />
                                </div>
                                <div style={{flex:1}}>
                                    <label style={{display:'block', fontWeight:'bold', marginBottom:'5px', color:'#8B6508'}}>Qty:</label>
                                    <input type="number" className="modal-input" required 
                                        value={formData.quantity}
                                        onChange={e => setFormData({...formData, quantity: e.target.value})} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                            <label style={{display:'block', fontWeight:'bold', marginBottom:'5px', color:'#8B6508'}}>Category:</label>
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

                            <label style={{display:'block', fontWeight:'bold', marginBottom:'5px', color:'#8B6508'}}>Synopsis:</label>
                            <textarea className="modal-input" rows="2" 
                                value={formData.synopsis}
                                onChange={e => setFormData({...formData, synopsis: e.target.value})}
                            ></textarea>

                            <label style={{display:'block', fontWeight:'bold', marginBottom:'5px', color:'#8B6508'}}>Cover Image:</label>
                            <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                                <input type="file" id="fileInput" className="modal-input" onChange={handleFileChange} style={{flex:1}} />
                                <button type="submit" className="btn-confirm" style={{height:'42px', display:'flex', alignItems:'center', gap:'6px', background: 'linear-gradient(135deg, #d4af37 0%, #8B6508 100%)', borderRadius: 14, padding: '0 16px', border: 'none', fontWeight: 600}}>
                                    <FaPlus /> Add Book
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* BOOK LIST TABLE */}
                <div className="card" style={{background: 'rgba(255,255,255,0.96)', borderRadius: 18, boxShadow: '0 8px 24px rgba(139,101,8,0.12)', padding: 20, maxWidth: '1100px', marginLeft: isMobile ? 0 : '40px'}}>
                    <div className="card-header" style={{marginBottom: 10}}>
                        <h2 style={{margin:0, color:'#8B6508', fontWeight:700, letterSpacing:1}}>Book Catalog List</h2>
                    </div>

                    <div style={{overflowX:'auto'}}>
                        <table style={{width:'100%', borderCollapse:'collapse', minWidth:500}}>
                            <thead>
                                <tr>
                                    <th style={{textAlign:'left', padding:'10px 8px', borderBottom:'2px solid #f0e2bf', color:'#8B6508', fontSize:14}}>Title</th>
                                    <th style={{textAlign:'left', padding:'10px 8px', borderBottom:'2px solid #f0e2bf', color:'#8B6508', fontSize:14}}>Author</th>
                                    <th style={{textAlign:'left', padding:'10px 8px', borderBottom:'2px solid #f0e2bf', color:'#8B6508', fontSize:14}}>Category</th>
                                    <th style={{textAlign:'left', padding:'10px 8px', borderBottom:'2px solid #f0e2bf', color:'#8B6508', fontSize:14}}>Qty</th>
                                    <th style={{textAlign:'left', padding:'10px 8px', borderBottom:'2px solid #f0e2bf', color:'#8B6508', fontSize:14}}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((b, index) => (
                                    <tr key={b.id} style={{background: index % 2 === 0 ? '#fff' : '#fffaf0'}}>
                                        <td style={{padding:'10px 8px', borderBottom:'1px solid #f3e6c7', color:'#333', fontWeight:500}}>{b.title}</td>
                                        <td style={{padding:'10px 8px', borderBottom:'1px solid #f3e6c7', color:'#555'}}>{b.author}</td>
                                        <td style={{padding:'10px 8px', borderBottom:'1px solid #f3e6c7', color:'#555'}}>{b.category}</td>
                                        <td style={{padding:'10px 8px', borderBottom:'1px solid #f3e6c7', color:'#555'}}>{b.quantity}</td>
                                        <td style={{padding:'10px 8px', borderBottom:'1px solid #f3e6c7'}}>
                                            <button className="action-btn delete-btn" onClick={() => handleDelete(b.id)} style={{
                                                border:'none',
                                                background:'rgba(220,53,69,0.09)',
                                                color:'#b02a37',
                                                padding:'6px 8px',
                                                borderRadius:10,
                                                cursor:'pointer'
                                            }}>
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {books.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{padding:16, textAlign:'center', color:'#999'}}>No books in catalog.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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