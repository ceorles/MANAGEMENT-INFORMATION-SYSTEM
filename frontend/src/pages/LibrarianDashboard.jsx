import React, { useState, useEffect } from 'react';
import LibrarianSidebar from '../components/LibrarianSidebar';
import '../styles/Dashboard.css'; 

const LibrarianDashboard = () => {
    const [members, setMembers] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        
        fetch('http://127.0.0.1:8000/api/members/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setMembers(data.slice(0, 5)));

        fetch('http://127.0.0.1:8000/api/transactions/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setTransactions(data));
    }, []);

    return (
        <div className="dashboard-container">
            <LibrarianSidebar />
            
            <div className="main-content">
                <h1 style={{marginBottom: '20px'}}>Librarian Dashboard</h1>

                <div className="card" style={{ marginBottom: '30px' }}>
                    <h3 style={{ borderBottom: '2px solid #8B6508', paddingBottom: '10px' }}>New Students</h3>
                    <table style={{ width: '100%', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', backgroundColor: '#E8E0D5' }}>
                                <th style={{padding: '10px'}}>Student ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(m => (
                                <tr key={m.student_id}>
                                    <td style={{padding: '10px'}}>{m.student_id}</td>
                                    <td>{m.name}</td>
                                    <td>{m.email}</td>
                                    <td>{m.contact_number}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="card">
                    <h3 style={{ borderBottom: '2px solid #8B6508', paddingBottom: '10px' }}>Recent Borrowing History</h3>
                    <table style={{ width: '100%', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', backgroundColor: '#E8E0D5' }}>
                                <th style={{padding: '10px'}}>Student</th>
                                <th>Book Title</th>
                                <th>Date Borrowed</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t.id}>
                                    <td style={{padding: '10px'}}>{t.student_name}</td>
                                    <td>{t.book_title}</td>
                                    <td>{t.borrow_date}</td>
                                    <td style={{ color: t.is_returned ? 'green' : 'red', fontWeight: 'bold' }}>
                                        {t.is_returned ? 'Returned' : 'Borrowed'}
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

export default LibrarianDashboard;