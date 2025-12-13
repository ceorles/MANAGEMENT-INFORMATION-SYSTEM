import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaTrash, FaEdit, FaPlus, FaMinus, FaCheckCircle, FaPrint, FaDownload, FaExclamationCircle } from 'react-icons/fa';
import LibrarianSidebar from '../components/LibrarianSidebar';
import LoadingScreen from '../components/LoadingScreen';
import '../styles/Dashboard.css';
import { API_URL } from '../apiConfig';

const ManageCatalog = () => {
    const [books, setBooks] = useState([]);
    
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    
    const [bookToDelete, setBookToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // add form
    const [formData, setFormData] = useState({
        title: '', author: '', isbn: '', quantity: 1, category: 'Fiction', synopsis: '', cover_image: null
    });

    // edit form
    const [editData, setEditData] = useState({
        id: null, title: '', author: '', category: 'Fiction', quantity: 0
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        fetchBooks();
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchBooks = async () => {
        const token = sessionStorage.getItem('access_token');
        try {
            const res = await fetch(`${API_URL}/api/books/manage/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setBooks(data);
        } catch (error) {
            console.error("Error fetching books", error);
        }
    };

    // deleting logic
    const handleDeleteClick = (id) => {
        setBookToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!bookToDelete) return;
        setShowDeleteModal(false);
        setIsLoading(true);

        const token = sessionStorage.getItem('access_token');
        await fetch(`${API_URL}/api/books/manage/${bookToDelete}/`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        setTimeout(() => {
            fetchBooks();
            setIsLoading(false);
            setBookToDelete(null);
        }, 1000);
    };

    // editing logic
    const handleEditClick = (book) => {
        setEditData({
            id: book.id,
            title: book.title,
            author: book.author,
            category: book.category,
            quantity: book.quantity
        });
        setShowEditModal(true);
    };

    const updateQuantity = (amount) => {
        setEditData(prev => ({
            ...prev,
            quantity: Math.max(0, prev.quantity + amount) // prevent negative
        }));
    };

    const confirmEdit = async () => {
        setShowEditModal(false);
        setIsLoading(true);
        const token = sessionStorage.getItem('access_token');

        const payload = {
            title: editData.title,
            author: editData.author,
            category: editData.category,
            quantity: editData.quantity
        };

        const response = await fetch(`${API_URL}/api/books/manage/${editData.id}/`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            setTimeout(() => {
                fetchBooks();
                setIsLoading(false);
                alert("Book updated successfully!");
            }, 1000);
        } else {
            setIsLoading(false);
            alert("Failed to update book.");
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, cover_image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = sessionStorage.getItem('access_token');

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

        const response = await fetch(`${API_URL}/api/books/manage/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: data
        });

        if (response.ok) {
            await fetchBooks();
            setTimeout(() => {
                setIsLoading(false);
                setShowSuccessModal(true);
                setFormData({ title: '', author: '', isbn: '', quantity: 1, category: 'Fiction', synopsis: '', cover_image: null });
                document.getElementById('fileInput').value = ""; 
            }, 1000);
        } else {
            setIsLoading(false);
            alert("Failed to add book.");
        }
    };

    const handlePrint = () => window.print();

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Libyte Book Catalog", 14, 10);
        const tableColumn = ["Title", "Author", "Category", "Qty"];
        const tableRows = [];
        books.forEach(b => {
            tableRows.push([b.title, b.author, b.category, b.quantity]);
        });
        autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
        doc.save("Libyte_Catalog.pdf");
    };

    // --- FILTER LOGIC ---
    const filteredBooks = books.filter(b => 
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <LoadingScreen />;

    return (
        <div className="dashboard-container">
            <LibrarianSidebar />
            <div className="main-content-fluid">
                
                {/* --- ADD BOOK FORM --- */}
                <div className="full-width-card no-print" style={{ marginBottom: '30px', borderTop: '5px solid #8B6508' }}>
                    <div className="card-header-row">
                        <h2 className="page-title">Add New Book</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '30px', marginTop: '10px'}}>
                        <div>
                            <label style={{display:'block', fontWeight:'bold', marginBottom:'8px', color:'#8B6508'}}>Title:</label>
                            <input type="text" className="modal-input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            <label style={{display:'block', fontWeight:'bold', marginBottom:'8px', color:'#8B6508'}}>Author:</label>
                            <input type="text" className="modal-input" required value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                            <div style={{display:'flex', gap:'20px'}}>
                                <div style={{flex:1}}>
                                    <label style={{display:'block', fontWeight:'bold', marginBottom:'8px', color:'#8B6508'}}>ISBN:</label>
                                    <input type="text" className="modal-input" required value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} />
                                </div>
                                <div style={{flex:1}}>
                                    <label style={{display:'block', fontWeight:'bold', marginBottom:'8px', color:'#8B6508'}}>Qty:</label>
                                    <input type="number" className="modal-input" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label style={{display:'block', fontWeight:'bold', marginBottom:'8px', color:'#8B6508'}}>Category:</label>
                            <select className="modal-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                <option value="Fiction">Fiction</option>
                                <option value="Academic">Academic</option>
                                <option value="Non-Fiction">Non-Fiction</option>
                                <option value="Modern">Modern Literature</option>
                                <option value="Graphic">Graphic Literature</option>
                                <option value="Children">Children Books</option>
                            </select>
                            <label style={{display:'block', fontWeight:'bold', marginBottom:'8px', color:'#8B6508'}}>Synopsis:</label>
                            <textarea className="modal-input" rows="2" value={formData.synopsis} onChange={e => setFormData({...formData, synopsis: e.target.value})}></textarea>
                            <label style={{display:'block', fontWeight:'bold', marginBottom:'8px', color:'#8B6508'}}>Cover Image:</label>
                            <div style={{display:'flex', gap:'15px', alignItems:'center', flexWrap: 'wrap'}}>
                                <input type="file" id="fileInput" className="modal-input" onChange={handleFileChange} style={{flex:1}} />
                                <button type="submit" className="btn-confirm" style={{height:'45px', display:'flex', alignItems:'center', gap:'8px', borderRadius: '12px'}}>
                                    <FaPlus /> Add Book
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* --- BOOK LIST TABLE --- */}
                <div className="full-width-card">
                    <div className="card-header-row">
                        <h2 className="page-title">Book Catalog List</h2>
                        
                        {/* SEARCH BAR */}
                        <input 
                            type="text" 
                            placeholder="Search book title or author..." 
                            className="search-input"
                            style={{width: '300px'}}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="table-responsive">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Category</th>
                                    <th>Qty</th>
                                    <th style={{textAlign:'center'}}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBooks.map((b) => (
                                    <tr key={b.id}>
                                        <td><strong>{b.title}</strong></td>
                                        <td>{b.author}</td>
                                        <td><span style={{background:'#fffbe6', padding:'4px 10px', borderRadius:'10px', border:'1px solid #e0d4b8', fontSize:'13px', color:'#8B6508'}}>{b.category}</span></td>
                                        <td>{b.quantity}</td>
                                        <td style={{textAlign:'center'}}>
                                            {/* NEW EDIT BUTTON */}
                                            <button 
                                                className="icon-btn edit" 
                                                onClick={() => handleEditClick(b)}
                                                style={{marginRight:'10px'}}
                                            >
                                                <FaEdit />
                                            </button>
                                            
                                            <button 
                                                className="icon-btn delete" 
                                                onClick={() => handleDeleteClick(b.id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-footer-row">
                        <button className="footer-btn print" onClick={handlePrint}><FaPrint /> Print</button>
                        <button className="footer-btn download" onClick={handleDownloadPDF}><FaDownload /> Download</button>
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}
            
            {/* SUCCESS */}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <FaCheckCircle size={50} color="#8B6508" style={{marginBottom: '10px'}} />
                        <h3 className="modal-header">Success!</h3>
                        <p className="modal-text">Action completed successfully.</p>
                        <button className="btn-confirm" onClick={() => setShowSuccessModal(false)}>OK</button>
                    </div>
                </div>
            )}

            {/* DELETE */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <FaExclamationCircle size={50} color="#cc0000" style={{marginBottom: '10px'}} />
                        <h3 className="modal-header" style={{color: '#cc0000'}}>Delete Book?</h3>
                        <p className="modal-text">Are you sure? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-delete-confirm" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-box" style={{width: '500px', textAlign:'left'}}>
                        <h3 className="modal-header">Edit Book Details</h3>
                        
                        <label style={{fontWeight:'bold'}}>Title:</label>
                        <input type="text" className="modal-input" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} />

                        <label style={{fontWeight:'bold'}}>Author:</label>
                        <input type="text" className="modal-input" value={editData.author} onChange={e => setEditData({...editData, author: e.target.value})} />

                        <label style={{fontWeight:'bold'}}>Category:</label>
                        <select className="modal-input" value={editData.category} onChange={e => setEditData({...editData, category: e.target.value})}>
                            <option value="Fiction">Fiction</option>
                            <option value="Academic">Academic</option>
                            <option value="Non-Fiction">Non-Fiction</option>
                            <option value="Modern">Modern Literature</option>
                            <option value="Graphic">Graphic Literature</option>
                            <option value="Children">Children Books</option>
                        </select>

                        <label style={{fontWeight:'bold'}}>Stock Quantity:</label>
                        <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px'}}>
                            <button className="icon-btn delete" onClick={() => updateQuantity(-1)}><FaMinus /></button>
                            <input type="number" className="modal-input" style={{marginBottom:0, textAlign:'center', width:'80px'}} value={editData.quantity} readOnly />
                            <button className="icon-btn edit" onClick={() => updateQuantity(1)}><FaPlus /></button>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button className="btn-confirm" onClick={confirmEdit}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCatalog;