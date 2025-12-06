import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import LibrarianSidebar from '../components/LibrarianSidebar';
import { FaCheck, FaTimes, FaPrint, FaDownload, FaCheckCircle } from 'react-icons/fa'; 
import '../styles/Dashboard.css';
import { API_URL } from '../apiConfig';

const IssueReturn = () => {
    const [transactions, setTransactions] = useState([]);
    
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const token = sessionStorage.getItem('access_token');
        try {
            const response = await fetch(`${API_URL}/api/transactions/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error("Error fetching transactions", error);
        }
    };

    const handleAction = async (recordId, action) => {
        const token = sessionStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/api/manage-request/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ record_id: recordId, action: action })
        });

        if (response.ok) {
            setModalMessage(`Book has been ${action}ed successfully!`);
            setShowSuccessModal(true);
            fetchTransactions();
        }
    };

    const handlePrint = () => window.print();

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Borrowing Requests & History", 14, 10);
        
        const tableColumn = ["Student", "Book Title", "Date Requested", "Date Returned", "Status"];
        const tableRows = [];

        transactions.forEach(t => {
            const retDate = t.return_date ? t.return_date : '-';
            tableRows.push([t.student_name, t.book_title, t.borrow_date, retDate, t.status]);
        });

        autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
        doc.save("Libyte_History.pdf");
    };

    return (
        <div className="dashboard-container">
            <LibrarianSidebar />
            
            <div className="main-content-fluid">
                <div className="full-width-card">
                    
                    <div className="card-header-row">
                        <h2 className="page-title">Borrowing Requests &amp; History</h2>
                    </div>

                    <div className="table-responsive">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Book Title</th>
                                    <th>Date Requested</th>
                                    <th>Date Returned</th>
                                    <th>Status</th>
                                    <th style={{textAlign: 'center'}}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t) => (
                                    <tr key={t.id}>
                                        <td><strong>{t.student_name}</strong></td>
                                        <td>{t.book_title}</td>
                                        <td>{t.borrow_date}</td>
                                        <td>{t.return_date ? t.return_date : '-'}</td>
                                        <td>
                                            <span style={{
                                                padding: '5px 12px',
                                                borderRadius: '12px',
                                                fontSize: '13px',
                                                fontWeight: 'bold',
                                                backgroundColor: 
                                                    t.status === 'Pending' ? '#fff3cd' : 
                                                    t.status === 'Approved' ? '#d4edda' : 
                                                    t.status === 'Returned' ? '#cce5ff' : '#f8d7da',
                                                color: 
                                                    t.status === 'Pending' ? '#856404' : 
                                                    t.status === 'Approved' ? '#155724' : 
                                                    t.status === 'Returned' ? '#004085' : '#721c24'
                                            }}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td style={{textAlign: 'center'}}>
                                            {t.status === 'Pending' ? (
                                                <div style={{display:'flex', justifyContent:'center', gap:'8px'}}>
                                                    <button onClick={() => handleAction(t.id, 'approve')} style={{
                                                        background:'rgba(46,125,50,0.12)',
                                                        color:'#2e7d32',
                                                        border:'none',
                                                        padding:'6px 12px',
                                                        borderRadius:'8px',
                                                        cursor:'pointer',
                                                        display:'flex',
                                                        alignItems:'center',
                                                        gap: '5px',
                                                        fontWeight: '600'
                                                    }}>
                                                        <FaCheck /> Accept
                                                    </button>
                                                    <button onClick={() => handleAction(t.id, 'reject')} style={{
                                                        background:'rgba(176,42,55,0.10)',
                                                        color:'#b02a37',
                                                        border:'none',
                                                        padding:'6px 12px',
                                                        borderRadius:'8px',
                                                        cursor:'pointer',
                                                        display:'flex',
                                                        alignItems:'center',
                                                        gap: '5px',
                                                        fontWeight: '600'
                                                    }}>
                                                        <FaTimes /> Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{color:'#ccc'}}>—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="empty-msg">No borrowing requests yet.</td>
                                    </tr>
                                )}
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
                        <p className="modal-text">{modalMessage}</p>
                        <button className="btn-confirm" onClick={() => setShowSuccessModal(false)}>
                            OK
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default IssueReturn;