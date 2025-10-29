import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const JobModal = ({ isOpen, onClose, job, onSave, loading }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        city: '',
        pincode: '',
        salary: 0,
        status: 'open',
        requirements: [],
        employer: user?.userId || '',
        postedBy: user?.userId || ''
    });

    // Set employer and postedBy whenever user changes
    useEffect(() => {
        if (user && user.userId) {
            setFormData(prev => ({
                ...prev,
                employer: user.userId,
                postedBy: user.userId
            }));
        }
    }, [user]);

    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title || '',
                description: job.description || '',
                category: job.category || '',
                city: job.city || '',
                pincode: job.pincode || '',
                salary: job.salary || 0,
                status: job.status || 'open',
                requirements: job.requirements || [],
                employer: job.employer || user?._id || ''
            });
        } else {
            setFormData(prev => ({
                ...prev,
                title: '',
                description: '',
                category: '',
                city: '',
                pincode: '',
                salary: 0,
                status: 'open',
                requirements: [],
                employer: user?._id || ''
            }));
        }
    }, [job, isOpen, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'salary' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ensure employer and postedBy are set to the current user's ID
        const updatedData = {
            ...formData,
            employer: user.userId,
            postedBy: user.userId
        };
        onSave(updatedData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {job ? 'Edit Job' : 'Add New Job'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Job Title *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Category *</label>
                                    <select
                                        className="form-select"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Construction">Construction</option>
                                        <option value="Logistics">Logistics</option>
                                        <option value="Housekeeping">Housekeeping</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Retail">Retail</option>
                                        <option value="Security">Security</option>
                                        <option value="Hospitality">Hospitality</option>
                                        <option value="Office/BPO">Office/BPO</option>
                                        <option value="Warehouse">Warehouse</option>
                                        <option value="Automotive">Automotive</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Services">Services</option>
                                        <option value="Factory Work">Factory Work</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Description *</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">City *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Pincode</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Salary (₹)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        min="0"
                                        step="1000"
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Requirements *</label>
                                <textarea
                                    className="form-control"
                                    name="requirements"
                                    value={formData.requirements.join('\n')}
                                    onChange={(e) => {
                                        const reqs = e.target.value.split('\n').filter(req => req.trim());
                                        setFormData(prev => ({
                                            ...prev,
                                            requirements: reqs
                                        }));
                                    }}
                                    rows="4"
                                    placeholder="Enter each requirement on a new line"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="open">Open</option>
                                    <option value="closed">Closed</option>
                                    <option value="reviewing">Reviewing</option>
                                </select>
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
                                    job ? 'Update Job' : 'Create Job'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JobModal;
