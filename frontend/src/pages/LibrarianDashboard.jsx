import React, { useState, useEffect } from 'react';

const LibrarianDashboard = () => {
    const [members, setMembers] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        
        // Fetch Members
        fetch('http://127.0.0.1:8000/api/members/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setMembers(data));

        // Fetch Transactions
        fetch('http://127.0.0.1:8000/api/transactions/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setTransactions(data));
    }, []);

    return (
        <div>
            <h2>Librarian Dashboard</h2>
            
            {/* Section 1: Members */}
            <div style={{ marginBottom: '40px' }}>
                <h3 style={{ borderBottom: '2px solid #8B6508' }}>Registered Students</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', backgroundColor: '#f0f0f0' }}>
                            <th style={{padding: '10px'}}>Student ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(m => (
                            <tr key={m.student_id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{padding: '10px'}}>{m.student_id}</td>
                                <td>{m.name}</td>
                                <td>{m.email}</td>
                                <td>{m.contact_number}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Section 2: Transactions */}
            <div>
                <h3 style={{ borderBottom: '2px solid #8B6508' }}>Borrowing History</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', backgroundColor: '#f0f0f0' }}>
                            <th style={{padding: '10px'}}>Student</th>
                            <th>Book Title</th>
                            <th>Date Borrowed</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #ddd' }}>
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
    );
};

export default LibrarianDashboard;