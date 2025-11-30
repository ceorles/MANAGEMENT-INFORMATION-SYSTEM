import React, { useState, useEffect } from 'react';
import LibrarianSidebar from '../components/LibrarianSidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import '../styles/Dashboard.css';

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
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/dashboard/stats/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error("Error loading stats:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <LibrarianSidebar />
            
            <div className="main-content">
                <h1 style={{marginBottom: '30px', color: '#000'}}>Latest Report</h1>

                {/* */}
                <div className="stats-grid">
                    <div className="stat-card" style={{backgroundColor: '#8B6508'}}>
                        {/* placeholder ng card yung gold, */}
                        <div className="stat-overlay"></div>
                    </div>

                    <div className="stat-card" style={{backgroundColor: '#8B6508'}}>
                        <h3>Borrowed Books</h3>
                        <h1>{stats.total_borrowed}</h1>
                        <div className="stat-icon-bg"></div>
                    </div>

                    <div className="stat-card" style={{backgroundColor: '#8B6508'}}>
                        <h3>Total Books</h3>
                        <h1>{stats.total_books}</h1>
                        <div className="stat-icon-bg"></div>
                    </div>
                </div>

                {/* BOOKS & CHART */}
                <div className="dashboard-split">
                    
                    {/* LEFT - Top Borrowed Books */}
                    <div className="top-books-section">
                        <h2>Top Borrowed Books</h2>
                        <div className="ranking-list">
                            {stats.top_books.map((book, index) => (
                                <div key={index} className="ranking-item">
                                    <span className="rank-number">{index + 1}</span>
                                    <div className="rank-info">
                                        <h4>{book.title}</h4>
                                        <p>{book.count} Borrows</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT - Monthly Chart */}
                    <div className="chart-section">
                        <h2>Monthly Borrowed Books</h2>
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

                {/* RECENT ISSUE --- */}
                <div className="recent-section">
                    <h2>Recent Issued</h2>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Book Name</th>
                                <th>D/Issue</th>
                                <th>D/Return</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recent_activity.map(item => (
                                <tr key={item.id}>
                                    <td>{item.student_name}</td>
                                    <td>{item.book_title}</td>
                                    <td>{item.borrow_date}</td>
                                    <td style={{color: item.return_date ? '#000' : '#888'}}>
                                        {item.return_date ? item.return_date : "Pending Return"}
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