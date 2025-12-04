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

    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (typeof window === 'undefined') return;
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
        <div className="dashboard-container" style={{background: 'linear-gradient(135deg, #fffbe6 0%, #f7e9c4 100%)', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif'}}>
            <LibrarianSidebar />
            <div
                className="main-content"
                style={{
                    marginLeft: isMobile ? 0 : '230px',
                    padding: '24px 12px',
                    background: 'rgba(255,255,255,0.92)',
                    borderRadius: '18px',
                    boxShadow: '0 8px 32px rgba(139,101,8,0.10)',
                    minHeight: '100vh',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <div style={{width: '100%', maxWidth: 1200}}>
                <h1 style={{marginBottom: '18px', color: '#8B6508', fontWeight: 700, fontSize: 26, letterSpacing: 1, marginLeft: 16}}>Latest Report</h1>
            <div className="stats-grid" style={{display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap', marginLeft: 16, marginRight: 16}}>
                    <div className="stat-card" style={{background: 'linear-gradient(135deg, #d4af37 0%, #8B6508 100%)', color: '#fff', borderRadius: 18, boxShadow: '0 2px 8px rgba(139,101,8,0.14)', padding: 16, minWidth: 120, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <h3 style={{fontWeight: 700, fontSize: 20, marginBottom: 8}}>Borrowed Books</h3>
                        <h1 style={{fontWeight: 900, fontSize: 36, margin: 0}}>{stats.total_borrowed}</h1>
                    </div>
                    <div className="stat-card" style={{background: 'linear-gradient(135deg, #d4af37 0%, #8B6508 100%)', color: '#fff', borderRadius: 18, boxShadow: '0 2px 8px rgba(139,101,8,0.14)', padding: 16, minWidth: 120, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <h3 style={{fontWeight: 700, fontSize: 20, marginBottom: 8}}>Total Books</h3>
                        <h1 style={{fontWeight: 900, fontSize: 36, margin: 0}}>{stats.total_books}</h1>
                    </div>
                </div>
                <div className="dashboard-split" style={{display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 24, justifyContent: 'center', marginLeft: 16, marginRight: 16}}>
                    <div className="top-books-section" style={{flex: 1.2, minWidth: 260, maxWidth: 650, width: '100%', background: 'rgba(255,255,255,0.7)', borderRadius: 10, boxShadow: '0 1px 4px #f7e9c4', padding: 15}}>
                        <h2 style={{color: '#8B6508', fontWeight: 700, fontSize: 28, marginBottom: 14}}>Top Borrowed Books</h2>
                        <div className="ranking-list">
                            {(Array.isArray(stats.top_books) ? stats.top_books : []).map((book, index) => (
                                <div key={index} className="ranking-item" style={{display: 'flex', alignItems: 'center', marginBottom: 12}}>
                                    <span className="rank-number" style={{fontSize: 28, fontWeight: 700, color: '#d4af37', marginRight: 12}}>{index + 1}</span>
                                    <div className="rank-info">
                                        <h4 style={{margin: 0, fontSize: 18, color: '#8B6508'}}>{book.title}</h4>
                                        <p style={{margin: 0, fontSize: 16, color: '#888'}}>{book.count} Borrows</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="chart-section" style={{flex: 2, minWidth: 260, maxWidth: 700, width: '100%', background: 'rgba(255,255,255,0.7)', borderRadius: 10, boxShadow: '0 1px 4px #f7e9c4', padding: 18}}>
                        <h2 style={{color: '#8B6508', fontWeight: 700, fontSize: 28, marginBottom: 14}}>Monthly Borrowed Books</h2>
                        <div style={{ width: '100%', height: 320 }}>
                            <ResponsiveContainer>
                                <LineChart data={stats.chart_data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}} />
                                    <Line 
                                        type="monotone" 
                                        dataKey="loans" 
                                        stroke="#8B6508" 
                                        strokeWidth={2} 
                                        dot={{r: 3, fill:'#8B6508', strokeWidth: 1, stroke:'white'}} 
                                        activeDot={{ r: 4 }} 
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="recent-section" style={{background: 'rgba(255,255,255,0.7)', borderRadius: 10, boxShadow: '0 1px 4px #f7e9c4', padding: 12, maxWidth: 1200, marginLeft: 16, marginRight: 16, overflowX: 'auto'}}>
                        <h2 style={{color: '#8B6508', fontWeight: 700, fontSize: 24, marginBottom: 12, letterSpacing: 0.5}}>Recent Issued</h2>
                        <table className="dashboard-table" style={{width: '100%', borderCollapse: 'collapse', minWidth: 600}}>
                            <thead>
                                <tr>
                                    <th style={{textAlign: 'left', padding: '10px 8px', borderBottom: '2px solid #f0e2bf', color: '#8B6508', fontSize: 14}}>Name</th>
                                    <th style={{textAlign: 'left', padding: '10px 8px', borderBottom: '2px solid #f0e2bf', color: '#8B6508', fontSize: 14}}>Book Name</th>
                                    <th style={{textAlign: 'left', padding: '10px 8px', borderBottom: '2px solid #f0e2bf', color: '#8B6508', fontSize: 14}}>D/Issue</th>
                                    <th style={{textAlign: 'left', padding: '10px 8px', borderBottom: '2px solid #f0e2bf', color: '#8B6508', fontSize: 14}}>D/Return</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Array.isArray(stats.recent_activity) ? stats.recent_activity : []).map((item, index) => (
                                    <tr key={item.id} style={{background: index % 2 === 0 ? '#fff' : '#fffaf0'}}>
                                        <td style={{padding: '10px 8px', borderBottom: '1px solid #f3e6c7', color: '#333', fontSize: 15, fontWeight: 500}}>{item.student_name}</td>
                                        <td style={{padding: '10px 8px', borderBottom: '1px solid #f3e6c7', color: '#555', fontSize: 15}}>{item.book_title}</td>
                                        <td style={{padding: '10px 8px', borderBottom: '1px solid #f3e6c7', color: '#555', fontSize: 15}}>{item.borrow_date}</td>
                                        <td style={{padding: '10px 8px', borderBottom: '1px solid #f3e6c7', color: item.return_date ? '#000' : '#b08a3c', fontSize: 15}}>
                                            {item.return_date ? item.return_date : 'Pending Return'}
                                        </td>
                                    </tr>
                                ))}
                                {(!Array.isArray(stats.recent_activity) || stats.recent_activity.length === 0) && (
                                    <tr>
                                        <td colSpan="4" style={{padding: 16, textAlign: 'center', color: '#999'}}>No recent issued records.</td>
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