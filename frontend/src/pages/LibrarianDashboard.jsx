import React, { useState, useEffect } from 'react';
import LibrarianSidebar from '../components/LibrarianSidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';
import { API_URL } from '../apiConfig';

const LibrarianDashboard = () => {
    const [stats, setStats] = useState({
        total_books: 0,
        total_borrowed: 0,
        top_books: [],
        chart_data: [],
        recent_activity: []
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const token = sessionStorage.getItem('access_token');
        try {
            const response = await fetch(`${API_URL}/api/dashboard/stats/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setStats(data);
            }
        } catch (error) {
            console.error("Error loading stats:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <LibrarianSidebar />
            
            <div className="main-content-fluid">
                <h1 style={{marginBottom: '30px', color: '#000', fontWeight: 'bold'}}>Latest Report</h1>

                <div className="stats-grid">
                    <div className="stat-card" style={{backgroundColor: '#8B6508'}}>
                        <div className="stat-overlay"></div>
                    </div>

                    <div className="stat-card" style={{backgroundColor: '#8B6508'}}>
                        <h3>Borrowed Books</h3>
                        <h1>{stats.total_borrowed}</h1>
                    </div>

                    <div className="stat-card" style={{backgroundColor: '#8B6508'}}>
                        <h3>Total Books</h3>
                        <h1>{stats.total_books}</h1>
                    </div>
                </div>
                <div className="dashboard-split">
                    
                    <div className="top-books-section card" style={{padding: '25px', background: 'rgba(255,255,255,0.9)', borderTop: 'none'}}>
                        <h2 style={{color: '#8B6508', marginBottom: '20px'}}>Top Borrowed Books</h2>
                        <div className="ranking-list">
                            {stats.top_books && stats.top_books.length > 0 ? (
                                stats.top_books.map((book, index) => (
                                    <div key={index} className="ranking-item">
                                        <span className="rank-number">{index + 1}</span>
                                        <div className="rank-info">
                                            <h4>{book.title}</h4>
                                            <p>{book.count} Borrows</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{color: '#888'}}>No data available.</p>
                            )}
                        </div>
                    </div>

                    <div className="chart-section card" style={{padding: '25px', background: 'rgba(255,255,255,0.9)', borderTop: 'none'}}>
                        <h2 style={{color: '#8B6508', marginBottom: '20px'}}>Monthly Borrowed Books</h2>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <LineChart data={stats.chart_data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                    <Tooltip contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}} />
                                    <Line 
                                        type="monotone" 
                                        dataKey="loans" 
                                        stroke="#8B6508" 
                                        strokeWidth={3} 
                                        dot={{r: 4, fill:'#8B6508', strokeWidth: 2, stroke:'white'}} 
                                        activeDot={{ r: 6 }} 
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="full-width-card">
                    <div className="card-header-row">
                        <h2 className="page-title">Recent Issued</h2>
                    </div>
                    
                    <div className="table-responsive">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Book Name</th>
                                    <th>D/Issue</th>
                                    <th>D/Return</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recent_activity && stats.recent_activity.length > 0 ? (
                                    stats.recent_activity.map(item => (
                                        <tr key={item.id}>
                                            <td><strong>{item.student_name}</strong></td>
                                            <td style={{color:'#555'}}>{item.book_title}</td>
                                            <td>{item.borrow_date}</td>
                                            <td style={{
                                                color: item.return_date ? '#155724' : '#856404',
                                                fontWeight: 'bold'
                                            }}>
                                                {item.return_date ? item.return_date : "Pending Return"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="empty-msg">
                                            No recent issued records.
                                        </td>
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

export default LibrarianDashboard;