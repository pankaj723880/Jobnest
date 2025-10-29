import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import ContactModal from '../components/ContactModal';
import './AdminDashboard.css';

const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedContact, setSelectedContact] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const itemsPerPage = 10;

    const fetchContacts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            let url = `/api/v1/admin/contacts?page=${currentPage}&limit=${itemsPerPage}`;
            if (searchTerm) {
                url += `&search=${searchTerm}`;
            }
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setContacts(data.contacts || []);
                setTotalPages(data.totalPages || 1);
            } else {
                setError(data.msg || 'Failed to fetch contacts');
            }
        } catch (err) {
            setError('Failed to fetch contacts');
            console.error('Failed to fetch contacts:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const handleContactAction = async (action, contactId, contactData = null) => {
        try {
            setModalLoading(true);
            const token = localStorage.getItem('token');
            let response;
            let successMessage = '';

            switch (action) {
                case 'update':
                    response = await fetch(`/api/v1/admin/contacts/${contactId}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(contactData)
                    });
                    successMessage = 'Contact updated successfully';
                    break;
                default:
                    throw new Error(`Unknown action: ${action}`);
            }

            const data = await response.json();

            if (response.ok) {
                fetchContacts();
                setShowContactModal(false);
                setSelectedContact(null);
                alert(successMessage);
            } else {
                alert(data.msg || 'Action failed');
            }
        } catch (err) {
            console.error('Contact action failed:', err);
            alert('Action failed. Please try again.');
        } finally {
            setModalLoading(false);
        }
    };

    const handleSaveContact = (contactData) => {
        if (selectedContact) {
            handleContactAction('update', selectedContact._id, contactData);
        }
    };

    return (
        <div className="admin-dashboard">
            <AdminSidebar />
            <div className="admin-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">
                        <i className="bi bi-chat-dots me-2"></i>
                        Feedback Management
                    </h1>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '250px' }}
                    />
                </div>

                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="contacts-management">
                        <h2>Contact Messages</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map(contact => (
                                    <tr key={contact._id}>
                                        <td>{contact.name}</td>
                                        <td>{contact.email}</td>
                                        <td>{contact.subject || 'General Inquiry'}</td>
                                        <td>
                                            <span className={`badge ${contact.status === 'read' ? 'bg-success' : contact.status === 'replied' ? 'bg-info' : contact.status === 'closed' ? 'bg-secondary' : 'bg-warning'}`}>
                                                {contact.status || 'unread'}
                                            </span>
                                        </td>
                                        <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="btn-group" role="group">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => {
                                                        setSelectedContact(contact);
                                                        setShowContactModal(true);
                                                    }}
                                                >
                                                    <i className="bi bi-eye"></i> View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-end mt-3">
                            <nav>
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                                            Previous
                                        </button>
                                    </li>
                                    <li className="page-item disabled">
                                        <span className="page-link">Page {currentPage} of {totalPages}</span>
                                    </li>
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                )}

                {/* Contact Modal */}
                <ContactModal
                    isOpen={showContactModal}
                    onClose={() => {
                        setShowContactModal(false);
                        setSelectedContact(null);
                    }}
                    contact={selectedContact}
                    onSave={handleSaveContact}
                    loading={modalLoading}
                />
            </div>
        </div>
    );
};

export default AdminContacts;
