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

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/members/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setMembers(data);
        } catch (error) {
            console.error("Error fetching members:", error);
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

    const filteredMembers = members.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-container">
            <LibrarianSidebar />
            
            <div className="main-content">
                <div className="card">
                    <div className="card-header">
                        <h2 style={{margin:0}}>Members</h2>
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="search-bar"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div id="printable-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Sex</th>
                                    <th>Contact No.</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map((member) => (
                                    <tr key={member.student_id}>
                                        <td>{member.student_id}</td>
                                        <td>{member.name}</td>
                                        <td>{member.sex}</td>
                                        <td>{member.contact_number}</td>
                                        <td>
                                            <button className="action-btn edit-btn" onClick={() => openEditModal(member)}>
                                                <FaEdit />
                                            </button>
                                            <button className="action-btn delete-btn" onClick={() => openDeleteModal(member)}>
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="card-footer">
                        <button className="footer-btn print-btn" onClick={handlePrint}><FaPrint /> Print</button>
                        <button className="footer-btn download-btn" onClick={handleDownloadPDF}><FaDownload /> Download</button>
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