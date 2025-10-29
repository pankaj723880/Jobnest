import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import JobModal from '../components/JobModal';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const API_BASE_URL = "http://localhost:5000/api/v1";

const AdminJobs = () => {
    const navigate = useNavigate();
    const { user, token, isLoggedIn } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showJobModal, setShowJobModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const itemsPerPage = 10;

    useEffect(() => {
        if (!isLoggedIn || !user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
    }, [isLoggedIn, user, navigate]);

    const fetchJobs = useCallback(async () => {
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
            
            let url = `${API_BASE_URL}/admin/jobs?page=${currentPage}&limit=${itemsPerPage}`;
            if (searchTerm) {
                url += `&search=${searchTerm}`;
            }
            const response = await fetch(url, { headers });
            const data = await response.json();
            if (response.ok) {
                setJobs(data.jobs || []);
                setTotalPages(data.totalPages || 1);
            } else {
                setError(data.msg || 'Failed to fetch jobs');
            }
        } catch (err) {
            setError('Failed to fetch jobs');
            console.error('Failed to fetch jobs:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, token, isLoggedIn, navigate]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleJobAction = async (action, jobId, jobData = null) => {
        try {
            setModalLoading(true);
            setError(null);
            
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
                case 'create':
                    console.log('Creating job with data:', jobData);  // Debug log
                    response = await fetch(`${API_BASE_URL}/admin/jobs`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ ...jobData, employer: user.userId })
                    });
                    successMessage = 'Job created successfully';
                    break;
                case 'update':
                    response = await fetch(`${API_BASE_URL}/admin/jobs/${jobId}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify(jobData)
                    });
                    successMessage = 'Job updated successfully';
                    break;
                case 'delete':
                    response = await fetch(`${API_BASE_URL}/admin/jobs/${jobId}`, {
                        method: 'DELETE',
                        headers
                    });
                    successMessage = 'Job deleted successfully';
                    break;
                default:
                    throw new Error(`Unknown action: ${action}`);
            }

            const data = await response.json();

            if (response.ok) {
                fetchJobs();
                setShowJobModal(false);
                setSelectedJob(null);
                setShowDeleteConfirm(false);
                setJobToDelete(null);
                alert(successMessage);
            } else {
                alert(data.msg || 'Action failed');
            }
        } catch (err) {
            console.error('Job action failed:', err);
            alert('Action failed. Please try again.');
        } finally {
            setModalLoading(false);
        }
    };

    const handleSaveJob = (jobData) => {
        if (selectedJob) {
            handleJobAction('update', selectedJob._id, jobData);
        } else {
            handleJobAction('create', null, jobData);
        }
    };

    const handleDeleteClick = (job) => {
        setJobToDelete(job);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (jobToDelete) {
            handleJobAction('delete', jobToDelete._id);
        }
    };

    return (
        <div className="admin-dashboard">
            <AdminSidebar />
            <div className="admin-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">
                        <i className="bi bi-briefcase me-2"></i>
                        Content Management
                    </h1>
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '250px' }}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setSelectedJob(null);
                                setShowJobModal(true);
                            }}
                        >
                            <i className="bi bi-plus-lg me-1"></i>
                            Add Job
                        </button>
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

                {!loading && !error && (
                    <div className="jobs-management">
                        <h2>Job Management</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Employer</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map(job => (
                                    <tr key={job._id}>
                                        <td>
                                            <div>
                                                <div className="fw-semibold">{job.title}</div>
                                                <small className="text-muted">{job.city}, {job.pincode}</small>
                                            </div>
                                        </td>
                                        <td>{job.employer?.name || 'N/A'}</td>
                                        <td>
                                            <span className="badge bg-secondary">{job.category}</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${job.status === 'open' ? 'bg-success' : 'bg-secondary'}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="btn-group" role="group">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => {
                                                        setSelectedJob(job);
                                                        setShowJobModal(true);
                                                    }}
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteClick(job)}
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

                {/* Job Modal */}
                <JobModal
                    isOpen={showJobModal}
                    onClose={() => {
                        setShowJobModal(false);
                        setSelectedJob(null);
                    }}
                    job={selectedJob}
                    onSave={handleSaveJob}
                    loading={modalLoading}
                />

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
                                    <p>Are you sure you want to delete job <strong>{jobToDelete?.title}</strong>?</p>
                                    <p className="text-danger">This action cannot be undone.</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={modalLoading}>
                                        {modalLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete Job'
                                        )}
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

export default AdminJobs;
