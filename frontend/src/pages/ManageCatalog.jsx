import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaTrash, FaPlus, FaCheckCircle, FaPrint, FaDownload, FaExclamationCircle } from 'react-icons/fa';
import LibrarianSidebar from '../components/LibrarianSidebar';
import LoadingScreen from '../components/LoadingScreen';
import '../styles/Dashboard.css';
import { API_URL } from '../apiConfig';

const ManageCatalog = () => {
    const [books, setBooks] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false); // success pop out box
    const [showDeleteModal, setShowDeleteModal] = useState(false); // pop out box delete
    const [bookToDelete, setBookToDelete] = useState(null); // delete
    const [isLoading, setIsLoading] = useState(false); // loading

    const [formData, setFormData] = useState({
        title: '', author: '', isbn: '', quantity: 1, category: 'Fiction', synopsis: '', cover_image: null
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

    const handleDeleteClick = (id) => {
        setBookToDelete(id);
        setShowDeleteModal(true);
    };

    // confirmation
    const confirmDelete = async () => {
        if (!bookToDelete) return;
        
        setShowDeleteModal(false);
        setIsLoading(true); // loading

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

    const handleFileChange = (e) => {
        setFormData({ ...formData, cover_image: e.target.files[0] });
    };

    // add books
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // loading
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
        const tableColumn = ["Title", "Author", "Category", "Qty", "ISBN"];
        const tableRows = [];
        books.forEach(b => {
            tableRows.push([b.title, b.author, b.category, b.quantity, b.isbn]);
        });
        autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
        doc.save("Libyte_Catalog.pdf");
    };

    if (isLoading) return <LoadingScreen />; // loader

    return (
        <div className="dashboard-container">
            <LibrarianSidebar />
            <div className="main-content-fluid">
                <div className="full-width-card" style={{ marginBottom: '30px', borderTop: '5px solid #8B6508' }}>
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

                {/* book list */}
                <div className="full-width-card">
                    <div className="card-header-row">
                        <h2 className="page-title">Book Catalog List</h2>
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
                                {books.map((b) => (
                                    <tr key={b.id}>
                                        <td><strong>{b.title}</strong></td>
                                        <td>{b.author}</td>
                                        <td><span style={{background:'#fffbe6', padding:'4px 10px', borderRadius:'10px', border:'1px solid #e0d4b8', fontSize:'13px', color:'#8B6508'}}>{b.category}</span></td>
                                        <td>{b.quantity}</td>
                                        <td style={{textAlign:'center'}}>
                                            <button className="icon-btn delete" onClick={() => handleDeleteClick(b.id)}>
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

            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <FaCheckCircle size={50} color="#8B6508" style={{marginBottom: '10px'}} />
                        <h3 className="modal-header">Success!</h3>
                        <p className="modal-text">New book has been added to the catalog.</p>
                        <button className="btn-confirm" onClick={() => setShowSuccessModal(false)}>OK</button>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <FaExclamationCircle size={50} color="#cc0000" style={{marginBottom: '10px'}} />
                        <h3 className="modal-header" style={{color: '#cc0000'}}>Delete Book?</h3>
                        <p className="modal-text">Are you sure you want to delete this book? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-delete-confirm" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCatalog;