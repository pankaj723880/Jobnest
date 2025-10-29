import React, { useState, useEffect } from 'react';

const UserModal = ({ isOpen, onClose, user, onSave, loading }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'worker',
        phone: '',
        city: '',
        pincode: '',
        skills: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                role: user.role || 'worker',
                phone: user.phone || '',
                city: user.city || '',
                pincode: user.pincode || '',
                skills: user.skills ? user.skills.join(', ') : ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'worker',
                phone: '',
                city: '',
                pincode: '',
                skills: ''
            });
        }
    }, [user, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const submitData = {
            ...formData,
            skills: formData.skills ? formData.skills.split(',').map(skill => skill.trim()) : []
        };

        // Remove password if empty (for updates)
        if (!submitData.password) {
            delete submitData.password;
        }

        onSave(submitData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {user ? 'Edit User' : 'Add New User'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {!user && (
                                <div className="mb-3">
                                    <label className="form-label">Password *</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required={!user}
                                        minLength="6"
                                    />
                                </div>
                            )}

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Role</label>
                                    <select
                                        className="form-select"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="worker">Worker</option>
                                        <option value="employer">Employer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">City</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Pincode</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Skills (comma-separated)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="e.g. JavaScript, React, Node.js"
                                />
                            </div>
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
                                    user ? 'Update User' : 'Create User'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserModal;
