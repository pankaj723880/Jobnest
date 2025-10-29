import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';
import './AdminApplications.css';

const API_BASE_URL = "http://localhost:5000/api/v1";

const AdminApplications = () => {
    const navigate = useNavigate();
    const { user, token, isLoggedIn } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [applicationToDelete, setApplicationToDelete] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const itemsPerPage = 10;

    useEffect(() => {
        if (!isLoggedIn || !user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
    }, [isLoggedIn, user, navigate]);

    const handleDelete = async (applicationId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'delete' })
            });

            if (response.ok) {
                setApplications(prevApplications => 
                    prevApplications.filter(app => app._id !== applicationId)
                );
                setShowDeleteConfirm(false);
                setApplicationToDelete(null);
            } else {
                setError('Failed to delete application');
            }
        } catch (err) {
            setError('Error deleting application');
            console.error('Error:', err);
        }
    };

    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                const { application } = await response.json();
                setApplications(prevApplications =>
                    prevApplications.map(app =>
                        app._id === applicationId ? { ...app, status: newStatus } : app
                    )
                );
            } else {
                setError('Failed to update application status');
            }
        } catch (err) {
            setError('Error updating application status');
            console.error('Error:', err);
        }
    };

    const fetchApplications = useCallback(async () => {
        if (!token || !isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            
            let url = `${API_BASE_URL}/admin/applications?page=${currentPage}&limit=${itemsPerPage}`;
            if (searchTerm) {
                url += `&search=${searchTerm}`;
            }
            const response = await fetch(url, { headers });
            const data = await response.json();
            if (response.ok) {
                let filteredApplications = data.applications || [];
                if (statusFilter !== 'all') {
                    filteredApplications = filteredApplications.filter(app => app.status === statusFilter);
                }
                setApplications(filteredApplications);
                setTotalPages(Math.ceil((data.count || 0) / itemsPerPage));
            } else {
                setError(data.msg || 'Failed to fetch applications');
            }
        } catch (err) {
            setError('Failed to fetch applications');
            console.error('Failed to fetch applications:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, token, isLoggedIn, navigate]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleApplicationAction = async (action, applicationId) => {
        try {
            if (!token || !isLoggedIn) {
                navigate('/login');
                throw new Error('You must be logged in to perform this action');
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            
            let response;
            let successMessage = '';

            switch (action) {
                case 'approve':
                    response = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify({ status: 'accepted' })
                    });
                    successMessage = 'Application approved successfully';
                    break;
                case 'reject':
                    response = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify({ status: 'rejected' })
                    });
                    successMessage = 'Application rejected successfully';
                    break;
                case 'delete':
                    response = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}`, {
                        method: 'DELETE',
                        headers
                    });
                    successMessage = 'Application deleted successfully';
                    break;
                default:
                    throw new Error(`Unknown action: ${action}`);
            }

            const data = await response.json();

            if (response.ok) {
                fetchApplications();
                setShowDeleteConfirm(false);
                setApplicationToDelete(null);
                alert(successMessage);
            } else {
                alert(data.msg || 'Action failed');
            }
        } catch (err) {
            console.error('Application action failed:', err);
            alert('Action failed. Please try again.');
        }
    };

    const handleDeleteClick = (application) => {
        setApplicationToDelete(application);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (applicationToDelete) {
            handleApplicationAction('delete', applicationToDelete._id);
        }
    };

    return (
        <div className="admin-dashboard">
            <AdminSidebar />
            <div className="admin-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">
                        <i className="bi bi-file-earmark-text me-2"></i>
                        Application Management
                    </h1>
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search applications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '250px' }}
                        />
                    </div>
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

                {!loading && !error && applications.length === 0 && (
                    <div className="text-center py-5">
                        <p className="text-muted">No applications found</p>
                    </div>
                )}

                {!loading && !error && applications.length > 0 && (
                    <div className="applications-management">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Applicant</th>
                                    <th>Applied Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map(app => (
                                    <tr key={app._id}>
                                        <td>
                                            <div>
                                                <div className="fw-semibold">{app.job?.title || 'N/A'}</div>
                                                <small className="text-muted">{app.job?.category || 'N/A'}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="avatar-circle bg-info text-white me-2">
                                                    {app.user?.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <div className="fw-semibold">{app.user?.name || 'N/A'}</div>
                                                    <small className="text-muted">{app.user?.email || 'N/A'}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${
                                                app.status === 'accepted' ? 'bg-success' : 
                                                app.status === 'rejected' ? 'bg-danger' : 
                                                'bg-warning'}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="btn-group" role="group">
                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    onClick={() => handleApplicationAction('approve', app._id)}
                                                    disabled={app.status === 'accepted'}
                                                >
                                                    <i className="bi bi-check-lg"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleApplicationAction('reject', app._id)}
                                                    disabled={app.status === 'rejected'}
                                                >
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => handleDeleteClick(app)}
                                                >
                                                    <i className="bi bi-trash"></i>
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

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Delete</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete this application?</p>
                                    <p className="text-danger">This action cannot be undone.</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                                        Delete Application
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminApplications;
