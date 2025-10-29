import React, { useState, useEffect } from 'react';

const ContactModal = ({ isOpen, onClose, contact, onSave, loading }) => {
    const [formData, setFormData] = useState({
        status: 'unread',
        adminReply: ''
    });

    useEffect(() => {
        if (contact) {
            setFormData({
                status: contact.status || 'unread',
                adminReply: contact.adminReply || ''
            });
        } else {
            setFormData({
                status: 'unread',
                adminReply: ''
            });
        }
    }, [contact, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Contact Details</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {contact && (
                                <>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Name</label>
                                            <p className="mb-0">{contact.name}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Email</label>
                                            <p className="mb-0">{contact.email}</p>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Subject</label>
                                        <p className="mb-0">{contact.subject || 'General Inquiry'}</p>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Message</label>
                                        <div className="border rounded p-3 bg-light">
                                            {contact.message}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Submitted</label>
                                        <p className="mb-0">{new Date(contact.createdAt).toLocaleString()}</p>
                                    </div>

                                    <hr />

                                    <div className="mb-3">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-select"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="unread">Unread</option>
                                            <option value="read">Read</option>
                                            <option value="replied">Replied</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Admin Reply</label>
                                        <textarea
                                            className="form-control"
                                            name="adminReply"
                                            value={formData.adminReply}
                                            onChange={handleChange}
                                            rows="4"
                                            placeholder="Enter your reply to the contact..."
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
