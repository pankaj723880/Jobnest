import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployerSidebar from '../components/EmployerSidebar';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const API_BASE_URL = "http://localhost:5000/api/v1";

const EmployerSubmissions = () => {
    const navigate = useNavigate();
    const { user, token, isLoggedIn } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedCards, setExpandedCards] = useState(new Set());
    const itemsPerPage = 10;

    useEffect(() => {
        if (!isLoggedIn || !user || user.role !== 'employer') {
            navigate('/login');
            return;
        }
    }, [isLoggedIn, user, navigate]);



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

            let url = `${API_BASE_URL}/applications/employer?page=${currentPage}&limit=${itemsPerPage}`;
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
    }, [currentPage, searchTerm, statusFilter, token, isLoggedIn, navigate]);

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
                case 'accept':
                    response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify({ status: 'accepted' })
                    });
                    successMessage = 'Application accepted successfully';
                    break;
                case 'reject':
                    response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify({ status: 'rejected' })
                    });
                    successMessage = 'Application rejected successfully';
                    break;
                case 'review':
                    response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify({ status: 'reviewed' })
                    });
                    successMessage = 'Application marked as reviewed';
                    break;
                default:
                    throw new Error(`Unknown action: ${action}`);
            }

            const data = await response.json();

            if (response.ok) {
                fetchApplications();
                alert(successMessage);
            } else {
                alert(data.msg || 'Action failed');
            }
        } catch (err) {
            console.error('Application action failed:', err);
            alert('Action failed. Please try again.');
        }
    };

    const toggleCardExpansion = (applicationId) => {
        const newExpanded = new Set(expandedCards);
        if (newExpanded.has(applicationId)) {
            newExpanded.delete(applicationId);
        } else {
            newExpanded.add(applicationId);
        }
        setExpandedCards(newExpanded);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'accepted': return 'bg-success';
            case 'rejected': return 'bg-danger';
            case 'reviewed': return 'bg-warning';
            default: return 'bg-secondary';
        }
    };

    return (
        <div className="admin-dashboard">
            <EmployerSidebar userId={user?._id} />
            <div className="admin-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">
                        <i className="bi bi-file-earmark-text me-2"></i>
                        Job Submissions Review
                    </h1>
                    <div className="d-flex gap-2">
                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ width: '150px' }}
                        >
                            <option value="all">All Status</option>
                            <option value="applied">Applied</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
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
                    <div className="applications-review">
                        {applications.map(app => (
                            <div key={app._id} className="card mb-3 shadow-sm">
                                <div className="card-header bg-light">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            {app.user?.profilePhoto ? (
                                                <img
                                                    src={`http://localhost:5000/uploads/${app.user.profilePhoto}`}
                                                    alt="Profile"
                                                    className="rounded-circle me-3"
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div className="avatar-circle bg-info text-white me-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', borderRadius: '50%' }}>
                                                    {app.user?.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                            )}
                                            <div>
                                                <h5 className="mb-0">{app.user?.name || 'N/A'}</h5>
                                                <small className="text-muted">{app.user?.email || 'N/A'}</small>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <span className={`badge ${getStatusBadgeClass(app.status)} mb-2`}>
                                                {app.status}
                                            </span>
                                            <br />
                                            <small className="text-muted">
                                                Applied: {new Date(app.appliedDate).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <h6 className="card-title">{app.job?.title || 'N/A'}</h6>
                                            <p className="card-text text-muted mb-2">
                                                <i className="bi bi-geo-alt me-1"></i>
                                                {app.job?.city || 'N/A'}, {app.job?.pincode || 'N/A'} •
                                                <i className="bi bi-tag ms-2 me-1"></i>
                                                {app.job?.category || 'N/A'} •
                                                <i className="bi bi-currency-dollar ms-2 me-1"></i>
                                                ₹{app.job?.salary || 'N/A'}
                                            </p>

                                            {app.coverLetter && (
                                                <div className="mb-3">
                                                    <h6><i className="bi bi-chat-quote me-2"></i>Cover Letter</h6>
                                                    <p className="text-muted">{app.coverLetter}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex flex-column gap-2">
                                                <button
                                                    className="btn btn-outline-success btn-sm"
                                                    onClick={() => handleApplicationAction('accept', app._id)}
                                                    disabled={app.status === 'accepted'}
                                                >
                                                    <i className="bi bi-check-lg me-1"></i>Accept
                                                </button>
                                                <button
                                                    className="btn btn-outline-warning btn-sm"
                                                    onClick={() => handleApplicationAction('review', app._id)}
                                                    disabled={app.status === 'reviewed' || app.status === 'accepted' || app.status === 'rejected'}
                                                >
                                                    <i className="bi bi-eye me-1"></i>Mark Reviewed
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleApplicationAction('reject', app._id)}
                                                    disabled={app.status === 'rejected'}
                                                >
                                                    <i className="bi bi-x-lg me-1"></i>Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="btn btn-link p-0 mt-3"
                                        onClick={() => toggleCardExpansion(app._id)}
                                    >
                                        <i className={`bi ${expandedCards.has(app._id) ? 'bi-chevron-up' : 'bi-chevron-down'} me-1`}></i>
                                        {expandedCards.has(app._id) ? 'Show Less' : 'View Full Details'}
                                    </button>

                                    {expandedCards.has(app._id) && (
                                        <div className="mt-3 pt-3 border-top">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h6>Applicant Details</h6>
                                                    <ul className="list-unstyled">
                                                        <li><strong>Name:</strong> {app.user?.name || 'N/A'}</li>
                                                        <li><strong>Email:</strong> {app.user?.email || 'N/A'}</li>
                                                        <li><strong>Phone:</strong> {app.user?.contactPhone || 'N/A'}</li>
                                                        <li><strong>Location:</strong> {app.user?.city || 'N/A'}, {app.user?.pincode || 'N/A'}</li>
                                                        {app.user?.skills && app.user.skills.length > 0 && (
                                                            <li><strong>Skills:</strong> {app.user.skills.join(', ')}</li>
                                                        )}
                                                    </ul>
                                                </div>
                                                <div className="col-md-6">
                                                    <h6>Documents</h6>
                                                    <div className="d-flex flex-column gap-2">
                                                        {app.user?.resume && (
                                                            <a
                                                                href={`http://localhost:5000/uploads/${app.user.resume}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-outline-primary btn-sm"
                                                            >
                                                                <i className="bi bi-file-earmark-pdf me-1"></i>View Resume
                                                            </a>
                                                        )}
                                                        {app.user?.profilePhoto && (
                                                            <a
                                                                href={`http://localhost:5000/uploads/${app.user.profilePhoto}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-outline-secondary btn-sm"
                                                            >
                                                                <i className="bi bi-image me-1"></i>View Profile Photo
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

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
            </div>
        </div>
    );
};

export default EmployerSubmissions;
