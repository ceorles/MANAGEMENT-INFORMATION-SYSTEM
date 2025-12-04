import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaEdit, FaTrash, FaPrint, FaDownload } from 'react-icons/fa';
import LibrarianSidebar from '../components/LibrarianSidebar';
import '../styles/Dashboard.css';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    
    // member being edited or deleted
    const [selectedMember, setSelectedMember] = useState(null);
    
    //  form data for editing
    const [editFormData, setEditFormData] = useState({ 
        name: '', 
        contact_number: '', 
        student_id: '', 
        password: '' 
    });

    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

    useEffect(() => {
        fetchMembers();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (typeof window === 'undefined') return;
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchMembers = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/members/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (Array.isArray(data)) {
                setMembers(data);
            } else if (Array.isArray(data.results)) {
                setMembers(data.results);
            } else if (data) {
                setMembers([data]);
            } else {
                setMembers([]);
            }
        } catch (error) {
            console.error("Error fetching members:", error);
            setMembers([]);
        }
    };

    const openDeleteModal = (member) => {
        setSelectedMember(member);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedMember) return;

        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/members/${selectedMember.student_id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setMembers(members.filter(m => m.student_id !== selectedMember.student_id));
                setShowDeleteModal(false);
                setSelectedMember(null);
            } else {
                alert("Failed to delete.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const openEditModal = (member) => {
        setSelectedMember(member);
        setEditFormData({ 
            name: member.name, 
            contact_number: member.contact_number,
            student_id: member.student_id,
            password: ''
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const saveEdit = async () => {
        if (!selectedMember) return;

        const token = localStorage.getItem('access_token');
        
        const payload = {
            name: editFormData.name,
            contact_number: editFormData.contact_number,
            student_id: editFormData.student_id
        };

        if (editFormData.password.trim() !== "") {
            payload.password = editFormData.password;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/members/${selectedMember.student_id}/`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Member updated successfully!");
                fetchMembers(); 
                setShowEditModal(false);
                setSelectedMember(null);
            } else {
                alert("Failed to update. Student ID might already be taken.");
            }
        } catch (error) {
            console.error("Error updating:", error);
        }
    };

    const handlePrint = () => window.print();

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Libyte Member List", 14, 10);
        
        const tableColumn = ["ID", "Name", "Email", "Contact", "Sex"];
        const tableRows = [];

        filteredMembers.forEach(member => {
            tableRows.push([
                member.student_id,
                member.name,
                member.email,
                member.contact_number,
                member.sex,
            ]);
        });

        doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
        doc.save("Libyte_Members.pdf");
    };

    const safeMembers = Array.isArray(members) ? members : [];

    const filteredMembers = safeMembers.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-container" style={{background: 'linear-gradient(135deg, #fffbe6 0%, #f7e9c4 100%)', minHeight: '100vh'}}>
            <LibrarianSidebar />

            <div className="main-content" style={{marginLeft: isMobile ? 0 : '260px', padding: '24px 16px', minHeight: '100vh'}}>
                <div style={{background: 'rgba(255,255,255,0.95)', borderRadius: 18, boxShadow: '0 8px 24px rgba(139,101,8,0.12)', padding: 20, maxWidth: '1100px', marginLeft: isMobile ? 0 : '40px'}}>
                    <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18}}>
                        <h2 style={{margin: 0, color: '#8B6508', fontWeight: 700, fontSize: 24, letterSpacing: 1}}>Members</h2>
                        <input 
                            type="text" 
                            placeholder="Search members..." 
                            className="search-bar"
                            style={{
                                padding: '8px 12px',
                                borderRadius: 12,
                                border: '1px solid #e0d4b8',
                                minWidth: 200,
                                maxWidth: 260,
                                flex: '0 0 auto',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                            }}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div id="printable-table" style={{overflowX: 'auto'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse', minWidth: 600}}>
                            <thead>
                                <tr>
                                    <th style={{textAlign: 'left', padding: '10px 8px', borderBottom: '2px solid #f0e2bf', color: '#8B6508', fontSize: 17}}>ID</th>
                                    <th style={{textAlign: 'left', padding: '10px 8px', borderBottom: '2px solid #f0e2bf', color: '#8B6508', fontSize: 17}}>Name</th>
                                    <th style={{textAlign: 'left', padding: '10px 8px', borderBottom: '2px solid #f0e2bf', color: '#8B6508', fontSize: 17}}>Sex</th>
                                    <th style={{textAlign: 'left', padding: '10px 8px', borderBottom: '2px solid #f0e2bf', color: '#8B6508', fontSize: 17}}>Contact No.</th>
                                    <th style={{textAlign: 'left', padding: '10px 8px', borderBottom: '2px solid #f0e2bf', color: '#8B6508', fontSize: 17}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map((member, index) => (
                                    <tr key={member.student_id || index} style={{background: index % 2 === 0 ? '#fff' : '#fffaf0'}}>
                                        <td style={{padding: '10px 8px', borderBottom: '1px solid #f3e6c7', color: '#555'}}>{member.student_id}</td>
                                        <td style={{padding: '10px 8px', borderBottom: '1px solid #f3e6c7', color: '#333', fontWeight: 500}}>{member.name}</td>
                                        <td style={{padding: '10px 8px', borderBottom: '1px solid #f3e6c7', color: '#555'}}>{member.sex}</td>
                                        <td style={{padding: '10px 8px', borderBottom: '1px solid #f3e6c7', color: '#555'}}>{member.contact_number}</td>
                                        <td style={{padding: '10px 8px', borderBottom: '1px solid #f3e6c7'}}>
                                            <button className="action-btn edit-btn" onClick={() => openEditModal(member)} style={{
                                                border: 'none',
                                                background: 'rgba(212,175,55,0.12)',
                                                color: '#8B6508',
                                                padding: '6px 8px',
                                                borderRadius: 10,
                                                marginRight: 6,
                                                cursor: 'pointer'
                                            }}>
                                                <FaEdit />
                                            </button>
                                            <button className="action-btn delete-btn" onClick={() => openDeleteModal(member)} style={{
                                                border: 'none',
                                                background: 'rgba(220,53,69,0.09)',
                                                color: '#b02a37',
                                                padding: '6px 8px',
                                                borderRadius: 10,
                                                cursor: 'pointer'
                                            }}>
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredMembers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{padding: 16, textAlign: 'center', color: '#999'}}>No members found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="card-footer" style={{display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16}}>
                        <button className="footer-btn print-btn" onClick={handlePrint} style={{
                            background: 'linear-gradient(135deg, #fffbe6 0%, #f7e9c4 100%)',
                            borderRadius: 14,
                            padding: '8px 16px',
                            border: '1px solid #e0d4b8',
                            color: '#8B6508',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}><FaPrint />&nbsp;Print</button>
                        <button className="footer-btn download-btn" onClick={handleDownloadPDF} style={{
                            background: 'linear-gradient(135deg, #d4af37 0%, #8B6508 100%)',
                            borderRadius: 14,
                            padding: '8px 16px',
                            border: 'none',
                            color: '#fff',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(139,101,8,0.25)'
                        }}><FaDownload />&nbsp;Download</button>
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3 className="modal-header">Delete Member</h3>
                        <p>Are you sure you want to delete <strong>{selectedMember?.name}</strong>?</p>
                        <p style={{color: 'red', fontSize: '14px'}}>This action cannot be undone.</p>
                        
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn-delete-confirm" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3 className="modal-header">Edit Member Info</h3>
                        
                        <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginBottom:'5px'}}>Student ID:</label>
                        <input 
                            type="text" 
                            name="student_id"
                            className="modal-input"
                            value={editFormData.student_id}
                            onChange={handleEditChange}
                        />

                        <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginBottom:'5px'}}>Name:</label>
                        <input 
                            type="text" 
                            name="name"
                            className="modal-input"
                            value={editFormData.name}
                            onChange={handleEditChange}
                        />

                        <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginBottom:'5px'}}>Contact Number:</label>
                        <input 
                            type="text" 
                            name="contact_number"
                            className="modal-input"
                            value={editFormData.contact_number}
                            onChange={handleEditChange}
                        />

                        <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginBottom:'5px'}}>Change Password:</label>
                        <input 
                            type="password" 
                            name="password"
                            className="modal-input"
                            placeholder="Leave blank to keep current password"
                            value={editFormData.password}
                            onChange={handleEditChange}
                        />

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button className="btn-confirm" onClick={saveEdit}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Members;