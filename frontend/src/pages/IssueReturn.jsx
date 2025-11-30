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
        <div className="dashboard-container">
            <LibrarianSidebar />
            <div className="main-content">
                <div className="card">
                    <div className="card-header">
                        <h2 style={{margin:0}}>Borrowing Requests & History</h2>
                    </div>
                    <table style={{ width: '100%', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', backgroundColor: '#E8E0D5' }}>
                                <th style={{padding: '10px'}}>Student</th>
                                <th>Book Title</th>
                                <th>Date Requested</th>
                                
                                <th>Date Returned</th> 
                                
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t.id} style={{borderBottom: '1px solid #eee'}}>
                                    <td style={{padding: '10px'}}>{t.student_name}</td>
                                    <td>{t.book_title}</td>
                                    <td>{t.borrow_date}</td>
                                    
                                    <td style={{color: '#555'}}>
                                        {/* return date at issue date */}
                                        {t.return_date ? t.return_date : '-'}
                                    </td>

                                    <td style={{ 
                                        fontWeight: 'bold',
                                        color: t.status === 'Pending' ? 'orange' : 
                                               t.status === 'Approved' ? 'green' : 
                                               t.status === 'Returned' ? 'blue' : 'red'
                                    }}>
                                        {t.status}
                                    </td>
                                    <td>
                                        {t.status === 'Pending' ? (
                                            <div style={{display:'flex', gap:'10px'}}>
                                                <button onClick={() => handleAction(t.id, 'approve')} style={{background:'green', color:'white', border:'none', padding:'5px 10px', borderRadius:'5px', cursor:'pointer'}}><FaCheck /> Accept</button>
                                                <button onClick={() => handleAction(t.id, 'reject')} style={{background:'red', color:'white', border:'none', padding:'5px 10px', borderRadius:'5px', cursor:'pointer'}}><FaTimes /> Reject</button>
                                            </div>
                                        ) : <span style={{color:'#999'}}>-</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default IssueReturn;