import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmployerSidebar from '../components/EmployerSidebar';

const EmployerJobs = () => {
    const { user, authFetch } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const itemsPerPage = 10;

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError('');

            let endpoint = `jobs/employer?page=${currentPage}&limit=${itemsPerPage}`;
            if (searchTerm) {
                endpoint += `&search=${encodeURIComponent(searchTerm)}`;
            }
            if (statusFilter !== 'all') {
                endpoint += `&status=${statusFilter}`;
            }

            const response = await authFetch(endpoint);
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
    };

    useEffect(() => {
        fetchJobs();
    }, [currentPage, searchTerm, statusFilter]);

    const handleStatusChange = async (jobId, newStatus) => {
        try {
            const response = await authFetch(`jobs/${jobId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                // Update the job status in the local state
                setJobs(jobs.map(job =>
                    job._id === jobId ? { ...job, status: newStatus } : job
                ));
            } else {
                const data = await response.json();
                setError(data.msg || 'Failed to update job status');
            }
        } catch (err) {
            setError('Failed to update job status');
            console.error('Failed to update job status:', err);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await authFetch(`jobs/${jobId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Remove the job from the local state
                setJobs(jobs.filter(job => job._id !== jobId));
            } else {
                const data = await response.json();
                setError(data.msg || 'Failed to delete job');
            }
        } catch (err) {
            setError('Failed to delete job');
            console.error('Failed to delete job:', err);
        }
    };

    const indigoColor = '#4f46e5';

    return (
        <div className="container-fluid d-flex p-0">
            <EmployerSidebar userId={user?._id || 'Loading...'} />

            <div className="flex-grow-1 p-4 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="fw-bold text-dark mb-0">My Jobs</h1>
                    <Link to="/employer/post-job" className="btn text-white rounded-pill px-4 fw-semibold shadow-sm"
                          style={{ backgroundColor: indigoColor, borderColor: indigoColor }}>
                        <i className="bi bi-plus-circle me-2"></i> Post New Job
                    </Link>
                </div>

                {/* Filters and Search */}
                <div className="card p-4 mb-4 shadow-sm border-0 rounded-4">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                    setCurrentPage(1);
                                }}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                    </div>
                )}

                {/* Jobs List */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="row">
                            {jobs.map((job) => (
                                <div key={job._id} className="col-12 mb-3">
                                    <div className="card shadow-sm border-0 rounded-4">
                                        <div className="card-body p-4">
                                            <div className="row align-items-center">
                                                <div className="col-md-6">
                                                    <h5 className="card-title fw-bold mb-2">{job.title}</h5>
                                                    <p className="card-text text-muted mb-2">{job.category} • {job.city}</p>
                                                    <small className="text-muted">
                                                        Posted {new Date(job.createdAt).toLocaleDateString()}
                                                    </small>
                                                </div>
                                                <div className="col-md-2">
                                                    <span className={`badge ${job.status === 'open' ? 'bg-success' : job.status === 'closed' ? 'bg-secondary' : 'bg-warning text-dark'} rounded-pill px-3 py-2`}>
                                                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                                    </span>
                                                </div>
                                                <div className="col-md-2 text-center">
                                                    <div className="fw-bold text-primary">{job.applicationCount || 0}</div>
                                                    <small className="text-muted">Applications</small>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="btn-group w-100">
                                                        {job.status === 'open' && (
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => handleStatusChange(job._id, 'closed')}
                                                            >
                                                                Close
                                                            </button>
                                                        )}
                                                        {job.status === 'closed' && (
                                                            <button
                                                                className="btn btn-outline-success btn-sm"
                                                                onClick={() => handleStatusChange(job._id, 'open')}
                                                            >
                                                                Reopen
                                                            </button>
                                                        )}
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleDeleteJob(job._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav aria-label="Job pagination" className="mt-4">
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </button>
                                    </li>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}

                        {jobs.length === 0 && !loading && (
                            <div className="text-center py-5">
                                <i className="bi bi-briefcase display-1 text-muted mb-3"></i>
                                <h4 className="text-muted">No jobs found</h4>
                                <p className="text-muted">You haven't posted any jobs yet.</p>
                                <Link to="/employer/post-job" className="btn btn-primary rounded-pill px-4">
                                    <i className="bi bi-plus-circle me-2"></i> Post Your First Job
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EmployerJobs;
