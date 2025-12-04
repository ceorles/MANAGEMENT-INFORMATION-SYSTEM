import React, { useState, useEffect } from 'react';
import LibrarianSidebar from '../components/LibrarianSidebar';
import { FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/Dashboard.css';

const IssueReturn = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/api/transactions/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setTransactions(data);
    };

    const handleAction = async (recordId, action) => {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/api/manage-request/', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ record_id: recordId, action: action })
        });

        if (response.ok) {
            alert(`Book ${action}ed!`);
            fetchTransactions();
        }
    };

    return (
        <div className="dashboard-container" style={{background: 'linear-gradient(135deg, #fffbe6 0%, #f7e9c4 100%)', minHeight: '100vh'}}>
            <LibrarianSidebar />
            <div className="main-content" style={{marginLeft: '230px', padding: '24px 12px', minHeight: '100vh', boxSizing: 'border-box', display: 'flex', justifyContent: 'center'}}>
                <div className="card" style={{background: 'rgba(255,255,255,0.96)', borderRadius: 18, boxShadow: '0 8px 24px rgba(139,101,8,0.12)', padding: 20, width: '100%', maxWidth: 1100, margin: '0 8px'}}>
                    <div className="card-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10}}>
                        <h2 style={{margin:0, color:'#8B6508', fontWeight:700, letterSpacing:1}}>Borrowing Requests &amp; History</h2>
                    </div>

                    <div style={{overflowX: 'auto'}}>
                        <table style={{ width: '100%', borderCollapse:'collapse', minWidth: 600 }}>
                            <thead>
                                <tr style={{ textAlign: 'left' }}>
                                    <th style={{padding: '10px 8px', borderBottom:'2px solid #f0e2bf', color:'#8B6508', fontSize:14}}>Student</th>
                                    <th style={{padding: '10px 8px', borderBottom:'2px solid #f0e2bf', color:'#8B6508', fontSize:14}}>Book Title</th>
                                    <th style={{padding: '10px 8px', borderBottom:'2px solid #f0e2bf', color:'#8B6508', fontSize:14}}>Date Requested</th>
                                    <th style={{padding: '10px 8px', borderBottom:'2px solid #f0e2bf', color:'#8B6508', fontSize:14}}>Date Returned</th>
                                    <th style={{padding: '10px 8px', borderBottom:'2px solid #f0e2bf', color:'#8B6508', fontSize:14}}>Status</th>
                                    <th style={{padding: '10px 8px', borderBottom:'2px solid #f0e2bf', color:'#8B6508', fontSize:14}}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t, index) => (
                                    <tr key={t.id} style={{borderBottom: '1px solid #f3e6c7', background: index % 2 === 0 ? '#fff' : '#fffaf0'}}>
                                        <td style={{padding: '10px 8px', color:'#333', fontWeight:500}}>{t.student_name}</td>
                                        <td style={{padding: '10px 8px', color:'#555'}}>{t.book_title}</td>
                                        <td style={{padding: '10px 8px', color:'#555'}}>{t.borrow_date}</td>
                                        <td style={{padding: '10px 8px', color: '#555'}}>
                                            {t.return_date ? t.return_date : '-'}
                                        </td>
                                        <td style={{padding: '10px 8px', fontWeight: 'bold', color: 
                                            t.status === 'Pending' ? '#c38b1b' : 
                                            t.status === 'Approved' ? '#2e7d32' : 
                                            t.status === 'Returned' ? '#1565c0' : '#b02a37'
                                        }}>
                                            {t.status}
                                        </td>
                                        <td style={{padding: '10px 8px'}}>
                                            {t.status === 'Pending' ? (
                                                <div style={{display:'flex', gap:'8px'}}>
                                                    <button onClick={() => handleAction(t.id, 'approve')} style={{
                                                        background:'rgba(46,125,50,0.12)',
                                                        color:'#2e7d32',
                                                        border:'none',
                                                        padding:'6px 10px',
                                                        borderRadius:10,
                                                        cursor:'pointer',
                                                        display:'flex',
                                                        alignItems:'center',
                                                        gap:4
                                                    }}>
                                                        <FaCheck /> Accept
                                                    </button>
                                                    <button onClick={() => handleAction(t.id, 'reject')} style={{
                                                        background:'rgba(176,42,55,0.10)',
                                                        color:'#b02a37',
                                                        border:'none',
                                                        padding:'6px 10px',
                                                        borderRadius:10,
                                                        cursor:'pointer',
                                                        display:'flex',
                                                        alignItems:'center',
                                                        gap:4
                                                    }}>
                                                        <FaTimes /> Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{color:'#999'}}>-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{padding: 16, textAlign:'center', color:'#999'}}>No borrowing requests yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueReturn;