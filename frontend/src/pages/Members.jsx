import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaEdit, FaTrash, FaPrint, FaDownload } from 'react-icons/fa';
import LibrarianSidebar from '../components/LibrarianSidebar';
import LoadingScreen from '../components/LoadingScreen';
import '../styles/Dashboard.css';

const Members = () => {
    const [members, setMembers] = useState([]); // members
    const [searchTerm, setSearchTerm] = useState(''); // search members id
    const [showDeleteModal, setShowDeleteModal] = useState(false); // delete pop out box
    const [showEditModal, setShowEditModal] = useState(false); // edit student info pop out box
    const [selectedMember, setSelectedMember] = useState(null); // selected members
    const [editFormData, setEditFormData] = useState({ name: '', contact_number: '', student_id: '', password: '' }); // edit
    const [isLoading, setIsLoading] = useState(false);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        fetchMembers();
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchMembers = async () => {
        const token = sessionStorage.getItem('access_token');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/members/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (Array.isArray(data)) setMembers(data);
            else setMembers([]);
        } catch (error) {
            console.error("Error:", error);
            setMembers([]);
        }
    };

    const confirmDelete = async () => {
        if (!selectedMember) return;

        setShowDeleteModal(false);
        setIsLoading(true);      

        const token = sessionStorage.getItem('access_token');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/members/${selectedMember.student_id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setTimeout(() => {
                    setMembers(members.filter(m => m.student_id !== selectedMember.student_id));
                    setIsLoading(false);
                    setSelectedMember(null);
                }, 1000);
            } else {
                setIsLoading(false);
                alert("Failed to delete.");
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Error:", error);
        }
    };

    const handleEdit = async () => {
        if (!selectedMember) return;
        const token = sessionStorage.getItem('access_token');
        const payload = {
            name: editFormData.name,
            contact_number: editFormData.contact_number,
            student_id: editFormData.student_id
        };
        if (editFormData.password.trim() !== "") payload.password = editFormData.password;

        const response = await fetch(`http://127.0.0.1:8000/api/members/${selectedMember.student_id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Updated successfully!");
            fetchMembers();
            setShowEditModal(false);
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Libyte Member List", 14, 10);
        autoTable(doc, {
            head: [["ID", "Name", "Email", "Contact", "Sex"]],
            body: filteredMembers.map(m => [m.student_id, m.name, m.email, m.contact_number, m.sex]),
            startY: 20,
        });
        doc.save("Members.pdf");
    };

    const filteredMembers = members.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <LoadingScreen />;

    return (
        <div className="dashboard-container">
            <LibrarianSidebar />
            <div className="main-content-fluid">
                <div className="full-width-card">
                    <div className="card-header-row">
                        <h2 className="page-title">Members</h2>
                        <input 
                            type="text" 
                            placeholder="Search members ID" 
                            className="search-input"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="table-responsive">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Sex</th>
                                    <th>Contact No.</th>
                                    <th style={{textAlign: 'center'}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map((member) => (
                                    <tr key={member.student_id}>
                                        <td>{member.student_id}</td>
                                        <td><strong>{member.name}</strong></td>
                                        <td>{member.sex}</td>
                                        <td>{member.contact_number}</td>
                                        <td style={{textAlign: 'center'}}>
                                            <button className="icon-btn edit" onClick={() => { setSelectedMember(member); setEditFormData(member); setShowEditModal(true); }}>
                                                <FaEdit />
                                            </button>
                                            <button className="icon-btn delete" onClick={() => { setSelectedMember(member); setShowDeleteModal(true); }}>
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredMembers.length === 0 && <tr><td colSpan="5" className="empty-msg">No members found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-footer-row">
                        <button className="footer-btn print" onClick={() => window.print()}><FaPrint /> Print</button>
                        <button className="footer-btn download" onClick={handleDownloadPDF}><FaDownload /> Download</button>
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <p>Deleting member name <strong>{selectedMember?.name}</strong>?</p>
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
                        <h3>Edit Member</h3>
                        <label>Name:</label>
                        <input type="text" className="modal-input" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
                        <label>Contact:</label>
                        <input type="text" className="modal-input" value={editFormData.contact_number} onChange={e => setEditFormData({...editFormData, contact_number: e.target.value})} />
                        <label>Password (Optional):</label>
                        <input type="password" className="modal-input" placeholder="New Password" onChange={e => setEditFormData({...editFormData, password: e.target.value})} />
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button className="btn-confirm" onClick={handleEdit}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Members;